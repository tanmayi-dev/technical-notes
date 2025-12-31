# Implementing Cloud Load Balancing For Compute Engine

- [Set Up Network Load Balancers](#1)
- [Set Up Application Load Balancers](#2)
- [User an Internal Application Load Balancer](#3)
- [Implement Load Balancing on Compute Enginer: Challenge Lab](#4)

#### General commands

```bash
# List active account name
gcloud auth list

# List project ID
gcloud config list project
```


## Set Up Network Load Balancers <a id="1"></a>

### Task 1 : Set the defualt region and zone for all resources

1. Set the default region:
```
gcloud config set compute/region Region
```

2. Set the default zone:
```
gcloud config set compute/zone Zone
```

### Task 2 : Create multiple web server instances

1. Create a virtual machine, `www1`, in your default zone using the following code :
```bash
  gcloud compute instances create www1 \
    --zone=Zone \
    --tags=network-lb-tag \
    --machine-type=e2-small \
    --image-family=debian-11 \
    --image-project=debian-cloud \
    --metadata=startup-script='#!/bin/bash
      apt-get update
      apt-get install apache2 -y
      service apache2 restart
      echo "
<h3>Web Server: www1</h3>" | tee /var/www/html/index.html'
```

2. Create a virtual machine, `www2`, in your default zone using the following code :
```bash
  gcloud compute instances create www2 \
    --zone=Zone \
    --tags=network-lb-tag \
    --machine-type=e2-small \
    --image-family=debian-11 \
    --image-project=debian-cloud \
    --metadata=startup-script='#!/bin/bash
      apt-get update
      apt-get install apache2 -y
      service apache2 restart
      echo "
<h3>Web Server: www2</h3>" | tee /var/www/html/index.html'
```

3. Create a virtual machine, `www3`, in your default zone using the following code :
```bash
  gcloud compute instances create www3 \
    --zone=Zone  \
    --tags=network-lb-tag \
    --machine-type=e2-small \
    --image-family=debian-11 \
    --image-project=debian-cloud \
    --metadata=startup-script='#!/bin/bash
      apt-get update
      apt-get install apache2 -y
      service apache2 restart
      echo "
<h3>Web Server: www3</h3>" | tee /var/www/html/index.html'
```

4. Create a firewall rule to allow external traffic to the VM instances : 
```bash
gcloud compute firewall-rules create www-firewall-network-lb \
    --target-tags network-lb-tag --allow tcp:80
```

5. List your instances. See IP addresses in `EXTERNAL_IP` column :
```bash
gcloud compute instances list
```

6. Verify each instance is running with `curl` replacing `[IP_ADDRESS]` with external IP address for each of your VMs : 
```bash
curl http://[IP_ADDRESS]
```


### Task 3 : Configure the load balancing service

1. Create a static external IP address for your load balancer:
```
gcloud compute addresses create network-lb-ip-1 \
  --region Region
```

Output:
```
   Created [https://www.googleapis.com/compute/v1/projects/qwiklabs-gcp-03-xxxxxxxxxxx/regions//addresses/network-lb-ip-1].
```

2. Add a legacy HTTP health check resource:
```
gcloud compute http-health-checks create basic-check
```

### Task 4 : Create the target pool and forwarding rule

1. Run the following to create the target pool and use the health check, which is required for the service to function:
```
gcloud compute target-pools create www-pool \
  --region Region --http-health-check basic-check
```

2. Add the instances you created earlier to the pool:
```
gcloud compute target-pools add-instances www-pool \
    --instances www1,www2,www3
```

3. Add a forwarding rule:
```
gcloud compute forwarding-rules create www-rule \
    --region  Region \
    --ports 80 \
    --address network-lb-ip-1 \
    --target-pool www-pool
```

### Task 5 : Send traffic to your instances

1. Enter the following command to view the external IP address of the www-rule forwarding rule used by the load balancer:
```
gcloud compute forwarding-rules describe www-rule --region Region
```

2. Access the external IP address:
```
IPADDRESS=$(gcloud compute forwarding-rules describe www-rule --region Region --format="json" | jq -r .IPAddress)
```

3. Show the external IP address:
```
echo $IPADDRESS
```

4. Use the `curl` command to access the external IP address, replacing `IP_ADDRESS` with an external IP address from the previous command:
```
while true; do curl -m1 $IPADDRESS; done
```
The response from the curl command alternates randomly among the three instances. If your response is initially unsuccessful, wait approximately 30 seconds for the configuration to be fully loaded and for your instances to be marked healthy before trying again.

5. Use Ctrl + C to stop running the command.

----

## Set Up Application Load Balancers <a id="2"></a>

### Task 1 : Set the default region and zone for all resources

1. Set the default region :
```
gcloud config set compute/region Region
```

2. Set the default zone : 
```
gcloud config set compute/zone Zone
```

### Task 2 : Create multiple web server instances

1. Create a virtual machine, `www1`, in your default zone using the following code:
```
  gcloud compute instances create www1 \
    --zone=Zone \
    --tags=network-lb-tag \
    --machine-type=e2-small \
    --image-family=debian-11 \
    --image-project=debian-cloud \
    --metadata=startup-script='#!/bin/bash
      apt-get update
      apt-get install apache2 -y
      service apache2 restart
      echo "
<h3>Web Server: www1</h3>" | tee /var/www/html/index.html'
```

2. Create a virtual machine, `www2`, in your default zone using the following code:
```
  gcloud compute instances create www2 \
    --zone=Zone \
    --tags=network-lb-tag \
    --machine-type=e2-small \
    --image-family=debian-11 \
    --image-project=debian-cloud \
    --metadata=startup-script='#!/bin/bash
      apt-get update
      apt-get install apache2 -y
      service apache2 restart
      echo "
<h3>Web Server: www2</h3>" | tee /var/www/html/index.html'
```

3. Create a virtual machine, `www3`, in your default zone.
```
  gcloud compute instances create www3 \
    --zone=Zone  \
    --tags=network-lb-tag \
    --machine-type=e2-small \
    --image-family=debian-11 \
    --image-project=debian-cloud \
    --metadata=startup-script='#!/bin/bash
      apt-get update
      apt-get install apache2 -y
      service apache2 restart
      echo "
<h3>Web Server: www3</h3>" | tee /var/www/html/index.html'
```

4. Create a firewall rule to allow external traffic to the VM instances:
```
gcloud compute firewall-rules create www-firewall-network-lb \
    --target-tags network-lb-tag --allow tcp:80
```

5. List your instances. See IP addresses in `EXTERNAL_IP` column :
```bash
gcloud compute instances list
```

6. Verify each instance is running with `curl` replacing `[IP_ADDRESS]` with external IP address for each of your VMs : 
```bash
curl http://[IP_ADDRESS]
```

### Task 3 : Create an Application Load Balancer

1. Create the Load Balancer template 
```
gcloud compute instance-templates create lb-backend-template \
   --region=Region \
   --network=default \
   --subnet=default \
   --tags=allow-health-check \
   --machine-type=e2-medium \
   --image-family=debian-11 \
   --image-project=debian-cloud \
   --metadata=startup-script='#!/bin/bash
     apt-get update
     apt-get install apache2 -y
     a2ensite default-ssl
     a2enmod ssl
     vm_hostname="$(curl -H "Metadata-Flavor:Google" \
     http://169.254.169.254/computeMetadata/v1/instance/name)"
     echo "Page served from: $vm_hostname" | \
     tee /var/www/html/index.html
     systemctl restart apache2'
```

2. Create a managed instance group based on the template
```
gcloud compute instance-groups managed create lb-backend-group \
   --template=lb-backend-template --size=2 --zone=Zone
```

3. Create the `fw-allow-health-check` firewall rule
```
gcloud compute firewall-rules create fw-allow-health-check \
  --network=default \
  --action=allow \
  --direction=ingress \
  --source-ranges=130.211.0.0/22,35.191.0.0/16 \
  --target-tags=allow-health-check \
  --rules=tcp:80
```

Note: The ingress rule allows traffic from the Google Cloud health checking systems (130.211.0.0/22 and 35.191.0.0/16). This lab uses the target tag allow-health-check to identify the VMs


4. Set up a global static external IP address that your customers use to reach your load balancer : 
```
gcloud compute addresses create lb-ipv4-1 \
  --ip-version=IPV4 \
  --global
```

Notice that the IPv4 address that was reserved : 
```
gcloud compute addresses describe lb-ipv4-1 \
  --format="get(address)" \
  --global
```

Note: Save this IP address, as you need to refer to it later in this lab.

5. Create a health check for the load balancer (to ensure that only healthy backends are sent traffic) :
```
gcloud compute health-checks create http http-basic-check \
  --port 80
```

6. Create a backend service
```
gcloud compute backend-services create web-backend-service \
  --protocol=HTTP \
  --port-name=http \
  --health-checks=http-basic-check \
  --global
```

7. Add your instance group as the backend to the backend service : 
```
gcloud compute backend-services add-backend web-backend-service \
  --instance-group=lb-backend-group \
  --instance-group-zone=Zone \
  --global
```

8. Create a URL map to route the incoming requests to the default backend service : 
```
gcloud compute url-maps create web-map-http \
    --default-service web-backend-service
```

Note: URL map is a Google Cloud configuration resource used to route requests to backend services or backend buckets. For example, with an external Application Load Balancer, you can use a single URL map to route requests to different destinations based on the rules configured in the URL map:
Requests for https://example.com/video go to one backend service.
Requests for https://example.com/audio go to a different backend service.
Requests for https://example.com/images go to a Cloud Storage backend bucket.
Requests for any other host and path combination go to a default backend service.

9. Create a target HTTP proxy to route requests to your URL map:
```
gcloud compute target-http-proxies create http-lb-proxy \
    --url-map web-map-http
```


10. Create a global forwarding rule to route incoming requests to the proxy:
```
gcloud compute forwarding-rules create http-content-rule \
   --address=lb-ipv4-1\
   --global \
   --target-http-proxy=http-lb-proxy \
   --ports=80
```
Note: A forwarding rule and its corresponding IP address represent the frontend configuration of a Google Cloud load balancer.


### Task 4 : Test traffic sent to your instances

1. On the Google Cloud console in the Search field type Load balancing, then choose Load balancing from the search results.
2. Click on the load balancer that you just created, `web-map-http`.
3. In the Backend section, click on the name of the backend and confirm that the VMs are Healthy. If they are not healthy, wait a few moments and try reloading the page.
4. When the VMs are healthy, test the load balancer using a web browser, going to `http://IP_ADDRESS/`, replacing `IP_ADDRESS` with the load balancer's IP address that you copied previously.

Note: This may take three to five minutes. If you do not connect, wait a minute, and then reload the browser.

Your browser should render a page with content showing the name of the instance that served the page, along with its zone (for example, Page served from: `lb-backend-group-xxxx`).



----

## User an Internal Application Load Balancer <a id="3"></a>

Set the project region and zone for this tab :
```
gcloud config set compute/region Region
gcloud config set compute/zone Zone
```

### Task 1 : Create a Virtual Environment

1. Install the `virtualev` environment
```
sudo apt-get install -y virtualenv
```

2. Build the virtual environment:
```
python3 -m venv venv
```

3. Activate the virtual environment:
```
source venv/bin/activate
```

#### Enable Gemini Code Assist in the Cloud Shell IDE

1. In Cloud Shell, enable the Gemini for Google Cloud API with the following command:
```
gcloud services enable cloudaicompanion.googleapis.com
```

2. Click Open Editor on the Cloud Shell toolbar.

Note: To open the Cloud Shell Editor, click Open Editor on the Cloud Shell toolbar. You can switch between Cloud Shell and the code Editor by clicking Open Editor or Open Terminal, as required.

3. Click Cloud Code - No Project in the status bar at the bottom of the screen.

4. Authorize the plugin if necessary. If a project is not automatically selected, click Select a Google Cloud Project, and choose `Project ID`.

5. Verify that your Google Cloud project (`Project ID`) displays in the Cloud Code status message in the status bar.



### Task 2 : Create a backend managed instance group

### Task 3 : Set up the internal load balancer

### Task 4 : Test the load balancer

### Task 5 : Create a public-facing web server


----

## Implement Load Balancing on Compute Enginer: Challenge Lab <a id="4"></a>


### Task 1 - Create multiple web server instances

```bash

# Set zone variable
ZONE=zone
REGION=region
PROJECT_ID=$(gcloud config get-value project)

# Create web1 VM
gcloud compute instances create web1 \
--zone=$ZONE \
--machine-type=e2-small \
--tags=network-lb-tag \
--image-family=debian-12 \
--image-project=debian-cloud \
--metadata=startup-script='#!/bin/bash
apt-get update
apt-get install apache2 -y
service apache2 restart
echo "<h3>Web Server: web1</h3>" | tee /var/www/html/index.html'

# Create web2 VM
gcloud compute instances create web2 \
--zone=$ZONE \
--machine-type=e2-small \
--tags=network-lb-tag \
--image-family=debian-12 \
--image-project=debian-cloud \
--metadata=startup-script='#!/bin/bash
apt-get update
apt-get install apache2 -y
service apache2 restart
echo "<h3>Web Server: web2</h3>" | tee /var/www/html/index.html'

# Create web3 VM
gcloud compute instances create web3 \
--zone=$ZONE \
--machine-type=e2-small \
--tags=network-lb-tag \
--image-family=debian-12 \
--image-project=debian-cloud \
--metadata=startup-script='#!/bin/bash
apt-get update
apt-get install apache2 -y
service apache2 restart
echo "<h3>Web Server: web3</h3>" | tee /var/www/html/index.html'


# Create Firewall rule to allow external traffic to VMs
gcloud compute firewall-rules create www-firewall-network-lb --allow tcp:80 --target-tags network-lb-tag

# Get IP Address
gcloud compute instances list

# Test IP Address of VMs
curl http://[IP_ADDRESS]

```

### Task 2 : Configure the loadn balancing service

```bash
# Create a static external IP address for your load balancer:
gcloud compute addresses create network-lb-ip-1 \
    --region=$REGION  

# Add legacy health resource check
gcloud compute http-health-checks create basic-check

# Create a target pool
 gcloud compute target-pools create www-pool \
    --region=$REGION  --http-health-check basic-check

# Add instances created to the target pool
gcloud compute target-pools add-instances www-pool \
    --instances web1,web2,web3 --zone=$ZONE
    
# Add forwarding rule
gcloud compute forwarding-rules create www-rule \
    --region=$REGION \
    --ports 80 \
    --address network-lb-ip-1 \
    --target-pool www-pool

# Access the external IP address of the www-rule forwarding rule used by the load balancer
IPADDRESS=$(gcloud compute forwarding-rules describe www-rule --region=$REGION  --format="json" | jq -r .IPAddress)

```

### Task 3 : Create an HTTP Load Balancer

```bash
# Create a instance template
gcloud compute instance-templates create lb-backend-template \
   --region=$REGION \
   --network=default \
   --subnet=default \
   --tags=allow-health-check \
   --machine-type=e2-medium \
   --image-family=debian-12 \
   --image-project=debian-cloud \
   --metadata=startup-script='#!/bin/bash
     apt-get update
     apt-get install apache2 -y
     a2ensite default-ssl
     a2enmod ssl
     vm_hostname="$(curl -H "Metadata-Flavor:Google" \
     http://169.254.169.254/computeMetadata/v1/instance/name)"
     echo "Page served from: $vm_hostname" | \
     tee /var/www/html/index.html
     systemctl restart apache2'

# Create a managed instance group based on template
gcloud compute instance-groups managed create lb-backend-group \
   --template=lb-backend-template --size=2 --zone=$ZONE 

# Configure firewall rule - Ingress rule that allows traffic from Google cloud health checking systems (130.211.0.0/22 and 35.191.0.0/16).
gcloud compute firewall-rules create fw-allow-health-check \
  --network=default \
  --action=allow \
  --direction=ingress \
  --source-ranges=130.211.0.0/22,35.191.0.0/16 \
  --target-tags=allow-health-check \
  --rules=tcp:80


# Reserve an external IP Address 
gcloud compute addresses create lb-ipv4-1 \
  --ip-version=IPV4 \
  --global

# Note the IPv4 address that was reserved
gcloud compute addresses describe lb-ipv4-1 \
  --format="get(address)" \
  --global


# ---- Setup the load balancer -----

# 1. Create a health check
gcloud compute health-checks create http http-basic-check \
  --port 80


# 2. Create a backend service
gcloud compute backend-services create web-backend-service \
  --protocol=HTTP \
  --port-name=http \
  --health-checks=http-basic-check \
  --global


# 3. Add your instance group as the backend to the backend service
gcloud compute backend-services add-backend web-backend-service \
  --instance-group=lb-backend-group \
  --instance-group-zone=$ZONE \
  --global


# 4. Create a URL map to route the incoming requests to the default backend service
gcloud compute url-maps create web-map-http \
    --default-service web-backend-service

# 5. Create a target HTTP proxy to route requests to your URL map
gcloud compute target-http-proxies create http-lb-proxy \
    --url-map web-map-http

# 6. Create a global forwarding rule to route incoming requests to the proxy
gcloud compute forwarding-rules create http-content-rule \
    --address=lb-ipv4-1\
    --global \
    --target-http-proxy=http-lb-proxy \
    --ports=80
```


---
