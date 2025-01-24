const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

async function updateProfile({ userId, fullname, city, country, bio, imagePath }) {
    if (!userId) {
        throw new Error('User ID is required to update profile');
      }
    try {
         // First, retrieve the user's current profile to check the existing image path
         const query = `SELECT * FROM user_profile WHERE user_id = $1`;
         const result = await pool.query(query, [userId]);
 
         if (result.rows.length > 0) {
             const oldImagePath = result.rows[0].image_path;
             // If there's an old image, delete it from the server
             if (oldImagePath && fs.existsSync(path.join(__dirname, '..', oldImagePath))) {
                 fs.unlinkSync(path.join(__dirname, '..', oldImagePath)); // Delete the old image
             }
         }

        const insertUpdateQuery = `
        INSERT INTO user_profile(user_id, fullname, city, country, bio, image_path)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (user_id)
        DO UPDATE SET
            fullname = EXCLUDED.fullname,
            city = EXCLUDED.city,
            country = EXCLUDED.country,
            bio = EXCLUDED.bio,
            image_path = EXCLUDED.image_path,
            updated_at = NOW()
        RETURNING *;
        `;
        const values = [userId, fullname, city, country, bio, imagePath];

        const resultProfile = await pool.query(insertUpdateQuery, values);

        return resultProfile.rows[0]; // Return the updated/inserted profile
    } catch (error) {
        console.error('Error updating profile info:', error.message);
        throw new Error('Failed to update profile info');
    }
}

module.exports = {
    updateProfile,
};
