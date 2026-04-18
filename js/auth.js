// ============================================
// AUTH MANAGER — Multi-user registration/login
// Uses localStorage with per-user namespacing
// No backend required — fully client-side
// ============================================

const Auth = {
  USERS_KEY: 'de_platform_users',
  SESSION_KEY: 'de_platform_session',

  // Get all registered users
  getUsers() {
    try {
      return JSON.parse(localStorage.getItem(this.USERS_KEY) || '{}');
    } catch { return {}; }
  },

  // Save users registry
  saveUsers(users) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  },

  // Get current session
  getSession() {
    try {
      return JSON.parse(sessionStorage.getItem(this.SESSION_KEY) || 'null');
    } catch { return null; }
  },

  // Check if logged in
  isLoggedIn() {
    return this.getSession() !== null;
  },

  // Get current user info
  getCurrentUser() {
    return this.getSession();
  },

  // Register new user
  register(username, password, displayName) {
    username = username.trim().toLowerCase();
    displayName = displayName.trim();

    // Validate
    if (!username || username.length < 3) return { ok: false, error: 'Имя пользователя минимум 3 символа' };
    if (!/^[a-z0-9_]+$/.test(username)) return { ok: false, error: 'Только латиница, цифры и _' };
    if (!password || password.length < 4) return { ok: false, error: 'Пароль минимум 4 символа' };
    if (!displayName || displayName.length < 2) return { ok: false, error: 'Введите отображаемое имя' };

    const users = this.getUsers();
    if (users[username]) return { ok: false, error: 'Пользователь уже существует' };

    // Store user (password hashed with simple method)
    users[username] = {
      username,
      displayName,
      passwordHash: this._hash(password),
      createdAt: new Date().toISOString(),
      avatar: this._generateAvatar(displayName)
    };
    this.saveUsers(users);

    // Auto-login
    this._startSession(users[username]);
    return { ok: true };
  },

  // Login existing user
  login(username, password) {
    username = username.trim().toLowerCase();
    const users = this.getUsers();
    const user = users[username];

    if (!user) return { ok: false, error: 'Пользователь не найден' };
    if (user.passwordHash !== this._hash(password)) return { ok: false, error: 'Неверный пароль' };

    this._startSession(user);
    return { ok: true };
  },

  // Logout
  logout() {
    sessionStorage.removeItem(this.SESSION_KEY);
  },

  // Get progress storage key for current user
  getUserProgressKey() {
    const session = this.getSession();
    if (!session) return 'de_learning_progress_guest';
    return `de_learning_progress_${session.username}`;
  },

  // Get all users with their stats (for leaderboard)
  getLeaderboard() {
    const users = this.getUsers();
    return Object.values(users).map(u => {
      const key = `de_learning_progress_${u.username}`;
      try {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        const tasksCount = Object.values(data.solvedTasks || {}).filter(t => t.solved).length;
        const lecturesCount = (data.completedLectures || []).length;
        const score = tasksCount * 3 + lecturesCount * 2;
        return {
          username: u.username,
          displayName: u.displayName,
          avatar: u.avatar,
          score,
          tasksCount,
          lecturesCount,
          createdAt: u.createdAt
        };
      } catch {
        return { username: u.username, displayName: u.displayName, avatar: u.avatar, score: 0 };
      }
    }).sort((a, b) => b.score - a.score);
  },

  // Private: start session
  _startSession(user) {
    const session = {
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
      loginAt: new Date().toISOString()
    };
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
  },

  // Private: simple hash (not cryptographic, just obfuscation)
  _hash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  },

  // Private: generate avatar emoji from name
  _generateAvatar(name) {
    const avatars = ['🚀', '⚡', '🔥', '💎', '🎯', '🌟', '🦁', '🐉', '🦊', '🐺', '🦅', '🌊', '🏔️', '🎮', '🤖'];
    const index = name.charCodeAt(0) % avatars.length;
    return avatars[index];
  },

  // --- Auth Modal UI ---

  showAuthModal(defaultTab = 'login') {
    // Remove existing modal
    document.getElementById('auth-modal-overlay')?.remove();

    const overlay = document.createElement('div');
    overlay.id = 'auth-modal-overlay';
    overlay.className = 'auth-modal-overlay';
    overlay.innerHTML = `
      <div class="auth-modal" id="auth-modal">
        <div class="auth-modal-header">
          <div class="auth-logo">⚡ <span>DE Platform</span></div>
          <p>Платформа обучения Data Engineering</p>
        </div>

        <div class="auth-tabs">
          <button class="auth-tab ${defaultTab === 'login' ? 'active' : ''}" onclick="Auth.switchAuthTab('login')" id="tab-login">Войти</button>
          <button class="auth-tab ${defaultTab === 'register' ? 'active' : ''}" onclick="Auth.switchAuthTab('register')" id="tab-register">Регистрация</button>
        </div>

        <!-- Login Form -->
        <div id="auth-form-login" class="${defaultTab === 'login' ? '' : 'hidden'}">
          <div class="auth-field">
            <label>Имя пользователя</label>
            <input type="text" id="login-username" placeholder="username" autocomplete="username">
          </div>
          <div class="auth-field">
            <label>Пароль</label>
            <input type="password" id="login-password" placeholder="••••••••" autocomplete="current-password">
          </div>
          <div id="login-error" class="auth-error hidden"></div>
          <button class="auth-submit" onclick="Auth.handleLogin()">Войти</button>
        </div>

        <!-- Register Form -->
        <div id="auth-form-register" class="${defaultTab === 'register' ? '' : 'hidden'}">
          <div class="auth-field">
            <label>Отображаемое имя</label>
            <input type="text" id="reg-name" placeholder="Иван Иванов" autocomplete="name">
          </div>
          <div class="auth-field">
            <label>Имя пользователя (логин)</label>
            <input type="text" id="reg-username" placeholder="ivan_ivanov" autocomplete="username">
          </div>
          <div class="auth-field">
            <label>Пароль</label>
            <input type="password" id="reg-password" placeholder="Минимум 4 символа" autocomplete="new-password">
          </div>
          <div id="reg-error" class="auth-error hidden"></div>
          <button class="auth-submit" onclick="Auth.handleRegister()">Создать аккаунт</button>
        </div>

        <div class="auth-demo">
          <button onclick="Auth.loginDemo()" class="auth-demo-btn">🎯 Войти как гость (demo)</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Enter key support
    overlay.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const activeTab = document.querySelector('.auth-tab.active')?.id;
        if (activeTab === 'tab-login') Auth.handleLogin();
        else Auth.handleRegister();
      }
    });

    // Focus first field
    setTimeout(() => {
      const f = document.getElementById(defaultTab === 'login' ? 'login-username' : 'reg-name');
      if (f) f.focus();
    }, 100);
  },

  switchAuthTab(tab) {
    document.getElementById('auth-form-login').classList.toggle('hidden', tab !== 'login');
    document.getElementById('auth-form-register').classList.toggle('hidden', tab !== 'register');
    document.getElementById('tab-login').classList.toggle('active', tab === 'login');
    document.getElementById('tab-register').classList.toggle('active', tab === 'register');
  },

  handleLogin() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');

    const result = this.login(username, password);
    if (result.ok) {
      document.getElementById('auth-modal-overlay').remove();
      // Force to dashboard
      window.location.hash = 'dashboard';
      App.init();
    } else {
      errorEl.textContent = result.error;
      errorEl.classList.remove('hidden');
    }
  },

  handleRegister() {
    const name = document.getElementById('reg-name').value;
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const errorEl = document.getElementById('reg-error');

    const result = this.register(username, password, name);
    if (result.ok) {
      document.getElementById('auth-modal-overlay').remove();
      // Force to dashboard
      window.location.hash = 'dashboard';
      App.init();
    } else {
      errorEl.textContent = result.error;
      errorEl.classList.remove('hidden');
    }
  },

  loginDemo() {
    // Create/login demo user
    const users = this.getUsers();
    if (!users['demo']) {
      this.register('demo', 'demo123', 'Demo User');
    } else {
      this.login('demo', 'demo123');
    }
    document.getElementById('auth-modal-overlay')?.remove();
    // Force to dashboard so hashchange fires
    window.location.hash = 'dashboard';
    App.init();
  }
};
