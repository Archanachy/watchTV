const pool = require('../config/database'); // PostgreSQL connection

const deleteUserData = async (userId) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Delete related data
        await client.query('DELETE FROM content WHERE id = $1', [userId]);
        await client.query('DELETE FROM content_ratings WHERE user_id = $1', [userId]);
        await client.query('DELETE FROM user_profile WHERE user_id = $1', [userId]);
        await client.query('DELETE FROM watchlist WHERE user_id = $1', [userId]);

        // Finally, delete the user
        await client.query('DELETE FROM users_registration WHERE id = $1', [userId]);

        await client.query('COMMIT');
        return { success: true };
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error deleting user:', error);
        return { success: false, error };
    } finally {
        client.release();
    }
};

module.exports = { deleteUserData };
