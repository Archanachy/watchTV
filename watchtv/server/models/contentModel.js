const pool = require('../config/database');

// Function to check if a title exists in the database
async function checkIfTitleExists(title) {
  const query = 'SELECT 1 FROM content WHERE title = $1 LIMIT 1';
  const result = await pool.query(query, [title]);
  return result.rowCount > 0;
}

// Insert content into the content table
async function insertContent({ userId, title, description, releasedDate, duration, kind, imagePath }) {
  try {
    const query = `
      INSERT INTO content (id, title, description, released_date, duration_minutes, kind, image_path)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING content_id;
    `;
    const values = [userId, title, description, releasedDate, duration, kind, imagePath];
    const result = await pool.query(query, values);
    return result.rows[0].content_id; // Return the newly inserted content ID
  } catch (error) {
    console.error('Error inserting content:', error.message);
    throw new Error('Failed to insert content');
  }
}

// Insert genre relationships into the content_genre table
async function insertContentGenres(contentId, genreIds) {
  try {
    // Build a single query for batch insertion
    const query = `
      INSERT INTO content_genre (content_id, genre_id)
      VALUES ${genreIds.map((_, index) => `($1, $${index + 2})`).join(', ')};
    `;
    const values = [contentId, ...genreIds]; // Combine contentId and genreIds into one array
    await pool.query(query, values);
  } catch (error) {
    console.error('Error inserting content genres:', error.message);
    throw new Error('Failed to associate content with genres');
  }
}

// Map genre names to IDs
async function getGenreIdsByNames(genreNames) {
  try {
    const query = `
      SELECT genre_id FROM genre
      WHERE name = ANY($1);
    `;
    const values = [genreNames]; // Pass genreNames array to the query
    const result = await pool.query(query, values);

    // Return the genre IDs as an array
    return result.rows.map((row) => row.genre_id);
  } catch (error) {
    console.error('Error fetching genre IDs:', error.message);
    throw new Error('Failed to map genre names to IDs');
  }
}

module.exports = {
  checkIfTitleExists,
  insertContent,
  insertContentGenres,
  getGenreIdsByNames,
};
