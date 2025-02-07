const express = require('express');
const { getWatchlist } = require('../models/watchlistModel');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.get('/watchlist', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;  // Extract user ID from token
        const watchlist = await getWatchlist(userId);

        return res.status(200).json(watchlist);
    } catch (error) {
        console.error("Error fetching watchlist:", error.message);
        return res.status(500).json({ message: "Could not fetch watchlist" });
    }
});

module.exports = router;
