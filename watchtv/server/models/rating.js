const pool = require('../config/database');

const addRating = async ({ user_id, content_id, rating }) => {
    try {
        let result;

        // Check if the user has already rated the content
        const checkQuery = `SELECT * FROM content_ratings WHERE user_id = $1 AND content_id = $2`;
        const checkResult = await pool.query(checkQuery, [user_id, content_id]);

        if (checkResult.rows.length > 0) {
            // Update existing rating
            const updateQuery = `
                UPDATE content_ratings
                SET rating = $1
                WHERE user_id = $2 AND content_id = $3
                RETURNING *;
            `;
            const updateResult = await pool.query(updateQuery, [rating, user_id, content_id]);
            result = updateResult.rows[0];
        } else {
            // Insert a new rating
            const insertQuery = `
                INSERT INTO content_ratings (user_id, content_id, rating)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;
            const insertResult = await pool.query(insertQuery, [user_id, content_id, rating]);
            result = insertResult.rows[0];
        }

        // Fetch updated average rating and total rating count
        const avgQuery = `
            SELECT ROUND(AVG(rating), 1) AS average_rating, COUNT(*) AS total_ratings
            FROM content_ratings
            WHERE content_id = $1;
        `;
        const avgResult = await pool.query(avgQuery, [content_id]);

        return {
            rating: result.rating,
            content_id: result.content_id,
            user_id: result.user_id,
            average_rating: avgResult.rows[0].average_rating || 0,
            total_ratings: avgResult.rows[0].total_ratings || 0
        };
    } catch (error) {
        console.error('Error during rating:', error.message);
        throw new Error('Server Error');
    }
};

module.exports = { addRating };
