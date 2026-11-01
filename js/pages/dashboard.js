/**
 * dashboard.js — Dashboard page logic
 */

document.addEventListener('DOMContentLoaded', () => {

  // Init theme & sidebar
  Theme.init();
  initSidebar();
  initThemeToggle();
  renderDashboard();

  // Listen for store changes to re-render
  Store.on('profile:updated',   renderDashboard);
  Store.on('projects:added',    renderDashboard);
  Store.on('projects:updated',  renderDashboard);
  Store.on('projects:deleted',  renderDashboard);
  Store.on('settings:updated',  renderDashboard);
});

// ── Sidebar collapse logic ──────────────────────────────────
function initSidebar() {
  const sidebar     = document.getElementById('sidebar');
  const mainContent = document.getElementById('main-content');
  const toggleBtn   = document.getElementById('sidebar-toggle');
  const overlay     = document.getElementById('sidebar-overlay');
  const mobileBtn   = document.getElementById('mobile-menu-btn');

  if (!sidebar) return;

  // Restore collapse state
  const isCollapsed = localStorage.getItem('sidebar_collapsed') === 'true';
  if (isCollapsed) {
    sidebar.classList.add('collapsed');
    mainContent.classList.add('sidebar-collapsed');
  }

  toggleBtn?.addEventListener('click', () => {
    const collapsed = sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('sidebar-collapsed', collapsed);
    localStorage.setItem('sidebar_collapsed', collapsed);
  });

  // Mobile
  mobileBtn?.addEventListener('click', () => {
    sidebar.classList.add('mobile-open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  overlay?.addEventListener('click', closeMobileSidebar);

  function closeMobileSidebar() {
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ── Theme toggle ──────────────────────────────────────────
function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  btn?.addEventListener('click', () => {
    Theme.toggle();
    Utils.toast('Theme changed!', 'info', 2000);
  });
  // Render initial icon
  Theme.apply(Store.Settings.get().theme);
}

// ── Dashboard render ──────────────────────────────────────
function renderDashboard() {
  const profile   = Store.Profile.get();
  const projects  = Store.Projects.getAll();
  const settings  = Store.Settings.get();
  const completion = Store.Profile.getCompletionPercent();

  // Welcome
  const welcomeTitle = document.getElementById('welcome-title');
  if (welcomeTitle) {
    welcomeTitle.textContent = profile.name
      ? `Welcome back, ${profile.name.split(' ')[0]}! 👋`
      : `Welcome! Let's build your portfolio 👋`;
  }

  // Stats
  _setText('stat-projects', projects.length);
  _setText('stat-completion', `${completion}%`);
  _setText('stat-skills', profile.skills.length);

  const bar = document.getElementById('stat-completion-bar');
  if (bar) bar.style.width = `${completion}%`;

  // Template stat
  const tmpl = settings.selectedTemplate;
  const tmplNames = { aurora: 'Aurora', minimal: 'Minimal', neon: 'Neon' };
  _setText('stat-template', tmplNames[tmpl] || '—');
  const tmplBadge = document.getElementById('stat-template-badge');
  if (tmplBadge) {
    tmplBadge.textContent = tmplNames[tmpl] || 'Not selected';
    tmplBadge.className = `badge ${tmpl ? 'badge-violet' : 'badge-gray'}`;
  }

  // Project count badge in sidebar
  const sidebar_count = document.getElementById('sidebar-project-count');
  if (sidebar_count) sidebar_count.textContent = projects.length;

  // Profile avatar/name in topbar welcome
  const welcomeAvatar = document.getElementById('welcome-avatar');
  if (welcomeAvatar) {
    if (profile.avatar) {
      welcomeAvatar.innerHTML = `<img src="${Utils.escapeHtml(profile.avatar)}" alt="Avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%" onerror="this.parentElement.textContent='${Utils.getInitials(profile.name) || '?'}'" />`;
    } else {
      welcomeAvatar.textContent = Utils.getInitials(profile.name) || '?';
    }
  }

  // Profile summary card
  const pAvatar = document.getElementById('profile-avatar-preview');
  if (pAvatar) {
    if (profile.avatar) {
      pAvatar.innerHTML = `<img src="${Utils.escapeHtml(profile.avatar)}" alt="Avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%" onerror="this.parentElement.textContent='${Utils.getInitials(profile.name) || '?'}'" />`;
    } else {
      pAvatar.textContent = Utils.getInitials(profile.name) || '?';
    }
  }
  _setText('profile-name-preview',  profile.name  || 'Your Name');
  _setText('profile-title-preview', profile.title || 'Add your title →');

  // Skills preview
  const skillsPreview = document.getElementById('profile-skills-preview');
  if (skillsPreview) {
    skillsPreview.innerHTML = profile.skills.slice(0, 4).map(s =>
      `<span class="badge badge-blue">${Utils.escapeHtml(s)}</span>`
    ).join('') + (profile.skills.length > 4 ? `<span class="badge badge-gray">+${profile.skills.length - 4}</span>` : '');
  }

  // Recent projects
  renderRecentProjects(projects);

  // Checklist
  renderChecklist(profile, projects, settings);
}

function renderRecentProjects(projects) {
  const container = document.getElementById('recent-projects-list');
  if (!container) return;

  if (!projects.length) {
    container.innerHTML = `
      <div class="empty-state" style="padding:var(--space-8) var(--space-4)">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <div class="empty-title">No projects yet</div>
        <div class="empty-desc">Add your first case study to get started</div>
        <a href="pages/project-builder.html" class="btn btn-primary btn-sm" style="margin-top:var(--space-3)">
          Add Project
        </a>
      </div>`;
    return;
  }

  const recent = [...projects]
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
    .slice(0, 5);

  container.innerHTML = recent.map(p => {
    const initials = p.title?.[0]?.toUpperCase() || '?';
    const tech = (p.technologies || []).slice(0, 2).map(t =>
      `<span class="badge badge-gray" style="font-size:10px">${Utils.escapeHtml(t)}</span>`
    ).join('');
    return `
      <a class="recent-project-item" href="pages/project-builder.html#${p.id}">
        <div class="project-thumb">
          ${p.thumbnail
            ? `<img src="${Utils.escapeHtml(p.thumbnail)}" alt="${Utils.escapeHtml(p.title)}" />`
            : initials}
        </div>
        <div class="project-info">
          <div class="project-info-title">${Utils.escapeHtml(p.title || 'Untitled Project')}</div>
          <div class="project-info-meta" style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px">
            ${tech || '<span style="font-size:var(--text-xs);color:var(--text-muted)">No technologies added</span>'}
          </div>
        </div>
        <span class="project-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </span>
      </a>`;
  }).join('');
}

function renderChecklist(profile, projects, settings) {
  const container = document.getElementById('setup-checklist');
  const progressEl = document.getElementById('checklist-progress');
  if (!container) return;

  const checks = [
    { label: 'Add your name & title', done: !!(profile.name && profile.title), href: 'pages/personal-info.html' },
    { label: 'Write your bio',         done: !!profile.bio,         href: 'pages/personal-info.html' },
    { label: 'Add skills',             done: profile.skills.length > 0, href: 'pages/personal-info.html' },
    { label: 'Create a project',       done: projects.length > 0,  href: 'pages/project-builder.html' },
    { label: 'Choose a template',      done: !!settings.selectedTemplate, href: 'pages/template-gallery.html' },
  ];

  const doneCount = checks.filter(c => c.done).length;
  if (progressEl) progressEl.textContent = `${doneCount}/${checks.length}`;

  container.innerHTML = checks.map(c => `
    <a class="checklist-item ${c.done ? 'done' : ''}" href="${c.href}">
      <span class="checklist-check"></span>
      <span class="checklist-label">${c.label}</span>
      ${!c.done ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14" style="color:var(--text-muted)"><polyline points="9 18 15 12 9 6"/></svg>` : ''}
    </a>`).join('');
}

function _setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}
