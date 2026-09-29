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
        "fusion-erp": { name: "Oracle Fusion Cloud ERP", group: "connected", icon: "platform-oracle-ai-fusion" }
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
        /* Alex, 2026-09-29: the block "misses the heading next to subheading
           … around the 'AI and Oracle expertise' message". The question is
           the eyebrow; the H2 answers it and leaves the proof to the three
           reasons (AI experts: the agentic pillar; know Oracle: the
           platform pillar). */
        eyebrow: "Why SoftServe on Oracle",
        title: "AI experts who know Oracle.",
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
      /* Alex, 2026-09-29: three lines, one each at every width. The first
         runs on into the second (Enterprise AI agents built on Oracle), so
         it takes no full stop (Alex, the same evening). */
      headline: {
        lead: "Enterprise AI agents",
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
        /* The careers site's AI & ML picture (career.softserveinc.com,
           about-us/focus0.webp, 800 x 452), upscaled four times with
           Real-ESRGAN and saved at 2400 px (PROVENANCE §60). */
        file: "assets/img/heroes/home-team.jpg",
        alt: "A white humanoid robot, one hand at its chin, among people walking past under a warm peach sky"
      }
    },
    offer: {
      title: "Everything to go live with AI on Oracle.",
      /* S2 is the live page's two ways in, with pictures of its own (Alex,
         2026-09-29: "Find smth better resolution while matching the
         content"): the careers site's about-us focus tiles, Data & Analytics
         for the products and Research & Development for the services
         (career.softserveinc.com, app-images/about-us/focus1 and focus3.webp,
         800 x 452), upscaled four times with Real-ESRGAN and saved at 2400 px
         (PROVENANCE §62). */
      productsImage: {
        file: "assets/img/heroes/offer-products.jpg",
        focal: "50% 50%",
        alt: "Two monitors, one with a line chart, and a laptop on a dark desk, crossed by a beam of warm light"
      },
      servicesImage: {
        file: "assets/img/heroes/offer-services.jpg",
        focal: "50% 30%",
        alt: "Three engineers in black T-shirts working together over hardware in a clear case, in cool blue light"
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
      ariaLabel: "SoftServe's offer in one picture: ready-made products, packaged services that take them to production in fixed steps, and bespoke services from dedicated AI, data and enablement pods under one governance, all built on Oracle's data and AI platforms",
      packaged: { name: "Packaged services", line: "Fixed-scope path to production" },
      products: { name: "Products", line: "Ready-made agents and workflows" },
      bespoke: { name: "Bespoke services", line: "Custom scope, dedicated pods" },
      /* Alex's sketch (2026-09-29): governance over five pods of three kinds,
         and the open one. Each pod is drawn by its kind's person glyph
         (overview-alt.js), in this order. */
      team: { governance: "Governance", governanceIcon: "shield", pods: ["ai", "data", "enablement", "ai", "data"] },
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
    /* The hero's photograph: softserveinc.com's own About Us photograph
       (Alex, 2026-09-29: download it). It is used as no other background on
       the site; the #/alt hero's oval is not repeated here. Decorative on the
       page (alt=""); `alt` is the record. `focal` places the photograph in a
       frame a quarter wider than the hero (site.css). */
    image: {
      file: "assets/img/heroes/products.jpg",
      alt: "A team at work around a laptop in a dark room, one of them lit orange by a low sun, a window of blue sky at the right",
      focal: "0 30%"
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
        line: "Runs in your own Oracle tenancy; nothing reaches the CRM until a reviewer approves it.",
        oracle: [
          { id: "oci", role: "Runs app and engine" },
          { id: "cx", role: "Receives the reviewed records" }
        ],
        diagram: {
          source: { name: "Signal feeds", note: "with organization context" },
          destinations: [
            { name: "Oracle Customer Experience (CX)" }
          ],
          toPlatform: "news, filings, disclosures, commercial data feeds",
          fromPlatform: "structured per-account records, routed to the owner",
          platform: { label: "Oracle Cloud Infrastructure", services: "Dedicated AI cluster, OKE, Object Storage, Oracle Autonomous AI Database, API Gateway" },
          app: { name: "Account insights by SoftServe", note: "filter, reason, score, reviewer UI" },
          engine: { name: "NVIDIA AI-Q Blueprint · NVIDIA NeMo Agent Toolkit", note: "agentic orchestration, retrieval, citation checks" }
        }
      },
      delivery: {
        scope: [
          "One signal set, one segment, files in and out: prove the reviewer agrees.",
          "Wired into the team's day: licensed feeds in, system of record out.",
          "Live write-back, outcome capture, tested on real outcomes."
        ],
        rows: [
          {
            area: "Grounding & sources",
            cells: [
              { mark: "partial", text: "One set of companies; an agreed extract; a bounded, licensed source set" },
              { mark: "included", text: "Your own licensed feeds; a versioned catalog of moves" },
              { mark: "advanced", text: "Multi-source, multi-market; a licensed relationship graph" }
            ]
          },
          {
            area: "Signal normalization",
            cells: [
              { mark: "partial", text: "Relevance, de-duplication, account resolution; scheduled and on-demand runs" },
              { mark: "included", text: "A standing watch per account, reporting what changed since last time, or that nothing did" },
              { mark: "advanced", text: "Deadline-driven triggers; sources gated by reliability class" }
            ]
          },
          {
            area: "Implication reasoning",
            cells: [
              { mark: "included", text: "Opportunity and risk reasoning; next-move mapping; ripple to two levels; scoring" },
              { mark: "included", text: "Opportunity and risk routed to separate owners; map to offerings, levers or mitigations" },
              { mark: "advanced", text: "Graph-backed ripple, portfolio aggregation, cost-aware ranking" }
            ]
          },
          {
            area: "Review & evidence",
            cells: [
              { mark: "included", text: "Reviewer UI; citations; evaluation harness; feedback capture" },
              { mark: "included", text: "Human triage of raw inbound; a 'nothing found' verdict recorded like any other" },
              { mark: "advanced", text: "Tuning from reviewer feedback, kept as a learning loop; replay of any past day" }
            ]
          },
          {
            area: "Output & delivery",
            cells: [
              { mark: "partial", text: "Records exported as files; reviewer decisions captured, not written back" },
              { mark: "included", text: "Export to the system of record; routing to the owner" },
              { mark: "advanced", text: "Live write-back; outcome capture feeding scoring" }
            ]
          }
        ],
        advanced: "multi-source / advanced"
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
        line: "Source access is read-only, in your own tenancy, and a person decides every outcome.",
        oracle: [
          { id: "oci", role: "Runs the case assembly" }
        ],
        diagram: {
          source: { name: "Source exports", note: "case management, correspondence, operational records" },
          destinations: [
            { name: "Investigators", note: "amend, approve or flag each case" }
          ],
          toPlatform: "read-only exports of the records",
          fromPlatform: "cited case file: summary, timeline, drafts",
          platform: { label: "Oracle Cloud Infrastructure", services: "Dedicated AI cluster, Object Storage" },
          app: { name: "Case evidence collection by SoftServe", note: "evidence assembly, timeline, citations, investigator UI" },
          engine: { name: "NVIDIA AI-Q", note: "multi-document reasoning, draft sections" }
        }
      },
      delivery: {
        scope: [
          "One case category, one historical sample, read-only exports: the case file assembled and cited.",
          "Live sources, the production approval workflow and its audit trail, for one case category.",
          "More case categories and source systems, with regional rule and retention sets."
        ],
        rows: [
          {
            area: "Intake & scoping",
            cells: [
              { mark: "partial", text: "One case category, one historical sample; exports from case management, correspondence and operational records" },
              { mark: "included", text: "Live source integration, for one case category" },
              { mark: "advanced", text: "More case categories" }
            ]
          },
          {
            area: "Evidence assembly",
            cells: [
              { mark: "included", text: "Evidence assembled and cited across the agreed sample, at sentence and field level" },
              { mark: "included", text: "Assembled from live sources" },
              { mark: "advanced", text: "More source systems" }
            ]
          },
          {
            area: "Case file",
            cells: [
              { mark: "included", text: "Case summary, chronological timeline and draft response sections per case" },
              { mark: "included", text: "Built for live cases, one category" },
              { mark: "advanced", text: "Regional rule sets applied to the draft" }
            ]
          },
          {
            area: "Investigate & decide",
            cells: [
              { mark: "included", text: "The investigator UI and its audit log; a person decides the outcome" },
              { mark: "included", text: "The production approval workflow and its audit trail" },
              { mark: "advanced", text: "Regional rule sets in the approval workflow" }
            ]
          },
          {
            area: "Deployment",
            cells: [
              { mark: "partial", text: "Your own tenancy; historical, non-production records under read-only access" },
              { mark: "included", text: "Production, live for one case category" },
              { mark: "advanced", text: "Regional retention sets" }
            ]
          }
        ],
        advanced: "multi-category / advanced"
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
        line: "Every finding is tied to the record it came from; anything unresolved is reported as a coverage gap.",
        oracle: [
          { id: "oci", role: "GPU compute, zoned storage" },
          { id: "ai-database", role: "Vector search over evidence" }
        ],
        diagram: {
          source: { name: "Approved exports", note: "schedule, cost, progress reports; contracts, layouts" },
          destinations: [
            { name: "Planners", note: "confirm or reject each finding" }
          ],
          toPlatform: "approved static exports",
          fromPlatform: "unit-level view: variances, drivers, coverage gaps",
          platform: { label: "Oracle Cloud Infrastructure", services: "GPU compute, zoned Object Storage, Oracle Autonomous AI Database, OpenSearch" },
          app: { name: "Plan vs actual investigation by SoftServe", note: "conformed model, comparison, drivers, review app" },
          engine: { name: "NVIDIA AI-Q", note: "reasoning, embedding and reranking" }
        }
      },
      delivery: {
        scope: [
          "One anchor portfolio or project, one agreed sample, approved exports: a unit-level plan-versus-actual view.",
          "Live source feeds instead of static exports, extension beyond the anchor sample, production hardening.",
          "More portfolios and unit types, regional variance rules, multi-entity evidence retention."
        ],
        rows: [
          {
            area: "Ingest & profile",
            cells: [
              { mark: "partial", text: "Approved static exports for one anchor portfolio or project, one agreed sample; ingestion with lineage" },
              { mark: "included", text: "Live source feeds in place of static exports" },
              { mark: "advanced", text: "More portfolios" }
            ]
          },
          {
            area: "Map & resolve",
            cells: [
              { mark: "included", text: "The conformed model and the mapping layer, resolved to the lowest reliable unit" },
              { mark: "included", text: "Extension beyond the anchor sample" },
              { mark: "advanced", text: "More unit types" }
            ]
          },
          {
            area: "Compare & explain",
            cells: [
              { mark: "included", text: "Plan-versus-actual comparison: variances, patterns and candidate drivers with their evidence" },
              { mark: "included", text: "The same comparison on live feeds" },
              { mark: "advanced", text: "Regional variance rules" }
            ]
          },
          {
            area: "Review & evidence",
            cells: [
              { mark: "included", text: "The review app and the coverage-gap report; every material finding tied to the record it came from" },
              { mark: "included", text: "The review app on live findings" },
              { mark: "advanced", text: "Multi-entity evidence retention" }
            ]
          },
          {
            area: "Deployment",
            cells: [
              { mark: "partial", text: "Your own tenancy, with stage gates at framework readiness, analytical review and evidence output" },
              { mark: "included", text: "Production hardening" },
              { mark: "advanced", text: "Rolled out across entities" }
            ]
          }
        ],
        advanced: "multi-portfolio / advanced"
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
        line: "Every value is cited to its page, and only the rows your reviewer approves are exported.",
        oracle: [
          { id: "oci", role: "Runs extraction on GPUs" },
          { id: "ai-database", role: "Stores extracted fields" }
        ],
        diagram: {
          source: { name: "Contract repository", note: "source PDFs" },
          destinations: [
            { name: "Cost / ERP systems", note: "rates & terms" }
          ],
          toPlatform: "source contracts, field rules",
          fromPlatform: "extracted data, rates & terms (cited)",
          platform: { label: "Oracle Cloud Infrastructure", services: "Dedicated AI cluster (H100), Oracle Autonomous AI Database" },
          app: { name: "Large docs processing and review by SoftServe", note: "extraction pipeline and reviewer UI" },
          engine: { name: "NVIDIA AI-Q", note: "GPU-accelerated extraction, vision-language models, retrieval" }
        }
      },
      delivery: {
        scope: [
          "Limited setup with manual upload to prove value.",
          "Full setup, integration and launch for one document type.",
          "Scaling across document types, volume and business units."
        ],
        rows: [
          {
            area: "Document classification & routing",
            cells: [
              { mark: "included", text: "Document-type gate and page routing for one target type" },
              { mark: "included", text: "Classification and routing embedded in the workflow" },
              { mark: "advanced", text: "Multi-document-type classification & routing" }
            ]
          },
          {
            area: "Extraction rules & field schema",
            cells: [
              { mark: "partial", text: "Core fields for one document type with the most common rules (header, services, base rates)" },
              { mark: "included", text: "Full field schema with all business rules (ranges, parent-child rates, formulas, discounts, suspensions)" },
              { mark: "advanced", text: "Multiple document-type schemas and rule sets" }
            ]
          },
          {
            area: "Confidence scoring & validation",
            cells: [
              { mark: "partial", text: "Per-value confidence and core validators with reviewer warnings" },
              { mark: "included", text: "Full validator suite with coverage audit and deterministic post-processing" },
              { mark: "advanced", text: "Type-specific validation and tuning per document type" }
            ]
          },
          {
            area: "Human-in-the-loop review UI",
            cells: [
              { mark: "included", text: "Split-view reviewer (source beside data), source-page links, approve, edit or reject, export gating" },
              { mark: "included", text: "Reviewer UI with feedback loop and audit trail, integrated in the workflow" },
              { mark: "advanced", text: "Multiple workflows and roles across business units" }
            ]
          },
          {
            area: "Accuracy benchmarking & KPIs",
            cells: [
              { mark: "included", text: "Row and field accuracy against annotated ground truth; effort-savings read" },
              { mark: "included", text: "Accuracy KPIs with production feedback and custom analytics" },
              { mark: "advanced", text: "Multiple type-specific KPI sets" }
            ]
          },
          {
            area: "Source / target integration",
            cells: [
              { mark: "none", text: "Manual upload; export to file (JSON, CSV or XLSX, against a reference template)" },
              { mark: "included", text: "In: contract repository; out: cost / ERP systems; up to five typical integrations" },
              { mark: "advanced", text: "Multiple type-specific integration landscapes" }
            ]
          },
          {
            area: "Deployment",
            cells: [
              { mark: "partial", text: "Sandboxed (IP whitelisting and bastion)" },
              { mark: "included", text: "Enterprise-integrated (dedicated landing zone, IAM, observability)" },
              { mark: "advanced", text: "Enterprise-integrated, multi-zone" }
            ]
          }
        ],
        advanced: "multi-type / advanced"
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
        line: "Nothing reaches the field until a dispatcher approves the plan; it all runs in your own tenancy.",
        oracle: [
          { id: "oci", role: "Dedicated GPU cluster" },
          { id: "fusion-field-service", role: "Bookings in, allocations out" }
        ],
        diagram: {
          source: { name: "Oracle Fusion Field Service", note: "field workforce & assignments" },
          destinations: [],
          toPlatform: "technician data, default allocations",
          fromPlatform: "optimized allocations: zones, visits",
          platform: { label: "Oracle Cloud Infrastructure", services: "Dedicated AI cluster" },
          app: { name: "Workforce optimization by SoftServe", note: "optimization engine and dispatcher UI" },
          engine: { name: "NVIDIA cuOpt", note: "GPU-accelerated solver" }
        }
      },
      delivery: {
        scope: [
          "Limited setup and optimized schedules with manual data import to prove value.",
          "Full setup, data integration and launch at one location.",
          "Solution scaling across heterogeneous markets & regions."
        ],
        rows: [
          {
            area: "Optimization rules & guardrails",
            cells: [
              { mark: "partial", text: "Foundational allocation with the recurring, most-typical constraints: zones, skills, planned absences" },
              { mark: "included", text: "Advanced allocation with all operational complexities: urgent jobs, crews, SLAs, inventory coupling" },
              { mark: "advanced", text: "Multiple region-specific optimization-rule configurations" }
            ]
          },
          {
            area: "Re-optimization & feedback loop",
            cells: [
              { mark: "none" },
              { mark: "included", text: "Feedback-driven re-optimization with alternative allocation options" },
              { mark: "advanced", text: "Multiple region-specific (re-)optimization workflows" }
            ]
          },
          {
            area: "Analytics and efficiency KPIs",
            cells: [
              { mark: "included", text: "Core KPIs (predicted at scheduling per benchmarks)" },
              { mark: "included", text: "KPIs with an execution-data feedback loop and custom analytics" },
              { mark: "advanced", text: "Multiple region-specific KPI sets" }
            ]
          },
          {
            area: "Oracle Fusion Field Service integration",
            cells: [
              { mark: "none" },
              { mark: "included", text: "In: staff, availability, booking data; out: allocations; in: factual durations & times" },
              { mark: "advanced", text: "Multiple region-specific integrations" }
            ]
          },
          {
            area: "Additional data sources & BI integration",
            cells: [
              { mark: "none" },
              {
                mark: "included",
                text: "Up to five typical integrations: booking system, inventory for parts availability, HR/WFM for people availability, demand forecasting, BI"
              },
              { mark: "advanced", text: "Multiple region-specific integration landscapes" }
            ]
          },
          {
            area: "Deployment",
            cells: [
              { mark: "partial", text: "Sandboxed" },
              { mark: "included", text: "Enterprise-integrated (dedicated landing zone, IAM, observability)" },
              { mark: "advanced", text: "Enterprise-integrated, multi-zone" }
            ]
          }
        ],
        advanced: "multi-region / advanced"
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
        line: "A managed service in your own tenancy; governance sits in the data layer, not in the prompt.",
        oracle: [
          { id: "ai-lakehouse", role: "Governed layer, answers questions" },
          { id: "ai-data-platform", role: "Registers the governed layer" },
          { id: "fusion-erp", role: "ERP data, prebuilt pipelines" }
        ],
        diagram: {
          source: { name: "Oracle Fusion Cloud ERP", note: "plus one or two other sources, read-only" },
          destinations: [
            { name: "Business teams", note: "plain-language answers, certified views, dashboards" }
          ],
          toPlatform: "ERP data through prebuilt pipelines",
          fromPlatform: "answers and dashboards over the governed model",
          platform: { label: "Oracle Autonomous AI Lakehouse", services: "governed layer, masking, row-level policies, SQL firewall" },
          app: { name: "Cross-system ERP Q&A by SoftServe", note: "certified views, question set, dashboards" },
          engine: { name: "Oracle Select AI", note: "natural-language querying, Select AI Agent" }
        }
      },
      delivery: {
        scope: [
          "One use case, up to three sources; the decision domain answered in plain language.",
          "Live integration, more sources and decision domains, production SLAs.",
          "Multi-entity rollout, with per-region governance and definitions."
        ],
        rows: [
          {
            area: "Connect",
            cells: [
              { mark: "partial", text: "Up to three sources: Oracle application data through prebuilt pipelines; other sources by link or pipeline, read-only" },
              { mark: "included", text: "Live integration; more sources" },
              { mark: "advanced", text: "Every entity's sources connected" }
            ]
          },
          {
            area: "Model",
            cells: [
              { mark: "included", text: "One decision domain: certified views, business definitions signed off with the owner" },
              { mark: "included", text: "More decision domains" },
              { mark: "advanced", text: "Per-region definitions" }
            ]
          },
          {
            area: "Govern",
            cells: [
              { mark: "included", text: "Masking, row-level access and the SQL firewall, enforced in the data layer" },
              { mark: "included", text: "The same policies over every added source and domain" },
              { mark: "advanced", text: "Per-region governance" }
            ]
          },
          {
            area: "Answer",
            cells: [
              { mark: "included", text: "Plain-language Q&A over the agreed question set; two to three operational dashboards" },
              { mark: "included", text: "Answers over each added domain" },
              { mark: "advanced", text: "One assistant across the rollout" }
            ]
          },
          {
            area: "Deployment",
            cells: [
              { mark: "partial", text: "Managed service in your own tenancy: OCI, or Autonomous inside AWS, Azure or Google Cloud" },
              { mark: "included", text: "Production SLAs" },
              { mark: "advanced", text: "Multi-entity rollout" }
            ]
          }
        ],
        advanced: "multi-entity / advanced"
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
        line: "Nothing is migrated or copied: queries run where the data lives, in whichever cloud you prefer.",
        oracle: [
          { id: "ai-lakehouse", role: "Governed gold layer" },
          { id: "ai-data-platform", role: "Registers the gold layer" }
        ],
        diagram: {
          source: { name: "Existing catalogs and databases", note: "Iceberg catalogs mounted, databases linked, read-only" },
          destinations: [
            { name: "Analysts", note: "plain-language answers and charts" }
          ],
          toPlatform: "catalogs mounted, databases linked, queried in place",
          fromPlatform: "one answer across every connected source",
          platform: { label: "Oracle Autonomous AI Lakehouse", services: "governed gold layer, business definitions, masking, SQL firewall" },
          app: { name: "Business metrics Q&A by SoftServe", note: "gold model, definitions, 30-question set, tuning" },
          engine: { name: "Oracle Select AI", note: "natural-language questions over the gold layer" }
        }
      },
      delivery: {
        scope: [
          "One use case, up to three sources: an assistant answering an agreed 30-question set.",
          "Live integration, more catalogs, databases and decision domains, production SLAs.",
          "Multi-entity rollout, with per-region governance and definitions."
        ],
        rows: [
          {
            area: "Mount",
            cells: [
              { mark: "partial", text: "Two to three existing catalogs mounted, one on-premises database linked, read-only" },
              { mark: "included", text: "Live integration; more catalogs and databases" },
              { mark: "advanced", text: "Every entity's catalogs and databases" }
            ]
          },
          {
            area: "Model",
            cells: [
              { mark: "included", text: "A governed gold model with its business definitions, tuned with your analysts" },
              { mark: "included", text: "More decision domains" },
              { mark: "advanced", text: "Per-region definitions" }
            ]
          },
          {
            area: "Govern",
            cells: [
              { mark: "included", text: "Masking, row-level access and the SQL firewall, in the data layer" },
              { mark: "included", text: "The same policies over every added catalog and database" },
              { mark: "advanced", text: "Per-region governance" }
            ]
          },
          {
            area: "Answer",
            cells: [
              { mark: "included", text: "An assistant answering an agreed 30-question set across every connected source" },
              { mark: "included", text: "Answers over each added domain" },
              { mark: "advanced", text: "One assistant across the rollout" }
            ]
          },
          {
            area: "Deployment",
            cells: [
              { mark: "partial", text: "Managed service in whichever cloud you prefer; nothing migrated or copied" },
              { mark: "included", text: "Production SLAs" },
              { mark: "advanced", text: "Multi-entity rollout" }
            ]
          }
        ],
        advanced: "multi-entity / advanced"
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
        line: "Tested on your own past days, in your tenancy; a dispatcher approves every change before it lands.",
        oracle: [
          { id: "oci", role: "Hosts app and solver" },
          { id: "fusion-field-service", role: "Jobs in, routes out" }
        ],
        diagram: {
          source: { name: "Oracle Fusion Field Service", note: "with fleet telematics, traffic and charger data" },
          destinations: [],
          toPlatform: "jobs, windows, engineers, skills",
          fromPlatform: "re-planned routes, charging stops, unassigned visits",
          platform: { label: "Oracle Cloud Infrastructure", services: "GPU instance and Kubernetes" },
          app: { name: "Fleet route optimization by SoftServe", note: "replay, charging stops, battery check, compare" },
          engine: { name: "NVIDIA cuOpt", note: "GPU route solve, charging stops included" }
        }
      },
      delivery: {
        scope: [
          "One region, a handful of real days, files in and out: prove the re-plan beats the real day.",
          "Wired into dispatch: Oracle Fusion Field Service in, recommended routes back for dispatcher approval.",
          "Every region, re-planned during the day, savings in money."
        ],
        rows: [
          {
            area: "Data and replay",
            cells: [
              { mark: "partial", text: "Historic exports for a few days in one region; calibrated replay" },
              { mark: "included", text: "Live read from Oracle Fusion Field Service; live traffic" },
              { mark: "advanced", text: "Every region, every day" }
            ]
          },
          {
            area: "Route planning",
            cells: [
              { mark: "included", text: "Windows, skills, priorities, mixed fleet; unassigned visits with reasons" },
              { mark: "included", text: "Re-plans on the dispatcher's request" },
              { mark: "advanced", text: "Re-planning during the day on disruption" }
            ]
          },
          {
            area: "EV and charging",
            cells: [
              { mark: "partial", text: "One charging stop per shift; battery check on every route" },
              { mark: "included", text: "Several stops per shift; live charger data" },
              { mark: "advanced", text: "Queueing at shared chargers" }
            ]
          },
          {
            area: "Comparison and decision",
            cells: [
              { mark: "included", text: "Actual, replayed and re-planned side by side; decision pack" },
              { mark: "included", text: "The same metrics tracked on live days" },
              { mark: "advanced", text: "Savings in money and carbon" }
            ]
          },
          {
            area: "Dispatch and operations",
            cells: [
              { mark: "none", text: "Reports only; nothing written back" },
              { mark: "included", text: "Dispatcher review, write-back to Oracle Fusion Field Service; sign-in, roles, audit" },
              { mark: "advanced", text: "Per-region dispatch rules and run telemetry" }
            ]
          }
        ],
        advanced: "multi-region / advanced"
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
    "line": "A reviewer confirms or overrules every call before it goes out, all inside your own tenancy.",
    "oracle": [
      {
        "id": "oci",
        "role": "Runs the vision models"
      },
      {
        "id": "ai-database",
        "role": "Decision record, rule sets"
      }
    ],
    "diagram": {
      "source": {
        "name": "Capture channel",
        "note": "with asset record: identifier, geometry, prior condition"
      },
      "destinations": [
        {
          "name": "Booking, dispatch or claims system"
        }
      ],
      "toPlatform": "customer or technician media",
      "fromPlatform": "confirmed decision and its resolved scope",
      "platform": {
        "label": "Oracle Cloud Infrastructure",
        "services": "media, audit, rules"
      },
      "app": {
        "name": "Repair-or-replace decisions by SoftServe",
        "note": "guided capture, review, rules, decision record"
      },
      "engine": {
        "name": "NVIDIA AI Enterprise · VSS and AI-Q",
        "note": "vision and reasoning engine"
      }
    }
  },
  "delivery": {
    "scope": [
      "One asset class, one market, files in and out: measured calls on your photos.",
      "Write-back to your system of record; more asset classes, markets and your own rules.",
      "Every market and language, priced scope, the write-off test, rules replayed on past cases."
    ],
    "rows": [
      {
        "area": "Capture & intake",
        "cells": [
          {
            "mark": "partial",
            "text": "One capture channel, one language"
          },
          {
            "mark": "included",
            "text": "Your own channels and branding"
          },
          {
            "mark": "advanced",
            "text": "Every market, every language"
          }
        ]
      },
      {
        "area": "Damage assessment",
        "cells": [
          {
            "mark": "partial",
            "text": "One asset class, one taxonomy"
          },
          {
            "mark": "included",
            "text": "Additional asset classes"
          },
          {
            "mark": "advanced",
            "text": "Per-market taxonomies and retraining"
          }
        ]
      },
      {
        "area": "Decision & estimate",
        "cells": [
          {
            "mark": "partial",
            "text": "One market's rule set"
          },
          {
            "mark": "included",
            "text": "Multiple markets and contracts"
          },
          {
            "mark": "advanced",
            "text": "Priced scope and the write-off test"
          }
        ]
      },
      {
        "area": "Assurance & audit",
        "cells": [
          {
            "mark": "partial",
            "text": "Review, override and a decision record"
          },
          {
            "mark": "included",
            "text": "Integrity checking and machine checks before review"
          },
          {
            "mark": "advanced",
            "text": "Override rate measured and reported"
          }
        ]
      },
      {
        "area": "Operations & administration",
        "cells": [
          {
            "mark": "partial",
            "text": "Rules authored by SoftServe"
          },
          {
            "mark": "included",
            "text": "Rules authored by your team"
          },
          {
            "mark": "advanced",
            "text": "Multi-market administration; rule changes replayed on past cases"
          }
        ]
      }
    ],
    "advanced": "multi-market / advanced"
  }
}

  ],

  forms: {
    /* Alex's order and names (2026-09-29). None is picked until the email
       has a domain, which then picks one (config.js formDomains). The legend
       is the noun "Role", as its siblings are nouns: "I am a…" read "I am a…
       An Oracle seller". */
    roles: [
      { value: "oracle-seller", label: "Oracle seller" },
      { value: "softserve", label: "SoftServe seller" },
      { value: "oracle-partner", label: "Oracle partner" },
      { value: "customer", label: "Customer" },
      { value: "other", label: "Other" }
    ],
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
      role: "Role",
      product: "Product of interest",
      /* Alex, 2026-09-29: "not so good of a question". "Fix" presumed a fault
         and spoke to a customer only; a seller brings an account. This one
         reads the same for both, and the placeholder asks for the four facts
         a reply needs. */
      message: "What should we know first?",
      messagePlaceholder: "Who it’s for, what they do today, the volume, and what should change.",
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
