const pool = require('../config/database');

const getParticularContent = async (contentId) => {
  const queryText = `
      SELECT 
        c.*, 
        u.username, 
        up.image_path AS profile_picture,
        COALESCE(json_agg(json_build_object('genre_id', g.genre_id, 'name', g.name)) 
          FILTER (WHERE g.genre_id IS NOT NULL), '[]'::json) AS genres,
        -- Calculate the average rating and count of ratings
        COALESCE(AVG(r.rating), 0) AS average_rating,
        COALESCE(COUNT(r.rating), 0) AS total_ratings
      FROM content c
      JOIN users_registration u ON c.id = u.id
      LEFT JOIN user_profile up ON u.id = up.user_id
      LEFT JOIN content_genre cg ON c.content_id = cg.content_id
      LEFT JOIN genre g ON cg.genre_id = g.genre_id
      LEFT JOIN content_ratings r ON c.content_id = r.content_id  
      WHERE c.content_id = $1
      GROUP BY c.content_id, u.username, up.image_path;
  `;
  
  const { rows } = await pool.query(queryText, [contentId]);
  return rows[0];
};

module.exports = {
  getParticularContent,
};
