/**
 * template-gallery.js — Template selection logic
 */

const TEMPLATES = [
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'Dark gradient with glassmorphism — premium and bold',
    renderer: () => window.TemplateAurora,
    palette: ['#0a0f1e', '#3b82f6', '#8b5cf6'],
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, white & elegant — timeless professional style',
    renderer: () => window.TemplateMinimal,
    palette: ['#ffffff', '#3b82f6', '#f3f4f6'],
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Cyberpunk neon — bold, edgy, and unforgettable',
    renderer: () => window.TemplateNeon,
    palette: ['#020817', '#00ff88', '#00d4ff'],
  },
];

let previewingTemplateId = null;

document.addEventListener('DOMContentLoaded', () => {
  Theme.init();
  initSidebar();
  initThemeToggle();
  renderTemplateGrid();
  initModal();
  updateProjectCount();
});

function renderTemplateGrid() {
  const grid = document.getElementById('template-grid');
  if (!grid) return;

  const activeTemplate = Store.Settings.get().selectedTemplate;

  grid.innerHTML = TEMPLATES.map(tpl => {
    const isActive = tpl.id === activeTemplate;
    return `
    <div class="tg-card ${isActive ? 'active' : ''}" data-id="${tpl.id}">
      <div class="tg-preview" id="preview-${tpl.id}">
        <iframe id="iframe-${tpl.id}" title="${tpl.name} preview"></iframe>
        <div class="tg-preview-overlay">
          <button class="btn btn-primary btn-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Preview
          </button>
        </div>
      </div>
      <div class="tg-body">
        <div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-2)">
          ${tpl.palette.map(c => `<div style="width:18px;height:18px;border-radius:50%;background:${c};border:2px solid var(--border-medium)"></div>`).join('')}
        </div>
        <div class="tg-name">${tpl.name}</div>
        <div class="tg-desc">${tpl.description}</div>
        <div class="tg-footer">
          ${isActive
            ? `<div class="tg-active-badge"><div class="tg-active-dot"></div> Active Template</div>`
            : `<span></span>`}
          <button class="btn btn-secondary btn-sm" data-action="preview" data-id="${tpl.id}">Preview</button>
        </div>
      </div>
    </div>`;
  }).join('');

  // Render mini previews in iframes
  setTimeout(() => {
    TEMPLATES.forEach(tpl => renderMiniPreview(tpl.id));
  }, 200);

  // Event delegation
  grid.addEventListener('click', e => {
    const previewBtn = e.target.closest('[data-action="preview"]');
    const card = e.target.closest('.tg-card');
    if (previewBtn) {
      openPreviewModal(previewBtn.dataset.id);
    } else if (card) {
      openPreviewModal(card.dataset.id);
    }
  });
}

function renderMiniPreview(templateId) {
  const tpl  = TEMPLATES.find(t => t.id === templateId);
  if (!tpl) return;
  const iframe = document.getElementById(`iframe-${templateId}`);
  if (!iframe) return;

  const profile  = Store.Profile.get();
  const projects = Store.Projects.getAll().slice(0, 2);
  const config   = Store.Settings.get().editorConfig;

  try {
    const html = tpl.renderer().render(profile, projects, config);
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open(); doc.write(html); doc.close();
  } catch(e) {
    console.error('Mini preview render error:', e);
  }
}

function renderFullPreview(templateId, iframeEl) {
  const tpl = TEMPLATES.find(t => t.id === templateId);
  if (!tpl || !iframeEl) return;

  const profile  = Store.Profile.get();
  const projects = Store.Projects.getAll();
  const config   = Store.Settings.get().editorConfig;

  try {
    const html = tpl.renderer().render(profile, projects, config);
    const doc = iframeEl.contentDocument || iframeEl.contentWindow.document;
    doc.open(); doc.write(html); doc.close();
  } catch(e) {
    console.error('Full preview render error:', e);
  }
}

// ── Modal ─────────────────────────────────────────────────
function initModal() {
  const backdrop = document.getElementById('preview-modal');
  const closeBtn = document.getElementById('preview-modal-close');
  const closeBtn2 = document.getElementById('preview-modal-close2');
  const selectBtn = document.getElementById('preview-modal-select');

  closeBtn?.addEventListener('click', closeModal);
  closeBtn2?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', e => {
    if (e.target === backdrop) closeModal();
  });
  selectBtn?.addEventListener('click', () => {
    if (previewingTemplateId) selectTemplate(previewingTemplateId);
  });
}

function openPreviewModal(templateId) {
  previewingTemplateId = templateId;
  const tpl = TEMPLATES.find(t => t.id === templateId);
  if (!tpl) return;

  const titleEl = document.getElementById('preview-modal-title');
  if (titleEl) titleEl.textContent = `${tpl.name} Template Preview`;

  const iframe = document.getElementById('preview-iframe');
  if (iframe) renderFullPreview(templateId, iframe);

  document.getElementById('preview-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('preview-modal').classList.remove('open');
  document.body.style.overflow = '';
  previewingTemplateId = null;
}

function selectTemplate(templateId) {
  Store.Settings.setTemplate(templateId);
  closeModal();
  renderTemplateGrid();
  Utils.toast(`${TEMPLATES.find(t => t.id === templateId)?.name} template selected!`, 'success');
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
