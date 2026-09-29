window.SITE_CONTENT = {
  site: {
    name: "Oracle AI & Data Solutions",
    owner: "SoftServe",
    title: "Oracle AI & Data Solutions — SoftServe",
    metaDescription: "AI agents that read your contracts, plan your field workforce and answer questions across your ERP. Built on Oracle by SoftServe, measured on your data first.",
    headerLockup: {
      wordmark: window.brandAsset("ssMark", "assets/img/softserve-wordmark-white.svg"),
      wordmarkAlt: "SoftServe",
      divider: window.brandAsset("headerDivider", "assets/img/header-divider-white.svg"),
      productName: "Oracle AI & Data Solutions"
    },
    /* Round 18 (Alex): the Services page is gone; "Services" lands on the home
       page's Packaged services screen, and the header's ask on its contact. */
    nav: [
      { label: "Products", route: "#/products" },
      { label: "Services", route: "#/#how-we-deliver" }
    ],
    navCta: { label: "Talk to us", route: "#/#request-a-demo" },
    primaryCta: { label: "Talk to us", route: "#/#request-a-demo" },
    footer: {
      sellersLink: { label: "For sellers", route: "#/sellers" },
      legalLinks: [
        { label: "Privacy Notice", url: "https://www.softserveinc.com/en-us/privacy" },
        { label: "Terms and Conditions", url: "https://www.softserveinc.com/en-us/terms-and-conditions" }
      ],
      siteLink: { label: "SoftServe website", url: "https://www.softserveinc.com/en-us" },
      /* Round 18 (Alex): links to Oracle's own pages, a second row set like the
         first. The three platforms the practice builds on, in the site's
         canonical order and under their full Oracle names, then Oracle's home
         page, named as the first row names SoftServe's. Checked 2026-09-29:
         each URL is the page Oracle itself calls canonical. */
      oracleLabel: "Oracle",
      oracleLinks: [
        { label: "Oracle Autonomous AI Lakehouse", url: "https://www.oracle.com/autonomous-database/autonomous-ai-lakehouse/" },
        { label: "Oracle AI Data Platform", url: "https://www.oracle.com/ai-data-platform/" },
        { label: "Oracle Cloud Infrastructure", url: "https://www.oracle.com/cloud/" },
        { label: "Oracle website", url: "https://www.oracle.com/" }
      ],
      socialLabel: "SoftServe on social media",
      social: [
        { label: "LinkedIn", url: "https://www.linkedin.com/company/softserve/" },
        { label: "YouTube", url: "https://www.youtube.com/user/SoftServeInc" },
        { label: "Facebook", url: "https://www.facebook.com/SoftServeCompany" },
        { label: "Instagram", url: "https://www.instagram.com/softserve_people/" },
        { label: "TikTok", url: "https://www.tiktok.com/@softserve_people" },
        { label: "X", url: "https://x.com/SoftServeInc" },
        { label: "SoundCloud", url: "https://soundcloud.com/softserve-podcasts" },
        { label: "Bluesky", url: "https://bsky.app/profile/softserveinc.com" }
      ],
      copyright: "© Copyright {year} SoftServe Inc."
    }
  },

  media: {
    "account-insights": {
      diagram: "account-insights",
      alt: "Flow diagram: signal feeds and client context enter the Account insights app and NVIDIA AI-Q on a dedicated AI cluster on Oracle Cloud Infrastructure, which filter, fan out, reason, score and cite; a reviewer approves before one JSON per account goes to the CRM"
    },
    "case-evidence-collection": {
      diagram: "case-evidence-collection",
      alt: "Flow diagram: source exports enter evidence assembly and NVIDIA AI-Q multi-document reasoning on a dedicated AI cluster on Oracle Cloud Infrastructure, and the assembled case reaches an investigator UI with amend, approve and a full audit log"
    },
    "plan-vs-actual-investigation": {
      diagram: "plan-vs-actual-investigation",
      alt: "Flow diagram: approved exports enter a conformed data model and hybrid retrieval on Oracle Cloud Infrastructure, and the review app presents variances, drivers and citations, with unresolved records reported as coverage gaps"
    },
    "large-document-extraction": {
      diagram: "large-document-extraction",
      alt: "Flow diagram: contracts from the repository enter the extraction pipeline and NVIDIA AI-Q vision-language models on a dedicated AI cluster on Oracle Cloud Infrastructure, and a reviewer validates in a split view before approved rows export to the cost or ERP system"
    },
    "workforce-optimization": {
      diagram: "workforce-optimization",
      alt: "Flow diagram: Oracle Field Service data enters the workforce app and the NVIDIA cuOpt solver on a dedicated AI cluster on Oracle Cloud Infrastructure, a dispatcher approves the plan, and the approved plan is written back to Oracle Field Service"
    },
    "cross-system-erp-qa": {
      diagram: "cross-system-erp-qa",
      alt: "Diagram: Oracle applications and one or two other sources connect into Oracle Autonomous AI Lakehouse — governed data model, masking and row rules, SQL firewall, Select AI — which answers in plain language over certified views and dashboards"
    },
    "business-metrics-qa": {
      diagram: "business-metrics-qa",
      alt: "Diagram: existing catalogs, linked databases and existing platforms stay where they are and connect into Oracle Autonomous AI Lakehouse as the governed gold layer, which answers across every source with no data movement"
    },

    "repair-or-replace-decisions": {
      diagram: "repair-or-replace-decisions",
      alt: "Flow diagram: media from the capture channel and the asset record enter the Repair-or-replace decisions app and the NVIDIA AI Enterprise vision and reasoning engine on Oracle Cloud Infrastructure; a reviewer confirms or overrules each call before it reaches the booking, dispatch or claims system"
    }

  },

  disclaimers: {
    kpiTile: "KPIs measured before/after on proof-of-value data; figures are illustrative, not contractual.",
    kpiTileTargets: "Targets from the proof of value; figures are illustrative, not contractual.",
    lakehousePricing: "Price indicative, confirmed in scoping; Oracle partner funding programs may reduce the net cost.",
    accountInsightsEvaluation: "The engine is a non-deterministic reasoning system, so a dedicated evaluation plan (correctness and confidence calibration) is part of the work.",
    publicPricingFootnote: "Figures are illustrative and confirmed in scoping.",
    modeledResults: "Figures are forecast from simulations against a historical baseline, not measured in production.",
  },

  shared: {
    preFlightGate: {
      title: "Before the clock starts",
      body: "Sponsor named, two to three success metrics signed, source access approved in writing. The gate is what protects the fixed price."
    },
    engageLink: { label: "How we deliver, from proof of value to scale →", route: "#/#how-we-deliver" },
    productTabs: [
      { id: "overview", label: "Overview" },
      { id: "use-cases", label: "Use cases" },
      { id: "technology", label: "Technology" },
      { id: "delivery", label: "Delivery", legacyIds: ["jumpstart", "pov"] },
      { id: "contacts", label: "Contacts", legacyIds: ["demo", "sellers"] }
    ],
    /* Round 22 (Alex, 2026-09-29): the Technology tab's widget names the
       Oracle products in play, "same names and icons … across all products,
       as this should feel like a widget". One registry, so a system is
       spelled and drawn one way everywhere; a product lists the ids it uses
       and gives each its own two-to-four-word role (`technology.oracle`).
       Platforms first, then the Oracle applications a product reads from or
       writes to. */
    oracleProducts: {
      title: "Oracle products",
      groups: { platform: "Platform", connected: "Sources & destinations" },
      items: {
        "oci": { name: "Oracle Cloud Infrastructure", group: "platform", icon: "platform-oci-nvidia" },
        "ai-data-platform": { name: "Oracle AI Data Platform", group: "platform", icon: "platform-oracle-ai-data-platform" },
        "ai-lakehouse": { name: "Oracle Autonomous AI Lakehouse", group: "platform", icon: "platform-oracle-ai-lakehouse" },
        "ai-database": { name: "Oracle Autonomous AI Database", group: "platform", icon: "oracle-database" },
        "fusion-field-service": { name: "Oracle Fusion Field Service", group: "connected", icon: "oracle-field-service" },
        "cx": { name: "Oracle Customer Experience (CX)", group: "connected", icon: "oracle-cx" },
        "fusion-apps": { name: "Oracle Fusion Applications", group: "connected", icon: "platform-oracle-ai-fusion" }
      }
    },
    /* Round 22 (Alex, 2026-09-29): the Delivery tab is the pack one-pager's
       service-packages table with no price rows. The tiers and their standing
       durations are the site's, the same on every product (4–8 weeks is the
       proof of value's one duration, round 7); the scope lines and the rows
       are each product's `delivery`. */
    delivery: {
      caption: "Service packages",
      tiers: [
        { id: "pov", name: "Jumpstart proof of value", size: "S", duration: "4–8 weeks" },
        { id: "integration", name: "Integration", size: "M", duration: "3–5 months" },
        { id: "scaling", name: "Scaling", size: "L", duration: "3–12 months" }
      ],
      durationLabel: "Duration",
      marks: { partial: "partial", included: "included", advanced: "advanced", none: "not included" },
      footnote: "Durations are approximate and confirmed at scoping."
    },
    contact: {
      name: "Karsten Tramborg",
      title: "Oracle Partnership Director, SoftServe",
      email: "oracle@softserveinc.com",
      photo: "assets/img/people/karsten-tramborg.jpg",
      blurb: "Your first call for a fit check, a workshop with your team or the scope of a proof of value."
    },
    people: {
      "vlad-butenko": {
        name: "Vlad Butenko",
        title: "AI Product Manager, SoftServe",
        photo: "assets/img/people/vlad-butenko.jpg"
      },
      "dmytro-dudchenko": {
        name: "Dmytro Dudchenko",
        title: "AI Product Manager, SoftServe",
        photo: "assets/img/people/dmytro-dudchenko.jpg"
      },
      "oleksii-orlov": {
        name: "Oleksii Orlov",
        title: "Distinguished Product Advisor, SoftServe",
        photo: "assets/img/people/oleksii-orlov.jpg"
      }
    },
    heroAsideTitle: "What you get",
    heroAsideFootLabel: "Proof of value",
    videoCaption: "Watch the demo",
    demoCta: "Interactive demo",
    industryLabels: {
      "manufacturing": "Manufacturing",
      "logistics": "Logistics & supply chain",
      "utilities": "Utilities",
      "telecom": "Telecom & cable",
      "healthcare": "Healthcare",
      "financial-services": "Financial services",
      "insurance": "Insurance",
      "retail": "Retail",
      "energy": "Energy",
      "public-sector": "Public sector",
      "automotive": "Automotive",
      "life-sciences": "Pharma & life sciences",
      "professional-services": "Professional services",
      "construction": "Construction",
      "travel-transport": "Travel & transport",
      "cross-industry": "Every industry"
    },
    tagFamilies: {
      pattern: {
        tooltip: "What it does",
        icons: {
          "knowledge-analytics": "pattern-knowledge-analytics",
          "deep-research": "pattern-deep-research",
          "documents": "pattern-documents",
          "transactions": "pattern-transactions",
          "forecasting-optimization": "pattern-forecasting-optimization",
          "video-image": "pattern-video-image"
        }
      },
      tech: {
        tooltip: "Runs on",
        icons: {
          "oci-nvidia": "platform-oci-nvidia",
          "oracle-ai-data-platform": "platform-oracle-ai-data-platform",
          "oracle-ai-lakehouse": "platform-oracle-ai-lakehouse",
          "oracle-ai-fusion": "platform-oracle-ai-fusion"
        }
      },
      availability: {
        demo: { label: "Interactive demo", tooltip: "Interactive demo — a guided walkthrough you can click through", icon: "cursor-click" },
        marketplace: { label: "Oracle Marketplace", tooltip: "Available on Oracle Marketplace", icon: "storefront" }
      }
    },
    caseStudyStatus: {
      "measured": {
        chip: "Proven",
        tooltip: "Measured during a completed proof of value, on the customer’s own data."
      },
      "modeled": {
        chip: "Forecast",
        tooltip: "Forecast from simulations run on the customer’s own historical data during a completed proof of value."
      },
      "in-preparation": {
        chip: "Estimated",
        tooltip: "Estimated for an engagement now being prepared, against the way the work is done today."
      }
    },
    /* Round 20: the kind chip on each KPI tile of a product's Overview, in the
       case study's own three words. */
    metricKinds: {
      proven: {
        chip: "Proven",
        tooltip: "Measured end to end during a completed proof of value, on the customer's own data."
      },
      forecast: {
        chip: "Forecast",
        tooltip: "Modeled on the customer's own history; not yet measured in production."
      },
      estimated: {
        chip: "Estimated",
        tooltip: "Set against published industry rates or the way the work is done today; the proof of value measures the real change."
      }
    },
    sectionLabels: {
      /* `scope` and its two columns rendered inside More detail, which round
         20 removed; they stay for the Jumpstart tab next round. */
      scope: "Scope",
      scopeIn: "In scope",
      scopeOut: "Out of scope",
      howItWorks: "How it works",
      shotOpen: "Open the screen full size",
      shotPan: "Drag to move around the screen.",
      industryCases: "By industry",
      caseProblem: "The problem",
      caseSolution: "The solution",
      /* Round 20, the Overview: the KPI band's one heading, the two plates'
         eyebrows, the owner line under a tile, the tick of a range chart and
         the words a baseline chart gives a screen reader before its end. */
      outcomes: "What changes in your numbers",
      problemEyebrow: "The problem",
      solutionEyebrow: "The solution",
      metricOwner: "Owner",
      metricToday: "Today",
      metricAfter: "After",
      caseStudy: "Case study",
      contacts: "Contacts"
    }
  },

  overview: {
    hero: {
      eyebrow: "SoftServe × Oracle · Built and delivered together",
      headline: {
        lead: "Enterprise AI agents and workflows.",
        accent: "Built on Oracle.",
        proof: "Proven in weeks."
      },
      lead: "SoftServe’s leading AI practice and fast-track method, combined with the full power of Oracle’s data and cloud platforms, accelerate your time to value.",
      ctas: [
        { label: "Explore the products", route: "#/#products", kind: "primary" },
        { label: "How we deliver", route: "#/#how-we-deliver", kind: "secondary" }
      ],
      stack: {
        ariaLabel: "How it fits together, read from the bottom up: Oracle’s four AI platforms, the SoftServe product groups built on them, and the SoftServe services that prove, integrate and scale them",
        services: {
          label: "SoftServe services",
          items: [
            { name: "Jumpstart proof of value", icon: "spark" },
            { name: "Integration", icon: "network" },
            { name: "Scaling", icon: "scale" },
            { name: "Managed services", icon: "managed" }
          ]
        },
        productsLabel: "SoftServe products",
        platformsLabel: "Oracle platforms"
      },
      stats: [
        { prefix: "from", value: "30 days", label: "to a fixed-price proof of value on your own data" },
        { value: "1,000+", label: "experts in AI, data and R&D across SoftServe" },
        { value: "30", label: "Fortune 500 clients in the data and analytics practice" }
      ]
    },

    twoWays: {
      eyebrow: "What we offer",
      title: "A head start that scales.",
      panels: [
        {
          id: "products",
          icon: "cube",
          title: "Enterprise AI agents and workflows",
          body: "Ready-made AI agents and human-AI workflows that embody the know-how of their industry, so adoption starts from a working product, not a blank page. Each one is built to draw on the full power of Oracle’s AI platforms.",
          bullets: [
            "Best-practice workflows and AI pipelines",
            "Accelerators that shorten time to value",
            "The best of Oracle’s AI platforms, built in"
          ],
          image: {
            file: "assets/img/heroes/overview.jpg",
            alt: "A tall oval of light standing open in a dark wall, its reflection running out across still water",
            focal: "35% 45%"
          },
          cta: { label: "See the products", route: "#/#products", direction: "down" }
        },
        {
          id: "practice",
          icon: "users",
          title: "Expert services, from proof to scale",
          body: "With a large, dedicated practice of experts in both AI and Oracle, and a delivery method honed with Fortune 500 customers, we take your first use case into production in your tenancy, then across the business.",
          bullets: [
            "A proof of value from 30 days, on your own data",
            "Measurable ROI in focus from day one",
            "One team, all the way to your own AI factory"
          ],
          image: {
            file: "assets/img/heroes/services.jpg",
            alt: "An engineer seen from behind at a wall of code on dark monitors in a low-lit workspace",
            focal: "50% 50%"
          },
          cta: { label: "How we deliver", route: "#/#how-we-deliver", direction: "down" }
        }
      ]
    },

    catalog: {
      eyebrow: "Products",
      title: "Ready-to-use solutions to kick off your AI adoption.",
      cta: { label: "See all products", route: "#/products" }
    },

    delivery: {
      eyebrow: "Packaged services",
      title: "Service delivery that accelerates time to value.",
      anchor: "how-we-deliver",
      steps: [
        { title: "Workshop", body: "With your team, we pin down the use case, set the fastest path to proving value on your real data, and try the products hands-on to see how they fit.", factLabel: "Duration", fact: "Time-boxed" },
        { title: "Jumpstart proof of value", body: "A fixed-scope pilot on your own data and a limited rule set, in a separate environment, with zero integration. Success metrics are signed before the clock starts.", factLabel: "Duration", fact: "From 4 weeks" },
        { title: "Integration", body: "We connect it to your systems, embed it in the workflow and take it live at one location or for one document type, with no manual work left in the loop.", factLabel: "Duration", fact: "From 3 months" },
        { title: "Scaling", body: "Extend across locations and document types, with per-region rules where they differ.", factLabel: "Duration", fact: "From 3 months" },
        { title: "Managed services", body: "If you want it, we keep it running and re-tuned, with periodic accuracy and cost reviews. Or your team runs it, trained and certified by us.", factLabel: "Duration", fact: "For as long as you choose" }
      ],
      why: {
        title: "Why SoftServe on Oracle",
        /* Round 17 (Alex: the same line count for each, and icons "more
           aligned with" softserveinc.com): the three bodies sit in one length
           band, 105-120 characters, which wraps each to the same number of
           lines at every width from 320 to 1440; the icons are the brand's
           feature-icon style, bold 64 px outlines with no well. */
        pillars: [
          { icon: "why-platform", title: "Platform depth", body: "Architects who own the reference architecture on every Oracle AI platform, from Autonomous AI Lakehouse to OCI." },
          { icon: "why-agentic", title: "Agentic AI expertise", body: "Agents and workflows tested on real enterprise systems, with evaluation and guardrails built into every engagement." },
          { icon: "why-scope", title: "Fixed-scope delivery", body: "Signed success metrics up front, and every Jumpstart ends with an executive readout and a costed expansion plan." }
        ]
      }
    },

    /* Round 18 (Alex): the second way to buy the practice, under the packaged
       track: a standing team built around the customer's roadmap, the "AI
       factory", on a dark band; since 2026-09-29 its picture is parallel
       ribbons in one long wave (Alex: "parallelism and infinity"), and the
       copy is one column on the right. The four points are his four elements,
       in his order: Oracle experts; decades of enterprise AI and data; proven
       governance with scalable pod-based delivery; AI-enabled teams and
       lifecycle. Each is angled off the Why list above it rather than
       restating it, and the speed is the engineering's, since "time to value"
       already sits three times on the page. */
    bespoke: {
      anchor: "bespoke-services",
      eyebrow: "Bespoke services",
      title: "Your AI factory on Oracle.",
      lead: "A standing team that takes your AI use cases from idea to production, one after another, and grows with your roadmap. For programs bigger than one product.",
      points: [
        { title: "Oracle experts", body: "Our Oracle architects design and scope the solution, and the AI engineers beside them build it and run it." },
        { title: "Enterprise AI and data", body: "Decades of data, cloud and AI for large enterprises, so the groundwork under each use case is work we have done before." },
        { title: "Governed pod-based delivery", body: "Pods sized to each project and re-sized as it grows or shrinks, with senior leads who set the standards across them." },
        { title: "AI-enabled teams", body: "Engineers who code, test and document with AI assistants across the software lifecycle, so releases ship sooner." }
      ],
      cta: { label: "Talk to us", route: "#/#request-a-demo" },
      image: {
        wide: "assets/img/bands/bespoke-wide.jpg",
        tall: "assets/img/bands/bespoke-tall.jpg",
        alt: "Parallel chrome ribbons in one long wave, running in from the left edge on a dark grey ground"
      }
    },

    caseStudiesIntro: {
      eyebrow: "Case studies",
      title: "Results on customers’ own data",
      body: "What each engagement moves, in numbers the business already tracks."
    },

    caseStudies: [
      {
        id: "workforce-proof",
        descriptor: "A global home-appliance manufacturer",
        area: "Field-service operations across three countries",
        industry: "manufacturing",
        status: "modeled",
        metric: { value: "+4.5% productivity", label: "typical gain in jobs per technician a day over the current plan, simulated on the customer’s own history" },
        line: "Dispatchers built each region’s four-week plan by hand and workloads came out uneven; now they approve one that evens them out.",
        product: { slug: "workforce-optimization", name: "Workforce optimization" }
      },
      {
        id: "extraction-proof",
        descriptor: "An international airline",
        area: "Ground-handling contract management",
        industry: "travel-transport",
        status: "measured",
        metric: { value: "5–15 min a contract", label: "60–100 pages into the cost system, down from 3–5 days of keying by hand" },
        line: "Rates were keyed in page by page, and a wrong one surfaced only at invoice matching; now reviewers catch it before it reaches the system.",
        product: { slug: "large-document-extraction", name: "Large docs processing and review" }
      },
      {
        id: "account-insights-engagement",
        descriptor: "A global logistics and supply-chain operator",
        area: "Account planning across a global enterprise account base",
        industry: "logistics",
        status: "in-preparation",
        metric: { value: "Same-day insight", label: "from a market event to a qualified opportunity a seller can act on, not at the next quarterly review" },
        line: "Sellers sift market news one account at a time and miss the others an event touches without naming them.",
        product: { slug: "account-insights", name: "Account insights" }
      },
      {
        id: "plan-vs-actual-engagement",
        descriptor: "A major construction and engineering contractor",
        area: "Plan versus actual across completed work packages",
        industry: "construction",
        status: "in-preparation",
        metric: { value: "Variances traced", label: "every cost and schedule overrun explained, in hours of expert time rather than weeks" },
        line: "When a project finishes over budget or late, nobody can say reliably which work packages caused it, by how much or why.",
        product: { slug: "plan-vs-actual-investigation", name: "Plan vs actual investigation" }
      }
    ],

    about: {
      eyebrow: "About SoftServe",
      title: "A digital engineering company, at the frontier of agentic AI.",
      body: "SoftServe has spent more than thirty years designing and building data, cloud and AI solutions for enterprise industries, and today operates at the frontier of industrial, physical and agentic AI. Its Oracle team draws on the company’s data and analytics practice and on architects and engineers dedicated to the Oracle AI stack.",
      stats: [
        { value: "20K+", label: "customer projects" },
        { value: "10K", label: "employees" },
        { value: "17", label: "countries" },
        { value: "54", label: "offices" }
      ],
      link: { label: "softserveinc.com", url: "https://www.softserveinc.com/en-us/about-us" }
    },

    /* Round 18: the head over the product Contacts tab's own component, which
       here carries the ask alone since 2026-09-29 (no sales kit on the home
       page). No sub: the ask opens with its own (forms.demo.sub), and "talk"
       is already its submit. */
    contact: {
      anchor: "request-a-demo",
      eyebrow: "Contact",
      heading: "Start with one conversation."
    }
  },

  /* The alternative home page at #/alt (Alex, 2026-09-29), shown beside the
     live one until he picks. It keeps every word of `overview` and adds only
     what is new: the hero's H1, lead and photograph, S2's umbrella heading
     over the whole offer (replacing "A head start that scales.", which named
     the packaged path only), the photograph that keeps S2's products panel
     from repeating the hero's, and the portfolio diagram's labels.
     PROVENANCE §47. */
  overviewAlt: {
    hero: {
      /* Alex, 2026-09-29: three sentences, one line each. */
      headline: {
        lead: "Enterprise AI agents.",
        accent: "Built on Oracle.",
        proof: "ROI proven in weeks."
      },
      /* His round-16 promise on two lines, every notion kept: SoftServe's
         leading AI practice, its fast-track method, the full power of
         Oracle's data and cloud platforms, and your time to value. Only
         "combined" went, since "with" says it. Set under the H1, above the
         ask. */
      lead: "SoftServe’s leading AI practice and fast-track method, with the full power of Oracle’s data and cloud platforms, accelerate your time to value.",
      image: {
        file: "assets/img/heroes/overview.jpg",
        alt: "A tall oval of light standing open in a dark wall, its reflection running out across still water"
      }
    },
    offer: {
      title: "Everything to go live with AI.",
      /* S2 is the live page's two ways in; only the products panel's
         photograph changes, because the hero now carries the oval. */
      productsImage: {
        file: "assets/img/heroes/workforce-optimization.jpg",
        focal: "50% 60%",
        alt: "An overhead field of interlocking hexagonal plates, with loose ones still settling into the pattern from above"
      }
    },
    /* The portfolio diagram, on the left of "Why SoftServe on Oracle", in
       Alex's layout (2026-09-29): packaged services over products, bespoke
       services beside both, Oracle's platforms under all three. Each block is
       a name and a line of two to four words; the pictures carry the rest.
       The step count, the groups' fills and the platforms are read from the
       site's own lists (overview.delivery.steps, facets.categories,
       facets.technology), in the platforms' order here (AI Data Platform
       first, Alex). New micro-copy, for Alex's OK: the three lines. */
    diagram: {
      ariaLabel: "SoftServe's offer in one picture: ready-made products, packaged services that take them to production in fixed steps, and bespoke services from dedicated delivery pods, all built on Oracle's data and AI platforms",
      packaged: { name: "Packaged services", line: "Fixed-scope path to production" },
      products: { name: "Products", line: "Ready-made agents and workflows" },
      bespoke: { name: "Bespoke services", line: "Custom scope, dedicated pods" },
      stageIcons: ["workshop", "spark", "network", "scale", "managed"],
      platformOrder: ["oracle-ai-data-platform", "oracle-ai-lakehouse", "oracle-ai-fusion", "oci-nvidia"]
    }
  },

  productsPage: {
    title: "PRODUCTS",
    /* 2026-09-29 (Alex): his words, the home page's Products panel body, as
       the lead of a photographic hero after softserveinc.com's About Us.
       Still the promise, never the conditions (§52): the hosting, the
       Jumpstart and its price live on each product's Jumpstart tab. §54. */
    intro: "Ready-made AI agents and human-AI workflows that embody the know-how of their industry, so adoption starts from a working product, not a blank page. Each one is built to draw on the full power of Oracle’s AI platforms.",
    /* The hero's photograph: the SoftServe 2026 deck template's own, at full
       resolution, the same oval of light as the Products panel on the home
       page. Decorative on the page (alt=""); `alt` is the record. `focal` is
       the desktop crop; phones take their own in site.css. */
    image: {
      file: "assets/img/heroes/products.jpg",
      alt: "A tall oval of light open in a dark wall, an orange rim along its edge, its light running out across still water",
      focal: "100% 30%"
    },
    searchPlaceholder: "Search products or workflows…",
    /* Round 18 (Alex): the catalog's way out is its last tile, "Looking for
       other solution? Let's talk", into the home page's contact, with a product
       tile's anatomy so it does not stand empty beside one. */
    askTile: {
      title: "Looking for another solution?",
      body: "Tell us the workflow you need fixed, and we will say how we would do it.",
      outcomes: [
        "The closest product, if one fits",
        "A new one, scoped to your own data and systems",
        "A workshop with your team as the first step"
      ],
      image: "assets/img/groups/ask.svg",
      cta: { label: "Talk to us", route: "#/#request-a-demo" }
    }
  },

  facets: {
    technologyLabel: "Oracle platform",
    technology: [
      /* Round 9 (Alex): the short label is what the rail, the chips, the tile
         band and the hero stack render; the full Oracle product name is what
         the Services cards and prose carry. The order below is canonical on
         every surface. `catalog: false` keeps a platform out of the rail — no
         product runs "on Fusion", and a filter that returns nothing is not a
         filter — without taking it out of the stack or the Services cards. */
      {
        id: "oracle-ai-lakehouse",
        label: "AI Lakehouse",
        fullLabel: "Oracle Autonomous AI Lakehouse",
        description: "The self-managing governed gold layer, with Iceberg, vector search and Select AI.",
        emptyState: "SoftServe’s Oracle dedicated practice delivers on this platform. Tell us the workflow you have in mind."
      },
      {
        id: "oracle-ai-data-platform",
        label: "AI Data Platform",
        fullLabel: "Oracle AI Data Platform",
        description: "Governed enterprise data for AI — structured, unstructured and real-time, multi-cloud.",
        emptyState: "SoftServe’s Oracle dedicated practice delivers on this platform. Tell us the workflow you have in mind."
      },
      {
        id: "oracle-ai-fusion",
        label: "AI for Fusion Applications",
        fullLabel: "Oracle AI for Fusion Applications",
        description: "Embedded AI agents and AI Agent Studio across ERP, SCM, HCM and CX.",
        emptyState: "SoftServe’s Oracle dedicated practice delivers on this platform. Tell us the workflow you have in mind.",
        catalog: false
      },
      {
        id: "oci-nvidia",
        label: "OCI + NVIDIA NeMo",
        fullLabel: "Oracle Cloud Infrastructure + NVIDIA NeMo",
        description: "GPU cloud plus the NVIDIA agent, extraction and optimization engines — AI-Q, cuOpt, NeMo.",
        emptyState: "SoftServe’s Oracle dedicated practice delivers on this platform. Tell us the workflow you have in mind."
      }
    ],
    categoryLabel: "What it does",
    /* Round 9 (Alex): six groups, one per kind of job, in this order on the
       hero stack, the home tiles and the rail. `chip` equals `full` — the tag
       on a product page is the group's exact name, not a short form of it.
       Round 17 (Alex: tiles "colored / styled like Our offers tiles" on
       softserveinc.com, each with a drawing of the group's own idea): `tone`
       is the home tile's flat fill, four of the brand's fills in the order
       A B C D A B, the one order where no two touching tiles share a fill in
       the 3 x 2, 2 x 3 or one-column grid; `image` is the group's line drawing. */
    categories: [
      {
        id: "knowledge-analytics",
        chip: "Enterprise knowledge & analytics",
        full: "Enterprise knowledge & analytics",
        line: "Managers get the numbers behind a decision in plain words, without a report request, and the figures agree from team to team.",
        image: "assets/img/groups/knowledge-analytics.svg",
        tone: "blue",
        emptyState: "Knowledge and analytics assistants are scoped per engagement. Tell us the questions your teams ask, and which systems hold the answers."
      },
      {
        id: "deep-research",
        chip: "Deep research & investigation",
        full: "Deep research & investigation",
        line: "The research your experts spend weeks assembling, delivered ready for them to judge: an account brief, a case file, a cost overrun explained.",
        image: "assets/img/groups/deep-research.svg",
        tone: "orange",
        emptyState: "Deep research agents are scoped per engagement. Tell us the question your people spend days answering."
      },
      {
        id: "documents",
        chip: "Document processing",
        full: "Document processing",
        line: "Your team checks contracts, policies and reports instead of keying them in, and deals, claims and new suppliers stop waiting days for data entry.",
        image: "assets/img/groups/documents.svg",
        tone: "blue-light",
        emptyState: "Document processing is scoped per engagement. Tell us the document type and the system it feeds."
      },
      {
        id: "transactions",
        chip: "Transaction & process execution",
        full: "Transaction & process execution",
        line: "Routine orders, claims, tickets and invoices closed without manual handoffs, so your people handle the exceptions and approve what moves.",
        image: "assets/img/groups/transactions.svg",
        tone: "neutral",
        emptyState: "Transaction and process agents are scoped per engagement. Tell us the process step your people complete by hand today."
      },
      {
        id: "forecasting-optimization",
        chip: "Forecasting & optimization",
        full: "Forecasting & optimization",
        line: "More work from the people and vehicles you already have, on plans your planners approve instead of building by hand.",
        image: "assets/img/groups/forecasting-optimization.svg",
        tone: "blue",
        emptyState: "Forecasting and optimization is scoped per engagement. Tell us the plan your planners or dispatchers build by hand today."
      },
      {
        id: "video-image",
        chip: "Video & image intelligence",
        full: "Video & image intelligence",
        line: "Defects spotted, incidents flagged and scenes found in your footage and photos, without anyone having to watch every hour of it.",
        image: "assets/img/groups/video-image.svg",
        tone: "orange",
        emptyState: "Video and image work is delivered as an engagement today, on OCI + NVIDIA NeMo. Tell us the footage or the inspection you have in mind."
      }
    ],
    availability: {
      label: "Artifacts",
      options: [
        { id: "demo", label: "Interactive demo" },
        { id: "marketplace", label: "Oracle Marketplace" }
      ]
    },
    allLabel: "All",
    clearLabel: "Clear filters",
    noResults: "No product matches these filters. Clear one and try again, or tell us the workflow you need fixed."
  },

  products: [
    {
      slug: "account-insights",
      name: "Account insights",
      contactPerson: "vlad-butenko",
      headline: { accent: "ACCOUNT", rest: "INSIGHTS" },
      category: "deep-research",
      categoryChip: "Deep research & investigation",
      facet: "oci-nvidia",
      oneLiner: "Opportunities your sellers would otherwise miss and risks caught before renewal, for every account a market event touches.",
      tags: ["Deep research & investigation", "OCI + NVIDIA NeMo"],
      hero: {
        image: {
          file: "assets/img/heroes/account-insights.jpg",
          alt: "A web of linked signal nodes glowing above an out-of-focus night city, seen past a silhouetted figure",
          focal: "50% 48%"
        }
      },
      tile: {
        outcomes: [
          "One real-world signal — news, filing, disclosure — turned into structured opportunities and risks per affected account",
          "Every item scored for magnitude and confidence, and cited to its evidence",
          "It informs decisions and does not act on them: a reviewer approves or rejects before anything moves"
        ]
      },
      overview: {
        problemSolution: {
          problem: {
            headline: "Sales teams hear about a customer's big move too late",
            text: "A plant opening, a merger, a new market: the sales manager hears when the work is already scoped by somebody else, and nobody knows which other customers the news reaches."
          },
          solution: {
            headline: "The next move for each account, in hours, with the evidence",
            text: "One story becomes a scored, cited brief for each account it reaches, suppliers and competitors included: what to sell and what to protect. A seller approves what enters the CRM."
          }
        },
        metrics: [
          {
            key: "time-to-move",
            title: "News to a reviewed brief",
            kind: "estimated",
            owner: "Head of sales",
            figure: { prefix: "from", text: "a quarter" },
            visual: {
              form: "compression",
              unit: "elapsed time",
              direction: "down",
              scale: { min: 0, max: 2184 },
              before: { value: 2184, label: "a quarter" },
              after: { value: 24, label: "hours" }
            },
            line: "Reviewed by a seller and ready to act on, the day the news lands."
          },
          {
            key: "week-not-selling",
            title: "A seller's week not spent selling",
            kind: "estimated",
            owner: "Head of key-account management",
            figure: { prefix: "from", text: "72%" },
            visual: {
              form: "baseline",
              unit: "percent of the working week",
              direction: "down",
              scale: { min: 0, max: 100 },
              before: { value: 72, label: "72%" }
            },
            line: "Research and briefing time handed back, customer by customer."
          }
        ],
        features: [
          "Signal ingestion grounded in CRM context, service catalog and public filings",
          "Relevance filter and de-duplication: one story becomes one signal",
          "Account fan-out — one JSON per affected account",
          "Opportunity and risk reasoning, mapped to a real service line",
          "Cross-account ripples across suppliers, customers and competitors",
          "Magnitude and confidence scored 0–10, with a configurable threshold",
          "Reviewer UI with citations, approve or reject with a comment"
        ],
        industriesNote: "Any business that needs to turn market and customer developments into pursuable opportunities across its account base, quickly.",
        steps: [
          {
            n: 1,
            title: "The news comes in",
            text: "Announcements, filings and market news are picked up on a schedule or submitted by hand, and matched against your customer list.",
            shot: {
              full: "assets/img/steps/account-insights-1.jpg",
              alt: "The morning check: stories read, noise dropped, repeats merged, accounts matched."
            },
            features: ["Signal ingestion grounded in CRM context, service catalog and public filings"]
          },
          {
            n: 2,
            title: "One read per account",
            text: "One story becomes one signal, and each account it reaches gets its own read: the company named, its suppliers, its competitors, its customers.",
            shot: {
              full: "assets/img/steps/account-insights-2.jpg",
              alt: "One story reaching four accounts: named, supplier, customer and competitor."
            },
            features: [
              "Relevance filter and de-duplication: one story becomes one signal",
              "Account fan-out — one JSON per affected account"
            ]
          },
          {
            n: 3,
            title: "Scored and cited",
            text: "For each one: what the change means, the service you could sell, how big and how certain, with the source article or filing linked.",
            shot: {
              full: "assets/img/steps/account-insights-3.jpg",
              alt: "A move for Meridian Grocers: both scores and what changes, with citations."
            },
            features: [
              "Opportunity and risk reasoning, mapped to a real service line",
              "Cross-account ripples across suppliers, customers and competitors"
            ]
          },
          {
            n: 4,
            title: "A seller approves",
            text: "The reviewer works the list top down, accepts or rejects with a comment, and only approved items reach the CRM.",
            shot: {
              full: "assets/img/steps/account-insights-4.jpg",
              alt: "The review: moves approved, one rejected with its reason kept."
            },
            features: [
              "Magnitude and confidence scored 0–10, with a configurable threshold",
              "Reviewer UI with citations, approve or reject with a comment"
            ]
          }
        ],
        industryCases: [
          {
            industry: "logistics",
            label: "Logistics & supply chain",
            image: "assets/img/industries/logistics.jpg",
            problem: "A shipper announces a plant expansion or a new market, and the account team hears about it once the logistics has already been scoped by somebody else. Disruptions move the same way: a strike, a port closure or a supplier fire hits many accounts at once, and working out which ones is manual.",
            solution: "One signal is resolved to every in-scope shipper account it touches, and the “so what” is reasoned per account — warehousing, forwarding, an inbound or a mitigation play. Each candidate is mapped to a service line you actually sell, scored, and cited back to the filing or article it came from."
          },
          {
            industry: "financial-services",
            label: "Financial services",
            image: "assets/img/industries/financial-services.jpg",
            problem: "Coverage teams read the same few feeds as everyone else. An event at a counterparty or a portfolio company usually matters for several related names as well, and nobody has time to trace the holdings before the opening closes.",
            solution: "The engine reasons what an issuer or counterparty event means for each in-scope relationship, then follows the cross-holding ripples to the related names — up to two levels, descriptively. Every opportunity is scored for magnitude and confidence and cited, and a reviewer approves before anything reaches the CRM."
          },
          {
            industry: "manufacturing",
            label: "Manufacturing",
            image: "assets/img/industries/manufacturing.jpg",
            problem: "A signal at a supplier or an OEM customer reshapes supply chains, production sites and trade lanes at the same time. Deciding which accounts are affected, and how, is slow enough that the reallocation conversation happens after the decision has been taken.",
            solution: "Each in-scope account is reasoned against the signal — supply-chain exposure, reallocation opportunities, second-order effects on sites and lanes — with every item tied to a real service line. The magnitude and confidence scores let the team work the top of the list first."
          }
        ],
        scope: {
          in: [
            "A signal plus first-party CRM context, the service catalog and the in-scope account list",
            "Filtering for genuine signals, and identifying which in-scope accounts are affected",
            "Reasoning \"so what\" per account: opportunities and material risks mapped to a service line",
            "Descriptive second-order and cross-account ripples, up to two levels",
            "Magnitude and confidence scoring, citations, one JSON per affected account"
          ],
          out: [
            "Acting on opportunities — auto-outreach, CRM tasks, workflow automation; decisioning is downstream",
            "Validating candidates against deals already in flight — a post-proof step",
            "Monetary sizing, and conversational follow-up over the output",
            "CRM write-back, a persistent historical signal store, and the feedback loop",
            "Deep financial modeling — the engine reasons over disclosures, it does not compute them",
            "Native multilingual processing — single-language primary; more languages are a future extension"
          ]
        },
        caseStudy: {
          descriptor: "A global logistics and supply-chain operator",
          area: "Account planning across a global enterprise account base",
          industry: "logistics",
          status: "in-preparation",
          metrics: [
            { value: "Same-day insight", label: "from a market signal to a qualified opportunity a seller can act on" },
            { value: "Every account", label: "a signal affects, not only the one it names" }
          ],
          story: "A first engagement is being prepared on the customer’s own account base — CRM and account framing, the capability catalog and public filings — with NVIDIA AI-Q on Oracle Cloud Infrastructure. It measures the accuracy and the confidence calibration of the generated opportunities against reviewer approve and reject decisions. The figures above are estimates for that engagement, set against the customer’s account-planning cycle today; illustrative, not contractual.",
          scope: [
            { label: "Stage", value: "Proof of value in preparation" },
            { label: "Data footprint", value: "CRM, capability catalog, public filings" },
            { label: "Human gate", value: "A reviewer approves or rejects every item" }
          ],
          ndaLine: "Customer under NDA · results follow at the end of the proof of value",
          downloadLabel: "Download the case summary"
        }
      },
      technology: {
        narrative: "The app runs on a dedicated AI cluster in your own Oracle Cloud Infrastructure tenancy. NVIDIA AI-Q grounds every conclusion in a cited first-party or public source, and nothing reaches the CRM until a reviewer approves it.",
        stack: [
          {
            key: "application",
            label: "Application / accelerator",
            summary: "The SoftServe pack: filter, fan-out, reasoning, scoring and the reviewer UI.",
            vendors: ["softserve"],
            items: [
              { name: "Filter, fan-out, reason and score pipeline", required: true },
              { name: "Reviewer UI with citations and the reasoning behind every item", required: true },
              { name: "Evaluation harness — correctness and confidence calibration", required: true },
              { name: "CRM export connector", required: false, note: "After the Jumpstart" }
            ]
          },
          {
            key: "ai-engine",
            label: "AI engine",
            summary: "NVIDIA AI-Q supplies the retrieval baseline every conclusion is grounded in.",
            vendors: ["nvidia"],
            items: [
              { name: "NVIDIA AI-Q retrieval baseline — vector search and reranking", required: true }
            ]
          },
          {
            key: "data-platform",
            label: "Data & platform",
            summary: "Object storage holds the signals, the context and the output; a lakehouse only where the runs are scheduled workflows.",
            vendors: ["oracle"],
            items: [
              { name: "OCI Object Storage for signals, first-party context and output", required: true },
              { name: "Oracle AI Data Platform — sources landed and curated, dossiers run as scheduled workflows", required: false }
            ]
          },
          {
            key: "infrastructure",
            label: "Infrastructure",
            summary: "A dedicated AI cluster inside your own OCI tenancy, in a delivered landing zone.",
            vendors: ["oracle"],
            items: [
              { name: "OCI dedicated AI cluster (GPU)", required: true },
              { name: "Landing zone — VCN, IAM, networking", required: true }
            ]
          },
          {
            key: "custom",
            label: "Configuration & integrations",
            summary: "The sources, the mappings, the scoring rubric and where the output lands — set per engagement.",
            vendors: ["softserve"],
            items: [
              { name: "Signal feeds — news, filings, disclosures — and commercial data feeds", required: true, direction: "inbound" },
              { name: "First-party CRM records and account framing", required: true, direction: "inbound" },
              { name: "Capability / service-line catalog, public filings, the in-scope account list", required: true, direction: "inbound" },
              { name: "One JSON per affected account, into the CRM or sales system", required: false, direction: "outbound", note: "After the Jumpstart" },
              { name: "Trigger: scheduled scan by default, plus manual submit", required: true },
              { name: "Client field mapping and the scoring rubric", required: true }
            ]
          }
        ],
        capabilities: [
          {
            stage: "Inputs & grounding",
            items: [
              { name: "Signal ingestion — news, filings and disclosures as the trigger" },
              { name: "First-party context: CRM records and account framing" },
              { name: "Service-line capability catalog" },
              { name: "Public filings" },
              { name: "Commercial data feeds" },
              { name: "The in-scope account list" }
            ]
          },
          {
            stage: "Trigger & filtering",
            items: [
              { name: "Scheduled scan by default, plus manual submit" },
              { name: "Relevance filter and de-duplication — one story becomes one signal" },
              { name: "Account fan-out — one record per affected account" }
            ]
          },
          {
            stage: "Reasoning",
            items: [
              { name: "Account resolution — which in-scope accounts the signal affects" },
              { name: "Opportunity and risk reasoning per account" },
              { name: "Each opportunity mapped to a real service line" },
              { name: "Cross-account ripple reasoning, up to two levels" },
              { name: "Magnitude and confidence scoring, 0–10" },
              { name: "Retrieval grounding — vector search and reranking" }
            ]
          },
          {
            stage: "Review & output",
            items: [
              { name: "Reviewer UI — read the items, follow the source links, approve or reject with a comment" },
              { name: "Citations and the reasoning behind every item" },
              { name: "Configurable confidence threshold that filters low-confidence output" },
              { name: "Evaluation harness — correctness and confidence calibration" },
              { name: "One JSON per affected account, for the CRM or sales system" }
            ]
          }
        ]
      },
      jumpstart: {
        title: "Jumpstart Proof-of-Value",
        promise: "Pilot account insights on your own account list and signal sources in 4–8 weeks, at a scope agreed before the clock starts, and measure how many of the generated opportunities a reviewer actually accepts.",
        durationShort: "4–8 weeks",
        pillars: [
          { key: "fast", title: "Fast", text: "One signal set, one account list, 4–8 weeks: the proof is deliberately as small as it can honestly be." },
          { key: "low-risk", title: "Low-risk", text: "Fixed scope, signed before the clock starts. It runs in your own Oracle tenancy, and nothing is written back to your CRM." },
          { key: "tangible", title: "Tangible", text: "A measured accuracy readout: the share of generated opportunities a reviewer accepts, and how well the confidence scores track those decisions." }
        ],
        outcomes: [
          "Scored, cited opportunities and risks across your in-scope account list — including the ones a seller would not otherwise have seen.",
          "An accuracy readout against a golden set your own people prepared, plus the reviewer accept rate.",
          "The reviewer UI running in your tenancy, with the citations and the reasoning behind every item.",
          "A costed plan for the next step: CRM export, pipeline validation, a persistent signal store."
        ],
        timeline: [
          { label: "Week 0 · Gate", text: "Sponsor named, two to three success metrics signed, source access approved in writing." },
          { label: "Build", text: "Signal feeds, CRM context and the service catalog connected; filter, fan-out, reasoning and scoring configured to your domain." },
          { label: "Review", text: "Your reviewers work the output in the UI; accuracy is measured against the agreed golden set." },
          { label: "Decision", text: "Readout on correctness and confidence calibration, and a costed proposal for the next step." }
        ],
        needs: [
          "The in-scope account list, your CRM context and the service-line catalog",
          "A business owner, and reviewers who will accept or reject the output",
          "A golden set of manually prepared briefs to measure the output against"
        ],
        investment: {
          price: null,
          duration: "4–8 weeks",
          includes: [
            "Signal ingestion and grounding, the relevance filter and account fan-out",
            "Opportunity and risk reasoning, cross-account ripples, scoring and citations",
            "The reviewer UI and the evaluation harness, deployed in your tenancy",
            "One SoftServe team: AI, data and OCI architects, a product manager and a project manager, senior AI and data engineers"
          ],
          footnote: "Figures are illustrative and confirmed in scoping."
        },
        next: [
          { tier: "Integration", text: "CRM export, validation against the deals already in flight, and a persistent signal store — live for one account book.", duration: "3–5 months", price: "Scoped per engagement" },
          { tier: "Scaling", text: "More account books and service lines, more signal sources, and regional rule sets.", duration: "3–12 months", price: "Scoped per engagement" }
        ],
        cta: { label: "Start a Jumpstart conversation", route: "#/products/account-insights/contacts" }
      }
    },
    {
      slug: "case-evidence-collection",
      name: "Case evidence collection",
      contactPerson: "oleksii-orlov",
      headline: { accent: "CASE", rest: "EVIDENCE COLLECTION" },
      category: "deep-research",
      categoryChip: "Deep research & investigation",
      facet: "oci-nvidia",
      oneLiner: "Investigators spend their hours deciding cases, not gathering evidence: every case file arrives complete and built the same way, whoever works it.",
      statusNote: "In preparation — scoping conversations are open.",
      tags: ["Deep research & investigation", "OCI + NVIDIA NeMo"],
      hero: {
        image: {
          file: "assets/img/heroes/case-evidence-collection.jpg",
          alt: "A long row of upright panels standing edge to edge and curving away into the dark, each lit along its leading edge",
          focal: "50% 42%"
        }
      },
      tile: {
        outcomes: [
          "A case summary, a chronological timeline and draft response sections, per case",
          "Every statement cited to the exact source sentence or field",
          "An investigator UI with navigate-to-source, amend, approve or flag, and a full audit log"
        ]
      },
      overview: {
        problemSolution: {
          problem: {
            headline: "Most of a complaint's clock goes on finding the file",
            text: "An investigator rebuilds each case by hand from tickets, emails, billing records and call notes while the statutory deadline runs, and two people build two different versions."
          },
          solution: {
            headline: "A finished, cited file on day one",
            text: "Each complaint opens with a summary, a dated timeline and a drafted response, every sentence linked to the record it came from. The investigator amends, approves or flags."
          }
        },
        metrics: [
          {
            key: "file-ready",
            title: "Time until the evidence is assembled",
            kind: "estimated",
            owner: "Head of investigations",
            figure: { prefix: "from", text: "weeks" },
            visual: {
              form: "compression",
              unit: "time to a complete, cited case file",
              direction: "down",
              scale: { min: 0, max: 21 },
              before: { value: 21, label: "weeks" },
              after: { value: 1, label: "day one" }
            },
            line: "Summary, timeline and draft response ready as the clock starts."
          },
          {
            key: "late-answers",
            title: "Complaints answered late",
            kind: "estimated",
            owner: "Head of complaints",
            figure: { prefix: "from", text: "5.6%" },
            visual: {
              form: "baseline",
              unit: "share of complaints",
              direction: "down",
              scale: { min: 0, max: 100 },
              before: { value: 5.6, label: "5.6%" }
            },
            line: "Complaints answered after the regulator's deadline, across the industry."
          }
        ],
        features: [
          "Multi-source evidence assembly across systems, correspondence and documents",
          "Chronological case timeline with timestamps and clickable source references",
          "Sentence- and field-level citation on every statement",
          "Draft response sections the investigator amends and approves",
          "Investigator UI: navigate to source, amend, approve or flag",
          "Full audit log of every review decision",
          "Case categories scoped and configured per engagement"
        ],
        industriesNote: "The pattern is the same wherever an event opens a case and the evidence sits in several systems at once.",
        steps: [
          {
            n: 1,
            title: "A case opens",
            text: "A complaint, an alert or a batch of cases starts the clock, in the category agreed for your team.",
            shot: {
              full: "assets/img/steps/case-evidence-collection-1.jpg",
              alt: "Case list: a complaint on day 3 of 56, four sources connected."
            },
            features: ["Case categories scoped and configured per engagement"]
          },
          {
            n: 2,
            title: "Evidence gathered",
            text: "Tickets, correspondence, operational records and scans are read together, and every item is tied to the file it belongs to.",
            shot: {
              full: "assets/img/steps/case-evidence-collection-2.jpg",
              alt: "The timeline being assembled: twelve dated events from four source systems."
            },
            features: ["Multi-source evidence assembly across systems, correspondence and documents"]
          },
          {
            n: 3,
            title: "The file, built and cited",
            text: "A summary, a dated timeline and draft response sections, each statement pointing to the exact source sentence or field.",
            shot: {
              full: "assets/img/steps/case-evidence-collection-3.jpg",
              alt: "Case file summary with one citation opened to its billing row."
            },
            features: [
              "Chronological case timeline with timestamps and clickable source references",
              "Sentence- and field-level citation on every statement",
              "Draft response sections the investigator amends and approves"
            ]
          },
          {
            n: 4,
            title: "Investigate and decide",
            text: "Amend, approve or flag, with every decision written to the audit log, so the handling stands up later.",
            shot: {
              full: "assets/img/steps/case-evidence-collection-4.jpg",
              alt: "Review screen: amend, approve or flag, and a five-entry audit log."
            },
            features: [
              "Investigator UI: navigate to source, amend, approve or flag",
              "Full audit log of every review decision"
            ]
          }
        ],
        industryCases: [
          {
            industry: "financial-services",
            label: "Financial services",
            image: "assets/img/industries/financial-services.jpg",
            problem: "A flagged transaction or an alert has to be investigated across parties, accounts and linked cases before anything can be filed. The analyst pulls the same records out of the same systems every time, and the filing is drafted from scratch under a deadline.",
            solution: "The evidence is assembled across those systems into one file with a chronological timeline, and the regulatory response sections arrive drafted for an analyst to amend and approve. Every statement is bound to the record it came from, so a second reviewer can retrace the finding independently."
          },
          {
            industry: "manufacturing",
            label: "Manufacturing",
            image: "assets/img/industries/manufacturing.jpg",
            problem: "A customer complaint sends a quality manager back through batch records, supplier history and operational logs kept in systems that were never designed to be read together. The root-cause report varies with whoever writes it.",
            solution: "Batch records, supplier history and the correspondence around the complaint are assembled into one cited file with a draft root-cause narrative. The quality manager amends and approves; the system assembles and drafts, it does not decide the outcome."
          },
          {
            industry: "professional-services",
            label: "Professional services",
            image: "assets/img/industries/professional-services.jpg",
            problem: "A grievance or employee-relations intake means rebuilding a chronology out of tickets, mail threads and policy references. It is slow, it varies by handler, and the evidence trail is hard to reconstruct later.",
            solution: "The chronology is built automatically from those sources with timestamps and clickable references, and the response sections are drafted for amendment. The audit log records every review decision, so the handling itself stands up to scrutiny."
          },
          {
            industry: "public-sector",
            label: "Public sector",
            image: "assets/img/industries/public-sector.jpg",
            problem: "Complaint handling runs to a statutory clock, and the evidence sits across case management, correspondence and operational records. Most of that clock goes on gathering the file before anyone can judge it.",
            solution: "Each case arrives as a summary, a timeline and draft response sections, every claim cited to its source sentence or field. Investigators spend the time on judgement, and the full audit log shows how the file was built."
          }
        ],
        scope: {
          in: [
            "One agreed case category, on historical non-production records",
            "Evidence assembled across operational systems, correspondence and documents",
            "Case summary, chronological timeline and draft response sections per case",
            "Sentence- and field-level citation on every statement",
            "The investigator UI, with amend, approve or flag and a full audit log"
          ],
          out: [
            "Deciding the outcome — the system assembles and drafts, a person decides",
            "Anonymization and masking of source records — a data-supply precondition",
            "Sending or filing the drafted response",
            "Live source integration and production approval workflow — after the Jumpstart",
            "Additional case categories and source systems — at scale"
          ]
        },
        caseStudy: null
      },
      technology: {
        narrative: "Exports from your operational systems land read-only in your own OCI tenancy. NVIDIA AI-Q reasons across them, and every statement in the assembled case is bound to the source record it came from.",
        stack: [
          {
            key: "application",
            label: "Application / accelerator",
            summary: "The SoftServe pack: evidence assembly, timeline construction, citation binding and the investigator UI.",
            vendors: ["softserve"],
            items: [
              { name: "Evidence assembly across systems, correspondence and documents", required: true },
              { name: "Chronological timeline construction", required: true },
              { name: "Citation binding at sentence and field level", required: true },
              { name: "Investigator UI — amend, approve or flag, with a full audit log", required: true }
            ]
          },
          {
            key: "ai-engine",
            label: "AI engine",
            summary: "NVIDIA AI-Q reasons across many documents at once and generates the draft sections.",
            vendors: ["nvidia"],
            items: [
              { name: "NVIDIA AI-Q Blueprint — multi-document reasoning and output generation", required: true }
            ]
          },
          {
            key: "data-platform",
            label: "Data & platform",
            summary: "Where the exports land, plus the optional route that reconciles the evidence base in the data layer.",
            vendors: ["oracle"],
            items: [
              { name: "OCI Object Storage for the read-only source exports", required: true },
              { name: "Oracle enterprise AI services for multi-tool orchestration over live systems", required: false },
              { name: "Oracle AI Data Platform — evidence reconciled in the data layer rather than at query time", required: false }
            ]
          },
          {
            key: "infrastructure",
            label: "Infrastructure",
            summary: "Your own OCI tenancy, with the AI cluster the reasoning runs on.",
            vendors: ["oracle"],
            items: [
              { name: "OCI dedicated AI cluster (GPU)", required: true },
              { name: "Tenancy, IAM and read-only source access", required: true }
            ]
          },
          {
            key: "custom",
            label: "Configuration & integrations",
            summary: "Source mapping, case categories, citation granularity and the approval workflow.",
            vendors: ["softserve"],
            items: [
              { name: "Exports from case management, correspondence and operational records", required: true, direction: "inbound" },
              { name: "Document stores and rostering exports", required: false, direction: "inbound" },
              { name: "The assembled case file and draft sections, plus the approval record", required: true, direction: "outbound" },
              { name: "Trigger: an event opens a case, or a batch sweep opens many", required: true },
              { name: "Case categories, citation granularity and the approval workflow", required: true }
            ]
          }
        ],
        capabilities: [
          {
            stage: "Intake & scoping",
            items: [
              { name: "Case categories scoped and configured per engagement" },
              { name: "Trigger: an event opens a case, or a batch sweep opens many" },
              { name: "Source mapping across case management, correspondence and operational records" }
            ]
          },
          {
            stage: "Evidence assembly",
            items: [
              { name: "Multi-source evidence assembly across systems, correspondence and documents" },
              { name: "Multi-document reasoning across the assembled sources" },
              { name: "Read-only source exports landed in your own tenancy" },
              { name: "Every piece of evidence bound to the case it belongs to" }
            ]
          },
          {
            stage: "Case file",
            items: [
              { name: "Case summary — the key facts and an investigative overview" },
              { name: "Chronological timeline with timestamps and clickable source references" },
              { name: "Sentence- and field-level citation on every statement" },
              { name: "Draft response sections the investigator amends and approves" }
            ]
          },
          {
            stage: "Investigate & decide",
            items: [
              { name: "Investigator UI — navigate to source, amend, approve or flag" },
              { name: "Full audit log of every review decision" },
              { name: "Citation granularity and the approval workflow, configured per engagement" }
            ]
          }
        ]
      },
      jumpstart: {
        title: "Jumpstart Proof-of-Value",
        promise: "Pilot case evidence collection in 4–8 weeks, on historical cases your own experts have already adjudicated and at a scope agreed before the clock starts, and see how the assembled evidence file compares with the answer they reached.",
        durationShort: "4–8 weeks",
        pillars: [
          { key: "fast", title: "Fast", text: "One case category, one historical sample, 4–8 weeks: the sample you pick sets where in that range it lands." },
          { key: "low-risk", title: "Low-risk", text: "Historical, non-production records only, in your own Oracle tenancy, with read-only source access. The system assembles and drafts; a person decides the outcome." },
          { key: "tangible", title: "Tangible", text: "Elapsed time and person-hours for an equivalent case file, measured before and after — on cases whose answer is already known." }
        ],
        outcomes: [
          "Assembled, cited case files for your sample — a summary, a chronological timeline and draft response sections per case.",
          "A measured readout on three criteria: time to an equivalent file, the share of findings your experts confirm, and evidence coverage.",
          "The investigator UI running in your tenancy, with amend, approve or flag and a full audit log.",
          "A costed proposal for the next step."
        ],
        timeline: [
          { label: "Week 0 · Gate", text: "Sponsor named, two to three success metrics signed, source access approved in writing." },
          { label: "Build", text: "Exports landed read-only; evidence assembly, timeline construction and citation binding configured for one case category." },
          { label: "Review", text: "Your investigators work the assembled files in the UI, against cases their own experts already adjudicated." },
          { label: "Decision", text: "Measured readout against the three criteria, and a costed proposal for the next step." }
        ],
        needs: [
          "An agreed case category and a historical, non-production sample",
          "A validation sample of cases your own experts have already adjudicated",
          "Named subject-matter experts and data owners, and an agreed transfer route"
        ],
        investment: {
          price: null,
          duration: "4–8 weeks",
          includes: [
            "One case category, assembled and cited across the agreed sample",
            "Case summary, chronological timeline and draft response sections per case",
            "The investigator UI and its audit log, deployed in your tenancy",
            "One SoftServe team: AI, data and OCI architects, a product manager and a project manager, senior AI and data engineers"
          ],
          footnote: "Figures are illustrative and confirmed in scoping."
        },
        next: [
          { tier: "Integration", text: "Live source integration, the production approval workflow and its audit trail, live for one case category.", duration: "3–5 months", price: "Scoped per engagement" },
          { tier: "Scaling", text: "More case categories and source systems, with regional rule and retention sets.", duration: "3–12 months", price: "Scoped per engagement" }
        ],
        cta: { label: "Start a Jumpstart conversation", route: "#/products/case-evidence-collection/contacts" }
      }
    },
    {
      slug: "plan-vs-actual-investigation",
      name: "Plan vs actual investigation",
      contactPerson: "dmytro-dudchenko",
      headline: { accent: "PLAN", rest: "VS ACTUAL INVESTIGATION" },
      category: "deep-research",
      categoryChip: "Deep research & investigation",
      facet: "oci-nvidia",
      oneLiner: "See which finished projects and orders went over budget or ran late, by how much and why, across the whole portfolio.",
      statusNote: "In preparation — scoping conversations are open.",
      tags: ["Deep research & investigation", "OCI + NVIDIA NeMo"],
      hero: {
        image: {
          file: "assets/img/heroes/plan-vs-actual-investigation.jpg",
          alt: "Robotic arms working an assembly line that recedes down a long, dimly lit factory hall",
          focal: "50% 48%"
        }
      },
      tile: {
        outcomes: [
          "Plan-versus-actual at the level of a project, work package, order, engagement or campaign",
          "Variances and candidate drivers presented as evidence-backed candidates, never as conclusions",
          "Unresolved records are reported as coverage gaps, each with the reason it could not be resolved"
        ]
      },
      overview: {
        problemSolution: {
          problem: {
            headline: "One overrun takes weeks of expert time to explain",
            text: "A project controller holds the schedule tool, the cost reports, the progress reports and the scanned contracts, none of them joined. One closed package takes a week to reconstruct."
          },
          solution: {
            headline: "Every variance traced to its record, in hours",
            text: "Each package's plan and actual are set side by side, and every cost or schedule gap comes back with its likely causes and the document behind each. Your experts confirm."
          }
        },
        metrics: [
          {
            key: "expert-hours",
            title: "Expert time to explain an overrun",
            kind: "estimated",
            owner: "Head of project controls",
            figure: { prefix: "from", text: "weeks" },
            visual: {
              form: "compression",
              unit: "expert time per completed project",
              direction: "down",
              scale: { min: 0, max: 480 },
              before: { value: 480, label: "weeks" },
              after: { value: 8, label: "hours" }
            },
            line: "Every variance, with its cause and the document behind it."
          },
          {
            key: "projects-reviewed",
            title: "Teams that review every closed project",
            kind: "estimated",
            owner: "PMO director",
            figure: { prefix: "from", text: "1 in 10" },
            visual: {
              form: "baseline",
              unit: "organizations",
              direction: "up",
              scale: { min: 0, max: 10 },
              before: { value: 1, label: "1 in 10" }
            },
            line: "Every one reviewed against its plan, not the one somebody had time for."
          }
        ],
        features: [
          "Ingest and profile approved static exports, preserving lineage",
          "Configuration-driven mapping to project, zone and unit level",
          "Unresolved records reported as coverage gaps, with their reason",
          "Plan-versus-actual comparison at unit level, on cost and schedule",
          "Variances, recurring patterns and candidate drivers as evidence-backed candidates",
          "An evidence layer over documents: extraction, embeddings, entity retrieval",
          "A purpose-built lightweight review app for findings, citations and gaps"
        ],
        industriesNote: "Wherever completed units of work — projects, work packages, orders, engagements, campaigns — have to be compared against what was planned for them.",
        steps: [
          {
            n: 1,
            title: "Exports come in",
            text: "Schedule, cost and progress exports and the scanned contracts are loaded as they are, with every file's origin kept.",
            shot: {
              full: "assets/img/steps/plan-vs-actual-investigation-1.jpg",
              alt: "The imports screen: four sources loaded, 96% resolved, 4% listed as gaps."
            },
            features: ["Ingest and profile approved static exports, preserving lineage"]
          },
          {
            n: 2,
            title: "Package by package",
            text: "Every line is resolved to project, zone and unit of work; whatever cannot be resolved is listed as a gap, with the reason.",
            shot: {
              full: "assets/img/steps/plan-vs-actual-investigation-2.jpg",
              alt: "The packages table: façade package 38% over cost and nine weeks late."
            },
            features: [
              "Configuration-driven mapping to project, zone and unit level",
              "Unresolved records reported as coverage gaps, with their reason"
            ]
          },
          {
            n: 3,
            title: "The record says why",
            text: "Plan and actual are compared on cost and schedule, and each gap comes with its candidate causes: a change order, weather days, rework, each cited.",
            shot: {
              full: "assets/img/steps/plan-vs-actual-investigation-3.jpg",
              alt: "The façade package's causes: change order CO-22 cited to contract page 31."
            },
            features: [
              "Plan-versus-actual comparison at unit level, on cost and schedule",
              "Variances, recurring patterns and candidate drivers as evidence-backed candidates"
            ]
          },
          {
            n: 4,
            title: "Experts confirm",
            text: "Your planners confirm or reject each one, and the causes that recur across packages surface as the lesson.",
            shot: {
              full: "assets/img/steps/plan-vs-actual-investigation-4.jpg",
              alt: "Causes confirmed or rejected; the pattern recurs in 7 of 32 packages."
            },
            features: [
              "An evidence layer over documents: extraction, embeddings, entity retrieval",
              "A purpose-built lightweight review app for findings, citations and gaps"
            ]
          }
        ],
        industryCases: [
          {
            industry: "construction",
            label: "Construction",
            image: "assets/img/industries/construction.jpg",
            problem: "Historical package performance is spread across a schedule tool, cost reports, progress reports and scanned contracts, at inconsistent granularity. Nobody can say reliably which work packages deviated from plan, by how much, and what the record says about why.",
            solution: "The records are reconstructed into a consistent package-level view: plan versus actual on cost and schedule, supported variances, recurring patterns and candidate drivers — each material finding tied to source evidence and validated by your own planning experts. Whatever could not be resolved is reported as a coverage gap."
          },
          {
            industry: "manufacturing",
            label: "Manufacturing",
            image: "assets/img/industries/manufacturing.jpg",
            problem: "Completed orders are measured against what was planned for them only in aggregate. The ledger shows the gap; the systems that could explain it — scheduling, cost, progress reporting — are not joined to it.",
            solution: "Every order in the sample is compared plan against actual at unit level, and the cost and schedule gaps are traced back to the records that explain them. Findings arrive as evidence-backed candidates for a reviewer to confirm, each with its analytical basis and a review status."
          },
          {
            industry: "professional-services",
            label: "Professional services",
            image: "assets/img/industries/professional-services.jpg",
            problem: "Closed engagements are reviewed one at a time, usually by the person who ran them. Where effort and schedule diverged from the plan is known anecdotally, and the pattern across a portfolio is never assembled.",
            solution: "The whole sample is swept at once: plan versus actual per engagement, the recurring patterns across them, and the candidate drivers assembled from the systems that hold the effort, the schedule and the outcome. A subject-matter expert validates before anything is acted on."
          }
        ],
        scope: {
          in: [
            "One anchor portfolio or project, one agreed sample",
            "Approved static exports ingested and profiled with lineage preserved",
            "Records resolved to the lowest reliable unit level, with a coverage-gap report",
            "Plan-versus-actual comparison on cost and schedule, at unit level",
            "Evidence-backed variances, recurring patterns and candidate drivers, expert-reviewed"
          ],
          out: [
            "Ranking suppliers, selecting vendors, or making planning decisions",
            "Enterprise-wide normalization or master-data remediation",
            "Cross-project benchmarking beyond the agreed sample",
            "Live source feeds in place of static exports — after the Jumpstart",
            "Contracting or packaging decisions taken on the proof’s output"
          ]
        },
        caseStudy: {
          descriptor: "A major construction and engineering contractor",
          area: "Plan versus actual across completed work packages",
          industry: "construction",
          status: "in-preparation",
          metrics: [
            { value: "Variances traced", label: "each to its schedule, cost or contract source, in hours of expert time rather than weeks" }
          ],
          story: "A first engagement is being prepared, scoped to one use case on one completed project sample — the customer’s own schedule, cost and contract exports. It will run on Oracle Cloud Infrastructure, with NVIDIA AI-Q over an evidence layer, reconstructing those records into one package-level view of plan versus actual; the figure above is an estimate for that engagement, set against the expert hours the same analysis takes today; illustrative, not contractual.",
          scope: [
            { label: "Stage", value: "Proof of value in preparation" },
            { label: "Scope", value: "One use case, one completed project sample" },
            { label: "Data footprint", value: "Schedule, cost and contract exports" }
          ],
          ndaLine: "Customer under NDA · results follow at the end of the proof of value",
          downloadLabel: "Download the case summary"
        }
      },
      technology: {
        narrative: "Static exports land in zoned OCI storage with lineage preserved. A conformed model resolves records to the lowest reliable unit, plan and actual are compared with cited drivers, and anything that could not be resolved is reported as a coverage gap.",
        stack: [
          {
            key: "application",
            label: "Application / accelerator",
            summary: "The SoftServe pack: the conformed model, the comparison, the driver assembly and the review app.",
            vendors: ["softserve"],
            items: [
              { name: "Conformed data model and the mapping layer", required: true },
              { name: "Plan-versus-actual comparison and driver assembly", required: true },
              { name: "Context manager and response handler", required: true },
              { name: "The review app — findings, citations and the coverage-gap report", required: true }
            ]
          },
          {
            key: "ai-engine",
            label: "AI engine",
            summary: "NVIDIA AI-Q with NIM-served models does the reasoning, the embedding and the reranking.",
            vendors: ["nvidia"],
            items: [
              { name: "NVIDIA AI-Q framework", required: true },
              { name: "NVIDIA NIM serving the Nemotron model family", required: true },
              { name: "NVIDIA NIM embedding and reranker models", required: true }
            ]
          },
          {
            key: "data-platform",
            label: "Data & platform",
            summary: "Zoned storage with lineage, plus hybrid semantic and lexical retrieval over the evidence base.",
            vendors: ["oracle"],
            items: [
              { name: "Oracle AI Database 26ai with Oracle AI Vector Search for semantic retrieval", required: true },
              { name: "OCI Search with OpenSearch for lexical retrieval (hybrid)", required: true },
              { name: "OCI Object Storage, zoned, with lineage preserved", required: true },
              { name: "Oracle Document Understanding for OCR and layout", required: true },
              { name: "Oracle AI Data Platform — where the reconciled evidence base is built in the data layer", required: false }
            ]
          },
          {
            key: "infrastructure",
            label: "Infrastructure",
            summary: "GPU compute and the serving plumbing, in your own OCI tenancy.",
            vendors: ["oracle"],
            items: [
              { name: "OCI GPU compute", required: true },
              { name: "OCI Functions and Streaming, API Gateway, Functions/OKE", required: true }
            ]
          },
          {
            key: "custom",
            label: "Configuration & integrations",
            summary: "Source mapping, the unit identifier, variance rules and the evidence thresholds.",
            vendors: ["softserve"],
            items: [
              { name: "Approved static exports — schedule, cost and forecast reporting, progress reporting", required: true, direction: "inbound" },
              { name: "Layouts, contracts, bills of quantity and amendments", required: true, direction: "inbound" },
              { name: "The unit-level performance view and its evidence pack, in the review app", required: true, direction: "outbound" },
              { name: "A unified work-unit identifier across the exported datasets", required: true, note: "The one hard input requirement" },
              { name: "Variance rules, evidence thresholds and the coverage-gap report", required: true }
            ]
          }
        ],
        capabilities: [
          {
            stage: "Ingest & profile",
            items: [
              { name: "Approved static exports ingested and profiled, with lineage preserved" },
              { name: "Zoned storage — no live system access at proof of value" },
              { name: "OCR and layout for scanned material" },
              { name: "Text extraction, chunking, embeddings and entity extraction over the documents" }
            ]
          },
          {
            stage: "Map & resolve",
            items: [
              { name: "Conformed data model across the exported datasets" },
              { name: "Configuration-driven mapping to project, zone and unit level" },
              { name: "Records resolved at the lowest reliable level" },
              { name: "Unresolved records reported as coverage gaps, with their reason" }
            ]
          },
          {
            stage: "Compare & explain",
            items: [
              { name: "Plan-versus-actual comparison at unit level, on cost and schedule" },
              { name: "Supported variances and recurring patterns across the sample" },
              { name: "Candidate drivers, each carrying the evidence that supports it" },
              { name: "Confidence and review status on every material finding" }
            ]
          },
          {
            stage: "Review & evidence",
            items: [
              { name: "Semantic, lexical and entity retrieval routed per question" },
              { name: "A purpose-built lightweight review app, not a chat interface" },
              { name: "Citations to the source file, its version and the supporting passage" },
              { name: "The coverage-gap report" }
            ]
          }
        ]
      },
      jumpstart: {
        title: "Jumpstart Proof-of-Value",
        promise: "Pilot plan vs actual investigation on one anchor portfolio in 4–8 weeks, and get every material variance back with its likely drivers and the evidence behind them.",
        durationShort: "4–8 weeks",
        pillars: [
          { key: "fast", title: "Fast", text: "4–8 weeks from kickoff to an expert-validated readout. Discovery is compressed into the first week and ends at a gate." },
          { key: "low-risk", title: "Low-risk", text: "Approved static exports in your own Oracle tenancy, with stage gates at framework readiness, analytical review and evidence output." },
          { key: "tangible", title: "Tangible", text: "A unit-level plan-versus-actual view over your own sample, with every material finding tied to the record it came from." }
        ],
        outcomes: [
          "A unit-level plan-versus-actual view over your sample, on cost and schedule, with lineage from the source file to the finding.",
          "Variances, recurring patterns and candidate drivers, each evidence-backed and reviewed by your own experts.",
          "A coverage-gap report — what could not be resolved, and why.",
          "A measured readout on operational efficiency, output validation rate and evidence coverage."
        ],
        timeline: [
          { label: "Week 1 · Discovery", text: "Sample, sources and success thresholds agreed. The phase ends at a gate before the build starts." },
          { label: "Weeks 2–3 · Framework", text: "Exports landed in zoned storage with lineage; the conformed model and the mapping layer built against your unit identifier." },
          { label: "Weeks 3–6 · Analysis", text: "Plan against actual at unit level, then the evidence-backed output: variances, patterns and candidate drivers with their citations." },
          { label: "Weeks 6–8 · Validate", text: "Validation with your experts, the demo, the roadmap and acceptance." }
        ],
        needs: [
          "An agreed portfolio or project sample, with historical periodic records per unit",
          "A unified work-unit identifier across the exported datasets, at the lowest reliable level",
          "A validation sample of known variance cases, confirmed by your own experts"
        ],
        investment: {
          price: "Scoped per engagement",
          duration: "4–8 weeks",
          includes: [
            "One anchor portfolio or project, one agreed sample",
            "Ingestion with lineage, the conformed model and the mapping layer",
            "Plan-versus-actual comparison, variances, patterns and candidate drivers with their evidence",
            "The review app and the coverage-gap report, running in your tenancy",
            "Stage gates at framework readiness, analytical review and evidence output"
          ],
          footnote: "Figures are illustrative and confirmed in scoping."
        },
        next: [
          { tier: "Integration", text: "Live source feeds in place of static exports, extension beyond the anchor sample, production hardening.", duration: "3–5 months", price: "Scoped per engagement" },
          { tier: "Scaling", text: "More portfolios and unit types, regional variance rules, multi-entity evidence retention.", duration: "3–12 months", price: "Scoped per engagement" }
        ],
        cta: { label: "Start a Jumpstart conversation", route: "#/products/plan-vs-actual-investigation/contacts" }
      }
    },
    {
      slug: "large-document-extraction",
      name: "Large docs processing and review",
      contactPerson: "vlad-butenko",
      headline: { accent: "LARGE", rest: "DOCS PROCESSING AND REVIEW" },
      category: "documents",
      categoryChip: "Document processing",
      facet: "oci-nvidia",
      oneLiner: "Contracts reach your systems without days of keying by hand, and a wrong rate is caught at review, not on the invoice.",
      heroCaption: "100-page contract in minutes.",
      tags: ["Document processing", "OCI + NVIDIA NeMo"],
      hero: {
        image: {
          file: "assets/img/heroes/large-document-extraction.jpg",
          alt: "A deep stack of thin plates seen end-on, receding into darkness with light caught between the layers",
          focal: "50% 50%"
        }
      },
      tile: {
        outcomes: [
          "A 60–100-page contract extracted end to end in 5–15 minutes, down from 3–5 days",
          "Every extracted value carries a confidence score and a citation to its source page",
          "Reviewers validate in a split-view UI and export — they review the data, they don’t type it"
        ]
      },
      overview: {
        problemSolution: {
          problem: {
            headline: "One contract's rates take a specialist three to five days",
            text: "Operations staff read 60 to 100 pages of supplier terms and type the rate cards into the cost system, line by line. Throughput hangs on the few people who can."
          },
          solution: {
            headline: "Review the data, not type it: minutes per contract",
            text: "The values arrive already extracted, each with its page in the agreement beside it. The reviewer checks the flagged ones, approves, and exports to the cost system."
          }
        },
        metrics: [
          {
            key: "cycle-time",
            title: "Contract to system-ready data",
            kind: "proven",
            owner: "Head of contract management",
            figure: { text: "5–15 min" },
            visual: {
              form: "compression",
              unit: "minutes per 60 to 100-page agreement",
              direction: "down",
              scale: { min: 0, max: 5760 },
              before: { value: 5760, label: "3–5 days" },
              after: { value: 10, label: "5–15 min" }
            },
            line: "60 to 100 pages, end to end, the reviewer's check included."
          },
          {
            key: "onboarding",
            title: "Onboarding a new supplier",
            kind: "estimated",
            owner: "Head of procurement operations",
            figure: { prefix: "from", text: "~1 month" },
            visual: {
              form: "baseline",
              unit: "days",
              direction: "down",
              scale: { min: 0, max: 45 },
              before: { value: 30, label: "~1 month" }
            },
            line: "A new partner or site, from signature to first invoice."
          }
        ],
        features: [
          "Document-type gate, then page-level routing to the right extractor",
          "Field schema and business rules defined per document type",
          "Per-field confidence scoring with tuned thresholds and fallback logic",
          "Source-page citation on every extracted value",
          "Structured data model: ranges and tiers expanded, relationships preserved",
          "Business-rule validators that flag what a human must look at",
          "Split-view reviewer UI with bulk actions, auto-save and an audit trail",
          "Export to JSON, CSV or XLSX against a reference template"
        ],
        industriesNote: "Wherever the terms that drive a downstream system are locked inside long, semi-structured documents.",
        steps: [
          {
            n: 1,
            title: "Drop the document in",
            text: "A supplier agreement or lease goes in as a PDF, scanned or native. It is recognized by type and every page is read against the rules for that type.",
            shot: {
              full: "assets/img/steps/large-document-extraction-1.jpg",
              alt: "A 48-page agreement being processed: pages routed, fields being extracted."
            },
            features: ["Document-type gate, then page-level routing to the right extractor"]
          },
          {
            n: 2,
            title: "The rates come out as rows",
            text: "Every rate, tier and term becomes a line in the cost system's own layout, with the page it came from beside it.",
            shot: {
              full: "assets/img/steps/large-document-extraction-2.jpg",
              alt: "Routine cleaning rates as rows, each with its source page cited."
            },
            features: [
              "Field schema and business rules defined per document type",
              "Structured data model: ranges and tiers expanded, relationships preserved"
            ]
          },
          {
            n: 3,
            title: "Doubts are flagged",
            text: "A value that breaks a business rule, or reads poorly, is flagged with the fix suggested and the source shown, so the reviewer looks only where it matters.",
            shot: {
              full: "assets/img/steps/large-document-extraction-3.jpg",
              alt: "A flagged tier: the validator's finding, suggested fix 22, source page 9."
            },
            features: [
              "Per-field confidence scoring with tuned thresholds and fallback logic",
              "Source-page citation on every extracted value",
              "Business-rule validators that flag what a human must look at"
            ]
          },
          {
            n: 4,
            title: "Approve and export",
            text: "The reviewer signs off the rows, and only approved data leaves for the cost or ERP system, in its own import format.",
            shot: {
              full: "assets/img/steps/large-document-extraction-4.jpg",
              alt: "After Approve all: every rate group approved, beside the agreement's rate card."
            },
            features: [
              "Split-view reviewer UI with bulk actions, auto-save and an audit trail",
              "Export to JSON, CSV or XLSX against a reference template"
            ]
          }
        ],
        industryCases: [
          {
            industry: "travel-transport",
            label: "Travel & transport",
            image: "assets/img/industries/travel-transport.jpg",
            problem: "Ground-handling agreements run to 60–100 pages, and their rate cards are keyed into the cost system by hand — 3–5 days per contract, about a month to bring a new station online. A rate keyed wrong surfaces late, at invoice matching, and ground handling carries 7–12% of an airline's direct operating cost.",
            solution: "Rate-card pricing is extracted from the agreement with a confidence score and a page citation on every value, and a reviewer validates it beside the source PDF before export. The same pipeline pulls rates, terms and return conditions from aircraft lease and MRO agreements."
          },
          {
            industry: "professional-services",
            label: "Professional services",
            image: "assets/img/industries/professional-services.jpg",
            problem: "Key terms, obligations, pricing and renewal dates sit inside master agreements and supplier contracts that nobody has time to re-read. Obligations are tracked in a spreadsheet built once, by hand, and drifting ever since.",
            solution: "The agreed fields are extracted per contract type against business rules, each value cited to the clause it came from, and reviewed before they reach the system that acts on them. Property leases run through the same path for rent schedules, break clauses and escalation terms."
          },
          {
            industry: "insurance",
            label: "Insurance",
            image: "assets/img/industries/insurance.jpg",
            problem: "Coverage, limits, deductibles and endorsements are re-keyed from policy schedules, and loss details and reserve amounts from claim packs and loss-adjuster reports. Throughput depends on scarce specialists, so backlogs build.",
            solution: "Policy and claim documents are classified and routed page by page, the target fields extracted against your rules with ranges and tiers expanded into normalized rows. Validators flag the exceptions, and the reviewer validates only those against the cited page."
          },
          {
            industry: "financial-services",
            label: "Financial services",
            image: "assets/img/industries/financial-services.jpg",
            problem: "Financial line items and disclosures are pulled out of annual reports by hand, and covenants, interest terms and repayment schedules out of loan and credit agreements. The work is slow, and an error is found downstream rather than at the source.",
            solution: "Each document type gets its own field schema and validator set, and every extracted value arrives with a confidence score and a page reference. The human validates by design — unattended extraction is explicitly out of scope."
          }
        ],
        scope: {
          in: [
            "Ingestion — accept a document (PDF or DOCX, including scanned)",
            "Classification and extraction of the agreed fields against business rules",
            "Per-value source citations and per-field confidence scoring",
            "Human review and correction in the split-view UI before export",
            "Export to JSON, CSV or XLSX against a reference template"
          ],
          out: [
            "Matching or reconciliation against another system of record",
            "Non-document data sources — reference tables, catalogs or external systems, not document text",
            "Full automation without human validation — a human validates by design",
            "Write-back and system integration — delivered after the Jumpstart",
            "Native multi-language processing — English at proof of value; more is custom work",
            "Production hardening: enterprise scale, security audit, HA/DR, IAM/SSO"
          ]
        },
        caseStudy: {
          descriptor: "An international airline",
          area: "Ground-handling contract management",
          industry: "travel-transport",
          status: "measured",
          metrics: [
            { value: "5–15 min a contract", label: "to extract 60–100 pages end to end, down from 3–5 days" }
          ],
          story: "Ground-handling contract rates were keyed into a cost-management system by hand — 60–100-page agreements read page by page. The extraction app runs on the customer’s own Oracle Cloud Infrastructure tenancy with NVIDIA AI-Q: reviewers validate AI-extracted rates beside the source PDF, every value cited to its page, and export in minutes. Measured end to end on the customer’s own agreements during the proof of value; figures are illustrative, not contractual.",
          scope: [
            { label: "Document footprint", value: "60–100-page agreements" },
            { label: "Onboarding a new station, before", value: "About one month" },
            { label: "Human gate", value: "A reviewer approves every extracted value" }
          ],
          ndaLine: "Customer under NDA · reference call available on request",
          downloadLabel: "Download the case summary"
        }
      },
      technology: {
        narrative: "Contracts land from your repository into the extraction app on a dedicated AI cluster in your own Oracle Cloud Infrastructure tenancy. NVIDIA AI-Q returns every field with a confidence score and a page citation; only approved rows are exported.",
        stack: [
          {
            key: "application",
            label: "Application / accelerator",
            summary: "The SoftServe pack: the extraction pipeline, the validator set, the split-view reviewer UI and export.",
            vendors: ["softserve"],
            items: [
              { name: "Extraction pipeline and field schema", required: true },
              { name: "Validator set and confidence thresholds", required: true },
              { name: "Split-view reviewer UI with bulk actions, auto-save and an audit trail", required: true },
              { name: "Export and target-system integration", required: false, note: "After the Jumpstart" }
            ]
          },
          {
            key: "ai-engine",
            label: "AI engine",
            summary: "NVIDIA AI-Q reads the pages — vision-language models plus retrieval, GPU-accelerated.",
            vendors: ["nvidia"],
            items: [
              { name: "NVIDIA AI-Q for GPU-accelerated extraction — vision-language models plus retrieval", required: true }
            ]
          },
          {
            key: "data-platform",
            label: "Data & platform",
            summary: "The extraction store, plus OCR and layout where the input is scanned.",
            vendors: ["oracle"],
            items: [
              { name: "Oracle Autonomous Database as the extraction store", required: true },
              { name: "Oracle Document Understanding for OCR and layout, where scanned input needs it", required: false },
              { name: "Oracle AI Data Platform — only where extractions also feed analytics", required: false, note: "Not the system of record for this pack" }
            ]
          },
          {
            key: "infrastructure",
            label: "Infrastructure",
            summary: "A dedicated GenAI cluster in your own tenancy, with the landing zone delivered as code.",
            vendors: ["oracle"],
            items: [
              { name: "A dedicated GenAI AI cluster (H100 class)", required: true },
              { name: "The landing zone (VCN, OKE, storage) delivered as Terraform", required: true }
            ]
          },
          {
            key: "custom",
            label: "Configuration & integrations",
            summary: "The field schema, the business rules, the thresholds and the target-system integration.",
            vendors: ["softserve"],
            items: [
              { name: "Source contracts from your repository — PDF and DOCX, including scanned", required: true, direction: "inbound" },
              { name: "Extracted data, rates and terms, cited, into the cost or ERP system", required: true, direction: "outbound", note: "After the Jumpstart" },
              { name: "Field schema and business rules per document type", required: true },
              { name: "Confidence thresholds and fallback logic", required: true },
              { name: "Export formats: JSON, CSV or XLSX against a reference template", required: true }
            ]
          }
        ],
        capabilities: [
          {
            stage: "Classification & routing",
            items: [
              { name: "PDF and DOCX upload, including scanned input" },
              { name: "Format handling, OCR and page splitting" },
              { name: "Document-type gate" },
              { name: "Page-level routing to the right extractor" }
            ]
          },
          {
            stage: "Extraction",
            items: [
              { name: "Field schema and business rules per document type" },
              { name: "Document header and metadata extraction" },
              { name: "Per-field confidence scoring with tuned thresholds" },
              { name: "Fallback logic when a page label or a field scores low" },
              { name: "Structured data model — ranges and tiers expanded, parent-child relationships preserved" },
              { name: "Source-page citation on every extracted value" }
            ]
          },
          {
            stage: "Review & export",
            items: [
              { name: "Split-view reviewer UI — source PDF beside the extracted rows" },
              { name: "Per-row confidence badges" },
              { name: "Approve, edit or reject per row, with bulk actions, auto-save and an audit trail" },
              { name: "Exception routing for low-confidence and flagged items" },
              { name: "Export to JSON, CSV or XLSX against a reference template" }
            ]
          },
          {
            stage: "Quality & integrations",
            items: [
              { name: "Business-rule validators and reviewer warnings" },
              { name: "Accuracy measured against an annotated ground-truth set" },
              { name: "Effort-savings KPIs against today’s cycle time" },
              { name: "Contract repository as the source, the cost or ERP system as the target" }
            ]
          }
        ]
      },
      jumpstart: {
        title: "Jumpstart Proof-of-Value",
        promise: "Pilot large-document processing and review on your own contracts in 4–8 weeks, at a fixed price, and see extraction accuracy and effort saved measured against the baseline you signed.",
        durationShort: "4–8 weeks",
        pillars: [
          { key: "fast", title: "Fast", text: "4–8 weeks from kickoff to a measured accuracy and effort readout on your own contracts." },
          { key: "low-risk", title: "Low-risk", text: "Fixed scope at a fixed price: manual upload, one document type, the core field schema. It runs sandboxed in your own Oracle tenancy, and nothing is written into your cost or ERP system." },
          { key: "tangible", title: "Tangible", text: "A 60–100-page contract extracted end to end in minutes, every value cited to its page and validated by your own reviewer before export." }
        ],
        outcomes: [
          "Your own contracts extracted end to end, with per-field confidence and a page citation on every value.",
          "Accuracy measured against an annotated ground-truth set, plus an effort-savings readout against today’s cycle time.",
          "The split-view reviewer UI running in your tenancy.",
          "A costed plan for integration: the target system, the second document type, production hardening."
        ],
        timeline: [
          { label: "Week 0 · Gate", text: "Sponsor named, two to three success metrics signed, source access approved in writing." },
          { label: "Weeks 1–4 · Build", text: "One document type: field schema, business rules, confidence thresholds and validators configured on your own contracts." },
          { label: "Weeks 5–7 · Review", text: "Your reviewers validate in the split-view UI; accuracy is measured against the annotated ground truth." },
          { label: "Week 8 · Decision", text: "Accuracy and effort-savings readout against the signed baseline, and a costed proposal for the next step." }
        ],
        needs: [
          "A sample of real contracts of one document type, and the fields you need out of them",
          "An annotated ground-truth set to measure accuracy against",
          "A business owner and the reviewers who will validate the output"
        ],
        investment: {
          price: "€75K services · €0/mo infrastructure",
          duration: "4–8 weeks",
          includes: [
            "Classification and page-level routing",
            "Extraction rules and the core field schema",
            "Confidence scoring, validators and the human-in-the-loop review UI",
            "Accuracy benchmarking and the KPI readout",
            "Sandboxed deployment in your own tenancy"
          ],
          footnote: "Figures are illustrative and confirmed in scoping."
        },
        next: [
          { tier: "Integration", text: "Full setup and integration, live for one document type: source and target systems connected, the full field schema, production deployment.", duration: "3–5 months", price: "€300–500K services · ~€10K/mo infrastructure, depending on document volume, page counts and pipeline complexity" },
          { tier: "Scaling", text: "Across document types, volume and business units, with type-specific schemas and validation.", duration: "3–12 months", price: "Scoped per engagement" }
        ],
        cta: { label: "Start a Jumpstart conversation", route: "#/products/large-document-extraction/contacts" }
      }
    },
    {
      slug: "workforce-optimization",
      name: "Workforce optimization",
      contactPerson: "vlad-butenko",
      headline: { accent: "WORKFORCE", rest: "OPTIMIZATION" },
      category: "forecasting-optimization",
      categoryChip: "Forecasting & optimization",
      facet: "oci-nvidia",
      oneLiner: "The same technicians complete more jobs a day, with less driving and waiting, on a four-week plan balanced across every zone.",
      heroCaption: "What if dispatchers reviewed the plan, not built it?",
      tags: ["Forecasting & optimization", "OCI + NVIDIA NeMo"],
      hero: {
        image: {
          file: "assets/img/heroes/workforce-optimization.jpg",
          alt: "An overhead field of interlocking hexagonal plates, with loose ones still settling into the pattern from above",
          focal: "50% 55%"
        }
      },
      tile: {
        outcomes: [
          "A region’s four-week plan optimized and approved in ~30 minutes, down from ~2 days",
          "Dispatchers review the plan instead of building it — then export it straight to Oracle Field Service",
          "Native Oracle Field Service integration: known endpoints, no requirement engineering"
        ]
      },
      overview: {
        problemSolution: {
          problem: {
            headline: "Two days to plan one region's month, by hand",
            text: "Dispatchers assign technicians to zones and jobs, juggling skills, absences and travel. Workloads come out uneven and customers wait longer for a visit."
          },
          solution: {
            headline: "A solved month to review in half an hour",
            text: "The month arrives solved against every rule at once. Dispatchers see what changed and why on the map, adjust, approve, and send it to the field-service system."
          }
        },
        metrics: [
          {
            key: "planning-time",
            title: "Time to plan a region's four weeks",
            kind: "proven",
            owner: "VP of field service",
            figure: { text: "~30 min" },
            visual: {
              form: "compression",
              unit: "elapsed time",
              direction: "down",
              scale: { min: 0, max: 2880 },
              before: { value: 2880, label: "~2 days" },
              after: { value: 30, label: "~30 min" }
            },
            line: "Optimized and approved by the dispatcher, end to end."
          },
          {
            key: "jobs-per-tech",
            title: "Jobs per technician per day",
            kind: "estimated",
            owner: "VP of field service",
            figure: { text: "+4 to +10%" },
            visual: {
              form: "range",
              unit: "percent",
              direction: "up",
              scale: { min: 0, max: 15 },
              before: { value: 0, label: "current rate" },
              range: { lo: 4, hi: 10, label: "+4 to +10%" }
            },
            line: "Visits completed per working day, on today's headcount."
          }
        ],
        features: [
          "Work-zone and availability rules, with skill-based allocation",
          "Planned-vacation reallocation and same-day sickness handling",
          "Default, neighboring and cross-zone allocation",
          "Forecast-based allocation against a demand forecast you supply",
          "Commitment rules: non-movable appointments and SLA types per appointment *",
          "Multi-objective optimization with hard and soft rule weighting",
          "Dispatcher review UI: map and table views, approve, reject, re-run",
          "KPIs and analytics: productivity, utilization, travel, workload balance"
        ],
        industriesNote: "Any mobile field force planned against skills, availability and geography.",
        /* Round 20: the rules are set in step 1, so the flow is four steps. */
        steps: [
          {
            n: 1,
            title: "Load the month",
            text: "Bookings, technicians, skills, absences and zones come in from the field-service system, with the rules that apply: who may do what, where, and which appointments cannot move.",
            shot: {
              full: "assets/img/steps/workforce-optimization-1.jpg",
              alt: "The Run optimization dialog with the four-week planning file uploaded."
            },
            features: [
              "Work-zone and availability rules, with skill-based allocation",
              "Planned-vacation reallocation and same-day sickness handling",
              "Default, neighboring and cross-zone allocation",
              "Forecast-based allocation against a demand forecast you supply",
              "Commitment rules: non-movable appointments and SLA types per appointment *"
            ]
          },
          {
            n: 2,
            title: "Solve it in minutes",
            text: "Every technician, zone and job is planned against all the rules at once, weighing travel, waiting time and workload balance.",
            shot: {
              full: "assets/img/steps/workforce-optimization-2.jpg",
              alt: "The solver mid-run: input checked, rules loaded, GPU solve running."
            },
            features: ["Multi-objective optimization with hard and soft rule weighting"]
          },
          {
            n: 3,
            title: "See what changed and why",
            text: "Each change carries its reason: a vacation covered, a sick day split, a postcode picked up. The dispatcher keeps or undoes it.",
            shot: {
              full: "assets/img/steps/workforce-optimization-3.jpg",
              alt: "The solver's changes beside the zone map: a vacation covered, a sick day split."
            },
            features: ["Dispatcher review UI: map and table views, approve, reject, re-run"]
          },
          {
            n: 4,
            title: "Approve and measure",
            text: "The dispatcher approves it and sends it to the field. Jobs per technician, capacity used and wait time are read on the same formulas as today's.",
            shot: {
              full: "assets/img/steps/workforce-optimization-4.jpg",
              alt: "Plan v2 against today: jobs per technician +4.5%, capacity +3 pts."
            },
            features: ["KPIs and analytics: productivity, utilization, travel, workload balance"]
          }
        ],
        industryCases: [
          {
            industry: "manufacturing",
            label: "Manufacturing",
            image: "assets/img/industries/manufacturing.jpg",
            problem: "In-home repair of manufactured goods is planned by hand: work zones and technician allocations, region by region, juggling skills, spare parts, travel and absences. Urgent call-outs and no-shows mean re-planning the day.",
            solution: "The solver plans the whole region against skills, parts, travel and existing bookings at once, and the dispatcher reviews and approves the result. Rules that differ by market — working time, holidays, service commitments — are configuration, so setting up a new region is a configuration job."
          },
          {
            industry: "utilities",
            label: "Utilities",
            image: "assets/img/industries/utilities.jpg",
            problem: "Water, gas and electric crews are scheduled across service territories against SLAs, crew certifications and outage spikes. Planned and emergency work compete for the same capacity, and the balance is struck manually by a handful of senior dispatchers.",
            solution: "Territories, certifications and SLA commitments become weighted constraints, and the plan is re-solved as the day's demand changes. Planned and emergency work are balanced against the objectives you weight, and no allocation reaches a crew until a dispatcher approves it."
          },
          {
            industry: "telecom",
            label: "Telecom & cable",
            image: "assets/img/industries/telecom.jpg",
            problem: "Install-and-repair technicians have to be routed to tight appointment windows across regions, matched to line skills. Missed windows cost customer satisfaction directly, and launching a new service zone depends on scarce planning expertise.",
            solution: "Appointment windows and line skills are modeled as commitment and skill rules, and the solver routes against them while minimizing travel. Launching a new zone comes down to a configuration change."
          },
          {
            industry: "healthcare",
            label: "Healthcare",
            image: "assets/img/industries/healthcare.jpg",
            problem: "Medical-device and equipment service engineers are allocated to contracted assets by skill, SLA and location. Uptime on high-value machines is contractual, and the allocation is worked out by hand against a rising number of installed assets.",
            solution: "Contracted SLAs, engineer certifications and asset locations become the constraint set the solver works against, with uptime-critical commitments weighted as hard rules. The KPI readout compares the current and the optimized plan on identical definitions."
          }
        ],
        scope: {
          in: [
            "Foundational allocation with the recurring, most-typical constraints — zones, skills, planned absences",
            "Core KPIs predicted at scheduling and measured against the signed benchmark",
            "The dispatcher review UI, with approve, reject and re-run",
            "Sandboxed deployment on your own tenancy",
            "A before/after KPI readout computed identically on both plans"
          ],
          out: [
            "Oracle Field Service integration — delivered after the Jumpstart",
            "Additional data sources and BI integration — delivered after the Jumpstart",
            "The re-optimization feedback loop — delivered after the Jumpstart",
            "Live-traffic travel rules, within-day reassignment, spare-parts and crew-based assignment — on the roadmap"
          ]
        },
        caseStudy: {
          descriptor: "A global home-appliance manufacturer",
          area: "Field-service operations across three countries",
          industry: "manufacturing",
          status: "modeled",
          metrics: [
            { value: "+4.5% productivity", label: "median gain in jobs per technician per day, optimized against the current plan" },
            { value: "~5x", label: "return within three years on the modeled rollout" }
          ],
          story: "Dispatchers planned a residential appliance-repair field force by hand — postcode-based work zones and technician allocations, region by region. NVIDIA cuOpt on Oracle Cloud Infrastructure was run against the customer’s own historical operations data with dispatcher approval in the loop: 83% of the 12 modeled simulations came out positive, and dispatcher productivity improved 15–20% during the pilot. Figures are forecast from those simulations against the customer’s own historical baseline; illustrative, not contractual.",
          scope: [
            { label: "Duration", value: "Three months" },
            { label: "Data footprint", value: "Historical operations data" },
            { label: "Constraints modeled", value: "Around thirty" }
          ],
          ndaLine: "Customer under NDA · reference call available on request",
          downloadLabel: "Download the case summary"
        }
      },
      technology: {
        narrative: "Oracle Field Service is both the source and the destination. NVIDIA cuOpt computes the allocation on a dedicated AI cluster on Oracle Cloud Infrastructure, and the approved plan is written back — nothing reaches the field until a dispatcher approves it.",
        stack: [
          {
            key: "application",
            label: "Application / accelerator",
            summary: "The SoftServe pack: the dispatcher UI, the approval workflow, the re-solve loop and the KPI layer.",
            vendors: ["softserve"],
            items: [
              { name: "Dispatcher review UI and approval workflow", required: true },
              { name: "Re-solve loop", required: true },
              { name: "KPI and analytics layer — productivity, utilization, travel, workload balance", required: true },
              { name: "Write-back to Oracle Field Service", required: false, note: "After the Jumpstart" }
            ]
          },
          {
            key: "ai-engine",
            label: "AI engine",
            summary: "NVIDIA cuOpt solves the technician-to-zone-to-job plan on GPUs.",
            vendors: ["nvidia"],
            items: [
              { name: "NVIDIA cuOpt, the GPU-accelerated optimization solver", required: true }
            ]
          },
          {
            key: "data-platform",
            label: "Data & platform",
            summary: "Oracle Field Service is both the source and the destination; storage holds the period's data.",
            vendors: ["oracle"],
            items: [
              { name: "Oracle Field Service, as source and destination", required: true },
              { name: "OCI Object Storage for the period's data", required: true }
            ]
          },
          {
            key: "infrastructure",
            label: "Infrastructure",
            summary: "A dedicated GPU cluster in your own tenancy, with its networking and IAM.",
            vendors: ["oracle"],
            items: [
              { name: "A dedicated AI cluster (4–8 NVIDIA A100 GPUs)", required: true },
              { name: "Object storage, networking and IAM", required: true }
            ]
          },
          {
            key: "custom",
            label: "Configuration & integrations",
            summary: "Client rules, constraints, KPI definitions and the data integrations.",
            vendors: ["softserve"],
            items: [
              { name: "From Oracle Field Service: staff, availability and booking data", required: true, direction: "inbound" },
              { name: "Back from Oracle Field Service: factual durations and times", required: false, direction: "inbound" },
              { name: "To Oracle Field Service: optimized allocations — zones and visits", required: true, direction: "outbound", note: "After the Jumpstart" },
              { name: "Up to five further integrations — booking, inventory, HR/WFM, demand forecasting, BI", required: false, direction: "inbound", note: "After the Jumpstart" },
              { name: "Client rules, constraints and KPI definitions", required: true }
            ]
          }
        ],
        capabilities: [
          {
            stage: "Load the period's data",
            items: [
              { name: "Oracle Field Service as the source for demand, availability, skills and bookings — delivered after the Jumpstart" },
              { name: "Demand forecasting, booking, inventory, HR/WFM and BI sources — delivered after the Jumpstart" },
              { name: "Skill-based allocation", state: "supported" },
              { name: "Maximum load per day", state: "supported" },
              { name: "Planned-vacation reallocation and same-day sickness handling", state: "supported" }
            ]
          },
          {
            stage: "Set the rules",
            items: [
              { name: "Default work zones per technician, and work-zone-level demand", state: "supported" },
              { name: "Neighboring work zones and cross-zone allocation", state: "supported" },
              { name: "Forecast-based allocation against a demand forecast you supply", state: "supported" },
              { name: "Non-movable appointments and SLA types per appointment", state: "partial" },
              { name: "Client rules, constraints and KPI definitions, configured per engagement" },
              { name: "Distance and travel-time rules with live traffic data", state: "roadmap" },
              { name: "Spare-parts availability and crew-based assignment", state: "roadmap" }
            ]
          },
          {
            stage: "Solve the plan",
            items: [
              { name: "Multi-objective optimization with hard and soft rule weighting", state: "supported" },
              { name: "Minimal disruption of the current allocation", state: "supported" },
              { name: "A region's four-week plan solved on GPU-accelerated cuOpt, in minutes" },
              { name: "Within-day job reassignment and urgent-request handling", state: "roadmap" }
            ]
          },
          {
            stage: "Review, approve, measure",
            items: [
              { name: "Dispatcher UI with map and table views", state: "supported" },
              { name: "Dispatcher approval or rejection before anything reaches the field", state: "supported" },
              { name: "Model-decision explanations and recommendations", state: "supported" },
              { name: "KPI readout: jobs per technician per working day, capacity utilization, travel reduction, workload balance", state: "supported" },
              { name: "The current plan against the optimized plan, computed on identical definitions" },
              { name: "The approved plan written back to Oracle Field Service — delivered after the Jumpstart" },
              { name: "Iterative feedback-based re-optimization", state: "roadmap" },
              { name: "Human-feedback-driven tuning and what-if alternatives", state: "roadmap" }
            ]
          }
        ]
      },
      jumpstart: {
        title: "Jumpstart Proof-of-Value",
        promise: "Pilot workforce optimization on your own historical data in 4–8 weeks, at a fixed price, and take away a before/after KPI readout your dispatchers have signed off.",
        durationShort: "4–8 weeks",
        pillars: [
          { key: "fast", title: "Fast", text: "4–8 weeks from kickoff to a before/after KPI readout on a real region of your own." },
          { key: "low-risk", title: "Low-risk", text: "Fixed scope at a fixed price: manual data import, the recurring constraints, a sandboxed environment on your own tenancy. A dispatcher approves every plan before anything reaches the field." },
          { key: "tangible", title: "Tangible", text: "An optimized four-week plan for one region, measured against your current plan on identical KPI definitions." }
        ],
        outcomes: [
          "An optimized four-week plan for one real region, computed on your own historical data.",
          "A before/after KPI readout — productivity, capacity utilization and wait time — computed identically on the current and the optimized plan.",
          "The dispatcher review UI running in a sandboxed environment on your tenancy.",
          "A costed plan for the next step: integration scope, additional sources, timeline."
        ],
        timeline: [
          { label: "Week 0 · Gate", text: "Sponsor named, two to three success metrics signed, the baseline and source access approved in writing." },
          { label: "Weeks 1–4 · Build", text: "The period’s data imported; zones, skills, absences and commitment rules configured and weighted against your objectives." },
          { label: "Weeks 5–7 · Review", text: "Dispatchers compare the current and the optimized plan on a live map, approve or re-run." },
          { label: "Week 8 · Decision", text: "Before/after KPI readout against the signed benchmark, and a costed proposal for the next step." }
        ],
        needs: [
          "One real region and a period of historical planning data — demand, availability, skills, work zones and bookings",
          "The allocation rules that actually apply: zones, skills, absences, service commitments",
          "A dispatcher and a business owner who will review the plan and sign the baseline"
        ],
        investment: {
          price: "€90K services · €4K/mo infrastructure",
          duration: "4–8 weeks",
          includes: [
            "Foundational allocation with the recurring, most-typical constraints — zones, skills, planned absences",
            "Core KPIs predicted at scheduling and measured against the signed benchmark",
            "The dispatcher review UI, with approve, reject and re-run",
            "Sandboxed deployment on your own tenancy"
          ],
          footnote: "Figures are illustrative and confirmed in scoping."
        },
        next: [
          { tier: "Integration", text: "Full setup and integration, live at one location: Oracle Field Service integration, additional data sources and BI, the re-optimization feedback loop, on a dedicated landing zone with IAM and observability.", duration: "3–5 months", price: "€300–500K services · ~€25K/mo infrastructure, depending on usage and rule complexity" },
          { tier: "Scaling", text: "Across locations, with per-region rule sets and data workflows, deployed multi-zone.", duration: "3–12 months", price: "Scoped per engagement" }
        ],
        cta: { label: "Start a Jumpstart conversation", route: "#/products/workforce-optimization/contacts" }
      }
    },
    {
      slug: "cross-system-erp-qa",
      name: "Cross-system ERP Q&A",
      contactPerson: "oleksii-orlov",
      headline: { accent: "CROSS-SYSTEM", rest: "ERP Q&A" },
      category: "knowledge-analytics",
      categoryChip: "Enterprise knowledge & analytics",
      facet: ["oracle-ai-lakehouse", "oracle-ai-data-platform"],
      oneLiner: "Managers get answers across the ERP and CRM on their own, while the decision is still open, instead of weeks later in a report.",
      heroLine: "Which late orders hurt our best accounts?",
      badges: ["ERP + CRM + THE SYSTEMS AROUND THEM", "PREBUILT PIPELINES", "ANSWERS IN MINUTES"],
      tags: ["Enterprise knowledge & analytics", "AI Lakehouse", "AI Data Platform"],
      hero: {
        image: {
          file: "assets/img/heroes/cross-system-erp-qa.jpg",
          alt: "Many parallel metal ribs sweeping together into one continuous curved surface",
          focal: "50% 50%"
        }
      },
      tile: {
        outcomes: [
          "Routine answers without report requests",
          "One decision domain shaped into certified views, with sensitive fields masked by role",
          "A governed foundation that persists after the proof: certified views, definitions and security policies you keep"
        ]
      },
      overview: {
        problemSolution: {
          problem: {
            headline: "The answer sits in three systems and a BI queue",
            text: "Orders sit in the ERP, customers in the CRM, deliveries with carriers. An operations lead needs the three joined for one decision, files a report request, and decides without it."
          },
          solution: {
            headline: "Ask once, get one ranked answer in minutes",
            text: "The question is settled over every system it spans, with the money at risk per account and the action to take. Report requests stop."
          }
        },
        metrics: [
          {
            key: "queue-time",
            title: "Time an answer waits in the BI queue",
            kind: "estimated",
            owner: "VP of commercial operations",
            figure: { prefix: "from", text: "weeks" },
            visual: {
              form: "compression",
              unit: "elapsed time",
              direction: "down",
              scale: { min: 0, max: 336 },
              before: { value: 336, label: "weeks" },
              after: { value: 0.1, label: "minutes" }
            },
            line: "From asking to a ranked list the team can act on."
          },
          {
            key: "data-prep",
            title: "Data-team time spent preparing data",
            kind: "estimated",
            owner: "Head of data and analytics",
            figure: { prefix: "from", text: "~40%" },
            visual: {
              form: "baseline",
              unit: "percent of a data team's week",
              direction: "down",
              scale: { min: 0, max: 100 },
              before: { value: 40, label: "~40%" }
            },
            line: "Pulling and cleaning extracts before anyone gets an answer."
          }
        ],
        features: [
          "Prebuilt pipelines from Oracle applications — no extract engineering",
          "One or two non-Oracle sources joined in, by link or by pipeline",
          "Certified views for one decision domain, on signed-off definitions",
          "Plain-English question answering over the governed schema",
          "Two to three operational dashboards over the joined data",
          "Sensitive fields masked by role, enforced in the data layer",
          "A governed foundation that persists after the proof"
        ],
        industriesNote: "The same two pains in every industry, regardless of stack — what varies is the system landscape.",
        steps: [
          {
            n: 1,
            title: "Ask the question",
            text: "An operations lead types the question as they would ask a colleague: which orders are at risk this week, and what they are worth.",
            shot: {
              full: "assets/img/steps/cross-system-erp-qa-1.jpg",
              alt: "The question asked in Agent Hub; the order agent reads three ERPs."
            },
            features: ["Plain-English question answering over the governed schema"]
          },
          {
            n: 2,
            title: "Every system is read",
            text: "Order lines, customer tiers, stock, credit holds and carrier scans are read together from the systems that hold them, as they are.",
            shot: {
              full: "assets/img/steps/cross-system-erp-qa-2.jpg",
              alt: "Data Studio's Live Feed: the sources feeding the lakehouse, with freshness."
            },
            features: [
              "Prebuilt pipelines from Oracle applications — no extract engineering",
              "One or two non-Oracle sources joined in, by link or by pipeline"
            ]
          },
          {
            n: 3,
            title: "One answer, with the money",
            text: "Late lines come back as one ranked list with the cause, the revenue at risk and the accounts exposed, on definitions the business signed off.",
            shot: {
              full: "assets/img/steps/cross-system-erp-qa-3.jpg",
              alt: "Recommendations: revenue at risk USD 4.18 M, 9 tier-A accounts exposed."
            },
            features: [
              "Certified views for one decision domain, on signed-off definitions",
              "Two to three operational dashboards over the joined data"
            ]
          },
          {
            n: 4,
            title: "Decide and act",
            text: "Each proposed action becomes a task for its owner; sensitive fields stay hidden by role, and every answer is logged.",
            shot: {
              full: "assets/img/steps/cross-system-erp-qa-4.jpg",
              alt: "Why the lines are late, and four proposed actions, each assigned as a task."
            },
            features: [
              "Sensitive fields masked by role, enforced in the data layer",
              "A governed foundation that persists after the proof"
            ]
          }
        ],
        industryCases: [
          {
            industry: "cross-industry",
            label: "Every industry",
            image: "assets/img/industries/cross-industry.jpg",
            problem: "The same two pains turn up in every sector, whatever the stack. Every answer is a project — the BI backlog runs in weeks, so the business answers itself in a spreadsheet, and the same KPI comes back as two different numbers from two dashboards. Every acquisition and every new application adds another island nobody has integrated.",
            solution: "The join is done once, in the data, and every question reads from it: one governed layer under the applications, filled from Oracle applications by pipelines that already exist, with a plain-English answer surface on top. What shapes the work is the system landscape, so the same shape fits wherever the applications sit."
          },
          {
            industry: "manufacturing",
            label: "Manufacturing",
            image: "assets/img/industries/manufacturing.jpg",
            problem: "Supplier spend sits in the ERP, supplier performance in a second system and the contracts in a third. A procurement lead asking which suppliers are driving the overrun files a report request and waits, and the answer lands after the negotiation.",
            solution: "Purchase-order, invoice-status and supplier-spend questions are answered in plain language over ERP data joined with the systems around it. The standing report requests stop, and the certified views the answers run on are the same ones the dashboards use."
          },
          {
            industry: "logistics",
            label: "Logistics & supply chain",
            image: "assets/img/industries/logistics.jpg",
            problem: "The ERP knows orders and invoices, the CRM knows customers, and carriers, e-commerce and spreadsheets know the rest. A question as ordinary as which delayed orders are hurting the best accounts crosses two systems or more, lands in a queue, and comes back already stale.",
            solution: "Those sources are joined into one governed layer, and an operations lead slices SLA, backlog and throughput metrics without waiting on a data engineer. Sensitive fields stay masked by role, enforced by the database rather than by the prompt."
          }
        ],
        scope: {
          in: [
            "Prebuilt Oracle application pipelines switched on",
            "One or two non-Oracle sources linked or landed alongside",
            "One decision domain shaped into certified views",
            "Plain-English Q&A plus two to three operational dashboards",
            "Masking and row-level access enforced in the data layer"
          ],
          out: [
            "Live production integration — after the Jumpstart",
            "More sources and more decision domains — after the Jumpstart",
            "Production SLAs — after the Jumpstart",
            "Multi-entity rollout and per-region governance — at scale",
            "Write-back to the source applications: the system retrieves, it does not act"
          ]
        },
        caseStudy: null
      },
      technology: {
        narrative: "Oracle Autonomous AI Lakehouse is the governed layer. Data from Oracle applications arrives through pipelines that ship with the products, one or two other sources are linked alongside, and Select AI answers in plain language over that model. Where Oracle AI Data Platform is in place, its catalog registers that model without a copy, and the platform’s agents read the same certified views.",
        stack: [
          {
            key: "application",
            label: "Application / accelerator",
            summary: "What SoftServe builds on top: the decision domain, its certified views, the question set and the dashboards.",
            vendors: ["softserve"],
            items: [
              { name: "The decision domain and its certified views", required: true },
              { name: "Business definitions signed off with the owner", required: true },
              { name: "The agreed question set, tuned with the business", required: true },
              { name: "Two to three operational dashboards over the joined data", required: true }
            ]
          },
          {
            key: "data-platform",
            label: "Data & platform",
            summary: "Oracle Autonomous AI Lakehouse is the governed layer, with Select AI answering over it, on its own or inside Oracle AI Data Platform.",
            vendors: ["oracle"],
            items: [
              { name: "Oracle Autonomous AI Database 26ai as the governed layer", required: true },
              { name: "Select AI and Select AI Agent for natural-language querying", required: true },
              { name: "Data Studio for ELT", required: true },
              { name: "Database links for federation", required: true },
              { name: "Apache Iceberg", required: false },
              { name: "Vector search", required: false },
              { name: "Oracle AI Data Platform — the governed layer registered in its catalog, so its agents reuse the certified views", required: false }
            ]
          },
          {
            key: "infrastructure",
            label: "Infrastructure",
            summary: "A managed service in your own tenancy — nothing to size, nothing to run.",
            vendors: ["oracle"],
            items: [
              { name: "Your own tenancy — OCI, or Autonomous inside AWS, Azure or Google Cloud regions", required: true },
              { name: "The managed Autonomous service — no cluster to size or operate", required: true }
            ]
          },
          {
            key: "custom",
            label: "Configuration & integrations",
            summary: "The sources connected, the governance configured, and how answers come back.",
            vendors: ["softserve"],
            items: [
              { name: "Oracle application data through the pipelines that ship with the products", required: true, direction: "inbound" },
              { name: "One or two non-Oracle sources, by link or by pipeline; read-only access", required: true, direction: "inbound" },
              { name: "Plain-English answers, certified views and operational dashboards", required: true, direction: "outbound" },
              { name: "Dynamic masking, row-level policies and the SQL firewall", required: true },
              { name: "Tenancy choice — OCI, or Autonomous inside AWS, Azure or Google Cloud regions", required: true }
            ]
          }
        ],
        capabilities: [
          {
            stage: "Connect",
            items: [
              { name: "Prebuilt pipelines from Oracle applications — no extract engineering" },
              { name: "One or two non-Oracle sources joined in, by link or by pipeline" },
              { name: "Data Studio for ELT" },
              { name: "Database links for federation" },
              { name: "Read-only source access" }
            ]
          },
          {
            stage: "Model",
            items: [
              { name: "Certified views for one decision domain" },
              { name: "Business definitions signed off with the owner" },
              { name: "Apache Iceberg tables where the estate already uses them" },
              { name: "Vector search over the governed schema" }
            ]
          },
          {
            stage: "Govern",
            items: [
              { name: "Dynamic masking of sensitive fields by role" },
              { name: "Row-level access policies" },
              { name: "SQL firewall applied to every query, including the ones AI writes" },
              { name: "Every interaction logged" },
              { name: "The same question asked in two roles returns two correctly filtered answers, enforced by the database itself" }
            ]
          },
          {
            stage: "Answer",
            items: [
              { name: "Select AI and Select AI Agent for plain-English question answering" },
              { name: "The agreed question set, tuned with the business owner" },
              { name: "Two to three operational dashboards over the joined data" },
              { name: "A governed foundation that persists after the proof" }
            ]
          }
        ]
      },
      jumpstart: {
        title: "Jumpstart Proof-of-Value",
        promise: "Pilot cross-system ERP Q&A on your own data in 4–8 weeks, at a fixed price, and let your own analysts put questions that span the systems to the test.",
        durationShort: "4–8 weeks",
        pillars: [
          { key: "fast", title: "Fast", text: "Four weeks for one clean source system; up to eight for three sources or a stricter security setup." },
          { key: "low-risk", title: "Low-risk", text: "A fixed price per use case, in your own tenancy — OCI, or Autonomous inside AWS, Azure or Google Cloud regions. Source access is read-only, and every feature used is generally available." },
          { key: "tangible", title: "Tangible", text: "One decision domain answered end to end in plain language, measured against a baseline signed before the clock starts." }
        ],
        outcomes: [
          "A working AI use case — an agent plus certified views — live on your data, in your tenancy.",
          "Two to three operational dashboards over the same joined data, on definitions the business signed off.",
          "A measured readout against the signed baseline: time-to-answer versus today, and the share of questions served without a data engineer.",
          "A governed foundation that persists: the semantic model and the security policies stay with you."
        ],
        timeline: [
          { label: "Week 0 · Gate", text: "Sponsor named, two to three success metrics signed, source access approved in writing." },
          { label: "Weeks 1–2 · Connect", text: "Oracle application pipelines switched on; one or two non-Oracle sources linked or landed. Read-only access." },
          { label: "Weeks 2–4 · Model and guard", text: "One decision domain — order-to-cash exceptions, say — shaped into certified views, with sensitive fields masked by role." },
          { label: "Weeks 3–6 · Prove", text: "Plain-English Q&A and dashboards tuned on the agreed question set, then measured against the signed baseline." }
        ],
        needs: [
          "One decision domain, and a business owner who can sign off its definitions",
          "Read-only access to the Oracle applications and one or two systems around them",
          "Two to three success metrics and today’s baseline, agreed before the clock starts"
        ],
        investment: {
          price: "€30–50K fixed per use case",
          duration: "4–8 weeks",
          includes: [
            "One use case, up to three data sources",
            "Prebuilt Oracle application pipelines switched on",
            "Certified views, masking and row-level access enforced in the data layer",
            "Plain-English Q&A plus two to three operational dashboards",
            "100% of the fee credits into a roll-out signed within 90 days",
            "Every feature used is generally available — nothing in scope waits on a roadmap item"
          ],
          footnote: "Price indicative, confirmed in scoping; Oracle partner funding programs may reduce the net cost."
        },
        next: [
          { tier: "Integration", text: "Live integration, more sources and decision domains, production SLAs.", duration: "3–5 months", price: "Scoped against the integration depth" },
          { tier: "Scaling", text: "Multi-entity rollout, with per-region governance and definitions.", duration: "3–12 months", price: "Scoped per engagement" }
        ],
        cta: { label: "Start a Jumpstart conversation", route: "#/products/cross-system-erp-qa/contacts" }
      }
    },
    {
      slug: "business-metrics-qa",
      name: "Business metrics Q&A",
      contactPerson: "oleksii-orlov",
      headline: { accent: "BUSINESS", rest: "METRICS Q&A" },
      category: "knowledge-analytics",
      categoryChip: "Enterprise knowledge & analytics",
      facet: ["oracle-ai-lakehouse", "oracle-ai-data-platform"],
      oneLiner: "Every team asks in plain words and gets the same number for the same metric, wherever the data sits.",
      heroLine: "Answers in seconds, not a week of extracts.",
      badges: ["MULTI-CLOUD", "ON-PREM TOO", "NO MIGRATION"],
      tags: ["Enterprise knowledge & analytics", "AI Lakehouse", "AI Data Platform"],
      hero: {
        image: {
          file: "assets/img/heroes/business-metrics-qa.jpg",
          alt: "Rolling waves of fine blue data points, brighter points picked out along the ridges",
          focal: "50% 52%"
        }
      },
      tile: {
        outcomes: [
          "Cross-cloud answers in seconds, under your access rules",
          "The answer layer moves to your data — your data does not move to it",
          "A governed gold layer that persists after the proof: definitions and security policies you keep"
        ]
      },
      overview: {
        problemSolution: {
          problem: {
            headline: "Finance waits on engineering for one group number",
            text: "Sales sit in one cloud, stock in another, the ledger on premises. A CFO's revenue-by-product-line question becomes an engineering ticket, and each team answers it its own way."
          },
          solution: {
            headline: "One question, every cloud answers, no data moved",
            text: "Finance types it in and gets the number back on the definition the group signed off, from the systems it already runs, under the access rules in force."
          }
        },
        metrics: [
          {
            key: "extracts",
            title: "Extracts built per request",
            kind: "estimated",
            owner: "Head of data engineering",
            figure: { text: "3 → 0" },
            visual: {
              form: "dumbbell",
              unit: "extracts per question",
              direction: "down",
              scale: { min: 0, max: 3 },
              before: { value: 3, label: "3" },
              after: { value: 0, label: "0" }
            },
            line: "A data team's pulls and copies, replaced by one query run in place."
          },
          {
            key: "time-to-answer",
            title: "Time to a group-wide figure",
            kind: "estimated",
            owner: "Chief financial officer",
            figure: { prefix: "from", text: "a week" },
            visual: {
              form: "compression",
              unit: "elapsed time",
              direction: "down",
              scale: { min: 0, max: 168 },
              before: { value: 168, label: "a week" },
              after: { value: 0.1, label: "minutes" }
            },
            line: "Revenue, churn or inventory, all regions, on one agreed definition."
          }
        ],
        features: [
          "Catalog federation: mount the Iceberg catalogs you already run",
          "Database links to the systems not in a catalog, on-prem included",
          "A governed gold layer with definitions the organization signs off",
          "Plain-English question answering via Select AI over that layer",
          "Converged data in one database: relational, JSON, spatial, graph, vector",
          "Role-scoped answers and a full audit trail, enforced in the data layer",
          "Zero data movement — queries run where the data lives"
        ],
        industriesNote: "The same two pains in every industry, regardless of stack — what varies is the data estate.",
        steps: [
          {
            n: 1,
            title: "Ask across every cloud",
            text: "A finance lead asks for revenue by product line, all regions, this month against plan. The catalogs and databases already in place are connected as they are.",
            shot: {
              full: "assets/img/steps/business-metrics-qa-1.jpg",
              alt: "The Ask bar with the revenue question and three connected sources."
            },
            features: [
              "Catalog federation: mount the Iceberg catalogs you already run",
              "Database links to the systems not in a catalog, on-prem included",
              "Zero data movement — queries run where the data lives"
            ]
          },
          {
            n: 2,
            title: "One agreed definition",
            text: "Net revenue means one thing, signed off by group finance, and every result uses it, so two dashboards stop disagreeing.",
            shot: {
              full: "assets/img/steps/business-metrics-qa-2.jpg",
              alt: "The net revenue definition, version 3, signed off by Group FP&A."
            },
            features: [
              "A governed gold layer with definitions the organization signs off",
              "Converged data in one database: relational, JSON, spatial, graph, vector"
            ]
          },
          {
            n: 3,
            title: "The answer, by role",
            text: "The table and chart come back in seconds, showing each person only the regions and fields their role allows.",
            shot: {
              full: "assets/img/steps/business-metrics-qa-3.jpg",
              alt: "The answer as table and chart, two columns masked for this role."
            },
            features: ["Plain-English question answering via Select AI over that layer"]
          },
          {
            n: 4,
            title: "Traced and reused",
            text: "Who asked, what was read and how it was computed are kept, so an auditor can retrace any answer and the next question runs on the same foundation.",
            shot: {
              full: "assets/img/steps/business-metrics-qa-4.jpg",
              alt: "The audit entry: who asked, the sources read, the query, 4 s."
            },
            features: ["Role-scoped answers and a full audit trail, enforced in the data layer"]
          }
        ],
        industryCases: [
          {
            industry: "cross-industry",
            label: "Every industry",
            image: "assets/img/industries/cross-industry.jpg",
            problem: "Two pains recur whatever the sector. Time: a cross-cloud question takes a data engineer, three extracts and a week, so the business answers itself in a spreadsheet. Trust: AI pilots die in security review, because nobody can prove what the model can see or show, and when auditors ask who saw what through AI there is no answer.",
            solution: "One governed engine mounts the catalogs already in place and links the databases outside them, then answers under the access rules those systems already enforce. What shapes the work here is the data estate, so the same shape fits wherever the data sits."
          },
          {
            industry: "retail",
            label: "Retail",
            image: "assets/img/industries/retail.jpg",
            problem: "Sales sit in one platform, stock in another, promotions in a third, and each acquisition adds an island nobody has integrated. Comparing sales by SKU, region and promotion means an extract per system and a wait.",
            solution: "A merchandiser asks the comparison in plain language and gets it back from the governed gold layer, across every connected source, with no data moved. The definitions behind the numbers are the ones the organization signed off, so two dashboards stop disagreeing."
          },
          {
            industry: "manufacturing",
            label: "Manufacturing",
            image: "assets/img/industries/manufacturing.jpg",
            problem: "Revenue, inventory and churn questions span plants, regions and the systems that came with each acquisition. Each platform has its own catalog, its own security model and its own team, so no single system sees enough of the picture for AI to be useful on it.",
            solution: "The existing catalogs are mounted and the remaining databases linked, including on-prem, with the answer layer moving to wherever the data already sits. An assistant answers across all of it in plain language, role-scoped and fully audited."
          }
        ],
        scope: {
          in: [
            "Two to three existing catalogs mounted, one on-prem database linked",
            "A small governed model: business definitions, masking, row-level access",
            "An assistant answering an agreed 30-question set across every connected source",
            "Accuracy tuned live with your analysts",
            "Zero data movement — queries run where the data lives"
          ],
          out: [
            "Migrating or copying data into the platform — by design",
            "Live production integration and more catalogs — after the Jumpstart",
            "Additional decision domains and production SLAs — after the Jumpstart",
            "Multi-entity rollout and per-region governance — at scale",
            "Write-back to the source systems: the system retrieves, it does not act"
          ]
        },
        caseStudy: null
      },
      technology: {
        narrative: "Bronze and silver stay where they are. Oracle Autonomous AI Lakehouse becomes the governed gold layer — existing catalogs mounted, other databases linked — and Select AI answers across all of them with no data movement. Where Oracle AI Data Platform is in place, its catalog registers that gold layer without a copy, and the platform’s agents read the same definitions.",
        stack: [
          {
            key: "application",
            label: "Application / accelerator",
            summary: "What SoftServe builds on top: the gold model, its definitions, and the question set it is tuned against.",
            vendors: ["softserve"],
            items: [
              { name: "The governed gold model and its business definitions", required: true },
              { name: "Catalog mounting and database links, configured", required: true },
              { name: "The agreed 30-question set and accuracy tuning with your analysts", required: true }
            ]
          },
          {
            key: "data-platform",
            label: "Data & platform",
            summary: "Oracle Autonomous AI Lakehouse becomes the governed gold layer, on its own or inside Oracle AI Data Platform; bronze and silver stay where they are.",
            vendors: ["oracle"],
            items: [
              { name: "Oracle Autonomous AI Database 26ai as the governed gold layer", required: true },
              { name: "Select AI and Select AI Agent", required: true },
              { name: "Apache Iceberg for catalog federation", required: true },
              { name: "Database links", required: true },
              { name: "Vector search", required: false },
              { name: "Data Studio", required: false },
              { name: "Exadata", required: false },
              { name: "Oracle AI Data Platform — the gold layer registered in its catalog, so its agents reuse the same definitions", required: false }
            ]
          },
          {
            key: "infrastructure",
            label: "Infrastructure",
            summary: "A managed service in whichever cloud you prefer — your applications stay where they are.",
            vendors: ["oracle"],
            items: [
              { name: "Your own tenancy — OCI, or Autonomous inside AWS, Azure or Google Cloud regions", required: true },
              { name: "The managed Autonomous service — no cluster to size or operate", required: true }
            ]
          },
          {
            key: "custom",
            label: "Configuration & integrations",
            summary: "The catalogs mounted, the databases linked, and the governance that scopes every answer.",
            vendors: ["softserve"],
            items: [
              { name: "Existing Iceberg catalogs mounted — AWS Glue, Databricks Unity Catalog, Snowflake", required: true, direction: "inbound" },
              { name: "Databases linked, including on-prem; read-only access", required: true, direction: "inbound" },
              { name: "Plain-English answers and charts across every connected source", required: true, direction: "outbound" },
              { name: "Dynamic masking, row-level policies and the SQL firewall", required: true },
              { name: "Zero data movement — queries run where the data lives", required: true }
            ]
          }
        ],
        capabilities: [
          {
            stage: "Mount",
            items: [
              { name: "Catalog federation — mount the Iceberg catalogs you already run" },
              { name: "Database links to the systems not in a catalog, on-prem included" },
              { name: "Zero data movement — queries run where the data lives" },
              { name: "Read-only source access" }
            ]
          },
          {
            stage: "Model",
            items: [
              { name: "A governed gold layer with definitions the organization signs off" },
              { name: "Bronze and silver stay where they are" },
              { name: "Converged data in one database — relational, JSON, spatial, graph and vector" }
            ]
          },
          {
            stage: "Govern",
            items: [
              { name: "Dynamic masking of sensitive fields by role" },
              { name: "Row-level access policies" },
              { name: "SQL firewall applied to every query, including the ones AI writes" },
              { name: "Role-scoped answers with a full audit trail" },
              { name: "The same question asked in two roles returns two correctly filtered answers, enforced by the database itself" }
            ]
          },
          {
            stage: "Answer",
            items: [
              { name: "Select AI and Select AI Agent for plain-English question answering" },
              { name: "An agreed 30-question set, accuracy tuned live with your analysts" },
              { name: "Answers across every connected source, with no data moved" },
              { name: "A governed foundation that persists after the proof" }
            ]
          }
        ]
      },
      jumpstart: {
        title: "Jumpstart Proof-of-Value",
        promise: "Pilot business metrics Q&A on your own data in 4–8 weeks, at a fixed price, and see your KPIs answered from one set of certified definitions.",
        durationShort: "4–8 weeks",
        pillars: [
          { key: "fast", title: "Fast", text: "Four weeks for one clean source system; up to eight for three sources or a stricter security setup." },
          { key: "low-risk", title: "Low-risk", text: "A fixed price per use case, in whichever cloud you prefer. Nothing is migrated or copied: queries run where the data lives, under read-only access. Every feature used is generally available." },
          { key: "tangible", title: "Tangible", text: "An assistant answering an agreed 30-question set across every connected source, measured against a baseline signed before the clock starts." }
        ],
        outcomes: [
          "A working AI use case — an agent plus curated views — live on your data, in your tenancy.",
          "Answers across two to three mounted catalogs and a linked database, with no data moved.",
          "A measured readout against the signed baseline: time-to-answer versus today, and the share of questions served without a data engineer.",
          "A governed foundation that persists: the gold model and the security policies stay with you."
        ],
        timeline: [
          { label: "Week 0 · Gate", text: "Sponsor named, two to three success metrics signed, source access approved in writing." },
          { label: "Weeks 1–2 · Connect", text: "Your teams grant read-only access; two to three existing catalogs are mounted and one on-prem database linked. Zero data movement." },
          { label: "Weeks 2–4 · Model and guard", text: "A small governed model: business definitions, masking and row-level access." },
          { label: "Weeks 3–6 · Prove", text: "The assistant answers the agreed 30-question set, accuracy tuned with your analysts, then measured against the signed baseline." }
        ],
        needs: [
          "Two to three existing catalogs, and one database outside them worth linking",
          "An agreed 30-question set, and the analysts who will judge the answers",
          "Two to three success metrics and today’s baseline, agreed before the clock starts"
        ],
        investment: {
          price: "€30–50K fixed per use case",
          duration: "4–8 weeks",
          includes: [
            "One use case, up to three data sources",
            "Two to three existing catalogs mounted, one on-prem database linked",
            "A governed gold model with masking and row-level access in the data layer",
            "An assistant answering an agreed 30-question set across every connected source",
            "100% of the fee credits into a roll-out signed within 90 days",
            "Every feature used is generally available — nothing in scope waits on a roadmap item"
          ],
          footnote: "Price indicative, confirmed in scoping; Oracle partner funding programs may reduce the net cost."
        },
        next: [
          { tier: "Integration", text: "Live integration, more catalogs, databases and decision domains, production SLAs.", duration: "3–5 months", price: "Scoped against the integration depth" },
          { tier: "Scaling", text: "Multi-entity rollout, with per-region governance and definitions.", duration: "3–12 months", price: "Scoped per engagement" }
        ],
        cta: { label: "Start a Jumpstart conversation", route: "#/products/business-metrics-qa/contacts" }
      }
    },

    {
      slug: "fleet-route-optimization",
      name: "Fleet route optimization",
      contactPerson: "oleksii-orlov",
      headline: { accent: "Fleet route", rest: "optimization" },
      category: "forecasting-optimization",
      categoryChip: "Forecasting & optimization",
      facet: "oci-nvidia",
      oneLiner: "Lowers the cost of every field visit: each van’s day planned around booked slots, engineer skills and electric-van charging.",
      heroCaption: "What if the same fleet did more work for less?",
      tags: ["Forecasting & optimization", "OCI + NVIDIA NeMo"],
      hero: {
        image: {
          file: "assets/img/heroes/fleet-route-optimization.jpg",
          alt: "A perforated metal lattice rolling away in long waves, rows of open cells running off toward the horizon",
          focal: "50% 50%"
        }
      },
      tile: {
        outcomes: [
          "Fewer miles, less paid time at chargers, fewer second visits",
          "More booked work from the same fleet, without new hires or vans",
          "The saving measured on your own past days before a live route changes"
        ]
      },
      overview: {
        problemSolution: {
          problem: {
            headline: "Every extra mile, charger wait and missed slot is paid for",
            text: "Planners route hundreds of vans by hand around booked windows, skills and, for electric vans, charging. Every wasted mile, idle hour and repeat trip is money spent."
          },
          solution: {
            headline: "See the saving on your own past days first",
            text: "Your days are replayed and planned again around windows, skills and battery range. Operations and finance see cost per visit, jobs per engineer and missed slots before any route changes."
          }
        },
        metrics: [
          {
            key: "cost-per-visit",
            title: "Cost per completed visit",
            kind: "estimated",
            owner: "Chief operating officer",
            figure: { text: "−5 to −10%" },
            visual: {
              form: "range",
              unit: "percent of cost per visit",
              direction: "down",
              scale: { min: 0, max: 15 },
              before: { value: 0, label: "current cost" },
              range: { lo: 5, hi: 10, label: "−5 to −10%" }
            },
            line: "Driving, charging time and overtime, at your own rates."
          },
          {
            key: "road-time",
            title: "Unproductive driving per engineer",
            kind: "estimated",
            owner: "Director of field operations",
            figure: { text: "up to 1 h a day" },
            visual: {
              form: "baseline",
              unit: "minutes per engineer per day",
              direction: "down",
              scale: { min: 0, max: 90 },
              before: { value: 60, label: "up to 1 h a day" }
            },
            line: "Hours at the wheel that produce no billable work."
          }
        ],
        features: [
          "Real past days replayed from Field Service, telematics and charging records",
          "Replay checked against actual visits, journey times and outcomes",
          "Booked slots, engineer skills and job priorities in one GPU solve",
          "Electric and combustion vans planned together",
          "Charging stops placed where they cost no visit, every route battery-checked",
          "Visits that cannot be served returned with the reason",
          "The day as it ran beside the re-plan, route by route",
          "Approved routes and charging stops sent to Oracle Fusion Field Service *"
        ],
        industriesNote: "Any van fleet that visits customers against booked slots, especially one going electric.",
        steps: [
          {
            n: 1,
            title: "Replay a real day",
            text: "A past day is rebuilt van by van from the field-service, telematics and battery records, and checked against what actually happened.",
            shot: {
              full: "assets/img/steps/fleet-route-optimization-1.jpg",
              alt: "The replayed day checked: 72 of 72 visits matched, journeys within 6%."
            },
            features: [
              "Real past days replayed from Field Service, telematics and charging records",
              "Replay checked against actual visits, journey times and outcomes"
            ]
          },
          {
            n: 2,
            title: "Plan every route",
            text: "It is planned again: every booked slot kept, every job on someone with the right skills, and the charging stop where it costs nothing.",
            shot: {
              full: "assets/img/steps/fleet-route-optimization-2.jpg",
              alt: "The Changes tab: each change with its rule and effect, beside the re-plan rules."
            },
            features: [
              "Booked slots, engineer skills and job priorities in one GPU solve",
              "Electric and combustion vans planned together",
              "Charging stops placed where they cost no visit, every route battery-checked",
              "Visits that cannot be served returned with the reason"
            ]
          },
          {
            n: 3,
            title: "See what it saves",
            text: "The day as it ran sits beside the re-plan: cost per visit, visits per engineer, missed slots, down to each engineer and the reason for each change.",
            shot: {
              full: "assets/img/steps/fleet-route-optimization-3.jpg",
              alt: "Cost per visit €64.41 to €56.96, visits per engineer 5.50 to 5.92."
            },
            features: ["The day as it ran beside the re-plan, route by route"]
          },
          {
            n: 4,
            title: "Send it to dispatch",
            text: "A dispatcher approves the changes, and the routes and charging stops go to the field-service system in its own import format.",
            shot: {
              full: "assets/img/steps/fleet-route-optimization-4.jpg",
              alt: "The Field Service import: 10 approved changes, 71 visits, 3 charging stops."
            },
            features: ["Approved routes and charging stops sent to Oracle Fusion Field Service *"]
          }
        ],
        industryCases: [
          {
            industry: "telecom",
            label: "Telecom & cable",
            image: "assets/img/industries/telecom.jpg",
            problem: "Engineers installing and repairing broadband and TV lose hours between booked slots. A late arrival means a customer who took the day off, and often a second visit.",
            solution: "Each engineer’s day is ordered around booked slots and the skills each job needs, with charging fitted where it costs no visit. Fewer miles and fewer second visits leave room for more booked work per engineer."
          },
          {
            industry: "utilities",
            label: "Utilities",
            image: "assets/img/industries/utilities.jpg",
            problem: "Meter fitters and repair crews work to booked or regulated windows. Gas or electrical work can only go to an engineer holding the right certificate, and a wrong match is a wasted trip.",
            solution: "Jobs go to certified engineers inside their windows. Depot and home charging for electric vans is planned in, so crews spend the day on jobs rather than on the road."
          },
          {
            industry: "construction",
            label: "Construction",
            image: "assets/img/industries/construction.jpg",
            problem: "Technicians covering lifts, heating and fire systems across many sites juggle contract response times with planned maintenance. A missed response time can cost a penalty under the contract.",
            solution: "Call-outs and planned visits are routed together, weighted by each contract’s response time. Urgent work lands first without breaking the day’s plan."
          },
          {
            industry: "logistics",
            label: "Logistics & supply chain",
            image: "assets/img/industries/logistics.jpg",
            problem: "Drivers run electric vans against promised delivery windows. A route that misjudges range ends at a charger instead of a doorstep.",
            solution: "Routes carry the delivery windows and a battery check on every leg. Each van finishes its drops with the reserve intact, and fewer drops roll over to the next day."
          }
        ],
        scope: {
          in: [
            "A few real past days of one region, replayed and checked against what happened",
            "Route planning with booked slots, skills and job priorities",
            "One charging stop per shift, with the battery check on every electric route",
            "Cost per visit, visits per engineer and missed appointments, for the day as it ran and the re-plan",
            "Sandboxed deployment on your own tenancy"
          ],
          out: [
            "Write-back to Oracle Fusion Field Service — delivered after the Jumpstart",
            "Live traffic and charger data — delivered after the Jumpstart",
            "Re-planning during the day as jobs overrun — delivered at Scaling",
            "Queueing at shared chargers — on the roadmap"
          ]
        },
        caseStudy: null
      },
      technology: {
        narrative: "Oracle Fusion Field Service is the source and, after the Jumpstart, the destination. NVIDIA cuOpt re-plans the routes on an OCI GPU instance, and nothing reaches the field until a dispatcher approves it.",
        stack: [
          {
            key: "application",
            label: "Application / accelerator",
            summary: "The SoftServe pack: replay and calibration, charging stops and the battery check, and the side-by-side review.",
            vendors: ["softserve"],
            items: [
              { name: "Replay and calibration of past days", required: true },
              { name: "Charging stops and the leg-by-leg battery check", required: true },
              { name: "Side-by-side review with dispatcher approval", required: true },
              { name: "Write-back to Oracle Fusion Field Service", required: false, note: "After the Jumpstart" }
            ]
          },
          {
            key: "ai-engine",
            label: "AI engine",
            summary: "NVIDIA cuOpt solves every van’s route on GPUs, charging stops included.",
            vendors: ["nvidia"],
            items: [
              { name: "NVIDIA cuOpt, the GPU-accelerated route solver", required: true }
            ]
          },
          {
            key: "data-platform",
            label: "Data & platform",
            summary: "Oracle Fusion Field Service holds the work; storage and the database hold the replayed days and results.",
            vendors: ["oracle"],
            items: [
              { name: "Oracle Fusion Field Service, as source and destination", required: true },
              { name: "OCI Object Storage and Oracle AI Database for the replayed days and results", required: true }
            ]
          },
          {
            key: "infrastructure",
            label: "Infrastructure",
            summary: "A GPU instance in your own tenancy, with Kubernetes, networking and IAM.",
            vendors: ["oracle"],
            items: [
              { name: "An OCI GPU instance (one NVIDIA A10 at the Jumpstart)", required: true },
              { name: "Kubernetes, API gateway, networking and IAM", required: true }
            ]
          },
          {
            key: "custom",
            label: "Configuration & integrations",
            summary: "Your rules and the data that comes in and goes back.",
            vendors: ["softserve"],
            items: [
              { name: "From Oracle Fusion Field Service: bookings, engineers, skills and slots", required: true, direction: "inbound" },
              { name: "Telematics and charging history", required: true, direction: "inbound" },
              { name: "Traffic and charger data", required: true, direction: "inbound" },
              { name: "To Oracle Fusion Field Service: approved routes and charging stops", required: false, direction: "outbound", note: "After the Jumpstart" },
              { name: "Objective weights, skills rules and charging policy", required: true }
            ]
          }
        ],
      capabilities: [
        {
          stage: "Replay the real day",
          items: [
            { name: "Field Service history read from exports — jobs, windows, engineers, skills, shifts, start points", state: "partial" },
            { name: "Telematics, GPS traces and charging history aligned to each engineer-day", state: "partial" },
            { name: "Live read from Field Service over its API", state: "partial" },
            { name: "Real operating days rebuilt engineer by engineer", state: "partial" },
            { name: "Replay calibrated against actual visits, journey times and appointment outcomes", state: "partial" },
            { name: "Traffic-aware travel times per departure window", state: "partial" }
          ]
        },
        {
          stage: "Plan every route",
          items: [
            { name: "Booked appointment windows kept", state: "partial" },
            { name: "Jobs matched to engineer skills, including multi-skill jobs", state: "partial" },
            { name: "Job priorities weighed against travel", state: "partial" },
            { name: "Electric and combustion vans planned in one run", state: "partial" },
            { name: "Van load capacity respected", state: "roadmap" },
            { name: "A region's whole day solved in one GPU run", state: "partial" },
            { name: "Visits that cannot be served returned with the reason", state: "partial" },
            { name: "Check that a dropped visit is truly infeasible, not just expensive", state: "partial" },
            { name: "Battery level and range needed for the remaining work tracked per van", state: "partial" },
            { name: "Every electric route checked leg by leg against a battery reserve" },
            { name: "Charging stop placed by location, connector, speed and listed availability", state: "partial" },
            { name: "Home-charging policy, with exceptions for engineers without a charger", state: "partial" },
            { name: "A second charging stop in one shift", state: "partial" },
            { name: "Queueing and contention at shared chargers", state: "roadmap" }
          ]
        },
        {
          stage: "See what it saves",
          items: [
            { name: "Actual, replayed and re-planned days side by side on the agreed metrics", state: "partial" },
            { name: "Route maps and drill-down to each engineer-day and visit", state: "partial" },
            { name: "Decision pack — each metric against its pass threshold, go or stop", state: "partial" },
            { name: "Savings in money and carbon worked out from travel and charging", state: "roadmap" }
          ]
        },
        {
          stage: "Send it to dispatch",
          items: [
            { name: "Dispatcher asks for a re-plan and reviews it in Field Service", state: "partial" },
            { name: "Approved routes and charging stops written back to Field Service", state: "partial" },
            { name: "Re-plan during the day as jobs overrun or vans break down", state: "roadmap" },
            { name: "Every run kept with its inputs and results" },
            { name: "Sign-in, roles and audit trail for production use", state: "roadmap" }
          ]
        }
      ]
      },
      jumpstart: {
        title: "Jumpstart Proof-of-Value",
        promise: "See what a GPU-planned day saves on your own past days in 4–8 weeks, and take away cost per visit, visits per engineer and missed appointments measured against your own actuals.",
        durationShort: "4–8 weeks",
        pillars: [
          { key: "fast", title: "Fast", text: "4–8 weeks from kickoff to a before/after readout on real past days of one region." },
          { key: "low-risk", title: "Low-risk", text: "Past days only, on files, in a sandbox on your own tenancy. No live schedule changes, and a dispatcher approves every change." },
          { key: "tangible", title: "Tangible", text: "Cost per visit, visits per engineer and missed appointments for the day as it ran and the re-plan, priced at your own unit costs." }
        ],
        outcomes: [
          "Your own past days replayed from Oracle Fusion Field Service and telematics exports, checked against what actually happened.",
          "The same days re-planned on GPU with your slots, skills, priorities and charging stops.",
          "The day as it ran beside the re-plan, route by route, with the three business measures.",
          "A costed plan for the next step: integration scope, regions, timeline."
        ],
        timeline: [
          { label: "Week 0 · Gate", text: "Sponsor named; the three measures, their pass thresholds and your unit costs signed; the exports approved in writing." },
          { label: "Weeks 1–3 · Replay", text: "The chosen days loaded, rebuilt engineer by engineer and checked against what really happened." },
          { label: "Weeks 4–6 · Re-plan", text: "Every route re-planned on GPU with slots, skills, priorities and charging; operations review the changes." },
          { label: "Weeks 7–8 · Decision", text: "The measures for the day as it ran and the re-plan, priced by your finance team, and a costed proposal for the next step." }
        ],
        needs: [
          "Oracle Fusion Field Service exports for the chosen days — bookings, engineers, skills, shifts, start locations",
          "Telematics and charging history for the same days, and which van each engineer drove",
          "An operations owner who signs the measures and a finance contact who supplies the unit costs"
        ],
        investment: {
          price: "Scoped per engagement",
          duration: "4–8 weeks",
          includes: [
            "Replay and calibration of real past days in one region",
            "Route planning with slots, skills, priorities and one charging stop per shift",
            "The side-by-side review with dispatcher approval",
            "Sandboxed deployment on your own tenancy"
          ],
          footnote: "The proof-of-value environment runs at about €3.4K a month of OCI, indicative, at list price; figures are confirmed in scoping."
        },
        next: [
          { tier: "Integration", text: "Wired into dispatch: live read from Oracle Fusion Field Service, dispatcher review and write-back of approved routes and charging stops, live traffic and charger data, several charging stops per shift, sign-in, roles and audit.", duration: "3–5 months", price: "Scoped per engagement" },
          { tier: "Scaling", text: "Every region, every day: re-planning as jobs overrun or vans break down, queueing at shared chargers, and the saving worked out in money.", duration: "3–12 months", price: "Scoped per engagement" }
        ],
        cta: { label: "Start a Jumpstart conversation", route: "#/products/fleet-route-optimization/contacts" }
      }
},

    {
  "slug": "repair-or-replace-decisions",
  "name": "Repair-or-replace decisions",
  "contactPerson": "oleksii-orlov",
  "headline": { "accent": "Repair-or-replace", "rest": "decisions" },
  "category": "video-image",
  "categoryChip": "Video & image intelligence",
  "facet": "oci-nvidia",
  "oneLiner": "A replacement paid for only when the rules require one, and the right job booked first time: repair-or-replace calls on damaged vehicles, containers and equipment, measured from photos.",
  "heroCaption": "What if a wrong call were caught before it cost anything?",
  "tags": ["Video & image intelligence", "OCI + NVIDIA NeMo"],
  "hero": {
    "image": {
      "file": "assets/img/heroes/repair-or-replace-decisions.jpg",
      "alt": "Fine glassy ribs sweeping over a curved form in the dark, a thin line of light caught along each ridge",
      "focal": "60% 50%"
    }
  },
  "tile": {
    "outcomes": [
      "Needless replacements caught before they are funded, the price gap saved each time",
      "The job done once, with the right part and slot on the first visit",
      "Every call keeps its rule, measurement and reason, so disputes are answered from the record"
    ]
  },
  "overview": {
    "problemSolution": {
      "problem": {
        "headline": "Repair or replace, decided by eye from a photo",
        "text": "Call agents, depot surveyors and claims handlers judge from photos whether a windscreen, a container panel or a body panel is repaired or replaced. Guessing costs money both ways."
      },
      "solution": {
        "headline": "Measured from the picture, checked against the rule",
        "text": "The inspector sees the measured damage, the rule that applies in that market and the recommended call, then confirms or overrules it. Every decision keeps its reason."
      }
    },
    "metrics": [
      {
        "key": "needless-replacements",
        "title": "Needless replacements",
        "kind": "estimated",
        "owner": "Head of claims, on the payer's side",
        "figure": { "text": "3.0 → 2.4%" },
        "visual": {
          "form": "dumbbell",
          "unit": "share of remediation decisions",
          "direction": "down",
          "scale": { "min": 0, "max": 4 },
          "before": { "value": 3, "label": "3.0%" },
          "after": { "value": 2.4, "label": "2.4%" }
        },
        "line": "Parts swapped where a repair would have held; the payer funds them."
      },
      {
        "key": "repeat-visits",
        "title": "Repeat visits for the same damage",
        "kind": "estimated",
        "owner": "Network operations director",
        "figure": { "text": "1.5 → 1.2%" },
        "visual": {
          "form": "dumbbell",
          "unit": "share of repairs",
          "direction": "down",
          "scale": { "min": 0, "max": 2 },
          "before": { "value": 1.5, "label": "1.5%" },
          "after": { "value": 1.2, "label": "1.2%" }
        },
        "line": "Repairs that fail and come back, absorbed by the operator."
      },
      {
        "key": "saving-per-call",
        "title": "Saving per needless replacement avoided",
        "kind": "estimated",
        "owner": "Head of claims, on the payer's side",
        "figure": { "text": "about $250" },
        "visual": {
          "form": "compression",
          "unit": "cost of one windscreen call",
          "direction": "down",
          "scale": { "min": 0, "max": 350 },
          "before": { "value": 350, "label": "$350" },
          "after": { "value": 99, "label": "$99" },
          "gap": "Saving"
        },
        "line": "A windscreen replaced where a repair would have met the limit."
      }
    ],
    "features": [
      "Capture requests sent from a booking or claim *",
      "Guided capture with a scale anchor, so size can be measured *",
      "Asset identified from its own markings",
      "Damage located across frames and classified against your taxonomy *",
      "Each damage measured against the limit that governs it *",
      "Repair, replace or refer, with a confidence attached",
      "Rule, frame and measurement cited on every call *",
      "Reviewer workspace with override, a captured reason and a decision record *"
    ],
    "industriesNote": "For the network, depot, branch or maintenance organization that makes the call and carries a wrong one, and for the insurer, lessor or fleet owner that funds the remedy.",
    "steps": [
      {
        "n": 1,
        "title": "Measure the damage",
        "text": "The photos identify the item, locate each damage and measure it against the limit that governs it; unusable pictures are sent back for a retake.",
        "shot": {
          "full": "assets/img/steps/repair-or-replace-decisions-1.jpg",
          "alt": "Case RR-24811: the windscreen photo with the chip measured at 14.2 mm."
        },
        "features": [
          "Capture requests sent from a booking or claim *",
          "Guided capture with a scale anchor, so size can be measured *",
          "Asset identified from its own markings",
          "Damage located across frames and classified against your taxonomy *",
          "Each damage measured against the limit that governs it *"
        ]
      },
      {
        "n": 2,
        "title": "Check it against the rule",
        "text": "The size, the position and the market's limits give the call: repair, replace or refer, with the dependent work a replacement would trigger.",
        "shot": {
          "full": "assets/img/steps/repair-or-replace-decisions-2.jpg",
          "alt": "Brisca case: 11 mm chip in zone A, the rule says replace."
        },
        "features": [
          "Repair, replace or refer, with a confidence attached"
        ]
      },
      {
        "n": 3,
        "title": "Confirm or overrule",
        "text": "The reviewer sees the photo, the measurement and the cited rule beside the recommendation, and confirms it or overrules it with a reason that is kept.",
        "shot": {
          "full": "assets/img/steps/repair-or-replace-decisions-3.jpg",
          "alt": "Flagged case RR-24826: the cited rule and the call, with Overrule or Confirm."
        },
        "features": [
          "Reviewer workspace with override, a captured reason and a decision record *"
        ]
      },
      {
        "n": 4,
        "title": "Book the right job",
        "text": "The approved call goes to booking or claims with its scope resolved: the part, the skill, the slot, and the recalibration if one is needed.",
        "shot": {
          "full": "assets/img/steps/repair-or-replace-decisions-4.jpg",
          "alt": "Booking import, 6 sent and 1 held: rule, measurement, who authorized."
        },
        "features": [
          "Rule, frame and measurement cited on every call *"
        ]
      }
    ],
    "industryCases": [
      {
        "industry": "automotive",
        "label": "Automotive",
        "image": "assets/img/industries/automotive.jpg",
        "problem": "In vehicle glazing, call agents book a repair or a replacement before anyone sees the vehicle. A chip in the driver's viewing area is repairable under one market's rule and prohibited under another's, and a replaced windscreen can add a camera recalibration and days to the job.",
        "solution": "The agent confirms a measured call and books the right job, kit and slot the first time. The service network leads here, while the insurer paying for the glass applies the repair-first pressure."
      },
      {
        "industry": "logistics",
        "label": "Logistics & supply chain",
        "image": "assets/img/industries/logistics.jpg",
        "problem": "Container depot surveyors propose repairs that the owner approves line by line. Damage and remedy come in codified pairs: a hole in a panel can only be patched or replaced.",
        "solution": "The surveyor submits coded damage with only the permissible remedies attached, so each line can be checked against the code. The depot leads, with the container lessor approving each line."
      },
      {
        "industry": "financial-services",
        "label": "Financial services",
        "image": "assets/img/industries/financial-services.jpg",
        "problem": "At a rental or lease handover, branch staff decide what a returning customer is charged for damage. The charge has to tell a scratch within the fair-wear allowance from one added during the hire, in front of a customer who may dispute it.",
        "solution": "New damage is separated from pre-existing damage, with the evidence attached to the charge so it stands up to a dispute. The lessor leads here, because the output is a bill."
      },
      {
        "industry": "insurance",
        "label": "Insurance",
        "image": "assets/img/industries/insurance.jpg",
        "problem": "At first notice of loss, claims handlers decide repair, replace or write-off from photos of the vehicle's body and paint. The write-off test sets repair cost against a share of the vehicle's value, and that share is set locally.",
        "solution": "The handler reviews a costed scope with the write-off threshold already applied. The insurer leads here, as the payer funding the repair."
      },
      {
        "industry": "travel-transport",
        "label": "Travel & transport",
        "image": "assets/img/industries/travel-transport.jpg",
        "problem": "Aircraft engineers disposition skin damage against published structural limits. A dent inside allowable limits can be accepted and logged to the aircraft's damage chart rather than repaired.",
        "solution": "The engineer gets the limit, the measurement and the record in one place. The airline or maintenance organization leads here, and every accepted dent stays on the aircraft's permanent record."
      }
    ],
    "scope": {
      "in": [
        "Guided capture with a scale anchor, on one capture channel",
        "Detection, classification and measurement on one asset class",
        "The cited decision against one market's rule set, authored and versioned",
        "Review and override, with a decision record and an evidence export",
        "An accuracy evaluation against an agreed holdout set"
      ],
      "out": [
        "Coverage and entitlement checks, resolved upstream",
        "Priced scope and the write-off test, delivered after the Jumpstart",
        "Integrity and tamper detection on submitted media, delivered after the Jumpstart",
        "Write-back into your booking, dispatch or claims system, delivered after the Jumpstart",
        "Rule sets for further markets, delivered after the Jumpstart"
      ]
    },
    "caseStudy": null
  },
  "technology": {
    "narrative": "Media from your capture channel and the asset's record come into Oracle Cloud Infrastructure, where NVIDIA vision and reasoning models read and measure the damage. The call reaches the booking, dispatch or claims system only after a reviewer confirms it.",
    "stack": [
      {
        "key": "application",
        "label": "Application / accelerator",
        "summary": "The SoftServe app: guided capture, the reviewer workspace, rule authoring and the decision record.",
        "vendors": ["softserve"],
        "items": [
          { "name": "Guided capture", "required": true },
          { "name": "Reviewer workspace with override and a captured reason", "required": true },
          { "name": "Rule authoring and versioning per market", "required": true },
          { "name": "Decision record and evidence export", "required": true }
        ]
      },
      {
        "key": "ai-engine",
        "label": "AI engine",
        "summary": "NVIDIA models read and measure the damage, retrieve the rule that applies and return a structured verdict.",
        "vendors": ["nvidia"],
        "items": [
          { "name": "NVIDIA AI Blueprint for Video Search and Summarization (VSS), for video and image understanding", "required": true },
          { "name": "NVIDIA AI-Q Blueprint, for retrieval over the rule set", "required": true },
          { "name": "OCI Vision, as an Oracle-native route for detection and classification", "required": false }
        ]
      },
      {
        "key": "data-platform",
        "label": "Data & platform",
        "summary": "Oracle Autonomous AI Database holds the decision record, the audit trail and the versioned rule sets; object storage holds the media.",
        "vendors": ["oracle"],
        "items": [
          { "name": "Oracle Autonomous AI Database for the decision record, audit trail and rule-set versions", "required": true },
          { "name": "OCI Object Storage for the media", "required": true },
          { "name": "Oracle Analytics Cloud for decision mix, override rate and repeat visits", "required": false }
        ]
      },
      {
        "key": "infrastructure",
        "label": "Infrastructure",
        "summary": "GPU compute and Kubernetes in your own tenancy, with the API gateway, identity and observability.",
        "vendors": ["oracle"],
        "items": [
          { "name": "OCI GPU instances and OCI Kubernetes Engine", "required": true },
          { "name": "API gateway, identity and observability", "required": true },
          { "name": "Oracle's one-click video search and summarization deployment on OCI, the platform this builds on", "required": false }
        ]
      },
      {
        "key": "custom",
        "label": "Configuration & integrations",
        "summary": "Your rule sets, damage taxonomy and reviewer roles, and the integrations in and out.",
        "vendors": ["softserve"],
        "items": [
          { "name": "From your capture channel: customer or technician media", "required": true, "direction": "inbound" },
          { "name": "From the asset master record: identifier, geometry, prior condition", "required": true, "direction": "inbound" },
          { "name": "To the booking, dispatch or claims system: the confirmed decision and its resolved scope", "required": true, "direction": "outbound" },
          { "name": "Write-back through Oracle Integration", "required": false, "direction": "outbound", "note": "After the Jumpstart" },
          { "name": "Rule set per market and contract, damage taxonomy per asset class, reviewer roles and thresholds", "required": true }
        ]
      }
    ],
    "capabilities": [
      {
        "stage": "Capture",
        "items": [
          { "name": "Capture request from a booking or claim", "state": "partial" },
          { "name": "Guidance on framing, distance and glare", "state": "roadmap" },
          { "name": "Scale anchor so size can be measured", "state": "roadmap" },
          { "name": "Both sides captured where the standard requires", "state": "roadmap" },
          { "name": "Usability check with a reasoned retake", "state": "roadmap" },
          { "name": "Tamper and reuse detection on submitted media", "state": "roadmap" }
        ]
      },
      {
        "stage": "Read the damage",
        "items": [
          { "name": "Identifier read from the media itself" },
          { "name": "Asset record and geometry retrieval", "state": "partial" },
          { "name": "Damage located and tracked across frames" },
          { "name": "Damage classified against a configurable taxonomy", "state": "partial" },
          { "name": "Each damage measured, with the basis stated", "state": "roadmap" },
          { "name": "Position mapped to the governing zone", "state": "roadmap" },
          { "name": "Post-repair residual predicted where rules require", "state": "roadmap" },
          { "name": "New damage separated from earlier repairs", "state": "roadmap" }
        ]
      },
      {
        "stage": "The call",
        "items": [
          { "name": "Repair, replace or refer, with confidence" },
          { "name": "Rule, frame and measurement cited on each call", "state": "partial" },
          { "name": "Tunable threshold between the two kinds of error", "state": "partial" },
          { "name": "Deciding rule type configurable per industry", "state": "roadmap" },
          { "name": "Follow-on work and safety flags at decision", "state": "roadmap" },
          { "name": "Scope priced from a parts and labour source", "state": "roadmap" },
          { "name": "Write-off test against a configurable ceiling", "state": "roadmap" }
        ]
      },
      {
        "stage": "Review and hand off",
        "items": [
          { "name": "Cases routed on confidence, policy and integrity", "state": "partial" },
          { "name": "Reviewer workspace with media, reading and rule", "state": "partial" },
          { "name": "Override with a captured reason", "state": "partial" },
          { "name": "Override rate tracked in aggregate only", "state": "roadmap" },
          { "name": "Decision record kept per market retention rules", "state": "partial" },
          { "name": "Output checked automatically before review", "state": "roadmap" },
          { "name": "Rules authored, versioned and deployed per market", "state": "roadmap" },
          { "name": "Rule changes replayed on past cases first", "state": "roadmap" },
          { "name": "Decision handed on with scope resolved", "state": "partial" },
          { "name": "Write-back to the system of record", "state": "partial" },
          { "name": "Accuracy evaluated on an agreed holdout set", "state": "partial" },
          { "name": "Corrections fed back into training", "state": "roadmap" }
        ]
      }
    ]
  },
  "jumpstart": {
    "title": "Jumpstart Proof-of-Value",
    "promise": "Pilot measured repair-or-replace calls on one asset class and one market's rules in 4–8 weeks, and take away an accuracy readout against a holdout set you agreed, with every call it would have corrected on record with its rule.",
    "durationShort": "4–8 weeks",
    "pillars": [
      { "key": "fast", "title": "Fast", "text": "4–8 weeks from kickoff to measured calls on your own photographs and an accuracy readout." },
      { "key": "low-risk", "title": "Low-risk", "text": "Fixed scope: one asset class, one market's rules, file-based in and out, in your own tenancy. A reviewer confirms every call before it counts." },
      { "key": "tangible", "title": "Tangible", "text": "Measured repair-or-replace calls on one asset class, each citing its rule, checked against a holdout set you agreed, so you see which calls it would have corrected." }
    ],
    "outcomes": [
      "Repair-or-replace calls on your own photographs, each with its measurement and the rule it came from.",
      "An accuracy readout against a holdout set you agreed, and the calls it would have corrected, each with its rule.",
      "One market's rule set written down, versioned and applied the same way on every case.",
      "A costed plan for the next step: more asset classes, more markets, write-back into your systems."
    ],
    "timeline": [
      { "label": "Week 0 · Gate", "text": "Sponsor named, the asset class and market chosen, the holdout set and media access agreed in writing." },
      { "label": "Weeks 1–4 · Build", "text": "The rule set authored and versioned; the damage taxonomy and the measured features configured on your media." },
      { "label": "Weeks 5–7 · Review", "text": "Reviewers confirm or overrule the calls in the workspace, each override kept with its reason." },
      { "label": "Week 8 · Decision", "text": "Accuracy readout against the holdout set, and a costed proposal for the next step." }
    ],
    "needs": [
      "Photographs of one asset class, with the identifiers the assets carry",
      "The repair limits that apply in one market, as your technical standards team uses them",
      "A reviewer and a business owner who will judge the calls and sign off the holdout set"
    ],
    "investment": {
      "price": null,
      "duration": "4–8 weeks",
      "includes": [
        "One market's rule set, authored and versioned",
        "Measured decisions on one asset class against that rule set",
        "A reviewer workspace with override and a decision record",
        "An accuracy evaluation against an agreed holdout set, with the measurement basis stated",
        "Proof accepted on accuracy against the agreed holdout set, with the override rate reported in aggregate"
      ],
      "footnote": "Price and final scope are confirmed in scoping."
    },
    "next": [
      {
        "tier": "Integration",
        "text": "More asset classes, markets and contracts, rules authored by your own team, integrity checking, and write-back into your system of record.",
        "duration": "3–5 months",
        "price": "Scoped per engagement"
      },
      {
        "tier": "Scaling",
        "text": "Every market and language, per-market taxonomies, priced scope with the write-off test, and rule changes replayed on past cases.",
        "duration": "3–12 months",
        "price": "Scoped per engagement"
      }
    ],
    "cta": {
      "label": "Start a Jumpstart conversation",
      "route": "#/products/repair-or-replace-decisions/contacts"
    }
  }
}

  ],

  forms: {
    roles: [
      { value: "customer", label: "An Oracle customer" },
      { value: "oracle-seller", label: "An Oracle seller" },
      { value: "oracle-partner", label: "An Oracle partner" },
      { value: "softserve", label: "SoftServe" },
      { value: "other", label: "Other" }
    ],
    roleLabel: "I am a…",
    consent: {
      label: "I agree to SoftServe processing this inquiry. See the privacy policy.",
      linkLabel: "privacy policy",
      linkUrl: "https://www.softserveinc.com/en-us/privacy-policy"
    },
    productPlaceholder: "Not sure yet",
    labels: {
      name: "Full name",
      email: "Work email",
      company: "Company",
      role: "I am a…",
      product: "Product of interest",
      message: "What are you trying to fix?",
      messagePlaceholder: "The workflow, the volume, and what \"good\" would look like.",
      submitDemo: "Talk to us",
      sending: "Sending…",
      required: "Required",
      invalidEmail: "Enter a valid work email address."
    },
    demo: {
      anchor: "request-a-demo",
      heading: "Talk to us",
      sub: "Tell us the account or workflow you have in mind. We start with a workshop with your team, then scope a Jumpstart proof of value on your own data.",
      submitLabel: "Talk to us"
    },
    confirmations: {
      posted: {
        title: "Thanks, your request is in",
        body: "Someone from SoftServe’s Oracle dedicated practice will reply within two working days."
      }
    },
    offline: "This preview can’t send forms. Email {mailbox} and SoftServe’s Oracle dedicated practice will reply within two working days.",
    errors: {
      send: "That didn’t send. Please try again, or email {mailbox}.",
      limited: "Not sent: the site has had too many requests in the last hour. Please try again later, or email {mailbox}."
    }
  },

  salesKit: {
    page: {
      eyebrow: "For sellers",
      title: "Get the sales kit",
      body: "Enter your SoftServe or Oracle work email and we’ll email you the sales kit — what an account team needs to position SoftServe’s AI agents on Oracle and open the first customer conversation.",
      again: "Request another kit",
      routeLink: { label: "Talk to us", route: "#/#talk" },
      povTitle: "See the fit in an account?",
      povBody: "Let’s discuss a Proof of Value on the customer’s own data — 4–8 weeks, ending in measurable KPIs.",
      povLink: "Talk to us"
    },
    tab: {
      title: "Get the sales kit",
      body: "Enter your SoftServe or Oracle work email and we’ll email you the {product} sales kit — what an account team needs to position it and open the first customer conversation.",
      routeLabel: "Talk to us",
      nextDemo: "Have an account in mind? {link} — after a workshop, a Jumpstart proof of value on the customer’s own data runs 4–8 weeks and ends in measurable KPIs.",
      nextDemoLink: "Talk to us"
    },
    form: {
      emailLabel: "Work email",
      emailPlaceholder: "you@oracle.com",
      productLabel: "Kit for",
      productPlaceholder: "Choose a product",
      submit: "Send me the kit",
      submitting: "Sending…",
      eligibility: "For @softserveinc.com and @oracle.com addresses only.",
      otherRoute: "Customer or partner? {routeLink}, or ask your SoftServe or Oracle point of contact.",
      kitName: "{product} sales kit",
      /* The site offers no kit for all offers (2026-09-29). The sender still
         answers such a request made without the page, and names it with this
         (tools/sync-links.js copies it into mail/catalog.json). */
      kitNameAll: "full sales kit",
      errors: {
        product: "Choose the product you’re selling.",
        email: "Enter your work email.",
        domain: "The kit only goes to @softserveinc.com and @oracle.com addresses. Customer or partner? {routeLink} instead.",
        send: "That didn’t send. Please try again, or email {mailbox}.",
        limited: "Not sent: the limit on kit requests has been reached for now. Kits already sent are in your inbox or its spam folder. For anything else, email {mailbox}."
      },
      offline: "This preview can’t send the kit. Email {mailbox} to ask for it.",
      confirmations: {
        sent: { title: "Check your inbox", body: "We’ve emailed the {kitName} to {email}. Not there in a few minutes? Check spam, or write to {mailbox}." },
        queued: { title: "Your request is in", body: "The {kitName} will reach {email} within two working days. Nothing by then? Write to {mailbox}." }
      }
    }
  }
};
