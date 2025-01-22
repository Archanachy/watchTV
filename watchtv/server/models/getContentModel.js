const pool = require('../config/database');

async function getMovies() {
    try {
        const query = 'SELECT * FROM content WHERE kind = $1';
        const result = await pool.query(query, ['Movie']);
        return result.rows;
    } catch (error) {
        console.error('Error fetching movies:', error);
        throw error; // Re-throw error to propagate it.
    }
}


async function getShows() {
    try{
        const query = 'SELECT * FROM content WHERE kind = $1';
        const result = await pool.query(query, ['Show']);
        return result.rows;
    }catch(error){
    console.log('Error fetching shows', error);
    throw error;
    }
}


module.exports = {
    getMovies,
    getShows
};  