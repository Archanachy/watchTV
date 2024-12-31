const pool =require('../config/database');

const createUser=async(username,phone_number,password)=>{
    const query=`Insert into users_registration(username,phone_number,password) 
    values($1,$2,$3)
    RETURNING id; `;
    const values=[username,phone_number,password];
    return pool.query(query,values);
};
module.exports={ createUser };