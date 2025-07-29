const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const ctrl = require('../controllers/event');

// Publik: list event
router.get('/public', ctrl.getPublic);

// Admin: kelola pendaftaran event (harus sebelum /:id)
router.get('/registrations', auth, role('admin'), ctrl.getAllRegistrations);
router.get('/registrations/:id', auth, role('admin'), ctrl.getRegistrationById);
router.patch('/registrations/:id/status', auth, role('admin'), ctrl.updateRegistrationStatus);

// User: list event yang diikuti (harus sebelum /:id)
router.get('/mine', auth, role('user'), ctrl.getMine);

// Get single event by ID (public)
router.get('/:id', ctrl.getById);

// Admin: CRUD event
router.post('/', auth, role('admin'), ctrl.create);
router.patch('/:id', auth, role('admin'), ctrl.update);
router.delete('/:id', auth, role('admin'), ctrl.remove);
router.get('/', auth, role('admin'), ctrl.getAll);

// User: daftar event
router.post('/:id/join', auth, role('user'), ctrl.join);

module.exports = router; 