const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { daftar, getMine, getAll } = require('../controllers/pendaftaran');

router.post('/', auth, daftar);
router.get('/me', auth, getMine);
router.get('/', auth, role('admin'), getAll);

module.exports = router; 