const express = require('express');
const { findUserByPhoneNumber } = require('../models/UserLoginModel');
const bcrypt = require('bcrypt');

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { phone_number, password } = req.body;

        // Find the user by phone number
        const userResult = await findUserByPhoneNumber(phone_number);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: 'Phone number not registered' });
        }

        const user = userResult.rows[0];

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        res.status(200).json({ message: 'Login successful', userId: user.id });
    } catch (err) {
        console.error('Error during login:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;    
    
