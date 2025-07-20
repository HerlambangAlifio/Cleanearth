const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const ctrl = require('../controllers/tips');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Publik: list tips
router.get('/public', ctrl.getAll);

// Admin: CRUD tips
router.post('/', auth, role('admin'), upload.single('gambar'), ctrl.create);
router.patch('/:id', auth, role('admin'), upload.single('gambar'), ctrl.update);
router.delete('/:id', auth, role('admin'), ctrl.remove);
router.get('/', auth, role('admin'), ctrl.getAll);

module.exports = router; 