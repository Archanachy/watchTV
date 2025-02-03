const pool = require('../config/database');

const getParticularContent = async (contentId) => {
    const queryText = 'SELECT * FROM content WHERE content_id = $1';
    const { rows } = await pool.query(queryText, [contentId]);
    return rows[0]; // Assuming IDs are unique, we return the first row.
  };

module.exports = {
getParticularContent,
}; 