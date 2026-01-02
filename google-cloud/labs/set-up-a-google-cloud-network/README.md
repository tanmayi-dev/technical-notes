# Set Up a Google Cloud Network

- [Networking 101]()
- [Create a Custom Network and Apply Firewall Rules]()
- [Test Network Latency Between VMs]()
- [Set Up a Google Cloud Network: Challenge Lab]()

## Set Up a Google Cloud Network: Challenge Lab

```
Phase 1: Create the VPC and Subnets
Run these commands in Cloud Shell to build the custom network and its two regional subnets.

Bash

# 1. Create the VPC Network
gcloud compute networks create vpc-network-we4a \
    --subnet-mode=custom \
    --bgp-routing-mode=regional

# 2. Create Subnet A (US Central)
gcloud compute networks subnets create subnet-a-oba1 \
    --network=vpc-network-we4a \
    --range=10.10.10.0/24 \
    --region=us-central1 \
    --stack-type=IPV4_ONLY

# 3. Create Subnet B (Europe West)
gcloud compute networks subnets create subnet-b-ds33 \
    --network=vpc-network-we4a \
    --range=10.10.20.0/24 \
    --region=europe-west1 \
    --stack-type=IPV4_ONLY
Phase 2: Add Firewall Rules
These rules are required for SSH, RDP, and internal ICMP (ping) communication.

Bash

# 1. SSH Rule (Priority 1000)
gcloud compute firewall-rules create jodq-firewall-ssh \
    --network=vpc-network-we4a \
    --direction=INGRESS \
    --priority=1000 \
    --action=ALLOW \
    --rules=tcp:22 \
    --source-ranges=0.0.0.0/0

# 2. RDP Rule (Priority 65535) - Note the specific source range 0.0.0.0/24
gcloud compute firewall-rules create jfgr-firewall-rdp \
    --network=vpc-network-we4a \
    --direction=INGRESS \
    --priority=65535 \
    --action=ALLOW \
    --rules=tcp:3389 \
    --source-ranges=0.0.0.0/24

# 3. ICMP Rule (Internal only)
gcloud compute firewall-rules create mgup-firewall-icmp \
    --network=vpc-network-we4a \
    --direction=INGRESS \
    --priority=1000 \
    --action=ALLOW \
    --rules=icmp \
    --source-ranges=10.10.10.0/24,10.10.20.0/24
✅ Check My Progress: Click "Check my progress" for Task 2 (Create network, subnetworks and firewalls) now.

Phase 3: Add VMs to the Network
Deploy the two test instances into their respective subnets.

Bash

# 1. Create VM us-test-01
gcloud compute instances create us-test-01 \
    --zone=us-central1-b \
    --network=vpc-network-we4a \
    --subnet=subnet-a-oba1 \
    --machine-type=e2-micro

# 2. Create VM us-test-02
gcloud compute instances create us-test-02 \
    --zone=europe-west1-c \
    --network=vpc-network-we4a \
    --subnet=subnet-b-ds33 \
    --machine-type=e2-micro
Phase 4: Verify Connectivity and Latency
Go to Compute Engine > VM Instances in the Console.

Click the SSH button next to us-test-01.

In the new SSH window, get the Internal IP of us-test-02 (you can see it in the console list) and run:

Bash

ping -c 3 <INTERNAL_IP_OF_US-TEST-02>
Run the DNS-based ping to test internal name resolution:

Bash

ping -c 3 us-test-02.europe-west1-c
✅ Check My Progress: Click "Check my progress" for Task 3 (Create two instances in specified zones).
```
