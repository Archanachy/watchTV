const pool = require('../config/database');

const findUserByPhoneNumber = async (phone_number) => {
    const query = `
        SELECT * FROM users_registration
        WHERE phone_number = $1`; 
    const values = [phone_number];
    return pool.query(query, values);
};

// Function to check if a profile exists
const findUserProfile = async (userId) => {
    const query = 'SELECT * FROM user_profile WHERE user_id = $1';
    return await pool.query(query, [userId]);
};

// Function to create a default profile
const createDefaultProfile = async (userId) => {
    const query = `
        INSERT INTO user_profile (user_id, fullname, city, country, bio, image_path)
        VALUES ($1, 'Real Name', 'city', 'country', 'biography', '/Users/aryanshah/Developer/watchTV/watchtv/server/uploads/defaultAvatar.jpg')`;
    return await pool.query(query, [userId]);
};

module.exports = { findUserProfile, createDefaultProfile,findUserByPhoneNumber };


