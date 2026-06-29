/**
 * Створює БД з іменем DB_NAME (підключення до системної бази "postgres").
 * Запуск з папки backend: node db/create-database.js
 */
'use strict';

const { Client } = require('pg');
const config = require('../config');

const dbName = config.db.database.trim();

async function main() {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(dbName)) {
    throw new Error(`Недопустиме ім'я бази в DB_NAME: ${dbName}`);
  }

  const client = new Client({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: 'postgres',
  });

  await client.connect();
  try {
    const { rows } = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );
    if (rows.length) {
      console.log(`ℹ️  База "${dbName}" уже існує.`);
      return;
    }
    await client.query(`CREATE DATABASE ${dbName}`);
    console.log(`✅ База "${dbName}" створена.`);
  } finally {
    await client.end();
  }
}

main().catch(err => {
  console.error('❌ Помилка:', err.message);
  process.exit(1);
});
