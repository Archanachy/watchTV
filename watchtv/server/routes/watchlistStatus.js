const express=require('express');
const { watchlistStatus } = require('../models/watchlistModel');
const { authenticateToken } = require('../middleware/auth');
const router=express.Router();

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

module.exports = router;