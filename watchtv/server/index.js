require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./config/database');



app.use(cors());

const PORT = process.env.PORT || 3001;

console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database', err);
  } else {
    console.log('Connected to the database', res.rows);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});