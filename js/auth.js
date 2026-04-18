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

  // Register new user (Async via Azure API)
  async register(username, password, displayName) {
    username = username.trim().toLowerCase();
    displayName = displayName.trim();

    // Validate locally first
    if (!username || username.length < 3) return { ok: false, error: 'Имя пользователя минимум 3 символа' };
    if (!/^[a-z0-9_]+$/.test(username)) return { ok: false, error: 'Только латиница, цифры и _' };
    if (!password || password.length < 4) return { ok: false, error: 'Пароль минимум 4 символа' };
    if (!displayName || displayName.length < 2) return { ok: false, error: 'Введите отображаемое имя' };

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, displayName })
      });
      const data = await response.json();
      
      if (!data.ok) return data;
      
      this._startSession(data);
      return { ok: true };
    } catch (e) {
      console.error(e);
      // Fallback for local testing without API running
      return this._fallbackRegister(username, password, displayName);
    }
  },

  // Login existing user (Async via Azure API)
  async login(username, password) {
    username = username.trim().toLowerCase();
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      
      if (!data.ok) return data;
      
      this._startSession(data);
      return { ok: true };
    } catch (e) {
      console.error(e);
      // Fallback for local testing without API
      return this._fallbackLogin(username, password);
    }
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
  async getLeaderboard() {
    try {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      if (data.ok && data.leaderboard) {
        return data.leaderboard;
      }
      throw new Error("Invalid API response");
    } catch (e) {
      console.warn("Leaderboard API failed, falling back to local storage", e);
      // Fallback
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
    }
  },

  // Fallback for local without API
  _fallbackRegister(username, password, displayName) {
    const users = this.getUsers();
    if (users[username]) return { ok: false, error: 'Пользователь уже существует (локально)' };
    users[username] = {
      username, displayName,
      passwordHash: this._hash(password),
      createdAt: new Date().toISOString(),
      avatar: this._generateAvatar(displayName)
    };
    this.saveUsers(users);
    this._startSession(users[username]);
    return { ok: true };
  },

  _fallbackLogin(username, password) {
    const users = this.getUsers();
    const user = users[username];
    if (!user) return { ok: false, error: 'Пользователь не найден (локально)' };
    if (user.passwordHash !== this._hash(password)) return { ok: false, error: 'Неверный пароль' };
    this._startSession(user);
    return { ok: true };
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

  async handleLogin() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    const submitBtn = document.querySelector('#auth-form-login .auth-submit');
    const oldText = submitBtn.textContent;
    submitBtn.textContent = 'Вход...';
    submitBtn.disabled = true;

    try {
      const result = await this.login(username, password);
      if (result.ok) {
        document.getElementById('auth-modal-overlay')?.remove();
        window.location.hash = 'dashboard';
        App.init();
      } else {
        errorEl.textContent = result.error;
        errorEl.classList.remove('hidden');
      }
    } finally {
      submitBtn.textContent = oldText;
      submitBtn.disabled = false;
    }
  },

  async handleRegister() {
    const name = document.getElementById('reg-name').value;
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const errorEl = document.getElementById('reg-error');
    const submitBtn = document.querySelector('#auth-form-register .auth-submit');
    const oldText = submitBtn.textContent;
    submitBtn.textContent = 'Регистрация...';
    submitBtn.disabled = true;

    try {
      const result = await this.register(username, password, name);
      if (result.ok) {
        document.getElementById('auth-modal-overlay')?.remove();
        window.location.hash = 'dashboard';
        App.init();
      } else {
        errorEl.textContent = result.error;
        errorEl.classList.remove('hidden');
      }
    } finally {
      submitBtn.textContent = oldText;
      submitBtn.disabled = false;
    }
  },

  async loginDemo() {
    const submitBtn = document.querySelector('.auth-demo-btn');
    if(submitBtn) {
       submitBtn.textContent = 'Вход...';
       submitBtn.disabled = true;
    }
    
    // Create/login demo user
    let result = await this.login('demo', 'demo123');
    if (!result.ok) {
      result = await this.register('demo', 'demo123', 'Demo User');
    }
    
    document.getElementById('auth-modal-overlay')?.remove();
    window.location.hash = 'dashboard';
    if (typeof ProgressManager !== 'undefined') await ProgressManager.initCloud();
    App.init();
  }
};
