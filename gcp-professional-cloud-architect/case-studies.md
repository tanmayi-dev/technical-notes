# Case Studies and Cheat Sheet

#### Index

- [Case Studies List](#case-studies)
- [Cheat Sheet](#cheat-sheet)
- [Cross-Case Exam Patterns](#cross-case-exam)
- [Quick Decision Heuristics](#quick-decision-guide)

## Case Studies  <a id="case-studies"></a>

- [Altostrat Media Case Study](https://services.google.com/fh/files/misc/v6.1_pca_altostrat_media_case_study_english.pdf)
- [Cymbal Retail Case Study](https://services.google.com/fh/files/misc/v6.1_pca_cymbal_retail_case_study_english.pdf)
- [EHR Healthcare Case Study](https://services.google.com/fh/files/misc/v6.1_pca_ehr_healthcare_case_study_english.pdf)
- [KnightMotives Automotive Case Study](https://services.google.com/fh/files/misc/v6.1_pca_knightmotives_automotive_case_study_english.pdf)

#### Extra cases used in Sample Questions
- [Mountkirk Games](https://services.google.com/fh/files/blogs/master_case_study_mountkirk_games.pdf)
- [Helicopter Racing League](https://services.google.com/fh/files/blogs/master_case_study_helicopter_racing_league.pdf)
- [TerramEarth](https://services.google.com/fh/files/blogs/master_case_study_terramearth.pdf)

---

## Cheat Sheet <a id="cheat-sheet"></a>

#### General Strategy

- Read business requirements first
- Eliminate answers that : 
  - Over-engineer
  - Increase ops unnecessarily
  - Ignore cost or reliability

### 1. Mountkirk Games

Industry: Gaming

#### Business Goals
- Global, low‑latency multiplayer gaming
- Support sudden traffic spikes (game launches)
- Reduce operational overhead
- Enable rapid feature development

#### Key Requirements
- Stateless, scalable backend
- Global availability
- CI/CD and microservices
- Real‑time analytics

#### Recommended GCP Solutions
- Compute: GKE (primary), Cloud Run for event-driven services
- Networking: Global HTTP(S) Load Balancer, Cloud CDN
- Data: Cloud Spanner (global consistency) or Firestore
- CI/CD: Cloud Build + Artifact Registry
- Monitoring: Cloud Operations Suite

#### Exam Tips
- Prefer managed + containerized services
- Design for global scale first
- Choose Spanner when strong consistency + global writes are required

### 2. TerramEarth

Industry: Heavy equipment & IoT

#### Business Goals
- Predict equipment failure
- Ingest massive sensor data streams
- Support global field operations
- Minimize downtime

#### Key Requirements
- High‑throughput data ingestion
- Time‑series and analytical workloads
- ML‑based predictions
- Hybrid connectivity

#### Recommended GCP Solutions
- Ingestion: Pub/Sub
- Processing: Dataflow (stream + batch)
- Storage: BigQuery, Cloud Storage
- ML: Vertex AI
- Hybrid: Cloud VPN or Dedicated Interconnect

#### Exam Tips
- Pub/Sub + Dataflow + BigQuery is a classic pipeline
- Use Vertex AI, not custom ML infrastructure
- Emphasize decoupled, event‑driven architecture

### 3. Helicopter Racing League (HRL)

Industry: Sports & Media

#### Business Goals
- Live telemetry processing
- Real‑time analytics for broadcasts
- Fan engagement via apps
- Global audience

#### Key Requirements
- Low‑latency streaming
- High availability during live events
- Edge delivery
- Analytics dashboards

#### Recommended GCP Solutions
- Ingestion: Pub/Sub
- Stream Processing: Dataflow
- Analytics: BigQuery
- Visualization: Looker / Looker Studio
- Delivery: Cloud CDN

#### Exam Tips
- Optimize for latency over cost
- Use streaming pipelines, not batch
- Separate ingestion, processing, and analytics layers

### 4. EHR Healthcare

Industry: Healthcare

#### Business Goals
- Secure electronic health records
- Meet compliance (HIPAA)
- High availability
- Controlled access

#### Key Requirements
- Data encryption (at rest & in transit)
- Audit logging
- Fine‑grained IAM
- Disaster recovery

#### Recommended GCP Solutions
- Compute: GKE or Compute Engine
- Storage: Cloud SQL / Spanner (depending on scale)
- Security: IAM, VPC Service Controls, CMEK
- Monitoring: Cloud Audit Logs
- Backup: Automated backups + multi‑region

#### Exam Tips
- Always prioritize security and compliance
- Use least‑privilege IAM
- Choose managed databases with encryption enabled by default

---

## Cross‑Case Exam Patterns to Remember <a id="cross-case-exam"></a>

#### Architecture Principles
- Prefer managed services over self‑managed
- Design for high availability & scalability
- Use global services when latency matters
- Decouple systems using Pub/Sub

#### Data Choices (Very Common on Exam)

| Use Case |	Best Choice |
| -------- | ------------ |
| Global relational DB	| Cloud Spanner |
| OLAP analytics |	BigQuery |
| Streaming ingestion |	Pub/Sub |
| Batch + stream processing |	Dataflow |
| Object storage |	Cloud Storage |

#### Security  Defaults
- IAM with least privilege
- Encryption by default
- Use VPC Service Controls for sensitive data
- Enable Cloud Audit Logs

----

## Quick Decision Heuristics (Exam Gold) <a id="quick-decision-guide"></a>

- Global + strong consistency? → Cloud Spanner
- Event‑driven scaling? → Pub/Sub + Cloud Run
- Streaming analytics? → Pub/Sub + Dataflow + BigQuery
- Minimal ops? → Serverless / managed services
- Compliance‑heavy? → Security first, cost second




