const express = require('express');
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
    let filePath = null; // Declare filePath variable outside try block to use in finally

    try {
        const userId = req.user.userId; // Get userId from JWT
        const { fullname, bio, city, country } = req.body;

        // Fetch current profile data
        const existingProfile = await getProfileById(userId);
        if (!existingProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        let imagePath = existingProfile.image_path; // Default to existing image path

        // Validate and process uploaded image if present
        if (req.file) {
            filePath = req.file.path; // Path of the uploaded file

            // Read file buffer for validation
            const buffer = fs.readFileSync(filePath);

            // Validate MIME type
            const type = await FileType.fromBuffer(buffer);
            if (!type || !['image/jpeg', 'image/png', 'image/jpg'].includes(type.mime)) {
                throw new Error('Invalid file type. Please upload a JPEG, PNG, or JPG image.');
            }

            // Additional validation using sharp (ensures image is valid)
            await sharp(filePath).metadata();

            // Update imagePath with new file path
            imagePath = `/uploads/${req.file.filename}`;
        }

        // Update profile in DB
        const updatedProfile = await updateProfile({
            userId,
            fullname: fullname || existingProfile.fullname,
            bio: bio || existingProfile.bio,
            city: city || existingProfile.city,
            country: country || existingProfile.country,
            imagePath, // Update image path (either new or old)
        });

        res.status(200).json({ message: 'Profile updated successfully', profile: updatedProfile });
    } catch (error) {
        console.error('Error updating profile:', error.message);
        res.status(500).json({ message: 'Failed to update profile' });

        // Delete uploaded file only if an error occurs and a file was uploaded
        if (filePath&& res.statusCode !== 201 && res.statusCode !== 200) {
            deleteFile(filePath);
        }
    }
});

module.exports = router;
