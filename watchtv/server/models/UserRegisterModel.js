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

module.exports={ createUser,findUserByUsername };