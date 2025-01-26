const pool = require('../config/database');

async function getMovies() {
    const query = 'SELECT * FROM content WHERE kind = $1';
    const result = await pool.query(query, ['Movie']);
    return result.rows;
}

async function getShows() {
    const query = 'SELECT * FROM content WHERE kind = $1';
    const result = await pool.query(query, ['Show']);
    return result.rows;
}


module.exports = {
    getMovies,
    getShows
};  