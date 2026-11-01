/**
 * portfolio.js — Generated Portfolio preview & export
 */

const RENDERERS = {
  aurora:  () => window.TemplateAurora,
  minimal: () => window.TemplateMinimal,
  neon:    () => window.TemplateNeon,
};

const TEMPLATE_NAMES = { aurora: 'Aurora', minimal: 'Minimal', neon: 'Neon' };

let currentHtml = '';

document.addEventListener('DOMContentLoaded', () => {
  Theme.init();
  initSidebar();
  initThemeToggle();
  renderPortfolio();
  initDeviceToggle();
  initExportButtons();
  updateInfoBar();
  updateProjectCount();
});

// ── Render ────────────────────────────────────────────────
function renderPortfolio() {
  const settings   = Store.Settings.get();
  const profile    = Store.Profile.get();
  const projects   = Store.Projects.getAll();
  const templateId = settings.selectedTemplate || 'aurora';
  const renderer   = RENDERERS[templateId]?.();

  if (!renderer) {
    showEmptyState();
    return;
  }

  try {
    currentHtml = renderer.render(profile, projects, settings.editorConfig || {});
    const iframe = document.getElementById('portfolio-iframe');
    if (iframe) {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.open(); doc.write(currentHtml); doc.close();
    }
    updateInfoBar();
  } catch(e) {
    console.error('[Portfolio] Render error:', e);
    Utils.toast('Error rendering portfolio. Check console.', 'error');
  }
}

function showEmptyState() {
  const iframe = document.getElementById('portfolio-iframe');
  if (!iframe) return;
  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write(`<!DOCTYPE html><html><head><style>body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#0a0f1e;color:#94a3b8;text-align:center;flex-direction:column;gap:16px}</style></head><body><div style="font-size:3rem">🎨</div><div style="font-size:1.25rem;font-weight:700;color:#f1f5f9">No Template Selected</div><div>Go to Template Gallery to choose a template</div><a href="template-gallery.html" style="margin-top:12px;padding:10px 24px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:white;border-radius:8px;text-decoration:none;font-weight:600">Choose Template</a></body></html>`);
  doc.close();
}

// ── Info Bar ──────────────────────────────────────────────
function updateInfoBar() {
  const settings  = Store.Settings.get();
  const profile   = Store.Profile.get();
  const projects  = Store.Projects.getAll();
  const tmplName  = TEMPLATE_NAMES[settings.selectedTemplate] || 'None';

  const tplBadge = document.getElementById('pib-template');
  if (tplBadge) tplBadge.textContent = tmplName;

  const nameEl = document.getElementById('pib-profile-name');
  if (nameEl) nameEl.textContent = profile.name || 'No name set';

  const projEl = document.getElementById('pib-project-count');
  if (projEl) projEl.textContent = `${projects.length} project${projects.length !== 1 ? 's' : ''}`;

  const urlEl = document.getElementById('device-url');
  if (urlEl) urlEl.textContent = profile.name
    ? `${profile.name.toLowerCase().replace(/\s+/g, '')}.portfolio.dev`
    : 'yourportfolio.dev';
}

// ── Device Toggle ─────────────────────────────────────────
function initDeviceToggle() {
  document.querySelectorAll('[data-device]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-device]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const device = btn.dataset.device;
      const frame  = document.getElementById('device-frame');
      const topBar = document.getElementById('device-top-bar');
      if (!frame) return;

      frame.className = 'device-frame';
      if (device === 'tablet') frame.classList.add('tablet');
      if (device === 'mobile') frame.classList.add('mobile');
    });
  });
}

// ── Export ────────────────────────────────────────────────
function initExportButtons() {
  document.getElementById('download-btn')?.addEventListener('click', downloadPortfolio);
  document.getElementById('copy-html-btn')?.addEventListener('click', copyHtmlToClipboard);
}

function downloadPortfolio() {
  if (!currentHtml) {
    Utils.toast('Nothing to download. Render your portfolio first.', 'warning');
    return;
  }
  const profile = Store.Profile.get();
  const name = (profile.name || 'portfolio').toLowerCase().replace(/\s+/g, '-');
  Utils.downloadFile(currentHtml, `${name}-portfolio.html`);
  Utils.toast('Portfolio downloaded!', 'success');
}

function copyHtmlToClipboard() {
  if (!currentHtml) {
    Utils.toast('Nothing to copy. Render your portfolio first.', 'warning');
    return;
  }
  navigator.clipboard.writeText(currentHtml)
    .then(() => Utils.toast('HTML copied to clipboard!', 'success'))
    .catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = currentHtml;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      Utils.toast('HTML copied!', 'success');
    });
}

// ── Sidebar / Theme ───────────────────────────────────────
function initSidebar() {
  const sidebar     = document.getElementById('sidebar');
  const mainContent = document.getElementById('main-content');
  const toggleBtn   = document.getElementById('sidebar-toggle');
  const overlay     = document.getElementById('sidebar-overlay');
  const mobileBtn   = document.getElementById('mobile-menu-btn');
  if (!sidebar) return;
  if (localStorage.getItem('sidebar_collapsed') === 'true') {
    sidebar.classList.add('collapsed');
    mainContent?.classList.add('sidebar-collapsed');
  }
  toggleBtn?.addEventListener('click', () => {
    const c = sidebar.classList.toggle('collapsed');
    mainContent?.classList.toggle('sidebar-collapsed', c);
    localStorage.setItem('sidebar_collapsed', c);
  });
  mobileBtn?.addEventListener('click', () => { sidebar.classList.add('mobile-open'); overlay?.classList.add('active'); });
  overlay?.addEventListener('click', () => { sidebar.classList.remove('mobile-open'); overlay.classList.remove('active'); });
}

function initThemeToggle() {
  document.getElementById('theme-toggle')?.addEventListener('click', () => Theme.toggle());
  Theme.apply(Store.Settings.get().theme);
}

function updateProjectCount() {
  const el = document.getElementById('sidebar-project-count');
  if (el) el.textContent = Store.Projects.getAll().length;
}
