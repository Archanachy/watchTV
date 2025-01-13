require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const userRegisterRoute = require('./routes/userRegisterRoute');
const userLoginRoute = require('./routes/userLoginRoute');
const uploadRoutes = require('./routes/uploadRoutes');
const genreRoutes = require('./routes/genreRoute');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5178', // Frontend URL
  methods: ['GET', 'POST'], // Add allowed methods
  credentials: true,
}));

app.use(bodyparser.json());
app.use(express.urlencoded({ extended: true })); // For handling form-data text fields
app.use('/api', uploadRoutes);

app.use('/api',userRegisterRoute);
app.use('/api',userLoginRoute);

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api', uploadRoutes);
app.use('/api', genreRoutes);


//start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});