/**
 * auth.js — localStorage-based simulated authentication
 * Stores users & session in localStorage. No real backend.
 */

const AUTH_KEYS = {
  USERS:   'dpb_auth_users',
  SESSION: 'dpb_auth_session',
};

const Auth = {

  // ── Get all registered users ──────────────────────────────
  _getUsers() {
    try {
      return JSON.parse(localStorage.getItem(AUTH_KEYS.USERS)) || [];
    } catch { return []; }
  },

  _saveUsers(users) {
    localStorage.setItem(AUTH_KEYS.USERS, JSON.stringify(users));
  },

  // ── Register ──────────────────────────────────────────────
  register(name, email, password) {
    const users = Auth._getUsers();
    const emailLower = email.toLowerCase().trim();

    if (users.find(u => u.email === emailLower)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const user = {
      id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      email: emailLower,
      password: password,  // In a real app, this would be hashed
      createdAt: new Date().toISOString(),
    };

    users.push(user);
    Auth._saveUsers(users);

    // Auto-login after register
    Auth._createSession(user);

    // Pre-fill the profile name from registration
    try {
      const profileKey = 'dpb_profile';
      const existing = JSON.parse(localStorage.getItem(profileKey) || '{}');
      if (!existing.name) {
        existing.name = user.name;
        existing.email = user.email;
        localStorage.setItem(profileKey, JSON.stringify(existing));
      }
    } catch {}

    return { success: true, user: { id: user.id, name: user.name, email: user.email } };
  },

  // ── Login ─────────────────────────────────────────────────
  login(email, password, remember = false) {
    const users = Auth._getUsers();
    const emailLower = email.toLowerCase().trim();
    const user = users.find(u => u.email === emailLower);

    if (!user) {
      return { success: false, error: 'No account found with this email.' };
    }
    if (user.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    Auth._createSession(user, remember);
    return { success: true, user: { id: user.id, name: user.name, email: user.email } };
  },

  // ── Session ───────────────────────────────────────────────
  _createSession(user, remember = false) {
    const session = {
      userId: user.id,
      name: user.name,
      email: user.email,
      remember: remember,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(AUTH_KEYS.SESSION, JSON.stringify(session));
  },

  getSession() {
    try {
      return JSON.parse(localStorage.getItem(AUTH_KEYS.SESSION));
    } catch { return null; }
  },

  isLoggedIn() {
    return Auth.getSession() !== null;
  },

  // ── Logout ────────────────────────────────────────────────
  logout() {
    localStorage.removeItem(AUTH_KEYS.SESSION);
  },

  // ── Auth Guard — call on every protected page ─────────────
  // Redirects to auth page if not logged in.
  guard(authPagePath) {
    if (!Auth.isLoggedIn()) {
      window.location.href = authPagePath || 'pages/auth.html';
      return false;
    }
    return true;
  },
};

window.Auth = Auth;

