require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const userRegisterRoute = require('./routes/userRegisterRoute');
const userLoginRoute = require('./routes/userLoginRoute');
const uploadRoutes = require('./routes/uploadRoutes');
const genreRoutes = require('./routes/genreRoute');
const getContentRoutes = require('./routes/getContentroute'); // Import router
const updateProfileRoute=require('./routes/updateProfileRoute');
const searchRoute = require('./routes/searchRoute');
const getProfileRoute = require('./routes/getProfileRoute');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE'], // Add all necessary methods
  credentials: true,
}));

app.use(bodyparser.json());
app.use(express.urlencoded({ extended: true })); // For handling form-data text fields

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api', userRegisterRoute);
app.use('/api', userLoginRoute);
app.use('/api', uploadRoutes);
app.use('/api', genreRoutes);
app.use('/api', getContentRoutes); 
app.use('/api',updateProfileRoute);
app.use('/api', searchRoute);
app.use('/api', getProfileRoute);

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
