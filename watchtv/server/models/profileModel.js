const pool = require('../config/database');
const fs = require('fs');
const path = require('path');



/**
 * Get the profile of a user by userId
 * @param {number} userId - The ID of the user
 * @returns {Object} - The user's profile data
 */
const getProfileById = async (userId) => {
    try {
      const query = 'SELECT fullname, city, country, bio, image_path AS imagePath FROM user_profile WHERE user_id = $1';
      const values = [userId];
      const result = await pool.query(query, values);
  
      if (result.rows.length === 0) {
        throw new Error('User profile not found');
      }
  
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching profile:', error.message);
      throw new Error('Could not fetch profile');
    }
  };

async function updateProfile({ userId, fullname, city, country, bio, imagePath }) {
  if (!userId) {
    throw new Error('User ID is required to update profile');
  }

  try {
    // Retrieve the user's current profile to check the existing image path
    const query = `SELECT image_path FROM user_profile WHERE user_id = $1`;
    const result = await pool.query(query, [userId]);

    let oldImagePath = null;

    if (result.rows.length > 0) {
      oldImagePath = result.rows[0].image_path;
    }

    // Delete the old image only if a new image is provided
    if (imagePath && oldImagePath && fs.existsSync(path.resolve(__dirname, '..', oldImagePath))) {
      fs.unlinkSync(path.resolve(__dirname, '..', oldImagePath));
    }

    // Insert or update the profile
    const insertUpdateQuery = `
      INSERT INTO user_profile(user_id, fullname, city, country, bio, image_path)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (user_id)
      DO UPDATE SET
        fullname = EXCLUDED.fullname,
        city = EXCLUDED.city,
        country = EXCLUDED.country,
        bio = EXCLUDED.bio,
        image_path = COALESCE(EXCLUDED.image_path, user_profile.image_path),
        updated_at = NOW()
      RETURNING *;
    `;
    const values = [userId, fullname, city, country, bio, imagePath || oldImagePath];

    const resultProfile = await pool.query(insertUpdateQuery, values);

    return resultProfile.rows[0]; // Return the updated/inserted profile
  } catch (error) {
    console.error('Error updating profile info:', error.message);
    throw new Error('Failed to update profile info');
  }
}

module.exports = {
  updateProfile,
  getProfileById,
};
