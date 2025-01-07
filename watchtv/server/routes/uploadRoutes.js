const express = require('express');
const upload = require('../middleware/uploadMiddleware');


const router = express.Router();
// Upload movie endpoint
router.post('/movie', upload.single('movieImage'), (req, res) => {
  try {
    // Access the file
    const file = req.file;

    // Access the other form fields
    const { title, description, duration, kind, genre } = req.body;

    // You can now save `file`, `title`, `description`, etc. to your database
    res.status(200).json({
      message: 'Movie uploaded successfully',
      movie: {
        title,
        description,
        duration,
        kind,
        genre,
        imagePath: file ? `/uploads/${file.filename}` : null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload movie', error: error.message });
  }
});

module.exports = router;
