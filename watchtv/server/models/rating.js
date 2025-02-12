const pool = require('../config/database');

const addRating = async ({ user_id, content_id, rating }) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Start transaction

        // Check if the user has already rated the content
        const checkQuery = `SELECT * FROM content_ratings WHERE user_id = $1 AND content_id = $2`;
        const checkResult = await client.query(checkQuery, [user_id, content_id]);

        let result;

        if (checkResult.rows.length > 0) {
            // Update existing rating
            const updateQuery = `
                UPDATE content_ratings
                SET rating = $1
                WHERE user_id = $2 AND content_id = $3
                RETURNING *;
            `;
            const updateResult = await client.query(updateQuery, [rating, user_id, content_id]);
            result = updateResult.rows[0];
        } else {
            // Insert a new rating
            const insertQuery = `
                INSERT INTO content_ratings (user_id, content_id, rating)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;
            const insertResult = await client.query(insertQuery, [user_id, content_id, rating]);
            result = insertResult.rows[0];
        }

        // Fetch updated average rating and total rating count
        const avgQuery = `
            SELECT ROUND(AVG(rating), 1) AS average_rating, COUNT(*) AS total_ratings
            FROM content_ratings
            WHERE content_id = $1;
        `;
        const avgResult = await client.query(avgQuery, [content_id]);

        // Commit the transaction
        await client.query('COMMIT');

        return {
            rating: result.rating,
            content_id: result.content_id,
            user_id: result.user_id,
            average_rating: avgResult.rows[0].average_rating || 0,
            total_ratings: avgResult.rows[0].total_ratings || 0
        };
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback if any error occurs
        console.error('Error during rating:', error.message);
        throw new Error('Server Error');
    } finally {
        client.release(); // Release the client back to the pool
    }
};

const getExistingRating = async (userId, contentId) => {
    // Query to check if the user has rated the content
    const query = `
        SELECT * FROM content_ratings 
        WHERE user_id = $1 AND content_id = $2;
    `;
    const result = await pool.query(query, [userId, contentId]);
    return result.rows[0] || null;  // Return the rating or null if not found
};

const getRatedContent = async (userId) => {
    try {
        const query = `
            SELECT c.id, c.content_id, c.image_path, c.title, cr.rating, c.released_date 
            FROM content_ratings cr
            JOIN content c ON cr.content_id = c.content_id
            WHERE cr.user_id = $1
            ORDER BY cr.created_at DESC;
        `;
        const result = await pool.query(query, [userId]);
        return result.rows;
    } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to retrieve rated content");
    }
};

module.exports = { addRating, getExistingRating, getRatedContent };
