/* Internal review list: TEMPORARY, for the prototype only.
   assets/review.js renders it as the "Internal" button and a checklist
   panel. Ticks are saved in the viewer's browser only (localStorage).
   Anyone with the preview link can see the panel; enabled: false hides it.
   Before launch, delete this file, assets/review.js and their two <script>
   tags (docs/START-HERE.md §8).

   Keep it short (Alex, 2026-09-17: "1-2 line items"): an item is `id`,
   `text` (70 characters at most; 47 when the item has a note, so text and
   note take two lines) and an optional `note` (45 at most) naming where the
   site does not match yet. tools/check-grammar.js enforces both. */
window.SITE_REVIEW = {
  enabled: true,
  eyebrow: "Internal · prototype only",
  title: "To confirm",
  footer: "Ticks are saved in this browser only.",
  groups: [
    {
      title: "Target audience",
      items: [
        { id: "audience-oracle", text: "Priority 1: Oracle sellers and partners", note: "Partners can't get the sales kit today" },
        { id: "audience-softserve", text: "Priority 2: SoftServe sellers" },
        { id: "audience-customers", text: "Priority 3: end customers" }
      ]
    },
    {
      title: "Positioning",
      items: [
        { id: "positioning-experts", text: "Experts in AI and Oracle platforms, top-class enterprise record" },
        { id: "positioning-offer", text: "Ready-made solutions + fast PoVs + a dedicated practice" },
        { id: "positioning-both", text: "We offer both products and services" }
      ]
    },
    {
      title: "Commitments and disclosures",
      items: [
        { id: "pov-duration", text: "A PoV runs from 30 days (4–8 weeks, to agree with delivery)" },
        { id: "prices", text: "Only the PoV price on site; others in materials", note: "2 products still show Integration prices" },
        { id: "customer-names", text: "No customer names (no confirmation of use yet)" },
        { id: "planned-products", text: "Catalog includes existing and planned products", note: "Nothing marks a product as planned" }
      ]
    },
    {
      title: "Communication flow",
      items: [
        { id: "mailbox", text: "One shared mailbox: oracle@softserveinc.com" },
        { id: "contact-karsten", text: "Karsten is the contact for communications" },
        { id: "requests", text: "All requests land in the shared mailbox", note: "Forms open the visitor's mail app for now" },
        { id: "materials", text: "Materials only to softserveinc.com, oracle.com", note: "Nothing sends the kit automatically yet" }
      ]
    },
    {
      title: "Before launch",
      items: [
        { id: "site-name", text: "The name Oracle AI & Data Solutions clears Oracle's trademark rules" },
        { id: "frontier-ai", text: "Frontier AI is a claim we can back up" }
      ]
    }
  ]
};
