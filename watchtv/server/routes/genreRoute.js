const express = require('express');
const { getAllGenres } = require('../models/genreModel');

const router = express.Router();

// GET /genres - Fetch all genres
router.get('/genres', async (req, res) => {
  try {
    const genres = await getAllGenres();
    res.status(200).json(genres);
  } catch (error) {
    console.error('Error fetching genres:', error);
    res.status(500).json({ message: 'Failed to fetch genres' });
  }
});


module.exports = router;
