const express = require('express');
const { getMovies,getShows } = require('../models/getContentModel');

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


router.get('/shows', async (req, res) => {
  try {
    const shows = await getShows();
    res.status(200).json(shows);
  } catch (error) {
    console.error('Error fetching shows:', error);
    res.status(500).json({ message: 'Failed to fetch shows' });
  }
});     
module.exports = router;