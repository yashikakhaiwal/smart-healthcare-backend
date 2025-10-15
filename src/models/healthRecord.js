const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const HealthRecord = sequelize.define('HealthRecord', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  metric: { type: DataTypes.STRING },
  value: { type: DataTypes.FLOAT },
  recordedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  meta: { type: DataTypes.JSON }
}, {
  tableName: 'health_records',
  timestamps: true
});

module.exports = HealthRecord;
