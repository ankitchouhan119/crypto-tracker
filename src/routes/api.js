const express = require('express');
const router = express.Router();
const cryptoService = require('../services/cryptoService');



// GET /api/stats
router.get('/stats', async (req, res) => {
  try {
    const { coin } = req.query;
    if (!['bitcoin', 'matic-network', 'ethereum'].includes(coin)) {
      return res.status(400).json({ error: 'Invalid coin' });
    }

    const stats = await cryptoService.getLatestStats(coin);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(error.message.includes('No data found') ? 404 : 500).json({ error: error.message });
  }
});

// GET /api/deviation
router.get('/deviation', async (req, res) => {
  try {
    const { coin } = req.query;
    if (!['bitcoin', 'matic-network', 'ethereum'].includes(coin)) {
      return res.status(400).json({ error: 'Invalid coin' });
    }

    const deviation = await cryptoService.calculateDeviation(coin);
    res.json({ deviation });
  } catch (error) {
    console.error('Error calculating deviation:', error);
    res.status(error.message.includes('No data found') ? 404 : 500).json({ error: error.message });
  }
});

module.exports = router;