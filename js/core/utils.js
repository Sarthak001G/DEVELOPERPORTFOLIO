/**
 * utils.js — Shared utility functions
 * Pure functions with no side effects. Easy to unit test.
 */

const Utils = {

  // ── DOM Helpers ──────────────────────────────────────────

  /** Select one element */
  $: (selector, parent = document) => parent.querySelector(selector),

  /** Select all elements */
  $$: (selector, parent = document) => [...parent.querySelectorAll(selector)],

  /** Create an element with attributes */
  createElement(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k === 'text') el.textContent = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), v);
      else el.setAttribute(k, v);
    });
    children.forEach(child => {
      if (typeof child === 'string') el.insertAdjacentHTML('beforeend', child);
      else if (child instanceof Node) el.appendChild(child);
    });
    return el;
  },

  /** Toggle class with optional force */
  toggleClass: (el, cls, force) =>
    el && el.classList.toggle(cls, force),

  /** Add/remove active class on a group */
  setActiveInGroup(parent, selector, activeEl) {
    Utils.$$(selector, parent).forEach(el => el.classList.remove('active'));
    if (activeEl) activeEl.classList.add('active');
  },

  /** Smoothly scroll element into view */
  scrollIntoView: (el, options = {}) =>
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', ...options }),

  // ── Template Literals ─────────────────────────────────────

  /** Escape HTML entities */
  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  /** Strip HTML tags */
  stripHtml: str => str ? String(str).replace(/<[^>]*>/g, '') : '',

  // ── String Helpers ───────────────────────────────────────

  /** Truncate string */
  truncate: (str, len = 80, suffix = '…') =>
    str && str.length > len ? str.slice(0, len) + suffix : (str || ''),

  /** Capitalize first letter */
  capitalize: str => str ? str.charAt(0).toUpperCase() + str.slice(1) : '',

  /** Slugify a string */
  slugify: str =>
    str?.toLowerCase().trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || '',

  /** Get initials from name */
  getInitials: name =>
    name?.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase()).join('') || '?',

  // ── Array / Object Helpers ───────────────────────────────

  /** Group array by key */
  groupBy: (arr, key) =>
    arr.reduce((acc, item) => {
      const k = typeof key === 'function' ? key(item) : item[key];
      if (!acc[k]) acc[k] = [];
      acc[k].push(item);
      return acc;
    }, {}),

  /** Remove duplicates */
  unique: (arr, key) =>
    key
      ? arr.filter((item, idx, self) => self.findIndex(t => t[key] === item[key]) === idx)
      : [...new Set(arr)],

  /** Deep clone */
  clone: obj => JSON.parse(JSON.stringify(obj)),

  // ── Date Helpers ─────────────────────────────────────────

  /** Format date to readable string */
  formatDate(dateStr, opts = {}) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', ...opts,
    });
  },

  /** Time ago */
  timeAgo(dateStr) {
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
    return Utils.formatDate(dateStr);
  },

  // ── UI Helpers ───────────────────────────────────────────

  /** Show/hide toast */
  toast(message, type = 'info', duration = 3500) {
    const container = Utils.$('#toast-container') ||
      (() => {
        const c = Utils.createElement('div', { id: 'toast-container', class: 'toast-container' });
        document.body.appendChild(c);
        return c;
      })();

    const icons = {
      success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`,
      error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
      warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
      info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
    };

    const toast = Utils.createElement('div', { class: `toast ${type}` }, [
      `<span class="toast-icon">${icons[type] || icons.info}</span>`,
      `<span class="toast-msg">${Utils.escapeHtml(message)}</span>`,
      `<button class="toast-close" aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>`,
    ]);

    const dismiss = () => {
      toast.classList.add('exiting');
      setTimeout(() => toast.remove(), 300);
    };

    toast.querySelector('.toast-close').addEventListener('click', dismiss);
    container.appendChild(toast);
    if (duration > 0) setTimeout(dismiss, duration);
    return dismiss;
  },

  /** Open modal by id */
  openModal(id) {
    const modal = Utils.$(`#${id}`);
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      // Focus first focusable element
      const focusable = modal.querySelector('input, button, textarea, select, [tabindex]');
      setTimeout(() => focusable?.focus(), 100);
    }
  },

  /** Close modal by id */
  closeModal(id) {
    const modal = Utils.$(`#${id}`);
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  },

  /** Confirm dialog */
  confirm(message, title = 'Confirm') {
    return new Promise(resolve => {
      const id = `confirm-modal-${Date.now()}`;
      const modal = Utils.createElement('div', { id, class: 'modal-backdrop' }, [`
        <div class="modal" style="max-width:420px">
          <div class="modal-header">
            <h3 class="modal-title">${Utils.escapeHtml(title)}</h3>
          </div>
          <div class="modal-body">
            <p style="color:var(--text-secondary)">${Utils.escapeHtml(message)}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-action="cancel">Cancel</button>
            <button class="btn btn-danger" data-action="confirm">Delete</button>
          </div>
        </div>
      `]);
      document.body.appendChild(modal);
      requestAnimationFrame(() => modal.classList.add('open'));

      const cleanup = (result) => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
        setTimeout(() => modal.remove(), 300);
        resolve(result);
      };

      modal.addEventListener('click', e => {
        const action = e.target.closest('[data-action]')?.dataset.action;
        if (action === 'confirm') cleanup(true);
        else if (action === 'cancel' || e.target === modal) cleanup(false);
      });
    });
  },

  // ── Form Helpers ─────────────────────────────────────────

  /** Serialize form to object */
  serializeForm(form) {
    const data = {};
    new FormData(form).forEach((v, k) => {
      if (data[k]) {
        data[k] = Array.isArray(data[k]) ? [...data[k], v] : [data[k], v];
      } else {
        data[k] = v;
      }
    });
    return data;
  },

  /** Populate form from object */
  populateForm(form, data) {
    if (!form || !data) return;
    Object.entries(data).forEach(([key, value]) => {
      const el = form.querySelector(`[name="${key}"]`);
      if (!el) return;
      if (el.type === 'checkbox') el.checked = !!value;
      else el.value = value ?? '';
    });
  },

  /** Debounce a function */
  debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  },

  /** Throttle a function */
  throttle(fn, limit = 100) {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last >= limit) { last = now; fn(...args); }
    };
  },

  // ── Ripple Effect ────────────────────────────────────────
  addRipple(element) {
    element.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top  - size / 2;
      const ripple = Utils.createElement('span', {
        class: 'ripple-effect',
        style: `width:${size}px;height:${size}px;left:${x}px;top:${y}px`,
      });
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  },

  // ── Color Helpers ────────────────────────────────────────
  hexToRgb(hex) {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? { r: parseInt(r[1],16), g: parseInt(r[2],16), b: parseInt(r[3],16) } : null;
  },

  // ── Download ─────────────────────────────────────────────
  downloadFile(content, filename, type = 'text/html') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = Utils.createElement('a', { href: url, download: filename });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // ── Validation ───────────────────────────────────────────
  isValidEmail: email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  isValidUrl: url => {
    try { new URL(url.startsWith('http') ? url : `https://${url}`); return true; }
    catch { return false; }
  },
};

window.Utils = Utils;
