const express = require('express');
const { getProfileById } = require('../models/profileModel');
const { authenticateToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/admin/user-profile/:userId', authenticateToken,verifyAdmin, async (req, res) => {
  try {
    const userId = req.params.userId;
    const profile = await getProfileById(userId);

    if (!profile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    res.status(200).json({ profile });
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
});

module.exports = router;