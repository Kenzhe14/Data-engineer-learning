// ============================================
// CODE PLAYGROUND 
// Monaco Editor + sql.js + Pyodide integration
// ============================================

const Playground = {
  editor: null,
  sqlDB: null,
  pyodide: null,
  pyodideLoading: false,
  pyodideReady: false,
  currentTask: null,

  // Initialize Monaco Editor
  async initMonaco(container, language, initialCode) {
    return new Promise((resolve) => {
      if (typeof monaco !== 'undefined' && this.editor) {
        this.editor.dispose();
      }
      
      require(['vs/editor/editor.main'], () => {
        // Define custom dark theme
        monaco.editor.defineTheme('de-dark', {
          base: 'vs-dark',
          inherit: true,
          rules: [
            { token: 'keyword', foreground: '818cf8', fontStyle: 'bold' },
            { token: 'string', foreground: '10b981' },
            { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
            { token: 'number', foreground: 'f59e0b' },
            { token: 'type', foreground: '06b6d4' },
          ],
          colors: {
            'editor.background': '#0d0d1f',
            'editor.foreground': '#e2e8f0',
            'editorLineNumber.foreground': '#4a4a6a',
            'editorLineNumber.activeForeground': '#818cf8',
            'editor.selectionBackground': '#6366f133',
            'editor.lineHighlightBackground': '#1a1a2e',
            'editorCursor.foreground': '#6366f1',
            'editorWidget.background': '#111127',
          }
        });

        this.editor = monaco.editor.create(container, {
          value: initialCode || '',
          language: language === 'sql' ? 'sql' : 'python',
          theme: 'de-dark',
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          minimap: { enabled: false },
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          wordWrap: 'on',
          renderWhitespace: 'selection',
          padding: { top: 12 },
          suggestOnTriggerCharacters: true,
        });

        resolve(this.editor);
      });
    });
  },

  // Initialize sql.js
  async initSQLjs() {
    if (this.sqlDB) return this.sqlDB;
    
    try {
      const SQL = await initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`
      });
      this.sqlDB = new SQL.Database();
      return this.sqlDB;
    } catch (e) {
      console.error('Failed to init sql.js:', e);
      throw e;
    }
  },

  // Initialize Pyodide
  async initPyodide(progressCallback) {
    if (this.pyodideReady) return this.pyodide;
    if (this.pyodideLoading) {
      // Wait for existing load
      while (!this.pyodideReady) {
        await new Promise(r => setTimeout(r, 200));
      }
      return this.pyodide;
    }

    this.pyodideLoading = true;
    try {
      if (progressCallback) progressCallback('Загрузка Python окружения...');
      this.pyodide = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
      });
      this.pyodideReady = true;
      if (progressCallback) progressCallback('Python готов!');
      return this.pyodide;
    } catch (e) {
      console.error('Failed to init Pyodide:', e);
      this.pyodideLoading = false;
      throw e;
    }
  },

  // Execute SQL query
  async executeSQL(query, setupSQL) {
    const db = await this.initSQLjs();
    
    // Reset database
    db.close();
    const SQL = await initSqlJs({
      locateFile: file => `https://sql.js.org/dist/${file}`
    });
    this.sqlDB = new SQL.Database();
    
    // Run setup
    if (setupSQL) {
      try {
        this.sqlDB.run(setupSQL);
      } catch (e) {
        return { error: `Setup error: ${e.message}`, results: null };
      }
    }
    
    // Run user query
    try {
      const results = this.sqlDB.exec(query);
      if (results.length === 0) {
        return { error: null, results: { columns: [], values: [] } };
      }
      return { 
        error: null, 
        results: {
          columns: results[0].columns,
          values: results[0].values
        }
      };
    } catch (e) {
      return { error: e.message, results: null };
    }
  },

  // Execute Python code
  async executePython(code, progressCallback) {
    const pyodide = await this.initPyodide(progressCallback);
    
    let stdout = '';
    let stderr = '';
    
    // Capture stdout
    pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
    `);
    
    try {
      const result = pyodide.runPython(code);
      stdout = pyodide.runPython('sys.stdout.getvalue()');
      stderr = pyodide.runPython('sys.stderr.getvalue()');
      
      // Reset stdout
      pyodide.runPython(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
      `);
      
      return { error: null, result, stdout, stderr };
    } catch (e) {
      pyodide.runPython(`
sys.stdout = sys.__stdout__  
sys.stderr = sys.__stderr__
      `);
      return { error: e.message, result: null, stdout, stderr };
    }
  },

  // Check SQL task
  async checkSQLTask(task, userQuery) {
    const { error, results } = await this.executeSQL(userQuery, task.setupSQL);
    
    if (error) {
      return {
        passed: false,
        error: error,
        userResult: null,
        expectedResult: task.expectedResult
      };
    }

    // Compare results
    const expected = task.expectedResult;
    const actual = results.values;
    
    let passed = true;
    let details = [];

    if (actual.length !== expected.length) {
      passed = false;
      details.push(`Ожидалось ${expected.length} строк, получено ${actual.length}`);
    } else {
      for (let i = 0; i < expected.length; i++) {
        const expRow = expected[i];
        const actRow = actual[i];
        if (!actRow) {
          passed = false;
          details.push(`Строка ${i+1}: отсутствует`);
          continue;
        }
        for (let j = 0; j < expRow.length; j++) {
          const exp = expRow[j];
          const act = actRow[j];
          if (exp === null && act === null) continue;
          if (typeof exp === 'number' && typeof act === 'number') {
            if (Math.abs(exp - act) > 0.01) {
              passed = false;
              details.push(`Строка ${i+1}, столбец ${j+1}: ожидалось ${exp}, получено ${act}`);
            }
          } else if (String(exp) !== String(act)) {
            passed = false;
            details.push(`Строка ${i+1}, столбец ${j+1}: ожидалось "${exp}", получено "${act}"`);
          }
        }
      }
    }

    return {
      passed,
      error: null,
      details,
      userResult: results,
      expectedResult: expected,
      expectedColumns: task.expectedColumns
    };
  },

  // Check Python task
  async checkPythonTask(task, userCode, progressCallback) {
    const results = [];
    
    for (let i = 0; i < task.testCases.length; i++) {
      const tc = task.testCases[i];
      const fullCode = userCode + '\n\n' + `__test_result__ = ${tc.input}`;
      
      const { error, stdout } = await this.executePython(fullCode, progressCallback);
      
      if (error) {
        results.push({
          index: i,
          passed: false,
          input: tc.input,
          expected: tc.expected,
          actual: `Error: ${error}`,
          stdout
        });
        continue;
      }
      
      // Get result
      try {
        const pyodide = this.pyodide;
        const actualValue = pyodide.runPython('repr(__test_result__)');
        
        // Normalize comparison
        const expectedNorm = this.normalizePyValue(tc.expected);
        const actualNorm = this.normalizePyValue(actualValue);
        
        const passed = expectedNorm === actualNorm;
        
        results.push({
          index: i,
          passed,
          input: tc.input,
          expected: tc.expected,
          actual: actualValue,
          stdout
        });
      } catch (e) {
        results.push({
          index: i,
          passed: false,
          input: tc.input,
          expected: tc.expected,
          actual: `Error: ${e.message}`,
          stdout
        });
      }
    }
    
    return {
      passed: results.every(r => r.passed),
      results
    };
  },

  // Normalize Python values for comparison
  normalizePyValue(val) {
    if (val === 'True' || val === true) return 'True';
    if (val === 'False' || val === false) return 'False';
    if (val === 'None' || val === null) return 'None';
    
    try {
      // Try to parse as JSON for dicts/lists
      let str = String(val).trim();
      // Convert Python syntax to JSON-ish
      str = str.replace(/'/g, '"');
      str = str.replace(/True/g, 'true').replace(/False/g, 'false').replace(/None/g, 'null');
      const parsed = JSON.parse(str);
      return JSON.stringify(parsed, Object.keys(parsed).sort());
    } catch {
      return String(val).trim();
    }
  },

  // Render results as HTML table
  renderResultTable(columns, values) {
    if (!columns || columns.length === 0) return '<p class="console-output">Запрос выполнен. 0 строк.</p>';
    
    let html = '<table class="result-table"><thead><tr>';
    columns.forEach(col => { html += `<th>${col}</th>`; });
    html += '</tr></thead><tbody>';
    
    values.forEach(row => {
      html += '<tr>';
      row.forEach(val => {
        html += `<td>${val === null ? '<em>NULL</em>' : val}</td>`;
      });
      html += '</tr>';
    });
    html += '</tbody></table>';
    html += `<p style="color:var(--text-tertiary);font-size:12px;margin-top:8px;">${values.length} строк</p>`;
    return html;
  },

  // Render test results
  renderTestResults(checkResult) {
    let html = '';
    
    if (checkResult.error) {
      html += `<div class="test-result failed"><span class="test-icon">❌</span> Ошибка: ${checkResult.error}</div>`;
      return html;
    }

    if (checkResult.results) {
      // Python test results
      checkResult.results.forEach((r, i) => {
        const icon = r.passed ? '✅' : '❌';
        const cls = r.passed ? 'passed' : 'failed';
        html += `<div class="test-result ${cls}">
          <span class="test-icon">${icon}</span>
          <span>Тест ${i + 1}: ${r.passed ? 'Passed' : 'Failed'}</span>
        </div>`;
        if (!r.passed) {
          html += `<div style="padding-left:28px;font-size:12px;color:var(--text-tertiary);margin-bottom:4px;">
            <div>Input: <code>${r.input}</code></div>
            <div>Expected: <code>${r.expected}</code></div>
            <div>Got: <code>${r.actual}</code></div>
          </div>`;
        }
        if (r.stdout && r.stdout.trim().length > 0) {
          html += `<div style="padding-left:28px;font-size:12px;color:var(--warning);margin-bottom:8px;white-space:pre-wrap;font-family:var(--font-mono);"><b>Console:</b><br/>${r.stdout.trim()}</div>`;
        }
      });
    } else {
      // SQL results
      const icon = checkResult.passed ? '✅' : '❌';
      const cls = checkResult.passed ? 'passed' : 'failed';
      html += `<div class="test-result ${cls}">
        <span class="test-icon">${icon}</span>
        <span>${checkResult.passed ? 'Все тесты пройдены!' : 'Результат не совпадает'}</span>
      </div>`;
      
      if (checkResult.details && checkResult.details.length > 0) {
        html += '<div style="padding-left:28px;font-size:12px;color:var(--error);margin-bottom:8px;">';
        checkResult.details.forEach(d => { html += `<div>• ${d}</div>`; });
        html += '</div>';
      }
      
      // Show user's result table
      if (checkResult.userResult) {
        html += '<div style="margin-top:12px;"><strong style="color:var(--text-secondary);font-size:13px;">Ваш результат:</strong></div>';
        html += this.renderResultTable(checkResult.userResult.columns, checkResult.userResult.values);
      }
    }
    
    return html;
  }
};
