// ============================================
// APP — Main SPA Router & Page Rendering
// ============================================

const App = {
  currentPage: 'dashboard',
  currentModuleId: null,
  currentTab: 'lectures',
  currentTaskId: null,

  _routerInitialized: false,

  // Initialize (can be called multiple times safely)
  init() {
    // Auth guard — show login if not logged in
    if (typeof Auth !== 'undefined' && !Auth.isLoggedIn()) {
      Auth.showAuthModal('login');
      return;
    }

    // Register hashchange only once
    if (!this._routerInitialized) {
      window.addEventListener('hashchange', () => this.handleRoute());
      this._routerInitialized = true;
    }

    this.updateSidebarUser();
    // Force navigate to dashboard if on root or empty hash
    const hash = window.location.hash;
    if (!hash || hash === '#' || hash === '#dashboard') {
      window.location.hash = 'dashboard';
    } else {
      this.handleRoute();
    }
  },

  // Update sidebar with user profile
  updateSidebarUser() {
    const user = typeof Auth !== 'undefined' ? Auth.getCurrentUser() : null;
    if (!user) return;
    const stats = ProgressManager.getStats();
    const level = stats.level;
    const xpPct = level.next ? Math.round(((stats.xp - (level.rank === 0 ? 0 : [0,20,100,300,800,2000][level.rank])) / ((level.xpForNext || 1) - (level.rank === 0 ? 0 : [0,20,100,300,800,2000][level.rank]))) * 100) : 100;
    
    // Inject user bar at top of sidebar-nav
    const nav = document.querySelector('.sidebar-nav');
    if (nav && !document.getElementById('user-profile-bar')) {
      const bar = document.createElement('div');
      bar.id = 'user-profile-bar';
      bar.className = 'user-profile-bar';
      bar.onclick = () => App.navigate('progress');
      bar.innerHTML = `
        <div class="user-avatar">${user.avatar || '⚡'}</div>
        <div class="user-info">
          <div class="user-display-name">${user.displayName}</div>
          <div class="user-xp-label">${level.icon} ${level.name} · ${stats.xp} XP</div>
          <div class="user-xp-bar-mini">
            <div class="user-xp-bar-fill" style="width:${xpPct}%"></div>
          </div>
        </div>
      `;
      nav.insertBefore(bar, nav.firstChild);
    } else if (document.getElementById('user-profile-bar')) {
      // Update existing
      const bar = document.getElementById('user-profile-bar');
      bar.querySelector('.user-display-name').textContent = user.displayName;
      bar.querySelector('.user-xp-label').textContent = `${level.icon} ${level.name} · ${stats.xp} XP`;
      bar.querySelector('.user-xp-bar-fill').style.width = xpPct + '%';
    }

    // Add progress indicator to module nav links
    document.querySelectorAll('.nav-link[data-page="module"]').forEach(link => {
      const href = link.getAttribute('href') || '';
      const mId = parseInt(href.replace('#module/', ''));
      if (!mId) return;
      const pct = ProgressManager.getModuleProgress(mId);
      let bar = link.querySelector('.nav-progress-bar');
      if (!bar) {
        bar = document.createElement('div');
        bar.className = 'nav-progress-bar';
        link.appendChild(bar);
      }
      bar.style.width = pct + '%';
    });
  },

  // Hash-based router
  handleRoute() {
    // Guard: never route if not logged in
    if (typeof Auth !== 'undefined' && !Auth.isLoggedIn()) {
      Auth.showAuthModal('login');
      return;
    }

    const hash = window.location.hash.slice(1) || 'dashboard';
    const parts = hash.split('/');
    const page = parts[0];
    const param = parts[1];
    const param2 = parts[2];

    this.currentPage = page;
    this.updateNav(page);

    try {
      switch (page) {
        case 'dashboard':
          this.renderDashboard();
          break;
        case 'module':
          this.currentModuleId = parseInt(param);
          this.currentTab = param2 || 'lectures';
          this.renderModule(this.currentModuleId, this.currentTab);
          break;
        case 'practice':
          this.currentModuleId = parseInt(param);
          this.currentTaskId = param2 || null;
          this.renderPractice(this.currentModuleId, this.currentTaskId);
          break;
        case 'interview':
          this.renderInterview();
          break;
        case 'progress':
          this.renderProgress();
          break;
        default:
          this.renderDashboard();
      }
    } catch (err) {
      console.error('[App] Route error:', err);
      this.render(`<div class="container"><div class="empty-state"><div class="empty-icon">⚠️</div><h3>Ошибка загрузки</h3><p>${err.message}</p><button class="btn btn-primary" onclick="App.navigate('dashboard')">На главную</button></div></div>`);
    }
  },

  // Navigate
  navigate(page, param, param2) {
    let hash = page;
    if (param !== undefined) hash += '/' + param;
    if (param2 !== undefined) hash += '/' + param2;
    window.location.hash = hash;
  },

  // Update active nav link
  updateNav(page) {
    document.querySelectorAll('.nav-link').forEach(el => {
      el.classList.toggle('active', el.dataset.page === page);
    });
  },

  // Render into main content
  render(html) {
    const main = document.getElementById('main-content');
    main.innerHTML = html;
    main.className = 'main-content page-enter';
  },

  // =============================================
  // DASHBOARD
  // =============================================
  renderDashboard() {
    const stats = ProgressManager.getStats();
    
    const html = `
      <div class="container">
        <div class="hero">
          <div class="hero-content">
            <h1>Data Engineering <span>Learning Platform</span></h1>
            <p>Полный путь от Junior до Senior Data Engineer — лекции, практика с Code Playground, лабораторные работы и 200+ вопросов для собеседования.</p>
            <div class="stats-row">
              <div class="stat-item">
                <div class="stat-value">${MODULES_DATA.length}</div>
                <div class="stat-label">Модулей</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">${TASKS_DATA.length}+</div>
                <div class="stat-label">Задач</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">${QUESTIONS_DATA.length}+</div>
                <div class="stat-label">Вопросов</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">${stats.totalTasks}</div>
                <div class="stat-label">Решено</div>
              </div>
            </div>
          </div>
        </div>

        <div class="page-header">
          <h1>🟢 Junior</h1>
          <p>Основы: SQL, Python, Data Modeling, Git</p>
        </div>
        <div class="cards-grid stagger-enter">
          ${MODULES_DATA.filter(m => m.level === 'junior').map(m => Components.moduleCard(m)).join('')}
        </div>

        <div class="page-header" style="margin-top:48px;">
          <h1>🟡 Middle</h1>
          <p>Docker, Airflow, Spark, dbt</p>
        </div>
        <div class="cards-grid stagger-enter">
          ${MODULES_DATA.filter(m => m.level === 'middle').map(m => Components.moduleCard(m)).join('')}
        </div>

        <div class="page-header" style="margin-top:48px;">
          <h1>🔴 Senior</h1>
          <p>Kafka, Cloud, Data Quality, System Design</p>
        </div>
        <div class="cards-grid stagger-enter">
          ${MODULES_DATA.filter(m => m.level === 'senior').map(m => Components.moduleCard(m)).join('')}
        </div>
      </div>
    `;
    this.render(html);
  },

  // =============================================
  // MODULE PAGE
  // =============================================
  renderModule(moduleId, activeTab) {
    const mod = MODULES_DATA.find(m => m.id === moduleId);
    if (!mod) { this.renderDashboard(); return; }

    const tabItems = [
      { id: 'lectures', icon: '📖', label: 'Лекции' },
      { id: 'practice', icon: '💻', label: 'Практика' },
      { id: 'lab', icon: '🔬', label: 'Лаборатория' }
    ];

    let contentHtml = '';

    if (activeTab === 'lectures') {
      contentHtml = mod.lectures.map((lec, i) => {
        const completed = ProgressManager.isLectureCompleted(moduleId, lec.id);
        return `
          <div style="margin-bottom:32px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
              <h2 style="font-size:22px;font-weight:700;margin:0;">
                ${completed ? '✅' : '📖'} Лекция ${i + 1}: ${lec.title}
              </h2>
              ${!completed ? `<button class="btn btn-sm btn-outline" onclick="ProgressManager.completeLecture(${moduleId}, ${lec.id});App.renderModule(${moduleId},'lectures');App.updateSidebarUser();Components.toast('📖 Лекция прочитана! +10 XP','success');">
                Отметить прочитанной
              </button>` : ''}
            </div>
            <div class="lecture-content">${lec.content}</div>
          </div>
        `;
      }).join('<hr style="border-color:var(--border);margin:32px 0;">');
    } else if (activeTab === 'practice') {
      // Redirect to practice page
      this.navigate('practice', moduleId);
      return;
    } else if (activeTab === 'lab') {
      const lab = mod.lab;
      contentHtml = `
        <div class="lab-content">
          <h2 style="font-size:24px;font-weight:700;margin-bottom:8px;">🔬 ${lab.title}</h2>
          <p style="color:var(--text-secondary);margin-bottom:32px;">${lab.description}</p>
          ${lab.steps.map((step, i) => `
            <div class="lab-step">
              <div class="lab-step-number">${i + 1}</div>
              <div class="lab-step-content">
                <h4>${step.title}</h4>
                <p>${step.description}</p>
              </div>
            </div>
          `).join('')}
          <button class="btn btn-success" onclick="ProgressManager.completeLab(${moduleId});Components.toast('Лаборатория завершена!','success');App.renderModule(${moduleId},'lab');">
            ✅ Отметить как завершённую
          </button>
        </div>
      `;
    }

    const html = `
      <div class="container">
        ${Components.breadcrumb([
          { label: '🏠 Главная', route: 'dashboard' },
          { label: `Модуль ${mod.id}: ${mod.title}`, route: 'module', param: moduleId }
        ])}
        
        <div class="page-header">
          <h1>${mod.icon} ${mod.title}</h1>
          <p>${mod.description}</p>
        </div>

        ${Components.tabs(tabItems, activeTab, 'App.switchModuleTab')}

        <div class="tab-content active">
          ${contentHtml}
        </div>
      </div>
    `;
    this.render(html);
  },

  switchModuleTab(tabId) {
    if (tabId === 'practice') {
      this.navigate('practice', this.currentModuleId);
    } else {
      this.navigate('module', this.currentModuleId, tabId);
    }
  },

  // =============================================
  // PRACTICE / CODE PLAYGROUND
  // =============================================
  async renderPractice(moduleId, taskId) {
    const moduleTasks = TASKS_DATA.filter(t => t.module === moduleId);
    
    if (moduleTasks.length === 0) {
      this.render(`
        <div class="container">
          ${Components.breadcrumb([
            { label: '🏠 Главная', route: 'dashboard' },
            { label: `Модуль ${moduleId}`, route: 'module', param: moduleId }
          ])}
          <div class="empty-state">
            <div class="empty-icon">🚧</div>
            <h3>Задачи в разработке</h3>
            <p>Задачи для этого модуля будут добавлены скоро. Пока попробуйте модули 1 и 2!</p>
            <button class="btn btn-primary" onclick="App.navigate('practice', 1)" style="margin-top:16px;">Перейти к SQL задачам</button>
          </div>
        </div>
      `);
      return;
    }

    const task = taskId 
      ? moduleTasks.find(t => t.id === taskId) 
      : moduleTasks[0];
    
    if (!task) { this.renderDashboard(); return; }
    
    const taskIndex = moduleTasks.indexOf(task);
    const savedCode = ProgressManager.getTaskCode(task.id);

    const html = `
      <div class="playground-container" id="playground">
        <div class="playground-left">
          <div style="padding:8px 12px;background:var(--bg-secondary);border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
            <a href="#module/${moduleId}/lectures" style="font-size:13px;color:var(--text-tertiary);">◀ Модуль ${moduleId}</a>
            <span style="font-size:13px;color:var(--text-tertiary);">Задача ${taskIndex + 1} / ${moduleTasks.length}</span>
          </div>
          <div class="task-panel">
            <div class="task-header">
              <div>
                <span class="level-badge ${task.difficulty}">${task.difficulty === 'junior' ? '🟢 Junior' : task.difficulty === 'middle' ? '🟡 Middle' : '🔴 Senior'}</span>
                <span style="font-size:12px;color:var(--text-tertiary);margin-left:8px;">${task.language.toUpperCase()}</span>
              </div>
              <div class="task-nav">
                ${taskIndex > 0 ? `<button class="task-nav-btn" onclick="App.loadTask('${moduleTasks[taskIndex-1].id}')">◀</button>` : ''}
                ${taskIndex < moduleTasks.length - 1 ? `<button class="task-nav-btn" onclick="App.loadTask('${moduleTasks[taskIndex+1].id}')">▶</button>` : ''}
              </div>
            </div>
            <h2 class="task-title" style="margin-bottom:16px;">${task.title}</h2>
            <div class="task-description">${task.description}</div>
            
            ${task.language === 'sql' && task.setupSQL ? `
              <div style="margin-top:16px;">
                <p style="font-weight:600;font-size:14px;color:var(--text-primary);margin-bottom:8px;">📋 Таблицы:</p>
                ${Components.schemaTable(task.setupSQL)}
              </div>
              ${task.expectedColumns ? Components.expectedResultTable(task.expectedColumns, task.expectedResult) : ''}
            ` : ''}
            
            ${task.language === 'python' && task.testCases ? `
              <div style="margin-top:16px;">
                <p style="font-weight:600;font-size:14px;color:var(--text-primary);margin-bottom:8px;">🧪 Примеры:</p>
                ${task.testCases.slice(0, 2).map(tc => `
                  <div style="background:var(--bg-code);border:1px solid var(--border);border-radius:8px;padding:8px 12px;margin:8px 0;font-size:12px;font-family:var(--font-code);">
                    <div style="color:var(--text-tertiary);">Input:</div>
                    <div style="color:var(--text-primary);">${tc.input}</div>
                    <div style="color:var(--text-tertiary);margin-top:4px;">Expected:</div>
                    <div style="color:var(--success);">${tc.expected}</div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            ${Components.hintsSection(task.hints)}

            <div style="margin-top:16px;">
              <button class="btn-solution btn btn-sm" onclick="App.showSolution()">
                👁 Показать решение
              </button>
              <div id="solution-content" style="display:none;margin-top:12px;">
                <div class="code-block">
                  <div class="code-block-header"><span class="code-block-lang">${task.language}</span></div>
                  <pre><code>${task.solution}</code></pre>
                </div>
              </div>
            </div>

            <div style="margin-top:16px;">
              <p style="font-size:12px;color:var(--text-tertiary);">
                ${moduleTasks.map((t, i) => {
                  const solved = ProgressManager.isTaskSolved(t.id);
                  const active = t.id === task.id;
                  return `<span onclick="App.loadTask('${t.id}')" style="cursor:pointer;display:inline-block;width:24px;height:24px;line-height:24px;text-align:center;border-radius:4px;margin:2px;font-size:11px;${active ? 'background:var(--primary);color:white;' : solved ? 'background:var(--success);color:white;' : 'background:var(--bg-tertiary);color:var(--text-tertiary);'}">${i+1}</span>`;
                }).join('')}
              </p>
            </div>
          </div>
        </div>

        <div class="resizer" id="resizer"></div>

        <div class="playground-right">
          <div class="editor-panel">
            <div class="editor-header">
              <div class="editor-lang">
                <span>${task.language === 'sql' ? '🗃️ SQL' : '🐍 Python'}</span>
              </div>
              <div class="editor-actions">
                <button class="btn btn-reset btn-sm" onclick="App.resetCode()">🔄 Сбросить</button>
                <button class="btn btn-run btn-sm" onclick="App.runCode()" id="run-btn">▶ Запустить</button>
              </div>
            </div>
            <div class="editor-wrapper" id="editor-container"></div>
          </div>

          <div class="resizer-h" id="resizer-h"></div>

          <div class="output-panel">
            <div class="output-header">
              <span class="output-title">📊 Результат</span>
              <button class="btn btn-ghost btn-sm" onclick="App.checkCode()" id="check-btn">✅ Проверить</button>
            </div>
            <div class="output-body" id="output-body">
              <div class="console-output" style="color:var(--text-tertiary);">Нажмите "Запустить" для выполнения кода...</div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    this.render(html);
    this._currentTaskData = task;

    // Init Monaco Editor
    const container = document.getElementById('editor-container');
    const code = savedCode || task.starterCode;
    await Playground.initMonaco(container, task.language, code);

    // Init resizers
    this.initResizers();

    // Show loading for Pyodide
    if (task.language === 'python' && !Playground.pyodideReady) {
      document.getElementById('output-body').innerHTML = 
        '<div class="console-output" style="color:var(--warning);">⏳ Загрузка Python окружения (~15 сек)...</div>';
      Playground.initPyodide((msg) => {
        const out = document.getElementById('output-body');
        if (out) out.innerHTML = `<div class="console-output" style="color:var(--success);">✅ ${msg}</div>`;
      });
    }
  },

  loadTask(taskId) {
    // Save current code
    if (this._currentTaskData && Playground.editor) {
      ProgressManager.saveTaskCode(this._currentTaskData.id, Playground.editor.getValue());
    }
    const task = TASKS_DATA.find(t => t.id === taskId);
    if (task) {
      this.navigate('practice', task.module, taskId);
    }
  },

  showSolution() {
    const sol = document.getElementById('solution-content');
    if (sol) sol.style.display = sol.style.display === 'none' ? 'block' : 'none';
  },

  resetCode() {
    if (this._currentTaskData && Playground.editor) {
      Playground.editor.setValue(this._currentTaskData.starterCode);
    }
  },

  async runCode() {
    if (!Playground.editor || !this._currentTaskData) return;
    
    const btn = document.getElementById('run-btn');
    btn.disabled = true;
    btn.textContent = '⏳ ...';
    
    const code = Playground.editor.getValue();
    const task = this._currentTaskData;
    const output = document.getElementById('output-body');
    
    try {
      if (task.language === 'sql') {
        const { error, results } = await Playground.executeSQL(code, task.setupSQL);
        if (error) {
          output.innerHTML = `<div class="console-output error">❌ Ошибка: ${error}</div>`;
        } else {
          output.innerHTML = Playground.renderResultTable(results.columns, results.values);
        }
      } else {
        const { error, stdout, stderr } = await Playground.executePython(code, (msg) => {
          output.innerHTML = `<div class="console-output" style="color:var(--warning);">${msg}</div>`;
        });
        
        let html = '';
        if (stdout) html += `<div class="console-output">${stdout}</div>`;
        if (stderr) html += `<div class="console-output error">${stderr}</div>`;
        if (error) html += `<div class="console-output error">❌ ${error}</div>`;
        if (!html) html = '<div class="console-output" style="color:var(--success);">✅ Код выполнен (нет вывода)</div>';
        output.innerHTML = html;
      }
    } catch (e) {
      output.innerHTML = `<div class="console-output error">❌ ${e.message}</div>`;
    }
    
    btn.disabled = false;
    btn.textContent = '▶ Запустить';
    ProgressManager.saveTaskCode(task.id, code);
  },

  async checkCode() {
    if (!Playground.editor || !this._currentTaskData) return;
    
    const btn = document.getElementById('check-btn');
    btn.disabled = true;
    btn.textContent = '⏳ ...';
    
    const code = Playground.editor.getValue();
    const task = this._currentTaskData;
    const output = document.getElementById('output-body');
    
    try {
      let result;
      if (task.language === 'sql') {
        result = await Playground.checkSQLTask(task, code);
      } else {
        result = await Playground.checkPythonTask(task, code);
      }
      
      output.innerHTML = Playground.renderTestResults(result);

      if (result.passed) {
        const isNew = ProgressManager.solveTask(task.id, code);
        App.updateSidebarUser();
        Components.toast(isNew ? '🎉 Все тесты пройдены! +25 XP' : '✅ Все тесты пройдены!', 'success');
      }
    } catch (e) {
      output.innerHTML = `<div class="console-output error">❌ ${e.message}</div>`;
    }
    
    btn.disabled = false;
    btn.textContent = '✅ Проверить';
    ProgressManager.saveTaskCode(task.id, code);
  },

  // =============================================
  // INTERVIEW QUESTIONS
  // =============================================
  renderInterview() {
    const allCategories = [...new Set(QUESTIONS_DATA.map(q => q.category))];
    const allLevels = ['junior', 'middle', 'senior'];
    
    let activeCategory = 'all';
    let activeLevel = 'all';
    
    const renderFiltered = () => {
      let filtered = QUESTIONS_DATA;
      if (activeCategory !== 'all') {
        filtered = filtered.filter(q => q.category === activeCategory);
      }
      if (activeLevel !== 'all') {
        filtered = filtered.filter(q => q.level === activeLevel);
      }
      return filtered;
    };
    
    const html = `
      <div class="container">
        <div class="page-header">
          <h1>🎯 Вопросы для собеседования</h1>
          <p>${QUESTIONS_DATA.length}+ реальных вопросов с развёрнутыми ответами</p>
        </div>

        <div class="filters-row">
          <div class="filter-group" id="category-filters">
            <button class="filter-btn active" onclick="App.filterQuestions('category','all')">Все</button>
            ${allCategories.map(c => `<button class="filter-btn" onclick="App.filterQuestions('category','${c}')">${c}</button>`).join('')}
          </div>
        </div>
        <div class="filters-row" style="margin-top:-12px;">
          <div class="filter-group" id="level-filters">
            <button class="filter-btn active" onclick="App.filterQuestions('level','all')">Все уровни</button>
            <button class="filter-btn" onclick="App.filterQuestions('level','junior')">🟢 Junior</button>
            <button class="filter-btn" onclick="App.filterQuestions('level','middle')">🟡 Middle</button>
            <button class="filter-btn" onclick="App.filterQuestions('level','senior')">🔴 Senior</button>
          </div>
          <button class="btn btn-outline btn-sm" onclick="App.randomQuestion()" style="margin-left:auto;">🎲 Случайный</button>
        </div>

        <div id="questions-list">
          ${renderFiltered().map(q => Components.questionCard(q)).join('')}
        </div>
        
        <div id="questions-count" style="text-align:center;padding:16px;color:var(--text-tertiary);font-size:14px;">
          Показано: ${renderFiltered().length} из ${QUESTIONS_DATA.length}
        </div>
      </div>
    `;
    
    this.render(html);
    this._interviewCategory = 'all';
    this._interviewLevel = 'all';
  },

  filterQuestions(type, value) {
    if (type === 'category') this._interviewCategory = value;
    if (type === 'level') this._interviewLevel = value;
    
    // Update active buttons
    const containerId = type === 'category' ? 'category-filters' : 'level-filters';
    document.querySelectorAll(`#${containerId} .filter-btn`).forEach(btn => {
      btn.classList.toggle('active', btn.textContent.includes(value === 'all' ? (type === 'category' ? 'Все' : 'Все уровни') : value));
    });
    // Simple approach: re-match by onclick content
    document.querySelectorAll(`#${containerId} .filter-btn`).forEach(btn => {
      const onclick = btn.getAttribute('onclick') || '';
      btn.classList.toggle('active', onclick.includes(`'${value}'`));
    });
    
    let filtered = QUESTIONS_DATA;
    if (this._interviewCategory !== 'all') {
      filtered = filtered.filter(q => q.category === this._interviewCategory);
    }
    if (this._interviewLevel !== 'all') {
      filtered = filtered.filter(q => q.level === this._interviewLevel);
    }
    
    document.getElementById('questions-list').innerHTML = filtered.map(q => Components.questionCard(q)).join('');
    document.getElementById('questions-count').textContent = `Показано: ${filtered.length} из ${QUESTIONS_DATA.length}`;
  },

  randomQuestion() {
    const q = QUESTIONS_DATA[Math.floor(Math.random() * QUESTIONS_DATA.length)];
    const listEl = document.getElementById('questions-list');
    listEl.innerHTML = Components.questionCard(q);
    // Auto-open
    setTimeout(() => {
      const card = document.getElementById(`q-${q.id}`);
      if (card) card.classList.add('open');
    }, 100);
    document.getElementById('questions-count').textContent = `🎲 Случайный вопрос (${q.category} / ${q.level})`;
  },

  // =============================================
  // PROGRESS PAGE — Full featured
  // =============================================
  renderProgress() {
    const user = typeof Auth !== 'undefined' ? Auth.getCurrentUser() : { displayName: 'Гость', avatar: '👤', username: 'guest' };
    const stats = ProgressManager.getStats();
    const level = stats.level;
    const moduleBreakdown = ProgressManager.getModuleBreakdown();

    // XP bar calculation
    const xpThresholds = [0, 20, 100, 300, 800, 2000, Infinity];
    const prevXp = xpThresholds[level.rank] || 0;
    const nextXp = level.xpForNext || stats.xp;
    const xpInLevel = stats.xp - prevXp;
    const xpNeeded = nextXp - prevXp;
    const xpPct = level.next ? Math.min(100, Math.round((xpInLevel / xpNeeded) * 100)) : 100;

    // Heatmap — last 91 days = 13 weeks × 7 days
    const heatmapWeeks = [];
    const today = new Date();
    for (let w = 12; w >= 0; w--) {
      const weekCells = [];
      for (let d = 6; d >= 0; d--) {
        const date = new Date(today);
        date.setDate(date.getDate() - (w * 7 + d));
        const dateStr = date.toISOString().split('T')[0];
        const entry = stats.activityLog.find(a => a.date === dateStr);
        const lvl = entry ? Math.min(4, Math.ceil(entry.actions / 2)) : 0;
        weekCells.push(`<div class="heatmap-cell level-${lvl}" title="${dateStr}${entry ? ': ' + entry.actions + ' действий' : ''}"></div>`);
      }
      heatmapWeeks.push(`<div class="heatmap-week">${weekCells.join('')}</div>`);
    }

    // Achievements
    const allAchievements = ProgressManager.ACHIEVEMENTS;
    const unlockedIds = stats.achievements || [];
    const achievementsHtml = Object.entries(allAchievements).map(([id, a]) => {
      const unlocked = unlockedIds.includes(id);
      return `
        <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}">
          <div class="achievement-icon">${a.icon}</div>
          <div class="achievement-name">${a.name}</div>
          <div class="achievement-desc">${a.desc}</div>
          ${unlocked ? '<div style="font-size:11px;color:var(--success);margin-top:4px;">✅ Получено</div>' : ''}
        </div>
      `;
    }).join('');

    // Module breakdown
    const modulesHtml = moduleBreakdown.map(m => {
      const isDone = m.pct === 100;
      return `
        <div class="module-progress-item" onclick="App.navigate('module', ${m.id})">
          <div class="module-progress-icon">${m.icon}</div>
          <div class="module-progress-info">
            <div class="module-progress-name">Модуль ${m.id}: ${m.title}</div>
            <div class="module-progress-details">
              <span>📖 ${m.doneLectures}/${m.totalLectures} лекций</span>
              <span>💻 ${m.doneTasks}/${m.totalTasks} задач</span>
              <span>🔬 Лаб: ${m.labDone ? '✅' : '⏳'}</span>
            </div>
            <div class="module-progress-bar-wrap">
              <div class="module-progress-bar-fill ${m.level}" style="width:${m.pct}%"></div>
            </div>
          </div>
          <div class="module-progress-pct ${isDone ? 'done' : ''}">
            ${isDone ? '✅' : m.pct + '%'}
          </div>
        </div>
      `;
    }).join('');

    // Leaderboard
    const leaderboard = typeof Auth !== 'undefined' ? Auth.getLeaderboard() : [];
    const currentUsername = user.username;
    const leaderboardHtml = leaderboard.slice(0, 10).map((u, i) => {
      const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
      const rankIcon = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1);
      const levelObj = ProgressManager._calculateLevel(u.score * 2); // approximate
      return `
        <div class="leaderboard-item ${u.username === currentUsername ? 'me' : ''}">
          <div class="leaderboard-rank ${rankClass}">${rankIcon}</div>
          <div class="leaderboard-avatar">${u.avatar || '👤'}</div>
          <div>
            <div class="leaderboard-info-name">${u.displayName} ${u.username === currentUsername ? '(вы)' : ''}</div>
            <div class="leaderboard-info-sub">${u.tasksCount || 0} задач · ${u.lecturesCount || 0} лекций</div>
          </div>
          <div class="leaderboard-score">${u.score} XP</div>
        </div>
      `;
    }).join('');

    const html = `
      <div class="container">

        <!-- Hero Profile Card -->
        <div class="progress-hero">
          <div class="progress-user-avatar">${user.avatar || '⚡'}</div>
          <div class="progress-hero-info">
            <h1 class="progress-hero-name">${user.displayName}</h1>
            <div class="progress-hero-level">${level.icon} ${level.name} ${level.next ? `→ ${level.next}` : '(Максимальный уровень!)'}</div>
            <div class="xp-bar-wrap">
              <div class="xp-bar">
                <div class="xp-bar-fill" style="width:${xpPct}%"></div>
              </div>
              <div class="xp-text">${stats.xp} XP ${level.next ? '/ ' + level.xpForNext : ''}</div>
            </div>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid-4">
          <div class="stat-card">
            <div class="stat-card-icon">✅</div>
            <div class="stat-card-value">${stats.totalTasks}</div>
            <div class="stat-card-label">Задач решено</div>
            <div class="stat-card-sub">из ${TASKS_DATA.length}</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-icon">📖</div>
            <div class="stat-card-value">${stats.totalLectures}</div>
            <div class="stat-card-label">Лекций изучено</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-icon">🎯</div>
            <div class="stat-card-value">${stats.totalQuestions}</div>
            <div class="stat-card-label">Вопросов прочитано</div>
            <div class="stat-card-sub">из ${QUESTIONS_DATA.length}</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-icon">🔥</div>
            <div class="stat-card-value">${stats.streak}</div>
            <div class="stat-card-label">Дней подряд</div>
          </div>
        </div>

        <!-- Heatmap -->
        <div class="heatmap-wrap">
          <div class="progress-section-title">📅 Активность (13 недель)</div>
          <div class="heatmap" style="margin-top:8px;">
            ${heatmapWeeks.join('')}
          </div>
          <div style="margin-top:8px;display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-tertiary);">
            Меньше
            <div class="heatmap-cell level-0" style="width:14px;height:14px;"></div>
            <div class="heatmap-cell level-1" style="width:14px;height:14px;"></div>
            <div class="heatmap-cell level-2" style="width:14px;height:14px;"></div>
            <div class="heatmap-cell level-3" style="width:14px;height:14px;"></div>
            <div class="heatmap-cell level-4" style="width:14px;height:14px;"></div>
            Больше
          </div>
        </div>

        <!-- Module Progress -->
        <div class="progress-section-title">📚 Прогресс по модулям</div>
        <div class="module-progress-list">${modulesHtml}</div>

        <!-- Achievements -->
        <div class="progress-section-title">🏆 Достижения (${unlockedIds.length}/${Object.keys(allAchievements).length})</div>
        <div class="achievements-grid">${achievementsHtml}</div>

        <!-- Leaderboard -->
        ${leaderboard.length > 1 ? `
          <div class="progress-section-title">🏅 Таблица лидеров</div>
          <div class="leaderboard-list">${leaderboardHtml}</div>
        ` : ''}

        <!-- Actions -->
        <div class="progress-actions">
          <button class="btn btn-outline btn-sm" onclick="ProgressManager.exportJSON();Components.toast('Прогресс экспортирован!','success');">
            📥 Экспорт прогресса
          </button>
          <label class="btn btn-outline btn-sm" style="cursor:pointer;">
            📤 Импорт прогресса
            <input type="file" accept=".json" style="display:none;" onchange="ProgressManager.importJSON(this.files[0]).then(()=>{App.renderProgress();Components.toast('Прогресс импортирован!','success');});">
          </label>
          <button class="btn btn-outline btn-sm" onclick="if(confirm('Сбросить весь прогресс?')){ProgressManager.reset();App.renderProgress();App.updateSidebarUser();Components.toast('Прогресс сброшен','info');}">
            🗑️ Сбросить
          </button>
          <button class="btn btn-outline btn-sm" style="margin-left:auto;" onclick="Auth.logout();location.reload();">
            🚪 Выйти (${user.displayName})
          </button>
        </div>

      </div>
    `;
    this.render(html);
  },

  // =============================================
  // RESIZER
  // =============================================
  initResizers() {
    // Horizontal resizer (left/right panels)
    const resizer = document.getElementById('resizer');
    const left = document.querySelector('.playground-left');
    const playground = document.getElementById('playground');
    
    if (resizer && left && playground) {
      let isResizing = false;
      
      resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        playground.classList.add('resizing');
      });
      
      document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        const containerRect = playground.getBoundingClientRect();
        const newWidth = e.clientX - containerRect.left;
        const minWidth = 300;
        const maxWidth = containerRect.width * 0.65;
        if (newWidth >= minWidth && newWidth <= maxWidth) {
          left.style.width = newWidth + 'px';
        }
      });
      
      document.addEventListener('mouseup', () => {
        isResizing = false;
        playground.classList.remove('resizing');
      });
    }

    // Vertical resizer (editor/output)
    const resizerH = document.getElementById('resizer-h');
    const editorPanel = document.querySelector('.editor-panel');
    const outputPanel = document.querySelector('.output-panel');
    const rightPanel = document.querySelector('.playground-right');
    
    if (resizerH && editorPanel && outputPanel && rightPanel) {
      let isResizingV = false;
      
      resizerH.addEventListener('mousedown', () => {
        isResizingV = true;
        playground.classList.add('resizing-v');
      });
      
      document.addEventListener('mousemove', (e) => {
        if (!isResizingV) return;
        const containerRect = rightPanel.getBoundingClientRect();
        const newHeight = e.clientY - containerRect.top;
        const minHeight = 100;
        const maxHeight = containerRect.height - 100;
        if (newHeight >= minHeight && newHeight <= maxHeight) {
          editorPanel.style.flex = 'none';
          editorPanel.style.height = newHeight + 'px';
          outputPanel.style.height = (containerRect.height - newHeight - 5) + 'px';
        }
      });
      
      document.addEventListener('mouseup', () => {
        isResizingV = false;
        playground.classList.remove('resizing-v');
      });
    }
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
