const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const ctrl = require('../controllers/laporan');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Admin: list semua laporan
router.get('/', auth, role('admin'), ctrl.getAll);
// User: list laporan sendiri
router.get('/mine', auth, role('user'), ctrl.getMine);
// User: buat laporan
router.post('/', auth, role('user'), upload.array('gambar'), ctrl.create);
// Admin: update laporan
router.patch('/:id', auth, role('admin'), upload.array('gambar'), ctrl.update);
// Admin: hapus laporan
router.delete('/:id', auth, role('admin'), ctrl.remove);
// Admin: validasi laporan
router.patch('/:id/validasi', auth, role('admin'), ctrl.validate);

module.exports = router; 