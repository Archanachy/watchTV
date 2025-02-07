const express = require('express');
const path = require('path');
const { updateProfile, getProfileById } = require('../models/profileModel');
const upload = require('../middleware/uploadMiddleware');
const { authenticateToken } = require('../middleware/auth');
const fs = require('fs');
const sharp = require('sharp');
const FileType = require('file-type');

const router = express.Router();

// Helper function to delete a file
const deleteFile = (filePath) => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

// Update user profile (PATCH - Partial Update)
router.patch('/profile', upload.single('profileAvatar'), authenticateToken, async (req, res) => {
    let filePath = null; // Declare filePath variable outside try block
    try {
        const userId = req.user.userId; // Get userId from JWT
        const { fullname, bio, city, country } = req.body;

        // Fetch current profile data
        const existingProfile = await getProfileById(userId);
        if (!existingProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Save the old image path for later cleanup (if needed)
        const oldImagePath = existingProfile.image_path; // e.g., '/uploads/avatar.jpg'
        let imagePath = oldImagePath; // Default to existing image path

        // Validate and process uploaded image if present
        if (req.file) {
            filePath = req.file.path; // Path of the newly uploaded file

            // Read file buffer for validation
            const buffer = fs.readFileSync(filePath);

            // Validate MIME type
            const type = await FileType.fromBuffer(buffer);
            if (!type || !['image/jpeg', 'image/png', 'image/jpg'].includes(type.mime)) {
                throw new Error('Invalid file type. Please upload a JPEG, PNG, or JPG image.');
            }

            // Additional validation using sharp (ensures image is valid)
            await sharp(filePath).metadata();

            // Update imagePath with the new file path (as stored in the DB)
            imagePath = `/uploads/${req.file.filename}`;
        }

        // Update profile in DB with new values (or use existing ones if not provided)
        const updatedProfile = await updateProfile({
            userId,
            fullname: fullname || existingProfile.fullname,
            bio: bio || existingProfile.bio,
            city: city || existingProfile.city,
            country: country || existingProfile.country,
            imagePath, // Either the new image path or the old one
        });

        // If a new image was uploaded successfully, delete the old image file to avoid orphaned files.
        if (req.file && oldImagePath && oldImagePath !== imagePath) {
            const relativeOldPath = oldImagePath.startsWith('/') ? oldImagePath.substring(1) : oldImagePath;
            const oldFilePath = path.join(__dirname, '..', relativeOldPath);
            deleteFile(oldFilePath);
        }

        res.status(200).json({ message: 'Profile updated successfully', profile: updatedProfile });
    } catch (error) {
        console.error('Error updating profile:', error.message);
        res.status(500).json({ message: 'Failed to update profile' });
        // If an error occurred and a new file was uploaded, delete the new file to avoid orphaned files.
        if (filePath && res.statusCode !== 200) {
            deleteFile(filePath);
        }
    }
});

module.exports = router;
