/* global React */
const { useEffect, useRef, useState, useMemo, useCallback } = React;

/* ==========================================================
   NEURAL NETWORK BACKGROUND (canvas)
   Responds to mouse movement
   ========================================================== */
function NeuralNetBg({ density = 60, className = "", interactive = true }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const nodesRef = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const seed = () => {
      const count = Math.floor(density * (w * h) / (1200 * 800));
      nodesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: 0.8 + Math.random() * 1.4,
        hue: Math.random() < 0.5 ? "magenta" : (Math.random() < 0.5 ? "cyan" : "violet"),
      }));
    };

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };

    const colorMap = {
      magenta: [236, 72, 153],
      cyan: [6, 224, 255],
      violet: [167, 139, 250],
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const nodes = nodesRef.current;
      const mx = mouseRef.current.x, my = mouseRef.current.y;

      // update + mouse attract
      for (const n of nodes) {
        if (interactive) {
          const dx = mx - n.x, dy = my - n.y;
          const d2 = dx*dx + dy*dy;
          if (d2 < 180*180 && d2 > 1) {
            const d = Math.sqrt(d2);
            const f = (180 - d) / 180 * 0.04;
            n.vx += dx / d * f;
            n.vy += dy / d * f;
          }
        }
        n.vx *= 0.985; n.vy *= 0.985;
        n.x += n.vx; n.y += n.vy;
        if (n.x < -10) n.x = w + 10;
        if (n.x > w + 10) n.x = -10;
        if (n.y < -10) n.y = h + 10;
        if (n.y > h + 10) n.y = -10;
      }

      // connections
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx*dx + dy*dy;
          if (d2 < 140*140) {
            const alpha = (1 - d2/(140*140)) * 0.35;
            const [r1,g1,b1] = colorMap[a.hue];
            const [r2,g2,b2] = colorMap[b.hue];
            const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
            grad.addColorStop(0, `rgba(${r1},${g1},${b1},${alpha})`);
            grad.addColorStop(1, `rgba(${r2},${g2},${b2},${alpha})`);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // mouse attractor line
      if (interactive && mx > 0) {
        for (const n of nodes) {
          const dx = n.x - mx, dy = n.y - my;
          const d2 = dx*dx + dy*dy;
          if (d2 < 180*180) {
            const alpha = (1 - d2/(180*180)) * 0.8;
            ctx.strokeStyle = `rgba(6, 224, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(n.x, n.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      for (const n of nodes) {
        const [r,g,b] = colorMap[n.hue];
        ctx.fillStyle = `rgba(${r},${g},${b},0.9)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = `rgba(${r},${g},${b},0.18)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r*3.5, 0, Math.PI*2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    if (interactive) {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseleave", onLeave);
    }
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [density, interactive]);

  return <canvas ref={canvasRef} className={`neuro ${className}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

/* ==========================================================
   EEG WAVEFORM
   ========================================================== */
function EEGWave({ height = 80, color = "var(--accent-2)", speed = 1, jitter = 1, label }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0;
    let t = 0;
    let raf;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const cssColor = (c) => {
      if (!c.startsWith("var(")) return c;
      const name = c.match(/var\((--[^)]+)\)/)[1];
      return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      t += 0.015 * speed;
      const c = cssColor(color);
      // grid
      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += 20) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
      // wave
      ctx.strokeStyle = c;
      ctx.lineWidth = 1.4;
      ctx.shadowBlur = 12;
      ctx.shadowColor = c;
      ctx.beginPath();
      for (let x = 0; x < w; x += 2) {
        const y = h/2
          + Math.sin(x * 0.015 + t) * 12 * jitter
          + Math.sin(x * 0.042 + t * 1.3) * 8 * jitter
          + Math.sin(x * 0.11 + t * 2.1) * 4 * jitter
          + (Math.random() - 0.5) * 1.5 * jitter;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(draw);
    };
    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [color, speed, jitter]);

  return (
    <div className="neuro" style={{ position: "relative", height, borderRadius: 8, overflow: "hidden", border: "1px solid var(--line)", background: "rgba(255,255,255,0.02)" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
      {label && (
        <div style={{ position: "absolute", top: 8, left: 10, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", color: "var(--ink-3)", textTransform: "uppercase" }}>
          {label}
        </div>
      )}
    </div>
  );
}

/* ==========================================================
   BRAIN SVG — click regions
   ========================================================== */
const BRAIN_REGIONS = {
  // ============ LOBES & CORTICAL ============
  // Each region is a real anatomical lobe area, bounded by actual sulci.
  // Coordinate system: brain body spans roughly x:60-470, y:80-360 in a 580x510 viewBox.
  // Lateral view, left hemisphere, anterior = left.

  "prefrontal": {
    label: "Prefrontal Cortex", short: "PFC",
    cx: 130, cy: 170,
    // Frontal pole: from anterior tip back to pre-central sulcus, above Sylvian fissure
    path: "M 72 200 C 66 160, 82 115, 130 95 C 165 83, 205 85, 225 100 C 228 125, 225 150, 218 175 C 210 198, 200 215, 185 225 C 155 230, 115 228, 90 220 C 78 212, 72 206, 72 200 Z",
    conditions: ["mdd","bipolar","schizophrenia","alzheimers","pediatric","gad","bed","ptsd"],
    fn: "Executive function, emotional regulation, working memory",
    group: "cortex"
  },
  "motor": {
    label: "Motor Cortex", short: "M1",
    cx: 235, cy: 120,
    // Precentral gyrus: thin strip anterior to central sulcus
    path: "M 225 100 C 232 92, 248 88, 260 94 C 258 115, 252 140, 248 165 C 244 188, 240 210, 236 228 C 230 224, 224 215, 222 200 C 220 170, 222 135, 225 100 Z",
    conditions: ["td","pediatric"],
    fn: "Voluntary movement, motor planning",
    group: "cortex"
  },
  "sensory": {
    label: "Somatosensory Cortex", short: "S1",
    cx: 275, cy: 118,
    // Postcentral gyrus: thin strip posterior to central sulcus
    path: "M 260 94 C 275 87, 295 88, 305 95 C 300 120, 292 148, 285 175 C 278 195, 270 215, 260 222 C 253 220, 250 212, 250 195 C 252 160, 256 128, 260 94 Z",
    conditions: ["ptsd","autism"],
    fn: "Touch, proprioception, body map",
    group: "cortex"
  },
  "parietal": {
    label: "Parietal Association", short: "PPC",
    cx: 340, cy: 140,
    // Superior & inferior parietal lobule: posterior to postcentral sulcus, above parieto-occipital
    path: "M 305 95 C 330 88, 365 92, 385 108 C 388 135, 385 165, 375 190 C 365 210, 350 225, 330 232 C 315 230, 305 222, 298 210 C 295 180, 300 140, 305 95 Z",
    conditions: ["autism","alzheimers","ptsd"],
    fn: "Spatial attention, sensory integration",
    group: "cortex"
  },
  "occipital": {
    label: "Occipital Cortex", short: "V1",
    cx: 420, cy: 215,
    // Occipital pole: posterior tip, bounded by parieto-occipital sulcus
    path: "M 385 108 C 420 112, 450 135, 462 180 C 464 215, 458 245, 440 265 C 420 275, 398 272, 380 260 C 372 240, 370 215, 372 190 C 378 160, 382 130, 385 108 Z",
    conditions: ["alzheimers","schizophrenia"],
    fn: "Visual processing",
    group: "cortex"
  },
  "temporal": {
    label: "Temporal Cortex", short: "T",
    cx: 255, cy: 275,
    // Temporal lobe: below Sylvian fissure, from anterior pole to posterior
    path: "M 115 250 C 135 245, 170 248, 210 252 C 260 258, 310 268, 345 275 C 358 285, 355 310, 340 330 C 315 348, 270 355, 220 348 C 170 342, 130 325, 110 300 C 102 278, 105 258, 115 250 Z",
    conditions: ["schizophrenia","alzheimers","autism","ptsd"],
    fn: "Auditory, language, declarative memory",
    group: "cortex"
  },
  "cingulate": {
    label: "Anterior Cingulate", short: "ACC",
    cx: 200, cy: 165,
    // Cingulate gyrus: wraps over corpus callosum (shown as ghost band in DEEP view)
    path: "M 150 185 C 165 160, 205 145, 255 145 C 285 148, 305 155, 318 168 C 310 180, 285 188, 250 188 C 215 190, 185 198, 165 205 C 152 202, 146 195, 150 185 Z",
    conditions: ["mdd","bipolar","gad","ptsd","bed"],
    fn: "Conflict monitoring, affect regulation",
    group: "limbic"
  },

  // ============ SUBCORTICAL (revealed in DEEP view) ============
  "striatum": {
    label: "Striatum (Caudate + Putamen)", short: "STR",
    cx: 200, cy: 210,
    // Comma-shaped: caudate head above + putamen body
    path: "M 165 192 C 185 186, 215 190, 230 205 C 232 218, 222 232, 205 238 C 185 240, 165 234, 158 222 C 155 210, 158 198, 165 192 Z",
    conditions: ["schizophrenia","td","bipolar","pediatric","bed","autism"],
    fn: "Reward, motor control, habit formation",
    group: "subcortical"
  },
  "thalamus": {
    label: "Thalamus", short: "Th",
    cx: 260, cy: 205,
    // Egg-shaped, central
    path: "M 240 195 C 262 190, 285 198, 290 215 C 285 230, 268 238, 250 232 C 234 226, 230 210, 240 195 Z",
    conditions: ["schizophrenia","ptsd","bipolar","mdd"],
    fn: "Sensory relay, consciousness",
    group: "subcortical"
  },
  "amygdala": {
    label: "Amygdala", short: "Am",
    cx: 225, cy: 270,
    // Almond-shaped, medial temporal lobe
    path: "M 212 260 C 226 255, 242 262, 240 275 C 236 286, 218 290, 208 282 C 203 273, 206 262, 212 260 Z",
    conditions: ["gad","ptsd","bipolar","mdd","autism","bed"],
    fn: "Fear, threat detection, emotion",
    group: "limbic"
  },
  "hippocampus": {
    label: "Hippocampus", short: "Hp",
    cx: 285, cy: 275,
    // Seahorse curl, medial temporal
    path: "M 260 262 C 280 256, 305 262, 315 278 C 318 292, 305 300, 290 298 C 275 294, 262 285, 258 275 C 255 268, 256 263, 260 262 Z",
    conditions: ["mdd","alzheimers","ptsd","bipolar"],
    fn: "Memory formation, stress response",
    group: "limbic"
  },
  "brainstem": {
    label: "Brainstem / VTA", short: "BS",
    cx: 330, cy: 330,
    // Part of the actual brainstem anatomy now — midbrain through medulla
    path: "M 312 300 C 325 295, 345 302, 348 320 C 350 340, 345 360, 335 378 C 325 390, 315 390, 308 380 C 300 360, 302 335, 306 315 C 308 308, 310 302, 312 300 Z",
    conditions: ["mdd","td","autism","alzheimers","ptsd","bipolar","schizophrenia","gad","bed","pediatric"],
    fn: "Monoamine origins (DA / NE / 5-HT)",
    group: "subcortical"
  },
  "cerebellum": {
    label: "Cerebellum", short: "Cb",
    cx: 410, cy: 310,
    path: "M 370 280 C 390 275, 425 280, 450 298 C 462 315, 458 340, 440 350 C 415 356, 385 348, 370 330 C 362 315, 362 295, 370 280 Z",
    conditions: ["autism","td","pediatric"],
    fn: "Coordination, cognition, affect",
    group: "subcortical"
  },
};

/* ==========================================================
   BRAIN DIAGRAM — anatomical lateral view, medical-illustration style
   ========================================================== */

/* ==========================================================
   BRAIN DIAGRAM — photoreal reference w/ interactive hotspot overlay
   ========================================================== */
function BrainDiagram({ activeConditions = [], onRegionClick, highlightedRegion }) {
  const [hover, setHover] = useState(null);
  const [view, setView] = useState("sagittal"); // sagittal | top
  const active = hover || highlightedRegion;
  const activeRegion = active ? BRAIN_REGIONS[active] : null;

  // Normalized hotspot coords on each reference image (x,y in 0-1, r = hotspot radius in 0-1)
  // Labels carry a leader line to an outer rail point (lx, ly also 0-1, side=left|right|top|bottom)
  const HOTSPOTS = {
    sagittal: {
      // image: assets/brain-sagittal.png (1344x896). Anterior=LEFT.
      prefrontal:  { x: 0.255, y: 0.32, r: 0.055, lx: 0.08, ly: 0.22, side: "left",  short: "PFC" },
      cingulate:   { x: 0.450, y: 0.34, r: 0.042, lx: 0.22, ly: -0.02, side: "top",   short: "ACC" },
      motor:       { x: 0.435, y: 0.17, r: 0.035, lx: 0.38, ly: -0.02, side: "top",   short: "M1"  },
      sensory:     { x: 0.505, y: 0.17, r: 0.035, lx: 0.54, ly: -0.02, side: "top",   short: "S1"  },
      parietal:    { x: 0.600, y: 0.22, r: 0.050, lx: 0.70, ly: -0.02, side: "top",   short: "PPC" },
      occipital:   { x: 0.790, y: 0.35, r: 0.055, lx: 0.98, ly: 0.22, side: "right", short: "V1"  },
      temporal:    { x: 0.295, y: 0.64, r: 0.060, lx: 0.06, ly: 0.78, side: "left",  short: "T"   },
      striatum:    { x: 0.385, y: 0.49, r: 0.034, lx: 0.02, ly: 0.50, side: "left",  short: "STR" },
      thalamus:    { x: 0.485, y: 0.50, r: 0.038, lx: 0.98, ly: 0.46, side: "right", short: "Th"  },
      amygdala:    { x: 0.370, y: 0.62, r: 0.028, lx: 0.02, ly: 0.66, side: "left",  short: "Am"  },
      hippocampus: { x: 0.430, y: 0.63, r: 0.030, lx: 0.28, ly: 1.04, side: "bottom",short: "Hp"  },
      brainstem:   { x: 0.555, y: 0.82, r: 0.040, lx: 0.56, ly: 1.04, side: "bottom",short: "BS"  },
      cerebellum:  { x: 0.820, y: 0.68, r: 0.070, lx: 0.98, ly: 0.82, side: "right", short: "Cb"  },
    },
    top: {
      // image: assets/brain-top.png (1024x1024). Anterior=TOP.
      prefrontal:  { x: 0.500, y: 0.28, r: 0.060, lx: 0.50, ly: 0.05, side: "top",   short: "PFC" },
      motor:       { x: 0.420, y: 0.40, r: 0.035, lx: 0.08, ly: 0.35, side: "left",  short: "M1"  },
      sensory:     { x: 0.580, y: 0.42, r: 0.035, lx: 0.92, ly: 0.35, side: "right", short: "S1"  },
      parietal:    { x: 0.500, y: 0.50, r: 0.050, lx: 0.92, ly: 0.50, side: "right", short: "PPC" },
      occipital:   { x: 0.500, y: 0.78, r: 0.060, lx: 0.50, ly: 0.96, side: "bottom",short: "V1"  },
      temporal:    { x: 0.320, y: 0.62, r: 0.055, lx: 0.06, ly: 0.62, side: "left",  short: "T"   },
      cingulate:   { x: 0.500, y: 0.38, r: 0.040, lx: 0.08, ly: 0.18, side: "left",  short: "ACC" },
      // Deep structures midline
      striatum:    { x: 0.500, y: 0.50, r: 0.030, lx: 0.92, ly: 0.62, side: "right", short: "STR" },
      thalamus:    { x: 0.500, y: 0.55, r: 0.032, lx: 0.06, ly: 0.78, side: "left",  short: "Th"  },
      amygdala:    { x: 0.500, y: 0.62, r: 0.028, lx: 0.92, ly: 0.78, side: "right", short: "Am"  },
      hippocampus: { x: 0.460, y: 0.66, r: 0.028, lx: 0.08, ly: 0.88, side: "left",  short: "Hp"  },
      brainstem:   { x: 0.500, y: 0.70, r: 0.035, lx: 0.30, ly: 0.96, side: "bottom",short: "BS"  },
      cerebellum:  { x: 0.500, y: 0.88, r: 0.045, lx: 0.70, ly: 0.96, side: "bottom",short: "Cb"  },
    },
  };

  const img = view === "sagittal"
    ? { src: (window.BRAIN_IMG && window.BRAIN_IMG.sagittal) || "/assets/brain-sagittal.jpg", w: 1344, h: 896 }
    : { src: (window.BRAIN_IMG && window.BRAIN_IMG.top) || "/assets/brain-top.jpg",      w: 1024, h: 1024 };

  const hotspots = HOTSPOTS[view];
  const entries = Object.entries(BRAIN_REGIONS)
    .filter(([k]) => hotspots[k])
    .map(([k, r]) => ({ key: k, region: r, hs: hotspots[k] }));

  // Determine active-state for each region based on filter
  const isMatched = (region) =>
    activeConditions.length === 0 || region.conditions.some(c => activeConditions.includes(c));

  const VB_W = 1000, VB_H = view === "sagittal" ? 667 : 1000; // viewBox matches image aspect

  return (
    <div className="brain-diagram">
      {/* view toggle + annotation header */}
      <div className="brain-header">
        <div className="brain-header-left">
          <div className="mono brain-meta-kicker">FIG 1 · HUMAN CEREBRUM</div>
          <div className="brain-meta-title">
            {view === "sagittal" ? "Midsagittal Section · Structures & Tracts" : "Superior View · Bilateral Hemispheres"}
          </div>
        </div>
        <div className="brain-view-toggle mono">
          <button className={view === "sagittal" ? "active" : ""} onClick={() => setView("sagittal")}>SAGITTAL</button>
          <button className={view === "top" ? "active" : ""} onClick={() => setView("top")}>SUPERIOR</button>
        </div>
      </div>

      <div className="brain-stage-wrap">
        <div className="brain-stage" style={{ aspectRatio: `${img.w} / ${img.h}` }}>
          <img src={img.src} alt="Human brain reference" className="brain-base-img" draggable={false}/>
          <div className="brain-vignette"/>
        </div>

        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="brain-overlay-svg" preserveAspectRatio="none" style={{ aspectRatio: `${img.w} / ${img.h}` }}>
          <defs>
            <radialGradient id="hsCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%"  stopColor="rgba(255,230,200,0.95)"/>
              <stop offset="35%" stopColor="rgba(255,170,140,0.55)"/>
              <stop offset="75%" stopColor="rgba(236,72,153,0.18)"/>
              <stop offset="100%" stopColor="rgba(236,72,153,0)"/>
            </radialGradient>
            <radialGradient id="hsCoreActive" cx="50%" cy="50%" r="50%">
              <stop offset="0%"  stopColor="rgba(255,255,230,1)"/>
              <stop offset="25%" stopColor="rgba(255,210,140,0.95)"/>
              <stop offset="60%" stopColor="rgba(236,72,153,0.45)"/>
              <stop offset="100%" stopColor="rgba(236,72,153,0)"/>
            </radialGradient>
            <radialGradient id="hsDim" cx="50%" cy="50%" r="50%">
              <stop offset="0%"  stopColor="rgba(167,139,250,0.35)"/>
              <stop offset="70%" stopColor="rgba(167,139,250,0.05)"/>
              <stop offset="100%" stopColor="rgba(167,139,250,0)"/>
            </radialGradient>
            <filter id="hsGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="6"/>
            </filter>
          </defs>

          {/* Leader lines first (behind hotspots) */}
          {entries.map(({ key, region, hs }) => {
            const matched = isMatched(region);
            const isActive = hover === key || highlightedRegion === key;
            const cx = hs.x * VB_W, cy = hs.y * VB_H;
            const lx = hs.lx * VB_W, ly = hs.ly * VB_H;
            // elbow: go to the same axis as the label side first, then out
            let midX = cx, midY = cy;
            if (hs.side === "left"  || hs.side === "right") { midX = lx; midY = cy; }
            if (hs.side === "top"   || hs.side === "bottom") { midX = cx; midY = ly; }
            return (
              <g key={"leader-"+key} style={{ opacity: matched ? (isActive ? 1 : 0.55) : 0.18 }}>
                <polyline
                  points={`${cx},${cy} ${midX},${midY} ${lx},${ly}`}
                  fill="none"
                  stroke={isActive ? "var(--accent)" : "rgba(255,255,255,0.45)"}
                  strokeWidth={isActive ? 1.25 : 0.75}
                />
                <circle cx={lx} cy={ly} r={isActive ? 2.6 : 1.8} fill={isActive ? "var(--accent)" : "rgba(255,255,255,0.7)"}/>
              </g>
            );
          })}

          {/* Hotspot glows */}
          {entries.map(({ key, region, hs }) => {
            const matched = isMatched(region);
            const isActive = hover === key || highlightedRegion === key;
            const cx = hs.x * VB_W, cy = hs.y * VB_H;
            const rBase = hs.r * VB_W;
            const rGlow = rBase * (isActive ? 2.4 : 1.5);
            const grad = !matched ? "url(#hsDim)" : (isActive ? "url(#hsCoreActive)" : "url(#hsCore)");
            return (
              <g
                key={"hs-"+key}
                style={{ cursor: matched && onRegionClick ? "pointer" : "default", transition: "opacity 0.2s" }}
                onMouseEnter={() => matched && setHover(key)}
                onMouseLeave={() => setHover(null)}
                onClick={() => matched && onRegionClick && onRegionClick(key, region)}
              >
                {/* Outer pulse ring on active */}
                {isActive && matched && (
                  <circle cx={cx} cy={cy} r={rGlow * 1.1} fill="none" stroke="rgba(255,200,140,0.7)" strokeWidth="1.2">
                    <animate attributeName="r" from={rGlow * 0.9} to={rGlow * 1.6} dur="1.6s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" from="0.9" to="0" dur="1.6s" repeatCount="indefinite"/>
                  </circle>
                )}
                {/* Outer soft halo */}
                <circle cx={cx} cy={cy} r={rGlow} fill={grad} filter="url(#hsGlow)"/>
                {/* Inner hot core — only if matched */}
                {matched && (
                  <circle cx={cx} cy={cy} r={rBase * 0.55} fill={grad}/>
                )}
                {/* Bright core dot */}
                {matched && (
                  <circle cx={cx} cy={cy} r={isActive ? 3.2 : 2.2} fill={isActive ? "#fff4e0" : "rgba(255,240,220,0.85)"}/>
                )}
                {/* Click target (invisible) */}
                <circle cx={cx} cy={cy} r={Math.max(rBase * 1.2, 22)} fill="transparent"/>
              </g>
            );
          })}

          {/* Labels */}
          {entries.map(({ key, region, hs }) => {
            const matched = isMatched(region);
            const isActive = hover === key || highlightedRegion === key;
            const lx = hs.lx * VB_W, ly = hs.ly * VB_H;
            const anchor = hs.side === "right" ? "start" : hs.side === "left" ? "end" : "middle";
            const dx = hs.side === "right" ? 8 : hs.side === "left" ? -8 : 0;
            const dy = hs.side === "bottom" ? 14 : hs.side === "top" ? -6 : 4;
            return (
              <g key={"lbl-"+key} style={{ opacity: matched ? 1 : 0.3, pointerEvents: "none" }}>
                <text
                  x={lx + dx} y={ly + dy}
                  textAnchor={anchor}
                  className="brain-label-short"
                  fill={isActive ? "var(--accent)" : "rgba(255,255,255,0.75)"}
                >
                  {hs.short}
                </text>
                <text
                  x={lx + dx} y={ly + dy + 11}
                  textAnchor={anchor}
                  className="brain-label-full"
                  fill={isActive ? "rgba(255,240,220,0.95)" : "rgba(255,255,255,0.5)"}
                >
                  {region.label.split(" (")[0]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      {/* /brain-stage-wrap */}

      {/* Info panel */}
      <div className={"brain-info" + (activeRegion ? " visible" : "")}>
        {activeRegion ? (
          <>
            <div className="brain-info-head">
              <span className="brain-info-kicker mono">{activeRegion.short} · {(activeRegion.group || "").toUpperCase()}</span>
              <span className="brain-info-title">{activeRegion.label}</span>
            </div>
            <div className="brain-info-fn">{activeRegion.fn}</div>
            <div className="brain-info-conditions mono">
              ASSOCIATED · {activeRegion.conditions.length} CONDITION{activeRegion.conditions.length !== 1 ? "S" : ""}
            </div>
          </>
        ) : (
          <div className="brain-info-hint muted">
            <span className="mono">HOVER</span> a region to inspect · <span className="mono">CLICK</span> for studies
          </div>
        )}
      </div>
    </div>
  );
}

// legacy helper kept for any other callers
function getBboxFromPath(d) {
  const nums = d.match(/-?\d+(\.\d+)?/g)?.map(Number) || [];
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (let i = 0; i < nums.length; i += 2) {
    minX = Math.min(minX, nums[i]);
    maxX = Math.max(maxX, nums[i]);
    minY = Math.min(minY, nums[i+1] || 0);
    maxY = Math.max(maxY, nums[i+1] || 0);
  }
  return { cx: (minX + maxX)/2, cy: (minY + maxY)/2, w: maxX - minX, h: maxY - minY };
}

/* ==========================================================
   NEURON / SYNAPSE ILLUSTRATION
   ========================================================== */
function SynapseIllustration({ highlight = "serotonin", height = 180 }) {
  // simplified presynaptic -> cleft -> postsynaptic
  const colors = {
    serotonin: "var(--accent)",
    dopamine: "var(--accent-3)",
    gaba: "var(--accent-2)",
    glutamate: "#fbbf24",
  };
  const c = colors[highlight] || "var(--accent)";
  return (
    <svg viewBox="0 0 400 180" style={{ width: "100%", height }} className="neuro">
      <defs>
        <radialGradient id="neuron1">
          <stop offset="0%" stopColor={c} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={c} stopOpacity="0"/>
        </radialGradient>
      </defs>
      {/* presynaptic */}
      <circle cx="90" cy="90" r="45" fill="url(#neuron1)" />
      <circle cx="90" cy="90" r="30" fill="rgba(255,255,255,0.03)" stroke={c} strokeWidth="1"/>
      {/* axon */}
      <path d="M 120 90 L 170 90" stroke={c} strokeWidth="2"/>
      {/* terminal */}
      <ellipse cx="185" cy="90" rx="22" ry="18" fill="rgba(255,255,255,0.03)" stroke={c} strokeWidth="1.2"/>
      {/* vesicles */}
      {[0,1,2,3,4].map(i => (
        <circle key={i} cx={175 + (i%3)*6} cy={85 + Math.floor(i/3)*8} r="2" fill={c}>
          <animate attributeName="opacity" values="0.3;1;0.3" dur={`${2+i*0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* cleft + neurotransmitters */}
      {[0,1,2,3].map(i => (
        <circle key={i} cx={215 + i*8} cy={88 + (i%2)*6} r="2.2" fill={c}>
          <animate attributeName="cx" from={215 + i*8} to={255 + i*2} dur={`${1.8+i*0.2}s`} repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0" dur={`${1.8+i*0.2}s`} repeatCount="indefinite"/>
        </circle>
      ))}
      {/* postsynaptic */}
      <path d="M 270 65 L 270 115" stroke={c} strokeWidth="2"/>
      {/* receptors */}
      {[70, 90, 110].map((y,i) => (
        <g key={i}>
          <rect x="266" y={y-4} width="8" height="8" rx="2" fill="rgba(255,255,255,0.02)" stroke={c} strokeWidth="1"/>
          <path d={`M 270 ${y-3} L 270 ${y+3}`} stroke={c} strokeWidth="0.6"/>
        </g>
      ))}
      {/* dendrite */}
      <circle cx="340" cy="90" r="40" fill="url(#neuron1)"/>
      <circle cx="340" cy="90" r="28" fill="rgba(255,255,255,0.03)" stroke={c} strokeWidth="1"/>
      {/* labels */}
      <text x="90" y="160" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--ink-3)" letterSpacing="0.15em">PRE</text>
      <text x="240" y="160" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--ink-3)" letterSpacing="0.15em">SYNAPSE</text>
      <text x="340" y="160" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--ink-3)" letterSpacing="0.15em">POST</text>
    </svg>
  );
}

/* ==========================================================
   RECEPTOR BINDING DIAGRAM
   ========================================================== */
function ReceptorDiagram({ mechanism = "agonist", target = "5-HT2A", color = "var(--accent)" }) {
  return (
    <svg viewBox="0 0 300 160" style={{ width: "100%", height: 160 }} className="neuro">
      <defs>
        <radialGradient id="recGlow">
          <stop offset="0%" stopColor={color} stopOpacity="0.5"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </radialGradient>
      </defs>
      {/* membrane */}
      <rect x="0" y="95" width="300" height="2" fill="var(--accent-3)" opacity="0.3"/>
      <rect x="0" y="105" width="300" height="2" fill="var(--accent-3)" opacity="0.3"/>
      {[...Array(15)].map((_,i) => (
        <circle key={i} cx={10 + i*20} cy="100" r="3" fill="rgba(167, 139, 250, 0.15)"/>
      ))}
      {/* receptor */}
      <circle cx="150" cy="100" r="40" fill="url(#recGlow)"/>
      <path d="M 130 100 L 135 75 L 155 72 L 170 75 L 175 100 Z" fill="rgba(255,255,255,0.04)" stroke={color} strokeWidth="1.5"/>
      <path d="M 140 72 L 165 72" stroke={color} strokeWidth="1" strokeDasharray="2 2"/>
      {/* ligand */}
      <g>
        <circle cx="152" cy="55" r="8" fill={color} opacity="0.9">
          <animate attributeName="cy" values="30;55;55;30" keyTimes="0;0.4;0.7;1" dur="4s" repeatCount="indefinite"/>
        </circle>
        <path d="M 147 52 L 157 58 M 147 58 L 157 52" stroke="#000" strokeWidth="1">
          <animate attributeName="transform" values="translate(0,-25);translate(0,0);translate(0,0);translate(0,-25)" keyTimes="0;0.4;0.7;1" dur="4s" repeatCount="indefinite"/>
        </path>
      </g>
      {/* signal */}
      <g opacity="0.8">
        <circle cx="150" cy="130" r="2" fill={color}>
          <animate attributeName="cy" values="110;150" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="145" cy="135" r="2" fill={color}>
          <animate attributeName="cy" values="110;150" dur="2.3s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0" dur="2.3s" repeatCount="indefinite"/>
        </circle>
        <circle cx="155" cy="135" r="2" fill={color}>
          <animate attributeName="cy" values="110;150" dur="1.8s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0" dur="1.8s" repeatCount="indefinite"/>
        </circle>
      </g>
      {/* labels */}
      <text x="150" y="20" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--ink-1)" letterSpacing="0.15em">LIGAND</text>
      <text x="150" y="160" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--ink-3)" letterSpacing="0.15em">INTRACELLULAR SIGNAL</text>
      <text x="20" y="94" fontFamily="var(--font-mono)" fontSize="9" fill="var(--ink-3)" letterSpacing="0.1em">MEMBRANE</text>
      <text x="220" y="75" fontFamily="var(--font-mono)" fontSize="10" fill={color} letterSpacing="0.1em">{target}</text>
      <text x="220" y="88" fontFamily="var(--font-mono)" fontSize="9" fill="var(--ink-2)" letterSpacing="0.1em" textTransform="uppercase">{mechanism}</text>
    </svg>
  );
}

/* ==========================================================
   fMRI heatmap (blob)
   ========================================================== */
function FMRIBlob({ intensity = 0.8, color = "var(--accent)" }) {
  return (
    <svg viewBox="0 0 200 140" style={{ width: "100%", height: "100%" }} className="neuro">
      <defs>
        <radialGradient id="hot" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity={intensity}/>
          <stop offset="20%" stopColor="#fbbf24" stopOpacity={intensity * 0.9}/>
          <stop offset="45%" stopColor={color} stopOpacity={intensity * 0.7}/>
          <stop offset="80%" stopColor="var(--accent-3)" stopOpacity={intensity * 0.3}/>
          <stop offset="100%" stopColor="var(--accent-3)" stopOpacity="0"/>
        </radialGradient>
      </defs>
      {/* brain slice outline */}
      <ellipse cx="100" cy="70" rx="85" ry="55" fill="rgba(255,255,255,0.02)" stroke="rgba(167, 139, 250, 0.3)" strokeWidth="0.8"/>
      <path d="M 100 15 L 100 125" stroke="rgba(167, 139, 250, 0.15)" strokeWidth="0.5" strokeDasharray="2 3"/>
      {/* hotspots */}
      <ellipse cx="70" cy="60" rx="30" ry="22" fill="url(#hot)"/>
      <ellipse cx="135" cy="85" rx="22" ry="16" fill="url(#hot)" opacity="0.7"/>
      <ellipse cx="105" cy="45" rx="14" ry="10" fill="url(#hot)" opacity="0.9"/>
    </svg>
  );
}

/* ==========================================================
   FLOATING PARTICLES (subtle)
   ========================================================== */
function FloatParticles({ count = 20 }) {
  const particles = useMemo(() => (
    [...Array(count)].map((_,i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      delay: Math.random() * 8,
      dur: 15 + Math.random() * 20,
      color: ["var(--accent)", "var(--accent-2)", "var(--accent-3)"][i % 3],
    }))
  ), [count]);
  return (
    <div className="neuro" style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute",
          left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size,
          borderRadius: "50%",
          background: p.color,
          boxShadow: `0 0 ${p.size*3}px ${p.color}`,
          animation: `float ${p.dur}s ease-in-out ${p.delay}s infinite`,
          opacity: 0.6,
        }}/>
      ))}
      <style>{`@keyframes float { 0%,100%{transform:translate(0,0)} 50%{transform:translate(30px,-40px)} }`}</style>
    </div>
  );
}

/* expose */
Object.assign(window, {
  NeuralNetBg,
  EEGWave,
  BrainDiagram,
  SynapseIllustration,
  ReceptorDiagram,
  FMRIBlob,
  FloatParticles,
  BRAIN_REGIONS,
});
