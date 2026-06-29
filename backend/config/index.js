const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

function envStr(key, fallback = '') {
  const v = process.env[key];
  if (v == null || v === '') return fallback;
  return String(v);
}

const config = {
  port: parseInt(process.env.PORT, 10) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || '*',
  db: {
    host: envStr('DB_HOST', 'localhost'),
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: envStr('DB_NAME', 'flora_db'),
    user: envStr('DB_USER', 'postgres'),
    password: envStr('DB_PASSWORD', ''),
  },
};

module.exports = config;
