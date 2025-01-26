const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const fs = require('fs');
const sharp = require('sharp');
const FileType = require('file-type');
const { authenticateToken } = require('../middleware/auth');
const { updateProfile } = require('../models/profileModel'); 


const router = express.Router();

// Helper function to delete a file
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

router.patch('/profile', upload.single('profileAvatar'),authenticateToken,async (req, res) => {
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

      const imagePath = `/uploads/${file.filename}`;

      const { fullname,city,country,bio}=req.body;
      const userId = req.user.userId;

      const profile=await updateProfile({
        userId,
        fullname,
        city,
        country,
        bio,
        imagePath
      });  

      res.status(201).json({ message: 'Profile updated successfully', profile });
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