# Build Infrastructure with Terraform on Google Cloud

- [Terraform Fundamentals](#1)
- [Infrastructure as Code with Terraform](#2)
- [Interact with Terraform Modules](#3)
- [Manage Terraform State](#4)
- [Build Infrastructure with Terraform on Google Cloud: Challenge Lab](#5)

## Terraform Fundamentals <a id="1"></a>

---

## Infrastructure as Code with Terraform <a id="2"></a>

---

## Interact with Terraform Modules <a id="3"></a>

---

## Manage Terraform State <a id="4"></a>

---

## Build Infrastructure with Terraform on Google Cloud: Challenge Lab <a id="5"></a>

Phase 1: Task 1 - Setup and Initialization
You created the directory structure and the initial configuration files.

Bash

# 1. Create the directory structure
mkdir -p modules/instances modules/storage
touch main.tf variables.tf
touch modules/instances/instances.tf modules/instances/outputs.tf modules/instances/variables.tf
touch modules/storage/storage.tf modules/storage/outputs.tf modules/storage/variables.tf

# 2. Initialize Terraform for the first time
terraform init
Phase 2: Task 2 - Importing Infrastructure
You identified the existing VMs and brought them under Terraform management.

Bash

# 3. List instances to find names and zones
gcloud compute instances list

# 4. Get the specific Numeric IDs (Required for Import)
gcloud compute instances describe tf-instance-1 --zone=us-west1-b --format='get(id)'
gcloud compute instances describe tf-instance-2 --zone=us-west1-b --format='get(id)'

# 5. Import the instances into the state file
# (Replace [ID] with the numbers from the previous step)
terraform import module.instances.google_compute_instance.tf-instance-1 [ID1]
terraform import module.instances.google_compute_instance.tf-instance-2 [ID2]

# 6. Apply to sync the code in instances.tf with the cloud
terraform apply
# (Typed 'yes')
Phase 3: Task 3 - Migrating to Remote Backend
You created a Cloud Storage bucket and moved your state file into it.

Bash

# 7. Apply again to create the storage bucket defined in the storage module
terraform apply

# 8. Initialize again to migrate local state to GCS
terraform init -migrate-state
# (Typed 'yes')
Phase 4: Task 4 & 5 - Modifying and Destroying
You upgraded the machine types and practiced lifecycle management.

Bash

# 9. Apply changes after updating machine_type to e2-standard-2 
# and adding the third instance tf-instance-009698
terraform apply

# 10. Apply again after deleting the third instance block from the code
terraform apply
Phase 5: Task 6 - Networking and Provider Upgrades
You added the VPC module from the registry, which required a provider version upgrade.

Bash

# 11. Attempted init (failed due to version lock)
terraform init

# 12. Upgraded the provider and initialized the new VPC module
terraform init -upgrade

# 13. Targeted apply to ensure the Network exists before moving VMs
terraform apply -target=module.vpc

# 14. Full apply to move tf-instance-1 and tf-instance-2 into subnets
terraform apply
Phase 6: Task 7 - Security (Firewall)
The final step to permit traffic to your instances.

Bash

# 15. Final apply to create the tf-firewall resource
terraform apply

---
