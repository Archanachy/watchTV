const express = require('express');
const { getContent } = require('../models/getContentModel');

const router = express.Router();

router.get('/movies', async (req, res) => {
    const { genre_id } = req.query; // Extract genre_id from query params
    try {
        const movies = await getContent('Movie', genre_id);
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
});

router.get('/shows', async (req, res) => {
    const { genre_id } = req.query; // Extract genre_id from query params
    try {
        const shows = await getContent('Show', genre_id);
        res.json(shows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch shows' });
    }
});

module.exports = router;
