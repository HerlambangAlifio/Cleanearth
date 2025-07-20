const User = require('../models/User');
const Profile = require('../models/Profile');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diperbolehkan (JPG, PNG, GIF)'));
    }
  }
}).single('foto_profil');

exports.getAll = async (req, res) => {
  const data = await User.findAll({ attributes: { exclude: ['password'] } });
  res.json(data);
};

exports.getMe = async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password'] },
    include: [{ model: Profile }]
  });
  res.json(user);
};

exports.update = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    
    try {
      const id = req.user.id;
      const { username, email, nama_lengkap, alamat, no_hp } = req.body;
      
      // Update user data
      const updateData = { username, email };
      await User.update(updateData, { where: { id } });
      
      // Prepare profile data
      const profileData = { nama_lengkap, alamat, no_hp };
      
      // If file was uploaded, add filename to profile data
      if (req.file) {
        profileData.foto_profil = req.file.filename;
      }
      
      // Update or create profile
      let profile = await Profile.findOne({ where: { userId: id } });
      if (profile) {
        await Profile.update(profileData, { where: { userId: id } });
      } else {
        await Profile.create({ userId: id, ...profileData });
      }
      
      // Get updated user data
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
        include: [{ model: Profile }]
      });
      
      res.json({ message: 'Profil berhasil diperbarui', user });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Gagal memperbarui profil' });
    }
  });
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  await User.destroy({ where: { id } });
  res.json({ message: 'User berhasil dihapus' });
};

exports.changeRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  await User.update({ role }, { where: { id } });
  const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
  res.json({ message: 'Role user berhasil diubah', user });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hash, role: role || 'user' });
    await Profile.create({ userId: user.id });
    res.json({ message: 'Register sukses' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}; 