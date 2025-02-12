const express = require('express');
const { addRating, getExistingRating } = require('../models/rating');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.post('/rating/:contentId', authenticateToken, async (req, res) => {    
    try {
        const userId = req.user.userId;
        const contentId = parseInt(req.params.contentId, 10);
        const { rating } = req.body; 
        
        // Ensure the rating is between 1 and 5
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        if (isNaN(contentId)) {
            return res.status(400).json({ message: 'Invalid Content ID' });
        }

        // Check if the user has already rated this content
        const existingRating = await getExistingRating(userId, contentId);

        let result;

        if (existingRating) {
            // Update the existing rating (no need to increment total_ratings)
            result = await addRating({ user_id: userId, content_id: contentId, rating });
            return res.status(200).json({
                message: `Rating updated successfully`,
                rating: result.rating,
                content_id: result.content_id,
                user_id: result.user_id,
                average_rating: result.average_rating,
                total_ratings: result.total_ratings
            });
        } else {
            // Add a new rating and increment total_ratings
            result = await addRating({ user_id: userId, content_id: contentId, rating });
            return res.status(200).json({
                message: 'Rating added successfully',
                rating: result.rating,
                content_id: result.content_id,
                user_id: result.user_id,
                average_rating: result.average_rating,
                total_ratings: result.total_ratings
            });
        }
    } catch (error) {
        console.error('Error adding rating:', error.message);
        res.status(500).json({ message: 'Could not rate content' });
    }
});

module.exports = router;
