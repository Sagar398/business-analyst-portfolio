/* ------------------------------------------------------------
   Business Analyst Portfolio – Interactive behaviour
   – Mobile navigation toggle
   – Smooth active link highlighting
   – More Projects toggle (show/hide 50+ projects)
   – Form submit simulation
   – Console greeting (production ready)
------------------------------------------------------------ */

(function () {
    "use strict";

    // ---------- MOBILE NAVIGATION ----------
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", function (e) {
            e.stopPropagation();
            navMenu.classList.toggle("active");
            const icon = this.querySelector("i");
            if (icon) {
                if (navMenu.classList.contains("active")) {
                    icon.classList.remove("fa-bars");
                    icon.classList.add("fa-times");
                } else {
                    icon.classList.remove("fa-times");
                    icon.classList.add("fa-bars");
                }
            }
        });
    }

    navLinks.forEach((link) => {
        link.addEventListener("click", function () {
            if (navMenu && navMenu.classList.contains("active")) {
                navMenu.classList.remove("active");
                const icon = hamburger?.querySelector("i");
                if (icon) {
                    icon.classList.remove("fa-times");
                    icon.classList.add("fa-bars");
                }
            }
        });
    });

    document.addEventListener("click", function (event) {
        if (window.innerWidth <= 768 && navMenu && hamburger) {
            const isClickInsideMenu = navMenu.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);
            if (!isClickInsideMenu && !isClickOnHamburger && navMenu.classList.contains("active")) {
                navMenu.classList.remove("active");
                const icon = hamburger.querySelector("i");
                if (icon) {
                    icon.classList.remove("fa-times");
                    icon.classList.add("fa-bars");
                }
            }
        }
    });

    // ---------- MORE PROJECTS TOGGLE ----------
    const toggleProjectsBtn = document.getElementById("toggleProjectsBtn");
    const allProjectsContainer = document.getElementById("allProjectsContainer");

    if (toggleProjectsBtn && allProjectsContainer) {
        toggleProjectsBtn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            const isVisible = allProjectsContainer.classList.contains("visible");

            if (isVisible) {
                // Hide projects
                allProjectsContainer.classList.remove("visible");
                this.classList.remove("active");
                this.innerHTML = '<i class="fas fa-plus-circle"></i> Display More Projects';

                // Scroll back to projects section
                const projectsSection = document.getElementById("projects");
                if (projectsSection) {
                    projectsSection.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            } else {
                // Show projects
                allProjectsContainer.classList.add("visible");
                this.classList.add("active");
                this.innerHTML = '<i class="fas fa-minus-circle"></i> Show Less';

                // Scroll to the newly visible content
                setTimeout(() => {
                    const heading = allProjectsContainer.querySelector(".section-title");
                    if (heading) {
                        const yOffset = -80;
                        const y = heading.getBoundingClientRect().top + window.pageYOffset + yOffset;
                        window.scrollTo({ top: y, behavior: "smooth" });
                    }
                }, 200);
            }
        });
    }

    // ---------- ACTIVE LINK HIGHLIGHTING ON SCROLL ----------
    const sections = document.querySelectorAll("section[id]");

    function updateActiveLink() {
        let currentSection = "";
        const scrollPosition = window.scrollY + 120;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            const href = link.getAttribute("href");
            if (href && href === `#${currentSection}`) {
                link.classList.add("active");
            }
        });
    }

    updateActiveLink();
    window.addEventListener("scroll", updateActiveLink);
    window.addEventListener("resize", updateActiveLink);

    // ---------- CONTACT FORM (simulated submit) ----------
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            setTimeout(() => {
                this.reset();

                const successMsg = document.createElement("div");
                successMsg.style.cssText = `
                    margin-top: 1rem;
                    padding: 0.8rem 1.2rem;
                    background: #d1fae5;
                    color: #065f46;
                    border-radius: 10px;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    border: 1px solid #a7f3d0;
                `;
                successMsg.innerHTML =
                    '<i class="fas fa-check-circle"></i> Thank you! Your message has been sent. (demo)';

                const existingMsg = contactForm.querySelector(".success-message");
                if (existingMsg) existingMsg.remove();

                successMsg.classList.add("success-message");
                contactForm.appendChild(successMsg);

                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;

                setTimeout(() => {
                    if (successMsg.parentNode) {
                        successMsg.remove();
                    }
                }, 5000);
            }, 1200);
        });
    }

    // ---------- SMOOTH SCROLL FALLBACK ----------
    if (!("scrollBehavior" in document.documentElement.style)) {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener("click", function (e) {
                const targetId = this.getAttribute("href");
                if (targetId === "#") return;
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: "smooth"
                    });
                }
            });
        });
    }

    // ---------- CONSOLE GREETING ----------
    console.log(
        "%c👋 Sagar Balpande · Business Analyst Portfolio",
        "font-size: 16px; font-weight: bold; color: #2563eb;"
    );
    console.log("%c4+ years IT services experience | 50+ projects delivered", "font-size: 14px; color: #475569;");
})();

/* ============================================================
   PROJECT CASE-STUDY DATA (50+ projects)
   Compact format – use a helper to render sections
   ============================================================ */

// Reusable building blocks to avoid repetition
const COMMON_TOOLS = ["JIRA", "Confluence", "MS Visio", "Excel", "SQL"];
const COMMON_ARTIFACTS = [
    { icon: "fa-file-alt", label: "BRD" },
    { icon: "fa-list-check", label: "User Stories" },
    { icon: "fa-project-diagram", label: "Process Flow" }
];

// Helper to build a project entry quickly
function P({ icon, title, meta, context, role, approach, artifacts, challenges, results, tools }) {
    return {
        icon,
        eyebrow: "Case Study",
        title,
        meta,
        context,
        role,
        approach,
        artifacts: artifacts || COMMON_ARTIFACTS,
        challenges,
        results,
        tools: tools || COMMON_TOOLS
    };
}

const PROJECTS = {
    /* ---------- RECENT 3 (full case studies) ---------- */
    ecommerce: P({
        icon: "fa-shopping-cart",
        title: "E-commerce Checkout Optimization",
        meta: [
            { icon: "fa-briefcase", text: "Governmnet Client" },
            { icon: "fa-clock", text: "6 months" },
            { icon: "fa-user-tie", text: "Lead BA" },
            { icon: "fa-layer-group", text: "Hybrid Methodology" }
        ],
        context:
            "A mid-sized e-commerce retailer was losing 68% of users at checkout. Traffic was healthy but conversions were flat. Stakeholders from marketing, operations, and engineering each had different opinions — none could agree on priorities.",
        role: [
            "Led discovery workshops with 8 stakeholders across marketing, ops, and engineering",
            "Analysed funnel data and session recordings to identify 4 major drop-off points",
            "Wrote the BRD and 27 user stories, prioritised using MoSCoW and RICE",
            "Created wireframes in Figma for the redesigned 3-step checkout",
            "Coordinated UAT with 12 pilot users and supported phased rollout"
        ],
        approach: [
            "Discovery: stakeholder interviews, funnel analysis, session recordings",
            "Analysis: quantified drop-off per step, mapped AS-IS vs TO-BE journey",
            "Documentation: BRD, user stories with acceptance criteria, process flow",
            "Design: wireframes and clickable prototype in Figma",
            "Validation: UAT plan, test cases, defect triage with QA",
            "Delivery: A/B test support, results analysis, documented learnings"
        ],
        artifacts: [
            { icon: "fa-file-alt", label: "SRS" },
            { icon: "fa-list-check", label: "User Stories" },
            { icon: "fa-project-diagram", label: "AS-IS / TO-BE Flow" },
            { icon: "fa-pencil-ruler", label: "Figma Wireframes" },
            { icon: "fa-chart-line", label: "Dashboards" },
            { icon: "fa-chart-line", label: "Visily Wireframes" },
            { icon: "fa-clipboard-check", label: "UAT" }
        ],
        challenges: [
            {
                title: "Conflicting priorities",
                text: "Ran a RICE-based prioritisation workshop to align marketing and engineering on top 5 changes."
            },
            {
                title: "No baseline metrics",
                text: "Set up GA4 event tracking in week 1, established 30-day baseline, used it to prove impact."
            },
            {
                title: "Mobile vs desktop gap",
                text: "Reduced mobile form from 14 to 6 fields for returning users — alone contributed 7% lift."
            }
        ],
        results: [
            { value: "18%", label: "Cart abandonment ↓" },
            { value: "22%", label: "Checkout completion ↑" },
            { value: "14→6", label: "Form fields" }
        ]
    }),

    loan: P({
        icon: "fa-university",
        title: "Loan Origination System",
        meta: [
            { icon: "fa-briefcase", text: "Fintech Client" },
            { icon: "fa-clock", text: "9 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile + Waterfall" }
        ],
        context:
            "A fintech lender processed loans through a patchwork of spreadsheets and email approvals. Average processing time was 8 days, and error rates were climbing. The client needed a digitised, auditable workflow.",
        role: [
            "Mapped the entire AS-IS loan lifecycle with 14 process steps",
            "Conducted 12 stakeholder interviews across credit, risk, legal, and ops",
            "Authored the FRD, BPMN diagrams, and 45 user stories",
            "Defined data mapping rules between legacy and new system",
            "Led UAT with 20 test scenarios and coordinated defect resolution"
        ],
        approach: [
            "Discovery: process walkthroughs with each department",
            "Analysis: identified 5 redundant approval steps",
            "Documentation: FRD, BPMN 2.0 diagrams, data dictionary",
            "Design collaboration: wireframes for the officer and customer views",
            "Validation: UAT plan with 20 scenarios, defect triage",
            "Delivery: pilot with 3 branches, phased rollout, hypercare"
        ],
        artifacts: [
            { icon: "fa-file-alt", label: "FRD" },
            { icon: "fa-project-diagram", label: "BPMN Diagrams" },
            { icon: "fa-database", label: "Data Mapping" },
            { icon: "fa-list-check", label: "45 User Stories" },
            { icon: "fa-clipboard-check", label: "UAT Plan" },
            { icon: "fa-chart-bar", label: "KPI Dashboard" }
        ],
        challenges: [
            {
                title: "Resistance from credit team",
                text: "Involved them early in workshops; framed automation as removing drudgery, not replacing judgement."
            },
            {
                title: "Legacy data quality",
                text: "Built a data-cleansing sub-project before migration; reduced migration errors by 90%."
            },
            {
                title: "Regulatory constraints",
                text: "Partnered with legal from day one to embed compliance checkpoints into the flow."
            }
        ],
        results: [
            { value: "25%", label: "Processing time ↓" },
            { value: "90%", label: "Data errors ↓" },
            { value: "8→6", label: "Days to approval" }
        ]
    }),

    patient: P({
        icon: "fa-hospital",
        title: "Patient Portal Revamp",
        meta: [
            { icon: "fa-briefcase", text: "Healthcare Provider" },
            { icon: "fa-clock", text: "5 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context:
            "A multi-specialty hospital group had an aging patient portal with 12% monthly active usage. Patients preferred calling the front desk. The hospital wanted to shift routine tasks online and improve engagement.",
        role: [
            "Ran 10 patient interviews and 6 clinician interviews",
            "Prioritised features using Kano model and effort-impact matrix",
            "Wrote the BRD, 32 user stories, and accessibility requirements",
            "Created wireframes in Figma for web and mobile",
            "Coordinated UAT with 15 patients and 5 clinicians"
        ],
        approach: [
            "Discovery: patient and clinician interviews, support ticket analysis",
            "Analysis: Kano model to classify must-have vs delight features",
            "Documentation: BRD, user stories, WCAG 2.1 AA checklist",
            "Design: wireframes for appointments, reports, payments, messaging",
            "Validation: UAT with real patients, accessibility audit",
            "Delivery: phased rollout with feedback loop"
        ],
        artifacts: [
            { icon: "fa-file-alt", label: "BRD" },
            { icon: "fa-list-check", label: "32 User Stories" },
            { icon: "fa-pencil-ruler", label: "Figma Wireframes" },
            { icon: "fa-universal-access", label: "WCAG Checklist" },
            { icon: "fa-clipboard-check", label: "UAT Plan" },
            { icon: "fa-chart-line", label: "Engagement Dashboard" }
        ],
        challenges: [
            {
                title: "Low digital literacy among older patients",
                text: "Designed a simplified mode and added video walkthroughs — adoption in 60+ age group rose 3x."
            },
            {
                title: "Clinician resistance to messaging",
                text: "Framed secure messaging as reducing phone interruptions; ran a 2-week pilot that won them over."
            },
            {
                title: "HIPAA compliance",
                text: "Embedded privacy review into every sprint, with a compliance checklist per user story."
            }
        ],
        results: [
            { value: "40%", label: "Patient engagement ↑" },
            { value: "12→34%", label: "Monthly active users" },
            { value: "−28%", label: "Front desk calls" }
        ]
    }),

    /* ---------- RETAIL & E-COMMERCE ---------- */
    retailPos: P({
        icon: "fa-store",
        title: "Retail POS Integration",
        meta: [
            { icon: "fa-briefcase", text: "Retail Chain" },
            { icon: "fa-clock", text: "7 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context:
            "A retail chain of 50+ stores ran disconnected POS systems. Inventory was reconciled manually each night, causing stockouts and overstocking.",
        role: [
            "Mapped AS-IS store operations across 8 pilot stores",
            "Documented integration requirements between POS, ERP, and warehouse",
            "Wrote user stories for real-time sync and offline mode",
            "Coordinated UAT across store managers and HQ",
            "Supported phased rollout across all 50 stores"
        ],
        approach: [
            "Discovery: store visits and manager interviews",
            "Analysis: reconciled sales vs stock reports",
            "Documentation: integration spec, user stories",
            "Validation: UAT in 8 pilot stores",
            "Delivery: phased rollout, hypercare for 4 weeks"
        ],
        results: [
            { value: "98%", label: "Inventory accuracy" },
            { value: "−40%", label: "Stockouts" },
            { value: "3h", label: "Daily saving per store" }
        ],
        challenges: [
            {
                title: "Offline mode",
                text: "Stores with unstable internet needed full offline capability — defined sync conflict rules with dev team."
            },
            { title: "Staff resistance", text: "Ran hands-on training sessions and printed quick-reference cards." }
        ]
    }),

    supplyChain: P({
        icon: "fa-truck",
        title: "Supply Chain Dashboard",
        meta: [
            { icon: "fa-briefcase", text: "Logistics Firm" },
            { icon: "fa-clock", text: "4 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context:
            "A logistics firm had shipment data scattered across 4 systems. Managers spent hours each week building reports manually.",
        role: [
            "Identified KPIs with 6 department heads",
            "Documented data sources and refresh requirements",
            "Wrote user stories for 12 dashboard views",
            "Validated data accuracy with ops team",
            "Trained 25 managers on the new dashboard"
        ],
        approach: [
            "Discovery: KPI workshops with each department",
            "Analysis: source system audit and data mapping",
            "Documentation: KPI dictionary, user stories",
            "Validation: parallel run against manual reports"
        ],
        results: [
            { value: "−85%", label: "Reporting time" },
            { value: "12", label: "KPIs automated" },
            { value: "4→1", label: "Systems consolidated" }
        ],
        challenges: [
            {
                title: "Conflicting KPI definitions",
                text: "Ran a data governance workshop to lock definitions before building."
            }
        ]
    }),

    paymentGateway: P({
        icon: "fa-credit-card",
        title: "Payment Gateway Migration",
        meta: [
            { icon: "fa-briefcase", text: "E-commerce Client" },
            { icon: "fa-clock", text: "5 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context:
            "A client needed to migrate from a legacy payment gateway to Stripe with zero downtime and no drop in success rates.",
        role: [
            "Documented functional and non-functional requirements",
            "Mapped legacy fields to Stripe API",
            "Defined fallback and rollback strategy",
            "Coordinated UAT with finance and support teams",
            "Led cutover plan with dev and ops"
        ],
        approach: [
            "Discovery: current gateway capabilities audit",
            "Analysis: gap analysis vs Stripe features",
            "Documentation: migration spec, cutover plan",
            "Validation: shadow testing alongside legacy gateway"
        ],
        results: [
            { value: "0", label: "Downtime" },
            { value: "+3.2%", label: "Success rate" },
            { value: "−22%", label: "Txn cost" }
        ],
        challenges: [
            {
                title: "Zero-downtime migration",
                text: "Proposed a shadow-run for 2 weeks before cutover — caught 4 edge cases."
            }
        ]
    }),

    inventoryForecast: P({
        icon: "fa-boxes",
        title: "Inventory Forecasting Tool",
        meta: [
            { icon: "fa-briefcase", text: "Retail Client" },
            { icon: "fa-clock", text: "6 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context:
            "The client had 22% overstock across slow-moving SKUs. Manual forecasting was inconsistent between planners.",
        role: [
            "Documented forecasting rules with 5 planners",
            "Defined data inputs and refresh cadence",
            "Wrote user stories for the forecasting engine",
            "Validated forecast accuracy with historical data",
            "Trained planning team on interpretation"
        ],
        approach: [
            "Discovery: planner interviews, current process mapping",
            "Analysis: historical demand patterns",
            "Documentation: forecasting rules, edge cases",
            "Validation: back-testing against 12 months of data"
        ],
        results: [
            { value: "22%", label: "Overstock ↓" },
            { value: "89%", label: "Forecast accuracy" },
            { value: "−30%", label: "Planner time" }
        ],
        challenges: [
            {
                title: "Seasonal anomalies",
                text: "Flagged outlier months for manual override rather than letting the model distort results."
            }
        ]
    }),

    lastMile: P({
        icon: "fa-shipping-fast",
        title: "Last-Mile Delivery App",
        meta: [
            { icon: "fa-briefcase", text: "Logistics Client" },
            { icon: "fa-clock", text: "6 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context:
            "Drivers used paper manifests and phone calls. Customers had no ETA visibility, driving support calls.",
        role: [
            "Shadowed drivers for 3 days to map the real process",
            "Documented requirements for driver app and customer tracking",
            "Wrote user stories for routing, proof of delivery, and notifications",
            "Coordinated UAT with 10 drivers and 5 dispatchers"
        ],
        approach: [
            "Discovery: field shadowing, dispatcher interviews",
            "Analysis: identified 4 time-wasting steps",
            "Documentation: user journeys, user stories",
            "Validation: UAT with real routes"
        ],
        results: [
            { value: "+32%", label: "On-time delivery" },
            { value: "−45%", label: "Support calls" },
            { value: "−18%", label: "Fuel cost" }
        ],
        challenges: [
            {
                title: "Driver adoption",
                text: "Designed the app for one-handed use and offline capture — adoption hit 95% in 2 weeks."
            }
        ]
    }),

    wealthMgmt: P({
        icon: "fa-chart-line",
        title: "Wealth Management Platform",
        meta: [
            { icon: "fa-briefcase", text: "Wealth Firm" },
            { icon: "fa-clock", text: "8 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context:
            "Advisors had no consolidated view of client portfolios across asset classes. Reporting was manual and error-prone.",
        role: [
            "Interviewed 10 advisors to capture workflows",
            "Documented requirements for portfolio tracking and rebalancing",
            "Wrote user stories with complex calculation rules",
            "Validated outputs against custodian reports"
        ],
        approach: [
            "Discovery: advisor interviews, sample report audit",
            "Analysis: calculation rule documentation",
            "Documentation: business rules, user stories",
            "Validation: reconciliation against custodian data"
        ],
        results: [
            { value: "−70%", label: "Report prep time" },
            { value: "99.8%", label: "Reconciliation accuracy" },
            { value: "10", label: "Advisors onboarded" }
        ],
        challenges: [
            {
                title: "Complex calculation rules",
                text: "Broke rules into a testable decision table — eliminated ambiguity in dev handoff."
            }
        ]
    }),

    /* ---------- FINANCE & BANKING ---------- */
    coreBanking: P({
        icon: "fa-building",
        title: "Core Banking Upgrade",
        meta: [
            { icon: "fa-briefcase", text: "Regional Bank" },
            { icon: "fa-clock", text: "14 months" },
            { icon: "fa-user-tie", text: "Senior BA" },
            { icon: "fa-layer-group", text: "Hybrid" }
        ],
        context:
            "A regional bank ran on a 20-year-old core system. Migration to a cloud core was a multi-year strategic initiative.",
        role: [
            "Documented AS-IS product catalogue and account rules",
            "Mapped 200+ fields between legacy and new core",
            "Wrote FRDs for 6 product modules",
            "Coordinated UAT across 4 business units",
            "Supported data migration rehearsals"
        ],
        approach: [
            "Discovery: product owner interviews, legacy doc review",
            "Analysis: field-level data mapping",
            "Documentation: FRDs, migration mapping sheets",
            "Validation: 3 migration rehearsals, 2 UAT cycles"
        ],
        results: [
            { value: "200+", label: "Fields mapped" },
            { value: "6", label: "Modules delivered" },
            { value: "0", label: "Critical defects at go-live" }
        ],
        challenges: [
            {
                title: "Legacy knowledge loss",
                text: "Ran reverse-engineering workshops with veteran staff before they retired."
            }
        ]
    }),

    invoiceAuto: P({
        icon: "fa-file-invoice-dollar",
        title: "Invoice Automation",
        meta: [
            { icon: "fa-briefcase", text: "Shared Services" },
            { icon: "fa-clock", text: "4 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context:
            "AP/AR teams processed 5,000+ invoices per month manually. Error rates were 4% and cycle time was 9 days.",
        role: [
            "Mapped current AP/AR process with finance team",
            "Documented OCR and validation rules",
            "Wrote user stories for exception handling",
            "Coordinated UAT with finance and vendors"
        ],
        approach: [
            "Discovery: process walkthrough, exception analysis",
            "Analysis: rule-based automation design",
            "Documentation: process maps, user stories",
            "Validation: parallel run with manual process"
        ],
        results: [
            { value: "−35%", label: "Manual effort" },
            { value: "4%→0.8%", label: "Error rate" },
            { value: "9→3", label: "Days cycle time" }
        ],
        challenges: [
            {
                title: "Vendor invoice formats",
                text: "Built a template library covering 80% of vendors; exceptions routed to human review."
            }
        ]
    }),

    fraudDetection: P({
        icon: "fa-shield-alt",
        title: "Fraud Detection System",
        meta: [
            { icon: "fa-briefcase", text: "Payments Client" },
            { icon: "fa-clock", text: "6 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context:
            "A payments client had rising fraud losses and no real-time alerting. Analysts reviewed transactions 24 hours later.",
        role: [
            "Documented rule-based alert requirements with risk team",
            "Defined thresholds and escalation matrix",
            "Wrote user stories for the case management tool",
            "Validated rules against historical fraud cases"
        ],
        approach: [
            "Discovery: risk team interviews, fraud case review",
            "Analysis: rule design with risk analytics",
            "Documentation: rule catalogue, user stories",
            "Validation: back-test against 6 months of cases"
        ],
        results: [
            { value: "−58%", label: "Fraud losses" },
            { value: "24h→real-time", label: "Detection lag" },
            { value: "+21%", label: "Case throughput" }
        ],
        challenges: [
            {
                title: "False positives",
                text: "Tuned thresholds iteratively; involved analysts in weekly calibration sessions."
            }
        ]
    }),

    cryptoWallet: P({
        icon: "fa-coins",
        title: "Cryptocurrency Wallet",
        meta: [
            { icon: "fa-briefcase", text: "Fintech Startup" },
            { icon: "fa-clock", text: "5 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context: "A startup wanted a multi-currency wallet with strong security and a simple onboarding flow.",
        role: [
            "Documented multi-currency requirements and 2FA flows",
            "Mapped regulatory requirements with legal",
            "Wrote user stories for onboarding, send/receive, and recovery",
            "Coordinated UAT with a 30-user beta group"
        ],
        approach: [
            "Discovery: stakeholder workshops, competitor analysis",
            "Analysis: regulatory and security requirements",
            "Documentation: user stories, flow diagrams",
            "Validation: beta UAT with real users"
        ],
        results: [
            { value: "4", label: "Currencies supported" },
            { value: "2FA", label: "Enforced" },
            { value: "30", label: "Beta users onboarded" }
        ],
        challenges: [
            {
                title: "Security vs UX",
                text: "Balanced 2FA friction with a recovery flow that still passed security review."
            }
        ]
    }),

    telemedicine: P({
        icon: "fa-heartbeat",
        title: "Telemedicine Platform",
        meta: [
            { icon: "fa-briefcase", text: "Healthcare Provider" },
            { icon: "fa-clock", text: "7 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context:
            "A provider needed a telemedicine platform for video consults, e-prescriptions, and billing integration.",
        role: [
            "Documented clinical and billing workflows",
            "Wrote user stories for scheduling, video, and prescription modules",
            "Defined compliance requirements with legal",
            "Coordinated UAT with clinicians and admin staff"
        ],
        approach: [
            "Discovery: clinician and admin interviews",
            "Analysis: workflow mapping across roles",
            "Documentation: user stories, compliance checklist",
            "Validation: UAT with real consults in pilot"
        ],
        results: [
            { value: "500+", label: "Consults in month 1" },
            { value: "4.7/5", label: "Clinician rating" },
            { value: "−30%", label: "No-shows" }
        ],
        challenges: [{ title: "Clinician trust", text: "Piloted with 5 champions who then advocated to peers." }]
    }),

    ehrIntegration: P({
        icon: "fa-notes-medical",
        title: "EHR Integration",
        meta: [
            { icon: "fa-briefcase", text: "Clinic Network" },
            { icon: "fa-clock", text: "6 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Hybrid" }
        ],
        context: "A network of 10+ clinics used different EHRs, blocking referral continuity and lab data sharing.",
        role: [
            "Documented data exchange requirements (HL7/FHIR)",
            "Mapped fields across 3 EHR vendors",
            "Wrote integration user stories and exception flows",
            "Coordinated UAT across clinics"
        ],
        approach: [
            "Discovery: clinic workflow interviews",
            "Analysis: HL7/FHIR gap analysis",
            "Documentation: mapping sheet, user stories",
            "Validation: UAT in 3 pilot clinics"
        ],
        results: [
            { value: "10+", label: "Clinics connected" },
            { value: "−50%", label: "Referral turnaround" },
            { value: "3", label: "EHR vendors integrated" }
        ],
        challenges: [
            { title: "Vendor cooperation", text: "Set up a weekly vendor sync and shared a single mapping workbook." }
        ]
    }),

    /* ---------- HEALTHCARE ---------- */
    pharmacyMgmt: P({
        icon: "fa-pills",
        title: "Pharmacy Management",
        meta: [
            { icon: "fa-briefcase", text: "Pharmacy Chain" },
            { icon: "fa-clock", text: "5 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context: "A pharmacy chain struggled with prescription errors and insurance claim rejections.",
        role: [
            "Documented prescription and claim workflows",
            "Wrote user stories for inventory and insurance modules",
            "Validated claim rules with insurance partners",
            "Coordinated UAT with pharmacists"
        ],
        approach: [
            "Discovery: pharmacist shadowing",
            "Analysis: claim rejection root-cause review",
            "Documentation: process maps, user stories",
            "Validation: UAT across 5 stores"
        ],
        results: [
            { value: "−42%", label: "Claim rejections" },
            { value: "−65%", label: "Script errors" },
            { value: "5", label: "Stores live" }
        ],
        challenges: [
            { title: "Insurance rule variety", text: "Built a rules catalogue reviewed monthly with each insurer." }
        ]
    }),

    clinicalTrial: P({
        icon: "fa-user-md",
        title: "Clinical Trial Management",
        meta: [
            { icon: "fa-briefcase", text: "Research Org" },
            { icon: "fa-clock", text: "8 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Hybrid" }
        ],
        context:
            "A research organisation ran trials on spreadsheets. Patient enrollment and adverse event tracking were error-prone.",
        role: [
            "Documented trial lifecycle requirements",
            "Wrote user stories for enrollment, visits, and adverse events",
            "Defined compliance and audit trail requirements",
            "Coordinated UAT with trial coordinators"
        ],
        approach: [
            "Discovery: coordinator interviews",
            "Analysis: regulatory audit requirements",
            "Documentation: user stories, compliance matrix",
            "Validation: UAT with 2 live trials"
        ],
        results: [
            { value: "2", label: "Trials piloted" },
            { value: "+28%", label: "Enrollment rate" },
            { value: "100%", label: "Audit trail coverage" }
        ],
        challenges: [
            {
                title: "Regulatory audit",
                text: "Embedded audit logging into every user story rather than bolting on later."
            }
        ]
    }),

    emergencyResponse: P({
        icon: "fa-ambulance",
        title: "Emergency Response System",
        meta: [
            { icon: "fa-briefcase", text: "Municipal Client" },
            { icon: "fa-clock", text: "6 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context: "A city emergency service used radios and paper logs. Dispatch times were inconsistent.",
        role: [
            "Documented dispatch and tracking workflows",
            "Wrote user stories for call intake, dispatch, and telemetry",
            "Defined SLA timers and escalation rules",
            "Coordinated UAT with dispatchers and crews"
        ],
        approach: [
            "Discovery: ride-alongs and dispatch center observation",
            "Analysis: SLA and escalation design",
            "Documentation: user stories, workflow maps",
            "Validation: UAT with live drills"
        ],
        results: [
            { value: "−38%", label: "Avg dispatch time" },
            { value: "+25%", label: "Crew visibility" },
            { value: "1", label: "Unified dashboard" }
        ],
        challenges: [
            {
                title: "Real-time pressure",
                text: "Designed screens around a 3-second glance rule; tested with dispatchers under load."
            }
        ]
    }),

    lmsRevamp: P({
        icon: "fa-graduation-cap",
        title: "LMS Revamp",
        meta: [
            { icon: "fa-briefcase", text: "University" },
            { icon: "fa-clock", text: "7 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context: "A university LMS served 50k+ students but had low engagement and frequent complaints.",
        role: [
            "Ran student and faculty surveys and interviews",
            "Prioritised features with MoSCoW",
            "Wrote user stories for content, assessments, and analytics",
            "Coordinated UAT with 200 students and 30 faculty"
        ],
        approach: [
            "Discovery: surveys (n=1,200), focus groups",
            "Analysis: pain-point prioritisation",
            "Documentation: user stories, accessibility checklist",
            "Validation: UAT with representative cohorts"
        ],
        results: [
            { value: "+41%", label: "Student engagement" },
            { value: "4.3/5", label: "Satisfaction" },
            { value: "50k+", label: "Users migrated" }
        ],
        challenges: [
            {
                title: "Faculty resistance",
                text: "Involved faculty champions in design; gave early access before general rollout."
            }
        ]
    }),

    examPortal: P({
        icon: "fa-book",
        title: "Online Exam Portal",
        meta: [
            { icon: "fa-briefcase", text: "EdTech Client" },
            { icon: "fa-clock", text: "5 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context: "A client needed a scalable online exam portal with proctoring, auto-grading, and analytics.",
        role: [
            "Documented exam and proctoring workflows",
            "Wrote user stories for question bank, grading, and analytics",
            "Defined security and anti-cheat requirements",
            "Coordinated UAT with examiners and students"
        ],
        approach: [
            "Discovery: examiner and student workshops",
            "Analysis: security and integrity requirements",
            "Documentation: user stories, security checklist",
            "Validation: mock exams at scale"
        ],
        results: [
            { value: "10k+", label: "Concurrent users" },
            { value: "−70%", label: "Grading time" },
            { value: "99.9%", label: "Uptime during exams" }
        ],
        challenges: [{ title: "Peak load", text: "Ran a load test at 3x expected volume before go-live." }]
    }),

    teacherDashboard: P({
        icon: "fa-chalkboard-teacher",
        title: "Teacher Dashboard",
        meta: [
            { icon: "fa-briefcase", text: "School Network" },
            { icon: "fa-clock", text: "4 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context: "Teachers juggled 5+ systems for attendance, grades, and parent communication.",
        role: [
            "Documented teacher workflows across 3 schools",
            "Wrote user stories for a unified dashboard",
            "Defined role-based access requirements",
            "Coordinated UAT with 40 teachers"
        ],
        approach: [
            "Discovery: teacher interviews, day-in-the-life mapping",
            "Analysis: system consolidation opportunities",
            "Documentation: user stories, role matrix",
            "Validation: UAT with representative teachers"
        ],
        results: [
            { value: "5→1", label: "Systems consolidated" },
            { value: "−55%", label: "Admin time" },
            { value: "40", label: "Teachers onboarded" }
        ],
        challenges: [
            { title: "Role complexity", text: "Built a role matrix reviewed with HR to prevent access issues." }
        ]
    }),

    /* ---------- EDUCATION & EDTECH ---------- */
    universityAdmission: P({
        icon: "fa-university",
        title: "University Admission System",
        meta: [
            { icon: "fa-briefcase", text: "University" },
            { icon: "fa-clock", text: "6 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Hybrid" }
        ],
        context: "A university admission process was paper-heavy, with a 45-day application-to-decision cycle.",
        role: [
            "Documented the end-to-end admission workflow",
            "Wrote user stories for applicants and reviewers",
            "Defined scoring and shortlisting rules",
            "Coordinated UAT with the admissions office"
        ],
        approach: [
            "Discovery: admissions office observation",
            "Analysis: bottleneck identification",
            "Documentation: workflow maps, user stories",
            "Validation: UAT with live applications"
        ],
        results: [
            { value: "45→18", label: "Days to decision" },
            { value: "−60%", label: "Paper handling" },
            { value: "+22%", label: "Applications processed" }
        ],
        challenges: [
            { title: "Peak season", text: "Load-tested the system at 5x normal volume before the admission window." }
        ]
    }),

    codingBootcamp: P({
        icon: "fa-laptop-code",
        title: "Coding Bootcamp Platform",
        meta: [
            { icon: "fa-briefcase", text: "EdTech Client" },
            { icon: "fa-clock", text: "5 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context: "A bootcamp needed an interactive platform for coding challenges and mentor feedback.",
        role: [
            "Documented challenge, submission, and feedback workflows",
            "Wrote user stories for the code runner and mentor view",
            "Defined plagiarism and timeout rules",
            "Coordinated UAT with 20 students and 5 mentors"
        ],
        approach: [
            "Discovery: student and mentor interviews",
            "Analysis: challenge lifecycle mapping",
            "Documentation: user stories, edge cases",
            "Validation: UAT with real cohort"
        ],
        results: [
            { value: "500+", label: "Challenges hosted" },
            { value: "+35%", label: "Completion rate" },
            { value: "−50%", label: "Mentor review time" }
        ],
        challenges: [
            {
                title: "Language support",
                text: "Phased language rollout starting with the 3 most used by the bootcamp."
            }
        ]
    }),

    smartFactory: P({
        icon: "fa-industry",
        title: "Smart Factory IoT",
        meta: [
            { icon: "fa-briefcase", text: "Manufacturer" },
            { icon: "fa-clock", text: "9 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Hybrid" }
        ],
        context: "A manufacturer wanted predictive maintenance using 200+ IoT sensors.",
        role: [
            "Documented sensor data and alerting requirements",
            "Wrote user stories for monitoring and maintenance workflows",
            "Defined alert thresholds with plant engineers",
            "Coordinated UAT on the shop floor"
        ],
        approach: [
            "Discovery: plant walkthrough, engineer interviews",
            "Analysis: failure mode and alert design",
            "Documentation: data dictionary, user stories",
            "Validation: UAT with pilot production line"
        ],
        results: [
            { value: "200+", label: "Sensors connected" },
            { value: "−32%", label: "Unplanned downtime" },
            { value: "−18%", label: "Maintenance cost" }
        ],
        challenges: [
            { title: "Noisy sensor data", text: "Added smoothing and debounce rules to prevent alert fatigue." }
        ]
    }),

    productionPlanning: P({
        icon: "fa-cogs",
        title: "Production Planning System",
        meta: [
            { icon: "fa-briefcase", text: "Manufacturer" },
            { icon: "fa-clock", text: "6 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context: "Production scheduling was done on spreadsheets, with idle time averaging 12% per line.",
        role: [
            "Documented production scheduling rules",
            "Wrote user stories for planning and what-if scenarios",
            "Defined constraint rules with plant managers",
            "Coordinated UAT with planners and supervisors"
        ],
        approach: [
            "Discovery: planner interviews, line observation",
            "Analysis: constraint and capacity modelling",
            "Documentation: rules catalogue, user stories",
            "Validation: UAT on 2 production lines"
        ],
        results: [
            { value: "−18%", label: "Idle time" },
            { value: "+11%", label: "Throughput" },
            { value: "2", label: "Lines piloted" }
        ],
        challenges: [
            {
                title: "Constraint complexity",
                text: "Documented constraints as a decision table, reviewed weekly with planners."
            }
        ]
    }),

    coldChain: P({
        icon: "fa-thermometer-half",
        title: "Cold Chain Monitoring",
        meta: [
            { icon: "fa-briefcase", text: "Pharma Logistics" },
            { icon: "fa-clock", text: "5 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context: "A pharma logistics client needed real-time temperature monitoring to prevent spoilage.",
        role: [
            "Documented monitoring and alerting requirements",
            "Wrote user stories for sensors, dashboards, and alerts",
            "Defined escalation and compliance rules",
            "Coordinated UAT with logistics and QA teams"
        ],
        approach: [
            "Discovery: warehouse visits and QA interviews",
            "Analysis: alert thresholds and compliance needs",
            "Documentation: user stories, escalation matrix",
            "Validation: UAT in live shipments"
        ],
        results: [
            { value: "−72%", label: "Spoilage incidents" },
            { value: "100%", label: "Shipment traceability" },
            { value: "−40%", label: "Manual checks" }
        ],
        challenges: [{ title: "Alert fatigue", text: "Tiered thresholds — only critical alerts page on-call staff." }]
    }),

    rpa: P({
        icon: "fa-robot",
        title: "Robotic Process Automation",
        meta: [
            { icon: "fa-briefcase", text: "Shared Services" },
            { icon: "fa-clock", text: "7 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context: "Back-office teams spent thousands of hours on repetitive data entry across 15+ tasks.",
        role: [
            "Identified automation candidates with team leads",
            "Documented process steps and exception rules",
            "Wrote user stories for 15 bots",
            "Coordinated UAT and hypercare"
        ],
        approach: [
            "Discovery: process mining and time studies",
            "Analysis: automation ROI per process",
            "Documentation: process specs, user stories",
            "Validation: UAT with the operations team"
        ],
        results: [
            { value: "15+", label: "Processes automated" },
            { value: "−65%", label: "Manual effort" },
            { value: "4.2", label: "FTE capacity freed" }
        ],
        challenges: [
            { title: "Exception handling", text: "Defined exception playbooks for each bot, reviewed weekly with ops." }
        ]
    }),

    /* ---------- MANUFACTURING & IOT ---------- */
    assetTracking: P({
        icon: "fa-qrcode",
        title: "Asset Tracking RFID",
        meta: [
            { icon: "fa-briefcase", text: "Warehouse Operator" },
            { icon: "fa-clock", text: "4 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context: "A warehouse operator lost 3–5% of assets annually due to manual tracking.",
        role: [
            "Documented asset lifecycle and tracking requirements",
            "Wrote user stories for RFID read/write and dashboards",
            "Defined exception workflows",
            "Coordinated UAT across 3 warehouses"
        ],
        approach: [
            "Discovery: warehouse walkthroughs",
            "Analysis: asset taxonomy and tagging rules",
            "Documentation: user stories, tag plan",
            "Validation: UAT in 3 warehouses"
        ],
        results: [
            { value: "99%", label: "Asset visibility" },
            { value: "−90%", label: "Asset loss" },
            { value: "3", label: "Warehouses live" }
        ],
        challenges: [{ title: "Tag placement", text: "Ran tag placement trials to eliminate read gaps." }]
    }),

    flightBooking: P({
        icon: "fa-plane",
        title: "Flight Booking Engine",
        meta: [
            { icon: "fa-briefcase", text: "Travel Client" },
            { icon: "fa-clock", text: "6 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context: "A travel agency wanted a modern booking engine with multi-airline search and fare comparison.",
        role: [
            "Documented search, fare, and booking requirements",
            "Wrote user stories for GDS integration",
            "Defined fare rule handling with airline partners",
            "Coordinated UAT with agents and travelers"
        ],
        approach: [
            "Discovery: agent interviews, competitor analysis",
            "Analysis: fare rule complexity",
            "Documentation: user stories, fare rules catalogue",
            "Validation: UAT with 10 agents"
        ],
        results: [
            { value: "+28%", label: "Bookings" },
            { value: "−45%", label: "Search time" },
            { value: "5", label: "Airlines integrated" }
        ],
        challenges: [{ title: "Fare rule variety", text: "Built a rules catalogue and automated 80% of common cases." }]
    }),

    hotelMgmt: P({
        icon: "fa-hotel",
        title: "Hotel Management System",
        meta: [
            { icon: "fa-briefcase", text: "Hotel Group" },
            { icon: "fa-clock", text: "6 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context: "A hotel group ran booking, check-in, and housekeeping on disconnected tools.",
        role: [
            "Documented end-to-end guest journey",
            "Wrote user stories for booking, check-in, and housekeeping",
            "Defined integration with OTAs",
            "Coordinated UAT across 4 properties"
        ],
        approach: [
            "Discovery: front-desk and housekeeping shadowing",
            "Analysis: guest journey mapping",
            "Documentation: user stories, integration specs",
            "Validation: UAT with 4 properties"
        ],
        results: [
            { value: "−35%", label: "Check-in time" },
            { value: "+19%", label: "Upsell rate" },
            { value: "4", label: "Properties live" }
        ],
        challenges: [{ title: "OTA sync", text: "Ran a 2-week shadow period with OTAs before switching over." }]
    }),

    travelPlanner: P({
        icon: "fa-umbrella-beach",
        title: "Travel Itinerary Planner",
        meta: [
            { icon: "fa-briefcase", text: "Travel Client" },
            { icon: "fa-clock", text: "5 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context: "A travel startup wanted AI-based itinerary recommendations and a simple booking flow.",
        role: [
            "Documented personalisation and booking requirements",
            "Wrote user stories for recommendations, itinerary, and payments",
            "Defined data sources for recommendations",
            "Coordinated UAT with 30 beta travelers"
        ],
        approach: [
            "Discovery: traveler interviews and surveys",
            "Analysis: recommendation logic design",
            "Documentation: user stories, data mapping",
            "Validation: UAT with beta group"
        ],
        results: [
            { value: "+38%", label: "Booking conversion" },
            { value: "4.5/5", label: "Beta rating" },
            { value: "30", label: "Beta travelers" }
        ],
        challenges: [
            { title: "Cold start", text: 'Used a curated "top picks" fallback until enough behavior data accrued.' }
        ]
    }),

    carRental: P({
        icon: "fa-car",
        title: "Car Rental Platform",
        meta: [
            { icon: "fa-briefcase", text: "Rental Company" },
            { icon: "fa-clock", text: "5 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context: "A car rental company needed fleet management and dynamic pricing.",
        role: [
            "Documented fleet and pricing requirements",
            "Wrote user stories for booking, pricing, and returns",
            "Defined pricing rules with revenue team",
            "Coordinated UAT across 5 locations"
        ],
        approach: [
            "Discovery: branch visits and interviews",
            "Analysis: pricing rule modelling",
            "Documentation: user stories, pricing catalogue",
            "Validation: UAT at 5 branches"
        ],
        results: [
            { value: "+16%", label: "Fleet utilisation" },
            { value: "−22%", label: "Idle vehicles" },
            { value: "5", label: "Branches live" }
        ],
        challenges: [{ title: "Pricing edge cases", text: "Built a decision table reviewed weekly with revenue." }]
    }),

    railwayReservation: P({
        icon: "fa-train",
        title: "Railway Reservation Upgrade",
        meta: [
            { icon: "fa-briefcase", text: "Transport Authority" },
            { icon: "fa-clock", text: "8 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Hybrid" }
        ],
        context: "A rail operator’s reservation system was outdated, causing seat allocation errors and slow booking.",
        role: [
            "Documented seat allocation and pricing rules",
            "Wrote user stories for booking, cancellation, and waitlist",
            "Defined concurrency handling with dev team",
            "Coordinated UAT with station staff and control office"
        ],
        approach: [
            "Discovery: control office observation",
            "Analysis: allocation algorithm review",
            "Documentation: business rules, user stories",
            "Validation: UAT at 3 stations"
        ],
        results: [
            { value: "−40%", label: "Booking time" },
            { value: "−68%", label: "Allocation errors" },
            { value: "+15%", label: "Online bookings" }
        ],
        challenges: [{ title: "Concurrency", text: "Ran load tests simulating peak booking windows." }]
    }),

    /* ---------- TRAVEL & HOSPITALITY ---------- */
    ottStreaming: P({
        icon: "fa-film",
        title: "OTT Streaming Platform",
        meta: [
            { icon: "fa-briefcase", text: "Media Client" },
            { icon: "fa-clock", text: "7 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context: "A media client needed an OTT platform with content delivery, subscriptions, and recommendations.",
        role: [
            "Documented content, subscription, and recommendation requirements",
            "Wrote user stories across web, mobile, and TV apps",
            "Defined DRM and geo-restriction rules",
            "Coordinated UAT across devices"
        ],
        approach: [
            "Discovery: content and product workshops",
            "Analysis: subscriber journey mapping",
            "Documentation: user stories, DRM checklist",
            "Validation: UAT on 6 device types"
        ],
        results: [
            { value: "100k+", label: "Subscribers year 1" },
            { value: "+42%", label: "Watch time" },
            { value: "6", label: "Device types" }
        ],
        challenges: [
            { title: "Device fragmentation", text: "Prioritised top 3 devices for launch; added others in phases." }
        ]
    }),

    musicStreaming: P({
        icon: "fa-music",
        title: "Music Streaming App",
        meta: [
            { icon: "fa-briefcase", text: "Media Startup" },
            { icon: "fa-clock", text: "5 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context: "A music startup wanted playlists, offline mode, and artist analytics.",
        role: [
            "Documented feature and analytics requirements",
            "Wrote user stories for playlists, offline, and artist dashboards",
            "Defined licensing constraints with legal",
            "Coordinated UAT with 50 beta users"
        ],
        approach: [
            "Discovery: listener and artist interviews",
            "Analysis: licensing and rights rules",
            "Documentation: user stories, licensing matrix",
            "Validation: beta UAT"
        ],
        results: [
            { value: "50k+", label: "Beta streams" },
            { value: "4.4/5", label: "Beta rating" },
            { value: "50", label: "Beta users" }
        ],
        challenges: [{ title: "Offline DRM", text: "Defined offline license windows with legal and content partners." }]
    }),

    gamingTournament: P({
        icon: "fa-gamepad",
        title: "Gaming Tournament Platform",
        meta: [
            { icon: "fa-briefcase", text: "Gaming Client" },
            { icon: "fa-clock", text: "5 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context: "A gaming client needed a tournament platform with brackets, streaming, and rewards.",
        role: [
            "Documented tournament and reward requirements",
            "Wrote user stories for brackets, streaming, and rewards",
            "Defined anti-cheat and fair-play rules",
            "Coordinated UAT with 30 beta players"
        ],
        approach: [
            "Discovery: player and organizer interviews",
            "Analysis: bracket logic and edge cases",
            "Documentation: user stories, rules catalogue",
            "Validation: beta tournaments"
        ],
        results: [
            { value: "30", label: "Beta players" },
            { value: "12", label: "Beta tournaments" },
            { value: "−60%", label: "Manual admin time" }
        ],
        challenges: [{ title: "Bracket edge cases", text: "Documented 20+ bracket scenarios as test cases with QA." }]
    }),

    newsPortal: P({
        icon: "fa-newspaper",
        title: "Digital News Portal",
        meta: [
            { icon: "fa-briefcase", text: "Media House" },
            { icon: "fa-clock", text: "4 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context: "A media house needed a CMS supporting multi-author publishing and SEO.",
        role: [
            "Documented CMS and SEO requirements",
            "Wrote user stories for authoring, publishing, and analytics",
            "Defined workflow and approval rules",
            "Coordinated UAT with editors and writers"
        ],
        approach: [
            "Discovery: newsroom interviews",
            "Analysis: SEO and workflow requirements",
            "Documentation: user stories, SEO checklist",
            "Validation: UAT with editors"
        ],
        results: [
            { value: "+65%", label: "Organic traffic" },
            { value: "−40%", label: "Publishing time" },
            { value: "20+", label: "Authors onboarded" }
        ],
        challenges: [
            { title: "Editorial workflow", text: "Modelled 3 approval levels; simplified after UAT feedback." }
        ]
    }),

    podcastApp: P({
        icon: "fa-podcast",
        title: "Podcast Hosting App",
        meta: [
            { icon: "fa-briefcase", text: "Media Startup" },
            { icon: "fa-clock", text: "4 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context: "A podcast startup needed recording, editing, and distribution features.",
        role: [
            "Documented recording, editing, and distribution requirements",
            "Wrote user stories for host and listener apps",
            "Defined RSS and platform distribution rules",
            "Coordinated UAT with 20 creators"
        ],
        approach: [
            "Discovery: creator and listener interviews",
            "Analysis: distribution and RSS rules",
            "Documentation: user stories, distribution matrix",
            "Validation: beta UAT"
        ],
        results: [
            { value: "20", label: "Beta creators" },
            { value: "+55%", label: "Publishing speed" },
            { value: "6", label: "Platforms" }
        ],
        challenges: [
            { title: "Distribution variety", text: "Built a distribution matrix and automated the top 6 platforms." }
        ]
    }),

    propertyListing: P({
        icon: "fa-home",
        title: "Property Listing Portal",
        meta: [
            { icon: "fa-briefcase", text: "Real Estate Client" },
            { icon: "fa-clock", text: "5 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context: "A real estate client needed search, virtual tours, and an agent CRM.",
        role: [
            "Documented search and CRM requirements",
            "Wrote user stories for listings, tours, and CRM",
            "Defined search ranking rules",
            "Coordinated UAT with agents and buyers"
        ],
        approach: [
            "Discovery: agent and buyer interviews",
            "Analysis: search ranking design",
            "Documentation: user stories, ranking rules",
            "Validation: UAT with agents and buyers"
        ],
        results: [
            { value: "+48%", label: "Qualified leads" },
            { value: "−35%", label: "Time to list" },
            { value: "50+", label: "Agents onboarded" }
        ],
        challenges: [
            {
                title: "Search relevance",
                text: "Ran a ranking workshop with agents to define a simple, defensible ranking."
            }
        ]
    }),

    /* ---------- MEDIA & REAL ESTATE ---------- */
    constructionTracker: P({
        icon: "fa-hard-hat",
        title: "Construction Project Tracker",
        meta: [
            { icon: "fa-briefcase", text: "Construction Firm" },
            { icon: "fa-clock", text: "6 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Hybrid" }
        ],
        context: "A construction firm tracked milestones on spreadsheets across 12 active sites.",
        role: [
            "Documented milestone, budget, and reporting requirements",
            "Wrote user stories for site, PM, and exec views",
            "Defined escalation and reporting rules",
            "Coordinated UAT with site engineers and PMs"
        ],
        approach: [
            "Discovery: site visits and PM interviews",
            "Analysis: reporting and escalation design",
            "Documentation: user stories, RACI matrix",
            "Validation: UAT on 3 live sites"
        ],
        results: [
            { value: "12", label: "Sites onboarded" },
            { value: "−28%", label: "Schedule slips" },
            { value: "−35%", label: "Reporting effort" }
        ],
        challenges: [{ title: "Site connectivity", text: "Built an offline-first capture mode for remote sites." }]
    }),

    smartCity: P({
        icon: "fa-city",
        title: "Smart City Dashboard",
        meta: [
            { icon: "fa-briefcase", text: "Municipal Client" },
            { icon: "fa-clock", text: "8 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context: "A city wanted a unified view of traffic, waste, and energy data for planners.",
        role: [
            "Documented KPI and data source requirements",
            "Wrote user stories for dashboards across departments",
            "Defined data governance rules",
            "Coordinated UAT with city planners"
        ],
        approach: [
            "Discovery: department workshops",
            "Analysis: KPI and data source mapping",
            "Documentation: KPI dictionary, user stories",
            "Validation: UAT with planners"
        ],
        results: [
            { value: "3", label: "Departments unified" },
            { value: "20+", label: "KPIs live" },
            { value: "−45%", label: "Report prep time" }
        ],
        challenges: [
            { title: "Data silos", text: "Ran a data governance workshop to align definitions across departments." }
        ]
    }),

    leaseMgmt: P({
        icon: "fa-file-signature",
        title: "Lease Management System",
        meta: [
            { icon: "fa-briefcase", text: "Property Manager" },
            { icon: "fa-clock", text: "5 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context: "A property manager handled lease renewals and payments on spreadsheets, causing missed renewals.",
        role: [
            "Documented lease lifecycle and payment requirements",
            "Wrote user stories for renewals, payments, and maintenance",
            "Defined notification rules",
            "Coordinated UAT with property managers"
        ],
        approach: [
            "Discovery: property manager interviews",
            "Analysis: lease lifecycle mapping",
            "Documentation: user stories, notification rules",
            "Validation: UAT with live leases"
        ],
        results: [
            { value: "−92%", label: "Missed renewals" },
            { value: "+18%", label: "On-time payments" },
            { value: "500+", label: "Leases managed" }
        ],
        challenges: [
            {
                title: "Notification timing",
                text: "Tested 3 cadences with managers before settling on the final rules."
            }
        ]
    }),

    facilityMaintenance: P({
        icon: "fa-tools",
        title: "Facility Maintenance App",
        meta: [
            { icon: "fa-briefcase", text: "Facilities Client" },
            { icon: "fa-clock", text: "4 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context: "Facility teams handled work orders on paper, causing delays and lost history.",
        role: [
            "Documented work order and preventive maintenance requirements",
            "Wrote user stories for requestors, technicians, and managers",
            "Defined SLA and escalation rules",
            "Coordinated UAT with technicians and admin"
        ],
        approach: [
            "Discovery: technician shadowing",
            "Analysis: SLA and escalation design",
            "Documentation: user stories, SLA matrix",
            "Validation: UAT in live facilities"
        ],
        results: [
            { value: "−48%", label: "Work order time" },
            { value: "+22%", label: "PM compliance" },
            { value: "100%", label: "History captured" }
        ],
        challenges: [
            {
                title: "Technician adoption",
                text: "Designed for one-handed mobile use; adoption hit 90% within a month."
            }
        ]
    }),

    solarFarm: P({
        icon: "fa-solar-panel",
        title: "Solar Farm Monitoring",
        meta: [
            { icon: "fa-briefcase", text: "Energy Client" },
            { icon: "fa-clock", text: "6 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context: "A solar operator managed 10+ farms with manual performance checks.",
        role: [
            "Documented monitoring and alerting requirements",
            "Wrote user stories for farm dashboards and alerts",
            "Defined alert thresholds with ops engineers",
            "Coordinated UAT with the ops team"
        ],
        approach: [
            "Discovery: farm visits and ops interviews",
            "Analysis: alert design and escalation",
            "Documentation: user stories, threshold plan",
            "Validation: UAT with live farm data"
        ],
        results: [
            { value: "10+", label: "Farms monitored" },
            { value: "+14%", label: "Energy yield" },
            { value: "−55%", label: "Manual checks" }
        ],
        challenges: [
            { title: "Alert fatigue", text: "Tiered thresholds so only actionable alerts reach on-call staff." }
        ]
    }),

    smartGrid: P({
        icon: "fa-bolt",
        title: "Smart Grid Analytics",
        meta: [
            { icon: "fa-briefcase", text: "Utility" },
            { icon: "fa-clock", text: "7 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Hybrid" }
        ],
        context: "A utility needed demand forecasting and outage detection to reduce downtime.",
        role: [
            "Documented forecasting and outage requirements",
            "Wrote user stories for demand and outage dashboards",
            "Defined data inputs and refresh cadence",
            "Coordinated UAT with grid operations"
        ],
        approach: [
            "Discovery: grid ops interviews",
            "Analysis: outage and demand data mapping",
            "Documentation: user stories, data dictionary",
            "Validation: UAT with live data"
        ],
        results: [
            { value: "−24%", label: "Outage duration" },
            { value: "+12%", label: "Forecast accuracy" },
            { value: "−35%", label: "Manual analysis" }
        ],
        challenges: [
            { title: "Data latency", text: "Defined tiered refresh rates: real-time for outages, hourly for demand." }
        ]
    }),

    /* ---------- REAL ESTATE / UTILITIES ---------- */
    waterBilling: P({
        icon: "fa-water",
        title: "Water Utility Billing",
        meta: [
            { icon: "fa-briefcase", text: "Utility" },
            { icon: "fa-clock", text: "5 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context: "A water utility read meters manually, causing billing delays and disputes.",
        role: [
            "Documented metering and billing requirements",
            "Wrote user stories for AMR and customer portal",
            "Defined billing rules with finance",
            "Coordinated UAT with billing and field teams"
        ],
        approach: [
            "Discovery: field and billing interviews",
            "Analysis: billing rule catalogue",
            "Documentation: user stories, billing rules",
            "Validation: UAT with live accounts"
        ],
        results: [
            { value: "−80%", label: "Manual reads" },
            { value: "−30%", label: "Billing disputes" },
            { value: "+25%", label: "On-time payments" }
        ],
        challenges: [
            {
                title: "Meter compatibility",
                text: "Phased rollout starting with compatible meters; defined manual fallback for others."
            }
        ]
    }),

    windTurbine: P({
        icon: "fa-wind",
        title: "Wind Turbine Monitoring",
        meta: [
            { icon: "fa-briefcase", text: "Energy Client" },
            { icon: "fa-clock", text: "5 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context: "A wind operator relied on manual inspections, missing early signs of failure.",
        role: [
            "Documented monitoring and alerting requirements",
            "Wrote user stories for turbine dashboards and alerts",
            "Defined failure thresholds with engineers",
            "Coordinated UAT with maintenance teams"
        ],
        approach: [
            "Discovery: engineer interviews and site visits",
            "Analysis: failure mode and threshold design",
            "Documentation: user stories, threshold plan",
            "Validation: UAT with live turbine data"
        ],
        results: [
            { value: "−40%", label: "Unplanned outages" },
            { value: "+15%", label: "Availability" },
            { value: "−25%", label: "Inspection cost" }
        ],
        challenges: [{ title: "False alerts", text: "Tuned thresholds iteratively with engineers to reduce noise." }]
    }),

    wasteMgmt: P({
        icon: "fa-recycle",
        title: "Waste Management System",
        meta: [
            { icon: "fa-briefcase", text: "Municipal Client" },
            { icon: "fa-clock", text: "5 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context: "A municipality wanted route optimization and recycling tracking.",
        role: [
            "Documented route and recycling requirements",
            "Wrote user stories for route planning and tracking",
            "Defined recycling KPIs with sustainability team",
            "Coordinated UAT with collection crews"
        ],
        approach: [
            "Discovery: route ride-alongs",
            "Analysis: route optimisation opportunities",
            "Documentation: user stories, KPI definitions",
            "Validation: UAT on 2 routes"
        ],
        results: [
            { value: "−22%", label: "Fuel use" },
            { value: "+30%", label: "Recycling capture" },
            { value: "2", label: "Routes piloted" }
        ],
        challenges: [
            { title: "Crew adoption", text: "Designed a simple mobile view tested in the cab before rollout." }
        ]
    }),

    network5g: P({
        icon: "fa-signal",
        title: "5G Network Rollout",
        meta: [
            { icon: "fa-briefcase", text: "Telecom" },
            { icon: "fa-clock", text: "9 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Hybrid" }
        ],
        context: "A telecom operator needed a system for site planning and performance monitoring.",
        role: [
            "Documented site planning and monitoring requirements",
            "Wrote user stories for planning and performance dashboards",
            "Defined KPIs with RF engineers",
            "Coordinated UAT with regional teams"
        ],
        approach: [
            "Discovery: RF engineer interviews",
            "Analysis: KPI and data source mapping",
            "Documentation: user stories, KPI dictionary",
            "Validation: UAT with regional data"
        ],
        results: [
            { value: "500+", label: "Sites planned" },
            { value: "+18%", label: "Rollout speed" },
            { value: "−30%", label: "Manual reporting" }
        ],
        challenges: [
            { title: "Regional variation", text: "Built regional dashboards with local KPIs reviewed quarterly." }
        ]
    }),

    wifiHotspot: P({
        icon: "fa-wifi",
        title: "Wi-Fi Hotspot Manager",
        meta: [
            { icon: "fa-briefcase", text: "Hospitality Client" },
            { icon: "fa-clock", text: "4 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context: "A hospitality client needed authentication, bandwidth control, and analytics for guest Wi-Fi.",
        role: [
            "Documented authentication and bandwidth requirements",
            "Wrote user stories for guest login and admin console",
            "Defined policy and reporting rules",
            "Coordinated UAT with IT and ops"
        ],
        approach: [
            "Discovery: IT and ops interviews",
            "Analysis: bandwidth policy design",
            "Documentation: user stories, policy matrix",
            "Validation: UAT in live venues"
        ],
        results: [
            { value: "−60%", label: "Guest complaints" },
            { value: "+38%", label: "Login success" },
            { value: "−25%", label: "Bandwidth cost" }
        ],
        challenges: [{ title: "Peak congestion", text: "Defined fair-use policies per venue tier." }]
    }),

    voipCall: P({
        icon: "fa-phone",
        title: "VoIP Call Center",
        meta: [
            { icon: "fa-briefcase", text: "BPO Client" },
            { icon: "fa-clock", text: "5 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context: "A BPO client needed a VoIP call center with IVR, routing, and CRM integration.",
        role: [
            "Documented IVR and routing requirements",
            "Wrote user stories for agent and supervisor views",
            "Defined CRM integration rules",
            "Coordinated UAT with agents and supervisors"
        ],
        approach: [
            "Discovery: agent and supervisor interviews",
            "Analysis: routing and IVR design",
            "Documentation: user stories, IVR flow",
            "Validation: UAT with live calls"
        ],
        results: [
            { value: "−30%", label: "Avg handle time" },
            { value: "+22%", label: "First call resolution" },
            { value: "−18%", label: "Call cost" }
        ],
        challenges: [{ title: "IVR complexity", text: "Tested IVR flows with real customers before go-live." }]
    }),

    satelliteComm: P({
        icon: "fa-satellite",
        title: "Satellite Communication System",
        meta: [
            { icon: "fa-briefcase", text: "Aerospace Client" },
            { icon: "fa-clock", text: "10 months" },
            { icon: "fa-user-tie", text: "Senior BA" },
            { icon: "fa-layer-group", text: "Hybrid" }
        ],
        context: "An aerospace client needed ground station and bandwidth allocation software.",
        role: [
            "Documented ground station and allocation requirements",
            "Wrote user stories for operators and admins",
            "Defined allocation and SLA rules",
            "Coordinated UAT with operations and engineering"
        ],
        approach: [
            "Discovery: operator interviews",
            "Analysis: allocation modelling",
            "Documentation: user stories, allocation rules",
            "Validation: UAT with live ops"
        ],
        results: [
            { value: "−35%", label: "Allocation time" },
            { value: "+20%", label: "Bandwidth utilisation" },
            { value: "0", label: "Critical incidents" }
        ],
        challenges: [
            { title: "High-stakes reliability", text: "Embedded redundancy and failover into every user story." }
        ]
    }),

    nocDashboard: P({
        icon: "fa-network-wired",
        title: "Network Operations Center",
        meta: [
            { icon: "fa-briefcase", text: "IT Services" },
            { icon: "fa-clock", text: "5 months" },
            { icon: "fa-user-tie", text: "Business Analyst" },
            { icon: "fa-layer-group", text: "Agile" }
        ],
        context: "An NOC monitored 500+ devices across multiple tools with no unified view.",
        role: [
            "Documented monitoring and alerting requirements",
            "Wrote user stories for real-time dashboards",
            "Defined alert severity and escalation rules",
            "Coordinated UAT with NOC engineers"
        ],
        approach: [
            "Discovery: NOC shadowing",
            "Analysis: alert and escalation design",
            "Documentation: user stories, alert matrix",
            "Validation: UAT with live monitoring"
        ],
        results: [
            { value: "500+", label: "Devices unified" },
            { value: "−42%", label: "MTTR" },
            { value: "−30%", label: "Alert noise" }
        ],
        challenges: [
            { title: "Alert noise", text: "Correlated related alerts and added suppression windows for maintenance." }
        ]
    })
};

/* ============================================================
   PROJECT MODAL – event delegation (works for all cards)
   ============================================================ */
const modal = document.getElementById("projectModal");
const modalClose = document.getElementById("modalClose");
let lastFocused = null;

function renderModal(data) {
    document.getElementById("modalIcon").innerHTML = `<i class="fas ${data.icon}"></i>`;
    document.getElementById("modalEyebrow").textContent = data.eyebrow || "Case Study";
    document.getElementById("modalTitle").textContent = data.title;

    // Meta chips
    const metaEl = document.getElementById("modalMeta");
    metaEl.innerHTML = (data.meta || []).map((m) => `<span><i class="fas ${m.icon}"></i> ${m.text}</span>`).join("");

    // Context
    document.getElementById("modalContext").textContent = data.context;

    // Role list
    document.getElementById("modalRole").innerHTML = (data.role || []).map((r) => `<li>${r}</li>`).join("");

    // Approach list
    document.getElementById("modalApproach").innerHTML = (data.approach || []).map((a) => `<li>${a}</li>`).join("");

    // Artifacts grid
    document.getElementById("modalArtifacts").innerHTML = (data.artifacts || [])
        .map((a) => `<div class="artifact-item"><i class="fas ${a.icon}"></i> ${a.label}</div>`)
        .join("");

    // Challenges
    document.getElementById("modalChallenges").innerHTML = (data.challenges || [])
        .map((c) => `<div class="challenge-item"><strong>${c.title}</strong><p>${c.text}</p></div>`)
        .join("");

    // Results
    document.getElementById("modalResults").innerHTML = (data.results || [])
        .map(
            (r) =>
                `<div class="result-item"><div class="result-value">${r.value}</div><div class="result-label">${r.label}</div></div>`
        )
        .join("");

    // Tools
    document.getElementById("modalTools").innerHTML = (data.tools || [])
        .map((t) => `<span class="tool-tag">${t}</span>`)
        .join("");
}

function openModal(key) {
    const data = PROJECTS[key];
    if (!data) {
        console.warn("No project data found for:", key);
        return;
    }
    renderModal(data);
    lastFocused = document.activeElement;
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    // Focus the close button for accessibility
    setTimeout(() => modalClose.focus(), 50);
}

function closeModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (lastFocused) lastFocused.focus();
}

/* Event delegation – one listener handles ALL clickable cards */
document.addEventListener("click", (e) => {
    const card = e.target.closest(".project-card.clickable");
    if (card) {
        const key = card.dataset.project;
        if (key) openModal(key);
    }
});

/* Keyboard support (Enter / Space on a focused card) */
document.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("clickable")) {
        e.preventDefault();
        const key = e.target.dataset.project;
        if (key) openModal(key);
    }
});

/* Close triggers */
modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) closeModal();
});