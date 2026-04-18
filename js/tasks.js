// ============================================
// CODING TASKS — Code Playground
// SQL (sql.js) + Python (Pyodide) tasks with test cases
// ============================================

const TASKS_DATA = [

  // ============================================
  // MODULE 1: SQL Tasks (25 tasks)
  // ============================================

  // --- SQL Basic (1-5) ---
  {
    id: "sql_task_001", module: 1, order: 1,
    title: "Выборка с фильтрацией",
    difficulty: "junior", language: "sql",
    description: `Найдите всех сотрудников из отдела <strong>Engineering</strong> с зарплатой больше <strong>80000</strong>.\n\nВерните столбцы: <code>name</code>, <code>salary</code>.\nОтсортируйте по зарплате по убыванию.`,
    setupSQL: `
      CREATE TABLE employees (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        department TEXT NOT NULL,
        salary INTEGER NOT NULL,
        hire_date TEXT
      );
      INSERT INTO employees VALUES
        (1, 'Alice', 'Engineering', 95000, '2021-03-15'),
        (2, 'Bob', 'Engineering', 85000, '2022-01-10'),
        (3, 'Charlie', 'Engineering', 78000, '2023-06-01'),
        (4, 'Diana', 'Marketing', 72000, '2020-11-20'),
        (5, 'Eve', 'Engineering', 92000, '2021-08-05'),
        (6, 'Frank', 'HR', 65000, '2022-04-12'),
        (7, 'Grace', 'Engineering', 88000, '2023-01-15'),
        (8, 'Hank', 'Marketing', 70000, '2021-07-22');
    `,
    starterCode: `-- Найдите инженеров с зарплатой > 80000\nSELECT \n\nFROM employees\nWHERE \nORDER BY ;`,
    expectedResult: [
      ["Alice", 95000],
      ["Eve", 92000],
      ["Grace", 88000],
      ["Bob", 85000]
    ],
    expectedColumns: ["name", "salary"],
    hints: [
      "Используйте WHERE с двумя условиями через AND",
      "ORDER BY salary DESC для сортировки по убыванию"
    ],
    solution: `SELECT name, salary\nFROM employees\nWHERE department = 'Engineering' AND salary > 80000\nORDER BY salary DESC;`
  },
  {
    id: "sql_task_002", module: 1, order: 2,
    title: "GROUP BY и агрегаты",
    difficulty: "junior", language: "sql",
    description: `Для каждого отдела посчитайте:\n- Количество сотрудников (<code>emp_count</code>)\n- Среднюю зарплату (<code>avg_salary</code>), округлённую до целого\n\nОтсортируйте по средней зарплате по убыванию.`,
    setupSQL: `
      CREATE TABLE employees (
        id INTEGER PRIMARY KEY, name TEXT, department TEXT, salary INTEGER
      );
      INSERT INTO employees VALUES
        (1,'Alice','Engineering',95000),(2,'Bob','Engineering',85000),
        (3,'Charlie','Engineering',78000),(4,'Diana','Marketing',72000),
        (5,'Eve','Engineering',92000),(6,'Frank','HR',65000),
        (7,'Grace','Marketing',68000),(8,'Hank','HR',62000);
    `,
    starterCode: `-- Посчитайте кол-во и среднюю зарплату по отделам\nSELECT \n\nFROM employees\nGROUP BY \nORDER BY ;`,
    expectedResult: [
      ["Engineering", 4, 87500],
      ["Marketing", 2, 70000],
      ["HR", 2, 63500]
    ],
    expectedColumns: ["department", "emp_count", "avg_salary"],
    hints: [
      "COUNT(*) для подсчёта строк",
      "ROUND(AVG(salary)) для округления средней",
      "GROUP BY department"
    ],
    solution: `SELECT \n  department,\n  COUNT(*) as emp_count,\n  ROUND(AVG(salary)) as avg_salary\nFROM employees\nGROUP BY department\nORDER BY avg_salary DESC;`
  },
  {
    id: "sql_task_003", module: 1, order: 3,
    title: "JOIN двух таблиц",
    difficulty: "junior", language: "sql",
    description: `Соедините таблицу <code>orders</code> с таблицей <code>customers</code>.\n\nДля каждого заказа выведите: <code>order_id</code>, <code>customer_name</code>, <code>amount</code>.\n\nВключите <strong>все</strong> заказы, даже если клиент не найден (используйте LEFT JOIN).\nДля заказов без клиента имя должно быть <code>'Unknown'</code>.`,
    setupSQL: `
      CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT);
      INSERT INTO customers VALUES (1,'Alice'),(2,'Bob'),(3,'Charlie');
      
      CREATE TABLE orders (
        id INTEGER PRIMARY KEY, customer_id INTEGER, amount REAL
      );
      INSERT INTO orders VALUES
        (101,1,250.00),(102,2,180.50),(103,1,320.00),
        (104,3,95.75),(105,99,450.00),(106,2,210.00);
    `,
    starterCode: `-- JOIN orders с customers, Unknown для отсутствующих\nSELECT \n\nFROM orders o\n  JOIN customers c ON \nORDER BY o.id;`,
    expectedResult: [
      [101, "Alice", 250.0],
      [102, "Bob", 180.5],
      [103, "Alice", 320.0],
      [104, "Charlie", 95.75],
      [105, "Unknown", 450.0],
      [106, "Bob", 210.0]
    ],
    expectedColumns: ["order_id", "customer_name", "amount"],
    hints: [
      "LEFT JOIN чтобы сохранить все заказы",
      "COALESCE(c.name, 'Unknown') для подстановки значения"
    ],
    solution: `SELECT \n  o.id as order_id,\n  COALESCE(c.name, 'Unknown') as customer_name,\n  o.amount\nFROM orders o\nLEFT JOIN customers c ON o.customer_id = c.id\nORDER BY o.id;`
  },
  {
    id: "sql_task_004", module: 1, order: 4,
    title: "HAVING — фильтрация групп",
    difficulty: "junior", language: "sql",
    description: `Найдите клиентов, которые сделали <strong>более 1 заказа</strong>.\n\nВыведите: <code>customer_name</code>, <code>order_count</code>, <code>total_spent</code>.\nОтсортируйте по total_spent по убыванию.`,
    setupSQL: `
      CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT);
      INSERT INTO customers VALUES (1,'Alice'),(2,'Bob'),(3,'Charlie'),(4,'Diana');
      
      CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, amount REAL);
      INSERT INTO orders VALUES
        (1,1,100),(2,1,200),(3,1,150),
        (4,2,300),(5,2,250),
        (6,3,500),
        (7,4,80),(8,4,120),(9,4,90);
    `,
    starterCode: `-- Клиенты с более чем 1 заказом\nSELECT \n\nFROM orders o\nJOIN customers c ON o.customer_id = c.id\nGROUP BY \nHAVING \nORDER BY ;`,
    expectedResult: [
      ["Alice", 3, 450.0],
      ["Bob", 2, 550.0],
      ["Diana", 3, 290.0]
    ],
    expectedColumns: ["customer_name", "order_count", "total_spent"],
    hints: [
      "GROUP BY c.name или c.id",
      "HAVING COUNT(*) > 1",
      "SUM(o.amount) as total_spent"
    ],
    solution: `SELECT \n  c.name as customer_name,\n  COUNT(*) as order_count,\n  SUM(o.amount) as total_spent\nFROM orders o\nJOIN customers c ON o.customer_id = c.id\nGROUP BY c.id, c.name\nHAVING COUNT(*) > 1\nORDER BY total_spent DESC;`
  },
  {
    id: "sql_task_005", module: 1, order: 5,
    title: "Подзапрос и CTE",
    difficulty: "junior", language: "sql",
    description: `Найдите сотрудников, чья зарплата <strong>выше средней</strong> по их отделу.\n\nВыведите: <code>name</code>, <code>department</code>, <code>salary</code>, <code>dept_avg</code> (средняя по отделу, округлённая).\nОтсортируйте по отделу, затем по зарплате DESC.`,
    setupSQL: `
      CREATE TABLE employees (
        id INTEGER PRIMARY KEY, name TEXT, department TEXT, salary INTEGER
      );
      INSERT INTO employees VALUES
        (1,'Alice','Engineering',95000),(2,'Bob','Engineering',85000),
        (3,'Charlie','Engineering',70000),(4,'Diana','Marketing',72000),
        (5,'Eve','Engineering',92000),(6,'Frank','Marketing',58000),
        (7,'Grace','HR',65000),(8,'Hank','HR',55000);
    `,
    starterCode: `-- Сотрудники с зарплатой выше средней по отделу\n-- Используйте CTE или подзапрос\n`,
    expectedResult: [
      ["Alice", "Engineering", 95000, 85500],
      ["Eve", "Engineering", 92000, 85500],
      ["Grace", "HR", 65000, 60000],
      ["Diana", "Marketing", 72000, 65000]
    ],
    expectedColumns: ["name", "department", "salary", "dept_avg"],
    hints: [
      "CTE: WITH dept_avg AS (SELECT department, ROUND(AVG(salary)) ...)",
      "JOIN employees с CTE по department",
      "WHERE salary > dept_avg"
    ],
    solution: `WITH dept_averages AS (\n  SELECT department, ROUND(AVG(salary)) as dept_avg\n  FROM employees\n  GROUP BY department\n)\nSELECT \n  e.name, e.department, e.salary, da.dept_avg\nFROM employees e\nJOIN dept_averages da ON e.department = da.department\nWHERE e.salary > da.dept_avg\nORDER BY e.department, e.salary DESC;`
  },

  // --- SQL Window Functions (6-10) ---
  {
    id: "sql_task_006", module: 1, order: 6,
    title: "ROW_NUMBER — дедупликация",
    difficulty: "junior", language: "sql",
    description: `В таблице <code>user_events</code> есть дубликаты. Для каждого пользователя оставьте только <strong>последнее</strong> событие (по <code>event_date</code>).\n\nВыведите: <code>user_id</code>, <code>event_type</code>, <code>event_date</code>.`,
    setupSQL: `
      CREATE TABLE user_events (
        id INTEGER, user_id INTEGER, event_type TEXT, event_date TEXT
      );
      INSERT INTO user_events VALUES
        (1,1,'login','2024-01-01'),(2,1,'click','2024-01-05'),
        (3,1,'purchase','2024-01-10'),(4,2,'login','2024-01-02'),
        (5,2,'click','2024-01-08'),(6,3,'login','2024-01-03'),
        (7,3,'click','2024-01-04'),(8,3,'purchase','2024-01-06'),
        (9,3,'login','2024-01-12');
    `,
    starterCode: `-- Для каждого user_id оставьте последнее событие\n-- Используйте ROW_NUMBER()\n`,
    expectedResult: [
      [1, "purchase", "2024-01-10"],
      [2, "click", "2024-01-08"],
      [3, "login", "2024-01-12"]
    ],
    expectedColumns: ["user_id", "event_type", "event_date"],
    hints: [
      "ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY event_date DESC)",
      "Оберните в подзапрос/CTE и отфильтруйте WHERE rn = 1"
    ],
    solution: `WITH ranked AS (\n  SELECT \n    user_id, event_type, event_date,\n    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY event_date DESC) as rn\n  FROM user_events\n)\nSELECT user_id, event_type, event_date\nFROM ranked WHERE rn = 1\nORDER BY user_id;`
  },
  {
    id: "sql_task_007", module: 1, order: 7,
    title: "RANK — Рейтинг по зарплате",
    difficulty: "junior", language: "sql",
    description: `Для каждого отдела найдите <strong>топ-2 зарплат</strong> (используйте DENSE_RANK).\n\nВыведите: <code>department</code>, <code>name</code>, <code>salary</code>, <code>salary_rank</code>.`,
    setupSQL: `
      CREATE TABLE employees (
        id INTEGER PRIMARY KEY, name TEXT, department TEXT, salary INTEGER
      );
      INSERT INTO employees VALUES
        (1,'Alice','Engineering',95000),(2,'Bob','Engineering',85000),
        (3,'Charlie','Engineering',85000),(4,'Diana','Engineering',70000),
        (5,'Eve','Marketing',72000),(6,'Frank','Marketing',68000),
        (7,'Grace','Marketing',65000);
    `,
    starterCode: `-- Топ-2 зарплат в каждом отделе\n-- DENSE_RANK чтобы одинаковые зарплаты имели одинаковый ранг\n`,
    expectedResult: [
      ["Engineering", "Alice", 95000, 1],
      ["Engineering", "Bob", 85000, 2],
      ["Engineering", "Charlie", 85000, 2],
      ["Marketing", "Eve", 72000, 1],
      ["Marketing", "Frank", 68000, 2]
    ],
    expectedColumns: ["department", "name", "salary", "salary_rank"],
    hints: [
      "DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC)",
      "Фильтруйте WHERE salary_rank <= 2"
    ],
    solution: `WITH ranked AS (\n  SELECT \n    department, name, salary,\n    DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) as salary_rank\n  FROM employees\n)\nSELECT department, name, salary, salary_rank\nFROM ranked WHERE salary_rank <= 2\nORDER BY department, salary_rank, name;`
  },
  {
    id: "sql_task_008", module: 1, order: 8,
    title: "Running Total — нарастающий итог",
    difficulty: "middle", language: "sql",
    description: `Посчитайте <strong>нарастающий итог</strong> продаж (running_total) по дням.\n\nВыведите: <code>sale_date</code>, <code>daily_amount</code>, <code>running_total</code>.`,
    setupSQL: `
      CREATE TABLE sales (
        id INTEGER PRIMARY KEY, sale_date TEXT, amount REAL
      );
      INSERT INTO sales VALUES
        (1,'2024-01-01',1000),(2,'2024-01-01',500),
        (3,'2024-01-02',750),(4,'2024-01-03',1200),
        (5,'2024-01-03',300),(6,'2024-01-04',900),
        (7,'2024-01-05',1500);
    `,
    starterCode: `-- Running total продаж по дням\n-- Сначала агрегируйте по дням, потом считайте нарастающий итог\n`,
    expectedResult: [
      ["2024-01-01", 1500.0, 1500.0],
      ["2024-01-02", 750.0, 2250.0],
      ["2024-01-03", 1500.0, 3750.0],
      ["2024-01-04", 900.0, 4650.0],
      ["2024-01-05", 1500.0, 6150.0]
    ],
    expectedColumns: ["sale_date", "daily_amount", "running_total"],
    hints: [
      "Сначала CTE с GROUP BY sale_date и SUM(amount)",
      "Затем SUM(daily_amount) OVER (ORDER BY sale_date)"
    ],
    solution: `WITH daily AS (\n  SELECT sale_date, SUM(amount) as daily_amount\n  FROM sales\n  GROUP BY sale_date\n)\nSELECT \n  sale_date,\n  daily_amount,\n  SUM(daily_amount) OVER (ORDER BY sale_date) as running_total\nFROM daily\nORDER BY sale_date;`
  },
  {
    id: "sql_task_009", module: 1, order: 9,
    title: "LAG — Сравнение с предыдущим периодом",
    difficulty: "middle", language: "sql",
    description: `Для каждого месяца посчитайте <strong>рост выручки</strong> (growth) и <strong>процент роста</strong> (growth_pct) по сравнению с предыдущим месяцем.\n\nВыведите: <code>month</code>, <code>revenue</code>, <code>prev_revenue</code>, <code>growth</code>, <code>growth_pct</code> (округлить до 1 знака).`,
    setupSQL: `
      CREATE TABLE monthly_revenue (
        month TEXT PRIMARY KEY, revenue REAL
      );
      INSERT INTO monthly_revenue VALUES
        ('2024-01',10000),('2024-02',12000),('2024-03',11500),
        ('2024-04',13500),('2024-05',15000);
    `,
    starterCode: `-- Рост выручки по сравнению с предыдущим месяцем\n-- Используйте LAG()\n`,
    expectedResult: [
      ["2024-01", 10000.0, null, null, null],
      ["2024-02", 12000.0, 10000.0, 2000.0, 20.0],
      ["2024-03", 11500.0, 12000.0, -500.0, -4.2],
      ["2024-04", 13500.0, 11500.0, 2000.0, 17.4],
      ["2024-05", 15000.0, 13500.0, 1500.0, 11.1]
    ],
    expectedColumns: ["month", "revenue", "prev_revenue", "growth", "growth_pct"],
    hints: [
      "LAG(revenue) OVER (ORDER BY month) — предыдущее значение",
      "growth = revenue - prev_revenue",
      "growth_pct = ROUND(growth * 100.0 / prev_revenue, 1)"
    ],
    solution: `SELECT \n  month,\n  revenue,\n  LAG(revenue) OVER (ORDER BY month) as prev_revenue,\n  revenue - LAG(revenue) OVER (ORDER BY month) as growth,\n  ROUND(\n    (revenue - LAG(revenue) OVER (ORDER BY month)) * 100.0 \n    / LAG(revenue) OVER (ORDER BY month), 1\n  ) as growth_pct\nFROM monthly_revenue\nORDER BY month;`
  },
  {
    id: "sql_task_010", module: 1, order: 10,
    title: "Сложный запрос — Retention",
    difficulty: "middle", language: "sql",
    description: `Найдите пользователей, которые были активны <strong>и в январе, и в феврале</strong> 2024 года (retention).\n\nВыведите: <code>user_id</code>, <code>jan_events</code>, <code>feb_events</code>.`,
    setupSQL: `
      CREATE TABLE events (
        id INTEGER, user_id INTEGER, event_date TEXT
      );
      INSERT INTO events VALUES
        (1,1,'2024-01-05'),(2,1,'2024-01-15'),(3,1,'2024-02-10'),
        (4,2,'2024-01-08'),(5,2,'2024-01-20'),
        (6,3,'2024-02-01'),(7,3,'2024-02-15'),
        (8,4,'2024-01-10'),(9,4,'2024-02-05'),(10,4,'2024-02-20'),
        (11,5,'2024-01-01');
    `,
    starterCode: `-- Retention: пользователи активные и в январе, и в феврале\n`,
    expectedResult: [
      [1, 2, 1],
      [4, 1, 2]
    ],
    expectedColumns: ["user_id", "jan_events", "feb_events"],
    hints: [
      "Посчитайте события за январь и февраль отдельно (CTE или CASE WHEN)",
      "Фильтруйте: события > 0 в обоих месяцах",
      "substr(event_date,1,7) для извлечения месяца"
    ],
    solution: `SELECT \n  user_id,\n  SUM(CASE WHEN substr(event_date,1,7) = '2024-01' THEN 1 ELSE 0 END) as jan_events,\n  SUM(CASE WHEN substr(event_date,1,7) = '2024-02' THEN 1 ELSE 0 END) as feb_events\nFROM events\nWHERE substr(event_date,1,7) IN ('2024-01','2024-02')\nGROUP BY user_id\nHAVING jan_events > 0 AND feb_events > 0\nORDER BY user_id;`
  },

  // --- More SQL tasks (11-15) ---
  {
    id: "sql_task_011", module: 1, order: 11,
    title: "CASE WHEN — Категоризация",
    difficulty: "junior", language: "sql",
    description: `Разбейте заказы на категории по сумме:\n- <code>amount < 100</code> → <strong>'Small'</strong>\n- <code>100 <= amount < 500</code> → <strong>'Medium'</strong>\n- <code>amount >= 500</code> → <strong>'Large'</strong>\n\nПосчитайте количество заказов в каждой категории.\nВыведите: <code>category</code>, <code>order_count</code>, <code>total_amount</code>.`,
    setupSQL: `
      CREATE TABLE orders (id INTEGER PRIMARY KEY, amount REAL);
      INSERT INTO orders VALUES
        (1,50),(2,150),(3,75),(4,500),(5,250),
        (6,30),(7,800),(8,120),(9,90),(10,350);
    `,
    starterCode: `-- Категоризация заказов по сумме\nSELECT \n  CASE \n    \n  END as category,\n  COUNT(*) as order_count,\n  SUM(amount) as total_amount\nFROM orders\nGROUP BY category\nORDER BY total_amount DESC;`,
    expectedResult: [
      ["Large", 2, 1300.0],
      ["Medium", 4, 870.0],
      ["Small", 4, 245.0]
    ],
    expectedColumns: ["category", "order_count", "total_amount"],
    hints: [
      "CASE WHEN amount < 100 THEN 'Small'",
      "WHEN amount < 500 THEN 'Medium'",
      "ELSE 'Large' END"
    ],
    solution: `SELECT \n  CASE \n    WHEN amount < 100 THEN 'Small'\n    WHEN amount < 500 THEN 'Medium'\n    ELSE 'Large'\n  END as category,\n  COUNT(*) as order_count,\n  SUM(amount) as total_amount\nFROM orders\nGROUP BY category\nORDER BY total_amount DESC;`
  },
  {
    id: "sql_task_012", module: 1, order: 12,
    title: "Self JOIN — Иерархия",
    difficulty: "middle", language: "sql",
    description: `Выведите для каждого сотрудника имя его менеджера.\nДля сотрудников без менеджера (CEO) выведите <code>'—'</code>.\n\nВыведите: <code>employee</code>, <code>manager</code>.\nОтсортируйте по <code>employee</code>.`,
    setupSQL: `
      CREATE TABLE employees (
        id INTEGER PRIMARY KEY, name TEXT, manager_id INTEGER
      );
      INSERT INTO employees VALUES
        (1,'CEO John',NULL),(2,'VP Alice',1),(3,'VP Bob',1),
        (4,'Manager Carol',2),(5,'Manager Dave',2),
        (6,'Dev Eve',4),(7,'Dev Frank',4),(8,'Dev Grace',5);
    `,
    starterCode: `-- Self JOIN: сотрудник → менеджер\n`,
    expectedResult: [
      ["CEO John", "—"],
      ["Dev Eve", "Manager Carol"],
      ["Dev Frank", "Manager Carol"],
      ["Dev Grace", "Manager Dave"],
      ["Manager Carol", "VP Alice"],
      ["Manager Dave", "VP Alice"],
      ["VP Alice", "CEO John"],
      ["VP Bob", "CEO John"]
    ],
    expectedColumns: ["employee", "manager"],
    hints: [
      "LEFT JOIN employees m ON e.manager_id = m.id",
      "COALESCE(m.name, '—') для NULL менеджеров"
    ],
    solution: `SELECT \n  e.name as employee,\n  COALESCE(m.name, '—') as manager\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.id\nORDER BY e.name;`
  },
  {
    id: "sql_task_013", module: 1, order: 13,
    title: "NTILE — Квартили зарплат",
    difficulty: "middle", language: "sql",
    description: `Разделите сотрудников на <strong>4 квартиля</strong> по зарплате с помощью <code>NTILE(4)</code>.\n\nВыведите: <code>name</code>, <code>salary</code>, <code>quartile</code>.\nОтсортируйте по зарплате DESC.`,
    setupSQL: `
      CREATE TABLE employees (
        id INTEGER PRIMARY KEY, name TEXT, salary INTEGER
      );
      INSERT INTO employees VALUES
        (1,'Alice',95000),(2,'Bob',85000),(3,'Charlie',78000),
        (4,'Diana',72000),(5,'Eve',92000),(6,'Frank',65000),
        (7,'Grace',88000),(8,'Hank',70000);
    `,
    starterCode: `-- Разделите на 4 квартиля по зарплате\n`,
    expectedResult: [
      ["Alice", 95000, 1],
      ["Eve", 92000, 1],
      ["Grace", 88000, 2],
      ["Bob", 85000, 2],
      ["Charlie", 78000, 3],
      ["Diana", 72000, 3],
      ["Hank", 70000, 4],
      ["Frank", 65000, 4]
    ],
    expectedColumns: ["name", "salary", "quartile"],
    hints: [
      "NTILE(4) OVER (ORDER BY salary DESC)"
    ],
    solution: `SELECT \n  name, salary,\n  NTILE(4) OVER (ORDER BY salary DESC) as quartile\nFROM employees\nORDER BY salary DESC;`
  },
  {
    id: "sql_task_014", module: 1, order: 14,
    title: "Заполнение календаря",
    difficulty: "middle", language: "sql",
    description: `Дана таблица продаж. Некоторые дни пропущены (не было продаж).\nИспользуя CROSS JOIN с таблицей дат, создайте полный отчёт за все дни.\nДля дней без продаж amount = <code>0</code>.\n\nВыведите: <code>day</code>, <code>total_amount</code>.`,
    setupSQL: `
      CREATE TABLE calendar (day TEXT PRIMARY KEY);
      INSERT INTO calendar VALUES ('2024-01-01'),('2024-01-02'),('2024-01-03'),('2024-01-04'),('2024-01-05');
      
      CREATE TABLE sales (id INTEGER PRIMARY KEY, sale_date TEXT, amount REAL);
      INSERT INTO sales VALUES (1,'2024-01-01',1000),(2,'2024-01-01',500),(3,'2024-01-03',750),(4,'2024-01-05',1200);
    `,
    starterCode: `-- Заполните все дни, 0 если нет продаж\n`,
    expectedResult: [
      ["2024-01-01", 1500.0],
      ["2024-01-02", 0.0],
      ["2024-01-03", 750.0],
      ["2024-01-04", 0.0],
      ["2024-01-05", 1200.0]
    ],
    expectedColumns: ["day", "total_amount"],
    hints: [
      "LEFT JOIN calendar c с sales s ON c.day = s.sale_date",
      "COALESCE(SUM(s.amount), 0) для замены NULL на 0",
      "GROUP BY c.day"
    ],
    solution: `SELECT \n  c.day,\n  COALESCE(SUM(s.amount), 0) as total_amount\nFROM calendar c\nLEFT JOIN sales s ON c.day = s.sale_date\nGROUP BY c.day\nORDER BY c.day;`
  },
  {
    id: "sql_task_015", module: 1, order: 15,
    title: "Consecutive Days — Последовательные дни",
    difficulty: "senior", language: "sql",
    description: `Найдите пользователей, которые были активны <strong>3 дня подряд</strong>.\n\nВыведите: <code>user_id</code> (уникальные).`,
    setupSQL: `
      CREATE TABLE logins (user_id INTEGER, login_date TEXT);
      INSERT INTO logins VALUES
        (1,'2024-01-01'),(1,'2024-01-02'),(1,'2024-01-03'),(1,'2024-01-05'),
        (2,'2024-01-01'),(2,'2024-01-03'),(2,'2024-01-04'),
        (3,'2024-01-10'),(3,'2024-01-11'),(3,'2024-01-12'),(3,'2024-01-13'),
        (4,'2024-01-01'),(4,'2024-01-02');
    `,
    starterCode: `-- Пользователи с 3 последовательными днями активности\n-- Подсказка: используйте ROW_NUMBER и группировку\n`,
    expectedResult: [
      [1],
      [3]
    ],
    expectedColumns: ["user_id"],
    hints: [
      "Используйте трюк с ROW_NUMBER: date - ROW_NUMBER() даёт одинаковое значение для последовательных дат",
      "JULIANDAY(login_date) - ROW_NUMBER() для группировки последовательностей",
      "HAVING COUNT(*) >= 3 для фильтра"
    ],
    solution: `WITH numbered AS (\n  SELECT DISTINCT user_id, login_date,\n    JULIANDAY(login_date) - ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) as grp\n  FROM logins\n),\nstreaks AS (\n  SELECT user_id, grp, COUNT(*) as streak_len\n  FROM numbered\n  GROUP BY user_id, grp\n  HAVING COUNT(*) >= 3\n)\nSELECT DISTINCT user_id\nFROM streaks\nORDER BY user_id;`
  },

  // ============================================
  // MODULE 2: Python Tasks (20 tasks)
  // ============================================

  {
    id: "py_task_001", module: 2, order: 1,
    title: "Подсчёт частоты слов",
    difficulty: "junior", language: "python",
    description: `Напишите функцию <code>word_count(text)</code>, которая принимает строку текста и возвращает словарь с подсчётом каждого слова (в нижнем регистре).\n\nИгнорируйте регистр. Знаки препинания не учитывать (слова содержат только буквы).`,
    starterCode: `def word_count(text):\n    """\n    Подсчитайте частоту каждого слова.\n    Приведите к нижнему регистру.\n    """\n    # Ваш код здесь\n    pass`,
    testCases: [
      {
        input: `word_count("Hello world hello World")`,
        expected: `{"hello": 2, "world": 2}`
      },
      {
        input: `word_count("Python is great and python is fun")`,
        expected: `{"python": 2, "is": 2, "great": 1, "and": 1, "fun": 1}`
      },
      {
        input: `word_count("")`,
        expected: `{}`
      }
    ],
    hints: [
      "text.lower().split() — разобьёт строку на слова",
      "Используйте dict или collections.Counter"
    ],
    solution: `def word_count(text):\n    if not text.strip():\n        return {}\n    words = text.lower().split()\n    result = {}\n    for word in words:\n        result[word] = result.get(word, 0) + 1\n    return result`
  },
  {
    id: "py_task_002", module: 2, order: 2,
    title: "Flatten вложенного списка",
    difficulty: "junior", language: "python",
    description: `Напишите функцию <code>flatten(lst)</code>, которая "разворачивает" вложенный список в плоский.\n\nФункция должна обрабатывать произвольную глубину вложенности.`,
    starterCode: `def flatten(lst):\n    """\n    Разверните вложенный список в плоский.\n    [1, [2, [3, 4]], 5] → [1, 2, 3, 4, 5]\n    """\n    # Ваш код здесь\n    pass`,
    testCases: [
      {
        input: `flatten([1, [2, 3], [4, [5, 6]]])`,
        expected: `[1, 2, 3, 4, 5, 6]`
      },
      {
        input: `flatten([1, 2, 3])`,
        expected: `[1, 2, 3]`
      },
      {
        input: `flatten([[[[1]]]])`,
        expected: `[1]`
      },
      {
        input: `flatten([])`,
        expected: `[]`
      }
    ],
    hints: [
      "Рекурсия: если элемент — список, вызовите flatten для него",
      "isinstance(item, list) для проверки типа"
    ],
    solution: `def flatten(lst):\n    result = []\n    for item in lst:\n        if isinstance(item, list):\n            result.extend(flatten(item))\n        else:\n            result.append(item)\n    return result`
  },
  {
    id: "py_task_003", module: 2, order: 3,
    title: "Декоратор timing",
    difficulty: "junior", language: "python",
    description: `Напишите декоратор <code>timing</code>, который замеряет время выполнения функции и возвращает кортеж <code>(result, elapsed_time)</code>.\n\n<code>elapsed_time</code> — время в секундах (float).`,
    starterCode: `import time\n\ndef timing(func):\n    """\n    Декоратор: возвращает (result, elapsed_seconds)\n    """\n    # Ваш код здесь\n    pass\n\n@timing\ndef slow_sum(n):\n    total = 0\n    for i in range(n):\n        total += i\n    return total`,
    testCases: [
      {
        input: `result, elapsed = slow_sum(1000000)\ntype(result) == int and type(elapsed) == float and result == 499999500000 and elapsed >= 0`,
        expected: `True`
      },
      {
        input: `result, elapsed = slow_sum(0)\nresult == 0 and elapsed >= 0`,
        expected: `True`
      }
    ],
    hints: [
      "import functools и используйте @functools.wraps(func)",
      "time.perf_counter() до и после вызова функции",
      "return (result, elapsed)"
    ],
    solution: `import time\nimport functools\n\ndef timing(func):\n    @functools.wraps(func)\n    def wrapper(*args, **kwargs):\n        start = time.perf_counter()\n        result = func(*args, **kwargs)\n        elapsed = time.perf_counter() - start\n        return (result, elapsed)\n    return wrapper\n\n@timing\ndef slow_sum(n):\n    total = 0\n    for i in range(n):\n        total += i\n    return total`
  },
  {
    id: "py_task_004", module: 2, order: 4,
    title: "Парсинг логов",
    difficulty: "junior", language: "python",
    description: `Напишите функцию <code>parse_logs(log_lines)</code>, которая парсит список строк логов и возвращает словарь с подсчётом по уровням.\n\nФормат лога: <code>"2024-01-15 10:30:00 ERROR Connection failed"</code>\nУровень — третье слово (ERROR, INFO, WARNING и т.д.).`,
    starterCode: `def parse_logs(log_lines):\n    """\n    Парсит логи и считает количество по уровням.\n    Возвращает: {"ERROR": 2, "INFO": 5, ...}\n    """\n    # Ваш код здесь\n    pass`,
    testCases: [
      {
        input: `parse_logs([\n    "2024-01-15 10:30:00 ERROR Connection failed",\n    "2024-01-15 10:31:00 INFO Server started",\n    "2024-01-15 10:32:00 ERROR Timeout",\n    "2024-01-15 10:33:00 WARNING Low memory",\n    "2024-01-15 10:34:00 INFO Request processed"\n])`,
        expected: `{"ERROR": 2, "INFO": 2, "WARNING": 1}`
      },
      {
        input: `parse_logs([])`,
        expected: `{}`
      }
    ],
    hints: [
      "line.split() разбивает строку по пробелам",
      "parts[2] — уровень (третий элемент)",
      "Используйте dict.get(key, 0) + 1"
    ],
    solution: `def parse_logs(log_lines):\n    counts = {}\n    for line in log_lines:\n        if not line.strip():\n            continue\n        parts = line.split()\n        if len(parts) >= 3:\n            level = parts[2]\n            counts[level] = counts.get(level, 0) + 1\n    return counts`
  },
  {
    id: "py_task_005", module: 2, order: 5,
    title: "Дедупликация записей",
    difficulty: "junior", language: "python",
    description: `Напишите функцию <code>deduplicate(records, key)</code>, которая удаляет дубликаты из списка словарей по указанному ключу.\n\nСохраните <strong>первое</strong> вхождение каждого уникального значения.`,
    starterCode: `def deduplicate(records, key):\n    """\n    Удалите дубликаты по указанному ключу.\n    Сохраните порядок и первое вхождение.\n    """\n    # Ваш код здесь\n    pass`,
    testCases: [
      {
        input: `deduplicate([\n    {"id": 1, "name": "Alice"},\n    {"id": 2, "name": "Bob"},\n    {"id": 1, "name": "Alice Updated"},\n    {"id": 3, "name": "Charlie"},\n    {"id": 2, "name": "Bob Updated"}\n], "id")`,
        expected: `[{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}, {"id": 3, "name": "Charlie"}]`
      },
      {
        input: `deduplicate([], "id")`,
        expected: `[]`
      }
    ],
    hints: [
      "set() для отслеживания seen ключей",
      "Проверяйте record[key] перед добавлением"
    ],
    solution: `def deduplicate(records, key):\n    seen = set()\n    result = []\n    for record in records:\n        val = record[key]\n        if val not in seen:\n            seen.add(val)\n            result.append(record)\n    return result`
  },
  {
    id: "py_task_006", module: 2, order: 6,
    title: "Chunk-обработка данных",
    difficulty: "junior", language: "python",
    description: `Напишите генератор <code>chunked(iterable, size)</code>, который разбивает последовательность на чанки указанного размера.\n\nПоследний чанк может быть меньше.`,
    starterCode: `def chunked(iterable, size):\n    """\n    Разбейте iterable на чанки размера size.\n    Возвращает генератор списков.\n    """\n    # Ваш код здесь\n    pass`,
    testCases: [
      {
        input: `list(chunked([1,2,3,4,5,6,7], 3))`,
        expected: `[[1, 2, 3], [4, 5, 6], [7]]`
      },
      {
        input: `list(chunked([1,2,3,4], 2))`,
        expected: `[[1, 2], [3, 4]]`
      },
      {
        input: `list(chunked([], 5))`,
        expected: `[]`
      }
    ],
    hints: [
      "Конвертируйте iterable в list если нужно",
      "range(0, len(lst), size) для итерации с шагом",
      "yield lst[i:i+size]"
    ],
    solution: `def chunked(iterable, size):\n    lst = list(iterable)\n    for i in range(0, len(lst), size):\n        yield lst[i:i+size]`
  },
  {
    id: "py_task_007", module: 2, order: 7,
    title: "JSON → Плоский словарь",
    difficulty: "middle", language: "python",
    description: `Напишите функцию <code>flatten_json(data, prefix='')</code>, которая "разворачивает" вложенный JSON/dict в плоский словарь.\n\nКлючи вложенных объектов соединяются через точку: <code>"user.address.city"</code>.`,
    starterCode: `def flatten_json(data, prefix=''):\n    """\n    Разверните вложенный dict в плоский.\n    {"a": {"b": 1}} → {"a.b": 1}\n    """\n    # Ваш код здесь\n    pass`,
    testCases: [
      {
        input: `flatten_json({"name": "Alice", "address": {"city": "Moscow", "zip": "101000"}})`,
        expected: `{"name": "Alice", "address.city": "Moscow", "address.zip": "101000"}`
      },
      {
        input: `flatten_json({"a": {"b": {"c": 1}}})`,
        expected: `{"a.b.c": 1}`
      },
      {
        input: `flatten_json({"x": 1, "y": 2})`,
        expected: `{"x": 1, "y": 2}`
      }
    ],
    hints: [
      "Рекурсия: если значение — dict, рекурсивно вызываем flatten_json",
      "Формируем новый ключ: f'{prefix}.{key}' если prefix не пустой"
    ],
    solution: `def flatten_json(data, prefix=''):\n    result = {}\n    for key, value in data.items():\n        new_key = f\"{prefix}.{key}\" if prefix else key\n        if isinstance(value, dict):\n            result.update(flatten_json(value, new_key))\n        else:\n            result[new_key] = value\n    return result`
  },
  {
    id: "py_task_008", module: 2, order: 8,
    title: "Retry decorator",
    difficulty: "middle", language: "python",
    description: `Напишите декоратор <code>retry(max_attempts=3)</code>, который повторяет вызов функции при возникновении исключения.\n\nЕсли все попытки исчерпаны, бросьте последнее исключение.\nВерните результат при первом успешном вызове.`,
    starterCode: `def retry(max_attempts=3):\n    """\n    Декоратор: повторяет вызов max_attempts раз.\n    """\n    # Ваш код здесь\n    pass`,
    testCases: [
      {
        input: `call_count = 0\n@retry(max_attempts=3)\ndef always_works():\n    global call_count\n    call_count += 1\n    return "ok"\nresult = always_works()\nresult == "ok" and call_count == 1`,
        expected: `True`
      },
      {
        input: `attempt = 0\n@retry(max_attempts=5)\ndef fails_twice():\n    global attempt\n    attempt += 1\n    if attempt <= 2:\n        raise ValueError("fail")\n    return "success"\nattempt = 0\nresult = fails_twice()\nresult == "success" and attempt == 3`,
        expected: `True`
      }
    ],
    hints: [
      "Двухуровневый декоратор: retry(max_attempts) возвращает декоратор",
      "for i in range(max_attempts): try/except",
      "На последней попытке — raise"
    ],
    solution: `import functools\n\ndef retry(max_attempts=3):\n    def decorator(func):\n        @functools.wraps(func)\n        def wrapper(*args, **kwargs):\n            last_exception = None\n            for attempt in range(max_attempts):\n                try:\n                    return func(*args, **kwargs)\n                except Exception as e:\n                    last_exception = e\n            raise last_exception\n        return wrapper\n    return decorator`
  },
  {
    id: "py_task_009", module: 2, order: 9,
    title: "Валидация схемы данных",
    difficulty: "middle", language: "python",
    description: `Напишите функцию <code>validate_schema(records, schema)</code>, которая проверяет список записей на соответствие схеме.\n\nСхема — словарь: <code>{"field_name": type}</code>.\nФункция возвращает список невалидных записей с описанием ошибки.`,
    starterCode: `def validate_schema(records, schema):\n    """\n    Проверяет записи на соответствие схеме.\n    schema: {"name": str, "age": int, "score": float}\n    Возвращает: [{"index": 0, "errors": ["age: expected int, got str"]}, ...]\n    """\n    # Ваш код здесь\n    pass`,
    testCases: [
      {
        input: `validate_schema(\n    [{"name": "Alice", "age": 25, "score": 9.5},\n     {"name": "Bob", "age": "thirty", "score": 8.0},\n     {"name": 123, "age": 20, "score": "high"}],\n    {"name": str, "age": int, "score": float}\n)`,
        expected: `[{"index": 1, "errors": ["age: expected int, got str"]}, {"index": 2, "errors": ["name: expected str, got int", "score: expected float, got str"]}]`
      },
      {
        input: `validate_schema(\n    [{"name": "Alice", "age": 25}],\n    {"name": str, "age": int}\n)`,
        expected: `[]`
      }
    ],
    hints: [
      "Для каждой записи проверяйте isinstance(record[field], expected_type)",
      "type(value).__name__ для получения имени типа"
    ],
    solution: `def validate_schema(records, schema):\n    invalid = []\n    for idx, record in enumerate(records):\n        errors = []\n        for field, expected_type in schema.items():\n            if field in record:\n                value = record[field]\n                if not isinstance(value, expected_type):\n                    errors.append(f\"{field}: expected {expected_type.__name__}, got {type(value).__name__}\")\n        if errors:\n            invalid.append({\"index\": idx, \"errors\": errors})\n    return invalid`
  },
  {
    id: "py_task_010", module: 2, order: 10,
    title: "Pipeline Builder",
    difficulty: "middle", language: "python",
    description: `Создайте класс <code>Pipeline</code>, который позволяет добавлять шаги обработки через метод <code>add_step(func)</code> и запускать все шаги через <code>run(data)</code>.\n\nКаждый шаг принимает данные и возвращает обработанные данные (вход следующего шага).`,
    starterCode: `class Pipeline:\n    """\n    Pipeline builder pattern.\n    pipeline.add_step(func1).add_step(func2).run(data)\n    """\n    def __init__(self):\n        # Ваш код здесь\n        pass\n    \n    def add_step(self, func):\n        # Ваш код здесь\n        pass\n    \n    def run(self, data):\n        # Ваш код здесь\n        pass`,
    testCases: [
      {
        input: `p = Pipeline()\np.add_step(lambda x: [i * 2 for i in x])\np.add_step(lambda x: [i for i in x if i > 5])\np.add_step(lambda x: sorted(x))\nresult = p.run([1, 2, 3, 4, 5])\nresult`,
        expected: `[6, 8, 10]`
      },
      {
        input: `p = Pipeline()\nresult = p.run([1, 2, 3])\nresult`,
        expected: `[1, 2, 3]`
      }
    ],
    hints: [
      "self.steps = [] в __init__",
      "add_step: append и return self (для chaining)",
      "run: последовательно применяйте каждый step к data"
    ],
    solution: `class Pipeline:\n    def __init__(self):\n        self.steps = []\n    \n    def add_step(self, func):\n        self.steps.append(func)\n        return self  # для chaining\n    \n    def run(self, data):\n        result = data\n        for step in self.steps:\n            result = step(result)\n        return result`
  },

  // ============================================
  // ADDITIONAL SQL TASKS (16-25)
  // ============================================

  {
    id: "sql_task_016", module: 1, order: 16,
    title: "PIVOT — Транспонирование данных",
    difficulty: "middle", language: "sql",
    description: `Преобразуйте данные о продажах по месяцам в горизонтальный формат.\n\nВыведите: \u003ccode\u003eproduct\u003c/code\u003e, \u003ccode\u003ejan_sales\u003c/code\u003e, \u003ccode\u003efeb_sales\u003c/code\u003e, \u003ccode\u003emar_sales\u003c/code\u003e.`,
    setupSQL: `
      CREATE TABLE sales (product TEXT, month TEXT, amount REAL);
      INSERT INTO sales VALUES
        ('Widget','Jan',100),('Widget','Feb',150),('Widget','Mar',200),
        ('Gadget','Jan',300),('Gadget','Feb',250),('Gadget','Mar',350),
        ('Gizmo','Jan',50),('Gizmo','Mar',100);
    `,
    starterCode: `-- Pivot: строки → столбцы\n-- Используйте CASE WHEN + SUM\n`,
    expectedResult: [
      ["Gadget", 300.0, 250.0, 350.0],
      ["Gizmo", 50.0, 0.0, 100.0],
      ["Widget", 100.0, 150.0, 200.0]
    ],
    expectedColumns: ["product", "jan_sales", "feb_sales", "mar_sales"],
    hints: [
      "SUM(CASE WHEN month = 'Jan' THEN amount ELSE 0 END) as jan_sales",
      "GROUP BY product"
    ],
    solution: `SELECT \n  product,\n  SUM(CASE WHEN month = 'Jan' THEN amount ELSE 0 END) as jan_sales,\n  SUM(CASE WHEN month = 'Feb' THEN amount ELSE 0 END) as feb_sales,\n  SUM(CASE WHEN month = 'Mar' THEN amount ELSE 0 END) as mar_sales\nFROM sales\nGROUP BY product\nORDER BY product;`
  },
  {
    id: "sql_task_017", module: 1, order: 17,
    title: "UNION — Объединение данных",
    difficulty: "junior", language: "sql",
    description: `Объедините данные из двух таблиц \u003ccode\u003eus_customers\u003c/code\u003e и \u003ccode\u003eeu_customers\u003c/code\u003e в общий список.\n\nДобавьте столбец \u003ccode\u003eregion\u003c/code\u003e ('US' или 'EU').\nВыведите: \u003ccode\u003ename\u003c/code\u003e, \u003ccode\u003eemail\u003c/code\u003e, \u003ccode\u003eregion\u003c/code\u003e.\nОтсортируйте по имени.`,
    setupSQL: `
      CREATE TABLE us_customers (id INTEGER, name TEXT, email TEXT);
      INSERT INTO us_customers VALUES (1,'Alice','alice@us.com'),(2,'Bob','bob@us.com');
      CREATE TABLE eu_customers (id INTEGER, name TEXT, email TEXT);
      INSERT INTO eu_customers VALUES (1,'Charlie','charlie@eu.com'),(2,'Diana','diana@eu.com');
    `,
    starterCode: `-- Объедините две таблицы с добавлением region\n`,
    expectedResult: [
      ["Alice", "alice@us.com", "US"],
      ["Bob", "bob@us.com", "US"],
      ["Charlie", "charlie@eu.com", "EU"],
      ["Diana", "diana@eu.com", "EU"]
    ],
    expectedColumns: ["name", "email", "region"],
    hints: ["UNION ALL для объединения", "'US' as region в SELECT"],
    solution: `SELECT name, email, 'US' as region FROM us_customers\nUNION ALL\nSELECT name, email, 'EU' as region FROM eu_customers\nORDER BY name;`
  },
  {
    id: "sql_task_018", module: 1, order: 18,
    title: "Процент от общего — % Revenue",
    difficulty: "middle", language: "sql",
    description: `Для каждого продукта вычислите его \u003cstrong\u003eдолю от общей выручки\u003c/strong\u003e в процентах.\n\nВыведите: \u003ccode\u003eproduct\u003c/code\u003e, \u003ccode\u003erevenue\u003c/code\u003e, \u003ccode\u003epct_of_total\u003c/code\u003e (округлить до 1 знака).\nОтсортируйте по pct_of_total DESC.`,
    setupSQL: `
      CREATE TABLE product_sales (product TEXT, revenue REAL);
      INSERT INTO product_sales VALUES ('A',5000),('B',3000),('C',1500),('D',500);
    `,
    starterCode: `-- Процент от общей выручки\n`,
    expectedResult: [
      ["A", 5000.0, 50.0],
      ["B", 3000.0, 30.0],
      ["C", 1500.0, 15.0],
      ["D", 500.0, 5.0]
    ],
    expectedColumns: ["product", "revenue", "pct_of_total"],
    hints: [
      "SUM(revenue) OVER () — общая сумма (оконная функция без PARTITION)",
      "ROUND(revenue * 100.0 / SUM(revenue) OVER (), 1)"
    ],
    solution: `SELECT \n  product, revenue,\n  ROUND(revenue * 100.0 / SUM(revenue) OVER (), 1) as pct_of_total\nFROM product_sales\nORDER BY pct_of_total DESC;`
  },
  {
    id: "sql_task_019", module: 1, order: 19,
    title: "EXISTS — Активные клиенты",
    difficulty: "middle", language: "sql",
    description: `Найдите клиентов, у которых \u003cstrong\u003eесть хотя бы один заказ\u003c/strong\u003e за последние 30 дней.\n\nИспользуйте \u003ccode\u003eEXISTS\u003c/code\u003e.\nВыведите: \u003ccode\u003ename\u003c/code\u003e, \u003ccode\u003eemail\u003c/code\u003e.\nОтсортируйте по имени.`,
    setupSQL: `
      CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, email TEXT);
      INSERT INTO customers VALUES (1,'Alice','a@test.com'),(2,'Bob','b@test.com'),(3,'Charlie','c@test.com'),(4,'Diana','d@test.com');
      CREATE TABLE orders (id INTEGER, customer_id INTEGER, order_date TEXT);
      INSERT INTO orders VALUES
        (1,1,'2024-03-01'),(2,1,'2024-03-15'),(3,2,'2024-01-01'),(4,3,'2024-03-10'),(5,3,'2024-03-20');
    `,
    starterCode: `-- Клиенты с заказами за последние 30 дней (от 2024-03-01)\n-- Используйте EXISTS\n`,
    expectedResult: [
      ["Alice", "a@test.com"],
      ["Charlie", "c@test.com"]
    ],
    expectedColumns: ["name", "email"],
    hints: [
      "WHERE EXISTS (SELECT 1 FROM orders WHERE ...)",
      "order_date >= '2024-03-01'"
    ],
    solution: `SELECT c.name, c.email\nFROM customers c\nWHERE EXISTS (\n  SELECT 1 FROM orders o\n  WHERE o.customer_id = c.id AND o.order_date >= '2024-03-01'\n)\nORDER BY c.name;`
  },
  {
    id: "sql_task_020", module: 1, order: 20,
    title: "Multi-level Aggregation",
    difficulty: "senior", language: "sql",
    description: `Для каждого отдела и месяца посчитайте:\n- Количество заказов (\u003ccode\u003eorder_count\u003c/code\u003e)\n- Выручку (\u003ccode\u003erevenue\u003c/code\u003e)\n- Долю от выручки отдела (\u003ccode\u003epct_of_dept\u003c/code\u003e) — округлить до 1 знака.\n\nВыведите: \u003ccode\u003edepartment\u003c/code\u003e, \u003ccode\u003emonth\u003c/code\u003e, \u003ccode\u003eorder_count\u003c/code\u003e, \u003ccode\u003erevenue\u003c/code\u003e, \u003ccode\u003epct_of_dept\u003c/code\u003e.`,
    setupSQL: `
      CREATE TABLE dept_orders (id INTEGER, department TEXT, order_date TEXT, amount REAL);
      INSERT INTO dept_orders VALUES
        (1,'Sales','2024-01-05',1000),(2,'Sales','2024-01-15',2000),
        (3,'Sales','2024-02-10',1500),(4,'Sales','2024-02-20',2500),
        (5,'Marketing','2024-01-08',800),(6,'Marketing','2024-01-25',1200),
        (7,'Marketing','2024-02-15',1000);
    `,
    starterCode: `-- Multi-level: revenue per dept per month + % of dept total\n`,
    expectedResult: [
      ["Marketing", "2024-01", 2, 2000.0, 66.7],
      ["Marketing", "2024-02", 1, 1000.0, 33.3],
      ["Sales", "2024-01", 2, 3000.0, 42.9],
      ["Sales", "2024-02", 2, 4000.0, 57.1]
    ],
    expectedColumns: ["department", "month", "order_count", "revenue", "pct_of_dept"],
    hints: [
      "GROUP BY department, substr(order_date,1,7)",
      "SUM(revenue) OVER (PARTITION BY department) для dept total",
      "ROUND(revenue * 100.0 / dept_total, 1)"
    ],
    solution: `WITH monthly AS (\n  SELECT \n    department,\n    substr(order_date,1,7) as month,\n    COUNT(*) as order_count,\n    SUM(amount) as revenue\n  FROM dept_orders\n  GROUP BY department, substr(order_date,1,7)\n)\nSELECT \n  department, month, order_count, revenue,\n  ROUND(revenue * 100.0 / SUM(revenue) OVER (PARTITION BY department), 1) as pct_of_dept\nFROM monthly\nORDER BY department, month;`
  },

  // ============================================
  // ADDITIONAL PYTHON TASKS (11-25)
  // ============================================

  {
    id: "py_task_011", module: 2, order: 11,
    title: "CSV парсер",
    difficulty: "junior", language: "python",
    description: `Напишите функцию \u003ccode\u003eparse_csv(text)\u003c/code\u003e, которая парсит CSV текст (строку) в список словарей.\n\nПервая строка — заголовки. Разделитель — запятая.`,
    starterCode: `def parse_csv(text):\n    """Parse CSV text into list of dicts."""\n    # Ваш код здесь\n    pass`,
    testCases: [
      {
        input: `parse_csv("name,age,city\\nAlice,25,Moscow\\nBob,30,Berlin")`,
        expected: `[{"name": "Alice", "age": "25", "city": "Moscow"}, {"name": "Bob", "age": "30", "city": "Berlin"}]`
      },
      {
        input: `parse_csv("id,value\\n1,100")`,
        expected: `[{"id": "1", "value": "100"}]`
      }
    ],
    hints: ["text.strip().split('\\n') для строк", "zip(headers, values) для создания dict"],
    solution: `def parse_csv(text):\n    lines = text.strip().split('\\n')\n    if len(lines) < 2:\n        return []\n    headers = lines[0].split(',')\n    result = []\n    for line in lines[1:]:\n        values = line.split(',')\n        result.append(dict(zip(headers, values)))\n    return result`
  },
  {
    id: "py_task_012", module: 2, order: 12,
    title: "Group By на Python",
    difficulty: "junior", language: "python",
    description: `Напишите функцию \u003ccode\u003egroup_by(records, key)\u003c/code\u003e, которая группирует список словарей по указанному ключу.\n\nВозвращает словарь: \u003ccode\u003e{key_value: [records...]}\u003c/code\u003e.`,
    starterCode: `def group_by(records, key):\n    """Group records by key field."""\n    # Ваш код здесь\n    pass`,
    testCases: [
      {
        input: `group_by([\n    {"dept": "Engineering", "name": "Alice"},\n    {"dept": "Marketing", "name": "Bob"},\n    {"dept": "Engineering", "name": "Charlie"}\n], "dept")`,
        expected: `{"Engineering": [{"dept": "Engineering", "name": "Alice"}, {"dept": "Engineering", "name": "Charlie"}], "Marketing": [{"dept": "Marketing", "name": "Bob"}]}`
      }
    ],
    hints: ["defaultdict(list) or setdefault", "groups[record[key]].append(record)"],
    solution: `def group_by(records, key):\n    groups = {}\n    for record in records:\n        k = record[key]\n        if k not in groups:\n            groups[k] = []\n        groups[k].append(record)\n    return groups`
  },
  {
    id: "py_task_013", module: 2, order: 13,
    title: "Маппинг столбцов",
    difficulty: "junior", language: "python",
    description: `Напишите функцию \u003ccode\u003erename_keys(records, mapping)\u003c/code\u003e, которая переименовывает ключи в списке словарей.\n\nMapping — словарь \u003ccode\u003e{old_name: new_name}\u003c/code\u003e. Ключи, отсутствующие в mapping, остаются без изменений.`,
    starterCode: `def rename_keys(records, mapping):\n    """Rename keys in list of dicts."""\n    # Ваш код здесь\n    pass`,
    testCases: [
      {
        input: `rename_keys(\n    [{"user_id": 1, "user_name": "Alice", "score": 95}],\n    {"user_id": "id", "user_name": "name"}\n)`,
        expected: `[{"id": 1, "name": "Alice", "score": 95}]`
      },
      {
        input: `rename_keys([{"a": 1, "b": 2}], {})`,
        expected: `[{"a": 1, "b": 2}]`
      }
    ],
    hints: ["mapping.get(key, key) — вернёт новое имя или оригинальное"],
    solution: `def rename_keys(records, mapping):\n    result = []\n    for record in records:\n        new_record = {}\n        for key, value in record.items():\n            new_key = mapping.get(key, key)\n            new_record[new_key] = value\n        result.append(new_record)\n    return result`
  },
  {
    id: "py_task_014", module: 2, order: 14,
    title: "Running Average — Скользящее среднее",
    difficulty: "middle", language: "python",
    description: `Напишите функцию \u003ccode\u003emoving_average(data, window)\u003c/code\u003e, которая считает скользящее среднее.\n\nДля первых элементов (меньше window) считайте среднее по доступным.\nОкруглите до 1 знака после запятой.`,
    starterCode: `def moving_average(data, window):\n    """Calculate moving average with given window size."""\n    # Ваш код здесь\n    pass`,
    testCases: [
      {
        input: `moving_average([10, 20, 30, 40, 50], 3)`,
        expected: `[10.0, 15.0, 20.0, 30.0, 40.0]`
      },
      {
        input: `moving_average([100, 200, 300], 2)`,
        expected: `[100.0, 150.0, 250.0]`
      }
    ],
    hints: ["Для i-го элемента берите срез data[max(0, i-window+1):i+1]", "sum / len для среднего"],
    solution: `def moving_average(data, window):\n    result = []\n    for i in range(len(data)):\n        start = max(0, i - window + 1)\n        chunk = data[start:i+1]\n        avg = round(sum(chunk) / len(chunk), 1)\n        result.append(avg)\n    return result`
  },
  {
    id: "py_task_015", module: 2, order: 15,
    title: "Data Type Converter",
    difficulty: "middle", language: "python",
    description: `Напишите функцию \u003ccode\u003ecast_types(records, type_map)\u003c/code\u003e, которая приводит значения к нужным типам.\n\nЕсли преобразование невозможно — оставьте \u003ccode\u003eNone\u003c/code\u003e.`,
    starterCode: `def cast_types(records, type_map):\n    """\n    Cast fields to specified types.\n    type_map: {"age": int, "score": float, "name": str}\n    """\n    # Ваш код здесь\n    pass`,
    testCases: [
      {
        input: `cast_types(\n    [{"age": "25", "score": "9.5", "name": "Alice"},\n     {"age": "invalid", "score": "8.0", "name": "Bob"}],\n    {"age": int, "score": float, "name": str}\n)`,
        expected: `[{"age": 25, "score": 9.5, "name": "Alice"}, {"age": null, "score": 8.0, "name": "Bob"}]`
      }
    ],
    hints: ["try/except ValueError для обработки ошибок", "type_map[field](value) для преобразования"],
    solution: `def cast_types(records, type_map):\n    result = []\n    for record in records:\n        new_record = {}\n        for key, value in record.items():\n            if key in type_map:\n                try:\n                    new_record[key] = type_map[key](value)\n                except (ValueError, TypeError):\n                    new_record[key] = None\n            else:\n                new_record[key] = value\n        result.append(new_record)\n    return result`
  },
  {
    id: "py_task_016", module: 2, order: 16,
    title: "Merge двух списков",
    difficulty: "middle", language: "python",
    description: `Напишите функцию \u003ccode\u003emerge_records(left, right, on)\u003c/code\u003e, которая соединяет два списка словарей по ключу (аналог SQL JOIN).\n\nВозвращает список объединённых записей (left join — все из left).`,
    starterCode: `def merge_records(left, right, on):\n    """\n    Left join two lists of dicts on a key field.\n    """\n    # Ваш код здесь\n    pass`,
    testCases: [
      {
        input: `merge_records(\n    [{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}, {"id": 3, "name": "Charlie"}],\n    [{"id": 1, "city": "Moscow"}, {"id": 2, "city": "Berlin"}],\n    "id"\n)`,
        expected: `[{"id": 1, "name": "Alice", "city": "Moscow"}, {"id": 2, "name": "Bob", "city": "Berlin"}, {"id": 3, "name": "Charlie"}]`
      }
    ],
    hints: ["Создайте lookup dict из right: {record[on]: record}", "Для каждого left record — {**left_rec, **right_lookup.get(key, {})}"],
    solution: `def merge_records(left, right, on):\n    lookup = {r[on]: r for r in right}\n    result = []\n    for rec in left:\n        merged = dict(rec)\n        right_rec = lookup.get(rec[on], {})\n        for k, v in right_rec.items():\n            if k != on:\n                merged[k] = v\n        result.append(merged)\n    return result`
  },
  {
    id: "py_task_017", module: 2, order: 17,
    title: "Аггрегация по ключу",
    difficulty: "middle", language: "python",
    description: `Напишите функцию \u003ccode\u003eaggregate(records, group_key, agg_field, agg_func)\u003c/code\u003e.\n\nГруппирует записи по \u003ccode\u003egroup_key\u003c/code\u003e и применяет \u003ccode\u003eagg_func\u003c/code\u003e к значениям \u003ccode\u003eagg_field\u003c/code\u003e.\n\nВозвращает словарь \u003ccode\u003e{group: agg_result}\u003c/code\u003e.`,
    starterCode: `def aggregate(records, group_key, agg_field, agg_func):\n    """\n    Group by group_key, apply agg_func to agg_field.\n    agg_func: 'sum', 'avg', 'count', 'max', 'min'\n    """\n    # Ваш код здесь\n    pass`,
    testCases: [
      {
        input: `aggregate(\n    [{"dept": "Eng", "salary": 100}, {"dept": "Eng", "salary": 200}, {"dept": "Mkt", "salary": 150}],\n    "dept", "salary", "sum"\n)`,
        expected: `{"Eng": 300, "Mkt": 150}`
      },
      {
        input: `aggregate(\n    [{"dept": "Eng", "salary": 100}, {"dept": "Eng", "salary": 200}],\n    "dept", "salary", "avg"\n)`,
        expected: `{"Eng": 150.0}`
      }
    ],
    hints: ["Сначала group_by, потом apply agg", "if agg_func == 'sum': sum(values)"],
    solution: `def aggregate(records, group_key, agg_field, agg_func):\n    groups = {}\n    for rec in records:\n        k = rec[group_key]\n        if k not in groups:\n            groups[k] = []\n        groups[k].append(rec[agg_field])\n    \n    result = {}\n    for k, values in groups.items():\n        if agg_func == 'sum':\n            result[k] = sum(values)\n        elif agg_func == 'avg':\n            result[k] = sum(values) / len(values)\n        elif agg_func == 'count':\n            result[k] = len(values)\n        elif agg_func == 'max':\n            result[k] = max(values)\n        elif agg_func == 'min':\n            result[k] = min(values)\n    return result`
  },
  {
    id: "py_task_018", module: 2, order: 18,
    title: "Data Validation — Проверка данных",
    difficulty: "middle", language: "python",
    description: `Напишите функцию \u003ccode\u003evalidate_records(records, rules)\u003c/code\u003e.\n\nRules — список фунций-валидаторов, каждая принимает record и возвращает True/False.\n\nВерните tuple: (valid_records, invalid_records).`,
    starterCode: `def validate_records(records, rules):\n    """\n    Split records into valid and invalid based on rules.\n    rules: list of functions, record -> bool\n    """\n    # Ваш код здесь\n    pass`,
    testCases: [
      {
        input: `validate_records(\n    [{"name": "Alice", "age": 25}, {"name": "", "age": 30}, {"name": "Charlie", "age": -5}],\n    [lambda r: bool(r.get("name")), lambda r: r.get("age", 0) > 0]\n)`,
        expected: `([{"name": "Alice", "age": 25}], [{"name": "", "age": 30}, {"name": "Charlie", "age": -5}])`
      }
    ],
    hints: ["all(rule(record) for rule in rules) для проверки всех правил"],
    solution: `def validate_records(records, rules):\n    valid, invalid = [], []\n    for record in records:\n        if all(rule(record) for rule in rules):\n            valid.append(record)\n        else:\n            invalid.append(record)\n    return (valid, invalid)`
  },
  {
    id: "py_task_019", module: 2, order: 19,
    title: "SCD Type 1 — Обновление записей",
    difficulty: "middle", language: "python",
    description: `Напишите функцию \u003ccode\u003escd_type1(existing, incoming, key)\u003c/code\u003e.\n\nSCD Type 1: если запись существует — обновить (overwrite), если нет — вставить.\nВерните обновлённый список.`,
    starterCode: `def scd_type1(existing, incoming, key):\n    """\n    SCD Type 1: upsert records.\n    existing: current records\n    incoming: new/updated records  \n    key: field to match on\n    """\n    # Ваш код здесь\n    pass`,
    testCases: [
      {
        input: `scd_type1(\n    [{"id": 1, "name": "Alice", "city": "Moscow"}, {"id": 2, "name": "Bob", "city": "Berlin"}],\n    [{"id": 2, "name": "Bob", "city": "Paris"}, {"id": 3, "name": "Charlie", "city": "London"}],\n    "id"\n)`,
        expected: `[{"id": 1, "name": "Alice", "city": "Moscow"}, {"id": 2, "name": "Bob", "city": "Paris"}, {"id": 3, "name": "Charlie", "city": "London"}]`
      }
    ],
    hints: ["Создайте dict по key из existing", "Обновите dict из incoming", "Верните list(dict.values())"],
    solution: `def scd_type1(existing, incoming, key):\n    lookup = {r[key]: dict(r) for r in existing}\n    for rec in incoming:\n        lookup[rec[key]] = dict(rec)\n    return sorted(lookup.values(), key=lambda x: x[key])`
  },
  {
    id: "py_task_020", module: 2, order: 20,
    title: "Генератор батчей из итератора",
    difficulty: "middle", language: "python",
    description: `Напишите генератор \u003ccode\u003ebatchify(iterator, batch_size)\u003c/code\u003e, который собирает элементы из любого итератора в батчи.\n\nДолжен работать с любым итератором, НЕ только со списками (нельзя использовать len/indexing).`,
    starterCode: `def batchify(iterator, batch_size):\n    """\n    Collect items from any iterator into batches.\n    Works with generators, files, etc.\n    """\n    # Ваш код здесь\n    pass`,
    testCases: [
      {
        input: `list(batchify(iter(range(7)), 3))`,
        expected: `[[0, 1, 2], [3, 4, 5], [6]]`
      },
      {
        input: `list(batchify(iter([]), 5))`,
        expected: `[]`
      },
      {
        input: `list(batchify(iter("abcde"), 2))`,
        expected: `[["a", "b"], ["c", "d"], ["e"]]`
      }
    ],
    hints: ["Используйте iter() и next() с default значением", "Собирайте batch пока не получите StopIteration"],
    solution: `def batchify(iterator, batch_size):\n    it = iter(iterator)\n    while True:\n        batch = []\n        try:\n            for _ in range(batch_size):\n                batch.append(next(it))\n        except StopIteration:\n            if batch:\n                yield batch\n            return\n        yield batch`
  },
  // === MODULE 3: Data Modeling ===
  {
    id: "sql_dwh_001", module: 3, order: 1,
    title: "SCD Type 2: Закрытие старой записи",
    difficulty: "middle", language: "sql",
    description: `Вам дана таблица <code>dim_customer</code> типа SCD Type 2 (колонки: <code>id, name, city, valid_from, valid_to, is_current</code>).<br>Напишите запрос, который делает "устаревшей" текущую активную запись для 'id = 1' (клиент переехал), установив 'valid_to = "2023-12-01"' и 'is_current = 0'.`,
    setupSQL: `
      CREATE TABLE dim_customer (id INT, name TEXT, city TEXT, valid_from DATE, valid_to DATE, is_current INT);
      INSERT INTO dim_customer VALUES 
        (1, 'Ivan', 'Moscow', '2022-01-01', '9999-12-31', 1),
        (2, 'Anna', 'Kazan', '2023-05-01', '9999-12-31', 1);
    `,
    starterCode: `-- Ваш UPDATE запрос здесь\n\n\n-- Оставьте SELECT для проверки результата:\nSELECT * FROM dim_customer ORDER BY id;`,
    expectedResult: [
      [1, 'Ivan', 'Moscow', '2022-01-01', '2023-12-01', 0],
      [2, 'Anna', 'Kazan', '2023-05-01', '9999-12-31', 1]
    ],
    expectedColumns: ['id', 'name', 'city', 'valid_from', 'valid_to', 'is_current'],
    hints: ["Используйте UPDATE dim_customer SET ... WHERE id = 1 AND is_current = 1"],
    solution: `UPDATE dim_customer \nSET valid_to = '2023-12-01', is_current = 0 \nWHERE id = 1 AND is_current = 1;\nSELECT * FROM dim_customer ORDER BY id;`
  },
  {
    id: "py_dwh_002", module: 3, order: 2,
    title: "Генератор суррогатных ключей",
    difficulty: "junior", language: "python",
    description: `Суррогатные ключи (Surrogate Keys) используются в DWH как PK.\nНапишите функцию <code>generate_sk(business_key, source_system)</code>, которая возвращает ключ формата 'source_system_business_key' в нижнем регистре без пробелов.`,
    starterCode: `def generate_sk(business_key, source_system):\n    # Ваш код\n    pass`,
    testCases: [
      { input: `generate_sk(123, "CRM")`, expected: `"crm_123"` },
      { input: `generate_sk("A-45", " ERP ")`, expected: `"erp_a-45"` }
    ],
    hints: ["Используйте .strip().lower() для входных строк.", "Приведите числа к строкам через str()"],
    solution: `def generate_sk(b, s):\n    return f"{str(s).strip().lower()}_{str(b).strip().lower()}"`
  },

  // === MODULE 4: Linux & Git ===
  {
    id: "py_lin_001", module: 4, order: 1,
    title: "Права доступа Linux (chmod)",
    difficulty: "middle", language: "python",
    description: `Функция <code>get_chmod_numeric(permissions_string)</code> должна переводить текстовую строку прав Linux (например 'rwxr-xr--') в числовой формат chmod (например 754).`,
    starterCode: `def get_chmod_numeric(perms):\n    # perms - строка из 9 символов 'rwxrwxrwx'\n    pass`,
    testCases: [
      { input: `get_chmod_numeric("rwxr-xr--")`, expected: `754` },
      { input: `get_chmod_numeric("rw-r--r--")`, expected: `644` },
      { input: `get_chmod_numeric("rwx------")`, expected: `700` }
    ],
    hints: ["r=4, w=2, x=1", "Разбейте строку на чанки по 3 символа"],
    solution: `def get_chmod_numeric(p):\n    res = ''\n    for i in range(0, 9, 3):\n        chunk = p[i:i+3]\n        val = 0\n        if chunk[0] == 'r': val += 4\n        if chunk[1] == 'w': val += 2\n        if chunk[2] == 'x': val += 1\n        res += str(val)\n    return int(res)`
  },

  // === MODULE 5: Docker ===
  {
    id: "py_docker_001", module: 5, order: 1,
    title: "Оптимизация кэша в Dockerfile",
    difficulty: "junior", language: "python",
    description: `Какая практика работы с 'Dockerfile' оптимальнее для кэширования слоев?\nВерните букву правильного ответа:\n'A' = COPY . . -> RUN pip install -r requirements.txt\n'B' = COPY requirements.txt . -> RUN pip install -r requirements.txt -> COPY . .`,
    starterCode: `def best_dockerfile_practice():\n    # Верните 'A' или 'B'\n    return ''`,
    testCases: [
      { input: `best_dockerfile_practice()`, expected: `"B"` }
    ],
    hints: ["Кэш инвалидируется на слое COPY, если исходный код поменялся. Файл requirements меняется гораздо реже кода."],
    solution: `def best_dockerfile_practice(): return 'B'`
  },

  // === MODULE 6: Airflow ===
  {
    id: "py_air_001", module: 6, order: 1,
    title: "DAG Dependencies",
    difficulty: "junior", language: "python",
    description: `В Apache Airflow зависимости между тасками задаются с помощью оператора <code>>></code>. Напишите функцию, которая принимает список строк (имён тасок) и объединяет их в правильную цепочку Airflow.<br>Например: ['extract', 'transform', 'load'] -> "extract >> transform >> load"`,
    starterCode: `def build_dag_chain(tasks):\n    pass`,
    testCases: [
      { input: `build_dag_chain(['extract', 'transform', 'load'])`, expected: `"extract >> transform >> load"` },
      { input: `build_dag_chain(['start', 'end'])`, expected: `"start >> end"` }
    ],
    hints: ["Используйте метод 'разделитель'.join(список)"],
    solution: `def build_dag_chain(tasks): return " >> ".join(tasks)`
  },

  // === MODULE 7: PySpark ===
  {
    id: "py_spark_001", module: 7, order: 1,
    title: "Эмуляция MapReduce (WordCount)",
    difficulty: "middle", language: "python",
    description: `Классическая задача Big Data. Реализуйте <code>word_count(lines)</code> на базовом Python.\nФункция принимает список строк. Вам нужно разбить их на слова, привести к нижнему регистру и подсчитать вхождения каждого слова (аналог flatMap + reduceByKey). Верните словарь <code>{'слово': количество}</code>.`,
    starterCode: `def word_count(lines):\n    # Возвращаем словарь с подсчетом\n    pass`,
    testCases: [
      { input: `word_count(["Hello spark", "Hello world"])`, expected: `{"hello": 2, "spark": 1, "world": 1}` }
    ],
    hints: ["Разбейте строку через .split()", "Используйте словарь для подсчета вхождений"],
    solution: `def word_count(lines):\n    res = {}\n    for line in lines:\n        for w in line.lower().split():\n            res[w] = res.get(w, 0) + 1\n    return res`
  },

  // === MODULE 8: dbt ===
  {
    id: "sql_dbt_001", module: 8, order: 1,
    title: "dbt Surrogate Keys",
    difficulty: "junior", language: "sql",
    description: `В dbt часто генерируют MD5 хэш для создания суррогатных ключей. Так как хэш-функции ограничены в нашем браузере, напишите SQL-запрос, который создает "составной ключ" (суррогатный ключ) <code>order_item_id</code> путем конкатенации полей <code>order_id</code> и <code>item_id</code> через дефис <code>-</code>.`,
    setupSQL: `
      CREATE TABLE raw_items (order_id INT, item_id INT, amount INT);
      INSERT INTO raw_items VALUES (100, 1, 50), (100, 2, 75);
    `,
    starterCode: `SELECT \n  -- Ваш код генерации id\n  *, amount \nFROM raw_items;`,
    expectedResult: [
      ['100-1', 100, 1, 50],
      ['100-2', 100, 2, 75]
    ],
    expectedColumns: ['order_item_id', 'order_id', 'item_id', 'amount'],
    hints: ["В SQLite оператор конкатенации строк — это ||"],
    solution: `SELECT order_id || '-' || item_id AS order_item_id, order_id, item_id, amount FROM raw_items;`
  },

  // === MODULE 9: Kafka ===
  {
    id: "py_kafka_001", module: 9, order: 1,
    title: "Kafka Consumer Offset Track",
    difficulty: "middle", language: "python",
    description: `Kafka Consumer должен обрабатывать только свежие сообщения.\nПусть у нас есть очередь сообщений (список словарей): <code>queue = [{"offset": 1, "val": "A"}, {"offset": 2, "val": "B"}]</code>. \nНапишите функцию <code>consume_new</code>, которая принимает 'queue' и 'last_committed_offset'. Верните список 'val' только тех сообщений, чей offset БОЛЬШЕ 'last_committed_offset'.`,
    starterCode: `def consume_new(queue, last_commit):\n    pass`,
    testCases: [
      { input: `consume_new([{"offset":1,"val":"A"},{"offset":2,"val":"B"}], 1)`, expected: `["B"]` },
      { input: `consume_new([{"offset":5,"val":"X"},{"offset":6,"val":"Y"}], 0)`, expected: `["X", "Y"]` },
      { input: `consume_new([{"offset":1,"val":"Z"}], 1)`, expected: `[]` }
    ],
    hints: ["Подойдет списковое включение (List Comprehension): [x['val'] for x in queue if ...]"],
    solution: `def consume_new(q, lc): return [x['val'] for x in q if x['offset'] > lc]`
  },

  // === MODULE 10: Cloud ===
  {
    id: "py_cloud_001", module: 10, order: 1,
    title: "AWS S3 URI Parser",
    difficulty: "junior", language: "python",
    description: `Для работы с AWS Boto3 часто надо разбивать S3 URI на bucket и key.\nНапишите функцию <code>parse_s3(uri)</code>. Она принимает S3 путь (например 's3://my-bucket/data/file.csv') и возвращает кортеж из двух строк: '(bucket_name, object_key)'.`,
    starterCode: `def parse_s3(uri):\n    pass`,
    testCases: [
      { input: `parse_s3("s3://my-bucket/data/file.csv")`, expected: `("my-bucket", "data/file.csv")` },
      { input: `parse_s3("s3://logs/2023/10/a.log")`, expected: `("logs", "2023/10/a.log")` }
    ],
    hints: ["Удалите префикс 's3://', а затем используйте .split('/', 1)"],
    solution: `def parse_s3(uri):\n    p = uri[5:].split('/', 1)\n    return (p[0], p[1])`
  },

  // === MODULE 11: Data Quality ===
  {
    id: "py_dq_001", module: 11, order: 1,
    title: "Great Expectations Validator",
    difficulty: "junior", language: "python",
    description: `Один из базовых тестов данных — проверка на NULL (или None в Python).\nРеализуйте функцию 'expect_column_values_to_not_be_null(column_data)', которая принимает список значений столбца. Если в списке есть 'None', возвращается 'False', иначе 'True'.`,
    starterCode: `def expect_not_null(data):\n    pass`,
    testCases: [
      { input: `expect_not_null([1, 2, 3])`, expected: `True` },
      { input: `expect_not_null([1, None, 3])`, expected: `False` }
    ],
    hints: ["Простая проверка `if None in data:` (возвращает обратный результат)"],
    solution: `def expect_not_null(data): return None not in data`
  },

  // === MODULE 12: System Design ===
  {
    id: "py_design_001", module: 12, order: 1,
    title: "Архитектор: Выбор Базы Данных",
    difficulty: "junior", language: "python",
    description: `На интервью по System Design вам нужно подобрать инструмент под требования бизнеса.\nФункция 'choose_db(requirements)' принимает список тегов. \n- Если в списке есть 'OLAP' -> верните 'ClickHouse'\n- Если в списке есть 'OLTP' -> верните 'PostgreSQL'\n- Иначе верните 'S3'.`,
    starterCode: `def choose_db(reqs):\n    pass`,
    testCases: [
      { input: `choose_db(['OLAP', 'Fast'])`, expected: `"ClickHouse"` },
      { input: `choose_db(['OLTP', 'ACID'])`, expected: `"PostgreSQL"` },
      { input: `choose_db(['Files', 'Cheap'])`, expected: `"S3"` }
    ],
    hints: [],
    solution: `def choose_db(r):\n    if 'OLAP' in r: return 'ClickHouse'\n    if 'OLTP' in r: return 'PostgreSQL'\n    return 'S3'`
  }
];

// Make globally accessible
window.TASKS_DATA = TASKS_DATA;
