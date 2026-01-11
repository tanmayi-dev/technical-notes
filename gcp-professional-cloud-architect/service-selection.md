#### Compute Choices

- Compute Engine
  - Use when : full OS control, legacy apps, custom networking
  - Supports : stateful workloads
  - You manage : OS, patches, scaling 
- GKE
  - Use when : containerized apps, portability, complex microservices
  - Supports : stateful + stateless
  - You manage : cluster + workloads
- Cloud Run
  - Use when : stateless containers, HTTP-driven workloads
  - Auto-scales to zero
  - No cluster management
- App Engine
  - Use when : rapid development, minimal ops
  - Opioninated runtime
- Cloud Functions
  - Use when : event-driven, small logic units
  - Short-lived execution 

#### Load Balancing

- Global HTTP(S) LB
  - Multi-region, global users 
- Regional LB
  - Single region traffic 
- Internal LB
  - Private services 
- TCP/UDP LB
  - Non-HTTP workloads 

#### Storage

- Cloud Storage
  - Object storage
  - Static assets, backups, data lakes 
- Persistent Disk
  - Block storage for VMs 
- Filestore
  - Shared POSIX file system
- Cloud CDN
  - Cache static content globally

#### Databases

- Cloud SQL
- Spanner
  - Global, strongly consistent relational DB
  - Financial systems, global apps
- Bigtable
  - Wide-column, massive scale
  - Time-series, IoT 
- Firestore
  - Serverless NoSQL
  - Mobile & web apps 
- BigQuery
  - Analytics, OLAP
  - NOT transactional 

#### IAM & Security

- Prefer :
  - Predefined roles > primitive roles
  - Least privilege  
- Structure :
  - Organization -> Folder -> Project 
- Encryption
  - Default encryption always on
  - CMEK via Cloud KMS when required 
