const express = require('express');
const { getAllGenres,sortContentByGenre } = require('../models/genreModel');

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


router.get('/genres/:genre', async (req, res) => {
  const genre = req.params.genre;
  try {
    const content = await sortContentByGenre(genre);
    res.status(200).json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ message: 'Failed to fetch content' });
  }
}); 

module.exports = router;
