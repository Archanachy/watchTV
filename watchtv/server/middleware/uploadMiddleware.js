const multer = require('multer');
const path = require('path');

//Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));//save images to uploads folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// File filter to validate file type
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and JPG file types are allowed'), false);
    }
  };


// Multer instance
const upload = multer({ 
    storage, 
    limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
    fileFilter 
  });
  
  module.exports = upload;
