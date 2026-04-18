// ============================================
// PROGRESS MANAGER — Per-user progress tracking
// Storage key is namespaced per user via Auth
// ============================================

const ProgressManager = {

  // Get storage key for current user
  _key() {
    return typeof Auth !== 'undefined' ? Auth.getUserProgressKey() : 'de_learning_progress_guest';
  },

  // Default state structure
  getDefaultState() {
    return {
      completedLectures: [],     // ["module_1_lecture_1", ...]
      solvedTasks: {},           // { "sql_task_001": { solved, code, solvedAt, attempts } }
      viewedQuestions: [],       // ["q_001", ...]
      moduleProgress: {},        // { "1": { lecturesDone, tasksDone, labDone, startedAt } }
      achievements: [],          // ["first_task", "streak_7", ...]
      settings: { fontSize: 14, theme: 'vs-dark' },
      stats: {
        totalTimeSpent: 0,
        streak: 0,
        lastActiveDate: null,
        activityLog: [],         // [{ date, actions, tasksSolved, lecturesRead }]
        xp: 0                   // Experience points
      },
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
  },

  // Load state from localStorage
  load() {
    try {
      const data = localStorage.getItem(this._key());
      if (data) {
        const parsed = JSON.parse(data);
        const def = this.getDefaultState();
        // Deep merge to pick up new fields
        return {
          ...def,
          ...parsed,
          stats: { ...def.stats, ...(parsed.stats || {}) }
        };
      }
    } catch (e) {
      console.warn('Failed to load progress:', e);
    }
    return this.getDefaultState();
  },

  // Save state to localStorage and Sync to Cloud Background (Async)
  save(state) {
    try {
      state.lastUpdated = new Date().toISOString();
      localStorage.setItem(this._key(), JSON.stringify(state));
      
      // Async sync to Azure Cloud
      if (typeof Auth !== 'undefined' && Auth.isLoggedIn()) {
        const username = Auth.getCurrentUser()?.username;
        if (username) {
          fetch('/api/progress/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, gameState: state })
          }).catch(e => console.warn('Cloud sync background failed', e));
        }
      }
    } catch (e) {
      console.warn('Failed to save progress:', e);
    }
  },

  // Initialize progress by pulling from Cloud (Azure API)
  async initCloud() {
    if (typeof Auth === 'undefined' || !Auth.isLoggedIn()) return;
    const username = Auth.getCurrentUser()?.username;
    if (!username) return;

    try {
      const res = await fetch(`/api/progress?username=${username}`);
      const data = await res.json();
      if (data.ok && data.gameState) {
        const local = this.load();
        // Naive merge: if cloud is newer (based on lastUpdated), use cloud.
        // It's a simplistic conflict resolution
        const cloudDate = data.gameState.lastUpdated ? new Date(data.gameState.lastUpdated) : 0;
        const localDate = local.lastUpdated ? new Date(local.lastUpdated) : 0;
        
        if (cloudDate > localDate) {
          localStorage.setItem(this._key(), JSON.stringify(data.gameState));
        }
      }
    } catch (e) {
      console.error('Failed to init cloud progress', e);
    }
  },

  // -----------------------------------------------
  // LECTURES
  // -----------------------------------------------

  completeLecture(moduleId, lectureId) {
    const state = this.load();
    const key = `module_${moduleId}_lecture_${lectureId}`;
    if (!state.completedLectures.includes(key)) {
      state.completedLectures.push(key);
      state.stats.xp = (state.stats.xp || 0) + 10;
      this._updateModuleProgress(state, moduleId);
      this._logActivity(state, 'lecture');
      this._checkAchievements(state);
      this.save(state);
      return true; // newly completed
    }
    return false;
  },

  isLectureCompleted(moduleId, lectureId) {
    const state = this.load();
    return state.completedLectures.includes(`module_${moduleId}_lecture_${lectureId}`);
  },

  getCompletedLecturesForModule(moduleId) {
    const state = this.load();
    return state.completedLectures.filter(l => l.startsWith(`module_${moduleId}_`)).length;
  },

  // -----------------------------------------------
  // TASKS
  // -----------------------------------------------

  solveTask(taskId, code) {
    const state = this.load();
    const isNew = !state.solvedTasks[taskId]?.solved;
    state.solvedTasks[taskId] = {
      solved: true,
      code: code,
      solvedAt: new Date().toISOString(),
      attempts: (state.solvedTasks[taskId]?.attempts || 0) + 1
    };
    if (isNew) {
      state.stats.xp = (state.stats.xp || 0) + 25;
    }
    const moduleId = this._getModuleFromTaskId(taskId);
    if (moduleId) this._updateModuleProgress(state, moduleId);
    this._logActivity(state, 'task');
    this._checkAchievements(state);
    this.save(state);
    return isNew;
  },

  saveTaskCode(taskId, code) {
    const state = this.load();
    if (!state.solvedTasks[taskId]) {
      state.solvedTasks[taskId] = { solved: false, code, attempts: 1 };
    } else {
      state.solvedTasks[taskId].code = code;
      if (!state.solvedTasks[taskId].solved) {
        state.solvedTasks[taskId].attempts = (state.solvedTasks[taskId].attempts || 0) + 1;
      }
    }
    this.save(state);
  },

  getTaskCode(taskId) {
    const state = this.load();
    return state.solvedTasks[taskId]?.code || null;
  },

  isTaskSolved(taskId) {
    const state = this.load();
    return state.solvedTasks[taskId]?.solved || false;
  },

  getSolvedTasksCount() {
    const state = this.load();
    return Object.values(state.solvedTasks).filter(t => t.solved).length;
  },

  // -----------------------------------------------
  // QUESTIONS
  // -----------------------------------------------

  viewQuestion(questionId) {
    const state = this.load();
    if (!state.viewedQuestions.includes(questionId)) {
      state.viewedQuestions.push(questionId);
      state.stats.xp = (state.stats.xp || 0) + 2;
      this._logActivity(state, 'question');
      this.save(state);
    }
  },

  // -----------------------------------------------
  // LAB
  // -----------------------------------------------

  completeLab(moduleId) {
    const state = this.load();
    if (!state.moduleProgress[moduleId]) {
      state.moduleProgress[moduleId] = { lecturesDone: 0, tasksDone: 0, labDone: false };
    }
    if (!state.moduleProgress[moduleId].labDone) {
      state.moduleProgress[moduleId].labDone = true;
      state.stats.xp = (state.stats.xp || 0) + 50;
      this._logActivity(state, 'lab');
      this._checkAchievements(state);
    }
    this.save(state);
  },

  isLabCompleted(moduleId) {
    const state = this.load();
    return state.moduleProgress[moduleId]?.labDone || false;
  },

  // -----------------------------------------------
  // STATS & ANALYTICS
  // -----------------------------------------------

  getStats() {
    const state = this.load();
    const totalTasks = Object.values(state.solvedTasks).filter(t => t.solved).length;
    const totalLectures = state.completedLectures.length;
    const totalQuestions = state.viewedQuestions.length;
    const streakDays = this._calculateStreak(state);
    const xp = state.stats.xp || 0;

    return {
      totalTasks,
      totalLectures,
      totalQuestions,
      streak: streakDays,
      xp,
      activityLog: state.stats.activityLog || [],
      level: this._calculateLevel(xp),
      achievements: state.achievements || [],
      moduleProgress: state.moduleProgress || {}
    };
  },

  // Get module completion % (0-100)
  getModuleProgress(moduleId) {
    if (typeof MODULES_DATA === 'undefined' || typeof TASKS_DATA === 'undefined') return 0;
    const state = this.load();
    const mod = MODULES_DATA.find(m => m.id === moduleId);
    if (!mod) return 0;

    const totalLectures = mod.lectures.length;
    const totalTasks = TASKS_DATA.filter(t => t.module === moduleId).length;
    const totalItems = totalLectures + totalTasks + 1; // +1 lab

    const doneLectures = state.completedLectures.filter(l => l.startsWith(`module_${moduleId}_`)).length;
    const doneTasks = Object.keys(state.solvedTasks)
      .filter(tid => {
        if (!state.solvedTasks[tid].solved) return false;
        const task = TASKS_DATA.find(t => t.id === tid);
        return task?.module === moduleId;
      }).length;
    const doneLab = state.moduleProgress[moduleId]?.labDone ? 1 : 0;

    const done = doneLectures + doneTasks + doneLab;
    if (totalItems <= 0) return 0;
    return Math.min(100, Math.round((done / totalItems) * 100));
  },

  // Get detailed module breakdown for progress page
  getModuleBreakdown() {
    if (typeof MODULES_DATA === 'undefined') return [];
    return MODULES_DATA.map(mod => {
      const pct = this.getModuleProgress(mod.id);
      const state = this.load();
      const doneLectures = state.completedLectures.filter(l => l.startsWith(`module_${mod.id}_`)).length;
      const totalLectures = mod.lectures.length;
      const totalTasks = typeof TASKS_DATA !== 'undefined' ? TASKS_DATA.filter(t => t.module === mod.id).length : 0;
      const doneTasks = totalTasks > 0 ? Object.keys(state.solvedTasks)
        .filter(tid => {
          if (!state.solvedTasks[tid].solved) return false;
          const task = typeof TASKS_DATA !== 'undefined' ? TASKS_DATA.find(t => t.id === tid) : null;
          return task?.module === mod.id;
        }).length : 0;
      const labDone = state.moduleProgress[mod.id]?.labDone || false;

      return {
        id: mod.id,
        title: mod.title,
        icon: mod.icon,
        level: mod.level,
        pct,
        doneLectures,
        totalLectures,
        doneTasks,
        totalTasks,
        labDone,
        startedAt: state.moduleProgress[mod.id]?.startedAt || null
      };
    });
  },

  // -----------------------------------------------
  // RESET
  // -----------------------------------------------

  reset() {
    localStorage.removeItem(this._key());
  },

  // -----------------------------------------------
  // EXPORT / IMPORT
  // -----------------------------------------------

  exportJSON() {
    const state = this.load();
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const user = typeof Auth !== 'undefined' ? Auth.getCurrentUser() : null;
    a.download = `de-progress-${user?.username || 'guest'}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          this.save(data);
          resolve(true);
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsText(file);
    });
  },

  // -----------------------------------------------
  // PRIVATE HELPERS
  // -----------------------------------------------

  _getModuleFromTaskId(taskId) {
    if (typeof TASKS_DATA !== 'undefined') {
      const task = TASKS_DATA.find(t => t.id === taskId);
      return task?.module || null;
    }
    return null;
  },

  _updateModuleProgress(state, moduleId) {
    if (!state.moduleProgress[moduleId]) {
      state.moduleProgress[moduleId] = {
        lecturesDone: 0,
        tasksDone: 0,
        labDone: false,
        startedAt: new Date().toISOString()
      };
    }
    state.moduleProgress[moduleId].lecturesDone =
      state.completedLectures.filter(l => l.startsWith(`module_${moduleId}_`)).length;

    if (typeof TASKS_DATA !== 'undefined') {
      state.moduleProgress[moduleId].tasksDone = Object.keys(state.solvedTasks)
        .filter(tid => {
          if (!state.solvedTasks[tid].solved) return false;
          const task = TASKS_DATA.find(t => t.id === tid);
          return task?.module == moduleId;
        }).length;
    }
  },

  _logActivity(state, type = 'action') {
    const today = new Date().toISOString().split('T')[0];
    let entry = state.stats.activityLog.find(a => a.date === today);
    if (!entry) {
      entry = { date: today, actions: 0, tasksSolved: 0, lecturesRead: 0 };
      state.stats.activityLog.push(entry);
    }
    entry.actions++;
    if (type === 'task') entry.tasksSolved = (entry.tasksSolved || 0) + 1;
    if (type === 'lecture') entry.lecturesRead = (entry.lecturesRead || 0) + 1;
    state.stats.lastActiveDate = today;

    // Keep last 90 days
    if (state.stats.activityLog.length > 90) {
      state.stats.activityLog = state.stats.activityLog.slice(-90);
    }
  },

  _calculateStreak(state) {
    const log = state.stats.activityLog || [];
    if (!log.length) return 0;
    let streak = 0;
    const today = new Date();
    let check = new Date(today);
    for (let i = 0; i < 365; i++) {
      const ds = check.toISOString().split('T')[0];
      if (log.find(a => a.date === ds)) {
        streak++;
      } else if (i > 0) {
        break;
      }
      check.setDate(check.getDate() - 1);
    }
    return streak;
  },

  _calculateLevel(xp) {
    if (xp >= 2000) return { name: 'Senior',        icon: '🔴', color: 'senior',  next: null,  xpForNext: 0,    rank: 5 };
    if (xp >= 800)  return { name: 'Middle+',       icon: '🟠', color: 'senior',  next: 'Senior',  xpForNext: 2000, rank: 4 };
    if (xp >= 300)  return { name: 'Middle',        icon: '🟡', color: 'middle',  next: 'Middle+', xpForNext: 800,  rank: 3 };
    if (xp >= 100)  return { name: 'Junior+',       icon: '🟢', color: 'junior',  next: 'Middle',  xpForNext: 300,  rank: 2 };
    if (xp >= 20)   return { name: 'Junior',        icon: '⚪', color: 'junior',  next: 'Junior+', xpForNext: 100,  rank: 1 };
    return           { name: 'Beginner',            icon: '🌱', color: 'junior',  next: 'Junior',  xpForNext: 20,   rank: 0 };
  },

  _checkAchievements(state) {
    const achievements = state.achievements || [];
    const add = (id) => { if (!achievements.includes(id)) { achievements.push(id); return true; } return false; };

    const tasks = Object.values(state.solvedTasks).filter(t => t.solved).length;
    const lectures = state.completedLectures.length;
    const streak = this._calculateStreak(state);

    if (tasks >= 1)   add('first_task');
    if (tasks >= 10)  add('tasks_10');
    if (tasks >= 25)  add('tasks_25');
    if (tasks >= 40)  add('tasks_40');
    if (lectures >= 1) add('first_lecture');
    if (lectures >= 10) add('lectures_10');
    if (streak >= 3)  add('streak_3');
    if (streak >= 7)  add('streak_7');
    if (streak >= 30) add('streak_30');

    state.achievements = achievements;
  },

  // Achievement definitions
  ACHIEVEMENTS: {
    'first_task':    { name: 'Первый шаг',      icon: '🎯', desc: 'Решите первую задачу' },
    'tasks_10':      { name: '10 задач',        icon: '🔥', desc: 'Решите 10 задач' },
    'tasks_25':      { name: 'Четверть сотни',  icon: '💪', desc: 'Решите 25 задач' },
    'tasks_40':      { name: 'Задачник',        icon: '🏆', desc: 'Решите 40 задач' },
    'first_lecture': { name: 'Студент',         icon: '📖', desc: 'Прочитайте первую лекцию' },
    'lectures_10':   { name: 'Отличник',        icon: '🎓', desc: 'Прочитайте 10 лекций' },
    'streak_3':      { name: '3 дня подряд',    icon: '🌟', desc: '3 дня активности' },
    'streak_7':      { name: 'Неделя',          icon: '⚡', desc: '7 дней подряд' },
    'streak_30':     { name: 'Месяц',           icon: '🔮', desc: '30 дней подряд' },
  }
};
