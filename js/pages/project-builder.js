/**
 * project-builder.js — Project CRUD & case-study form
 */

let selectedProjectId = null;
let currentFeatures   = [];
let currentTech       = [];
let previewDebounce;

document.addEventListener('DOMContentLoaded', () => {
  Theme.init();
  initSidebar();
  initThemeToggle();
  renderProjectList();
  initNewProjectButtons();
  initTabSwitching();
  initEditorActions();
  initSearch();
  handleHashNavigation();
});

// ── Hash navigation (from dashboard "recent" links) ───────
function handleHashNavigation() {
  const hash = window.location.hash.slice(1);
  if (hash && hash.startsWith('proj_')) {
    openProject(hash);
  }
}

// ── Project List ─────────────────────────────────────────
function renderProjectList() {
  const container = document.getElementById('project-list-container');
  const addFirstBtn = document.getElementById('pb-add-first-btn');
  const searchVal = document.getElementById('project-search')?.value.toLowerCase() || '';
  const projects = Store.Projects.getAll()
    .filter(p => !searchVal || p.title?.toLowerCase().includes(searchVal) || p.technologies?.some(t => t.toLowerCase().includes(searchVal)))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  // Update sidebar badge
  const badge = document.getElementById('sidebar-project-count');
  if (badge) badge.textContent = Store.Projects.getAll().length;

  if (!projects.length) {
    container.innerHTML = '';
    addFirstBtn.style.display = 'flex';
    return;
  }
  addFirstBtn.style.display = 'none';

  container.innerHTML = projects.map(p => {
    const initials = p.title?.[0]?.toUpperCase() || '?';
    const techBadges = (p.technologies || []).slice(0, 2).map(t =>
      `<span class="badge badge-gray" style="font-size:10px">${Utils.escapeHtml(t)}</span>`
    ).join('');
    return `
    <div class="pb-proj-list-item ${p.id === selectedProjectId ? 'active' : ''}" data-id="${p.id}">
      <div class="pb-proj-thumb">
        ${p.thumbnail ? `<img src="${Utils.escapeHtml(p.thumbnail)}" alt="" onerror="this.parentElement.textContent='${initials}'" />` : initials}
      </div>
      <div class="pb-proj-info">
        <div class="pb-proj-name">${Utils.escapeHtml(p.title || 'Untitled')}</div>
        <div class="pb-proj-meta" style="display:flex;gap:3px;margin-top:3px">${techBadges || '<span style="font-size:10px;color:var(--text-muted)">No tech added</span>'}</div>
      </div>
      ${p.featured ? `<span class="badge badge-yellow" style="font-size:9px;padding:2px 6px">★</span>` : ''}
    </div>`;
  }).join('');

  container.querySelectorAll('.pb-proj-list-item').forEach(el => {
    el.addEventListener('click', () => openProject(el.dataset.id));
  });
}

function initSearch() {
  document.getElementById('project-search')?.addEventListener('input',
    Utils.debounce(renderProjectList, 300)
  );
}

// ── Open/Create Project ───────────────────────────────────
function openProject(id) {
  const project = Store.Projects.getById(id);
  if (!project) return;
  selectedProjectId = id;
  currentFeatures   = [...(project.features || [])];
  currentTech       = [...(project.technologies || [])];

  populateEditor(project);
  showEditor();
  renderProjectList(); // update active state
}

function createNewProject() {
  const project = Store.Projects.add({ title: 'New Project', technologies: [], features: [] });
  openProject(project.id);
  Utils.toast('New project created!', 'success', 2000);
}

function populateEditor(p) {
  setValue('proj-title',      p.title || '');
  setValue('proj-tagline',    p.tagline || '');
  setValue('proj-problem',    p.problem || '');
  setValue('proj-solution',   p.solution || '');
  setValue('proj-challenges', p.challenges || '');
  setValue('proj-outcomes',   p.outcomes || '');
  setValue('proj-thumbnail',  p.thumbnail || '');
  setValue('proj-live-url',   p.liveUrl || '');
  setValue('proj-github-url', p.githubUrl || '');

  const featuredCb = document.getElementById('proj-featured');
  if (featuredCb) featuredCb.checked = !!p.featured;

  document.getElementById('pb-editor-title').textContent = p.title || 'Untitled Project';

  renderTechTags();
  renderFeaturesList();
  updatePreviewCard();
  updateThumbnailPreview(p.thumbnail);

  // Switch to first tab
  switchTab('overview');

  // Attach live preview listeners
  initLivePreview();
}

// ── Editor UI ─────────────────────────────────────────────
function showEditor() {
  document.getElementById('pb-no-selection').style.display = 'none';
  document.getElementById('pb-editor-form').style.display  = 'flex';
}

function hideEditor() {
  document.getElementById('pb-no-selection').style.display = '';
  document.getElementById('pb-editor-form').style.display  = 'none';
  selectedProjectId = null;
}

// ── Tabs ─────────────────────────────────────────────────
function initTabSwitching() {
  document.getElementById('pb-tabs')?.addEventListener('click', e => {
    const btn = e.target.closest('.tab-btn');
    if (btn) switchTab(btn.dataset.tab);
  });
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.tab === tabId)
  );
  document.querySelectorAll('.pb-tab-content').forEach(c =>
    c.style.display = c.id === `tab-${tabId}` ? 'block' : 'none'
  );
}

// ── Editor Actions ────────────────────────────────────────
function initEditorActions() {
  document.getElementById('pb-save-btn')?.addEventListener('click', saveCurrentProject);
  document.getElementById('pb-delete-btn')?.addEventListener('click', deleteCurrentProject);
  document.getElementById('pb-duplicate-btn')?.addEventListener('click', duplicateCurrentProject);
  document.getElementById('add-feature-btn')?.addEventListener('click', () => {
    currentFeatures.push('');
    renderFeaturesList();
    const inputs = document.querySelectorAll('.feature-item input');
    inputs[inputs.length - 1]?.focus();
  });

  // Thumbnail preview on input
  document.getElementById('proj-thumbnail')?.addEventListener('input',
    Utils.debounce(e => updateThumbnailPreview(e.target.value), 500)
  );
}

function saveCurrentProject() {
  if (!selectedProjectId) return;
  const data = {
    title:       getValue('proj-title'),
    tagline:     getValue('proj-tagline'),
    problem:     getValue('proj-problem'),
    solution:    getValue('proj-solution'),
    challenges:  getValue('proj-challenges'),
    outcomes:    getValue('proj-outcomes'),
    thumbnail:   getValue('proj-thumbnail'),
    liveUrl:     getValue('proj-live-url'),
    githubUrl:   getValue('proj-github-url'),
    featured:    document.getElementById('proj-featured')?.checked || false,
    technologies: [...currentTech],
    features:    [...currentFeatures],
  };
  Store.Projects.update(selectedProjectId, data);
  document.getElementById('pb-editor-title').textContent = data.title || 'Untitled Project';
  renderProjectList();
  Utils.toast('Project saved!', 'success');
}

async function deleteCurrentProject() {
  const ok = await Utils.confirm('Delete this project? This cannot be undone.', 'Delete Project');
  if (!ok) return;
  Store.Projects.delete(selectedProjectId);
  hideEditor();
  renderProjectList();
  Utils.toast('Project deleted', 'info');
}

function duplicateCurrentProject() {
  const dup = Store.Projects.duplicate(selectedProjectId);
  if (dup) {
    renderProjectList();
    openProject(dup.id);
    Utils.toast('Project duplicated!', 'success', 2000);
  }
}

// ── New Project Buttons ───────────────────────────────────
function initNewProjectButtons() {
  ['new-project-btn', 'pb-add-first-btn', 'no-sel-new-btn'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', createNewProject);
  });
}

// ── Technologies Tag Input ────────────────────────────────
function initTechInput() {
  const container = document.getElementById('tech-container');
  const input     = document.getElementById('tech-input');
  if (!input) return;

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = input.value.trim().replace(/,$/, '');
      if (val && !currentTech.includes(val)) {
        currentTech.push(val);
        renderTechTags();
        updatePreviewCard();
      }
      input.value = '';
    }
    if (e.key === 'Backspace' && input.value === '' && currentTech.length) {
      currentTech.pop();
      renderTechTags();
      updatePreviewCard();
    }
  });
  container?.addEventListener('click', () => input.focus());
}

function renderTechTags() {
  const container = document.getElementById('tech-container');
  const input     = document.getElementById('tech-input');
  if (!container || !input) return;

  container.querySelectorAll('.tag').forEach(t => t.remove());

  currentTech.forEach(tech => {
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.innerHTML = `${Utils.escapeHtml(tech)}<button class="tag-remove" title="Remove">×</button>`;
    tag.querySelector('.tag-remove').addEventListener('click', () => {
      currentTech = currentTech.filter(t => t !== tech);
      renderTechTags();
      updatePreviewCard();
    });
    container.insertBefore(tag, input);
  });

  // Re-attach input listener if not done
  if (!input._listenerAttached) {
    input._listenerAttached = true;
    initTechInput();
  }
}

// ── Features List ─────────────────────────────────────────
function renderFeaturesList() {
  const list = document.getElementById('features-list');
  if (!list) return;
  list.innerHTML = currentFeatures.map((feat, idx) => `
    <div class="feature-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" stroke-width="2" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>
      <input type="text" value="${Utils.escapeHtml(feat)}" placeholder="Describe a key feature…"
        oninput="currentFeatures[${idx}]=this.value"
        onblur="currentFeatures[${idx}]=this.value.trim()" />
      <button class="feature-remove" onclick="removeFeature(${idx})" title="Remove">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>`).join('');
}

window.removeFeature = function(idx) {
  currentFeatures.splice(idx, 1);
  renderFeaturesList();
};

// ── Live Preview Card ─────────────────────────────────────
function initLivePreview() {
  ['proj-title', 'proj-tagline'].forEach(id => {
    document.getElementById(id)?.addEventListener('input',
      Utils.debounce(updatePreviewCard, 200)
    );
  });
}

function updatePreviewCard() {
  const title   = getValue('proj-title')   || 'Untitled Project';
  const tagline = getValue('proj-tagline') || 'Your tagline here';
  const thumb   = getValue('proj-thumbnail');

  setText('ppc-title',   title);
  setText('ppc-tagline', tagline);
  setText('ppc-initial', title[0]?.toUpperCase() || '?');

  const thumbEl = document.getElementById('ppc-thumb');
  if (thumbEl) {
    if (thumb) {
      thumbEl.innerHTML = `<img src="${Utils.escapeHtml(thumb)}" alt="thumbnail" onerror="this.parentElement.innerHTML='${title[0]?.toUpperCase() || '?'}'" />`;
    } else {
      thumbEl.innerHTML = `<span id="ppc-initial">${title[0]?.toUpperCase() || '?'}</span>`;
    }
  }

  const tagsEl = document.getElementById('ppc-tags');
  if (tagsEl) {
    tagsEl.innerHTML = currentTech.slice(0, 4).map(t =>
      `<span class="badge badge-blue" style="font-size:10px">${Utils.escapeHtml(t)}</span>`
    ).join('');
  }
}

function updateThumbnailPreview(url) {
  const container = document.getElementById('thumbnail-preview');
  if (!container) return;
  if (url && url.startsWith('http')) {
    container.innerHTML = `<img src="${Utils.escapeHtml(url)}" alt="Thumbnail preview" onerror="this.parentElement.innerHTML=''" />`;
  } else {
    container.innerHTML = '';
  }
}

// ── Sidebar & Theme ───────────────────────────────────────
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

// ── Helpers ───────────────────────────────────────────────
function setValue(id, val) { const el = document.getElementById(id); if (el) el.value = val; }
function getValue(id)      { return document.getElementById(id)?.value?.trim() || ''; }
function setText(id, text) { const el = document.getElementById(id); if (el) el.textContent = text; }
