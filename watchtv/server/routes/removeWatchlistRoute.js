const express = require('express');
const { removeFromWatchlist } = require('../models/watchlistModel');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.delete('/watchlist/:contentId', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;  // Extract user ID from token
        const contentId = parseInt(req.params.contentId, 10); // Convert to integer

        if (isNaN(contentId)) {
            return res.status(400).json({ message: "Invalid Content ID" });
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
