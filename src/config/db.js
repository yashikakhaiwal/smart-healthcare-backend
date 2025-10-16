// backend/src/config/db.js
const { Sequelize } = require('sequelize');

const {
  // prefer a full connection string if provided
  DATABASE_URL,
  // common naming variants (yours and Railway's)
  MYSQL_DB,
  MYSQL_DATABASE,
  MYSQLDATABASE,
  MYSQL_USER,
  MYSQLUSER,
  MYSQL_USERNAME,
  MYSQL_PASS,
  MYSQLPASSWORD,
  MYSQL_ROOT_PASSWORD,
  MYSQL_HOST,
  MYSQLHOST,
  MYSQL_PORT,
  MYSQLPORT,
  MYSQL_URL,
  MYSQL_PUBLIC_URL,
  NODE_ENV
} = process.env;

// Determine final values (check many common names)
const dbUrl = DATABASE_URL || MYSQL_URL || MYSQL_PUBLIC_URL;
const dbName = MYSQL_DB || MYSQL_DATABASE || MYSQLDATABASE;
const dbUser = MYSQL_USER || MYSQLUSER || MYSQL_USERNAME;
const dbPass = MYSQL_PASS || MYSQLPASSWORD || MYSQL_ROOT_PASSWORD || '';
const dbHost = MYSQL_HOST || MYSQLHOST;
const dbPort = MYSQL_PORT || MYSQLPORT || 3306;

let sequelize;

if (dbUrl) {
  console.log('DB: using connection URL from env (DATABASE_URL or MYSQL_URL)');
  sequelize = new Sequelize(dbUrl, {
    dialect: 'mysql',
    logging: false,
  });
} else {
  // If running in production and no host provided, fail fast so logs show clear error
  const effectiveHost = dbHost || (NODE_ENV === 'production' ? null : '127.0.0.1');

  if (!effectiveHost) {
    console.error('DB: missing MYSQL_HOST / DATABASE_URL environment variable(s).');
    console.error('Found envs:', {
      MYSQL_HOST: !!MYSQL_HOST,
      MYSQLHOST: !!MYSQLHOST,
      DATABASE_URL: !!DATABASE_URL,
      MYSQL_URL: !!MYSQL_URL
    });
    throw new Error('Database configuration error: no host/url provided');
  }

  console.log('DB: connecting with individual env vars', {
    host: effectiveHost,
    port: dbPort,
    database: dbName,
    user: !!dbUser ? 'provided' : 'not-provided'
  });

  sequelize = new Sequelize(dbName, dbUser, dbPass, {
    host: effectiveHost,
    port: dbPort,
    dialect: 'mysql',
    logging: false,
  });
}

module.exports = sequelize;
