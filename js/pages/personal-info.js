/**
 * personal-info.js — Profile form logic with auto-save
 */

const SUGGESTED_SKILLS = [
  'JavaScript','TypeScript','React','Vue','Angular','Node.js','Express',
  'Python','Django','FastAPI','MongoDB','PostgreSQL','MySQL','Redis',
  'Docker','Kubernetes','AWS','GCP','Azure','Git','GraphQL','REST API',
  'HTML','CSS','Tailwind','Next.js','Nuxt','Svelte','Go','Rust','Java',
  'Spring Boot','PHP','Laravel','Swift','Kotlin','React Native','Flutter',
];

let currentSkills   = [];
let currentEducation = [];
let currentExperience = [];
let autoSaveTimer;

document.addEventListener('DOMContentLoaded', () => {
  Theme.init();
  initSidebar();
  initThemeToggle();
  loadProfile();
  initSkillsInput();
  initAvatarUpload();
  initEducationSection();
  initExperienceSection();
  initSaveButtons();
  initCharCount();
  initAutoSave();
  renderSuggestedSkills();
  updateProjectCount();
});

// ── Load profile from store ───────────────────────────────
function loadProfile() {
  const p = Store.Profile.get();
  currentSkills    = [...(p.skills || [])];
  currentEducation = JSON.parse(JSON.stringify(p.education || []));
  currentExperience = JSON.parse(JSON.stringify(p.experience || []));

  // Basic fields
  _val('pi-name',      p.name);
  _val('pi-title',     p.title);
  _val('pi-bio',       p.bio);
  _val('pi-email',     p.email);
  _val('pi-phone',     p.phone);
  _val('pi-location',  p.location);
  _val('pi-website',   p.website);

  // Social
  _val('social-github',   p.social?.github);
  _val('social-linkedin', p.social?.linkedin);
  _val('social-twitter',  p.social?.twitter);
  _val('social-website',  p.social?.website);

  // Avatar
  if (p.avatar) updateAvatarPreview(p.avatar);
  document.getElementById('avatar-url-input').value = p.avatar || '';

  // Skills
  renderSkillTags();

  // Education / Experience
  renderEducationList();
  renderExperienceList();

  // Completion
  updateCompletion();
}

// ── Auto-save logic ───────────────────────────────────────
function initAutoSave() {
  const inputs = document.querySelectorAll('.input');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      showAutoSaveState('saving');
      clearTimeout(autoSaveTimer);
      autoSaveTimer = setTimeout(() => {
        saveProfile(false);
        showAutoSaveState('saved');
      }, 1200);
    });
  });
}

function showAutoSaveState(state) {
  const dot  = document.querySelector('.as-dot');
  const text = document.querySelector('.as-text');
  if (!dot || !text) return;
  if (state === 'saving') {
    dot.style.background = 'var(--color-warning)';
    text.textContent = 'Saving…';
  } else {
    dot.style.background = 'var(--color-success)';
    text.textContent = 'All saved';
  }
}

// ── Save ─────────────────────────────────────────────────
function initSaveButtons() {
  ['save-btn', 'save-btn-bottom'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', () => {
      saveProfile(true);
    });
  });
  document.getElementById('reset-btn')?.addEventListener('click', async () => {
    const ok = await Utils.confirm('Reset all profile data? This cannot be undone.', 'Reset Profile');
    if (ok) {
      Store.Profile.save({});
      loadProfile();
      Utils.toast('Profile reset', 'info');
    }
  });
}

function saveProfile(showToast = true) {
  const data = {
    name:     _getVal('pi-name'),
    title:    _getVal('pi-title'),
    bio:      _getVal('pi-bio'),
    email:    _getVal('pi-email'),
    phone:    _getVal('pi-phone'),
    location: _getVal('pi-location'),
    website:  _getVal('pi-website'),
    avatar:   document.getElementById('avatar-url-input').value,
    skills:   [...currentSkills],
    education: JSON.parse(JSON.stringify(currentEducation)),
    experience: JSON.parse(JSON.stringify(currentExperience)),
    social: {
      github:   _getVal('social-github'),
      linkedin: _getVal('social-linkedin'),
      twitter:  _getVal('social-twitter'),
      website:  _getVal('social-website'),
    },
  };

  Store.Profile.save(data);
  updateCompletion();
  if (showToast) Utils.toast('Profile saved successfully!', 'success');
}

// ── Char count ───────────────────────────────────────────
function initCharCount() {
  const bio = document.getElementById('pi-bio');
  const counter = document.getElementById('bio-char-count');
  if (!bio || !counter) return;
  const update = () => {
    const len = bio.value.length;
    const max = parseInt(bio.getAttribute('maxlength')) || 600;
    counter.textContent = `${len} / ${max}`;
    counter.className = `char-count${len > max * 0.9 ? (len >= max ? ' at-limit' : ' near-limit') : ''}`;
  };
  bio.addEventListener('input', update);
  update();
}

// ── Avatar ───────────────────────────────────────────────
function initAvatarUpload() {
  document.getElementById('avatar-apply-btn')?.addEventListener('click', () => {
    const url = document.getElementById('avatar-url-input').value.trim();
    if (url) {
      updateAvatarPreview(url);
      Utils.toast('Avatar updated!', 'success', 2000);
    }
  });
  document.getElementById('avatar-url-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('avatar-apply-btn').click();
  });
}

function updateAvatarPreview(url) {
  const el = document.getElementById('avatar-preview-el');
  if (!el) return;
  const name = _getVal('pi-name');
  el.innerHTML = `<img src="${Utils.escapeHtml(url)}" alt="Avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%" onerror="this.parentElement.textContent='${Utils.getInitials(name) || '?'}'" />`;
}

// ── Skills ───────────────────────────────────────────────
function initSkillsInput() {
  const container = document.getElementById('skills-container');
  const input     = document.getElementById('skills-input');
  if (!input) return;

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(input.value);
      input.value = '';
    }
    if (e.key === 'Backspace' && input.value === '' && currentSkills.length) {
      removeSkill(currentSkills[currentSkills.length - 1]);
    }
  });

  container?.addEventListener('click', () => input.focus());
}

function addSkill(raw) {
  const skill = raw.trim().replace(/,+$/, '');
  if (!skill || currentSkills.includes(skill)) return;
  currentSkills.push(skill);
  renderSkillTags();
  updateCompletion();
  triggerAutoSave();
}

function removeSkill(skill) {
  currentSkills = currentSkills.filter(s => s !== skill);
  renderSkillTags();
  updateCompletion();
  triggerAutoSave();
}

function renderSkillTags() {
  const container = document.getElementById('skills-container');
  const input     = document.getElementById('skills-input');
  if (!container || !input) return;

  // Remove existing tags
  container.querySelectorAll('.tag').forEach(t => t.remove());

  currentSkills.forEach(skill => {
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.innerHTML = `${Utils.escapeHtml(skill)}<button class="tag-remove" aria-label="Remove ${Utils.escapeHtml(skill)}">×</button>`;
    tag.querySelector('.tag-remove').addEventListener('click', () => removeSkill(skill));
    container.insertBefore(tag, input);
  });

  const countEl = document.getElementById('skills-count');
  if (countEl) countEl.textContent = `${currentSkills.length} skill${currentSkills.length !== 1 ? 's' : ''}`;
}

function renderSuggestedSkills() {
  const container = document.getElementById('skills-suggestions');
  if (!container) return;
  container.innerHTML = '<span style="font-size:var(--text-xs);color:var(--text-muted);align-self:center">Suggestions:</span>' +
    SUGGESTED_SKILLS.slice(0, 12).map(s =>
      `<button class="skill-suggestion" data-skill="${Utils.escapeHtml(s)}">${Utils.escapeHtml(s)}</button>`
    ).join('');
  container.addEventListener('click', e => {
    const skill = e.target.dataset.skill;
    if (skill) addSkill(skill);
  });
}

// ── Education ────────────────────────────────────────────
function initEducationSection() {
  document.getElementById('add-education-btn')?.addEventListener('click', () => {
    currentEducation.push({ school: '', degree: '', year: '', gpa: '', id: Date.now() });
    renderEducationList();
  });
}

function renderEducationList() {
  const list  = document.getElementById('education-list');
  const empty = document.getElementById('education-empty');
  if (!list)  return;
  empty.style.display = currentEducation.length ? 'none' : 'flex';
  list.innerHTML = currentEducation.map((edu, idx) => `
    <div class="education-item" id="edu-${edu.id}">
      <div class="edu-exp-header">
        <span class="edu-exp-title">Education #${idx + 1}</span>
        <button class="btn btn-danger btn-sm" onclick="removeEducation(${edu.id})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          Remove
        </button>
      </div>
      <div class="form">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">School / University</label>
            <input type="text" class="input" value="${Utils.escapeHtml(edu.school)}" placeholder="MIT" oninput="updateEducation(${edu.id},'school',this.value)" />
          </div>
          <div class="form-group">
            <label class="form-label">Degree / Field</label>
            <input type="text" class="input" value="${Utils.escapeHtml(edu.degree)}" placeholder="B.Sc. Computer Science" oninput="updateEducation(${edu.id},'degree',this.value)" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Graduation Year</label>
            <input type="text" class="input" value="${Utils.escapeHtml(edu.year)}" placeholder="2022" oninput="updateEducation(${edu.id},'year',this.value)" />
          </div>
          <div class="form-group">
            <label class="form-label">GPA (optional)</label>
            <input type="text" class="input" value="${Utils.escapeHtml(edu.gpa)}" placeholder="3.8 / 4.0" oninput="updateEducation(${edu.id},'gpa',this.value)" />
          </div>
        </div>
      </div>
    </div>`).join('');
}

window.removeEducation = function(id) {
  currentEducation = currentEducation.filter(e => e.id !== id);
  renderEducationList();
  triggerAutoSave();
};

window.updateEducation = function(id, field, value) {
  const edu = currentEducation.find(e => e.id === id);
  if (edu) { edu[field] = value; triggerAutoSave(); }
};

// ── Experience ───────────────────────────────────────────
function initExperienceSection() {
  document.getElementById('add-experience-btn')?.addEventListener('click', () => {
    currentExperience.push({ company: '', role: '', duration: '', description: '', id: Date.now() });
    renderExperienceList();
  });
}

function renderExperienceList() {
  const list  = document.getElementById('experience-list');
  const empty = document.getElementById('experience-empty');
  if (!list)  return;
  empty.style.display = currentExperience.length ? 'none' : 'flex';
  list.innerHTML = currentExperience.map((exp, idx) => `
    <div class="experience-item" id="exp-${exp.id}">
      <div class="edu-exp-header">
        <span class="edu-exp-title">Experience #${idx + 1}</span>
        <button class="btn btn-danger btn-sm" onclick="removeExperience(${exp.id})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          Remove
        </button>
      </div>
      <div class="form">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Company</label>
            <input type="text" class="input" value="${Utils.escapeHtml(exp.company)}" placeholder="Google" oninput="updateExperience(${exp.id},'company',this.value)" />
          </div>
          <div class="form-group">
            <label class="form-label">Role / Position</label>
            <input type="text" class="input" value="${Utils.escapeHtml(exp.role)}" placeholder="Senior Engineer" oninput="updateExperience(${exp.id},'role',this.value)" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Duration</label>
            <input type="text" class="input" value="${Utils.escapeHtml(exp.duration)}" placeholder="Jan 2021 – Present" oninput="updateExperience(${exp.id},'duration',this.value)" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea class="input" rows="3" placeholder="Key responsibilities and achievements..." oninput="updateExperience(${exp.id},'description',this.value)">${Utils.escapeHtml(exp.description)}</textarea>
        </div>
      </div>
    </div>`).join('');
}

window.removeExperience = function(id) {
  currentExperience = currentExperience.filter(e => e.id !== id);
  renderExperienceList();
  triggerAutoSave();
};

window.updateExperience = function(id, field, value) {
  const exp = currentExperience.find(e => e.id === id);
  if (exp) { exp[field] = value; triggerAutoSave(); }
};

// ── Completion ───────────────────────────────────────────
function updateCompletion() {
  const pct = Store.Profile.getCompletionPercent();
  const bar  = document.getElementById('completion-bar');
  const pctEl = document.getElementById('completion-pct');
  const sub  = document.getElementById('completion-sub');
  if (bar)   bar.style.width  = `${pct}%`;
  if (pctEl) pctEl.textContent = `${pct}%`;
  if (sub) {
    sub.textContent = pct === 100
      ? '🎉 Profile complete! Ready to publish.'
      : `${100 - pct}% remaining — keep going!`;
  }
}

// ── Sidebar ───────────────────────────────────────────────
function initSidebar() {
  const sidebar     = document.getElementById('sidebar');
  const mainContent = document.getElementById('main-content');
  const toggleBtn   = document.getElementById('sidebar-toggle');
  const overlay     = document.getElementById('sidebar-overlay');
  const mobileBtn   = document.getElementById('mobile-menu-btn');
  if (!sidebar) return;
  const isCollapsed = localStorage.getItem('sidebar_collapsed') === 'true';
  if (isCollapsed) { sidebar.classList.add('collapsed'); mainContent?.classList.add('sidebar-collapsed'); }
  toggleBtn?.addEventListener('click', () => {
    const c = sidebar.classList.toggle('collapsed');
    mainContent?.classList.toggle('sidebar-collapsed', c);
    localStorage.setItem('sidebar_collapsed', c);
  });
  mobileBtn?.addEventListener('click', () => { sidebar.classList.add('mobile-open'); overlay?.classList.add('active'); });
  overlay?.addEventListener('click', () => { sidebar.classList.remove('mobile-open'); overlay.classList.remove('active'); });
}

function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  btn?.addEventListener('click', () => Theme.toggle());
  Theme.apply(Store.Settings.get().theme);
}

function updateProjectCount() {
  const el = document.getElementById('sidebar-project-count');
  if (el) el.textContent = Store.Projects.getAll().length;
}

// ── Helpers ───────────────────────────────────────────────
function triggerAutoSave() {
  showAutoSaveState('saving');
  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(() => {
    saveProfile(false);
    showAutoSaveState('saved');
  }, 1200);
}

function _val(id, val = '') {
  const el = document.getElementById(id);
  if (el) el.value = val || '';
}

function _getVal(id) {
  return document.getElementById(id)?.value?.trim() || '';
}
