# Exam Reviewer: Cloud Computing Threats and Countermeasures

Source: `05_Handout_1_Cloud_Computing_Threats_and_Countermeasures.pdf`

---

## 1. Key Terms

| Term | Short definition (handout wording, simplified) | Memory hook |
| :--- | :--- | :--- |
| **Cloud Computing** | On-demand delivery of IT capabilities (infrastructure and applications) provided to subscribers as metered services over networks. | "Metered IT on demand" |
| **Infrastructure-as-a-Service (IaaS)** | Provides on-demand fundamental IT resources (computing power, virtualization, storage, network), VMs, abstracted hardware, and OSs controlled via API. | "I = Infrastructure (VMs, storage, network)" |
| **Platform-as-a-Service (PaaS)** | Provides development tools, configuration management, and deployment platforms on-demand to develop custom applications (e.g., Google App Engine, Salesforce, Microsoft Azure). | "P = Platform to build apps" |
| **Software-as-a-Service (SaaS)** | Offers application software on demand over the Internet; charged via pay-per-use, subscription, advertising, or user sharing. | "S = Ready-to-use Software" |
| **Identity-as-a-Service (IDaaS)** | Third-party managed authentication and identity/access management services (SSO, MFA, IGA, access management, intelligence collection). | "ID = Identity & Login (SSO/MFA)" |
| **Security-as-a-Service (SECaaS)** | Integrates security services into corporate infrastructure cost-effectively; based on SaaS and needs no physical hardware/equipment. | "SEC = SaaS-based Security, no hardware" |
| **Container-as-a-Service (CaaS)** | Provides containers and clusters as a service (virtualization of container engines; container/app/cluster management via portal or API); inherits IaaS and PaaS features. | "C = Containers & Clusters (IaaS + PaaS)" |
| **Function-as-a-Service (FaaS)** | Serverless platform for developing, running, and managing app functionalities without building/maintaining infrastructure; mostly used for microservices. | "F = Functions / Serverless" |
| **Public Cloud** | Provider makes applications, servers, and storage available to the public over the Internet (free or pay-per-usage). | "Open to the Public" |
| **Private Cloud** | Also called internal or corporate cloud; operated by a single organization and implemented within a corporate firewall. | "Single org, behind firewall" |
| **Community Cloud** | Multi-tenant infrastructure shared among organizations from a specific community with common concerns (security, compliance, performance, jurisdiction). | "Shared by a specific group" |
| **Hybrid Cloud** | Two or more clouds (private, public, or community) that remain unique entities but are bound together for combined benefits. | "2+ clouds bound as distinct entities" |
| **Multi Cloud** | Dynamic heterogeneous environment combining workloads across multiple cloud vendors managed via one proprietary interface. | "Multiple vendors, 1 interface" |
| **Cloud Consumer** | Person or organization that maintains a business relationship with CSPs and uses cloud computing services. | "The customer/user" |
| **Cloud Provider** | Person or organization that acquires and manages computing infrastructure to provide services (directly or via a broker) over a network. | "Owns & runs the cloud" |
| **Cloud Carrier** | Intermediary providing connectivity and transport services between CSPs and cloud consumers via networks or telecom/access devices. | "Carries the connection" |
| **Cloud Auditor** | Party performing an independent examination of cloud service controls via objective evidence to verify adherence to standards. | "Independent inspector" |
| **Cloud Broker** | Intermediary from whom cloud consumers request cloud services when direct integration with CSPs is too complicated. | "Middleman for complex cloud services" |
| **Container Technology** | Container-based virtualization service helping teams develop, run, and manage containerized apps via provider API or web portal (on-prem or cloud). | "Container virtualization via API/portal" |
| **Container** | Package of an application/software with all dependencies (libraries, config files, binaries) running independently to solve cross-cloud compatibility issues. | "App + all dependencies in one box" |
| **Tier-1: Developer Machines** | Container architecture tier responsible for image creation, testing, and accreditation. | "Tier 1 = Build & test image" |
| **Tier-2: Testing and Accreditation Systems** | Container architecture tier that verifies/validates image contents, signs images, and sends them to registries. | "Tier 2 = Verify, sign, send" |
| **Tier-3: Registries** | Container architecture tier that stores images and disseminates them to orchestrators upon request. | "Tier 3 = Image warehouse" |
| **Tier-4: Orchestrators** | Container architecture tier that transforms images into containers and deploys containers to hosts. | "Tier 4 = Deploy to hosts" |
| **Tier-5: Hosts** | Container architecture tier that operates and manages containers as instructed by the orchestrator. | "Tier 5 = Run the containers" |
| **Virtual Machines (VMs)** | Technology allowing multiple OSs on a single physical system sharing underlying hardware (servers, storage, networks) to cut IT costs. | "Multiple OSs on 1 physical machine" |
| **Docker** | Open-source technology for developing, packaging, and running applications with dependencies in containers so they run in any environment. | "Package once, run anywhere" |
| **Microservices** | Cloud-hosted sub-applications broken down from monolithic apps that work together, each performing a unique task. | "Monolith split into small task apps" |
| **Kubernetes (K8s)** | Open-source, portable, extensible orchestration platform by Google for managing containerized apps and microservices with near-zero downtime. | "Google's container orchestrator (K8s)" |
| **Side-Channel Attack (Cross-Guest VM Breach)** | Placing a malicious VM on the same physical host as a target VM to exploit shared processor cache and steal keys/secrets (timing, data remanence, acoustic, power, differential fault). | "Neighbor VM spying via CPU cache" |
| **Wrapping Attack** | Duplicating a signed/canonicalized SOAP XML message body in the TLS layer and resending it as legitimate so the server validates the duplicated signature. | "SOAP/XML duplicate signature trick" |
| **Man-in-the-Cloud (MITC) Attack** | Advanced MITM abusing cloud file sync services (Google Drive, DropBox) by exploiting sync authentication tokens. | "MITM using cloud sync tokens" |
| **Cloud Hopper Attack** | Attack targeting Managed Service Providers (MSPs) and their customers using spear-phishing emails with custom malware to steal IP and critical info. | "Hopping from MSP to customers" |
| **Cloud Cryptojacking** | Unauthorized use of a victim's computer to stealthily mine cryptocurrency via hidden/obfuscated browser JavaScript (e.g., CoinHive, Cryptoloot). | "Stealth browser crypto mining" |
| **Cloudborne Attack** | Bare-metal server firmware vulnerability allowing persistent backdoors that survive server reassignment to new IaaS clients if re-flashing fails. | "Persistent bare-metal firmware backdoor" |
| **Qualys Cloud Platform** | End-to-end IT security tool offering continuous security/compliance assessment, active checks (ICMP timestamp requests), and AssetView visualization. | "Continuous assessment + AssetView" |
| **Cloud Access Security Broker (CASB)** | Security tool deployed to monitor traffic anomalies as a countermeasure against MITC attacks. | "Monitors cloud traffic anomalies" |

---

## 2. Look-Alike / Confusing Terms

### Group 1: Cloud Service Models (IaaS vs PaaS vs SaaS vs CaaS vs FaaS vs IDaaS vs SECaaS)

| Term | What it is | Key difference | Clue words in a question |
| :--- | :--- | :--- | :--- |
| **IaaS** | On-demand fundamental IT resources (compute, storage, network, VMs, OSs) | Subscriber gets raw infrastructure/VMs via API | "virtual machines", "abstracted hardware", "data storage", "OSs via API" |
| **PaaS** | On-demand development tools, config management, deployment platforms | For building/deploying custom apps (no raw VM management) | "develop custom applications", "development tools", "Google App Engine" |
| **SaaS** | Application software delivered on-demand over the Internet | Ready-to-use end-user software; pay-per-use/subscription | "application software", "pay-per-use", "subscription", "advertising" |
| **CaaS** | Containers and clusters delivered as a service | Virtualizes container engines; inherits both IaaS & PaaS | "containers and clusters", "orchestrators", "inherits IaaS and PaaS" |
| **FaaS** | Serverless platform for app functionalities without maintaining infrastructure | Event/function-level execution for microservices | "serverless architecture", "microservices", "without maintaining infrastructure" |
| **IDaaS** | Third-party authentication and identity/access management | Handles login, identity, and access | "SSO", "MFA", "IGA", "authentication services" |
| **SECaaS** | Cloud-based security services integrated into corporate infrastructure | Built on SaaS; no physical security hardware needed | "security services", "based on SaaS", "no physical hardware" |

> **Trap Warning:** Don't confuse **CaaS** (manages containers/clusters and inherits IaaS+PaaS) with **FaaS** (serverless architecture for microservices), or **IDaaS** (authentication/SSO/MFA) with **SECaaS** (general SaaS-based security without hardware).

---

### Group 2: Cloud Deployment Models (Hybrid Cloud vs Multi Cloud vs Community Cloud vs Private Cloud)

| Term | What it is | Key difference | Clue words in a question |
| :--- | :--- | :--- | :--- |
| **Private Cloud** | Infrastructure operated by a single organization inside a corporate firewall | Exclusively one organization | "single organization", "internal/corporate cloud", "corporate firewall" |
| **Community Cloud** | Multi-tenant infrastructure shared by organizations with common concerns | Shared by a specific group (e.g., same compliance/jurisdiction) | "specific community", "common computing concerns", "regulatory compliance" |
| **Hybrid Cloud** | 2+ clouds (private, public, or community) bound together as unique entities | Combines different *deployment* types | "two or more clouds", "remain unique entities", "bound together" |
| **Multi Cloud** | Workloads across multiple cloud *vendors* managed via one proprietary interface | Combines multiple *vendors* (providers) | "multiple cloud vendors", "heterogeneous", "one proprietary interface" |

> **Trap Warning:** **Hybrid Cloud** mixes deployment models (e.g., private + public), whereas **Multi Cloud** mixes different *cloud vendors* under one proprietary interface.

---

### Group 3: NIST Cloud Actors (Cloud Carrier vs Cloud Broker vs Cloud Auditor vs Cloud Provider)

| Term | What it is | Key difference | Clue words in a question |
| :--- | :--- | :--- | :--- |
| **Cloud Provider** | Acquires and manages computing infrastructure to deliver cloud services | Actually owns/supplies the cloud services | "acquires and manages computing infrastructure" |
| **Cloud Carrier** | Intermediary providing network connectivity and transport | Moves data/traffic between CSP and consumer | "connectivity and transport", "network, telecommunication" |
| **Cloud Broker** | Intermediary helping consumers request/integrate complex cloud services | Simplifies service integration/procurement | "integration too complicated", "request rather than directly contacting CSP" |
| **Cloud Auditor** | Independent examiner of cloud service controls | Evaluates compliance/standards with objective evidence | "independent examination", "objective evidence", "adherence to standards" |

> **Trap Warning:** Both **Cloud Carrier** and **Cloud Broker** are intermediaries—**Carrier** provides *network transport*, while **Broker** handles *service integration/procurement*.

---

### Group 4: Cloud Attacks (Side-Channel vs Cloudborne vs MITC vs Wrapping vs Cloud Hopper vs Cryptojacking)

| Term | What it is | Key difference | Clue words in a question |
| :--- | :--- | :--- | :--- |
| **Side-Channel Attack** | Malicious VM on same physical host exploiting shared processor cache | Happens at *VM / CPU cache* level on shared host | "same physical host", "processor cache", "timing attack", "Cross-Guest VM" |
| **Cloudborne Attack** | Persistent backdoor implanted in bare-metal server firmware | Survives server reassignment in *firmware* | "bare-metal", "firmware", "reclamation", "reassigned to new clients" |
| **Wrapping Attack** | Duplicates signed SOAP XML message body in TLS layer | Abuses *XML/SOAP signature* validation | "SOAP message", "TLS layer", "XML document", "canonicalize", "duplicated signature" |
| **MITC Attack** | Abuses cloud file sync services (Google Drive, DropBox) via sync tokens | Abuses *synchronization tokens* | "file synchronization", "synchronization tokens", "Google Drive/DropBox" |
| **Cloud Hopper Attack** | Spear-phishing with custom malware targeting MSPs and their customers | Targets *Managed Service Providers (MSPs)* | "managed service providers (MSPs)", "spear-phishing", "custom malware" |
| **Cloud Cryptojacking** | Stealthily mines digital currency using victim's browser JavaScript | Steals CPU/browser power to *mine crypto* | "mine digital currency", "JavaScript", "CoinHive", "Cryptoloot", "obfuscation" |

> **Trap Warning:** **Side-Channel** and **Cloudborne** both involve multi-tenancy on physical hardware—**Side-Channel** spies via *shared processor cache* between co-resident VMs, while **Cloudborne** implants a *firmware backdoor* on a bare-metal server that persists after reclamation.

---

### Group 5: Container Security Challenges (Container Breakout vs Bypassing Isolation vs Noisy Neighbor vs DevOps Speed vs Lack of Visibility)

| Term | What it is | Key difference | Clue words in a question |
| :--- | :--- | :--- | :--- |
| **Container Breakout to the Host** | Container running as root breaks containment to access the host OS | Specifically *root* container escaping to *host OS* | "run as root", "break containment", "host OS" |
| **Bypassing Isolation** | Attacker compromises a container and escalates privileges to access other containers or host | Post-compromise lateral/vertical *privilege escalation* | "after compromising", "access other containers or the host" |
| **Noisy Neighboring Containers** | One container exhausts all system resources, causing DoS to neighbors | Resource exhaustion / *DoS* (not privilege escalation) | "exhaust all available system resources", "denial-of-service (DoS)" |
| **DevOps Speed** | Containers start, run, and are removed quickly, letting attackers hide without leaving malware | *Ephemeral/short-lived* execution hides attacks | "stopped and removed", "fugitiveness", "without installing malicious code" |
| **Lack of Visibility** | Container engine + Linux kernel abstraction camouflages container/user actions | *Monitoring/tracking* blind spot | "layer of abstraction", "camouflaging", "difficult to track" |

> **Trap Warning:** **Container Breakout** specifically starts with a container *running as root*, whereas **Bypassing Isolation** is general post-compromise privilege escalation to other containers or the host.

---

### Group 6: Containers vs VMs vs Docker vs Kubernetes vs Microservices

| Term | What it is | Key difference | Clue words in a question |
| :--- | :--- | :--- | :--- |
| **Virtual Machines (VMs)** | Run multiple full OSs on one physical system sharing hardware | Each VM needs its own OS (heavier) | "multiple OS on a single physical system", "share underlying resources" |
| **Container** | App + dependencies packaged to run independently without its own OS | Lightweight (MBs of memory), no separate OS | "package of app + dependencies", "few megabytes", "no independent OS" |
| **Docker** | Open-source tool to develop, package, and run apps in containers | The *packaging/runtime tool* | "open-source technology", "developing, packaging, running", "Docker container" |
| **Kubernetes (K8s)** | Google's open-source orchestration platform for containers and microservices | The *orchestrator* (manages scale, zero downtime) | "orchestration platform", "developed by Google", "K8s", "downtime to zero" |
| **Microservices** | Monolithic app broken into cooperating cloud-hosted sub-applications | The *application architecture* (small task-based services) | "monolithic applications broken down", "sub-applications", "unique task" |

> **Trap Warning:** **Docker** packages and runs containers, whereas **Kubernetes** *orchestrates* containers and microservices at scale.

---

## 3. Likely Distractors

- **IaaS** — *Distractors:* PaaS, SaaS, CaaS. *Tell apart:* IaaS gives VMs/compute/storage/network; PaaS gives app dev tools; SaaS gives finished apps; CaaS gives containers/clusters.
- **PaaS** — *Distractors:* IaaS, SaaS, FaaS. *Tell apart:* PaaS provides dev/deployment platforms; FaaS is specifically serverless functions for microservices; IaaS is raw infra; SaaS is end-user software.
- **IDaaS** — *Distractors:* SECaaS, SaaS, PaaS. *Tell apart:* IDaaS is strictly authentication/IAM (SSO, MFA, IGA); SECaaS is broader SaaS-based security without physical hardware.
- **Hybrid Cloud** — *Distractors:* Multi Cloud, Community Cloud, Private Cloud. *Tell apart:* Hybrid binds 2+ different deployment models (e.g., private + public); Multi Cloud spans multiple *vendors* under one proprietary interface.
- **Multi Cloud** — *Distractors:* Hybrid Cloud, Public Cloud, Community Cloud. *Tell apart:* Multi Cloud specifically uses multiple cloud *vendors* via one proprietary interface.
- **Cloud Carrier** — *Distractors:* Cloud Broker, Cloud Provider, Cloud Auditor. *Tell apart:* Carrier provides network/telecom transport; Broker helps consumers integrate/request complex services.
- **Cloud Auditor** — *Distractors:* Cloud Broker, Cloud Provider, Cloud Consumer. *Tell apart:* Auditor independently examines controls using objective evidence; Broker procures/integrates services.
- **Tier-2: Testing and Accreditation Systems** — *Distractors:* Tier-1 (Developer Machines), Tier-3 (Registries), Tier-4 (Orchestrators). *Tell apart:* Tier-2 verifies, validates, and *signs* images before sending to Tier-3 Registries.
- **Tier-4: Orchestrators** — *Distractors:* Tier-3 (Registries), Tier-5 (Hosts), Tier-2 (Testing Systems). *Tell apart:* Tier-4 *transforms images into containers* and deploys them; Tier-5 *runs/operates* them.
- **Side-Channel Attack** — *Distractors:* Cloudborne Attack, Container Breakout, Wrapping Attack. *Tell apart:* Side-Channel uses a co-resident malicious VM on the same physical host to exploit shared processor cache.
- **Wrapping Attack** — *Distractors:* MITC Attack, Side-Channel Attack, Cloud Hopper Attack. *Tell apart:* Wrapping duplicates a signed SOAP/XML message body in the TLS layer.
- **Man-in-the-Cloud (MITC) Attack** — *Distractors:* Wrapping Attack, Cloud Hopper Attack, Cloud Cryptojacking. *Tell apart:* MITC abuses cloud file sync services (Google Drive/DropBox) and synchronization tokens.
- **Cloud Hopper Attack** — *Distractors:* MITC Attack, Cloudborne Attack, Side-Channel Attack. *Tell apart:* Cloud Hopper uses spear-phishing with custom malware against MSPs and their customers.
- **Cloud Cryptojacking** — *Distractors:* Cloudborne Attack, Noisy Neighboring Containers, MITC Attack. *Tell apart:* Cryptojacking runs stealth JavaScript crypto-miners (CoinHive, Cryptoloot) in victims' browsers.
- **Cloudborne Attack** — *Distractors:* Side-Channel Attack, Container Breakout, Cloud Hopper Attack. *Tell apart:* Cloudborne implants persistent backdoors in bare-metal server *firmware* that survive IaaS client reassignment.
- **Qualys Cloud Platform** — *Distractors:* CASB, Docker, Kubernetes. *Tell apart:* Qualys does continuous security/compliance assessment (ICMP timestamp requests, AssetView); CASB monitors cloud traffic anomalies for MITC.

---

## 4. Lists, Sequences & "Which is NOT"

1. **8 Characteristics of Cloud Computing**
   - On-demand self-service, Distributed storage, Rapid elasticity, Automated management, Broad network access, Resource pooling, Measured service, Virtualization technology.
   - *Fake "NOT" trap:* "Manual hardware provisioning" or "Single-tenant lock-in" (limitations, not characteristics).

2. **7 Limitations of Cloud Computing**
   - Limited control and flexibility of organizations; Proneness to outages and other technical issues; Security, privacy, and compliance issues; Contracts and lock-ins; Dependence on network connections; Potential vulnerability to attacks as every component is online; Difficulty in migrating from one service provider to another.
   - *Fake "NOT" trap:* "Rapid elasticity" or "Measured service" (characteristics, not limitations).

3. **7 Types of Cloud Computing Services**
   - IaaS, PaaS, SaaS, IDaaS, SECaaS, CaaS, FaaS.
   - *Fake "NOT" trap:* "Hardware-as-a-Service (HaaS)" or "Database-as-a-Service (DBaaS)" (not in the handout).

4. **5 Standard Cloud Deployment Models**
   - Public Cloud, Private Cloud, Community Cloud, Hybrid Cloud, Multi Cloud.
   - *Fake "NOT" trap:* "Distributed Cloud" or "Personal Cloud" (not in the handout).

5. **5 Significant Actors in NIST Cloud Deployment Reference Architecture**
   - Cloud Consumer, Cloud Provider, Cloud Carrier, Cloud Auditor, Cloud Broker.
   - *Fake "NOT" trap:* "Cloud Attacker" or "Cloud Regulator" (not NIST actors in the handout).

6. **5 Features (Benefits) of Containers**
   - Portability and Consistency, Security, High Efficiency and Cost Effectiveness, Scalability (smart scaling), Robustness.
   - *Fake "NOT" trap:* "Independent guest operating systems" (containers explicitly do *not* need independent OSs).

7. **5-Tier Container Technology Architecture (in exact order)** *(Note: Handout also states it undergoes a three-phase lifecycle, without naming the 3 phases.)*
   - Tier-1: Developer Machines (create, test, accredit image) → Tier-2: Testing and Accreditation Systems (verify, validate, sign, send) → Tier-3: Registries (store, disseminate) → Tier-4: Orchestrators (transform images to containers, deploy) → Tier-5: Hosts (operate and manage containers).
   - *Fake "NOT" trap:* Swapping Tier-2 and Tier-3, or adding "Tier-6: Virtual Machines".

8. **10 Container Security Challenges**
   - Inflow of Vulnerable Source Code, Large Attack Surface, Lack of Visibility, Compromising Secrets, DevOps Speed, Noisy Neighboring Containers, Container Breakout to the Host, Network-based Attacks, Bypassing Isolation, Ecosystem Complexity.
   - *Fake "NOT" trap:* "Independent guest OS patching" or "Firmware reclamation failure" (Cloudborne, not container challenge).

9. **6 Cloud Computing Attacks**
   - Side-Channel Attacks (Cross-Guest VM Breaches), Wrapping Attack, Man-in-the-Cloud (MITC) Attack, Cloud Hopper Attack, Cloud Cryptojacking, Cloudborne Attack.
   - *Fake "NOT" trap:* "SQL Injection" or "DDoS Amplification" (not listed in the handout's 6 cloud attacks).

10. **5 Side-Channel Attack Sub-types**
    - Timing attack, Data remanence, Acoustic cryptanalysis, Power monitoring attack, Differential fault analysis.
    - *Fake "NOT" trap:* "Spear-phishing" (Cloud Hopper) or "XML canonicalization" (Wrapping).

11. **5 Side-Channel Attack Countermeasures**
    - Virtual firewall in cloud server back-end; Random encryption/decryption (RSA, 3DES, AES); Lock down OS images and app instances; Monitor repeated access to local memory/shared hardware cache; Code OS/apps to access shared resources predictably.

12. **2 Wrapping Attack Countermeasures**
    - XML schema validation (detect SOAP manipulation); Authenticated encryption in XML encryption specification.

13. **7 MITC Attack Countermeasures**
    - Email security gateways (detect social engineering); Strict token expiration policies; Antivirus tools; Cloud Access Security Broker (CASB); Monitor employee activity for token abuse; Encrypt cloud data and store keys separately; Two-factor authentication (2FA).

14. **3 Cloud Hopper Attack Countermeasures**
    - Multi-factor authentication (MFA); Strong coordination between customers and CSPs for incident response; Ensure users comply with cloud policies and security guidelines.

15. **10 Cloud Cryptojacking Countermeasures**
    - Strong password policies; 3 copies of critical data (2 on-site, 1 off-site); Patch web servers/devices regularly; Encrypted SSH key pairs instead of passwords; CoinBlocker URL & IP blacklist/blackholing in firewalls; Monitor web pages' DOM and JavaScript; Up-to-date antivirus, anti-malware, and ad-blocking tools; Browser extensions to detect/stop miner scripts; Endpoint security management for rogue apps; Audit all third-party website components regularly.

16. **2 Cloudborne Attack Countermeasures**
    - CSPs keep all firmware versions up to date; Sanitize server firmware before reassigning systems to new customers.

---

## 5. Situational Practice Questions

1. A software startup wants on-demand development tools, configuration management, and a deployment platform to build custom apps without managing raw virtual machines. Which cloud service model fits best?
   - A) IaaS
   - B) PaaS
   - C) SaaS
   - D) CaaS

2. A company needs Single-Sign-On (SSO), Multi-Factor Authentication (MFA), and Identity Governance and Administration (IGA) managed by a third-party vendor. Which service model is this?
   - A) SECaaS
   - B) PaaS
   - C) IDaaS
   - D) SaaS

3. A development team wants to run small, independent application functionalities for microservices using a serverless architecture without maintaining underlying infrastructure. Which model should they choose?
   - A) CaaS
   - B) IaaS
   - C) PaaS
   - D) FaaS

4. Several banks in the same regulatory jurisdiction share a multi-tenant cloud infrastructure because they have identical security and compliance requirements. Which deployment model is this?
   - A) Public Cloud
   - B) Hybrid Cloud
   - C) Community Cloud
   - D) Multi Cloud

5. An enterprise runs workloads across AWS, Azure, and Google Cloud simultaneously and manages all of them through one proprietary interface. Which deployment model is this?
   - A) Hybrid Cloud
   - B) Multi Cloud
   - C) Community Cloud
   - D) Private Cloud

6. A hospital keeps sensitive patient records in an on-premises corporate cloud behind its firewall, while binding it to a public cloud for overflow web traffic so both remain distinct entities. Which deployment model is this?
   - A) Multi Cloud
   - B) Community Cloud
   - C) Private Cloud
   - D) Hybrid Cloud

7. A company finds integrating multiple cloud services too complex to manage directly, so it requests cloud services through an intermediary rather than contacting CSPs directly. Which NIST actor is this intermediary?
   - A) Cloud Carrier
   - B) Cloud Auditor
   - C) Cloud Broker
   - D) Cloud Provider

8. An external firm reviews objective evidence to independently verify that a CSP's controls adhere to security standards. Which NIST actor is the firm?
   - A) Cloud Broker
   - B) Cloud Auditor
   - C) Cloud Carrier
   - D) Cloud Consumer

9. In the 5-tier container technology architecture, which tier verifies and validates image contents, signs the images, and sends them to registries?
   - A) Tier-1: Developer Machines
   - B) Tier-2: Testing and Accreditation Systems
   - C) Tier-3: Registries
   - D) Tier-4: Orchestrators

10. Which tier in the container technology architecture transforms stored images into containers and deploys them to hosts?
    - A) Tier-2: Testing and Accreditation Systems
    - B) Tier-3: Registries
    - C) Tier-4: Orchestrators
    - D) Tier-5: Hosts

11. One container on a host server consumes all available CPU and memory, causing neighboring containers on the same host to stop responding. Which container security challenge is this?
    - A) Container Breakout to the Host
    - B) Bypassing Isolation
    - C) Noisy Neighboring Containers
    - D) DevOps Speed

12. A container configured to run as `root` escapes its containment and gains unauthorized access to the underlying host OS via privilege escalation. Which challenge occurred?
    - A) Container Breakout to the Host
    - B) Noisy Neighboring Containers
    - C) Lack of Visibility
    - D) Ecosystem Complexity

13. Attackers launch a short-lived container, execute their attack, and immediately stop and remove the container so they leave no malicious code behind. Which container security challenge enables this?
    - A) Inflow of Vulnerable Source Code
    - B) Lack of Visibility
    - C) DevOps Speed
    - D) Compromising Secrets

14. An attacker places a malicious VM on the same physical host as a victim's cloud server and uses timing attacks on the shared processor cache to extract cryptographic keys. Which attack is this?
    - A) Cloudborne Attack
    - B) Side-Channel Attack (Cross-Guest VM Breach)
    - C) Wrapping Attack
    - D) Container Breakout to the Host

15. During SOAP message translation in the TLS layer, an attacker duplicates the signed and canonicalized XML message body and sends it to the server, which validates the duplicated signature. Which attack is this?
    - A) Man-in-the-Cloud (MITC) Attack
    - B) Side-Channel Attack
    - C) Wrapping Attack
    - D) Cloud Hopper Attack

16. An attacker abuses Google Drive's synchronization tokens to silently access and manipulate synced files because the cloud cannot distinguish malicious token traffic from normal traffic. Which attack is this?
    - A) Man-in-the-Cloud (MITC) Attack
    - B) Wrapping Attack
    - C) Cloud Hopper Attack
    - D) Cloud Cryptojacking

17. Threat actors send spear-phishing emails with custom malware to a Managed Service Provider (MSP) to gain remote access to the intellectual property of the MSP and its global customers. Which attack is this?
    - A) Cloudborne Attack
    - B) Man-in-the-Cloud (MITC) Attack
    - C) Cloud Hopper Attack
    - D) Side-Channel Attack

18. Visitors to a compromised web page unknowingly run obfuscated JavaScript (e.g., CoinHive) in their browsers that mines cryptocurrency using their CPU. Which attack is this?
    - A) Cloud Cryptojacking
    - B) Cloud Hopper Attack
    - C) Wrapping Attack
    - D) Noisy Neighboring Containers

19. A bare-metal IaaS server is reclaimed and reassigned to a new customer, but an attacker's firmware backdoor survives because firmware re-flashing was improperly implemented. Which attack is this?
    - A) Side-Channel Attack
    - B) Cloudborne Attack
    - C) Cloud Hopper Attack
    - D) Bypassing Isolation

20. *(Which is NOT)* Which of the following is **NOT** one of the five standard cloud deployment models listed in the handout?
    - A) Community Cloud
    - B) Hybrid Cloud
    - C) Multi Cloud
    - D) Distributed Cloud

21. *(Which is NOT)* Which of the following is **NOT** a countermeasure for a Wrapping Attack?
    - A) Use XML schema validation to detect SOAP message manipulation
    - B) Apply authenticated encryption in the XML encryption specification
    - C) Deploy a Cloud Access Security Broker (CASB) to monitor traffic anomalies
    - D) Enforce strict token expiration policies

22. *(Definition Reversal)* A security team deploys an end-to-end IT security solution that performs active vulnerability checks (such as ICMP timestamp requests) and visualizes continuous compliance posture via AssetView. What tool are they using?
    - A) Cloud Access Security Broker (CASB)
    - B) Qualys Cloud Platform
    - C) Kubernetes (K8s)
    - D) CoinBlocker

---

## 6. Last-Minute Cram Sheet

- **7 Cloud Service Models:** IaaS (infra/VMs), PaaS (dev tools), SaaS (apps), IDaaS (SSO/MFA/IGA), SECaaS (SaaS-based security, no hardware), CaaS (containers/clusters; inherits IaaS + PaaS), FaaS (serverless for microservices).
- **5 Deployment Models:** Public, Private (single org, corporate firewall), Community (shared common concerns), Hybrid (2+ deployment types bound together), Multi Cloud (multiple *vendors* via 1 proprietary interface).
- **5 NIST Actors:** Consumer (uses), Provider (manages infra), Carrier (network transport), Auditor (independent evidence review), Broker (simplifies complex service integration).
- **Containers vs VMs:** VMs run full guest OSs; containers share the host OS, need only MBs of memory, and launch/destroy in seconds.
- **Docker vs Kubernetes:** Docker packages/runs apps + dependencies in containers; Kubernetes (K8s) by Google orchestrates containers/microservices for near-zero downtime.
- **5-Tier Container Architecture:** (1) Developer Machines → (2) Testing & Accreditation (verify/sign) → (3) Registries (store) → (4) Orchestrators (deploy) → (5) Hosts (operate).
- **Container Security Traps:** *Noisy Neighbor* = resource exhaustion DoS; *Breakout* = root container escapes to host OS; *Bypassing Isolation* = post-compromise privilege escalation; *DevOps Speed* = short-lived containers hide attacks.
- **Side-Channel Attack (Cross-Guest VM Breach):** Malicious VM on same physical host spies via shared processor cache (timing, data remanence, acoustic, power, differential fault). Counter with virtual firewall, random encryption (RSA/3DES/AES), predictable shared-resource access.
- **Wrapping Attack:** Duplicates signed/canonicalized SOAP XML body in TLS layer. Counter with XML schema validation + authenticated XML encryption.
- **MITC Attack:** Abuses cloud file sync tokens (Google Drive, DropBox). Counter with CASB, strict token expiration, separate key storage, 2FA.
- **Cloud Hopper Attack:** Spear-phishing + custom malware against MSPs and their customers. Counter with MFA, CSP-customer coordination, policy compliance.
- **Cloud Cryptojacking:** Stealth browser JavaScript crypto-miners (CoinHive, Cryptoloot). Counter with CoinBlocker blacklists, DOM/JS monitoring, miner-blocking extensions, 3-2-1 backups (2 on-site, 1 off-site).
- **Cloudborne Attack:** Persistent backdoor in bare-metal server firmware surviving IaaS reassignment. Counter by updating and sanitizing firmware before reassigning servers.
- **Qualys Cloud Platform:** Continuous global security/compliance posture tool using active checks (ICMP timestamp requests) and AssetView.

---

## Answer Key

1. **B) PaaS** — PaaS provides development tools, configuration management, and deployment platforms for custom apps. *Why A is wrong:* IaaS provides raw infrastructure like VMs and storage.
2. **C) IDaaS** — IDaaS specifically delivers third-party authentication services including SSO, MFA, and IGA. *Why A is wrong:* SECaaS covers general SaaS-based security integration rather than dedicated identity/authentication management.
3. **D) FaaS** — FaaS provides a serverless architecture for running app functionalities, mostly used for microservices. *Why A is wrong:* CaaS manages containers and clusters rather than serverless functions.
4. **C) Community Cloud** — Shared among organizations from a specific community with common regulatory, security, or jurisdiction concerns. *Why B is wrong:* Hybrid Cloud binds two or more different cloud deployment models together.
5. **B) Multi Cloud** — Combines workloads across multiple cloud vendors managed via one proprietary interface. *Why A is wrong:* Hybrid Cloud binds distinct deployment types (e.g., private + public), not specifically multiple vendors under one interface.
6. **D) Hybrid Cloud** — Binds two or more clouds (here, private + public) that remain unique entities. *Why C is wrong:* Private Cloud alone operates strictly within a single corporate firewall without binding to a public cloud.
7. **C) Cloud Broker** — Consumers use a Cloud Broker when integrating cloud services directly with CSPs is too complicated. *Why A is wrong:* Cloud Carrier provides network connectivity and transport, not service integration.
8. **B) Cloud Auditor** — Performs independent examinations of cloud controls using objective evidence to verify standards adherence. *Why A is wrong:* Cloud Broker helps consumers request/integrate services.
9. **B) Tier-2: Testing and Accreditation Systems** — Tier-2 verifies/validates image contents, signs them, and sends them to registries. *Why C is wrong:* Tier-3 (Registries) only stores and disseminates images.
10. **C) Tier-4: Orchestrators** — Orchestrators transform images into containers and deploy them to hosts. *Why D is wrong:* Tier-5 (Hosts) operates and manages containers as instructed by the orchestrator.
11. **C) Noisy Neighboring Containers** — Occurs when one container exhausts system resources, causing a DoS to neighboring containers. *Why A is wrong:* Container Breakout is escaping to the host OS as root, not resource exhaustion.
12. **A) Container Breakout to the Host** — Containers running as root break containment to access the host OS via privilege escalation. *Why B is wrong:* Noisy Neighbor causes resource-exhaustion DoS, not host OS access.
13. **C) DevOps Speed** — Fast execution, stopping, and removal ("fugitiveness") lets attackers hide without installing malicious code. *Why B is wrong:* Lack of Visibility refers to container engine/kernel abstraction camouflaging actions.
14. **B) Side-Channel Attack (Cross-Guest VM Breach)** — Places a malicious VM on the same physical host to exploit shared processor cache via timing or similar attacks. *Why A is wrong:* Cloudborne targets bare-metal server firmware, not co-resident VM processor cache.
15. **C) Wrapping Attack** — Duplicates a signed/canonicalized SOAP XML message in the TLS layer so the server validates the duplicated signature. *Why A is wrong:* MITC abuses cloud file sync tokens, not SOAP/XML signatures.
16. **A) Man-in-the-Cloud (MITC) Attack** — Abuses cloud file sync services (Google Drive, DropBox) by exploiting authentication sync tokens. *Why B is wrong:* Wrapping attacks target SOAP/XML messages in TLS, not file sync tokens.
17. **C) Cloud Hopper Attack** — Uses spear-phishing with custom malware against MSPs to reach the IP and data of the MSP and its customers. *Why B is wrong:* MITC exploits file sync tokens rather than MSP spear-phishing.
18. **A) Cloud Cryptojacking** — Uses hidden/obfuscated browser JavaScript (CoinHive, Cryptoloot) to stealthily mine cryptocurrency. *Why D is wrong:* Noisy Neighboring Containers is a container resource-exhaustion DoS, not browser crypto-mining.
19. **B) Cloudborne Attack** — Implants a persistent backdoor in bare-metal server firmware that survives reassignment if firmware re-flashing fails. *Why A is wrong:* Side-Channel attacks exploit shared CPU cache between co-resident VMs, not bare-metal firmware.
20. **D) Distributed Cloud** — The 5 standard deployment models in the handout are Public, Private, Community, Hybrid, and Multi Cloud. *Why A/B/C are wrong:* All three are explicitly listed among the five standard models.
21. **C) Deploy a Cloud Access Security Broker (CASB) to monitor traffic anomalies** — CASB is a countermeasure for MITC attacks, not Wrapping Attacks. *Why A and B are wrong:* Both XML schema validation and authenticated XML encryption are the two Wrapping Attack countermeasures.
22. **B) Qualys Cloud Platform** — Performs continuous security/compliance assessment with active checks (ICMP timestamp requests) and AssetView visualization. *Why A is wrong:* CASB monitors cloud traffic anomalies against MITC attacks.
