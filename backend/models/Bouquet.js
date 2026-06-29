const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const Bouquet = sequelize.define('Bouquet', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  photoURL: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  favorite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: 'general',
    allowNull: false,
  },
  is_bestseller: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
}, {
  tableName: 'bouquets',
  timestamps: true,
  underscored: true,
});

module.exports = Bouquet;
