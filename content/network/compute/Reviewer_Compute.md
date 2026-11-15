# AWS Compute Services Exam Reviewer

*Source: 06 Handout 1 — Compute (IT2607)*

---

## 1. Key Terms

| Term | Short definition (handout wording, simplified) | Memory hook |
| :--- | :--- | :--- |
| **AWS Compute Services** | Cloud services that provide flexible computing resources without buying or maintaining physical servers. | Rent compute, skip hardware |
| **Virtual Machine-Based Computing** | Running virtual machines where customers manage the OS, software, networking, and server configs. | Full control over virtual servers |
| **Infrastructure as a Service (IaaS)** | Cloud model (used by EC2) where AWS provides physical hardware and customers manage virtual environments. | AWS = hardware; You = OS & apps |
| **Amazon EC2 (Elastic Compute Cloud)** | Provides resizable virtual servers (instances) in the AWS Cloud across Availability Zones with guest OS control. | Virtual servers on demand |
| **EC2 Instance** | A resizable virtual machine/server running in Amazon EC2. | One virtual server = one instance |
| **Serverless Computing** | Running code/apps without provisioning or managing servers; AWS handles the infrastructure. | Code runs, zero server setup |
| **AWS Lambda** | Serverless compute service that runs code in response to events or schedules without a continuously running server. | Event-triggered code runner |
| **Lambda Function** | Code organized to perform a task along with settings (runtime, memory, timeout, permissions). | Code + config package in Lambda |
| **Event-Driven Computing** | Model where an event (e.g., S3 upload, DynamoDB update, request, schedule) invokes a function to run. | Event happens -> function fires |
| **Container-Based Computing (Containers)** | Packages an application with its libraries, dependencies, and config; shares host OS so it is lightweight and fast. | App + dependencies, shared OS |
| **Docker** | Software platform commonly used to build, package, and run containerized applications. | Tool that builds/runs containers |
| **Container Image** | Package containing application code and components needed to create and run a container. | Blueprint for a container |
| **Amazon ECS (Elastic Container Service)** | Managed container orchestration service that deploys, manages, scales, and coordinates where containers run. | AWS-native container orchestrator |
| **Kubernetes** | Open-source system for deploying, scaling, and managing containerized applications in groups. | Open-source container orchestrator |
| **Amazon EKS (Elastic Kubernetes Service)** | Managed Kubernetes service where AWS manages the Kubernetes control plane. | Kubernetes managed by AWS |
| **AWS Fargate** | Serverless compute capacity for containers (with ECS/EKS) so customers do not manage underlying servers. | Serverless engine for containers |
| **Amazon ECR (Elastic Container Registry)** | Managed container image registry for storing, managing, and retrieving container images. | Storage garage for container images |
| **Managed Application Platforms** | Platforms where developers upload code and the service handles provisioning, scaling, load balancing, and health checks. | Upload code, platform handles ops |
| **AWS Elastic Beanstalk** | Managed service for deploying/running web apps while keeping underlying AWS resources accessible. | PaaS-style web app deployer |
| **Elastic Beanstalk Environment** | The set of AWS resources (EC2, load balancing, scaling) created to run a deployed Beanstalk app. | Resources bundled for one app |
| **Amazon Machine Image (AMI)** | Template used to launch an EC2 instance, containing the OS and initial software configurations. | EC2 instance blueprint/template |
| **EC2 Instance Type** | Determines the combination of processor, memory, storage, and networking capacity of an EC2 instance. | Hardware size/spec of an EC2 |
| **General Purpose (Instance Family)** | EC2 family providing a balance of compute, memory, and networking resources. | Balanced all-rounder |
| **Compute Optimized (Instance Family)** | EC2 family designed for workloads needing high processing performance. | Heavy CPU power |
| **Memory Optimized (Instance Family)** | EC2 family designed for workloads processing large amounts of data in memory. | Big RAM workloads |
| **Storage Optimized (Instance Family)** | EC2 family designed for workloads needing high performance when accessing locally stored data. | Fast local disk access |
| **IAM Role (EC2)** | Grants an EC2 instance permissions to access other AWS services when required. | Permission badge for EC2 |
| **User Data** | Commands or scripts supplied to run automatically when an EC2 instance launches. | Startup script at launch |
| **Tags** | Metadata assigned to an EC2 instance to help identify, organize, and manage it. | Name/label stickers for resources |
| **Security Group** | Virtual firewall settings defining permitted inbound and outbound network traffic for an instance. | Inbound/outbound traffic rules |
| **Key Pair** | Security credentials used to securely connect to supported EC2 instances. | Login key for instance access |
| **Pending State** | EC2 lifecycle state right after launch while AWS prepares the instance. | Warming up |
| **Running State** | EC2 lifecycle state when the instance is active and available for use. | Live and usable |
| **Stopped State** | EC2 lifecycle state when capacity is temporarily unneeded; can be started again later. | Paused, restartable |
| **Terminated State** | EC2 lifecycle state that permanently deletes an instance when no longer needed. | Deleted forever |
| **Elastic IP Address** | Static public IPv4 address allocated to an AWS account until released; can be reassociated across resources. | Permanent, movable public IPv4 |
| **Instance Metadata** | Data about a running EC2 instance (attributes, network interfaces) accessible by scripts/apps on the instance. | Self-info readable inside EC2 |
| **Amazon CloudWatch** | Monitoring service integrated with EC2 to collect performance metrics and evaluate utilization. | Eyes and metrics for EC2 |
| **Right-Sizing** | Selecting an EC2 instance type and size that match actual workload performance requirements. | Not too big, not too small |
| **Elasticity** | Ability to add computing capacity when demand rises and reduce it when demand drops. | Stretch and shrink with demand |
| **Amazon EC2 Auto Scaling** | Automatically adjusts the number of EC2 instances based on defined conditions as demand changes. | Auto-adds/removes EC2s |
| **On-Demand Instances** | EC2 pricing with no long-term commitment, suited for changing or unpredictable workloads. | Pay-as-you-go, no contract |
| **Savings Plans** | Reduced EC2 prices in exchange for committing to a consistent amount of compute usage for 1 or 3 years. | Commit to $/hr usage (1–3 yrs) |
| **Reserved Instances** | Billing discount for eligible EC2 usage in exchange for a 1- or 3-year commitment; for predictable workloads. | Commit to EC2 usage (1–3 yrs) |
| **Spot Instances** | Uses spare EC2 capacity at a discount; AWS can interrupt them when capacity is needed. | Cheap spare capacity, interruptible |
| **Dedicated Hosts** | Physical server dedicated to a single customer; supports specific compliance or software licensing needs. | Whole physical server for one tenant |

---

## 2. Look-Alike / Confusing Terms

### Group 1: Compute Service Models (EC2 vs. Lambda vs. Elastic Beanstalk vs. Containers)
| Term | What it is | Key difference | Clue words in a question |
| :--- | :--- | :--- | :--- |
| **Amazon EC2** | Virtual machine (IaaS) | Full control over guest OS, networking, and server config | "control over guest OS", "virtual servers", "IaaS", "configure server" |
| **AWS Lambda** | Serverless compute | Runs code on events/schedules; no server provisioning or continuous server | "event-driven", "no server management", "pay for use", "scheduled", "triggered by S3/DynamoDB" |
| **AWS Elastic Beanstalk** | Managed application platform | Upload web app code; AWS handles provisioning/scaling/health while resources stay accessible | "web applications", "upload code", "managed platform", "still access underlying AWS resources" |
| **Containers (ECS/EKS)** | Packaged app + dependencies | Shares host OS; portable, lightweight, faster startup than VMs | "portable", "share host OS", "libraries and dependencies", "microservices/independent components" |

> **Trap:** Choosing **Lambda** for a managed web-app deployment where developers still want access to underlying EC2/load-balancing resources (that is **Elastic Beanstalk**), or choosing **EC2** when the prompt says "without provisioning or managing servers."

---

### Group 2: AWS Container Services (ECS vs. EKS vs. Fargate vs. ECR vs. Docker)
| Term | What it is | Key difference | Clue words in a question |
| :--- | :--- | :--- | :--- |
| **Docker** | Container software platform | Builds, packages, and runs containers from images | "build, package, and run", "container image", "software platform" |
| **Amazon ECS** | Managed container orchestrator | AWS-native orchestration; coordinates where containers run and desired count | "managed container orchestration", "desired number of running containers" |
| **Amazon EKS** | Managed Kubernetes service | Runs open-source Kubernetes on AWS; AWS manages the control plane | "Kubernetes", "control plane", "open-source system", "groups" |
| **AWS Fargate** | Serverless compute for containers | Compute engine (used by ECS/EKS) so you don't manage underlying EC2 servers | "serverless compute capacity for containers", "without managing underlying servers" |
| **Amazon ECR** | Container image registry | Stores, manages, and retrieves container images for deployment | "store, manage, and retrieve container images", "registry" |

> **Trap:** Mixing up **ECR** (stores images) with **ECS/EKS** (runs/orchestrates containers), or thinking **Fargate** is an orchestrator instead of the serverless compute option used *by* ECS or EKS.

---

### Group 3: EC2 Launch & Config Artifacts (AMI vs. Instance Type vs. User Data vs. Instance Metadata)
| Term | What it is | Key difference | Clue words in a question |
| :--- | :--- | :--- | :--- |
| **AMI** | EC2 image template | Determines initial OS and software configuration | "template", "initial software environment", "operating system" |
| **EC2 Instance Type** | Hardware resource profile | Determines CPU, memory, storage, and networking capacity | "processor, memory, storage, networking capacity", "compute/memory/storage optimized" |
| **User Data** | Launch script/commands | Runs automatically when the instance is launched | "commands or scripts", "run when launched" |
| **Instance Metadata** | Live instance info | Read by apps/scripts *on* a running instance without storing it manually | "information about a running instance", "access without manually storing" |

> **Trap:** Confusing **User Data** (commands *pushed in* to run at launch) with **Instance Metadata** (runtime info *read from* the running instance).

---

### Group 4: EC2 Instance States (Pending vs. Running vs. Stopped vs. Terminated)
| Term | What it is | Key difference | Clue words in a question |
| :--- | :--- | :--- | :--- |
| **Pending** | Transitional launch state | AWS is preparing the instance right after launch | "just launched", "while AWS prepares it" |
| **Running** | Active state | Instance is available for use | "available for use", "active" |
| **Stopped** | Paused state | Temporarily not needed; can be started again later | "temporarily unnecessary", "started again later" |
| **Terminated** | Final deletion state | Permanently deletes the instance; cannot be restarted | "no longer needed", "permanently deletes" |

> **Trap:** Selecting **Stopped** when an instance is "no longer needed" and should be permanently deleted (**Terminated**), or thinking **Terminated** instances can be started again.

---

### Group 5: EC2 Pricing Options (On-Demand vs. Savings Plans vs. Reserved vs. Spot vs. Dedicated Hosts)
| Term | What it is | Key difference | Clue words in a question |
| :--- | :--- | :--- | :--- |
| **On-Demand** | Pay-as-you-go capacity | No long-term commitment | "unpredictable", "changing", "no long-term commitment" |
| **Savings Plans** | 1- or 3-year usage commitment | Commits to a *consistent amount of compute usage* for reduced prices | "consistent amount of compute usage", "1- or 3-year term" |
| **Reserved Instances** | 1- or 3-year EC2 discount | Billing discount for *eligible EC2 instance usage*; predictable workloads | "billing discount", "predictable workloads", "1- or 3-year commitment" |
| **Spot Instances** | Spare EC2 capacity | Deeply discounted, but AWS can interrupt when capacity is needed | "spare capacity", "tolerate interruptions", "discounted" |
| **Dedicated Hosts** | Single-customer physical server | Dedicated hardware for compliance or software licensing | "physical server dedicated to a single customer", "compliance", "software licensing" |

> **Trap:** Confusing **Savings Plans** (commitment to a consistent *amount of compute usage*) with **Reserved Instances** (discount for eligible *EC2 instance usage* for predictable workloads), or picking **On-Demand** instead of **Spot** for interruptible batch jobs.

---

### Group 6: EC2 Security, Access & Networking (Security Group vs. Key Pair vs. IAM Role vs. Elastic IP)
| Term | What it is | Key difference | Clue words in a question |
| :--- | :--- | :--- | :--- |
| **Security Group** | Traffic filter | Controls permitted inbound and outbound network traffic | "inbound and outbound network traffic" |
| **Key Pair** | Connection credentials | Used to securely connect to supported instances | "credentials", "securely connect" |
| **IAM Role** | Service permissions | Lets the EC2 instance access other AWS services | "permissions to access AWS services" |
| **Elastic IP Address** | Static public IPv4 | Stays allocated to account until released; can be reassociated | "static public IPv4", "reassociated", "consistent public address" |

> **Trap:** Assigning a **Security Group** when the question asks about granting an EC2 instance permission to call another AWS service (that requires an **IAM Role**).

---

## 3. Likely Distractors

- **Amazon EC2**
  - *Likely distractors:* AWS Lambda, AWS Elastic Beanstalk, AWS Fargate
  - *How to tell apart:* Only EC2 gives you virtual machines (IaaS) with full control over the guest operating system.
- **AWS Lambda**
  - *Likely distractors:* Amazon EC2, AWS Fargate, AWS Elastic Beanstalk
  - *How to tell apart:* Lambda runs code in response to events, requests, or schedules without requiring server management or a continuously running server.
- **AWS Elastic Beanstalk**
  - *Likely distractors:* Amazon EC2, AWS Lambda, Amazon ECS
  - *How to tell apart:* Elastic Beanstalk is a managed platform specifically for deploying web applications where you upload code and still retain access to underlying AWS resources.
- **Amazon ECS**
  - *Likely distractors:* Amazon EKS, AWS Fargate, Docker
  - *How to tell apart:* ECS is AWS's managed container orchestration service, whereas EKS is managed Kubernetes, Fargate is serverless compute, and Docker is the container platform itself.
- **Amazon EKS**
  - *Likely distractors:* Amazon ECS, AWS Fargate, Amazon ECR
  - *How to tell apart:* EKS specifically runs open-source Kubernetes with an AWS-managed control plane.
- **AWS Fargate**
  - *Likely distractors:* AWS Lambda, Amazon ECS, Amazon EC2
  - *How to tell apart:* Fargate provides serverless compute specifically *for containers* (inside ECS or EKS), not standalone event-driven functions (Lambda) or VMs (EC2).
- **Amazon ECR**
  - *Likely distractors:* Amazon ECS, Amazon EKS, Amazon Machine Image (AMI)
  - *How to tell apart:* ECR stores and retrieves *container images*, whereas AMIs are templates for *EC2 instances*, and ECS/EKS run containers.
- **Amazon Machine Image (AMI)**
  - *Likely distractors:* Container Image, EC2 Instance Type, User Data
  - *How to tell apart:* An AMI is the template (OS + software) used to launch an *EC2 instance*, not a container image or hardware sizing spec.
- **IAM Role**
  - *Likely distractors:* Security Group, Key Pair, Tags
  - *How to tell apart:* An IAM Role grants an instance permission to access *AWS services*; Security Groups filter network traffic, and Key Pairs authenticate user connections.
- **Elastic IP Address**
  - *Likely distractors:* Automatically assigned public IPv4, Security Group, VPC/Subnet
  - *How to tell apart:* Unlike an auto-assigned public IP, an Elastic IP is static, stays allocated until released, and can be reassociated to another resource.
- **Right-Sizing**
  - *Likely distractors:* Elasticity, Amazon EC2 Auto Scaling, Optimizing Storage
  - *How to tell apart:* Right-sizing matches an instance's *type and size* to workload needs; elasticity/Auto Scaling adjusts the *number of instances* or capacity as demand fluctuates.
- **Spot Instances**
  - *Likely distractors:* On-Demand Instances, Reserved Instances, Savings Plans
  - *How to tell apart:* Spot Instances use spare capacity that AWS can interrupt when the capacity is needed, unlike On-Demand or committed plans.

---

## 4. Lists, Sequences & "Which is NOT"

1. **4 Approaches / Types of AWS Compute Services** (Page 1–2)
   - Virtual machine-based computing (Amazon EC2)
   - Serverless computing (AWS Lambda)
   - Container-based computing (ECS, EKS, Fargate, ECR)
   - Managed application platforms (AWS Elastic Beanstalk)
   - *Fake "NOT" swap:* Physical server purchasing/maintenance (explicitly what AWS compute avoids).

2. **3 Factors for Selecting an Appropriate Compute Service** (Page 1)
   - Application design
   - Usage patterns
   - Level of infrastructure control required
   - *Fake "NOT" swap:* Physical server rack space or hardware vendor.

3. **4 EC2 Instance Type Families** (Page 2)
   - General purpose (balance of compute, memory, networking)
   - Compute optimized (high processing performance)
   - Memory optimized (large amounts of data in memory)
   - Storage optimized (high performance for locally stored data)
   - *Fake "NOT" swap:* "Network optimized" or "Serverless optimized" (not listed in this handout).

4. **9 Major Decisions When Launching an EC2 Instance** (Page 2–3)
   1. Select an AMI
   2. Select an instance type
   3. Configure network settings (VPC, subnet, etc.)
   4. Assign an IAM role
   5. Provide user data
   6. Configure storage
   7. Add tags
   8. Configure a security group
   9. Select a key pair
   - *Fake "NOT" swap:* Selecting an Elastic IP address or choosing a Lambda runtime (Elastic IP is associated separately; Lambda runtime is for Lambda).

5. **4 EC2 Instance Lifecycle States** (Page 3)
   1. Pending (after launch, while AWS prepares)
   2. Running (available for use)
   3. Stopped (temporarily unnecessary; can be started again)
   4. Terminated (permanently deleted)
   - *Fake "NOT" swap:* "Archived" or "Suspended" or "Hibernated" (not in the handout).

6. **4 Areas of EC2 Cost Optimization** (Page 4–5)
   - Right-sizing resources
   - Increasing elasticity
   - Selecting appropriate pricing options
   - Optimizing storage choices
   - *Fake "NOT" swap:* Buying physical servers or disabling CloudWatch monitoring.

7. **5 EC2 Pricing Options** (Page 4)
   - On-Demand Instances
   - Savings Plans
   - Reserved Instances
   - Spot Instances
   - Dedicated Hosts
   - *Fake "NOT" swap:* "Free Tier Instances" or "Pay-Per-Invocation" (Lambda uses pay-for-use per request).

8. **4 Factors for Selecting an EC2 Pricing Option** (Page 4)
   - Workload duration
   - Predictability
   - Flexibility
   - Tolerance for interruption
   - *Fake "NOT" swap:* Guest operating system type or AMI template.

9. **2 Primary Compute Options for Amazon ECS (and EKS)** (Page 5–6)
   - Amazon EC2 (greater control over underlying compute resources)
   - AWS Fargate (serverless; no server provisioning/management)
   - *Fake "NOT" swap:* AWS Lambda or AWS Elastic Beanstalk.

10. **4 Example Triggers for Event-Driven Lambda Invocation** (Page 6)
    - Object uploaded to an Amazon S3 bucket
    - Data added or changed in an Amazon DynamoDB table
    - Request received through an application
    - Scheduled event occurs
    - *Fake "NOT" swap:* An EC2 instance entering the pending state (not listed as a trigger).

11. **5 Steps in How AWS Lambda Works (Sequence)** (Page 7)
    1. An event occurs or a request invokes a Lambda function.
    2. AWS Lambda allocates the resources required to run the function.
    3. The function executes the configured code.
    4. Lambda automatically manages the underlying compute environment.
    5. Resources can scale according to the number of incoming events or requests.

12. **5 Benefits of AWS Lambda** (Page 7)
    - No server management
    - Automatic scaling
    - Pay for use
    - Integration with AWS services
    - Flexible resource configuration
    - *Fake "NOT" swap:* Full control over the guest operating system (that is EC2).

13. **8 Supported Platforms in AWS Elastic Beanstalk** (Page 8)
    - Docker, Go, Java, .NET, Node.js, PHP, Python, Ruby
    - *Fake "NOT" swap:* C++ or Kubernetes (not listed under Beanstalk supported platforms).

14. **6 Steps in How AWS Elastic Beanstalk Works (Sequence)** (Page 8)
    1. Create an Elastic Beanstalk application.
    2. Select the appropriate platform for the application.
    3. Upload the application code.
    4. Configure the application environment.
    5. Elastic Beanstalk provisions the resources required to run the application.
    6. Elastic Beanstalk monitors the deployed environment and supports scaling as required.

15. **5 Benefits of AWS Elastic Beanstalk** (Page 8)
    - Simplified deployment
    - Infrastructure management
    - Scalability
    - Health monitoring
    - Developer control (underlying AWS resources remain accessible)
    - *Fake "NOT" swap:* Zero access to underlying AWS resources or pay-per-request serverless execution.

---

## 5. Situational Practice Questions

1. A company needs to migrate a legacy application that requires full administrative control over the guest operating system and custom networking configurations. Which AWS compute service best fits this requirement?
   - A. AWS Lambda
   - B. Amazon EC2
   - C. AWS Fargate
   - D. AWS Elastic Beanstalk

2. A media startup wants to automatically generate a thumbnail every time a user uploads an image to an Amazon S3 bucket, without maintaining a continuously running server. Which service should they use?
   - A. AWS Lambda
   - B. Amazon EC2
   - C. Amazon ECR
   - D. AWS Elastic Beanstalk

3. A development team wants to deploy a Python web application quickly by uploading their code and letting AWS handle resource provisioning, load balancing, scaling, and health monitoring, while still keeping access to underlying AWS resources if needed. Which service should they choose?
   - A. Amazon EC2
   - B. AWS Lambda
   - C. AWS Elastic Beanstalk
   - D. Amazon ECS

4. A team is building an application from independent components that must run consistently across different environments and start up faster than virtual machines by sharing the host operating system. Which approach should they use?
   - A. Virtual machine-based computing
   - B. Container-based computing
   - C. Dedicated Hosts
   - D. Elastic IP addressing

5. An organization already uses open-source Kubernetes and wants AWS to manage the Kubernetes control plane so they can reduce operational effort. Which service meets this need?
   - A. Amazon ECS
   - B. Amazon ECR
   - C. Amazon EKS
   - D. AWS Elastic Beanstalk

6. A company runs containerized applications on Amazon ECS and wants to eliminate the task of provisioning and managing the underlying EC2 servers. Which compute option should they pair with ECS?
   - A. AWS Fargate
   - B. Amazon ECR
   - C. Amazon CloudWatch
   - D. AWS Lambda

7. Before Amazon ECS or Amazon EKS can deploy a containerized application, the team needs a managed AWS location to store, manage, and retrieve their container images. Which service should they use?
   - A. Amazon ECS
   - B. Amazon EKS
   - C. Amazon ECR
   - D. Amazon Machine Image (AMI)

8. While launching an EC2 instance, an administrator wants to ensure the virtual server starts with a specific operating system and pre-installed software environment. Which launch decision addresses this?
   - A. Select an instance type
   - B. Select an AMI
   - C. Configure a security group
   - D. Add tags

9. A data analytics workload processes massive datasets directly in memory and requires high RAM capacity relative to CPU. Which EC2 instance type family should be selected?
   - A. General purpose
   - B. Compute optimized
   - C. Memory optimized
   - D. Storage optimized

10. During EC2 launch configuration, a developer wants a script to run automatically at startup to install updates, and also wants an application on the running instance to query its own network interface attributes without manually storing them. Which two features correspond to these needs?
    - A. User data; Instance metadata
    - B. Instance metadata; User data
    - C. Tags; IAM role
    - D. Security group; Key pair

11. An EC2 instance needs permission to read files from another AWS service, while network engineers must restrict which inbound and outbound traffic can reach the instance. Which pair of settings should be configured?
    - A. Key pair and Tags
    - B. IAM role and Security group
    - C. Security group and Key pair
    - D. User data and AMI

12. A developer launches a new EC2 instance and notices it is not yet ready for SSH connections because AWS is still preparing it. Later, when the instance is temporarily unneeded over the weekend, the developer pauses it so it can be restarted on Monday. What are these two lifecycle states in order?
    - A. Running; Terminated
    - B. Pending; Stopped
    - C. Stopped; Pending
    - D. Pending; Terminated

13. A web server hosted on EC2 must keep the exact same public IPv4 address even if the underlying EC2 instance is replaced with a new one. Which feature should the team use?
    - A. Automatically assigned public IPv4 address
    - B. Elastic IP address
    - C. Security group
    - D. Instance metadata

14. After reviewing Amazon CloudWatch metrics, an engineer discovers an EC2 instance consistently uses only 10% of its allocated CPU and memory. Moving it to a smaller instance type and size is an example of:
    - A. Elasticity
    - B. Right-sizing
    - C. Spot pricing
    - D. Optimizing storage

15. A batch processing job can be paused and resumed anytime without affecting business operations, and the company wants the steepest possible discount on EC2 capacity. Which pricing option is best?
    - A. On-Demand Instances
    - B. Reserved Instances
    - C. Spot Instances
    - D. Dedicated Hosts

16. A company has a strict third-party software licensing agreement and compliance requirement that mandates workloads run on a physical server isolated to a single customer. Which EC2 pricing option should they select?
    - A. Reserved Instances
    - B. Savings Plans
    - C. Dedicated Hosts
    - D. On-Demand Instances

17. A startup has unpredictable traffic spikes with no long-term usage history and cannot commit to a 1- or 3-year contract. Which EC2 pricing option fits best?
    - A. On-Demand Instances
    - B. Savings Plans
    - C. Reserved Instances
    - D. Spot Instances

18. Which of the following is NOT one of the four areas of Amazon EC2 cost optimization?
    - A. Right-sizing resources
    - B. Increasing elasticity
    - C. Selecting appropriate pricing options
    - D. Disabling guest OS updates

19. Which of the following is NOT a benefit of AWS Lambda listed in the handout?
    - A. No server management
    - B. Automatic scaling
    - C. Full control over the guest operating system
    - D. Pay for use

20. *(Definition Reversal)* Which term describes the ability to add computing capacity when workload demand increases and reduce it when demand decreases, rather than maintaining peak capacity at all times?
    - A. Right-sizing
    - B. Elasticity
    - C. Container orchestration
    - D. Instance metadata

21. *(Definition Reversal)* Which EC2 lifecycle state permanently deletes an instance when it is no longer needed?
    - A. Pending
    - B. Stopped
    - C. Terminated
    - D. Released

22. A developer is deploying a Node.js app using AWS Elastic Beanstalk. After creating the application, selecting the platform, uploading the code, and configuring the environment, what does Elastic Beanstalk do next?
    - A. Terminates unused EC2 instances immediately
    - B. Provisions the resources required to run the application
    - C. Stores the container image in Amazon ECR
    - D. Requires the developer to manually configure every security group and load balancer

---

## 6. Last-Minute Cram Sheet

- **EC2 = IaaS virtual servers:** AWS manages physical hardware; customers control the guest OS, software, and networking.
- **Containers vs. VMs:** Containers share the host OS (lightweight, faster startup), whereas VMs each run a separate guest OS.
- **Container service roles:** **Docker** builds/runs containers; **ECR** stores images; **ECS/EKS** orchestrate containers; **Fargate** runs containers serverlessly.
- **AWS Lambda:** Serverless, event-driven or scheduled compute; billed on requests and compute consumed while executing (no idle server).
- **AWS Elastic Beanstalk:** Managed platform for web apps (upload code -> auto-provisions, load balances, scales, monitors health) while keeping underlying AWS resources accessible.
- **AMI vs. Instance Type:** AMI = OS + initial software template; Instance Type = CPU, memory, storage, and networking capacity.
- **IAM Role vs. Security Group vs. Key Pair:** IAM Role = AWS service permissions; Security Group = inbound/outbound traffic rules; Key Pair = login credentials.
- **User Data vs. Instance Metadata:** User Data = startup commands run at launch; Instance Metadata = live instance info readable by apps/scripts on the instance.
- **EC2 Lifecycle:** `Pending` (preparing) -> `Running` (active) -> `Stopped` (paused, restartable) or `Terminated` (permanently deleted).
- **Elastic IP:** Static public IPv4 allocated to your account until released, reassociable across resources (AWS charges for public IPv4 addresses).
- **4 EC2 Cost Optimization Areas:** Right-sizing, increasing elasticity (Auto Scaling), selecting pricing options, and optimizing storage (reviewing unused volumes/snapshots).
- **EC2 Pricing Quick Match:** **On-Demand** (unpredictable, no commitment), **Savings Plans** (1–3 yr consistent compute usage), **Reserved** (1–3 yr predictable EC2 usage), **Spot** (spare capacity, interruptible), **Dedicated Hosts** (single-tenant physical server for licensing/compliance).

---

## Answer Key

1. **B. Amazon EC2** — EC2 gives customers control over the guest OS, software, and networking. *Distractor:* Elastic Beanstalk (D) is a managed platform for web apps and abstracts away full OS-level server management.
2. **A. AWS Lambda** — Lambda is serverless and natively triggered by events such as an S3 bucket upload without a continuously running server. *Distractor:* Elastic Beanstalk (D) is for deploying web applications rather than event-driven functions.
3. **C. AWS Elastic Beanstalk** — Beanstalk lets developers upload web app code, handles provisioning/load balancing/scaling/health monitoring, and still allows access to underlying AWS resources. *Distractor:* EC2 (A) requires manual server and infrastructure configuration.
4. **B. Container-based computing** — Containers package apps with dependencies, share the host OS, and start faster than VMs. *Distractor:* Virtual machine-based computing (A) requires a separate guest OS per app.
5. **C. Amazon EKS** — EKS is a managed Kubernetes service where AWS manages the Kubernetes control plane. *Distractor:* Amazon ECS (A) is AWS's own container orchestrator, not Kubernetes.
6. **A. AWS Fargate** — Fargate provides serverless compute capacity for containers on ECS/EKS without managing servers. *Distractor:* Amazon ECR (B) only stores container images; it does not run containers.
7. **C. Amazon ECR** — ECR is the managed container image registry for storing, managing, and retrieving container images. *Distractor:* AMI (D) is a template for launching EC2 instances, not container images.
8. **B. Select an AMI** — An AMI is the template containing the OS and initial software configuration for launching an EC2 instance. *Distractor:* Instance type (A) selects CPU/memory/storage/networking capacity, not the OS.
9. **C. Memory optimized** — Memory optimized instances are designed for workloads that process large amounts of data in memory. *Distractor:* Storage optimized (D) is for high-performance access to locally stored data on disk.
10. **A. User data; Instance metadata** — User data supplies startup scripts at launch, while instance metadata lets running apps/scripts read instance attributes. *Distractor:* Option B reverses the two definitions.
11. **B. IAM role and Security group** — IAM roles grant permissions to access AWS services, and security groups define permitted inbound/outbound traffic. *Distractor:* Key pairs (C) are only for securely connecting to the instance.
12. **B. Pending; Stopped** — An instance enters `pending` while AWS prepares it at launch, and `stopped` pauses it so it can be started again later. *Distractor:* Terminated (A, D) permanently deletes the instance.
13. **B. Elastic IP address** — An Elastic IP is a static public IPv4 address that remains allocated until released and can be reassociated to another instance. *Distractor:* Auto-assigned public IPv4 (A) is not static/reassociable across instances.
14. **B. Right-sizing** — Right-sizing matches instance type and size to actual workload performance requirements to avoid unnecessary costs. *Distractor:* Elasticity (A) adjusts capacity dynamically as demand rises and falls.
15. **C. Spot Instances** — Spot Instances use spare EC2 capacity at discounted prices and suit workloads that can tolerate interruptions. *Distractor:* Reserved Instances (B) require a 1- or 3-year commitment for steady workloads.
16. **C. Dedicated Hosts** — Dedicated Hosts provide a physical server dedicated to a single customer for specific compliance or licensing needs. *Distractor:* Reserved Instances (A) only provide a billing discount, not dedicated physical hardware.
17. **A. On-Demand Instances** — On-Demand has no long-term commitment and fits changing or unpredictable workloads. *Distractor:* Savings Plans (B) require a 1- or 3-year commitment.
18. **D. Disabling guest OS updates** — The four areas are right-sizing, increasing elasticity, pricing options, and optimizing storage. *Distractor:* Options A–C are all explicitly listed in the handout.
19. **C. Full control over the guest operating system** — Full guest OS control is a feature of EC2, whereas Lambda abstracts away server management. *Distractor:* Options A, B, and D are all listed benefits of Lambda.
20. **B. Elasticity** — Elasticity adjusts computing capacity up when demand increases and down when demand decreases. *Distractor:* Right-sizing (A) is choosing the right instance type/size for a workload's performance needs.
21. **C. Terminated** — Terminating an instance permanently deletes it when it is no longer needed. *Distractor:* Stopped (B) only pauses the instance so it can be restarted later.
22. **B. Provisions the resources required to run the application** — Step 5 of Elastic Beanstalk deployment is provisioning the required resources (followed by monitoring and scaling in Step 6). *Distractor:* Option C refers to container image storage (ECR), not Beanstalk's workflow.
