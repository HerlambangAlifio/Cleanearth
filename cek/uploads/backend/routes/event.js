const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const ctrl = require('../controllers/event');

// Publik: list event
router.get('/public', ctrl.getPublic);

// Admin: CRUD event
router.post('/', auth, role('admin'), ctrl.create);
router.patch('/:id', auth, role('admin'), ctrl.update);
router.delete('/:id', auth, role('admin'), ctrl.remove);
router.get('/', auth, role('admin'), ctrl.getAll);

// User: daftar event
router.post('/:id/join', auth, role('user'), ctrl.join);
// User: list event yang diikuti
router.get('/mine', auth, role('user'), ctrl.getMine);

module.exports = router; 