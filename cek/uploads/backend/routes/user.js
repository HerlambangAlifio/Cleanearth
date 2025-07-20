const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const ctrl = require('../controllers/user');

// Admin: list semua user
router.get('/', auth, role('admin'), ctrl.getAll);
// User: lihat profil sendiri
router.get('/me', auth, role('user'), ctrl.getMe);
// User: update profil sendiri
router.patch('/me', auth, role('user'), ctrl.update);
// Admin: hapus user
router.delete('/:id', auth, role('admin'), ctrl.remove);
// Admin: ubah role user
router.patch('/:id/role', auth, role('admin'), ctrl.changeRole);

module.exports = router; 