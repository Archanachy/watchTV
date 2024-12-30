const pool =require('../config/database');

const createUser=async(username,phone_number,hashedpassword)=>{
    const query=`Insert into users_registration(username,phone_number,password) 
    values($1,$2,$3)
    Returining id; `;
    const values=[username,phone_number,hashedpassword];
    return pool.query(query,values);
};
module.exports={ createUser };