// backend/src/config/db.js
const { Sequelize } = require('sequelize');

// Support both custom and Railway-provided variable names
const MYSQL_DB =
  process.env.MYSQL_DB || process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE;
const MYSQL_USER =
  process.env.MYSQL_USER || process.env.MYSQLUSER || process.env.MYSQL_USERNAME;
const MYSQL_PASS =
  process.env.MYSQL_PASS || process.env.MYSQLPASSWORD || process.env.MYSQL_ROOT_PASSWORD;
const MYSQL_HOST =
  process.env.MYSQL_HOST || process.env.MYSQLHOST;
const MYSQL_PORT =
  process.env.MYSQL_PORT || process.env.MYSQLPORT || 3306;
const DATABASE_URL =
  process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL;

let sequelize;

if (DATABASE_URL) {
  console.log('✅ Using DATABASE_URL for MySQL connection');
  sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'mysql',
    logging: false,
  });
} else {
  console.log('✅ Using individual MYSQL_* env vars:', {
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_DB,
    MYSQL_USER,
  });

  sequelize = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PASS, {
    host: MYSQL_HOST || '127.0.0.1',
    port: MYSQL_PORT,
    dialect: 'mysql',
    logging: false,
  });
}

module.exports = sequelize;
