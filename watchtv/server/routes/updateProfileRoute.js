const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const fs = require('fs');
const sharp = require('sharp');
const FileType = require('file-type');
const { authenticateToken } = require('../middleware/auth');
const { updateProfile,getProfileById } = require('../models/profileModel'); 


const router = express.Router();

// Helper function to delete a file
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

router.patch('/profile', upload.single('profileAvatar'), authenticateToken, async (req, res) => {
  let filePath = null;

  try {
    const file = req.file;
    let imagePath = null;

    if (file) {
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

      // Set the imagePath for the new file
      imagePath = `/uploads/${file.filename}`;
    }

    const { fullname, city, country, bio } = req.body;
    const userId = req.user.userId;

    // Fetch the existing profile from the database (to retain the current profile picture if no file is uploaded)
    const existingProfile = await getProfileById(userId); // Replace with your actual query to fetch user profile

    // If no new file is uploaded, retain the existing imagePath
    imagePath = imagePath || existingProfile.imagePath;

    const profile = await updateProfile({
      userId,
      fullname,
      city,
      country,
      bio,
      imagePath // This will retain the existing imagePath if no new file is uploaded
    });

    res.status(200).json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(400).json({ message: error.message });
  } finally {
    // Always attempt to clean up the uploaded file if there was an error
    if (filePath && res.statusCode !== 200) {
      deleteFile(filePath);
    }
  }
});
module.exports = router;    