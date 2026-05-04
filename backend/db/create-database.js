/**
 * Створює БД з іменем DB_NAME (підключення до системної бази "postgres").
 * Запуск з папки backend: node db/create-database.js
 */
'use strict';

const path = require('path');
const { Client } = require('pg');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbName = (process.env.DB_NAME || 'flora_db').trim();

async function main() {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(dbName)) {
    throw new Error(`Недопустиме ім'я бази в DB_NAME: ${dbName}`);
  }

  const password =
    process.env.DB_PASSWORD != null ? String(process.env.DB_PASSWORD) : '';

  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: process.env.DB_USER || 'postgres',
    password,
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
