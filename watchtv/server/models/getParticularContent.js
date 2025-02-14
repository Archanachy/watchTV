const pool = require('../config/database');

const getParticularContent = async (contentId) => {
  const queryText = `
  SELECT 
    c.content_id,
    c.title,
    c.description,
    TO_CHAR(c.released_date, 'YYYY-MM-DD') AS released_date, -- Ensuring proper date format
    c.duration_minutes,
    c.kind,
    c.image_path,
    u.username,
    up.image_path AS profile_picture,
    COALESCE(json_agg(DISTINCT jsonb_build_object('genre_id', g.genre_id, 'name', g.name)) FILTER (WHERE g.genre_id IS NOT NULL), '[]'::json) AS genres,
    COALESCE(ROUND(AVG(r.rating), 1), 0) AS average_rating,
    COALESCE(COUNT(DISTINCT r.user_id), 0) AS total_ratings
FROM content c
JOIN users_registration u ON c.id = u.id  -- Fixed join condition
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
