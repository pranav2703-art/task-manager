const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');

router.get('/', async (req, res) => {
  try {
    const { project, limit = 20 } = req.query;
    const filter = {};
    if (project) filter.project = project;
    const activities = await Activity.find(filter)
      .populate('user', 'name initials color')
      .sort({ createdAt: -1 })
      .limit(Number(limit));
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
