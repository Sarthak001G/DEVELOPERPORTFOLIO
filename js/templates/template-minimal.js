/**
 * template-minimal.js — Minimal Template
 * Clean, white/light design with elegant typography
 */
window.TemplateMinimal = {
  name: 'Minimal',
  id: 'minimal',
  description: 'Clean, white & elegant — timeless professional style',

  render(profile, projects, config = {}) {
    const primary   = config.primaryColor   || '#3b82f6';
    const font      = config.fontFamily     || 'Inter';
    const show      = config.showSections   || {};

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${esc(profile.name || 'Portfolio')} — Portfolio</title>
  <meta name="description" content="${esc(profile.bio?.slice(0,160) || 'Developer Portfolio')}"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --primary: ${primary};
      --font: '${font}', sans-serif;
    }
    html { scroll-behavior: smooth; }
    body { font-family: var(--font); background: #ffffff; color: #111827; -webkit-font-smoothing: antialiased; }
    a { color: var(--primary); text-decoration: none; }
    ul { list-style: none; }
    img { display: block; max-width: 100%; }

    /* ── Layout ── */
    .container { max-width: 800px; margin: 0 auto; padding: 0 1.5rem; }

    /* ── Header ── */
    header {
      border-bottom: 1px solid #f3f4f6;
      position: sticky; top: 0; background: rgba(255,255,255,0.95);
      backdrop-filter: blur(12px); z-index: 100;
    }
    .header-inner {
      display: flex; align-items: center; justify-content: space-between;
      padding: 1rem 1.5rem; max-width: 800px; margin: 0 auto;
    }
    .header-name { font-weight: 700; font-size: 1rem; color: #111827; }
    .header-nav { display: flex; gap: 1.5rem; }
    .header-nav a { font-size: 0.875rem; color: #6b7280; transition: color 150ms; }
    .header-nav a:hover { color: var(--primary); }

    /* ── Hero ── */
    .hero { padding: 5rem 1.5rem 4rem; max-width: 800px; margin: 0 auto; }
    .hero-grid { display: grid; grid-template-columns: 1fr auto; gap: 3rem; align-items: center; }
    .hero-kicker { font-size: 0.8125rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--primary); margin-bottom: 1rem; }
    .hero-name  { font-size: clamp(2rem, 5vw, 3rem); font-weight: 700; line-height: 1.1; color: #111827; margin-bottom: 0.75rem; }
    .hero-role  { font-size: 1.125rem; color: #6b7280; margin-bottom: 1.25rem; }
    .hero-bio   { font-size: 0.9375rem; color: #4b5563; line-height: 1.8; margin-bottom: 1.75rem; }
    .hero-cta   { display: flex; gap: 0.875rem; flex-wrap: wrap; }
    .btn-primary-min {
      padding: 10px 22px; border-radius: 8px;
      background: var(--primary); color: white;
      font-size: 0.875rem; font-weight: 600;
      transition: opacity 150ms;
    }
    .btn-primary-min:hover { opacity: 0.88; color: white; }
    .btn-outline-min {
      padding: 10px 22px; border-radius: 8px;
      border: 1px solid #e5e7eb; color: #374151;
      font-size: 0.875rem; font-weight: 500;
      transition: border-color 150ms, background 150ms;
    }
    .btn-outline-min:hover { border-color: var(--primary); background: rgba(59,130,246,0.04); }

    .avatar-min {
      width: 160px; height: 160px; border-radius: 50%;
      object-fit: cover; border: 3px solid #f3f4f6;
      box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    }
    .avatar-min-placeholder {
      width: 160px; height: 160px; border-radius: 50%;
      background: var(--primary);
      display: flex; align-items: center; justify-content: center;
      font-size: 3rem; font-weight: 700; color: white;
    }

    .hero-links { display: flex; gap: 1rem; margin-top: 1rem; }
    .hero-links a { font-size: 0.8125rem; color: #9ca3af; transition: color 150ms; }
    .hero-links a:hover { color: var(--primary); }

    /* ── Divider ── */
    .divider { border: none; border-top: 1px solid #f3f4f6; margin: 0; }

    /* ── Section ── */
    section { padding: 4rem 1.5rem; max-width: 800px; margin: 0 auto; }
    .sec-label { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--primary); margin-bottom: 0.5rem; }
    .sec-title { font-size: 1.5rem; font-weight: 700; color: #111827; margin-bottom: 0.75rem; }
    .sec-desc  { font-size: 0.9375rem; color: #6b7280; line-height: 1.7; margin-bottom: 2rem; max-width: 560px; }

    /* ── Skills ── */
    .skills-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .skill-pill {
      padding: 6px 14px; border-radius: 999px;
      border: 1px solid #e5e7eb;
      font-size: 0.8125rem; font-weight: 500; color: #374151;
      transition: border-color 150ms, color 150ms;
    }
    .skill-pill:hover { border-color: var(--primary); color: var(--primary); }

    /* ── Projects ── */
    .proj-list { display: flex; flex-direction: column; gap: 2rem; }
    .proj-item {
      padding: 2rem;
      border: 1px solid #f3f4f6; border-radius: 16px;
      transition: border-color 200ms, box-shadow 200ms;
    }
    .proj-item:hover { border-color: #e5e7eb; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
    .proj-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 0.75rem; }
    .proj-title { font-size: 1.125rem; font-weight: 700; color: #111827; }
    .proj-featured { font-size: 0.6875rem; font-weight: 600; padding: 3px 10px; border-radius: 999px; background: #fefce8; border: 1px solid #fde68a; color: #92400e; }
    .proj-tagline { font-size: 0.9rem; color: #6b7280; margin-bottom: 1rem; line-height: 1.7; }
    .proj-tech { display: flex; flex-wrap: wrap; gap: 0.375rem; margin-bottom: 1.25rem; }
    .tech-tag { padding: 3px 10px; border-radius: 4px; background: #f3f4f6; font-size: 0.75rem; font-weight: 500; color: #374151; }

    .proj-case-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
    .proj-case-block { padding: 1rem; background: #fafafa; border-radius: 10px; }
    .proj-case-block h4 { font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--primary); margin-bottom: 0.5rem; }
    .proj-case-block p  { font-size: 0.8125rem; color: #6b7280; line-height: 1.6; }
    .feat-list li { font-size: 0.8125rem; color: #6b7280; padding: 2px 0; }
    .feat-list li::before { content: '→ '; color: var(--primary); }

    .proj-links { display: flex; gap: 0.75rem; }
    .proj-link-primary { padding: 8px 18px; border-radius: 8px; background: var(--primary); color: white; font-size: 0.8125rem; font-weight: 600; }
    .proj-link-primary:hover { opacity: 0.88; color: white; }
    .proj-link-ghost { padding: 8px 18px; border-radius: 8px; border: 1px solid #e5e7eb; color: #6b7280; font-size: 0.8125rem; font-weight: 500; }
    .proj-link-ghost:hover { border-color: var(--primary); color: var(--primary); }

    .proj-thumb-min { width: 100%; height: 180px; border-radius: 12px; object-fit: cover; margin-bottom: 1.25rem; background: #f3f4f6; display: flex; align-items: center; justify-content: center; font-size: 2rem; overflow: hidden; }
    .proj-thumb-min img { width: 100%; height: 100%; object-fit: cover; }

    /* ── Education ── */
    .edu-list { display: flex; flex-direction: column; gap: 1rem; }
    .edu-item { display: flex; align-items: flex-start; gap: 1rem; padding: 1.25rem; border: 1px solid #f3f4f6; border-radius: 12px; }
    .edu-dot { width: 36px; height: 36px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
    .edu-school { font-weight: 600; color: #111827; margin-bottom: 0.25rem; }
    .edu-degree { font-size: 0.875rem; color: #6b7280; }
    .edu-year   { font-size: 0.75rem; color: #9ca3af; margin-top: 0.25rem; }

    /* ── Contact ── */
    .contact-box { background: #f9fafb; border-radius: 20px; padding: 3rem 2rem; text-align: center; }
    .contact-email { display: inline-block; margin-top: 1.5rem; padding: 12px 28px; border-radius: 10px; background: var(--primary); color: white; font-weight: 600; font-size: 0.9375rem; }
    .contact-email:hover { opacity: 0.9; color: white; }
    .contact-links { display: flex; justify-content: center; gap: 1rem; margin-top: 1rem; flex-wrap: wrap; }
    .contact-lnk { font-size: 0.875rem; color: #6b7280; transition: color 150ms; }
    .contact-lnk:hover { color: var(--primary); }

    /* ── Footer ── */
    footer { text-align: center; padding: 2rem; font-size: 0.8125rem; color: #9ca3af; border-top: 1px solid #f3f4f6; }

    @media (max-width: 640px) {
      .hero-grid { grid-template-columns: 1fr; }
      .avatar-min, .avatar-min-placeholder { width: 100px; height: 100px; font-size: 2rem; }
      .hero-grid .avatar-wrap { order: -1; }
      .proj-case-grid { grid-template-columns: 1fr; }
      .header-nav { display: none; }
    }
  </style>
</head>
<body>

<header>
  <div class="header-inner">
    <div class="header-name">${esc(profile.name || 'Portfolio')}</div>
    <nav class="header-nav">
      ${show.skills !== false   ? '<a href="#skills">Skills</a>'     : ''}
      ${show.projects !== false ? '<a href="#projects">Work</a>'     : ''}
      ${show.education !== false ? '<a href="#education">Education</a>' : ''}
      ${show.contact !== false  ? '<a href="#contact">Contact</a>'   : ''}
    </nav>
  </div>
</header>

${show.hero !== false ? `
<div class="hero" id="about">
  <div class="hero-grid">
    <div>
      <div class="hero-kicker">Developer & Creator</div>
      <h1 class="hero-name">${esc(profile.name || 'Your Name')}</h1>
      <p class="hero-role">${esc(profile.title || '')}</p>
      <p class="hero-bio">${esc(profile.bio || '')}</p>
      <div class="hero-cta">
        ${profile.email ? `<a href="mailto:${esc(profile.email)}" class="btn-primary-min">Get in touch</a>` : ''}
        ${profile.social?.github ? `<a href="${esc(profile.social.github)}" class="btn-outline-min" target="_blank" rel="noopener">View GitHub</a>` : ''}
      </div>
      <div class="hero-links">
        ${profile.social?.linkedin ? `<a href="${esc(profile.social.linkedin)}" target="_blank" rel="noopener">LinkedIn ↗</a>` : ''}
        ${profile.social?.twitter  ? `<a href="${esc(profile.social.twitter)}"  target="_blank" rel="noopener">Twitter ↗</a>`  : ''}
        ${profile.website          ? `<a href="${esc(profile.website)}"         target="_blank" rel="noopener">Website ↗</a>`   : ''}
        ${profile.location ? `<span style="font-size:0.8125rem;color:#9ca3af">📍 ${esc(profile.location)}</span>` : ''}
      </div>
    </div>
    <div class="avatar-wrap">
      ${profile.avatar
        ? `<img class="avatar-min" src="${esc(profile.avatar)}" alt="${esc(profile.name)}" />`
        : `<div class="avatar-min-placeholder">${profile.name?.[0]?.toUpperCase() || '?'}</div>`}
    </div>
  </div>
</div>
<hr class="divider"/>` : ''}

${show.skills !== false && profile.skills?.length ? `
<section id="skills">
  <div class="sec-label">Expertise</div>
  <h2 class="sec-title">Skills</h2>
  <p class="sec-desc">Technologies I use to bring ideas to life.</p>
  <div class="skills-list">
    ${profile.skills.map(s => `<span class="skill-pill">${esc(s)}</span>`).join('')}
  </div>
</section>
<hr class="divider"/>` : ''}

${show.projects !== false && projects.length ? `
<section id="projects">
  <div class="sec-label">Work</div>
  <h2 class="sec-title">Projects</h2>
  <p class="sec-desc">A selection of my recent work with detailed case studies.</p>
  <div class="proj-list">
    ${projects.map(p => `
    <div class="proj-item">
      ${p.thumbnail ? `<div class="proj-thumb-min"><img src="${esc(p.thumbnail)}" alt="${esc(p.title)}" /></div>` : ''}
      <div class="proj-header">
        <h3 class="proj-title">${esc(p.title || 'Untitled')}</h3>
        ${p.featured ? `<span class="proj-featured">Featured</span>` : ''}
      </div>
      <p class="proj-tagline">${esc(p.tagline || '')}</p>
      <div class="proj-tech">
        ${(p.technologies || []).map(t => `<span class="tech-tag">${esc(t)}</span>`).join('')}
      </div>
      ${p.problem || p.solution ? `
      <div class="proj-case-grid">
        ${p.problem  ? `<div class="proj-case-block"><h4>Problem</h4><p>${esc(p.problem.slice(0,200))}</p></div>` : ''}
        ${p.solution ? `<div class="proj-case-block"><h4>Solution</h4><p>${esc(p.solution.slice(0,200))}</p></div>` : ''}
      </div>` : ''}
      ${p.features?.filter(Boolean).length ? `
      <div class="proj-case-block" style="margin-bottom:1rem">
        <h4>Features</h4>
        <ul class="feat-list">
          ${p.features.filter(Boolean).map(f => `<li>${esc(f)}</li>`).join('')}
        </ul>
      </div>` : ''}
      <div class="proj-links">
        ${p.liveUrl   ? `<a href="${esc(p.liveUrl)}"   class="proj-link-primary" target="_blank" rel="noopener">View Live →</a>` : ''}
        ${p.githubUrl ? `<a href="${esc(p.githubUrl)}" class="proj-link-ghost"   target="_blank" rel="noopener">GitHub</a>` : ''}
      </div>
    </div>`).join('')}
  </div>
</section>
<hr class="divider"/>` : ''}

${show.education !== false && profile.education?.length ? `
<section id="education">
  <div class="sec-label">Background</div>
  <h2 class="sec-title">Education</h2>
  <div class="edu-list">
    ${profile.education.map(e => `
    <div class="edu-item">
      <div class="edu-dot">🎓</div>
      <div>
        <div class="edu-school">${esc(e.school)}</div>
        <div class="edu-degree">${esc(e.degree)}</div>
        <div class="edu-year">${esc(e.year)}${e.gpa ? ' · GPA: '+esc(e.gpa) : ''}</div>
      </div>
    </div>`).join('')}
  </div>
</section>
<hr class="divider"/>` : ''}

${show.contact !== false ? `
<section id="contact">
  <div class="contact-box">
    <div class="sec-label">Contact</div>
    <h2 class="sec-title">Let's Connect</h2>
    <p style="color:#6b7280;font-size:0.9375rem;line-height:1.7;max-width:400px;margin:0.75rem auto 0">
      ${profile.bio ? esc(profile.bio.slice(0,160)) : 'Open to new opportunities and collaborations.'}
    </p>
    ${profile.email ? `<a href="mailto:${esc(profile.email)}" class="contact-email">✉ ${esc(profile.email)}</a>` : ''}
    <div class="contact-links">
      ${profile.social?.github   ? `<a href="${esc(profile.social.github)}"   class="contact-lnk" target="_blank" rel="noopener">GitHub ↗</a>`   : ''}
      ${profile.social?.linkedin ? `<a href="${esc(profile.social.linkedin)}" class="contact-lnk" target="_blank" rel="noopener">LinkedIn ↗</a>` : ''}
      ${profile.social?.twitter  ? `<a href="${esc(profile.social.twitter)}"  class="contact-lnk" target="_blank" rel="noopener">Twitter ↗</a>`  : ''}
    </div>
  </div>
</section>` : ''}

<footer>
  <p>${esc(profile.name || 'Developer')} · ${new Date().getFullYear()} · Built with DevPortfolio Builder</p>
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
