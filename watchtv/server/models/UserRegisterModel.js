const pool =require('../config/database');

const createUser=async(username,phone_number,hashedpassword)=>{
    const query=`Insert into users_registration(username,phone_number,password) 
    values($1,$2,$3)
    RETURNING id; `;
    const values=[username,phone_number,hashedpassword];
    return pool.query(query,values);
};
const findUserByUsername = async (username) => {
    const query = `
        SELECT * FROM users_registration
        WHERE username = $1`;
    const values = [username];
    return pool.query(query, values);
};

const findUserByPhone = async (phone_number) => {
    const query = `SELECT * FROM users_registration WHERE phone_number = $1;`;
    return pool.query(query, [phone_number]);
};

module.exports={ createUser,findUserByUsername,findUserByPhone}; 