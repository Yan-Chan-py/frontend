const { Sequelize } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: 'postgres',
    logging: false, // Set to console.log if you want to see SQL queries
    define: {
      timestamps: true,
      underscored: true,
    },
  }
);

module.exports = sequelize;
