const pool = require('../config/database');

async function getProfileInfo() {

    try {
        const query = 'SELECT * FROM user_profile';
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        throw error;
    }
    
}

module.exports = { getProfileInfo };