/* global React, STUDIES, CONDITIONS, LOCATIONS, SITE, NeuralNetBg, DeepBrief */
/* Study Education Page — dedicated rich page opened when you click a study.
   Every section of the 2026 IPMG brief is here, plus live registry data. */
const { useState: useStateEdu, useEffect: useEffectEdu, useMemo: useMemoEdu, useRef: useRefEdu } = React;

/* ---------- helpers ---------- */

function eduGetBrief(nctId) {
  return (window.STUDY_BRIEFS && window.STUDY_BRIEFS[nctId]) || null;
}
function eduGetReg(nctId) {
  return (window.TRIAL_DATA && window.TRIAL_DATA[nctId]) || null;
}

function eduCleanCriteria(arr) {
  return (arr || [])
    .filter(x => x && !/^(must meet|any of the following|all the following|characteristics.*excluded|criteria.*excluded|inclusion criteria|exclusion criteria)[:\-\s]*$/i.test(x.trim()))
    .map(x => x
      .replace(/^\s*\d+\.\s*/, "")
      .replace(/\\\[/g, "[").replace(/\\\]/g, "]")
      .trim()
    )
    .filter(Boolean);
}

/* Parse the "AT A GLANCE" row from the brief body — it comes out as a stack of
   4 values followed by 4 labels. We convert it to [{n, label}, ...]. */
function parseGlance(body) {
  if (!body) return null;
  const lines = body.split(/\n+/).map(l => l.trim()).filter(Boolean);
  // single-line format: "10-17 6 wks 1.5-3 mg ~380"
  if (lines.length <= 2) return null;
  // 4 values + 4 labels
  if (lines.length >= 8) {
    return [
      { n: lines[0], label: lines[4] || "" },
      { n: lines[1], label: lines[5] || "" },
      { n: lines[2], label: lines[6] || "" },
      { n: lines[3], label: lines[7] || "" },
    ];
  }
  return null;
}

/* ---------- TOC ---------- */

function EduTOC({ items, active, onJump }) {
  return (
    <nav className="edu-toc" aria-label="Section navigation">
      <div className="mono edu-toc-kicker">ON THIS PAGE</div>
      <ol className="edu-toc-list">
        {items.map((it, i) => (
          <li key={it.id} className={`edu-toc-item ${active === i ? "active" : ""}`}>
            <button className="edu-toc-link" onClick={() => onJump(it.id)}>
              <span className="edu-toc-num mono">{String(i + 1).padStart(2, "0")}</span>
              <span className="edu-toc-label">{it.label}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ---------- Reusable blocks ---------- */

function EduSection({ id, num, kicker, title, children, accent, innerRef }) {
  return (
    <section id={id} ref={innerRef} className="edu-section" data-edu-id={id}>
      <div className="edu-sec-head">
        <div className="edu-sec-num mono" style={{ color: accent }}>{String(num).padStart(2, "0")}</div>
        <div>
          <div className="edu-sec-kicker mono" style={{ color: accent }}>{kicker}</div>
          <h2 className="edu-sec-title">{title}</h2>
        </div>
      </div>
      <div className="edu-sec-body">{children}</div>
    </section>
  );
}

function EduProse({ children }) {
  return <div className="edu-prose">{children}</div>;
}

function EduCriteriaList({ items, variant = "in", accent }) {
  if (!items || !items.length) {
    return <div className="edu-empty mono">Criteria not yet available from registry. Call {SITE.referralPhone || "909-955-5865"} for the current screening form.</div>;
  }
  return (
    <ul className={`edu-crit edu-crit-${variant}`}>
      {items.map((line, i) => (
        <li key={i} className="edu-crit-item">
          <span
            className="edu-crit-mark"
            style={variant === "in" ? { color: accent, borderColor: accent } : {}}
          >{variant === "in" ? "✓" : "✗"}</span>
          <div className="edu-crit-body">{line}</div>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Main Study Education page ---------- */

function StudyEducationPage({ study }) {
  const [reg, setReg] = useStateEdu(eduGetReg(study.nctId));
  const [brief, setBrief] = useStateEdu(eduGetBrief(study.nctId));
  useEffectEdu(() => {
    const on = () => { setReg(eduGetReg(study.nctId)); setBrief(eduGetBrief(study.nctId)); };
    on();
    window.addEventListener("trial-data-ready", on);
    return () => window.removeEventListener("trial-data-ready", on);
  }, [study.nctId]);

  const cond = CONDITIONS.find(c => c.slug === study.condition) || { color: "var(--accent)", name: study.conditionName, slug: study.condition };
  const accent = cond.color || "var(--accent)";
  const site = LOCATIONS.find(l => study.sites?.includes(l.slug));
  const B = (brief && brief.sections) || {};

  const inclusion = useMemoEdu(() => eduCleanCriteria(reg?.inclusion), [reg]);
  const exclusion = useMemoEdu(() => eduCleanCriteria(reg?.exclusion), [reg]);
  const glance = useMemoEdu(() => parseGlance(B.at_a_glance?.body), [brief]);

  // Build section list dynamically based on what data exists
  const sections = useMemoEdu(() => {
    const list = [];
    list.push({ id: "overview",    label: "Overview" });
    if (B.the_hook?.body)                                    list.push({ id: "hook",       label: "The hook" });
    if (B.the_unmet_need?.body)                              list.push({ id: "need",       label: "Unmet need" });
    if (B.why_this_study_exists?.body)                       list.push({ id: "why",        label: "Why this study" });
    if (B.mechanism_of_action?.body)                         list.push({ id: "moa",        label: "Mechanism of action" });
    if (B.study_design_deep_dive?.body)                      list.push({ id: "design",     label: "Study design" });
    if (inclusion.length || B.recruit_if_your_patient?.body) list.push({ id: "include",    label: "Recruit if…" });
    if (exclusion.length || B.stop_exclude_if?.body)         list.push({ id: "exclude",    label: "Exclude if…" });
    if (B.ideal_patient_profile?.body)                       list.push({ id: "ideal",      label: "Ideal patient" });
    if (B.how_ipmg_finds_these_patients_ecw_icd_10?.body)    list.push({ id: "ecw",        label: "eCW + ICD-10" });
    if (B.competitive_landscape?.body)                       list.push({ id: "landscape",  label: "Competitive landscape" });
    if (B.risk_benefit_logic?.body)                          list.push({ id: "risk",       label: "Risk / benefit" });
    if (B.why_this_matters_for_a_large_psychiatric_group?.body) list.push({ id: "matters", label: "Why it matters" });
    if (B.provider_talk_track_6th_7th_grade?.body)           list.push({ id: "talk",       label: "Patient talk track" });
    if (reg?.primary?.length || reg?.secondary?.length)      list.push({ id: "endpoints",  label: "Endpoints" });
    if (B["3_step_recruit_move"]?.body)                      list.push({ id: "refer",      label: "3-step recruit" });
    if (B.sources?.body)                                     list.push({ id: "sources",    label: "Sources" });
    return list;
  }, [brief, reg, inclusion, exclusion]);

  const [active, setActive] = useStateEdu(0);
  const sectionRefs = useRefEdu({});

  useEffectEdu(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.dataset.eduId;
          const i = sections.findIndex(s => s.id === id);
          if (i >= 0) setActive(i);
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });

    Object.values(sectionRefs.current).forEach(el => el && io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  const jumpTo = (id) => {
    const el = sectionRefs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const setRef = (id) => (el) => { if (el) sectionRefs.current[id] = el; };

  // MOA: parse out bold-worthy receptor / channel tokens
  const moaText = B.mechanism_of_action?.body || "";
  const moaParts = moaText.split(/(D[1-5]|5-HT[0-9A-Z]+|M[1-5]\b|AMPA|NMDA|Kv7|GABA[- ]?A?|VMAT2|TAAR[- ]?1|BDNF|mTORC[12]?|κOR|κ-opioid|kappa opioid|orexin|EEG)/g);

  return (
    <div className="edu-page" style={{ "--edu-accent": accent }}>
      {/* --- HERO --- */}
      <section className="edu-hero" id="overview" ref={setRef("overview")} data-edu-id="overview">
        <div className="edu-hero-bg">
          <NeuralNetBg density={45}/>
          <div className="edu-hero-glow" style={{ background: `radial-gradient(circle at 20% 20%, ${accent}22, transparent 55%), radial-gradient(circle at 80% 80%, var(--accent-2, #06e0ff)18, transparent 55%)` }}/>
        </div>

        <div className="edu-hero-inner">
          <a href="#/studies" className="mono edu-back">← All studies</a>

          <div className="edu-hero-badges">
            <a className="edu-chip" style={{ borderColor: accent, color: accent }} href={`#/conditions/${cond.slug}`}>
              {cond.name || study.conditionName}
            </a>
            <span className="mono edu-chip-ghost">{study.phaseLabel || `Phase ${study.phase}`}</span>
            {site && <span className="mono edu-chip-ghost">IPMG {site.name}</span>}
            {brief?.code && <span className="mono edu-chip-code" style={{ borderColor: accent, color: accent }}>CODE · {brief.code}</span>}
          </div>

          <h1 className="edu-hero-title">
            <span className="edu-hero-drug">{(study.drug || study.hero).split(" ")[0]}</span>
            <span className="edu-hero-rest">{study.drug?.split(" ").slice(1).join(" ") || ""}</span>
          </h1>
          <p className="edu-hero-sub">{study.title || study.oneLine}</p>

          <div className="edu-hero-meta mono">
            <span>{study.nctId}</span>
            <span className="edu-meta-dot">·</span>
            <span>{study.sponsor}</span>
            {study.protocol && <><span className="edu-meta-dot">·</span><span>Protocol {study.protocol}</span></>}
          </div>

          {B.the_hook?.body && (
            <blockquote className="edu-hook">
              <span className="edu-hook-glyph" style={{ color: accent }}>“</span>
              {B.the_hook.body.replace(/^["""]|["""]$/g, "").trim()}
            </blockquote>
          )}

          <div className="edu-hero-actions">
            <a href={`#/refer?nct=${study.nctId}`} className="btn btn-primary">Refer a patient <span className="arrow">→</span></a>
            <a href={`https://clinicaltrials.gov/study/${study.nctId}`} target="_blank" rel="noopener" className="btn">Registry page ↗</a>
            <button className="btn btn-ghost" onClick={() => window.print()}>Print PDF</button>
          </div>

          {/* Glance row */}
          <div className="edu-glance">
            {(glance || [
              { n: reg?.enrollment ? `~${reg.enrollment}` : "—", label: "Target enrollment" },
              { n: study.phaseLabel || `Phase ${study.phase}`, label: "Study phase" },
              { n: reg?.minAge ? `${reg.minAge.replace(" Years","")}+` : "18+", label: "Age range" },
              { n: reg?.sex === "ALL" ? "All" : (reg?.sex || "—"), label: "Sex" },
            ]).map((g, i) => (
              <div key={i} className="edu-glance-cell">
                <div className="edu-glance-n" style={{ color: accent }}>{g.n}</div>
                <div className="edu-glance-label mono">{g.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- BODY: TOC + content --- */}
      <div className="edu-body">
        <aside className="edu-aside">
          <EduTOC
            items={sections}
            active={active}
            onJump={jumpTo}
          />
          <div className="edu-aside-cta">
            <div className="mono edu-cta-kicker">REFERRAL LINE</div>
            <a className="edu-cta-phone" href={`tel:${(SITE.referralPhone||"9099555865").replace(/\D/g,"")}`}>
              {SITE.referralPhone || "909-955-5865"}
            </a>
            {brief?.code && <div className="mono edu-cta-code">Reference code <strong>{brief.code}</strong></div>}
          </div>
        </aside>

        <main className="edu-main">

          {B.the_unmet_need?.body && (
            <EduSection id="need" num={sections.findIndex(s=>s.id==="need")+1} kicker="THE UNMET NEED"
              title="Why current care falls short" accent={accent} innerRef={setRef("need")}>
              <EduProse>{B.the_unmet_need.body}</EduProse>
            </EduSection>
          )}

          {B.why_this_study_exists?.body && (
            <EduSection id="why" num={sections.findIndex(s=>s.id==="why")+1} kicker="WHY THIS TRIAL"
              title="Why this study exists" accent={accent} innerRef={setRef("why")}>
              <EduProse>{B.why_this_study_exists.body}</EduProse>
            </EduSection>
          )}

          {B.mechanism_of_action?.body && (
            <EduSection id="moa" num={sections.findIndex(s=>s.id==="moa")+1} kicker="PHARMACOLOGY"
              title="Mechanism of action" accent={accent} innerRef={setRef("moa")}>
              <div className="edu-moa">
                <p className="edu-moa-text">
                  {moaParts.map((p, i) => (
                    /(D[1-5]|5-HT[0-9A-Z]+|M[1-5]|AMPA|NMDA|Kv7|GABA|VMAT2|TAAR|BDNF|mTORC|κOR|κ-opioid|kappa opioid|orexin|EEG)/.test(p)
                      ? <span key={i} className="edu-receptor" style={{ borderColor: accent, color: accent }}>{p}</span>
                      : <React.Fragment key={i}>{p}</React.Fragment>
                  ))}
                </p>
              </div>
            </EduSection>
          )}

          {B.study_design_deep_dive?.body && (
            <EduSection id="design" num={sections.findIndex(s=>s.id==="design")+1} kicker="PROTOCOL"
              title="Study design deep-dive" accent={accent} innerRef={setRef("design")}>
              <EduProse>{B.study_design_deep_dive.body}</EduProse>
              {reg && (
                <div className="edu-reg-strip">
                  {reg.phases?.[0] && <span className="mono">{reg.phases[0].replace("PHASE", "PHASE ")}</span>}
                  {reg.enrollment && <span className="mono">N ≈ {reg.enrollment}</span>}
                  {reg.minAge && <span className="mono">{reg.minAge}{reg.maxAge ? ` – ${reg.maxAge}`: "+"}</span>}
                </div>
              )}
            </EduSection>
          )}

          {(inclusion.length > 0 || B.recruit_if_your_patient?.body) && (
            <EduSection id="include" num={sections.findIndex(s=>s.id==="include")+1} kicker="INCLUSION"
              title="Recruit if your patient…" accent={accent} innerRef={setRef("include")}>
              {B.recruit_if_your_patient?.body && (
                <p className="edu-lede">{B.recruit_if_your_patient.body}</p>
              )}
              {inclusion.length > 0 && (
                <>
                  <div className="mono edu-list-kicker">FROM CLINICALTRIALS.GOV</div>
                  <EduCriteriaList items={inclusion} variant="in" accent={accent} />
                </>
              )}
            </EduSection>
          )}

          {(exclusion.length > 0 || B.stop_exclude_if?.body) && (
            <EduSection id="exclude" num={sections.findIndex(s=>s.id==="exclude")+1} kicker="EXCLUSION"
              title="Don't refer if…" accent={accent} innerRef={setRef("exclude")}>
              {B.stop_exclude_if?.body && (
                <ul className="edu-crit edu-crit-ex">
                  {B.stop_exclude_if.body.split("\n").map((l, i) => {
                    const clean = l.replace(/^✗\s*/, "").trim();
                    if (!clean) return null;
                    return (
                      <li key={i} className="edu-crit-item">
                        <span className="edu-crit-mark">✗</span>
                        <div className="edu-crit-body">{clean}</div>
                      </li>
                    );
                  })}
                </ul>
              )}
              {exclusion.length > 0 && (
                <>
                  <div className="mono edu-list-kicker" style={{ marginTop: 24 }}>FROM CLINICALTRIALS.GOV</div>
                  <EduCriteriaList items={exclusion.slice(0, 10)} variant="ex" accent={accent} />
                </>
              )}
              <p className="edu-foot muted">Site screening determines final eligibility. These are the headline gates.</p>
            </EduSection>
          )}

          {B.ideal_patient_profile?.body && (
            <EduSection id="ideal" num={sections.findIndex(s=>s.id==="ideal")+1} kicker="THE PATIENT YOU'RE LOOKING FOR"
              title="Ideal patient profile" accent={accent} innerRef={setRef("ideal")}>
              <div className="edu-ideal">
                <div className="edu-ideal-card" style={{ borderColor: accent }}>
                  <span className="edu-ideal-glyph" style={{ color: accent }}>✦</span>
                  <div className="edu-ideal-body">{B.ideal_patient_profile.body}</div>
                </div>
              </div>
            </EduSection>
          )}

          {B.how_ipmg_finds_these_patients_ecw_icd_10?.body && (
            <EduSection id="ecw" num={sections.findIndex(s=>s.id==="ecw")+1} kicker="FINDING THEM IN YOUR PANEL"
              title="eCW + ICD-10 search plan" accent={accent} innerRef={setRef("ecw")}>
              <p className="edu-lede">Copy this into the eCW patient query to surface candidates from your existing panel.</p>
              <pre className="edu-code">{B.how_ipmg_finds_these_patients_ecw_icd_10.body}</pre>
            </EduSection>
          )}

          {B.competitive_landscape?.body && (
            <EduSection id="landscape" num={sections.findIndex(s=>s.id==="landscape")+1} kicker="WHERE IT FITS"
              title="Competitive landscape" accent={accent} innerRef={setRef("landscape")}>
              <EduProse>{B.competitive_landscape.body}</EduProse>
            </EduSection>
          )}

          {B.risk_benefit_logic?.body && (
            <EduSection id="risk" num={sections.findIndex(s=>s.id==="risk")+1} kicker="WHAT YOU'RE WEIGHING"
              title="Risk / benefit logic" accent={accent} innerRef={setRef("risk")}>
              {(() => {
                const body = B.risk_benefit_logic.body;
                const m = body.match(/benefit[s]?\s*:?\s*([\s\S]*?)(?:\brisk[s]?\s*:?\s*([\s\S]*))?$/i);
                const benefit = m && m[1] ? m[1].replace(/\brisk[s]?\s*:?\s*[\s\S]*$/i, "").trim() : body;
                const risk = m && m[2] ? m[2].trim() : "";
                return (
                  <div className="edu-split">
                    <div className="edu-split-half edu-split-benefit">
                      <div className="mono edu-split-kicker" style={{ color: accent }}>BENEFIT</div>
                      <div>{benefit}</div>
                    </div>
                    {risk && (
                      <div className="edu-split-half edu-split-risk">
                        <div className="mono edu-split-kicker edu-split-risk-kicker">RISK</div>
                        <div>{risk}</div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </EduSection>
          )}

          {B.why_this_matters_for_a_large_psychiatric_group?.body && (
            <EduSection id="matters" num={sections.findIndex(s=>s.id==="matters")+1} kicker="FOR IPMG"
              title="Why it matters for our group" accent={accent} innerRef={setRef("matters")}>
              <EduProse>{B.why_this_matters_for_a_large_psychiatric_group.body}</EduProse>
            </EduSection>
          )}

          {B.provider_talk_track_6th_7th_grade?.body && (
            <EduSection id="talk" num={sections.findIndex(s=>s.id==="talk")+1} kicker="EXPLAINING TO PATIENTS"
              title="Plain-language talk track" accent={accent} innerRef={setRef("talk")}>
              <blockquote className="edu-talk">
                <span className="edu-talk-glyph" style={{ color: accent }}>“</span>
                {B.provider_talk_track_6th_7th_grade.body.replace(/^["""]|["""]$/g, "").trim()}
                <span className="edu-talk-glyph edu-talk-glyph-end" style={{ color: accent }}>”</span>
              </blockquote>
              <div className="mono edu-talk-byline">— how a PMHNP can explain this study in one breath</div>
            </EduSection>
          )}

          {(reg?.primary?.length || reg?.secondary?.length) && (
            <EduSection id="endpoints" num={sections.findIndex(s=>s.id==="endpoints")+1} kicker="WHAT THE TRIAL MEASURES"
              title="Endpoints" accent={accent} innerRef={setRef("endpoints")}>
              {reg?.briefSummary && (
                <div className="edu-reg-summary">{reg.briefSummary}</div>
              )}
              {reg?.primary?.length > 0 && (
                <div className="edu-endpoint">
                  <div className="mono edu-endpoint-kicker" style={{ color: accent }}>PRIMARY</div>
                  <div className="edu-endpoint-body">{reg.primary[0].m}</div>
                  {reg.primary[0].t && <div className="mono muted edu-endpoint-time">{reg.primary[0].t}</div>}
                </div>
              )}
              {reg?.secondary?.length > 0 && (
                <div className="edu-endpoint">
                  <div className="mono edu-endpoint-kicker muted">SECONDARY</div>
                  <ul className="edu-endpoint-list">
                    {reg.secondary.slice(0, 5).map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
            </EduSection>
          )}

          {B["3_step_recruit_move"]?.body && (
            <EduSection id="refer" num={sections.findIndex(s=>s.id==="refer")+1} kicker="YOUR MOVE"
              title="3-step recruit" accent={accent} innerRef={setRef("refer")}>
              <ol className="edu-steps">
                {B["3_step_recruit_move"].body.split("\n").filter(Boolean).map((line, i) => {
                  const m = line.match(/^([A-Z]+)\.\s+(.*)$/);
                  const t = m ? m[1] : `STEP ${i+1}`;
                  const body = m ? m[2] : line;
                  return (
                    <li key={i} className="edu-step">
                      <div className="edu-step-num" style={{ background: `linear-gradient(135deg, ${accent}, var(--accent-2, #06e0ff))` }}>{i+1}</div>
                      <div>
                        <div className="mono edu-step-title">{t}</div>
                        <div className="edu-step-body">{body}</div>
                      </div>
                    </li>
                  );
                })}
              </ol>
              <div className="edu-refer-card" style={{ borderColor: accent }}>
                <div>
                  <div className="mono edu-refer-kicker">REFER NOW</div>
                  <a className="edu-refer-phone" href={`tel:${(SITE.referralPhone||"9099555865").replace(/\D/g,"")}`}>
                    {SITE.referralPhone || "909-955-5865"}
                  </a>
                </div>
                {brief?.code && (
                  <div className="edu-refer-code">
                    <div className="mono edu-refer-kicker">COMMENT CODE</div>
                    <div className="edu-refer-codeval">{brief.code}</div>
                  </div>
                )}
              </div>
            </EduSection>
          )}

          {B.sources?.body && (
            <EduSection id="sources" num={sections.findIndex(s=>s.id==="sources")+1} kicker="REFERENCES"
              title="Sources" accent={accent} innerRef={setRef("sources")}>
              <ul className="edu-sources">
                {B.sources.body.split("\n").map(l => l.replace(/^•\s*/, "").trim()).filter(Boolean).map((src, i) => (
                  <li key={i}>{src}</li>
                ))}
                <li>ClinicalTrials.gov · <a href={`https://clinicaltrials.gov/study/${study.nctId}`} target="_blank" rel="noopener">{study.nctId} ↗</a></li>
              </ul>
            </EduSection>
          )}

        </main>
      </div>

      {/* --- Sticky bottom CTA --- */}
      <div className="edu-stickycta">
        <div className="edu-stickycta-inner">
          <div className="edu-stickycta-meta">
            <div className="mono edu-stickycta-eyebrow" style={{ color: accent }}>REFERRAL · IPMG {site?.name || ""}</div>
            <div className="edu-stickycta-drug">{(study.drug||study.hero).split(" ")[0]} · {cond.name || study.conditionName}</div>
          </div>
          <div className="edu-stickycta-actions">
            {brief?.code && <span className="mono edu-stickycta-code" style={{ borderColor: accent, color: accent }}>CODE {brief.code}</span>}
            <a className="btn btn-primary" href={`tel:${(SITE.referralPhone||"9099555865").replace(/\D/g,"")}`}>Call (909) 955-5865</a>
            <a className="btn" href={`#/refer?nct=${study.nctId}`}>Refer patient →</a>
          </div>
        </div>
      </div>
    </div>
  );
}

window.StudyEducationPage = StudyEducationPage;
