const express = require('express');
const { authenticateToken, verifyAdmin } = require('../middleware/auth');
const { getAllUser } = require('../models/AllUsersModel');

const router = express.Router();

router.get('/users', authenticateToken, verifyAdmin, async (req, res) => {
    try {
        const users = await getAllUser();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});

module.exports = router;
