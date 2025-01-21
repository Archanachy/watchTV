const pool = require('../config/database');

// Fetch all genres from the genre table
async function getAllGenres() {
  const query = 'SELECT genre_id, name FROM genre ORDER BY name;';
  const result = await pool.query(query);
  return result.rows; // Returns an array of genres
}

const sortContentByGenre = async (genre) => {
    const query = `
        SELECT content.*
        FROM content
        JOIN content_genre ON content.id = content_genre.content_id
        JOIN genre ON content_genre.genre_id = genre.genre_id
        WHERE genre.name = $1;
    `;
    const values = [genre];
    const result = await pool.query(query, values);
    return result.rows;
};

module.exports = {
  getAllGenres,
  sortContentByGenre
};
