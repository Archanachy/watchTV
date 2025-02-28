const express = require('express');
const { addToWatchlist,watchlistStatus,removeFromWatchlist,getWatchlist } = require('../models/watchlistModel');
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

router.get('/watchlist/:contentId', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const contentId = parseInt(req.params.contentId, 10);
        if (isNaN(contentId)) {
            return res.status(400).json({ message: 'Invalid Content ID' });
        }
        
        const result = await watchlistStatus({ userId, contentId });

        if (result.error) {
            return res.status(404).json({ message: result.error });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching watchlist status:", error.message);
        return res.status(500).json({ message: "Could not fetch watchlist status" });
    }
});

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

router.delete('/watchlist/:contentId', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const contentId = parseInt(req.params.contentId, 10);
        if (isNaN(contentId)) {
            return res.status(400).json({ message: 'Invalid Content ID' });
        }
        
        const result = await removeFromWatchlist({ userId, contentId });

        if (result.error) {
            return res.status(404).json({ message: result.error });
        }

        return res.status(200).json({ message: "Removed from watchlist" });
    } catch (error) {
        console.error("Error removing from watchlist:", error.message);
        return res.status(500).json({ message: "Could not remove from watchlist" });
    }
});

module.exports = router;
