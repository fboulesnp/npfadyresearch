/* global React */
// IPMG Research · Master study list (verified against ClinicalTrials.gov, Apr 18 2026)
// Source: uploads/IPMG_Master_Study_List.pdf

const SITE = {
  name: "IPMG Research",
  full: "Inland Psychiatric Medical Group · Research",
  email: "research@ipmg-inlandpsych.com",
  referralEmail: "research@ipmg-inlandpsych.com",
  author: "Fady Boules, MSN, PMHNP-BC",
};

const NAV = [
  { href: "#/", label: "Home" },
  { href: "#/studies", label: "Studies" },
  { href: "#/conditions", label: "Conditions" },
  { href: "#/locations", label: "Sites" },
  { href: "#/refer", label: "Refer" },
  { href: "#/faq", label: "FAQ" },
];

/* ==========================================================
   CONDITIONS — neural atlas
   ========================================================== */
const CONDITIONS = [
  {
    slug: "mdd",
    name: "Major Depressive Disorder",
    short: "MDD",
    regions: ["prefrontal", "hippocampus", "cingulate"],
    neurotransmitter: "serotonin",
    color: "#ec4899",
    intro: "Deepest bench — 10 active trials across novel mechanisms.",
    npCopy: "AMPA PAM, κ-opioid antagonist, neurosteroid prodrug, deuterated psilocin, M1 PAM, TAAR-1 modulator — the MDD portfolio covers most of the frontier targets in current development.",
    readTime: 3,
  },
  {
    slug: "bipolar",
    name: "Bipolar Disorder",
    short: "Bipolar I/II",
    regions: ["prefrontal", "striatum", "cingulate", "amygdala"],
    neurotransmitter: "dopamine",
    color: "#a78bfa",
    intro: "5 trials including pediatric cariprazine and KarXT adjunctive mania.",
    npCopy: "Covers pediatric Bipolar I depression (cariprazine), adjunctive mania (KarXT), adjunctive bipolar depression (ABBV-932, ALTO-100), and RAP-219 maintenance.",
    readTime: 2,
  },
  {
    slug: "schizophrenia",
    name: "Schizophrenia",
    short: "SCZ",
    regions: ["striatum", "temporal", "prefrontal"],
    neurotransmitter: "dopamine",
    color: "#06e0ff",
    intro: "Muscarinic agonism across adolescents and long-term extension.",
    npCopy: "KarXT adolescent Phase 3, NBI-1117568 (M4 muscarinic) long-term extension, and lumateperone pediatric safety.",
    readTime: 2,
  },
  {
    slug: "td",
    name: "Tardive Dyskinesia",
    short: "TD",
    regions: ["striatum"],
    neurotransmitter: "dopamine",
    color: "#fbbf24",
    intro: "2 VMAT2-focused trials — one novel Phase 2, one real-world Phase 4.",
    npCopy: "NBI-1065890 (novel) Phase 2 + valbenazine (Ingrezza) Phase 4 effectiveness in residually symptomatic adults.",
    readTime: 2,
  },
  {
    slug: "alzheimers",
    name: "Alzheimer's Psychosis & Agitation",
    short: "ALZ",
    regions: ["temporal", "hippocampus", "prefrontal"],
    neurotransmitter: "glutamate",
    color: "#34d399",
    intro: "3 trials — psychosis and agitation in AD.",
    npCopy: "Two KarXT programs (ADEPT-4 and ADEPT-5) for AD psychosis; BMS-986368 (IM045-P06) for AD agitation.",
    readTime: 2,
  },
  {
    slug: "pediatric",
    name: "Pediatric Psychiatry",
    short: "Peds",
    regions: ["prefrontal", "striatum"],
    neurotransmitter: "dopamine",
    color: "#f472b6",
    intro: "4 pediatric trials — ages 10–17.",
    npCopy: "Cariprazine (pediatric Bipolar I depression), lumateperone programs across schizophrenia, bipolar depression, and autism irritability.",
    readTime: 2,
  },
  {
    slug: "gad",
    name: "Generalized Anxiety Disorder",
    short: "GAD",
    regions: ["amygdala", "prefrontal", "cingulate"],
    neurotransmitter: "gaba",
    color: "#22d3ee",
    intro: "ABBV-932 adjunctive GAD.",
    npCopy: "Single trial — ABBV-932 (AbbVie M1 PAM) as adjunctive therapy for GAD.",
    readTime: 1,
  },
  {
    slug: "bed",
    name: "Binge Eating Disorder",
    short: "BED",
    regions: ["striatum", "prefrontal"],
    neurotransmitter: "dopamine",
    color: "#fb923c",
    intro: "Solriamfetol Phase 3 TAAR-1/DA/NE mechanism.",
    npCopy: "Axsome SOL-BED-301 — repurposing solriamfetol for binge eating disorder.",
    readTime: 1,
  },
  {
    slug: "ptsd",
    name: "Post-Traumatic Stress Disorder",
    short: "PTSD",
    regions: ["amygdala", "hippocampus", "prefrontal"],
    neurotransmitter: "serotonin",
    color: "#c084fc",
    intro: "TSND-201 methylone Phase 3 (EMPOWER-1).",
    npCopy: "Transcend Therapeutics Phase 3 of methylone — a rapid-onset serotonergic with different pharmacology than MDMA.",
    readTime: 1,
  },
  {
    slug: "autism",
    name: "Autism Irritability",
    short: "ASD",
    regions: ["striatum", "temporal"],
    neurotransmitter: "dopamine",
    color: "#818cf8",
    intro: "Lumateperone Phase 3 pediatric ASD irritability.",
    npCopy: "ITI-007-601 — dopamine/serotonin modulator for irritability in pediatric autism spectrum disorder.",
    readTime: 1,
  },
];

/* ==========================================================
   STUDIES — 31 unique, verified
   ========================================================== */
const STUDIES = [
  // ---------------- MDD ----------------
  {
    nctId: "NCT07284667", sites: ["chino"], sponsor: "Acadia Pharmaceuticals",
    drug: "ACP-211", protocol: "ACP-211-002",
    condition: "mdd", conditionName: "MDD monotherapy",
    phase: 2, phaseLabel: "Phase 2", status: "Recruiting",
    hero: "ACP-211 · MDD", title: "ACP-211 monotherapy in adults with inadequate antidepressant response",
    oneLine: "Phase 2 monotherapy trial in patients with inadequate response to prior antidepressant.",
    mechanism: "Novel monoamine modulator", target: "Monoaminergic",
    neurotransmitter: "serotonin",
  },
  {
    nctId: "NCT06656416", sites: ["chino"], sponsor: "Alto Neuroscience",
    drug: "ALTO-100", protocol: "ALTO-100-211",
    condition: "bipolar", conditionName: "Bipolar I/II · MDE",
    phase: 2, phaseLabel: "Phase 2", status: "Recruiting",
    hero: "ALTO-100 · Bipolar MDE", title: "ALTO-100 in Bipolar Disorder I or II with major depressive episode",
    oneLine: "BDNF-pathway–related therapeutic for bipolar depression.",
    mechanism: "BDNF-related modulator", target: "BDNF signaling",
    neurotransmitter: "glutamate",
  },
  {
    nctId: "NCT07484217", sites: ["chino"], sponsor: "Axsome Therapeutics",
    drug: "Solriamfetol (Sunosi)", protocol: "SOL-MDD-302",
    condition: "mdd", conditionName: "MDD with EDS",
    phase: 3, phaseLabel: "Phase 3", status: "Recruiting",
    hero: "Solriamfetol · MDD-EDS", title: "Solriamfetol in MDD with excessive daytime sleepiness",
    oneLine: "Phase 3 for MDD patients with residual excessive daytime sleepiness.",
    mechanism: "DA/NE reuptake + TAAR-1", target: "DAT/NET/TAAR-1",
    neurotransmitter: "dopamine",
  },
  {
    nctId: "NCT06423781", sites: ["chino"], sponsor: "Biohaven",
    drug: "BHV-7000", protocol: "BHV7000-203",
    condition: "mdd", conditionName: "MDD · long-term safety",
    phase: 2, phaseLabel: "Phase 2", status: "Completed",
    hero: "BHV-7000 · Safety", title: "BHV-7000 long-term safety in MDD",
    oneLine: "Long-term safety cohort; data lock presumed, results pending.",
    mechanism: "Selective Kv7 activator", target: "Kv7 channel",
    neurotransmitter: "glutamate",
  },
  {
    nctId: "NCT06419608", sites: ["chino"], sponsor: "Biohaven",
    drug: "BHV-7000", protocol: "BHV7000-305",
    condition: "mdd", conditionName: "MDD monotherapy",
    phase: 3, phaseLabel: "Phase 2/3", status: "Completed",
    hero: "BHV-7000 · Efficacy", title: "BHV-7000 monotherapy efficacy and safety in MDD",
    oneLine: "Phase 2/3 efficacy study; completed, data readout pending.",
    mechanism: "Selective Kv7 activator", target: "Kv7 channel",
    neurotransmitter: "glutamate",
  },
  {
    nctId: "NCT06963021", sites: ["chino"], sponsor: "Neurocrine Biosciences",
    drug: "NBI-1065845 (osavampator)", protocol: "NBI-1065845-MDD3026",
    condition: "mdd", conditionName: "Adjunctive MDD",
    phase: 3, phaseLabel: "Phase 3", status: "Recruiting",
    hero: "Osavampator · MDD", title: "NBI-1065845 adjunctive in MDD",
    oneLine: "AMPA receptor positive allosteric modulator — adjunct to SOC antidepressant.",
    mechanism: "AMPA positive allosteric modulator", target: "AMPA receptor",
    neurotransmitter: "glutamate",
  },
  {
    nctId: "NCT07065240", sites: ["chino"], sponsor: "Seaport Therapeutics",
    drug: "SPT-300 (GlyphAllo)", protocol: "SPT-300-2024-203",
    condition: "mdd", conditionName: "MDD with anxious distress",
    phase: 2, phaseLabel: "Phase 2", status: "Recruiting",
    hero: "SPT-300 · Anxious MDD", title: "GlyphAllo in MDD with anxious distress",
    oneLine: "Allopregnanolone neurosteroid prodrug (oral).",
    mechanism: "GABA-A neurosteroid prodrug", target: "GABA-A receptor",
    neurotransmitter: "gaba",
  },
  {
    nctId: "NCT07161700", sites: ["chino"], sponsor: "Seaport Therapeutics",
    drug: "SPT-300 (GlyphAllo)", protocol: "SPT-300-2024-204",
    condition: "mdd", conditionName: "MDD · OLE",
    phase: 2, phaseLabel: "Phase 2 · OLE", status: "Enrolling by Invitation",
    hero: "SPT-300 · OLE", title: "GlyphAllo open-label extension in MDD",
    oneLine: "Open-label extension; enrolling by invitation from the 203 parent study.",
    mechanism: "GABA-A neurosteroid prodrug", target: "GABA-A receptor",
    neurotransmitter: "gaba",
  },
  {
    nctId: "NCT07276997", sites: ["temecula"], sponsor: "AbbVie",
    drug: "Icalcaprant (ABBV-987)", protocol: "M25-987",
    condition: "mdd", conditionName: "MDD",
    phase: 2, phaseLabel: "Phase 2", status: "Recruiting",
    hero: "Icalcaprant · MDD", title: "ABBV-987 (icalcaprant) in MDD",
    oneLine: "AbbVie's MDD program — kappa-opioid class.",
    mechanism: "Selective κ-opioid antagonist", target: "κ-opioid receptor",
    neurotransmitter: "opioid",
  },
  {
    nctId: "NCT05922878", sites: ["temecula"], sponsor: "Alto Neuroscience",
    drug: "ALTO-300 (agomelatine)", protocol: "ALTO-300-201",
    condition: "mdd", conditionName: "Adjunctive MDD",
    phase: 2, phaseLabel: "Phase 2", status: "Recruiting",
    hero: "ALTO-300 · MDD", title: "ALTO-300 adjunctive in MDD",
    oneLine: "Precision-psychiatry adjunctive use of agomelatine with EEG biomarker.",
    mechanism: "MT1/MT2 agonist + 5-HT2C antagonist", target: "Melatonergic / 5-HT2C",
    neurotransmitter: "serotonin",
  },
  {
    nctId: "NCT07226661", sites: ["temecula"], sponsor: "Supernus Pharmaceuticals",
    drug: "SPN-821", protocol: "821P203",
    condition: "mdd", conditionName: "MDD · DB-PC",
    phase: 2, phaseLabel: "Phase 2", status: "Recruiting",
    hero: "SPN-821 · MDD", title: "SPN-821 double-blind, placebo-controlled MDD",
    oneLine: "Supernus MDD candidate.",
    mechanism: "Galanin receptor modulator", target: "Galanin receptor",
    neurotransmitter: "peptide",
  },
  {
    nctId: "NCT06785012", sites: ["temecula"], sponsor: "Johnson & Johnson (Janssen)",
    drug: "JNJ-89495120", protocol: "89495120MDD2001",
    condition: "mdd", conditionName: "MDD · efficacy exploration",
    phase: 2, phaseLabel: "Phase 2", status: "Recruiting",
    hero: "JNJ-89495120 · MDD", title: "JNJ-89495120 efficacy exploration in MDD",
    oneLine: "Early-phase efficacy exploration for J&J's MDD candidate.",
    mechanism: "Novel CNS target (Janssen)", target: "CNS — J&J undisclosed",
    neurotransmitter: "serotonin",
  },
  {
    nctId: "NCT07258485", sites: ["temecula"], sponsor: "Johnson & Johnson (Janssen)",
    drug: "Aticaprant (JNJ-42847922)", protocol: "42847922MDD3014",
    condition: "mdd", conditionName: "MDD · sleep EEG biomarker",
    phase: 3, phaseLabel: "Phase 3", status: "Recruiting",
    hero: "Aticaprant · MDD", title: "Aticaprant sleep EEG biomarker substudy in MDD",
    oneLine: "Phase 3 MDD with sleep EEG biomarker substudy.",
    mechanism: "Selective κ-opioid antagonist", target: "κ-opioid receptor",
    neurotransmitter: "opioid",
  },
  {
    nctId: "NCT06564818", sites: ["sjc"], sponsor: "Cybin IRL Limited",
    drug: "CYB003 (deuterated psilocin)", protocol: "CYB003-002 (APPROACH)",
    condition: "mdd", conditionName: "MDD · Pivotal",
    phase: 3, phaseLabel: "Phase 3", status: "Recruiting",
    hero: "CYB003 · APPROACH", title: "CYB003 pivotal Phase 3 in MDD (APPROACH)",
    oneLine: "Deuterated psilocin pivotal — shorter-duration dosing.",
    mechanism: "5-HT2A agonist (deuterated psilocin)", target: "5-HT2A",
    neurotransmitter: "serotonin",
  },
  {
    nctId: "NCT06793397", sites: ["sjc"], sponsor: "Cybin IRL Limited",
    drug: "CYB003 (deuterated psilocin)", protocol: "CYB003-003 (EMBRACE)",
    condition: "mdd", conditionName: "MDD · Dose comparison",
    phase: 3, phaseLabel: "Phase 3", status: "Recruiting",
    hero: "CYB003 · EMBRACE", title: "CYB003 dose comparison vs. placebo in MDD",
    oneLine: "Dose-comparison pivotal for CYB003.",
    mechanism: "5-HT2A agonist (deuterated psilocin)", target: "5-HT2A",
    neurotransmitter: "serotonin",
  },
  {
    nctId: "NCT06605105", sites: ["sjc"], sponsor: "Cybin IRL Limited",
    drug: "CYB003 (deuterated psilocin)", protocol: "CYB003-004 (EXTEND)",
    condition: "mdd", conditionName: "MDD · Long-term extension",
    phase: 3, phaseLabel: "Phase 3 · OLE", status: "Enrolling by Invitation",
    hero: "CYB003 · EXTEND", title: "CYB003 long-term extension",
    oneLine: "Long-term extension for the APPROACH / EMBRACE cohorts.",
    mechanism: "5-HT2A agonist (deuterated psilocin)", target: "5-HT2A",
    neurotransmitter: "serotonin",
  },

  // ---------------- Bipolar ----------------
  {
    nctId: "NCT04777357", sites: ["chino", "redlands"], sponsor: "AbbVie",
    drug: "Cariprazine (Vraylar)", protocol: "3112-301-001",
    condition: "pediatric", conditionName: "Pediatric Bipolar I depression (10–17)",
    phase: 3, phaseLabel: "Phase 3", status: "Recruiting",
    hero: "Cariprazine · Peds BP-I", title: "Cariprazine in pediatric Bipolar I depression",
    oneLine: "Pediatric Bipolar I depressive episodes, ages 10–17.",
    mechanism: "D2/D3 partial agonist (D3-preferring)", target: "D3 > D2",
    neurotransmitter: "dopamine",
    subIds: { chino: "Dr. P", redlands: "Dr. K" },
  },
  {
    nctId: "NCT07140913", sites: ["chino"], sponsor: "Bristol Myers Squibb",
    drug: "KarXT (Cobenfy)", protocol: "CN012-0046 (BALSAM-4)",
    condition: "bipolar", conditionName: "Bipolar I mania adjunctive",
    phase: 3, phaseLabel: "Phase 3", status: "Recruiting",
    hero: "KarXT · BALSAM-4", title: "KarXT adjunctive for Bipolar I mania",
    oneLine: "Adjunctive for Bipolar I mania with or without mixed features.",
    mechanism: "M1/M4 muscarinic agonist + peripheral antagonist", target: "M1 / M4",
    neurotransmitter: "acetylcholine",
  },
  {
    nctId: "NCT06846320", sites: ["temecula"], sponsor: "AbbVie",
    drug: "ABBV-932", protocol: "M25-099",
    condition: "gad", conditionName: "GAD adjunctive",
    phase: 2, phaseLabel: "Phase 2", status: "Recruiting",
    hero: "ABBV-932 · GAD", title: "ABBV-932 adjunctive in GAD",
    oneLine: "Selective M1 PAM for generalized anxiety disorder.",
    mechanism: "Selective M1 muscarinic PAM", target: "M1 receptor",
    neurotransmitter: "acetylcholine",
  },
  {
    nctId: "NCT07220460", sites: ["temecula"], sponsor: "AbbVie",
    drug: "ABBV-932", protocol: "M25-456",
    condition: "bipolar", conditionName: "Bipolar I/II depression",
    phase: 2, phaseLabel: "Phase 2", status: "Recruiting",
    hero: "ABBV-932 · Bipolar", title: "ABBV-932 in Bipolar I/II depressive episodes",
    oneLine: "Selective M1 PAM for bipolar depression.",
    mechanism: "Selective M1 muscarinic PAM", target: "M1 receptor",
    neurotransmitter: "acetylcholine",
  },
  {
    nctId: "NCT07046494", sites: ["chino"], sponsor: "Rapport Therapeutics",
    drug: "RAP-219", protocol: "RAP-219-BPM-201",
    condition: "bipolar", conditionName: "Bipolar I adults",
    phase: 2, phaseLabel: "Phase 2", status: "Recruiting",
    hero: "RAP-219 · Bipolar I", title: "RAP-219 in adults with Bipolar I Disorder",
    oneLine: "Receptor-associated protein modulator — bipolar I maintenance.",
    mechanism: "AMPA TARP γ-8 negative modulator", target: "AMPA / γ-8 TARP",
    neurotransmitter: "glutamate",
  },

  // ---------------- Schizophrenia ----------------
  {
    nctId: "NCT07288567", sites: ["chino"], sponsor: "Bristol Myers Squibb",
    drug: "KarXT (Cobenfy)", protocol: "CN012-0020",
    condition: "schizophrenia", conditionName: "Adolescent schizophrenia",
    phase: 3, phaseLabel: "Phase 3", status: "Recruiting",
    hero: "KarXT · Adolescent SCZ", title: "KarXT in adolescent schizophrenia",
    oneLine: "Adolescent schizophrenia — muscarinic mechanism (first-in-class for peds).",
    mechanism: "M1/M4 muscarinic agonist + peripheral antagonist", target: "M1 / M4",
    neurotransmitter: "acetylcholine",
  },
  {
    nctId: "NCT07114874", sites: ["chino"], sponsor: "Neurocrine Biosciences",
    drug: "NBI-1117568", protocol: "NBI-1117568-SCZ3032",
    condition: "schizophrenia", conditionName: "Schizophrenia · OLE",
    phase: 3, phaseLabel: "Phase 3 · OLE", status: "Recruiting",
    hero: "NBI-1117568 · SCZ OLE", title: "NBI-1117568 long-term extension in schizophrenia",
    oneLine: "Selective M4 muscarinic — long-term extension.",
    mechanism: "Selective M4 muscarinic agonist", target: "M4 receptor",
    neurotransmitter: "acetylcholine",
  },
  {
    nctId: "NCT06229210", sites: ["redlands"], sponsor: "Intra-Cellular Therapies",
    drug: "Lumateperone (Caplyta)", protocol: "ITI-007-321",
    condition: "pediatric", conditionName: "Pediatric safety · SCZ / BP / ASD",
    phase: 3, phaseLabel: "Phase 3", status: "Recruiting",
    hero: "Lumateperone · Peds Safety", title: "Lumateperone pediatric safety & tolerability",
    oneLine: "Pediatric safety and tolerability across schizophrenia, bipolar, and autism cohorts.",
    mechanism: "5-HT2A antagonist / D1 partial / D2 modulator", target: "5-HT2A / D1 / D2",
    neurotransmitter: "serotonin",
  },

  // ---------------- TD ----------------
  {
    nctId: "NCT07365462", sites: ["chino", "temecula"], sponsor: "Neurocrine Biosciences",
    drug: "NBI-1065890", protocol: "NBI-1065890-TD2033",
    condition: "td", conditionName: "Tardive Dyskinesia · adults",
    phase: 2, phaseLabel: "Phase 2", status: "Not Yet Recruiting",
    hero: "NBI-1065890 · TD", title: "NBI-1065890 in adults with Tardive Dyskinesia",
    oneLine: "Novel VMAT2-adjacent candidate in TD.",
    mechanism: "Novel VMAT2-class (Neurocrine)", target: "VMAT2",
    neurotransmitter: "dopamine",
  },
  {
    nctId: "NCT07105111", sites: ["chino", "redlands"], sponsor: "Neurocrine Biosciences",
    drug: "Valbenazine (Ingrezza)", protocol: "NBI-98854-TD4027",
    condition: "td", conditionName: "TD effectiveness · residual",
    phase: 4, phaseLabel: "Phase 4", status: "Recruiting",
    hero: "Valbenazine · TD P4", title: "Valbenazine effectiveness in residually symptomatic TD",
    oneLine: "Real-world Phase 4 effectiveness in residually symptomatic adults.",
    mechanism: "Selective VMAT2 inhibitor", target: "VMAT2",
    neurotransmitter: "dopamine",
    subIds: { redlands: "Dr. Kunam" },
  },

  // ---------------- Alzheimer's ----------------
  {
    nctId: "NCT06585787", sites: ["chino"], sponsor: "Bristol Myers Squibb",
    drug: "KarXT (Cobenfy)", protocol: "CN012-0056 (ADEPT-4)",
    condition: "alzheimers", conditionName: "AD psychosis",
    phase: 3, phaseLabel: "Phase 3", status: "Recruiting",
    hero: "KarXT · ADEPT-4", title: "KarXT for psychosis in Alzheimer's Disease",
    oneLine: "Muscarinic mechanism for AD psychosis.",
    mechanism: "M1/M4 muscarinic agonist + peripheral antagonist", target: "M1 / M4",
    neurotransmitter: "acetylcholine",
  },
  {
    nctId: "NCT06947941", sites: ["chino"], sponsor: "Bristol Myers Squibb",
    drug: "KarXT + KarX-EC", protocol: "CN012-0034 (ADEPT-5)",
    condition: "alzheimers", conditionName: "AD psychosis",
    phase: 3, phaseLabel: "Phase 3", status: "Not Yet Recruiting",
    hero: "KarXT · ADEPT-5", title: "KarXT + KarX-EC in AD psychosis",
    oneLine: "Extended-release companion formulation for AD psychosis. Slated start 2025-07-31.",
    mechanism: "M1/M4 muscarinic agonist (XR companion)", target: "M1 / M4",
    neurotransmitter: "acetylcholine",
  },
  {
    nctId: "NCT06808984", sites: ["chino"], sponsor: "Bristol Myers Squibb",
    drug: "BMS-986368", protocol: "IM045-P06",
    condition: "alzheimers", conditionName: "AD agitation",
    phase: 2, phaseLabel: "Phase 2", status: "Recruiting",
    hero: "BMS-986368 · AD agitation", title: "BMS-986368 for agitation in Alzheimer's Disease",
    oneLine: "AD agitation — separate from ADEPT psychosis programs.",
    mechanism: "CNS-selective (BMS)", target: "CNS — BMS undisclosed",
    neurotransmitter: "glutamate",
  },

  // ---------------- Pediatric Lumateperone ----------------
  {
    nctId: "NCT06372964", sites: ["redlands"], sponsor: "Intra-Cellular Therapies",
    drug: "Lumateperone (Caplyta)", protocol: "ITI-007-421",
    condition: "pediatric", conditionName: "Pediatric Bipolar depression",
    phase: 3, phaseLabel: "Phase 3", status: "Recruiting",
    hero: "Lumateperone · Peds BD", title: "Lumateperone in pediatric bipolar depression",
    oneLine: "Pediatric bipolar depression.",
    mechanism: "5-HT2A / D1 / D2 modulator", target: "5-HT2A / D1 / D2",
    neurotransmitter: "serotonin",
  },
  {
    nctId: "NCT06690398", sites: ["redlands"], sponsor: "Intra-Cellular Therapies",
    drug: "Lumateperone (Caplyta)", protocol: "ITI-007-601",
    condition: "autism", conditionName: "Pediatric ASD irritability",
    phase: 3, phaseLabel: "Phase 3", status: "Recruiting",
    hero: "Lumateperone · ASD", title: "Lumateperone for irritability in pediatric autism",
    oneLine: "Pediatric autism-spectrum irritability.",
    mechanism: "5-HT2A / D1 / D2 modulator", target: "5-HT2A / D1 / D2",
    neurotransmitter: "serotonin",
  },

  // ---------------- BED / PTSD ----------------
  {
    nctId: "NCT06413433", sites: ["sjc"], sponsor: "Axsome Therapeutics",
    drug: "Solriamfetol (Sunosi)", protocol: "SOL-BED-301",
    condition: "bed", conditionName: "Binge Eating Disorder",
    phase: 3, phaseLabel: "Phase 3", status: "Recruiting",
    hero: "Solriamfetol · BED", title: "Solriamfetol in Binge Eating Disorder",
    oneLine: "TAAR-1/DA/NE mechanism repurposed for BED.",
    mechanism: "DA/NE reuptake + TAAR-1", target: "DAT / NET / TAAR-1",
    neurotransmitter: "dopamine",
  },
  {
    nctId: "NCT07456696", sites: ["sjc"], sponsor: "Transcend Therapeutics",
    drug: "TSND-201 (methylone)", protocol: "TSND201-PTSD-301 (EMPOWER-1)",
    condition: "ptsd", conditionName: "PTSD",
    phase: 3, phaseLabel: "Phase 3", status: "Recruiting",
    hero: "TSND-201 · PTSD", title: "TSND-201 (methylone) in PTSD (EMPOWER-1)",
    oneLine: "Rapid-onset serotonergic entactogen for PTSD.",
    mechanism: "Serotonin releaser (methylone)", target: "SERT / 5-HT release",
    neurotransmitter: "serotonin",
  },
];

// Derived: flag featured (first 6 by priority) for home
STUDIES.forEach((s, i) => { s.featured = i < 6; });

// Backfill fields pages.jsx expects: title, locations (alias), tags, npTalkingPoints
STUDIES.forEach(s => {
  s.title = s.title || s.hero;
  s.locations = s.sites;
  s.tags = [s.phaseLabel, s.conditionName.split(" ")[0], s.status];
  const c = CONDITIONS.find(c => c.slug === s.condition);
  s.regions = c ? c.regions : [];
  if (!s.npTalkingPoints) {
    s.npTalkingPoints = [
      `Mechanism: ${s.mechanism} \u2014 acts on ${s.target}.`,
      `Phase ${s.phase} ${s.sponsor} program for ${s.conditionName.toLowerCase()}.`,
      `Status: ${s.status}. Eligibility is determined at screening \u2014 refer any patient who may fit.`,
      `Sites: ${s.sites.map(sl => sl === 'sjc' ? 'San Juan Capistrano' : sl[0].toUpperCase() + sl.slice(1)).join(' \u00b7 ')}.`,
    ];
  }
});

CONDITIONS.forEach(c => {
  c.studies = STUDIES.filter(s => s.condition === c.slug).map(s => s.nctId);
  c.patientCopy = c.patientCopy || c.npCopy;
});

/* ==========================================================
   LOCATIONS — 4 real sites
   ========================================================== */
const LOCATIONS = [
  {
    slug: "chino",
    name: "Chino",
    fullName: "IPMG Chino Clinical Research Site",
    city: "Chino, CA",
    tagline: "18 studies · largest portfolio. Flagship MDD, KarXT, and muscarinic programs.",
    stats: { total: 18, p2: 8, p3: 9, p4: 1, recruiting: 15 },
    capabilities: [
      "18-study active portfolio (deepest in the network)",
      "Adult MDD, Bipolar, Schizophrenia, TD, Alzheimer's",
      "KarXT flagship hub — 4 of 4 BMS programs",
      "Phase 2 through Phase 4 — full lifecycle coverage",
    ],
    color: "#ec4899",
    badge: "FLAGSHIP",
  },
  {
    slug: "redlands",
    name: "Redlands",
    fullName: "IPMG Redlands Headquarters",
    city: "Redlands, CA",
    tagline: "5 studies · Pediatric lumateperone hub. Headquarters site.",
    stats: { total: 5, p2: 0, p3: 4, p4: 1, recruiting: 5 },
    capabilities: [
      "Pediatric-focused lumateperone trio (SCZ / BP / ASD)",
      "Pediatric Bipolar I — cariprazine (Dr. K)",
      "Valbenazine Phase 4 effectiveness (Dr. Kunam)",
      "100% recruiting status",
    ],
    color: "#06e0ff",
    badge: "HQ",
  },
  {
    slug: "temecula",
    name: "Temecula",
    fullName: "IPMG Temecula Clinical Research Site",
    city: "Temecula, CA",
    tagline: "8 studies · Phase 2 innovation hub. Kappa-opioid, M1 PAM, galanin.",
    stats: { total: 8, p2: 7, p3: 1, p4: 0, recruiting: 7 },
    capabilities: [
      "Phase 2 frontier science — 7 of 8 studies",
      "Kappa-opioid (aticaprant, icalcaprant)",
      "ABBV-932 M1 PAM across GAD and bipolar",
      "J&J, AbbVie, Supernus, Alto partnerships",
    ],
    color: "#a78bfa",
    badge: "PHASE 2 HUB",
  },
  {
    slug: "sjc",
    name: "San Juan Capistrano",
    fullName: "IPMG San Juan Capistrano Site",
    city: "San Juan Capistrano, CA",
    tagline: "5 studies · Psychedelics & frontier indications. All Phase 3.",
    stats: { total: 5, p2: 0, p3: 5, p4: 0, recruiting: 4 },
    capabilities: [
      "Cybin CYB003 trio — APPROACH, EMBRACE, EXTEND",
      "TSND-201 (methylone) Phase 3 PTSD",
      "Solriamfetol Phase 3 for Binge Eating Disorder",
      "Frontier serotonergic and TAAR-1 programs",
    ],
    color: "#34d399",
    badge: "FRONTIER",
  },
];

LOCATIONS.forEach(loc => {
  loc.studies = STUDIES.filter(s => s.sites.includes(loc.slug)).map(s => s.nctId);
  const condSet = new Set();
  STUDIES.filter(s => s.sites.includes(loc.slug)).forEach(s => condSet.add(s.condition));
  loc.conditions = [...condSet];
});

/* ==========================================================
   FAQ
   ========================================================== */
const FAQS = [
  {
    q: "Who is this portal for?",
    a: "IPMG Nurse Practitioners. It is an internal NP-facing education portal — not a patient-facing site. It summarizes the 31 active trials across our 4 California sites so you can refer intelligently.",
  },
  {
    q: "How do I refer a patient?",
    a: "Use the Refer page (opens a pre-filled email to research@ipmg-inlandpsych.com) or email directly. Share primary diagnosis, current medications, patient initials, and preferred site. We route to the most-likely-fit study and schedule a screening call within 2 business days.",
  },
  {
    q: "Which site runs what?",
    a: "Chino (18) runs the deepest portfolio — MDD, KarXT, Alzheimer's. Redlands (5) is pediatric-heavy. Temecula (8) is Phase 2 frontier (kappa-opioid, M1 PAM). SJC (5) is psychedelic and TAAR-1 Phase 3. The Sites page breaks this down.",
  },
  {
    q: "Some studies run at multiple sites — why?",
    a: "Three protocols run at multiple IPMG sites: cariprazine pediatric BP-I (Chino + Redlands), valbenazine TD Phase 4 (Chino + Redlands), and NBI-1065890 TD (Chino + Temecula). Study cards show every active site.",
  },
  {
    q: "Are all trials recruiting?",
    a: "28 of 31 are actively recruiting or enrolling by invitation. 2 are completed (both BHV-7000 Phase 2 — data lock presumed, results pending). 1 is not-yet-recruiting (CN012-0034 ADEPT-5, slated start 2025-07-31).",
  },
  {
    q: "How are the NCT numbers verified?",
    a: "Every protocol ID was queried against the ClinicalTrials.gov API v2 and matched verbatim to the Organizational Study ID field. Date of verification: April 18, 2026.",
  },
  {
    q: "Does participation replace a patient's usual psychiatric care?",
    a: "No. Most protocols are designed to complement or transition from existing care, with clear washout and communication windows. You remain the treating NP for non-study care.",
  },
];

/* ==========================================================
   Nav + Footer
   ========================================================== */
function Nav({ current }) {
  const [focus, setFocus] = React.useState(false);
  const [tweaks, setTweaks] = React.useState(false);
  React.useEffect(() => { document.body.dataset.focus = focus ? "on" : "off"; }, [focus]);
  React.useEffect(() => { document.body.dataset.tweaks = tweaks ? "on" : "off"; }, [tweaks]);
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a href="#/" className="brand">
          <span className="brand-mark">
            <svg width="28" height="28" viewBox="0 0 28 28">
              <defs>
                <radialGradient id="brandGlow">
                  <stop offset="0%" stopColor="var(--accent)"/>
                  <stop offset="100%" stopColor="var(--accent-3)"/>
                </radialGradient>
              </defs>
              <circle cx="14" cy="14" r="12" fill="none" stroke="url(#brandGlow)" strokeWidth="1.2"/>
              <circle cx="14" cy="14" r="4" fill="url(#brandGlow)"/>
              <circle cx="8" cy="10" r="1.2" fill="var(--accent-2)"/>
              <circle cx="20" cy="18" r="1.2" fill="var(--accent-2)"/>
              <circle cx="20" cy="8" r="1" fill="var(--accent-3)"/>
              <path d="M 8 10 L 14 14 L 20 18 M 14 14 L 20 8" stroke="var(--accent-2)" strokeWidth="0.5" opacity="0.6"/>
            </svg>
          </span>
          <span><span className="grad-text">IPMG</span> · NP Research</span>
        </a>
        <div className="nav-links">
          {NAV.map(l => (
            <a key={l.href} href={l.href} className={`nav-link ${current === l.href ? "active" : ""}`}>{l.label}</a>
          ))}
        </div>
        <div className="row" style={{ gap: 6 }}>
          <button className="nav-link" onClick={() => setFocus(f => !f)} title="Focus mode — hide distractions" style={{ color: focus ? "var(--accent-2)" : undefined }}>◉ Focus</button>
          <button className="nav-link" onClick={() => setTweaks(t => !t)} title="Tweaks panel" style={{ color: tweaks ? "var(--accent-2)" : undefined }}>⚙ Tweaks</button>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="footer focus-hide">
      <div className="container">
        <div className="footer-inner">
          <div>
            <div className="row" style={{ gap: 10, marginBottom: 14 }}>
              <svg width="24" height="24" viewBox="0 0 28 28">
                <circle cx="14" cy="14" r="12" fill="none" stroke="var(--accent)" strokeWidth="1"/>
                <circle cx="14" cy="14" r="4" fill="var(--accent)"/>
              </svg>
              <span className="mono" style={{ fontSize: 13, letterSpacing: "0.08em" }}>IPMG · NP RESEARCH</span>
            </div>
            <p className="muted" style={{ fontSize: 13, maxWidth: 360 }}>
              Internal NP education portal for Inland Psychiatric Medical Group. 31 active trials across Chino, Redlands, Temecula, and San Juan Capistrano. Not for patient-facing distribution.
            </p>
            <p className="mono dim" style={{ fontSize: 10, marginTop: 14, letterSpacing: "0.15em" }}>
              PREPARED BY {SITE.author.toUpperCase()}
            </p>
          </div>
          <div>
            <h4>Portfolio</h4>
            <a href="#/studies">All 31 studies</a>
            <a href="#/conditions">Conditions</a>
            <a href="#/locations">Sites</a>
          </div>
          <div>
            <h4>For NPs</h4>
            <a href="#/refer">Refer a patient</a>
            <a href="#/faq">FAQ</a>
          </div>
          <div>
            <h4>Contact</h4>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <div className="mono dim" style={{ fontSize: 10, marginTop: 14, letterSpacing: "0.15em" }}>
              © {new Date().getFullYear()} IPMG
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ==========================================================
   Tweaks Panel — persists in localStorage
   ========================================================== */
function TweaksPanel() {
  const load = (k, d) => {
    try { return localStorage.getItem("tw:" + k) || d; } catch { return d; }
  };
  const [density, setDensity] = React.useState(() => load("density", "comfortable"));
  const [accent, setAccent] = React.useState(() => load("accent", "synapse"));
  const [motion, setMotion] = React.useState(() => load("motion", "full"));
  const [neuro, setNeuro] = React.useState(() => load("neuro", "on"));

  React.useEffect(() => {
    document.documentElement.dataset.density = density;
    document.documentElement.dataset.accent = accent;
    document.documentElement.dataset.motion = motion;
    document.body.dataset.neuro = neuro;
    try {
      localStorage.setItem("tw:density", density);
      localStorage.setItem("tw:accent", accent);
      localStorage.setItem("tw:motion", motion);
      localStorage.setItem("tw:neuro", neuro);
    } catch {}
  }, [density, accent, motion, neuro]);

  const accents = [
    { key: "synapse", c1: "#ec4899", c2: "#06e0ff" },
    { key: "aurora", c1: "#34d399", c2: "#22d3ee" },
    { key: "plasma", c1: "#fb923c", c2: "#f472b6" },
    { key: "deepsea", c1: "#22d3ee", c2: "#3b82f6" },
  ];

  return (
    <div className="tweaks-panel-wrap">
      <div className="tweaks-panel">
        <h3><span>TWEAKS</span><span className="dim" style={{ fontSize: 10 }}>persistent</span></h3>
        <div className="tweaks-group">
          <label className="tweaks-label">Accent palette</label>
          <div className="row" style={{ gap: 8 }}>
            {accents.map(a => (
              <button key={a.key} className={`swatch ${accent === a.key ? "active" : ""}`} style={{ background: `linear-gradient(135deg, ${a.c1}, ${a.c2})` }} onClick={() => setAccent(a.key)} title={a.key} />
            ))}
          </div>
        </div>
        <div className="tweaks-group">
          <label className="tweaks-label">Density</label>
          <div className="tweaks-options">
            {["compact", "comfortable", "spacious"].map(d => (
              <button key={d} className={`tweaks-opt ${density === d ? "active" : ""}`} onClick={() => setDensity(d)}>{d}</button>
            ))}
          </div>
        </div>
        <div className="tweaks-group">
          <label className="tweaks-label">Motion</label>
          <div className="tweaks-options">
            {["off", "reduced", "full"].map(m => (
              <button key={m} className={`tweaks-opt ${motion === m ? "active" : ""}`} onClick={() => setMotion(m)}>{m}</button>
            ))}
          </div>
        </div>
        <div className="tweaks-group">
          <label className="tweaks-label">Neuroscience visuals</label>
          <div className="tweaks-options">
            {["on", "off"].map(n => (
              <button key={n} className={`tweaks-opt ${neuro === n ? "active" : ""}`} onClick={() => setNeuro(n)}>{n}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScrollProgress() {
  const [p, setP] = React.useState(0);
  React.useEffect(() => {
    const on = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, []);
  return <div className="progress-track"><div className="progress-fill" style={{ "--progress": `${p}%` }} /></div>;
}

function Reveal({ children, delay = 0, className = "" }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => el.classList.add("in"), delay); io.disconnect(); }
    }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

function ReadTime({ minutes }) { return <span className="read-time">⊙ {minutes} MIN READ</span>; }
function Eyebrow({ children }) { return <div className="eyebrow">{children}</div>; }

Object.assign(window, {
  SITE, NAV, CONDITIONS, STUDIES, LOCATIONS, FAQS,
  Nav, Footer, TweaksPanel, ScrollProgress, Reveal, ReadTime, Eyebrow,
});
