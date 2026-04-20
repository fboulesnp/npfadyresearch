/* global React, CONDITIONS, STUDIES, LOCATIONS, FAQS, SITE */
const { useState, useEffect, useMemo } = React;

/* ==========================================================
   HOME — scrollytelling hero + neural bg + audience paths
   ========================================================== */
function HomePage() {
  const featured = STUDIES.filter(s => s.featured);
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const on = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="section" style={{ padding: "100px 0 80px", position: "relative", minHeight: "92vh" }}>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <NeuralNetBg density={70} />
          <FloatParticles count={16} />
        </div>
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <Reveal>
            <Eyebrow>IPMG · NP EDUCATION PORTAL · {new Date().getFullYear()}</Eyebrow>
          </Reveal>
          <Reveal delay={100}>
            <h1 style={{ marginTop: 24, maxWidth: 1100 }}>
              The studies we're running,<br/>
              <span className="grad-text">explained for the clinicians</span><br/>
              who refer into them.
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p style={{ marginTop: 32, maxWidth: 620, fontSize: 20, color: "var(--ink-1)", lineHeight: 1.55 }}>
              A living briefing on six active psychiatric trials — mechanisms, targets,
              and what to tell your patients. Built for NPs who don't have 40 minutes.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="row" style={{ gap: 14, marginTop: 40, flexWrap: "wrap" }}>
              <a href="#/studies" className="btn btn-primary">
                Explore 31 active studies <span className="arrow">→</span>
              </a>
              <a href="#/for-clinicians" className="btn">For NPs <span className="arrow">→</span></a>
              <a href="#/conditions" className="btn btn-ghost">Brain map</a>
            </div>
          </Reveal>

          {/* signal stats */}
          <Reveal delay={450}>
            <div style={{ marginTop: 80, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 24 }}>
              {[
                { n: "31", l: "Active studies", sub: "Verified ClinicalTrials.gov" },
                { n: "10", l: "Conditions", sub: "MDD · SCZ · Bipolar · AD · more" },
                { n: "4", l: "Network sites", sub: "Southern California" },
                { n: "< 2d", l: "Referral turnaround", sub: "Screening call" },
              ].map((s, i) => (
                <div key={i} style={{ borderLeft: "1px solid var(--line-strong)", paddingLeft: 16 }}>
                  <div className="mono dim" style={{ fontSize: 10, letterSpacing: "0.2em", marginBottom: 8 }}>0{i+1}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 48, lineHeight: 1 }} className="grad-text">{s.n}</div>
                  <div style={{ fontSize: 14, color: "var(--ink-1)", marginTop: 6 }}>{s.l}</div>
                  <div className="mono dim" style={{ fontSize: 10, letterSpacing: "0.1em", marginTop: 4 }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* SCROLLYTELLING INTRO */}
      <section className="section" style={{ padding: "80px 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 60, alignItems: "center" }}>
            <Reveal>
              <div>
                <Eyebrow>01 · WHY THIS EXISTS</Eyebrow>
                <h2 style={{ marginTop: 20 }}>
                  You refer patients every week. <span className="grad-text">You deserve better than a 40-page protocol.</span>
                </h2>
                <p style={{ marginTop: 24, fontSize: 18, maxWidth: 520 }}>
                  This portal condenses each active trial into what an NP actually needs in two minutes:
                  mechanism, target, what's different, and how to talk about it with patients.
                </p>
                <div className="row" style={{ gap: 14, marginTop: 28 }}>
                  <ReadTime minutes={2} />
                  <span className="mono dim" style={{ fontSize: 11 }}>· PER STUDY</span>
                </div>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <EEGWave label="α · RESTING" height={110} color="var(--accent-2)"/>
                <EEGWave label="β · TASK" height={110} color="var(--accent)" speed={1.6} jitter={1.3}/>
                <EEGWave label="γ · GAMMA" height={110} color="var(--accent-3)" speed={2.4} jitter={0.9}/>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FEATURED STUDIES */}
      <section className="section" style={{ padding: "60px 0" }}>
        <div className="container">
          <Reveal>
            <div className="row-between" style={{ marginBottom: 40, flexWrap: "wrap", gap: 20 }}>
              <div>
                <Eyebrow>02 · ACTIVE STUDIES</Eyebrow>
                <h2 style={{ marginTop: 16 }}>Flip a card. Get the essentials.</h2>
              </div>
              <a href="#/studies" className="btn btn-ghost">All studies <span className="arrow">→</span></a>
            </div>
          </Reveal>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
            {featured.map((s, i) => (
              <Reveal key={s.nctId} delay={i * 80}>
                <StudyFlipCard study={s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONDITION MAP — brain */}
      <section className="section" style={{ padding: "80px 0", position: "relative" }}>
        <div className="container">
          <Reveal>
            <Eyebrow>03 · CONDITIONS</Eyebrow>
            <h2 style={{ marginTop: 16, marginBottom: 16 }}>Click a region of the brain.</h2>
            <p style={{ maxWidth: 560, fontSize: 18 }}>
              Each condition we study maps to distinct neural circuits. Click to see
              the studies that target each region.
            </p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 40, marginTop: 48, alignItems: "center" }}>
            <Reveal delay={100}>
              <HomeBrainExplorer/>
            </Reveal>
            <Reveal delay={200}>
              <div className="stack">
                {CONDITIONS.map(c => (
                  <a href={`#/conditions/${c.slug}`} key={c.slug} className="card card-glow" style={{ display: "block", padding: 22 }}>
                    <div className="row-between">
                      <div>
                        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: c.color, marginBottom: 8 }}>
                          {c.studies.length} STUDIES
                        </div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 26 }}>{c.name}</div>
                        <div className="muted" style={{ fontSize: 14, marginTop: 6 }}>{c.intro}</div>
                      </div>
                      <span className="arrow" style={{ fontSize: 24, color: "var(--accent-2)" }}>→</span>
                    </div>
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* AUDIENCE CTA */}
      <section className="section" style={{ padding: "80px 0" }}>
        <div className="container">
          <div className="card" style={{ padding: 60, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, opacity: 0.3 }}><NeuralNetBg density={30} interactive={false}/></div>
            <div style={{ position: "relative", maxWidth: 700 }}>
              <Eyebrow>NEXT STEP</Eyebrow>
              <h2 style={{ marginTop: 20 }}>
                Think a patient might fit? <br/>
                <span className="grad-text">Refer in under 2 minutes.</span>
              </h2>
              <p style={{ marginTop: 20, fontSize: 18 }}>
                Share primary diagnosis and current medications. Our coordinators handle the rest — phone pre-screen within 2 business days.
              </p>
              <div className="row" style={{ gap: 14, marginTop: 28, flexWrap: "wrap" }}>
                <a href="#/refer" className="btn btn-primary">Refer a patient <span className="arrow">→</span></a>
                <a href="#/for-clinicians" className="btn">NP overview <span className="arrow">→</span></a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function HomeBrainExplorer() {
  const [activeCondition, setActiveCondition] = useState(null);
  const activeConditions = activeCondition ? [activeCondition] : [];
  return (
    <div className="card" style={{ padding: 30, position: "relative" }}>
      <div className="row" style={{ gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        <button
          onClick={() => setActiveCondition(null)}
          className="chip"
          style={{ background: !activeCondition ? "rgba(236, 72, 153, 0.2)" : undefined, borderColor: !activeCondition ? "var(--accent)" : undefined, cursor: "pointer" }}
        >
          ALL
        </button>
        {CONDITIONS.map(c => (
          <button
            key={c.slug}
            onClick={() => setActiveCondition(c.slug)}
            className="chip"
            style={{ background: activeCondition === c.slug ? "rgba(236, 72, 153, 0.2)" : undefined, borderColor: activeCondition === c.slug ? c.color : undefined, cursor: "pointer" }}
          >
            <span className="dot" style={{ background: c.color, boxShadow: `0 0 8px ${c.color}` }}></span>
            {c.name}
          </button>
        ))}
      </div>
      <BrainDiagram activeConditions={activeConditions} onRegionClick={(k,r) => {
        const c = CONDITIONS.find(c => r.conditions.includes(c.slug));
        if (c) window.location.hash = `#/conditions/${c.slug}`;
      }}/>
    </div>
  );
}

/* ==========================================================
   STUDY FLIP CARD
   ========================================================== */
function StudyFlipCard({ study }) {
  const [flipped, setFlipped] = useState(false);
  const phaseClass = `phase-${study.phase}`;
  return (
    <div
      className="card card-glow"
      onClick={() => setFlipped(f => !f)}
      style={{ cursor: "pointer", minHeight: 340, padding: 0, position: "relative", perspective: "1200px" }}
    >
      <div style={{
        position: "relative",
        width: "100%",
        minHeight: 340,
        transformStyle: "preserve-3d",
        transition: "transform 0.7s cubic-bezier(.6,.2,.2,1)",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0)",
      }}>
        {/* FRONT */}
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", padding: 24, display: "flex", flexDirection: "column" }}>
          <div className="row-between" style={{ marginBottom: 16 }}>
            <span className={`chip ${phaseClass} live`}>
              <span className="dot"></span>{study.phaseLabel}
            </span>
            <span className="mono dim" style={{ fontSize: 10, letterSpacing: "0.15em" }}>{study.nctId}</span>
          </div>

          <div className="neuro" style={{ height: 120, margin: "8px 0 16px", borderRadius: 8, overflow: "hidden", background: "rgba(255,255,255,0.02)", border: "1px solid var(--line)", position: "relative" }}>
            {(study.mechanism.includes("ultrasound") || study.mechanism.includes("Observational")) ? (
              <FMRIBlob color={colorFor(study.condition)}/>
            ) : (
              <SynapseIllustration highlight={study.neurotransmitter} height={120}/>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: colorFor(study.condition), marginBottom: 6 }}>
              {study.conditionName.toUpperCase()}
            </div>
            <h3 style={{ fontSize: 22, marginBottom: 12 }}>{study.hero}</h3>
            <p className="muted" style={{ fontSize: 14, lineHeight: 1.5 }}>{study.oneLine}</p>
          </div>

          <div className="row-between" style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
            <span className="mono dim" style={{ fontSize: 10, letterSpacing: "0.15em" }}>CLICK TO FLIP</span>
            <span style={{ color: "var(--accent-2)" }}>↻</span>
          </div>
        </div>

        {/* BACK */}
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", padding: 24, display: "flex", flexDirection: "column" }}>
          <div className="row-between" style={{ marginBottom: 16 }}>
            <span className="chip"><span className="dot"></span>MOA</span>
            <span className="mono dim" style={{ fontSize: 10 }}>{study.nctId}</span>
          </div>
          <h3 style={{ fontSize: 20, marginBottom: 10 }}>{study.hero}</h3>
          <div className="stack" style={{ gap: 12, fontSize: 13, flex: 1 }}>
            <Row k="Mechanism" v={study.mechanism}/>
            <Row k="Target" v={study.target}/>
            <Row k="Sponsor" v={study.sponsor}/>
            <Row k="Status" v={study.status}/>
            <div>
              <div className="mono dim" style={{ fontSize: 10, letterSpacing: "0.18em", marginBottom: 8 }}>TAGS</div>
              <div className="row" style={{ flexWrap: "wrap", gap: 6 }}>
                {study.tags.map(t => <span key={t} className="chip">{t}</span>)}
              </div>
            </div>
          </div>
          <a
            href={`#/studies/${study.nctId}`}
            onClick={(e) => e.stopPropagation()}
            className="btn btn-primary"
            style={{ marginTop: 16, justifyContent: "center" }}
          >
            Full briefing <span className="arrow">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div>
      <div className="mono dim" style={{ fontSize: 10, letterSpacing: "0.18em", marginBottom: 4 }}>{k.toUpperCase()}</div>
      <div style={{ fontSize: 14, color: "var(--ink-0)" }}>{v}</div>
    </div>
  );
}

function colorFor(conditionSlug) {
  const c = CONDITIONS.find(x => x.slug === conditionSlug);
  return c ? c.color : "var(--accent)";
}

/* ==========================================================
   STUDIES EXPLORER
   ========================================================== */
function StudiesPage() {
  const [q, setQ] = useState("");
  const [condition, setCondition] = useState("all");
  const [phase, setPhase] = useState("all");

  const filtered = useMemo(() => {
    return STUDIES.filter(s => {
      if (condition !== "all" && s.condition !== condition) return false;
      if (phase !== "all" && String(s.phase) !== phase) return false;
      if (q && !(s.title + s.sponsor + s.mechanism + s.hero + s.conditionName).toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [q, condition, phase]);

  return (
    <>
      <section className="section" style={{ padding: "80px 0 40px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.5 }}><NeuralNetBg density={35} /></div>
        <div className="container" style={{ position: "relative" }}>
          <Eyebrow>STUDIES · {STUDIES.length} ACTIVE</Eyebrow>
          <h1 style={{ marginTop: 20, maxWidth: 900 }}>
            Every active trial, <span className="grad-text">filterable in real time.</span>
          </h1>
          <p style={{ marginTop: 20, fontSize: 18, maxWidth: 600 }}>
            Live registry-backed records. Filter by condition or phase. Click a card for full NP briefing.
          </p>
        </div>
      </section>

      <section className="section" style={{ padding: "20px 0 40px", position: "sticky", top: 62, zIndex: 20, background: "rgba(5,4,10,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--line)" }}>
        <div className="container">
          <div className="row" style={{ gap: 20, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 280px", minWidth: 220 }}>
              <label className="mono dim" style={{ fontSize: 10, letterSpacing: "0.2em", display: "block", marginBottom: 6 }}>SEARCH</label>
              <input
                value={q} onChange={e => setQ(e.target.value)}
                placeholder="Search sponsor, mechanism, NCT..."
                style={{
                  width: "100%", padding: "12px 16px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--line-strong)",
                  borderRadius: 999,
                  color: "var(--ink-0)",
                  fontSize: 14,
                  fontFamily: "var(--font-mono)",
                  outline: "none",
                }}
              />
            </div>
            <div>
              <label className="mono dim" style={{ fontSize: 10, letterSpacing: "0.2em", display: "block", marginBottom: 6 }}>CONDITION</label>
              <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
                <Pill active={condition === "all"} onClick={() => setCondition("all")}>All</Pill>
                {CONDITIONS.map(c => (
                  <Pill key={c.slug} active={condition === c.slug} color={c.color} onClick={() => setCondition(c.slug)}>{c.name}</Pill>
                ))}
              </div>
            </div>
            <div>
              <label className="mono dim" style={{ fontSize: 10, letterSpacing: "0.2em", display: "block", marginBottom: 6 }}>PHASE</label>
              <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
                <Pill active={phase === "all"} onClick={() => setPhase("all")}>All</Pill>
                {["1","2","3","4"].map(p => (
                  <Pill key={p} active={phase === p} onClick={() => setPhase(p)}>Phase {p}</Pill>
                ))}
              </div>
            </div>
          </div>
          <div className="mono dim" style={{ fontSize: 11, letterSpacing: "0.15em", marginTop: 16 }}>
            SHOWING {filtered.length} OF {STUDIES.length}
          </div>
        </div>
      </section>

      <section className="section" style={{ padding: "40px 0 80px" }}>
        <div className="container">
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
            {filtered.map((s, i) => (
              <Reveal key={s.nctId} delay={i * 60}>
                <StudyFlipCard study={s}/>
              </Reveal>
            ))}
            {filtered.length === 0 && (
              <div className="card" style={{ gridColumn: "1 / -1", padding: 60, textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>∅</div>
                <h3>No studies match those filters</h3>
                <p className="muted" style={{ marginTop: 8 }}>Try clearing one of them.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function Pill({ children, active, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="chip"
      style={{
        cursor: "pointer",
        borderColor: active ? (color || "var(--accent)") : undefined,
        background: active ? (color ? `color-mix(in srgb, ${color} 18%, transparent)` : "rgba(236, 72, 153, 0.15)") : undefined,
        color: active ? "var(--ink-0)" : undefined,
      }}
    >
      {color && <span className="dot" style={{ background: color, boxShadow: `0 0 8px ${color}` }}></span>}
      {children}
    </button>
  );
}

/* ==========================================================
   STUDY DETAIL — full educational page per study
   ========================================================== */
function StudyDetailPage({ nctId }) {
  const study = STUDIES.find(s => s.nctId === nctId);
  if (!study) return <NotFound/>;
  // Full educational page (pulls from 2026 IPMG brief library + ClinicalTrials.gov)
  const EduPage = window.StudyEducationPage;
  if (EduPage) return <EduPage study={study} />;
  // Fallback: legacy alert-poster rendering while edu script loads
  return <TrialAlert study={study} />;
}

/* ==========================================================
   CONDITIONS PAGE (list + detail)
   ========================================================== */
function ConditionsPage() {
  return (
    <>
      <section className="section" style={{ padding: "80px 0 40px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.4 }}><NeuralNetBg density={35}/></div>
        <div className="container" style={{ position: "relative" }}>
          <Eyebrow>CONDITIONS · NEURAL ATLAS</Eyebrow>
          <h1 style={{ marginTop: 20 }}>
            The <span className="grad-text">brain regions</span> we study, <br/>and the trials that target them.
          </h1>
          <p style={{ maxWidth: 600, fontSize: 18, marginTop: 20 }}>
            Ten conditions. Thirty-one studies. Click the atlas to jump to the relevant trials.
          </p>
        </div>
      </section>

      <section className="section" style={{ padding: "40px 0" }}>
        <div className="container">
          <div className="card" style={{ padding: 30 }}>
            <HomeBrainExplorer/>
          </div>
        </div>
      </section>

      <section className="section" style={{ padding: "40px 0 80px" }}>
        <div className="container">
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
            {CONDITIONS.map((c, i) => (
              <Reveal key={c.slug} delay={i * 80}>
                <ConditionCard condition={c}/>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ConditionCard({ condition: c }) {
  return (
    <a href={`#/conditions/${c.slug}`} className="card card-glow" style={{ padding: 28, display: "block" }}>
      <div className="row-between" style={{ marginBottom: 20 }}>
        <span className="chip" style={{ borderColor: c.color }}>
          <span className="dot" style={{ background: c.color, boxShadow: `0 0 8px ${c.color}` }}></span>
          {c.studies.length} STUDIES
        </span>
        <ReadTime minutes={c.readTime}/>
      </div>
      <div style={{ height: 120, marginBottom: 16 }}>
        <FMRIBlob color={c.color}/>
      </div>
      <h3 style={{ fontSize: 26, marginBottom: 10 }}>{c.name}</h3>
      <p className="muted" style={{ fontSize: 14, marginBottom: 20 }}>{c.intro}</p>
      <div className="row-between" style={{ paddingTop: 16, borderTop: "1px solid var(--line)" }}>
        <span className="mono dim" style={{ fontSize: 10, letterSpacing: "0.2em" }}>
          {c.regions.length} REGIONS · {c.neurotransmitter.toUpperCase()}
        </span>
        <span style={{ color: "var(--accent-2)" }}>→</span>
      </div>
    </a>
  );
}

function ConditionDetailPage({ slug }) {
  const c = CONDITIONS.find(x => x.slug === slug);
  if (!c) return <NotFound/>;
  const studies = STUDIES.filter(s => s.condition === slug);

  return (
    <>
      <section className="section" style={{ padding: "60px 0 40px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.3 }}><NeuralNetBg density={30}/></div>
        <div className="container" style={{ position: "relative" }}>
          <a href="#/conditions" className="mono dim" style={{ fontSize: 11, letterSpacing: "0.2em" }}>← ALL CONDITIONS</a>
          <div className="row" style={{ gap: 10, marginTop: 20 }}>
            <span className="chip" style={{ borderColor: c.color }}>
              <span className="dot" style={{ background: c.color, boxShadow: `0 0 8px ${c.color}` }}></span>
              {studies.length} ACTIVE STUDIES
            </span>
            <ReadTime minutes={c.readTime}/>
          </div>
          <h1 style={{ marginTop: 24 }}>
            <span className="grad-text">{c.name}.</span>
          </h1>
          <p style={{ marginTop: 24, fontSize: 20, maxWidth: 720 }}>{c.patientCopy}</p>
        </div>
      </section>

      <section className="section" style={{ padding: "40px 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <Reveal>
              <div className="card" style={{ padding: 28 }}>
                <Eyebrow>NEURAL CIRCUIT</Eyebrow>
                <h3 style={{ marginTop: 16, marginBottom: 16 }}>Involved regions</h3>
                <BrainDiagram activeConditions={[slug]}/>
                <div className="row" style={{ flexWrap: "wrap", gap: 8, marginTop: 24 }}>
                  {c.regions.map(r => (
                    <span key={r} className="chip">{window.BRAIN_REGIONS[r]?.label || r}</span>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="card" style={{ padding: 28 }}>
                <Eyebrow>NEUROTRANSMITTER</Eyebrow>
                <h3 style={{ marginTop: 16, marginBottom: 16, textTransform: "capitalize" }}>{c.neurotransmitter} pathway</h3>
                <SynapseIllustration highlight={c.neurotransmitter} height={160}/>
                <p style={{ marginTop: 20, fontSize: 14 }} className="muted">
                  {c.npCopy}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section" style={{ padding: "40px 0 80px" }}>
        <div className="container">
          <Eyebrow>STUDIES · {studies.length}</Eyebrow>
          <h2 style={{ marginTop: 16, marginBottom: 32 }}>Active {c.name.toLowerCase()} trials</h2>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
            {studies.map((s, i) => (
              <Reveal key={s.nctId} delay={i * 80}>
                <StudyFlipCard study={s}/>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ==========================================================
   LOCATIONS
   ========================================================== */
function LocationsPage() {
  return (
    <>
      <section className="section" style={{ padding: "80px 0 40px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.35 }}><NeuralNetBg density={30}/></div>
        <div className="container" style={{ position: "relative" }}>
          <Eyebrow>LOCATIONS</Eyebrow>
          <h1 style={{ marginTop: 20 }}>
            Four <span className="grad-text">Southern California</span> sites, <br/>one coordinated network.
          </h1>
        </div>
      </section>

      <section className="section" style={{ padding: "40px 0 80px" }}>
        <div className="container">
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
            {LOCATIONS.map((l, i) => (
              <Reveal key={l.slug} delay={i * 100}>
                <LocationCard location={l}/>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function LocationCard({ location: l }) {
  return (
    <a href={`#/locations/${l.slug}`} className="card card-glow" style={{ padding: 32, display: "block" }}>
      <Eyebrow>{l.city}</Eyebrow>
      <h3 style={{ fontSize: 32, marginTop: 16, marginBottom: 14 }}>{l.name}</h3>
      <p className="muted" style={{ fontSize: 15, marginBottom: 24 }}>{l.tagline}</p>
      <div className="stack" style={{ gap: 10 }}>
        {l.capabilities.map(cap => (
          <div key={cap} className="row" style={{ gap: 10, fontSize: 14 }}>
            <span style={{ color: "var(--accent-2)" }}>◇</span> {cap}
          </div>
        ))}
      </div>
      <div className="row-between" style={{ paddingTop: 20, marginTop: 24, borderTop: "1px solid var(--line)" }}>
        <span className="mono dim" style={{ fontSize: 10, letterSpacing: "0.2em" }}>{l.studies.length} MAPPED STUDIES</span>
        <span style={{ color: "var(--accent-2)" }}>→</span>
      </div>
    </a>
  );
}

function LocationDetailPage({ slug }) {
  const l = LOCATIONS.find(x => x.slug === slug);
  if (!l) return <NotFound/>;
  const studies = STUDIES.filter(s => s.locations.includes(slug));
  return (
    <>
      <section className="section" style={{ padding: "60px 0 40px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.3 }}><NeuralNetBg density={30}/></div>
        <div className="container" style={{ position: "relative" }}>
          <a href="#/locations" className="mono dim" style={{ fontSize: 11, letterSpacing: "0.2em" }}>← ALL LOCATIONS</a>
          <Eyebrow>{l.city}</Eyebrow>
          <h1 style={{ marginTop: 20 }}><span className="grad-text">{l.name}.</span></h1>
          <p style={{ fontSize: 20, marginTop: 20, maxWidth: 700 }}>{l.tagline}</p>
        </div>
      </section>

      <section className="section" style={{ padding: "40px 0" }}>
        <div className="container">
          <div className="card" style={{ padding: 28 }}>
            <Eyebrow>CAPABILITIES</Eyebrow>
            <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginTop: 20 }}>
              {l.capabilities.map((c,i) => (
                <div key={c} style={{ padding: 20, border: "1px solid var(--line)", borderRadius: 12 }}>
                  <div className="mono" style={{ fontSize: 10, color: "var(--accent-2)", letterSpacing: "0.2em", marginBottom: 10 }}>0{i+1}</div>
                  <div style={{ fontSize: 16 }}>{c}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ padding: "40px 0 100px" }}>
        <div className="container">
          <Eyebrow>STUDIES AT THIS SITE</Eyebrow>
          <h2 style={{ marginTop: 16, marginBottom: 28 }}>{studies.length} mapped trials</h2>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
            {studies.map((s,i) => <Reveal key={s.nctId} delay={i*60}><StudyFlipCard study={s}/></Reveal>)}
          </div>
        </div>
      </section>
    </>
  );
}

/* ==========================================================
   FOR CLINICIANS (NPs)
   ========================================================== */
function ForCliniciansPage() {
  return (
    <>
      <section className="section" style={{ padding: "80px 0 40px", position: "relative", minHeight: "70vh" }}>
        <div style={{ position: "absolute", inset: 0 }}><NeuralNetBg density={45}/></div>
        <div className="container" style={{ position: "relative" }}>
          <Eyebrow>FOR NURSE PRACTITIONERS</Eyebrow>
          <h1 style={{ marginTop: 20, maxWidth: 1000 }}>
            <span className="grad-text">You know your patients.</span><br/>
            We'll handle the protocol math.
          </h1>
          <p style={{ fontSize: 20, marginTop: 28, maxWidth: 660 }}>
            A coordinated referral takes under two minutes. We'll complete the screening call,
            loop you in on enrollment, and keep you informed through the study.
          </p>
          <div className="row" style={{ gap: 14, marginTop: 32, flexWrap: "wrap" }}>
            <a href="#/refer" className="btn btn-primary">Refer a patient <span className="arrow">→</span></a>
            <a href="#/studies" className="btn">Browse studies <span className="arrow">→</span></a>
          </div>
        </div>
      </section>

      <section className="section" style={{ padding: "40px 0" }}>
        <div className="container">
          <Eyebrow>REFERRAL PATHWAY</Eyebrow>
          <h2 style={{ marginTop: 16, marginBottom: 40 }}>Four steps, two business days.</h2>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {[
              { n: "01", t: "You refer", d: "Call or email with diagnosis + current meds. No form yet in Phase 2." },
              { n: "02", t: "We triage", d: "Coordinator matches patient to the most likely-fit study from the active catalog." },
              { n: "03", t: "Pre-screen", d: "Phone screen with patient within 2 business days. Inclusion/exclusion review." },
              { n: "04", t: "Informed consent", d: "If appropriate: in-person informed consent, screening labs, enrollment." },
            ].map((step, i) => (
              <Reveal key={step.n} delay={i * 80}>
                <div className="card card-glow" style={{ padding: 24, height: "100%" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 48, lineHeight: 1, marginBottom: 16 }} className="grad-text">{step.n}</div>
                  <h3 style={{ fontSize: 22, marginBottom: 10 }}>{step.t}</h3>
                  <p className="muted" style={{ fontSize: 14 }}>{step.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ padding: "60px 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 40, alignItems: "center" }}>
            <Reveal>
              <div>
                <Eyebrow>SCREENING MATH</Eyebrow>
                <h2 style={{ marginTop: 16, marginBottom: 24 }}>
                  Your time investment: <span className="grad-text">under 2 minutes.</span>
                </h2>
                <div className="stack" style={{ gap: 16 }}>
                  <Bar label="Identifying a potential fit" pct={90} sub="You already know your patient"/>
                  <Bar label="Placing the referral call" pct={30} sub="~90 seconds"/>
                  <Bar label="Coordinator pre-screen" pct={15} sub="We handle this" color="var(--accent-2)"/>
                  <Bar label="Protocol-specific review" pct={8} sub="Principal investigator" color="var(--accent-3)"/>
                </div>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="card" style={{ padding: 28 }}>
                <Eyebrow>WHAT TO SHARE</Eyebrow>
                <div className="stack" style={{ gap: 14, marginTop: 20 }}>
                  {[
                    "Primary psychiatric diagnosis",
                    "Current medications + recent changes",
                    "Key comorbidities",
                    "Rough patient age + general stability",
                    "Whether the patient has expressed interest",
                  ].map((x, i) => (
                    <div key={i} className="row" style={{ gap: 12, padding: "10px 0", borderTop: i === 0 ? "none" : "1px solid var(--line)" }}>
                      <span className="mono" style={{ color: "var(--accent-2)", fontSize: 11 }}>0{i+1}</span>
                      <span style={{ fontSize: 15 }}>{x}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section" style={{ padding: "60px 0 100px" }}>
        <div className="container">
          <Eyebrow>STUDIES AT A GLANCE</Eyebrow>
          <h2 style={{ marginTop: 16, marginBottom: 28 }}>Quick catalog for NPs</h2>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                  {["Condition","Study","Mechanism","Phase","Sites"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "14px 20px", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", color: "var(--ink-2)", borderBottom: "1px solid var(--line)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {STUDIES.map(s => (
                  <tr
                    key={s.nctId}
                    onClick={() => window.location.hash = `#/studies/${s.nctId}`}
                    style={{ cursor: "pointer", transition: "background 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(236, 72, 153, 0.06)"}
                    onMouseLeave={e => e.currentTarget.style.background = ""}
                  >
                    <td style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)", fontSize: 13 }}>
                      <span className="chip" style={{ borderColor: colorFor(s.condition) }}>
                        <span className="dot" style={{ background: colorFor(s.condition), boxShadow: `0 0 8px ${colorFor(s.condition)}` }}></span>
                        {s.conditionName}
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)", fontSize: 14 }}>{s.hero}</td>
                    <td style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)", fontSize: 13 }} className="muted">{s.mechanism}</td>
                    <td style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)" }}>
                      <span className={`chip phase-${s.phase}`}><span className="dot"></span>{s.phaseLabel}</span>
                    </td>
                    <td style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)", fontSize: 12 }} className="mono dim">{s.locations.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}

function Bar({ label, pct, sub, color = "var(--accent)" }) {
  return (
    <div>
      <div className="row-between" style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 14 }}>{label}</span>
        <span className="mono dim" style={{ fontSize: 11 }}>{sub}</span>
      </div>
      <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${color}, var(--accent-2))`, boxShadow: `0 0 12px ${color}` }}></div>
      </div>
    </div>
  );
}

/* ==========================================================
   FAQ
   ========================================================== */
function FAQPage() {
  const [open, setOpen] = useState(0);
  return (
    <>
      <section className="section" style={{ padding: "80px 0 40px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.3 }}><NeuralNetBg density={25}/></div>
        <div className="container" style={{ position: "relative" }}>
          <Eyebrow>FAQ</Eyebrow>
          <h1 style={{ marginTop: 20 }}>
            Questions <span className="grad-text">NPs actually ask.</span>
          </h1>
        </div>
      </section>

      <section className="section" style={{ padding: "40px 0 100px" }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <div className="stack" style={{ gap: 12 }}>
            {FAQS.map((f, i) => (
              <Reveal key={i} delay={i * 40}>
                <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                  <button
                    onClick={() => setOpen(open === i ? -1 : i)}
                    style={{ width: "100%", padding: 24, textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}
                  >
                    <div className="row" style={{ gap: 20 }}>
                      <span className="mono" style={{ fontSize: 11, letterSpacing: "0.2em", color: "var(--accent-2)", minWidth: 30 }}>0{i+1}</span>
                      <span style={{ fontSize: 18, fontFamily: "var(--font-display)" }}>{f.q}</span>
                    </div>
                    <span style={{ fontSize: 24, color: "var(--accent)", transform: open === i ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.3s" }}>+</span>
                  </button>
                  <div style={{ maxHeight: open === i ? 500 : 0, overflow: "hidden", transition: "max-height 0.5s ease" }}>
                    <div style={{ padding: "0 24px 24px 74px", fontSize: 15, lineHeight: 1.65, color: "var(--ink-1)" }}>
                      {f.a}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ==========================================================
   404
   ========================================================== */
function NotFound() {
  return (
    <section className="section" style={{ padding: "140px 0", textAlign: "center" }}>
      <div className="container">
        <div style={{ fontFamily: "var(--font-display)", fontSize: 120, lineHeight: 1 }} className="grad-text">404</div>
        <h2 style={{ marginTop: 20 }}>Signal lost</h2>
        <p className="muted" style={{ marginTop: 12, fontSize: 18 }}>The page you're looking for isn't here.</p>
        <a href="#/" className="btn btn-primary" style={{ marginTop: 32 }}>← Back to home</a>
      </div>
    </section>
  );
}

/* ==========================================================
   REFER — short form
   ========================================================== */
function ReferPage() {
  const [form, setForm] = useState({
    npName: "", clinic: "", initials: "", condition: "mood-disorders",
    contactPref: "email", contact: "", notes: ""
  });
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    const body = `NP: ${form.npName}
Clinic: ${form.clinic}
Patient initials: ${form.initials}
Condition of interest: ${form.condition}
Preferred contact: ${form.contactPref} (${form.contact})

Notes:
${form.notes}`;
    const subject = `NP referral — ${form.initials || "new patient"} (${form.condition})`;
    const mailto = `mailto:${SITE.referralEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setSent(true);
  };

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid var(--line-strong)",
    borderRadius: 10,
    color: "var(--ink-0)",
    fontSize: 15,
    fontFamily: "var(--font-sans)",
    outline: "none",
  };
  const labelStyle = {
    display: "block",
    fontFamily: "var(--font-mono)",
    fontSize: 10,
    letterSpacing: "0.2em",
    color: "var(--ink-2)",
    textTransform: "uppercase",
    marginBottom: 8,
  };

  return (
    <>
      <section className="section" style={{ padding: "80px 0 40px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.35 }}><NeuralNetBg density={35}/></div>
        <div className="container" style={{ position: "relative" }}>
          <Eyebrow>REFER A PATIENT</Eyebrow>
          <h1 style={{ marginTop: 20, maxWidth: 900 }}>
            <span className="grad-text">Under two minutes.</span><br/>
            We take it from there.
          </h1>
          <p style={{ fontSize: 18, maxWidth: 600, marginTop: 20 }}>
            Share a few details. Submitting opens your email client with a pre-filled message to our research team — no PHI required beyond patient initials.
          </p>
          <div className="row" style={{ gap: 14, marginTop: 24 }}>
            <ReadTime minutes={2}/>
            <span className="mono dim" style={{ fontSize: 11 }}>· 2 BUSINESS DAYS TO FOLLOW-UP</span>
          </div>
        </div>
      </section>

      <section className="section" style={{ padding: "40px 0 100px" }}>
        <div className="container" style={{ maxWidth: 780 }}>
          <form onSubmit={onSubmit} className="card" style={{ padding: 36 }}>
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <label style={labelStyle}>Your name</label>
                <input required style={inputStyle} value={form.npName} onChange={f("npName")} placeholder="Jane Doe, NP"/>
              </div>
              <div>
                <label style={labelStyle}>Clinic / practice</label>
                <input required style={inputStyle} value={form.clinic} onChange={f("clinic")} placeholder="Practice name"/>
              </div>
              <div>
                <label style={labelStyle}>Patient initials</label>
                <input required style={inputStyle} value={form.initials} onChange={f("initials")} placeholder="e.g. J.D." maxLength={6}/>
              </div>
              <div>
                <label style={labelStyle}>Condition of interest</label>
                <select style={inputStyle} value={form.condition} onChange={f("condition")}>
                  {CONDITIONS.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                  <option value="unsure">Not sure yet</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Preferred contact</label>
                <select style={inputStyle} value={form.contactPref} onChange={f("contactPref")}>
                  <option value="email">Email</option>
                  <option value="phone">Phone callback</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Your {form.contactPref}</label>
                <input required style={inputStyle} value={form.contact} onChange={f("contact")} placeholder={form.contactPref === "email" ? "you@clinic.com" : "Best callback number"}/>
              </div>
            </div>
            <div style={{ marginTop: 20 }}>
              <label style={labelStyle}>Notes (optional)</label>
              <textarea rows={4} style={{ ...inputStyle, resize: "vertical", fontFamily: "var(--font-sans)" }} value={form.notes} onChange={f("notes")} placeholder="Primary diagnosis, current medications, timing constraints — no PHI required"/>
            </div>
            <div className="row-between" style={{ marginTop: 28, flexWrap: "wrap", gap: 16 }}>
              <span className="mono dim" style={{ fontSize: 11, letterSpacing: "0.15em", maxWidth: 360 }}>
                OPENS YOUR EMAIL CLIENT · NOTHING IS SENT FROM THIS PAGE
              </span>
              <button type="submit" className="btn btn-primary">
                {sent ? "Opened ↗" : "Open referral email"} <span className="arrow">→</span>
              </button>
            </div>
          </form>

          <div className="card" style={{ padding: 28, marginTop: 24 }}>
            <Eyebrow>PREFER EMAIL DIRECTLY?</Eyebrow>
            <div className="row" style={{ gap: 14, marginTop: 16, flexWrap: "wrap" }}>
              <a href={`mailto:${SITE.referralEmail}`} className="btn">{SITE.referralEmail}</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

Object.assign(window, {
  HomePage, StudiesPage, StudyDetailPage,
  ConditionsPage, ConditionDetailPage,
  LocationsPage, LocationDetailPage,
  ForCliniciansPage, FAQPage, ReferPage, NotFound,
});
