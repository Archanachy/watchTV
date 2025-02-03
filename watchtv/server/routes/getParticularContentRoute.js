const express = require('express');
const { getParticularContent } = require('../models/getParticularContent'); // Import the function
const router = express.Router();

// Route to fetch a specific content item by ID
router.get('/content/:contentId', async (req, res) => {
    try {
        const contentId = req.params.contentId; // Extract the content ID from the URL
        const content = await getParticularContent(contentId); // Fetch the content

        // If no content is found, return a 404 error
        if (!content) {
            return res.status(404).json({ message: 'No content found!' });
        }

        // Return the content as a JSON response
        res.status(200).json(content);
    } catch (error) {
        console.error('Error fetching content details:', error);
        res.status(500).json({ message: 'Failed to fetch content details' });
    }
});

module.exports = router; // Export the router