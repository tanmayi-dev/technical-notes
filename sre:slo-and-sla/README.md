# Site Reliability Engineering: Service-Level Agreements and Objectives

Prerequisite : 
- Software developmemt and monitoring
- 

- Service Level Objectives : 

- Service Level Indicators :

- SLO = SLI + Threshold + Time window
- Error Budget Policy Documents
  - Authors, Reviewers, and Approvers
  - Approval and Review Dates
  - Description of the service
  - Optional : Primer on error budgets 
  
## Service Level Indicators 

### Definition
Service Level Indicators : 
- An indicator of the level of service you provide , ideally expressed as a ratio of two numebrs

"Good" Events / Total Events
Successful HTTP requests / Total HTTP Requests


What actually makes your users happy ?
What behaviour matter to them ?

- Define Your Users
- Identify Critical Activities
- Draw an Architecture Diagram

SLI Specification : 
The assessment of a service output that you think matters to users, independent of how it is measured
It should be abstract only

Latency of a web app : 
- Page Requests loaded in 100ms / All Requests
### Implementing Measurements

SLI Implementation : 
- An SLI Specification and how to measure it

- SLIs should be specific and measurable

Implementation Sources : 
- Application server logs
- Load balancer logs or monitoring
- Black box monitoring
- Client side instrumentation

  
<img width="748" height="423" alt="Screenshot 2025-08-25 at 3 06 31 PM" src="https://github.com/user-attachments/assets/c813222f-8b1e-4481-b359-f54e98f99492" />

#### Choosing Sources Examples 

Server Logs : 
- Pros : Highly accurate data
- Cons : Miss requests that fail to reach server

Client Logs : 
- Pros : More accurately capture UX
- Cons : Need to modify client code, need infrastructure to support

Consider for SLI Implementation: 
1. Quality
2. Coverage
3. Cost

### Common Measurements

Component Categories : 
- Request Driven
- Big Data
- Storage

Request Driven : 
- User creates an event and expects a response
- RESTful service
- API used by mobile app

Request Driven SLIs : 
- Availability : could we respond to request
- Latency : how long did it take to respond
- Throughput : how many requests can be handled over set period of time

Big Data :
- Systems that take input, mutate it and store result
- Report generation services
- Video processing systems
- Metrics Proxy

Big Data SLIs : 
- Througput :  how much data is being processed
- End-to-end latency : how long does it take data to progress from ingestion to completion

Storage : 
- Components that accept data and store it for later usage

Storage SLIs : 
- Latency : how long does it take to read or write data
- Availablity : can we access data on-demand
- Durability : is the data still there when we need it

--- 
- All system types care about correctness
  - was the correct answer returned
  - right analysis performed
  - right data retrieved

#### Example : Arch of ecommerce platform

<img width="828" height="394" alt="Screenshot 2025-08-25 at 3 17 37 PM" src="https://github.com/user-attachments/assets/96b5b1af-6326-421e-89b2-ee013bc89edd" />





### Measurement and Calculation

## Service Level Objectives

### Objectives vs Indicators

### Making measurements meaningful

### Stakeholder agreement

### Documenting SLOs

### Dasboards and reporting

### Continuous Improvement

## Error Budgets

### Consequences of poor service performance

### Creating an error budget

### Drafting an error budget policy

## Service Level Agreements

### Service Level Agreements

### Components of Agreements
