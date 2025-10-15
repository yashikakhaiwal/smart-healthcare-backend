const express = require('express');
const HealthRecord = require('../models/healthRecord');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// create a health record for the logged-in user
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { metric, value, recordedAt, meta } = req.body;
    if (!metric || value === undefined) return res.status(400).json({ error: 'metric and value required' });

    const record = await HealthRecord.create({
      userId: req.user.id,
      metric,
      value,
      recordedAt: recordedAt ? new Date(recordedAt) : new Date(),
      meta: meta || {}
    });

    res.json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// get records for logged-in user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const records = await HealthRecord.findAll({
      where: { userId: req.user.id },
      order: [['recordedAt', 'DESC']],
      limit: 500
    });
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
