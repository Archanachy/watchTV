const express = require('express');
const { authenticateToken, verifyAdmin } = require('../middleware/auth');
const { deleteUser } = require('../models/AllUsersModel');
const router=express.Router();

router.delete('/users/:id', authenticateToken, verifyAdmin, async (req, res) => {
    try {
        const userId = req.params.id;
        await deleteUser(userId);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete user' });
    }
});

module.exports=router;