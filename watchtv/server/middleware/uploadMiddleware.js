const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

//file filter to validate the file extension
const fileFilter = async (req, file, cb) => {
  try {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file content. Only genuine JPEG, PNG, and JPG files are allowed.'));
    }
  } catch (error) {
    cb(error);
  }
};


// Multer instance
const upload = multer({
  storage,
  fileFilter, 
});

module.exports = upload;
