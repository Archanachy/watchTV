const pool = require('../config/database');

async function searchContent(searchTerm) {
    try {
        const query = `
            SELECT c.*
            FROM content c
            WHERE c.title ILIKE $1
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
