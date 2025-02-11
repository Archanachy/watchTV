const pool = require('../config/database');

const addToWatchlist = async ({ userId, contentId }) => {
    try {
        // Validate input
        if (!userId || !contentId || isNaN(userId) || isNaN(contentId)) {
            return { error: "Invalid userId or contentId" };
        }

        // Check if content exists
        const contentCheck = await pool.query(
            "SELECT content_id FROM content WHERE content_id = $1",
            [contentId]
        );

        if (contentCheck.rows.length === 0) {
            return { error: "Content not found" };
        }

        // Insert into watchlist if not already present
        const query = `
            INSERT INTO watchlist (user_id, content_id) 
            VALUES ($1, $2) 
            ON CONFLICT (user_id, content_id) DO NOTHING 
            RETURNING *;
        `;

        const { rows } = await pool.query(query, [userId, contentId]);

        if (rows.length === 0) {
            return { message: "Content already in watchlist" };
        }

        return { success: true, message: "Added to watchlist", data: rows[0] };

    } catch (error) {
        console.error("Database Error:", error.message);
        return { error: "Could not add to watchlist" };
    }
};


const removeFromWatchlist = async ({ userId, contentId }) => {
    try {
        // Check if the content exists in the watchlist
        const checkQuery = `
            SELECT watchlist_id FROM watchlist WHERE user_id = $1 AND content_id = $2;
        `;
        const checkResult = await pool.query(checkQuery, [userId, contentId]);

        if (checkResult.rows.length === 0) {
            return { error: "Content not found in watchlist" };
        }

        // Delete from watchlist
        const deleteQuery = `
            DELETE FROM watchlist WHERE user_id = $1 AND content_id = $2;
        `;
        await pool.query(deleteQuery, [userId, contentId]);

        return { success: true };
    } catch (error) {
        console.error("Database Error:", error.message);
        return { error: "Could not remove from watchlist" };
    }
};

const getWatchlist = async (userId) => {
    try {
        const query = `
            SELECT w.content_id, c.title, c.image_path, c.released_date
            FROM watchlist w
            JOIN content c ON w.content_id = c.content_id
            WHERE w.user_id = $1;
        `;
        const { rows } = await pool.query(query, [userId]);

        return rows; // ✅ Return only the watchlist array
    } catch (error) {
        console.error("Database Error:", error.message);
        return []; // ✅ Return empty array instead of an error object
    }
};


const watchlistStatus = async ({ userId, contentId }) => {
    try {
        const query = `SELECT * FROM watchlist WHERE user_id = $1 AND content_id = $2;`;
        const { rows } = await pool.query(query, [userId, contentId]);

        return { inWatchlist: rows.length > 0 };  // ✅ Return a boolean
    } catch (error) {
        console.error("Database Error:", error.message);
        return { error: "Could not fetch watchlist status" };
    }
};



module.exports = { addToWatchlist, removeFromWatchlist, getWatchlist, watchlistStatus };
