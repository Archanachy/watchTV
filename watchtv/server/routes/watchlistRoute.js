const express = require('express');
const { addToWatchlist } = require('../models/watchlistModel');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.post('/watchlist/:contentId', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const contentId = parseInt(req.params.contentId, 10);
        if (isNaN(contentId)) {
            return res.status(400).json({ message: 'Invalid Content ID' });
        }
        
        const watchlist = await addToWatchlist({ userId, contentId });
        return res.status(201).json(watchlist);
    } catch (error) {
        console.error('Error adding to watchlist:', error.message);
        return res.status(500).json({ message: 'Could not add to watchlist' });
    }
});

module.exports = router;
