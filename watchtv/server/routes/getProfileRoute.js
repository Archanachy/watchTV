const express = require('express');
const { getProfileInfo } = require('../models/getProfileModel');

const router = express.Router();

// GET /profile - Fetch all user profiles
router.get('/profile', async (req, res) => {
  try {
    const profiles = await getProfileInfo();
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profiles' });
  }
}); 

module.exports = router;