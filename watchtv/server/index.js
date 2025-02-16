require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyparser = require('body-parser');
const userRegisterRoute = require('./routes/userRegisterRoute');
const userLoginRoute = require('./routes/userLoginRoute');
const uploadRoutes = require('./routes/uploadRoutes');
const genreRoutes = require('./routes/genreRoute');
const getContentRoutes = require('./routes/getContentroute'); 
const updateProfileRoute=require('./routes/updateProfileRoute');
const searchRoute = require('./routes/searchRoute');
const getProfileRoute = require('./routes/getProfileRoute');
const getContentUploadedByUser = require('./routes/getContentUploadedByUser');
const totalUploadRoute = require('./routes/countTotalUpload');
const ProfilePictureRoute = require('./routes/getProfiePic');
const UpdateContentRoute = require('./routes/UpdateContentRoute');
const DeleteContentRoute = require('./routes/DeleteContentRoute');
const watchlistRoute = require('./routes/watchlistRoute');
const removeWatchlistRoute = require('./routes/removeWatchlistRoute');
const getWatchlistRoute = require('./routes/getWatchlistRoute');
const getParticularContentRoute = require('./routes/getParticularContentRoute');
const watchlistStatusRoute = require('./routes/watchlistStatus');
const ratingRoute = require('./routes/ratingRoute');
const getContentRated = require('./routes/contentRateRoute');
const deleteMyAccount=require('./routes/DeleteMe');
const getAllUserRoute=require('./routes/getAllUserRoute');
const deleteAnyUserRoute=require('./routes/deleteAnyUserRoute');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE','OPTIONS'], // Add all necessary methods
  credentials: true,
}));

app.use('/uploads', cors({
  origin: 'http://localhost:5173', // Allow your frontend URL to access the uploads folder
  methods: ['GET'],
}), express.static(path.join(__dirname, 'uploads')));

app.use(bodyparser.json());
app.use(express.urlencoded({ extended: true })); // For handling form-data text fields
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
app.use('/api', userRegisterRoute);
app.use('/api', userLoginRoute);
app.use('/api', uploadRoutes);
app.use('/api', genreRoutes);
app.use('/api', getContentRoutes); 
app.use('/api',updateProfileRoute);
app.use('/api', searchRoute);
app.use('/api', getProfileRoute);
app.use('/api', getContentUploadedByUser);
app.use('/api', totalUploadRoute);
app.use('/api', ProfilePictureRoute);
app.use('/api', UpdateContentRoute);
app.use('/api', DeleteContentRoute);
app.use('/api', watchlistRoute);
app.use('/api', removeWatchlistRoute);
app.use('/api', getWatchlistRoute);
app.use('/api', getParticularContentRoute);
app.use('/api', watchlistStatusRoute);
app.use('/api', ratingRoute);
app.use('/api', getContentRated);
app.use('/api',deleteMyAccount);
app.use('/api',getAllUserRoute);
app.use('/api',deleteAnyUserRoute);

// Start server
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
