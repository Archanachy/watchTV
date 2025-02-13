const pool = require('../config/database');

async function getContent(kind, genreId) {
    try {
        let query = `
            SELECT 
                c.content_id,
                c.title,
                c.description,
                TO_CHAR(c.released_date, 'YYYY-MM-DD') AS released_date, -- Ensuring proper date format
                c.duration_minutes,
                c.kind,
                c.image_path
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
