/**
 * auth.js (page) — Login & Register form logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // If already logged in, redirect to dashboard
  if (Auth.isLoggedIn()) {
    window.location.href = '../index.html';
    return;
  }

  initFormSwitching();
  initLoginForm();
  initRegisterForm();
  initPasswordToggles();
  initPasswordStrength();
  initDemoButtons();
  initForgotPassword();

  // Focus first input
  document.getElementById('login-email')?.focus();
});

// ── Form switching ──────────────────────────────────────────
function initFormSwitching() {
  document.getElementById('show-register')?.addEventListener('click', () => {
    document.getElementById('login-form').style.display = 'none';
    const regForm = document.getElementById('register-form');
    regForm.style.display = 'block';
    // Re-trigger animation
    regForm.style.animation = 'none';
    regForm.offsetHeight; // force reflow
    regForm.style.animation = '';
    document.getElementById('reg-name')?.focus();
    clearErrors();
  });

  document.getElementById('show-login')?.addEventListener('click', () => {
    document.getElementById('register-form').style.display = 'none';
    const loginForm = document.getElementById('login-form');
    loginForm.style.display = 'block';
    loginForm.style.animation = 'none';
    loginForm.offsetHeight;
    loginForm.style.animation = '';
    document.getElementById('login-email')?.focus();
    clearErrors();
  });
}

// ── Login ────────────────────────────────────────────────────
function initLoginForm() {
  const form = document.getElementById('login-submit');
  form?.addEventListener('click', handleLogin);

  // Enter key support
  ['login-email', 'login-password'].forEach(id => {
    document.getElementById(id)?.addEventListener('keydown', e => {
      if (e.key === 'Enter') handleLogin();
    });
  });
}

function handleLogin() {
  const email    = document.getElementById('login-email')?.value.trim();
  const password = document.getElementById('login-password')?.value;
  const remember = document.getElementById('login-remember')?.checked;

  clearErrors();

  // Validation
  if (!email) return showError('login', 'Please enter your email address.');
  if (!isValidEmail(email)) return showError('login', 'Please enter a valid email address.');
  if (!password) return showError('login', 'Please enter your password.');

  // Simulate loading
  const btn = document.getElementById('login-submit');
  btn.classList.add('loading');

  setTimeout(() => {
    const result = Auth.login(email, password, remember);
    btn.classList.remove('loading');

    if (result.success) {
      // Success animation then redirect
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20" style="color:#10b981"><polyline points="20 6 9 17 4 12"/></svg>
        <span class="btn-text" style="color:#10b981">Welcome back!</span>
      `;
      btn.style.background = 'rgba(16,185,129,0.15)';
      btn.style.boxShadow = '0 4px 20px rgba(16,185,129,0.3)';

      setTimeout(() => {
        window.location.href = '../index.html';
      }, 800);
    } else {
      showError('login', result.error);
      shakeInput(document.getElementById('login-password'));
    }
  }, 600);
}

// ── Register ─────────────────────────────────────────────────
function initRegisterForm() {
  const form = document.getElementById('register-submit');
  form?.addEventListener('click', handleRegister);

  // Enter key on last field
  document.getElementById('reg-confirm')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleRegister();
  });
}

function handleRegister() {
  const name     = document.getElementById('reg-name')?.value.trim();
  const email    = document.getElementById('reg-email')?.value.trim();
  const password = document.getElementById('reg-password')?.value;
  const confirm  = document.getElementById('reg-confirm')?.value;

  clearErrors();

  // Validation
  if (!name) return showError('register', 'Please enter your full name.');
  if (name.length < 2) return showError('register', 'Name must be at least 2 characters.');
  if (!email) return showError('register', 'Please enter your email address.');
  if (!isValidEmail(email)) return showError('register', 'Please enter a valid email address.');
  if (!password) return showError('register', 'Please create a password.');
  if (password.length < 6) return showError('register', 'Password must be at least 6 characters.');
  if (password !== confirm) {
    showError('register', 'Passwords do not match.');
    shakeInput(document.getElementById('reg-confirm'));
    return;
  }

  // Simulate loading
  const btn = document.getElementById('register-submit');
  btn.classList.add('loading');

  setTimeout(() => {
    const result = Auth.register(name, email, password);
    btn.classList.remove('loading');

    if (result.success) {
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20" style="color:#10b981"><polyline points="20 6 9 17 4 12"/></svg>
        <span class="btn-text" style="color:#10b981">Account created!</span>
      `;
      btn.style.background = 'rgba(16,185,129,0.15)';
      btn.style.boxShadow = '0 4px 20px rgba(16,185,129,0.3)';

      setTimeout(() => {
        window.location.href = '../index.html';
      }, 800);
    } else {
      showError('register', result.error);
    }
  }, 800);
}

// ── Demo Login ───────────────────────────────────────────────
function initDemoButtons() {
  const handler = () => {
    // Create a demo session directly — no registration needed
    Auth._createSession({
      id: 'demo_user',
      name: 'Demo User',
      email: 'demo@devportfolio.com',
    });

    Utils.toast('Welcome to DevPortfolio! 🚀', 'success', 2000);
    setTimeout(() => {
      window.location.href = '../index.html';
    }, 500);
  };

  document.getElementById('demo-login-btn')?.addEventListener('click', handler);
  document.getElementById('demo-register-btn')?.addEventListener('click', handler);
}

// ── Forgot Password ──────────────────────────────────────────
function initForgotPassword() {
  document.getElementById('forgot-btn')?.addEventListener('click', () => {
    Utils.toast('This is a demo — no password reset needed. Just create a new account!', 'info', 4000);
  });
}

// ── Password Visibility Toggle ───────────────────────────────
function initPasswordToggles() {
  setupPwToggle('login-pw-toggle', 'login-password');
  setupPwToggle('reg-pw-toggle', 'reg-password');
}

function setupPwToggle(toggleId, inputId) {
  const toggle = document.getElementById(toggleId);
  const input  = document.getElementById(inputId);
  if (!toggle || !input) return;

  toggle.addEventListener('click', () => {
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    toggle.innerHTML = isPassword
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
    toggle.title = isPassword ? 'Hide password' : 'Show password';
  });
}

// ── Password Strength Meter ──────────────────────────────────
function initPasswordStrength() {
  document.getElementById('reg-password')?.addEventListener('input', e => {
    const pw = e.target.value;
    const strength = getPasswordStrength(pw);
    updateStrengthUI(strength);
  });
}

function getPasswordStrength(pw) {
  if (!pw) return { score: 0, label: '' };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score: 1, label: 'Weak', cls: 'weak' };
  if (score <= 2) return { score: 2, label: 'Fair', cls: 'weak' };
  if (score <= 3) return { score: 3, label: 'Good', cls: 'medium' };
  return { score: 4, label: 'Strong', cls: 'strong' };
}

function updateStrengthUI({ score, label, cls }) {
  for (let i = 1; i <= 4; i++) {
    const bar = document.getElementById(`str-${i}`);
    if (bar) {
      bar.className = 'strength-bar';
      if (i <= score) bar.classList.add(cls);
    }
  }
  const labelEl = document.getElementById('pw-strength-label');
  if (labelEl) {
    labelEl.textContent = label;
    labelEl.style.color = cls === 'strong' ? 'var(--color-success)'
                        : cls === 'medium' ? 'var(--color-warning)'
                        : cls === 'weak'   ? 'var(--color-danger)' : '';
  }
}

// ── Error Handling ───────────────────────────────────────────
function showError(form, message) {
  const errorEl  = document.getElementById(`${form}-error`);
  const errorMsg = document.getElementById(`${form}-error-msg`);
  if (errorEl && errorMsg) {
    errorMsg.textContent = message;
    errorEl.classList.add('visible');
    // Re-trigger shake
    errorEl.style.animation = 'none';
    errorEl.offsetHeight;
    errorEl.style.animation = '';
  }
}

function clearErrors() {
  document.querySelectorAll('.auth-error').forEach(el => {
    el.classList.remove('visible');
  });
}

function shakeInput(input) {
  if (!input) return;
  input.style.animation = 'none';
  input.offsetHeight;
  input.style.animation = 'shake 400ms ease';
  input.focus();
}

// ── Helpers ──────────────────────────────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

