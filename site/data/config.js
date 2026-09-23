window.SITE_CONFIG = {
  contactEmail: "oracle@softserveinc.com",
  formEndpoint: "",
  sellerGate: {
    allowedDomains: ["softserveinc.com", "oracle.com"],
    kitAutoSend: true,
    kitEmailKey: "oracle-ai-solutions:kit-email",
    legacyStorageKey: "oracle-ai-solutions:seller-unlocked"
  },
  productOrder: [
    "large-document-extraction",
    "account-insights",
    "workforce-optimization",
    "plan-vs-actual-investigation",
    "case-evidence-collection",
    "cross-system-erp-qa",
    "business-metrics-qa"
  ],
  /* Links to the walkthrough, the video and the kit documents are not here:
     they live in links.json at the repo root (round 12, docs/CONFIG.md). */
  products: {
    "account-insights": {
      marketplace: false,
      marketplaceUrl: "",
      video: true,
      videoPoster: "",
      successStoryUrl: ""
    },
    "case-evidence-collection": {
      marketplace: false,
      marketplaceUrl: "",
      video: false,
      videoPoster: "",
      successStoryUrl: ""
    },
    "plan-vs-actual-investigation": {
      marketplace: false,
      marketplaceUrl: "",
      video: false,
      videoPoster: "",
      successStoryUrl: ""
    },
    "large-document-extraction": {
      marketplace: true,
      marketplaceUrl: "",
      video: true,
      videoPoster: "assets/img/posters/large-document-extraction.jpg",
      successStoryUrl: ""
    },
    "workforce-optimization": {
      marketplace: true,
      marketplaceUrl: "",
      video: true,
      videoPoster: "assets/img/posters/workforce-optimization.jpg",
      successStoryUrl: ""
    },
    "cross-system-erp-qa": {
      marketplace: false,
      marketplaceUrl: "",
      video: false,
      videoPoster: "assets/img/posters/cross-system-erp-qa.jpg",
      successStoryUrl: ""
    },
    "business-metrics-qa": {
      marketplace: false,
      marketplaceUrl: "",
      video: false,
      videoPoster: "",
      successStoryUrl: ""
    }
  }
};
