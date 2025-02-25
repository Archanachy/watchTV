const express = require('express');
const { authenticateToken,verifyAdmin } = require('../middleware/auth');
const {  getRatedContent } = require('../models/rating');
const router = express.Router();

router.get('/admin/content-rated/:userId', authenticateToken,verifyAdmin, async (req, res) => {
    try {
        const userId = req.params.userId;
        const contentRated = await  getRatedContent(userId);
        const totalRated = contentRated.length;
        res.status(200).json({ contentRated, totalRated });
    } catch (error) {
        console.error('Error fetching rated content:', error.message);
        res.status(500).json({ message: 'Could not fetch rated content' });
    }
});

module.exports = router;



