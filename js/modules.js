// ============================================
// MODULES DATA — Lectures & Labs content
// FULL CONTENT for all 12 modules
// ============================================

const MODULES_DATA = [
  // ====== MODULE 1: SQL ======
  {
    id: 1, title: "SQL — Основы и продвинутый SQL", icon: "🗃️", level: "junior",
    description: "От SELECT до оконных функций и оптимизации запросов",
    totalLectures: 3, totalTasks: 15,
    lectures: [
      {
        id: 1, title: "Основы SQL: SELECT, JOIN, GROUP BY",
        content: `
<h2>Основы SQL для Data Engineer</h2>
<p>SQL — это <strong>главный инструмент</strong> Data Engineer'а. Даже если вы работаете с Spark или Python, понимание SQL необходимо для проектирования схем, написания трансформаций и аналитических запросов.</p>

<h3>SELECT — основа всего</h3>
<p>Порядок <em>выполнения</em> SQL запроса (не путать с порядком написания!):</p>
<ol>
<li><strong>FROM / JOIN</strong> — откуда берём данные</li>
<li><strong>WHERE</strong> — фильтрация строк</li>
<li><strong>GROUP BY</strong> — группировка</li>
<li><strong>HAVING</strong> — фильтрация групп</li>
<li><strong>SELECT</strong> — выбор столбцов</li>
<li><strong>DISTINCT</strong> — уникальность</li>
<li><strong>ORDER BY</strong> — сортировка</li>
<li><strong>LIMIT</strong> — ограничение</li>
</ol>

<div class="info-box tip">
<strong>💡 Важно:</strong> Именно поэтому нельзя использовать алиас из SELECT в WHERE — SELECT выполняется позже!
</div>

<div class="code-block"><div class="code-block-header"><span class="code-block-lang">SQL</span></div><pre><code>-- Базовый SELECT
SELECT name, salary
FROM employees
WHERE department = 'Engineering'
ORDER BY salary DESC
LIMIT 10;

-- С агрегацией
SELECT 
    department,
    COUNT(*) as emp_count,
    AVG(salary) as avg_salary,
    MAX(salary) as max_salary
FROM employees
WHERE is_active = true
GROUP BY department
HAVING COUNT(*) > 5
ORDER BY avg_salary DESC;</code></pre></div>

<h3>JOIN — соединение таблиц</h3>
<p>JOIN — операция соединения строк из двух (или более) таблиц по условию.</p>

<div class="code-block"><div class="code-block-header"><span class="code-block-lang">SQL</span></div><pre><code>-- INNER JOIN: только совпадения
SELECT o.id, c.name, o.amount
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id;

-- LEFT JOIN: все из левой + совпадения из правой
SELECT o.id, COALESCE(c.name, 'Unknown') as customer
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.id;

-- Multiple JOINs
SELECT 
    o.id, c.name as customer, p.name as product,
    o.quantity * p.price as total
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN products p ON o.product_id = p.id;</code></pre></div>

<div class="info-box warning">
<strong>⚠️ Частая ошибка:</strong> если забыть условие ON при JOIN, получится CROSS JOIN (декартово произведение) — огромный результат!
</div>

<h3>Подзапросы и CTE</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">SQL</span></div><pre><code>-- CTE (Common Table Expression) — именованный подзапрос
WITH high_earners AS (
    SELECT * FROM employees WHERE salary > 80000
),
dept_stats AS (
    SELECT department, COUNT(*) as cnt, AVG(salary) as avg_sal
    FROM high_earners GROUP BY department
)
SELECT * FROM dept_stats WHERE cnt > 3;

-- UNION ALL: объединение без дедупликации (быстрее)
SELECT city FROM customers
UNION ALL
SELECT city FROM suppliers;</code></pre></div>
`
      },
      {
        id: 2, title: "Оконные функции",
        content: `
<h2>Оконные функции (Window Functions)</h2>
<p>Оконные функции — это <strong>суперсила SQL</strong>. Они выполняют вычисления по "окну" строк, связанных с текущей строкой, <em>без группировки</em>.</p>

<div class="info-box info">
<strong>Ключевое отличие от GROUP BY:</strong> GROUP BY сворачивает строки в одну. Оконная функция оставляет все строки и добавляет вычисленное значение.
</div>

<h3>Функции ранжирования</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">SQL</span></div><pre><code>SELECT 
    name, department, salary,
    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) as row_num,
    RANK() OVER (PARTITION BY department ORDER BY salary DESC) as rnk,
    DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) as dense_rnk
FROM employees;</code></pre></div>

<h3>LAG и LEAD — доступ к соседним строкам</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">SQL</span></div><pre><code>SELECT 
    month, revenue,
    LAG(revenue) OVER (ORDER BY month) as prev_month,
    revenue - LAG(revenue) OVER (ORDER BY month) as growth
FROM monthly_sales;</code></pre></div>

<h3>Running Total и Moving Average</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">SQL</span></div><pre><code>SELECT 
    date, amount,
    SUM(amount) OVER (ORDER BY date) as running_total,
    AVG(amount) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as moving_avg_7d
FROM daily_sales;</code></pre></div>

<h3>Дедупликация (частая задача DE)</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">SQL</span></div><pre><code>WITH ranked AS (
    SELECT *, ROW_NUMBER() OVER (
        PARTITION BY user_id ORDER BY event_timestamp DESC
    ) as rn
    FROM raw_events
)
SELECT * FROM ranked WHERE rn = 1;</code></pre></div>
`
      },
      {
        id: 3, title: "Индексы и оптимизация запросов",
        content: `
<h2>Оптимизация SQL запросов</h2>
<p>Правильная оптимизация может ускорить запрос в <strong>1000x</strong>.</p>

<h3>Индексы</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">SQL</span></div><pre><code>CREATE INDEX idx_orders_user_id ON orders(user_id);

-- Composite index (порядок столбцов важен!)
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);
-- Работает: WHERE user_id = 5 AND created_at > '2024-01-01'
-- НЕ работает: WHERE created_at > '2024-01-01' (без user_id)</code></pre></div>

<div class="info-box warning">
<strong>⚠️ Индексы замедляют INSERT/UPDATE!</strong> Не создавайте индексы "на всякий случай".
</div>

<h3>EXPLAIN ANALYZE</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">SQL</span></div><pre><code>EXPLAIN ANALYZE
SELECT u.name, COUNT(o.id) 
FROM users u JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01'
GROUP BY u.name;
-- Seq Scan → полный скан (плохо), Index Scan → хорошо</code></pre></div>

<h3>Партиционирование</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">SQL</span></div><pre><code>CREATE TABLE events (
    id BIGINT, event_date DATE, data JSONB
) PARTITION BY RANGE (event_date);

CREATE TABLE events_2024_q1 PARTITION OF events
    FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');</code></pre></div>

<h3>Чек-лист оптимизации</h3>
<ul>
<li>Не используйте <code>SELECT *</code> — только нужные столбцы</li>
<li><code>EXISTS</code> вместо <code>IN</code> для подзапросов</li>
<li>Фильтруйте как можно раньше (WHERE до JOIN)</li>
<li>Индексы на столбцах в WHERE, JOIN, ORDER BY</li>
<li>Партиционирование для таблиц > 100M строк</li>
</ul>
`
      }
    ],
    lab: {
      title: "Проект: E-commerce Data Warehouse",
      description: "Спроектируйте Star Schema для онлайн-магазина — DDL, данные, 10 SQL запросов.",
      steps: [
        { title: "Star Schema", description: "fact_orders + dim_customer, dim_product, dim_date, dim_store." },
        { title: "DDL", description: "CREATE TABLE для всех таблиц с PK и FK." },
        { title: "Данные", description: "INSERT 500+ строк в fact, 50-100 в dimensions." },
        { title: "Аналитика", description: "10 SQL запросов: топ продукты, MoM рост, retention, RFM." },
        { title: "Оптимизация", description: "Индексы + EXPLAIN ANALYZE." }
      ]
    }
  },

  // ====== MODULE 2: Python ======
  {
    id: 2, title: "Python для Data Engineering", icon: "🐍", level: "junior",
    description: "Python как инструмент дата-инженера: структуры данных, файлы, pandas",
    totalLectures: 3, totalTasks: 10,
    lectures: [
      { id: 1, title: "Структуры данных и функции", content: `
<h2>Python для Data Engineering</h2>
<p>Python — второй по важности инструмент DE после SQL. Нам важны <strong>надёжность, производительность и чистота кода</strong>.</p>

<h3>Структуры данных</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">Python</span></div><pre><code># dict — O(1) lookup. Основа для маппингов
column_mapping = {"user_id": "id", "user_name": "name"}

# set — O(1) проверка принадлежности. Для дедупликации
seen_ids = set()
for record in stream:
    if record["id"] not in seen_ids:
        seen_ids.add(record["id"])
        process(record)

# defaultdict — автоматическое значение по умолчанию
from collections import defaultdict, Counter
groups = defaultdict(list)
for item in data:
    groups[item["category"]].append(item)

# Counter — подсчёт частот
word_freq = Counter(text.split())
print(word_freq.most_common(5))</code></pre></div>

<h3>Генераторы — обработка больших данных</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">Python</span></div><pre><code># Генератор — ленивая обработка, экономит RAM
def read_large_csv(filepath, chunksize=10000):
    with open(filepath) as f:
        header = f.readline().strip().split(",")
        chunk = []
        for line in f:
            chunk.append(dict(zip(header, line.strip().split(","))))
            if len(chunk) >= chunksize:
                yield chunk
                chunk = []
        if chunk:
            yield chunk

# Использование
for batch in read_large_csv("huge_file.csv"):
    process_batch(batch)  # обрабатываем по 10K строк</code></pre></div>

<h3>Декораторы</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">Python</span></div><pre><code>import functools, time

def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        print(f"{func.__name__}: {time.perf_counter()-start:.2f}s")
        return result
    return wrapper

@timer
def etl_pipeline():
    extract(); transform(); load()</code></pre></div>
` },
      { id: 2, title: "Работа с файлами и API", content: `
<h2>Работа с файлами</h2>

<h3>CSV, JSON, Parquet</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">Python</span></div><pre><code>import csv, json

# CSV с DictReader
with open("data.csv") as f:
    for row in csv.DictReader(f):
        print(row["name"], row["salary"])

# JSON Lines (JSONL) — по строкам (для больших файлов)
def read_jsonl(path):
    with open(path) as f:
        for line in f:
            yield json.loads(line)

# Parquet (через pandas)
import pandas as pd
df = pd.read_parquet("data.parquet")
df.to_parquet("output.parquet", compression="snappy")</code></pre></div>

<h3>HTTP API</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">Python</span></div><pre><code>import requests
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(stop=stop_after_attempt(3), wait=wait_exponential(min=2, max=60))
def fetch_data(url):
    resp = requests.get(url, timeout=30)
    resp.raise_for_status()
    return resp.json()

# Пагинация
def fetch_all_pages(base_url):
    page, all_data = 1, []
    while True:
        data = fetch_data(f"{base_url}?page={page}")
        if not data["results"]:
            break
        all_data.extend(data["results"])
        page += 1
    return all_data</code></pre></div>

<h3>Context Managers для ресурсов</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">Python</span></div><pre><code>from contextlib import contextmanager

@contextmanager
def db_connection(conn_str):
    conn = psycopg2.connect(conn_str)
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

with db_connection("host=localhost dbname=mydb") as conn:
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")</code></pre></div>
` },
      { id: 3, title: "Pandas для ETL", content: `
<h2>Pandas для ETL</h2>
<p>Pandas — швейцарский нож для обработки данных до ~10GB.</p>

<h3>Чтение и базовые операции</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">Python</span></div><pre><code>import pandas as pd

df = pd.read_csv("orders.csv", parse_dates=["created_at"])
df.info()           # типы, память
df.isnull().sum()   # пропуски

# Фильтрация = WHERE
active = df[df["status"] == "active"]
high = df[(df["amount"] > 1000) & (df["region"] == "EU")]

# GROUP BY
revenue = df.groupby("category")["amount"].agg(["sum", "mean", "count"])

# Merge = JOIN
result = pd.merge(orders, customers, left_on="cust_id", right_on="id", how="left")</code></pre></div>

<h3>Чтение больших файлов</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">Python</span></div><pre><code># chunksize для файлов, не влезающих в RAM
for chunk in pd.read_csv("huge.csv", chunksize=100_000):
    result = chunk.groupby("category")["amount"].sum()
    save_result(result)

# Оптимизация памяти
df["category"] = df["category"].astype("category")
df["id"] = pd.to_numeric(df["id"], downcast="integer")</code></pre></div>

<div class="info-box tip">
<strong>💡 Правило:</strong> < 1GB → Pandas, 1-100GB → Polars/DuckDB, > 100GB → Spark
</div>
` }
    ],
    lab: { title: "ETL-пайплайн на Python", description: "CSV → очистка → трансформация → Parquet.", steps: [
      { title: "Extract", description: "Загрузите CSV с транзакциями." },
      { title: "Validate", description: "Проверьте типы, NULL, дубликаты." },
      { title: "Transform", description: "Очистите данные, добавьте вычисляемые столбцы." },
      { title: "Aggregate", description: "Создайте витрины: по дням, категориям." },
      { title: "Load", description: "Сохраните в Parquet." }
    ]}
  },

  // ====== MODULE 3: Data Modeling ======
  {
    id: 3, title: "Data Modeling & Warehousing", icon: "🏗️", level: "junior",
    description: "Star Schema, Snowflake, SCD, Data Vault — проектирование хранилищ",
    totalLectures: 3, totalTasks: 10,
    lectures: [
      { id: 1, title: "Нормализация и денормализация", content: `
<h2>Нормализация</h2>
<p>Нормализация — процесс организации данных для устранения избыточности.</p>

<h3>Нормальные формы</h3>
<p><strong>1NF:</strong> Атомарные значения, нет повторяющихся групп.</p>
<p><strong>2NF:</strong> 1NF + все неключевые атрибуты зависят от полного первичного ключа.</p>
<p><strong>3NF:</strong> 2NF + нет транзитивных зависимостей (A→B→C).</p>

<div class="info-box info">
<strong>OLTP</strong> — нормализованные (3NF). <strong>DWH</strong> — денормализованные (Star Schema) для скорости аналитики.
</div>

<h3>Fact и Dimension таблицы</h3>
<p><strong>Fact</strong> — измеримые события/транзакции (числа). Очень большая.</p>
<p><strong>Dimension</strong> — описательные атрибуты (контекст). Небольшая.</p>

<div class="code-block"><div class="code-block-header"><span class="code-block-lang">SQL</span></div><pre><code>-- Fact table
CREATE TABLE fact_orders (
    order_id INT, date_key INT, customer_key INT, product_key INT,
    quantity INT, unit_price DECIMAL(10,2), total_amount DECIMAL(10,2)
);

-- Dimension table
CREATE TABLE dim_customer (
    customer_key SERIAL PRIMARY KEY,
    customer_id INT, name TEXT, email TEXT, city TEXT, segment TEXT
);

-- Dimension: date
CREATE TABLE dim_date (
    date_key INT PRIMARY KEY,
    date DATE, month INT, quarter INT, year INT,
    day_of_week TEXT, is_holiday BOOLEAN
);</code></pre></div>
` },
      { id: 2, title: "Star Schema и SCD", content: `
<h2>Star Schema</h2>
<p>Центральная fact-таблица + денормализованные dimension-таблицы.</p>

<h3>Star vs Snowflake</h3>
<p><strong>Star:</strong> Dimension денормализованы → меньше JOIN → быстрее запросы. <em>Стандарт в 90% DWH.</em></p>
<p><strong>Snowflake:</strong> Dimension нормализованы → больше JOIN, но меньше избыточности.</p>

<h3>SCD (Slowly Changing Dimensions)</h3>
<p><strong>Type 1:</strong> Перезаписать старое значение (потеря истории).</p>
<p><strong>Type 2:</strong> Новая строка с valid_from / valid_to / is_current (полная история).</p>
<p><strong>Type 3:</strong> Дополнительные столбцы (current_city, previous_city).</p>

<div class="code-block"><div class="code-block-header"><span class="code-block-lang">SQL</span></div><pre><code>-- SCD Type 2
CREATE TABLE dim_customer (
    surrogate_key SERIAL PRIMARY KEY,
    customer_id INT,        -- натуральный ключ
    name TEXT, city TEXT,
    valid_from DATE, valid_to DATE DEFAULT '9999-12-31',
    is_current BOOLEAN DEFAULT TRUE
);

-- Обновление: закрыть старую версию + вставить новую
UPDATE dim_customer SET valid_to = CURRENT_DATE - 1, is_current = FALSE
WHERE customer_id = 123 AND is_current = TRUE;

INSERT INTO dim_customer (customer_id, name, city, valid_from, is_current)
VALUES (123, 'Alice', 'Berlin', CURRENT_DATE, TRUE);</code></pre></div>
` },
      { id: 3, title: "Data Vault 2.0 и Medallion", content: `
<h2>Data Vault 2.0</h2>
<p><strong>Hub</strong> — бизнес-ключи. <strong>Link</strong> — связи. <strong>Satellite</strong> — атрибуты с историей.</p>

<div class="info-box tip">
<strong>Data Vault vs Kimball:</strong> Data Vault — гибче, лучше для agile. Kimball (Star) — проще, быстрее запросы. На практике: Raw → Data Vault → Star Schema (marts).
</div>

<h3>Medallion Architecture (Bronze/Silver/Gold)</h3>
<p><strong>Bronze:</strong> Сырые данные "как есть" из источника.</p>
<p><strong>Silver:</strong> Очищенные — дедупликация, типизация, валидация.</p>
<p><strong>Gold:</strong> Бизнес-агрегации — KPI, метрики, готово для BI.</p>

<div class="code-block"><div class="code-block-header"><span class="code-block-lang">текст</span></div><pre><code>[Sources] → Bronze (raw) → Silver (cleaned) → Gold (business) → [BI/ML]

Bronze: raw_orders, raw_customers (JSON/CSV, as-is)
Silver: clean_orders, clean_customers (typed, deduped, joined)
Gold:   daily_revenue, customer_ltv, product_performance</code></pre></div>

<h3>ETL vs ELT</h3>
<p><strong>ETL:</strong> Трансформация ДО загрузки в хранилище (Informatica, Python).</p>
<p><strong>ELT:</strong> Загрузка "как есть", трансформация ВНУТРИ хранилища (dbt, SQL).</p>
<p><em>Современный тренд:</em> ELT + dbt для Cloud DWH (Snowflake, BigQuery).</p>
` }
    ],
    lab: { title: "DWH для онлайн-кинотеатра", description: "Спроектируйте полный Data Warehouse.", steps: [
      { title: "Бизнес-требования", description: "KPI: DAU, retention, revenue, churn." },
      { title: "Star Schema", description: "fact_views, fact_subscriptions + dimensions." },
      { title: "DDL", description: "CREATE TABLE со всеми связями." },
      { title: "SCD Type 2", description: "Реализуйте историю изменений для dim_subscriber." },
      { title: "ETL-скрипт", description: "Python скрипт загрузки данных." }
    ]}
  },

  // ====== MODULE 4: Linux & Git ======
  {
    id: 4, title: "Linux, Git & CLI", icon: "💻", level: "junior",
    description: "Командная строка, bash-скрипты, Git workflow",
    totalLectures: 2, totalTasks: 8,
    lectures: [
      { id: 1, title: "Bash и Linux", content: `
<h2>Linux для Data Engineer</h2>

<h3>Основные команды</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">Bash</span></div><pre><code># Навигация и файлы
ls -la          # список файлов с деталями
cd /data        # перейти в директорию
mkdir -p a/b/c  # создать вложенные директории
find . -name "*.csv" -size +100M  # поиск больших CSV

# Обработка текста — MUST KNOW
grep -i "error" app.log           # найти строки (case-insensitive)
grep -c "ERROR" app.log           # подсчитать совпадения
awk '{print $1, $3}' access.log   # вывести 1-й и 3-й столбцы
sed 's/old/new/g' file.txt        # замена текста
wc -l data.csv                    # подсчёт строк

# Pipe — конвейер (суперсила!)
cat access.log | grep "404" | awk '{print $7}' | sort | uniq -c | sort -rn | head</code></pre></div>

<h3>Работа с процессами</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">Bash</span></div><pre><code># Фоновые процессы
python etl.py &              # запустить в фоне
nohup python etl.py &        # не убивать при закрытии терминала
jobs                         # список фоновых задач

# Мониторинг
top / htop                   # CPU и RAM
df -h                        # диск
du -sh /data/*               # размер директорий
free -h                      # свободная память

# Cron — планировщик
crontab -e
# Каждый день в 2:00
0 2 * * * /home/user/etl.sh >> /var/log/etl.log 2>&1</code></pre></div>

<h3>Bash-скрипты</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">Bash</span></div><pre><code>#!/bin/bash
set -euo pipefail  # остановиться при ошибке

DATE=$(date +%Y-%m-%d)
LOG="/var/log/etl_$DATE.log"

echo "[$(date)] Starting ETL..." >> $LOG

python3 /app/extract.py --date "$DATE" >> $LOG 2>&1
python3 /app/transform.py --date "$DATE" >> $LOG 2>&1
python3 /app/load.py --date "$DATE" >> $LOG 2>&1

echo "[$(date)] ETL completed!" >> $LOG</code></pre></div>
` },
      { id: 2, title: "Git для команды", content: `
<h2>Git Workflow для Data Engineering</h2>

<h3>Git Flow для DE команды</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">Bash</span></div><pre><code># Создать feature branch
git checkout -b feature/new-pipeline

# Работать, коммитить
git add .
git commit -m "feat: add daily ETL pipeline for user_events"

# Push и создать PR
git push origin feature/new-pipeline
# → Pull Request → Code Review → Merge

# Conventional commits
feat: новая функциональность
fix: исправление бага
refactor: рефакторинг без изменения поведения
docs: документация
test: тесты</code></pre></div>

<h3>Полезные операции</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">Bash</span></div><pre><code># Stash — отложить изменения
git stash
git stash pop

# Rebase — чистая история
git rebase main

# Откатить последний коммит (сохранив изменения)
git reset --soft HEAD~1

# Посмотреть изменения
git log --oneline -10
git diff main..feature/my-branch</code></pre></div>

<h3>.gitignore для DE проектов</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">текст</span></div><pre><code># .gitignore
*.csv
*.parquet
*.json
__pycache__/
.env
.venv/
*.pyc
logs/
data/raw/</code></pre></div>
` }
    ],
    lab: { title: "Автоматизация с cron и bash", description: "Bash-скрипт + cron + Git для ETL.", steps: [
      { title: "Bash-скрипт", description: "Напишите скрипт сбора данных с API." },
      { title: "Cron", description: "Настройте ежедневный запуск." },
      { title: "Логирование", description: "Добавьте логи и алерт при ошибке." },
      { title: "Git", description: "Версионируйте код, настройте .gitignore." }
    ]}
  },

  // =============================================
  // ====== MODULE 5: Docker ======
  // =============================================
  {
    id: 5, title: "Docker & Контейнеризация", icon: "🐳", level: "middle",
    description: "Dockerfile, Docker Compose, multi-container стеки",
    totalLectures: 2, totalTasks: 6,
    lectures: [
      { id: 1, title: "Docker основы", content: `
<h2>Docker для Data Engineering</h2>
<p>Docker гарантирует: <strong>"работает на моей машине" = работает везде</strong>.</p>

<h3>Контейнер vs Виртуальная машина</h3>
<ul>
<li><strong>Контейнер:</strong> изоляция на уровне процесса, МБ, запуск за секунды</li>
<li><strong>VM:</strong> полная изоляция (свой ОС), ГБ, запуск за минуты</li>
</ul>

<h3>Dockerfile — инструкция для сборки образа</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">Dockerfile</span></div><pre><code># 1. Базовый образ
FROM python:3.11-slim

# 2. Рабочая директория
WORKDIR /app

# 3. Зависимости (кешируются отдельно!)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Код приложения
COPY . .

# 5. Переменные окружения
ENV PYTHONUNBUFFERED=1

# 6. Команда запуска
CMD ["python", "etl.py"]</code></pre></div>

<div class="info-box tip">
<strong>💡 Layer caching:</strong> Порядок инструкций важен! Сначала requirements.txt, потом код. Так при изменении кода Docker не переустанавливает зависимости.
</div>

<h3>Multi-stage builds (для продакшена)</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">Dockerfile</span></div><pre><code># Stage 1: Build
FROM python:3.11 AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --target=/install -r requirements.txt

# Stage 2: Runtime (маленький образ)
FROM python:3.11-slim
COPY --from=builder /install /usr/local/lib/python3.11/site-packages
COPY . /app
WORKDIR /app
CMD ["python", "etl.py"]</code></pre></div>

<h3>Основные команды</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">Bash</span></div><pre><code># Сборка образа
docker build -t my-etl:v1 .

# Запуск контейнера
docker run -d --name etl my-etl:v1

# Переменные окружения и volumes
docker run -d \\
  -e DATABASE_URL=postgresql://host:5432/db \\
  -v $(pwd)/data:/app/data \\
  my-etl:v1

# Просмотр логов
docker logs -f etl

# Зайти внутрь контейнера
docker exec -it etl bash

# Очистка
docker system prune -a  # удалить все неиспользуемые</code></pre></div>
` },
      { id: 2, title: "Docker Compose", content: `
<h2>Docker Compose — Multi-container стеки</h2>
<p>Один YAML файл для запуска PostgreSQL + Airflow + Python ETL + pgAdmin.</p>

<div class="code-block"><div class="code-block-header"><span class="code-block-lang">YAML</span></div><pre><code># docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: analytics
      POSTGRES_USER: etl_user
      POSTGRES_PASSWORD: secret
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U etl_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  etl:
    build: ./etl
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://etl_user:secret@postgres:5432/analytics
    volumes:
      - ./data:/app/data

  pgadmin:
    image: dpage/pgadmin4
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    depends_on:
      - postgres

  jupyter:
    image: jupyter/scipy-notebook
    ports:
      - "8888:8888"
    volumes:
      - ./notebooks:/home/jovyan/work

volumes:
  pgdata:</code></pre></div>

<h3>Команды</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">Bash</span></div><pre><code># Запустить всё
docker compose up -d

# Посмотреть статус
docker compose ps

# Логи конкретного сервиса
docker compose logs -f etl

# Пересобрать один сервис
docker compose build etl
docker compose up -d etl

# Остановить и удалить
docker compose down -v  # -v удаляет volumes</code></pre></div>

<div class="info-box warning">
<strong>⚠️ Production:</strong> Не храните пароли в docker-compose.yml! Используйте .env файлы или Docker Secrets.
</div>

<h3>Networking в Docker</h3>
<p>Сервисы в одном docker-compose файле видят друг друга по имени сервиса:</p>
<ul>
<li><code>postgres:5432</code> — не localhost!</li>
<li><code>etl</code> обращается к <code>postgres</code>, а не к <code>localhost</code></li>
<li>Ports mapping: <code>5432:5432</code> = host_port:container_port</li>
</ul>
` }
    ],
    lab: { title: "Полный стек в Docker", description: "PostgreSQL + Python ETL + Jupyter + pgAdmin", steps: [
      { title: "Dockerfile для ETL", description: "Напишите Dockerfile для Python ETL скрипта." },
      { title: "docker-compose.yml", description: "PostgreSQL + ETL + pgAdmin + Jupyter." },
      { title: "init.sql", description: "Скрипт инициализации БД." },
      { title: "Volumes", description: "Настройте persistent storage для данных." },
      { title: "Запуск и тест", description: "docker compose up -d и проверьте все сервисы." }
    ]}
  },

  // ====== MODULE 6: Airflow ======
  {
    id: 6, title: "Apache Airflow", icon: "🌊", level: "middle",
    description: "DAG, операторы, идемпотентность, мониторинг пайплайнов",
    totalLectures: 3, totalTasks: 8,
    lectures: [
      { id: 1, title: "Архитектура Airflow", content: `
<h2>Apache Airflow — оркестратор #1</h2>
<p>Airflow управляет <strong>когда, в каком порядке и с какими зависимостями</strong> запускать задачи.</p>

<h3>Компоненты</h3>
<ul>
<li><strong>Scheduler</strong> — планирует и запускает DAGs по расписанию</li>
<li><strong>Executor</strong> — выполняет задачи (Local, Celery, Kubernetes)</li>
<li><strong>Web Server</strong> — UI для мониторинга</li>
<li><strong>Metadata DB</strong> — PostgreSQL с состоянием (DAG runs, task instances)</li>
<li><strong>Worker</strong> — процесс, выполняющий tasks</li>
</ul>

<h3>DAG (Directed Acyclic Graph)</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">Python</span></div><pre><code>from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta

default_args = {
    'owner': 'data-team',
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
    'email_on_failure': True,
    'email': ['data-team@company.com']
}

with DAG(
    dag_id='daily_etl',
    start_date=datetime(2024, 1, 1),
    schedule_interval='@daily',  # или cron: '0 2 * * *'
    catchup=False,               # не запускать за прошлые даты
    default_args=default_args,
    tags=['etl', 'production']
) as dag:

    extract = PythonOperator(
        task_id='extract',
        python_callable=extract_fn
    )
    
    transform = PythonOperator(
        task_id='transform',
        python_callable=transform_fn
    )
    
    load = PythonOperator(
        task_id='load',
        python_callable=load_fn
    )
    
    extract >> transform >> load  # зависимости</code></pre></div>

<div class="info-box info">
<strong>Почему ациклический?</strong> Нет циклов (A→B→C→A невозможно). Это гарантирует, что пайплайн завершится и scheduler может определить порядок.
</div>
` },
      { id: 2, title: "Операторы и Sensors", content: `
<h2>Operators & Sensors</h2>

<h3>Основные операторы</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">Python</span></div><pre><code>from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from airflow.providers.postgres.operators.postgres import PostgresOperator
from airflow.operators.email import EmailOperator

# Python — вызов функции
extract = PythonOperator(
    task_id='extract',
    python_callable=extract_data,
    op_kwargs={'date': '{{ ds }}'}  # Jinja template
)

# Bash — shell команда
dbt_run = BashOperator(
    task_id='dbt_run',
    bash_command='cd /dbt && dbt run --select daily_metrics'
)

# SQL — выполнить запрос
create_table = PostgresOperator(
    task_id='create_staging',
    postgres_conn_id='my_postgres',
    sql='sql/create_staging.sql'
)</code></pre></div>

<h3>XCom — передача данных между tasks</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">Python</span></div><pre><code>def extract(**context):
    data = fetch_from_api()
    # Пушим маленькие данные (метаданные, путь к файлу)
    context['ti'].xcom_push(key='file_path', value='s3://bucket/data.parquet')
    context['ti'].xcom_push(key='record_count', value=len(data))

def transform(**context):
    path = context['ti'].xcom_pull(task_ids='extract', key='file_path')
    count = context['ti'].xcom_pull(task_ids='extract', key='record_count')
    print(f"Processing {count} records from {path}")</code></pre></div>

<div class="info-box warning">
<strong>⚠️ XCom ≠ передача DataFrame!</strong> XCom хранится в metadata DB. Для больших данных используйте S3/GCS — передавайте только путь через XCom.
</div>

<h3>Sensors — ожидание условий</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">Python</span></div><pre><code>from airflow.sensors.filesystem import FileSensor
from airflow.sensors.external_task import ExternalTaskSensor

# Ждать появления файла
wait_file = FileSensor(
    task_id='wait_for_csv',
    filepath='/data/daily_export.csv',
    poke_interval=300,     # проверять каждые 5 мин
    timeout=3600,          # таймаут 1 час
    mode='reschedule'      # освобождает worker slot
)

# Ждать другой DAG
wait_upstream = ExternalTaskSensor(
    task_id='wait_upstream',
    external_dag_id='upstream_etl',
    external_task_id='final_task',
    mode='reschedule'
)

wait_file >> extract >> transform >> load</code></pre></div>
` },
      { id: 3, title: "Production best practices", content: `
<h2>Production Airflow</h2>

<h3>1. Идемпотентность — КРИТИЧЕСКИ важно</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">Python</span></div><pre><code># ❌ НЕ идемпотентно — дубликаты при повторном запуске
INSERT INTO target SELECT * FROM source WHERE date = '{{ ds }}';

# ✅ Идемпотентно — DELETE + INSERT
DELETE FROM target WHERE date = '{{ ds }}';
INSERT INTO target SELECT * FROM source WHERE date = '{{ ds }}';

# ✅ MERGE / UPSERT
INSERT INTO target (id, name) VALUES (...)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;</code></pre></div>

<h3>2. Backfill — перегенерация данных</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">Bash</span></div><pre><code># Перезапустить DAG за прошлые даты
airflow dags backfill daily_etl \\
    --start-date 2024-01-01 \\
    --end-date 2024-06-30 \\
    --reset-dagruns</code></pre></div>

<h3>3. Мониторинг и алерты</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">Python</span></div><pre><code># SLA — уведомлять если task не завершился вовремя
with DAG(
    dag_id='critical_etl',
    sla_miss_callback=slack_alert,
    default_args={
        'sla': timedelta(hours=2),  # SLA: 2 часа
        'on_failure_callback': send_slack_alert
    }
) as dag:</code></pre></div>

<h3>4. Правила</h3>
<ul>
<li>Каждый DAG обрабатывает конкретную дату (<code>{{ ds }}</code>)</li>
<li>Task'и должны быть идемпотентными</li>
<li>Логируйте количество обработанных записей</li>
<li>Разделяйте бизнес-логику и Airflow-код</li>
<li>Тестируйте DAG'и: <code>airflow dags test my_dag 2024-01-15</code></li>
</ul>
` }
    ],
    lab: { title: "ETL-пайплайн в Airflow", description: "API → staging → DWH → quality checks", steps: [
      { title: "DAG", description: "Создайте DAG с 5 tasks: extract, validate, transform, load, notify." },
      { title: "Connections", description: "Настройте PostgreSQL connection через UI." },
      { title: "XCom", description: "Передавайте метаданные между tasks." },
      { title: "Идемпотентность", description: "DELETE+INSERT для load task." },
      { title: "Мониторинг", description: "Добавьте SLA и failure callback." }
    ]}
  },

  // ====== MODULE 7: Spark ======
  {
    id: 7, title: "Apache Spark & PySpark", icon: "⚡", level: "middle",
    description: "Distributed computing, DataFrame API, оптимизация",
    totalLectures: 3, totalTasks: 10,
    lectures: [
      { id: 1, title: "Архитектура Spark", content: `
<h2>Apache Spark — обработка больших данных</h2>
<p>Spark обрабатывает данные <strong>параллельно на кластере</strong> из сотен машин.</p>

<h3>Компоненты</h3>
<ul>
<li><strong>Driver</strong> — главный процесс, строит план (DAG), распределяет задачи</li>
<li><strong>Executor</strong> — рабочий процесс, выполняет tasks, хранит данные</li>
<li><strong>Cluster Manager</strong> — управляет ресурсами (YARN, KS, Standalone)</li>
</ul>

<h3>Lazy Evaluation</h3>
<p>Spark НЕ выполняет transformations сразу. Строит план → оптимизирует → выполняет при action.</p>

<div class="code-block"><div class="code-block-header"><span class="code-block-lang">Python</span></div><pre><code>from pyspark.sql import SparkSession
from pyspark.sql.functions import col, sum, count, avg, when

spark = SparkSession.builder.appName("ETL").getOrCreate()

# Ничего не выполняется — только план
df = spark.read.parquet("s3://data-lake/events/")     # lazy
filtered = df.filter(col("age") > 18)                  # lazy
grouped = filtered.groupBy("city").agg(count("*"))      # lazy

# ВОТ ЗДЕСЬ всё выполняется
grouped.show()  # action → запуск</code></pre></div>

<div class="info-box info">
<strong>Transformations (ленивые):</strong> filter, select, join, groupBy, map<br>
<strong>Actions (немедленные):</strong> collect, count, show, write, take
</div>

<h3>Narrow vs Wide Transformations</h3>
<p><strong>Narrow:</strong> map, filter — данные НЕ перемещаются между executor'ами.</p>
<p><strong>Wide:</strong> groupBy, join, repartition — требуют <strong>shuffle</strong> (перемещение по сети). Самая дорогая операция!</p>
` },
      { id: 2, title: "DataFrame API — трансформации", content: `
<h2>PySpark DataFrame API</h2>

<h3>Основные операции</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">Python</span></div><pre><code>from pyspark.sql.functions import *

# Чтение
df = spark.read.parquet("s3://bucket/events/")
df = spark.read.csv("data.csv", header=True, inferSchema=True)

# SELECT + WHERE
df.select("user_id", "event_type", "amount") \\
  .filter(col("amount") > 100) \\
  .filter(col("event_type") == "purchase")

# Новые столбцы
df = df.withColumn("total", col("price") * col("quantity")) \\
       .withColumn("year", year(col("created_at"))) \\
       .withColumn("category", when(col("amount") > 1000, "high")
                                .when(col("amount") > 100, "medium")
                                .otherwise("low"))

# GROUP BY
df.groupBy("category") \\
  .agg(
      count("*").alias("cnt"),
      sum("amount").alias("total"),
      avg("amount").alias("avg_amount")
  ).orderBy(desc("total"))

# JOIN
result = orders.join(customers, orders.cust_id == customers.id, "left")

# Запись
result.write \\
  .partitionBy("date", "region") \\
  .mode("overwrite") \\
  .parquet("s3://output/")</code></pre></div>

<h3>Оконные функции в Spark</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">Python</span></div><pre><code>from pyspark.sql.window import Window

# Дедупликация (как в SQL)
w = Window.partitionBy("user_id").orderBy(desc("event_time"))
df = df.withColumn("rn", row_number().over(w)) \\
       .filter(col("rn") == 1) \\
       .drop("rn")

# Running total
w2 = Window.partitionBy("user_id").orderBy("date")
df = df.withColumn("running_total", sum("amount").over(w2))</code></pre></div>
` },
      { id: 3, title: "Оптимизация Spark", content: `
<h2>Performance Tuning</h2>

<h3>Partitioning</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">Python</span></div><pre><code># coalesce — уменьшить партиции БЕЗ shuffle
df.coalesce(10).write.parquet("output/")  # быстро

# repartition — пересортировать С shuffle
df.repartition(100, "user_id")  # медленно, но нужно для join

# ⚠️ coalesce(1) = один файл = нет параллелизма при чтении!</code></pre></div>

<h3>Broadcast Join</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">Python</span></div><pre><code>from pyspark.sql.functions import broadcast

# Если одна таблица маленькая — broadcast (копия на все executors)
result = big_df.join(broadcast(small_df), "key")

# Автоматический порог (по умолчанию 10MB)
spark.conf.set("spark.sql.autoBroadcastJoinThreshold", "50m")</code></pre></div>

<h3>Data Skew — неравномерные данные</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">Python</span></div><pre><code># Проблема: один key содержит 90% данных → один executor перегружен

# Решение 1: AQE (Spark 3.0+)
spark.conf.set("spark.sql.adaptive.enabled", "true")
spark.conf.set("spark.sql.adaptive.skewJoin.enabled", "true")

# Решение 2: Salting
salt = 10
df = df.withColumn("salted_key",
    concat(col("skewed_key"), lit("_"), (rand() * salt).cast("int")))

# Решение 3: Broadcast (если одна таблица маленькая)</code></pre></div>

<h3>Caching</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">Python</span></div><pre><code># Кешировать если DataFrame используется НЕСКОЛЬКО раз
joined = big.join(dim, "key").filter(...)
joined.cache()  # сохранить в памяти

report_a = joined.groupBy("cat").agg(sum("amt"))
report_b = joined.groupBy("region").agg(count("*"))

joined.unpersist()  # освободить кеш!</code></pre></div>

<h3>Чек-лист оптимизации</h3>
<ul>
<li>Фильтруйте как можно раньше</li>
<li>Broadcast маленькие таблицы</li>
<li>Избегайте collect() — это тянет ВСЕ данные в Driver</li>
<li>Используйте Parquet + partitionBy</li>
<li>AQE = включён по умолчанию в Spark 3.2+</li>
<li>Мониторьте через Spark UI (localhost:4040)</li>
</ul>
` }
    ],
    lab: { title: "Batch-пайплайн на PySpark", description: "Чтение → трансформация → запись в Parquet.", steps: [
      { title: "SparkSession", description: "Создайте сессию и прочитайте CSV." },
      { title: "Трансформации", description: "Filter, withColumn, join, groupBy." },
      { title: "Оконные функции", description: "Дедупликация и running total." },
      { title: "Оптимизация", description: "Broadcast join, coalesce перед записью." },
      { title: "Запись", description: "Parquet с partitionBy('date')." }
    ]}
  },

  // ====== MODULE 8: dbt ======
  {
    id: 8, title: "dbt (Data Build Tool)", icon: "🔧", level: "middle",
    description: "ELT-трансформации, тесты, документация, incremental models",
    totalLectures: 3, totalTasks: 8,
    lectures: [
      { id: 1, title: "Что такое dbt", content: `
<h2>dbt — SQL-first ELT</h2>
<p>dbt трансформирует данные <strong>внутри</strong> warehouse с помощью SQL. Не нужен отдельный ETL-сервер.</p>

<h3>Позиция в стеке</h3>
<p>Source DB → <strong>Fivetran/Airbyte</strong> (Extract+Load) → <strong>dbt</strong> (Transform) → BI Tool</p>

<h3>Ключевые концепции</h3>
<ul>
<li><strong>Model</strong> — SQL SELECT, который dbt превращает в таблицу или view</li>
<li><strong>ref()</strong> — ссылка на другую модель (dbt строит DAG зависимостей)</li>
<li><strong>source()</strong> — ссылка на raw-таблицу из источника</li>
<li><strong>Tests</strong> — автоматическая проверка данных</li>
<li><strong>Seeds</strong> — CSV-файлы как таблицы (маппинги)</li>
<li><strong>Snapshots</strong> — автоматический SCD Type 2</li>
</ul>

<h3>Структура проекта</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">текст</span></div><pre><code>dbt_project/
├── dbt_project.yml
├── models/
│   ├── staging/
│   │   ├── stg_orders.sql
│   │   └── stg_customers.sql
│   ├── intermediate/
│   │   └── int_order_items.sql
│   └── marts/
│       ├── dim_customers.sql
│       └── fct_orders.sql
├── tests/
├── seeds/
│   └── country_codes.csv
├── snapshots/
│   └── customer_snapshot.sql
└── macros/</code></pre></div>

<h3>Пример модели</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">SQL</span></div><pre><code>-- models/staging/stg_orders.sql
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
    WHERE amount > 0 AND user_id IS NOT NULL
)
SELECT * FROM cleaned

-- models/marts/fct_daily_revenue.sql
SELECT
    DATE_TRUNC('day', ordered_at) AS order_date,
    COUNT(*) AS total_orders,
    SUM(amount) AS total_revenue,
    AVG(amount) AS avg_order_value
FROM {{ ref('stg_orders') }}
GROUP BY 1</code></pre></div>
` },
      { id: 2, title: "Тестирование и документация", content: `
<h2>Testing в dbt</h2>

<h3>Schema tests (в YAML)</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">YAML</span></div><pre><code># models/schema.yml
version: 2
models:
  - name: stg_orders
    description: "Staging layer for raw orders data"
    columns:
      - name: order_id
        description: "Unique order identifier"
        tests:
          - unique
          - not_null
      - name: amount
        tests:
          - not_null
          - dbt_utils.accepted_range:
              min_value: 0
              max_value: 1000000
      - name: user_id
        tests:
          - not_null
          - relationships:
              to: ref('stg_customers')
              field: customer_id</code></pre></div>

<h3>Custom data tests</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">SQL</span></div><pre><code>-- tests/assert_no_negative_revenue.sql
-- Тест проходит если запрос возвращает 0 строк
SELECT order_date, total_revenue
FROM {{ ref('fct_daily_revenue') }}
WHERE total_revenue < 0</code></pre></div>

<h3>Materialization types</h3>
<ul>
<li><strong>view</strong> — не хранит данные, пересчитывает при каждом запросе</li>
<li><strong>table</strong> — пересоздаёт таблицу при каждом dbt run</li>
<li><strong>incremental</strong> — добавляет только новые данные (не пересоздаёт)</li>
<li><strong>ephemeral</strong> — CTE, не создаёт объект в БД</li>
</ul>

<h3>Команды</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">Bash</span></div><pre><code>dbt run                     # выполнить все модели
dbt run --select staging+   # только staging и зависимые
dbt test                    # запустить тесты
dbt build                   # run + test
dbt docs generate           # сгенерировать документацию
dbt docs serve              # открыть в браузере</code></pre></div>
` },
      { id: 3, title: "Incremental models и macros", content: `
<h2>Advanced dbt</h2>

<h3>Incremental models — только новые данные</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">SQL</span></div><pre><code>-- models/marts/fct_user_events.sql
{{ config(
    materialized='incremental',
    unique_key='event_id',
    incremental_strategy='merge'
) }}

SELECT
    event_id, user_id, event_type, created_at
FROM {{ ref('stg_events') }}

{% if is_incremental() %}
    -- При повторном запуске: только новые записи
    WHERE created_at > (SELECT MAX(created_at) FROM {{ this }})
{% endif %}</code></pre></div>

<h3>Jinja + Macros</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">SQL</span></div><pre><code>-- macros/cents_to_dollars.sql
{% macro cents_to_dollars(column_name) %}
    ROUND({{ column_name }}::numeric / 100, 2)
{% endmacro %}

-- Использование в модели:
SELECT
    order_id,
    {{ cents_to_dollars('amount_cents') }} AS amount_dollars
FROM {{ ref('stg_orders') }}</code></pre></div>

<h3>Snapshots — автоматический SCD Type 2</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">SQL</span></div><pre><code>-- snapshots/customer_snapshot.sql
{% snapshot customer_snapshot %}
{{ config(
    target_schema='snapshots',
    unique_key='customer_id',
    strategy='timestamp',
    updated_at='updated_at'
) }}
SELECT * FROM {{ source('raw', 'customers') }}
{% endsnapshot %}

-- dbt snapshot → автоматически отслеживает изменения</code></pre></div>

<div class="info-box tip">
<strong>💡 dbt + Airflow:</strong> Airflow оркестрирует (когда запускать). dbt трансформирует (что делать с данными). Идеальная пара.
</div>
` }
    ],
    lab: { title: "dbt-проект для e-commerce", description: "raw → staging → intermediate → marts", steps: [
      { title: "Инициализация", description: "dbt init, настройте profiles.yml." },
      { title: "Staging", description: "stg_orders, stg_customers, stg_products." },
      { title: "Marts", description: "fct_orders, dim_customers, fct_daily_revenue." },
      { title: "Тесты", description: "unique, not_null, relationships, custom tests." },
      { title: "Incremental", description: "Переведите fct_orders на incremental." }
    ]}
  },

  // ====== MODULE 9: Kafka ======
  {
    id: 9, title: "Apache Kafka & Streaming", icon: "📡", level: "senior",
    description: "Real-time обработка, CDC, exactly-once, schema evolution",
    totalLectures: 3, totalTasks: 6,
    lectures: [
      { id: 1, title: "Архитектура Kafka", content: `
<h2>Apache Kafka — платформа потоковой передачи</h2>

<h3>Компоненты</h3>
<ul>
<li><strong>Broker</strong> — сервер Kafka (кластер = несколько брокеров)</li>
<li><strong>Topic</strong> — логическая категория сообщений (аналог таблицы)</li>
<li><strong>Partition</strong> — физическое разделение topic'а для параллелизма</li>
<li><strong>Producer</strong> — отправляет сообщения</li>
<li><strong>Consumer</strong> — читает сообщения</li>
<li><strong>Consumer Group</strong> — группа consumers, совместно читающих topic</li>
</ul>

<div class="code-block"><div class="code-block-header"><span class="code-block-lang">текст</span></div><pre><code>Topic: user_events (3 partitions)
┌────────────┐  ┌────────────┐  ┌────────────┐
│Partition 0 │  │Partition 1 │  │Partition 2 │
│ msg0, msg3 │  │ msg1, msg4 │  │ msg2, msg5 │
└─────┬──────┘  └─────┬──────┘  └─────┬──────┘

Consumer Group "analytics":
  Consumer A → P0    Consumer B → P1    Consumer C → P2</code></pre></div>

<h3>Гарантии</h3>
<ul>
<li>Порядок гарантирован ТОЛЬКО внутри одной партиции</li>
<li>Consumers в группе ≤ партиций (лишние простаивают)</li>
<li>Разные Consumer Groups читают данные независимо</li>
</ul>

<h3>Producer / Consumer в Python</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">Python</span></div><pre><code>from confluent_kafka import Producer, Consumer
import json

# Producer
producer = Producer({'bootstrap.servers': 'localhost:9092'})
producer.produce('user_events',
    key='user_123',
    value=json.dumps({'event': 'click', 'ts': '2024-01-15T10:30:00'})
)
producer.flush()

# Consumer
consumer = Consumer({
    'bootstrap.servers': 'localhost:9092',
    'group.id': 'analytics',
    'auto.offset.reset': 'earliest'
})
consumer.subscribe(['user_events'])
while True:
    msg = consumer.poll(1.0)
    if msg and not msg.error():
        data = json.loads(msg.value())
        process(data)</code></pre></div>
` },
      { id: 2, title: "Kafka Connect и Schema Registry", content: `
<h2>Kafka Connect & Schema Registry</h2>

<h3>Kafka Connect — интеграция без кода</h3>
<p>Pre-built коннекторы для PostgreSQL, S3, Elasticsearch, MongoDB и др.</p>
<ul>
<li><strong>Source Connector</strong> — читает из внешней системы → Kafka</li>
<li><strong>Sink Connector</strong> — Kafka → записывает во внешнюю систему</li>
</ul>

<h3>Schema Registry</h3>
<p>Централизованное хранилище схем (Avro, Protobuf, JSON Schema).</p>
<ul>
<li><strong>Schema Evolution</strong> — безопасное изменение схемы без поломки consumers</li>
<li><strong>BACKWARD</strong> — новая схема читает старые данные</li>
<li><strong>FORWARD</strong> — старая схема читает новые данные</li>
<li><strong>FULL</strong> — обе стороны совместимы</li>
</ul>

<h3>Exactly-once semantics</h3>
<ul>
<li><strong>At-most-once:</strong> commit offset ДО обработки → потеря</li>
<li><strong>At-least-once:</strong> commit ПОСЛЕ обработки → дубликат</li>
<li><strong>Exactly-once:</strong> Kafka transactions + idempotent producer</li>
</ul>

<div class="info-box warning">
<strong>⚠️ На практике:</strong> Exactly-once между Kafka→Kafka работает. Kafka→внешняя БД — нужна идемпотентность на consumer стороне (UPSERT вместо INSERT).
</div>
` },
      { id: 3, title: "CDC и Event-Driven Architecture", content: `
<h2>CDC (Change Data Capture)</h2>
<p>Отслеживание INSERT/UPDATE/DELETE в БД и передача в Kafka в реальном времени.</p>

<h3>Debezium — CDC платформа</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">текст</span></div><pre><code>PostgreSQL (WAL log) → Debezium → Kafka → [Spark/Flink] → DWH

Debezium событие:
{
  "op": "u",  // "c"=create, "u"=update, "d"=delete
  "before": {"id": 1, "city": "Moscow"},
  "after":  {"id": 1, "city": "Berlin"},
  "source": {"db": "mydb", "table": "customers"}
}</code></pre></div>

<h3>Преимущества CDC</h3>
<ul>
<li>Не нагружает source DB (читает WAL, не SELECT)</li>
<li>Захватывает DELETE (batch не поймает)</li>
<li>Near-real-time (задержка — секунды)</li>
<li>Полная история для SCD Type 2</li>
</ul>

<h3>Event-Driven Architecture</h3>
<p>Вместо ETL-пайплайнов по расписанию → реакция на события в реальном времени.</p>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">текст</span></div><pre><code>Традиционный Batch:
[Source DB] --cron every hour--> [ETL] --> [DWH]

Event-Driven:
[Source DB] --CDC real-time--> [Kafka] --stream--> [DWH]
                                         \\--> [ML Service]
                                         \\--> [Monitoring]</code></pre></div>
` }
    ],
    lab: { title: "Streaming pipeline", description: "Producer → Kafka → Consumer → PostgreSQL.", steps: [
      { title: "Kafka setup", description: "Docker Compose с Kafka + Zookeeper." },
      { title: "Producer", description: "Python producer генерирует события." },
      { title: "Consumer", description: "Python consumer читает и записывает в PostgreSQL." },
      { title: "Schema", description: "Добавьте Avro схему." },
      { title: "Мониторинг", description: "Consumer lag, throughput." }
    ]}
  },

  // ====== MODULE 10: Cloud ======
  {
    id: 10, title: "Cloud & IaC", icon: "☁️", level: "senior",
    description: "AWS/GCP, Terraform, CI/CD для data платформ",
    totalLectures: 3, totalTasks: 6,
    lectures: [
      { id: 1, title: "Cloud для DE", content: `
<h2>Cloud Services для Data Engineer</h2>

<h3>Сравнение AWS vs GCP vs Azure</h3>

<table class="schema-table">
<thead><tr><th>Задача</th><th>AWS</th><th>GCP</th><th>Azure</th></tr></thead>
<tbody>
<tr><td>Storage</td><td>S3</td><td>GCS</td><td>Blob Storage</td></tr>
<tr><td>DWH</td><td>Redshift</td><td>BigQuery</td><td>Synapse</td></tr>
<tr><td>ETL</td><td>Glue</td><td>Dataflow</td><td>Data Factory</td></tr>
<tr><td>Spark</td><td>EMR</td><td>Dataproc</td><td>HDInsight</td></tr>
<tr><td>Streaming</td><td>Kinesis</td><td>Pub/Sub</td><td>Event Hubs</td></tr>
<tr><td>Orchestration</td><td>MWAA (Airflow)</td><td>Composer</td><td>Data Factory</td></tr>
<tr><td>Serverless</td><td>Lambda</td><td>Cloud Functions</td><td>Functions</td></tr>
</tbody></table>

<h3>Data Lake on S3</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">текст</span></div><pre><code>s3://company-data-lake/
├── raw/                    # Bronze — сырые данные
│   ├── events/date=2024-01-15/
│   ├── users/
│   └── orders/
├── processed/              # Silver — очищенные
│   ├── events_clean/
│   └── orders_enriched/
├── analytics/              # Gold — витрины
│   ├── daily_revenue/
│   └── user_segments/
└── _metadata/
    └── schemas/</code></pre></div>

<div class="info-box tip">
<strong>💡 Формат:</strong> Используйте Parquet + partitionBy(date). Сжатие Snappy для баланса скорости и размера.
</div>
` },
      { id: 2, title: "Terraform — Infrastructure as Code", content: `
<h2>Terraform</h2>
<p>Описываете инфраструктуру в HCL-файлах → Terraform создаёт/обновляет ресурсы.</p>

<div class="code-block"><div class="code-block-header"><span class="code-block-lang">HCL</span></div><pre><code># main.tf
provider "aws" { region = "eu-west-1" }

resource "aws_s3_bucket" "data_lake" {
  bucket = "company-data-lake-prod"
  tags = { Environment = "production", Team = "data-engineering" }
}

resource "aws_iam_role" "etl_role" {
  name = "etl-pipeline-role"
  assume_role_policy = jsonencode({
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = { Service = "glue.amazonaws.com" }
    }]
  })
}

# terraform plan   → показывает что будет создано
# terraform apply  → создаёт ресурсы
# terraform destroy → удаляет</code></pre></div>

<h3>Best Practices</h3>
<ul>
<li>Remote state в S3 + DynamoDB lock</li>
<li>Modules для переиспользования</li>
<li>Workspaces для dev/staging/production</li>
<li>Code Review для инфраструктурных изменений</li>
</ul>
` },
      { id: 3, title: "CI/CD для Data Pipelines", content: `
<h2>CI/CD для Data</h2>
<p>Отличается от web-приложений — нужно тестировать <strong>данные и схемы</strong>, а не только код.</p>

<h3>Что тестировать</h3>
<ul>
<li><strong>Unit tests</strong> — Python функции трансформации (pytest)</li>
<li><strong>Schema tests</strong> — dbt tests (not_null, unique)</li>
<li><strong>Data quality</strong> — Great Expectations (диапазоны, распределения)</li>
<li><strong>Integration</strong> — end-to-end на тестовых данных</li>
</ul>

<div class="code-block"><div class="code-block-header"><span class="code-block-lang">YAML</span></div><pre><code># .github/workflows/data-pipeline.yml
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
      - run: pip install -r requirements.txt
      - run: pytest tests/ -v

  dbt-test:
    runs-on: ubuntu-latest
    steps:
      - run: dbt deps && dbt build --select state:modified+

  deploy:
    needs: [test, dbt-test]
    if: github.ref == 'refs/heads/main'
    steps:
      - run: dbt run --target production</code></pre></div>
` }
    ],
    lab: { title: "Data-платформа в облаке", description: "S3 → Glue → Redshift + Airflow.", steps: [
      { title: "Terraform", description: "S3 bucket + IAM roles." },
      { title: "Data Lake", description: "Загрузите данные в S3 Parquet." },
      { title: "ETL", description: "AWS Glue job или Spark на EMR." },
      { title: "DWH", description: "Запросы в Redshift/BigQuery." },
      { title: "CI/CD", description: "GitHub Actions для dbt." }
    ]}
  },

  // ====== MODULE 11: Data Quality ======
  {
    id: 11, title: "Data Quality & Governance", icon: "🛡️", level: "senior",
    description: "Great Expectations, data contracts, lineage, observability",
    totalLectures: 3, totalTasks: 6,
    lectures: [
      { id: 1, title: "Data Quality", content: `
<h2>6 измерений Data Quality</h2>
<ol>
<li><strong>Accuracy</strong> — данные отражают реальность</li>
<li><strong>Completeness</strong> — нет пропущенных значений</li>
<li><strong>Consistency</strong> — данные не противоречат друг другу</li>
<li><strong>Timeliness</strong> — данные доступны вовремя</li>
<li><strong>Uniqueness</strong> — нет дубликатов</li>
<li><strong>Validity</strong> — данные соответствуют формату/диапазону</li>
</ol>

<h3>Great Expectations</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">Python</span></div><pre><code>import great_expectations as gx

context = gx.get_context()
validator = context.sources.pandas_default.read_csv("orders.csv")

# Expectations (ожидания = тесты)
validator.expect_column_values_to_not_be_null("order_id")
validator.expect_column_values_to_be_between("amount", 0, 1_000_000)
validator.expect_column_values_to_be_unique("order_id")
validator.expect_column_pair_values_a_to_be_greater_than_b(
    "end_date", "start_date"
)

# Результат
result = validator.validate()
if not result.success:
    alert_team(result)  # алерт при нарушении</code></pre></div>

<h3>dbt Tests</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">YAML</span></div><pre><code>models:
  - name: fct_orders
    columns:
      - name: order_id
        tests: [unique, not_null]
      - name: amount
        tests:
          - dbt_utils.accepted_range:
              min_value: 0
              max_value: 1000000
      - name: customer_id
        tests:
          - relationships:
              to: ref('dim_customers')
              field: customer_id</code></pre></div>
` },
      { id: 2, title: "Data Governance & Contracts", content: `
<h2>Data Governance</h2>
<p>Набор политик, процессов и стандартов для управления данными.</p>

<h3>Data Contract</h3>
<p>Формальное соглашение между producer и consumer данных.</p>

<div class="code-block"><div class="code-block-header"><span class="code-block-lang">YAML</span></div><pre><code># data_contract.yaml
name: user_events
owner: platform-team
description: "User interaction events"

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
    allowed_values: [click, view, purchase]

quality:
  freshness: "< 15 minutes"
  completeness: "> 99.5%"
  volume: "100K - 10M events/day"

sla:
  availability: "99.9%"
  update_frequency: "real-time"</code></pre></div>

<h3>Data Catalog</h3>
<ul>
<li><strong>Что есть:</strong> Список всех таблиц, их описания, владельцы</li>
<li><strong>Lineage:</strong> Откуда данные пришли → куда идут (граф зависимостей)</li>
<li><strong>Инструменты:</strong> dbt docs, DataHub, Amundsen, OpenMetadata</li>
</ul>
` },
      { id: 3, title: "Data Observability", content: `
<h2>Data Observability</h2>
<p>Мониторинг <strong>данных</strong> (не только инфраструктуры).</p>

<h3>5 столпов Data Observability</h3>
<ul>
<li><strong>Freshness</strong> — когда данные обновились последний раз?</li>
<li><strong>Volume</strong> — объём данных в норме? (±20% от обычного)</li>
<li><strong>Schema</strong> — схема изменилась? Новые/удалённые столбцы?</li>
<li><strong>Distribution</strong> — распределение значений в норме?</li>
<li><strong>Lineage</strong> — что сломается если эта таблица изменится?</li>
</ul>

<h3>Практические проверки</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">SQL</span></div><pre><code>-- Freshness: данные обновлены за последние 2 часа?
SELECT MAX(updated_at) as last_update,
       CURRENT_TIMESTAMP - MAX(updated_at) as lag
FROM fact_orders;
-- Alert если lag > 2 hours

-- Volume: сегодня ±30% от среднего?
WITH daily_counts AS (
    SELECT date, COUNT(*) as cnt
    FROM fact_orders
    GROUP BY date
    ORDER BY date DESC LIMIT 30
)
SELECT date, cnt,
    AVG(cnt) OVER () as avg_cnt,
    cnt * 1.0 / AVG(cnt) OVER () as ratio
FROM daily_counts;

-- Distribution: % NULL вырос?
SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN email IS NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(*) as null_pct
FROM dim_customers;</code></pre></div>

<div class="info-box tip">
<strong>Инструменты:</strong> Monte Carlo, Elementary, Great Expectations, Soda, dbt + re_data.
</div>
` }
    ],
    lab: { title: "Data Quality Layer", description: "GX + dbt tests + alerting.", steps: [
      { title: "GX Setup", description: "Настройте Great Expectations для CSV." },
      { title: "Expectations", description: "Напишите 10+ expectations." },
      { title: "dbt tests", description: "Schema tests для всех моделей." },
      { title: "Alerting", description: "Slack notification при нарушении." },
      { title: "Dashboard", description: "Метрики качества данных." }
    ]}
  },

  // ====== MODULE 12: System Design ======
  {
    id: 12, title: "System Design", icon: "🏛️", level: "senior",
    description: "CAP, Lakehouse, Medallion Architecture, проектирование систем",
    totalLectures: 3, totalTasks: 6,
    lectures: [
      { id: 1, title: "Распределённые системы", content: `
<h2>Distributed Systems для DE</h2>

<h3>CAP-теорема</h3>
<p>В распределённой системе можно обеспечить только 2 из 3:</p>
<ul>
<li><strong>Consistency</strong> — все узлы видят одинаковые данные</li>
<li><strong>Availability</strong> — каждый запрос получает ответ</li>
<li><strong>Partition tolerance</strong> — система работает при сетевых разрывах</li>
</ul>
<p><strong>CP:</strong> HBase, MongoDB — консистентность важнее.</p>
<p><strong>AP:</strong> Cassandra, DynamoDB — доступность важнее (eventual consistency).</p>

<h3>Batch vs Streaming</h3>
<table class="schema-table">
<thead><tr><th></th><th>Batch</th><th>Streaming</th></tr></thead>
<tbody>
<tr><td>Задержка</td><td>Часы/дни</td><td>Секунды/минуты</td></tr>
<tr><td>Use cases</td><td>Отчёты, ML training</td><td>Fraud detection, real-time</td></tr>
<tr><td>Инструменты</td><td>Spark, Airflow, dbt</td><td>Kafka, Flink, Spark Streaming</td></tr>
<tr><td>Сложность</td><td>Проще</td><td>Сложнее (state, exactly-once)</td></tr>
</tbody></table>

<h3>Lambda vs Kappa архитектура</h3>
<p><strong>Lambda:</strong> Batch layer + Speed layer → Serving layer. Точность batch + скорость streaming. ❌ Двойная логика.</p>
<p><strong>Kappa:</strong> Всё через streaming. Replay из Kafka для reprocessing. ✅ Одна codebase. ❌ Хранение в Kafka дорогое.</p>
<p><em>На практике:</em> Hybrid — streaming для real-time + batch для reconciliation.</p>
` },
      { id: 2, title: "Data Lakehouse", content: `
<h2>Data Lakehouse</h2>
<p>Объединяет дешёвое хранение (S3) + ACID + schema + SQL производительность.</p>

<h3>Сравнение</h3>
<table class="schema-table">
<thead><tr><th></th><th>Data Lake</th><th>Data Warehouse</th><th>Lakehouse</th></tr></thead>
<tbody>
<tr><td>Storage</td><td>S3 (дёшево)</td><td>Proprietary (дорого)</td><td>S3 (дёшево)</td></tr>
<tr><td>ACID</td><td>❌</td><td>✅</td><td>✅</td></tr>
<tr><td>Schema</td><td>Schema-on-read</td><td>Schema-on-write</td><td>Оба</td></tr>
<tr><td>SQL perf</td><td>Медленно</td><td>Быстро</td><td>Быстро</td></tr>
<tr><td>ML</td><td>✅</td><td>❌</td><td>✅</td></tr>
</tbody></table>

<h3>Технологии</h3>
<ul>
<li><strong>Delta Lake</strong> (Databricks) — ACID, time travel, schema evolution</li>
<li><strong>Apache Iceberg</strong> (Netflix) — hidden partitioning, schema evolution</li>
<li><strong>Apache Hudi</strong> (Uber) — upserts, incremental processing</li>
</ul>

<h3>Формат файлов</h3>
<table class="schema-table">
<thead><tr><th>Формат</th><th>Тип</th><th>Use Case</th></tr></thead>
<tbody>
<tr><td>CSV</td><td>Row</td><td>Обмен, debug</td></tr>
<tr><td>Avro</td><td>Row</td><td>Kafka streaming</td></tr>
<tr><td>Parquet</td><td>Columnar</td><td>Аналитика, DWH (стандарт)</td></tr>
<tr><td>ORC</td><td>Columnar</td><td>Hive ecosystem</td></tr>
</tbody></table>

<div class="info-box tip">
<strong>Parquet — стандарт для DE:</strong> Column pruning, predicate pushdown, 10x сжатие vs CSV. Совместимость: Spark, Pandas, Snowflake, BigQuery, Athena.
</div>
` },
      { id: 3, title: "Проектирование data систем", content: `
<h2>System Design для Data Engineer</h2>

<h3>Шаблон для интервью</h3>
<ol>
<li><strong>Clarify requirements</strong> — объём данных, задержка, SLA</li>
<li><strong>High-level design</strong> — источники → processing → storage → serving</li>
<li><strong>Deep dive</strong> — ключевые компоненты</li>
<li><strong>Trade-offs</strong> — почему это решение, а не другое</li>
</ol>

<h3>Пример: Clickstream Analytics (100M+ events/day)</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">текст</span></div><pre><code>[Web/Mobile]
     ↓ (events)
[API Gateway / Load Balancer]
     ↓
[Apache Kafka] (buffer, 7 days retention)
     ↓                    ↓
[Spark Streaming]    [Batch Spark (daily)]
     ↓                    ↓
[Real-time Store]   [Data Lake (Iceberg)]
  (Redis/Druid)          ↓
     ↓              [dbt transforms]
[RT Dashboard]           ↓
                    [Data Warehouse]
                         ↓
                    [BI / Analytics]</code></pre></div>

<h3>Ключевые решения</h3>
<ul>
<li><strong>Event-time vs Processing-time?</strong> → Event-time + watermark для late data</li>
<li><strong>Partitioning key?</strong> → По дате (daily) + по user_id для join'ов</li>
<li><strong>Schema evolution?</strong> → Schema Registry (Avro) или Iceberg</li>
<li><strong>Cost?</strong> → Hot/Warm/Cold storage tiers</li>
<li><strong>Late data?</strong> → Watermark в streaming + batch reconciliation</li>
</ul>

<h3>Пример: Data Platform</h3>
<div class="code-block"><div class="code-block-header"><span class="code-block-lang">текст</span></div><pre><code>Sources:
  - PostgreSQL (CDC via Debezium → Kafka)
  - REST APIs (Airflow scheduled)
  - S3 file drops (S3 events → Lambda → Kafka)

Processing:
  - Bronze: Raw data in Iceberg (S3)
  - Silver: dbt + Spark (cleaning, dedup)
  - Gold: dbt (business metrics, KPIs)

Serving:
  - BI: Snowflake / BigQuery
  - ML: Feature store (Feast/Tecton)
  - API: Materialized views + Redis cache

Orchestration: Airflow on Kubernetes
Monitoring: Great Expectations + Elementary
IaC: Terraform + GitHub Actions</code></pre></div>
` }
    ],
    lab: { title: "End-to-end data platform design", description: "Спроектируйте полную data платформу.", steps: [
      { title: "Requirements", description: "Определите объём, SLA, источники." },
      { title: "Architecture", description: "Нарисуйте high-level архитектуру." },
      { title: "Storage", description: "Выберите формат, партиционирование, retention." },
      { title: "Processing", description: "Batch vs Streaming, инструменты." },
      { title: "Presentation", description: "Подготовьте презентацию как на собесе." }
    ]}
  }
];
