/**
 * template-aurora.js — Aurora Template
 * Dark gradient portfolio with glassmorphism cards
 */
window.TemplateAurora = {
  name: 'Aurora',
  id: 'aurora',
  description: 'Dark gradient with glassmorphism — premium and bold',

  render(profile, projects, config = {}) {
    const primary   = config.primaryColor   || '#3b82f6';
    const secondary = config.secondaryColor || '#8b5cf6';
    const font      = config.fontFamily     || 'Inter';
    const show      = config.showSections   || {};

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${esc(profile.name || 'Portfolio')} — Developer Portfolio</title>
  <meta name="description" content="${esc(profile.bio?.slice(0,160) || 'Developer Portfolio')}"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --primary: ${primary};
      --secondary: ${secondary};
      --gradient: linear-gradient(135deg, ${primary} 0%, ${secondary} 100%);
      --font: '${font}', sans-serif;
    }
    html { scroll-behavior: smooth; }
    body {
      font-family: var(--font);
      background: #060d1f;
      color: #f1f5f9;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    a { color: var(--primary); text-decoration: none; }
    a:hover { color: var(--secondary); }
    img { display: block; max-width: 100%; }
    ul { list-style: none; }

    /* ── Nav ── */
    nav {
      position: fixed; top: 0; left: 0; right: 0;
      z-index: 100;
      background: rgba(6,13,31,0.85);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255,255,255,0.08);
      padding: 0 2rem;
    }
    .nav-inner {
      max-width: 1100px; margin: 0 auto;
      display: flex; align-items: center; justify-content: space-between;
      height: 64px;
    }
    .nav-logo {
      font-size: 1.125rem; font-weight: 800;
      background: var(--gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .nav-links { display: flex; gap: 2rem; }
    .nav-links a { font-size: 0.875rem; font-weight: 500; color: #94a3b8; transition: color 200ms; }
    .nav-links a:hover { color: #f1f5f9; }

    /* ── Hero ── */
    .hero {
      min-height: 100vh;
      display: flex; align-items: center;
      padding: 80px 2rem 4rem;
      position: relative;
      overflow: hidden;
    }
    .hero::before {
      content: '';
      position: absolute; top: -40%; left: -20%;
      width: 800px; height: 800px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%);
      pointer-events: none;
    }
    .hero::after {
      content: '';
      position: absolute; bottom: -40%; right: -20%;
      width: 700px; height: 700px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%);
      pointer-events: none;
    }
    .hero-inner {
      max-width: 1100px; margin: 0 auto; width: 100%;
      display: grid; grid-template-columns: 1fr auto;
      gap: 4rem; align-items: center; position: relative; z-index: 1;
    }
    .hero-eyebrow {
      display: inline-flex; align-items: center; gap: 8px;
      font-size: 0.75rem; font-weight: 600; letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--primary);
      background: rgba(59,130,246,0.12);
      border: 1px solid rgba(59,130,246,0.25);
      padding: 6px 16px; border-radius: 999px;
      margin-bottom: 1.5rem;
    }
    .hero-eyebrow::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--primary); }
    .hero-name {
      font-size: clamp(2.5rem, 6vw, 4rem);
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 1rem;
    }
    .hero-title {
      font-size: clamp(1.25rem, 3vw, 1.75rem);
      font-weight: 400;
      color: #94a3b8;
      margin-bottom: 1.5rem;
    }
    .hero-bio {
      font-size: 1.0625rem;
      color: #64748b;
      max-width: 560px;
      line-height: 1.8;
      margin-bottom: 2rem;
    }
    .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
    .btn-hero-primary {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 14px 28px; border-radius: 10px;
      background: var(--gradient);
      color: white; font-weight: 600; font-size: 0.9375rem;
      box-shadow: 0 8px 24px rgba(59,130,246,0.4);
      transition: box-shadow 200ms, transform 200ms;
    }
    .btn-hero-primary:hover { color: white; box-shadow: 0 12px 32px rgba(59,130,246,0.55); transform: translateY(-2px); }
    .btn-hero-secondary {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 14px 28px; border-radius: 10px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.12);
      color: #cbd5e1; font-weight: 500; font-size: 0.9375rem;
      transition: background 200ms, border-color 200ms;
    }
    .btn-hero-secondary:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); color: white; }

    .hero-social { display: flex; gap: 1rem; margin-top: 1.5rem; }
    .hero-social a {
      width: 40px; height: 40px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.1);
      display: flex; align-items: center; justify-content: center;
      color: #94a3b8; font-size: 0.875rem;
      transition: background 200ms, color 200ms, border-color 200ms;
    }
    .hero-social a:hover { background: var(--primary); border-color: var(--primary); color: white; }

    .hero-avatar-wrap {
      position: relative;
      flex-shrink: 0;
    }
    .hero-avatar {
      width: 240px; height: 240px;
      border-radius: 32px;
      border: 2px solid rgba(255,255,255,0.1);
      object-fit: cover;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    }
    .hero-avatar-placeholder {
      width: 240px; height: 240px;
      border-radius: 32px;
      background: var(--gradient);
      display: flex; align-items: center; justify-content: center;
      font-size: 5rem; font-weight: 800; color: white;
      box-shadow: 0 20px 60px rgba(59,130,246,0.3);
    }

    /* ── Sections ── */
    section { padding: 5rem 2rem; }
    .section-inner { max-width: 1100px; margin: 0 auto; }
    .section-label {
      font-size: 0.75rem; font-weight: 600; letter-spacing: 0.12em;
      text-transform: uppercase; color: var(--primary);
      margin-bottom: 0.75rem;
    }
    .section-title {
      font-size: clamp(1.75rem, 4vw, 2.5rem);
      font-weight: 800;
      margin-bottom: 1rem;
    }
    .section-subtitle { font-size: 1rem; color: #64748b; max-width: 540px; margin-bottom: 3rem; line-height: 1.7; }

    /* ── Skills ── */
    .skills-grid { display: flex; flex-wrap: wrap; gap: 0.75rem; }
    .skill-badge {
      padding: 8px 18px;
      border-radius: 999px;
      background: rgba(59,130,246,0.1);
      border: 1px solid rgba(59,130,246,0.2);
      color: #93c5fd;
      font-size: 0.875rem; font-weight: 500;
      transition: background 200ms, transform 200ms;
    }
    .skill-badge:hover { background: rgba(59,130,246,0.2); transform: translateY(-2px); }

    /* ── Projects ── */
    .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.5rem; }
    .project-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
      overflow: hidden;
      transition: transform 300ms, border-color 300ms, box-shadow 300ms;
      display: flex; flex-direction: column;
    }
    .project-card:hover {
      transform: translateY(-6px);
      border-color: rgba(59,130,246,0.3);
      box-shadow: 0 20px 60px rgba(59,130,246,0.15);
    }
    .project-thumb {
      height: 200px; overflow: hidden;
      background: linear-gradient(135deg, #1a2340, #0d1529);
      display: flex; align-items: center; justify-content: center;
      font-size: 3rem; font-weight: 800; color: rgba(255,255,255,0.2);
    }
    .project-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .project-body { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; }
    .project-featured-badge {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 0.6875rem; font-weight: 600;
      padding: 4px 10px; border-radius: 999px;
      background: rgba(245,158,11,0.15);
      color: #fbbf24; border: 1px solid rgba(245,158,11,0.2);
      margin-bottom: 0.75rem; width: fit-content;
    }
    .project-title { font-size: 1.1875rem; font-weight: 700; margin-bottom: 0.5rem; }
    .project-tagline { font-size: 0.875rem; color: #64748b; margin-bottom: 1rem; line-height: 1.6; flex: 1; }
    .project-tech { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem; }
    .tech-badge {
      padding: 4px 10px; border-radius: 6px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      font-size: 0.75rem; font-weight: 500; color: #94a3b8;
    }
    .project-links { display: flex; gap: 0.75rem; margin-top: auto; }
    .project-link {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 8px 16px; border-radius: 8px;
      font-size: 0.8125rem; font-weight: 600;
      transition: background 200ms;
    }
    .project-link.primary { background: var(--gradient); color: white; }
    .project-link.primary:hover { opacity: 0.9; color: white; }
    .project-link.ghost { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: #94a3b8; }
    .project-link.ghost:hover { background: rgba(255,255,255,0.1); color: #f1f5f9; }

    /* ── Case Study expanded ── */
    .case-study-section { margin-top: 1.25rem; padding-top: 1.25rem; border-top: 1px solid rgba(255,255,255,0.06); }
    .case-study-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
    .case-block { background: rgba(255,255,255,0.03); border-radius: 12px; padding: 1rem; }
    .case-block h4 { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--primary); margin-bottom: 0.5rem; }
    .case-block p  { font-size: 0.8125rem; color: #94a3b8; line-height: 1.7; }
    .feature-list  { list-style: none; display: flex; flex-direction: column; gap: 0.375rem; }
    .feature-list li { display: flex; align-items: flex-start; gap: 6px; font-size: 0.8125rem; color: #94a3b8; }
    .feature-list li::before { content: '→'; color: var(--primary); flex-shrink: 0; font-size: 0.75rem; margin-top: 2px; }

    /* ── Education ── */
    .edu-grid { display: flex; flex-direction: column; gap: 1rem; }
    .edu-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px; padding: 1.5rem;
      display: flex; align-items: flex-start; gap: 1.25rem;
    }
    .edu-icon {
      width: 44px; height: 44px; border-radius: 12px;
      background: var(--gradient);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.25rem; flex-shrink: 0;
    }
    .edu-school { font-weight: 700; font-size: 1rem; margin-bottom: 0.25rem; }
    .edu-degree { color: #94a3b8; font-size: 0.875rem; }
    .edu-year   { font-size: 0.75rem; color: #475569; margin-top: 0.25rem; }

    /* ── Contact ── */
    .contact-section { background: rgba(59,130,246,0.05); border-radius: 24px; padding: 4rem 2rem; text-align: center; }
    .contact-social { display: flex; justify-content: center; gap: 1rem; margin-top: 2rem; flex-wrap: wrap; }
    .contact-link {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 12px 24px; border-radius: 10px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      color: #94a3b8; font-size: 0.875rem; font-weight: 500;
      transition: all 200ms;
    }
    .contact-link:hover { background: var(--primary); border-color: var(--primary); color: white; }

    /* ── Footer ── */
    footer { text-align: center; padding: 2rem; font-size: 0.8125rem; color: #334155; border-top: 1px solid rgba(255,255,255,0.05); }

    /* ── Responsive ── */
    @media (max-width: 768px) {
      .hero-inner { grid-template-columns: 1fr; text-align: center; }
      .hero-avatar-wrap { display: none; }
      .hero-actions { justify-content: center; }
      .hero-social { justify-content: center; }
      .nav-links { display: none; }
      .projects-grid { grid-template-columns: 1fr; }
      .case-study-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

<!-- Nav -->
<nav>
  <div class="nav-inner">
    <div class="nav-logo">${esc(profile.name || 'Portfolio')}</div>
    <div class="nav-links">
      ${show.about !== false    ? '<a href="#about">About</a>'       : ''}
      ${show.skills !== false   ? '<a href="#skills">Skills</a>'     : ''}
      ${show.projects !== false ? '<a href="#projects">Projects</a>' : ''}
      ${show.education !== false ? '<a href="#education">Education</a>' : ''}
      ${show.contact !== false  ? '<a href="#contact">Contact</a>'   : ''}
    </div>
  </div>
</nav>

<!-- Hero -->
${show.hero !== false ? `
<section class="hero" id="about">
  <div class="hero-inner">
    <div class="hero-content">
      <div class="hero-eyebrow">Available for Work</div>
      <h1 class="hero-name">${esc(profile.name || 'Your Name')}</h1>
      <div class="hero-title">${esc(profile.title || 'Developer')}</div>
      <p class="hero-bio">${esc(profile.bio || '')}</p>
      <div class="hero-actions">
        ${profile.social?.github ? `<a href="${esc(profile.social.github)}" class="btn-hero-primary" target="_blank" rel="noopener">View GitHub →</a>` : ''}
        ${profile.email ? `<a href="mailto:${esc(profile.email)}" class="btn-hero-secondary">Get in Touch</a>` : ''}
      </div>
      <div class="hero-social">
        ${profile.social?.github   ? `<a href="${esc(profile.social.github)}"   target="_blank" rel="noopener" title="GitHub">GH</a>` : ''}
        ${profile.social?.linkedin ? `<a href="${esc(profile.social.linkedin)}" target="_blank" rel="noopener" title="LinkedIn">LI</a>` : ''}
        ${profile.social?.twitter  ? `<a href="${esc(profile.social.twitter)}"  target="_blank" rel="noopener" title="Twitter">TW</a>` : ''}
        ${profile.website          ? `<a href="${esc(profile.website)}"         target="_blank" rel="noopener" title="Website">🌐</a>` : ''}
      </div>
    </div>
    <div class="hero-avatar-wrap">
      ${profile.avatar
        ? `<img class="hero-avatar" src="${esc(profile.avatar)}" alt="${esc(profile.name)}" />`
        : `<div class="hero-avatar-placeholder">${profile.name?.[0]?.toUpperCase() || '?'}</div>`}
    </div>
  </div>
</section>` : ''}

<!-- Skills -->
${show.skills !== false && profile.skills?.length ? `
<section id="skills">
  <div class="section-inner">
    <div class="section-label">Expertise</div>
    <h2 class="section-title">Skills & Technologies</h2>
    <p class="section-subtitle">Technologies and tools I work with to build great products.</p>
    <div class="skills-grid">
      ${profile.skills.map(s => `<span class="skill-badge">${esc(s)}</span>`).join('')}
    </div>
  </div>
</section>` : ''}

<!-- Projects -->
${show.projects !== false && projects.length ? `
<section id="projects">
  <div class="section-inner">
    <div class="section-label">Case Studies</div>
    <h2 class="section-title">Featured Projects</h2>
    <p class="section-subtitle">A selection of my best work — each with a full case study.</p>
    <div class="projects-grid">
      ${projects.map(p => `
      <div class="project-card">
        <div class="project-thumb">
          ${p.thumbnail ? `<img src="${esc(p.thumbnail)}" alt="${esc(p.title)}" />` : (p.title?.[0]?.toUpperCase() || '?')}
        </div>
        <div class="project-body">
          ${p.featured ? `<div class="project-featured-badge">★ Featured</div>` : ''}
          <h3 class="project-title">${esc(p.title || 'Untitled')}</h3>
          <p class="project-tagline">${esc(p.tagline || p.problem?.slice(0, 120) || '')}</p>
          <div class="project-tech">
            ${(p.technologies || []).map(t => `<span class="tech-badge">${esc(t)}</span>`).join('')}
          </div>
          ${(p.problem || p.solution || (p.features && p.features.length)) ? `
          <div class="case-study-section">
            <div class="case-study-grid">
              ${p.problem  ? `<div class="case-block"><h4>Problem</h4><p>${esc(p.problem.slice(0,200))}</p></div>` : ''}
              ${p.solution ? `<div class="case-block"><h4>Solution</h4><p>${esc(p.solution.slice(0,200))}</p></div>` : ''}
            </div>
            ${p.features?.length ? `
            <div class="case-block" style="margin-bottom:1rem">
              <h4>Key Features</h4>
              <ul class="feature-list">
                ${p.features.filter(Boolean).map(f => `<li>${esc(f)}</li>`).join('')}
              </ul>
            </div>` : ''}
          </div>` : ''}
          <div class="project-links">
            ${p.liveUrl   ? `<a href="${esc(p.liveUrl)}"   class="project-link primary" target="_blank" rel="noopener">Live Demo →</a>` : ''}
            ${p.githubUrl ? `<a href="${esc(p.githubUrl)}" class="project-link ghost"   target="_blank" rel="noopener">GitHub</a>` : ''}
          </div>
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>` : ''}

<!-- Education -->
${show.education !== false && profile.education?.length ? `
<section id="education">
  <div class="section-inner">
    <div class="section-label">Background</div>
    <h2 class="section-title">Education</h2>
    <div class="edu-grid">
      ${profile.education.map(e => `
      <div class="edu-card">
        <div class="edu-icon">🎓</div>
        <div>
          <div class="edu-school">${esc(e.school)}</div>
          <div class="edu-degree">${esc(e.degree)}</div>
          <div class="edu-year">${esc(e.year)}${e.gpa ? ` · GPA: ${esc(e.gpa)}` : ''}</div>
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>` : ''}

<!-- Contact -->
${show.contact !== false ? `
<section id="contact">
  <div class="section-inner">
    <div class="contact-section">
      <div class="section-label">Get In Touch</div>
      <h2 class="section-title">Let's Work Together</h2>
      <p style="color:#64748b;max-width:480px;margin:1rem auto 0;line-height:1.7">
        ${profile.bio ? esc(profile.bio.slice(0, 180)) : 'Open to exciting opportunities and collaborations.'}
      </p>
      <div class="contact-social">
        ${profile.email          ? `<a href="mailto:${esc(profile.email)}" class="contact-link">✉ ${esc(profile.email)}</a>` : ''}
        ${profile.social?.github ? `<a href="${esc(profile.social.github)}" class="contact-link" target="_blank" rel="noopener">↗ GitHub</a>` : ''}
        ${profile.social?.linkedin ? `<a href="${esc(profile.social.linkedin)}" class="contact-link" target="_blank" rel="noopener">↗ LinkedIn</a>` : ''}
        ${profile.website        ? `<a href="${esc(profile.website)}" class="contact-link" target="_blank" rel="noopener">↗ Website</a>` : ''}
      </div>
    </div>
  </div>
</section>` : ''}

<footer>
  <p>Built with DevPortfolio Builder · ${esc(profile.name || 'Developer')} © ${new Date().getFullYear()}</p>
</footer>

</body>
</html>`;
  },
};

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#039;');
}
