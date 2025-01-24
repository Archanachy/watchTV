const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const fs = require('fs');
const sharp = require('sharp');
const FileType = require('file-type');
const { insertContent, insertContentGenres, getGenreIdsByNames, checkIfTitleExists } = require('../models/contentModel');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Helper function to delete a file
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// Upload movie endpoint
router.post('/content', upload.single('contentImage'), authenticateToken, async (req, res) => {
  let filePath = null;

  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    filePath = file.path;

    // Validate the file's actual content
    const buffer = fs.readFileSync(filePath);

    // Validate MIME type
    const type = await FileType.fromBuffer(buffer);
    if (!type || !['image/jpeg', 'image/png', 'image/jpg'].includes(type.mime)) {
      throw new Error('Invalid file content. Please upload a JPEG, PNG, or JPG image.');
    }

    // Additional validation using sharp
    await sharp(filePath).metadata();

    // Access the other form fields
    const { title, description, releasedDate, duration, kind, genres } = req.body;

    // Check if the title already exists
    const titleExists = await checkIfTitleExists(title);
    if (titleExists) {
      throw new Error('Title already exists. Please choose a different title.');
    }

    const imagePath = `/uploads/${file.filename}`;

    // Validate genres
    if (typeof genres !== 'string') {
      throw new Error('Genres must be a comma-separated string.');
    }

    const genreNames = genres.split(',').map((name) => name.trim());
    const genreIds = await getGenreIdsByNames(genreNames);

    if (genreIds.length < 1 || genreIds.length > 3) {
      throw new Error('Please select between 1 and 3 genres.');
    }

    const userId = req.user.userId;

    // Insert content into the content table
    const contentId = await insertContent({
      userId,
      title,
      description,
      releasedDate,
      duration,
      kind,
      imagePath,
    });

    // Insert genres into the content_genre table
    await insertContentGenres(contentId, genreIds);

    res.status(201).json({ message: 'Content uploaded successfully', contentId });

  } catch (error) {
    console.error('Error:', error.message);

    // Return appropriate error response
    res.status(400).json({ message: error.message });
  } finally {
    // Always attempt to clean up the uploaded file
    if (filePath && res.statusCode !== 201) {
      deleteFile(filePath);
    }
  }
}); 

module.exports = router;
