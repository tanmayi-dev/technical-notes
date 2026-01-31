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

