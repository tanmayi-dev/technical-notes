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

### Cymbal Retail

| Requirements | Current infra | "Slide" proposed solution anchors |
|--------------|---------------|----------------------------------|
| Business: automate catalog enrichment; improve discoveerce; reduce call center + hosting costs. Tech: attribute + image generation; natural-language product discovery; scalability; HITL review UI; security/compliance. | Mix of on‑prem + cloud; DBs: MySQL, SQL Server, Redis, MongoDB; Kubernetes clusters; SFTP/ETL batch integrations; custom web app queries relational DB for browsing; IVR + manual agent ordering; OSS monitoring (Grafana/Nagios/Elastic). | Vertex AI (Gemini) for attributes/descriptions; Imagen for image creation; Vertex AI Search for Commerce; Dialogflow CX / conversational commerce; migrate K8s → GKE Autopilot or Cloud Run; migrate MySQL/SQL Server → Cloud SQL; use BigQuery to break silos; Composer/Data Fusion for orchestration; Apigee for integrations; upgrade monitoring/security (Logging/Monitoring, KMS, VPC‑SC). |

### EHR Healthcare

| Requirements | Current infra | "Slide" proposed solution anchors |
|--------------|---------------|----------------------------------|
| Business: scale fast; 99.9% availability; centralized visibility; reduce latency; regulatory compliance; lower admin cost; insights + predictions. Tech: keep legacy insurer interfaces; consistent container mgmt; secure high-performance on‑prem ↔ GCP connectivity; consistent logging/retention/monitoring/alerting; ingest new provider data. | Hosted in multiple colocation DCs; apps web-based, many containerized across Kubernetes clusters; DBs: MySQL, SQL Server, Redis, MongoDB; legacy file/API integrations remain on‑prem for years; Microsoft AD; OSS monitoring; email alerts ignored. | Emphasize HIPAA + data protection (DLP/SDP, KMS/CMEK, org policy, audit); GKE (+ Anthos/Service Mesh) for multi-env mgmt; migrate MySQL/SQL Server → Cloud SQL; Redis → Memorystore; MongoDB → Firestore (or MongoDB on GKE interim); Apigee for integration; improve logging/monitoring + post-mortems. |

### KnightMotives Automotive

| Requirements | Current infra | "Slide" proposed solution anchors |
|--------------|---------------|----------------------------------|
| Business: consistent in‑vehicle experience across BEV/hybrid/ICE; improve unreliable online ordering + dealer tools; monetize data; address security breaches + EU data protection; improve talent/upskilling. Tech: hybrid cloud; vehicle connectivity esp rural; network upgrades plants↔HQ; modernize legacy systems; autonomous dev/testing; robust data platform + AI/ML infra; stronger security/risk mgmt; CRM + dealer tooling. | Mostly on‑prem; outdated mainframe supply chain + outdated ERP; dealers can't buy new equipment; fragmented codebases and tech debt; connectivity challenges for rural connectivity. | Hybrid cloud: GKE + Anthos/Service Mesh; Network Connectivity Center for plants↔HQ; Android Automotive OS for consistent in‑vehicle UX; IoT pipeline Pub/Sub → Dataflow → BigQuery + Vertex AI lifecycle; rebuild ordering + dealer tools on GKE/Cloud Run; Firestore/Cloud SQL backend; Looker dashboards; Apigee for APIs/monetization; SCC/VPC‑SC/SDP for security. |

---

**If you want, I can turn these into a single printable cheat-sheet PDF (same tables, but condensed + color-coded "AWS equivalent" column) for quick revision.**
