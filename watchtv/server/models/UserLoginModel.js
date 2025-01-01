const pool = require('../config/database');

const findUserByPhoneNumber = async (phone_number) => {
    const query = `
        SELECT * FROM users_registration
        WHERE phone_number = $1`; 
    const values = [phone_number];
    return pool.query(query, values);
};

module.exports = { findUserByPhoneNumber };
