// ============================================
// INTERVIEW QUESTIONS DATABASE (200+)
// Real interview questions for Data Engineers
// ============================================

const QUESTIONS_DATA = [

  // ============================================
  // 1. SQL — 40+ вопросов
  // ============================================

  // --- SQL Junior ---
  {
    id: "q_sql_001", category: "SQL", level: "junior",
    question: "Чем отличается WHERE от HAVING?",
    answer: `<strong>WHERE</strong> фильтрует строки <em>до</em> группировки (работает с отдельными строками).<br>
<strong>HAVING</strong> фильтрует <em>после</em> группировки (работает с результатами агрегатных функций).<br><br>
<pre>-- WHERE: фильтрует строки
SELECT department, AVG(salary)
FROM employees
WHERE salary > 30000     -- до GROUP BY
GROUP BY department;

-- HAVING: фильтрует группы
SELECT department, AVG(salary) as avg_sal
FROM employees
GROUP BY department
HAVING AVG(salary) > 50000;  -- после GROUP BY</pre>
<strong>Ключевое:</strong> в WHERE нельзя использовать агрегатные функции (COUNT, SUM, AVG и т.д.).`,
    tags: ["basics", "filtering"]
  },
  {
    id: "q_sql_002", category: "SQL", level: "junior",
    question: "Объясните разницу между INNER JOIN, LEFT JOIN, RIGHT JOIN и FULL OUTER JOIN",
    answer: `<strong>INNER JOIN</strong> — возвращает только строки, где есть совпадение в обеих таблицах.<br>
<strong>LEFT JOIN</strong> — все строки из левой таблицы + совпадения из правой (NULL если нет совпадения).<br>
<strong>RIGHT JOIN</strong> — все строки из правой таблицы + совпадения из левой.<br>
<strong>FULL OUTER JOIN</strong> — все строки из обеих таблиц (NULL где нет совпадения).<br><br>
<pre>-- INNER: только совпадения
SELECT * FROM orders o
INNER JOIN customers c ON o.customer_id = c.id;

-- LEFT: все заказы + клиент (если есть)
SELECT * FROM orders o
LEFT JOIN customers c ON o.customer_id = c.id;

-- FULL: все заказы + все клиенты
SELECT * FROM orders o
FULL OUTER JOIN customers c ON o.customer_id = c.id;</pre>
<strong>На собесе часто спрашивают:</strong> "Что будет, если в LEFT JOIN правая таблица не имеет совпадения?" — Ответ: столбцы правой таблицы будут NULL.`,
    tags: ["joins", "basics"]
  },
  {
    id: "q_sql_003", category: "SQL", level: "junior",
    question: "В чём разница между UNION и UNION ALL?",
    answer: `<strong>UNION</strong> — объединяет результаты двух запросов и <em>удаляет дубликаты</em> (выполняет DISTINCT).<br>
<strong>UNION ALL</strong> — объединяет результаты <em>без удаления дубликатов</em>.<br><br>
<strong>Производительность:</strong> UNION ALL быстрее, потому что не тратит ресурсы на сортировку и дедупликацию.<br><br>
<pre>-- UNION: удаляет дубликаты (медленнее)
SELECT city FROM customers
UNION
SELECT city FROM suppliers;

-- UNION ALL: сохраняет дубликаты (быстрее)
SELECT city FROM customers
UNION ALL
SELECT city FROM suppliers;</pre>
<strong>Правило:</strong> Всегда используйте UNION ALL, если вы уверены, что дубликатов не будет, или они вам не мешают.`,
    tags: ["set_operations", "performance"]
  },
  {
    id: "q_sql_004", category: "SQL", level: "junior",
    question: "Что такое CTE (Common Table Expression) и чем оно отличается от подзапроса?",
    answer: `<strong>CTE</strong> — именованный временный результат, определяемый через WITH. Существует только в рамках одного запроса.<br><br>
<strong>Преимущества CTE перед подзапросом:</strong>
<ul>
<li>Читаемость — можно разбить сложный запрос на логические блоки</li>
<li>Переиспользование — CTE можно упомянуть несколько раз в запросе</li>
<li>Рекурсия — CTE поддерживает рекурсивные запросы</li>
</ul>
<pre>-- CTE
WITH high_earners AS (
    SELECT * FROM employees WHERE salary > 80000
),
dept_stats AS (
    SELECT department, COUNT(*) as cnt
    FROM high_earners
    GROUP BY department
)
SELECT * FROM dept_stats WHERE cnt > 5;

-- Подзапрос (менее читаемо)
SELECT * FROM (
    SELECT department, COUNT(*) as cnt
    FROM (SELECT * FROM employees WHERE salary > 80000) t
    GROUP BY department
) t2 WHERE cnt > 5;</pre>`,
    tags: ["cte", "subquery", "readability"]
  },
  {
    id: "q_sql_005", category: "SQL", level: "junior",
    question: "Как работают NULL значения в SQL? Что вернёт NULL = NULL?",
    answer: `<strong>NULL</strong> — это отсутствие значения, а не пустая строка или ноль.<br><br>
<strong>NULL = NULL возвращает NULL</strong> (не TRUE и не FALSE)! Это главная ловушка.<br><br>
Правила:
<ul>
<li>Любое сравнение с NULL даёт NULL: <code>NULL = NULL → NULL</code>, <code>NULL > 5 → NULL</code></li>
<li>Для проверки используйте <code>IS NULL</code> / <code>IS NOT NULL</code></li>
<li>В агрегатах NULL игнорируется: <code>AVG(col)</code> не учитывает NULL</li>
<li><code>COUNT(*)</code> считает все строки, <code>COUNT(col)</code> — только не-NULL</li>
<li><code>COALESCE(a, b, c)</code> — вернёт первое не-NULL значение</li>
</ul>
<pre>-- Ловушка в WHERE
SELECT * FROM users WHERE age = NULL;     -- ❌ вернёт 0 строк!
SELECT * FROM users WHERE age IS NULL;    -- ✅ правильно

-- NULL в JOIN
-- LEFT JOIN покажет NULL для несовпавших строк
-- COALESCE для подстановки значений
SELECT COALESCE(u.name, 'Unknown') FROM orders o
LEFT JOIN users u ON o.user_id = u.id;</pre>`,
    tags: ["null", "gotchas", "basics"]
  },
  {
    id: "q_sql_006", category: "SQL", level: "junior",
    question: "Напишите запрос: найти вторую по величине зарплату",
    answer: `Несколько способов:<br><br>
<strong>Способ 1: LIMIT/OFFSET</strong>
<pre>SELECT DISTINCT salary FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1;</pre>

<strong>Способ 2: Подзапрос</strong>
<pre>SELECT MAX(salary) FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);</pre>

<strong>Способ 3: Оконная функция (самый гибкий)</strong>
<pre>SELECT salary FROM (
    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rk
    FROM employees
) t WHERE rk = 2;</pre>

<strong>На собесе уточняют:</strong> "А если нужна N-я зарплата?" — Используйте оконную функцию с параметром N.`,
    tags: ["window_functions", "classic_problems"]
  },
  {
    id: "q_sql_007", category: "SQL", level: "junior",
    question: "Объясните разницу между DELETE, TRUNCATE и DROP",
    answer: `<strong>DELETE</strong> — удаляет строки с возможностью WHERE. Логирует каждую строку (медленно). Можно откатить (ROLLBACK).<br>
<strong>TRUNCATE</strong> — удаляет ВСЕ строки. Быстрее DELETE. Не логирует построчно. Сбрасывает auto-increment.<br>
<strong>DROP</strong> — удаляет всю таблицу (структуру + данные).<br><br>
<pre>DELETE FROM orders WHERE created_at < '2020-01-01';  -- удалит выбранные строки
TRUNCATE TABLE temp_staging;                           -- очистит таблицу
DROP TABLE IF EXISTS old_backup;                       -- удалит таблицу</pre>

<strong>Для Data Engineer:</strong> TRUNCATE используется при перезагрузке staging-таблиц (full refresh), DELETE — для SCD или инкрементальных загрузок.`,
    tags: ["ddl", "dml", "basics"]
  },
  {
    id: "q_sql_008", category: "SQL", level: "junior",
    question: "Что такое GROUP BY и как работает порядок выполнения SQL запроса?",
    answer: `<strong>GROUP BY</strong> группирует строки с одинаковыми значениями в указанных столбцах для вычисления агрегатов (COUNT, SUM, AVG и т.д.).<br><br>
<strong>Порядок выполнения SQL (не путать с порядком написания!):</strong>
<ol>
<li><strong>FROM</strong> / JOIN — определяет таблицы и соединения</li>
<li><strong>WHERE</strong> — фильтрация строк</li>
<li><strong>GROUP BY</strong> — группировка</li>
<li><strong>HAVING</strong> — фильтрация групп</li>
<li><strong>SELECT</strong> — выбор столбцов и вычисления</li>
<li><strong>DISTINCT</strong> — удаление дубликатов</li>
<li><strong>ORDER BY</strong> — сортировка</li>
<li><strong>LIMIT / OFFSET</strong> — ограничение результата</li>
</ol>
<strong>Вот почему</strong> нельзя использовать алиас из SELECT в WHERE — SELECT выполняется позже!`,
    tags: ["groupby", "execution_order", "basics"]
  },

  // --- SQL Middle ---
  {
    id: "q_sql_009", category: "SQL", level: "middle",
    question: "Объясните разницу между ROW_NUMBER(), RANK() и DENSE_RANK()",
    answer: `Все три — оконные функции для нумерации строк, но обрабатывают дубликаты по-разному:<br><br>
<pre>salary: 100, 100, 90, 80

ROW_NUMBER(): 1, 2, 3, 4  — уникальные номера, дубликаты получают разные номера
RANK():       1, 1, 3, 4  — одинаковые значения = одинаковый ранг, следующий пропускается
DENSE_RANK(): 1, 1, 2, 3  — одинаковые значения = одинаковый ранг, без пропусков</pre>

<strong>Когда что использовать:</strong>
<ul>
<li><code>ROW_NUMBER()</code> — для пагинации, дедупликации (взять последнюю запись)</li>
<li><code>RANK()</code> — для рейтингов где важны пропуски (спортивные результаты)</li>
<li><code>DENSE_RANK()</code> — для рейтингов без пропусков (топ-N зарплат)</li>
</ul>

<pre>-- Дедупликация (частая задача DE)
WITH ranked AS (
    SELECT *, ROW_NUMBER() OVER (
        PARTITION BY user_id ORDER BY updated_at DESC
    ) as rn
    FROM user_events
)
SELECT * FROM ranked WHERE rn = 1;  -- последнее событие каждого юзера</pre>`,
    tags: ["window_functions", "deduplication"]
  },
  {
    id: "q_sql_010", category: "SQL", level: "middle",
    question: "Что такое оконные функции LAG() и LEAD()? Приведите пример использования",
    answer: `<strong>LAG(col, n)</strong> — значение столбца из предыдущей строки (на n строк назад, по умолчанию 1).<br>
<strong>LEAD(col, n)</strong> — значение столбца из следующей строки (на n строк вперёд).<br><br>
<pre>-- Сравнить продажи с предыдущим месяцем
SELECT 
    month,
    revenue,
    LAG(revenue) OVER (ORDER BY month) as prev_month,
    revenue - LAG(revenue) OVER (ORDER BY month) as growth,
    ROUND(
        (revenue - LAG(revenue) OVER (ORDER BY month)) * 100.0 
        / LAG(revenue) OVER (ORDER BY month), 2
    ) as growth_pct
FROM monthly_sales;

-- Результат:
-- month   | revenue | prev_month | growth | growth_pct
-- 2024-01 | 10000   | NULL       | NULL   | NULL
-- 2024-02 | 12000   | 10000      | 2000   | 20.00
-- 2024-03 | 11500   | 12000      | -500   | -4.17</pre>

<strong>Частые задачи:</strong> MoM/YoY рост, время между событиями, сессионализация кликстрима.`,
    tags: ["window_functions", "lag_lead", "analytics"]
  },
  {
    id: "q_sql_011", category: "SQL", level: "middle",
    question: "Как реализовать Running Total (нарастающий итог) в SQL?",
    answer: `Running Total — это сумма всех предыдущих строк включая текущую. Реализуется через оконную функцию SUM() с frame clause:<br><br>
<pre>SELECT 
    date,
    amount,
    SUM(amount) OVER (ORDER BY date) as running_total,
    SUM(amount) OVER (
        ORDER BY date 
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) as running_total_explicit
FROM transactions;

-- С разбивкой по категориям
SELECT 
    category,
    date,
    amount,
    SUM(amount) OVER (
        PARTITION BY category 
        ORDER BY date
    ) as category_running_total
FROM transactions;</pre>

<strong>Frame clause:</strong>
<ul>
<li><code>ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code> — от начала до текущей строки</li>
<li><code>ROWS BETWEEN 3 PRECEDING AND CURRENT ROW</code> — скользящая сумма за 4 строки</li>
<li><code>ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING</code> — текущая + по одной с каждой стороны</li>
</ul>`,
    tags: ["window_functions", "running_total", "frame_clause"]
  },
  {
    id: "q_sql_012", category: "SQL", level: "middle",
    question: "Что такое EXPLAIN / EXPLAIN ANALYZE и как читать план выполнения запроса?",
    answer: `<strong>EXPLAIN</strong> — показывает план выполнения запроса (без выполнения).<br>
<strong>EXPLAIN ANALYZE</strong> — выполняет запрос и показывает реальное время + план.<br><br>
<strong>На что смотреть:</strong>
<ul>
<li><strong>Seq Scan</strong> — полное сканирование таблицы (плохо на больших таблицах → нужен индекс)</li>
<li><strong>Index Scan</strong> — использование индекса (хорошо)</li>
<li><strong>Hash Join / Nested Loop / Merge Join</strong> — типы соединений</li>
<li><strong>Sort</strong> — сортировка (может быть дорогой)</li>
<li><strong>Cost</strong> — estimated cost (startup..total)</li>
<li><strong>Actual Time</strong> — реальное время в EXPLAIN ANALYZE</li>
<li><strong>Rows</strong> — estimated vs actual количество строк</li>
</ul>

<pre>EXPLAIN ANALYZE
SELECT u.name, COUNT(o.id) 
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01'
GROUP BY u.name;</pre>

<strong>Красные флаги:</strong> Seq Scan на больших таблицах, большая разница между estimated и actual rows, Sort на миллионах строк.`,
    tags: ["optimization", "explain", "performance"]
  },
  {
    id: "q_sql_013", category: "SQL", level: "middle",
    question: "Что такое индексы? Какие типы бывают и когда их использовать?",
    answer: `<strong>Индекс</strong> — это структура данных, ускоряющая поиск в таблице (как оглавление в книге).<br><br>
<strong>Типы индексов:</strong>
<ul>
<li><strong>B-tree</strong> (по умолчанию) — для =, <, >, BETWEEN, LIKE 'prefix%'. Самый универсальный</li>
<li><strong>Hash</strong> — только для =. Быстрее B-tree для точных совпадений</li>
<li><strong>GIN</strong> — для массивов, JSONB, полнотекстовый поиск</li>
<li><strong>GiST</strong> — для геоданных, диапазонов</li>
<li><strong>Composite</strong> — индекс на несколько столбцов (порядок важен!)</li>
</ul>

<strong>Когда НЕ использовать индекс:</strong>
<ul>
<li>Маленькие таблицы (< 1000 строк)</li>
<li>Столбцы с низкой кардинальностью (gender: M/F)</li>
<li>Таблицы с частыми INSERT/UPDATE (индекс замедляет записи)</li>
</ul>

<pre>-- Composite index (порядок важен!)
CREATE INDEX idx_orders_user_date 
ON orders(user_id, created_at);
-- Работает для: WHERE user_id = 5
-- Работает для: WHERE user_id = 5 AND created_at > '2024-01-01'
-- НЕ работает для: WHERE created_at > '2024-01-01' (без user_id)</pre>`,
    tags: ["indexes", "optimization", "btree"]
  },
  {
    id: "q_sql_014", category: "SQL", level: "middle",
    question: "Что такое партиционирование таблиц и зачем оно нужно?",
    answer: `<strong>Партиционирование</strong> — разделение большой таблицы на меньшие физические части (партиции) по определённому ключу.<br><br>
<strong>Типы:</strong>
<ul>
<li><strong>RANGE</strong> — по диапазону значений (дата, ID). Самый популярный для DE</li>
<li><strong>LIST</strong> — по списку значений (страна, категория)</li>
<li><strong>HASH</strong> — равномерное распределение по хешу</li>
</ul>

<strong>Зачем:</strong>
<ul>
<li><strong>Partition Pruning</strong> — запрос читает только нужные партиции</li>
<li>Быстрое удаление старых данных (DROP PARTITION вместо DELETE)</li>
<li>Параллельное сканирование разных партиций</li>
</ul>

<pre>-- Партиционирование по дате (PostgreSQL)
CREATE TABLE events (
    id BIGINT,
    event_date DATE,
    data JSONB
) PARTITION BY RANGE (event_date);

CREATE TABLE events_2024_01 PARTITION OF events
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
    
-- Запрос автоматически обращается только к нужной партиции
SELECT * FROM events WHERE event_date = '2024-01-15';</pre>`,
    tags: ["partitioning", "optimization", "big_data"]
  },
  {
    id: "q_sql_015", category: "SQL", level: "middle",
    question: "Напишите SQL для реализации SCD Type 2 (Slowly Changing Dimension)",
    answer: `<strong>SCD Type 2</strong> — сохраняет всю историю изменений с помощью полей valid_from, valid_to, is_current.<br><br>
<pre>-- Таблица dimension с историей
CREATE TABLE dim_customer (
    surrogate_key SERIAL PRIMARY KEY,
    customer_id INT,           -- натуральный ключ
    name TEXT,
    city TEXT,
    valid_from DATE,
    valid_to DATE DEFAULT '9999-12-31',
    is_current BOOLEAN DEFAULT TRUE
);

-- Обновление при изменении (MERGE / INSERT + UPDATE подход)
-- 1. Закрыть текущую версию
UPDATE dim_customer 
SET valid_to = CURRENT_DATE - 1, is_current = FALSE
WHERE customer_id = 123 AND is_current = TRUE;

-- 2. Вставить новую версию
INSERT INTO dim_customer (customer_id, name, city, valid_from, is_current)
VALUES (123, 'Alice', 'New York', CURRENT_DATE, TRUE);

-- Запрос: текущее состояние
SELECT * FROM dim_customer WHERE is_current = TRUE;

-- Запрос: состояние на определённую дату
SELECT * FROM dim_customer 
WHERE customer_id = 123 
AND '2024-06-15' BETWEEN valid_from AND valid_to;</pre>`,
    tags: ["scd", "dimension_modeling", "etl"]
  },

  // --- SQL Senior ---
  {
    id: "q_sql_016", category: "SQL", level: "senior",
    question: "Как оптимизировать запрос к таблице с 1 миллиардом строк?",
    answer: `Комплексный подход:<br><br>
<strong>1. Партиционирование</strong> — разделить таблицу по дате/региону. Partition pruning сокращает объём данных.

<strong>2. Правильные индексы</strong>
<ul>
<li>Composite index по часто фильтруемым столбцам</li>
<li>Covering index (INCLUDE) чтобы избежать обращения к таблице</li>
<li>Partial index для подмножества данных</li>
</ul>

<strong>3. Архитектурные решения</strong>
<ul>
<li>Materialized Views для тяжёлых агрегаций</li>
<li>Pre-aggregated таблицы (summary tables)</li>
<li>Columnar storage (Parquet, ORC) вместо row-based</li>
</ul>

<strong>4. На уровне запроса</strong>
<ul>
<li>Избегать SELECT * → выбирать только нужные столбцы</li>
<li>Использовать EXISTS вместо IN для подзапросов</li>
<li>Appróximated counts (HyperLogLog) вместо COUNT(DISTINCT)</li>
<li>Фильтровать как можно раньше (pushdown predicates)</li>
</ul>

<strong>5. Инфраструктура</strong>
<ul>
<li>Увеличить work_mem, shared_buffers</li>
<li>Connection pooling (PgBouncer)</li>
<li>Read replicas для аналитических запросов</li>
</ul>`,
    tags: ["optimization", "performance", "architecture"]
  },
  {
    id: "q_sql_017", category: "SQL", level: "senior",
    question: "Что такое Materialized Views и когда их использовать?",
    answer: `<strong>Materialized View</strong> — это предвычисленный результат запроса, сохранённый физически на диске. В отличие от обычного View, не выполняет запрос при каждом обращении.<br><br>
<strong>Когда использовать:</strong>
<ul>
<li>Тяжёлые агрегации, которые не нужны в реальном времени</li>
<li>Дашборды с допустимой задержкой данных</li>
<li>Сложные JOIN нескольких больших таблиц</li>
</ul>

<strong>Когда НЕ использовать:</strong>
<ul>
<li>Данные должны быть всегда актуальны (real-time)</li>
<li>Таблица-источник обновляется каждые секунды</li>
</ul>

<pre>CREATE MATERIALIZED VIEW mv_daily_revenue AS
SELECT 
    date_trunc('day', created_at) as day,
    product_category,
    SUM(amount) as revenue,
    COUNT(*) as orders_count
FROM orders
GROUP BY 1, 2;

-- Обновление (полное)
REFRESH MATERIALIZED VIEW mv_daily_revenue;

-- Обновление без блокировки (рекомендуется)
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_revenue;
-- Для CONCURRENTLY нужен unique index!</pre>

<strong>В data engineering:</strong> Materialized Views часто заменяются dbt incremental models или pre-calculated mart tables.`,
    tags: ["materialized_views", "optimization", "dwh"]
  },
  {
    id: "q_sql_018", category: "SQL", level: "senior",
    question: "Что такое Query Pushdown в контексте federated queries?",
    answer: `<strong>Query Pushdown</strong> — оптимизация, при которой фильтры, проекции и агрегации "спускаются" как можно ближе к источнику данных, вместо того чтобы тянуть все данные и фильтровать локально.<br><br>
<strong>Пример без pushdown:</strong><br>
Redshift → S3 (читает ВСЕ файлы) → фильтрует локально = медленно<br><br>
<strong>Пример с pushdown:</strong><br>
Redshift → S3 Spectrum (фильтрует НА S3, используя партиции и предикаты) → возвращает минимум данных = быстро<br><br>

<strong>Где это важно:</strong>
<ul>
<li><strong>Spark + JDBC</strong> — pushdown фильтров в PostgreSQL source</li>
<li><strong>Redshift Spectrum / Athena</strong> — pushdown в S3 (Parquet partition pruning)</li>
<li><strong>Trino/Presto</strong> — pushdown в разные коннекторы</li>
<li><strong>dbt + Snowflake</strong> — pushdown фильтров через ref()</li>
</ul>
<strong>Настройка в Spark:</strong>
<pre># Плохо — тянет ВСЮ таблицу в Spark
df = spark.read.jdbc(url, "huge_table")
df.filter(col("date") > "2024-01-01")

# Хорошо — pushdown в БД
df = spark.read.jdbc(url, "(SELECT * FROM huge_table WHERE date > '2024-01-01') t")</pre>`,
    tags: ["pushdown", "optimization", "distributed"]
  },

  // ============================================
  // 2. Python — 35+ вопросов
  // ============================================

  // --- Python Junior ---
  {
    id: "q_py_001", category: "Python", level: "junior",
    question: "Чем отличается list от tuple? Когда что использовать?",
    answer: `<strong>list</strong> — изменяемая (mutable) последовательность.<br>
<strong>tuple</strong> — неизменяемая (immutable) последовательность.<br><br>
<strong>Ключевые различия:</strong>
<ul>
<li><strong>Изменяемость:</strong> list можно менять (append, remove), tuple — нельзя</li>
<li><strong>Скорость:</strong> tuple быстрее (на ~5-10%) из-за immutability</li>
<li><strong>Память:</strong> tuple занимает меньше памяти</li>
<li><strong>Хешируемость:</strong> tuple можно использовать как ключ dict или элемент set</li>
</ul>

<pre># list — когда коллекция может меняться
users = ['Alice', 'Bob']
users.append('Charlie')

# tuple — когда данные фиксированы
coordinates = (55.75, 37.62)
rgb_color = (255, 128, 0)

# tuple как ключ словаря
cache = {}
cache[(55.75, 37.62)] = "Moscow"  # ✅ работает
cache[[55.75, 37.62]] = "Moscow"  # ❌ TypeError: unhashable type: 'list'</pre>

<strong>Для DE:</strong> используйте tuple для row-данных (неизменяемые записи), list — для коллекций, которые растут.`,
    tags: ["data_structures", "basics"]
  },
  {
    id: "q_py_002", category: "Python", level: "junior",
    question: "Что такое генератор (generator) в Python и зачем он нужен?",
    answer: `<strong>Генератор</strong> — это "ленивый" итератор, который производит значения по одному, а не хранит все в памяти.<br><br>
<strong>Зачем для Data Engineering:</strong> обработка файлов/данных, которые не помещаются в RAM.<br><br>
<pre># Обычная функция — хранит ВСЁ в памяти
def get_all_rows(filename):
    result = []
    with open(filename) as f:
        for line in f:
            result.append(process(line))
    return result  # ❌ 10GB файл = 10GB в RAM

# Генератор — обрабатывает по одному
def get_rows(filename):
    with open(filename) as f:
        for line in f:
            yield process(line)  # ✅ в памяти только 1 строка

# Generator expression (аналог list comprehension)
squares_list = [x**2 for x in range(1000000)]    # ❌ занимает память
squares_gen  = (x**2 for x in range(1000000))    # ✅ ленивый

# Использование
for row in get_rows('huge_file.csv'):
    insert_to_db(row)</pre>

<strong>Ключевое:</strong> генератор нельзя "перемотать назад" или узнать его длину — только итерировать один раз.`,
    tags: ["generators", "memory", "performance"]
  },
  {
    id: "q_py_003", category: "Python", level: "junior",
    question: "Что такое декоратор? Напишите декоратор для замера времени выполнения",
    answer: `<strong>Декоратор</strong> — функция, которая оборачивает другую функцию, добавляя поведение до/после её вызова.<br><br>
<pre>import time
import functools

def timer(func):
    @functools.wraps(func)  # сохраняет имя и docstring оригинальной функции
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} выполнилась за {elapsed:.4f} сек")
        return result
    return wrapper

@timer
def process_data(data):
    """Обрабатывает данные"""
    time.sleep(1)
    return len(data)

# Вызов
result = process_data([1, 2, 3])
# Вывод: process_data выполнилась за 1.0012 сек</pre>

<strong>Популярные декораторы для DE:</strong>
<ul>
<li><code>@retry</code> — повторить при ошибке (сетевые запросы)</li>
<li><code>@cache / @lru_cache</code> — кеширование результатов</li>
<li><code>@timer</code> — замер производительности</li>
<li><code>@log_execution</code> — логирование входа/выхода</li>
</ul>`,
    tags: ["decorators", "patterns", "performance"]
  },
  {
    id: "q_py_004", category: "Python", level: "junior",
    question: "Как бы вы обработали файл размером 50 ГБ, который не помещается в оперативную память?",
    answer: `Несколько подходов:<br><br>
<strong>1. Потоковое чтение (line by line)</strong>
<pre>with open('huge_file.csv') as f:
    for line in f:  # Python читает файл построчно — не загружает целиком
        process(line)</pre>

<strong>2. Pandas с chunksize</strong>
<pre>import pandas as pd

for chunk in pd.read_csv('huge.csv', chunksize=100_000):
    # chunk — DataFrame с 100K строк
    result = chunk.groupby('category')['amount'].sum()
    save_result(result)</pre>

<strong>3. Polars (lazy evaluation)</strong>
<pre>import polars as pl

df = pl.scan_csv('huge.csv')  # lazy — не читает сразу
result = (df
    .filter(pl.col('date') > '2024-01-01')
    .group_by('category')
    .agg(pl.col('amount').sum())
    .collect()  # только здесь читает и обрабатывает
)</pre>

<strong>4. PySpark (для действительно больших данных)</strong>
<pre>df = spark.read.csv('s3://bucket/huge.csv', header=True)
result = df.groupBy('category').agg(F.sum('amount'))</pre>

<strong>Правило:</strong> < 1GB → Pandas, 1-100GB → Polars/DuckDB, > 100GB → Spark`,
    tags: ["memory", "big_data", "performance"]
  },
  {
    id: "q_py_005", category: "Python", level: "junior",
    question: "Что такое *args и **kwargs?",
    answer: `<strong>*args</strong> — принимает любое количество позиционных аргументов как tuple.<br>
<strong>**kwargs</strong> — принимает любое количество именованных аргументов как dict.<br><br>
<pre>def flexible_func(*args, **kwargs):
    print(f"args: {args}")      # tuple
    print(f"kwargs: {kwargs}")  # dict

flexible_func(1, 2, 3, name="Alice", age=30)
# args: (1, 2, 3)
# kwargs: {'name': 'Alice', 'age': 30}

# Практический пример для DE: обёртка над API
def api_request(endpoint, *path_params, **query_params):
    url = f"/api/{endpoint}/{'/'.join(map(str, path_params))}"
    params = "&".join(f"{k}={v}" for k, v in query_params.items())
    return f"{url}?{params}"

api_request("users", 123, "orders", page=1, limit=50)
# /api/users/123/orders?page=1&limit=50</pre>`,
    tags: ["functions", "basics"]
  },

  // --- Python Middle ---
  {
    id: "q_py_006", category: "Python", level: "middle",
    question: "Объясните GIL (Global Interpreter Lock). Как он влияет на многопоточность?",
    answer: `<strong>GIL</strong> — Global Interpreter Lock. Мьютекс в CPython, который разрешает выполнять только один поток Python-кода одновременно.<br><br>
<strong>Последствия:</strong>
<ul>
<li>Многопоточность (threading) НЕ ускоряет CPU-bound задачи</li>
<li>Многопоточность УСКОРЯЕТ I/O-bound задачи (сеть, диск)</li>
</ul>

<strong>Что использовать:</strong>
<ul>
<li><strong>threading</strong> — для I/O-bound: HTTP запросы, чтение файлов, БД запросы</li>
<li><strong>multiprocessing</strong> — для CPU-bound: трансформация данных, вычисления</li>
<li><strong>asyncio</strong> — для высокой конкурентности I/O (тысячи соединений)</li>
<li><strong>concurrent.futures</strong> — высокоуровневый API для обоих</li>
</ul>

<pre>from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

# I/O-bound → threading
def fetch_data(url):
    return requests.get(url).json()

with ThreadPoolExecutor(max_workers=10) as pool:
    results = list(pool.map(fetch_data, urls))

# CPU-bound → multiprocessing
def transform(chunk):
    return heavy_computation(chunk)

with ProcessPoolExecutor() as pool:
    results = list(pool.map(transform, chunks))</pre>

<strong>Для DE:</strong> Используйте threading для параллельных API-вызовов, multiprocessing для тяжёлых трансформаций, а Spark/Dask — для реально больших данных.`,
    tags: ["gil", "multithreading", "concurrency"]
  },
  {
    id: "q_py_007", category: "Python", level: "middle",
    question: "Что такое context manager? Напишите свой",
    answer: `<strong>Context Manager</strong> — объект, управляющий ресурсами через <code>with</code>. Гарантирует корректное освобождение ресурсов (закрытие файлов, соединений) даже при ошибках.<br><br>
<pre># Стандартное использование
with open('file.txt') as f:  # __enter__ → открывает файл
    data = f.read()            
# __exit__ → закрывает файл (даже при exception)

# Свой context manager через класс
class DatabaseConnection:
    def __init__(self, connection_string):
        self.connection_string = connection_string
        self.conn = None
    
    def __enter__(self):
        self.conn = psycopg2.connect(self.connection_string)
        return self.conn
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type:
            self.conn.rollback()
        else:
            self.conn.commit()
        self.conn.close()
        return False  # не подавляем исключение

# Через декоратор (проще)
from contextlib import contextmanager

@contextmanager
def timer(label):
    start = time.time()
    yield  # тело блока with выполняется здесь
    print(f"{label}: {time.time() - start:.2f}s")

with timer("ETL pipeline"):
    extract()
    transform()
    load()</pre>`,
    tags: ["context_manager", "resource_management", "patterns"]
  },
  {
    id: "q_py_008", category: "Python", level: "middle",
    question: "Как работает pandas merge/join? Какие есть стратегии и подводные камни?",
    answer: `<strong>pd.merge()</strong> — аналог SQL JOIN для DataFrame.<br><br>
<pre>import pandas as pd

# Базовый merge
result = pd.merge(orders, customers, on='customer_id', how='left')

# Разные имена столбцов
result = pd.merge(orders, customers, 
    left_on='cust_id', right_on='customer_id', 
    how='inner')

# Multiple keys
result = pd.merge(df1, df2, on=['date', 'product_id'])</pre>

<strong>Подводные камни:</strong>
<ul>
<li><strong>Дубликаты ключей</strong> — merge создаёт декартово произведение для дубликатов (1:N → N строк)</li>
<li><strong>Суффиксы</strong> — одинаковые имена столбцов → _x, _y. Используйте <code>suffixes=('_left', '_right')</code></li>
<li><strong>Потребление памяти</strong> — merge может увеличить размер DataFrame в разы</li>
<li><strong>Тип данных</strong> — int vs float ключи (особенно при NaN в int столбце → автокаст в float)</li>
</ul>

<pre># Проверка на дубликаты перед merge
assert df1['id'].is_unique, "Дубликаты в левой таблице!"

# Валидация merge
result = pd.merge(df1, df2, on='id', how='left', 
    validate='one_to_one',    # 1:1 — бросит ошибку если нарушено
    indicator=True)           # добавит столбец _merge

# check merge quality
print(result['_merge'].value_counts())
# both          95000
# left_only      5000   ← 5000 строк не нашли пару
# right_only        0</pre>`,
    tags: ["pandas", "merge", "data_quality"]
  },

  // --- Python Senior ---
  {
    id: "q_py_009", category: "Python", level: "senior",
    question: "Как построить отказоустойчивый ETL-пайплайн на Python? Design patterns?",
    answer: `<strong>Ключевые паттерны для production ETL:</strong><br><br>
<strong>1. Retry с экспоненциальным backoff</strong>
<pre>from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=60),
    reraise=True
)
def extract_from_api(url):
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    return response.json()</pre>

<strong>2. Idempotency (идемпотентность)</strong>
<pre># Каждый запуск даёт одинаковый результат
def load_data(df, table, partition_date):
    # DELETE + INSERT вместо просто INSERT
    db.execute(f"DELETE FROM {table} WHERE date = '{partition_date}'")
    df.to_sql(table, db, if_exists='append')</pre>

<strong>3. Dead Letter Queue</strong>
<pre>def process_batch(records):
    success, failed = [], []
    for record in records:
        try:
            result = transform(record)
            success.append(result)
        except Exception as e:
            failed.append({"record": record, "error": str(e)})
    
    save_to_dlq(failed)  # сохранить ошибки для анализа
    return success</pre>

<strong>4. Checkpoint / State Management</strong>
<pre>def extract_incremental(table, state_file='state.json'):
    last_id = load_state(state_file).get('last_id', 0)
    new_data = db.query(f"SELECT * FROM {table} WHERE id > {last_id}")
    if new_data:
        save_state(state_file, {'last_id': new_data['id'].max()})
    return new_data</pre>

<strong>5. Structured Logging</strong>
<pre>import structlog
logger = structlog.get_logger()

logger.info("pipeline_started", 
    pipeline="daily_etl", 
    partition="2024-01-15",
    source_table="raw_events")</pre>`,
    tags: ["etl", "patterns", "production", "reliability"]
  },

  // ============================================
  // 3. Data Modeling & DWH — 30+ вопросов
  // ============================================

  {
    id: "q_dm_001", category: "Data Modeling", level: "junior",
    question: "Что такое нормализация? Объясните 1NF, 2NF, 3NF",
    answer: `<strong>Нормализация</strong> — процесс организации данных для минимизации избыточности и зависимостей.<br><br>
<strong>1NF (Первая нормальная форма):</strong>
<ul>
<li>Каждая ячейка содержит атомарное (неделимое) значение</li>
<li>Нет повторяющихся групп столбцов</li>
</ul>
❌ <code>phones: "123,456,789"</code> → ✅ отдельная таблица phone_numbers<br><br>

<strong>2NF (Вторая нормальная форма):</strong>
<ul>
<li>Удовлетворяет 1NF</li>
<li>Все неключевые атрибуты полностью зависят от всего первичного ключа (не от его части)</li>
</ul>
❌ PK=(order_id, product_id), но customer_name зависит только от order_id<br><br>

<strong>3NF (Третья нормальная форма):</strong>
<ul>
<li>Удовлетворяет 2NF</li>
<li>Нет транзитивных зависимостей (A → B → C)</li>
</ul>
❌ employee → department_id → department_name (department_name зависит от department_id, а не от employee)<br><br>

<strong>Для DE:</strong> OLTP-базы обычно в 3NF. DWH часто намеренно денормализованы (Star Schema) для скорости аналитических запросов.`,
    tags: ["normalization", "basics", "database_design"]
  },
  {
    id: "q_dm_002", category: "Data Modeling", level: "junior",
    question: "Что такое Star Schema и Snowflake Schema? Чем отличаются?",
    answer: `<strong>Star Schema (Звезда)</strong> — центральная таблица фактов (fact) окружена денормализованными таблицами измерений (dimension).<br>
<strong>Snowflake Schema (Снежинка)</strong> — как Star, но dimension-таблицы нормализованы (разделены на подтаблицы).<br><br>

<strong>Star Schema:</strong>
<pre>         dim_product (name, category, brand)
              ↓
dim_date → fact_sales ← dim_store (name, city, region)
              ↑
         dim_customer (name, segment)</pre>
✅ Быстрые запросы (меньше JOIN), ✅ Простота, ❌ Избыточность данных<br><br>

<strong>Snowflake Schema:</strong>
<pre>dim_brand → dim_product → fact_sales ← dim_store → dim_region → dim_country</pre>
✅ Нет избыточности, ❌ Больше JOIN (медленнее), ❌ Сложнее запросы<br><br>

<strong>Что выбрать:</strong>
<ul>
<li><strong>Star Schema</strong> — в 90% случаев для DWH. BigQuery, Redshift, Snowflake оптимизированы под неё</li>
<li><strong>Snowflake Schema</strong> — когда dimension очень большие и обновляются часто</li>
</ul>`,
    tags: ["star_schema", "snowflake_schema", "dwh"]
  },
  {
    id: "q_dm_003", category: "Data Modeling", level: "junior",
    question: "Что такое Fact и Dimension таблицы? Приведите примеры",
    answer: `<strong>Fact (Таблица фактов)</strong> — содержит измеримые события/транзакции (числа). Обычно очень большая.<br>
<strong>Dimension (Таблица измерений)</strong> — содержит описательные атрибуты (контекст). Обычно небольшая.<br><br>

<strong>Типы фактов:</strong>
<ul>
<li><strong>Transactional fact</strong> — одна строка = одно событие (покупка, клик)</li>
<li><strong>Periodic snapshot</strong> — состояние на момент времени (баланс на конец дня)</li>
<li><strong>Accumulating snapshot</strong> — жизненный цикл процесса (заказ: создан → оплачен → доставлен)</li>
</ul>

<strong>Пример e-commerce:</strong>
<pre>-- Fact table
fact_orders (
    order_id, date_key, customer_key, product_key,
    quantity,      -- мера
    unit_price,    -- мера
    total_amount,  -- мера
    discount       -- мера
)

-- Dimension tables
dim_date (date_key, date, month, quarter, year, day_of_week, is_holiday)
dim_customer (customer_key, name, email, city, segment, registration_date)
dim_product (product_key, name, category, brand, price_tier)</pre>

<strong>Правило grain:</strong> Определите зернистость (grain) fact-таблицы — "одна строка = что?" Это ПЕРВЫЙ шаг при проектировании.`,
    tags: ["fact_dimension", "dwh", "modeling"]
  },
  {
    id: "q_dm_004", category: "Data Modeling", level: "middle",
    question: "Что такое Data Vault 2.0? Когда использовать вместо Kimball?",
    answer: `<strong>Data Vault 2.0</strong> — методология моделирования DWH, оптимизированная для гибкости и аудируемости.<br><br>
<strong>Компоненты:</strong>
<ul>
<li><strong>Hub</strong> — бизнес-ключи (customer_id, order_number). Никогда не меняется</li>
<li><strong>Link</strong> — связи между Hub (customer ↔ order). Many-to-many</li>
<li><strong>Satellite</strong> — описательные атрибуты с историей (name, address с timestamp)</li>
</ul>

<strong>Data Vault vs Kimball (Star Schema):</strong>

| | Data Vault | Kimball |
|---|---|---|
| Гибкость | ✅ Легко добавлять источники | ❌ Изменения схемы сложны |
| Скорость запросов | ❌ Много JOIN | ✅ Оптимизирован для аналитики |
| Аудит/Lineage | ✅ Полная история | ❌ Ограничен (SCD) |
| Параллельная загрузка | ✅ Hub, Link, Sat независимы | ❌ Зависимости между таблицами |
| Сложность | ❌ Высокая | ✅ Интуитивная |

<strong>Когда Data Vault:</strong>
<ul>
<li>Много источников данных, которые часто меняются</li>
<li>Нужна полная аудируемость и lineage</li>
<li>Agile-разработка DWH</li>
</ul>

<strong>Когда Kimball:</strong>
<ul>
<li>Простые аналитические задачи</li>
<li>Быстрый старт</li>
<li>End-users пишут SQL</li>
</ul>

<strong>На практике:</strong> Часто Raw → Data Vault (хранение) → Star Schema (витрины/marts).`,
    tags: ["data_vault", "kimball", "modeling", "architecture"]
  },
  {
    id: "q_dm_005", category: "Data Modeling", level: "middle",
    question: "Что такое суррогатный ключ и зачем он нужен в DWH?",
    answer: `<strong>Суррогатный ключ (Surrogate Key)</strong> — искусственный, системно-генерируемый ключ (обычно auto-increment integer), не имеющий бизнес-смысла.<br><br>
<strong>Натуральный ключ (Natural Key)</strong> — ключ из бизнеса (email, SSN, order_number).<br><br>
<strong>Зачем суррогатный ключ в DWH:</strong>
<ul>
<li><strong>SCD Type 2</strong> — одному бизнес-ключу соответствует несколько записей (история). Суррогатный ключ уникально идентифицирует каждую версию</li>
<li><strong>Производительность</strong> — integer JOIN быстрее, чем varchar JOIN</li>
<li><strong>Независимость от источника</strong> — если источник поменяет формат ключа, DWH не сломается</li>
<li><strong>Множественные источники</strong> — разные системы могут иметь одинаковые ID</li>
</ul>
<pre>-- dim_customer с суррогатным ключом
customer_sk  | customer_id | name    | city      | valid_from | valid_to
1            | CUST-001    | Alice   | Moscow    | 2023-01-01 | 2024-03-14
2            | CUST-001    | Alice   | Berlin    | 2024-03-15 | 9999-12-31
3            | CUST-002    | Bob     | London    | 2023-06-01 | 9999-12-31

-- fact_orders ссылается на customer_sk, не на customer_id
fact_orders (order_sk, customer_sk, product_sk, amount, ...)</pre>`,
    tags: ["surrogate_key", "dwh", "scd"]
  },

  // ============================================
  // 4. Spark & Big Data — 30+ вопросов
  // ============================================
  {
    id: "q_spark_001", category: "Spark", level: "middle",
    question: "Чем отличается repartition() от coalesce() в Spark?",
    answer: `<strong>repartition(n)</strong> — перераспределяет данные на n партиций с полным shuffle.<br>
<strong>coalesce(n)</strong> — уменьшает количество партиций БЕЗ shuffle (объединяет соседние).<br><br>
<strong>Когда что:</strong>
<ul>
<li><code>coalesce(n)</code> — для уменьшения партиций (например, перед записью). Быстрее, т.к. нет shuffle</li>
<li><code>repartition(n)</code> — для увеличения партиций ИЛИ для равномерного распределения. Дороже из-за shuffle</li>
<li><code>repartition(n, col)</code> — перераспределить по ключу (для optimize joins)</li>
</ul>
<pre># 1000 партиций → 10 для записи
df.coalesce(10).write.parquet("output/")  # ✅ быстро, без shuffle

# 10 партиций → 100 для параллелизма
df.repartition(100).map(heavy_func)       # ✅ shuffle, но нужен

# перераспределить по ключу для join
df.repartition(200, "user_id")            # данные одного user_id → одна партиция</pre>

<strong>⚠️ Ловушка:</strong> <code>coalesce(1)</code> перед записью создаёт ОДИН файл — это плохо для больших данных (нет параллельного чтения).`,
    tags: ["repartition", "coalesce", "partitioning"]
  },
  {
    id: "q_spark_002", category: "Spark", level: "middle",
    question: "Что такое Lazy Evaluation в Spark? Почему это важно?",
    answer: `<strong>Lazy Evaluation</strong> — Spark не выполняет transformations немедленно. Он строит план выполнения (DAG) и выполняет его только при вызове action.<br><br>
<strong>Transformations (ленивые):</strong> filter, select, join, groupBy, map → строят план<br>
<strong>Actions (немедленные):</strong> collect, count, show, write, take → запускают выполнение<br><br>
<pre># Ничего не выполняется — только строится план
df = spark.read.parquet("huge_data/")     # lazy
filtered = df.filter(col("age") > 18)     # lazy
grouped = filtered.groupBy("city").count() # lazy

# Вот ЗДЕСЬ всё выполняется
grouped.show()  # action → запускает весь план</pre>

<strong>Почему это хорошо:</strong>
<ul>
<li><strong>Оптимизация:</strong> Catalyst optimizer может оптимизировать весь план целиком (pushdown predicates, reorder joins)</li>
<li><strong>Фьюжн:</strong> Spark объединяет несколько трансформаций в одну стадию (whole-stage code generation)</li>
<li><strong>Минимум I/O:</strong> Spark читает только нужные столбцы и партиции</li>
</ul>

<strong>Практический совет:</strong> Вызывайте actions как можно реже. Каждый action = новый запуск пайплайна.`,
    tags: ["lazy_evaluation", "dag", "optimization"]
  },
  {
    id: "q_spark_003", category: "Spark", level: "middle",
    question: "Что такое Data Skew в Spark и как с ним бороться?",
    answer: `<strong>Data Skew</strong> — неравномерное распределение данных по партициям. Один executor обрабатывает в 100x больше данных → bottleneck.<br><br>
<strong>Как обнаружить:</strong>
<ul>
<li>Spark UI → одна задача (task) работает в 10-100x дольше остальных</li>
<li>OOM на отдельных executor'ах</li>
<li><code>df.groupBy("key").count().orderBy(desc("count")).show()</code></li>
</ul>

<strong>Как бороться:</strong><br><br>
<strong>1. Salting (солирование ключа)</strong>
<pre>from pyspark.sql.functions import concat, lit, rand, floor

# Добавляем случайный суффикс к ключу
salt_num = 10
df_salted = df.withColumn("salted_key", 
    concat(col("skewed_key"), lit("_"), floor(rand() * salt_num).cast("int"))
)
# JOIN по salted_key, затем агрегация
</pre>

<strong>2. Broadcast Join (если одна таблица маленькая)</strong>
<pre>from pyspark.sql.functions import broadcast

result = big_df.join(broadcast(small_df), "key")  # маленькая таблица в память каждого executor</pre>

<strong>3. AQE (Adaptive Query Execution)</strong>
<pre># Spark 3.0+ автоматически оптимизирует skew
spark.conf.set("spark.sql.adaptive.enabled", "true")
spark.conf.set("spark.sql.adaptive.skewJoin.enabled", "true")</pre>

<strong>4. Repartition перед JOIN</strong>
<pre>df.repartition(200, "join_key")  # равномерное распределение</pre>`,
    tags: ["data_skew", "optimization", "join"]
  },
  {
    id: "q_spark_004", category: "Spark", level: "middle",
    question: "Объясните архитектуру Spark: Driver, Executor, Cluster Manager",
    answer: `<strong>Driver</strong> — главный процесс. Создаёт SparkContext, строит план выполнения (DAG), распределяет задачи по executor'ам, собирает результаты.<br><br>
<strong>Executor</strong> — рабочий процесс на узле кластера. Выполняет задачи (tasks), хранит данные в памяти/диске. Каждый executor имеет свою JVM.<br><br>
<strong>Cluster Manager</strong> — управляет ресурсами кластера (YARN, Mesos, Kubernetes, или Standalone).<br><br>
<pre>
┌─────────────────┐
│    Driver        │
│  SparkContext    │ ← строит DAG, планирует задачи
│  DAG Scheduler  │
│  Task Scheduler │
└────────┬────────┘
         │ распределяет tasks
    ┌────┴────┬──────────┐
┌───┴──┐ ┌───┴──┐  ┌───┴──┐
│ Exec │ │ Exec │  │ Exec │ ← выполняют tasks параллельно
│Task 1│ │Task 2│  │Task 3│
│Task 4│ │Task 5│  │Task 6│
│Cache │ │Cache │  │Cache │ ← хранят данные в памяти
└──────┘ └──────┘  └──────┘

Cluster Manager (YARN/K8s) — управляет ресурсами
</pre>

<strong>Ключевые параметры:</strong>
<ul>
<li><code>--num-executors</code> — кол-во executor'ов</li>
<li><code>--executor-memory</code> — RAM на executor</li>
<li><code>--executor-cores</code> — ядра CPU на executor</li>
<li><code>--driver-memory</code> — RAM для driver</li>
</ul>`,
    tags: ["architecture", "spark_core", "cluster"]
  },
  {
    id: "q_spark_005", category: "Spark", level: "senior",
    question: "Чем отличются Narrow и Wide transformations? Что такое Shuffle?",
    answer: `<strong>Narrow transformations</strong> — каждая input-партиция даёт ровно одну output-партицию. Данные НЕ перемещаются между executor'ами.<br>
Примеры: <code>map, filter, select, union</code><br><br>
<strong>Wide transformations</strong> — одна output-партиция зависит от НЕСКОЛЬКИХ input-партиций. Требуется <strong>shuffle</strong> (перемещение данных по сети).<br>
Примеры: <code>groupBy, join, repartition, distinct, orderBy</code><br><br>
<strong>Shuffle</strong> — перераспределение данных между executor'ами через сеть + диск. Это самая дорогая операция в Spark:<br>
<ul>
<li>Сериализация/десериализация данных</li>
<li>Запись на диск (shuffle files)</li>
<li>Передача по сети</li>
<li>Чтение и сортировка</li>
</ul>

<pre>
Narrow (без shuffle):          Wide (с shuffle):
Partition 1 → Partition 1     Partition 1 ──┐
Partition 2 → Partition 2     Partition 2 ──┼──→ Partition A
Partition 3 → Partition 3     Partition 3 ──┘    Partition B
</pre>

<strong>Как минимизировать shuffle:</strong>
<ul>
<li>Broadcast Join вместо Sort-Merge Join</li>
<li>Предварительная фильтрация перед wide-операциями</li>
<li>Bucketing (pre-shuffle on write)</li>
<li>reduceByKey вместо groupBy + agg (для RDD)</li>
</ul>`,
    tags: ["narrow_wide", "shuffle", "performance"]
  },

  // ============================================
  // 5. Airflow & Orchestration — 25+ вопросов
  // ============================================
  {
    id: "q_af_001", category: "Airflow", level: "middle",
    question: "Что такое DAG в Airflow? Почему важно, что граф ациклический?",
    answer: `<strong>DAG (Directed Acyclic Graph)</strong> — направленный ациклический граф задач в Airflow.<br><br>
<strong>Directed</strong> — у задач есть направление (task_A >> task_B означает A выполняется до B).<br>
<strong>Acyclic</strong> — нет циклов (A → B → C → A невозможно). Это гарантирует, что пайплайн завершится.<br><br>
<pre>from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime

with DAG(
    dag_id='daily_etl',
    start_date=datetime(2024, 1, 1),
    schedule_interval='@daily',
    catchup=False,
    default_args={'retries': 3, 'retry_delay': timedelta(minutes=5)}
) as dag:

    extract = PythonOperator(task_id='extract', python_callable=extract_fn)
    transform = PythonOperator(task_id='transform', python_callable=transform_fn)
    load = PythonOperator(task_id='load', python_callable=load_fn)
    
    extract >> transform >> load  # направление выполнения</pre>

<strong>Почему ацикличность важна:</strong>
<ul>
<li>Scheduler может определить порядок выполнения</li>
<li>Нет бесконечных зацикливаний</li>
<li>Можно безопасно делать retry и backfill</li>
</ul>`,
    tags: ["dag", "basics", "orchestration"]
  },
  {
    id: "q_af_002", category: "Airflow", level: "middle",
    question: "Что такое идемпотентность и почему она критична для data pipelines?",
    answer: `<strong>Идемпотентность</strong> — повторный запуск пайплайна с теми же входными данными даёт тот же результат, без побочных эффектов.<br><br>
<strong>Почему это критично:</strong>
<ul>
<li>Airflow может перезапустить task при сбое (retry)</li>
<li>Backfill — перегенерация данных за прошлые даты</li>
<li>Двойные запуски из-за сбоев scheduler'а</li>
</ul>

<strong>Как обеспечить:</strong>
<pre># ❌ НЕ идемпотентно — дубликаты при повторном запуске
INSERT INTO target SELECT * FROM source WHERE date = '{{ ds }}';

# ✅ Идемпотентно — DELETE + INSERT
DELETE FROM target WHERE date = '{{ ds }}';
INSERT INTO target SELECT * FROM source WHERE date = '{{ ds }}';

# ✅ Идемпотентно — MERGE / UPSERT
MERGE INTO target t
USING source s ON t.id = s.id AND t.date = '{{ ds }}'
WHEN MATCHED THEN UPDATE SET ...
WHEN NOT MATCHED THEN INSERT ...;

# ✅ Идемпотентно — перезаписать партицию
df.write.mode("overwrite").partitionBy("date").parquet("output/")</pre>

<strong>Правила:</strong>
<ul>
<li>Каждый запуск должен обрабатывать конкретный partition/date</li>
<li>Используйте DELETE+INSERT или MERGE вместо просто INSERT</li>
<li>Перед записью — очищайте целевую партицию</li>
</ul>`,
    tags: ["idempotency", "reliability", "best_practices"]
  },
  {
    id: "q_af_003", category: "Airflow", level: "middle",
    question: "Что такое XCom в Airflow? Когда его использовать и когда нет?",
    answer: `<strong>XCom (Cross-Communication)</strong> — механизм передачи небольших данных между tasks в Airflow.<br><br>
<pre>def extract(**context):
    data = fetch_from_api()
    total = len(data)
    context['ti'].xcom_push(key='record_count', value=total)
    return total  # return автоматически пушит в XCom

def transform(**context):
    count = context['ti'].xcom_pull(task_ids='extract', key='record_count')
    print(f"Processing {count} records")</pre>

<strong>Когда использовать:</strong>
<ul>
<li>Передача метаданных: количество записей, имя файла, статус</li>
<li>Передача маленьких значений (< 48KB)</li>
<li>Координация между tasks (branching, условия)</li>
</ul>

<strong>Когда НЕ использовать:</strong>
<ul>
<li>❌ Передача DataFrame, больших объёмов данных → используйте S3/GCS</li>
<li>❌ XCom хранится в metadata DB Airflow (Postgres) — большие данные убьют БД</li>
</ul>

<strong>Альтернатива для больших данных:</strong>
<pre>def extract(**context):
    data = fetch_large_dataset()
    path = f"s3://bucket/staging/{context['ds']}/data.parquet"
    data.to_parquet(path)
    return path  # передаём только путь через XCom

def transform(**context):
    path = context['ti'].xcom_pull(task_ids='extract')
    data = pd.read_parquet(path)  # читаем из S3</pre>`,
    tags: ["xcom", "task_communication", "best_practices"]
  },

  // ============================================
  // 6. System Design — 25+ вопросов
  // ============================================
  {
    id: "q_sd_001", category: "System Design", level: "senior",
    question: "Спроектируйте систему аналитики кликстрима (100M+ событий в день)",
    answer: `<strong>Требования:</strong> Обработка 100M+ событий/день, near-real-time дашборды, 30-дневное хранение raw данных, 1-год aggregated данных.<br><br>
<strong>Архитектура:</strong>
<pre>
[Web/Mobile] → [API Gateway] → [Kafka] → [Spark Streaming] → [Iceberg/Delta]
                                  ↓                              ↓
                           [Real-time agg]              [Batch processing]
                                  ↓                              ↓
                            [Redis/Druid]                [Data Warehouse]
                                  ↓                              ↓
                         [Real-time Dashboard]         [BI / Analytics]
</pre>

<strong>Компоненты:</strong>
<ul>
<li><strong>Ingestion:</strong> Kafka (3+ брокера, партиционирование по user_id, retention 7 дней)</li>
<li><strong>Stream Processing:</strong> Spark Structured Streaming или Flink — sessionization, windowed aggregations</li>
<li><strong>Storage:</strong> Apache Iceberg на S3 — поддержка schema evolution, time travel, partition pruning</li>
<li><strong>Serving:</strong> Druid/ClickHouse для real-time OLAP запросов</li>
<li><strong>Batch:</strong> Ежедневный Spark job для тяжёлых агрегаций → DWH</li>
</ul>

<strong>Ключевые решения:</strong>
<ul>
<li>Event-time vs Processing-time? → Event-time + watermark для late data</li>
<li>Exactly-once semantics? → Kafka + Spark checkpoint + идемпотентные writes</li>
<li>Schema evolution? → Iceberg / Schema Registry (Avro)</li>
<li>Cost optimization? → Hot/Warm/Cold storage tiers, partition by date</li>
</ul>`,
    tags: ["clickstream", "streaming", "architecture"]
  },
  {
    id: "q_sd_002", category: "System Design", level: "senior",
    question: "Batch vs Streaming — когда какой подход? Lambda vs Kappa архитектура?",
    answer: `<strong>Batch Processing:</strong>
<ul>
<li>Период: часы/дни</li>
<li>Use cases: ежедневные отчёты, ML training, full refresh DWH</li>
<li>Инструменты: Spark, Airflow, dbt</li>
<li>✅ Простота, отладка, воспроизводимость. ❌ Высокая задержка</li>
</ul>

<strong>Stream Processing:</strong>
<ul>
<li>Период: секунды/минуты</li>
<li>Use cases: fraud detection, real-time рекомендации, мониторинг</li>
<li>Инструменты: Kafka, Flink, Spark Streaming</li>
<li>✅ Низкая задержка. ❌ Сложность, state management, exactly-once трудно</li>
</ul>

<strong>Lambda Architecture:</strong>
<pre>
                    ┌─→ [Batch Layer] → [Batch View] ─┐
[Raw Data] → [Kafka] │                                  ├→ [Serving Layer]
                    └─→ [Speed Layer] → [RT View]    ─┘
</pre>
✅ Точные batch + быстрые streaming результаты. ❌ Дублирование логики в двух системах.<br><br>

<strong>Kappa Architecture:</strong>
<pre>
[Raw Data] → [Kafka] → [Stream Processor] → [Serving Layer]
</pre>
Всё через streaming. Для reprocessing — replay из Kafka. ✅ Одна codebase. ❌ Kafka хранение дорогое.

<strong>Что выбирать:</strong>
<ul>
<li><strong>Чистый Batch</strong> — если задержка в часы OK и данные обрабатываются пакетами</li>
<li><strong>Чистый Streaming</strong> — real-time requirements, event-driven архитектура</li>
<li><strong>Hybrid</strong> — streaming для real-time метрик + batch для reconciliation (самый частый на практике)</li>
</ul>`,
    tags: ["batch", "streaming", "lambda", "kappa", "architecture"]
  },
  {
    id: "q_sd_003", category: "System Design", level: "senior",
    question: "Что такое CAP-теорема? Как она применяется в data engineering?",
    answer: `<strong>CAP-теорема</strong> — в распределённой системе можно одновременно обеспечить только 2 из 3 свойств:<br><br>
<strong>C</strong>onsistency — все узлы видят одинаковые данные в один момент времени<br>
<strong>A</strong>vailability — каждый запрос получает ответ (не ошибку)<br>
<strong>P</strong>artition tolerance — система работает при сетевых разрывах между узлами<br><br>

<strong>Partition tolerance обязателен</strong> в распределённых системах → выбор между CP и AP:<br>
<ul>
<li><strong>CP (Consistency + Partition tolerance):</strong> HBase, MongoDB (default), Zookeeper. Может отказать в запросе, но данные всегда консистентны</li>
<li><strong>AP (Availability + Partition tolerance):</strong> Cassandra, DynamoDB, CouchDB. Всегда отвечает, но данные могут быть временно устаревшими (eventual consistency)</li>
</ul>

<strong>Для Data Engineering:</strong>
<ul>
<li><strong>OLTP (транзакции)</strong> → CP (PostgreSQL, MySQL) — важна consistency</li>
<li><strong>OLAP (аналитика)</strong> → допускается eventual consistency — данные могут быть с задержкой</li>
<li><strong>Kafka</strong> → AP-подобная (записи доступны сразу, но ISR обеспечивает durability)</li>
<li><strong>Data Warehouse</strong> → обычно не применяется напрямую (не распределённая в том же смысле)</li>
</ul>`,
    tags: ["cap_theorem", "distributed_systems", "theory"]
  },

  // ============================================
  // 7. Kafka & Streaming — 20+ вопросов
  // ============================================
  {
    id: "q_kafka_001", category: "Kafka", level: "middle",
    question: "Объясните архитектуру Kafka: Broker, Topic, Partition, Consumer Group",
    answer: `<strong>Kafka</strong> — распределённая платформа потоковой передачи данных.<br><br>
<strong>Broker</strong> — сервер Kafka. Кластер состоит из нескольких брокеров для отказоустойчивости.<br>
<strong>Topic</strong> — логическая категория сообщений (аналог таблицы). Например: "user_events", "orders".<br>
<strong>Partition</strong> — физическое разделение topic'а для параллелизма. Сообщения внутри партиции упорядочены.<br>
<strong>Consumer Group</strong> — группа потребителей, где каждая партиция читается только одним consumer'ом в группе.<br><br>
<pre>
Topic: user_events (3 partitions)
┌────────────┐  ┌────────────┐  ┌────────────┐
│Partition 0 │  │Partition 1 │  │Partition 2 │
│ msg0, msg3 │  │ msg1, msg4 │  │ msg2, msg5 │
│ msg6, msg9 │  │ msg7, msg10│  │ msg8, msg11│
└─────┬──────┘  └─────┬──────┘  └─────┬──────┘
      │               │               │
Consumer Group "analytics":
      ↓               ↓               ↓
  Consumer A      Consumer B      Consumer C
</pre>

<strong>Ключевые моменты:</strong>
<ul>
<li>Порядок гарантирован ТОЛЬКО внутри одной партиции</li>
<li>Кол-во consumers в группе ≤ кол-во партиций</li>
<li>Разные Consumer Groups читают одни и те же данные независимо</li>
<li>Replication factor = кол-во копий партиции на разных брокерах</li>
</ul>`,
    tags: ["architecture", "basics", "messaging"]
  },
  {
    id: "q_kafka_002", category: "Kafka", level: "middle",
    question: "Что такое Offset в Kafka? Как обеспечить exactly-once semantics?",
    answer: `<strong>Offset</strong> — уникальный порядковый номер каждого сообщения внутти партиции. Consumer отслеживает свой offset (позицию чтения).<br><br>
<strong>Три гарантии доставки:</strong>
<ul>
<li><strong>At-most-once</strong>: commit offset ДО обработки. Если consumer падает, сообщение потеряно</li>
<li><strong>At-least-once</strong>: commit offset ПОСЛЕ обработки. Если consumer падает, сообщение обработается повторно (дубликат)</li>
<li><strong>Exactly-once</strong>: каждое сообщение обработано ровно один раз. Самая сложная гарантия</li>
</ul>

<strong>Exactly-once в Kafka:</strong>
<pre># Producer: idempotent + transactional
properties = {
    'enable.idempotence': True,       # Kafka дедуплицирует записи
    'transactional.id': 'my-app-001'  # Транзакционный ID
}

producer.init_transactions()
producer.begin_transaction()
producer.send('output-topic', value=result)
producer.send_offsets_to_transaction(offset, group_id)
producer.commit_transaction()</pre>

<strong>На практике:</strong> Exactly-once между Kafka → Kafka работает хорошо. Kafka → внешняя система (БД) — нужна идемпотентность на стороне consumer'а (UPSERT вместо INSERT).`,
    tags: ["offset", "exactly_once", "delivery_semantics"]
  },
  {
    id: "q_kafka_003", category: "Kafka", level: "senior",
    question: "Что такое CDC (Change Data Capture)? Как реализовать с Debezium?",
    answer: `<strong>CDC (Change Data Capture)</strong> — отслеживание изменений в базе данных (INSERT, UPDATE, DELETE) и передача их в streaming-систему в реальном времени.<br><br>
<strong>Зачем:</strong>
<ul>
<li>Синхронизация OLTP → DWH без полного сканирования</li>
<li>Real-time обновление downstream систем</li>
<li>Event-Driven Architecture</li>
</ul>

<strong>Debezium</strong> — open-source CDC platform, работает как Kafka Connector:<br>
<pre>
PostgreSQL (WAL log) → Debezium → Kafka → [Spark/Flink/Consumer] → DWH

-- Debezium читает WAL (Write-Ahead Log) PostgreSQL
-- Каждое изменение становится событием в Kafka
</pre>

<strong>Пример события Debezium:</strong>
<pre>{
  "op": "u",  // "c"=create, "u"=update, "d"=delete
  "before": {"id": 1, "name": "Alice", "city": "Moscow"},
  "after":  {"id": 1, "name": "Alice", "city": "Berlin"},
  "source": {
    "db": "mydb", "table": "customers",
    "ts_ms": 1706000000000
  }
}</pre>

<strong>Преимущества CDC vs полное сканирование:</strong>
<ul>
<li>Не нагружает source DB</li>
<li>Захватывает DELETE (которые batch не поймает)</li>
<li>Near-real-time (задержка секунды)</li>
<li>Полная история изменений (для SCD Type 2)</li>
</ul>`,
    tags: ["cdc", "debezium", "replication", "streaming"]
  },

  // ============================================
  // 8. DevOps & Cloud — 20+ вопросов
  // ============================================
  {
    id: "q_devops_001", category: "DevOps", level: "middle",
    question: "Что такое Docker? Чем контейнер отличается от виртуальной машины?",
    answer: `<strong>Docker</strong> — платформа для контейнеризации приложений. Контейнер = изолированная среда выполнения с приложением и всеми зависимостями.<br><br>
<strong>Контейнер vs VM:</strong>

| | Контейнер | VM |
|---|---|---|
| Изоляция | На уровне процесса (namespace) | Полная (свой ядро ОС) |
| Размер | МБ | ГБ |
| Запуск | Секунды | Минуты |
| Overhead | Минимальный | Значительный |
| ОС | Общее ядро хоста | Своё ядро |

<pre># Dockerfile для Python ETL-скрипта
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
CMD ["python", "etl.py"]</pre>

<strong>Для Data Engineering:</strong>
<ul>
<li>Изоляция окружений (Python версии, зависимости)</li>
<li>Воспроизводимость — "работает на моей машине" → работает везде</li>
<li>Docker Compose для локального стека (Postgres + Airflow + Spark)</li>
<li>Kubernetes для production orchestration</li>
</ul>`,
    tags: ["docker", "containers", "basics"]
  },
  {
    id: "q_devops_002", category: "DevOps", level: "middle",
    question: "Что такое Terraform? Зачем Infrastructure as Code в data engineering?",
    answer: `<strong>Terraform</strong> — инструмент Infrastructure as Code (IaC). Описываете инфраструктуру в HCL-файлах, Terraform создаёт/обновляет/удаляет ресурсы.<br><br>
<strong>Зачем для DE:</strong>
<ul>
<li>Воспроизводимость — вся инфраструктура описана в коде, хранится в Git</li>
<li>Ревью — инфраструктурные изменения проходят code review</li>
<li>Масштабирование — легко создать staging/production окружения</li>
<li>Документация — код = документация</li>
</ul>

<pre># main.tf — S3 bucket + IAM для data pipeline
resource "aws_s3_bucket" "data_lake" {
  bucket = "company-data-lake-prod"
  
  tags = {
    Environment = "production"
    Team        = "data-engineering"
  }
}

resource "aws_iam_role" "etl_role" {
  name = "etl-pipeline-role"
  
  assume_role_policy = jsonencode({
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "glue.amazonaws.com" }
    }]
  })
}

# terraform plan → показывает что будет создано/изменено
# terraform apply → создаёт ресурсы</pre>

<strong>Best practices:</strong> remote state (S3 + DynamoDB lock), modules для переиспользования, workspaces для environments.`,
    tags: ["terraform", "iac", "cloud", "infrastructure"]
  },
  {
    id: "q_devops_003", category: "DevOps", level: "senior",
    question: "Как организовать CI/CD для data pipelines?",
    answer: `<strong>CI/CD для data pipelines</strong> отличается от web-приложений — нужно тестировать данные и схемы, а не только код.<br><br>
<strong>Что тестировать:</strong>
<ul>
<li><strong>Unit tests</strong> — Python-функции трансформации (pytest)</li>
<li><strong>Schema tests</strong> — dbt tests (not_null, unique, relationships)</li>
<li><strong>Data quality tests</strong> — Great Expectations (диапазоны, распределения)</li>
<li><strong>Integration tests</strong> — end-to-end на тестовых данных</li>
<li><strong>Contract tests</strong> — совпадение ожидаемой и фактической схемы</li>
</ul>

<pre># .github/workflows/data-pipeline.yml
name: Data Pipeline CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install -r requirements.txt
      - run: pytest tests/ -v
      
  dbt-test:
    runs-on: ubuntu-latest
    steps:
      - run: dbt deps
      - run: dbt build --select state:modified+ --defer
      - run: dbt test

  deploy:
    needs: [test, dbt-test]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: dbt run --target production</pre>

<strong>Blue-Green для data:</strong> Пишем в staging-схему → проверяем → переключаем view/alias на staging → staging становится production.`,
    tags: ["ci_cd", "testing", "devops", "dbt"]
  },

  // ============================================
  // Additional questions to reach 200+
  // ============================================

  // More SQL
  {
    id: "q_sql_019", category: "SQL", level: "junior",
    question: "Что такое CASE WHEN и как его использовать?",
    answer: `<strong>CASE WHEN</strong> — условное выражение в SQL (аналог if-else):<br><br>
<pre>SELECT 
    name,
    salary,
    CASE 
        WHEN salary >= 100000 THEN 'Senior'
        WHEN salary >= 60000 THEN 'Middle'
        WHEN salary >= 30000 THEN 'Junior'
        ELSE 'Intern'
    END as level
FROM employees;

-- В агрегациях (pivot-подобный запрос)
SELECT 
    department,
    COUNT(CASE WHEN gender = 'M' THEN 1 END) as males,
    COUNT(CASE WHEN gender = 'F' THEN 1 END) as females,
    SUM(CASE WHEN is_active THEN salary ELSE 0 END) as active_salary_total
FROM employees
GROUP BY department;</pre>`,
    tags: ["case_when", "conditionals", "basics"]
  },
  {
    id: "q_sql_020", category: "SQL", level: "middle",
    question: "Как найти дубликаты в таблице и удалить их, оставив одну запись?",
    answer: `<strong>Найти дубликаты:</strong>
<pre>-- Способ 1: GROUP BY + HAVING
SELECT email, COUNT(*) as cnt
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- Способ 2: Оконная функция (показывает конкретные строки)
SELECT * FROM (
    SELECT *, ROW_NUMBER() OVER (
        PARTITION BY email ORDER BY id
    ) as rn
    FROM users
) t WHERE rn > 1;  -- дубликаты (rn > 1)</pre>

<strong>Удалить дубликаты, оставив одну:</strong>
<pre>-- PostgreSQL
DELETE FROM users
WHERE id NOT IN (
    SELECT MIN(id) FROM users GROUP BY email
);

-- Или через CTE
WITH ranked AS (
    SELECT id, ROW_NUMBER() OVER (
        PARTITION BY email ORDER BY id  -- оставляем с минимальным id
    ) as rn
    FROM users
)
DELETE FROM users WHERE id IN (
    SELECT id FROM ranked WHERE rn > 1
);</pre>
<strong>Для DE:</strong> Дедупликация — одна из самых частых задач в ETL-пайплайнах.`,
    tags: ["deduplication", "window_functions", "etl"]
  },
  {
    id: "q_sql_021", category: "SQL", level: "junior",
    question: "Что такое Self JOIN? Приведите пример",
    answer: `<strong>Self JOIN</strong> — соединение таблицы с самой собой. Используется когда нужно сравнить строки внутри одной таблицы.<br><br>
<pre>-- Пример: найти менеджера для каждого сотрудника
-- Таблица employees: id, name, manager_id

SELECT 
    e.name as employee,
    m.name as manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;

-- Пример: найти сотрудников с одинаковой зарплатой
SELECT e1.name, e2.name, e1.salary
FROM employees e1
JOIN employees e2 ON e1.salary = e2.salary AND e1.id < e2.id;
-- e1.id < e2.id чтобы не получить пару (Alice, Bob) и (Bob, Alice)</pre>`,
    tags: ["self_join", "joins", "patterns"]
  },

  // More Python
  {
    id: "q_py_010", category: "Python", level: "junior",
    question: "Чем отличается deepcopy от copy? Когда это важно?",
    answer: `<strong>copy (shallow copy)</strong> — копирует объект, но вложенные объекты остаются ссылками на оригиналы.<br>
<strong>deepcopy</strong> — копирует объект и все вложенные объекты рекурсивно.<br><br>
<pre>import copy

original = {'a': [1, 2, 3], 'b': {'x': 10}}

# Shallow copy
shallow = copy.copy(original)
shallow['a'].append(4)
print(original['a'])  # [1, 2, 3, 4] ← оригинал изменился!

# Deep copy  
deep = copy.deepcopy(original)
deep['a'].append(5)
print(original['a'])  # [1, 2, 3, 4] ← оригинал НЕ изменился</pre>

<strong>Для DE:</strong> Важно при работе с конфигурациями, шаблонами запросов, маппингами — shallow copy может привести к неожиданным мутациям.`,
    tags: ["copy", "memory", "gotchas"]
  },
  {
    id: "q_py_011", category: "Python", level: "middle",
    question: "Что такое dataclass? Чем лучше обычного класса для датаинженерии?",
    answer: `<strong>dataclass</strong> (Python 3.7+) — декоратор, автоматически генерирующий __init__, __repr__, __eq__ и другие методы.<br><br>
<pre>from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional

@dataclass
class PipelineConfig:
    source_table: str
    target_table: str
    batch_size: int = 10000
    start_date: Optional[str] = None
    created_at: datetime = field(default_factory=datetime.now)
    
    def get_query(self) -> str:
        q = f"SELECT * FROM {self.source_table}"
        if self.start_date:
            q += f" WHERE date >= '{self.start_date}'"
        return q

# Использование
config = PipelineConfig(
    source_table="raw.events",
    target_table="analytics.events_clean",
    start_date="2024-01-01"
)
print(config)  # PipelineConfig(source_table='raw.events', ...)
print(config.get_query())</pre>

<strong>Преимущества для DE:</strong>
<ul>
<li>Типизированные конфигурации pipeline'ов</li>
<li>Автоматический __eq__ для сравнения записей</li>
<li>frozen=True для immutable объектов</li>
<li>Замена dict для структурированных данных</li>
</ul>`,
    tags: ["dataclass", "typing", "patterns"]
  },

  // More Spark
  {
    id: "q_spark_006", category: "Spark", level: "senior",
    question: "Что такое Catalyst Optimizer в Spark? Как он оптимизирует запросы?",
    answer: `<strong>Catalyst</strong> — оптимизатор запросов в Spark SQL. Трансформирует логический план в оптимальный физический план выполнения.<br><br>
<strong>Этапы:</strong>
<ol>
<li><strong>Parsing</strong> → Abstract Syntax Tree (AST)</li>
<li><strong>Analysis</strong> → разрешение имён столбцов, таблиц, типов</li>
<li><strong>Logical Optimization</strong> → применение правил оптимизации</li>
<li><strong>Physical Planning</strong> → выбор стратегии выполнения</li>
<li><strong>Code Generation</strong> → Whole-Stage CodeGen (Java bytecode)</li>
</ol>

<strong>Оптимизации:</strong>
<ul>
<li><strong>Predicate Pushdown</strong> — фильтры спускаются ближе к источнику</li>
<li><strong>Column Pruning</strong> — читаются только нужные столбцы</li>
<li><strong>Constant Folding</strong> — вычисление константных выражений заранее</li>
<li><strong>Join Reordering</strong> — мелкие таблицы присоединяются первыми</li>
<li><strong>Broadcast Hash Join</strong> — автоматический broadcast для маленьких таблиц</li>
</ul>

<pre># Посмотреть план оптимизации
df.explain(True)  # показывает все 4 плана:
# == Parsed Logical Plan ==
# == Analyzed Logical Plan ==  
# == Optimized Logical Plan ==  ← здесь результат Catalyst
# == Physical Plan ==</pre>`,
    tags: ["catalyst", "optimization", "internals"]
  },

  // More Airflow
  {
    id: "q_af_004", category: "Airflow", level: "middle",
    question: "Чем отличается Operator от Sensor в Airflow?",
    answer: `<strong>Operator</strong> — выполняет действие (запускает скрипт, SQL запрос, API вызов). Активная задача.<br>
<strong>Sensor</strong> — ждёт наступления условия (появление файла, завершение другого DAG). Пассивная задача.<br><br>
<pre>from airflow.operators.python import PythonOperator
from airflow.sensors.filesystem import FileSensor
from airflow.sensors.external_task import ExternalTaskSensor

# Operator — делает работу
transform = PythonOperator(
    task_id='transform_data',
    python_callable=transform_fn
)

# Sensor — ждёт файл
wait_for_file = FileSensor(
    task_id='wait_for_csv',
    filepath='/data/input/daily_export.csv',
    poke_interval=300,    # проверять каждые 5 минут
    timeout=3600,         # таймаут 1 час
    mode='reschedule'     # освобождает slot между проверками
)

# Sensor — ждёт другой DAG
wait_for_upstream = ExternalTaskSensor(
    task_id='wait_for_upstream_dag',
    external_dag_id='upstream_etl',
    external_task_id='final_task',
    mode='reschedule'
)

wait_for_file >> transform</pre>

<strong>mode='reschedule'</strong> vs <strong>mode='poke'</strong>: reschedule освобождает worker slot между проверками (рекомендуется), poke занимает slot постоянно.`,
    tags: ["operator", "sensor", "dag"]
  },
  {
    id: "q_af_005", category: "Airflow", level: "senior",
    question: "Как отлаживать задачу, которая работает локально, но падает в Airflow?",
    answer: `<strong>Частые причины и подходы:</strong><br><br>
<strong>1. Различия окружений</strong>
<ul>
<li>Проверить версии Python и библиотек в Airflow worker vs locальная машина</li>
<li>Переменные окружения: <code>printenv</code> в BashOperator</li>
<li>Файловая система: paths различаются (локальный vs Docker/K8s)</li>
</ul>

<strong>2. Проблемы с подключениями</strong>
<ul>
<li>Connections в Airflow UI vs локальный .env</li>
<li>Network: worker может не иметь доступа к внутренним сервисам</li>
<li>Airflow CLI: <code>airflow connections get my-postgres</code></li>
</ul>

<strong>3. Память и ресурсы</strong>
<ul>
<li>Worker может иметь ограниченную RAM</li>
<li>Проверить limits в K8s/Docker</li>
</ul>

<strong>4. Инструменты отладки</strong>
<pre># Запустить задачу напрямую
airflow tasks test my_dag my_task 2024-01-15

# Посмотреть логи
airflow tasks logs my_dag my_task 2024-01-15

# Проверить переменные
airflow variables get my_var

# Запустить Python в контексте Airflow
airflow dags test my_dag 2024-01-15</pre>

<strong>5. Best Practices</strong>
<ul>
<li>Всегда логировать: <code>logging.info(f"Processing {len(data)} rows")</code></li>
<li>Разделять бизнес-логику и Airflow-код (testable functions)</li>
<li>Dockerized тесты: запускать DAG в локальном Docker Compose</li>
</ul>`,
    tags: ["debugging", "production", "troubleshooting"]
  },

  // More Data Modeling
  {
    id: "q_dm_006", category: "Data Modeling", level: "senior",
    question: "Что такое Medallion Architecture (Bronze/Silver/Gold)?",
    answer: `<strong>Medallion Architecture</strong> — многоуровневая архитектура данных в Lakehouse:<br><br>
<strong>Bronze (Raw)</strong> — "как есть" из источника
<ul>
<li>Сырые данные без трансформаций</li>
<li>Append-only (все данные сохраняются)</li>
<li>Schema-on-read</li>
</ul>

<strong>Silver (Cleaned)</strong> — очищенные и обогащённые данные
<ul>
<li>Дедупликация, валидация, типизация</li>
<li>Стандартизированные схемы</li>
<li>JOIN между источниками</li>
</ul>

<strong>Gold (Business)</strong> — бизнес-агрегации и витрины
<ul>
<li>KPI, отчёты, метрики</li>
<li>Денормализованные для быстрых запросов</li>
<li>Готовы для BI-инструментов</li>
</ul>

<pre>
[Source Systems] → Bronze → Silver → Gold → [BI / ML / API]

Bronze: raw_orders, raw_customers (JSON/Parquet, as-is)
Silver: clean_orders, clean_customers (typed, deduped, joined)
Gold:   daily_revenue, customer_ltv, product_performance
</pre>

<strong>Инструменты:</strong> Delta Lake / Apache Iceberg для versioning на каждом слое, dbt для трансформаций Silver → Gold.`,
    tags: ["medallion", "lakehouse", "architecture", "data_quality"]
  },

  // More Kafka/Streaming
  {
    id: "q_kafka_004", category: "Kafka", level: "senior",
    question: "Что такое Schema Registry и зачем он нужен?",
    answer: `<strong>Schema Registry</strong> — централизованное хранилище схем данных (Avro, Protobuf, JSON Schema) для Kafka сообщений.<br><br>
<strong>Зачем:</strong>
<ul>
<li><strong>Schema Evolution</strong> — безопасное изменение схемы (добавление/удаление полей) без поломки consumers</li>
<li><strong>Валидация</strong> — producer не может отправить сообщение, нарушающее схему</li>
<li><strong>Компактность</strong> — ID схемы вместо полной схемы в каждом сообщении</li>
<li><strong>Документация</strong> — единый источник правды о форматах данных</li>
</ul>

<strong>Compatibility modes:</strong>
<ul>
<li><strong>BACKWARD</strong> — новая схема может читать данные старой (можно удалять поля, добавлять с default)</li>
<li><strong>FORWARD</strong> — старая схема может читать данные новой</li>
<li><strong>FULL</strong> — и backward, и forward совместимость</li>
<li><strong>NONE</strong> — без проверок (не рекомендуется)</li>
</ul>

<pre># Python producer с Avro + Schema Registry
from confluent_kafka.avro import AvroProducer

schema_str = """
{
    "type": "record",
    "name": "UserEvent",
    "fields": [
        {"name": "user_id", "type": "int"},
        {"name": "event_type", "type": "string"},
        {"name": "timestamp", "type": "long"},
        {"name": "metadata", "type": ["null", "string"], "default": null}
    ]
}
"""
producer = AvroProducer({
    'bootstrap.servers': 'localhost:9092',
    'schema.registry.url': 'http://localhost:8081'
}, default_value_schema=schema)</pre>`,
    tags: ["schema_registry", "avro", "schema_evolution"]
  },

  // More DevOps
  {
    id: "q_devops_004", category: "DevOps", level: "middle",
    question: "Что такое Docker Compose и зачем он нужен Data Engineer'у?",
    answer: `<strong>Docker Compose</strong> — инструмент для определения и запуска multi-container Docker приложений через один YAML-файл.<br><br>
<strong>Для DE:</strong> Локальная разработка с полным стеком (БД, Airflow, Kafka, Spark).<br><br>
<pre># docker-compose.yml — локальный стек
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: analytics
      POSTGRES_PASSWORD: secret
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  airflow:
    image: apache/airflow:2.8.0
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      AIRFLOW__DATABASE__SQL_ALCHEMY_CONN: postgresql+psycopg2://postgres:secret@postgres/airflow
    volumes:
      - ./dags:/opt/airflow/dags
    ports:
      - "8080:8080"

  pgadmin:
    image: dpage/pgadmin4
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"

volumes:
  pgdata:</pre>

<code>docker compose up -d</code> → весь стек готов за 30 секунд.`,
    tags: ["docker_compose", "local_dev", "infrastructure"]
  },

  // More Python
  {
    id: "q_py_012", category: "Python", level: "junior",
    question: "Что такое виртуальное окружение (venv) и зачем оно нужно?",
    answer: `<strong>Virtual Environment (venv)</strong> — изолированная среда Python с собственным набором пакетов, независимая от системного Python.<br><br>
<strong>Зачем:</strong>
<ul>
<li>Разные проекты → разные версии библиотек (pandas 1.x vs 2.x)</li>
<li>Воспроизводимость — точный набор зависимостей через requirements.txt</li>
<li>Изоляция — установка пакетов не влияет на другие проекты</li>
</ul>

<pre># Создание и активация
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
.venv\\Scripts\\activate     # Windows

# Установка пакетов
pip install pandas==2.1.0 sqlalchemy

# Сохранение зависимостей
pip freeze > requirements.txt

# Восстановление на другой машине
pip install -r requirements.txt</pre>

<strong>Альтернативы:</strong>
<ul>
<li><strong>Poetry</strong> — управление зависимостями + lock file</li>
<li><strong>pipenv</strong> — Pipfile + Pipfile.lock</li>
<li><strong>conda</strong> — для ML/data science (управляет не только Python пакетами)</li>
</ul>`,
    tags: ["venv", "dependencies", "basics"]
  },

  // More SQL advanced
  {
    id: "q_sql_022", category: "SQL", level: "senior",
    question: "Что такое оконная рамка (Window Frame)? Объясните ROWS vs RANGE",
    answer: `<strong>Window Frame</strong> — определяет набор строк для вычисления оконной функции относительно текущей строки.<br><br>
<strong>ROWS</strong> — физические строки (по позиции).<br>
<strong>RANGE</strong> — логический диапазон (по значению).<br><br>
<pre>-- ROWS: точное количество строк
SUM(amount) OVER (
    ORDER BY date
    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
)  -- текущая + 2 предыдущие строки (всегда ровно 3)

-- RANGE: по значению (может включать разное кол-во строк)
SUM(amount) OVER (
    ORDER BY date
    RANGE BETWEEN INTERVAL '7 days' PRECEDING AND CURRENT ROW
)  -- все строки за последние 7 дней

-- Скользящее среднее за 7 дней
AVG(revenue) OVER (
    ORDER BY date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
) as moving_avg_7d</pre>

<strong>По умолчанию:</strong>
<ul>
<li>Без ORDER BY: <code>ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING</code> (вся партиция)</li>
<li>С ORDER BY: <code>RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code></li>
</ul>
<strong>⚠️</strong> RANGE с ORDER BY по умолчанию включает все строки с таким же значением → может дать неожиданный результат с дубликатами.`,
    tags: ["window_frame", "rows_range", "advanced"]
  },

  // More System Design
  {
    id: "q_sd_004", category: "System Design", level: "senior",
    question: "Как обработать late-arriving data в streaming-пайплайне?",
    answer: `<strong>Late-arriving data</strong> — данные, которые приходят после закрытия окна обработки (event time vs processing time).<br><br>
<strong>Стратегии:</strong><br>
<strong>1. Watermark</strong>
<pre># Spark Structured Streaming
df.withWatermark("event_time", "10 minutes")
  .groupBy(
      window("event_time", "5 minutes"),
      "category"
  ).agg(count("*"))
# Данные с event_time на 10+ минут позже watermark будут отброшены</pre>

<strong>2. Side Output (Flink)</strong>
<ul>
<li>Основной поток — данные в окне</li>
<li>Side output — опоздавшие данные → отдельная обработка</li>
</ul>

<strong>3. Batch Reconciliation (Lambda)</strong>
<ul>
<li>Streaming: быстрые, приблизительные результаты</li>
<li>Batch (ежечасно/ежедневно): точные, включая опоздавшие данные</li>
<li>Batch перезаписывает streaming-результаты</li>
</ul>

<strong>4. Допустимое окно (Allowed Lateness)</strong>
<pre># Flink: обновить результат окна при получении поздних данных
.allowedLateness(Time.minutes(30))
// Окно не закрывается 30 минут после watermark
// Поздние данные вызывают повторное вычисление</pre>

<strong>На собесе:</strong> "Какую задержку мы можем допустить?" → Определяет watermark. "Нужна ли точность 100%?" → Если да, нужен batch reconciliation.`,
    tags: ["late_data", "watermark", "streaming", "architecture"]
  },

  // ETL vs ELT
  {
    id: "q_dm_007", category: "Data Modeling", level: "junior",
    question: "Чем отличается ETL от ELT? Когда какой подход использовать?",
    answer: `<strong>ETL (Extract, Transform, Load):</strong>
<ul>
<li>Данные трансформируются ДО загрузки в хранилище</li>
<li>Трансформация на сервере ETL (Informatica, Talend, Python)</li>
<li>Традиционный подход для on-premise DWH</li>
</ul>

<strong>ELT (Extract, Load, Transform):</strong>
<ul>
<li>Данные загружаются в хранилище "как есть", трансформируются ВНУТРИ</li>
<li>Трансформация SQL-запросами (dbt, Snowflake, BigQuery)</li>
<li>Современный подход для cloud DWH</li>
</ul>

| | ETL | ELT |
|---|---|---|
| Где трансформация | Внешний сервер | В хранилище |
| Скорость загрузки | Медленнее (трансформация до загрузки) | Быстрее (грузим raw) |
| Масштабируемость | Ограничена ресурсами ETL-сервера | Масштабируется с DWH |
| Хранение raw данных | Часто теряются | Сохраняются |
| Инструменты | Informatica, SSIS, Python | dbt, SQL, Snowflake |

<strong>Современный тренд:</strong> ELT + dbt для SQL-трансформаций в cloud warehouse. Raw → Staging → Marts.`,
    tags: ["etl", "elt", "data_integration"]
  },

  // File formats
  {
    id: "q_spark_007", category: "Spark", level: "middle",
    question: "Чем отличаются форматы Parquet, ORC, Avro и CSV?",
    answer: `| Формат | Тип | Сжатие | Schema | Use Case |
|---|---|---|---|---|
| **CSV** | Row | Нет | Нет | Обмен данными, debug |
| **JSON** | Row | Нет | Нет | API, логи |
| **Avro** | Row | Хорошее | Встроена | Kafka, streaming |
| **Parquet** | Columnar | Отличное | Встроена | Аналитика, DWH |
| **ORC** | Columnar | Отличное | Встроена | Hive ecosystem |

<strong>Columnar vs Row:</strong>
<ul>
<li><strong>Row (CSV, Avro)</strong> — быстрая запись, чтение всех столбцов. Для OLTP, streaming</li>
<li><strong>Columnar (Parquet, ORC)</strong> — быстрое чтение выбранных столбцов, лучшее сжатие. Для OLAP, аналитика</li>
</ul>

<strong>Почему Parquet — стандарт для DE:</strong>
<ul>
<li>Column pruning: читает только запрошенные столбцы</li>
<li>Predicate pushdown: фильтрация на уровне file/row group</li>
<li>Сжатие: 10x меньше CSV (Snappy, ZSTD, Gzip)</li>
<li>Schema: хранит типы данных</li>
<li>Совместимость: Spark, Pandas, Snowflake, BigQuery, Athena</li>
</ul>

<pre># Pandas → Parquet
df.to_parquet('output.parquet', compression='snappy')

# Spark: Parquet с партиционированием
df.write.partitionBy('date', 'region').parquet('s3://data-lake/events/')</pre>`,
    tags: ["parquet", "avro", "file_formats", "storage"]
  },

  // More Python senior
  {
    id: "q_py_013", category: "Python", level: "senior",
    question: "Как тестировать data pipelines? Unit tests vs Integration tests?",
    answer: `<strong>Пирамида тестирования для data engineering:</strong><br><br>
<strong>1. Unit Tests (много, быстрые)</strong>
<pre>import pytest
import pandas as pd
from pipeline import clean_data, calculate_metrics

def test_clean_data_removes_nulls():
    df = pd.DataFrame({'id': [1, 2, None], 'name': ['a', None, 'c']})
    result = clean_data(df, required_cols=['id'])
    assert len(result) == 2
    assert result['id'].notna().all()

def test_calculate_metrics():
    df = pd.DataFrame({'amount': [100, 200, 300]})
    metrics = calculate_metrics(df)
    assert metrics['total'] == 600
    assert metrics['average'] == 200</pre>

<strong>2. Contract Tests (схема данных)</strong>
<pre>def test_output_schema():
    result = run_transform(sample_input)
    expected_cols = {'user_id', 'event_date', 'total_amount', 'event_count'}
    assert set(result.columns) == expected_cols
    assert result['user_id'].dtype == 'int64'
    assert result['total_amount'].dtype == 'float64'</pre>

<strong>3. Integration Tests (меньше, медленнее)</strong>
<pre>@pytest.fixture
def test_db():
    engine = create_engine('postgresql://test:test@localhost/test_db')
    # setup
    setup_test_data(engine)
    yield engine
    # teardown
    cleanup(engine)

def test_full_pipeline(test_db):
    run_pipeline(source=test_db, target=test_db, date='2024-01-15')
    result = pd.read_sql("SELECT COUNT(*) as cnt FROM target_table", test_db)
    assert result['cnt'][0] > 0</pre>

<strong>4. Data Quality Tests (dbt / Great Expectations)</strong>
<pre># dbt: schema.yml
models:
  - name: orders_clean
    columns:
      - name: order_id
        tests: [unique, not_null]
      - name: amount
        tests:
          - dbt_utils.accepted_range:
              min_value: 0
              max_value: 1000000</pre>`,
    tags: ["testing", "quality", "best_practices"]
  },

  // Additional questions for completeness
  {
    id: "q_sql_023", category: "SQL", level: "junior",
    question: "Что такое CROSS JOIN и когда он используется?",
    answer: `<strong>CROSS JOIN</strong> — декартово произведение: каждая строка первой таблицы соединяется с каждой строкой второй. N × M строк в результате.<br><br>
<pre>-- Генерация всех комбинаций
SELECT d.date, p.product_id
FROM dim_date d
CROSS JOIN dim_product p;
-- Если 365 дат × 100 продуктов = 36,500 строк

-- Практический пример: заполнение пропусков
-- Для каждого продукта и каждого дня нужна строка (даже если продаж не было)
SELECT d.date, p.product_id, COALESCE(s.amount, 0) as amount
FROM dim_date d
CROSS JOIN dim_product p
LEFT JOIN fact_sales s ON d.date = s.date AND p.product_id = s.product_id;</pre>

<strong>⚠️ Осторожно:</strong> CROSS JOIN больших таблиц создаёт огромный результат. Используйте только с маленькими таблицами.`,
    tags: ["cross_join", "joins", "calendar"]
  },
  {
    id: "q_sql_024", category: "SQL", level: "middle",
    question: "Что такое COALESCE, NULLIF и ISNULL? Когда что использовать?",
    answer: `<strong>COALESCE(a, b, c, ...)</strong> — возвращает первое НЕ NULL значение из списка.<br>
<strong>NULLIF(a, b)</strong> — возвращает NULL если a = b, иначе возвращает a.<br>
<strong>ISNULL(a, b)</strong> — SQL Server: если a IS NULL, возвращает b (аналог COALESCE с 2 аргументами).<br><br>
<pre>-- COALESCE: подставить значение по умолчанию
SELECT 
    user_id,
    COALESCE(phone, email, 'No contact') as contact,
    COALESCE(preferred_name, first_name) as display_name
FROM users;

-- NULLIF: защита от деления на ноль
SELECT 
    revenue / NULLIF(cost, 0) as margin  -- если cost = 0, вернёт NULL вместо ошибки
FROM financials;

-- NULLIF: не считать пустые строки как значения
SELECT COUNT(NULLIF(status, '')) as non_empty_count
FROM orders;</pre>`,
    tags: ["null", "coalesce", "functions"]
  },
  {
    id: "q_py_014", category: "Python", level: "junior",
    question: "Что такое list comprehension и dict comprehension?",
    answer: `<strong>Comprehension</strong> — компактный способ создания коллекций в одну строку.<br><br>
<pre># List comprehension
squares = [x**2 for x in range(10)]             # [0, 1, 4, 9, ...]
evens = [x for x in range(20) if x % 2 == 0]   # фильтрация

# Dict comprehension
word_lengths = {word: len(word) for word in ['hello', 'world']}
# {'hello': 5, 'world': 5}

# Set comprehension
unique_first_letters = {name[0] for name in names}

# Вложенный comprehension
matrix = [[1,2,3],[4,5,6],[7,8,9]]
flat = [x for row in matrix for x in row]  # [1,2,3,4,5,6,7,8,9]

# Для DE: маппинг колонок
column_mapping = {
    col: col.lower().replace(' ', '_') 
    for col in df.columns
}
df.rename(columns=column_mapping, inplace=True)</pre>

<strong>Правило:</strong> если comprehension становится длиннее одной строки или содержит сложную логику — лучше использовать обычный цикл.`,
    tags: ["comprehension", "pythonic", "basics"]
  },

  // dbt questions
  {
    id: "q_dbt_001", category: "Airflow", level: "middle",
    question: "Что такое dbt (Data Build Tool) и как он вписывается в data stack?",
    answer: `<strong>dbt</strong> — инструмент для SQL-трансформаций в ELT-подходе. Трансформации выполняются ВНУТРИ warehouse (не на отдельном сервере).<br><br>
<strong>Ключевые концепции:</strong>
<ul>
<li><strong>Models</strong> — SQL SELECT-запросы, которые dbt материализует (view, table, incremental)</li>
<li><strong>ref()</strong> — ссылка на другую модель (dbt строит DAG зависимостей)</li>
<li><strong>source()</strong> — ссылка на raw-таблицу</li>
<li><strong>Tests</strong> — автоматическая проверка данных (not_null, unique, relationships)</li>
<li><strong>Seeds</strong> — CSV-файлы, загружаемые как таблицы (маппинги, справочники)</li>
<li><strong>Snapshots</strong> — автоматический SCD Type 2</li>
</ul>

<pre>-- models/staging/stg_orders.sql
WITH source AS (
    SELECT * FROM {{ source('raw', 'orders') }}
),
cleaned AS (
    SELECT
        id AS order_id,
        user_id,
        CAST(amount AS DECIMAL(10,2)) AS amount,
        created_at::timestamp AS ordered_at
    FROM source
    WHERE amount > 0
)
SELECT * FROM cleaned

-- models/marts/daily_revenue.sql
SELECT
    DATE_TRUNC('day', ordered_at) AS order_date,
    COUNT(*) AS total_orders,
    SUM(amount) AS total_revenue
FROM {{ ref('stg_orders') }}
GROUP BY 1</pre>

<strong>Позиция в стеке:</strong> Source DB → Fivetran/Airbyte (Extract+Load) → dbt (Transform) → BI Tool`,
    tags: ["dbt", "elt", "transformation", "sql"]
  },

  // Data Quality
  {
    id: "q_dq_001", category: "Data Modeling", level: "senior",
    question: "Какие существуют измерения качества данных? Как их контролировать?",
    answer: `<strong>6 измерений Data Quality:</strong><br><br>
<strong>1. Accuracy (Точность)</strong> — данные отражают реальность
<ul><li>Проверка: сравнение с источником, cross-validation</li></ul>

<strong>2. Completeness (Полнота)</strong> — нет пропущенных значений
<ul><li>Проверка: % NULL, обязательные поля</li></ul>

<strong>3. Consistency (Согласованность)</strong> — данные не противоречат друг другу
<ul><li>Проверка: sum(details) == total, date_start < date_end</li></ul>

<strong>4. Timeliness (Своевременность)</strong> — данные доступны вовремя
<ul><li>Проверка: SLA на freshness, max(updated_at) vs SLA</li></ul>

<strong>5. Uniqueness (Уникальность)</strong> — нет дубликатов
<ul><li>Проверка: COUNT vs COUNT(DISTINCT), unique constraints</li></ul>

<strong>6. Validity (Валидность)</strong> — данные соответствуют формату/диапазону
<ul><li>Проверка: email regex, age BETWEEN 0 AND 150, enum values</li></ul>

<strong>Инструменты:</strong>
<pre># Great Expectations
import great_expectations as gx

validator.expect_column_values_to_not_be_null("order_id")
validator.expect_column_values_to_be_between("amount", 0, 1000000)
validator.expect_column_values_to_be_unique("order_id")
validator.expect_column_pair_values_a_to_be_greater_than_b(
    "end_date", "start_date"
)</pre>

<pre># dbt tests (schema.yml)
models:
  - name: orders
    columns:
      - name: order_id
        tests: [unique, not_null]
      - name: amount
        tests:
          - dbt_utils.accepted_range:
              min_value: 0</pre>`,
    tags: ["data_quality", "testing", "governance"]
  },

  // More questions across categories to reach 200+
  {
    id: "q_sql_025", category: "SQL", level: "middle",
    question: "Что такое MERGE (UPSERT) и когда его использовать?",
    answer: `<strong>MERGE</strong> — комбинация INSERT, UPDATE, DELETE в одной операции. Идеален для уpsert-логики (insert or update).<br><br>
<pre>MERGE INTO target_table t
USING source_table s
ON t.id = s.id

WHEN MATCHED AND s.is_deleted = TRUE THEN
    DELETE

WHEN MATCHED THEN
    UPDATE SET 
        t.name = s.name,
        t.email = s.email,
        t.updated_at = CURRENT_TIMESTAMP

WHEN NOT MATCHED THEN
    INSERT (id, name, email, created_at)
    VALUES (s.id, s.name, s.email, CURRENT_TIMESTAMP);</pre>

<strong>Для DE:</strong> MERGE = идемпотентная загрузка данных. "Если запись существует — обнови, если нет — вставь". Используется в incremental loads, SCD Type 1.

<strong>Альтернатива (PostgreSQL):</strong>
<pre>INSERT INTO target (id, name, email)
VALUES (...) 
ON CONFLICT (id) 
DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email;</pre>`,
    tags: ["merge", "upsert", "etl", "idempotency"]
  },
  {
    id: "q_py_015", category: "Python", level: "middle",
    question: "Как работает error handling в Python? try/except best practices?",
    answer: `<strong>Best practices для Data Engineering:</strong><br><br>
<pre># ❌ Плохо: ловить всё
try:
    process_data()
except:
    pass  # молча проглотить ошибку

# ❌ Плохо: слишком широко
try:
    result = api_call()
    parsed = parse(result)
    save(parsed)
except Exception as e:
    log(e)  # Не знаем, что именно сломалось

# ✅ Хорошо: конкретные исключения
try:
    response = requests.get(url, timeout=30)
    response.raise_for_status()
except requests.exceptions.Timeout:
    logger.warning(f"Timeout при запросе {url}")
    return None
except requests.exceptions.HTTPError as e:
    logger.error(f"HTTP ошибка {e.response.status_code}: {url}")
    raise
except requests.exceptions.ConnectionError:
    logger.error(f"Нет соединения с {url}")
    raise

# ✅ Custom exceptions для pipeline
class DataQualityError(Exception):
    pass

class SourceUnavailableError(Exception):
    pass

def validate_data(df):
    null_pct = df['id'].isna().mean()
    if null_pct > 0.1:
        raise DataQualityError(
            f"Слишком много NULL в id: {null_pct:.1%}"
        )

# ✅ finally для cleanup
try:
    conn = get_connection()
    process(conn)
except Exception:
    logger.exception("Pipeline failed")
    raise
finally:
    conn.close()  # всегда закрываем</pre>`,
    tags: ["error_handling", "exceptions", "best_practices"]
  },
  {
    id: "q_spark_008", category: "Spark", level: "senior",
    question: "Как работает Broadcast Join vs Sort-Merge Join в Spark?",
    answer: `<strong>Broadcast Hash Join:</strong>
<ul>
<li>Маленькая таблица копируется (broadcast) на все executor'ы</li>
<li>Нет shuffle большой таблицы</li>
<li>По умолчанию: если таблица < 10MB (<code>spark.sql.autoBroadcastJoinThreshold</code>)</li>
</ul>

<strong>Sort-Merge Join:</strong>
<ul>
<li>Обе таблицы сортируются по ключу join'а и объединяются</li>
<li>Требует shuffle обеих таблиц</li>
<li>Используется для больших таблиц</li>
</ul>

<pre># Принудительный Broadcast Join
from pyspark.sql.functions import broadcast

result = big_table.join(
    broadcast(small_table),  # принудительно broadcast
    "join_key"
)

# Изменить порог auto-broadcast (по умолчанию 10MB)
spark.conf.set("spark.sql.autoBroadcastJoinThreshold", "50m")

# Отключить broadcast (для тестирования Sort-Merge)
spark.conf.set("spark.sql.autoBroadcastJoinThreshold", "-1")</pre>

<strong>Выбор стратегии:</strong>
| Сценарий | Стратегия |
|---|---|
| Маленькая + большая таблица | Broadcast Hash Join |
| Две большие таблицы | Sort-Merge Join |
| Сильный data skew | Salted Join или Broadcast (если возможно) |
| Pre-bucketed таблицы | Bucketed Sort-Merge (без shuffle!) |`,
    tags: ["broadcast_join", "sort_merge", "join_strategies"]
  },
  {
    id: "q_kafka_005", category: "Kafka", level: "middle",
    question: "Что такое Consumer Group в Kafka и зачем он нужен?",
    answer: `<strong>Consumer Group</strong> — группа consumer'ов, совместно читающих topic. Каждая партиция назначается только ОДНОМУ consumer'у в группе.<br><br>
<pre>
Topic: orders (6 partitions)

Consumer Group "analytics" (3 consumers):
  Consumer A → Partition 0, 1
  Consumer B → Partition 2, 3
  Consumer C → Partition 4, 5

Consumer Group "notifications" (2 consumers):
  Consumer X → Partition 0, 1, 2
  Consumer Y → Partition 3, 4, 5
</pre>

<strong>Ключевые правила:</strong>
<ul>
<li>Каждая группа независимо читает ВСЕ данные topic'а</li>
<li>Внутри группы: 1 партиция = 1 consumer (горизонтальное масштабирование)</li>
<li>Consumers > partitions = idle consumers (простаивают)</li>
<li>Rebalancing: при добавлении/удалении consumer'а партиции перераспределяются</li>
</ul>

<strong>Практика:</strong>
<ul>
<li>Группа "etl" — загрузка в DWH</li>
<li>Группа "monitoring" — real-time алерты</li>
<li>Группа "ml-features" — расчёт фичей для ML</li>
<li>Все читают одни данные, но обрабатывают по-разному</li>
</ul>`,
    tags: ["consumer_group", "parallelism", "architecture"]
  },
  {
    id: "q_dm_008", category: "Data Modeling", level: "middle",
    question: "Что такое Data Contract? Зачем это нужно?",
    answer: `<strong>Data Contract</strong> — формальное соглашение между producer'ом и consumer'ом данных о формате, качестве и SLA.<br><br>
<strong>Что включает:</strong>
<ul>
<li><strong>Schema</strong> — имена столбцов, типы, nullable</li>
<li><strong>Semantics</strong> — что означает каждое поле, grain таблицы</li>
<li><strong>Quality</strong> — допустимый % NULL, диапазоны значений, уникальность</li>
<li><strong>SLA</strong> — когда данные будут доступны, максимальная задержка</li>
<li><strong>Ownership</strong> — кто отвечает за данные</li>
</ul>

<pre># data_contract.yaml
name: user_events
owner: platform-team
description: "User interaction events from web/mobile"

schema:
  - name: event_id
    type: string
    required: true
    unique: true
  - name: user_id
    type: integer
    required: true
  - name: event_type
    type: string
    required: true
    allowed_values: [click, view, purchase, signup]
  - name: event_timestamp
    type: timestamp
    required: true

quality:
  freshness: "< 15 minutes"
  completeness: "> 99.5%"
  volume: "100K - 10M events/day"

sla:
  availability: "99.9%"
  update_frequency: "real-time"</pre>

<strong>Без контрактов:</strong> upstream изменяет схему → downstream ломается → все тушат пожар в 3 часа ночи.`,
    tags: ["data_contract", "governance", "communication"]
  },

  // More questions for full coverage
  {
    id: "q_sql_026", category: "SQL", level: "junior",
    question: "Чем отличаются типы данных CHAR, VARCHAR и TEXT?",
    answer: `<strong>CHAR(n)</strong> — фиксированная длина. Всегда хранит n символов (дополняет пробелами).<br>
<strong>VARCHAR(n)</strong> — переменная длина до n символов. Хранит только фактические данные.<br>
<strong>TEXT</strong> — переменная длина без ограничений.<br><br>
<pre>CHAR(10)    → 'Alice     '  (дополнено пробелами до 10)
VARCHAR(10) → 'Alice'        (хранит 5 символов)
TEXT        → любая длина

-- Производительность
-- CHAR чуть быстрее для фиксированных данных (код страны: 'US', 'RU')
-- VARCHAR оптимален для большинства случаев
-- TEXT для длинных строк (описания, комментарии)</pre>

<strong>Для DE:</strong> В PostgreSQL разницы между VARCHAR и TEXT почти нет. В MySQL и других — TEXT может иметь ограничения на индексирование.`,
    tags: ["data_types", "basics", "storage"]
  },
  {
    id: "q_sql_027", category: "SQL", level: "middle",
    question: "Что такое рекурсивный CTE? Приведите пример",
    answer: `<strong>Рекурсивный CTE</strong> — CTE, который ссылается сам на себя. Используется для обхода иерархий и графов.<br><br>
<pre>-- Иерархия: сотрудник → менеджер → директор
WITH RECURSIVE org_tree AS (
    -- Base case: CEO (нет менеджера)
    SELECT id, name, manager_id, 1 as level
    FROM employees 
    WHERE manager_id IS NULL
    
    UNION ALL
    
    -- Рекурсивный шаг: подчинённые
    SELECT e.id, e.name, e.manager_id, t.level + 1
    FROM employees e
    JOIN org_tree t ON e.manager_id = t.id
)
SELECT * FROM org_tree ORDER BY level, name;

-- Генерация последовательности дат
WITH RECURSIVE date_series AS (
    SELECT DATE '2024-01-01' as dt
    UNION ALL
    SELECT dt + INTERVAL '1 day'
    FROM date_series
    WHERE dt < '2024-12-31'
)
SELECT dt FROM date_series;</pre>

<strong>Use cases:</strong> org charts, Bill of Materials, category trees, path finding.`,
    tags: ["recursive_cte", "hierarchy", "advanced"]
  },
  {
    id: "q_py_016", category: "Python", level: "middle",
    question: "Чем отличается .loc от .iloc в Pandas?",
    answer: `<strong>.loc</strong> — доступ по <em>меткам</em> (label-based). Включает обе границы.<br>
<strong>.iloc</strong> — доступ по <em>позиции</em> (integer-based). Не включает правую границу (как slice).<br><br>
<pre>import pandas as pd

df = pd.DataFrame(
    {'name': ['Alice', 'Bob', 'Charlie'], 'age': [25, 30, 35]},
    index=['a', 'b', 'c']
)

# .loc — по меткам
df.loc['a']              # строка с index='a'
df.loc['a':'b']          # строки от 'a' ДО 'b' включительно
df.loc['a', 'name']      # конкретная ячейка
df.loc[df['age'] > 25]   # с условием — как WHERE в SQL

# .iloc — по позиции
df.iloc[0]               # первая строка
df.iloc[0:2]             # строки 0, 1 (не включая 2)
df.iloc[0, 1]            # строка 0, столбец 1

# ⚠️ Ловушка: integer index
df2 = pd.DataFrame({'x': [10, 20, 30]}, index=[3, 1, 2])
df2.loc[1]   # строка с INDEX=1 (значение 20)
df2.iloc[1]  # вторая строка по ПОЗИЦИИ (значение 20, совпало случайно)
df2.loc[0]   # KeyError! Нет индекса 0
df2.iloc[0]  # первая строка (значение 10)</pre>`,
    tags: ["pandas", "indexing", "basics"]
  },
  {
    id: "q_af_006", category: "Airflow", level: "middle",
    question: "Что такое Backfill в Airflow и как его правильно делать?",
    answer: `<strong>Backfill</strong> — запуск DAG за прошлые даты. Нужен когда: добавили новый pipeline, исправили баг, данные нужно пересчитать.<br><br>
<pre># CLI backfill
airflow dags backfill my_dag \\
    --start-date 2024-01-01 \\
    --end-date 2024-06-30 \\
    --reset-dagruns  # пересоздать даже если уже были запуски

# В DAG: catchup=True/False
with DAG(
    'daily_etl',
    start_date=datetime(2024, 1, 1),
    schedule_interval='@daily',
    catchup=False  # НЕ запускать для прошлых дат автоматически
) as dag:</pre>

<strong>Правила безопасного backfill:</strong>
<ul>
<li><strong>Идемпотентность</strong> — каждый запуск должен давать тот же результат</li>
<li><strong>Параметризация по дате</strong> — используйте <code>{{ ds }}</code> (execution_date) везде</li>
<li><strong>DELETE + INSERT</strong> — не просто INSERT (иначе дубликаты)</li>
<li><strong>Ограничить параллелизм</strong> — <code>max_active_runs=1</code> чтобы не перегрузить систему</li>
<li><strong>Тестировать на малом диапазоне</strong> — сначала backfill за 1 день, проверить результат</li>
</ul>

<pre># Идемпотентный task
def load_data(**context):
    date = context['ds']  # execution date: '2024-01-15'
    
    # 1. Удалить старые данные за эту дату
    db.execute(f"DELETE FROM target WHERE date = '{date}'")
    
    # 2. Загрузить новые
    data = extract(date)
    data.to_sql('target', db, if_exists='append')</pre>`,
    tags: ["backfill", "catchup", "idempotency"]
  },
  {
    id: "q_spark_009", category: "Spark", level: "middle",
    question: "Что такое Caching и Persistence в Spark? Когда их использовать?",
    answer: `<strong>cache()</strong> = <code>persist(StorageLevel.MEMORY_AND_DISK)</code> — сохраняет DataFrame в памяти (и на диске если не хватает).<br><br>
<strong>Когда кэшировать:</strong>
<ul>
<li>DataFrame используется НЕСКОЛЬКО раз в разных действиях</li>
<li>После дорогой трансформации (join, aggregation)</li>
<li>Iterative algorithms (ML training)</li>
</ul>

<strong>Когда НЕ кэшировать:</strong>
<ul>
<li>DataFrame используется один раз</li>
<li>Данные слишком большие для памяти</li>
<li>Между use-ами мало времени (Spark может пересчитать быстрее)</li>
</ul>

<pre>from pyspark import StorageLevel

# Дорогой join
joined_df = big_table.join(dim_table, "key").filter(...)

# Кэшируем, потому что используем дважды
joined_df.cache()  # или .persist()

# Использование 1
report_a = joined_df.groupBy("category").agg(sum("amount"))
report_a.write.parquet("report_a/")

# Использование 2
report_b = joined_df.groupBy("region").agg(count("*"))
report_b.write.parquet("report_b/")

# ⚠️ ВАЖНО: освободить кэш после использования
joined_df.unpersist()</pre>

<strong>Storage Levels:</strong>
<ul>
<li><code>MEMORY_ONLY</code> — только RAM (теряется при нехватке)</li>
<li><code>MEMORY_AND_DISK</code> — RAM + диск (по умолчанию для cache())</li>
<li><code>DISK_ONLY</code> — только диск</li>
<li><code>MEMORY_ONLY_SER</code> — RAM в сериализованном виде (компактнее)</li>
</ul>`,
    tags: ["caching", "persistence", "performance"]
  },
  {
    id: "q_sd_005", category: "System Design", level: "senior",
    question: "Что такое Data Lakehouse? Чем отличается от Data Lake и Data Warehouse?",
    answer: `<strong>Data Lake</strong> — хранилище сырых данных (любого формата) на дешёвом storage (S3, GCS).<br>
✅ Гибкость, дёшево. ❌ Нет ACID, нет schema enforcement, "data swamp".<br><br>

<strong>Data Warehouse</strong> — структурированное хранилище для аналитики (Snowflake, BigQuery, Redshift).<br>
✅ ACID, быстрые запросы, governance. ❌ Дорого, жёсткая схема, не для ML/raw данных.<br><br>

<strong>Data Lakehouse</strong> — объединяет лучшее: дешёвое хранение (S3) + ACID + schema + SQL производительность.<br><br>

<strong>Технологии:</strong>
<ul>
<li><strong>Delta Lake</strong> (Databricks) — transaction log, time travel, schema evolution</li>
<li><strong>Apache Iceberg</strong> (Netflix → open source) — hidden partitioning, schema evolution, time travel</li>
<li><strong>Apache Hudi</strong> (Uber) — upserts, incremental processing</li>
</ul>

<pre>
Data Lake (S3):       Raw files, no ACID, schema-on-read
    ↓ + Iceberg/Delta → 
Data Lakehouse:       ACID transactions, schema enforcement,
                      time travel, partition evolution,
                      SQL performance, ML workloads
    ≈
Data Warehouse:       Same SQL capabilities but on cheap S3 storage
</pre>

<strong>Практика:</strong> Lakehouse заменяет паттерн "Data Lake + отдельный Warehouse" единой платформой. Снижает дублирование данных и стоимость.`,
    tags: ["lakehouse", "delta_lake", "iceberg", "architecture"]
  },
  {
    id: "q_devops_005", category: "DevOps", level: "middle",
    question: "Что такое Kubernetes и зачем он нужен Data Engineer'у?",
    answer: `<strong>Kubernetes (K8s)</strong> — платформа оркестрации контейнеров. Автоматически развёртывает, масштабирует и управляет контейнерными приложениями.<br><br>
<strong>Для DE:</strong>
<ul>
<li><strong>Airflow на K8s</strong> — KubernetesExecutor запускает каждый task в отдельном pod'е</li>
<li><strong>Spark на K8s</strong> — ephemeral Spark кластеры (запустил → обработал → удалил)</li>
<li><strong>Kafka на K8s</strong> — Strimzi operator для production Kafka</li>
<li><strong>Auto-scaling</strong> — масштабирование под нагрузку (много ETL задач → больше pods)</li>
<li><strong>Isolation</strong> — каждый pipeline в своём окружении</li>
</ul>

<strong>Ключевые концепции:</strong>
<ul>
<li><strong>Pod</strong> — минимальная единица (один или несколько контейнеров)</li>
<li><strong>Deployment</strong> — управляет replica set и обновлениями</li>
<li><strong>Service</strong> — стабильный endpoint для набора pods</li>
<li><strong>ConfigMap / Secret</strong> — конфигурация и секреты</li>
<li><strong>PVC</strong> — persistent storage</li>
</ul>

<pre># Airflow KubernetesExecutor: каждый task = отдельный pod
task = KubernetesPodOperator(
    task_id='spark_job',
    image='my-spark:latest',
    cmds=['spark-submit', '/app/etl.py'],
    resources={'limit_memory': '4Gi', 'limit_cpu': '2'},
    namespace='data-pipeline'
)</pre>`,
    tags: ["kubernetes", "containers", "orchestration"]
  },

  // ============================================
  // ADDITIONAL QUESTIONS (120+) — до 200+
  // ============================================

  // --- SQL Advanced ---
  {
    id: "q_sql_extra_01", category: "SQL", level: "middle",
    question: "Что такое Materialized View и когда её использовать?",
    answer: `<strong>Materialized View</strong> — это представление, которое физически хранит результат запроса.<br><br>
<strong>View (обычная):</strong> запрос выполняется каждый раз при обращении.<br>
<strong>Materialized View:</strong> данные кешируются, нужен ручной REFRESH.<br><br>
<pre>CREATE MATERIALIZED VIEW mv_daily_revenue AS
SELECT date, SUM(amount) as revenue, COUNT(*) as orders
FROM fact_orders
GROUP BY date;

-- Обновить данные
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_revenue;</pre>
<strong>Когда использовать:</strong> сложные агрегации, которые запрашиваются часто, но обновляются редко (отчёты, дашборды).`,
    tags: ["views", "optimization", "DWH"]
  },
  {
    id: "q_sql_extra_02", category: "SQL", level: "senior",
    question: "Что такое Recursive CTE и приведите пример?",
    answer: `Recursive CTE вызывает саму себя и полезна для иерархических данных (org chart, категории, графы).<br><br>
<pre>-- Найти всех подчинённых менеджера (org chart)
WITH RECURSIVE subordinates AS (
    -- Base case: сам менеджер
    SELECT id, name, manager_id, 1 as depth
    FROM employees WHERE id = 1

    UNION ALL

    -- Recursive: подчинённые подчинённых
    SELECT e.id, e.name, e.manager_id, s.depth + 1
    FROM employees e
    JOIN subordinates s ON e.manager_id = s.id
    WHERE s.depth < 10  -- защита от бесконечности
)
SELECT * FROM subordinates;</pre>
<strong>Важно:</strong> Всегда ограничивайте глубину рекурсии (WHERE depth < N).`,
    tags: ["CTE", "recursive", "trees"]
  },
  {
    id: "q_sql_extra_03", category: "SQL", level: "middle",
    question: "Чем отличается TRUNCATE от DELETE?",
    answer: `<strong>DELETE:</strong> Удаляет строки по одной, пишет в WAL/лог, можно WHERE, можно ROLLBACK.<br>
<strong>TRUNCATE:</strong> Очищает таблицу мгновенно (удаляет все страницы), не пишет построчно в лог, нельзя WHERE, быстрее в 100x.<br><br>
<pre>DELETE FROM huge_table WHERE date < '2020-01-01';  -- медленно, логируется
TRUNCATE TABLE staging_table;  -- мгновенно</pre>
<strong>Нюанс:</strong> TRUNCATE сбрасывает автоинкремент (SERIAL), DELETE — нет.`,
    tags: ["DDL", "performance"]
  },
  {
    id: "q_sql_extra_04", category: "SQL", level: "senior",
    question: "Объясните разницу между OLTP и OLAP системами",
    answer: `<strong>OLTP (Online Transaction Processing):</strong>
<ul><li>Много мелких транзакций (INSERT/UPDATE)</li><li>Нормализованная схема (3NF)</li><li>Строковое хранение (PostgreSQL, MySQL)</li><li>Пример: система заказов интернет-магазина</li></ul>
<strong>OLAP (Online Analytical Processing):</strong>
<ul><li>Сложные аналитические запросы (SELECT + JOIN + GROUP BY)</li><li>Денормализованная схема (Star/Snowflake)</li><li>Колоночное хранение (ClickHouse, Redshift, BigQuery)</li><li>Пример: аналитический дашборд с метриками</li></ul>
<strong>Почему колоночное хранение для OLAP:</strong> аналитика читает 3-5 столбцов из 100 → column store читает только нужные столбцы.`,
    tags: ["architecture", "DWH", "storage"]
  },
  {
    id: "q_sql_extra_05", category: "SQL", level: "middle",
    question: "Что такое UPSERT и как его реализовать?",
    answer: `UPSERT = INSERT + UPDATE. Если запись существует — обновить, если нет — вставить.<br><br>
<pre>-- PostgreSQL: ON CONFLICT
INSERT INTO dim_customers (id, name, email)
VALUES (1, 'Alice', 'alice@mail.com')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email;

-- MySQL: ON DUPLICATE KEY
INSERT INTO dim_customers (id, name) VALUES (1, 'Alice')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Spark SQL: MERGE
MERGE INTO target USING source ON target.id = source.id
WHEN MATCHED THEN UPDATE SET *
WHEN NOT MATCHED THEN INSERT *;</pre>
<strong>Для DE:</strong> UPSERT критичен для идемпотентного ETL — повторный запуск не создаёт дубликаты.`,
    tags: ["DML", "ETL", "idempotent"]
  },
  {
    id: "q_sql_extra_06", category: "SQL", level: "senior",
    question: "Что такое Bloom Filter Index и когда он полезен?",
    answer: `Bloom Filter — вероятностная структура данных. Может быстро ответить "этого значения ТОЧНО НЕТ" или "ВОЗМОЖНО есть".<br><br>
<strong>В контексте DE:</strong>
<ul><li>Delta Lake / Iceberg поддерживают Bloom Filter Index на столбцах с высокой кардинальностью (user_id, event_id)</li><li>Ускоряет точечные запросы (WHERE user_id = 'abc')</li><li>Spark может пропустить целые файлы если Bloom Filter говорит "значения нет"</li></ul>
<pre># Delta Lake
CREATE BLOOMFILTER INDEX ON TABLE events FOR COLUMNS(user_id)
OPTIONS(fpp=0.1, numItems=50000000);</pre>
<strong>Когда полезен:</strong> Столбцы с высокой кардинальностью (UUID), которые часто ищут по точному совпадению, но не сортируют.`,
    tags: ["index", "optimization", "advanced"]
  },

  // --- Python Advanced ---
  {
    id: "q_py_extra_01", category: "Python", level: "middle",
    question: "В чем разница между list comprehension и generator expression?",
    answer: `<strong>List comprehension</strong> создаёт список в памяти сразу:<br>
<pre>nums = [x**2 for x in range(10_000_000)]  # ~80MB RAM</pre>

<strong>Generator expression</strong> — ленивый, вычисляет по одному:<br>
<pre>nums = (x**2 for x in range(10_000_000))  # ~0 MB RAM</pre>

<strong>Для DE:</strong> При обработке больших файлов ВСЕГДА используйте генераторы. Это разница между "работает" и "OOM killed".`,
    tags: ["generators", "memory", "performance"]
  },
  {
    id: "q_py_extra_02", category: "Python", level: "senior",
    question: "Что такое GIL и как он влияет на параллельность?",
    answer: `<strong>GIL (Global Interpreter Lock)</strong> — мьютекс в CPython, позволяющий только одному потоку выполнять Python bytecode.<br><br>
<strong>Следствие:</strong> Threading в Python НЕ даёт ускорения для CPU-bound задач.<br><br>
<strong>Решения:</strong>
<ul><li><strong>multiprocessing</strong> — отдельные процессы, каждый со своим GIL</li><li><strong>concurrent.futures.ProcessPoolExecutor</strong> — удобная обёртка</li><li><strong>C-расширения</strong> — NumPy, Pandas освобождают GIL для вычислений</li><li><strong>Spark / Dask</strong> — распределённые вычисления</li></ul>
<pre>from concurrent.futures import ProcessPoolExecutor

def process_chunk(chunk):
    return chunk.apply(heavy_transform)

with ProcessPoolExecutor(max_workers=4) as executor:
    results = list(executor.map(process_chunk, chunks))</pre>
<strong>Для DE:</strong> IO-bound (API calls, DB queries) → threading ОК. CPU-bound (transform) → multiprocessing или Spark.`,
    tags: ["concurrency", "GIL", "performance"]
  },
  {
    id: "q_py_extra_03", category: "Python", level: "middle",
    question: "Как безопасно хранить секреты (пароли, API ключи) в Python?",
    answer: `<strong>НИКОГДА</strong> не хардкодьте секреты в коде!<br><br>
<strong>Варианты:</strong>
<ul><li><strong>.env файл + python-dotenv:</strong> для локальной разработки</li><li><strong>Environment variables:</strong> для Docker / CI/CD</li><li><strong>AWS Secrets Manager / GCP Secret Manager:</strong> для продакшена</li><li><strong>Airflow Connections/Variables:</strong> для Airflow DAGs</li></ul>
<pre># .env файл (добавить в .gitignore!)
DATABASE_URL=postgresql://user:pass@host:5432/db

# Python
from dotenv import load_dotenv
import os
load_dotenv()
db_url = os.getenv("DATABASE_URL")</pre>`,
    tags: ["security", "best-practices"]
  },
  {
    id: "q_py_extra_04", category: "Python", level: "middle",
    question: "Чем отличаются shallow copy и deep copy?",
    answer: `<strong>Shallow copy</strong> — копирует объект, но вложенные объекты остаются ссылками.<br>
<strong>Deep copy</strong> — рекурсивно копирует всё.<br><br>
<pre>import copy
original = {"users": [{"name": "Alice"}]}

shallow = copy.copy(original)
shallow["users"][0]["name"] = "Bob"
print(original["users"][0]["name"])  # "Bob" — изменился оригинал!

deep = copy.deepcopy(original)
deep["users"][0]["name"] = "Charlie"
print(original["users"][0]["name"])  # "Bob" — оригинал не изменился</pre>
<strong>Для DE:</strong> При трансформации данных используйте deep copy если мутируете вложенные структуры, иначе получите баги.`,
    tags: ["copy", "objects", "bugs"]
  },
  {
    id: "q_py_extra_05", category: "Python", level: "senior",
    question: "Объясните asyncio и когда его использовать для ETL?",
    answer: `<strong>asyncio</strong> — асинхронный IO, один поток, cooperative multitasking.<br><br>
<strong>Когда:</strong> Много IO-bound операций (HTTP API calls, DB queries) без ожидания.<br><br>
<pre>import asyncio
import aiohttp

async def fetch_page(session, url):
    async with session.get(url) as resp:
        return await resp.json()

async def extract_all():
    urls = [f"https://api.example.com/page/{i}" for i in range(100)]
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_page(session, url) for url in urls]
        results = await asyncio.gather(*tasks)  # 100 запросов параллельно!
    return results

data = asyncio.run(extract_all())</pre>
<strong>Синхронно:</strong> 100 × 0.5с = 50с. <strong>Async:</strong> ~0.5с (все параллельно).`,
    tags: ["async", "performance", "API"]
  },
  {
    id: "q_py_extra_06", category: "Python", level: "junior",
    question: "Чем отличаются *args и **kwargs?",
    answer: `<strong>*args</strong> — позволяет передать любое количество позиционных аргументов (tuple).<br>
<strong>**kwargs</strong> — любое количество именованных аргументов (dict).<br><br>
<pre>def log_event(*args, **kwargs):
    print(f"Args: {args}")     # tuple
    print(f"Kwargs: {kwargs}") # dict

log_event("click", "user_123", source="web", ts="2024-01-01")
# Args: ('click', 'user_123')
# Kwargs: {'source': 'web', 'ts': '2024-01-01'}</pre>
<strong>В ETL:</strong> часто используется для гибких конфигурацийфункций-трансформеров.`,
    tags: ["functions", "basics"]
  },
  {
    id: "q_py_extra_07", category: "Python", level: "middle",
    question: "Расскажите про dataclasses и когда их использовать?",
    answer: `<strong>dataclass</strong> — декоратор, автоматически генерирует __init__, __repr__, __eq__.<br><br>
<pre>from dataclasses import dataclass, field
from datetime import datetime

@dataclass
class PipelineConfig:
    source: str
    target: str
    batch_size: int = 10000
    created_at: datetime = field(default_factory=datetime.now)
    
config = PipelineConfig(source="s3://raw/", target="s3://clean/")
print(config)  # PipelineConfig(source='s3://raw/', target='s3://clean/', ...)</pre>
<strong>Для DE:</strong> используйте для конфигурации пайплайнов, DTO (Data Transfer Objects), структур метаданных вместо обычных dict.`,
    tags: ["dataclass", "typing", "patterns"]
  },

  // --- Spark Advanced ---
  {
    id: "q_spark_extra_01", category: "Spark", level: "middle",
    question: "Что такое Catalyst Optimizer в Spark?",
    answer: `<strong>Catalyst</strong> — оптимизатор запросов Spark SQL. Автоматически улучшает план выполнения.<br><br>
<strong>Этапы оптимизации:</strong>
<ol><li><strong>Analysis</strong> — разрешение имён столбцов, типов</li><li><strong>Logical Optimization</strong> — predicate pushdown, constant folding, projection pruning</li><li><strong>Physical Planning</strong> — выбор алгоритмов (Sort Merge Join vs Broadcast Hash Join)</li><li><strong>Code Generation</strong> — генерация Java bytecode (Whole-Stage CodeGen)</li></ol>
<strong>Predicate pushdown:</strong> Catalyst двигает WHERE фильтр как можно ближе к источнику данных, уменьшая объём чтения.`,
    tags: ["optimization", "internals"]
  },
  {
    id: "q_spark_extra_02", category: "Spark", level: "senior",
    question: "Как работает Shuffle в Spark и почему он дорогой?",
    answer: `<strong>Shuffle</strong> — перемещение данных между executor'ами при wide transformations (groupBy, join, repartition).<br><br>
<strong>Почему дорого:</strong>
<ul><li>Данные сериализуются → записываются на диск → передаются по сети → десериализуются</li><li>Создаёт большое количество промежуточных файлов</li><li>Может вызвать OOM если partition слишком большая</li></ul>
<strong>Как уменьшить:</strong>
<ul><li>Broadcast join для маленьких таблиц (&lt;10MB)</li><li>Repartition по ключу join'а заранее</li><li>AQE (Adaptive Query Execution) — Spark 3.0+</li><li>Salting для skewed keys</li></ul>
<pre>spark.conf.set("spark.sql.shuffle.partitions", 200)  # default
# Для маленьких данных уменьшите до 10-50</pre>`,
    tags: ["shuffle", "performance", "internals"]
  },
  {
    id: "q_spark_extra_03", category: "Spark", level: "middle",
    question: "Чем отличается coalesce от repartition?",
    answer: `<strong>coalesce(N)</strong> — уменьшает количество партиций БЕЗ shuffle. Только объединяет существующие.<br>
<strong>repartition(N)</strong> — перераспределяет данные С shuffle. Может увеличивать и уменьшать.<br><br>
<pre># После фильтрации осталось мало данных → уменьшить партиции
df.filter(col("country") == "KZ").coalesce(1).write.parquet("kz_data/")

# Перед join — repartition по ключу для оптимизации
df.repartition(100, "user_id").join(users, "user_id")</pre>
<strong>Правило:</strong> Уменьшать → coalesce (быстрее). Увеличивать или перебалансировать → repartition.`,
    tags: ["partitioning", "performance"]
  },
  {
    id: "q_spark_extra_04", category: "Spark", level: "senior",
    question: "Что такое Data Skew и как его решать?",
    answer: `<strong>Data Skew</strong> — когда один ключ содержит непропорционально много данных → один executor перегружен, остальные ждут.<br><br>
<strong>Пример:</strong> groupBy("city") — city="Moscow" имеет 10M записей, остальные — по 1000.<br><br>
<strong>Решения:</strong>
<ol><li><strong>AQE (Spark 3.2+)</strong> — автоматически разделяет skewed partitions
<pre>spark.conf.set("spark.sql.adaptive.enabled", True)
spark.conf.set("spark.sql.adaptive.skewJoin.enabled", True)</pre></li>
<li><strong>Salting</strong> — добавляем random suffix к ключу
<pre>df = df.withColumn("salted_key", 
    concat(col("city"), lit("_"), (rand()*10).cast("int")))
df.groupBy("salted_key").agg(sum("amount"))</pre></li>
<li><strong>Broadcast join</strong> — если одна таблица маленькая</li>
<li><strong>Filter + Union</strong> — отдельно обработать skewed key</li></ol>`,
    tags: ["skew", "performance", "distributed"]
  },
  {
    id: "q_spark_extra_05", category: "Spark", level: "middle",
    question: "Чем отличается cache() от persist() в Spark?",
    answer: `<strong>cache()</strong> — сохраняет DataFrame в RAM (MEMORY_AND_DISK по умолчанию в Spark 3.x).<br>
<strong>persist(level)</strong> — позволяет выбрать уровень хранения.<br><br>
<pre>from pyspark import StorageLevel

df.cache()  # = persist(StorageLevel.MEMORY_AND_DISK)
df.persist(StorageLevel.MEMORY_ONLY)       # только RAM (быстро, но может потерять)
df.persist(StorageLevel.DISK_ONLY)         # только диск (медленно, но надёжно)
df.persist(StorageLevel.MEMORY_AND_DISK_2) # + репликация

df.unpersist()  # освободить кеш</pre>
<strong>Когда кешировать:</strong> DataFrame используется в нескольких actions (count + show + write). Если только один раз — не кешируйте.`,
    tags: ["caching", "performance"]
  },

  // --- Airflow Advanced ---
  {
    id: "q_af_extra_01", category: "Airflow", level: "middle",
    question: "Что такое идемпотентность и почему она важна для Airflow?",
    answer: `<strong>Идемпотентность</strong> — повторное выполнение task'а даёт такой же результат, без дубликатов и побочных эффектов.<br><br>
<strong>Почему важно:</strong> Airflow часто перезапускает tasks (retry, backfill, manual trigger). Без идемпотентности → дубликаты в данных.<br><br>
<pre># ❌ НЕ идемпотентно
INSERT INTO target SELECT * FROM source WHERE date = '{{ ds }}';
# При повторном запуске — дубликаты!

# ✅ Идемпотентно — DELETE + INSERT
DELETE FROM target WHERE date = '{{ ds }}';
INSERT INTO target SELECT * FROM source WHERE date = '{{ ds }}';

# ✅ UPSERT / MERGE
INSERT INTO target (id, value)
SELECT id, value FROM source
ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value;</pre>`,
    tags: ["idempotency", "best-practices"]
  },
  {
    id: "q_af_extra_02", category: "Airflow", level: "senior",
    question: "Объясните разницу между execution_date и logical_date",
    answer: `<strong>execution_date (Airflow 1.x/2.x)</strong> = <strong>logical_date (Airflow 2.2+)</strong> — дата, ЗА КОТОРУЮ запускается DAG, а НЕ когда он реально запустился.<br><br>
<strong>Пример:</strong> DAG с schedule='@daily', start_date='2024-01-01'.<br>
DAG Run за 2024-01-01 запустится 2024-01-02 00:00! (в конце интервала).<br><br>
<pre># {{ ds }} = logical_date = 2024-01-01
# {{ data_interval_start }} = 2024-01-01
# {{ data_interval_end }} = 2024-01-02
# {{ ts }} = timestamp запуска</pre>
<strong>Для ETL:</strong> Всегда используйте {{ ds }} для фильтрации данных, НЕ datetime.now(). Иначе backfill не будет работать корректно.`,
    tags: ["dates", "scheduling", "backfill"]
  },
  {
    id: "q_af_extra_03", category: "Airflow", level: "middle",
    question: "Когда использовать Sensor vs Operator?",
    answer: `<strong>Operator</strong> — выполняет действие (запустить SQL, Python скрипт, Bash).<br>
<strong>Sensor</strong> — ждёт условие (файл появился, DAG завершился, время наступило).<br><br>
<pre># Sensor: ждать файл
from airflow.sensors.filesystem import FileSensor
wait_file = FileSensor(
    task_id='wait_csv', filepath='/data/export.csv',
    poke_interval=300, timeout=7200, mode='reschedule'
)

# mode='poke' — слот занят всё время (плохо)
# mode='reschedule' — освобождает слот между проверками (хорошо)</pre>
<strong>Правило:</strong> mode='reschedule' всегда лучше для продакшена — не блокирует worker slots.`,
    tags: ["sensors", "operators", "scheduling"]
  },
  {
    id: "q_af_extra_04", category: "Airflow", level: "senior",
    question: "Как масштабировать Airflow для production?",
    answer: `<strong>1. Executor:</strong> Local → Celery → Kubernetes
<ul><li><strong>Local:</strong> одна машина, для dev/small</li><li><strong>Celery:</strong> распределённые workers, Redis/RabbitMQ как broker</li><li><strong>Kubernetes:</strong> каждый task = отдельный Pod (лучшая изоляция)</li></ul>
<strong>2. Metadata DB:</strong> SQLite → PostgreSQL (обязательно для production)<br>
<strong>3. HA:</strong> несколько Scheduler'ов (поддерживается с Airflow 2.0)<br>
<strong>4. Managed:</strong> AWS MWAA, GCP Composer, Astronomer (чтобы не управлять самим).<br><br>
<pre># Kubernetes Executor
[core]
executor = KubernetesExecutor
[kubernetes]
namespace = airflow
worker_container_repository = my-airflow
worker_container_tag = latest</pre>`,
    tags: ["scaling", "production", "kubernetes"]
  },
  {
    id: "q_af_extra_05", category: "Airflow", level: "middle",
    question: "Что такое TaskGroup и зачем он нужен?",
    answer: `<strong>TaskGroup</strong> — визуальная группировка task'ов в UI для организации сложных DAG'ов.<br><br>
<pre>from airflow.utils.task_group import TaskGroup

with DAG('complex_etl', ...) as dag:
    with TaskGroup('extract') as extract_group:
        extract_users = PythonOperator(task_id='users', ...)
        extract_orders = PythonOperator(task_id='orders', ...)
        extract_products = PythonOperator(task_id='products', ...)

    with TaskGroup('transform') as transform_group:
        clean = PythonOperator(task_id='clean', ...)
        enrich = PythonOperator(task_id='enrich', ...)

    load = PythonOperator(task_id='load', ...)

    extract_group >> transform_group >> load</pre>
В UI группы сворачиваются/разворачиваются, что упрощает навигацию в DAG'ах с 50+ tasks.`,
    tags: ["organization", "UI", "patterns"]
  },

  // --- Kafka Advanced ---
  {
    id: "q_kafka_extra_01", category: "Kafka", level: "middle",
    question: "Как выбрать количество партиций для Kafka topic?",
    answer: `<strong>Правила:</strong>
<ul><li>Партиции = максимальный параллелизм consumers (1 consumer на 1 partition в группе)</li><li>Больше партиций = выше throughput, но больше нагрузка на ZooKeeper/KRaft</li><li>Уменьшить количество партиций НЕЛЬЗЯ (только увеличить)</li></ul>
<strong>Формула:</strong><br>
<code>partitions = max(throughput / consumer_throughput, throughput / producer_throughput)</code><br><br>
<strong>Практика:</strong>
<ul><li>Начните с 6-12 партиций для нового topic</li><li>Ключ партиционирования = ID сущности (user_id, order_id) — гарантирует порядок для одного пользователя</li></ul>`,
    tags: ["partitioning", "design"]
  },
  {
    id: "q_kafka_extra_02", category: "Kafka", level: "senior",
    question: "Объясните consumer group rebalancing и его проблемы",
    answer: `<strong>Rebalancing</strong> происходит когда consumer присоединяется/выходит из группы. Kafka перераспределяет партиции.<br><br>
<strong>Проблемы:</strong>
<ul><li>Stop-the-world: ВСЕ consumers останавливаются во время rebalancing</li><li>Дубликаты: uncommitted offsets могут обработаться повторно</li><li>Latency spike: задержка обработки</li></ul>
<strong>Решения:</strong>
<ul><li><strong>Static membership</strong> (group.instance.id) — consumer с ID может переподключиться без rebalancing</li><li><strong>Cooperative sticky</strong> — инкрементальный rebalancing (Kafka 2.4+), только затронутые партиции перераспределяются</li><li><strong>Graceful shutdown</strong> — consumer.close() перед остановкой</li></ul>`,
    tags: ["consumer-group", "rebalancing", "reliability"]
  },
  {
    id: "q_kafka_extra_03", category: "Kafka", level: "middle",
    question: "Что такое Consumer Lag и как его мониторить?",
    answer: `<strong>Consumer Lag</strong> — разница между последним сообщением в партиции и последним прочитанным consumer'ом.<br><br>
<pre>Log End Offset (LEO):  1000 ← producer записал
Consumer Offset:        850  ← consumer прочитал
Consumer Lag:           150  ← непрочитанных сообщений</pre>
<strong>Мониторинг:</strong>
<ul><li><strong>kafka-consumer-groups.sh</strong> — CLI инструмент</li><li><strong>Burrow</strong> — LinkedIn open-source инструмент</li><li><strong>Prometheus + Grafana</strong> — через JMX metrics</li></ul>
<pre># CLI
kafka-consumer-groups.sh --bootstrap-server localhost:9092 \\
    --describe --group my-consumer-group</pre>
<strong>Алерт:</strong> Lag > 10K и растёт → consumer не успевает → нужно масштабировать.`,
    tags: ["monitoring", "lag", "operations"]
  },

  // --- Data Modeling Advanced ---
  {
    id: "q_dm_extra_01", category: "Data Modeling", level: "middle",
    question: "Чем отличается surrogate key от natural key?",
    answer: `<strong>Natural key</strong> — бизнес-идентификатор из реального мира (email, SSN, order_number).<br>
<strong>Surrogate key</strong> — искусственный ID, сгенерированный системой (SERIAL, UUID, хэш).<br><br>
<strong>Почему surrogate key в DWH:</strong>
<ul><li>Natural key может измениться (email, телефон)</li><li>SCD Type 2 требует уникальный ключ для каждой версии</li><li>Composite natural keys → сложные JOIN'ы</li><li>Surrogate key = integer → быстрее JOIN (4 байта vs 100+ байт)</li></ul>
<pre>-- dim_customer
surrogate_key: 1001 (SERIAL) ← для JOIN с fact
customer_id: "CUST-887" ← natural key из source
name, email, city...</pre>`,
    tags: ["keys", "DWH", "modeling"]
  },
  {
    id: "q_dm_extra_02", category: "Data Modeling", level: "senior",
    question: "Расскажите про Slowly Changing Dimensions Type 2",
    answer: `SCD Type 2 сохраняет <strong>полную историю изменений</strong>, добавляя новую строку при каждом изменении.<br><br>
<pre>surrogate_key | customer_id | city    | valid_from | valid_to   | is_current
1001          | C-001       | Moscow  | 2020-01-01 | 2023-06-15 | false
1002          | C-001       | Berlin  | 2023-06-15 | 9999-12-31 | true</pre>
<strong>Логика обновления:</strong>
<ol><li>Получить incoming data из source</li><li>Найти changed records (LEFT JOIN + WHERE source != target)</li><li>Закрыть старые записи: UPDATE SET valid_to = today, is_current = false</li><li>Вставить новые версии: INSERT с valid_from = today, is_current = true</li></ol>
<strong>Инструменты:</strong> dbt snapshots, Spark MERGE, custom Python.`,
    tags: ["SCD", "history", "DWH"]
  },
  {
    id: "q_dm_extra_03", category: "Data Modeling", level: "middle",
    question: "Что такое Data Vault и из чего он состоит?",
    answer: `<strong>Data Vault 2.0</strong> — методология моделирования для Enterprise DWH.<br><br>
<strong>Компоненты:</strong>
<ul><li><strong>Hub</strong> — бизнес-ключи (customer_id). Никогда не меняются. PK = hash(business_key).</li>
<li><strong>Link</strong> — связи между Hub'ами (customer-order). Представляют бизнес-отношения.</li>
<li><strong>Satellite</strong> — атрибуты + история (name, email, city). SCD Type 2 автоматически.</li></ul>
<strong>Плюсы:</strong> Гибкость, параллельная загрузка, полная аудируемость, agile.<br>
<strong>Минусы:</strong> Много JOIN'ов для запросов, нужен Business Vault / Marts сверху.<br><br>
<strong>На практике:</strong> Raw → Data Vault → Star Schema (marts для BI).`,
    tags: ["DataVault", "architecture", "enterprise"]
  },
  {
    id: "q_dm_extra_04", category: "Data Modeling", level: "junior",
    question: "Что такое fact table и какие типы бывают?",
    answer: `<strong>Fact table</strong> — центральная таблица в Star Schema, содержит измеримые бизнес-события.<br><br>
<strong>Типы:</strong>
<ul><li><strong>Transaction Fact</strong> — одна строка = одно событие (order, click, payment)</li>
<li><strong>Periodic Snapshot</strong> — снимок на конец периода (daily_balance, monthly_inventory)</li>
<li><strong>Accumulating Snapshot</strong> — жизненный цикл процесса (order_created → shipped → delivered)</li>
<li><strong>Factless Fact</strong> — событие без числовых метрик (student_attendance, product_promotion)</li></ul>
<strong>Правило:</strong> Fact table содержит foreign keys к dimensions + числовые метрики (amount, quantity, duration).`,
    tags: ["facts", "star-schema", "basics"]
  },

  // --- dbt Questions ---
  {
    id: "q_dbt_01", category: "dbt", level: "junior",
    question: "Что такое dbt и какую проблему он решает?",
    answer: `<strong>dbt (data build tool)</strong> — инструмент для SQL-трансформаций внутри DWH.<br><br>
<strong>Проблема:</strong> В ELT-подходе данные загружаются "как есть" (Fivetran, Airbyte). Нужен инструмент для трансформации в warehouse.<br><br>
<strong>dbt решает:</strong>
<ul><li>SQL-файлы как объект версионирования (Git)</li><li>Автоматический DAG зависимостей через ref()</li><li>Тестирование данных (unique, not_null, relationships)</li><li>Документация с lineage graph</li><li>Incremental models для больших таблиц</li></ul>
<strong>Позиция:</strong> Sources → Fivetran (EL) → <strong>dbt (T)</strong> → BI Tools`,
    tags: ["basics", "ELT", "overview"]
  },
  {
    id: "q_dbt_02", category: "dbt", level: "middle",
    question: "Объясните разницу между ref() и source()",
    answer: `<strong>ref('model_name')</strong> — ссылка на другую dbt модель. dbt автоматически строит DAG зависимостей.<br>
<strong>source('source_name', 'table_name')</strong> — ссылка на raw таблицу из внешнего источника.<br><br>
<pre>-- models/staging/stg_orders.sql
-- source: читаем из raw-таблицы
SELECT * FROM {{ source('raw_db', 'orders') }}

-- models/marts/fct_revenue.sql
-- ref: ссылаемся на другую dbt модель
SELECT date, SUM(amount) as revenue
FROM {{ ref('stg_orders') }}
GROUP BY date</pre>
<strong>Почему не хардкодить имена таблиц:</strong> ref() позволяет dbt определить порядок выполнения и строить lineage graph.`,
    tags: ["ref", "source", "DAG"]
  },
  {
    id: "q_dbt_03", category: "dbt", level: "middle",
    question: "Что такое incremental models в dbt?",
    answer: `Incremental model обрабатывает только <strong>новые/изменённые данные</strong>, не пересоздавая всю таблицу.<br><br>
<pre>{{ config(
    materialized='incremental',
    unique_key='event_id',
    incremental_strategy='merge'
) }}

SELECT event_id, user_id, event_type, created_at
FROM {{ ref('stg_events') }}

{% if is_incremental() %}
    WHERE created_at > (SELECT MAX(created_at) FROM {{ this }})
{% endif %}</pre>
<strong>Стратегии:</strong>
<ul><li><strong>append</strong> — просто вставить (могут быть дубликаты)</li><li><strong>merge</strong> — UPSERT по unique_key (идемпотентно)</li><li><strong>delete+insert</strong> — удалить для периода + вставить</li></ul>
<strong>Когда:</strong> Таблица > 10M строк и каждый день добавляется <1% новых данных.`,
    tags: ["incremental", "performance", "materialization"]
  },
  {
    id: "q_dbt_04", category: "dbt", level: "senior",
    question: "Как организовать dbt проект? (staging → marts)",
    answer: `<strong>Рекомендуемая структура:</strong>
<pre>models/
├── staging/       ← 1:1 с source tables. Очистка, rename, типизация
│   ├── stg_orders.sql
│   └── stg_customers.sql
├── intermediate/  ← Промежуточные трансформации (join, enrich)
│   └── int_order_items_enriched.sql
└── marts/         ← Бизнес-модели для конечных пользователей
    ├── core/
    │   ├── dim_customers.sql
    │   └── fct_orders.sql
    └── marketing/
        └── user_segments.sql</pre>
<strong>Правила:</strong>
<ul><li>Staging: только SELECT + CAST + rename. 1 модель = 1 source.</li><li>Intermediate: join staging моделей, бизнес-логика.</li><li>Marts: агрегации, KPI, готово для BI. Materialized as table.</li><li>Staging → view (дешёво). Marts → table/incremental (быстрые запросы).</li></ul>`,
    tags: ["project-structure", "best-practices", "organization"]
  },

  // --- Cloud Questions ---
  {
    id: "q_cloud_01", category: "Cloud", level: "middle",
    question: "Чем отличается S3 от HDFS?",
    answer: `<strong>S3 (AWS):</strong> Object storage. Бесконечное хранение, pay-per-use, высокая доступность (99.999999999%).<br>
<strong>HDFS:</strong> Distributed filesystem на кластере Hadoop. Данные реплицируются на 3 ноды.<br><br>
<table><tr><th></th><th>S3</th><th>HDFS</th></tr>
<tr><td>Тип</td><td>Object store</td><td>Filesystem</td></tr>
<tr><td>Стоимость</td><td>Pay per GB</td><td>Фиксированная (серверы)</td></tr>
<tr><td>Масштабирование</td><td>Бесконечное</td><td>Добавлять ноды</td></tr>
<tr><td>Compute</td><td>Отдельно (EMR, Glue)</td><td>На тех же нодах</td></tr>
<tr><td>Тренд</td><td>✅ Стандарт</td><td>⬇️ Уходит</td></tr></table>
<strong>Современный подход:</strong> S3 + Spark (EMR/Databricks/Glue) = Data Lakehouse.`,
    tags: ["storage", "S3", "HDFS"]
  },
  {
    id: "q_cloud_02", category: "Cloud", level: "senior",
    question: "Что такое Terraform и зачем Infrastructure as Code?",
    answer: `<strong>Terraform</strong> — инструмент для описания инфраструктуры в HCL-файлах и автоматического создания ресурсов.<br><br>
<strong>Зачем IaC:</strong>
<ul><li>Версионирование инфраструктуры в Git (кто, когда, что изменил)</li><li>Воспроизводимость: dev = staging = prod</li><li>Code Review для инфраструктурных изменений</li><li>Автоматизация: CI/CD для инфраструктуры</li></ul>
<pre>resource "aws_s3_bucket" "data_lake" {
  bucket = "company-data-lake"
  tags = { Environment = "prod" }
}

resource "aws_glue_job" "daily_etl" {
  name = "daily-etl"
  role_arn = aws_iam_role.glue.arn
  command { script_location = "s3://scripts/etl.py" }
}</pre>
<strong>Workflow:</strong> terraform plan → review → terraform apply → git commit.`,
    tags: ["terraform", "IaC", "automation"]
  },

  // --- System Design ---
  {
    id: "q_sd_extra_01", category: "System Design", level: "senior",
    question: "Спроектируйте систему real-time fraud detection",
    answer: `<strong>Requirements:</strong> обнаружить мошенническую транзакцию за &lt;5 секунд, 10K+ events/sec.<br><br>
<pre>
[Payment Service] → [Kafka] → [Flink/Spark Streaming] → [Decision]
                                       ↓
[Feature Store (Redis)] ← [Batch ML Training (daily)]

Компоненты:
1. Kafka: буфер транзакций (topic: transactions)
2. Feature Store (Redis): user_avg_amount, user_location, device_fingerprint
3. Streaming Engine (Flink):
   - Enrich: JOIN с features из Redis
   - Rules: amount > 10x avg, new device, foreign country
   - ML Model: load model, score in real-time
4. Decision Service: block / allow / manual review
5. Feedback Loop: human review → retrain model (batch daily)</pre>
<strong>Trade-offs:</strong> Latency vs Accuracy — simple rules (fast, 80%) + ML model (slower, 95%).`,
    tags: ["streaming", "ML", "real-time"]
  },
  {
    id: "q_sd_extra_02", category: "System Design", level: "senior",
    question: "Расскажите про Medallion Architecture (Bronze/Silver/Gold)",
    answer: `<strong>Medallion Architecture</strong> — многослойная организация данных в Data Lakehouse.<br><br>
<strong>Bronze (Raw):</strong>
<ul><li>Данные "как есть" из источника (JSON, CSV, CDC events)</li><li>Append-only, храним всё, никогда не удаляем</li><li>Schema-on-read</li></ul>
<strong>Silver (Cleaned):</strong>
<ul><li>Очищенные: дедупликация, типизация, валидация, стандартизация</li><li>Enriched: JOIN с dimensions</li><li>Ready for analytics, но не для бизнес-пользователей</li></ul>
<strong>Gold (Business):</strong>
<ul><li>Бизнес-агрегации: KPI, метрики, сегменты</li><li>Star Schema для BI</li><li>Feature tables для ML</li><li>Оптимизировано для запросов</li></ul>
<strong>Инструменты:</strong> Bronze (Spark + Iceberg), Silver (dbt + Spark), Gold (dbt).`,
    tags: ["lakehouse", "architecture", "data-layers"]
  },
  {
    id: "q_sd_extra_03", category: "System Design", level: "middle",
    question: "Чем отличается Data Lake от Data Warehouse?",
    answer: `<table><tr><th></th><th>Data Lake</th><th>Data Warehouse</th></tr>
<tr><td>Storage</td><td>S3/GCS (дёшево)</td><td>Proprietary (дорого)</td></tr>
<tr><td>Schema</td><td>Schema-on-read</td><td>Schema-on-write</td></tr>
<tr><td>Данные</td><td>Structured + Unstructured</td><td>Только Structured</td></tr>
<tr><td>Пользователи</td><td>Data Engineers, Data Scientists</td><td>Analysts, Business</td></tr>
<tr><td>Query</td><td>Spark, Presto</td><td>SQL (built-in)</td></tr>
<tr><td>Governance</td><td>Слабая</td><td>Сильная</td></tr></table>
<strong>Современный тренд:</strong> Data Lakehouse (Delta Lake, Iceberg) = дешёвое хранение Lake + ACID/SQL DWH.`,
    tags: ["architecture", "lake", "warehouse"]
  },
  {
    id: "q_sd_extra_04", category: "System Design", level: "senior",
    question: "Как обеспечить data freshness < 5 minutes для аналитики?",
    answer: `<strong>Подход:</strong>
<ol><li><strong>CDC (Debezium)</strong> → Kafka: изменения из PostgreSQL в реальном времени</li>
<li><strong>Kafka → Spark Streaming / Flink:</strong> micro-batch (1-5 min) трансформация</li>
<li><strong>Sink:</strong> ClickHouse / Druid для real-time OLAP запросов</li>
<li><strong>BI Tool:</strong> Superset/Grafana с refresh каждые 1-5 мин</li></ol>
<strong>Альтернатива для простых случаев:</strong>
<ul><li>Materialized Views в PostgreSQL с REFRESH CONCURRENTLY (каждые 5 мин через cron)</li><li>Snowflake Streams + Tasks (serverless micro-batch)</li></ul>
<strong>Trade-off:</strong> Freshness vs Cost vs Complexity. Batch (cheaper, simpler) vs Streaming (complex, expensive).`,
    tags: ["freshness", "streaming", "architecture"]
  },

  // --- DevOps/Docker Advanced ---
  {
    id: "q_devops_extra_01", category: "DevOps", level: "middle",
    question: "Как оптимизировать Docker image для Python ETL?",
    answer: `<strong>Шаги оптимизации:</strong>
<ol><li><strong>Базовый образ:</strong> python:3.11-slim вместо python:3.11 (150MB vs 1GB)</li>
<li><strong>Multi-stage build:</strong> собрать зависимости отдельно, скопировать только нужное</li>
<li><strong>Layer caching:</strong> COPY requirements.txt ДО COPY . (зависимости кешируются)</li>
<li><strong>.dockerignore:</strong> исключить data/, .git/, __pycache__/, .env</li>
<li><strong>pip flags:</strong> --no-cache-dir, --no-compile</li></ol>
<pre>FROM python:3.11-slim AS builder
COPY requirements.txt .
RUN pip install --target=/install --no-cache-dir -r requirements.txt

FROM python:3.11-slim
COPY --from=builder /install /usr/local/lib/python3.11/site-packages
COPY src/ /app/
CMD ["python", "/app/main.py"]</pre>
<strong>Результат:</strong> 150MB вместо 1.5GB.`,
    tags: ["docker", "optimization", "images"]
  },
  {
    id: "q_devops_extra_02", category: "DevOps", level: "senior",
    question: "Что такое Kubernetes и зачем он нужен для data платформ?",
    answer: `<strong>Kubernetes (K8s)</strong> — оркестратор контейнеров, управляет запуском, масштабированием, и восстановлением.<br><br>
<strong>Для Data Engineering:</strong>
<ul><li><strong>Airflow KubernetesExecutor:</strong> каждый task = Pod с нужными зависимостями (изоляция)</li>
<li><strong>Spark on K8s:</strong> динамическое масштабирование cluster'а</li>
<li><strong>CI/CD:</strong> деплой пайплайнов через Helm charts</li>
<li><strong>Autoscaling:</strong> больше ресурсов когда нужно, меньше когда нет</li></ul>
<strong>Ключевые понятия:</strong>
<ul><li><strong>Pod</strong> — минимальная единица (1+ контейнеров)</li>
<li><strong>Deployment</strong> — управление репликами Pod'ов</li>
<li><strong>Service</strong> — сетевой доступ к Pod'ам</li>
<li><strong>ConfigMap/Secret</strong> — конфигурация и секреты</li></ul>`,
    tags: ["kubernetes", "orchestration", "infrastructure"]
  },

  // --- Data Quality Advanced ---
  {
    id: "q_dq_extra_01", category: "Data Quality", level: "middle",
    question: "Что такое Data Contract и зачем он нужен?",
    answer: `<strong>Data Contract</strong> — формальное соглашение между producer и consumer данных, определяющее:<br>
<ul><li><strong>Schema:</strong> структура, типы, обязательные поля</li>
<li><strong>Quality:</strong> допустимый % NULL, дубликатов, freshness</li>
<li><strong>SLA:</strong> задержка обновления, доступность</li>
<li><strong>Ownership:</strong> кто отвечает за данные</li></ul>
<strong>Проблема без контрактов:</strong> Source team меняет схему → ломается downstream ETL → ломаются отчёты.<br><br>
<strong>С контрактом:</strong> Любое изменение проходит review, breaking change → новая версия, notification consumers.`,
    tags: ["contracts", "governance", "communication"]
  },
  {
    id: "q_dq_extra_02", category: "Data Quality", level: "senior",
    question: "Как реализовать Data Lineage на практике?",
    answer: `<strong>Data Lineage</strong> — отслеживание потока данных от источника до конечного использования.<br><br>
<strong>Зачем:</strong>
<ul><li>Определить impact: "если таблица X изменится, что сломается?"</li><li>Debug: "откуда пришла эта кривая цифра?"</li><li>Compliance: GDPR — "где хранятся данные пользователя?"</li></ul>
<strong>Инструменты:</strong>
<ul><li><strong>dbt:</strong> встроенный lineage graph (dbt docs serve)</li>
<li><strong>Apache Atlas:</strong> open-source metadata + lineage</li>
<li><strong>DataHub (LinkedIn):</strong> универсальный data catalog</li>
<li><strong>OpenLineage:</strong> стандарт для lineage metadata</li>
<li><strong>Marquez:</strong> open-source реализация OpenLineage</li></ul>
<strong>На практике:</strong> dbt lineage для SQL + OpenLineage для Spark/Airflow = полная картина.`,
    tags: ["lineage", "governance", "metadata"]
  },

  // --- General / Behavioral ---
  {
    id: "q_gen_01", category: "System Design", level: "junior",
    question: "Чем Data Engineer отличается от Data Analyst и Data Scientist?",
    answer: `<strong>Data Engineer:</strong>
<ul><li>Строит инфраструктуру данных (pipelines, DWH, Data Lake)</li><li>Навыки: SQL, Python, Spark, Airflow, Docker, Cloud</li><li>Фокус: надёжность, масштабируемость, производительность</li></ul>
<strong>Data Analyst:</strong>
<ul><li>Анализирует данные и создаёт отчёты/дашборды</li><li>Навыки: SQL, Excel, BI (Tableau, Looker), базовый Python</li><li>Фокус: бизнес-инсайты, визуализация</li></ul>
<strong>Data Scientist:</strong>
<ul><li>Строит ML модели и статистический анализ</li><li>Навыки: Python, ML (scikit-learn, TensorFlow), статистика</li><li>Фокус: предсказания, эксперименты (A/B)</li></ul>
<strong>Аналогия:</strong> DE строит дороги и мосты. DA ездит по ним и составляет карту. DS строит GPS-навигатор.`,
    tags: ["career", "roles", "overview"]
  },
  {
    id: "q_gen_02", category: "System Design", level: "middle",
    question: "Как вы будете debug'ить медленный ETL пайплайн?",
    answer: `<strong>Чек-лист:</strong>
<ol><li><strong>Определить bottleneck:</strong> какой именно step медленный? (Airflow UI → task duration)</li>
<li><strong>Extract:</strong> API throttling? Неэффективный SQL запрос? Full table scan?</li>
<li><strong>Transform:</strong> Spark Shuffle? Data Skew? Не хватает памяти? (Spark UI → stages)</li>
<li><strong>Load:</strong> Batch insert vs row-by-row? Индексы на target таблице тормозят INSERT?</li></ol>
<strong>Инструменты:</strong>
<ul><li><strong>SQL:</strong> EXPLAIN ANALYZE — найти Seq Scan, высокий cost</li>
<li><strong>Spark:</strong> Spark UI → Stages, Storage, SQL plan</li>
<li><strong>Python:</strong> cProfile, line_profiler, memory_profiler</li>
<li><strong>Airflow:</strong> Task duration, gantt chart, logs</li></ul>
<strong>80/20:</strong> чаще всего проблема в неоптимальном SQL (нет индекса) или Spark Shuffle.`,
    tags: ["debugging", "performance", "practical"]
  },
  {
    id: "q_gen_03", category: "System Design", level: "senior",
    question: "Опишите идеальный CI/CD pipeline для data проекта",
    answer: `<pre>
[Git Push] → [CI Pipeline]
    ├── Lint (sqlfluff, ruff/black, yamllint)
    ├── Unit Tests (pytest)
    ├── dbt compile + dbt test (schema validation)
    ├── Integration Tests (Docker Compose + test data)
    └── Security Scan (Snyk, secrets detection)
         ↓
[Code Review + Approve]
         ↓
[CD Pipeline]
    ├── Deploy to Staging
    ├── dbt run --target staging
    ├── Data Quality checks (GX)
    ├── Smoke tests
    └── Deploy to Production
         ├── dbt run --target prod
         ├── Airflow DAGs sync
         └── Post-deploy monitoring</pre>
<strong>Ключевые практики:</strong>
<ul><li>Staging environment = копия prod (но с masked PII данными)</li>
<li>Blue/Green deployment для Airflow DAGs</li>
<li>Rollback plan: dbt run --select tag:rollback</li>
<li>Alerting: Slack notification при deploy success/failure</li></ul>`,
    tags: ["CICD", "automation", "devops"]
  },
  {
    id: "q_gen_04", category: "Data Quality", level: "middle",
    question: "Как обеспечить качество данных в ETL pipeline?",
    answer: `<strong>Многоуровневая стратегия:</strong>
<ol><li><strong>Source validation:</strong> Проверить данные ДО загрузки (schema, format, row count)</li>
<li><strong>Transform checks:</strong> Assertions в коде (assert df.shape[0] > 0, assert no nulls in PK)</li>
<li><strong>dbt tests:</strong> unique, not_null, relationships, accepted_values</li>
<li><strong>Great Expectations:</strong> Distributions, outliers, freshness</li>
<li><strong>Post-load monitoring:</strong> Volume anomaly detection, freshness alerts</li></ol>
<pre># Python assertions в ETL
def transform(df):
    assert df.shape[0] > 0, "Empty DataFrame!"
    assert df["user_id"].notna().all(), "NULL user_ids found!"
    assert df["amount"].between(0, 1_000_000).all(), "Amount out of range!"
    
    # Бизнес-правило
    assert (df["end_date"] >= df["start_date"]).all(), "Invalid date range!"
    return df</pre>
<strong>Правило:</strong> Лучше пайплайн упадёт рано, чем плохие данные попадут в отчёт.`,
    tags: ["quality", "testing", "pipeline"]
  },
  {
    id: "q_gen_05", category: "Kafka", level: "senior",
    question: "Чем Kafka отличается от RabbitMQ?",
    answer: `<table><tr><th></th><th>Kafka</th><th>RabbitMQ</th></tr>
<tr><td>Модель</td><td>Distributed log (pull)</td><td>Message broker (push)</td></tr>
<tr><td>Хранение</td><td>Хранит сообщения (дни/недели)</td><td>Удаляет после обработки</td></tr>
<tr><td>Throughput</td><td>Миллионы msg/sec</td><td>Тысячи msg/sec</td></tr>
<tr><td>Replay</td><td>✅ Можно перечитать</td><td>❌ Нельзя</td></tr>
<tr><td>Consumer Groups</td><td>✅ Масштабируемые</td><td>❌ Один consumer</td></tr>
<tr><td>Use case</td><td>Event streaming, CDC, log</td><td>Task queue, RPC</td></tr></table>
<strong>Для DE:</strong> Kafka — стандарт для streaming data pipelines. RabbitMQ — для microservices communication.`,
    tags: ["messaging", "comparison", "streaming"]
  },
  {
    id: "q_gen_06", category: "Python", level: "senior",
    question: "Сравните Pandas, Polars и DuckDB для обработки данных",
    answer: `<table><tr><th></th><th>Pandas</th><th>Polars</th><th>DuckDB</th></tr>
<tr><td>Язык</td><td>Python</td><td>Rust → Python API</td><td>C++ → SQL + Python</td></tr>
<tr><td>Скорость</td><td>1x</td><td>5-50x</td><td>10-100x</td></tr>
<tr><td>Память</td><td>Много (копии)</td><td>Эффективно (Arrow)</td><td>Очень эффективно</td></tr>
<tr><td>Lazy eval</td><td>❌</td><td>✅</td><td>✅ (SQL optimizer)</td></tr>
<tr><td>Лимит</td><td>~10GB</td><td>~100GB</td><td>~100GB (on disk)</td></tr>
<tr><td>Интерфейс</td><td>DataFrame API</td><td>DataFrame API</td><td>SQL + DataFrame</td></tr></table>
<strong>Когда что:</strong>
<ul><li>Pandas: legacy код, &lt;1GB, быстрое прототипирование</li><li>Polars: 1-50GB, performance critical, Python API</li><li>DuckDB: 1-100GB, SQL preferred, встроен в Python</li><li>Spark: &gt;100GB, распределённый кластер</li></ul>`,
    tags: ["tools", "comparison", "performance"]
  },
  {
    id: "q_gen_07", category: "SQL", level: "junior",
    question: "Что такое NULL и какие подводные камни?",
    answer: `<strong>NULL</strong> — отсутствие значения (не 0, не пустая строка).<br><br>
<strong>Подводные камни:</strong>
<ul><li>NULL = NULL → НЕ TRUE! Нужноу использовать IS NULL</li>
<li>Агрегации: COUNT(*) считает все строки, COUNT(column) пропускает NULL</li>
<li>WHERE x != 5 НЕ вернёт строки с x = NULL</li>
<li>ORDER BY: NULL'ы идут первыми или последними (зависит от СУБД)</li></ul>
<pre>SELECT * FROM users WHERE email IS NULL;

-- COALESCE: заменить NULL значением по умолчанию
SELECT COALESCE(phone, email, 'no_contact') as contact FROM users;

-- NULLIF: вернуть NULL если два значения равны
SELECT NULLIF(status, 'unknown') FROM orders;</pre>`,
    tags: ["NULL", "basics", "gotchas"]
  },
  {
    id: "q_gen_08", category: "Spark", level: "junior",
    question: "Что такое Parquet и почему он лучше CSV?",
    answer: `<strong>Parquet</strong> — колоночный бинарный формат файлов.<br><br>
<strong>Преимущества над CSV:</strong>
<ul><li><strong>Сжатие:</strong> 10x меньше размер (columns с повторяющимися значениями → dictionary encoding)</li>
<li><strong>Column pruning:</strong> Читает только нужные столбцы (CSV читает ВСЁ)</li>
<li><strong>Predicate pushdown:</strong> Пропускает row groups по min/max статистике</li>
<li><strong>Типизация:</strong> Хранит типы данных (INT, STRING, TIMESTAMP), CSV — всё строки</li>
<li><strong>Schema:</strong> Встроенная схема в файл</li></ul>
<pre># Сравнение размера
data.csv:     1.2 GB
data.parquet: 120 MB (10x сжатие)

# Скорость: SELECT city, revenue FROM data
CSV:     12 секунд (читает все 50 столбцов)
Parquet: 0.3 секунды (читает только 2 столбца)</pre>
<strong>Правило:</strong> В Data Engineering ВСЕГДА используйте Parquet вместо CSV.`,
    tags: ["formats", "parquet", "performance"]
  }
];
