// backend/src/config/db.js
const { Sequelize } = require('sequelize');

// Load env vars
const {
  DATABASE_URL,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_DB,
  MYSQL_USER,
  MYSQL_PASS,
  NODE_ENV
} = process.env;

let sequelize;

// ✅ Prefer full connection string if provided (Railway often gives DATABASE_URL)
if (DATABASE_URL) {
  console.log('✅ Using DATABASE_URL from environment');
  sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'mysql',
    logging: false,
  });
} else {
  // ✅ Use individual variables
  const host = MYSQL_HOST || (NODE_ENV === 'production' ? null : '127.0.0.1');

  if (!host) {
    console.error('❌ No MYSQL_HOST or DATABASE_URL defined — cannot connect to DB.');
    throw new Error('Missing DB configuration');
  }

  console.log('✅ Connecting to MySQL with:', {
    host,
    port: MYSQL_PORT || 3306,
    database: MYSQL_DB,
    user: MYSQL_USER,
    environment: NODE_ENV || 'development'
  });

  sequelize = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PASS, {
    host,
    port: MYSQL_PORT || 3306,
    dialect: 'mysql',
    logging: false,
  });
}

module.exports = sequelize;
