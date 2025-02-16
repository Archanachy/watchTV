const express = require('express');
const { deleteContent, getContentById } = require('../models/contentModel');
const { authenticateToken } = require('../middleware/auth');
const fs = require('fs');
const path = require('path'); // Add path module for proper file deletion
const router = express.Router();

// Helper function to delete a file
const deleteFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    const absoluteFilePath = path.join(__dirname, '..', filePath); // Ensure file path is absolute
    fs.unlinkSync(absoluteFilePath);
  }
};

router.delete('/content/:contentId', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId; // Authenticated user's ID from JWT
        const userRole=req.user.role
        const contentId = req.params.contentId;

        // Fetch current content data
        const existingContent = await getContentById(contentId);
        if (!existingContent) {
            return res.status(404).json({ message: 'Content not found' });
        }

         // Authorization: Allow deletion if user is the owner OR an admin
         if (userRole !== 'admin' && parseInt(userId) !== parseInt(existingContent.id)) {
            return res.status(403).json({ message: 'Unauthorized: You do not have permission to delete this content' });
        }


        // Delete the content from the database
        const result = await deleteContent(contentId);
        
        if (result.rowCount === 0) {
            return res.status(400).json({ message: 'Content could not be deleted, it might already be removed' });
        }

        // Delete the content image file (if it exists)
        deleteFile(existingContent.image_path);

        res.json({ message: 'Content deleted successfully' });
        
    } catch (error) {
        console.error('Error deleting content:', error.message);
        res.status(500).json({ message: 'Failed to delete content' });
    }
});

module.exports = router;
