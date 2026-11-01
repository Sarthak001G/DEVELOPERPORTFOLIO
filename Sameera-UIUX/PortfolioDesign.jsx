import { useState } from "react";
import "./PortfolioDesign.css";

const themes = [
  { id: "midnight", name: "Midnight", note: "Bold · Dark" },
  { id: "paper", name: "Paper", note: "Minimal · Light" },
  { id: "violet", name: "Violet", note: "Creative · Modern" },
];

export default function PortfolioDesign() {
  const [theme, setTheme] = useState("midnight");
  const [name, setName] = useState("Alex Morgan");
  const [role, setRole] = useState("Frontend Developer");
  const [about, setAbout] = useState("I build accessible, thoughtful digital experiences.");
  const [project, setProject] = useState("A portfolio that tells a story");

  return (
    <main className="pd-shell">
      <header className="pd-topbar">
        <div className="pd-brand"><span className="pd-mark">✳</span> folio<span className="pd-muted">/studio</span></div>
        <span className="pd-status">DESIGN CONCEPT</span>
      </header>

      <section className="pd-heading">
        <div>
          <p className="pd-eyebrow">PORTFOLIO BUILDER · UI/UX CONCEPT</p>
          <h1>Make your work<br /><em>tell your story.</em></h1>
          <p className="pd-intro">Shape a clear, personal portfolio with a visual style that feels like you.</p>
        </div>
        <div className="pd-step"><span>01</span><span>Profile</span><i>—</i><span>02</span><span>Style</span><i>—</i><span>03</span><span>Preview</span></div>
      </section>

      <section className="pd-workspace">
        <aside className="pd-panel">
          <div className="pd-panel-title"><div><p className="pd-eyebrow">YOUR CONTENT</p><h2>Profile details</h2></div><span className="pd-number">01</span></div>
          <label>Name<input value={name} onChange={e => setName(e.target.value)} /></label>
          <label>Role<input value={role} onChange={e => setRole(e.target.value)} /></label>
          <label>Short introduction<textarea rows="3" value={about} onChange={e => setAbout(e.target.value)} /></label>
          <label>Featured project<input value={project} onChange={e => setProject(e.target.value)} /></label>
          <div className="pd-divider" />
          <div className="pd-panel-title"><div><p className="pd-eyebrow">VISUAL DIRECTION</p><h2>Choose a theme</h2></div><span className="pd-number">02</span></div>
          <div className="pd-themes">
            {themes.map(item => <button key={item.id} className={`pd-theme ${theme === item.id ? "is-selected" : ""}`} onClick={() => setTheme(item.id)} aria-pressed={theme === item.id}>
              <span className={`pd-swatch pd-swatch-${item.id}`}><b>Ag</b></span><span><strong>{item.name}</strong><small>{item.note}</small></span><span className="pd-radio">{theme === item.id ? "✓" : ""}</span>
            </button>)}
          </div>
          <p className="pd-hint">Your edits update the preview instantly.</p>
        </aside>

        <section className={`pd-preview pd-preview-${theme}`} aria-label="Live portfolio preview">
          <div className="pd-previewbar"><span><b className="pd-live-dot" /> LIVE PREVIEW</span><span>PORTFOLIO / 2026</span></div>
          <div className="pd-preview-content">
            <div className="pd-preview-nav"><span className="pd-preview-logo">{name.trim().split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase() || "AM"}</span><span>ABOUT&nbsp;&nbsp;&nbsp; WORK&nbsp;&nbsp;&nbsp; CONTACT</span></div>
            <p className="pd-preview-kicker">HELLO, I'M</p>
            <h2>{name || "Your name"}<span>.</span></h2>
            <p className="pd-preview-role">{role || "Your role"}</p>
            <p className="pd-preview-about">{about || "A short introduction about you."}</p>
            <button className="pd-cta">Explore my work <span>↗</span></button>
            <div className="pd-project">
              <div><p className="pd-preview-kicker">FEATURED PROJECT · 01</p><h3>{project || "Your featured project"}</h3><p>Problem-led thinking. Intentional design. Meaningful outcomes.</p></div>
              <div className="pd-project-art"><span>✳</span><small>CASE<br/>STUDY</small></div>
            </div>
            <div className="pd-preview-foot"><span>DESIGNED WITH INTENTION</span><span>SCROLL TO EXPLORE ↓</span></div>
          </div>
        </section>
      </section>
      <footer className="pd-footer">A UI/UX exploration for the Developer Portfolio & Case-Study Builder <span>·</span> Sameera Khan</footer>
    </main>
  );
}
