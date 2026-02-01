# GCP Professional Cloud Architect - Study Notes

Below are the three deliverables you asked for (services table, tradeoffs table, and the 4 case studies with requirements + current infra pulled from the official case-study PDFs, plus the proposed technical solution bullets from your course slides). Case studies are ~25% of the PCA exam questions.

---

## 1) Table of Services (service, description, use-case, facts)

### Compute / Containers / Serverless

| Service | Description | Use-case | Facts (incl. AWS mapping / exam traps) |
|---------|-------------|----------|----------------------------------------|
| Compute Engine (GCE) | VMs (IaaS) | Lift & shift, custom OS, legacy apps | ≈ EC2. Pair with MIG + LB for HA. |
| Managed Instance Groups (MIG) | Autoscaled, autohealed VM fleet from a template | Stateless web/app tier on VMs | Autoscaling signals include CPU, LB capacity, Monitoring metrics, queue-based, schedules. |
| Instance Template | Immutable "launch config" for MIG | Standardize VM boot, images, metadata | Like EC2 Launch Template. You can't "edit" an existing template—make a new one (common exam gotcha). |
| GKE | Managed Kubernetes | Microservices, platform teams | ≈ EKS. If you see "multiple clusters / environments", Anthos/Service Mesh often shows up (case studies). |
| GKE Autopilot | "More managed" GKE mode | Reduce ops overhead for K8s | You trade some node-level control for less management. |
| Cloud Run | Serverless containers | HTTP APIs, webhooks, background processors (with jobs) | ≈ ECS Fargate / App Runner. "Deploy a web app without local installs" → often Cloud Run. |
| Cloud Run functions | Event-driven functions | Bucket/object events, Pub/Sub triggers | ≈ Lambda. (In exam, pick event-driven + minimal ops.) |
| App Engine Standard | PaaS for web apps (sandboxed runtimes) | Classic web apps, rapid deploy, auto-scale to zero | ≈ Elastic Beanstalk. Fast startup, scales to zero, free tier available. Language-specific runtimes (Python, Java, Go, Node.js, PHP, Ruby). Limited to supported runtimes. |
| App Engine Flexible | PaaS with custom runtimes (runs on GCE) | Need custom runtime, background workers, SSH access | Uses Docker containers on GCE VMs. No free tier, slower scaling, more expensive. SSH access allowed. Supports any language/runtime. |
| Cloud Scheduler | Managed cron | Trigger jobs/functions on schedule | ≈ EventBridge Scheduler / cron + Lambda. |

**App Engine: Standard vs Flexible**

| Feature | Standard | Flexible |
|---------|----------|----------|
| Instance startup | Milliseconds | Minutes |
| Scaling | Scales to zero | Min 1 instance |
| Pricing | Instance hours | vCPU/memory/disk |
| SSH access | No | Yes |
| Runtimes | Specific versions only | Any runtime/Docker |
| Background threads | Limited | Supported |
| Use case | Web apps, rapid scale | Custom dependencies, SSH needed |

### Networking / Edge

| Service | Description | Use-case | Facts |
|---------|-------------|----------|-------|
| VPC | Private network | Network segmentation, routing | Unlike AWS, subnets are regional in GCP (typical exam point). |
| Cloud Load Balancing | Google's L4/L7 load balancers | Global/regional traffic distribution | Many flavors exist (global vs regional, internal vs external). |
| External HTTP(S) LB | Global L7 | Global web apps | "Global + Anycast IP + URL maps" show up a lot. |
| Cloud CDN | Edge caching | Reduce latency, offload origin | Often paired with HTTP(S) LB. |
| Cloud Armor | WAF / DDoS protection | Protect web apps and APIs | ≈ AWS WAF + Shield. |
| Cloud DNS | Managed DNS | Public/private zones | ≈ Route 53. |
| Cloud NAT | Outbound NAT for private resources | Private instances needing outbound | ≈ NAT Gateway. |
| Cloud VPN | IPsec VPN | Hybrid connectivity (quick/cheap) | ≈ Site-to-Site VPN. Classic VPN (deprecated) vs HA VPN (99.99% SLA, regional, 2 interfaces). Can work with Cloud Router for dynamic routing. |
| Cloud Interconnect (Dedicated/Partner) | Private high-throughput connectivity | Hybrid connectivity (prod-grade) | ≈ Direct Connect. |
| Private Service Connect (PSC) | Private access to services across VPCs/orgs | Private consumption of Google/APIs/producer services | Often used when "avoid public IPs / private access" is a requirement. |
| Network Connectivity Center | Hub/spoke connectivity orchestration | Many sites/VPCs connectivity | Called out for connecting plants + HQ in KnightMotives proposal. |

**Cloud VPN & VPC Combinations**

| Scenario | Configuration | Notes |
|----------|---------------|-------|
| Single VPN to on-prem | HA VPN + Cloud Router + BGP | 99.99% SLA with 2 tunnels, dynamic routing |
| Multiple VPCs connected | VPC Peering or Shared VPC | Peering for separate orgs, Shared VPC within org |
| VPN + VPC Peering | VPN to one VPC, peer to others | Transitive routing NOT automatic (use Cloud Router) |
| Hub-and-spoke VPNs | Network Connectivity Center | Centralized management for multiple sites |

### Storage / Databases

| Service | Description | Use-case | Facts |
|---------|-------------|----------|-------|
| Cloud Storage | Object storage | Media, data lake, static assets | ≈ S3. Avoid sequential object keys; prefer random/hash prefixes for scale. |
| Persistent Disk | Block storage for VMs | VM boot/data disks | ≈ EBS. |
| Filestore | Managed NFS | Shared POSIX filesystem | ≈ EFS (conceptually). |
| Cloud SQL | Managed MySQL/Postgres/SQL Server | "Simple" relational workloads | Read replicas don't increase availability; HA is separate. |
| Cloud SQL (HA) | Regional primary + standby | Zonal-failure resilience | Heartbeat unavailable ~60s → failover; <3 min unavailability; same IP. |
| Cloud Spanner | Globally distributed relational DB | Global scale + strong consistency | Horizontal scaling reads+writes, very high availability (99.999%). |
| Firestore / Datastore | Serverless document DB | Web/mobile apps, flexible schema | "Firestore = Datastore++", multi-device/offline sync use-cases. |
| Bigtable | Wide-column NoSQL (HBase API) | IoT/time-series, huge throughput/low latency | "Millions TPS, low latency", single-row transactions; not serverless (cluster/nodes). |
| BigQuery | Serverless data warehouse (OLAP) | Analytics at TB–PB | Cost/perf driven by data scanned; partition+cluster to reduce cost. |
| Memorystore | Managed Redis/Memcached | Caching, sessions | ≈ ElastiCache. |

**Cloud Storage Classes & Lifecycle**

| Storage Class | Use Case | Min Storage Duration | Retrieval Cost | Typical Scenario |
|--------------|----------|---------------------|----------------|------------------|
| Standard | Hot data, frequent access | None | None | Active website content, analytics |
| Nearline | Accessed <1/month | 30 days | Yes (low) | Backups, multimedia content |
| Coldline | Accessed <1/quarter | 90 days | Yes (medium) | Disaster recovery, archival |
| Archive | Accessed <1/year | 365 days | Yes (high) | Long-term archival, compliance |

**Storage Lifecycle Policies**
- Automatically transition objects between classes based on age or conditions
- Delete objects after specified time
- Common pattern: Standard → Nearline (30d) → Coldline (90d) → Archive (365d) → Delete (7y)
- Exam tip: Choose based on access frequency + retention requirements

**Access Control Lists (ACLs)**

| Method | Scope | Use Case | Exam Tips |
|--------|-------|----------|-----------|
| IAM | Project/bucket level | Uniform permissions, recommended | Use for uniform bucket-level access |
| ACLs | Object level | Fine-grained per-object control | Legacy, use when need per-object permissions |
| Signed URLs | Temporary access | Time-limited sharing | Good for temporary external access |
| Signed Policy Documents | Upload control | Control upload conditions | Restrict upload parameters |

**ACL Best Practices:**
- IAM is preferred (uniform bucket-level access)
- Disable ACLs with "Uniform bucket-level access" for better security
- Use ACLs only when you need different permissions per object
- Exam scenario: "Different users need different object access" → ACLs; "Bucket-wide access" → IAM

### Data / Integration / Observability / Security

| Service | Description | Use-case | Facts |
|---------|-------------|----------|-------|
| Pub/Sub | Messaging/event bus | Event-driven systems, ingestion | ≈ SNS+SQS-ish (conceptually). |
| Dataflow | Managed Apache Beam | Streaming + batch ETL | Pub/Sub → Dataflow → BigQuery is a classic pattern (appears in proposals). |
| Dataproc | Managed Spark/Hadoop | "Keep using Spark" migrations | ≈ EMR. Cluster-based, ephemeral clusters recommended for cost. Can use preemptible workers. Integration with GCS for data storage. |
| Cloud Composer | Managed Airflow | Workflow orchestration | ≈ MWAA. |
| Storage Transfer Service | Data transfer into GCS | Migrate/ingest from other clouds/on-prem | Mentioned for Altostrat archival migration in proposed solution. |
| Cloud Operations Suite | Logging/Monitoring/Trace/etc. | Observability | "Cloud Monitoring + alerting integrations" show up in questions. |
| IAM | AuthZ for Google Cloud resources | Least privilege for staff/services | Don't use basic Owner/Editor/Viewer broadly (exam). |
| Identity Platform | CIAM (end-user auth) | Customer logins, social login | IAM vs Identity Platform scenarios are explicitly contrasted. |
| Security Command Center | Security posture/vuln findings | Central security view | Picked in KnightMotives diagnostic Q for centralized vuln/policy visibility. |
| Sensitive Data Protection (DLP) | Discover/classify/mask sensitive data | HIPAA/PII workloads | Called out in EHR proposed solution notes. |
| VPC Service Controls | Service perimeters | Reduce data exfiltration risk | Often appears with "protect sensitive APIs / data exfiltration." |

**Dataproc Best Practices**

| Aspect | Best Practice | Exam Tip |
|--------|---------------|----------|
| Cluster lifecycle | Use ephemeral (job-specific) clusters | More cost-effective than long-running |
| Workers | Use preemptible VMs for workers | 80% cost savings, exam loves this |
| Storage | Store data in GCS, not HDFS | Decouples storage from compute |
| Use case | "Already using Spark/Hadoop" | Keep existing code, lift-and-shift |
| vs Dataflow | Batch processing with existing Spark jobs | Dataflow for streaming + new pipelines |

---

## 2) Tradeoffs Table (the ones PCA loves)

### A) "Where should I run this workload?"

| Choice | Pick when | You give up | Quick AWS mapping |
|--------|-----------|-------------|-------------------|
| Cloud Run | Containerized HTTP app; spiky traffic; minimal ops; fast deploy | Less low-level control (no nodes), some platform constraints | App Runner / Fargate-ish |
| GKE (Standard) | Need K8s control (DaemonSets, custom networking, multi-service platform) | More cluster ops (unless Autopilot) | EKS |
| GKE Autopilot | Want Kubernetes but less ops overhead | Some constraints vs Standard | EKS + "more managed" |
| GCE + MIG | Need VMs (custom OS, agents, special networking) but still want autoscale/HA | OS patching, config mgmt responsibility | EC2 + ASG |
| App Engine Standard | Simple web app with opinionated runtime; auto-scale to zero | Runtime constraints | Elastic Beanstalk-ish |
| App Engine Flexible | Need custom runtime/Docker but still want PaaS | Higher cost, slower scaling, no scale-to-zero | Elastic Beanstalk with Docker |

### B) Databases: relational vs NoSQL vs analytics

| Decision | Better option | When it wins | Key tradeoff / exam trap |
|----------|---------------|--------------|--------------------------|
| "Simple regional relational DB" | Cloud SQL | MySQL/Postgres/SQL Server with managed ops | Can't scale writes horizontally; replicas are for reads and don't increase availability. |
| "Global relational + massive scale" | Spanner | Need horizontal scaling reads+writes + global strong consistency | Higher cost; node-based; but very high availability (99.999%). |
| "Serverless doc DB for web/mobile" | Firestore | Flexible schema + multi-device access | Not for ad-hoc OLAP; design queries/indexes carefully. |
| "Time-series/IoT high TPS low latency" | Bigtable | Huge throughput, low latency | Not serverless; typically single-row transactions; schema/row-key design matters. |
| "Ad-hoc analytics at scale" | BigQuery | OLAP queries, BI, warehouse | Costs depend on scanned data; partition/cluster to optimize. |

**Extra exam bias:** managed DBs are usually preferred unless you have a strong reason to self-manage.

### C) Load balancing decisions (common trick area)

| Need | Pick | Why |
|------|------|-----|
| Global L7 web/app | External HTTP(S) LB | Global + Anycast + URL maps. |
| Internal app-to-app L7 | Internal HTTP(S) LB | Private L7 within VPC |
| L4 passthrough TCP/UDP | Network LB (regional) | Regional passthrough for non-HTTP(S) traffic |

### D) Identity: workforce vs customers

| You are authenticating… | Use | Why |
|-------------------------|-----|-----|
| Employees/services accessing Google Cloud resources | IAM | Resource authorization model (roles/policies/service accounts). |
| End-users of your app (signup/login, social providers) | Identity Platform | CIAM features like sign-up/sign-in, MFA, social login. |

---

## Deployment Strategies

### Types of Migration

| Strategy | Description | When to Use | Exam Scenario |
|----------|-------------|-------------|---------------|
| Lift and Shift | Move as-is to cloud (rehost) | Quick migration, minimal changes, legacy apps | "Move quickly with minimal changes" |
| Improve and Move | Modernize during migration (replatform) | Optimize for cloud, update architecture | "Migrate and improve performance/cost" |
| Rip and Replace | Rebuild from scratch (refactor/rewrite) | Legacy tech debt, need cloud-native | "Legacy system, start fresh with modern stack" |

### Deployment Patterns

| Pattern | Description | Use Case | Risk Level | Rollback |
|---------|-------------|----------|------------|----------|
| Rolling | Gradually replace instances | Standard updates, minimal resources | Medium | Manual |
| Blue/Green | Two identical envs, switch traffic | Zero-downtime, instant rollback | Low | Instant (switch back) |
| Canary | Small % of traffic to new version first | Test in production, gradual validation | Low | Easy (route back) |
| Red/Black | Similar to Blue/Green (GCP terminology) | Alias for Blue/Green deployment | Low | Instant |

**Deployment Strategy Selection:**

| Requirement | Choose | Why |
|-------------|--------|-----|
| Zero downtime mandatory | Blue/Green or Canary | Instant switchback capability |
| Test with real traffic first | Canary | Gradual exposure, monitor metrics |
| Limited resources | Rolling | No duplicate environment needed |
| Instant rollback needed | Blue/Green | Just switch load balancer |
| A/B testing | Canary with traffic splitting | Control traffic percentage |

**GCP Implementation:**

- **Cloud Run**: Built-in traffic splitting for Canary/Blue-Green
- **GKE**: Use Deployments with different labels + Service traffic splitting
- **Compute Engine MIG**: Rolling updates, canary updates with multiple instance groups
- **App Engine**: Traffic splitting across versions (canary pattern)

---

## 3) Case Studies — requirements + current infra (official PDFs) + proposed solution (your slides)

### Altostrat Media

| Requirements | Current infra | "Slide" proposed solution anchors |
|--------------|---------------|----------------------------------|
| Business: optimize storage cost w/ high availability; natural language interaction + 24/7 support; summarization; metadata extraction; detect inappropriate content; better ops reliability. | GKE for content mgmt/delivery; Cloud Storage for media; BigQuery as warehouse; Cloud Run for event-driven tasks (transcoding/metadata/recommendations); some on‑prem ingestion/archival; Monitoring + Prometheus/email alerts. | Keep GKE + Cloud Run; add centralized management for hybrid (Istio/Anthos/Service Mesh/Fleets); Cloud Storage lifecycle + Storage Transfer; Pub/Sub + Dataflow → BigQuery; Vertex AI + prebuilt APIs for enrichment; improve alerting/ops. |

**Key Exam Questions & Patterns:**

**Video Transcoding & Processing:**
- **Requirement**: Modernize video transcoding from expensive on-premises hardware
- **Solution**: Cloud Run jobs with GPU acceleration, triggered by Pub/Sub
- **Why**: Serverless (scale to zero), handles millions of independent jobs, supports GPU, minimal ops overhead
- **Wrong choices**: GKE Standard (too much ops), Cloud Functions (not for long-running/GPU tasks), Dataflow (overkill for file processing)

**Global Content Delivery:**
- **Requirement**: Low latency for petabyte-scale video library in emerging markets with high availability
- **Solution**: Multi-Regional Cloud Storage + Cloud CDN
- **Why**: Multi-regional provides geo-redundancy and DR; CDN caches at edge for low latency
- **Wrong choices**: Single-region bucket (no DR), Cloud SQL (not for object storage), Custom VMs (high ops overhead)

**Hybrid Cloud Management:**
- **Requirement**: Manage containerized apps across GKE and AWS EKS with unified policies
- **Solution**: Anthos for multi-cloud Kubernetes management
- **Why**: Single pane of glass, consistent security policies, works across GCP/on-prem/AWS
- **Wrong choices**: VPC Peering (only network connectivity), Terraform (no centralized management), Cloud Run (cloud-only)

**AI/ML Model Performance:**
- **Issue**: Recommendation engine accuracy dropped despite no code changes
- **Root cause**: Data drift (user behavior changed over time)
- **Solution**: Vertex AI Model Monitoring to detect drift and trigger retraining
- **Related concepts**: Training-serving skew (difference between training/production data)
- **Wrong choices**: Bigtable hot-spotting (performance issue, not accuracy), Model Garden version (not the cause)

**GenAI Capabilities:**
- **Requirement**: Centralized discovery and deployment of foundation models (Gemini) and open-source models
- **Solution**: Vertex AI Model Garden
- **Why**: Central repository for pre-trained models, no infrastructure management
- **Wrong choices**: AutoML Tables (for structured data only), Bigtable (database, not AI platform), Vertex AI Pipelines (for orchestration, not discovery)

### Cymbal Retail

| Requirements | Current infra | "Slide" proposed solution anchors |
|--------------|---------------|----------------------------------|
| Business: automate catalog enrichment; improve discoverability; reduce call center + hosting costs. Tech: attribute + image generation; natural-language product discovery; scalability; HITL review UI; security/compliance. | Mix of on‑prem + cloud; DBs: MySQL, SQL Server, Redis, MongoDB; Kubernetes clusters; SFTP/ETL batch integrations; custom web app queries relational DB for browsing; IVR + manual agent ordering; OSS monitoring (Grafana/Nagios/Elastic). | Vertex AI (Gemini) for attributes/descriptions; Imagen for image creation; Vertex AI Search for Commerce; Dialogflow CX / conversational commerce; migrate K8s → GKE Autopilot or Cloud Run; migrate MySQL/SQL Server → Cloud SQL; use BigQuery to break silos; Composer/Data Fusion for orchestration; Apigee for integrations; upgrade monitoring/security (Logging/Monitoring, KMS, VPC‑SC). |

**Key Exam Questions & Patterns:**

**Drone Delivery Telemetry Pipeline:**
- **Requirement**: Handle millions of continuous messages, serverless stream processing, petabyte-scale SQL analytics
- **Solution**: Pub/Sub (ingestion) → Dataflow (processing) → BigQuery (analytics)
- **Why**: Pub/Sub buffers high-throughput streams; Dataflow is serverless for transformations; BigQuery for SQL analytics
- **Wrong choices**: Cloud Functions (not for continuous streams), Bigtable (not for ad-hoc SQL), Compute Engine VMs (not serverless)

**Application Modernization (Hybrid Cloud):**
- **Requirement**: Unified platform for microservices on GCP and on-premises with consistent deployment
- **Solution**: Anthos for hybrid container management
- **Why**: Provides single control plane across GCP, on-prem, and other clouds
- **Wrong choices**: Cloud Deploy (CD tool, not platform), GKE Autopilot (GCP-only), Cloud Run (primarily cloud-only)

**Multi-Cloud Kubernetes Management:**
- **Requirement**: Manage GKE, on-premises, and EKS clusters with consistent policies
- **Solution**: Anthos
- **Why**: Manages Kubernetes across GCP, on-prem, AWS with unified security/policies
- **Wrong choices**: Migrate all to GKE (not hybrid), Model Garden (for AI models), Bigtable replication (database, not cluster management)

**ML Model Performance Degradation:**
- **Issue**: Churn prediction model accuracy dropped after a month in production
- **Root causes to investigate**: Training-serving skew + Data drift
- **Training-serving skew**: Difference between training and production data handling
- **Data drift**: Customer behavior changed over time (new competitor, seasonal changes)
- **Wrong choices**: Model Garden version mismatch (not a drift issue), Bigtable hot-spotting (performance, not accuracy)

**Monolith to Microservices Integration:**
- **Requirement**: Integrate legacy monolith with new serverless microservices, consistent interface
- **Solutions**: 
  1. HTTP(S) Load Balancer + Serverless NEGs (Network Endpoint Groups)
  2. Cloud Endpoints/Apigee for API management
- **Why**: NEGs allow seamless integration via URL maps; API management creates unified facade
- **Wrong choices**: Develop proxy inside monolith (service interruptions, technical debt), App Engine Flexible (can't integrate monolith)

----

### EHR Healthcare

| Requirements | Current infra | "Slide" proposed solution anchors |
|--------------|---------------|----------------------------------|
| Business: scale fast; | Hosted in multiple colocation DCs; | Emphasize HIPAA + data protection (DLP/SDP, KMS/CMEK, org policy, audit); | 
99.9% availability; |apps web-based, many containerized across Kubernetes clusters; | GKE (+ Anthos/Service Mesh) for multi-env mgmt; |
centralized visibility; | DBs: MySQL, SQL Server, Redis, MongoDB;  | migrate MySQL/SQL Server → Cloud SQL; |
reduce latency;  | legacy file/API integrations remain on‑prem for years; |  Redis → Memorystore; |
regulatory compliance; | Microsoft AD; OSS monitoring; email alerts ignored. | MongoDB → Firestore (or MongoDB on GKE interim); | 
lower admin cost; | | Apigee for integration; |
insights + predictions.  | | improve logging/monitoring + post-mortems. |
Tech: keep legacy insurer interfaces; | | |
consistent container mgmt;  | | |
secure high-performance on‑prem ↔ GCP connectivity; | | |
consistent logging/retention/monitoring/alerting; | | |
ingest new provider data. |     |    |

**Key Exam Questions & Patterns:**

**Gated Egress & API Security:**
- **Requirement**: Expose on-prem legacy APIs to GCP apps privately (not Internet-accessible)
- **Solution**: Gated Egress topology + VPC Service Controls
- **Why**: Apps in GCP access on-prem APIs via private IPs; VPC-SC prevents data exfiltration
- **Gated Egress**: APIs available only to GCP processes, exposed via Application LB with private IPs
- **VPC Service Controls**: Isolate services, monitor data theft, restrict access
- **Wrong choices**: Cloud Endpoints (doesn't support on-prem endpoints), Cloud VPN alone (just connectivity), Cloud Composer (workflow service)

**HIPAA Compliance:**
- **Requirements**: Process Protected Health Information (PHI) in compliance with HIPAA
- **Critical steps**:
  1. Execute Business Associate Agreement (BAA) with Google Cloud
  2. Verify all services used are HIPAA-compliant (Covered Products)
- **Why BAA**: Required under HIPAA when cloud provider handles PHI
- **Why Covered Products**: Not all GCP services are HIPAA-compliant; must verify each one
- **Wrong choices**: Cloud EKM (not a primary compliance requirement), VPC-SC (security tool, not compliance prerequisite), Firebase Auth (case uses Microsoft AD)

**High-Performance Hybrid Connectivity:**
- **Requirement**: Production-grade connection to on-prem for 99.9% availability
- **Solution**: 4 Dedicated Interconnect connections (2 in Metro A, 2 in Metro B)
- **Why**: Google's recommended practice for 99.99% (exceeds 99.9%); prevents single point of failure
- **Wrong choices**: 
  - Cloud VPN (limited throughput, not suitable for high-volume medical records)
  - Single Interconnect (single point of failure)
  - Apigee over public Internet (not a layer 2/3 connection)

**Predictive Analytics & Model Monitoring:**
- **Requirement**: Gain healthcare insights and predictions while minimizing model skew/drift
- **Solution**: Pub/Sub → Dataflow → BigQuery + Vertex AI Model Monitoring
- **Why**: Standard data pipeline; Model Monitoring tracks performance degradation over time
- **Skew**: Difference between training and serving data
- **Drift**: Data distribution changes over time
- **Wrong choices**: Manual CSV exports (not scalable), Bigtable with static model (drift issues), Cloud SQL with manual queries (not AI-powered)

**Bigtable Schema Design (Time-Series):**
- **Best practices for patient metrics**:
  1. Non-sequential prefix (hashed Patient ID) to prevent hotspotting
  2. Reversed timestamp for most-recent-first ordering
- **Why**: Sequential prefixes (like timestamps first) cause all writes to hit one node (hotspot)
- **Row key pattern**: `patient123#9223372036854775807-timestamp` or `hash(patient123)#timestamp`
- **Wrong choices**: 
  - Start with timestamp (causes hotspotting)
  - Many small tables (anti-pattern in Bigtable)


----
### KnightMotives Automotive

| Requirements | Current infra | "Slide" proposed solution anchors |
|--------------|---------------|----------------------------------|
| Business: consistent in‑vehicle experience across BEV/hybrid/ICE; improve unreliable online ordering + dealer tools; monetize data; address security breaches + EU data protection; improve talent/upskilling. Tech: hybrid cloud; vehicle connectivity esp rural; network upgrades plants↔HQ; modernize legacy systems; autonomous dev/testing; robust data platform + AI/ML infra; stronger security/risk mgmt; CRM + dealer tooling. | Mostly on‑prem; outdated mainframe supply chain + outdated ERP; dealers can't buy new equipment; fragmented codebases and tech debt; connectivity challenges for rural connectivity. | Hybrid cloud: GKE + Anthos/Service Mesh; Network Connectivity Center for plants↔HQ; Android Automotive OS for consistent in‑vehicle UX; IoT pipeline Pub/Sub → Dataflow → BigQuery + Vertex AI lifecycle; rebuild ordering + dealer tools on GKE/Cloud Run; Firestore/Cloud SQL backend; Looker dashboards; Apigee for APIs/monetization; SCC/VPC‑SC/SDP for security. |

**Key Exam Questions & Patterns:**

**Hybrid Cloud Container Management:**
- **Requirement**: Run containerized microservices on GKE and on-premises with consistent policy management
- **Solution**: Anthos (now Google Cloud Distributed Cloud)
- **Why**: Single pane of glass for GKE + on-prem clusters; consistent security policies and service mesh
- **Wrong choices**: 
  - EKS on Google Cloud (impossible, EKS is AWS)
  - Bigtable (database, not container orchestration)
  - Manual VPN tunnels (not scalable, no unified management)

**Connected Vehicle Telemetry (IoT at Scale):**
- **Requirement**: Millions of events/second, real-time processing, petabyte-scale analytics, multi-region HA
- **Solution**: Cloud IoT Core → Pub/Sub → Dataflow → Bigtable (real-time) + BigQuery (analytics)
- **Why**: 
  - IoT Core: Secure device management at scale
  - Pub/Sub: Global message bus, decouples ingestion from processing
  - Dataflow: Serverless stream processing, auto-scaling
  - Bigtable: Low-latency operational data for dashboards
  - BigQuery: Cost-effective historical analytics and ML
- **Wrong choices**: 
  - Cloud Storage + Cloud Functions (not for continuous streaming)
  - Cloud SQL (can't handle millions of writes/second)
  - Custom Compute Engine VMs (high ops overhead, not serverless)
  - BigQuery streaming only (no real-time operational metrics)

**Dealer Relationship & CRM:**
- **Issue**: Unreliable build-to-order systems strain dealer relationships
- **Solution**: Comprehensive CRM system + modernized online build-to-order tool
- **Why**: Addresses customer-facing data reliability and dealer transparency
- **Wrong choices**: 
  - Migrate mainframe (infrastructure, not dealer-facing issue)
  - Employee upskilling (human capital, not system reliability)
  - Subsidize dealer equipment (doesn't fix central tools)

**Vehicle Telemetry Storage (Time-Series):**
- **Requirement**: High-velocity time-series data, low-latency writes, proactive maintenance alerts
- **Solution**: Pub/Sub → Dataflow → Bigtable with schema: `Vehicle_ID#reversed_timestamp`
- **Why**: 
  - Bigtable: High-throughput, low-latency time-series
  - Vehicle_ID first: Prevents hotspotting, distributes writes
  - Reversed timestamp: Latest data first for efficient queries
- **Wrong choices**: 
  - BigQuery with star schema (not for low-latency point lookups)
  - Cloud Storage + BigQuery Omni (not real-time)
  - Timestamp-first row key (causes hotspotting - CRITICAL ERROR)

**Model Performance & Drift:**
- **Issue**: Visual damage inspection model accuracy drops with new geographic regions/car models
- **Concept**: Model Skew (training vs production data difference) and Data Drift (data changes over time)
- **Solution**: Vertex AI Model Monitoring to detect skew and drift, trigger retraining
- **Why**: Monitors data distributions, alerts when performance degrades
- **Wrong choices**: 
  - Re-normalize dataset with Dataflow (doesn't solve fundamental drift)
  - Switch to different Model Garden model (no model is "immune" to drift)
  - GKE autoscaling (resource issue, not accuracy issue)

-----

### TerramEarth

**Company Overview:**
- Manufactures heavy equipment for mining and agricultural industries
- 500+ dealers and service centers in 100 countries
- 2 million vehicles in operation, 20% yearly growth
- Vehicles generate 200-500 MB of data per day

**Existing Technical Environment:**
- Vehicle data aggregation and analysis in Google Cloud
- Manufacturing plant sensor data sent to private data centers
- Legacy inventory and logistics in on-premises data centers
- Multiple network interconnects to Google Cloud
- Web frontend for dealers/customers runs in GCP

**Business Requirements:**
- Predict and detect vehicle malfunction
- Rapid parts shipping for just-in-time repair
- Decrease cloud operational costs and adapt to seasonality
- Increase speed and reliability of development workflow
- Allow remote developers to be productive without compromising security
- Create flexible platform for custom API services for dealers/partners

**Technical Requirements:**
- Abstraction layer for HTTP API access to legacy systems
- Modernize CI/CD pipelines for container-based workloads
- Allow developer experiments without compromising security/governance
- Self-service portal for developers to create projects and request resources
- Cloud-native solutions for keys/secrets management
- Identity-based access optimization

**Key Exam Questions & Patterns:**

**Real-Time vs Batch Data Ingestion:**
- **Scenario**: Critical data in real-time, bulk sensor data uploaded daily
- **Solution**: 
  1. Real-time: Pub/Sub → Dataflow → Cloud Storage + BigQuery
  2. Daily batch: Parallel composite uploads to Cloud Storage → Cloud Storage Trigger → Dataflow → BigQuery
- **Why**: 
  - Pub/Sub: Flexible, secure, at-least-once delivery
  - Dataflow: Unified processing for both real-time and batch
  - Store in both Cloud Storage (complete data) and BigQuery (aggregated analytics)
  - Parallel composite uploads: Handle large 200-500 MB daily files efficiently
- **Wrong choices**: 
  - Real-time to BigQuery only (doesn't store complete data)
  - BigQuery Data Transfer Service (for cloud sources, not on-prem)

**5G Migration with Legacy Integration:**
- **Requirement**: Integrate new 5G real-time data with legacy maintenance port downloads
- **Solution**: Cloud Composer (Managed Airflow)
- **Why**: Workflow orchestration across cloud and on-premises, schedule/monitor pipelines
- **Wrong choices**: 
  - Cloud Interconnect (expensive for field offices)
  - App Engine (PaaS, requires custom code, not simple)
  - Cloud Build (for CI/CD, not workflow orchestration)

**Intermittent Connectivity (IoT):**
- **Requirement**: Real-time ingestion for 20M tractors with intermittent rural cellular
- **Solution**: Pub/Sub → Dataflow → BigQuery
- **Why**: 
  - Pub/Sub buffers messages for up to 7 days (handles intermittent connectivity)
  - Asynchronous data streams
  - Dataflow processes and normalizes before BigQuery
- **Wrong choices**: 
  - Direct BigQuery streaming (no buffer, data lost if connection drops)
  - FTP servers (legacy approach, doesn't scale)
  - Cloud Storage Transfer every 5 minutes (micro-batch, not real-time)

**Long-Term Data Retention (Cost Optimization):**
- **Requirement**: 7-year retention for regulatory/warranty, only last 30 days frequently accessed
- **Solution**: Last 30 days in BigQuery → Older data to Cloud Storage → Object Lifecycle Management to Archive class
- **Why**: 
  - BigQuery: High-performance for active 30 days
  - Cloud Storage Archive: Cost-effective for 7-year cold storage
  - Lifecycle policies: Automatic transition between storage classes
- **Wrong choices**: 
  - Partition expiration in BigQuery (deletes data, not exports)
  - Bigtable with SSDs for 7 years (extremely expensive)
  - Delete after 30 days (violates 7-year requirement)

**Recommended Architecture Pattern:**
```
Vehicles → Pub/Sub → Dataflow → {
  Cloud Storage (complete data, lifecycle to Archive)
  BigQuery (aggregated analytics)
}
```
----

### Helicopter Racing League (HRL)

**Company Overview:**
- Global sports league for competitive helicopter racing
- Annual world championship and regional league competitions
- Paid streaming service with live telemetry and predictions

**Solution Concept:**
- Migrate to new platform for managed AI/ML services for race predictions
- Move content serving closer to users, especially in emerging regions
- Expand predictive capabilities during and before races

**Existing Technical Environment:**
- Public cloud-first company
- Video recording/editing at race tracks
- Video encoding/transcoding in cloud (VMs per job)
- Race predictions using TensorFlow on VMs
- Content stored in object storage on existing cloud provider

**Business Requirements:**
- Expose predictive models to partners
- Increase predictive capabilities: race results, mechanical failures, crowd sentiment
- Increase telemetry and create additional insights
- Measure fan engagement with predictions
- Enhance global availability and broadcast quality
- Increase concurrent viewers
- Minimize operational complexity
- Ensure regulatory compliance
- Create merchandising revenue stream

**Technical Requirements:**
- Maintain/increase prediction throughput and accuracy
- Reduce viewer latency
- Increase transcoding performance
- Create real-time analytics of viewer consumption patterns
- Create data mart for processing large volumes of race data

**Key Exam Questions & Patterns:**

**Content Migration & Serving:**
- **Requirement**: Migrate videos from another provider without service interruption, users access via secure procedure
- **Solutions**:
  1. Cloud CDN with Internet Network Endpoint Group (NEG)
  2. Apigee for API management
  3. Cloud Storage Transfer Service for migration
- **Why**: 
  - Cloud CDN with custom origins: Serve from external backends (other cloud), mask content URL
  - Apigee: Manage services across GCP, on-prem, multi-cloud
  - Storage Transfer Service: Large-scale online data transfer (10s of Gbps)
- **Wrong choices**: 
  - Cloud Function to fetch video (complicated, requires code, won't scale)
  - Cloud Storage streaming service (for on-the-fly data, not migration)
  - Transfer Appliance (for local physical data, not cloud-to-cloud)

**API Monetization & Revenue Stream:**
- **Requirement**: Service subscriptions, monetization, pay-as-use, rate-limiting for merchandising revenue
- **Solution**: Apigee
- **Why**: Top GCP product for API management with monetization, traffic control, throttling, security, hybrid integration
- **API Management Options**:
  - Apigee: Full-featured (monetization, hybrid, throttling)
  - Cloud Endpoints: GCP-only, no monetization
  - API Gateway: Serverless workloads only
- **Wrong choices**: 
  - Cloud Endpoints (no monetization or hybrid support)
  - Cloud Tasks (thread management, not API management)
  - Cloud Billing (GCP services accounting, not end-user services)

**ML Model Development & MLOps:**
- **Requirements**: 
  - Create experimental forecast models with minimal code
  - Develop highly customized models with open-source frameworks
  - Integrate teamwork and optimize MLOps processes
  - Serve models in optimized environment
- **Solution**: Vertex AI
- **Why**: 
  - AutoML Video: Experimental models with minimal/no code, external data support
  - Build/deploy models with many open-source frameworks
  - Support continuous modeling with TensorFlow Extended and Kubeflow Pipelines
  - Feature engineering, hyperparameter tuning, model serving, model understanding
  - Integrates multiple ML tools, improves MLOps pipelines
- **Other Valid Tools**:
  - Video Intelligence API
  - TensorFlow Enterprise and Kubeflow for customized models
  - BigQuery ML

**Live Video Analysis:**
- **Requirement**: Live playback with live annotations, immediately accessible without coding
- **Solutions**:
  1. HLS (HTTP Live Streaming) protocol
  2. Video Intelligence API Streaming API
- **Why**: 
  - HLS: Apple technology for live and on-demand audio/video to broad range of devices
  - Video Intelligence Streaming API: Analyze live media and get metadata using AIStreamer
- **Wrong choices**: 
  - HTTP protocol alone (can't manage live streaming)
  - Dataflow (manages pipelines but can't derive metadata from binary without custom code)
  - Pub/Sub (ingests metadata but doesn't analyze video)

**Content Architecture Pattern:**
```
Race Tracks (Video) → {
  Live: HLS Protocol → Cloud CDN → Global Viewers
  Recorded: Cloud Storage → Transfer Service (migration) → Cloud CDN
  Analysis: Video Intelligence API → Metadata → BigQuery
  Predictions: Vertex AI → TensorFlow/Kubeflow
}
```

------

### Mountkirk Games

**Company Overview:**
- Makes online, session-based, multiplayer games for mobile platforms
- Expanding to other platforms after successful GCP migration
- Building retro-style FPS game with hundreds of simultaneous players
- Real-time global leaderboard across all active arenas

**Solution Concept:**
- Deploy game backend on GKE for rapid scaling
- Use Google's global load balancer to route players to closest regional arenas
- Multi-region Spanner cluster for global leaderboard sync

**Existing Technical Environment:**
- Recently migrated to Google Cloud
- 5 games migrated using lift-and-shift VM migrations
- Each game in isolated project under folder (maintains permissions/network policies)
- Legacy low-traffic games consolidated into single project
- Separate environments for development and testing

**Business Requirements:**
- Support multiple gaming platforms
- Support multiple regions
- Support rapid iteration of game features
- Minimize latency
- Optimize for dynamic scaling
- Use managed services and pooled resources
- Minimize costs

**Technical Requirements:**
- Dynamically scale based on game activity
- Publish scoring data on near real-time global leaderboard
- Store game activity logs in structured files for future analysis
- Use GPU processing to render graphics server-side for multi-platform support
- Support eventual migration of legacy games to new platform

**Key Exam Questions & Patterns:**

**Telemetry Analysis System:**
- **Requirement**: Improve game and infrastructure, minimize effort, maximize flexibility, real-time analysis
- **Solution**: Pub/Sub → Dataflow → BigQuery
- **Why**: 
  - Pub/Sub: Ingests messages from user devices and game servers
  - Dataflow: Transform data in schema-based format, process in real-time
  - BigQuery: Perform analytics
- **Wrong choices**: 
  - Pub/Sub + Bigtable (Bigtable not for real-time analytics)
  - Kubeflow (for ML pipelines, not general telemetry analysis)
  - Pub/Sub + Cloud Spanner (Spanner is global SQL DB, not analytics tool)

**Kubernetes Security & Identity:**
- **Requirement**: Use open platform (cloud-native, no vendor lock-in) but access GCP APIs securely with Google-recommended practices
- **Solution**: Workload Identity
- **Why**: 
  - Preferred way for GKE workloads to access GCP APIs
  - Configure Kubernetes service account to authenticate as GCP service account
  - Standard, secure, easy identity management
  - Recommended approach for GKE applications
- **Important Distinction**:
  - **Workload Identity**: For GKE pods accessing GCP services (CORRECT for this case)
  - **Workload Identity Federation**: For external IdPs (AWS, Azure, OIDC providers)
- **Wrong choices**: 
  - API keys (minimal security, no authorization)
  - Service Accounts alone (GCP-proprietary, Kubernetes uses K8s service accounts)
  - Workload Identity Federation (for external IdPs like AWS/Azure, not GKE)

**Architecture Pattern:**
```
Players → Global Load Balancer → Regional GKE Clusters (Game Servers)
                                         ↓
Game Events → Pub/Sub → Dataflow → BigQuery (Analytics)
                                         ↓
Scoring Data → Multi-Region Cloud Spanner (Global Leaderboard)
Server-side Rendering → GPU-enabled node pools
```

**Key Concepts:**
- **Workload Identity** vs **Workload Identity Federation**:
  - WI: GKE pods → GCP APIs (use K8s service accounts)
  - WI Federation: External IdPs (AWS, Azure) → GCP APIs
- **Multi-Region Spanner**: Global consistency for leaderboard sync across regions
- **GKE with GPU node pools**: Server-side rendering for multi-platform support
- **Managed services**: GKE (not self-managed K8s), Cloud Spanner (not self-hosted DB)

---

**If you want, I can turn these into a single printable cheat-sheet PDF (same tables, but condensed + color-coded "AWS equivalent" column) for quick revision.**
