const pool = require('../config/database');

// Fetch all genres from the genre table
async function getAllGenres() {
  const query = 'SELECT genre_id, name FROM genre ORDER BY name;';
  const result = await pool.query(query);
  return result.rows; // Returns an array of genres
}

module.exports = {
  getAllGenres,
};
