const pool = require('../config/database');
const { get } = require('../routes/userRegisterRoute');

/**
 * Get the profile of a user by userId
 * @param {number} userId - The ID of the user
 * @returns {Object} - The user's profile data
 */
async function getProfileById(userId) {
    try {
        const query = `SELECT 
        p.profile_id, p.fullname, p.city, p.country, p.bio, p.image_path, p.created_at,
        u.id AS user_id, u.username ,u.created_at
        FROM user_profile p
        JOIN users_registration u ON p.user_id = u.id
        WHERE p.user_id = $1;`;  

        const result = await pool.query(query, [userId]);

        if (result.rows.length === 0) {
            throw new Error('User profile not found');
        }

        return result.rows[0];
    } catch (error) {
        console.error('Error fetching profile:', error.message);
        throw new Error('Could not fetch profile');
    }
}


async function getContentByUser(userId) {
  const query = `
      SELECT 
          c.content_id,
          c.title,
          TO_CHAR(c.released_date, 'YYYY-MM-DD') AS released_date,
          c.image_path,
          COALESCE(ROUND(AVG(cr.rating)::numeric, 1), 0) AS average_rating  -- ✅ Ensure numeric type
      FROM content c
      LEFT JOIN content_ratings cr ON c.content_id = cr.content_id
      WHERE c.id = $1
      GROUP BY c.content_id, c.title, c.released_date, c.image_path;
  `;

  const result = await pool.query(query, [userId]);

  if (result.rows.length === 0) {
      throw new Error('No content uploaded!');
  }

  return result.rows;
}


/**
 * Update user profile with partial updates
 * @param {Object} params - Profile fields
 * @returns {Object} - Updated profile
 */
async function updateProfile({ userId, fullname, city, country, bio, imagePath }) {
    if (!userId) {
      throw new Error('User ID is required to update profile');
    }

    try {
      const updateQuery = `
        UPDATE user_profile
        SET 
          fullname = COALESCE($2, fullname),
          city = COALESCE($3, city),
          country = COALESCE($4, country),
          bio = COALESCE($5, bio),
          image_path = COALESCE($6, image_path),
          updated_at = NOW()
        WHERE user_id = $1
        RETURNING *;
      `;

      const values = [userId, fullname || null, city || null, country || null, bio || null, imagePath || null];

      const resultProfile = await pool.query(updateQuery, values);
      if (resultProfile.rows.length === 0) {
          throw new Error('Profile update failed');
      }

      return resultProfile.rows[0]; // Return the updated profile
    } catch (error) {
      console.error('Error updating profile info:', error.message);
      throw new Error('Failed to update profile info');
    }
}

async function countTotalUpload(userId){
    const query=`SELECT COUNT(*) FROM content WHERE id=$1`;
    const result=await pool.query(query,[userId]);
    return result.rows[0].count;
}

async function getProfilePic(userId){
    const query=`SELECT image_path FROM user_profile WHERE user_id=$1`;
    const result=await pool.query(query,[userId]);
    return result.rows[0].image_path; 
}

module.exports = {
  updateProfile,
  getProfileById,
  getContentByUser,
  countTotalUpload,
  getProfilePic,
};