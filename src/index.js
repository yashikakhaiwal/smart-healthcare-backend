// backend/src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db'); // your existing sequelize instance
const authRoutes = require('./routes/auth');
const healthRoutes = require('./routes/health');

const app = express();

// Allowed origins: update or add your production/dev domains as needed
const ALLOWED_ORIGINS = [
  'http://localhost:5173', // vite dev
  'http://localhost:3000', // if you use another dev port
  'https://smart-healthcare-backend-production-9e94.up.railway.app', // (optional) backend URL
  'https://smarthealthcarepro.netlify.app', // example Netlify domain (update if different)
  'https://68f02c0d4f33bd80bebd6ac9--smarthealthcarepro.netlify.app' // Netlify preview / custom URL
];

// Enable CORS for the allowed origins and handle credentials
app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS policy: This origin is not allowed'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// Ensure OPTIONS preflight requests are handled
app.options('*', cors());

// JSON parsing
app.use(express.json());

// Simple health check endpoint
app.get('/_health', (req, res) => res.json({ ok: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);

// Start server only after DB connection is ready, with retries
const PORT = process.env.PORT || 4000;
const MAX_DB_RETRIES = 6;
const DB_RETRY_DELAY_MS = 3000;

async function startServer() {
  let attempt = 0;
  while (attempt < MAX_DB_RETRIES) {
    try {
      attempt++;
      console.log(`Attempting DB connection (attempt ${attempt})...`);
      await sequelize.authenticate();
      console.log('MySQL connected');
      // sync models in development; in production consider migrations
      await sequelize.sync({ alter: true });
      console.log('Sequelize synced');
      break; // success
    } catch (err) {
      console.error(`DB connection attempt ${attempt} failed:`, err.message || err);
      if (attempt >= MAX_DB_RETRIES) {
        console.error('Max DB connection attempts reached. Exiting.');
        process.exit(1);
      }
      console.log(`Waiting ${DB_RETRY_DELAY_MS}ms before retrying...`);
      await new Promise((r) => setTimeout(r, DB_RETRY_DELAY_MS));
    }
  }

  app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
}

startServer();
