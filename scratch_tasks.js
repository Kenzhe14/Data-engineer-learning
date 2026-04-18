const NEW_TASKS = [
  // === MODULE 3: Data Modeling ===
  {
    id: "sql_dwh_001", module: 3, order: 1,
    title: "SCD Type 2: Update query",
    difficulty: "middle", language: "sql",
    description: `Вам дана таблица <code>dim_customer</code> типа SCD Type 2 (колонки: <code>id, name, city, valid_from, valid_to, is_current</code>).<br>Напишите запрос, который делает "устаревшей" текущую активную запись для \`id = 1\` (клиент переехал), установив \`valid_to = '2023-12-01'\` и \`is_current = 0\`.`,
    setupSQL: `
      CREATE TABLE dim_customer (id INT, name TEXT, city TEXT, valid_from DATE, valid_to DATE, is_current INT);
      INSERT INTO dim_customer VALUES 
        (1, 'Ivan', 'Moscow', '2022-01-01', '9999-12-31', 1),
        (2, 'Anna', 'Kazan', '2023-05-01', '9999-12-31', 1);
    `,
    starterCode: `-- Ваш UPDATE запрос здесь\n`,
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
    title: "Генерация суррогатного ключа",
    difficulty: "junior", language: "python",
    description: `Напишите функцию <code>generate_sk(business_key, source_system)</code>, которая возвращает суррогатный ключ формата \`source_system_business_key\` в нижнем регистре без пробелов.`,
    starterCode: `def generate_sk(business_key, source_system):\n    # Ваш код\n    pass`,
    testCases: [
      { input: `generate_sk(123, "CRM")`, expected: `"crm_123"` },
      { input: `generate_sk("A-45", " ERP ")`, expected: `"erp_a-45"` }
    ],
    hints: [],
    solution: `def generate_sk(b, s):\n    return f"{s.strip().lower()}_{str(b).strip().lower()}"`
  },

  // === MODULE 4: Linux & Git ===
  {
    id: "py_lin_001", module: 4, order: 1,
    title: "Права доступа Linux (chmod)",
    difficulty: "junior", language: "python",
    description: `Функция <code>get_chmod_numeric(permissions_string)</code> должна переводить строку прав (например 'rwxr-xr--') в числовой формат типа chmod (например 754).`,
    starterCode: `def get_chmod_numeric(perms):\n    # Напишите конвертер\n    # perms - строка 9 символов 'rwxrwxrwx'\n    pass`,
    testCases: [
      { input: `get_chmod_numeric("rwxr-xr--")`, expected: `754` },
      { input: `get_chmod_numeric("rw-r--r--")`, expected: `644` },
      { input: `get_chmod_numeric("rwx------")`, expected: `700` }
    ],
    hints: ["r=4, w=2, x=1. Каждые 3 символа - отдельное число"],
    solution: `def get_chmod_numeric(p):\n    res = ''\n    for i in range(0, 9, 3):\n        chunk = p[i:i+3]\n        val = 0\n        if chunk[0] == 'r': val += 4\n        if chunk[1] == 'w': val += 2\n        if chunk[2] == 'x': val += 1\n        res += str(val)\n    return int(res)`
  },

  // === MODULE 5: Docker ===
  {
    id: "py_docker_001", module: 5, order: 1,
    title: "Оптимизация Dockerfile",
    difficulty: "middle", language: "python",
    description: `Какая команда Dockerfile устанавливает библиотеки Python более оптимально (кэшируя слой)?\nВерните правильную строку из вариантов: 'A' (pip install inside code copy) или 'B' (copy requirements then pip install then copy code).`,
    starterCode: `def best_dockerfile_practice():\n    # 'A' или 'B'\n    return ''`,
    testCases: [
      { input: `best_dockerfile_practice()`, expected: `"B"` }
    ],
    hints: ["Кэширование слоев ломается, когда изменяется файл в COPY. Requirements меняются реже, чем код."],
    solution: `def best_dockerfile_practice(): return 'B'`
  },

  // === MODULE 6: Airflow ===
  {
    id: "py_air_001", module: 6, order: 1,
    title: "DAG Dependencies",
    difficulty: "junior", language: "python",
    description: `В Airflow зависимости задаются с помощью <code>>></code>. Напишите функцию, которая принимает список строк-имен задач и объединяет их в правильную цепочку Airflow (task1 >> task2 >> task3).`,
    starterCode: `def build_dag_chain(tasks):\n    pass`,
    testCases: [
      { input: `build_dag_chain(['extract', 'transform', 'load'])`, expected: `"extract >> transform >> load"` },
      { input: `build_dag_chain(['start', 'end'])`, expected: `"start >> end"` }
    ],
    hints: ["Метод join() с разделителем ' >> '"],
    solution: `def build_dag_chain(tasks): return " >> ".join(tasks)`
  },

  // === MODULE 7: PySpark ===
  {
    id: "py_spark_001", module: 7, order: 1,
    title: "Эмуляция MapReduce (WordCount)",
    difficulty: "middle", language: "python",
    description: `Реализуйте функцию <code>word_count(lines)</code>, которая принимает список строк, делает flatMap (разбивает логически на слова), потом map (слово -> 1) и reduceByKey (сумма). Вернуть dict: {'word': count}. Слова к lower case.`,
    starterCode: `def word_count(lines):\n    # Возвращаем словарь с подсчетом\n    pass`,
    testCases: [
      { input: `word_count(["Hello spark", "Hello world"])`, expected: `{"hello": 2, "spark": 1, "world": 1}` }
    ],
    hints: [],
    solution: `def word_count(lines):\n    res = {}\n    for line in lines:\n        for w in line.lower().split():\n            res[w] = res.get(w, 0) + 1\n    return res`
  },

  // === MODULE 8: dbt ===
  {
    id: "sql_dbt_001", module: 8, order: 1,
    title: "dbt Суррогатный ключ (СУБД SQLite эмуляция)",
    difficulty: "junior", language: "sql",
    description: `Напишите SQL-запрос, который создает суррогатный ключ <code>order_item_id</code> путем конкатенации <code>order_id</code> и <code>item_id</code> через разделитель <code>-</code>.`,
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
    hints: ["В SQLite конкатенация строк это ||"],
    solution: `SELECT order_id || '-' || item_id AS order_item_id, order_id, item_id, amount FROM raw_items;`
  },

  // === MODULE 9: Kafka ===
  {
    id: "py_kafka_001", module: 9, order: 1,
    title: "Consumer Offset",
    difficulty: "middle", language: "python",
    description: `Пусть у нас есть очередь сообщений <code>queue = [{"offset": 1, "val": "A"}, {"offset": 2, "val": "B"}]</code>. \nНапишите функцию, принимающую \`queue\` и \`last_committed_offset\`. Верните список \`val\` только тех сообщений, которые ПРОВЫШАЮТ last_committed_offset.`,
    starterCode: `def consume_new(queue, last_commit):\n    pass`,
    testCases: [
      { input: `consume_new([{"offset":1,"val":"A"},{"offset":2,"val":"B"}], 1)`, expected: `["B"]` },
      { input: `consume_new([{"offset":5,"val":"X"},{"offset":6,"val":"Y"}], 0)`, expected: `["X", "Y"]` }
    ],
    hints: [],
    solution: `def consume_new(q, lc): return [x['val'] for x in q if x['offset'] > lc]`
  },

  // === MODULE 10: Cloud ===
  {
    id: "py_cloud_001", module: 10, order: 1,
    title: "AWS S3 URI Parser",
    difficulty: "junior", language: "python",
    description: `Функция <code>parse_s3(uri)</code> должна распарсить S3 путь (например \`s3://my-bucket/data/file.csv\`) и вернуть tuple \`(bucket_name, object_key)\`.`,
    starterCode: `def parse_s3(uri):\n    pass`,
    testCases: [
      { input: `parse_s3("s3://my-bucket/data/file.csv")`, expected: `("my-bucket", "data/file.csv")` },
      { input: `parse_s3("s3://logs/2023/10/a.log")`, expected: `("logs", "2023/10/a.log")` }
    ],
    hints: ["uri.replace('s3://', '').split('/', 1)"],
    solution: `def parse_s3(uri):\n    p = uri[5:].split('/', 1)\n    return (p[0], p[1])`
  },

  // === MODULE 11: Data Quality ===
  {
    id: "py_dq_001", module: 11, order: 1,
    title: "Great Expectations Validator",
    difficulty: "junior", language: "python",
    description: `Реализуйте функцию \`expect_column_values_to_not_be_null(column_data)\`, которая принимает список значений столбца. Если есть \`None\`, должна вернуть False, иначе True.`,
    starterCode: `def expect_not_null(data):\n    pass`,
    testCases: [
      { input: `expect_not_null([1, 2, 3])`, expected: `True` },
      { input: `expect_not_null([1, None, 3])`, expected: `False` }
    ],
    hints: [],
    solution: `def expect_not_null(data): return None not in data`
  },

  // === MODULE 12: System Design ===
  {
    id: "py_design_001", module: 12, order: 1,
    title: "Выбор Базы Данных",
    difficulty: "junior", language: "python",
    description: `Функция \`choose_db(requirements)\` принимает список требований (например \`['OLAP', 'SQL', 'Scalable']\`).\nВерните 'ClickHouse', если там есть 'OLAP'. Верните 'PostgreSQL', если есть 'OLTP'. Иначе 'S3'.`,
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

import sys

with open("js/tasks.js", "r") as f:
    orig = f.read()

# Replace the closing brackets and injection
inject_point = "];\n\n// Make globally accessible"

if inject_point in orig:
    part1, part2 = orig.split(inject_point, 1)
    # We open scratch_tasks.js, get NEW_TASKS array
    with open("scratch_tasks.js", "r") as tmp:
        new_text = tmp.read()
    
    # Extract the payload inside [ ]
    start_idx = new_text.find("[\n") + 1
    end_idx = new_text.rfind("];")
    payload = new_text[start_idx:end_idx]
    
    final_content = part1 + ",\n" + payload + "\n];\n\n// Make globally accessible" + part2
    with open("js/tasks.js", "w") as out:
        out.write(final_content)
    print("Tasks successfully injected into js/tasks.js")
else:
    print("Injection point not found in tasks.js")
