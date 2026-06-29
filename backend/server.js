const config = require('./config');
const app = require('./app');
const pool = require('./db/db');

async function start() {
  try {
    await pool.query('SELECT 1');
    console.log('Database connection successful');

    app.listen(config.port, () => {
      console.log(`\n🌸 Flora API is running!`);
      console.log(`   Server:  http://localhost:${config.port}`);
      console.log(`   API:     http://localhost:${config.port}/api`);
      console.log(`   Swagger: http://localhost:${config.port}/api-docs\n`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to database:', err.message);
    console.error('   Make sure PostgreSQL is running and .env is configured.');
    process.exit(1);
  }
}

start();
