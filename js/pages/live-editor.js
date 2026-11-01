/**
 * live-editor.js — Real-time portfolio editor
 */

const RENDERERS = {
  aurora:  () => window.TemplateAurora,
  minimal: () => window.TemplateMinimal,
  neon:    () => window.TemplateNeon,
};

const SECTIONS = [
  { key: 'hero',       label: 'Hero Section' },
  { key: 'about',      label: 'About' },
  { key: 'skills',     label: 'Skills' },
  { key: 'projects',   label: 'Projects' },
  { key: 'education',  label: 'Education' },
  { key: 'experience', label: 'Experience' },
  { key: 'contact',    label: 'Contact' },
];

let renderDebounce;
let currentConfig = {};

document.addEventListener('DOMContentLoaded', () => {
  Theme.init();
  initSidebar();
  initThemeToggle();
  loadConfig();
  renderSectionToggles();
  initTemplateSwitcher();
  initColorPickers();
  initFontSelector();
  initDeviceToggle();
  initRefreshBtn();
  renderPreview();
  updateProjectCount();
});

// ── Load config from Store ────────────────────────────────
function loadConfig() {
  const settings = Store.Settings.get();
  currentConfig = JSON.parse(JSON.stringify(settings.editorConfig));

  // Set color inputs
  setValue('color-primary',       currentConfig.primaryColor);
  setValue('color-primary-hex',   currentConfig.primaryColor);
  setValue('color-secondary',     currentConfig.secondaryColor);
  setValue('color-secondary-hex', currentConfig.secondaryColor);
  setValue('font-selector',       currentConfig.fontFamily);

  // Active template button
  updateTemplateBtns(settings.selectedTemplate);
}

// ── Template Switcher ─────────────────────────────────────
function initTemplateSwitcher() {
  document.getElementById('template-switcher')?.addEventListener('click', e => {
    const btn = e.target.closest('.tpl-btn');
    if (!btn) return;
    const tpl = btn.dataset.tpl;
    Store.Settings.setTemplate(tpl);
    updateTemplateBtns(tpl);
    scheduleRender();
  });
}

function updateTemplateBtns(activeId) {
  document.querySelectorAll('.tpl-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tpl === activeId);
  });
}

// ── Color Pickers ─────────────────────────────────────────
function initColorPickers() {
  // Sync color input ↔ hex input
  const pairs = [
    ['color-primary',   'color-primary-hex',   'primaryColor'],
    ['color-secondary', 'color-secondary-hex', 'secondaryColor'],
  ];

  pairs.forEach(([colorId, hexId, key]) => {
    const colorInput = document.getElementById(colorId);
    const hexInput   = document.getElementById(hexId);

    colorInput?.addEventListener('input', () => {
      if (hexInput) hexInput.value = colorInput.value;
      currentConfig[key] = colorInput.value;
      saveConfigAndRender();
    });

    hexInput?.addEventListener('input', Utils.debounce(() => {
      const val = hexInput.value;
      if (/^#[0-9a-f]{6}$/i.test(val)) {
        if (colorInput) colorInput.value = val;
        currentConfig[key] = val;
        saveConfigAndRender();
      }
    }, 400));
  });

  // Preset dots
  document.querySelectorAll('.preset-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const p = dot.dataset.primary;
      const s = dot.dataset.secondary;
      setValue('color-primary',       p);
      setValue('color-primary-hex',   p);
      setValue('color-secondary',     s);
      setValue('color-secondary-hex', s);
      currentConfig.primaryColor   = p;
      currentConfig.secondaryColor = s;
      saveConfigAndRender();
    });
  });
}

// ── Font Selector ─────────────────────────────────────────
function initFontSelector() {
  document.getElementById('font-selector')?.addEventListener('change', e => {
    currentConfig.fontFamily = e.target.value;
    saveConfigAndRender();
  });
}

// ── Section Toggles ───────────────────────────────────────
function renderSectionToggles() {
  const container = document.getElementById('section-toggles');
  if (!container) return;

  const showSections = currentConfig.showSections || {};

  container.innerHTML = SECTIONS.map(sec => `
    <div class="section-toggle-row">
      <span>${sec.label}</span>
      <label class="toggle">
        <input type="checkbox" id="toggle-${sec.key}" ${showSections[sec.key] !== false ? 'checked' : ''} />
        <span class="toggle-track"><span class="toggle-thumb"></span></span>
      </label>
    </div>`).join('');

  SECTIONS.forEach(sec => {
    document.getElementById(`toggle-${sec.key}`)?.addEventListener('change', e => {
      if (!currentConfig.showSections) currentConfig.showSections = {};
      currentConfig.showSections[sec.key] = e.target.checked;
      saveConfigAndRender();
    });
  });
}

// ── Device Toggle ─────────────────────────────────────────
function initDeviceToggle() {
  document.querySelectorAll('[data-device]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-device]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setDeviceFrame(btn.dataset.device);
    });
  });
}

function setDeviceFrame(device) {
  const wrapper = document.getElementById('preview-wrapper');
  if (!wrapper) return;
  wrapper.className = 'editor-preview-wrapper';
  if (device === 'tablet') wrapper.classList.add('tablet');
  if (device === 'mobile') wrapper.classList.add('mobile');
}

// ── Refresh ───────────────────────────────────────────────
function initRefreshBtn() {
  document.getElementById('refresh-btn')?.addEventListener('click', () => {
    renderPreview();
    Utils.toast('Preview refreshed', 'info', 1500);
  });
}

// ── Render ────────────────────────────────────────────────
function scheduleRender() {
  clearTimeout(renderDebounce);
  renderDebounce = setTimeout(renderPreview, 400);
}

function saveConfigAndRender() {
  Store.Settings.setEditorConfig(currentConfig);
  scheduleRender();
}

function renderPreview() {
  const settings   = Store.Settings.get();
  const profile    = Store.Profile.get();
  const projects   = Store.Projects.getAll();
  const templateId = settings.selectedTemplate || 'aurora';
  const renderer   = RENDERERS[templateId]?.();

  if (!renderer) return;

  const iframe = document.getElementById('editor-iframe');
  if (!iframe) return;

  try {
    const html = renderer.render(profile, projects, currentConfig);
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open(); doc.write(html); doc.close();
  } catch(e) {
    console.error('[LiveEditor] Render error:', e);
  }
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

function setValue(id, val) { const el = document.getElementById(id); if (el) el.value = val || ''; }
