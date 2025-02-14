const pool = require('../config/database');

// Function to check if a title exists in the database
async function checkIfTitleExists(title, contentId) {
  const query = `SELECT COUNT(*) FROM content WHERE title = $1 AND content_id != $2`;
  const { rows } = await pool.query(query, [title, contentId]);
  return rows[0].count > 0;
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

// Delete all genre associations for a given content ID
async function deleteContentGenres(contentId) {
  try {
    const query = 'DELETE FROM content_genre WHERE content_id = $1';
    await pool.query(query, [contentId]);
  } catch (error) {
    console.error('Error deleting content genres:', error.message);
    throw new Error('Failed to delete old content genres');
  }
}

async function updateContentGenres(contentId, genreIds) {
  try {
    console.log(`Updating genres for contentId: ${contentId}`);
    
    // Remove old associations
    await deleteContentGenres(contentId);
    console.log(`Deleted old genres for contentId: ${contentId}`);

    // If there are any new genres, insert them
    if (genreIds.length > 0) {
      const query = `
        INSERT INTO content_genre (content_id, genre_id)
        VALUES ${genreIds.map((_, index) => `($1, $${index + 2})`).join(', ')};
      `;
      const values = [contentId, ...genreIds];

      console.log(`Inserting new genres for contentId: ${contentId}, genres: ${genreIds}`);
      await pool.query(query, values);
      console.log(`Inserted new genres successfully.`);
    }
  } catch (error) {
    console.error('Error updating content genres:', error.message);
    throw new Error('Failed to update content genres');
  }
}


async function getContentById(contentId) {
  try {
    const query = 'SELECT * FROM content WHERE content_id = $1';
    const result = await pool.query(query, [contentId]);
    return result.rows[0];
  } catch (error) { 
    console.error('Error fetching content by ID:', error.message);
    throw new Error('Failed to fetch content');
  }
}

// (Optional) Update content details in the content table
async function updateContent({ contentId, title, description, releasedDate, duration, kind, imagePath }) {
  try {
    const query = `
      UPDATE content
      SET title = $1,
          description = $2,
          released_date = $3,
          duration_minutes = $4,
          kind = $5,
          image_path = $6
      WHERE content_id = $7
      RETURNING *;
    `;
    const values = [title, description, releasedDate, duration, kind, imagePath, contentId];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating content:', error.message);
    throw new Error('Failed to update content');
  }
}

async function deleteContent(contentId) {
  try {
    const query = 'DELETE FROM content WHERE content_id = $1 RETURNING content_id';
    const result = await pool.query(query, [contentId]);
    
    // Return result for further handling (e.g., check if deletion succeeded)
    return result;
  }
  catch (error) {
    console.error('Error deleting content:', error.message);
    throw new Error('Failed to delete content');
  }
}



module.exports = {
  checkIfTitleExists,
  insertContent,
  insertContentGenres,
  getGenreIdsByNames,
  updateContentGenres, 
  updateContent, 
  getContentById,  
  deleteContent,
};
