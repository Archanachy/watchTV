const express = require('express');
const { getMovies } = require('../models/getContentModel');

const router = express.Router();

router.get('/movies', async (req, res) => {
  try {
    const movies = await getMovies();
    res.status(200).json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ message: 'Failed to fetch movies' });
  }
});       
module.exports = router;