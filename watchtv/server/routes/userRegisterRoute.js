const express = require('express');
const { createUser, findUserByUsername, findUserByPhone } = require('../models/UserRegisterModel');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, phone_number, password } = req.body;

        //  Check if username already exists
        const existingUser = await findUserByUsername(username);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Check if phone number already exists
        const existingPhone = await findUserByPhone(phone_number);
        if (existingPhone.rows.length > 0) {
            return res.status(400).json({ message: 'Phone number already exists' });
        }

        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await createUser(username, phone_number, hashedPassword);

        res.status(201).json({ message: 'User created successfully', userId: result.rows[0].id });
    } catch (err) {
        console.error('Error during registration:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
