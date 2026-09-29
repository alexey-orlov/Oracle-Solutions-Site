window.SITE_CONFIG = {
  contactEmail: "oracle@softserveinc.com",
  formEndpoint: "",
  sellerGate: {
    allowedDomains: ["softserveinc.com", "oracle.com"],
    kitAutoSend: true,
    kitEmailKey: "oracle-ai-solutions:kit-email",
    legacyStorageKey: "oracle-ai-solutions:seller-unlocked"
  },
  /* Talk to us reads the work email's domain (Alex, 2026-09-29): "I am a…"
     stays unpicked until the email has one. A domain below, or a subdomain of
     it, picks its role and fills Company with its name; any other picks
     `otherRole` and fills Company from the domain itself (acme.co.uk →
     Acme), except a personal mailbox, which fills none. What the visitor
     picks or types is never overwritten (assets/forms.js). */
  formDomains: {
    known: [
      { domain: "oracle.com", role: "oracle-seller", company: "Oracle" },
      { domain: "softserveinc.com", role: "softserve", company: "SoftServe" }
    ],
    otherRole: "customer",
    personal: [
      "gmail.com", "googlemail.com", "outlook.com", "hotmail.com", "live.com",
      "msn.com", "yahoo.com", "icloud.com", "me.com", "mac.com", "aol.com",
      "proton.me", "protonmail.com", "gmx.com", "gmx.de", "mail.com",
      "zoho.com", "yandex.com", "yandex.ru", "mail.ru", "ukr.net", "i.ua"
    ]
  },
  productOrder: [
    "large-document-extraction",
    "account-insights",
    "workforce-optimization",
    "plan-vs-actual-investigation",
    "case-evidence-collection",
    "cross-system-erp-qa",
    "business-metrics-qa",
    "fleet-route-optimization",
    "repair-or-replace-decisions"
  ],
  /* Links to the walkthrough, the video and the kit documents are not here:
     they live in links.json at the repo root (round 12, docs/CONFIG.md).
     Round 18 (Alex: "no fake and placeholder links"): the hero's frame
     renders only when links.json holds what it opens, so the `video` switch
     is retired, and `marketplace` may be true only with its listing URL.
     `videoPoster` is that frame's still, the product's own screen: it shows
     over the recording and, with no recording, over the walkthrough
     (2026-09-29, PROVENANCE §55). */
  products: {
    "account-insights": {
      marketplace: false,
      marketplaceUrl: "",
      videoPoster: "assets/img/posters/account-insights.jpg",
      successStoryUrl: ""
    },
    "case-evidence-collection": {
      marketplace: false,
      marketplaceUrl: "",
      videoPoster: "",
      successStoryUrl: ""
    },
    "plan-vs-actual-investigation": {
      marketplace: false,
      marketplaceUrl: "",
      videoPoster: "",
      successStoryUrl: ""
    },
    "large-document-extraction": {
      marketplace: false,
      marketplaceUrl: "",
      videoPoster: "assets/img/posters/large-document-extraction.jpg",
      successStoryUrl: ""
    },
    "workforce-optimization": {
      marketplace: false,
      marketplaceUrl: "",
      videoPoster: "assets/img/posters/workforce-optimization.jpg",
      successStoryUrl: ""
    },
    "cross-system-erp-qa": {
      marketplace: false,
      marketplaceUrl: "",
      videoPoster: "assets/img/posters/cross-system-erp-qa.jpg",
      successStoryUrl: ""
    },
    "business-metrics-qa": {
      marketplace: false,
      marketplaceUrl: "",
      videoPoster: "",
      successStoryUrl: ""
    },
    "fleet-route-optimization": {
      marketplace: false,
      marketplaceUrl: "",
      videoPoster: "assets/img/posters/fleet-route-optimization.jpg",
      successStoryUrl: ""
    },
    "repair-or-replace-decisions": {
      marketplace: false,
      marketplaceUrl: "",
      videoPoster: "assets/img/posters/repair-or-replace-decisions.jpg",
      successStoryUrl: ""
    }
  }
};
