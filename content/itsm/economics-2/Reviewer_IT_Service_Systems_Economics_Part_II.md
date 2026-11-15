# Exam Reviewer: IT Service Systems Economics Part II

Source: `06_Handout_1_IT_Service_Systems_Economics_Part_II.pdf` (IT2312)

---

## 1. Key Terms

| Term | Short Definition (Handout Wording, Simplified) | Memory Hook |
|---|---|---|
| **IT Service Management (ITSM)** | Framework of IT operations and processes with distinct roles and sub-units (e.g., Demand Management, Request Fulfillment, Service Review) aimed at aligning IT with overall business interests. | Aligning IT with business, not just paperwork or system config |
| **Service Manager** | Executive-like "boss" who leads a service team, defines specific services, and oversees how they are delivered in line with business expectations; can come from outside IT if technically literate. | The "boss" / captain who defines services & aligns IT with business |
| **ITIL (Information Technology Infrastructure Library)** | An ITSM framework used to provide **guidance** to an organization (not to prepare for an ITIL inspection); Service Managers decide how to integrate it based on IT staff size and ambition. | Guidance, NOT an inspection |
| **Supported Service** | A service is considered supported when the IT department's resources are deployed to meet the customer's demands (e.g., Finisar providing enough server space for customer support). | Resources deployed = Supported (Finisar server space) |
| **Delivered Service** | A service is considered delivered when the IT department produces a product or report that fulfills the needs of a customer. | Product or report produced = Delivered |
| **Internal Customer Product** | A service deliverable built for people inside the organization (e.g., an essential financial report derived from several databases built into Oracle). | Inside the org (Oracle financial report) |
| **External Customer Product** | A service deliverable built for people outside the organization (e.g., a customizable web page design palette that anyone can use). | Anyone outside can use it (web design palette) |
| **Service Transition** | The ITSM process under which **Change Management** operates. | Transition = Change |
| **Change Management** | Process under Service Transition that implements new IT services while lessening disruption to existing services; involves risk assessment, communication, and a blackout plan. | New services with minimal disruption (+ blackout plan) |
| **Blackout Plan** | A fallback/contingency plan Service Managers ensure is ready in case a change in implementation begins to compromise existing services. | Emergency plan if a change breaks existing services |
| **Service Operation** | The ITSM process under which **Incident Management** operates. | Operation = Incident |
| **Incident Management** | Process under Service Operation that analyzes incidents and escalation steps, restores interrupted services ASAP, isolates the cause, and takes action to prevent recurrence. | Fix interruption ASAP + isolate cause + prevent repeat |
| **Service Team** | A "board director" group of tech experts, product experts, support personnel, and executive leadership that oversees advice and execution during a service change, tracks metrics, ensures post-implementation effectiveness, suggests improvements, and aids long-term planning. | The "board of directors" feeding data & metrics to the Service Manager |
| **Service Sponsor** | Part of executive leadership on the Service Team, usually directly acquainted with the business side; sets the budget for services, qualifies associated risks, and sets acceptable service levels. | Business-side executive who holds the wallet (budget, risks, service levels) |
| **External Roles** | Vital roles outside the employed people of an organization: IT Service Consumers, Prospects, and External Suppliers. | Outside the company payroll |
| **IT Service Consumers** | All persons or organizational units who currently use the IT services. | Current users |
| **Prospects** | Future IT Service Consumers who have a defined demand for IT services. | Future users with defined demand |
| **External Suppliers** | Outside parties providing infrastructure, operating supplies, IT service contributions, and outsourcing services under established contracts. | Contracted outside vendors/outsourcers |
| **Culture (in an organization)** | The practices, attitudes, behaviors, beliefs, and values shared between an organization's members. | Shared practices, attitudes, behaviors, beliefs, values |
| **Service Culture** | The positive consideration of the importance of understanding good service and the appreciation for giving good service to internal and external customers; also helps organizations think of how service can be improved. | Valuing + appreciating good service (and improving it) |
| **Advocates vs. Critics (Employees)** | Employees turned into supporters (**advocates**) when a service culture addresses fair wages and reasonable working conditions; otherwise they become **critics**. | Fair treatment = Advocates; unfair = Critics |
| **Influence on How an Organization Is Seen** | Service culture shapes brand perception through consistent customer treatment across every stage (website, ordering, after-sales support) — e.g., Shopee (81% CX score). | Brand reputation = consistent CX across touchpoints (Shopee) |
| **Influence on Operation's Effectiveness** | Service culture reflects core values (how business is done and teams interact) and must align with vision/strategy; misalignment causes problems (e.g., sales targets vs. customer care, or scam hubs). | Core values aligned with vision/strategy (or misalignment = scam hubs) |
| **Influence on How Employees Feel About Their Jobs** | Service culture recognizes excellent work, addresses fair wages/conditions, retains top staff, and attracts recruits — e.g., Lazada PH Great Place to Work (>90% recommend, staying 2+ years). | Employee pride, trust, retention (Lazada PH) |
| **Influence on How Operation Learns and Adapts** | Service culture compares what is happening inside/outside with what *should* be happening so the org adapts to sudden changes — e.g., IBM PH (2021 WFH, cloud, AI, upskilling). | Adapt to sudden change using clear service standards (IBM PH) |

---

## 2. Look-Alike / Confusing Terms

### Group A: Leadership & Governance Roles
| Term | What It Is | Key Difference | Clue Words in a Question |
|---|---|---|---|
| **Service Manager** | Executive-like leader of a service team | Defines services, manages delivery, handles Change/Incident Management, integrates ITIL | "leads a service team", "defines specific services", "blackout plan", "ITIL guidance", "rotate position" |
| **Service Team** | Board-director-like advisory & execution group | Keeps Service Manager informed via metrics; suggests improvements; long-term planning | "board director", "tracking metrics", "tech experts, product experts, support personnel", "post-implementation" |
| **Service Sponsor** | Executive leadership member on the Service Team | Business-side role that sets budget, qualifies risks, and sets acceptable service levels | "business side", "setting the budget", "qualifying associated risks", "acceptable service levels" |

> **Trap Warning:** Don't confuse **Service Manager** with **Service Sponsor**—the Manager *leads the team and runs operations/changes*, while the Sponsor *sits on the business side to set the budget, risks, and service levels*.

### Group B: External Roles
| Term | What It Is | Key Difference | Clue Words in a Question |
|---|---|---|---|
| **IT Service Consumers** | Persons or units using IT services | Already using the service **now** | "currently use", "organizational units who use the IT services" |
| **Prospects** | Future IT Service Consumers | Not using yet, but have a **defined demand** for future use | "future", "defined demand for IT services" |
| **External Suppliers** | Contracted outside providers | Supply **infrastructure, operating supplies, contributions, or outsourcing** | "established contracts", "infrastructure and operating supplies", "outsourcing" |

> **Trap Warning:** **Prospects** are NOT just random people—they specifically have a *defined demand* for future IT services, whereas **IT Service Consumers** are *already* using them.

### Group C: Service Capability Questions (Supported vs. Delivered)
| Term | What It Is | Key Difference | Clue Words in a Question |
|---|---|---|---|
| **How is the service supported?** | IT resources deployed to meet customer demands | Focuses on **resources/infrastructure** enabling work (Finisar server space) | "resources are deployed", "server space", "customer support team could do its work" |
| **How is the service delivered?** | IT produces a product or report fulfilling customer needs | Focuses on the **output/deliverable** (Oracle financial report; web design palette) | "produces a product or report", "fulfills the needs", "internal/external customers" |

> **Trap Warning:** **Supported** = *resources behind the scenes* (e.g., server space); **Delivered** = *tangible product or report* handed to internal or external customers.

### Group D: ITSM Processes & Responsibilities
| Term | What It Is | Key Difference | Clue Words in a Question |
|---|---|---|---|
| **Change Management** | Under **Service Transition** | Implements **new** IT services with minimal disruption; needs a **blackout plan** | "Service Transition", "new IT services", "lessening disruption", "blackout plan", "P92,000" |
| **Incident Management** | Under **Service Operation** | Restores **interrupted** services ASAP, isolates cause, prevents recurrence | "Service Operation", "interruption", "escalations steps", "restore as soon as possible", "isolate the cause" |

> **Trap Warning:** **Change Management** belongs to *Service Transition* (proactive rollout + blackout plan), while **Incident Management** belongs to *Service Operation* (reactive restoration after an interruption).

### Group E: The Four Influences of Service Culture
| Term | What It Is | Key Difference | Clue Words in a Question |
|---|---|---|---|
| **How an organization is seen** | External brand image & CX consistency | Focuses on **customer touchpoints** from website to after-sales (Shopee 81%) | "brand", "how customers are treated", "website to after-sales", "touchpoints", "Shopee" |
| **Operation's effectiveness** | Core values & alignment with vision/strategy | Focuses on **internal values vs. reality** & team interaction (scam hubs, sales targets) | "core values", "vision and strategy", "imposed culture vs. reality", "scam hubs" |
| **How employees feel about their jobs** | Morale, recognition, wages, retention | Focuses on **advocates vs. critics**, pride, trust, hiring/retention (Lazada PH) | "advocates", "critics", "fair wages", "retain", "recruit", "Great Place to Work", "Lazada" |
| **How operation learns and adapts** | Adapting to sudden circumstances | Focuses on **comparing reality vs. what should happen** & pivoting (IBM PH WFH/AI) | "sudden circumstances", "survive and thrive", "what should be happening", "IBM", "COVID-19", "upskill" |

> **Trap Warning:** If a scenario mentions *employees being duped or forced to hit sales targets against stated values*, that's **Operation's effectiveness** (misaligned culture), NOT *how employees feel about their jobs* (wages/recognition/retention).

---

## 3. Likely Distractors

- **Service Manager**
  - *Distractors:* Service Team, Service Sponsor, Compliance Manager.
  - *How to tell apart:* Service Manager is the team's "boss" who defines services, integrates ITIL, and manages Change/Incident plans; Service Team advises with metrics; Service Sponsor sets budget/risks/service levels; Compliance Manager is only listed in the salary table (P70,000).
- **Service Sponsor**
  - *Distractors:* Service Manager, External Suppliers, Strategy Management.
  - *How to tell apart:* Service Sponsor is business-side executive leadership on the Service Team who sets budget, qualifies risks, and sets acceptable service levels—not an external vendor or operational team lead.
- **Service Team**
  - *Distractors:* Service Manager, IT Service Consumers, External Suppliers.
  - *How to tell apart:* Service Team acts like a "board director" inside the org tracking metrics and advising the Service Manager; Consumers use the service; Suppliers are contracted outsiders.
- **Change Management**
  - *Distractors:* Incident Management, Problem Management, Risk Management.
  - *How to tell apart:* Change Management is under *Service Transition* and uses a *blackout plan* when rolling out new services; Incident Management is under *Service Operation* for restoring interrupted services.
- **Incident Management**
  - *Distractors:* Change Management, Problem Management, Request Fulfillment.
  - *How to tell apart:* Incident Management specifically falls under *Service Operation*, handles escalation steps, restores interrupted services ASAP, isolates the cause, and prevents recurrence.
- **Prospects**
  - *Distractors:* IT Service Consumers, External Suppliers, Internal Customers.
  - *How to tell apart:* Prospects are *future* consumers with a defined demand, whereas IT Service Consumers already use the service and External Suppliers provide contracted resources/outsourcing.
- **ITIL (Information Technology Infrastructure Library)**
  - *Distractors:* ITSM, Service Transition, Service Operation.
  - *How to tell apart:* ITIL is an ITSM framework used purely for *guidance* (never for an ITIL inspection), whereas ITSM is the overall management discipline and Service Transition/Operation are processes.
- **Supported Service**
  - *Distractors:* Delivered Service, Service Level Management, Request Fulfillment.
  - *How to tell apart:* Supported = IT resources deployed to meet demand (Finisar server space); Delivered = producing a product or report for internal/external customers.
- **Influence on Operation's Effectiveness**
  - *Distractors:* Influence on How Employees Feel About Their Jobs, Influence on How an Organization Is Seen, Influence on How Operation Learns and Adapts.
  - *How to tell apart:* Operation's Effectiveness is about core values aligning with vision/strategy (and hypocrisy when they don't), whereas Employee Feelings is about wages/recognition/retention and Seen is about customer brand touchpoints.
- **Influence on How Operation Learns and Adapts**
  - *Distractors:* Influence on Operation's Effectiveness, Change Management, Influence on How Employees Feel About Their Jobs.
  - *How to tell apart:* Learns and Adapts is about comparing what *is* happening vs. what *should* be happening during sudden circumstances (e.g., IBM PH shifting to WFH with cloud/AI).

---

## 4. Lists, Sequences & "Which is NOT"

1. **3 ITSM Process Sub-Units Mentioned in Intro**
   - Demand Management, Request Fulfillment, Service Review.
   - *Fake "NOT" swap:* Problem Management or Compliance Manager (those appear in Table 1, not the intro's sub-unit examples).
2. **3 Basic Questions Service Managers Ask About Customer Expectations**
   - (1) What is the expected service, and how is it delivered? (2) How is the service used? (3) How much does the service cost?
   - *Fake "NOT" swap:* "How is the service supported?" (that is a question about the *IT department's capability*, not customer expectations).
3. **2 Basic Questions Service Managers Ask About the IT Department's Capability**
   - (1) How is the service supported? (2) How is the service delivered?
   - *Fake "NOT" swap:* "How much does the service cost?" (that is a customer expectation question).
4. **3 Service Manager Duties in Change Management (under Service Transition)**
   - (1) Ensure a blackout plan is ready, (2) Have a clear assessment of risk for any change, (3) Communicate important elements of the change to other relevant groups.
   - *Fake "NOT" swap:* "Setting the budget for services" (that is the *Service Sponsor's* duty).
5. **3 Service Manager Duties in Incident Management (under Service Operation)**
   - (1) Restore the service as soon as possible, (2) Isolate the cause of the incident, (3) Take action to avoid it from recurring.
   - *Fake "NOT" swap:* "Ensure a blackout plan is ready" (that belongs to *Change Management*).
6. **4 Member Types in a Service Team**
   - (1) Tech experts, (2) Product experts, (3) Support personnel, (4) Executive leadership (including the Service Sponsor).
   - *Fake "NOT" swap:* "External Suppliers" or "IT Service Consumers" (those are *External Roles*, not part of the internal Service Team).
7. **3 Responsibilities of a Service Sponsor**
   - (1) Setting the budget for services, (2) Qualifying associated risks, (3) Setting acceptable service levels.
   - *Fake "NOT" swap:* "Tracking metrics to determine service performance" (that is the *Service Team's* responsibility) or "leading the service team" (*Service Manager*).
8. **3 External Roles in ITSM**
   - (1) IT Service Consumers, (2) Prospects, (3) External Suppliers.
   - *Fake "NOT" swap:* "Service Sponsor" or "Service Team" (both are internal roles).
9. **14 ITSM Responsibilities & 2023 PH Monthly Salaries (Table 1)**
   - Highest: **Change Management (P92,000)**; tied 2nd: **Problem Management & Risk Management (P90,000)**; **Incident Management (P88,000)**; **Service Portfolio Management (P82,000)**; **Compliance Manager (P70,000)**; **Supplier Management (P68,000)**; **Access Management (P64,000)**; **Strategy Management (P62,000)**; **Service Level Management (P56,000)**; **Knowledge Management (P48,000)**; **Service & Validation Testing (P28,000)**; lowest tied: **Demand Management & Request Fulfillment (P25,000)**.
   - *Fake "NOT" swap:* "Service Sponsor" or "Service Review" (not listed in Table 1).
10. **5 Elements of Organizational Culture**
    - Practices, attitudes, behaviors, beliefs, and values shared between members.
    - *Fake "NOT" swap:* "Budgets" or "blackout plans".
11. **4 Influences of Service Culture**
    - (1) Influence on how an organization is seen, (2) Influence on operation's effectiveness, (3) Influence on how employees feel about their jobs, (4) Influence on how operation learns and adapts.
    - *Fake "NOT" swap:* "Influence on competitor pricing" or "Influence on ITIL inspection readiness".

---

## 5. Situational Practice Questions

**1.** A retail company hires an executive from its Marketing division—who has strong technical literacy and knows the firm's IT capabilities—to lead a service team, define services, and align IT with business goals. Which role is this person filling?
A. Service Sponsor
B. Service Manager
C. External Supplier
D. Service Team

**2.** During an ITIL adoption meeting, a consultant tells staff they must memorize ITIL rules to pass an upcoming official ITIL audit. Based on the handout, why is this statement flawed?
A. ITIL is only for external suppliers, not internal IT staff.
B. ITIL is used to provide guidance, not to prepare an organization for an ITIL inspection.
C. ITIL only applies to Service Operation, not Service Transition.
D. Only the Service Sponsor is allowed to read ITIL documentation.

**3.** To understand customer experience, a Service Manager asks three basic questions. Which of the following is NOT one of the three customer-expectation questions?
A. What is the expected service, and how is it delivered?
B. How is the service used?
C. How much does the service cost?
D. How is the service supported?

**4.** In the Finisar case study, the IT department provided enough server space so the customer support team could perform its work. Which IT department capability question does this illustrate?
A. How is the service delivered?
B. How is the service supported?
C. How much does the service cost?
D. How is the service used?

**5.** An IT department compiles data from multiple databases into Oracle to generate a financial report for the company's finance division. According to the handout, this is an example of:
A. A supported service for external customers
B. A delivered product for internal customers
C. A delivered product for external customers
D. A blackout plan for Service Transition

**6.** A tech firm launches a customizable web page design palette that anyone on the internet can use. How does the handout classify this?
A. A product for internal customers
B. A product for external customers
C. An internal Service Team metric
D. An external supplier contribution

**7.** Before deploying a new cloud billing system, a Service Manager prepares a fallback procedure in case the rollout begins to compromise existing services. What is this fallback procedure called?
A. Escalation step
B. Blackout plan
C. Service level agreement
D. Incident isolation

**8.** Which ITSM process houses Change Management, and what is its main goal?
A. Service Operation; restoring interrupted services as soon as possible
B. Service Transition; implementing new IT services while lessening disruption to existing services
C. Service Review; setting the budget and qualifying associated risks
D. Demand Management; turning employees into advocates

**9.** A sudden server outage halts order processing. Under Service Operation, the Service Manager restores the system quickly, pinpoints the root cause, and implements measures so it won't happen again. Which responsibility is this?
A. Change Management
B. Incident Management
C. Service Portfolio Management
D. Supplier Management

**10.** A group composed of tech experts, product experts, support personnel, and executive leadership tracks metrics after a rollout and suggests service improvements to the Service Manager. Which role is this?
A. Service Team
B. External Suppliers
C. Prospects
D. IT Service Consumers

**11.** A Vice President from the business side joins the Service Team to set the service budget, qualify associated risks, and define acceptable service levels. What is this person's specific role?
A. Service Manager
B. Service Sponsor
C. Compliance Manager
D. Request Fulfillment Lead

**12.** To keep fresh ideas flowing in an organization's ITSM efforts, what does the handout recommend regarding the Service Manager position?
A. Permanently assign it to an External Supplier
B. Eliminate the position after Service Transition
C. Consider rotating the Service Manager position
D. Merge it with the IT Service Consumer role

**13.** A logistics firm has signed a contract with an outside vendor to provide server infrastructure and outsourcing services. How does the handout classify this vendor?
A. Prospect
B. IT Service Consumer
C. External Supplier
D. Service Sponsor

**14.** A neighboring university has not yet subscribed to a cloud LMS, but it has submitted a formal, defined demand for the service next semester. Which external role does the university represent?
A. IT Service Consumer
B. Prospect
C. External Supplier
D. Service Team

**15.** Which of the following is NOT listed as a member group of a Service Team in the handout?
A. Tech experts
B. Product experts
C. Support personnel
D. External Suppliers

**16.** According to the 2023 Jobstreet data in the handout, which ITSM responsibility had the highest average monthly salary in the Philippines, and which two tied for the lowest?
A. Highest: Problem Management (P90,000); Lowest: Knowledge Management (P48,000)
B. Highest: Change Management (P92,000); Lowest: Demand Management and Request Fulfillment (P25,000)
C. Highest: Risk Management (P90,000); Lowest: Service & Validation Testing (P28,000)
D. Highest: Incident Management (P88,000); Lowest: Demand Management (P25,000)

**17.** A company invests heavily in branding, and shoppers praise it for delivering a seamless, consistent experience from its website to ordering and after-sales support—earning an 81% customer experience score like Shopee. Which influence of service culture is shown?
A. Influence on how an organization is seen
B. Influence on operation's effectiveness
C. Influence on how employees feel about their jobs
D. Influence on how operation learns and adapts

**18.** Management preaches "putting customers first," yet pressures staff solely to hit aggressive sales targets regardless of customer harm. Which influence of service culture is failing here?
A. Influence on how an organization is seen
B. Influence on operation's effectiveness
C. Influence on how employees feel about their jobs
D. Influence on how operation learns and adapts

**19.** The handout describes an Indonesian national who responded to a Facebook ad for a digital marketing position and was told to scam other Indonesians after arriving in the Philippines. In which area does the handout discuss this example?
A. Influence on how an organization is seen
B. Influence on operation's effectiveness
C. Influence on how employees feel about their jobs
D. Influence on how operation learns and adapts

**20.** More than 90% of Lazada Philippines' employees recommend it as a great workplace and plan to stay for the next two years due to trust in leaders, job pride, and colleague happiness. Which influence of service culture does this demonstrate?
A. Influence on how an organization is seen
B. Influence on operation's effectiveness
C. Influence on how employees feel about their jobs
D. Influence on how operation learns and adapts

**21.** During the 2021 COVID-19 pandemic, IBM Philippines shifted to a work-from-home ("anywhere workplace") model using cloud and AI while upskilling employees. Which influence of service culture does this exemplify?
A. Influence on how an organization is seen
B. Influence on operation's effectiveness
C. Influence on how employees feel about their jobs
D. Influence on how operation learns and adapts

**22.** (Definition Reversal) "The positive consideration of the importance of understanding good service as well as the appreciation for giving good service to internal and external customers." Which term does this define?
A. Organizational Culture
B. Service Culture
C. Service Transition
D. Service Level Management

---

## Answer Key

1. **B (Service Manager)** — Service Managers lead a service team, define services, and can be hired from outside IT if they have technical literacy. *Why not A:* A Service Sponsor handles budget, risks, and service levels rather than leading the team.
2. **B** — The handout states ITIL is used to provide guidance, not to prepare an organization for an ITIL inspection. *Why not A/C/D:* None of those restrictions exist in the handout.
3. **D ("How is the service supported?")** — That is one of the *two* questions about the **IT department's capability**, not the three customer-expectation questions. *Why not A/B/C:* All three are the exact customer-expectation questions.
4. **B (How is the service supported?)** — A service is supported when IT resources (like Finisar's server space) are deployed to meet customer demands. *Why not A:* "Delivered" refers to producing a product or report.
5. **B (A delivered product for internal customers)** — An Oracle financial report built from several databases is the handout's exact example of an internal customer product. *Why not C:* External products are usable by anyone outside (e.g., web design palette).
6. **B (A product for external customers)** — A customizable web page design palette that anyone can use is the handout's exact example for external customers. *Why not A:* Internal products serve staff inside the org (like financial reports).
7. **B (Blackout plan)** — Service Managers ensure a blackout plan is ready in case a change compromises existing services. *Why not A:* Escalation steps belong to Incident Management.
8. **B (Service Transition; implementing new IT services while lessening disruption)** — Change Management falls under Service Transition. *Why not A:* Service Operation houses Incident Management, which restores interrupted services.
9. **B (Incident Management)** — Under Service Operation, Incident Management restores services ASAP, isolates the cause, and prevents recurrence. *Why not A:* Change Management is for rolling out new services, not fixing outages.
10. **A (Service Team)** — The Service Team is a "board director" mix of tech/product experts, support staff, and executives that tracks metrics and suggests improvements. *Why not B/C/D:* Those are External Roles outside the company.
11. **B (Service Sponsor)** — The Service Sponsor is business-side executive leadership responsible for budget, qualifying risks, and setting acceptable service levels. *Why not A:* The Service Manager leads the team and operational delivery.
12. **C (Consider rotating the Service Manager position)** — The handout explicitly states rotating the Service Manager position is ideal to keep new ideas flowing. *Why not A/B/D:* None are recommended in the handout.
13. **C (External Supplier)** — External Suppliers provide infrastructure, operating supplies, contributions, and outsourcing under established contracts. *Why not A/B:* Consumers use the service; Prospects are future users with demand.
14. **B (Prospect)** — Prospects are *future* IT Service Consumers with a defined demand for IT services. *Why not A:* IT Service Consumers are already using the service.
15. **D (External Suppliers)** — External Suppliers are an *External Role* outside the employed organization, not part of the internal Service Team. *Why not A/B/C:* Tech experts, product experts, and support personnel are all listed Service Team members.
16. **B (Change Management P92,000; Demand Management & Request Fulfillment P25,000)** — Directly from Table 1 (Jobstreet 2023 PH data). *Why not A/C/D:* Those figures are lower than P92,000 or higher than P25,000.
17. **A (Influence on how an organization is seen)** — Consistent customer experience across online/offline touchpoints builds brand image (Shopee 81% CX score). *Why not B:* Operation's effectiveness is about internal core values vs. reality.
18. **B (Influence on operation's effectiveness)** — The handout specifically warns of inconsistencies when an imposed customer-care culture clashes with a reality focused only on sales targets. *Why not C:* Employee feelings focus on fair wages, conditions, and recognition.
19. **B (Influence on operation's effectiveness)** — The handout cites Senator Hontiveros's April 2023 scam-hub exposé as an example under Operation's Effectiveness. *Why not A/C/D:* It is not used as the example for those influences.
20. **C (Influence on how employees feel about their jobs)** — Lazada PH's >90% recommendation and 2-year retention illustrate employee advocacy, trust, and pride. *Why not A:* Shopee is the example for how an organization is seen.
21. **D (Influence on how operation learns and adapts)** — IBM PH's 2021 WFH pivot with cloud, AI, and upskilling is the handout's example of adapting to sudden circumstances. *Why not B:* Operation's effectiveness covers core values/vision alignment.
22. **B (Service Culture)** — This is the exact definition of Service Culture from Clark, Johnston, Slack, and Shulver (2021). *Why not A:* Organizational culture is broader (practices, attitudes, behaviors, beliefs, values).

---

## 6. Last-Minute Cram Sheet

- **Service Manager** = "Boss" who defines services, aligns IT with business, and can be hired from outside IT if technically literate; **rotate** the role to keep ideas fresh.
- **ITIL** = Provides **guidance**, NEVER used to prepare for an **ITIL inspection**.
- **3 Customer Expectation Questions**: (1) What is expected & how delivered? (2) How is it used? (3) How much does it cost?
- **2 IT Capability Questions**: (1) **Supported** = resources deployed (Finisar server space); (2) **Delivered** = product/report produced (Internal = Oracle financial report; External = customizable web design palette).
- **Change Management** = Under **Service Transition**; minimizes disruption, assesses risk, communicates, and requires a **blackout plan**.
- **Incident Management** = Under **Service Operation**; analyzes escalations, restores service **ASAP**, isolates cause, prevents recurrence.
- **Service Team** = "Board director" (tech experts, product experts, support personnel, executive leadership); tracks metrics and suggests improvements.
- **Service Sponsor** = Business-side executive on the Service Team who sets **budget**, qualifies **risks**, and sets **acceptable service levels**.
- **3 External Roles**: **IT Service Consumers** (current users), **Prospects** (future users with defined demand), **External Suppliers** (contracted infrastructure/supplies/outsourcing).
- **2023 PH Salaries (Table 1)**: Highest = **Change Management (P92,000)**; Lowest = **Demand Management & Request Fulfillment (P25,000)**.
- **Service Culture**: Positive consideration & appreciation of giving good service to internal/external customers, plus thinking how to improve it.
- **Influence 1 (How Seen)**: Consistent CX across touchpoints builds brand — **Shopee (81% CX score)**.
- **Influence 2 (Operation's Effectiveness)**: Core values must match vision/strategy (not sales-target hypocrisy) — **Sen. Hontiveros April 2023 scam-hub exposé**.
- **Influence 3 (Employee Feelings)**: Fair wages/conditions turn staff into **advocates** (not **critics**) — **Lazada PH (>90% recommend, 2-year stay)**.
- **Influence 4 (Learns & Adapts)**: Compare reality vs. what *should* happen during sudden change — **IBM PH (2021 WFH, cloud, AI, upskilling)**.
