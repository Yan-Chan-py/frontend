const path = require('path');
const { Pool } = require('pg');

// Always resolve .env from backend/ (works even if cwd differs, e.g. node db/init.js)
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

function envStr(key, fallback = '') {
  const v = process.env[key];
  if (v == null || v === '') return fallback;
  return String(v);
}

const pool = new Pool({
  host: envStr('DB_HOST', 'localhost'),
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  database: envStr('DB_NAME', 'flora_db'),
  user: envStr('DB_USER', 'postgres'),
  // pg + SCRAM require a real string (undefined breaks with "client password must be a string")
  password: envStr('DB_PASSWORD', ''),
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL');
});

pool.on('error', err => {
  console.error('❌ PostgreSQL error:', err.message);
});

module.exports = pool;
