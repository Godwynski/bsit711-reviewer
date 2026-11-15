# Cloud Storage Exam Reviewer (07 Handout 1: Storage)

## 1. Key Terms

| Term | Short definition (handout wording, simplified) | Memory hook |
| :--- | :--- | :--- |
| **AWS Cloud Storage Services** | Services for storing, accessing, and managing data without maintaining physical storage infrastructure | No physical drives to buy or maintain |
| **Amazon EBS (Elastic Block Store)** | Block-level storage for EC2 instances using volumes attached like physical computer drives | **B**lock = virtual **B**rick/drive for one EC2 |
| **EBS Volume** | Block storage resource created in one Availability Zone and attached to a compatible EC2 instance in that AZ | Drive locked to one AZ |
| **Persistent Storage** | Data remains available even when an EC2 instance is stopped or a volume is detached (per deletion settings) | Survives EC2 stop/detach |
| **Root Volume** | EBS volume storing the operating system and files needed to run an EC2 instance | Where the OS boots from |
| **SSD Volumes** | EBS volume category for frequent read/write operations with low latency (boot volumes, transactional DBs) | **S**peedy **S**mall random I/O |
| **HDD Volumes** | EBS volume category for throughput-intensive workloads processing large sequential data (logs, big data) | **H**eavy sequential throughput |
| **IOPS** | Input/output operations per second; a workload performance metric for selecting EBS volume types | How many operations per second |
| **Throughput** | Amount of data transferred per unit of time; a workload performance metric for EBS and EFS | How wide the data pipe is |
| **Latency** | Delay before data transfer/access begins; a workload performance metric | Wait time / responsiveness |
| **EBS Snapshot** | Point-in-time backup of an EBS volume stored in AWS-managed Amazon S3 infrastructure | Photo of an EBS volume at one moment |
| **Incremental Snapshot** | Default EBS snapshot behavior storing only blocks changed since the previous snapshot | Only saves what changed |
| **Amazon S3 (Simple Storage Service)** | Object storage service storing data as objects inside containers called buckets | Bucket full of objects + metadata |
| **Bucket** | Container in S3 for storing objects; has a globally unique name in an AWS partition and lives in a specific Region | Globally named folder in one Region |
| **Object** | Individual file or data stored in an S3 bucket together with its associated metadata | Data + metadata |
| **Object Key** | Unique identifier used to locate an object within an S3 bucket | The object's unique ID/path in a bucket |
| **Metadata** | Information associated with an S3 object, such as content type and other properties | Data about the object |
| **S3 Standard** | S3 storage class for frequently accessed data needing high availability and low-latency access | Default hot data class |
| **S3 Intelligent-Tiering** | S3 storage class that automatically moves eligible objects between access tiers as access patterns change | Auto-pilot cost optimizer |
| **S3 Standard-IA** | S3 storage class for less frequently accessed data that still requires rapid retrieval | Infrequent, but fast when needed |
| **S3 One Zone-IA** | S3 storage class storing infrequent data in a single Availability Zone (for recreatable or backed-up data) | One AZ = cheaper, no multi-AZ copy |
| **S3 Glacier Instant Retrieval** | S3 archival class for rarely accessed data needing immediate retrieval in milliseconds (no restore request) | Cold data, instant ms access |
| **S3 Glacier Flexible Retrieval** | S3 archival class with retrieval times from minutes to hours (requires restore request) | Cold data, minutes-to-hours restore |
| **S3 Glacier Deep Archive** | S3 long-term archival class for very rarely accessed data with retrieval times measured in hours | Coldest, slowest, lowest cost |
| **S3 Versioning** | Bucket-level feature keeping multiple versions of an object with the same key; can be suspended, never unversioned | Undo button against overwrites/deletes |
| **S3 Lifecycle Management** | Rules that automatically transition objects to other classes or expire/delete them over time | Automated aging & cleanup rules |
| **IAM Policies** | Policies defining permissions that allow or deny users and roles access to AWS resources (S3, EFS) | Who (user/role) can do what |
| **Bucket Policies** | Resource-based policies attached to an S3 bucket to control access to the bucket and its objects | Rules attached to the bucket itself |
| **S3 Block Public Access** | Settings that help prevent unintended public access to S3 buckets and objects | Master lock against public leaks |
| **Server-Side Encryption** | Encryption protecting stored objects in S3/Glacier; S3 encrypts new object uploads by default | AWS encrypts data at rest automatically |
| **Access Logging** | S3 feature providing records of requests made to buckets when server access logging is configured | Audit trail of bucket requests |
| **Principle of Least Privilege** | Security principle of granting only the permissions required to perform authorized tasks | Minimum access needed, nothing more |
| **Durability (11 nines)** | S3/Glacier design target of 99.999999999% object durability across storage classes | 99.999999999% safe from loss |
| **Amazon EFS (Elastic File System)** | Managed shared file storage service accessed simultaneously by multiple computing resources | Shared network drive for Linux EC2s |
| **NFS (Network File System) Protocol** | File-sharing protocol supported by Amazon EFS for Linux-based workloads | Linux shared-file protocol |
| **EFS Standard** | EFS storage class for frequently accessed files requiring low-latency access | Hot EFS files |
| **EFS Infrequent Access (EFS IA)** | EFS storage class for less frequently accessed files that can tolerate higher access latency | Warm/cooler EFS files |
| **EFS Archive** | EFS storage class for rarely accessed files tolerating higher latency in exchange for lower cost | Cold EFS files |
| **General Purpose Performance Mode** | EFS performance mode designed for applications requiring low-latency file operations | EFS low-latency mode |
| **Elastic Throughput** | EFS throughput option that automatically adjusts throughput based on workload activity | Auto-scaling throughput |
| **Provisioned Throughput** | EFS throughput option where users specify a fixed throughput level | Manual throughput setting |
| **Bursting Throughput** | EFS throughput option based on the amount of stored data and available burst credits | Scales with stored size + credits |
| **Regional File Systems (EFS)** | EFS file system type storing data redundantly across multiple Availability Zones in a Region | Multi-AZ high availability EFS |
| **One Zone File Systems (EFS)** | EFS file system type storing data within a single Availability Zone (no multi-AZ resilience) | Single-AZ EFS |
| **Security Groups (EFS)** | Virtual firewall rules controlling network traffic between EFS mount targets and computing resources | Network traffic filter for mount targets |
| **Encryption at Rest / in Transit** | EFS protections for stored data (at rest) and data transferred between clients and file system (in transit) | Protected while sitting & while moving |
| **EFS Access Points** | Application-specific entry points enforcing a root directory and POSIX user identity for file access | App-specific door with POSIX ID |
| **Expedited / Standard / Bulk Retrieval** | Glacier restore speeds: Expedited (1–5 min, Flexible only), Standard (3–5 hr Flexible / 12 hr Deep), Bulk (5–12 hr Flexible / 48 hr Deep) | Fast / Normal / Cheap-large restore |
| **Early Deletion Charges** | Fees incurred when deleting or transitioning Glacier objects before their minimum storage duration ends | Penalty for leaving Glacier too early |
| **S3 Object Lock** | Feature preventing object versions from being deleted or overwritten for a specified retention period | Retention lock for object versions |

---

## 2. Look-Alike / Confusing Terms

### Group A: EBS vs. S3 vs. EFS (Core Storage Models)
| Term | What it is | Key difference | Clue words in a question |
| :--- | :--- | :--- | :--- |
| **Amazon EBS** | Block-level storage attached as volumes to EC2 | Used like a local hard drive for a compatible EC2 instance in one AZ | "block-level", "root volume", "boot volume", "attach/detach", "IOPS", "EC2 instance" |
| **Amazon S3** | Object storage using buckets and objects | Stores unstructured files with metadata via keys; 11 nines durability; not mounted as an OS drive | "buckets", "object keys", "metadata", "static website", "99.999999999%", "lifecycle rules" |
| **Amazon EFS** | Managed shared file storage using directories | Mounted simultaneously by multiple Linux EC2 instances via NFS; auto-grows/shrinks | "shared file storage", "multiple EC2 instances simultaneously", "NFS", "Linux", "directories" |

> **Trap Warning:** EBS and EFS both attach to EC2 instances, but EBS volumes attach to compatible EC2 instances in the same AZ, subject to volume type and attachment limitations, whereas EFS is mounted simultaneously across multiple Linux EC2s via NFS.

### Group B: EBS SSD vs. EBS HDD
| Term | What it is | Key difference | Clue words in a question |
| :--- | :--- | :--- | :--- |
| **SSD Volumes** | EBS volumes designed for frequent read/write operations with low latency | Optimized for frequent random read/write and low latency (IOPS) | "boot volumes", "transactional databases", "frequent read and write", "low latency", "responsive" |
| **HDD Volumes** | EBS volumes designed for throughput-intensive sequential data | Optimized for large sequential data and high throughput | "throughput-intensive", "sequential data", "log processing", "large-scale data processing" |

> **Trap Warning:** Do not pick HDD for transactional databases or boot volumes—only SSD handles frequent low-latency read/writes.

### Group C: S3 Standard-IA vs. S3 One Zone-IA vs. S3 Intelligent-Tiering
| Term | What it is | Key difference | Clue words in a question |
| :--- | :--- | :--- | :--- |
| **S3 Standard-IA** | Infrequent access across multiple AZs | Rapid retrieval for infrequent data that still needs multi-AZ availability | "less frequently", "rapid retrieval", standard durability/availability |
| **S3 One Zone-IA** | Infrequent access in a single AZ | Stored in only one AZ; only for data that can be recreated or has another copy | "single Availability Zone", "can be recreated", "protected by another copy" |
| **S3 Intelligent-Tiering** | Automated tier-moving storage class | Automatically moves objects between tiers when access patterns change | "changing access patterns", "unknown/unpredictable access", "automatically moves between tiers" |

> **Trap Warning:** If the scenario says the infrequent data is *irreplaceable* and has *no other copy*, S3 One Zone-IA is wrong—choose S3 Standard-IA.

### Group D: S3 Glacier Instant vs. Flexible vs. Deep Archive
| Term | What it is | Key difference | Clue words in a question |
| :--- | :--- | :--- | :--- |
| **Glacier Instant Retrieval** | Millisecond-access archival class | Accessed directly **without** a restore request | "milliseconds", "immediate access", "no restore operation" |
| **Glacier Flexible Retrieval** | Minutes-to-hours archival class | Offers Expedited (1–5 min), Standard (3–5 hr), and Bulk (5–12 hr) restore | "minutes to hours", "Expedited", "1–5 minutes", "3–5 hours", "5–12 hours" |
| **Glacier Deep Archive** | Lowest-cost long-term archive | Hours only: Standard (12 hr) or Bulk (48 hr); **no** Expedited option | "very rarely", "long-term archival", "12 hours", "48 hours", "lowest cost" |

> **Trap Warning:** Glacier Deep Archive does **not** support Expedited retrieval; only Flexible Retrieval has Expedited (1–5 min).

### Group E: EFS Throughput Modes (Elastic vs. Provisioned vs. Bursting)
| Term | What it is | Key difference | Clue words in a question |
| :--- | :--- | :--- | :--- |
| **Elastic Throughput** | Auto-adjusting throughput mode | Automatically scales throughput up/down with workload activity | "automatically adjusts", "varying/unpredictable file system activity" |
| **Provisioned Throughput** | User-specified throughput mode | Admin explicitly sets a fixed throughput level | "specify a throughput level", "guaranteed/fixed throughput" |
| **Bursting Throughput** | Size-and-credit-based throughput mode | Throughput depends on stored data size and available burst credits | "amount of data stored", "burst credits" |

> **Trap Warning:** Provisioned Throughput does not mean "automatic"—Elastic Throughput is the one that adjusts automatically.

### Group F: S3 Versioning vs. S3 Object Lock vs. S3 Lifecycle
| Term | What it is | Key difference | Clue words in a question |
| :--- | :--- | :--- | :--- |
| **S3 Versioning** | Keeps multiple versions of same-key objects | Protects against accidental overwrite/delete; previous versions still exist | "accidental overwriting", "retrieve previous versions", "bucket level", "suspended" |
| **S3 Object Lock** | Retention lock preventing deletion/overwriting | Blocks even explicit deletion/overwrite for a specified retention period | "prevent deletion or overwriting", "specified retention period", "compliance retention" |
| **S3 Lifecycle Management** | Automated transition/expiration rules | Moves objects to cheaper classes or deletes/expires them after a set time | "transition to lower-cost class", "expire objects", "abort incomplete multipart uploads" |

> **Trap Warning:** Versioning alone lets you *recover* deleted/overwritten objects, whereas Object Lock *prevents* deletion/overwriting during a retention period.

### Group G: IAM Policies vs. Bucket Policies vs. Security Groups vs. EFS Access Points
| Term | What it is | Key difference | Clue words in a question |
| :--- | :--- | :--- | :--- |
| **IAM Policies** | Identity-based permissions on users/roles | Attached to IAM users or roles to allow/deny S3 or EFS actions | "users and roles", "authorize client access" |
| **Bucket Policies** | Resource-based policies on an S3 bucket | Attached directly to the bucket to control bucket/object access | "resource-based", "attached to bucket" |
| **Security Groups** | Network traffic filter for EFS | Controls traffic between EFS mount targets and compute instances | "network traffic", "mount targets", "connected computing resources" |
| **EFS Access Points** | App-specific entry points into EFS | Enforces a root directory and POSIX user identity per application | "application-specific entry points", "root directory", "POSIX user identity" |

> **Trap Warning:** S3 uses Bucket Policies and Block Public Access; EFS uses Security Groups and EFS Access Points (not bucket policies).

---

## 3. Likely Distractors

- **Amazon EBS** → Likely distractors: *Amazon EFS, Amazon S3, EBS Snapshot*
  - *How to tell apart:* EBS is single-EC2 block storage; EFS is multi-EC2 shared file storage; S3 is object storage in buckets; a Snapshot is a backup of an EBS volume.
- **Amazon S3** → Likely distractors: *Amazon EBS, Amazon EFS, S3 Glacier*
  - *How to tell apart:* S3 is general object storage in buckets with keys/metadata; EBS is block volumes; EFS is NFS file systems; Glacier is specifically the archival tier inside S3.
- **Amazon EFS** → Likely distractors: *Amazon EBS, Amazon S3, EFS Access Points*
  - *How to tell apart:* EFS is the shared Linux NFS file system service; EBS is single-instance block storage; S3 is object storage; Access Points are an EFS security feature.
- **EBS Snapshot** → Likely distractors: *S3 Versioning, S3 Lifecycle, EBS Volume*
  - *How to tell apart:* Snapshot is a point-in-time incremental backup of an EBS volume stored in S3; Versioning keeps S3 object history; Lifecycle automates S3 class transitions/deletions; Volume is the active block drive.
- **S3 Glacier Instant Retrieval** → Likely distractors: *S3 Standard-IA, S3 Glacier Flexible Retrieval, S3 Glacier Deep Archive*
  - *How to tell apart:* Instant Retrieval gives millisecond access to *archival* data without a restore request; Standard-IA is for less frequent non-archival data; Flexible/Deep require restore requests taking minutes to hours.
- **S3 Glacier Deep Archive** → Likely distractors: *S3 Glacier Flexible Retrieval, S3 Glacier Instant Retrieval, S3 One Zone-IA*
  - *How to tell apart:* Deep Archive is for very rarely accessed long-term archives taking 12 or 48 hours; Flexible takes minutes to 12 hours; Instant takes milliseconds; One Zone-IA is single-AZ rapid retrieval.
- **S3 Versioning** → Likely distractors: *S3 Object Lock, S3 Lifecycle Management, EBS Snapshot*
  - *How to tell apart:* Versioning retains multiple versions of an S3 object; Object Lock blocks deletion/overwriting for a retention period; Lifecycle transitions/expires objects; Snapshot backs up EBS blocks.
- **S3 Block Public Access** → Likely distractors: *IAM Policies, Bucket Policies, Access Logging*
  - *How to tell apart:* Block Public Access specifically prevents unintended public exposure; IAM/Bucket policies grant/deny specific permissions; Access Logging only records requests.
- **EFS Regional File System** → Likely distractors: *EFS One Zone File System, S3 One Zone-IA, EBS Volume*
  - *How to tell apart:* EFS Regional replicates across multiple AZs in a Region; EFS One Zone and EBS live in one AZ; S3 One Zone-IA is object storage in one AZ.
- **Elastic Throughput (EFS)** → Likely distractors: *Provisioned Throughput, Bursting Throughput, General Purpose Performance Mode*
  - *How to tell apart:* Elastic auto-adjusts to activity; Provisioned is manually specified; Bursting uses stored size + credits; General Purpose is a *performance mode* (latency), not a throughput option.

---

## 4. Lists, Sequences & "Which is NOT"

1. **5 Factors for Selecting an AWS Storage Service:**
   1. Data type
   2. Access frequency
   3. Performance requirements
   4. Availability
   5. Storage cost
   *(Fake NOT swap: "Physical rack space" or "EC2 CPU clock speed")*

2. **2 Main Categories of Amazon EBS Volume Types:**
   1. Solid State Drive (SSD) volumes
   2. Hard Disk Drive (HDD) volumes
   *(Fake NOT swap: "Tape volumes" or "Object volumes")*

3. **3 EBS Workload Performance Metrics:**
   1. Input/output operations per second (IOPS)
   2. Throughput
   3. Latency
   *(Fake NOT swap: "Object key length" or "POSIX identity")*

4. **5 Benefits of Amazon EBS:**
   1. Persistent storage
   2. Flexible capacity
   3. Storage performance options (SSD and HDD)
   4. Data protection (snapshots)
   5. Encryption
   *(Fake NOT swap: "Multi-instance simultaneous mounting" — that's EFS)*

5. **4 Main Components of Amazon S3 Storage:**
   1. Buckets
   2. Objects
   3. Object keys
   4. Metadata
   *(Fake NOT swap: "Volumes" or "Directories/Mount targets")*

6. **3 Factors for Selecting an Amazon S3 Storage Class:**
   1. How frequently the data is accessed
   2. How quickly it must be retrieved
   3. Cost requirements of the workload
   *(Fake NOT swap: "EC2 Availability Zone attachment limit")*

7. **7 Common Amazon S3 Storage Classes:**
   1. S3 Standard
   2. S3 Intelligent-Tiering
   3. S3 Standard-Infrequent Access (S3 Standard-IA)
   4. S3 One Zone-Infrequent Access (S3 One Zone-IA)
   5. S3 Glacier Instant Retrieval
   6. S3 Glacier Flexible Retrieval
   7. S3 Glacier Deep Archive
   *(Fake NOT swap: "EFS Archive" or "EBS Snapshot Tier")*

8. **4 Actions S3 Lifecycle Rules Can Perform:**
   1. Transitioning objects (to lower-cost classes)
   2. Expiring objects (auto-deleting after a specified period)
   3. Managing previous versions (transitioning/expiring noncurrent versions)
   4. Removing incomplete uploads (aborting incomplete multipart uploads after specified days)
   *(Fake NOT swap: "Encrypting unencrypted EBS volumes" or "Attaching volumes to EC2")*

9. **5 Amazon S3 Security and Access Management Mechanisms:**
   1. IAM policies
   2. Bucket policies
   3. S3 Block Public Access
   4. Encryption (server-side, automatic by default for new uploads)
   5. Access logging
   *(Fake NOT swap: "Security groups" or "EFS access points")*

10. **5 Benefits of Amazon S3:**
    1. Scalability
    2. Durability (99.999999999% / 11 nines)
    3. Storage flexibility
    4. Data protection
    5. Automated management (lifecycle rules)
    *(Fake NOT swap: "POSIX file locking")*

11. **3 Main Amazon EFS Storage Classes:**
    1. EFS Standard
    2. EFS Infrequent Access (EFS IA)
    3. EFS Archive
    *(Fake NOT swap: "EFS Intelligent-Tiering" or "EFS Deep Archive")*

12. **3 Amazon EFS Throughput Options:**
    1. Elastic Throughput
    2. Provisioned Throughput
    3. Bursting Throughput
    *(Fake NOT swap: "General Purpose Throughput" — General Purpose is a performance mode)*

13. **2 Primary Amazon EFS File System Types:**
    1. Regional file systems (multi-AZ)
    2. One Zone file systems (single-AZ)
    *(Fake NOT swap: "Global file systems")*

14. **5 Amazon EFS Security and Access Management Mechanisms:**
    1. IAM policies
    2. Security groups
    3. Encryption at rest
    4. Encryption in transit
    5. EFS access points
    *(Fake NOT swap: "Bucket policies" or "S3 Block Public Access")*

15. **5 Benefits of Amazon EFS:**
    1. Shared file access
    2. Automatic scaling
    3. Managed infrastructure
    4. Storage flexibility
    5. Data protection
    *(Fake NOT swap: "Static website hosting")*

16. **3 Amazon S3 Glacier Storage Classes:**
    1. S3 Glacier Instant Retrieval
    2. S3 Glacier Flexible Retrieval
    3. S3 Glacier Deep Archive
    *(Fake NOT swap: "S3 Glacier Standard-IA")*

17. **3 Retrieval Options for S3 Glacier Flexible Retrieval:**
    1. Expedited retrieval (1–5 minutes)
    2. Standard retrieval (3–5 hours)
    3. Bulk retrieval (5–12 hours)
    *(Fake NOT swap: "Instant millisecond retrieval" — that's a separate class)*

18. **2 Retrieval Options for S3 Glacier Deep Archive:**
    1. Standard retrieval (within 12 hours)
    2. Bulk retrieval (within 48 hours)
    *(Fake NOT swap: "Expedited retrieval")*

19. **5 Amazon S3 Glacier Security and Durability Features:**
    1. Encryption (server-side)
    2. Access control (IAM & bucket policies)
    3. Durability (11 nines)
    4. Versioning
    5. S3 Object Lock
    *(Fake NOT swap: "Security groups")*

20. **5 Benefits of Amazon S3 Glacier:**
    1. Lower storage costs
    2. Flexible retrieval
    3. Long-term retention
    4. Automated archiving
    5. Data protection
    *(Fake NOT swap: "Low-latency boot volumes")*

---

## 5. Situational Practice Questions

1. **A company runs a transactional database on an Amazon EC2 instance and needs block-level storage that supports frequent read and write operations with low latency. Which storage option should they choose?**
   - A. Amazon EBS HDD volume
   - B. Amazon EBS SSD volume
   - C. Amazon EFS Archive
   - D. Amazon S3 Standard

2. **An engineer stops an EC2 instance for maintenance and later detaches its data drive to attach it to a replacement EC2 instance in the same Availability Zone. Which feature allows the data to remain available and be reused?**
   - A. EBS persistent storage
   - B. S3 Versioning
   - C. EFS Bursting Throughput
   - D. S3 Object Lock

3. **A team has an EBS snapshot in `us-east-1` and wants to create a new EBS volume from it in `eu-west-1`. What must they do first?**
   - A. Attach the snapshot directly to an EC2 instance in `eu-west-1`
   - B. Convert the snapshot into an EFS file system
   - C. Copy the snapshot to `eu-west-1`
   - D. Enable S3 Block Public Access on the snapshot

4. **A company takes daily EBS snapshots. After the initial full backup, each subsequent snapshot only stores the blocks that changed since the previous snapshot. What is this behavior called?**
   - A. Provisioned snapshotting
   - B. Incremental snapshotting
   - C. Lifecycle expiration
   - D. Intelligent-Tiering

5. **A web application runs across five Linux-based EC2 instances that all need simultaneous read and write access to the same shared directory of uploaded files over NFS. Which service fits best?**
   - A. Amazon EBS
   - B. Amazon S3 Glacier
   - C. Amazon EFS
   - D. Amazon EBS Snapshot

6. **A startup wants to host static website assets (images, HTML, documents) with 99.999999999% (11 nines) durability without provisioning storage capacity in advance. Which service should they use?**
   - A. Amazon S3
   - B. Amazon EBS
   - C. Amazon EFS
   - D. EFS One Zone

7. **Which of the following is NOT one of the four main components of Amazon S3 storage?**
   - A. Buckets
   - B. Objects
   - C. Object keys
   - D. Mount targets

8. **A media company stores files in S3 whose access patterns are unpredictable and change frequently over time. They want AWS to automatically move objects between access tiers to optimize costs. Which S3 storage class should they select?**
   - A. S3 Standard-IA
   - B. S3 Intelligent-Tiering
   - C. S3 One Zone-IA
   - D. S3 Glacier Flexible Retrieval

9. **A developer stores thumbnails in S3 that are rarely accessed, can be easily recreated from original images, and need to be stored at a lower cost in a single Availability Zone. Which S3 class is most appropriate?**
   - A. S3 Standard-IA
   - B. S3 One Zone-IA
   - C. S3 Glacier Deep Archive
   - D. S3 Standard

10. **A hospital archives medical records in S3 that are rarely accessed, yet doctors must be able to retrieve them in milliseconds without submitting a restore request. Which S3 Glacier storage class meets this requirement?**
    - A. S3 Glacier Flexible Retrieval
    - B. S3 Glacier Deep Archive
    - C. S3 Glacier Instant Retrieval
    - D. S3 Standard

11. **An organization stores compliance archives in S3 Glacier Deep Archive and needs to retrieve a large dataset at the lowest cost, with a 48-hour wait time acceptable. Which retrieval option should they use?**
    - A. Expedited retrieval
    - B. Standard retrieval
    - C. Bulk retrieval
    - D. Instant retrieval

12. **Which named retrieval speed is NOT available for S3 Glacier Deep Archive?**
    - A. Standard retrieval (within 12 hours)
    - B. Bulk retrieval (within 48 hours)
    - C. Expedited retrieval (1–5 minutes)
    - D. Priority retrieval (within 1 hour)

13. **An administrator enables S3 Versioning on a bucket to protect against accidental overwrites. Later, they want to turn versioning off completely and return the bucket to an unversioned state. What is true?**
    - A. The bucket can be returned to an unversioned state at any time
    - B. Versioning can be suspended, but the bucket cannot return to an unversioned state
    - C. Versioning automatically expires after 30 days
    - D. Versioning is enabled per object, not at the bucket level

14. **A company wants to automatically move log files from S3 Standard to S3 Glacier Flexible Retrieval after 30 days, delete them after 365 days, and abort incomplete multipart uploads after 7 days. Which feature should they configure?**
    - A. S3 Object Lock
    - B. S3 Lifecycle Management
    - C. S3 Block Public Access
    - D. Server access logging

15. **A compliance rule requires that archived financial records in S3 cannot be deleted or overwritten by anyone for 7 years. Which feature enforces this?**
    - A. S3 Versioning
    - B. S3 Object Lock
    - C. S3 Lifecycle expiration
    - D. IAM least privilege

16. **A company deletes archived objects from S3 Glacier Flexible Retrieval two weeks after uploading them, before the minimum storage duration ends. What consequence may occur?**
    - A. Automatic conversion to EBS volumes
    - B. Early deletion charges
    - C. Suspension of S3 Versioning
    - D. Loss of 11 nines durability

17. **A security team wants a single safety setting on an S3 bucket to prevent unintended public exposure of objects, regardless of other policies. Which mechanism should they use?**
    - A. S3 Block Public Access
    - B. Access logging
    - C. S3 Intelligent-Tiering
    - D. EFS Security Groups

18. **An EFS administrator wants to restrict which EC2 instances can communicate over the network with the EFS mount targets. Which mechanism controls this network traffic?**
    - A. Bucket policies
    - B. Security groups
    - C. EFS Archive
    - D. S3 Object Lock

19. **Multiple applications share a single Amazon EFS file system, and each application needs its own entry point that enforces a specific root directory and POSIX user identity. What should the admin configure?**
    - A. EFS access points
    - B. EFS Bursting Throughput
    - C. Object keys
    - D. EBS root volumes

20. **A Linux workload on EFS experiences sudden, unpredictable spikes in file system activity and needs throughput that automatically adjusts to match workload activity. Which throughput option should be chosen?**
    - A. Provisioned Throughput
    - B. Bursting Throughput
    - C. Elastic Throughput
    - D. General Purpose Performance Mode

21. **Which of the following describes an EFS Regional file system rather than an EFS One Zone file system?**
    - A. Stores data within a single Availability Zone for workloads not needing multi-AZ resilience
    - B. Stores data redundantly across multiple Availability Zones within an AWS Region
    - C. Attaches to only one EC2 instance at a time as a boot drive
    - D. Stores objects inside globally named buckets

22. *(Definition Reversal)* **Which term refers to granting only the permissions required to perform authorized tasks?**
    - A. Incremental backup
    - B. Principle of least privilege
    - C. Provisioned Throughput
    - D. Persistent storage

---

## 6. Last-Minute Cram Sheet

- **EBS = Block storage** for compatible EC2 instances in the same **Availability Zone**, subject to volume type and attachment limits; **SSD** = frequent low-latency I/O (boot/DBs), **HDD** = sequential throughput (logs/big data).
- **EBS Snapshots** are **incremental by default**, stored in **AWS-managed S3**, and must be **copied to another Region** to create volumes there.
- **S3 = Object storage** in **buckets** (globally unique names in a partition, created in a Region); objects have **keys** and **metadata**, with **11 nines (99.999999999%) durability**.
- **S3 new object uploads** are automatically encrypted via **server-side encryption** by default.
- **S3 Versioning** is enabled at the **bucket level**; once enabled it can be **suspended**, but the bucket **cannot return to an unversioned state**.
- **S3 One Zone-IA** stores infrequent data in **one AZ** (only for recreatable or backed-up data); **S3 Intelligent-Tiering** auto-moves objects as access patterns change.
- **S3 Glacier Instant Retrieval** returns archival objects in **milliseconds** with **no restore request**; **Flexible** (min–hrs) and **Deep Archive** (hrs) require a **restore request**.
- **Glacier Flexible Retrieval** options: **Expedited (1–5 min)**, **Standard (3–5 hr)**, **Bulk (5–12 hr)**; **Deep Archive** has only **Standard (12 hr)** and **Bulk (48 hr)**.
- Deleting or transitioning Glacier objects before their **minimum storage duration** ends can trigger **early deletion charges**.
- **S3 Object Lock** prevents object versions from being deleted or overwritten for a specified retention period (stricter than Versioning alone).
- **EFS = Shared file storage** (files & directories) over **NFS** for **Linux** workloads; mounts on **multiple EC2 instances simultaneously** and scales automatically.
- **EFS Storage Classes**: **EFS Standard**, **EFS IA**, **EFS Archive**; **EFS File System Types**: **Regional** (multi-AZ) vs. **One Zone** (single-AZ).
- **EFS Throughput Options**: **Elastic** (auto-adjusts), **Provisioned** (user-specified), **Bursting** (based on stored data + burst credits); **General Purpose** is a performance mode for low latency.
- **EFS Security**: **IAM policies**, **Security groups** (network traffic to mount targets), **Encryption at rest & in transit**, and **EFS access points** (root directory + POSIX identity).

---

## Answer Key

1. **B. Amazon EBS SSD volume** — SSD volumes are designed for frequent read/write operations with low latency (e.g., transactional databases). *HDD (A)* is for large sequential throughput workloads, not transactional DBs.
2. **A. EBS persistent storage** — Persistent storage keeps data available independently of the EC2 running state and allows detaching/reattaching within the same AZ. *S3 Versioning (B)* applies to S3 objects, not EBS volumes.
3. **C. Copy the snapshot to `eu-west-1`** — Snapshots can create volumes across AZs in the same Region, but must be copied to another Region first. *Attaching directly (A)* is not supported across Regions.
4. **B. Incremental snapshotting** — After the initial snapshot, EBS snapshots store only blocks changed since the previous snapshot. *Intelligent-Tiering (D)* is an S3 storage class, not a snapshot mechanism.
5. **C. Amazon EFS** — EFS supports NFS for Linux workloads and can be mounted on multiple EC2 instances simultaneously. *Amazon EBS (A)* attaches as a block volume to individual EC2 instances, not shared over NFS.
6. **A. Amazon S3** — S3 supports static website hosting, 11 nines durability, and automatic scalability without advance capacity provisioning. *Amazon EFS (C)* is for shared Linux file systems, not static website buckets.
7. **D. Mount targets** — Mount targets belong to Amazon EFS; S3's four components are buckets, objects, object keys, and metadata. *Object keys (C)* are S3 object identifiers.
8. **B. S3 Intelligent-Tiering** — Automatically moves eligible objects between access tiers based on changing access patterns. *S3 Standard-IA (A)* requires manually/lifecycle-managed placement for known infrequent data.
9. **B. S3 One Zone-IA** — Stores infrequently accessed data in a single AZ and suits data that can be recreated or has another copy. *S3 Standard-IA (A)* uses multiple AZs at higher cost when single-AZ isn't specified.
10. **C. S3 Glacier Instant Retrieval** — Designed for rarely accessed archival data needing millisecond retrieval without a restore operation. *Flexible Retrieval (A)* requires a restore request taking minutes to hours.
11. **C. Bulk retrieval** — Deep Archive Bulk retrieval typically completes within 48 hours for large datasets. *Expedited retrieval (A)* does not exist in Deep Archive.
12. **C. Expedited retrieval (1–5 minutes)** — Expedited retrieval is only available in S3 Glacier Flexible Retrieval, not Deep Archive. *Standard (A)* and *Bulk (B)* are both Deep Archive options.
13. **B. Versioning can be suspended, but the bucket cannot return to an unversioned state** — Handout explicitly states S3 Versioning is bucket-level and cannot revert to unversioned once enabled. *Option A* is the common misconception.
14. **B. S3 Lifecycle Management** — Lifecycle rules transition objects, expire objects, manage previous versions, and abort incomplete multipart uploads. *S3 Object Lock (A)* prevents deletion rather than scheduling it.
15. **B. S3 Object Lock** — Prevents object versions from being deleted or overwritten for a specified retention period. *S3 Versioning (A)* retains old versions on delete/overwrite but does not block deletion of versions.
16. **B. Early deletion charges** — Deleting or transitioning Glacier objects before the minimum storage duration ends may incur early deletion charges. *Loss of durability (D)* does not happen.
17. **A. S3 Block Public Access** — Specifically designed to prevent unintended public access to buckets and objects. *Access logging (B)* only records requests; it does not block access.
18. **B. Security groups** — In EFS, security groups control network traffic between mount targets and connected computing resources. *Bucket policies (A)* are for S3, not EFS.
19. **A. EFS access points** — Application-specific entry points that enforce a root directory and POSIX user identity for file access. *Object keys (C)* are S3 object identifiers.
20. **C. Elastic Throughput** — Automatically adjusts throughput based on workload activity. *Provisioned Throughput (A)* requires specifying a throughput level manually.
21. **B. Stores data redundantly across multiple Availability Zones within an AWS Region** — Regional EFS provides multi-AZ redundancy, whereas *One Zone (A)* stores data in a single AZ.
22. **B. Principle of least privilege** — Handout defines this as granting only the permissions required to perform authorized tasks. *Persistent storage (D)* refers to data outliving an EC2 instance's running state.
