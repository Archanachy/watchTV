const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const fs = require('fs');
const sharp = require('sharp');
const FileType = require('file-type');


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
    const { title, description, duration, kind, genre } = req.body;

    // Construct response
    res.status(200).json({
      message: 'Movie uploaded successfully',
      content: {
        title,
        description,
        duration,
        kind,
        genre,
        imagePath: `/uploads/${file.filename}`,
      },
    });
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
