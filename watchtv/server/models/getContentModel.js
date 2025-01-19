const pool = require('../config/database');

async function getMovies(){
    const query = 'SELECT * FROM content';
    const result = await pool.query(query);
    return result.rows;
}
module.exports = {
    getMovies
};  