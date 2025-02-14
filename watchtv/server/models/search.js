const pool = require('../config/database');

async function searchContent(searchTerm) {
    try {
        const query = `
            SELECT 
                c.content_id, 
                c.title, 
                c.image_path, 
                TO_CHAR(c.released_date, 'YYYY-MM-DD') AS released_date, 
                c.duration_minutes,
                c.kind,
                COALESCE(ROUND(AVG(cr.rating)::numeric, 1), 0) AS average_rating  -- Include average rating
            FROM content c
            LEFT JOIN content_ratings cr ON c.content_id = cr.content_id  -- LEFT JOIN for ratings
            WHERE c.title ILIKE $1
            GROUP BY c.content_id;  -- Group by content_id and other necessary fields
        `;

        const result = await pool.query(query, [`%${searchTerm}%`]);
        return result.rows;
    } catch (error) {
        console.error('Error searching for content:', error);
        throw error;
    }
}

module.exports = {
    searchContent,
};

