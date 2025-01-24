const pool = require('../config/database');

async function getContent(kind, genreId) {
    try {
        let query = `
            SELECT c.*
            FROM content c
            JOIN content_genre cg ON c.content_id = cg.content_id
            JOIN genre g ON cg.genre_id = g.genre_id
            WHERE c.kind = $1`;

        let queryParams = [kind]; // Add content type (Movie/Show)

        // Filter by genre_id if provided
        if (genreId) {
            query += ' AND g.genre_id = $2';
            queryParams.push(genreId);
        }

        const result = await pool.query(query, queryParams);
        return result.rows;
    } catch (error) {
        console.error(`Error fetching ${kind.toLowerCase()} content:`, error);
        throw error;
    }
}

module.exports = {
    getContent,
};
