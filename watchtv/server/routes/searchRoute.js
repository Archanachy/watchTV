const express = require('express');
const { searchContent } = require('../models/search');

const router = express.Router();

router.get('/search', async (req, res) => {
    const { searchTerm } = req.query; // Extract searchTerm from query params

    if (!searchTerm || searchTerm.trim() === '') {
        return res.status(400).json({ success: false, message: 'Search term cannot be empty.' });
    }

    try {
        const content = await searchContent(searchTerm);
        res.json({ success: true, data: content });
    } catch (error) {
        console.error('Error searching for content:', error);
        res.status(500).json({ success: false, message: 'Failed to search content.' });
    }
});

module.exports = router;
