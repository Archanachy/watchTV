const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const fs = require('fs');
const sharp = require('sharp');
const FileType = require('file-type');
const { insertContent, insertContentGenres, getGenreIdsByNames } = require('../models/contentModel');

const router = express.Router();

// Upload movie endpoint
router.post('/content', upload.single('contentImage'), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { path: filePath } = file;

    // Validate the file's actual content
    try {
      console.log('File path:', filePath); // Debugging log for file path
      const buffer = fs.readFileSync(filePath);

      // Validate MIME type 
      const type = await FileType.fromBuffer(buffer);
      console.log('File type:', type); // Debugging log for MIME type

      if (!type || !['image/jpeg', 'image/png', 'image/jpg'].includes(type.mime)) {
        fs.unlinkSync(filePath); // Delete invalid file
        return res.status(400).json({ message: 'Invalid file content. Please upload a JPEG, PNG, or JPG image.' });
      }

      // Additional validation using sharp
      const metadata = await sharp(filePath).metadata();
      console.log('Image metadata:', metadata); // Debugging log for sharp metadata
    } catch (error) {
      console.error('Validation error:', error.message); // Debugging log for validation error
      fs.unlinkSync(filePath); // Delete invalid file
      return res.status(400).json({ message: 'Invalid image file content.' });
    }

    // Access the other form fields
    const { user_id,title, description, releasedDate, duration, kind, genres } = req.body;
    if (!user_id) {
      return res.status(400).json({ message: 'User ID is required.' });
    }
  
    const imagePath = `/uploads/${req.file.filename}`;

   // Validate genres
   if (typeof genres !== 'string') {
    return res.status(400).json({ message: 'Genres must be a comma-separated string.' });
  }

    const genreNames = genres.split(',').map((name) => name.trim());
    const genreIds = await getGenreIdsByNames(genreNames);

    if (genreIds.length < 1 || genreIds.length > 3) {
      return res.status(400).json({ message: 'Please select between 1 and 3 genres.' });
    }

    // Step 2: Insert content into the content table
    const contentId = await insertContent({
      userId:user_id,
      title,
      description,
      releasedDate,
      duration,
      kind,
      imagePath,
    });
    // Step 3: Insert genres into the content_genre table
    await insertContentGenres(contentId, genreIds);

    res.status(201).json({ message: 'Content uploaded successfully', contentId });
  
  } catch (error) {
    console.error('Unexpected error:', error.message); // Debugging log for unexpected errors

    // Clean up the file if any error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Failed to upload content', error: error.message });
  }
});

module.exports = router;
