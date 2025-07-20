const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const ctrl = require('../controllers/dokumentasi');

// Publik: list dokumentasi
router.get('/public', ctrl.getAll);

// Admin: CRUD dokumentasi
router.post('/', auth, role('admin'), ctrl.create);
router.patch('/:id', auth, role('admin'), ctrl.update);
router.delete('/:id', auth, role('admin'), ctrl.remove);
router.get('/', auth, role('admin'), ctrl.getAll);

module.exports = router; 