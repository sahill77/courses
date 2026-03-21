import express from 'express';
import multer from 'multer';
import path from 'path';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for security
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, and PNG are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Upload endpoint
// Allow both admins and approved instructors to upload files
router.post('/', auth, (req, res, next) => {
  if (req.user.role === 'admin' || (req.user.role === 'instructor' && req.user.isApproved)) {
    return next();
  }
  res.status(403).send({ error: 'Access denied.' });
}, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ error: 'Please upload a file' });
  }
  
  // Return the public URL
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.send({ url: fileUrl });
});

export default router;
