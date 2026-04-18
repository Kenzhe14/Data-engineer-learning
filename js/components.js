// ============================================
// UI COMPONENTS
// Reusable rendering functions
// ============================================

const Components = {

  // ---- Module Card ----
  moduleCard(mod) {
    const progress = ProgressManager.getModuleProgress(mod.id, mod.totalLectures, mod.totalTasks);
    const levelClass = mod.level;
    const levelLabel = mod.level === 'junior' ? '🟢 Junior' : mod.level === 'middle' ? '🟡 Middle' : '🔴 Senior';
    
    return `
      <div class="module-card" onclick="App.navigate('module', ${mod.id})" id="module-card-${mod.id}">
        <div class="module-card-header">
          <div class="module-card-icon">${mod.icon}</div>
          <span class="level-badge ${levelClass}">${levelLabel}</span>
        </div>
        <h3>Модуль ${mod.id}: ${mod.title}</h3>
        <p>${mod.description}</p>
        <div class="module-card-meta">
          <span>📖 ${mod.totalLectures} лекций</span>
          <span>💻 ${mod.totalTasks} задач</span>
          <span>🔬 1 лаб</span>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill" style="width: ${progress}%"></div>
        </div>
        <div class="progress-text">${progress}% завершено</div>
      </div>
    `;
  },

  // ---- Question Card ----
  questionCard(q) {
    const levelLabel = q.level === 'junior' ? '🟢 Junior' : q.level === 'middle' ? '🟡 Middle' : '🔴 Senior';
    return `
      <div class="question-card" id="q-${q.id}">
        <div class="question-header" onclick="Components.toggleQuestion('${q.id}')">
          <div class="question-info">
            <div class="question-text">${q.question}</div>
            <div class="question-meta">
              <span class="level-badge ${q.level}">${levelLabel}</span>
              <span class="question-tag">${q.category}</span>
              ${q.tags.slice(0, 2).map(t => `<span class="question-tag">${t}</span>`).join('')}
            </div>
          </div>
          <div class="question-toggle">▼</div>
        </div>
        <div class="question-answer">
          <div class="answer-content">${q.answer}</div>
        </div>
      </div>
    `;
  },

  toggleQuestion(id) {
    const card = document.getElementById(`q-${id}`);
    if (card) {
      card.classList.toggle('open');
      ProgressManager.viewQuestion(id);
    }
  },

  // ---- Task List Item ----
  taskListItem(task, isActive) {
    const solved = ProgressManager.isTaskSolved(task.id);
    const diffLabel = task.difficulty === 'junior' ? '🟢' : task.difficulty === 'middle' ? '🟡' : '🔴';
    
    return `
      <div class="task-list-item ${isActive ? 'active' : ''} ${solved ? 'solved' : ''}" 
           onclick="App.loadTask('${task.id}')">
        <div class="task-status">${solved ? '✓' : ''}</div>
        <span>${diffLabel} ${task.title}</span>
      </div>
    `;
  },

  // ---- Breadcrumb ----
  breadcrumb(items) {
    return `
      <div class="breadcrumb">
        ${items.map((item, i) => {
          if (i === items.length - 1) {
            return `<span class="current">${item.label}</span>`;
          }
          return `<a href="#" onclick="App.navigate('${item.route}'${item.param ? ', ' + item.param : ''});return false;">${item.label}</a><span class="separator">›</span>`;
        }).join('')}
      </div>
    `;
  },

  // ---- Tabs ----
  tabs(items, activeId, onClickFn) {
    return `
      <div class="tabs">
        ${items.map(item => `
          <button class="tab ${item.id === activeId ? 'active' : ''}" 
                  onclick="${onClickFn}('${item.id}')">
            <span class="tab-icon">${item.icon}</span>
            <span>${item.label}</span>
          </button>
        `).join('')}
      </div>
    `;
  },

  // ---- Hint Accordion ----
  hintsSection(hints) {
    if (!hints || hints.length === 0) return '';
    
    return `
      <div class="hints-container">
        ${hints.map((hint, i) => `
          <div class="hint-item" id="hint-${i}">
            <div class="hint-header" onclick="document.getElementById('hint-${i}').classList.toggle('open')">
              💡 Подсказка ${i + 1}
            </div>
            <div class="hint-body">${hint}</div>
          </div>
        `).join('')}
      </div>
    `;
  },

  // ---- Toast Notification ----
  toast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icons[type]}</span> ${message}`;
    container.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  // ---- Schema Table for SQL Tasks ----
  schemaTable(setupSQL) {
    // Extract table info from CREATE TABLE statements
    const tables = [];
    const createRegex = /CREATE TABLE (\w+)\s*\(([^;]+)\)/gi;
    let match;
    while ((match = createRegex.exec(setupSQL)) !== null) {
      const name = match[1];
      const colsDef = match[2];
      const cols = colsDef.split(',').map(c => {
        const parts = c.trim().split(/\s+/);
        return { name: parts[0], type: parts.slice(1).join(' ') };
      }).filter(c => c.name && !c.name.startsWith('--'));
      tables.push({ name, columns: cols });
    }

    // Extract sample data from INSERT statements
    const insertRegex = /INSERT INTO (\w+)(?:\s*VALUES|\s*\([^)]+\)\s*VALUES)\s*([\s\S]*?)(?:;|$)/gi;
    const sampleData = {};
    while ((match = insertRegex.exec(setupSQL)) !== null) {
      const tableName = match[1];
      const valuesStr = match[2];
      const rows = [];
      const rowRegex = /\(([^)]+)\)/g;
      let rowMatch;
      let count = 0;
      while ((rowMatch = rowRegex.exec(valuesStr)) !== null && count < 5) {
        const vals = rowMatch[1].split(',').map(v => v.trim().replace(/^'|'$/g, ''));
        rows.push(vals);
        count++;
      }
      sampleData[tableName] = rows;
    }

    let html = '';
    tables.forEach(table => {
      html += `<p style="font-weight:600;color:var(--accent-cyan);margin-top:12px;">Таблица: ${table.name}</p>`;
      html += '<table class="schema-table"><thead><tr>';
      table.columns.forEach(col => { html += `<th>${col.name}</th>`; });
      html += '</tr></thead><tbody>';
      
      const data = sampleData[table.name] || [];
      data.forEach(row => {
        html += '<tr>';
        row.forEach(val => { html += `<td>${val}</td>`; });
        // Fill remaining columns if needed
        for (let i = row.length; i < table.columns.length; i++) {
          html += '<td></td>';
        }
        html += '</tr>';
      });
      html += '</tbody></table>';
    });

    return html;
  },

  // ---- Expected Result Table ----
  expectedResultTable(columns, values) {
    if (!columns || !values || values.length === 0) return '';
    
    let html = '<p class="expected-label">Ожидаемый результат:</p>';
    html += '<table class="schema-table"><thead><tr>';
    columns.forEach(col => { html += `<th>${col}</th>`; });
    html += '</tr></thead><tbody>';
    values.slice(0, 5).forEach(row => {
      html += '<tr>';
      row.forEach(val => { html += `<td>${val === null ? 'NULL' : val}</td>`; });
      html += '</tr>';
    });
    if (values.length > 5) {
      html += `<tr><td colspan="${columns.length}" style="text-align:center;color:var(--text-tertiary)">... ещё ${values.length - 5} строк</td></tr>`;
    }
    html += '</tbody></table>';
    return html;
  }
};
