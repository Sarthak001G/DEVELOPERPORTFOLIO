/**
 * template-neon.js — Neon/Cyberpunk Template
 * Dark background with vivid neon green/cyan accents
 */
window.TemplateNeon = {
  name: 'Neon',
  id: 'neon',
  description: 'Cyberpunk neon — bold, edgy, and unforgettable',

  render(profile, projects, config = {}) {
    const primary   = config.primaryColor   || '#00ff88';
    const secondary = config.secondaryColor || '#00d4ff';
    const font      = config.fontFamily     || 'Inter';
    const show      = config.showSections   || {};

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${esc(profile.name || 'Portfolio')} :: DEV</title>
  <meta name="description" content="${esc(profile.bio?.slice(0,160) || 'Developer Portfolio')}"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --neon: ${primary};
      --neon2: ${secondary};
      --font: '${font}', 'Courier New', monospace;
    }
    html { scroll-behavior: smooth; }
    body {
      font-family: var(--font);
      background: #020817;
      color: #e2e8f0;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      cursor: default;
    }
    a { color: var(--neon); text-decoration: none; }
    a:hover { color: var(--neon2); }
    ul { list-style: none; }
    img { display: block; max-width: 100%; }

    /* Scanline overlay */
    body::before {
      content: '';
      position: fixed; inset: 0;
      background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.015) 2px, rgba(0,255,136,0.015) 4px);
      pointer-events: none; z-index: 9999;
    }

    /* ── Nav ── */
    nav {
      position: fixed; top: 0; left: 0; right: 0;
      z-index: 100;
      background: rgba(2,8,23,0.9);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(0,255,136,0.15);
      padding: 0 2rem;
    }
    .nav-inner {
      max-width: 1200px; margin: 0 auto;
      display: flex; align-items: center; justify-content: space-between;
      height: 60px;
    }
    .nav-logo {
      font-weight: 900; font-size: 1.125rem;
      color: var(--neon);
      text-shadow: 0 0 20px rgba(0,255,136,0.6);
      letter-spacing: 0.05em;
    }
    .nav-logo::before { content: '> '; color: var(--neon2); }
    .nav-links { display: flex; gap: 1.5rem; }
    .nav-links a { font-size: 0.8125rem; font-weight: 500; color: #64748b; letter-spacing: 0.05em; transition: color 200ms, text-shadow 200ms; text-transform: uppercase; }
    .nav-links a:hover { color: var(--neon); text-shadow: 0 0 10px rgba(0,255,136,0.5); }

    /* ── Hero ── */
    .hero {
      min-height: 100vh;
      display: flex; align-items: center;
      padding: 80px 2rem 4rem;
      max-width: 1200px; margin: 0 auto;
      position: relative;
    }
    .hero-content { position: relative; z-index: 1; max-width: 700px; }
    .hero-prompt { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--neon2); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }
    .hero-prompt::before { content: '//'; color: #334155; }
    .hero-name {
      font-size: clamp(3rem, 8vw, 5.5rem);
      font-weight: 900;
      line-height: 1;
      color: #f1f5f9;
      text-shadow: 0 0 40px rgba(0,255,136,0.1);
      margin-bottom: 0.5rem;
      letter-spacing: -0.02em;
    }
    .hero-name span { color: var(--neon); text-shadow: 0 0 40px rgba(0,255,136,0.5); }
    .hero-role {
      font-size: clamp(1rem, 2.5vw, 1.5rem);
      color: #64748b;
      margin-bottom: 1.5rem;
      font-weight: 400;
    }
    .hero-role strong { color: var(--neon2); font-weight: 600; }
    .hero-bio { font-size: 1rem; color: #475569; line-height: 1.8; max-width: 560px; margin-bottom: 2rem; }
    .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem; }
    .btn-neon {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 12px 28px; border-radius: 4px;
      background: transparent;
      border: 1px solid var(--neon);
      color: var(--neon);
      font-size: 0.875rem; font-weight: 600;
      letter-spacing: 0.05em; text-transform: uppercase;
      transition: background 200ms, box-shadow 200ms;
      box-shadow: 0 0 10px rgba(0,255,136,0.2), inset 0 0 10px rgba(0,255,136,0.05);
    }
    .btn-neon:hover { background: rgba(0,255,136,0.1); box-shadow: 0 0 20px rgba(0,255,136,0.4), inset 0 0 20px rgba(0,255,136,0.1); color: var(--neon); }
    .btn-neon2 {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 12px 28px; border-radius: 4px;
      background: transparent;
      border: 1px solid #1e293b;
      color: #64748b;
      font-size: 0.875rem; font-weight: 500;
      letter-spacing: 0.05em;
      transition: border-color 200ms, color 200ms;
    }
    .btn-neon2:hover { border-color: #334155; color: #94a3b8; }

    .hero-stats { display: flex; gap: 2rem; }
    .hero-stat-val { font-size: 1.75rem; font-weight: 900; color: var(--neon); text-shadow: 0 0 20px rgba(0,255,136,0.5); display: block; line-height: 1; }
    .hero-stat-lbl { font-size: 0.6875rem; color: #334155; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px; }

    /* ── Section ── */
    .neon-section { padding: 5rem 2rem; max-width: 1200px; margin: 0 auto; }
    .neon-section-border { border-top: 1px solid rgba(0,255,136,0.08); }
    .sec-tag { font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--neon); margin-bottom: 0.5rem; }
    .sec-tag::before { content: '[ '; } .sec-tag::after { content: ' ]'; }
    .sec-h2 { font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 900; color: #f1f5f9; margin-bottom: 0.75rem; letter-spacing: -0.02em; }
    .sec-desc { font-size: 0.9375rem; color: #475569; line-height: 1.7; margin-bottom: 3rem; max-width: 540px; }

    /* ── Skills ── */
    .skills-neon { display: flex; flex-wrap: wrap; gap: 0.625rem; }
    .skill-neon {
      padding: 6px 16px; border-radius: 2px;
      border: 1px solid rgba(0,255,136,0.2);
      background: rgba(0,255,136,0.04);
      color: #94a3b8; font-size: 0.8125rem; font-weight: 500;
      letter-spacing: 0.03em;
      transition: border-color 150ms, color 150ms, box-shadow 150ms;
    }
    .skill-neon:hover { border-color: var(--neon); color: var(--neon); box-shadow: 0 0 10px rgba(0,255,136,0.2); }

    /* ── Projects ── */
    .proj-neon-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 1.5rem; }
    .proj-neon-card {
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(0,255,136,0.1);
      border-radius: 8px;
      overflow: hidden;
      transition: border-color 300ms, box-shadow 300ms, transform 300ms;
      display: flex; flex-direction: column;
      position: relative;
    }
    .proj-neon-card:hover {
      border-color: rgba(0,255,136,0.35);
      box-shadow: 0 0 30px rgba(0,255,136,0.1), 0 20px 40px rgba(0,0,0,0.4);
      transform: translateY(-4px);
    }
    .proj-neon-card::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, var(--neon), var(--neon2));
      opacity: 0; transition: opacity 300ms;
    }
    .proj-neon-card:hover::before { opacity: 1; }

    .proj-neon-thumb { height: 180px; overflow: hidden; background: #0a0f1e; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: rgba(0,255,136,0.15); }
    .proj-neon-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .proj-neon-body { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; }
    .proj-neon-num { font-size: 0.6875rem; color: var(--neon); font-weight: 700; letter-spacing: 0.1em; margin-bottom: 0.5rem; }
    .proj-neon-title { font-size: 1.125rem; font-weight: 800; color: #f1f5f9; margin-bottom: 0.5rem; }
    .proj-neon-tagline { font-size: 0.875rem; color: #475569; line-height: 1.6; margin-bottom: 1rem; flex: 1; }
    .proj-neon-tech { display: flex; flex-wrap: wrap; gap: 0.375rem; margin-bottom: 1.25rem; }
    .neon-tech-badge { padding: 3px 10px; border-radius: 2px; border: 1px solid rgba(0,212,255,0.2); background: rgba(0,212,255,0.05); color: #64748b; font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; }

    .proj-neon-case { border-top: 1px solid rgba(0,255,136,0.06); padding-top: 1rem; margin-bottom: 1rem; }
    .neon-case-h4 { font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--neon2); margin-bottom: 0.375rem; }
    .neon-case-p  { font-size: 0.8125rem; color: #475569; line-height: 1.6; }
    .neon-feat-li { font-size: 0.8125rem; color: #475569; padding: 1px 0; }
    .neon-feat-li::before { content: '>> '; color: var(--neon); }

    .proj-neon-links { display: flex; gap: 0.75rem; }
    .neon-link-primary { padding: 8px 18px; border: 1px solid var(--neon); color: var(--neon); font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; border-radius: 3px; transition: background 150ms, box-shadow 150ms; }
    .neon-link-primary:hover { background: rgba(0,255,136,0.1); box-shadow: 0 0 10px rgba(0,255,136,0.3); color: var(--neon); }
    .neon-link-ghost { padding: 8px 18px; border: 1px solid #1e293b; color: #475569; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.05em; border-radius: 3px; transition: border-color 150ms; }
    .neon-link-ghost:hover { border-color: #334155; color: #64748b; }

    /* ── Education ── */
    .edu-neon { display: flex; flex-direction: column; gap: 1rem; }
    .edu-neon-item { border: 1px solid rgba(0,255,136,0.08); border-radius: 6px; padding: 1.25rem 1.5rem; display: flex; align-items: center; gap: 1.25rem; transition: border-color 200ms; }
    .edu-neon-item:hover { border-color: rgba(0,255,136,0.2); }
    .edu-neon-num { font-size: 1.5rem; font-weight: 900; color: rgba(0,255,136,0.2); font-family: monospace; min-width: 40px; }
    .edu-neon-school { font-weight: 700; color: #e2e8f0; font-size: 1rem; }
    .edu-neon-degree { font-size: 0.875rem; color: #475569; margin-top: 0.25rem; }
    .edu-neon-year   { font-size: 0.75rem; color: #334155; margin-top: 0.25rem; }

    /* ── Contact ── */
    .contact-neon { border: 1px solid rgba(0,255,136,0.15); border-radius: 12px; padding: 4rem 2rem; text-align: center; background: rgba(0,255,136,0.02); position: relative; overflow: hidden; }
    .contact-neon::before { content: ''; position: absolute; top: -50%; left: 50%; transform: translateX(-50%); width: 400px; height: 400px; background: radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 60%); pointer-events: none; }
    .contact-neon-email { display: inline-flex; align-items: center; gap: 8px; margin-top: 2rem; padding: 14px 32px; border: 1px solid var(--neon); color: var(--neon); font-weight: 700; font-size: 1rem; letter-spacing: 0.05em; border-radius: 4px; transition: background 200ms, box-shadow 200ms; }
    .contact-neon-email:hover { background: rgba(0,255,136,0.1); box-shadow: 0 0 20px rgba(0,255,136,0.3); color: var(--neon); }
    .neon-social-links { display: flex; justify-content: center; gap: 1rem; margin-top: 1.25rem; flex-wrap: wrap; }
    .neon-soc-link { font-size: 0.8125rem; color: #334155; letter-spacing: 0.05em; transition: color 150ms; }
    .neon-soc-link:hover { color: var(--neon); }

    /* ── Footer ── */
    footer { text-align: center; padding: 2rem; font-size: 0.75rem; color: #1e293b; border-top: 1px solid rgba(0,255,136,0.05); font-family: monospace; letter-spacing: 0.05em; }
    footer span { color: var(--neon); }

    @media (max-width: 768px) {
      .hero-name { font-size: 2.5rem; }
      .proj-neon-grid { grid-template-columns: 1fr; }
      .nav-links { display: none; }
      .hero-stats { gap: 1.5rem; }
    }
  </style>
</head>
<body>

<nav>
  <div class="nav-inner">
    <div class="nav-logo">${esc(profile.name?.split(' ')[0] || 'DEV')}</div>
    <div class="nav-links">
      ${show.skills !== false   ? '<a href="#skills">Skills</a>'     : ''}
      ${show.projects !== false ? '<a href="#projects">Projects</a>' : ''}
      ${show.education !== false ? '<a href="#education">Education</a>' : ''}
      ${show.contact !== false  ? '<a href="#contact">Contact</a>'   : ''}
    </div>
  </div>
</nav>

${show.hero !== false ? `
<section class="neon-section" id="about" style="padding-top:6rem">
  <div class="hero-content">
    <div class="hero-prompt">Developer & Builder</div>
    <h1 class="hero-name"><span>${esc(profile.name?.split(' ')[0] || 'Your')}</span> ${esc(profile.name?.split(' ').slice(1).join(' ') || 'Name')}</h1>
    <div class="hero-role"><strong>${esc(profile.title || 'Developer')}</strong>${profile.location ? ` — ${esc(profile.location)}` : ''}</div>
    <p class="hero-bio">${esc(profile.bio || '')}</p>
    <div class="hero-actions">
      ${profile.social?.github ? `<a href="${esc(profile.social.github)}" class="btn-neon" target="_blank" rel="noopener">↗ View GitHub</a>` : ''}
      ${profile.email ? `<a href="mailto:${esc(profile.email)}" class="btn-neon2">✉ Contact</a>` : ''}
    </div>
    <div class="hero-stats">
      <div><span class="hero-stat-val">${projects.length}</span><div class="hero-stat-lbl">Projects</div></div>
      <div><span class="hero-stat-val">${profile.skills?.length || 0}</span><div class="hero-stat-lbl">Skills</div></div>
      ${profile.education?.length ? `<div><span class="hero-stat-val">${profile.education.length}</span><div class="hero-stat-lbl">Degrees</div></div>` : ''}
    </div>
  </div>
</section>` : ''}

${show.skills !== false && profile.skills?.length ? `
<div class="neon-section neon-section-border" id="skills">
  <div class="sec-tag">Expertise</div>
  <h2 class="sec-h2">Skills & Tools</h2>
  <p class="sec-desc">Technologies I command to build exceptional software.</p>
  <div class="skills-neon">
    ${profile.skills.map(s => `<span class="skill-neon">${esc(s)}</span>`).join('')}
  </div>
</div>` : ''}

${show.projects !== false && projects.length ? `
<div class="neon-section neon-section-border" id="projects">
  <div class="sec-tag">Case Studies</div>
  <h2 class="sec-h2">Projects</h2>
  <p class="sec-desc">Real problems, engineered solutions.</p>
  <div class="proj-neon-grid">
    ${projects.map((p, i) => `
    <div class="proj-neon-card">
      <div class="proj-neon-thumb">
        ${p.thumbnail ? `<img src="${esc(p.thumbnail)}" alt="${esc(p.title)}" />` : (p.title?.[0]?.toUpperCase() || '?')}
      </div>
      <div class="proj-neon-body">
        <div class="proj-neon-num">PROJECT_${String(i+1).padStart(2,'0')}${p.featured ? ' // FEATURED' : ''}</div>
        <h3 class="proj-neon-title">${esc(p.title || 'Untitled')}</h3>
        <p class="proj-neon-tagline">${esc(p.tagline || '')}</p>
        <div class="proj-neon-tech">
          ${(p.technologies || []).map(t => `<span class="neon-tech-badge">${esc(t)}</span>`).join('')}
        </div>
        ${p.problem || p.solution ? `
        <div class="proj-neon-case">
          ${p.problem  ? `<div class="neon-case-h4">Problem</div><p class="neon-case-p">${esc(p.problem.slice(0,200))}</p>` : ''}
          ${p.solution ? `<div class="neon-case-h4" style="margin-top:0.75rem">Solution</div><p class="neon-case-p">${esc(p.solution.slice(0,200))}</p>` : ''}
        </div>` : ''}
        ${p.features?.filter(Boolean).length ? `
        <div style="margin-bottom:1rem">
          <div class="neon-case-h4">Features</div>
          ${p.features.filter(Boolean).map(f => `<div class="neon-feat-li">${esc(f)}</div>`).join('')}
        </div>` : ''}
        <div class="proj-neon-links" style="margin-top:auto">
          ${p.liveUrl   ? `<a href="${esc(p.liveUrl)}"   class="neon-link-primary" target="_blank" rel="noopener">LIVE DEMO</a>` : ''}
          ${p.githubUrl ? `<a href="${esc(p.githubUrl)}" class="neon-link-ghost"   target="_blank" rel="noopener">GitHub</a>` : ''}
        </div>
      </div>
    </div>`).join('')}
  </div>
</div>` : ''}

${show.education !== false && profile.education?.length ? `
<div class="neon-section neon-section-border" id="education">
  <div class="sec-tag">Background</div>
  <h2 class="sec-h2">Education</h2>
  <div class="edu-neon">
    ${profile.education.map((e, i) => `
    <div class="edu-neon-item">
      <div class="edu-neon-num">0${i+1}</div>
      <div>
        <div class="edu-neon-school">${esc(e.school)}</div>
        <div class="edu-neon-degree">${esc(e.degree)}</div>
        <div class="edu-neon-year">${esc(e.year)}${e.gpa ? ' // GPA: '+esc(e.gpa) : ''}</div>
      </div>
    </div>`).join('')}
  </div>
</div>` : ''}

${show.contact !== false ? `
<div class="neon-section neon-section-border" id="contact">
  <div class="contact-neon">
    <div class="sec-tag">Contact</div>
    <h2 class="sec-h2">Init_Connection()</h2>
    <p style="color:#334155;font-size:0.9375rem;line-height:1.7;max-width:400px;margin:1rem auto 0">
      ${profile.bio ? esc(profile.bio.slice(0,160)) : 'Ready to collaborate on interesting challenges.'}
    </p>
    ${profile.email ? `<a href="mailto:${esc(profile.email)}" class="contact-neon-email" >✉ ${esc(profile.email)}</a>` : ''}
    <div class="neon-social-links">
      ${profile.social?.github   ? `<a href="${esc(profile.social.github)}"   class="neon-soc-link" target="_blank">GitHub ↗</a>` : ''}
      ${profile.social?.linkedin ? `<a href="${esc(profile.social.linkedin)}" class="neon-soc-link" target="_blank">LinkedIn ↗</a>` : ''}
      ${profile.social?.twitter  ? `<a href="${esc(profile.social.twitter)}"  class="neon-soc-link" target="_blank">Twitter ↗</a>` : ''}
    </div>
  </div>
</div>` : ''}

<footer>
  <span>${esc(profile.name || 'DEV')}</span> // ${new Date().getFullYear()} // Built with DevPortfolio Builder
</footer>

</body>
</html>`;
  },
};

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}
