/* global React, STUDIES, CONDITIONS, LOCATIONS, SITE */
/* Clinical Trial Alert — 9-section NP briefing, scroll + paginated */
const { useState: useStateTA, useEffect: useEffectTA, useMemo: useMemoTA, useRef: useRefTA } = React;

/* ---------- helpers ---------- */

function npPatientHook(study) {
  const cond = study.condition;
  const drug = study.drug || "this study drug";
  const MAP = {
    mdd: `Your patient has depression and their antidepressant isn't cutting it.`,
    bipolar: `Your patient has bipolar depression and still isn't stable.`,
    schizophrenia: `Your patient is on an antipsychotic — and still has symptoms.`,
    td: `Your patient is on a VMAT2 inhibitor. And they're still moving.`,
    alzheimers: `Your patient has early Alzheimer's and you want to do something.`,
    pediatric: `A pediatric patient in your panel. The family wants options.`,
    gad: `Your patient is chronically anxious. SSRIs aren't enough.`,
    bed: `Your patient can't stop binge eating.`,
    ptsd: `Your patient has PTSD that won't quiet down.`,
    asd: `A patient on the autism spectrum — the family is asking what's next.`,
  };
  return MAP[cond] || `A patient you've seen before — and the current meds aren't doing enough.`;
}

function differentiator(study) {
  const m = (study.mechanism || "").toLowerCase();
  if (m.includes("ampa")) return { old: "Monoamine-only antidepressants", new: "AMPA positive allosteric modulation", why: "Direct glutamate system — a different lever than SSRIs/SNRIs." };
  if (m.includes("nmda") || m.includes("psilocin") || m.includes("psilocybin")) return { old: "Conventional antidepressants", new: "Rapid-acting glutamatergic / psychedelic mechanism", why: "Fast onset, a different pharmacology than SSRIs." };
  if (m.includes("vmat2") || m.includes("valbenazine") || m.includes("deutetrabenazine")) return { old: "Prior VMAT2 inhibitor monotherapy", new: "Switch strategy for persistent TD", why: "First trial formally designed for patients who stayed symptomatic on their first VMAT2." };
  if (m.includes("kv7")) return { old: "Monoaminergic antidepressants", new: "Kv7 potassium-channel activation", why: "Ion-channel lever — novel mechanism for mood." };
  if (m.includes("muscarinic") || m.includes("m1") || m.includes("m4")) return { old: "D2 blockade (every antipsychotic)", new: "Muscarinic agonism", why: "A mechanism that isn't D2 — different side-effect profile." };
  if (m.includes("taar")) return { old: "SSRIs / SNRIs", new: "TAAR-1 agonism", why: "A receptor class that doesn't sedate or cause weight gain the way older agents can." };
  if (m.includes("gaba")) return { old: "Benzodiazepines", new: "Selective GABA modulation", why: "Targeted GABAergic without the broad CNS depression." };
  if (m.includes("5-ht2") || m.includes("serotonin 2a")) return { old: "Typical SSRIs", new: "5-HT₂A-targeted mechanism", why: "A different serotonergic lever than reuptake inhibition." };
  return { old: "Standard-of-care psychiatric medication", new: study.mechanism || "Novel mechanism", why: "A different pharmacological lever than what's currently prescribed." };
}

function threeStep(study) {
  return [
    { t: "SCREEN", d: `Every ${study.conditionName || "patient"} in your panel. A 2-minute chart review.` },
    { t: "FLAG", d: `Still symptomatic on their current regimen? They may be a ${study.drug?.split(" ")[0] || "trial"} candidate.` },
    { t: "REFER", d: `Call ${SITE.referralPhone || "909-955-5865"} or email ${SITE.referralEmail || "research@ipmg-inlandpsych.com"}.` },
  ];
}

function glanceStats(study, reg) {
  const nctPhase = (reg?.phases?.[0] || "").replace("PHASE", "Phase ");
  const enroll = reg?.enrollment;
  const age = reg?.minAge ? reg.minAge.replace(" Years", "") : "18";
  // Derive duration from outcome timeframe text
  let durText = "", durLabel = "Study Duration";
  const t = reg?.primary?.[0]?.t || "";
  const weekMatch = t.match(/(\d+)\s*week/i);
  const dayMatch = t.match(/day\s*(\d+)/i);
  if (weekMatch) { durText = weekMatch[1]; durLabel = "Weeks to Endpoint"; }
  else if (dayMatch) { durText = dayMatch[1]; durLabel = "Days to Endpoint"; }
  else { durText = study.phase?.toString() || "—"; durLabel = "Study Phase"; }
  return [
    { n: durText, label: durLabel, sub: reg?.primary?.[0]?.t || "Primary endpoint timeline" },
    { n: nctPhase || study.phaseLabel || "—", label: "Phase", sub: study.sponsor },
    { n: enroll ? `${enroll}` : "—", label: "Target Enrollment", sub: "Per registry" },
    { n: `${age}+`, label: "Age Minimum", sub: reg?.sex === "ALL" ? "All genders eligible" : (reg?.sex || "—") },
  ];
}

/* ---------- section-scroll rail ---------- */

function TrialAlertRail({ labels, active, onJump }) {
  return (
    <div className="ta-rail" aria-hidden={false}>
      <div className="ta-rail-count mono">{String(active+1).padStart(2,"0")} / {String(labels.length).padStart(2,"0")}</div>
      <div className="ta-rail-dots">
        {labels.map((l, i) => (
          <button key={i} className={`ta-rail-dot ${i===active?"active":""}`} onClick={() => onJump(i)} title={l}>
            <span className="ta-rail-line"/>
            <span className="ta-rail-label mono">{l}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ==========================================================
   MAIN: Trial Alert page
   ========================================================== */
function TrialAlert({ study }) {
  const [reg, setReg] = useStateTA(window.TRIAL_DATA?.[study.nctId] || null);
  const [brief, setBrief] = useStateTA(window.STUDY_BRIEFS?.[study.nctId] || null);
  useEffectTA(() => {
    if (window.TRIAL_DATA?.[study.nctId]) setReg(window.TRIAL_DATA[study.nctId]);
    if (window.STUDY_BRIEFS?.[study.nctId]) setBrief(window.STUDY_BRIEFS[study.nctId]);
    const on = () => {
      setReg(window.TRIAL_DATA?.[study.nctId] || null);
      setBrief(window.STUDY_BRIEFS?.[study.nctId] || null);
    };
    window.addEventListener("trial-data-ready", on);
    return () => window.removeEventListener("trial-data-ready", on);
  }, [study.nctId]);

  const cond = CONDITIONS.find(c => c.slug === study.condition) || { color: "var(--accent)", name: study.conditionName };
  const diff = useMemoTA(() => differentiator(study), [study.nctId]);
  const stats = useMemoTA(() => glanceStats(study, reg), [study.nctId, reg]);
  const steps = useMemoTA(() => threeStep(study), [study.nctId]);

  // inclusion / exclusion — clean & merge wrapped lines
  const cleanCriteria = (arr) => (arr || [])
    .filter(x => x && !/^(must meet|any of the following|all the following|characteristics.*excluded|criteria.*excluded|inclusion criteria|exclusion criteria)[:\-\s]*$/i.test(x.trim()))
    .map(x => x
      .replace(/^\s*\d+\.\s*/, "")
      .replace(/\\\[/g, "[").replace(/\\\]/g, "]")
      .replace(/^years of age or older$/i, "18 years of age or older")
      .trim()
    )
    .filter(Boolean);
  const inclusion = cleanCriteria(reg?.inclusion).slice(0, 8);
  const exclusion = cleanCriteria(reg?.exclusion).slice(0, 8);

  const SECTIONS = [
    { id: "s1", label: "ALERT" },
    { id: "s2", label: "PATIENT" },
    { id: "s3", label: "GLANCE" },
    { id: "s4", label: "DIFF" },
    { id: "s5", label: "INCLUDE" },
    { id: "s6", label: "EXCLUDE" },
    { id: "s7", label: "ENDPOINTS" },
    { id: "s8", label: "REFER" },
    { id: "s9", label: "SAVE" },
  ];

  const [active, setActive] = useStateTA(0);
  const sectionRefs = useRefTA([]);

  useEffectTA(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const i = Number(e.target.dataset.idx);
          setActive(i);
        }
      });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
    sectionRefs.current.forEach(el => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const jumpTo = (i) => {
    const el = sectionRefs.current[i];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const accentColor = cond.color;
  const cssVars = { "--ta-accent": accentColor };

  return (
    <div className="trial-alert" style={cssVars}>
      <TrialAlertRail labels={SECTIONS.map(s=>s.label)} active={active} onJump={jumpTo} />

      {/* =========== S1 — ALERT =========== */}
      <section ref={el => sectionRefs.current[0] = el} data-idx="0" className="ta-section ta-s1">
        <div className="ta-bg-glow" style={{ background: `radial-gradient(circle at 20% 30%, ${accentColor}33, transparent 60%), radial-gradient(circle at 80% 70%, var(--accent-2, #06e0ff)22, transparent 55%)` }}/>
        <div style={{ position: "absolute", inset: 0, opacity: 0.45, pointerEvents: "none" }}>
          <NeuralNetBg density={50}/>
        </div>
        <div className="ta-inner ta-center" style={{ position: "relative" }}>
          <a href="#/studies" className="mono ta-back">← ALL ALERTS</a>
          <div className="ta-eyebrow mono">CLINICAL TRIAL ALERT · {(study.conditionName || "").toUpperCase()}</div>
          <h1 className="ta-hero">{(study.drug || "This trial").split(" ")[0]}</h1>
          <p className="ta-tagline">{study.oneLine || study.hero}</p>
          <p className="ta-sig">A new trial wants your patient.</p>
          <div className="ta-pageno mono">01 / {String(SECTIONS.length).padStart(2,"0")}</div>
          <div className="ta-meta mono">
            <span>{study.nctId}</span>
            <span className="ta-meta-dot">·</span>
            <span>{study.sponsor}</span>
            <span className="ta-meta-dot">·</span>
            <span>{study.phaseLabel}</span>
          </div>
          <div className="ta-actions">
            <button className="btn btn-primary" onClick={() => window.print()}>Download PDF <span className="arrow">↓</span></button>
            <a href="#/refer" className="btn">Refer a patient →</a>
          </div>
        </div>
      </section>

      {/* =========== S2 — PATIENT =========== */}
      <section ref={el => sectionRefs.current[1] = el} data-idx="1" className="ta-section ta-s2">
        <div className="ta-inner">
          <div className="ta-eyebrow mono" style={{ color: accentColor }}>02 · YOUR PATIENT</div>
          <h2 className="ta-h2 ta-big">{npPatientHook(study)}</h2>
          <p className="ta-lede">
            This trial was built <em>for that exact patient</em>.
          </p>
          <div className="ta-callout">
            <div className="ta-callout-line" style={{ background: accentColor }}/>
            <div>
              <div className="mono ta-callout-kicker">UNMET NEED</div>
              <div className="ta-callout-body">
                {diff.why}
              </div>
            </div>
          </div>
          <p className="ta-small muted">
            The patient is in your panel right now.
          </p>
          <div className="ta-pageno mono">02 / {String(SECTIONS.length).padStart(2,"0")}</div>
        </div>
      </section>

      {/* =========== S3 — AT A GLANCE =========== */}
      <section ref={el => sectionRefs.current[2] = el} data-idx="2" className="ta-section ta-s3">
        <div className="ta-inner">
          <div className="ta-eyebrow mono" style={{ color: accentColor }}>03 · AT A GLANCE</div>
          <h2 className="ta-h2">{study.drug || study.hero}</h2>
          <div className="ta-glance">
            {stats.map((s, i) => (
              <div className="ta-glance-cell" key={i}>
                <div className="ta-glance-num" style={{ color: accentColor }}>{s.n}</div>
                <div className="ta-glance-label mono">{s.label}</div>
                <div className="ta-glance-sub">{s.sub}</div>
              </div>
            ))}
          </div>
          <div className="ta-glance-footer mono">
            Sponsor: <strong>{study.sponsor}</strong> · Registry: <strong>{study.nctId}</strong>
          </div>
          <div className="ta-pageno mono">03 / {String(SECTIONS.length).padStart(2,"0")}</div>
        </div>
      </section>

      {/* =========== S4 — DIFFERENTIATOR =========== */}
      <section ref={el => sectionRefs.current[3] = el} data-idx="3" className="ta-section ta-s4">
        <div className="ta-inner">
          <div className="ta-eyebrow mono" style={{ color: accentColor }}>04 · WHAT MAKES THIS TRIAL DIFFERENT</div>
          <div className="ta-diff">
            <div className="ta-diff-old">
              <div className="mono ta-diff-kicker">THE STANDARD APPROACH</div>
              <div className="ta-diff-text">{diff.old}</div>
              <div className="ta-diff-strike"/>
            </div>
            <div className="ta-diff-arrow" style={{ color: accentColor }}>→</div>
            <div className="ta-diff-new" style={{ borderColor: accentColor }}>
              <div className="mono ta-diff-kicker" style={{ color: accentColor }}>THIS TRIAL</div>
              <div className="ta-diff-text strong">{diff.new}</div>
              <div className="ta-diff-why">{diff.why}</div>
            </div>
          </div>
          <div className="ta-callout ta-callout-strong" style={{ borderColor: accentColor }}>
            <span className="ta-callout-hand" style={{ color: accentColor }}>👈</span>
            <div>
              <strong>THIS is the unmet need.</strong>
            </div>
          </div>
          <div className="ta-pageno mono">04 / {String(SECTIONS.length).padStart(2,"0")}</div>
        </div>
      </section>

      {/* =========== S5 — INCLUSION =========== */}
      <section ref={el => sectionRefs.current[4] = el} data-idx="4" className="ta-section ta-s5">
        <div className="ta-inner">
          <div className="ta-badge-circle" style={{ borderColor: accentColor, color: accentColor }}>✓</div>
          <div className="ta-eyebrow mono" style={{ color: accentColor }}>05 · INCLUSION</div>
          <h2 className="ta-h2">Recruit if your patient…</h2>
          {inclusion.length ? (
            <ul className="ta-check-list">
              {inclusion.map((line, i) => (
                <li key={i} className="ta-check-item">
                  <span className="ta-check-mark" style={{ color: accentColor, borderColor: accentColor }}>✓</span>
                  <div className="ta-check-body">{line}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="ta-empty mono">Inclusion criteria pending — call {SITE.referralPhone || "909-955-5865"} for current criteria.</div>
          )}
          {inclusion.length > 0 && (
            <p className="ta-lede" style={{ marginTop: 32 }}>
              <em>The last one is the whole point.</em>
            </p>
          )}
          <div className="ta-pageno mono">05 / {String(SECTIONS.length).padStart(2,"0")}</div>
        </div>
      </section>

      {/* =========== S6 — EXCLUSION =========== */}
      <section ref={el => sectionRefs.current[5] = el} data-idx="5" className="ta-section ta-s6">
        <div className="ta-inner">
          <div className="ta-stop mono">STOP</div>
          <div className="ta-eyebrow mono" style={{ color: "#ff5d73" }}>06 · EXCLUDE IF…</div>
          <h2 className="ta-h2">Don't send if…</h2>
          {exclusion.length ? (
            <ul className="ta-xlist">
              {exclusion.map((line, i) => (
                <li key={i} className="ta-xitem">
                  <span className="ta-xmark">✗</span>
                  <div className="ta-xbody">{line}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="ta-empty mono">Exclusion criteria pending — call {SITE.referralPhone || "909-955-5865"}.</div>
          )}
          <p className="ta-footnote muted" style={{ marginTop: 32 }}>
            Screening at the site determines final eligibility. These are the headline gates.
          </p>
          <div className="ta-pageno mono">06 / {String(SECTIONS.length).padStart(2,"0")}</div>
        </div>
      </section>

      {/* =========== S7 — ENDPOINTS / QUOTE =========== */}
      <section ref={el => sectionRefs.current[6] = el} data-idx="6" className="ta-section ta-s7">
        <div className="ta-inner">
          <div className="ta-eyebrow mono" style={{ color: accentColor }}>07 · WHY IT MATTERS</div>
          {reg?.briefSummary ? (
            <blockquote className="ta-quote">
              "{reg.briefSummary.replace(/^The (purpose|study|objective|aim)/i, (m) => m.charAt(0).toUpperCase() + m.slice(1)).trim()}"
            </blockquote>
          ) : (
            <blockquote className="ta-quote">"A trial that formally studies what happens next for patients the old protocols missed."</blockquote>
          )}
          <div className="ta-endpoints">
            {reg?.primary?.length > 0 && (
              <div className="ta-endpoint">
                <div className="mono ta-endpoint-kicker" style={{ color: accentColor }}>PRIMARY ENDPOINT</div>
                <div className="ta-endpoint-body">{reg.primary[0].m}</div>
                {reg.primary[0].t && <div className="ta-endpoint-time mono muted">{reg.primary[0].t}</div>}
              </div>
            )}
            {reg?.secondary?.length > 0 && (
              <div className="ta-endpoint">
                <div className="mono ta-endpoint-kicker muted">SECONDARY</div>
                <ul className="ta-endpoint-list">
                  {reg.secondary.slice(0,3).map((s,i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}
          </div>
          <div className="ta-pageno mono">07 / {String(SECTIONS.length).padStart(2,"0")}</div>
        </div>
      </section>

      {/* =========== S8 — 3-STEP RECRUIT =========== */}
      <section ref={el => sectionRefs.current[7] = el} data-idx="7" className="ta-section ta-s8">
        <div className="ta-inner">
          <div className="ta-eyebrow mono" style={{ color: accentColor }}>08 · YOUR MOVE</div>
          <h2 className="ta-h2">Your 3-step recruit move</h2>
          <ol className="ta-steps">
            {steps.map((s, i) => (
              <li key={i} className="ta-step">
                <div className="ta-step-num" style={{ background: `linear-gradient(135deg, ${accentColor}, var(--accent-2, #06e0ff))` }}>{i+1}</div>
                <div>
                  <div className="ta-step-title mono">{s.t}</div>
                  <div className="ta-step-body">{s.d}</div>
                </div>
              </li>
            ))}
          </ol>
          <div className="ta-phone">
            <div className="mono ta-phone-kicker">REFERRAL LINE</div>
            <a className="ta-phone-num" href={`tel:${(SITE.referralPhone||"9099555865").replace(/\D/g,"")}`}>{SITE.referralPhone || "909-955-5865"}</a>
          </div>
          <div className="ta-pageno mono">08 / {String(SECTIONS.length).padStart(2,"0")}</div>
        </div>
      </section>

      {/* =========== S9 — SAVE =========== */}
      <section ref={el => sectionRefs.current[8] = el} data-idx="8" className="ta-section ta-s9">
        <div className="ta-bg-glow" style={{ background: `radial-gradient(circle at 50% 40%, ${accentColor}22, transparent 60%)` }}/>
        <div className="ta-inner ta-center">
          <div className="ta-eyebrow mono" style={{ color: accentColor }}>09 · DO THIS WEEK</div>
          <h2 className="ta-big2">Save this.<br/>Screen one patient this week.</h2>
          <p className="ta-lede" style={{ maxWidth: 640, margin: "24px auto 40px" }}>
            The patient who fits the pattern on slide 02 — that's the one.
          </p>
          <div className="ta-actions" style={{ justifyContent: "center" }}>
            <button className="btn btn-primary" onClick={() => window.print()}>Download PDF <span className="arrow">↓</span></button>
            <a href="#/refer" className="btn">Refer a patient →</a>
            <a href={`https://clinicaltrials.gov/study/${study.nctId}`} target="_blank" rel="noopener" className="btn btn-ghost">Registry page ↗</a>
          </div>
          <div className="ta-brand mono">IPMG RESEARCH · WHERE SCIENCE MEETS THE CLINIC</div>
          <div className="ta-pageno mono">09 / {String(SECTIONS.length).padStart(2,"0")}</div>
        </div>
      </section>
    </div>
  );
}

window.TrialAlert = TrialAlert;

/* =============================================================
   DEEP BRIEF — the full 13-section NP education pulled from the
   IPMG 2026 Study Briefs library. Shown as a 10th slot on the
   scroll-rail when brief data exists for this NCT.
   ============================================================= */

/* Section keys from assets/study-briefs.json → human label + kind */
const DEEP_MAP = [
  { key: "the_unmet_need",                                  label: "The unmet need",              kind: "prose"   },
  { key: "why_this_study_exists",                           label: "Why this study exists",       kind: "prose"   },
  { key: "mechanism_of_action",                             label: "Mechanism of action",         kind: "prose"   },
  { key: "study_design_deep_dive",                          label: "Study design deep-dive",      kind: "prose"   },
  { key: "ideal_patient_profile",                           label: "Ideal patient profile",       kind: "callout" },
  { key: "how_ipmg_finds_these_patients_ecw_icd_10",        label: "eCW + ICD-10 search plan",    kind: "code"    },
  { key: "competitive_landscape",                           label: "Competitive landscape",       kind: "prose"   },
  { key: "risk_benefit_logic",                              label: "Risk / benefit logic",        kind: "split"   },
  { key: "why_this_matters_for_a_large_psychiatric_group",  label: "Why it matters for IPMG",     kind: "prose"   },
  { key: "provider_talk_track_6th_7th_grade",               label: "Provider talk track",         kind: "quote"   },
  { key: "sources",                                         label: "Sources",                     kind: "list"    },
];

function DeepCell({ label, body, kind, accent }) {
  if (!body) return null;
  if (kind === "code") {
    return (
      <div className="tb-cell tb-code-cell">
        <div className="tb-cell-label mono" style={{ color: accent }}>{label}</div>
        <pre className="tb-code">{body}</pre>
      </div>
    );
  }
  if (kind === "callout") {
    return (
      <div className="tb-cell tb-callout-cell">
        <div className="tb-cell-label mono" style={{ color: accent }}>{label}</div>
        <div className="tb-callout-body">
          <span className="tb-callout-quote" style={{ color: accent }}>“</span>
          <div>{body}</div>
        </div>
      </div>
    );
  }
  if (kind === "quote") {
    return (
      <div className="tb-cell tb-quote-cell">
        <div className="tb-cell-label mono" style={{ color: accent }}>{label}</div>
        <blockquote className="tb-quote">{body.replace(/^["""]|["""]$/g, "").trim()}</blockquote>
        <div className="tb-quote-byline mono">— a PMHNP explaining this to a patient</div>
      </div>
    );
  }
  if (kind === "split") {
    // split "Benefit: ... Risk: ..."
    const m = body.match(/benefit[s]?\s*:?\s*([\s\S]*?)(?:\brisk[s]?\s*:?\s*([\s\S]*))?$/i);
    const benefit = m && m[1] ? m[1].replace(/\brisk[s]?\s*:?\s*[\s\S]*$/i, "").trim() : body;
    const risk = m && m[2] ? m[2].trim() : "";
    return (
      <div className="tb-cell tb-split-cell">
        <div className="tb-cell-label mono" style={{ color: accent }}>{label}</div>
        <div className="tb-split">
          <div className="tb-split-half tb-split-benefit">
            <div className="mono tb-split-kicker" style={{ color: accent }}>BENEFIT</div>
            <div>{benefit}</div>
          </div>
          {risk && (
            <div className="tb-split-half tb-split-risk">
              <div className="mono tb-split-kicker tb-split-risk-kicker">RISK</div>
              <div>{risk}</div>
            </div>
          )}
        </div>
      </div>
    );
  }
  if (kind === "list") {
    const items = body.split("\n").map(l => l.replace(/^•\s*/, "").trim()).filter(Boolean);
    return (
      <div className="tb-cell tb-list-cell">
        <div className="tb-cell-label mono" style={{ color: accent }}>{label}</div>
        <ul className="tb-list">
          {items.map((it, i) => <li key={i}>{it}</li>)}
        </ul>
      </div>
    );
  }
  // prose
  return (
    <div className="tb-cell">
      <div className="tb-cell-label mono" style={{ color: accent }}>{label}</div>
      <div className="tb-prose">{body}</div>
    </div>
  );
}

function DeepBrief({ brief, study, accent }) {
  if (!brief) return null;
  const S = brief.sections || {};
  return (
    <div className="tb-wrap">
      <div className="tb-head">
        <div className="mono tb-eyebrow" style={{ color: accent }}>10 · DEEP BRIEF FROM THE 2026 LIBRARY</div>
        <h2 className="tb-title">The full NP briefing for <span style={{ color: accent }}>{study.drug?.split(" ")[0] || study.hero}</span></h2>
        <div className="tb-sub">
          Pulled from the IPMG 2026 Recruitment Library — the deep-research briefing Fady keeps on every active protocol.
          {brief.code && <> Comment code <strong className="mono">{brief.code}</strong>.</>}
        </div>
      </div>

      <div className="tb-grid">
        {DEEP_MAP.map(def => {
          const sec = S[def.key];
          if (!sec || !sec.body) return null;
          return <DeepCell key={def.key} label={def.label} body={sec.body} kind={def.kind} accent={accent}/>;
        })}
      </div>

      <div className="tb-footer">
        <div className="mono tb-footer-kicker">NEXT STEP</div>
        <div className="tb-footer-body">
          Screen one patient this week. Tag with comment code <strong className="mono">{brief.code}</strong> and call <a href="tel:9099555865">(909) 955-5865</a>.
        </div>
      </div>
    </div>
  );
}

window.DeepBrief = DeepBrief;
