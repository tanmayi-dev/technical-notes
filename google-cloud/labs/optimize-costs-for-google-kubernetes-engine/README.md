# Optimize Costs for Google Kubernetes Engine

- [Understading your GKE Costs]()
- [Monitoring your GKE costs]()
- [Managing a GKE Multi-tenant Cluster with Namespaces]()
- [Virtual machines in GKE]()
- [Exploring Cost-optimization for GKE Virtual Machines]()
- [Autoscaling with GKE: Overview and pods]()
- [Autoscaling with GKE: Clusters and nodes]()
- [Understanding and Combining GKE Autoscaling Strategies]()
- [Application optimization for GKE]()
- [Optimize GKE to run your application]()
- [GKE Workload Optimization]()
- [Optimize Costs for Google Kubernetes Engine: Challenge Lab](#12)

## Optimize Costs for Google Kubernetes Engine: Challenge Lab <a id="12"></a>

Task 1: Create a cluster and deploy your app
Bash

# Set your Zone
gcloud config set compute/zone europe-west4-a

# 1. Create the cluster with 2 nodes and Rapid release channel
gcloud container clusters create onlineboutique-cluster-465 \
    --project=qwiklabs-gcp-03-7c944f176028 \
    --machine-type=e2-standard-2 \
    --num-nodes=2 \
    --release-channel=rapid

# 2. Authenticate the cluster
gcloud container clusters get-credentials onlineboutique-cluster-465 --zone europe-west4-a

# 3. Create the namespaces
kubectl create namespace dev
kubectl create namespace prod

# 4. Clone and deploy the application
git clone https://github.com/GoogleCloudPlatform/microservices-demo.git
cd microservices-demo
kubectl apply -f ./release/kubernetes-manifests.yaml --namespace dev
Task 2: Migrate to an optimized node pool
Bash

# 1. Create the optimized node pool (Custom Machine Type)
gcloud container node-pools create optimized-pool-3828 \
    --cluster=onlineboutique-cluster-465 \
    --machine-type=custom-2-3584 \
    --num-nodes=2 \
    --zone=europe-west4-a

# 2. Cordon the old nodes (Mark them as unschedulable)
for node in $(kubectl get nodes -l cloud.google.com/gke-nodepool=default-pool -o=name); do
  kubectl cordon "$node"
done

# 3. Drain the old nodes (Evict pods to the new pool)
for node in $(kubectl get nodes -l cloud.google.com/gke-nodepool=default-pool -o=name); do
  kubectl drain "$node" --force --ignore-daemonsets --delete-emptydir-data --grace-period=10
done

# 4. Delete the old pool
gcloud container node-pools delete default-pool --cluster=onlineboutique-cluster-465 --zone=europe-west4-a --quiet
Task 3: Apply a frontend update
Bash

# 1. Set the Pod Disruption Budget
kubectl create poddisruptionbudget onlineboutique-frontend-pdb \
    --selector run=frontend \
    --min-available=1 \
    --namespace dev

# 2. Update the frontend image to v2.1
kubectl set image deployment/frontend \
    server=gcr.io/qwiklabs-resources/onlineboutique-frontend:v2.1 \
    --namespace dev

# 3. Set Image Pull Policy to Always
kubectl patch deployment frontend --namespace dev -p '{"spec":{"template":{"spec":{"containers":[{"name":"server","imagePullPolicy":"Always"}]}}}}'
Task 4: Autoscale from estimated traffic
Bash

# 1. Set Horizontal Pod Autoscaler for Frontend (Max 11)
kubectl autoscale deployment frontend \
    --cpu-percent=50 \
    --min=1 \
    --max=11 \
    --namespace dev

# 2. Enable Cluster Autoscaler (Scale nodes 1 to 6)
gcloud beta container clusters update onlineboutique-cluster-465 \
    --enable-autoscaling \
    --min-nodes=1 \
    --max-nodes=6 \
    --zone=europe-west4-a

# 3. Run the load test (Update with your Frontend External IP)
kubectl exec $(kubectl get pod --namespace=dev | grep 'loadgenerator' | cut -f1 -d ' ') \
    -it --namespace=dev -- bash -c 'export USERS=8000; locust --host="http://[EXTERNAL_IP]" --headless -u "8000" 2>&1'

# 4. Autoscale Recommendation Service (Max 5)
kubectl autoscale deployment recommendationservice \
    --cpu-percent=50 \
    --min=1 \
    --max=5 \
    --namespace dev
Verification Commands (Checkups)
Bash

# Check Pod status in dev
kubectl get pods -n dev

# Check HPA scaling progress
kubectl get hpa -n dev

# Check node scaling
kubectl get nodes

# Check resource usage per pod
kubectl top pods -n dev
