const express = require('express');
const { deleteUserData } = require('../models/DeleteMeModel');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.delete('/deleteAccount', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId; // Extract user_id from authentication middleware
        
        const result = await deleteUserData(userId);

        if (result.success) {
            res.status(200).json({ message: 'Account deleted successfully' });
        } else {
            res.status(500).json({ error: 'Failed to delete account', details: result.error });
        }
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
