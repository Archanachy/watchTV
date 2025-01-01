require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const userRegisterRoute = require('./routes/userRegisterRoute');
const userLoginRoute = require('./routes/userLoginRoute');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  methods: ['GET', 'POST'], // Add allowed methods
  credentials: true,
}));


app.use(bodyparser.json());

app.use('/api',userRegisterRoute);
app.use('/api',userLoginRoute);


//start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});