const pool = require('../config/database');

async function getAllUser() {
    try {
        const query = `
            SELECT 
                u.id, 
                u.username, 
                u.phone_number, 
                u.role, 
                COALESCE(upload_counts.total_uploads, 0) AS total_uploads,
                COALESCE(rating_counts.total_ratings, 0) AS total_ratings
            FROM 
                users_registration u
            LEFT JOIN (
                SELECT id AS user_id, COUNT(*) AS total_uploads 
                FROM content 
                GROUP BY id
            ) AS upload_counts ON u.id = upload_counts.user_id
            LEFT JOIN (
                SELECT user_id, COUNT(DISTINCT content_id) AS total_ratings 
                FROM content_ratings 
                GROUP BY user_id
            ) AS rating_counts ON u.id = rating_counts.user_id
        `;
        
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}



// Delete a user
async function deleteUser(userId) {
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


module.exports = { getAllUser,deleteUser };
