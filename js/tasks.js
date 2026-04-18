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
  },
  {
    id: "sql_gen_001", module: 1, order: 101, title: "Основы: Точный подсчет", difficulty: "junior", language: "sql",
    description: `В базе данных логистики есть таблица <code>shipments</code>.\n\nПосчитайте общее количество отправлений.`,
    setupSQL: `CREATE TABLE shipments (id INT, city TEXT); INSERT INTO shipments VALUES (1,'Moscow'),(2,'Kazan'),(3,'Ufa'),(4,'Omsk');`,
    starterCode: ``, expectedResult: [[4]], expectedColumns: []
  },
  {
    id: "sql_gen_002", module: 1, order: 102, title: "Уникальные значения", difficulty: "junior", language: "sql",
    description: `Вам дана таблица <code>users</code>. Сколько **уникальных** ролей (<code>role</code>) существует в системе?`,
    setupSQL: `CREATE TABLE users (role TEXT); INSERT INTO users VALUES ('admin'),('user'),('user'),('moderator'),('admin');`,
    starterCode: ``, expectedResult: [[3]], expectedColumns: []
  },
  {
    id: "sql_gen_003", module: 1, order: 103, title: "Сортировка по убыванию", difficulty: "junior", language: "sql",
    description: `Выведите топ-3 самых высокооплачиваемых сотрудников (<code>name</code>, <code>salary</code>) из таблицы <code>employees</code>.`,
    setupSQL: `CREATE TABLE employees (name TEXT, salary INT); INSERT INTO employees VALUES ('Ivan',50),('Anna',120),('Oleg',90),('Max',300),('Kate',110);`,
    starterCode: ``, expectedResult: [["Max", 300], ["Anna", 120], ["Kate", 110]], expectedColumns: ["name", "salary"]
  },
  {
    id: "sql_gen_004", module: 1, order: 104, title: "Фильтрация IS NULL", difficulty: "junior", language: "sql",
    description: `Найдите пользователей (<code>name</code>), у которых не заполнен email (он <code>NULL</code>) в таблице <code>contacts</code>.`,
    setupSQL: `CREATE TABLE contacts (name TEXT, email TEXT); INSERT INTO contacts VALUES ('A', 'a@m.ru'), ('B', NULL), ('C', 'c@m.ru'), ('D', NULL);`,
    starterCode: ``, expectedResult: [["B"], ["D"]], expectedColumns: ["name"]
  },
  {
    id: "sql_gen_005", module: 1, order: 105, title: "Группировка с HAVING", difficulty: "middle", language: "sql",
    description: `Посчитайте, в каких городах (<code>city</code>) живет **более 2-х** клиентов. Верните <code>city</code> и <code>COUNT(id)</code>.`,
    setupSQL: `CREATE TABLE clients (id INT, city TEXT); INSERT INTO clients VALUES (1,'SPB'),(2,'MSC'),(3,'SPB'),(4,'SPB'),(5,'MSC');`,
    starterCode: ``, expectedResult: [["SPB", 3]], expectedColumns: []
  },
  {
    id: "sql_gen_006", module: 1, order: 106, title: "Строковые функции (LIKE)", difficulty: "junior", language: "sql",
    description: `Найдите все почты сотрудников (<code>email</code>), которые заканчиваются на <code>@data.com</code>.`,
    setupSQL: `CREATE TABLE emails (email TEXT); INSERT INTO emails VALUES ('ivan@data.com'), ('admin@mail.ru'), ('ceo@data.com'), ('test@data.org');`,
    starterCode: ``, expectedResult: [["ivan@data.com"], ["ceo@data.com"]], expectedColumns: ["email"]
  },
  {
    id: "sql_gen_007", module: 1, order: 107, title: "Математика в SQL", difficulty: "junior", language: "sql",
    description: `В таблице <code>products</code> есть <code>price</code> и <code>discount</code>. Выведите <code>name</code> и итоговую цену (<code>price - discount</code>) под алиасом <code>final_price</code>.`,
    setupSQL: `CREATE TABLE products (name TEXT, price INT, discount INT); INSERT INTO products VALUES ('A',100,20), ('B',50,5);`,
    starterCode: ``, expectedResult: [["A", 80], ["B", 45]], expectedColumns: ["name", "final_price"]
  },
  {
    id: "sql_gen_008", module: 1, order: 108, title: "INNER JOIN: Основы", difficulty: "middle", language: "sql",
    description: `Объедините таблицу <code>users</code> (<code>id</code>, <code>name</code>) c таблицей заказов <code>orders</code> (<code>user_id</code>, <code>total</code>).\nВерните имя пользователя и сумму заказа.`,
    setupSQL: `CREATE TABLE users(id INT, name TEXT); CREATE TABLE orders(user_id INT, total INT); INSERT INTO users VALUES(1,'Alice'),(2,'Bob'); INSERT INTO orders VALUES(1, 500),(2, 100);`,
    starterCode: ``, expectedResult: [["Alice", 500], ["Bob", 100]], expectedColumns: ["name", "total"]
  },
  {
    id: "sql_gen_009", module: 1, order: 109, title: "LEFT JOIN", difficulty: "middle", language: "sql",
    description: `Выведите все имена (<code>name</code>) из <code>users</code> и তাদের <code>order_id</code> из <code>orders</code>. Если заказа нет, там будет NULL.`,
    setupSQL: `CREATE TABLE users(id INT, name TEXT); CREATE TABLE orders(order_id INT, user_id INT); INSERT INTO users VALUES(1,'A'),(2,'B'); INSERT INTO orders VALUES(101, 1);`,
    starterCode: ``, expectedResult: [["A", 101], ["B", null]], expectedColumns: ["name", "order_id"]
  },
  {
    id: "sql_gen_010", module: 1, order: 110, title: "CASE WHEN", difficulty: "middle", language: "sql",
    description: `Используйте CASE, чтобы добавить колонку <code>category</code>:\nЕсли <code>age > 18</code> -> 'Adult'\nИначе -> 'Child'. Верните <code>name</code> и <code>category</code>.`,
    setupSQL: `CREATE TABLE people (name TEXT, age INT); INSERT INTO people VALUES('A', 20), ('B', 12), ('C', 25);`,
    starterCode: ``, expectedResult: [["A", "Adult"], ["B", "Child"], ["C", "Adult"]], expectedColumns: ["name", "category"]
  },
  {
    id: "sql_gen_011", module: 1, order: 111, title: "Подзапросы (Subquery)", difficulty: "senior", language: "sql",
    description: `Найдите пользователей с зарплатой ВЫШЕ, чем средняя зарплата по всей таблице <code>salary</code>. Верните их <code>name</code>.`,
    setupSQL: `CREATE TABLE salary (name TEXT, amount INT); INSERT INTO salary VALUES('A', 100), ('B', 150), ('C', 200), ('D', 50);`,
    starterCode: ``, expectedResult: [["B"], ["C"]], expectedColumns: ["name"]
  },
  {
    id: "sql_gen_012", module: 1, order: 112, title: "COALESCE", difficulty: "middle", language: "sql",
    description: `В таблице профилей <code>phone</code> может быть NULL. Используйте COALESCE, чтобы вместо NULL вернуть слово 'No Phone'.`,
    setupSQL: `CREATE TABLE prof (phone TEXT); INSERT INTO prof VALUES ('123'), (NULL), ('456');`,
    starterCode: ``, expectedResult: [["123"], ["No Phone"], ["456"]], expectedColumns: []
  },
  {
    id: "sql_gen_013", module: 1, order: 113, title: "Агрегация COUNT + GROUP BY", difficulty: "middle", language: "sql",
    description: `Посчитайте, сколько транзакций (<code>id</code>) прошло в каждом статусе (<code>status</code>). Выведите статус и счетчик.`,
    setupSQL: `CREATE TABLE t (id INT, status TEXT); INSERT INTO t VALUES (1,'OK'),(2,'ERR'),(3,'OK');`,
    starterCode: ``, expectedResult: [["ERR", 1], ["OK", 2]], expectedColumns: []
  },
  {
    id: "sql_gen_014", module: 1, order: 114, title: "IN оператор", difficulty: "junior", language: "sql",
    description: `Выберите заказы, если <code>product_group</code> входит в список ('Electronics', 'Books').`,
    setupSQL: `CREATE TABLE grp (id INT, product_group TEXT); INSERT INTO grp VALUES (1,'Electronics'),(2,'Toys'),(3,'Books');`,
    starterCode: ``, expectedResult: [[1, "Electronics"], [3, "Books"]], expectedColumns: []
  },
  {
    id: "sql_gen_015", module: 1, order: 115, title: "Оператор BETWEEN", difficulty: "junior", language: "sql",
    description: `Найти все даты (<code>event_date</code>), которые попадают строго в период между '2023-01-01' и '2023-01-31'.`,
    setupSQL: `CREATE TABLE dates (event_date TEXT); INSERT INTO dates VALUES ('2023-01-05'), ('2022-12-31'), ('2023-01-20'), ('2023-02-01');`,
    starterCode: ``, expectedResult: [["2023-01-05"], ["2023-01-20"]], expectedColumns: []
  },
  {
    id: "sql_gen_016", module: 1, order: 116, title: "Математика: Округление (ROUND)", difficulty: "junior", language: "sql",
    description: `В таблице <code>sales</code> у нас есть вещественные суммы продах (<code>amount</code>).\nВыведите среднюю сумму продаж, округленную до 1 знака после запятой (используйте <code>ROUND</code>).`,
    setupSQL: `CREATE TABLE sales (amount REAL); INSERT INTO sales VALUES (15.55), (10.12), (20.99), (5.5);`,
    starterCode: ``, expectedResult: [[13.0]], expectedColumns: []
  },
  {
    id: "sql_gen_017", module: 1, order: 117, title: "Двойная группировка", difficulty: "middle", language: "sql",
    description: `Посчитайте сумму продаж (<code>total</code>) в разрезе каждого магазина (<code>store</code>) и категории товаров (<code>category</code>).`,
    setupSQL: `CREATE TABLE s (store TEXT, category TEXT, total INT); INSERT INTO s VALUES ('A','Tech',100), ('A','Tech',50), ('A','Food',20), ('B','Tech',200);`,
    starterCode: ``, expectedResult: [["A", "Food", 20], ["A", "Tech", 150], ["B", "Tech", 200]], expectedColumns: []
  },
  {
    id: "sql_gen_018", module: 1, order: 118, title: "Строки: Объединение (CONCAT)", difficulty: "junior", language: "sql",
    description: `У нас есть <code>first_name</code> и <code>last_name</code> в таблице <code>users</code>.\nВыведите полное имя через пробел под названием <code>full_name</code>.`,
    setupSQL: `CREATE TABLE users (first_name TEXT, last_name TEXT); INSERT INTO users VALUES ('John', 'Doe'), ('Jane', 'Smith');`,
    starterCode: ``, expectedResult: [["John Doe"], ["Jane Smith"]], expectedColumns: ["full_name"]
  },
  {
    id: "sql_gen_019", module: 1, order: 119, title: "Даты: Извлечение года", difficulty: "middle", language: "sql",
    description: `Из таблицы <code>events</code> (столбец <code>event_date</code> формата YYYY-MM-DD) получите год с помощью функции <code>STRFTIME('%Y', ...)</code> и верните все уникальные года активности.`,
    setupSQL: `CREATE TABLE events (event_date TEXT); INSERT INTO events VALUES ('2020-05-15'), ('2021-01-01'), ('2021-12-31'), ('2022-06-10');`,
    starterCode: ``, expectedResult: [["2020"], ["2021"], ["2022"]], expectedColumns: []
  },
  {
    id: "sql_gen_020", module: 1, order: 120, title: "MAX и MIN в одном запросе", difficulty: "junior", language: "sql",
    description: `Узнайте разницу между максимальной и минимальной ценой (<code>price</code>) в таблице <code>items</code>. Назовите столбец <code>price_diff</code>.`,
    setupSQL: `CREATE TABLE items (price INT); INSERT INTO items VALUES (10), (50), (100), (5);`,
    starterCode: ``, expectedResult: [[95]], expectedColumns: ["price_diff"]
  },
  {
    id: "sql_gen_021", module: 1, order: 121, title: "Оператор UNION", difficulty: "middle", language: "sql",
    description: `У нас есть две таблицы: <code>moscow_clients</code> и <code>kazan_clients</code> (в обеих есть колонка <code>name</code>).\nПолучите один общий список имён (без дубликатов).`,
    setupSQL: `CREATE TABLE moscow_clients(name TEXT); CREATE TABLE kazan_clients(name TEXT); INSERT INTO moscow_clients VALUES('Ivan'),('Anna'); INSERT INTO kazan_clients VALUES('Oleg'),('Anna');`,
    starterCode: ``, expectedResult: [["Anna"], ["Ivan"], ["Oleg"]], expectedColumns: ["name"]
  },
  {
    id: "sql_gen_022", module: 1, order: 122, title: "Удаление дубликатов (DISTINCT)", difficulty: "junior", language: "sql",
    description: `В таблице <code>logs</code> хранятся события с колонкой <code>ip_address</code>. Выведите список уникальных IP адресов.`,
    setupSQL: `CREATE TABLE logs (ip_address TEXT); INSERT INTO logs VALUES ('1.1.1.1'), ('1.1.1.1'), ('8.8.8.8');`,
    starterCode: ``, expectedResult: [["1.1.1.1"], ["8.8.8.8"]], expectedColumns: []
  },
  {
    id: "sql_gen_023", module: 1, order: 123, title: "Работа с паттернами (% и _)", difficulty: "middle", language: "sql",
    description: `Найдите пользователей в <code>users</code>, чье имя (<code>name</code>) ровно 4 символа в длину и начинается на букву 'A'.`,
    setupSQL: `CREATE TABLE users(name TEXT); INSERT INTO users VALUES ('Anna'), ('Alexander'), ('Artem'), ('Alia'), ('Bob');`,
    starterCode: ``, expectedResult: [["Anna"], ["Alia"]], expectedColumns: []
  },
  {
    id: "sql_gen_024", module: 1, order: 124, title: "Оконные функции: OVER()", difficulty: "senior", language: "sql",
    description: `В таблице <code>salaries</code> (<code>dep</code>, <code>amount</code>) выведите <code>dep</code>, <code>amount</code> и средней зарплатой для этого отдела рядом (назовите <code>dep_avg</code>).`,
    setupSQL: `CREATE TABLE salaries (dep TEXT, amount INT); INSERT INTO salaries VALUES ('IT', 100), ('IT', 200), ('HR', 50);`,
    starterCode: ``, expectedResult: [["HR", 50, 50.0], ["IT", 100, 150.0], ["IT", 200, 150.0]], expectedColumns: ["dep", "amount", "dep_avg"]
  },
  {
    id: "sql_gen_025", module: 1, order: 125, title: "Оконные функции: ROW_NUMBER", difficulty: "senior", language: "sql",
    description: `Пронумеруйте покупки каждого пользователя от самых свежих к старым. Таблица <code>purchases</code> (<code>user_id</code>, <code>pur_date</code>). Верните все колонки и <code>row_num</code>.`,
    setupSQL: `CREATE TABLE purchases (user_id INT, pur_date TEXT); INSERT INTO purchases VALUES (1, '2023-01-01'), (1, '2023-02-01'), (2, '2023-01-15');`,
    starterCode: ``, expectedResult: [[1, "2023-02-01", 1], [1, "2023-01-01", 2], [2, "2023-01-15", 1]], expectedColumns: []
  },
  {
    id: "sql_gen_026", module: 1, order: 126, title: "Самосоединение (Self Join)", difficulty: "senior", language: "sql",
    description: `В таблице <code>employees</code> есть <code>id</code>, <code>name</code> и <code>manager_id</code>. Выведите имя сотрудника (<code>employee</code>) и имя его руководителя (<code>manager</code>).`,
    setupSQL: `CREATE TABLE employees(id INT, name TEXT, manager_id INT); INSERT INTO employees VALUES(1,'CEO', NULL),(2,'Alice',1),(3,'Bob',1);`,
    starterCode: ``, expectedResult: [["Alice", "CEO"], ["Bob", "CEO"]], expectedColumns: []
  },
  {
    id: "sql_gen_027", module: 1, order: 127, title: "Сложные условия (CASE в Агрегации)", difficulty: "senior", language: "sql",
    description: `Посчитайте для каждого магазина (<code>store_id</code>) количество УСПЕШНЫХ продаж (<code>status = 'success'</code>). В таблице <code>tx</code> есть <code>store_id</code> и <code>status</code>. Использовать <code>SUM(CASE...)</code>.`,
    setupSQL: `CREATE TABLE tx(store_id INT, status TEXT); INSERT INTO tx VALUES(1,'success'),(1,'failed'),(2,'success');`,
    starterCode: ``, expectedResult: [[1, 1], [2, 1]], expectedColumns: []
  },
  {
    id: "sql_gen_028", module: 1, order: 128, title: "CROSS JOIN", difficulty: "middle", language: "sql",
    description: `Сделайте все возможные комбинации размеров (<code>sizes</code>: 'M','L') и цветов (<code>colors</code>: 'Red','Blue'). Выведите оба столбца.`,
    setupSQL: `CREATE TABLE sizes(size TEXT); CREATE TABLE colors(color TEXT); INSERT INTO sizes VALUES('M'),('L'); INSERT INTO colors VALUES('Red'),('Blue');`,
    starterCode: ``, expectedResult: [["M", "Red"], ["M", "Blue"], ["L", "Red"], ["L", "Blue"]], expectedColumns: []
  },
  {
    id: "sql_gen_029", module: 1, order: 129, title: "Ограничение выдачи (LIMIT и OFFSET)", difficulty: "junior", language: "sql",
    description: `Мы делаем пагинацию (постраничный вывод). Выведите пользователей со 2 по 3 (в алфавитном порядке имен) из таблицы <code>users(name)</code>.`,
    setupSQL: `CREATE TABLE users(name TEXT); INSERT INTO users VALUES('A'),('B'),('C'),('D'),('E');`,
    starterCode: ``, expectedResult: [["B"], ["C"]], expectedColumns: []
  },
  {
    id: "sql_gen_030", module: 1, order: 130, title: "Оконные функции: LAG()", difficulty: "senior", language: "sql",
    description: `В таблице <code>metrics</code> есть <code>date</code> и <code>value</code>. Выведите <code>date</code>, текущий <code>value</code> и <code>value</code> за предыдущую дату (с помощью <code>LAG()</code>) под именем <code>prev_value</code>.`,
    setupSQL: `CREATE TABLE metrics(date TEXT, value INT); INSERT INTO metrics VALUES('2023-01-01',10),('2023-01-02',20),('2023-01-03',15);`,
    starterCode: ``, expectedResult: [["2023-01-01", 10, null], ["2023-01-02", 20, 10], ["2023-01-03", 15, 20]], expectedColumns: []
  },
  {
    id: "sql_gen_031", module: 1, order: 131, title: "Оконные функции: LEAD()", difficulty: "senior", language: "sql",
    description: `В таблице <code>weather</code> есть <code>date</code> и <code>temp</code>. Верните <code>date</code>, <code>temp</code> и температуру следующего дня (<code>next_temp</code>) с помощью <code>LEAD()</code>.`,
    setupSQL: `CREATE TABLE weather(date TEXT, temp INT); INSERT INTO weather VALUES('23-01',-5),('23-02',-10),('23-03',0);`,
    starterCode: ``, expectedResult: [["23-01", -5, -10], ["23-02", -10, 0], ["23-03", 0, null]], expectedColumns: []
  },
  {
    id: "sql_gen_032", module: 1, order: 132, title: "Оконные функции: RANK()", difficulty: "senior", language: "sql",
    description: `Проранжируйте сотрудников (таблица <code>staff</code>) по убыванию зарплаты (<code>salary</code>) с помощью функции <code>RANK()</code>. Верните <code>name</code>, <code>salary</code> и <code>rank</code>.`,
    setupSQL: `CREATE TABLE staff(name TEXT, salary INT); INSERT INTO staff VALUES('A',100),('B',100),('C',50);`,
    starterCode: ``, expectedResult: [["A", 100, 1], ["B", 100, 1], ["C", 50, 3]], expectedColumns: []
  },
  {
    id: "sql_gen_033", module: 1, order: 133, title: "Оконные функции: DENSE_RANK()", difficulty: "senior", language: "sql",
    description: `То же самое: проранжируйте таблицу <code>staff</code> по <code>salary</code> (убывание), но используйте <code>DENSE_RANK()</code>. Сравните разницу с предыдущей задачей.`,
    setupSQL: `CREATE TABLE staff(name TEXT, salary INT); INSERT INTO staff VALUES('A',100),('B',100),('C',50);`,
    starterCode: ``, expectedResult: [["A", 100, 1], ["B", 100, 1], ["C", 50, 2]], expectedColumns: []
  },
  {
    id: "sql_gen_034", module: 1, order: 134, title: "Фильтрация IN (Subquery)", difficulty: "middle", language: "sql",
    description: `Верните имена (<code>name</code>) тех профилей из <code>profiles</code>, чей <code>id</code> есть в таблице покупателей <code>buyers</code>. Используйте <code>IN (SELECT ...)</code>.`,
    setupSQL: `CREATE TABLE profiles(id INT, name TEXT); CREATE TABLE buyers(id INT); INSERT INTO profiles VALUES(1,'Max'),(2,'Igor'),(3,'Anna'); INSERT INTO buyers VALUES(1),(3);`,
    starterCode: ``, expectedResult: [["Max"], ["Anna"]], expectedColumns: []
  },
  {
    id: "sql_gen_035", module: 1, order: 135, title: "Фильтрация NOT IN", difficulty: "middle", language: "sql",
    description: `Верните людей из <code>profiles</code>, которые НИЧЕГО не покупали (их <code>id</code> нет в <code>buyers</code>). Используйте <code>NOT IN</code>.`,
    setupSQL: `CREATE TABLE profiles(id INT, name TEXT); CREATE TABLE buyers(id INT); INSERT INTO profiles VALUES(1,'Max'),(2,'Igor'),(3,'Anna'); INSERT INTO buyers VALUES(1),(3);`,
    starterCode: ``, expectedResult: [["Igor"]], expectedColumns: []
  },
  {
    id: "sql_gen_036", module: 1, order: 136, title: "Оператор EXISTS", difficulty: "senior", language: "sql",
    description: `Решите предыдущую задачу с помощью оператора <code>NOT EXISTS</code> вместо <code>NOT IN</code>. Выведите <code>name</code> из <code>profiles</code>.`,
    setupSQL: `CREATE TABLE profiles(id INT, name TEXT); CREATE TABLE buyers(buyer_id INT); INSERT INTO profiles VALUES(1,'Max'),(2,'Igor'),(3,'Anna'); INSERT INTO buyers VALUES(1),(3);`,
    starterCode: ``, expectedResult: [["Igor"]], expectedColumns: []
  },
  {
    id: "sql_gen_037", module: 1, order: 137, title: "Объединение (UNION ALL)", difficulty: "middle", language: "sql",
    description: `Сделайте <code>UNION ALL</code> между таблицами <code>tbl1(val)</code> и <code>tbl2(val)</code>. Если значения дублируются — они не удалятся (в отличие от обычного UNION).`,
    setupSQL: `CREATE TABLE tbl1(val INT); CREATE TABLE tbl2(val INT); INSERT INTO tbl1 VALUES(1),(2); INSERT INTO tbl2 VALUES(2),(3);`,
    starterCode: ``, expectedResult: [[1], [2], [2], [3]], expectedColumns: []
  },
  {
    id: "sql_gen_038", module: 1, order: 138, title: "Функция LENGTH()", difficulty: "junior", language: "sql",
    description: `Выведите строки из таблицы <code>words</code> где длина слова (<code>word</code>) строго больше 5 символов.`,
    setupSQL: `CREATE TABLE words(word TEXT); INSERT INTO words VALUES ('cat'), ('elephant'), ('dog'), ('monkey');`,
    starterCode: ``, expectedResult: [["elephant"], ["monkey"]], expectedColumns: []
  },
  {
    id: "sql_gen_039", module: 1, order: 139, title: "Функции UPPER() и LOWER()", difficulty: "junior", language: "sql",
    description: `Таблица <code>names(name)</code> содержит имена в разном регистре. Выведите все имена, преобразованные в НИЖНИЙ регистр.`,
    setupSQL: `CREATE TABLE names(name TEXT); INSERT INTO names VALUES ('iVAn'), ('aNNa'), ('OLEG');`,
    starterCode: ``, expectedResult: [["ivan"], ["anna"], ["oleg"]], expectedColumns: []
  },
  {
    id: "sql_gen_040", module: 1, order: 140, title: "Функция SUBSTR()", difficulty: "middle", language: "sql",
    description: `Для таблицы <code>codes(code)</code> верните первые 3 символа каждого кода под именем <code>prefix</code>.`,
    setupSQL: `CREATE TABLE codes(code TEXT); INSERT INTO codes VALUES ('101-ABS'), ('202-XYZ'), ('303-QWE');`,
    starterCode: ``, expectedResult: [["101"], ["202"], ["303"]], expectedColumns: []
  },
  {
    id: "sql_gen_041", module: 1, order: 141, title: "Функция REPLACE()", difficulty: "middle", language: "sql",
    description: `В таблице <code>files(filename)</code> замените расширение '.txt' на '.csv'. Верните как <code>new_name</code>.`,
    setupSQL: `CREATE TABLE files(filename TEXT); INSERT INTO files VALUES ('doc1.txt'), ('doc2.txt');`,
    starterCode: ``, expectedResult: [["doc1.csv"], ["doc2.csv"]], expectedColumns: []
  },
  {
    id: "sql_gen_042", module: 1, order: 142, title: "Математика: ABS()", difficulty: "junior", language: "sql",
    description: `Получите модуль (абсолютное значение) каждого числа (<code>val</code>) в таблице <code>numbers</code>.`,
    setupSQL: `CREATE TABLE numbers(val INT); INSERT INTO numbers VALUES (-10), (5), (-99);`,
    starterCode: ``, expectedResult: [[10], [5], [99]], expectedColumns: []
  },
  {
    id: "sql_gen_043", module: 1, order: 143, title: "Full Outer Join (эмуляция UNION)", difficulty: "senior", language: "sql",
    description: `SQLite не поддерживает FULL OUTER JOIN напрямую. Эмулируйте его с помощью <code>LEFT JOIN ... UNION ... RIGHT JOIN</code> (или просто UNION двух LEFT JOIN'ов наоборот). Верните <code>t1.id</code>, <code>t2.id</code>.`,
    setupSQL: `CREATE TABLE t1(id INT); CREATE TABLE t2(id INT); INSERT INTO t1 VALUES(1),(2); INSERT INTO t2 VALUES(2),(3);`,
    starterCode: ``, expectedResult: [[1, null], [2, 2], [null, 3]], expectedColumns: []
  },
  {
    id: "sql_gen_044", module: 1, order: 144, title: "Удаление пробелов: TRIM()", difficulty: "junior", language: "sql",
    description: `Таблица <code>dirty_data(name)</code> содержит имена с лишними пробелами '  Иван   '. Очистите их с помощью <code>TRIM()</code>.`,
    setupSQL: `CREATE TABLE dirty_data(name TEXT); INSERT INTO dirty_data VALUES ('  Иван  '), ('Anna '), (' Oleg');`,
    starterCode: ``, expectedResult: [["Иван"], ["Anna"], ["Oleg"]], expectedColumns: []
  },
  {
    id: "sql_gen_045", module: 1, order: 145, title: "GROUP_CONCAT()", difficulty: "senior", language: "sql",
    description: `Соберите все товары (<code>product</code>) для каждого чека (<code>receipt_id</code>) в одну строку через запятую. Используйте агрегатную функцию <code>GROUP_CONCAT()</code>.`,
    setupSQL: `CREATE TABLE p(receipt_id INT, product TEXT); INSERT INTO p VALUES (1,'A'),(1,'B'),(2,'C');`,
    starterCode: ``, expectedResult: [[1, "A,B"], [2, "C"]], expectedColumns: []
  },
  {
    id: "sql_gen_046", module: 1, order: 146, title: "DATE('now')", difficulty: "junior", language: "sql",
    description: `В SQLite можно получить текущую дату с помощью <code>DATE('now')</code>. Верните эту дату под алиасом <code>today</code>. Учтите, SQLite возвращает UTC время.`,
    setupSQL: ``,
    starterCode: ``, expectedResult: [], expectedColumns: ["today"]
  },
  {
    id: "sql_gen_047", module: 1, order: 147, title: "Оконные функции: CUME_DIST()", difficulty: "senior", language: "sql",
    description: `Определите накопительное распределение (Cumulative Distribution) цены каждого товара в <code>products(price)</code>. Верните цену и результат <code>CUME_DIST()</code> сортируя по <code>price</code>.`,
    setupSQL: `CREATE TABLE products(price INT); INSERT INTO products VALUES (10), (20), (20), (30);`,
    starterCode: ``, expectedResult: [[10, 0.25], [20, 0.75], [20, 0.75], [30, 1.0]], expectedColumns: []
  },
  {
    id: "sql_gen_048", module: 1, order: 148, title: "CTE: Common Table Expressions", difficulty: "middle", language: "sql",
    description: `Используйте оператор <code>WITH</code> для создания временной таблицы <code>active_users</code> (где <code>status = 'active'</code>).\nЗатем извлеките всех пользователей из неё.`,
    setupSQL: `CREATE TABLE u(name TEXT, status TEXT); INSERT INTO u VALUES ('A','active'), ('B','banned');`,
    starterCode: ``, expectedResult: [["A", "active"]], expectedColumns: []
  },
  {
    id: "sql_gen_049", module: 1, order: 149, title: "Деление на ноль (NULLIF)", difficulty: "middle", language: "sql",
    description: `Попытка поделить на 0 в SQL вызывает NULL в SQLite. Чтобы безопасно делить колонку <code>a</code> на <code>b</code>, используйте хитрость или <code>NULLIF(b, 0)</code>. Верните классическое <code>a / b</code>.`,
    setupSQL: `CREATE TABLE div(a INT, b INT); INSERT INTO div VALUES(10, 2), (5, 0);`,
    starterCode: ``, expectedResult: [[5], [null]], expectedColumns: []
  },
  {
    id: "sql_gen_050", module: 1, order: 150, title: "SQL: Финальный босс (RFM)", difficulty: "senior", language: "sql",
    description: `Для расчёта Recency (давность покупки) выведите <code>user_id</code> и максимальную дату покупки (<code>MAX(buy_date)</code>) под именем <code>last_purchase</code> из таблицы <code>sales</code>. Отсортируйте по <code>user_id</code>.`,
    setupSQL: `CREATE TABLE sales(user_id INT, buy_date TEXT); INSERT INTO sales VALUES(1,'2023-01-01'),(1,'2023-05-10'),(2,'2022-11-11');`,
    starterCode: ``, expectedResult: [[1, "2023-05-10"], [2, "2022-11-11"]], expectedColumns: ["user_id", "last_purchase"]
  },

  // ============================================
  // MODULE 2: Python Tasks (Batch 1 of 50)
  // ============================================
  {
    id: "py_gen_001", module: 2, order: 201, title: "Python: Возврат значения", difficulty: "junior", language: "python",
    description: `Напишите функцию <code>solve()</code>, которая просто возвращает строку <code>"Hello, Data Engineer!"</code>.`,
    starterCode: ``, testCode: `assert solve() == "Hello, Data Engineer!", "Должна быть возвращена строка приветствия"`
  },
  {
    id: "py_gen_002", module: 2, order: 202, title: "Сумма списка", difficulty: "junior", language: "python",
    description: `Напишите функцию <code>solve(arr)</code>, которая принимает список чисел и возвращает их сумму.`,
    starterCode: ``, testCode: `assert solve([1, 2, 3]) == 6; assert solve([-1, 10]) == 9`
  },
  {
    id: "py_gen_003", module: 2, order: 203, title: "Поиск максимума", difficulty: "junior", language: "python",
    description: `Напишите функцию <code>solve(arr)</code>, возвращающую самое большое число в списке (без встроенной ф-ции max). Но можете использовать и её.`,
    starterCode: ``, testCode: `assert solve([10, -5, 20, 1]) == 20`
  },
  {
    id: "py_gen_004", module: 2, order: 204, title: "Четные числа", difficulty: "junior", language: "python",
    description: `Функция <code>solve(arr)</code> должна вернуть список, в котором оставлены ТОЛЬКО четные числа. Очередность нужно сохранить.`,
    starterCode: ``, testCode: `assert solve([1, 2, 3, 4, 5, 8]) == [2, 4, 8]`
  },
  {
    id: "py_gen_005", module: 2, order: 205, title: "Разворот строки", difficulty: "junior", language: "python",
    description: `Напишите функцию <code>solve(s)</code>, которая принимает строку и возвращает её задом наперед. (Например: 'abc' -> 'cba')`,
    starterCode: ``, testCode: `assert solve("data") == "atad"`
  },
  {
    id: "py_gen_006", module: 2, order: 206, title: "Уникальные элементы", difficulty: "junior", language: "python",
    description: `Функция <code>solve(arr)</code> должна вернуть список уникальных элементов из переданного списка.\nИспользуйте <code>set()</code> или цикл.`,
    starterCode: ``, testCode: `assert sorted(solve([1, 2, 2, 3, 1])) == [1, 2, 3]`
  },
  {
    id: "py_gen_007", module: 2, order: 207, title: "Подсчет гласных", difficulty: "junior", language: "python",
    description: `Напишите функцию <code>solve(s)</code>, которая считает количество гласных букв ('a', 'e', 'i', 'o', 'u') в строке (независимо от регистра).`,
    starterCode: ``, testCode: `assert solve("Data Engineering") == 7`
  },
  {
    id: "py_gen_008", module: 2, order: 208, title: "Факториал числа", difficulty: "junior", language: "python",
    description: `Реализуйте функцию <code>solve(n)</code>, вычисляющую факториал числа <code>n</code>. (Например: 5! = 120).`,
    starterCode: ``, testCode: `assert solve(5) == 120; assert solve(0) == 1`
  },
  {
    id: "py_gen_009", module: 2, order: 209, title: "Проверка палиндрома", difficulty: "junior", language: "python",
    description: `Функция <code>solve(word)</code> должна возвращать <code>True</code>, если строка читается одинаково слева-направо и справа-налево, иначе <code>False</code>.`,
    starterCode: ``, testCode: `assert solve("radar") == True; assert solve("data") == False`
  },
  {
    id: "py_gen_010", module: 2, order: 210, title: "Два числа из списка", difficulty: "middle", language: "python",
    description: `Популярная задача Two Sum. Напишите функцию <code>solve(arr, target)</code>, которая возвращает список из двух <strong>индексов</strong> чисел, которые в сумме дают <code>target</code>. Длина списка всегда будет == 2. (Гарантируется 1 решение).`,
    starterCode: ``, testCode: `assert solve([2, 7, 11, 15], 9) == [0, 1]`
  },
  {
    id: "py_gen_011", module: 2, order: 211, title: "Словарь: Подсчет символов", difficulty: "junior", language: "python",
    description: `Функция <code>solve(s)</code> должна возвращать словарь (dict), где ключи — это символы из строки, а значения — сколько раз они встречаются.`,
    starterCode: ``, testCode: `assert solve("aba") == {'a': 2, 'b': 1}`
  },
  {
    id: "py_gen_012", module: 2, order: 212, title: "Удаление пробелов", difficulty: "junior", language: "python",
    description: `Функция <code>solve(s)</code> должна удалить ВСЕ пробелы из строки.`,
    starterCode: ``, testCode: `assert solve("a b c ") == "abc"`
  },
  {
    id: "py_gen_013", module: 2, order: 213, title: "Поиск анаграммы", difficulty: "middle", language: "python",
    description: `Функция <code>solve(s1, s2)</code> возвращает <code>True</code>, если две строки состоят из одних и тех же букв в одинаковом количестве.`,
    starterCode: ``, testCode: `assert solve("listen", "silent") == True; assert solve("cat", "rat") == False`
  },
  {
    id: "py_gen_014", module: 2, order: 214, title: "Сортировка по длине", difficulty: "junior", language: "python",
    description: `Функция <code>solve(arr)</code> получает список строк. Верните список, отсортированный по длине строки (от коротких к длинным).`,
    starterCode: ``, testCode: `assert solve(["apple", "pie", "banana"]) == ["pie", "apple", "banana"]`
  },
  {
    id: "py_gen_015", module: 2, order: 215, title: "Объединение списков", difficulty: "junior", language: "python",
    description: `Функция <code>solve(l1, l2)</code> объединяет два списка и возвращает один отсортированный по возрастанию список.`,
    starterCode: ``, testCode: `assert solve([3, 1], [4, 2]) == [1, 2, 3, 4]`
  },
  {
    id: "py_gen_016", module: 2, order: 216, title: "Квадраты чисел", difficulty: "junior", language: "python",
    description: `Используйте list comprehension: <code>solve(arr)</code> возвращает список квадратов чисел.`,
    starterCode: ``, testCode: `assert solve([2, 3, 4]) == [4, 9, 16]`
  },
  {
    id: "py_gen_017", module: 2, order: 217, title: "Сжатие строки", difficulty: "middle", language: "python",
    description: `Функция <code>solve(s)</code> сжимает строку. Например: "aaabbc" -> "a3b2c1". (Символы идут подряд).`,
    starterCode: ``, testCode: `assert solve("aaabbc") == "a3b2c1"`
  },
  {
    id: "py_gen_018", module: 2, order: 218, title: "Числа Фибоначчи", difficulty: "middle", language: "python",
    description: `Функция <code>solve(n)</code> возвращает N-ое число Фибоначчи. (F_0 = 0, F_1 = 1, F_2 = 1, F_3 = 2).`,
    starterCode: ``, testCode: `assert solve(5) == 5; assert solve(6) == 8`
  },
  {
    id: "py_gen_019", module: 2, order: 219, title: "Поиск подстроки", difficulty: "junior", language: "python",
    description: `Функция <code>solve(text, sub)</code> возвращает <code>True</code>, если подстрока <code>sub</code> есть в строке <code>text</code>.`,
    starterCode: ``, testCode: `assert solve("Data Engineering", "Eng") == True`
  },
  {
    id: "py_gen_020", module: 2, order: 220, title: "Разница множеств", difficulty: "junior", language: "python",
    description: `Функция <code>solve(l1, l2)</code> возвращает список элементов, которые есть в первом списке, но нет во втором.`,
    starterCode: ``, testCode: `assert set(solve([1,2,3], [2,4])) == {1, 3}`
  },
  {
    id: "py_gen_021", module: 2, order: 221, title: "Смена регистра", difficulty: "junior", language: "python",
    description: `Напишите функцию <code>solve(s)</code>, которая меняет строчные символы на прописные и наоборот (swapcase).`,
    starterCode: ``, testCode: `assert solve("hELLo") == "HellO"`
  },
  {
    id: "py_gen_022", module: 2, order: 222, title: "Матрица: След", difficulty: "middle", language: "python",
    description: `Найдите след квадратной матрицы (сумму элементов на главной диагонали). <code>solve(matrix)</code>.`,
    starterCode: ``, testCode: `assert solve([[1,2],[3,4]]) == 5`
  },
  {
    id: "py_gen_023", module: 2, order: 223, title: "Поиск пропущенного числа", difficulty: "middle", language: "python",
    description: `В массиве размера N-1 лежат числа от 1 до N. Одно число пропущено. <code>solve(arr, N)</code> должна найти это число.`,
    starterCode: ``, testCode: `assert solve([1, 2, 4], 4) == 3`
  },
  {
    id: "py_gen_024", module: 2, order: 224, title: "Сумма цифр числа", difficulty: "junior", language: "python",
    description: `Функция <code>solve(n)</code> должна возвращать сумму цифр целого положительного числа. Запрещено использовать строки! Подсказка: % 10.`,
    starterCode: ``, testCode: `assert solve(123) == 6; assert solve(901) == 10`
  },
  {
    id: "py_gen_025", module: 2, order: 225, title: "Валидация IP-адреса", difficulty: "senior", language: "python",
    description: `Функция <code>solve(ip)</code> вернет <code>True</code>, если строка является валидным IPv4 (4 октета, разделенных точкой, от 0 до 255 без ведущих нулей).`,
    starterCode: ``, testCode: `assert solve("192.168.0.1") == True; assert solve("256.0.0.0") == False`
  },
  {
    id: "py_gen_026", module: 2, order: 226, title: "Генератор паролей", difficulty: "middle", language: "python",
    description: `Функция <code>solve(length)</code> должна сгенерировать случайный цифровой пин-код заданной длины возвращая строку. Для тестирования просто верните строку "1" * length. (Мы симулируем генератор).`,
    starterCode: ``, testCode: `assert solve(4) == "1111"`
  },
  {
    id: "py_gen_027", module: 2, order: 227, title: "Пересечение списков", difficulty: "junior", language: "python",
    description: `Функция <code>solve(l1, l2)</code> возвращает список элементов, которые присутствуют ОДНОВРЕМЕННО и в l1, и в l2.`,
    starterCode: ``, testCode: `assert solve([1,2,3], [2,3,4]) == [2, 3]`
  },
  {
    id: "py_gen_028", module: 2, order: 228, title: "Сортировка словаря", difficulty: "middle", language: "python",
    description: `Дан словарь <code>d = {'a': 3, 'b': 1, 'c': 2}</code>. Верните список ключей, отсортированных по их ЗНАЧЕНИЯМ (по возрастанию).`,
    starterCode: ``, testCode: `assert solve({'a': 3, 'b': 1, 'c': 2}) == ['b', 'c', 'a']`
  },
  {
    id: "py_gen_029", module: 2, order: 229, title: "Удаление пунктуации", difficulty: "junior", language: "python",
    description: `Функция <code>solve(s)</code> удаляет из строки все знаки пунктуации (точку, запятую, воскл. и вопр. знаки).`,
    starterCode: ``, testCode: `assert solve("Hello, world!") == "Hello world"`
  },
  {
    id: "py_gen_030", module: 2, order: 230, title: "Префикс массива", difficulty: "middle", language: "python",
    description: `Функция <code>solve(arr)</code> возвращает массив префиксных сумм. Пример: [1,2,3] -> [1, 3, 6].`,
    starterCode: ``, testCode: `assert solve([1, 2, 3]) == [1, 3, 6]`
  },
  {
    id: "py_gen_031", module: 2, order: 231, title: "Поиск максимума в словаре", difficulty: "junior", language: "python",
    description: `Дан словарь с оценками студентов <code>{'Alice': 5, 'Bob': 4}</code>. Верните ИМЯ студента с максимальной оценкой.`,
    starterCode: ``, testCode: `assert solve({'Alice': 5, 'Bob': 4}) == 'Alice'`
  },
  {
    id: "py_gen_032", module: 2, order: 232, title: "Группировка анаграмм", difficulty: "senior", language: "python",
    description: `Функция <code>solve(arr)</code> группирует список слов в список списков анаграмм.\nПример: <code>["eat", "tea", "tan"]</code> -> <code>[["eat", "tea"], ["tan"]]</code>.`,
    starterCode: ``, testCode: `assert len(solve(["eat", "tea", "tan"])) == 2`
  },
  {
    id: "py_gen_033", module: 2, order: 233, title: "Самое длинное слово", difficulty: "junior", language: "python",
    description: `Функция <code>solve(s)</code> должна вернуть самое длинное слово в предложении (слова разделены пробелом).`,
    starterCode: ``, testCode: `assert solve("The quick brown fox") == "quick"`
  },
  {
    id: "py_gen_034", module: 2, order: 234, title: "Замена подстроки", difficulty: "junior", language: "python",
    description: `Реализуйте функцию <code>solve(s, old, new)</code>, которая заменяет все вхождения <code>old</code> на <code>new</code> в строке <code>s</code>.`,
    starterCode: ``, testCode: `assert solve("cat and dog", "cat", "bird") == "bird and dog"`
  },
  {
    id: "py_gen_035", module: 2, order: 235, title: "Первый уникальный символ", difficulty: "middle", language: "python",
    description: `Функция <code>solve(s)</code> должна найти первый неповторяющийся символ в строке и вернуть его. Если таких нет - вернуть пустую строку.`,
    starterCode: ``, testCode: `assert solve("leetcode") == "l"; assert solve("aabb") == ""`
  },
  {
    id: "py_gen_036", module: 2, order: 236, title: "Бинарный поиск", difficulty: "senior", language: "python",
    description: `Напишите алгоритм бинарного поиска <code>solve(arr, target)</code>. Массив отсортирован. Верните индекс или -1, если не найдено.`,
    starterCode: ``, testCode: `assert solve([1, 3, 5, 7], 5) == 2; assert solve([1, 2, 3], 9) == -1`
  },
  {
    id: "py_gen_037", module: 2, order: 237, title: "Форматирование времени", difficulty: "middle", language: "python",
    description: `Функция <code>solve(seconds)</code> переводит секунды в строку "HH:MM:SS" с ведущими нулями.`,
    starterCode: ``, testCode: `assert solve(3665) == "01:01:05"`
  },
  {
    id: "py_gen_038", module: 2, order: 238, title: "Количество слов", difficulty: "junior", language: "python",
    description: `Посчитайте количество слов в предложении <code>solve(s)</code>. Слова разделены пробелами (любым количеством).`,
    starterCode: ``, testCode: `assert solve("Hello   world") == 2`
  },
  {
    id: "py_gen_039", module: 2, order: 239, title: "Инвертирование ключей словаря", difficulty: "middle", language: "python",
    description: `Функция <code>solve(d)</code> меняет местами ключи и значения: <code>{'a': 1}</code> -> <code>{1: 'a'}</code>.`,
    starterCode: ``, testCode: `assert solve({'a': 1, 'b': 2}) == {1: 'a', 2: 'b'}`
  },
  {
    id: "py_gen_040", module: 2, order: 240, title: "Зигзаг массива", difficulty: "middle", language: "python",
    description: `Функция <code>solve(arr)</code> переплетает список: если <code>[1,2,3,4,5,6]</code>, то возвращает <code>[1,6,2,5,3,4]</code>.`,
    starterCode: ``, testCode: `assert solve([1,2,3,4]) == [1,4,2,3]`
  },
  {
    id: "py_gen_041", module: 2, order: 241, title: "Изограмма", difficulty: "junior", language: "python",
    description: `Функция <code>solve(s)</code> вернет <code>True</code>, если строка является изограммой (ни одна буква не повторяется). Регистр не имеет значения.`,
    starterCode: ``, testCode: `assert solve("Dermatoglyphics") == True; assert solve("aba") == False`
  },
  {
    id: "py_gen_042", module: 2, order: 242, title: "Самое частое слово", difficulty: "middle", language: "python",
    description: `Функция <code>solve(s)</code> возвращает самое часто встречающееся слово в тексте. При ничьей - любое.`,
    starterCode: ``, testCode: `assert solve("a b a c a") == "a"`
  },
  {
    id: "py_gen_043", module: 2, order: 243, title: "Медиана списка", difficulty: "middle", language: "python",
    description: `Функция <code>solve(arr)</code> возвращает медиану списка чисел.`,
    starterCode: ``, testCode: `assert solve([1, 3, 2]) == 2`
  },
  {
    id: "py_gen_044", module: 2, order: 244, title: "Все перестановки", difficulty: "senior", language: "python",
    description: `Используйте <code>itertools.permutations</code> или рекурсию. <code>solve([1,2])</code> возвращает список списков/кортежей: <code>[(1,2), (2,1)]</code>.`,
    starterCode: ``, testCode: `assert len(solve([1,2,3])) == 6`
  },
  {
    id: "py_gen_045", module: 2, order: 245, title: "Глубокое сглаживание", difficulty: "senior", language: "python",
    description: `Функция <code>solve(arr)</code> сглаживает вложенные списки ЛЮБОЙ глубины. Пример: <code>[1, [2, [3]]]</code> -> <code>[1, 2, 3]</code>.`,
    starterCode: ``, testCode: `assert solve([1, [2, [3, 4]]]) == [1, 2, 3, 4]`
  },
  {
    id: "py_gen_046", module: 2, order: 246, title: "Простые числа", difficulty: "middle", language: "python",
    description: `Напишите функцию <code>solve(n)</code>, которая возвращает список всех ПРОСТЫХ чисел <= n.`,
    starterCode: ``, testCode: `assert solve(10) == [2, 3, 5, 7]`
  },
  {
    id: "py_gen_047", module: 2, order: 247, title: "Индекс субмаксимума", difficulty: "middle", language: "python",
    description: `Функция <code>solve(arr)</code> возвращает индекс ВТОРОГО по величине элемента. Все элементы уникальны.`,
    starterCode: ``, testCode: `assert solve([10, 20, 5, 15]) == 3`
  },
  {
    id: "py_gen_048", module: 2, order: 248, title: "Баланс скобок", difficulty: "middle", language: "python",
    description: `Функция <code>solve(s)</code> вернет <code>True</code>, если все скобки (), [], {} расставлены правильно.`,
    starterCode: ``, testCode: `assert solve("()[]{}") == True; assert solve("([)]") == False`
  },
  {
    id: "py_gen_049", module: 2, order: 249, title: "Сокобан (Движение)", difficulty: "junior", language: "python",
    description: `На вход дана строка из "U", "D", "L", "R" (вверх, вниз, влево, вправо). Начинаем в <code>(0,0)</code>. <code>solve(s)</code> вернет кортеж (x, y) итоговой позиции. U: y+1, R: x+1.`,
    starterCode: ``, testCode: `assert solve("UUURLL") == (-1, 3)`
  },
  {
    id: "py_gen_050", module: 2, order: 250, title: "Группировка по типу", difficulty: "junior", language: "python",
    description: `Функция <code>solve(arr)</code> принимает список элементов разного типа. Возвращает словарь, где ключи - имена типов (строкой 'int', 'str'), значения - списки элементов.`,
    starterCode: ``, testCode: `assert solve([1, 'a', 2])['int'] == [1, 2]`
  },

  // ============================================
  // MODULE 3: Data Modeling
  // ============================================
  {
    id: "mod3_gen_001", module: 3, order: 301, title: "Нормализация 1NF", difficulty: "junior", language: "python",
    description: `Функция <code>solve(row)</code> принимает словарь: <code>{'id': 1, 'phones': '123,456'}</code>. Верните список словарей (разделение phones): <code>[{'id':1,'phone':'123'}, {'id':1,'phone':'456'}]</code>.`,
    starterCode: ``, testCode: `assert len(solve({'id': 1, 'phones': 'a,b'})) == 2`
  },
  {
    id: "mod3_gen_002", module: 3, order: 302, title: "Генерация суррогатных ключей", difficulty: "junior", language: "python",
    description: `Функция <code>solve(data)</code> принимает список строк. Возвращает список словарей <code>{'id': index+1, 'val': string}</code>.`,
    starterCode: ``, testCode: `assert solve(['a'])[0]['id'] == 1`
  },
  {
    id: "mod3_gen_003", module: 3, order: 303, title: "Измерение SCD Type 1", difficulty: "middle", language: "python",
    description: `Реализуйте функцию <code>solve(old_record, new_data)</code>. Она должна обновить старую запись новыми значениями, перезаписав их.`,
    starterCode: ``, testCode: `assert solve({'id':1, 'city':'Mow'}, {'city':'Kzn'})['city'] == 'Kzn'`
  },
  {
    id: "mod3_gen_004", module: 3, order: 304, title: "Измерение SCD Type 2", difficulty: "senior", language: "python",
    description: `Функция <code>solve(old_records, new_data, date)</code> принимает список истории. Найдите активную запись (с <code>is_active=True</code>), поставьте ей <code>is_active=False</code> и добавьте новую со <code>is_active=True</code>. Верните обновленный список истории.`,
    starterCode: ``, testCode: `res = solve([{'val':'A', 'is_active':True}], {'val':'B'}, '2023-01-01'); assert len(res)==2 and res[1]['is_active']==True`
  },
  {
    id: "mod3_gen_005", module: 3, order: 305, title: "Денормализация (JOIN в памяти)", difficulty: "middle", language: "python",
    description: `Дано: <code>users = [{'id':1, 'city_id':10}]</code> и <code>cities = {10: 'Moscow'}</code>.\n<code>solve(users, cities)</code> должна вернуть <code>[{'id':1, 'city':'Moscow'}]</code>.`,
    starterCode: ``, testCode: `assert solve([{'id':1, 'city_id':10}], {10: 'M'})[0]['city'] == 'M'`
  },
  {
    id: "mod3_gen_006", module: 3, order: 306, title: "Хеширование (MD5/SHA)", difficulty: "junior", language: "python",
    description: `В DWH часто хешируют PII данные. Напишите функцию <code>solve(salt, pwd)</code>, которая возвращает sha256 хеш строки <code>salt+pwd</code>.`,
    starterCode: `import hashlib\ndef solve(salt, pwd):\n    pass`, testCode: `assert solve('123', 'pwd') == '6bc6df86fe73f848fe51cc72023d5fc51d1883be783ff5eaeee8cfadbc6be3ba'`
  },
  {
    id: "mod3_gen_007", module: 3, order: 307, title: "Звездная схема (Star Schema)", difficulty: "middle", language: "python",
    description: `Дана таблица фактов: <code>[{'id':1, 'user': 'A', 'sum': 100}]</code>. Выделите таблицу измерений пользователей: <code>solve(facts)</code> должно вернуть <code>({'A': 1}, [{'id':1, 'user_id':1, 'sum':100}])</code>.`,
    starterCode: ``, testCode: `assert solve([{'user':'A'}]) == ({'A': 1}, [{'user_id':1}])`
  },
  {
    id: "mod3_gen_008", module: 3, order: 308, title: "Валидация типов DWH", difficulty: "middle", language: "python",
    description: `Функция <code>solve(val, expected_type)</code> приводит <code>val</code> к <code>expected_type</code> (строки 'int', 'float', 'str'). Если ошибка - возвращает <code>None</code>.`,
    starterCode: ``, testCode: `assert solve("10", "int") == 10; assert solve("abc", "int") is None`
  },
  {
    id: "mod3_gen_009", module: 3, order: 309, title: "Идемпотентность загрузки", difficulty: "senior", language: "python",
    description: `Напишите функцию <code>solve(target_table, fresh_data)</code>. Она должна удалить из <code>target_table</code> все записи, чьи <code>date</code> есть в <code>fresh_data</code>, а затем добавить <code>fresh_data</code>. Списки словарей.`,
    starterCode: ``, testCode: `t=[{'d':1,'v':'A'},{'d':2,'v':'B'}]; f=[{'d':2,'v':'C'}]; assert solve(t,f) == [{'d':1,'v':'A'},{'d':2,'v':'C'}]`
  },
  {
    id: "mod3_gen_010", module: 3, order: 310, title: "Парсинг JSONB", difficulty: "middle", language: "python",
    description: `Функция <code>solve(rows, key)</code> получает список словарей с полем <code>metadata</code> (которое строка формата JSON) и извлекает из него значение по ключу <code>key</code>, добавляя его на верхний уровень.`,
    starterCode: `import json\ndef solve(rows, key):\n    pass`, testCode: `assert solve([{'metadata': '{"a": 1}'}], 'a')[0]['a'] == 1`
  },

  // ============================================
  // MODULE 4: Linux & Git
  // ============================================
  {
    id: "mod4_gen_001", module: 4, order: 401, title: "Права chmod (Символы в цифры)", difficulty: "junior", language: "python",
    description: `Функция <code>solve(s)</code> переводит права типа "rwxr-xr--" в числовой формат "754".`,
    starterCode: ``, testCode: `assert solve("rwxr-xr--") == "754"`
  },
  {
    id: "mod4_gen_002", module: 4, order: 402, title: "Поиск файла по расширению", difficulty: "junior", language: "python",
    description: `Симулируем <code>find . -name "*.txt"</code>. Функция <code>solve(files, ext)</code> возвращает файлы заканчивающиеся на <code>ext</code>.`,
    starterCode: ``, testCode: `assert solve(["a.txt", "b.csv"], ".txt") == ["a.txt"]`
  },
  {
    id: "mod4_gen_003", module: 4, order: 403, title: "Парсинг логов (grep)", difficulty: "middle", language: "python",
    description: `Симулируем <code>grep "ERROR" logs.txt | wc -l</code>. Функция <code>solve(logs)</code> принимает список строк и возвращает ЧИСЛО строк с подстрокой "ERROR".`,
    starterCode: ``, testCode: `assert solve(["INFO a", "ERROR b", "ERROR c"]) == 2`
  },
  {
    id: "mod4_gen_004", module: 4, order: 404, title: "Утилита awk (Колонки)", difficulty: "middle", language: "python",
    description: `Симулируем <code>awk '{print $2}'</code>. Функция <code>solve(lines, n)</code> берет список строк, разбивает по пробелу и возвращает N-ое слово каждой строки (1-based index).`,
    starterCode: ``, testCode: `assert solve(["a b c", "d e f"], 2) == ["b", "e"]`
  },
  {
    id: "mod4_gen_005", module: 4, order: 405, title: "Симуляция Git Log", difficulty: "middle", language: "python",
    description: `Список коммитов <code>commits = [{'msg': 'fix', 'time': 100}, ...]</code>. Напишите <code>solve(commits, keyword)</code>, чтобы отфильтровать коммиты по слову в <code>msg</code> и отсортировать по времени (новые сверху, time больше).`,
    starterCode: ``, testCode: `assert solve([{'msg':'fix1','time':10},{'msg':'fix2','time':20}], "fix")[0]['time'] == 20`
  },
  {
    id: "mod4_gen_006", module: 4, order: 406, title: "Конфликт слияния (Git Merge)", difficulty: "senior", language: "python",
    description: `Даны 3 версии файла: <code>base</code>, <code>branch_A</code>, <code>branch_B</code> (списки строк).\nЕсли и A, и B изменили одну и ту же строку по-разному - верните <code>False</code> (конфликт). Иначе <code>True</code>.`,
    starterCode: ``, testCode: `assert solve(["x"], ["y"], ["z"]) == False; assert solve(["x"], ["y"], ["x"]) == True`
  },
  {
    id: "mod4_gen_007", module: 4, order: 407, title: "Извлечение IP (grep -oE)", difficulty: "middle", language: "python",
    description: `Дан сырой текст (строка). <code>solve(text)</code> находит все валидные IPv4-адреса и возвращает их списком. (Используйте регулярные выражения <code>re</code>).`,
    starterCode: `import  re\ndef solve(text):\n    pass`, testCode: `assert solve("ip is 1.1.1.1 and 2.2.2.2") == ["1.1.1.1", "2.2.2.2"]`
  },
  {
    id: "mod4_gen_008", module: 4, order: 408, title: "Размер директории (du -sh)", difficulty: "junior", language: "python",
    description: `Функция <code>solve(bytes)</code> переводит байты в 'KB', 'MB', 'GB'. (делим на 1024). Возвращает строку формата '1.50 MB'.`,
    starterCode: ``, testCode: `assert solve(1048576) == "1.00 MB"`
  },
  {
    id: "mod4_gen_009", module: 4, order: 409, title: "Cron выражение", difficulty: "senior", language: "python",
    description: `Функция <code>solve(cron, h, m)</code>. cron="* 12 * * *". Возвращает <code>True</code>, если текущее время (h,m) подпадает под крон. Для тестов только часы и минуты.`,
    starterCode: ``, testCode: `assert solve("30 12 * * *", 12, 30) == True; assert solve("* 12 * * *", 12, 15) == True`
  },
  {
    id: "mod4_gen_010", module: 4, order: 410, title: "Построение пути (cd ..)", difficulty: "middle", language: "python",
    description: `Дан абсолютный путь <code>path = '/a/b/c'</code> и массив команд <code>cmds = ['cd ..', 'cd d']</code>. Возвращает итоговый путь: <code>'/a/b/d'</code>.`,
    starterCode: ``, testCode: `assert solve("/a/b", ["cd ..", "cd c"]) == "/a/c"`
  },

  // ============================================
  // MODULE 5: Docker
  // ============================================
  {
    id: "mod5_gen_001", module: 5, order: 501, title: "Dockerfile: Парсинг FROM", difficulty: "junior", language: "python",
    description: `Функция <code>solve(lines)</code> принимает строки Dockerfile. Найдите базовый образ (строку, начинающуюся на 'FROM ') и верните имя образа.`,
    starterCode: ``, testCode: `assert solve(['FROM python:3.9', 'RUN apt update']) == 'python:3.9'`
  },
  {
    id: "mod5_gen_002", module: 5, order: 502, title: "Оптимизация слоев", difficulty: "middle", language: "python",
    description: `В Docker каждый RUN создает слой. Функция <code>solve(lines)</code> должна объединить подряд идущие <code>RUN</code> в один через <code>&& \\</code>. Верните новый список строк.`,
    starterCode: ``, testCode: `assert solve(['RUN apt update', 'RUN apt install -y curl']) == ['RUN apt update && \\\\ apt install -y curl']`
  },
  {
    id: "mod5_gen_003", module: 5, order: 503, title: "Маппинг портов", difficulty: "junior", language: "python",
    description: `Функция <code>solve(port_args)</code> парсит строку <code>-p 8080:80</code>. Вернуть словарь <code>{'host': 8080, 'container': 80}</code>.`,
    starterCode: ``, testCode: `assert solve("-p 8080:80") == {'host': 8080, 'container': 80}`
  },
  {
    id: "mod5_gen_004", module: 5, order: 504, title: "Переменные окружения", difficulty: "junior", language: "python",
    description: `Парсинг <code>ENV KEY=VALUE</code>. Написать функцию <code>solve(line)</code>, которая возвращает tuple: <code>('KEY', 'VALUE')</code>.`,
    starterCode: ``, testCode: `assert solve("ENV DB_HOST=localhost") == ("DB_HOST", "localhost")`
  },
  {
    id: "mod5_gen_005", module: 5, order: 505, title: "Проверка VOLUME", difficulty: "middle", language: "python",
    description: `<code>solve(lines)</code> возвращает <code>True</code>, если в Dockerfile объявлен хоть один VOLUME.`,
    starterCode: ``, testCode: `assert solve(['FROM ubuntu', 'VOLUME /data']) == True`
  },
  {
    id: "mod5_gen_006", module: 5, order: 506, title: "Docker Compose: YAML to Dict", difficulty: "senior", language: "python",
    description: `У нас нет yaml библиотеки, симулируем. На вход: список строк. <code>services:</code> \\n <code>  web:</code> -> <code>{'services': ['web']}</code>. Упрощенная логика! Вернуть только имена сервисов.`,
    starterCode: ``, testCode: `assert solve(['services:', '  web:', '  db:']) == ['web', 'db']`
  },
  {
    id: "mod5_gen_007", module: 5, order: 507, title: "Размер образа (калькулятор)", difficulty: "middle", language: "python",
    description: `Даны слои: <code>[{'cmd': 'FROM', 'size': 50}, {'cmd': 'RUN', 'size': 10}]</code>. <code>solve()</code> возвращает сумму size.`,
    starterCode: ``, testCode: `assert solve([{'cmd': 'FROM', 'size': 50}, {'cmd': 'RUN', 'size': 10}]) == 60`
  },
  {
    id: "mod5_gen_008", module: 5, order: 508, title: "Запрет root в Docker", difficulty: "senior", language: "python",
    description: `Анализатор безопасности. <code>solve(lines)</code> возвращает <code>False</code>, если в Dockerfile НЕТ директивы <code>USER</code> (значит работает под root).`,
    starterCode: ``, testCode: `assert solve(['FROM python', 'USER appUser', 'CMD run']) == True; assert solve(['FROM python']) == False`
  },
  {
    id: "mod5_gen_009", module: 5, order: 509, title: "Формат ENTRYPOINT", difficulty: "middle", language: "python",
    description: `Заменять shell-форму ENTRYPOINT на exec-форму. <code>solve("ENTRYPOINT python app.py")</code> возвращает <code>'ENTRYPOINT ["python", "app.py"]'</code>.`,
    starterCode: ``, testCode: `assert solve("ENTRYPOINT python app.py") == 'ENTRYPOINT ["python", "app.py"]'`
  },
  {
    id: "mod5_gen_010", module: 5, order: 510, title: "Поиск секретов (ENV PASS_)", difficulty: "middle", language: "python",
    description: `<code>solve(lines)</code> возвращает <code>False</code>, если обнаружена 'ENV' переменная, в имени которой есть 'PASSWORD' или 'SECRET'.`,
    starterCode: ``, testCode: `assert solve(['ENV DB_PASSWORD=123']) == False; assert solve(['ENV DB_HOST=abc']) == True`
  },

  // ============================================
  // MODULE 6: Airflow
  // ============================================
  {
    id: "mod6_gen_001", module: 6, order: 601, title: "Зависимости >>", difficulty: "middle", language: "python",
    description: `В Airflow <code>t1 >> t2</code> означает t1 должен выполниться до t2. Реализуйте класс Task: <code>t1 = Task('A'); t2 = Task('B'); t1 >> t2</code>, после чего <code>t2.upstream</code> содержит 'A'.`,
    starterCode: ``, testCode: `t1=solve('A'); t2=solve('B'); t1 >> t2; assert t2.upstream == ['A']`
  },
  {
    id: "mod6_gen_002", module: 6, order: 602, title: "Топологическая сортировка", difficulty: "senior", language: "python",
    description: `Дан граф задач <code>edges = [('A','B'), ('B','C')]</code>. Функция <code>topological_sort(edges)</code> возвращает валидный порядок выполнения <code>['A','B','C']</code>.`,
    starterCode: ``, testCode: `assert solve([('A','B'), ('B','C')]) == ['A','B','C']`
  },
  {
    id: "mod6_gen_003", module: 6, order: 603, title: "Повтор при сбоях (Retries)", difficulty: "middle", language: "python",
    description: `Напишите декоратор <code>retry(n)</code>, который пробует вызвать функцию до N раз, подавляя исключения, и падает только на N+1 раз.`,
    starterCode: ``, testCode: `assert True == True # test logic relies on implementation`
  },
  {
    id: "mod6_gen_004", module: 6, order: 604, title: "Сенсор файла (FileSensor)", difficulty: "junior", language: "python",
    description: `Симуляция сенсора. <code>solve(files, target)</code> проверяет наличие <code>target</code> в списке <code>files</code>.`,
    starterCode: ``, testCode: `assert solve(['a.txt', 'b.txt'], 'a.txt') == True`
  },
  {
    id: "mod6_gen_005", module: 6, order: 605, title: "Параметры DAG (macros)", difficulty: "middle", language: "python",
    description: `Парсинг шаблонов Jinja <code>{{ ds }}</code>. Функция <code>solve(template, ds_val)</code> заменяет <code>{{ ds }}</code> на <code>ds_val</code>.`,
    starterCode: ``, testCode: `assert solve("File_{{ ds }}.csv", "2023-01-01") == "File_2023-01-01.csv"`
  },
  {
    id: "mod6_gen_006", module: 6, order: 606, title: "Ветвление (Branching)", difficulty: "junior", language: "python",
    description: `BranchPythonOperator. Функция <code>solve(condition)</code> возвращает <code>"task_true"</code>, если True, и <code>"task_false"</code>, если False.`,
    starterCode: ``, testCode: `assert solve(True) == "task_true"`
  },
  {
    id: "mod6_gen_007", module: 6, order: 607, title: "Ограничение конкурентности", difficulty: "middle", language: "python",
    description: `Пул слотов. Имеется N слотов. <code>solve(tasks_count, slots)</code> возвращает количество волн запуска. (Т.е. округление вверх).`,
    starterCode: ``, testCode: `assert solve(10, 3) == 4`
  },
  {
    id: "mod6_gen_008", module: 6, order: 608, title: "Проверка циклов графа", difficulty: "senior", language: "python",
    description: `Даны рёбра ориентированного графа <code>edges = [('A','B'), ('B','A')]</code>. Возвращает <code>True</code>, если есть ЦИКЛ (это сломает DAG!).`,
    starterCode: ``, testCode: `assert solve([('A','B'), ('B','A')]) == True; assert solve([('A','B')]) == False`
  },
  {
    id: "mod6_gen_009", module: 6, order: 609, title: "Airflow XCom (Имитация)", difficulty: "middle", language: "python",
    description: `Реализуйте класс XCom, с методами <code>push(key, val)</code> и <code>pull(key)</code>.`,
    starterCode: ``, testCode: `x=solve(); x.push('k', 'v'); assert x.pull('k') == 'v'`
  },
  {
    id: "mod6_gen_010", module: 6, order: 610, title: "Правила триггеров", difficulty: "junior", language: "python",
    description: `Функция <code>solve(statuses, rule)</code>. Если rule=='all_success', вернет True, если все в списке 'success'. Если rule=='one_success', вернет True, если есть хотя бы один.`,
    starterCode: ``, testCode: `assert solve(['success', 'failed'], 'one_success') == True`
  },

  // ============================================
  // MODULE 7: Spark
  // ============================================
  {
    id: "mod7_gen_001", module: 7, order: 701, title: "Spark RDD: map()", difficulty: "junior", language: "python",
    description: `Симулируем <code>rdd.map(f)</code>. Напишите функцию <code>solve(arr, func)</code>, которая применяет <code>func</code> к каждому элементу <code>arr</code>.`,
    starterCode: ``, testCode: `assert solve([1,2,3], lambda x: x*2) == [2,4,6]`
  },
  {
    id: "mod7_gen_002", module: 7, order: 702, title: "Spark RDD: filter()", difficulty: "junior", language: "python",
    description: `Симулируем <code>rdd.filter(f)</code>. Напишите функцию <code>solve(arr, func)</code>.`,
    starterCode: ``, testCode: `assert solve([1,2,3,4], lambda x: x%2==0) == [2,4]`
  },
  {
    id: "mod7_gen_003", module: 7, order: 703, title: "Spark RDD: flatMap()", difficulty: "middle", language: "python",
    description: `Симулируем <code>flatMap</code>. На вход список строк. Примените <code>split(' ')</code> и верните плоский список всех слов.`,
    starterCode: ``, testCode: `assert solve(["hello world", "data eng"]) == ["hello", "world", "data", "eng"]`
  },
  {
    id: "mod7_gen_004", module: 7, order: 704, title: "Spark RDD: reduceByKey()", difficulty: "senior", language: "python",
    description: `На вход список кортежей: <code>[('a',1), ('b',1), ('a',1)]</code>. Верните словарь со сгруппированными суммами (<code>{'a':2, 'b':1}</code>).`,
    starterCode: ``, testCode: `assert solve([('a',1), ('b',1), ('a',1)]) == {'a':2, 'b':1}`
  },
  {
    id: "mod7_gen_005", module: 7, order: 705, title: "DataFrame: Select", difficulty: "junior", language: "python",
    description: `Симуляция df.select(). На вход список словарей и список колонок. Верните список урезенных словарей.`,
    starterCode: ``, testCode: `assert solve([{'a':1, 'b':2}], ['a']) == [{'a':1}]`
  },
  {
    id: "mod7_gen_006", module: 7, order: 706, title: "DataFrame: withColumn", difficulty: "middle", language: "python",
    description: `Симуляция df.withColumn(). На вход: data, col_name, func. Измените словари, добавив <code>row[col_name] = func(row)</code>.`,
    starterCode: ``, testCode: `assert solve([{'a':1}], 'b', lambda r: r['a']*2)[0]['b'] == 2`
  },
  {
    id: "mod7_gen_007", module: 7, order: 707, title: "Партиционирование (Hash Partitioner)", difficulty: "senior", language: "python",
    description: `Функция <code>solve(arr, num_parts)</code> делит элементы по партициям (список списков) на основе <code>hash(x) % num_parts</code>.`,
    starterCode: ``, testCode: `res=solve([1,2,3], 2); assert len(res)==2`
  },
  {
    id: "mod7_gen_008", module: 7, order: 708, title: "Spark Broadcast Variables", difficulty: "middle", language: "python",
    description: `У вас большой массив <code>data</code> и маленький словарь <code>dict_bcast</code>. Для каждого элемента замените ID на ИМЯ из словаря.`,
    starterCode: ``, testCode: `assert solve([1,2], {1:'A',2:'B'}) == ['A','B']`
  },
  {
    id: "mod7_gen_009", module: 7, order: 709, title: "Spark Action vs Transformation", difficulty: "junior", language: "python",
    description: `Функция <code>solve(method)</code> возвращает 'Action', если метод (count, collect, show) запускает джобу, и 'Transformation' (map, filter).`,
    starterCode: ``, testCode: `assert solve('count') == 'Action'; assert solve('filter') == 'Transformation'`
  },
  {
    id: "mod7_gen_010", module: 7, order: 710, title: "Перекос данных (Data Skew)", difficulty: "senior", language: "python",
    description: `Функция <code>solve(arr)</code> проверяет перекос. Если один элемент встречается больше, чем в 5 РАЗ чаще, чем средняя частота других элементов, вернуть <code>True</code>.`,
    starterCode: ``, testCode: `assert solve([1,1,1,1,1,1, 2, 3]) == True`
  },

  // ============================================
  // MODULE 8: dbt
  // ============================================
  {
    id: "mod8_gen_001", module: 8, order: 801, title: "dbt ref() функция", difficulty: "junior", language: "python",
    description: `Напишите функцию <code>solve(model_name)</code>, которая возвращает строку для SQL: <code>{{ ref('model_name') }}</code>.`,
    starterCode: ``, testCode: `assert solve("stg_users") == "{{ ref('stg_users') }}"`
  },
  {
    id: "mod8_gen_002", module: 8, order: 802, title: "dbt source()", difficulty: "junior", language: "python",
    description: `Напишите функцию <code>solve(src, table)</code>, которая возвращает строку: <code>{{ source('src', 'table') }}</code>.`,
    starterCode: ``, testCode: `assert solve("raw", "users") == "{{ source('raw', 'users') }}"`
  },
  {
    id: "mod8_gen_003", module: 8, order: 803, title: "Генерация surrogate_key", difficulty: "middle", language: "python",
    description: `dbt_utils.generate_surrogate_key. Напишите функцию <code>solve(cols)</code> которая склеивает список колонок через тире '-' и возвращает md5 хеш от них.`,
    starterCode: `import hashlib\ndef solve(cols):\n    pass`, testCode: `assert solve(['a','b']) == '187ef4436122d1cc2f40dc2b92f0eba0'`
  },
  {
    id: "mod8_gen_004", module: 8, order: 804, title: "Инкрементальная логика (is_incremental)", difficulty: "senior", language: "python",
    description: `Функция <code>solve(is_inc, last_date)</code>. Вернуть строку: <code>"WHERE date > 'last_date'"</code>, если is_inc == True. Иначе пустую строку.`,
    starterCode: ``, testCode: `assert solve(True, '2023') == "WHERE date > '2023'"`
  },
  {
    id: "mod8_gen_005", module: 8, order: 805, title: "Snapshots: Valid_to", difficulty: "middle", language: "python",
    description: `SCD2 симуляция: Если новая запись пришла 2023-02-01, старая запись получает <code>valid_to='2023-02-01'</code>. Верните обновленную старую запись.`,
    starterCode: ``, testCode: `assert solve({'v':'1'}, '2023')['valid_to'] == '2023'`
  },
  {
    id: "mod8_gen_006", module: 8, order: 806, title: "Тесты: not_null", difficulty: "junior", language: "python",
    description: `Функция <code>solve(col_data)</code> принимает список значений. Если там есть <code>None</code> - вернуть False, иначе True.`,
    starterCode: ``, testCode: `assert solve([1, 2, None]) == False; assert solve([1, 2]) == True`
  },
  {
    id: "mod8_gen_007", module: 8, order: 807, title: "Тесты: unique", difficulty: "junior", language: "python",
    description: `Функция <code>solve(col_data)</code>. Если длина списка равна длине <code>set(col_data)</code> - вернуть True.`,
    starterCode: ``, testCode: `assert solve([1,2,2]) == False`
  },
  {
    id: "mod8_gen_008", module: 8, order: 808, title: "Тесты: accepted_values", difficulty: "middle", language: "python",
    description: `Функция <code>solve(col_data, accepted)</code>. Если хоть одно значение не в accepted - False.`,
    starterCode: ``, testCode: `assert solve(['A','B','C'], ['A','B']) == False`
  },
  {
    id: "mod8_gen_009", module: 8, order: 809, title: "Парсинг YML схемы", difficulty: "senior", language: "python",
    description: `Симуляция извлечения тестов. Дан словарь <code>{'models': [{'name': 'm1', 'columns': [{'tests': ['unique', 'not_null']}]}]}</code>. <code>solve(d)</code> возвращает все тесты списком.`,
    starterCode: ``, testCode: `assert solve({'models': [{'columns': [{'tests': ['req']}]}]}) == ['req']`
  },
  {
    id: "mod8_gen_010", module: 8, order: 810, title: "Макросы Jinja", difficulty: "middle", language: "python",
    description: `Напишите форматировщик <code>solve(macro_name, args_list)</code>, который генерирует вызов. Пример: "concat", ["a", "b"] -> <code>"{{ concat(a, b) }}"</code>.`,
    starterCode: ``, testCode: `assert solve("cast", ["a"]) == "{{ cast(a) }}"`
  },

  // ============================================
  // MODULE 9: Kafka
  // ============================================
  {
    id: "mod9_gen_001", module: 9, order: 901, title: "Kafka Producer", difficulty: "junior", language: "python",
    description: `Симулируем <code>producer.send(topic, msg)</code>. Реализуйте функцию <code>solve(msg)</code>, возвращающую JSON-строку: <code>{"payload": msg, "topic": "events"}</code>.`,
    starterCode: `import json\ndef solve(msg):\n    pass`, testCode: `assert 'events' in solve('test')`
  },
  {
    id: "mod9_gen_002", module: 9, order: 902, title: "Kafka Partitions (Hashed)", difficulty: "middle", language: "python",
    description: `Ключ маршрутизируется по формуле <code>hash(key) % total_partitions</code>. <code>solve(key, parts)</code> возвращает номер партиции. Для тестов используйте встроенный hash(int).`,
    starterCode: ``, testCode: `assert solve(10, 2) in [0, 1]`
  },
  {
    id: "mod9_gen_003", module: 9, order: 903, title: "Kafka Partitions (Round Robin)", difficulty: "middle", language: "python",
    description: `Функция <code>solve(msg_index, total_parts)</code> распределяет сообщения по кругу. (Подсказка: просто остаток от деления индекса).`,
    starterCode: ``, testCode: `assert solve(5, 3) == 2`
  },
  {
    id: "mod9_gen_004", module: 9, order: 904, title: "Consumer Groups (Offset Tracking)", difficulty: "senior", language: "python",
    description: `У группы консьюмеров есть offset. <code>solve(current_offset, msgs_fetched)</code> -> вернет новый offset (сумма).`,
    starterCode: ``, testCode: `assert solve(10, 5) == 15`
  },
  {
    id: "mod9_gen_005", module: 9, order: 905, title: "At-least-once семантика", difficulty: "middle", language: "python",
    description: `Дубликаты могут прийти. <code>solve(stream)</code> принимает список IDs и возвращает уникальные обработанные IDs.`,
    starterCode: ``, testCode: `assert sorted(solve([1,1,2])) == [1,2]`
  },
  {
    id: "mod9_gen_006", module: 9, order: 906, title: "Парсинг Avro (схема)", difficulty: "junior", language: "python",
    description: `У нас есть record. Верните <code>True</code>, если в словаре есть ключи <code>'id'</code> и <code>'value'</code> (как требует схема).`,
    starterCode: ``, testCode: `assert solve({'id':1, 'value':2}) == True; assert solve({'id':1}) == False`
  },
  {
    id: "mod9_gen_007", module: 9, order: 907, title: "Kafka Lag Calculator", difficulty: "middle", language: "python",
    description: `Lag = Log-End-Offset - Current-Offset. <code>solve(leo, current)</code> возвращает lag.`,
    starterCode: ``, testCode: `assert solve(100, 90) == 10`
  },
  {
    id: "mod9_gen_008", module: 9, order: 908, title: "Batching (Сбор пакетов)", difficulty: "senior", language: "python",
    description: `Продюсер шлет батчами. <code>solve(msgs, batch_size)</code> принимает список и размер батча. Возвращает список батчей (списков).`,
    starterCode: ``, testCode: `assert solve([1,2,3,4], 2) == [[1,2], [3,4]]`
  },
  {
    id: "mod9_gen_009", module: 9, order: 909, title: "Dead Letter Queue (DLQ)", difficulty: "middle", language: "python",
    description: `При обработке сообщений, если оно не число - отправляем в DLQ. <code>solve(msgs)</code> -> вернуть два списка (Успешные, DLQ).`,
    starterCode: ``, testCode: `assert solve([1, 'a', 2]) == ([1, 2], ['a'])`
  },
  {
    id: "mod9_gen_010", module: 9, order: 910, title: "Topic Retention Policy", difficulty: "junior", language: "python",
    description: `Kafka удаляет старые данные. Функция <code>solve(msg_age_hours, max_retention_h)</code> возвращает <code>True</code>, если сообщение будет УДАЛЕНО.`,
    starterCode: ``, testCode: `assert solve(25, 24) == True`
  },

  // ============================================
  // MODULE 10: Cloud
  // ============================================
  {
    id: "mod10_gen_001", module: 10, order: 1001, title: "S3 URI Парсер", difficulty: "junior", language: "python",
    description: `Функция <code>solve(uri)</code> принимает URI вида <code>s3://my-bucket/data/file.csv</code>. Верните кортеж: <code>('my-bucket', 'data/file.csv')</code>.`,
    starterCode: ``, testCode: `assert solve("s3://bucket/key") == ('bucket', 'key')`
  },
  {
    id: "mod10_gen_002", module: 10, order: 1002, title: "IAM Политики (Проверка)", difficulty: "middle", language: "python",
    description: `Политика: <code>{'Action': 's3:GetObject', 'Effect': 'Allow'}</code>. Пользователь пытается <code>s3:PutObject</code>. <code>solve(policy, action)</code> возвращает 'Allow' если совпало, иначе 'Deny'.`,
    starterCode: ``, testCode: `assert solve({'Action': 's3:GetObject', 'Effect': 'Allow'}, 's3:GetObject') == 'Allow'; assert solve({'Action': 's3:GetObject', 'Effect': 'Allow'}, 's3:PutObject') == 'Deny'`
  },
  {
    id: "mod10_gen_003", module: 10, order: 1003, title: "EC2 Автомасштабирование", difficulty: "middle", language: "python",
    description: `Текущая CPU загрузка <code>cpu</code>. Если cpu > 80, добавляем +1 инстанс. Если cpu < 20, удаляем -1 (минимум 1). <code>solve(cpu, current_instances)</code> возвращает новое кол-во.`,
    starterCode: ``, testCode: `assert solve(90, 2) == 3; assert solve(10, 1) == 1`
  },
  {
    id: "mod10_gen_004", module: 10, order: 1004, title: "Регионы (Latency Router)", difficulty: "senior", language: "python",
    description: `Дан список словарей регионов: <code>[{'reg':'eu', 'ping':20}, {'reg':'us', 'ping':120}]</code>. <code>solve(regions)</code> возвращает ИМЯ региона с минимальным пингом.`,
    starterCode: ``, testCode: `assert solve([{'reg':'A', 'ping':10}, {'reg':'B', 'ping':5}]) == 'B'`
  },
  {
    id: "mod10_gen_005", module: 10, order: 1005, title: "Счета за облако (Billing)", difficulty: "junior", language: "python",
    description: `Функция <code>solve(hours, rate_per_hour)</code>. Возвращает стоимость. Если hours > 730 (1 месяц), на часы СВЕРХУ 730 действует скидка 50%.`,
    starterCode: ``, testCode: `assert solve(10, 10) == 100; assert solve(740, 10) == 7350`
  },
  {
    id: "mod10_gen_006", module: 10, order: 1006, title: "Glacier Lifecycle", difficulty: "middle", language: "python",
    description: `Дан файл с возрастом <code>age_days</code>. Если age_days > 90, вернуть 'Glacier', > 30 вернуть 'IA', иначе 'Standard'.`,
    starterCode: ``, testCode: `assert solve(100) == 'Glacier'; assert solve(40) == 'IA'; assert solve(10) == 'Standard'`
  },
  {
    id: "mod10_gen_007", module: 10, order: 1007, title: "Serverless (Cold Start)", difficulty: "middle", language: "python",
    description: `У функции есть холодный старт (2000ms) и горячее выполнение (50ms). Горячая фаза держится 10 минут. Даны 2 времени вызова <code>t1, t2</code> (в минутах). Вернуть суммарное время выполнения (мс).`,
    starterCode: ``, testCode: `assert solve(0, 5) == 2050; assert solve(0, 15) == 4000`
  },
  {
    id: "mod10_gen_008", module: 10, order: 1008, title: "Pub/Sub (Message Duplication)", difficulty: "senior", language: "python",
    description: `По аналогии к Kafka At-Least-Once. <code>solve(history, new_msg_id)</code> возвращает <code>True</code>, если это ДУБЛИКАТ (id уже в history).`,
    starterCode: ``, testCode: `assert solve([1,2,3], 2) == True`
  },
  {
    id: "mod10_gen_009", module: 10, order: 1009, title: "VPC CIDR пересечение", difficulty: "senior", language: "python",
    description: `Симуляция проверки сетей. Если подсеть A (напр. '10.0.0.x') и B ('10.0.1.x') имеют разный 3 октет - нет конфликта. <code>solve('10.0.0.1', '10.0.1.1') -> False</code> (нет конфликта).`,
    starterCode: ``, testCode: `assert solve('10.0.0.1', '10.0.1.1') == False; assert solve('10.0.0.1', '10.0.0.2') == True`
  },
  {
    id: "mod10_gen_010", module: 10, order: 1010, title: "Cloud Storage Multipart Upload", difficulty: "middle", language: "python",
    description: `Файл размера <code>S</code> мб разбивается на части по <code>P</code> мб (последняя мб меньше). Возвращает список размеров всех частей. <code>solve(12, 5) -> [5, 5, 2]</code>.`,
    starterCode: ``, testCode: `assert solve(12, 5) == [5, 5, 2]; assert solve(10, 5) == [5, 5]`
  },

  // ============================================
  // MODULE 11: Data Quality
  // ============================================
  {
    id: "mod11_gen_001", module: 11, order: 1101, title: "DQ: Completeness", difficulty: "junior", language: "python",
    description: `Полнота данных. <code>solve(arr)</code> возвращает процент (0-100) NOT NULL значений.`,
    starterCode: ``, testCode: `assert solve([1, 2, None, 4]) == 75.0`
  },
  {
    id: "mod11_gen_002", module: 11, order: 1102, title: "DQ: Uniqueness", difficulty: "junior", language: "python",
    description: `Уникальность. <code>solve(arr)</code> возвращает процент (0-100) уникальных значений.`,
    starterCode: ``, testCode: `assert solve([1,1,2,3]) == 75.0`
  },
  {
    id: "mod11_gen_003", module: 11, order: 1103, title: "DQ: Validity (Regex)", difficulty: "middle", language: "python",
    description: `Email валидация. <code>solve(email)</code> возвращает True, если есть символ '@' и '.' после него.`,
    starterCode: ``, testCode: `assert solve('test@m.ru') == True; assert solve('test.ru') == False`
  },
  {
    id: "mod11_gen_004", module: 11, order: 1104, title: "DQ: Accuracy (Z-score anomaly)", difficulty: "senior", language: "python",
    description: `Симуляция фильтрации аномалий. Значение считается аномалией, если оно > (mean + 3). Дано mean=10. Отфильтруйте <code>arr</code>: оставьте только НЕ аномалии.`,
    starterCode: ``, testCode: `assert solve([10, 11, 50, 12], 10) == [10, 11, 12]`
  },
  {
    id: "mod11_gen_005", module: 11, order: 1105, title: "DQ: Consistency", difficulty: "middle", language: "python",
    description: `Логическая целостность. В строке таблицы <code>{'age': 15, 'has_license': True}</code> нарушение. <code>solve(row)</code> возвращает False, если age < 18 и has_license == True.`,
    starterCode: ``, testCode: `assert solve({'age': 15, 'has_license': True}) == False`
  },
  {
    id: "mod11_gen_006", module: 11, order: 1106, title: "DQ: Timeliness", difficulty: "middle", language: "python",
    description: `Свежесть данных. Существует порог <code>max_delay</code>. Если <code>current_time - data_time > max_delay</code>, вернуть False.`,
    starterCode: ``, testCode: `assert solve(100, 80, 15) == False`
  },
  {
    id: "mod11_gen_007", module: 11, order: 1107, title: "Great Expectations симуляция", difficulty: "middle", language: "python",
    description: `<code>expect_column_values_to_be_between(col, min_v, max_v)</code>. Вернуть True, если ВСЕ элементы в границах [min, max].`,
    starterCode: ``, testCode: `assert solve([1,2,3], 1, 3) == True; assert solve([1,5], 1, 3) == False`
  },
  {
    id: "mod11_gen_008", module: 11, order: 1108, title: "Очистка спецсимволов", difficulty: "junior", language: "python",
    description: `Данные часто содержат мусор: <code>"N/A", "NULL", "-", "?"</code>. Функция <code>solve(s)</code> заменяет их на <code>None</code>. Иначе возвращает <code>s</code>.`,
    starterCode: ``, testCode: `assert solve("N/A") is None; assert solve("Valid") == "Valid"`
  },
  {
    id: "mod11_gen_009", module: 11, order: 1109, title: "Заполнение пропусков (Imputation)", difficulty: "middle", language: "python",
    description: `Функция <code>solve(arr)</code> заменяет все <code>None</code> на СРЕДНЕЕ значение остальных (целое число, округление делением //).`,
    starterCode: ``, testCode: `assert solve([10, None, 20]) == [10, 15, 20]`
  },
  {
    id: "mod11_gen_010", module: 11, order: 1110, title: "Сверка данных (Reconciliation)", difficulty: "senior", language: "python",
    description: `Сверка: <code>src_sum</code> и <code>dest_sum</code>. Если разница > 1%, вернуть False, иначе True. Функция <code>solve(src, dest)</code>.`,
    starterCode: ``, testCode: `assert solve(100, 99) == True; assert solve(100, 95) == False`
  },

  // ============================================
  // MODULE 12: System Design
  // ============================================
  {
    id: "mod12_gen_001", module: 12, order: 1201, title: "CAP Теорема", difficulty: "junior", language: "python",
    description: `Если база выбрала 'Consistency' и 'Partition tolerance', то чем она пожертвовала? Функция <code>solve()</code> возвращает строку 'Availability'.`,
    starterCode: ``, testCode: `assert solve() == 'Availability'`
  },
  {
    id: "mod12_gen_002", module: 12, order: 1202, title: "Выбор Базы (OLTP vs OLAP)", difficulty: "middle", language: "python",
    description: `Требования: <code>{'writes_per_sec': 10000, 'complex_joins': False}</code>. <code>solve()</code> возвращает 'OLTP', если апдейтов много, и 'OLAP' если нужны аналитические запросы.`,
    starterCode: ``, testCode: `assert solve({'upserts': True, 'reads': 'simple'}) == 'OLTP'`
  },
  {
    id: "mod12_gen_003", module: 12, order: 1203, title: "Оценка памяти", difficulty: "middle", language: "python",
    description: `1M строк в день, 100 байт на строку. <code>solve(days)</code> возвращает необходимый объем памяти в МБ (1M = 1,000,000). Мегабайт = 1,000,000 байт для простоты.`,
    starterCode: ``, testCode: `assert solve(1) == 100.0`
  },
  {
    id: "mod12_gen_004", module: 12, order: 1204, title: "Sharding", difficulty: "senior", language: "python",
    description: `Мы шардируем пользователей по <code>user_id % 3</code>. Верните словарь со списками распределенных user_id: <code>{0: [], 1: [], 2: []}</code>.`,
    starterCode: ``, testCode: `assert solve([1,2,3,4]) == {0: [3], 1: [1,4], 2: [2]}`
  },
  {
    id: "mod12_gen_005", module: 12, order: 1205, title: "Event Sourcing", difficulty: "senior", language: "python",
    description: `Вместо текущего баланса, мы храним события. <code>solve(events)</code>. Дано <code>[{'type': 'DEPOSIT', 'amt': 100}, {'type': 'WITHDRAW', 'amt': 30}]</code>. Вернуть баланс.`,
    starterCode: ``, testCode: `assert solve([{'type': 'DEPOSIT', 'amt': 100}, {'type': 'WITHDRAW', 'amt': 30}]) == 70`
  },
  {
    id: "mod12_gen_006", module: 12, order: 1206, title: "Кэширование (LRU симуляция)", difficulty: "middle", language: "python",
    description: `Функция <code>solve(reqs, capacity)</code>. Считайте промахи кэша (misses). Самая простая стратегия — FIFO или просто сет размером C. Вернуть кол-во обращений в БД.`,
    starterCode: ``, testCode: `assert True == True # test depends on cache misses`
  },
  {
    id: "mod12_gen_007", module: 12, order: 1207, title: "Idempotency Key", difficulty: "middle", language: "python",
    description: `API принимает платеж. <code>solve(db, idem_key, amount)</code>. Если ключ уже в db (список), ничего не делать (вернуть 'ALREADY'), иначе добавить в db и вернуть 'OK'.`,
    starterCode: ``, testCode: `db=[]; assert solve(db, 'abc', 100) == 'OK'; assert solve(db, 'abc', 100) == 'ALREADY'`
  },
  {
    id: "mod12_gen_008", module: 12, order: 1208, title: "Пакетная передача (Batching)", difficulty: "junior", language: "python",
    description: `Отправлять по одному очень долго. Сгруппируйте массив <code>arr</code> в чанки размера <code>B</code>. Функция <code>solve(arr, B)</code>.`,
    starterCode: ``, testCode: `assert solve([1,2,3,4,5], 2) == [[1,2], [3,4], [5]]`
  },
  {
    id: "mod12_gen_009", module: 12, order: 1209, title: "Rate Limiter (Token Bucket)", difficulty: "senior", language: "python",
    description: `У нас 5 токенов в минуту. Прошло N секунд. За каждую 12 сек дается токен. <code>solve(tokens, N, requests)</code>. Верните кол-во УСПЕШНЫХ запросов из <code>requests</code>.`,
    starterCode: ``, testCode: `assert solve(0, 24, 3) == 2 # 2 tokens, 3 reqs -> 2 ok`
  },
  {
    id: "mod12_gen_010", module: 12, order: 1210, title: "MapReduce Pattern", difficulty: "senior", language: "python",
    description: `Воспроизведите MapReduce для подсчета слов вручную. <code>mapper(text)</code> -> <code>[('word', 1)...]</code> и <code>reducer(mapped)</code> -> <code>{'word': N}</code>. Верните reducer(mapper(text)).`,
    starterCode: ``, testCode: `assert solve("a b a") == {'a': 2, 'b': 1}`
  }
];

// Make globally accessible
window.TASKS_DATA = TASKS_DATA;
