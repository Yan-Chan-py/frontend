const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const app = require('./app');
const pool = require('./db/db');

const PORT = process.env.PORT || 3001;

async function start() {
  try {
    // Test DB connection
    await pool.query('SELECT 1');
    console.log('✅ Database connection verified');

    app.listen(PORT, () => {
      console.log(`\n🌸 Flora API is running!`);
      console.log(`   Server:  http://localhost:${PORT}`);
      console.log(`   API:     http://localhost:${PORT}/api`);
      console.log(`   Swagger: http://localhost:${PORT}/api-docs\n`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to database:', err.message);
    console.error('   Make sure PostgreSQL is running and .env is configured.');
    process.exit(1);
  }
}

start();
