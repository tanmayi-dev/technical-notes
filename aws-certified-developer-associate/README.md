# AWS Certified Developer Associate

- AWS (Amazon Web Services) is a Cloud Provider
- They provide you with servers and services that you can use on demand and scale easily
- Amazon.com and Netflix

**Topics** 
- Amazon EC2
- Amazon ECR
- Amazon ECS
- AWS Elastic Beanstalk
- AWS Lambda
- Elastic Load Balancing
- Amazon CloudFront
- Amazon Kinesis
- Amazon Route 53
- Amazon S3
- Amazon RDS
- Amazon Aurora
- Amazon DynamoDB
- Amazon ElasticCache
- Amazon SQS
- Amazon SNS
- AWS Step Functions
- Auto Scaling
- Amazon API Gateway
- Amazon SES
- Amazon Cognito
- IAM
- Amazon CloudWatch
- Amazon EC2 Systems Manager
- AWS CloudFormation
- AWS CloudTrail
- AWS CodeCommit
- AWS CodeBuild
- AWS CodeDeploy
- AWS CodePipeline
- AWS X-Ray
- AWS KMS
---

# 🎯 AWS Certified Developer Associate (DVA-C02) — FINAL EXAM NOTES
> **Exam:** 65 questions | 130 minutes | 700+ to pass | **No penalty for wrong answers**
> **Strategy:** Read ALL answer choices. Eliminate wrong ones first. Flag uncertain questions and revisit.

---

## 📋 TABLE OF CONTENTS
1. [EC2 Fundamentals](#1-ec2-fundamentals)
2. [Load Balancing & Auto Scaling](#2-load-balancing--auto-scaling)
3. [Lambda & Serverless](#3-aws-lambda--serverless)
4. [API Gateway](#4-api-gateway)
5. [Amazon S3](#5-amazon-s3)
6. [IAM & Security](#6-iam--security)
7. [KMS & Encryption](#7-kms--encryption)
8. [DynamoDB](#8-dynamodb)
9. [RDS & Databases](#9-rds--databases)
10. [SQS, SNS & Messaging](#10-sqs-sns--messaging)
11. [Kinesis — Streaming](#11-kinesis--streaming)
12. [CloudFront & Route 53](#12-cloudfront--route-53)
13. [VPC & Networking](#13-vpc--networking)
14. [DevOps — CI/CD](#14-devops--cicd)
15. [CloudFormation & SAM](#15-cloudformation--sam)
16. [Elastic Beanstalk](#16-elastic-beanstalk)
17. [ECS, Fargate & Docker](#17-ecs-fargate--docker)
18. [Amazon Cognito](#18-amazon-cognito)
19. [CloudWatch, X-Ray & CloudTrail](#19-cloudwatch-x-ray--cloudtrail)
20. [ElastiCache & DAX](#20-elasticache--dax)
21. [STS & Federation](#21-sts--federation)
22. [Storage — EBS, EFS, Glacier, Storage Gateway](#22-storage)
23. [Step Functions & Other Services](#23-step-functions--other-services)
24. [Scenario-Based Decision Tables](#24-scenario-based-decision-tables)
25. [Critical Numbers Cheat Sheet](#25-critical-numbers-cheat-sheet)
26. [HTTP Status Codes](#26-http-status-codes)
27. [Last-Minute Gotcha Master List](#27-last-minute-gotcha-master-list)

---

## 1. EC2 Fundamentals

### Key Facts
- Billed **per second** (minimum 60 seconds)
- Metadata URL: `http://169.254.169.254/latest/meta-data/`
- Userdata URL: `http://169.254.169.254/latest/user-data/`
- **Bootstrapping** = running scripts at launch via Userdata
- **AMIs are region-specific** → backup AMIs across regions for DR
- Prefer **Customized AMI over Userdata** for faster boot times

### Security Groups — CRITICAL

| Feature | Value |
|---|---|
| Default | DENY all (no rules = no traffic) |
| Rule types | ALLOW only (no explicit deny) |
| Stateful? | YES — response traffic auto-allowed |
| Changes effective | Immediately |
| Assign to EC2 | Up to **5** security groups |
| Change at runtime | YES |

### EC2 IP Addresses

| Type | Notes |
|---|---|
| Public IP | Lost when instance **stopped** |
| Elastic IP | Stays when stopped; **charged when NOT associated** or instance is stopped |
| Private IP | Always retained |

### EC2 Pricing Models

| Model | Discount | Use Case |
|---|---|---|
| On-Demand | 0% | Spiky/unpredictable; first time on cloud |
| Spot | up to **90%** | Fault-tolerant, non-critical; 2-min termination notice |
| Reserved | up to **75%** | Constant 24/7 workloads; 1 or 3 yr |
| Savings Plans (Compute) | up to **66%** | Flexible — EC2 + Fargate + Lambda |
| Savings Plans (EC2 Instance) | up to **72%** | Specific instance family + region |

### Termination Protection — Gotchas
> ⚠️ Termination Protection does NOT protect against:
> - **Auto Scaling Groups (ASG)**
> - **Spot instance interruption**
> - **OS shutdown command**

### EC2 Placement Groups

| Type | Use Case | Key Limit |
|---|---|---|
| **Cluster** | Low latency, high throughput — HPC, Big Data | Single AZ; low availability |
| **Spread** | Avoid simultaneous failure | Max **7 instances per AZ** |
| **Partition** | Distributed systems (Kafka, Cassandra, HDFS) | Max **7 partitions per AZ** |

**Placement Group Gotcha:** If you get an insufficient capacity error → stop ALL instances in the group → start them again. AWS may move them to a rack with enough capacity.

### Common EC2 Gotchas
- ❌ You **cannot SSH into RDS** — it's managed
- ✅ You **can change instance type** — stop → change → start
- ✅ Adding IAM role to a running EC2 → **immediately effective**
- ⚠️ Stopped EC2 = **zero compute charge** (storage still billed)
- ⚠️ EC2 Termination Protection NOT effective for ASG, Spot, or OS shutdown

---

## 2. Load Balancing & Auto Scaling

### ELB Types — Decision Table

| Feature | ALB (Layer 7) | NLB (Layer 4) | CLB (Legacy) |
|---|---|---|---|
| Protocol | HTTP/HTTPS, WebSocket | TCP, TLS, UDP | TCP, SSL, HTTP/HTTPS |
| Path/Host routing | ✅ | ❌ | ❌ |
| Static/Elastic IP | ❌ | ✅ | ❌ |
| Lambda target | ✅ | ❌ | ❌ |
| Multiple target groups | ✅ | ✅ | ❌ |
| Sticky sessions | ✅ | ❌ | ✅ |
| Performance | Good | Extreme (millions RPS) | — |
| Recommended? | YES | YES | NO (deprecated) |

### ALB Listener Rules — Routing Conditions
Rules execute in order; **Default rule executes last.**
- Path (`/api/*`, `/images/*`)
- Host header (`api.example.com`)
- HTTP headers / methods (POST, GET)
- Query strings (`?target=a`)
- Source IP CIDR

### Target Group Configuration

| Config | Default | Range | Description |
|---|---|---|---|
| Sticky sessions | Disabled | — | Same user → same instance (cookie) |
| Deregistration delay | **300s** | 0–3600s | Wait for in-flight requests (Connection Draining) |

### Auto Scaling — Dynamic Scaling Policies

| Policy | Description | Gotcha |
|---|---|---|
| Target Tracking | Maintain metric at target (e.g., CPU 70%) | Simplest; recommended |
| Simple | +N if metric > X, -N if < Y | Waits for **cooldown** (default 300s) |
| Step | Different steps for different metric ranges | Per-instance **warm-up** time |

### ASG Key Behaviors
- **Default Termination Policy**: distribute evenly across AZs → terminate **oldest** instances
- **Lifecycle Hooks**: custom actions before instance added/removed → can trigger CloudWatch Events / Lambda
- **Cooldown default**: 300 seconds (prevent rapid scale in/out)
- **Scale-in protection**: enable to protect newly launched instances

### ASG Gotchas
- ❌ Classic Load Balancer does **NOT** support multiple target groups
- ✅ ASG can use Launch Templates (not just Launch Configurations) to launch Spot instances
- ✅ ELB distributes to active instances as ASG expands/contracts
- ⚠️ ASG health checks: EC2 by default; optionally enable ELB health checks

---

## 3. AWS Lambda & Serverless

### Lambda — Key Limits Table

| Limit | Value |
|---|---|
| Memory | 128 MB – 3,008 MB (64 MB increments) |
| Timeout | Max **900 seconds** (15 min); default **3 seconds** |
| Deployment package (direct) | **50 MB** zipped, **250 MB** unzipped |
| Deployment via S3 | Up to **250 MB** unzipped |
| /tmp storage | **512 MB** |
| Environment variables | **4 KB** total |
| Layers | Max **5** |
| Concurrency default | **1,000** per region |
| Throttling error | **429 status code** |

### Lambda Invocation Types

| Type | Caller Waits? | Retries | Example Services |
|---|---|---|---|
| Synchronous | YES | None by Lambda | API Gateway, ALB, CloudFront, Lex |
| Asynchronous | NO (fire & forget) | **2 retries** (up to 6hrs w/ backoff) | S3, SNS, CloudWatch Events |
| Event Source Mapping | Lambda polls | Retries until success or expiry | SQS, DynamoDB Streams, Kinesis |

> ⚠️ **S3 and SNS do NOT use Event Source Mapping** — they invoke Lambda directly via notification config.
> **SQS, DynamoDB Streams, Kinesis DO use** Event Source Mapping (configured on Lambda side).

### Lambda Concurrency

| Concept | Description |
|---|---|
| Reserved Concurrency | Guarantees minimum for critical functions; also caps max |
| Provisioned Concurrency | Pre-warms execution contexts → eliminates cold starts; **more expensive** |
| Throttling | Exceeds limit → **429 status** |
| Lambda scales **OUT** | NOT up — more instances, not bigger ones |

### Lambda Execution Context
- Objects declared **outside** the handler are **reused** across warm invocations
- `/tmp` (512 MB) **persists** across warm invocations
- **Initialize SDK clients and DB connections outside the handler** (performance best practice)
- Cold Start: first request is slower; use Provisioned Concurrency to fix

### Lambda Versioning & Aliases

| Concept | Description |
|---|---|
| Version | **Immutable** snapshot of code + config + env vars |
| `$LATEST` | Always points to latest version |
| Alias | Pointer to a specific version (e.g., PROD → V2) |
| Alias routing | Send X% traffic to V1, Y% to V2 → Blue/Green deployments |

> ⚠️ Environment variables are **locked** when a Lambda version is published.

### Lambda Best Practices (AWS Recommended)
- Initialize SDK/DB connections **outside** handler
- Cache static assets in `/tmp`
- Use **environment variables** for config
- Use **Layers** for shared libraries (max 5)
- Avoid **recursive code** (costs explode)
- Use **Aliases** so consumers aren't affected by version changes
- Use **Reserved Concurrency** for critical functions

### Lambda@Edge
- Only **Python or Node.js** supported
- Runs at CloudFront edge locations
- 4 trigger points: Viewer Request → Origin Request → Origin Response → Viewer Response

### Lambda Inside VPC
- By default Lambda runs **outside** VPC → has internet but no private resource access
- Configure VPC: Lambda creates ENI; needs `ec2:CreateNetworkInterface` permissions → use `AWSLambdaVPCAccessExecutionRole`
- For internet access from Lambda inside VPC → route through **NAT Gateway**

### Lambda — Scenario Gotchas

| Scenario | Solution |
|---|---|
| Lambda too slow | Increase **memory** (CPU scales with memory) |
| Cold start issues | **Provisioned Concurrency** |
| Temporary file needed (100 MB) | Use `/tmp` directory |
| Share libraries across functions | **Lambda Layers** |
| S3 event uses specific Lambda version | Create **Alias** and point S3 to alias |
| ALB sends multi-value headers | Enable **Multi-Value Headers** on ALB |

---

## 4. API Gateway

### API Types Comparison

| Feature | HTTP API | REST API | WebSocket API |
|---|---|---|---|
| Caching | ❌ | ✅ (300s default, max 3600s) | ❌ |
| Request/Response transforms (VTL) | ❌ | ✅ | ❌ |
| Usage plans / API keys | ❌ | ✅ | ❌ |
| AWS WAF | ❌ | ✅ | ❌ |
| AWS X-Ray | ❌ | ✅ | ❌ |
| Auto deployments | ✅ | ❌ | ❌ |
| OAuth2/OIDC native | ✅ | Manual | ❌ |
| Price | Lower (~70% cheaper) | Higher | — |
| Latency | Lower | Higher | — |
| Use for | New simple APIs | Full-featured APIs | Real-time (chat, dashboards) |

### Endpoint Types

| Type | Description |
|---|---|
| Edge-Optimized (default) | Routed through CloudFront; best for global clients |
| Regional | Best for clients in the same region |
| Private | VPC-only via interface VPC endpoint |

### Authorization Methods

| Method | Description |
|---|---|
| IAM | AWS credentials + IAM policies; best for AWS users in same account |
| Cognito User Pool | Token-based (JWT); user registry with sign-up/sign-in |
| Lambda Authorizer | Custom token validation (OAuth, SAML); returns IAM policy |
| Open | No authentication |

### API Gateway — Throttling
- Account level: **10,000 RPS** with burst of **5,000**
- Exceeds limit: `429 Too Many Requests`
- Per-client throttling: **Usage Plans + API keys**

### API Gateway — CORS
- REST API with **proxy integration**: configure CORS headers **in Lambda response code**
- REST API with **custom integration**: configure in API Gateway method/integration response
- HTTP API: enable CORS and set `allowOrigins`, `allowMethods`, `allowHeaders`

### API Gateway — Scenario Gotchas

| Scenario | Answer |
|---|---|
| Lambda takes 5+ minutes | **Timeout after 30 seconds** (API GW max) |
| Client invalidates cache | Send `Cache-Control: max-age=0` header |
| Breaking change, don't impact existing clients | Deploy new version to a **new stage** |
| Custom auth with OAuth/SAML | **Lambda Authorizer** |
| User registry with sign-up/sign-in | **Cognito User Pool Authorizer** |
| 429 errors | API Gateway throttling — raise limits or add Usage Plans |
| Multiple environments (dev/test/prod) | Multiple **stages** + Lambda **aliases** as stage variables |
| Expose SOAP web service | Use **Mapping Templates** (VTL) to convert JSON → XML |

### API Gateway — Canary Releases
- Route X% of traffic to new version
- Promote canary to 100% or roll back based on behavior

---

## 5. Amazon S3

### Key Facts
- Global service; **buckets are region-specific**
- Bucket names: **globally unique**, lowercase, numbers, hyphens, periods
- No folder hierarchy — key-value pairs (slashes = naming convention only)
- Max object size: **5 TB**
- Multipart upload: **recommended >100 MB, mandatory >4 GB** (some docs say >5 GB for single PUT)
- 11 nines (99.999999999%) durability; 99.99% availability (Standard)

### S3 Storage Classes — Decision Table

| Class | AZs | Min Days | Min Size | Retrieval | Use Case |
|---|---|---|---|---|---|
| Standard | ≥3 | None | None | ms | Frequently accessed |
| Standard-IA | ≥3 | 30 | 128 KB | ms | Infrequent; must be available quickly |
| One Zone-IA | 1 | 30 | 128 KB | ms | Easily recreatable data (e.g., thumbnails) |
| Intelligent-Tiering | ≥3 | 30 | None | ms | Unknown or changing access pattern |
| Glacier | ≥3 | 90 | 40 KB | min–hours | Archival |
| Glacier Deep Archive | ≥3 | 180 | 40 KB | hours | Rarely accessed archives |

### S3 Glacier Retrieval Times

| Tier | Glacier | Glacier Deep Archive |
|---|---|---|
| Expedited | 1–5 minutes | N/A |
| Standard | 3–5 hours | Up to 12 hours |
| Bulk | 5–12 hours | Up to 48 hours |

### S3 Encryption Options

| Option | Key Managed By | Header | Notes |
|---|---|---|---|
| SSE-S3 | AWS (rotated monthly) | `x-amz-server-side-encryption: AES256` | Simplest |
| SSE-KMS | AWS KMS (CMK) | `x-amz-server-side-encryption: aws:kms` | Audit + control |
| SSE-C | Customer sends per request | No header; key in request | HTTPS **mandatory** |
| CSE | Client | N/A | Encrypted before upload |

### S3 Performance
- **3,500** PUT/COPY/POST/DELETE RPS per prefix
- **5,500** GET/HEAD RPS per prefix
- Use multiple prefixes to multiply throughput

### S3 Consistency Model
- `PUT` of **new objects** → **Read-After-Write** consistency (immediately visible)
- `PUT`/`DELETE` of **existing objects** → **Eventual consistency** (slight lag)

### S3 — Common Gotchas

| Scenario | Solution |
|---|---|
| Prevent accidental deletion | **Versioning** |
| Prevent changing versioning state | **MFA Delete** (bucket owner + versioning required) |
| Legal hold / WORM compliance | **S3 Object Lock** (new buckets only; auto-enables versioning) |
| Avoid web scraping / secure access | **Pre-signed URLs** (time-limited; max **7 days**) |
| Cross-domain requests | **CORS configuration** on S3 bucket |
| Access only via CloudFront | **Origin Access Identity (OAI)** + bucket policy |
| Large file upload | **Multipart Upload API** |
| Faster global uploads | **S3 Transfer Acceleration** |
| Access logs | **Server Access Logs** (off by default) |
| Batch ops on billions of objects | **S3 Batch Operations** (with inventory report) |

### S3 Replication
- **Must enable versioning** on BOTH source and destination buckets
- Only **new objects** are replicated after configuration is set
- Existing objects must be copied explicitly
- Can be cross-account and cross-region
- IAM policy must allow access to destination bucket

### S3 Bucket Policy — Key Conditions
```json
// Enforce HTTPS only
"Bool": { "aws:SecureTransport": "false" }  → Effect: Deny

// Enforce KMS encryption
"StringNotLikeIfExists": { "s3:x-amz-server-side-encryption-aws-kms-key-id": "YOUR-KMS-KEY-ARN" }
```

### S3 Free Tier (Zero Cost)
- Data transfer **into** S3
- Data transfer from S3 **to CloudFront**
- Data transfer from S3 to services **in the same region**

---

## 6. IAM & Security

### Key Concepts

| Concept | Description |
|---|---|
| IAM User | Long-term credentials (username/password or access keys) |
| IAM Group | Collection of users; attach policies to the group |
| IAM Role | Temporary identity; **no long-term credentials** |
| IAM Policy | JSON: Effect, Action, Resource, Condition |
| Instance Profile | Container for IAM role → passed to EC2 instance |

### Policy Evaluation Logic
```
1. Explicit DENY  → always wins (overrides everything)
2. Explicit ALLOW → permitted
3. No allow, no deny → implicit DENY
```

### Policy Types

| Type | Description |
|---|---|
| AWS Managed | Pre-built by AWS; reusable across accounts |
| Customer Managed | Created by you; reusable |
| Inline | Embedded directly in user/group/role; 1:1 relationship |
| Resource-based | Attached to resource (S3, SQS, SNS, KMS); supports cross-account |

### Identity-Based vs Resource-Based Policies

| Feature | Identity-Based | Resource-Based |
|---|---|---|
| Attached to | IAM user/group/role | Resource (S3, SQS, SNS, KMS) |
| Cross-account | User must switch role | User accesses directly from own account |
| Supported by | All services | Subset (S3, SQS, SNS, KMS, etc.) |
| Conditions | Dates, CIDR, MFA | Dates, CIDR, SSL required |

### IAM Best Practices
- **Do NOT use root user** for daily tasks
- Use **IAM Groups** to manage policies
- Grant **least privilege**
- Rotate access keys regularly (two active at once → safe rotation)
- Enable **MFA** for privileged users
- Use **IAM Roles** for EC2 instead of access keys

### IAM Gotchas
- IAM is a **global service** (users/roles work in any region)
- **Two access keys** can be active simultaneously (for rotation)
- Role added to running EC2 → **immediately effective**
- Trust policy = **who** can assume the role
- Permission policy = **what** they can do once assumed
- `dynamodb:LeadingKeys` → restrict user to their own DynamoDB items (use with Cognito sub)

---

## 7. KMS & Encryption

### KMS Key Facts

| Fact | Value |
|---|---|
| Max object size for direct encryption | **4 KB** |
| Larger objects | Use **Envelope Encryption** |
| Key auto-rotation | Every **1 year** (no re-encryption needed; old versions kept) |
| Min key deletion wait | **7 days** (max 30 days) |
| KMS request quota | 5,500–30,000 req/sec (region-dependent) |
| Throttle error | `ThrottlingException` → retry with exponential backoff |

### KMS Key Types

| Type | Managed By | Scope |
|---|---|---|
| Customer Managed CMK | You | Your account only |
| AWS Managed CMK | AWS | Your account only |
| AWS Owned CMK | AWS | Multiple accounts (limited use) |

### Envelope Encryption — MUST KNOW
```
1. Call GenerateDataKey → returns plaintext data key + encrypted data key
2. Encrypt your data with the plaintext data key (locally)
3. Store: encrypted data + encrypted data key together
4. Delete plaintext data key from memory
5. CMK NEVER leaves KMS
```

### KMS API Summary

| API | Purpose | Size Limit |
|---|---|---|
| `Encrypt` | Encrypt small data directly | **4 KB** |
| `Decrypt` | Decrypt data key or small data | **4 KB** |
| `GenerateDataKey` | Returns plaintext + encrypted data key | — |
| `GenerateDataKeyWithoutPlaintext` | Returns only encrypted data key | — |
| `ReEncrypt` | Decrypt + re-encrypt with different CMK | **4 KB** |

### KMS vs CloudHSM

| Feature | KMS | CloudHSM |
|---|---|---|
| Multi-tenant | YES | NO (dedicated hardware) |
| AWS access to your keys | YES | **NO** |
| FIPS 140-2 Level | Level 2 | **Level 3** |
| Use case | General encryption, audit | Regulatory compliance, TDE, SSL offload |
| Custom key store | Via CloudHSM integration | Native |

### S3 Encryption with SSE-KMS — Flow
```
Client sends data → S3 calls KMS GenerateDataKey →
S3 encrypts data with data key → Stores encrypted data + encrypted key
```

### Encryption Context
> If encryption context is set during Encrypt, the SAME context must be provided during Decrypt — or decryption FAILS.

---

## 8. DynamoDB

### Key Concepts

| Concept | Description |
|---|---|
| Item | Single record — max **400 KB** |
| Primary Key | Simple (partition key) OR Composite (partition + sort key) |
| LSI | Same partition key, different sort key; max **5**; **defined at creation only** |
| GSI | Different partition & sort key; max **20**; can add/remove anytime; own RCU/WCU |

### RCU/WCU — MUST KNOW

| Operation | Units |
|---|---|
| 1 Strongly Consistent Read (up to 4 KB) | **1 RCU** |
| 1 Eventually Consistent Read (up to 4 KB) | **0.5 RCU** |
| 1 Transactional Read (up to 4 KB) | **2 RCU** |
| 1 Standard Write (up to 1 KB) | **1 WCU** |
| 1 Transactional Write (up to 1 KB) | **2 WCU** |

**Formula:**
```
RCU = CEIL(item_size_KB / 4) × reads_per_second × multiplier
WCU = CEIL(item_size_KB / 1) × writes_per_second × multiplier
```

**Example — Exam-style Calculation:**
```
Q: 25 strongly consistent reads/sec of 15 KB items → RCU needed?
CEIL(15/4) = 4 RCU per read × 25 = 100 RCU ✅

Q: 25 eventually consistent reads/sec of 15 KB → RCU needed?
0.5 × CEIL(15/4) × 25 = 0.5 × 4 × 25 = 50 RCU ✅

Q: 100 writes/sec of 512 bytes → WCU needed?
CEIL(0.5/1) = 1 WCU × 100 = 100 WCU ✅
```

### DynamoDB Consistency Modes

| Mode | Default | `ConsistentRead` | Notes |
|---|---|---|---|
| Eventually Consistent | YES | false | Faster, cheaper; ~1 second lag |
| Strongly Consistent | NO | **true** | More expensive; not supported on GSI |
| Transactional | NO | — | All-or-nothing; **2× cost** |

### DynamoDB Capacity Modes

| Mode | Best For | Billing |
|---|---|---|
| Provisioned | Predictable, steady workloads | Pay for provisioned (even if unused) |
| On-Demand | Unknown, spiky; dev/test | Pay per request; expensive |

### Secondary Indexes — Key Differences

| | LSI | GSI |
|---|---|---|
| Partition key | Same as table | Different |
| Sort key | Different | Any |
| Created | At **table creation** (cannot modify) | Anytime |
| Limit | **5** per table (hard limit) | **20** per table (soft limit) |
| Strongly consistent reads | YES | **NO** |
| Separate RCU/WCU | NO (shares table) | **YES** |
| ⚠️ Gotcha | — | **GSI throttle = main table throttle** |

### DynamoDB API Reference

| API | Description |
|---|---|
| `GetItem` | Single item by primary key |
| `PutItem` | Write/replace one item |
| `UpdateItem` | Modify attributes; primary key required |
| `DeleteItem` | Delete by primary key |
| `BatchGetItem` | Up to **100 items** from multiple tables |
| `BatchWriteItem` | Put/Delete up to **25 items** |
| `Query` | By partition key (+ optional sort key/filter) |
| `Scan` | Full table scan — **expensive** |
| `TransactWriteItems` / `TransactGetItems` | All-or-nothing batch |

### Scan vs Query
> ⚠️ Filter expressions on Scan still charge for ALL **scanned** items (ScannedCount), not just returned (Count).

### DynamoDB Streams
- Captures item-level changes in near-real time
- Retained for **24 hours**
- StreamViewType: `KEYS_ONLY`, `NEW_IMAGE`, `OLD_IMAGE`, `NEW_AND_OLD_IMAGES`
- Required for **Global Tables**
- Trigger Lambda via **Event Source Mapping**

### DynamoDB TTL
- Auto-expire items without consuming WCU
- Attribute must contain **Unix timestamp** (epoch)
- Deletion may be slightly delayed

### DynamoDB Best Practices
- Design partition key for **even distribution** (avoid hot partitions)
- Append random suffix when partition key has low cardinality
- **GSI WCU ≥ table WCU** to avoid main table throttling
- Use **Parallel Scan** for large tables (>20 GB) when RCU is underutilized
- Retry with **Exponential Backoff** on throttling
- Drop + recreate table to delete millions of records (saves RCU/WCU)

### DynamoDB Gotchas

| Scenario | Solution |
|---|---|
| GSI throttled on writes | Main table also throttled → increase GSI WCU |
| ThrottlingException (infrequent) | Retry with exponential backoff |
| Store large images | S3 for images; DynamoDB for metadata/URL |
| Delete millions of records | **Drop and recreate the table** |
| Order Date as partition key → hot partition | Append random suffix to partition key |
| Query on non-key attribute | Create a **GSI** |
| Items with same partition key (LSI) | LSI sorts by alternative sort key |
| Optimistic locking | Use `@DynamoDBVersionAttribute` (Java SDK) + condition expression |

---

## 9. RDS & Databases

### Multi-AZ vs Read Replicas vs Multi-Region

| Feature | Multi-AZ | Read Replicas | Multi-Region Read Replicas |
|---|---|---|---|
| Purpose | **High Availability** | **Scalability** (reads) | DR + local performance |
| Replication | **Synchronous** | Asynchronous | Asynchronous |
| Failover | **Automatic** (CNAME flipped) | Manual promotion | Manual |
| Serve reads? | **NO** (standby = passive) | YES | YES |

### RDS Key Gotchas
- Standby **cannot serve read traffic** — failover ONLY
- **Long-running queries do NOT trigger failover**
- Backup retention: default **7 days**, max **35 days**
- **Read replicas require backups enabled** (retention period > 0)
- Max read replicas: MySQL/MariaDB/PostgreSQL/Oracle = **5**; Aurora = **15**; SQL Server = **0**
- Manual snapshots retained even when DB is deleted; auto backups are deleted
- **To encrypt an unencrypted DB**: snapshot → encrypt snapshot → restore from encrypted snapshot
- **RDS Proxy**: connection pooling between app/Lambda and RDS (reduce connection overhead)
- Cannot SSH into RDS instances

### Aurora — Key Facts
- MySQL and PostgreSQL compatible
- 2 copies in **minimum 3 AZs** = **6 copies** total
- Up to **15 read replicas**
- Global Database: up to 5 secondary regions; **<1 second lag**
- Serverless option available

### Database Selection — Decision Table

| Scenario | Service |
|---|---|
| Millions of TPS, millisecond latency, schemaless | **DynamoDB** |
| Strong schema, complex queries, ACID transactions | **RDS** |
| OLAP analytics, petabyte-scale | **Redshift** |
| Graph relationships (fraud, social) | **Neptune** |
| Microsecond cache | **ElastiCache** |
| MongoDB compatible | **DocumentDB** |
| Cassandra compatible | **Keyspaces** |
| Time series / IoT data | **Timestream** |
| Immutable ledger (financial) | **QLDB** |

---

## 10. SQS, SNS & Messaging

### SQS — Key Configuration

| Config | Default | Min | Max |
|---|---|---|---|
| Visibility timeout | **30s** | 0 | **12 hours** |
| Message retention | **4 days** | 60s | **14 days** |
| Delay (DelaySeconds) | 0 | 0 | **15 minutes** |
| Max message size | — | — | **256 KB** (S3 Extended Client: 2 GB) |
| Long polling wait | 0 | 0 | **20 seconds** |
| Receive messages per call | — | 1 | **10** |
| MaxReceiveCount | — | — | Failures before DLQ |

### Standard vs FIFO Queue

| Feature | Standard | FIFO |
|---|---|---|
| Ordering | Best-effort | Exactly ordered |
| Delivery | At-least-once (may duplicate) | **Exactly-once** |
| Throughput | Unlimited | **300 msg/s** (3,000 with batching of 10) |
| Use case | Throughput matters | Order matters |

### SQS Message Flow
```
Producer → sends message → Queue
Consumer → polls → receives message + ReceiptHandle
Consumer processes → calls DeleteMessage(ReceiptHandle)
If NOT deleted within visibility timeout → message visible again
```

### SQS — Common Gotchas

| Scenario | Solution |
|---|---|
| Consumer takes longer than visibility timeout | Message reappears → call `ChangeMessageVisibility` before timeout |
| Failed message processing | Configure **Dead Letter Queue (DLQ)** after MaxReceiveCount failures |
| Message > 256 KB | **SQS Extended Client** (stores in S3; up to 2 GB) |
| Reduce API calls / cost | **Long Polling** (WaitTimeSeconds up to 20s) |
| Message disappeared / not processed | Exceeded **message retention period** (default 4 days) |
| High priority customers | Create **separate queues** per tier |
| Auto-scale consumers | `ApproximateNumberOfMessages` CloudWatch metric → target tracking |
| Deduplicate identical messages | FIFO queue: content-based OR explicit `MessageDeduplicationId` |

### SNS — Key Facts
- **Push model** — pub/sub pattern
- Message broadcast to **ALL** subscribers simultaneously
- Subscribers: SQS, Lambda, HTTP/S, Email, SMS, Mobile Push
- **SNS does NOT need SQS** to work independently
- **Fan-out pattern**: SNS → multiple SQS queues

### Amazon MQ
- Managed **Apache ActiveMQ**
- Supports: JMS, AMQP, MQTT, STOMP, OpenWire
- ✅ Use when migrating **on-premise message broker without code changes**
- ❌ Less scalable than SQS/SNS
- 🔑 **If exam mentions AMQP, JMS, or STOMP → Amazon MQ**

---

## 11. Kinesis — Streaming

### Kinesis Services

| Service | Purpose |
|---|---|
| **Data Streams** | Real-time stream processing; multiple consumers; **replay up to 7 days** |
| **Firehose** | Ingestion → S3, Elasticsearch, Redshift, Splunk; **no replay** |
| **Analytics** | SQL queries on streaming data |
| **Video Streams** | Video monitoring + ML integration |

### Kinesis Data Streams — Key Facts

| Fact | Value |
|---|---|
| Default retention | **1 day** |
| Max retention | **7 days** |
| Records per shard (write) | **1,000/second** |
| Max record size | **1 MB** |
| Ordering guarantee | **Within a shard** (not across shards) |
| Partition key | Routes record to specific shard |

### Kinesis APIs

| API | Description |
|---|---|
| `put-record` | Send one record; returns shard ID + sequence number |
| `put-records` | Up to **500 records** at once (higher throughput; recommended) |

### Kinesis Resharding
- **Split shard**: divide one into two (increase capacity)
- **Merge shards**: combine two into one (decrease capacity)
- `update-shard-count`: high-level command (handles split/merge automatically)
- **Best practice**: # consumer instances = # shards

### Kinesis vs SQS

| Dimension | Kinesis | SQS |
|---|---|---|
| Multiple consumers | YES (each tracks position independently) | NO (one consumer per message) |
| Ordering | Per shard | FIFO queue only |
| Replay | YES (up to 7 days) | NO (deleted = gone) |
| Message size | 1 MB | 256 KB (extended: 2 GB) |
| Use case | Real-time streaming, analytics, multiple consumers | Decoupling, async task queues |

### Kinesis Gotchas
- `ProvisionedThroughputExceededException` → increase shards (resharding) or retry with exponential backoff
- Kinesis is **NOT for batch ETL jobs** (use AWS Glue or EMR)
- Firehose buffers before delivery → adds latency; Kinesis Streams is near-real-time

---

## 12. CloudFront & Route 53

### CloudFront — Key Facts
- 200+ edge locations worldwide
- Sources: S3, EC2, ELB, external websites
- Default TTL: **24 hours**
- Zero cost: S3 ↔ CloudFront; CloudFront → same-region services

### CloudFront Private Content

| Method | When to Use |
|---|---|
| **Signed URLs** | Single file, RTMP distribution, when cookies not supported |
| **Signed Cookies** | Multiple files, subscriber websites (no URL change needed) |
| **Origin Access Identity (OAI)** | Restrict S3 so ONLY CloudFront can access it |

### CloudFront Cache Invalidation
- **Invalidation API**: for emergencies only
- **Best practice**: version objects in path (`profile.png?v=2` or `/images/v2/pic.png`)

### CloudFront Gotchas
- Do NOT use CloudFront if all traffic comes from **one location** or **corporate VPN**
- **Geo Restriction**: whitelist/blacklist countries
- CloudFront + WAF + Shield → DDoS protection
- Lambda@Edge: **Python and Node.js only**

### Route 53 Routing Policies

| Policy | Use Case |
|---|---|
| Simple | Single record → one or more IPs |
| Weighted | A/B testing, canary (10% → A, 90% → B) |
| Latency | Route to lowest-latency region |
| Failover | Active-passive; health check fails → DR site |
| Geolocation | Route by user's geographic location (country/continent) |
| Geoproximity | Route by geographic distance + configurable bias |
| Multivalue Answer | Up to **8** healthy records returned randomly |

### Route 53 Record Types
- **A**: Name → IPv4
- **AAAA**: Name → IPv6
- **CNAME**: Name → Name (**non-root domains only**)
- **Alias**: Name → AWS resource; works for **root AND non-root**; **free queries**

> ⚠️ **CNAME cannot be used for root domain** (`example.com`) — use Alias instead.

---

## 13. VPC & Networking

### VPC Components Quick Reference

| Concept | Key Point |
|---|---|
| Public Subnet | Has route to **Internet Gateway** |
| Private Subnet | No route to Internet Gateway |
| Internet Gateway | Enables internet for public subnets |
| NAT Gateway | Private subnets → internet (outbound only); managed; in public subnet |
| NAT Instance | EC2-based; you manage it; in public subnet |
| NACL | Stateless firewall at **subnet** level; allow AND deny rules |
| Security Group | Stateful firewall at **instance** level; allow rules only |
| VPC Peering | Private comms between VPCs; same or different account/region; **NOT transitive** |
| VPC Flow Logs | ACCEPT/REJECT traffic records → S3 or CloudWatch |
| VPC Endpoint (Gateway) | Private access to **S3 and DynamoDB** only; free |
| VPC Endpoint (Interface) | Private access to other services via PrivateLink; costs money |
| AWS Direct Connect | Private dedicated line from on-premises; setup takes **>1 month** |
| AWS VPN | IPsec tunnel over internet (encrypted); faster to set up |

### Security Group vs NACL

| Feature | Security Group | NACL |
|---|---|---|
| Level | Instance | Subnet |
| Rules | Allow only | Allow **AND** Deny |
| Stateful | **YES** (return traffic auto-allowed) | **NO** (must allow return traffic explicitly) |
| Evaluation | All rules evaluated | Rules by priority number (**lowest wins**) |
| Default | Deny all | Allow all (default NACL); Deny all (custom NACL) |

### Networking Gotchas
- Lambda inside VPC needs **NAT Gateway** for internet access
- NAT Gateway must be in a **public subnet**
- Direct Connect takes **>1 month** to set up (use VPN for faster connection)
- VPC Peering is **NOT transitive** (A↔B, B↔C doesn't mean A↔C)
- Default custom NACL: **denies all** inbound and outbound
- NACL rule numbers: **lower number = higher priority**

---

## 14. DevOps / CI/CD

### AWS DevOps Services

| Service | Purpose |
|---|---|
| **CodeCommit** | Git-based private source control |
| **CodeBuild** | Build + test; generates artifacts; output to S3 |
| **CodeDeploy** | Deploy to EC2, On-premises, Lambda, ECS |
| **CodePipeline** | Orchestrate complete CI/CD pipeline |
| **CodeStar** | End-to-end project dashboard (combines all above + JIRA) |

### CodeBuild
- Uses `buildspec.yml` at **root** of source directory
- Phases: `install → pre_build → build → post_build`
- Artifacts uploaded to **S3**
- Cannot access VPC by default → configure VPC ID, subnet IDs, security groups
- Can run locally: install **AWS CodeBuild agent**

### CodeDeploy — Deployment Types

| Type | Supported Platforms | Description |
|---|---|---|
| In-place | **EC2 / On-premises ONLY** | Stop → deploy → start |
| Blue/Green | EC2, Lambda, ECS | New env → shift traffic → (optionally) terminate old |

> ⚠️ **Blue/Green is NOT supported for on-premises** instances.
> ⚠️ **Lambda and ECS support Blue/Green ONLY** (no in-place).
> ✅ **EC2 supports both** in-place and Blue/Green.

### CodeDeploy — Traffic Shifting Options

| Option | Description |
|---|---|
| Canary | X% first for N minutes, then 100% |
| Linear | X% every N minutes until 100% |
| All-at-once | All traffic shifted immediately |

### CodeDeploy — Hook Order (EC2 In-Place)
```
ApplicationStop → DownloadBundle → BeforeInstall → Install →
AfterInstall → ApplicationStart → ValidateService
```
> ❌ Cannot script: `Start`, `DownloadBundle`, `Install`, `AllowTraffic`, `End`

### CodeDeploy — Lambda Hooks
```
BeforeAllowTraffic → [traffic shifts] → AfterAllowTraffic
```

### CodeDeploy — ECS Hooks
```
BeforeInstall → AfterInstall → AfterAllowTestTraffic → BeforeAllowTraffic → AfterAllowTraffic
```

### CodeDeploy Rollbacks
- **Automatic**: on failed deployment or CloudWatch alarm breach
- **Manual**: redeploy old revision as a new deployment

### AppSpec + BuildSpec Files

| File | Tool | Format | Location |
|---|---|---|---|
| `appspec.yml` or `appspec.json` | CodeDeploy | YAML or JSON | **Root** of repo |
| `buildspec.yml` | CodeBuild | **YAML only** | **Root** of repo |

### CodePipeline — Triggers
- CodeCommit, GitHub, Bitbucket, GitHub Enterprise
- S3 bucket changes
- Amazon ECR repository changes
- Manual approval actions (add approval stage to pipeline)

---

## 15. CloudFormation & SAM

### CloudFormation Template Sections

| Section | Required? | Purpose |
|---|---|---|
| **Resources** | ✅ **YES** (only mandatory) | AWS resources to create |
| Parameters | No | Runtime input values |
| Mappings | No | Key-value lookup tables |
| Conditions | No | Conditional resource creation |
| Outputs | No | Export values; max **60** outputs |
| Metadata | No | Additional info |
| Transform | No | Macros (SAM, CodeDeployBlueGreen) |

### Important Intrinsic Functions

| Function | Purpose |
|---|---|
| `!Ref` | Reference a resource or parameter |
| `!GetAtt` | Get specific attribute of a resource |
| `!FindInMap` | Look up value in Mappings section |
| `!Join` | Concatenate values with delimiter |
| `!Select` | Get value at index from list |
| `!Sub` | String substitution |
| `!ImportValue` | Reference exported output from another stack |
| `!If` | Conditional value selection |

### Pseudo Parameters (predefined by AWS)
- `AWS::AccountId`, `AWS::Region`, `AWS::StackId`, `AWS::StackName`

### DeletionPolicy Options

| Policy | Behavior |
|---|---|
| `Delete` (default) | Resource deleted when stack is deleted |
| `Retain` | Resource kept after stack deletion |
| `Snapshot` | Takes snapshot before deletion (RDS, EBS, ElastiCache) |

### Nested Stacks vs Cross-Stack Reference

| | Nested Stack | Cross-Stack Reference |
|---|---|---|
| Resource | **Recreated** | Reused (not recreated) |
| Mechanism | `AWS::CloudFormation::Stack` resource | `Export` output + `!ImportValue` |
| Use case | Template/pattern reuse | Share existing resources across stacks |

### CloudFormation Gotchas
- Deleting a stack deletes ALL resources **except** those with `DeletionPolicy: Retain`
- Enable **termination protection** to prevent accidental stack deletion
- Python helper scripts on EC2: `cfn-init`, `cfn-signal`, `cfn-hup`, `cfn-get-metadata`
- `CreationPolicy`: wait for signals before marking resource complete
- `UpdatePolicy`: controls how ASG handles stack updates (rolling, replacing)
- **StackSets**: deploy same template across multiple accounts and regions

### SAM (Serverless Application Model)

| SAM Resource | Description |
|---|---|
| `AWS::Serverless::Function` | Lambda Function |
| `AWS::Serverless::Api` | API Gateway REST API |
| `AWS::Serverless::HttpApi` | API Gateway HTTP API |
| `AWS::Serverless::SimpleTable` | DynamoDB Table |
| `AWS::Serverless::LayerVersion` | Lambda Layer |
| `AWS::Serverless::StateMachine` | Step Functions |

### SAM Required Sections
```yaml
Transform: AWS::Serverless-2016-10-31  # MANDATORY
Resources:                              # MANDATORY
  ...
```

### SAM CLI Commands

| Command | Purpose |
|---|---|
| `sam init` | Initialize new serverless app |
| `sam validate` | Validate template |
| `sam build` | Build application |
| `sam local invoke` | Test Lambda locally |
| `sam package` | Bundle + upload to S3 |
| `sam deploy` | Deploy to AWS (also does package) |
| `sam logs` | View Lambda logs |

### SAM — Gotchas
- Deployment package stored in **S3 bucket**
- SAM has **no cost** — pay only for provisioned resources
- `sam deploy` also does `sam package` (no need to run both)
- SAM supports CodeDeploy: Canary, Linear, All-at-once traffic shifting

---

## 16. Elastic Beanstalk

### Key Concepts
- **Application**: container for environments, versions, configuration
- **Application Version**: specific deployable code stored in S3
- **Environment**: running version + AWS resources
- **Environment Tier**: Web Server (ELB+ASG+EC2) or Worker (SQS+ASG+EC2)

### Deployment Methods — Full Comparison

| Method | Downtime? | New Instances? | Rollback Speed | Extra Cost? |
|---|---|---|---|---|
| All at once | **YES (brief)** | NO | Re-deploy manually | Cheapest |
| Rolling | NO (reduced capacity) | NO | Re-deploy manually | Free |
| Rolling with additional batch | NO | **YES** (new batch first) | Re-deploy manually | Small |
| Immutable | NO | **YES** (new ASG) | Terminate new ASG (fast) | 2× capacity |
| Traffic splitting (Canary) | NO | **YES** | Reroute 100% back | Small |
| Blue/Green (swap URL) | NO | **YES** (full env) | Swap URL back (instant) | 2× cost |

### EB Gotchas

| Fact | Detail |
|---|---|
| Worker tier | **SQS** queue + ASG + EC2 |
| Web tier (single instance) | EC2 + Elastic IP |
| Web tier (load-balanced) | ELB + ASG + EC2 |
| Source bundle | One ZIP or WAR; max **512 MB**; **no parent folder** |
| Config files | `.config` extension in `.ebextensions/` folder (YAML or JSON) |
| DB in EB env | DB deleted when env deleted — use **external RDS** for prod |
| Old version cleanup | Configure **lifecycle policy** to delete old versions |
| Schedule tasks | `cron.yaml` in worker tier |
| Logs | S3 or CloudWatch Logs |
| EB uses | CloudFormation under the hood |

---

## 17. ECS, Fargate & Docker

### ECS Concepts

| Concept | Description |
|---|---|
| Cluster | Group of EC2 instances (or Fargate tasks) |
| Task Definition | Blueprint: Docker image, CPU/memory, IAM role, ports, volumes |
| Task | Running instance of a task definition |
| Service | Maintains desired count of running tasks |
| Container Instance | EC2 + ECS agent installed |

### Task Placement Strategies

| Strategy | Description |
|---|---|
| `binpack` | Minimize number of instances (pack containers tightly by CPU/memory) |
| `random` | Random placement |
| `spread` | Even spread by `instanceId` or `attribute:ecs.availability-zone` |

### Task Placement Constraints
- `distinctInstance` — each task on a different container instance
- `memberOf` — cluster query language (e.g., `attribute:ecs.instance-type = t2.micro`)

### ECS IAM Roles — Two Types

| Role | Purpose |
|---|---|
| **Task IAM Role** | Permissions for your app (e.g., access DynamoDB, S3) |
| **Task Execution Role** | ECS agent: pull from ECR, publish logs to CloudWatch |

> ✅ **Best practice**: 10 microservices → 10 task definitions → 10 task IAM roles with individual permissions.

### ECS + ALB
- **Dynamic host port mapping**: multiple tasks of same service on same EC2 instance
- **Path-based routing**: route to different services on same ALB listener

### ECS vs Fargate vs EKS

| | ECS (EC2) | Fargate | EKS |
|---|---|---|---|
| Infra management | You manage EC2 | AWS manages | You manage (Kubernetes) |
| Kubernetes? | NO | NO | **YES** |
| Visibility | Full EC2 visibility | NO EC2 visibility | Full |
| Use case | Custom EC2 needs | Serverless containers | Kubernetes migration |

### ECR — Key Commands
```bash
# Login
aws ecr get-login-password --region $REGION | docker login --username AWS \
  --password-stdin <account>.dkr.ecr.<region>.amazonaws.com

# Push image
docker tag myapp:latest <account>.dkr.ecr.<region>.amazonaws.com/myapp:latest
docker push <account>.dkr.ecr.<region>.amazonaws.com/myapp:latest
```

---

## 18. Amazon Cognito

### User Pools vs Identity Pools

| Feature | User Pools | Identity Pools |
|---|---|---|
| Purpose | **Authentication** (sign-up/sign-in) | **Authorization** (AWS resource access) |
| Output | JWT tokens (ID, Access, Refresh) | Temporary AWS credentials (STS) |
| External IdP | OIDC, SAML, Social (Google, FB) | OIDC, SAML, Social, User Pools |
| Guest/Anonymous access | ❌ NO | ✅ YES |
| Integrates with | ALB, API Gateway | IAM policies, DynamoDB |

### When to Use Which

| Scenario | Solution |
|---|---|
| Sign-up, sign-in, password reset pages | **User Pool** |
| MFA, email/phone verification | **User Pool** |
| Access AWS resources via social login | **Identity Pool** |
| Anonymous/guest access to AWS resources | **Identity Pool** |
| Enterprise SAML federation for AWS access | **Identity Pool** |
| DynamoDB — user accesses own items only | **Identity Pool + `dynamodb:LeadingKeys` condition** |

### Cognito User Pool Lambda Triggers

| Trigger | When It Fires | Use Case |
|---|---|---|
| Pre Authentication | Before sign-in | Accept or deny sign-in |
| Post Authentication | After sign-in | Event logging, analytics |
| Pre Token Generation | Before token issued | Customize token claims |
| Pre Sign-up | Before registration | Accept or deny registration |
| Post Confirmation | After email/phone verified | Welcome email, analytics |
| Migrate User | On login from old system | Migrate users from existing directory |

---

## 19. CloudWatch, X-Ray & CloudTrail

### CloudWatch Metrics — Key EC2 Metrics
- `CPUUtilization`, `NetworkIn`, `NetworkOut`
- `StatusCheckFailed_System` — AWS infrastructure issue
- `StatusCheckFailed_Instance` — your software/network issue
- ⚠️ **Memory is NOT a default CloudWatch metric** — install **CloudWatch Agent**
- Default EC2 collection: every **5 minutes**; enable detailed monitoring for **1 minute**

### CloudWatch Custom Metrics
- Use `PutMetricData` API
- Standard resolution: **1 minute**; High resolution: **1 second** (expensive)
- High resolution alarms: can trigger every **10 or 20 seconds**

### CloudWatch Alarms — Terminology
- **Period**: length of time to evaluate metric into one data point
- **Evaluation Period**: number of most recent periods to check
- **Datapoints to Alarm**: how many periods must breach threshold
- States: `OK`, `ALARM`, `INSUFFICIENT_DATA`

### CloudWatch Logs
- Default retention: **forever** (configure expiry at log group level)
- Archive to S3: ~**12 hour delay**
- Lambda log group: `/aws/lambda/<function-name>`
- Metric Filters: only capture **future** events (not retroactive)

### X-Ray — Architecture
```
1. Code uses X-Ray SDK (interceptors, client handlers, HTTP client)
2. App sends traces to X-Ray Daemon (UDP port 2000)
3. Daemon batches and sends to X-Ray service
```

### X-Ray — Trace Hierarchy
```
Trace → Segments → Subsegments
```
- **Annotations**: key-value pairs; **indexed** → searchable in filter expressions
- **Metadata**: key-value pairs; **NOT indexed** → cannot be searched
- **Sampling**: reduce performance impact; default = first request + 5% of the rest

### X-Ray — Integration by Platform

| Platform | Setup |
|---|---|
| Lambda | Enable tracing + execution role permissions |
| Elastic Beanstalk | Enable tracing in `.ebextensions` config |
| EC2 | Install X-Ray daemon; assign IAM role |
| ECS | Use Daemon container image (`amazon/aws-xray-daemon`) |
| On-premises | Install daemon; configure IAM user credentials |

### CloudTrail vs CloudWatch vs Config

| Service | Answers |
|---|---|
| **CloudWatch** | Is my app working? Metrics, logs, alarms |
| **CloudTrail** | Who did what? API call history, compliance audit |
| **Config** | What does my resource look like? Inventory, change history, compliance rules |
| **X-Ray** | How is my request flowing? Distributed tracing |

---

## 20. ElastiCache & DAX

### Memcached vs Redis

| Feature | Memcached | Redis |
|---|---|---|
| Persistence | ❌ NO | ✅ YES |
| Replication / Failover | ❌ NO | ✅ YES |
| Backup / Restore | ❌ NO | ✅ YES |
| Encryption (at-rest + in-transit) | ❌ NO | ✅ YES |
| Pub/Sub messaging | ❌ NO | ✅ YES |
| Data structures | Simple key-value | Rich (strings, lists, sets, sorted sets) |
| Horizontal scaling | ✅ YES (auto-discovery) | ✅ YES (cluster mode) |
| Use case | Simple caching, session store | Everything else; persistence needed |

> 🔑 **Memcached**: simple, fast, no durability
> 🔑 **Redis**: persistence + replication + pub/sub + encryption

### Caching Strategies

| Strategy | Description | Pros | Cons |
|---|---|---|---|
| Lazy Loading (Cache-Aside) | Check cache first; miss → load from DB + cache it | Only cache what's needed | Possible stale data; 3 steps on miss |
| Write-Through | Update cache + DB on every write | Never stale | Cache may grow large; writes slower |

### DAX (DynamoDB Accelerator)
- In-memory cache for DynamoDB → **microsecond** responses
- **Write-through** caching strategy
- ✅ For read-heavy workloads with hot items
- ✅ Very few code changes needed
- ❌ NOT for **strongly consistent reads**
- ❌ NOT for write-heavy, read-light workloads

### Session Store Comparison

| Service | Latency | Durability | Notes |
|---|---|---|---|
| ElastiCache Memcached | Microseconds | LOW (lost on crash) | Fastest; no persistence |
| ElastiCache Redis | Microseconds | HIGH (with replication) | Can withstand failures |
| DynamoDB | Milliseconds | HIGH | Most durable |

### ElastiCache vs DAX

| | DAX | ElastiCache |
|---|---|---|
| Purpose | DynamoDB-specific | Generic cache |
| Code changes | Minimal | More extensive |
| Best for | DynamoDB read-heavy | RDS caching, sessions, general |

---

## 21. STS & Federation

### STS APIs — Full Reference

| API | Use Case | MFA Supported | Expiry |
|---|---|---|---|
| `AssumeRole` | Cross-account; custom identity broker | YES | 1 hr |
| `AssumeRoleWithSAML` | Enterprise SAML IdP | NO | 1 hr |
| `AssumeRoleWithWebIdentity` | Social login (Cognito, Google, FB) | NO | 1 hr |
| `GetSessionToken` | Same account with MFA protection | YES | 12 hrs |
| `GetFederationToken` | Console login via custom broker | NO | 12 hrs |
| `DecodeAuthorizationMessage` | Debug encoded authorization errors | — | — |
| `GetCallerIdentity` | Who am I? (IAM user/role identity) | — | — |

### STS Key Facts
- Global service at `https://sts.amazonaws.com`
- Use **regional STS endpoints** for lower latency
- Tokens are temporary → more secure than IAM users

---

## 22. Storage

### EBS vs Instance Store

| Feature | EBS | Instance Store |
|---|---|---|
| Attachment type | Network-attached | Physically attached |
| Lifecycle | **Independent** of EC2 | **Tied** to EC2 |
| Snapshots | YES | NO |
| I/O Speed | Lower (network latency) | **2–100× faster** |
| Persistence | YES | **Ephemeral** (lost on stop/terminate) |
| Cost | Pay per GB provisioned | Included in EC2 cost |
| Boot time | Fast | Slow (up to 5 min) |
| Use case | Permanent storage, databases | Cache, temp files, scratch |

### EBS Volume Types (Quick Reference)

| Type | Kind | Use Case |
|---|---|---|
| gp2/gp3 | SSD | General purpose; boot volumes |
| io1/io2 | SSD | High IOPS; databases |
| st1 | HDD | Streaming, big data |
| sc1 | HDD | Cold, infrequent access |

### S3 Glacier — Key Differences from S3

| Feature | Amazon S3 | S3 Glacier |
|---|---|---|
| Terminology | Objects in Buckets | Archives in Vaults |
| Keys | User-defined | System-generated |
| Mutability | Update allowed | Immutable (cannot update archive) |
| Max size | 5 TB per object | 40 TB per archive |
| Console | Full access | Vault operations only |
| Encryption | Optional | **Mandatory** (AES-256) |

### AWS Storage Gateway — Decision Table

| Scenario | Solution |
|---|---|
| On-prem file share → cloud (NFS/SMB) | **File Gateway** (→ S3) |
| Replace physical tapes | **Tape Gateway** (virtual tapes → S3/Glacier) |
| Block storage, primary on-prem + DR | **Volume Gateway Stored** |
| Block storage, primary in S3 + local cache | **Volume Gateway Cached** |

### File System Options

| Scenario | Service |
|---|---|
| Shared file system, Linux | **EFS** |
| Shared file system, Windows | **FSx for Windows File Server** |
| High-performance computing | **FSx for Lustre** |

---

## 23. Step Functions & Other Services

### Step Functions
- Serverless workflow orchestration
- Visual workflow; max duration **1 year**
- Retry failed steps; conditional branching
- Integrates with Lambda, DynamoDB, SNS, SQS, ECS, Fargate, API Gateway
- Human approval workflows via API Gateway integration

### Step Functions vs SWF

| Feature | Step Functions | SWF |
|---|---|---|
| Recommended | ✅ For new apps | Only for complex orchestration code |
| Max duration | 1 year | 1 year |
| External signals | Limited | YES |
| Code required | Less | More |

### Parameter Store vs Secrets Manager

| Feature | Parameter Store | Secrets Manager |
|---|---|---|
| Cost | **Free** (standard tier) | Pay per secret |
| Automatic rotation | ❌ NO (manual only) | ✅ **YES** (RDS, Redshift, DocumentDB) |
| Encryption | Via KMS (optional) | KMS **mandatory** |
| Use case | App config + some secrets | Secrets requiring rotation |
| Hierarchy | YES (path-based) | YES |

### AWS AppSync
- **GraphQL-based** managed service
- Sync app data across devices; works offline → syncs when back online
- Backend: NoSQL (DynamoDB), RDS, Lambda
- **Replaces Cognito Sync** for most use cases

### AWS Global Accelerator
- Routes traffic to optimal endpoints over **AWS global network**
- Provides **2 static anycast IP addresses**
- Works with NLB, ALB, EC2, Elastic IPs
- Solves: cached DNS delays, high latency for global users
- Different from CloudFront: Global Accelerator is for non-HTTP use cases or when static IPs are required

### CORS — Quick Reference
```
Browser sends preflight OPTIONS request
Server must respond with:
  Access-Control-Allow-Origin: https://www.example.com
  Access-Control-Allow-Methods: GET, POST, OPTIONS
  Access-Control-Allow-Headers: Authorization
```
- S3 CORS: configure on the **image/asset bucket** to allow origin of the frontend bucket
- API Gateway CORS: enable on API Gateway (for proxy integration, also return headers from Lambda)

---

## 24. Scenario-Based Decision Tables

### Compute Decision Table

| Scenario | Answer |
|---|---|
| Simple web app, auto scaling, managed platform | **Elastic Beanstalk** |
| Containerized microservices, no EC2 management | **Fargate** |
| Containerized microservices, control over EC2 | **ECS** |
| Kubernetes workloads | **EKS** |
| Event-driven, short-running functions | **Lambda** |
| Batch processing | **AWS Batch** |
| Spot instance, fault tolerant batch | **EC2 Spot** |

### Storage Decision Table

| Scenario | Answer |
|---|---|
| Object storage, static website | **S3** |
| Block storage for EC2 | **EBS** |
| Fastest I/O, temporary data for EC2 | **Instance Store** |
| Shared file storage for Linux | **EFS** |
| Shared file storage for Windows | **FSx for Windows** |
| High-performance computing storage | **FSx for Lustre** |
| Archive, regulatory compliance | **S3 Glacier / Glacier Deep Archive** |
| Hybrid on-prem + cloud file storage | **Storage Gateway** |

### Messaging Decision Table

| Scenario | Answer |
|---|---|
| Decouple microservices, async | **SQS** |
| Fan-out to multiple subscribers | **SNS** |
| Ordered, exactly-once processing | **SQS FIFO** |
| Real-time streaming, multiple consumers, replay | **Kinesis Data Streams** |
| Stream to S3/Elasticsearch (no replay) | **Kinesis Firehose** |
| SQL queries on streams | **Kinesis Analytics** |
| Migrate on-prem AMQP/JMS broker | **Amazon MQ** |
| Serverless workflow orchestration | **Step Functions** |

### Authorization Decision Table

| Scenario | Answer |
|---|---|
| AWS users in same account | **IAM-based auth** |
| App users with sign-up/sign-in | **Cognito User Pool** |
| OAuth/SAML third-party token | **Lambda Authorizer** |
| AWS resource access via social login | **Cognito Identity Pool** |
| Enterprise SAML to AWS resources | **Cognito Identity Pool** or **IAM SAML Federation** |
| Public API | **Open (no auth)** |

### Performance Decision Table

| Bottleneck | Solution |
|---|---|
| Lambda too slow | Increase **memory** (CPU scales with it) |
| Lambda cold starts | **Provisioned Concurrency** |
| RDS read overload | **Read Replicas** |
| DynamoDB reads (hot items) | **DAX** (microseconds) |
| General caching / sessions | **ElastiCache** |
| Global content delivery | **CloudFront** |
| High latency for global users | **Route 53 Latency policy** + multi-region |
| S3 uploads slow globally | **S3 Transfer Acceleration** |
| Large DynamoDB table scan | **Parallel Scan** |

### Security Decision Table

| Scenario | Answer |
|---|---|
| Encrypt data at rest | **KMS** |
| Encrypt data <4KB directly | **KMS Encrypt API** |
| Encrypt large data | **Envelope Encryption** (GenerateDataKey) |
| Dedicated hardware HSM | **CloudHSM** |
| Auto-rotate secrets (DB passwords, API keys) | **AWS Secrets Manager** |
| App configuration values | **SSM Parameter Store** |
| Corporate directory SAML → AWS | **IAM SAML Identity Provider** |
| Cross-account access | **IAM Role + STS AssumeRole** |
| Enforce HTTPS on S3 | Bucket policy with `aws:SecureTransport: false` deny |

---

## 25. Critical Numbers Cheat Sheet

### Lambda
| Item | Value |
|---|---|
| Max timeout | **900 seconds** (15 min) |
| Default timeout | **3 seconds** |
| Memory range | **128 MB – 3,008 MB** (64 MB increments) |
| /tmp storage | **512 MB** |
| Env variables max | **4 KB** |
| Max layers | **5** |
| Concurrency default | **1,000 per region** |
| Deployment package (direct) | **50 MB** zipped |
| Deployment package (unzipped) | **250 MB** |
| Throttling code | **429** |

### API Gateway
| Item | Value |
|---|---|
| Max integration timeout | **30 seconds** |
| Account-level throttle | **10,000 RPS** |
| Burst limit | **5,000** |
| Cache TTL default | **300 seconds** |
| Cache TTL max | **3,600 seconds** |

### SQS
| Item | Value |
|---|---|
| Visibility timeout default | **30 seconds** |
| Visibility timeout max | **12 hours** |
| Message retention default | **4 days** |
| Message retention max | **14 days** |
| Delay max | **15 minutes** |
| Max message size | **256 KB** |
| Extended Client max | **2 GB** (via S3) |
| Long poll max | **20 seconds** |
| Max messages per receive | **10** |
| FIFO throughput | **300/s** (3,000 with batching) |

### DynamoDB
| Item | Value |
|---|---|
| Max item size | **400 KB** |
| LSI hard limit | **5 per table** |
| GSI default limit | **20 per table** |
| Streams retention | **24 hours** |
| Point-in-time recovery max | **35 days** |

### S3
| Item | Value |
|---|---|
| Max object size | **5 TB** |
| Multipart upload mandatory | **>4 GB** (recommended >100 MB) |
| Pre-signed URL max | **7 days** |
| PUT RPS per prefix | **3,500** |
| GET RPS per prefix | **5,500** |

### Kinesis
| Item | Value |
|---|---|
| Default retention | **1 day** |
| Max retention | **7 days** |
| Records per shard | **1,000/second** |
| Max record size | **1 MB** |
| Max records per put-records | **500** |

### KMS
| Item | Value |
|---|---|
| Max direct encryption size | **4 KB** |
| Min key deletion wait | **7 days** |
| Key auto-rotation | **1 year** |
| Request quota | **5,500–30,000 req/sec** |

### RDS
| Item | Value |
|---|---|
| Default backup retention | **7 days** |
| Max backup retention | **35 days** |
| Max read replicas (MySQL etc) | **5** |
| Max read replicas (Aurora) | **15** |
| SQL Server read replicas | **0** |

### Other
| Item | Value |
|---|---|
| CloudFront default TTL | **24 hours** |
| CloudWatch metric expiry | **15 months** |
| CloudWatch standard resolution | **1 minute** |
| CloudWatch high resolution | **1 second** |
| EB source bundle max | **512 MB** |
| Step Functions max duration | **1 year** |
| Spread placement group | Max **7 instances/AZ** |
| Partition placement group | Max **7 partitions/AZ** |
| ASG default cooldown | **300 seconds** |
| SQS deregistration delay default | **300 seconds** |
| Route 53 Multivalue max records | **8** |

---

## 26. HTTP Status Codes

| Code | Meaning | Common AWS Cause |
|---|---|---|
| 200 | OK | Successful request |
| 400 | Bad Request | Malformed request |
| 401 | Unauthorized | Authentication failure |
| 403 | Forbidden | Authorization failure (IAM policy denied) |
| 404 | Not Found | Resource doesn't exist |
| 429 | Too Many Requests | API Gateway / Lambda **throttling** |
| 500 | Internal Server Error | Lambda crash, integration failure |
| 502 | Bad Gateway | Lambda returned invalid response to API GW |
| 503 | Service Unavailable | Origin unreachable / downstream failure |
| 504 | Gateway Timeout | API GW integration timeout (Lambda > 30s) |

### DynamoDB Error Codes

| Error | Cause |
|---|---|
| `ConditionalCheckFailedException` | Condition expression evaluated to false |
| `ProvisionedThroughputExceededException` | RCU/WCU exceeded for table/GSI |
| `ThrottlingException` | Too many table operations (Create/Update/Delete table) |
| `ResourceNotFoundException` | Table doesn't exist |
| `ValidationException` | Invalid request (wrong data type, etc.) |

---

## 27. Last-Minute Gotcha Master List

### Lambda
1. **Lambda scales OUT** (more instances), NOT up (bigger instances)
2. **Environment variables are locked** when a Lambda version is published → publish new version to change them
3. **Event Source Mapping is used by** SQS, Kinesis, DynamoDB Streams — **NOT** S3 or SNS
4. Lambda inside VPC needs **NAT Gateway** for internet access
5. Lambda timeout max is **900 seconds** but API Gateway times out at **30 seconds**

### API Gateway
6. **API Gateway max timeout = 30 seconds** regardless of Lambda's timeout
7. **Cache-Control: max-age=0** header lets client invalidate a cache entry
8. HTTP API is cheaper and simpler; REST API has more features (caching, transforms, WAF)

### DynamoDB
9. **Filter expressions on Scan still charge for ALL scanned items** (ScannedCount, not filtered Count)
10. **GSI throttling = main table also gets throttled** → keep GSI WCU ≥ table WCU
11. **LSIs must be defined at table creation** — cannot add/remove later
12. **GSI does not support strongly consistent reads**
13. Dropping and recreating a table is more efficient than deleting millions of items

### S3
14. **S3 replication requires versioning on BOTH** source and destination buckets
15. **Versioning once enabled cannot be turned off** — only suspended
16. **Object Lock can only be enabled on new buckets**

### IAM & Security
17. **KMS max direct encryption = 4 KB** — use Envelope Encryption for larger data
18. **IAM is a global service** — users/roles are not region-specific
19. **Elastic IP is charged when NOT associated** or when attached instance is stopped

### Networking
20. **NACL is stateless** — must explicitly allow return traffic; Security Groups are stateful
21. **VPC Peering is NOT transitive** (A↔B and B↔C does not mean A↔C)
22. **NAT Gateway must be in a public subnet**
23. **Direct Connect setup takes >1 month**

### ELB & Auto Scaling
24. **Classic Load Balancer does NOT support multiple target groups**
25. **Multi-AZ standby CANNOT serve read traffic** — failover only
26. **Long-running queries and deadlocks do NOT trigger RDS failover**

### DevOps
27. **CodeDeploy Blue/Green is NOT supported for on-premises**
28. **Lambda and ECS CodeDeploy = Blue/Green only** (no in-place)
29. **buildspec.yml (CodeBuild) = YAML only**; appspec (CodeDeploy) = YAML or JSON
30. Both `appspec.yml` and `buildspec.yml` belong at the **root** of the repo

### Cognito
31. **User Pools** = authentication (sign-up/sign-in); **Identity Pools** = authorization (AWS credentials)
32. Use `dynamodb:LeadingKeys` condition with Cognito Identity to restrict users to their own items

### Caching
33. **DAX is for DynamoDB only** — ElastiCache is generic
34. **Memcached** = no persistence, no replication; **Redis** = everything
35. **Lazy Loading** can have stale data; **Write-Through** never has stale data

### Misc
36. **Kinesis ordering guaranteed per shard**, not across shards
37. **Amazon MQ** → when exam mentions AMQP, JMS, STOMP, OpenWire (on-premise migration)
38. **Alias records** work for root domain; CNAME cannot be used for root domain
39. **CloudWatch does NOT collect EC2 memory metrics by default** — install CloudWatch Agent
40. **Termination Protection** does NOT protect against ASG, Spot, or OS shutdown

---

## 28. Screenshot Practice Question Insights

> These are real exam-style questions you got wrong or flagged — memorize these patterns.

---

### 🔑 KMS: Direct Encryption vs Envelope Encryption — DEEP DIVE

From Image 1 — this is a **frequently tested topic**:

| Feature | Direct KMS Encryption | Envelope Encryption |
|---|---|---|
| Data Size Limit | **Hard limit of 4 KB** per API call | **No limit** — can encrypt GBs or TBs |
| How it Works | Send raw data to AWS KMS | KMS provides a **Data Key**; you encrypt data **locally** |
| Performance | Slower — every 4 KB requires a network round-trip to AWS | **Faster** — data processed at memory speed on your server |
| Cost | High for large data; charged per 4 KB chunk | **Low** — typically costs only **one API call** regardless of data size |
| Security | One KMS key protects all your data directly | **Defense-in-depth** — each object has a unique data key protected by KMS |

**Exam Trap:** "Encrypt a 1 GB file with KMS" → answer is always **Envelope Encryption** using `GenerateDataKey`. You cannot use the `Encrypt` API directly (4 KB limit).

**When each API is called:**
```
Storing data:   GenerateDataKey → encrypt locally → store (encrypted data + encrypted data key)
Retrieving data: Decrypt (data key) → decrypt data locally
```

---

### 🔑 Step Functions — State Types (Q49)

**Question pattern:** "Which state represents a single unit of work performed by a state machine?"

**Answer: Task State** ✅

| State Type | Description |
|---|---|
| **Task** | Single unit of work — calls a Lambda, ECS task, activity, etc. |
| Choice | Conditional branching (like if/else) |
| Wait | Delays execution for a time period |
| Pass | Passes input to output (no work done) |
| Succeed | Stops execution successfully |
| Fail | Stops execution with failure |
| Parallel | Runs branches in parallel |
| Map | Iterates over items in an array |

> ⚠️ **Gotcha:** "Task" state ≠ ECS task. In Step Functions, a Task state can invoke Lambda, ECS, SNS, SQS, Glue, and many others.

---

### 🔑 SSM Parameter Store — Hierarchical Paths (Q from Images 3-4)

**Question pattern:** "How should an app fetch environment-specific variables and credentials without code changes?"
**Answer: SSM Parameter Store with hierarchical unique paths** ✅ (NOT KMS — KMS is not a key-value store)

**Key facts about Parameter Store hierarchies:**
- Use forward slashes (`/`) to define hierarchy
- Max **15 levels** deep
- Examples:
  ```
  /Dev/DBServer/MySQL/db-string
  /Staging/DBServer/MySQL/db-string
  /Prod/DBServer/MySQL/db-string
  /MyApp/.NET/Libraries/my-password
  /Finance/Accountants/UserList
  ```
- Query all params in a hierarchy: **`GetParametersByPath`** API
  ```bash
  aws ssm get-parameters-by-path --path /Dev/Web/IIS
  # With decryption:
  aws ssm get-parameters-by-path --path /Prod/ERP/SAP --with-decryption
  ```
- Root parameters (no hierarchy) are still valid: `/parameter-name` or `parameter-name`

**Why NOT KMS?** KMS manages cryptographic keys — it is NOT a key-value config store.
**Why NOT environment variables?** Changing them requires redeployment; SSM allows changes without redeploy.

---

### 🔑 SAM Template Mandatory Sections (Q52)

**Question:** "Other than Resources, which SAM section is mandatory?"
**Answer: Transform** ✅

```yaml
Transform: AWS::Serverless-2016-10-31   # MANDATORY
Resources:                               # MANDATORY
  MyFunction:
    Type: AWS::Serverless::Function

# All others are OPTIONAL:
Globals:      # optional (SAM-specific, no CloudFormation equivalent)
Description:  # optional
Metadata:     # optional
Parameters:   # optional
Mappings:     # optional
Conditions:   # optional
Outputs:      # optional
```

> ⚠️ **Gotcha:** `Globals` is optional — even though it appears in most SAM templates, it is NOT mandatory. Many people incorrectly pick Globals.

---

### 🔑 Elastic Beanstalk Deployment — FULL CAPACITY + MINIMAL FAILURE IMPACT (Q53)

**Question pattern:** "Which deployment maintains FULL capacity AND has MINIMAL impact of failed deployment?"
**Answer: Immutable** ✅ (NOT "Rolling with additional batch")

**Why each option fails:**

| Option | Full Capacity? | Minimal Failure Impact? | Why Wrong |
|---|---|---|---|
| All at once | NO (downtime) | NO (everything down) | Worst option |
| Rolling | NO (batches taken offline) | NO (some batches run new version) | Reduced capacity |
| Rolling with additional batch | YES (adds extra batch) | NO (existing instances also updated) | Failure mid-roll is complex |
| **Immutable** ✅ | **YES** | **YES (just terminate new ASG)** | **Correct answer** |
| Traffic Splitting | YES | Partial | Only % of users affected |

**Why Immutable wins:**
- Launches a **completely new Auto Scaling group** alongside the old one
- New version serves traffic alongside old ONLY after passing health checks
- Failure = **just terminate the new ASG** — old version untouched
- Rollback is instant and safe

**Rolling with additional batch** = maintains bandwidth/capacity, BUT deploys to BOTH new AND existing instances — failure mid-deployment is harder to recover from.

**Official Elastic Beanstalk Deployment Comparison Table:**

| Method | Failed Deployment Impact | Zero Downtime | No DNS Change | Rollback Process | Deployed To |
|---|---|---|---|---|---|
| All at once | Downtime | ❌ No | ✅ Yes | Manual redeploy | Existing |
| Rolling | Single batch out of service | ✅ Yes | ✅ Yes | Manual redeploy | Existing |
| Rolling with additional batch | Minimal if first batch fails | ✅ Yes | ✅ Yes | Manual redeploy | **New + Existing** |
| **Immutable** | **Minimal** | ✅ Yes | ✅ Yes | **Terminate new instances** | **New only** |
| Traffic splitting | % of traffic impacted | ✅ Yes | ✅ Yes | Reroute + terminate new | New only |
| Blue/Green | Minimal | ✅ Yes | ❌ No | Swap URL back | New only |

---

### 🔑 DynamoDB RCU Calculation — WORKED EXAMPLES (Q54)

**Question:** 10 strongly consistent reads/sec of 6 KB each → how many RCUs?
**Answer: 20** ✅ (Common wrong answers: 10, 30, 60)

**Step-by-step:**
```
Step 1: Round item size UP to nearest 4 KB multiple
        6 KB / 4 KB = 1.5 → round UP → 2

Step 2: Multiply by reads per second (× 1 for SC, × 0.5 for EC)
        2 RCU × 10 reads = 20 RCU ✅
```

**Why 10 is wrong:** 10 RCU would only work if items were ≤ 4 KB (1 RCU each × 10)
**Why 30 is wrong:** 30 would mean 3 RCU per item, which would require items of 9–12 KB
**Why 60 is wrong:** This is 6 × 10 — wrong formula (not dividing by 4)

**More worked examples for exam:**

| Scenario | Calculation | Answer |
|---|---|---|
| 10 SC reads/sec, 6 KB | CEIL(6/4)=2 × 10 × 1 | **20 RCU** |
| 10 EC reads/sec, 6 KB | CEIL(6/4)=2 × 10 × 0.5 | **10 RCU** |
| 25 SC reads/sec, 15 KB | CEIL(15/4)=4 × 25 × 1 | **100 RCU** |
| 25 EC reads/sec, 15 KB | CEIL(15/4)=4 × 25 × 0.5 | **50 RCU** |
| 100 writes/sec, 512 bytes | CEIL(0.5/1)=1 × 100 × 1 | **100 WCU** |
| 10 transactional reads/sec, 4 KB | CEIL(4/4)=1 × 10 × 2 | **20 RCU** |

**BatchGetItem rounding gotcha:**
> If `BatchGetItem` reads a 1.5 KB item and a 6.5 KB item → DynamoDB rounds **each item individually** before summing:
> 1.5 KB → 4 KB + 6.5 KB → 8 KB = **12 KB total** (NOT 8 KB = 1.5+6.5)

**UpdateItem WCU gotcha:**
> `UpdateItem` consumes WCU based on the **larger** of the before/after item size, even if you only update one attribute.

---

### 🔑 Lambda CPU Performance (Q60)

**Question:** "How to optimize performance of a CPU-bound Lambda function?"
**Answer: Increase the function's MEMORY** ✅ (NOT provisioned concurrency, NOT timeout, NOT CPU directly)

**Why each option is wrong:**
| Option | Why Wrong |
|---|---|
| Increase timeout | Timeout only extends how long the function can run — doesn't make it faster |
| Increase provisioned concurrency | Fixes **cold starts** only — doesn't improve execution speed of a running function |
| Increase CPU directly | ❌ You **cannot directly configure CPU** in Lambda |
| **Increase memory** ✅ | CPU is allocated **proportionally to memory** — more memory = more CPU |

**Lambda Memory → CPU relationship:**
```
128 MB  → minimal CPU
512 MB  → 0.5 vCPU equivalent
1,769 MB → 1 full vCPU
3,008 MB → ~1.7 vCPU
```
> ⚠️ **Provisioned Concurrency** = eliminates cold starts. **More Memory** = faster execution (CPU performance).
> These are two completely different problems. Don't confuse them.

---

### 🔑 CodeBuild vs CodeDeploy vs CodePipeline — Role Clarity

From the text document — **frequently confused in exam questions**:

| Service | Role | Think of it as | Key Output |
|---|---|---|---|
| **CodeBuild** | Build & Test | "The Worker" | Artifacts (.jar, .zip, Docker images) |
| **CodeDeploy** | Install & Deploy | "The Installer" | Running application in target env |
| **CodePipeline** | Orchestrate | "The Manager" | Completed release workflow |

**Complete Pipeline Flow:**
```
1. Developer pushes code to GitHub/CodeCommit
2. CodePipeline detects the push (trigger)
3. CodePipeline sends code to CodeBuild → build + test → artifact to S3
4. CodePipeline sends artifact to CodeDeploy → deploys to EC2/Lambda/ECS
5. (Optional) Manual Approval gate before production deploy
```

**Key Exam Distinctions:**
- **CodePipeline does NOT build or deploy code itself** — it just triggers CodeBuild and CodeDeploy
- **CodeBuild is serverless** — no build servers to manage (unlike Jenkins)
- **CodeDeploy handles** Blue/Green and Canary strategies
- **CodePipeline** can include **Manual Approval** steps
- CodePipeline pricing: **$1 per active pipeline per month**
- CodeBuild pricing: **per build minute**

---

### 🔑 Additional Exam Traps from These Questions

**Trap 1 — KMS is NOT a configuration store:**
> If question says "store API URL and credentials as unique keys" → KMS is WRONG. KMS manages encryption keys, not key-value config. Use **SSM Parameter Store** or **Secrets Manager**.

**Trap 2 — Provisioned Concurrency vs Memory:**
> - Cold start problem → **Provisioned Concurrency**
> - Slow execution / CPU-bound → **Increase Memory**
> Never mix these up.

**Trap 3 — Rolling with additional batch vs Immutable:**
> - "Maintain bandwidth/capacity throughout deploy" → **Rolling with additional batch**
> - "Full capacity + minimal failure impact + safe rollback" → **Immutable**
> The key differentiator: Immutable deploys to **new instances ONLY** → rollback = just terminate them.

**Trap 4 — DynamoDB RCU rounding:**
> Always round UP to the next 4 KB boundary BEFORE multiplying.
> 6 KB → not 1.5 RCU → round to **2 RCU**. Then multiply by reads/sec.

**Trap 5 — Step Functions Task state:**
> "Single unit of work" = **Task state**. Not Activity (that's a different concept for workers polling Step Functions).

**Trap 6 — SAM mandatory sections:**
> Only **Transform** and **Resources** are mandatory. Globals, Parameters, Mappings, Conditions, Outputs are all optional.

---

> **🏆 Good luck on your exam! Read every question fully, eliminate wrong answers, and trust your preparation.**
> *If you don't know — guess. No penalty for wrong answers!*