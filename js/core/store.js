/**
 * store.js — localStorage state management
 * Architecture: designed for easy swap to fetch('/api/...') calls for MongoDB integration.
 * All store methods are async-compatible (return values wrapped consistently).
 */

const KEYS = {
  PROFILE:  'dpb_profile',
  PROJECTS: 'dpb_projects',
  SETTINGS: 'dpb_settings',
};

const DEFAULT_PROFILE = {
  name: '',
  title: '',
  bio: '',
  email: '',
  phone: '',
  location: '',
  avatar: '',
  website: '',
  skills: [],
  social: { github: '', linkedin: '', twitter: '', website: '' },
  education: [],
  experience: [],
};

const DEFAULT_SETTINGS = {
  theme: 'dark',
  selectedTemplate: 'aurora',
  editorConfig: {
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    fontFamily: 'Inter',
    showSections: {
      hero: true,
      about: true,
      skills: true,
      projects: true,
      education: true,
      experience: true,
      contact: true,
    },
  },
};

// ── Helpers ──────────────────────────────────────────────
function _read(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function _write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error(`[Store] Failed to write key "${key}":`, e);
    return false;
  }
}

function _generateId() {
  return `proj_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// ── Profile ──────────────────────────────────────────────
const Profile = {
  get() {
    return { ...DEFAULT_PROFILE, ..._read(KEYS.PROFILE, {}) };
  },
  save(data) {
    const merged = { ...Profile.get(), ...data };
    _write(KEYS.PROFILE, merged);
    Store.emit('profile:updated', merged);
    return merged;
  },
  getCompletionPercent() {
    const p = Profile.get();
    const checks = [
      !!p.name, !!p.title, !!p.bio, !!p.email,
      !!p.avatar, !!p.location,
      p.skills.length > 0,
      p.education.length > 0,
      !!(p.social.github || p.social.linkedin),
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  },
};

// ── Projects ─────────────────────────────────────────────
const Projects = {
  getAll() {
    return _read(KEYS.PROJECTS, []);
  },
  getById(id) {
    return Projects.getAll().find(p => p.id === id) || null;
  },
  add(data) {
    const projects = Projects.getAll();
    const project = {
      id: _generateId(),
      title: '',
      tagline: '',
      thumbnail: '',
      problem: '',
      solution: '',
      features: [],
      technologies: [],
      challenges: '',
      outcomes: '',
      liveUrl: '',
      githubUrl: '',
      featured: false,
      order: projects.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };
    projects.push(project);
    _write(KEYS.PROJECTS, projects);
    Store.emit('projects:added', project);
    return project;
  },
  update(id, data) {
    const projects = Projects.getAll();
    const idx = projects.findIndex(p => p.id === id);
    if (idx === -1) return null;
    projects[idx] = { ...projects[idx], ...data, updatedAt: new Date().toISOString() };
    _write(KEYS.PROJECTS, projects);
    Store.emit('projects:updated', projects[idx]);
    return projects[idx];
  },
  delete(id) {
    const projects = Projects.getAll().filter(p => p.id !== id);
    _write(KEYS.PROJECTS, projects);
    Store.emit('projects:deleted', id);
    return true;
  },
  duplicate(id) {
    const original = Projects.getById(id);
    if (!original) return null;
    const { id: _id, createdAt, updatedAt, ...rest } = original;
    return Projects.add({ ...rest, title: `${rest.title} (Copy)`, featured: false });
  },
  reorder(orderedIds) {
    const projects = Projects.getAll();
    orderedIds.forEach((id, index) => {
      const proj = projects.find(p => p.id === id);
      if (proj) proj.order = index;
    });
    projects.sort((a, b) => a.order - b.order);
    _write(KEYS.PROJECTS, projects);
    Store.emit('projects:reordered', projects);
  },
};

// ── Settings ─────────────────────────────────────────────
const Settings = {
  get() {
    return _deepMerge(DEFAULT_SETTINGS, _read(KEYS.SETTINGS, {}));
  },
  save(data) {
    const merged = _deepMerge(Settings.get(), data);
    _write(KEYS.SETTINGS, merged);
    Store.emit('settings:updated', merged);
    return merged;
  },
  setTheme(theme) {
    return Settings.save({ theme });
  },
  setTemplate(name) {
    return Settings.save({ selectedTemplate: name });
  },
  setEditorConfig(config) {
    const current = Settings.get();
    return Settings.save({
      editorConfig: { ...current.editorConfig, ...config },
    });
  },
};

// ── Deep merge helper ─────────────────────────────────────
function _deepMerge(target, source) {
  const out = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      out[key] = _deepMerge(target[key] || {}, source[key]);
    } else {
      out[key] = source[key];
    }
  }
  return out;
}

// ── Event Bus ─────────────────────────────────────────────
const _listeners = {};

const Store = {
  Profile,
  Projects,
  Settings,
  KEYS,

  on(event, callback) {
    if (!_listeners[event]) _listeners[event] = [];
    _listeners[event].push(callback);
    return () => Store.off(event, callback); // returns unsubscribe fn
  },

  off(event, callback) {
    if (_listeners[event]) {
      _listeners[event] = _listeners[event].filter(cb => cb !== callback);
    }
  },

  emit(event, data) {
    (_listeners[event] || []).forEach(cb => {
      try { cb(data); } catch (e) { console.error(`[Store] Event handler error for "${event}":`, e); }
    });
  },

  // Utility: clear all data (dev/testing)
  clearAll() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    Store.emit('store:cleared');
  },

  // Utility: export all data as JSON
  exportData() {
    return {
      profile:  Profile.get(),
      projects: Projects.getAll(),
      settings: Settings.get(),
      exportedAt: new Date().toISOString(),
    };
  },

  // Utility: import data from JSON
  importData(json) {
    try {
      const data = typeof json === 'string' ? JSON.parse(json) : json;
      if (data.profile)  _write(KEYS.PROFILE,  data.profile);
      if (data.projects) _write(KEYS.PROJECTS, data.projects);
      if (data.settings) _write(KEYS.SETTINGS, data.settings);
      Store.emit('store:imported', data);
      return true;
    } catch (e) {
      console.error('[Store] Import failed:', e);
      return false;
    }
  },
};

// Expose globally (future: replace with ES module exports for React)
window.Store = Store;
