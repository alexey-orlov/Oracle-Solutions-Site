/* Fleet route optimization — walkthrough data.
   SYNTHETIC. Every place, engineer, account, identifier and figure in this file is
   invented for the walkthrough: no customer's region, fleet, jobs or results.

   The model (references/demo-data-model.md):
     current state  = the replayed actual day (jobs with their recorded problems)  — never mutated
     named changes  = what the re-plan did, each with its rule and additive effects
     kpis(applied)  = a pure function of the applied change ids
     flagsFor(...)  = problems left, and costs a change introduces                */
(function () {
  "use strict";

  var ZONES = [
    { id: "ASH", name: "Ashby",       x: 170, y: 140 },
    { id: "BRK", name: "Brookfield",  x: 420, y: 110 },
    { id: "CAR", name: "Carlow Park", x: 690, y: 130 },
    { id: "DUN", name: "Dunmere",     x: 860, y: 250 },
    { id: "ELM", name: "Elmstead",    x: 160, y: 390 },
    { id: "FAI", name: "Fairholt",    x: 420, y: 470 },
    { id: "GLE", name: "Glenwick",    x: 690, y: 460 },
    { id: "HOL", name: "Hollin Vale", x: 870, y: 500 }
  ];

  var DEPOT = { id: "DEPOT", name: "Northgate depot", x: 520, y: 300 };

  var CHARGERS = [
    { id: "CH-DEP", name: "Depot chargers",       x: 548, y: 318, kind: "depot · 22 kW · 6 bays" },
    { id: "CH-BRK", name: "Brookfield hub",       x: 452, y: 150, kind: "rapid · 4 bays" },
    { id: "CH-DUN", name: "Dunmere rapid charger", x: 935, y: 305, kind: "rapid · 2 bays · shared public" },
    { id: "CH-GLE", name: "Glenwick hub",         x: 668, y: 420, kind: "rapid · 4 bays" }
  ];

  /* 12 vans. home = the zone the engineer works from. */
  var ENGINEERS = [
    { id: "E-101", ev: true,  home: "ASH", homeCharger: true,  skills: [] },
    { id: "E-102", ev: true,  home: "BRK", homeCharger: true,  skills: [] },
    { id: "E-103", ev: true,  home: "DUN", homeCharger: true,  skills: [] },
    { id: "E-104", ev: true,  home: "CAR", homeCharger: true,  skills: [] },
    { id: "E-105", ev: true,  home: "ELM", homeCharger: true,  skills: ["installer"] },
    { id: "E-106", ev: true,  home: "FAI", homeCharger: true,  skills: [] },
    { id: "E-107", ev: true,  home: "GLE", homeCharger: true,  skills: ["gas"] },
    { id: "E-108", ev: false, home: "HOL", homeCharger: false, skills: [] },
    { id: "E-109", ev: true,  home: "ASH", homeCharger: false, skills: [] },
    { id: "E-110", ev: false, home: "CAR", homeCharger: false, skills: [] },
    { id: "E-111", ev: false, home: "ELM", homeCharger: false, skills: ["gas"] },
    { id: "E-112", ev: false, home: "FAI", homeCharger: false, skills: ["installer"] }
  ];

  var TYPES = ["Smart meter exchange", "Fault diagnosis", "Boiler service", "Safety check", "EV charger install", "Smart meter exchange"];
  var SLOTS = ["08–10", "10–12", "12–14", "14–16", "16–18", "10–12"];

  /* Deterministic jitter so the map is identical on every load. */
  var seed = 7;
  function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }

  var JOBS = [];
  ENGINEERS.forEach(function (e, ei) {
    var z = ZONES.filter(function (q) { return q.id === e.home; })[0];
    for (var k = 0; k < 6; k++) {
      var n = ei * 6 + k + 1;
      var type = TYPES[(ei + k) % TYPES.length];
      if (type === "Boiler service" && e.skills.indexOf("gas") === -1 && n !== 57) type = "Fault diagnosis";
      if (type === "EV charger install" && e.skills.indexOf("installer") === -1 && n !== 47) type = "Smart meter exchange";
      JOBS.push({
        id: "J" + (n < 10 ? "0" + n : n),
        n: n,
        account: "NG-" + (1000 + n),
        booked: e.id,
        zone: z.id,
        type: type,
        slot: SLOTS[k],
        high: (n % 7 === 3) || n === 59,
        x: Math.round(z.x + (rnd() - 0.5) * 150),
        y: Math.round(z.y + (rnd() - 0.5) * 110)
      });
    }
  });
  /* Two jobs whose type the story depends on. */
  JOBS[56].type = "Boiler service";      /* J57 — booked on E-110, who holds no gas certificate */
  JOBS[46].type = "EV charger install";  /* J47 — needs a charger installer */
  JOBS[58].type = "Fault diagnosis"; JOBS[58].high = true; /* J59 — no-heating fault */
  /* Visits the recorded day sent across the region: each sits in the area of the
     engineer the re-plan hands it to, so the re-plan visibly shortens the drive. */
  function place(n, x, y) { JOBS[n - 1].x = x; JOBS[n - 1].y = y; }
  place(60, 205, 430);   /* booked on E-110 (Carlow Park), sits in Elmstead → E-111 */
  place(62, 655, 165);   /* booked on E-111 (Elmstead), sits in Carlow Park → E-110 */
  place(33, 845, 470);   /* booked on E-106 (Fairholt), sits in Hollin Vale → E-108 */
  place(45, 455, 440);   /* booked on E-108 (Hollin Vale), sits in Fairholt → E-106 */
  place(57, 700, 395);   /* boiler service at Glenwick's edge → gas-certified E-107 */

  /* The replayed actual day: what went wrong on it (recorded, then replayed). */
  var MISSED = { J57: "Booked on an engineer without a gas certificate",
                 J53: "Van ran low on charge at 14:00",
                 J16: "Mid-route depot return to charge",
                 J34: "Ran out of day after crossing the region twice",
                 J71: "Ran out of day after three returns to one street",
                 J47: "No charger installer free before 17:00" };
  var LATE = { J20: "Recorded order crossed Carlow Park twice",
               J21: "Recorded order crossed Carlow Park twice",
               J10: "Charged mid-route at 10:40",
               J59: "High-priority fault queued behind routine checks",
               J15: "Mid-route depot return to charge",
               J41: "Traffic on the ring road",
               J64: "Traffic on the ring road" };

  /* Baselines for the measures that are not counted from jobs.
     charge = in-day charging minutes across the 8 electric vans (incl. detours);
     travel = driving minutes across the 12 vans.                              */
  var BASE = { charge: 304, travel: 2112, engineers: 12, evs: 8, booked: 72 };

  /* The re-plan, as changes a planner can read. fixes = job problems it removes. */
  var CHANGES = [
    { id: "c-e104-order", plan: "v1", rule: "Booked windows kept", kind: "improves", eng: ["E-104"],
      title: "E-104's day re-ordered around booked slots",
      what: "The 10–12 meter exchanges now come before the fault diagnosis.",
      why: "The recorded order crossed Carlow Park twice.",
      fixes: ["J20", "J21"], effects: { travel: -26 } },
    { id: "c-gas-e107", plan: "v1", rule: "Skills matched", kind: "improves", eng: ["E-107", "E-110"],
      title: "Boiler service handed to a certified engineer",
      what: "NG-1057 moves from E-110 to E-107, who holds the gas certificate.",
      why: "E-110 cannot do gas work, so the visit failed on the day.",
      fixes: ["J57"], effects: { travel: 12 }, moves: { J57: "E-107" },
      cost: "E-107 drives 12 more minutes to take it." },
    { id: "c-e102-lunch", plan: "v1", rule: "Charge where it costs no visit", kind: "improves", eng: ["E-102"],
      title: "E-102 charges over the lunch break",
      what: "Charging moves to Brookfield hub at 12:30, during the break.",
      why: "The van charged mid-route at 10:40 and missed its slot.",
      charger: "CH-BRK", fixes: ["J10"], effects: { charge: -31 } },
    { id: "c-e110-priority", plan: "v1", rule: "Priority weighed against travel", kind: "improves", eng: ["E-110"],
      title: "No-heating fault pulled to 09:10",
      what: "High-priority NG-1059 goes first on E-110's day.",
      why: "It waited behind two routine checks on the day.",
      fixes: ["J59"], effects: { travel: 6 },
      cost: "A routine safety check moves later, still inside its slot." },
    { id: "c-swap-110-111", plan: "v1", rule: "Shorter drive", kind: "improves", eng: ["E-110", "E-111"],
      title: "Two visits swapped between E-110 and E-111",
      what: "Each engineer takes the visit in their own area.",
      why: "Each van was driving through the other's area.",
      fixes: [], effects: { travel: -58 }, moves: { J60: "E-111", J62: "E-110" } },
    { id: "c-e105-home", plan: "v1", rule: "Home-charging policy", kind: "improves", eng: ["E-105"],
      title: "E-105 starts on a full home charge",
      what: "The 09:00 top-up is dropped; the van leaves home at 95%.",
      why: "The recorded day topped up with range to spare.",
      fixes: [], effects: { charge: -41 } },
    { id: "c-e109-depot", plan: "v1", rule: "Home-charging exception", kind: "improves", eng: ["E-109"],
      title: "E-109 charges at the depot before the first visit",
      what: "20 minutes on the depot chargers at 07:40.",
      why: "No home charger: the van ran low at 14:00 and a visit was missed.",
      charger: "CH-DEP", fixes: ["J53"], effects: { charge: -18 } },
    { id: "c-e103-dunmere", plan: "v1", rule: "Charge where it costs no visit", kind: "tradeoff", eng: ["E-103"],
      title: "E-103 charges at Dunmere rapid charger at 12:10",
      what: "A 25-minute rapid charge replaces a depot return mid-route.",
      why: "The fastest charger on the route saves a 35-minute depot trip.",
      charger: "CH-DUN", fixes: ["J16", "J15"], effects: { charge: -38, travel: -20 },
      decision: "Dunmere is a shared public charger that often queues at midday. Queueing is not modelled in this plan." },
    { id: "c-regroup-106-108", plan: "v1", rule: "Shorter drive", kind: "improves", eng: ["E-106", "E-108"],
      title: "Fairholt and Hollin Vale visits regrouped",
      what: "E-106 and E-108 swap two visits and each works one loop.",
      why: "Both vans crossed the region twice.",
      fixes: ["J34"], effects: { travel: -190 }, moves: { J33: "E-108", J45: "E-106" } },
    { id: "c-e112-loop", plan: "v1", rule: "Shorter drive", kind: "improves", eng: ["E-112"],
      title: "E-112's Fairholt visits done in one loop",
      what: "Six visits re-sequenced into a single round.",
      why: "Three returns to the same street on the day.",
      fixes: ["J71"], effects: { travel: -132 } },
    /* Produced only by the re-plan that carries the planner's note (plan v2). */
    { id: "c-e103-depot", plan: "v2", rule: "Your note: avoid Dunmere at midday", kind: "improves", eng: ["E-103"],
      title: "E-103 charges at the depot at 07:40 instead",
      what: "A 30-minute depot charge before the first visit covers the day.",
      why: "Your note ruled out Dunmere at midday.",
      charger: "CH-DEP", fixes: ["J16"], effects: { charge: -26, travel: -8 } }
  ];

  var V1 = CHANGES.filter(function (c) { return c.plan === "v1"; }).map(function (c) { return c.id; });

  function byId(id) { return CHANGES.filter(function (c) { return c.id === id; })[0]; }

  function fixedBy(applied) {
    var f = {};
    applied.forEach(function (id) { (byId(id).fixes || []).forEach(function (j) { f[j] = id; }); });
    return f;
  }

  /* The KPI function: every number on screen comes out of here. */
  function kpis(applied) {
    var fixed = fixedBy(applied), missed = 0, late = 0, charge = BASE.charge, travel = BASE.travel;
    Object.keys(MISSED).forEach(function (j) { if (!fixed[j]) missed++; });
    Object.keys(LATE).forEach(function (j) { if (!fixed[j]) late++; });
    applied.forEach(function (id) {
      var e = byId(id).effects;
      charge += e.charge || 0; travel += e.travel || 0;
    });
    var completed = BASE.booked - missed;
    return {
      completed: completed, missed: missed, late: late, charge: charge, travel: travel,
      jobsPerEng: completed / BASE.engineers,
      missedLate: missed + late,
      chargePerEv: charge / BASE.evs,
      travelPerJob: travel / completed
    };
  }

  /* Flags: problems still open + costs a change introduces. decision = needs a person. */
  function flagsFor(applied) {
    var fixed = fixedBy(applied), out = [];
    Object.keys(MISSED).forEach(function (j) {
      if (!fixed[j]) out.push({ job: j, kind: "missed", text: MISSED[j], decision: j === "J47" && applied.length > 0 });
    });
    Object.keys(LATE).forEach(function (j) { if (!fixed[j]) out.push({ job: j, kind: "late", text: LATE[j] }); });
    applied.forEach(function (id) {
      var c = byId(id);
      if (c.decision) out.push({ change: id, kind: "decision", text: c.decision, decision: true });
      if (c.cost) out.push({ change: id, kind: "cost", text: c.cost });
    });
    return out;
  }

  /* Which engineer does a job in a given plan. */
  function assignee(job, applied) {
    var who = job.booked;
    applied.forEach(function (id) { var m = byId(id).moves; if (m && m[job.id]) who = m[job.id]; });
    return who;
  }

  window.FRO = {
    region: "Northgate", day: "Tuesday 9 September", zones: ZONES, depot: DEPOT, chargers: CHARGERS,
    engineers: ENGINEERS, jobs: JOBS, missed: MISSED, late: LATE, base: BASE,
    changes: CHANGES, v1: V1, byId: byId, kpis: kpis, flagsFor: flagsFor, assignee: assignee, fixedBy: fixedBy,
    calibration: [
      { label: "Visits matched", value: "72 of 72" },
      { label: "Journey times vs telematics", value: "within 6%" },
      { label: "Appointment outcomes", value: "71 of 72 match" },
      { label: "Agreed tolerance", value: "10%" }
    ]
  };
})();
