const express = require('express');
const { createUser, findUserByUsername } = require('../models/UserRegisterModel');
const bcrypt = require('bcrypt');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, phone_number, password } = req.body;

        // Check if username already exists
        const existingUser = await findUserByUsername(username);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create the user
        const result = await createUser(username, phone_number, hashedPassword);
        res.status(201).json({ message: 'User created successfully', userId: result.rows[0].id });
    } catch (err) {
        console.error('Error during registration:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
