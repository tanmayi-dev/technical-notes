# Notes

---

1) Table of services (service, description, use-case, facts)

Compute / Containers / Serverless

Service	Description	Use-case	Facts (incl. AWS mapping / exam traps)

Compute Engine (GCE)	VMs (IaaS)	Lift & shift, custom OS, legacy apps	≈ EC2. Pair with MIG + LB for HA.
Managed Instance Groups (MIG)	Autoscaled, autohealed VM fleet from a template	Stateless web/app tier on VMs	Autoscaling signals include CPU, LB capacity, Monitoring metrics, queue-based, schedules. 
Instance Template	Immutable “launch config” for MIG	Standardize VM boot, images, metadata	Like EC2 Launch Template. You can’t “edit” an existing template—make a new one (common exam gotcha).
GKE	Managed Kubernetes	Microservices, platform teams	≈ EKS. If you see “multiple clusters / environments”, Anthos/Service Mesh often shows up (case studies).
GKE Autopilot	“More managed” GKE mode	Reduce ops overhead for K8s	You trade some node-level control for less management.
Cloud Run	Serverless containers	HTTP APIs, webhooks, background processors (with jobs)	≈ ECS Fargate / App Runner. “Deploy a web app without local installs” → often Cloud Run. 
Cloud Run functions	Event-driven functions	Bucket/object events, Pub/Sub triggers	≈ Lambda. (In exam, pick event-driven + minimal ops.)
App Engine	PaaS for web apps	Classic web apps, rapid deploy	≈ Elastic Beanstalk (conceptually).
Cloud Scheduler	Managed cron	Trigger jobs/functions on schedule	≈ EventBridge Scheduler / cron + Lambda.


Networking / Edge

Service	Description	Use-case	Facts

VPC	Private network	Network segmentation, routing	Unlike AWS, subnets are regional in GCP (typical exam point).
Cloud Load Balancing	Google’s L4/L7 load balancers	Global/regional traffic distribution	Many flavors exist (global vs regional, internal vs external). 
External HTTP(S) LB	Global L7	Global web apps	“Global + Anycast IP + URL maps” show up a lot. 
Cloud CDN	Edge caching	Reduce latency, offload origin	Often paired with HTTP(S) LB.
Cloud Armor	WAF / DDoS protection	Protect web apps and APIs	≈ AWS WAF + Shield.
Cloud DNS	Managed DNS	Public/private zones	≈ Route 53.
Cloud NAT	Outbound NAT for private resources	Private instances needing outbound	≈ NAT Gateway.
Cloud VPN	IPsec VPN	Hybrid connectivity (quick/cheap)	≈ Site-to-Site VPN.
Cloud Interconnect (Dedicated/Partner)	Private high-throughput connectivity	Hybrid connectivity (prod-grade)	≈ Direct Connect.
Private Service Connect (PSC)	Private access to services across VPCs/orgs	Private consumption of Google/APIs/producer services	Often used when “avoid public IPs / private access” is a requirement.
Network Connectivity Center	Hub/spoke connectivity orchestration	Many sites/VPCs connectivity	Called out for connecting plants + HQ in KnightMotives proposal. 


Storage / Databases

Service	Description	Use-case	Facts

Cloud Storage	Object storage	Media, data lake, static assets	≈ S3. Avoid sequential object keys; prefer random/hash prefixes for scale. 
Persistent Disk	Block storage for VMs	VM boot/data disks	≈ EBS.
Filestore	Managed NFS	Shared POSIX filesystem	≈ EFS (conceptually).
Cloud SQL	Managed MySQL/Postgres/SQL Server	“Simple” relational workloads	Read replicas don’t increase availability; HA is separate. 
Cloud SQL (HA)	Regional primary + standby	Zonal-failure resilience	Heartbeat unavailable ~60s → failover; <3 min unavailability; same IP. 
Cloud Spanner	Globally distributed relational DB	Global scale + strong consistency	Horizontal scaling reads+writes, very high availability (99.999%). 
Firestore / Datastore	Serverless document DB	Web/mobile apps, flexible schema	“Firestore = Datastore++”, multi-device/offline sync use-cases. 
Bigtable	Wide-column NoSQL (HBase API)	IoT/time-series, huge throughput/low latency	“Millions TPS, low latency”, single-row transactions; not serverless (cluster/nodes). 
BigQuery	Serverless data warehouse (OLAP)	Analytics at TB–PB	Cost/perf driven by data scanned; partition+cluster to reduce cost.  
Memorystore	Managed Redis/Memcached	Caching, sessions	≈ ElastiCache.


Data / Integration / Observability / Security

Service	Description	Use-case	Facts

Pub/Sub	Messaging/event bus	Event-driven systems, ingestion	≈ SNS+SQS-ish (conceptually).
Dataflow	Managed Apache Beam	Streaming + batch ETL	Pub/Sub → Dataflow → BigQuery is a classic pattern (appears in proposals). 
Dataproc	Managed Spark/Hadoop	“Keep using Spark” migrations	≈ EMR.
Cloud Composer	Managed Airflow	Workflow orchestration	≈ MWAA.
Storage Transfer Service	Data transfer into GCS	Migrate/ingest from other clouds/on-prem	Mentioned for Altostrat archival migration in proposed solution. 
Cloud Operations Suite	Logging/Monitoring/Trace/etc.	Observability	“Cloud Monitoring + alerting integrations” show up in questions. 
IAM	AuthZ for Google Cloud resources	Least privilege for staff/services	Don’t use basic Owner/Editor/Viewer broadly (exam). 
Identity Platform	CIAM (end-user auth)	Customer logins, social login	IAM vs Identity Platform scenarios are explicitly contrasted. 
Security Command Center	Security posture/vuln findings	Central security view	Picked in KnightMotives diagnostic Q for centralized vuln/policy visibility. 
Sensitive Data Protection (DLP)	Discover/classify/mask sensitive data	HIPAA/PII workloads	Called out in EHR proposed solution notes. 
VPC Service Controls	Service perimeters	Reduce data exfiltration risk	Often appears with “protect sensitive APIs / data exfiltration.” 



---

2) Tradeoffs table (the ones PCA loves)

A) “Where should I run this workload?”

Choice	Pick when	You give up	Quick AWS mapping

Cloud Run	Containerized HTTP app; spiky traffic; minimal ops; fast deploy	Less low-level control (no nodes), some platform constraints	App Runner / Fargate-ish
GKE (Standard)	Need K8s control (DaemonSets, custom networking, multi-service platform)	More cluster ops (unless Autopilot)	EKS
GKE Autopilot	Want Kubernetes but less ops overhead	Some constraints vs Standard	EKS + “more managed”
GCE + MIG	Need VMs (custom OS, agents, special networking) but still want autoscale/HA	OS patching, config mgmt responsibility	EC2 + ASG
App Engine	Simple web app with opinionated runtime	Runtime constraints	Elastic Beanstalk-ish


B) Databases: relational vs NoSQL vs analytics

Decision	Better option	When it wins	Key tradeoff / exam trap

“Simple regional relational DB”	Cloud SQL	MySQL/Postgres/SQL Server with managed ops	Can’t scale writes horizontally; replicas are for reads and don’t increase availability. 
“Global relational + massive scale”	Spanner	Need horizontal scaling reads+writes + global strong consistency	Higher cost; node-based; but very high availability (99.999%). 
“Serverless doc DB for web/mobile”	Firestore	Flexible schema + multi-device access	Not for ad-hoc OLAP; design queries/indexes carefully. 
“Time-series/IoT high TPS low latency”	Bigtable	Huge throughput, low latency	Not serverless; typically single-row transactions; schema/row-key design matters. 
“Ad-hoc analytics at scale”	BigQuery	OLAP queries, BI, warehouse	Costs depend on scanned data; partition/cluster to optimize.  


Extra exam bias: managed DBs are usually preferred unless you have a strong reason to self-manage. 

C) Load balancing decisions (common trick area)

Need	Pick	Why

Global L7 web/app	External HTTP(S) LB	Global + Anycast + URL maps. 
Internal app-to-app L7	Internal HTTP(S) LB	Private L7 within VPC
L4 passthrough TCP/UDP	Network LB (regional)	Regional passthrough for non-HTTP(S) traffic 


D) Identity: workforce vs customers

You are authenticating…	Use	Why

Employees/services accessing Google Cloud resources	IAM	Resource authorization model (roles/policies/service accounts). 
End-users of your app (signup/login, social providers)	Identity Platform	CIAM features like sign-up/sign-in, MFA, social login. 



---

3) Case studies — requirements + current infra (official PDFs) + proposed solution (your slides)

Altostrat Media

Requirements	Current infra	“Slide” proposed solution anchors

Business: optimize storage cost w/ high availability; natural language interaction + 24/7 support; summarization; metadata extraction; detect inappropriate content; better ops reliability. 	GKE for content mgmt/delivery; Cloud Storage for media; BigQuery as warehouse; Cloud Run for event-driven tasks (transcoding/metadata/recommendations); some on‑prem ingestion/archival; Monitoring + Prometheus/email alerts. 	Keep GKE + Cloud Run; add centralized management for hybrid (Istio/Anthos/Service Mesh/Fleets); Cloud Storage lifecycle + Storage Transfer; Pub/Sub + Dataflow → BigQuery; Vertex AI + prebuilt APIs for enrichment; improve alerting/ops.


Cymbal Retail

Requirements	Current infra	“Slide” proposed solution anchors

Business: automate catalog enrichment; improve discoveerce; reduce call center + hosting costs.   Tech: attribute + image generation; natural-language product discovery; scalability; HITL review UI; security/compliance. 	Mix of on‑prem + cloud; DBs: MySQL, SQL Server, Redis, MongoDB; Kubernetes clusters; SFTP/ETL batch integrations; custom web app queries relational DB for browsing; IVR + manual agent ordering; OSS monitoring (Grafana/Nagios/Elastic). 	Vertex AI (Gemini) for attributes/descriptions; Imagen for image creation; Vertex AI Search for Commerce; Dialogflow CX / conversational commerce; migrate K8s → GKE Autopilot or Cloud Run; migrate MySQL/SQL Server → Cloud SQL; use BigQuery to break silos; Composer/Data Fusion for orchestration; Apigee for integrations; upgrade monitoring/security (Logging/Monitoring, KMS, VPC‑SC).


EHR Healthcare

Requirements	Current infra	“Slide” proposed solution anchors

Business: scale fast; 99.9% availability; centralized visibility; reduce latency; regulatory compliance; lower admin cost; insights + predictions.   Tech: keep legacy insurer interfaces; consistent container mgmt; secure high-performance on‑prem ↔ GCP connectivity; consistent logging/retention/monitoring/alerting; t new provider data. 	Hosted in multiple colocation DCs; apps web-based, many containerized across Kubernetes clusters; DBs: MySQL, SQL Server, Redis, MongoDB; legacy file/API integrations remain on‑prem for years; Microsoft AD; OSS monitoring; email alerts ignored. 	Emphasize HIPAA + data protection (DLP/SDP, KMS/CMEK, org policy, audit); GKE (+ Anthos/Service Mesh) for multi-env mgmt; migrate MySQL/SQL Server → Cloud SQL; Redis → Memorystore; MongoDB → Firestore (or MongoDB on GKE interim); Apigee for integration; improve logging/monitoring + post-mortems.


KnightMotives Automotive

Requirements	Current infra	“Slide” proposed solution anchors

Business: consistent in‑vehicle experience across BEV/hybrid/ICE; improve unreliable online ordering + dealer tools; monetize data; address security breaches + EU data protection; improve talent/upskilling.   Tech: hybrid cloud; vehicle connectivity esp rural; network upgrades plants↔HQ; modernize legacy systems; autonomous dev/testing; robust data platform + AI/ML infra; stronger security/risk mgmt; CRM + dealer tooling. 	Mostly on‑prem; outdated mainframe supply chain + outdated ERP; dealers can’t buy new equipment; fragmented codebases and tech debt; connectivity che connectivity. 	Hybrid cloud: GKE + Anthos/Service Mesh; Network Connectivity Center for plants↔HQ; Android Automotive OS for consistent in‑vehicle UX; IoT pipeline Pub/Sub → Dataflow → BigQuery + Vertex AI lifecycle; rebuild ordering + dealer tools on GKE/Cloud Run; Firestore/Cloud SQL backend; Looker dashboards; Apigee for APIs/monetization; SCC/VPC‑SC/SDP for security.


------
# Cheat Sheet

## Cheat Sheet 0: How to solve PCA scenarios fast

**Scan for these “decision anchors”:**

* **Availability target**: single-zone vs **multi-zone** vs **multi-region**
* **RTO/RPO**: how fast to recover + how much data loss allowed
* **Ops appetite**: prefer **managed/serverless** when the prompt says “small team”, “reduce ops”, “focus on features”
* **Connectivity**: internet-only vs private hybrid (VPN/Interconnect)
* **Compliance/security**: CMEK/EKM, private access, perimeters, WAF, auditability
* **Cost triggers**: steady workload → CUD; spiky → autoscale + serverless; fault-tolerant batch → Spot/Preemptible

---

## Cheat Sheet 1: Resource hierarchy + IAM (don’t mix these up)

### Resource hierarchy (blast radius + billing boundary)

**Organization → Folder → Project → Resources**. Projects are the main boundary for **IAM + billing + quotas**. 

### Cloud Identity/Workspace vs Cloud IAM (very common confusion)

* **Cloud Identity / Google Workspace** = *who your users are* (identity directory). 
* **Cloud IAM** = *what they can do on GCP resources* (authorization / control plane). 

### IAM in 20 seconds

* IAM is **policy bindings**: *(principal) member → role → resource*.
* Policies **inherit down** the resource hierarchy. 
* Prefer **least privilege**, avoid primitive roles when possible. 

### Org Policy vs IAM (guardrails vs permissions)

* **IAM** grants permissions.
* **Org Policy** sets **constraints** (allowed/denied values) so projects can’t drift (e.g., restrict regions, disallow external IPs). 

**AWS mental map**

* AWS Org/OU ≈ GCP Org/Folders
* AWS Account ≈ GCP Project (closest “boundary”)
* IAM Role/User ≈ principal + role binding (often via service accounts)

---

## Cheat Sheet 2: Networking + hybrid connectivity

### Connectivity options (pick by SLA + throughput + “private” requirement)

* **Cloud VPN**: encrypted tunnel over internet (quick, cheaper, less throughput). 
* **Cloud Interconnect**

  * **Dedicated Interconnect**: private high-throughput link direct to Google edge
  * **Partner Interconnect**: private link via a service provider 
* **VPC Network Peering**: private RFC1918 connectivity between VPCs (non-transitive). 
* **Shared VPC**: central network project shared with service projects (common enterprise pattern). 

### Cloud Router (often appears with hybrid)

* **Cloud Router uses BGP** to exchange routes dynamically (commonly paired with VPN/Interconnect). 

**AWS mental map**

* Direct Connect ≈ Dedicated/Partner Interconnect
* Site-to-site VPN ≈ Cloud VPN
* Transit Gateway hub-spoke patterns ≈ Shared VPC + (sometimes) peering/PSC designs

---

## Cheat Sheet 3: “Where should I run this?” (compute decision tree)

### Quick picks (most tested)

* **Cloud Run**: containerized HTTP apps, **scales to zero**, minimal ops. 
* **Cloud Functions**: event-driven functions (serverless). 
* **App Engine (Flex/Std)**: PaaS for web apps; **Flexible** supports more runtimes and customization but more “VM-like” under the hood. 
* **GKE**: Kubernetes when you need cluster patterns/control; heavier ops than Cloud Run. 
* **Compute Engine**: full VM control, legacy apps, special OS needs.

### Common “confusions”

* **Cloud Run vs GKE**: both run containers; choose **Run** when you don’t need Kubernetes control-plane features.
* **Cloud Run vs App Engine**: choose **Run** when you have a container-first workflow; choose App Engine when you want a classic PaaS flow.
* **Cloud Functions vs Cloud Run**: Functions are *single-purpose event handlers*; Run is *a full container service*.

---

## Cheat Sheet 4: Load balancing + autoscaling (what the pieces mean)

### Load Balancing types (recognize the prompt)

Cloud Load Balancing can be **external/internal** and **global/regional** depending on the LB type. 

### Key LB building blocks (diagram in your head)

Typical HTTP(S) LB chain:
**Forwarding rule → Target proxy → URL map → Backend service → (MIG/NEGs) + Health check**. 

### Managed Instance Groups (MIG) = the “autoscaling workhorse”

* **Autoscaler** can scale based on metrics like **CPU utilization** and load-based signals. 
* **Autohealing** uses health checks to recreate unhealthy instances. 

### Edge/security add-ons (often part of “secure public app” scenarios)

* **Cloud Armor** = WAF / DDoS protection. 
* **Cloud CDN** = caching at edge (performance + reduced origin load).
* **IAP** = identity-aware access in front of apps (common for admin UIs). 

**AWS mental map**

* ALB/NLB ≈ Cloud Load Balancing (type depends on protocol + internal/external + global/regional)
* Auto Scaling Group ≈ MIG

---

## Cheat Sheet 5: Storage (object vs file vs block) + lifecycle

### Don’t confuse these storage types

* **Cloud Storage** = **object** storage (S3-like)
* **Persistent Disk** = **block** storage for VMs
* **Filestore** = **managed NFS file** storage 

### Storage classes (pick by access frequency)

* **Standard** (hot), **Nearline** (monthly), **Coldline** (quarterly), **Archive** (rare/long-term). 

### Bucket controls you’ll see in questions

* **Object versioning**: keeps old versions on overwrite/delete. 
* **Lifecycle management**: auto transition/delete objects by age/conditions. 
* **Retention policy**: keep objects for a minimum time. 

---

## Cheat Sheet 6: Databases + analytics (what to choose)

### “Which database?” ultra-fast grid

* **Cloud SQL**: managed relational (MySQL/Postgres/SQL Server) for typical OLTP. 
* **Spanner**: relational + **horizontal scaling** + **strong consistency** (global scale OLTP). 
* **Firestore**: serverless document DB for app data, flexible schema. 
* **Bigtable**: wide-column, low-latency at scale (time-series/IoT/large key-value). 
* **BigQuery**: analytics warehouse (OLAP). Partition/retention features show up a lot. 

**Common confusion**

* **Spanner vs Cloud SQL**: Spanner for *global scale + horizontal scale + strong consistency*; Cloud SQL for *classic relational needs*.
* **Firestore vs Bigtable**: Firestore is app-facing document DB; Bigtable is massive, low-latency wide-column.

---

## Cheat Sheet 7: Operations (Monitoring/Logging/Audit)

### Cloud Logging basics

* Logs are stored in **log buckets** (required + default buckets exist). **Log Router** can send logs to sinks, and you can apply exclusions.

### Audit logs (know these names)

Audit log types include:

* **Admin Activity**
* **Data Access**
* **System Event**
* **Policy Denied**

### Ops tools you’ll see in scenarios

* Monitoring dashboards/alerts + uptime checks
* Logging + log-based metrics
* Trace / Profiler / Debugger / Error Reporting (deep app observability) 

**AWS mental map**

* CloudWatch ≈ Cloud Monitoring + Cloud Logging (plus Trace/Profiler equivalents)

---

## Cheat Sheet 8: Security & encryption (CMEK vs CSEK vs EKM)

### Encryption controls

* Data is encrypted by default; keys can be **Google-managed** or **customer-managed (CMEK)** via Cloud KMS. 
* For external key control, **Cloud EKM** is referenced for key management outside Google. 

### Common “secure public app” bundle

* **Cloud Armor** (WAF/DDoS), **IAP** (identity-aware access), proper IAM boundaries. 

---

## Cheat Sheet 9: Cost optimization (the 3 discounts that show up everywhere)

* **Sustained Use Discounts (SUD)**: automatic discount for running VMs consistently. 
* **Committed Use Discounts (CUD)**: commit to a resource amount for 1–3 years for deeper discount. 
* **Spot/Preemptible**: cheapest, interruptible workloads (batch/fault-tolerant). 

---

## AWS ↔ GCP “fast mapper” (for your muscle memory)

* S3 → Cloud Storage
* EC2 → Compute Engine
* ASG → Managed Instance Group
* ALB/NLB/ELB → Cloud Load Balancing
* Route 53 → Cloud DNS
* CloudFront → Cloud CDN
* WAF/Shield → Cloud Armor
* Lambda → Cloud Functions
* ECS/Fargate → Cloud Run (closest)
* EKS → GKE
* Direct Connect → Dedicated/Partner Interconnect
* CloudWatch → Cloud Monitoring + Cloud Logging

---

If you want, I can also turn this into a **single printable 2–3 page “last-minute PDF”** (dense but readable) and a **one-page “service chooser”** grid.

