require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/database');
const bodyparser = require('body-parser');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  methods: ['GET', 'POST'], // Add allowed methods
  credentials: true,
}));


app.use(bodyparser.json());

app.use('/api', userRoutes);


//start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});