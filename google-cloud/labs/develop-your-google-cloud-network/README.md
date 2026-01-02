# Develop Your Google Cloud Network

- [Cloud IAM: Qwik Start]()
- [Introduction to SQL for BigQuery and Cloud SQL]()
- [Multiple VPC Networks]()
- [Cloud Monitoring: Qwik Start]()
- [Managing Deployments Using Kubernetes Engine]()
- [Introduction to SQL for BigQuery and Cloud SQL : Challenge Lab]()

## Introduction to SQL for BigQuery and Cloud SQL : Challenge Lab

```
Here is a complete summary of the notes, commands, and steps you performed to successfully complete the GSP321 Challenge Lab.

Project Environment Summary
Project ID: qwiklabs-gcp-01-b2a0f6b4892e

Region: europe-west4

Zone: europe-west4-c

Username 1: student-01-44563f7f23b7@qwiklabs.net (Owner/Admin)

Username 2: student-01-5b38e0708f3f@qwiklabs.net (Additional Engineer)

Task 1 & 2: VPC Network Creation
You manually created two custom VPC networks to isolate the Development and Production environments.

Bash

# Development VPC
gcloud compute networks create griffin-dev-vpc --subnet-mode=custom
gcloud compute networks subnets create griffin-dev-wp --network=griffin-dev-vpc --region=europe-west4 --range=192.168.16.0/20
gcloud compute networks subnets create griffin-dev-mgmt --network=griffin-dev-vpc --region=europe-west4 --range=192.168.32.0/20

# Production VPC
gcloud compute networks create griffin-prod-vpc --subnet-mode=custom
gcloud compute networks subnets create griffin-prod-wp --network=griffin-prod-vpc --region=europe-west4 --range=192.168.48.0/20
gcloud compute networks subnets create griffin-prod-mgmt --network=griffin-prod-vpc --region=europe-west4 --range=192.168.64.0/20
Task 3: Bastion Host Setup
You created a dual-homed bastion host to bridge both networks and configured firewall rules to allow administrative SSH access.

Bash

# Create Bastion with two NICs
gcloud compute instances create griffin-bastion \
    --network-interface=network=griffin-dev-vpc,subnet=griffin-dev-mgmt \
    --network-interface=network=griffin-prod-vpc,subnet=griffin-prod-mgmt \
    --zone=europe-west4-c --machine-type=e2-medium

# Firewall rules for SSH access (Port 22)
gcloud compute firewall-rules create dev-mgmt-allow-ssh --network=griffin-dev-vpc --allow=tcp:22 --source-ranges=0.0.0.0/0
gcloud compute firewall-rules create prod-mgmt-allow-ssh --network=griffin-prod-vpc --allow=tcp:22 --source-ranges=0.0.0.0/0
Task 4: Cloud SQL Configuration
You provisioned a MySQL instance and prepared the WordPress database and user permissions.

Bash

# Create Instance
gcloud sql instances create griffin-dev-db --database-version=MYSQL_8_0 --region=europe-west4 --cpu=1 --memory=3840MB

# SQL Commands (executed inside gcloud sql connect)
CREATE DATABASE wordpress;
CREATE USER "wp_user"@"%" IDENTIFIED BY "stormwind_rules";
GRANT ALL PRIVILEGES ON wordpress.* TO "wp_user"@"%";
FLUSH PRIVILEGES;
Task 5, 6 & 7: GKE Cluster & WordPress Deployment
You deployed a GKE cluster and used a Kubernetes Deployment with a Cloud SQL Proxy sidecar to connect WordPress to your database securely.

Bash

# Create Cluster
gcloud container clusters create griffin-dev --network=griffin-dev-vpc --subnetwork=griffin-dev-wp --zone=europe-west4-c --num-nodes=2 --machine-type=e2-standard-4

# Prepare Credentials
gcloud iam service-accounts keys create key.json --iam-account=cloud-sql-proxy@$GOOGLE_CLOUD_PROJECT.iam.gserviceaccount.com
kubectl create secret generic cloudsql-instance-credentials --from-file key.json
kubectl create secret generic database --from-literal=username=wp_user --from-literal=password=stormwind_rules

# Apply Deployment (after updating connectionName in wp-deployment.yaml)
kubectl apply -f wp-deployment.yaml
kubectl apply -f wp-service.yaml
Task 8: Monitoring (Uptime Check)
You verified the application was accessible via its Load Balancer's External IP and set up an Uptime Check in the Cloud Monitoring console to ensure 24/7 availability.

Target: http://[EXTERNAL-IP]/

Result: Verified with a 200 OK response.

Task 9: IAM Access Control
You added the second user as a Project Editor to simulate onboarding a new engineer.

Bash

gcloud projects add-iam-policy-binding qwiklabs-gcp-01-b2a0f6b4892e \
    --member=user:student-01-5b38e0708f3f@qwiklabs.net \
    --role=roles/editor
Troubleshooting Notes (What we learned)
500 Errors: Usually indicate a database connection failure. We fixed this by ensuring the cloudsql-proxy container was named correctly and the database secret matched the YAML keys.

Container Naming: kubectl logs requires the exact name defined in the YAML (cloudsql-proxy vs cloud-sql-proxy).

Sidecar Pattern: The WordPress container connects to 127.0.0.1:3306 because the SQL Proxy shares the same network namespace in the pod.
```
