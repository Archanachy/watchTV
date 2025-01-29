const express = require('express');
const { findUserByPhoneNumber,findUserProfile,createDefaultProfile } = require('../models/UserLoginModel');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');
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

        // Check if profile exists
        const profileResult = await findUserProfile(user.id);
        if (profileResult.rows.length === 0) {
        await createDefaultProfile(user.id); // Create a default profile if not found
        }

        // Generate a JWT
        const token = generateToken(user.id); // Only pass the user ID to the token

        // Send the response with the token and userId
        res.status(200).json({
            message: 'Login successful',
            token,
            userId: user.id,
        });
    } catch (err) {
        console.error('Error during login:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
