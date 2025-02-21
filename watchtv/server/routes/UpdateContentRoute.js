const express = require('express');
const path = require('path');
const upload = require('../middleware/uploadMiddleware');
const { authenticateToken } = require('../middleware/auth');
const fs = require('fs');
const sharp = require('sharp');
const FileType = require('file-type');
const { getContentById, updateContent, getGenreIdsByNames, updateContentGenres,checkIfTitleExists } = require('../models/contentModel');

const router = express.Router();

// Helper function to delete a file
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// Update content (PATCH - Partial Update)
router.patch('/content/:contentId', upload.single('contentImage'), authenticateToken, async (req, res) => {
  let filePath = null;

  try {
    const userId = req.user.userId; // Authenticated user's ID from JWT
    const userRole=req.user.role;
  
    const { title, description, releasedDate, duration, kind, genres } = req.body;
    const contentId = req.params.contentId;

    // Check if the title already exists
    const titleExists = await checkIfTitleExists(title, contentId);
    if (titleExists && title !== existingContent.title) {
      throw new Error('Title already exists. Please choose a different title.');
    }
    
    // Fetch current content data
    const existingContent = await getContentById(contentId);
    if (!existingContent) {
      return res.status(404).json({ message: 'Content not found' });
    }

       // Authorization: Allow update if user is the owner OR an admin
       if (userRole !== 'admin' && parseInt(userId) !== parseInt(existingContent.id)) {
        return res.status(403).json({ message: 'Unauthorized: You do not have permission to update this content' });
      }
  
    // Save the old image path for later cleanup (if needed)
    const oldImagePath = existingContent.image_path; // e.g., '/uploads/oldImage.jpg'
    let imagePath = oldImagePath; // Default to the existing image path

    // Validate and process uploaded image if present
    if (req.file) {
      filePath = req.file.path; // This is the new file's path (e.g., 'uploads/newImage.jpg' or similar)

      // Read file buffer for validation
      const buffer = fs.readFileSync(filePath);

      // Validate MIME type
      const type = await FileType.fromBuffer(buffer);
      if (!type || !['image/jpeg', 'image/png', 'image/jpg'].includes(type.mime)) {
        throw new Error('Invalid file type. Please upload a JPEG, PNG, or JPG image.');
      }

      // Additional validation using sharp (ensures image is valid)
      await sharp(filePath).metadata();

      // Update imagePath with new file path (as stored in the DB)
      imagePath = `/uploads/${req.file.filename}`;
    }

    // Validate genres if provided in the request.
    let genreIds;
    if (typeof genres === 'string' && genres.trim() !== '') {
      // Convert genre names to an array and map them to genre IDs
      const genreNames = genres.split(',').map((name) => name.trim());
      genreIds = await getGenreIdsByNames(genreNames);

      if (genreIds.length < 1 || genreIds.length > 3) {
        throw new Error('Please select between 1 and 3 genres.');
      }
    }

    const formattedDate = releasedDate || existingContent.released_date;
    console.log("Received releasedDate:", releasedDate);
    console.log("Formatted releasedDate:", formattedDate);


    const updatedContent = await updateContent({
        contentId,
        title: (title !== undefined && title.trim() !== '') ? title : existingContent.title,
        description: (description !== undefined && description.trim() !== '') ? description : existingContent.description,
        releasedDate: formattedDate,
        duration: (duration !== undefined && duration.toString().trim() !== '' && !isNaN(parseInt(duration, 10))) ? parseInt(duration, 10) : existingContent.duration_minutes,
        kind: (kind !== undefined && kind.trim() !== '') ? kind : existingContent.kind,
        imagePath, // Either the new image path or the old one
      });
      
    // Update genres if new genres are provided in the request.
    if (genreIds) {
      await updateContentGenres(contentId, genreIds);
    }

    console.log('Received genres:', genres);
    console.log('Mapped genre IDs:', genreIds);


    // If a new image was uploaded successfully, delete the old image file to avoid orphaned files.
    if (req.file && oldImagePath && oldImagePath !== imagePath) {
      // Remove the leading '/' from the stored path to build a correct file system path.
      const relativeOldPath = oldImagePath.startsWith('/') ? oldImagePath.substring(1) : oldImagePath;
      const oldFilePath = path.join(__dirname, '..', relativeOldPath);
      deleteFile(oldFilePath);
    }

    res.status(200).json({ message: 'Content updated successfully', content: updatedContent });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(400).json({ message: error.message });
  } finally {
    // If an image file was uploaded and an error occurred, remove it.
    if (filePath && res.statusCode !== 200) {
      deleteFile(filePath);
    }
  }
});

module.exports = router;
