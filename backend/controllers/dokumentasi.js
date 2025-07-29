const Dokumentasi = require('../models/Dokumentasi');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'dokumentasi-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
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
}).single('file');

exports.getAll = async (req, res) => {
  try {
    const data = await Dokumentasi.findAll({
      order: [['tanggal', 'DESC']]
    });
    res.json(data);
  } catch (error) {
    console.error('Error getting dokumentasi:', error);
    res.status(500).json({ message: 'Gagal mengambil data dokumentasi' });
  }
};

exports.create = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    
    try {
      const { judul, deskripsi } = req.body;
      
      if (!judul || !deskripsi) {
        return res.status(400).json({ message: 'Judul dan deskripsi harus diisi' });
      }
      
      const gambar = req.file ? req.file.filename : null;
      
      const dok = await Dokumentasi.create({ 
        judul, 
        deskripsi, 
        gambar: gambar 
      });
      
      res.json({ message: 'Dokumentasi berhasil ditambah', dok });
    } catch (error) {
      console.error('Error creating dokumentasi:', error);
      res.status(500).json({ message: 'Gagal menambah dokumentasi' });
    }
  });
};

exports.update = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    
    try {
      const { id } = req.params;
      const { judul, deskripsi } = req.body;
      
      const updateData = { judul, deskripsi };
      
      if (req.file) {
        updateData.gambar = req.file.filename;
      }
      
      await Dokumentasi.update(updateData, { where: { id } });
      const dok = await Dokumentasi.findByPk(id);
      
      res.json({ message: 'Dokumentasi berhasil diupdate', dok });
    } catch (error) {
      console.error('Error updating dokumentasi:', error);
      res.status(500).json({ message: 'Gagal mengupdate dokumentasi' });
    }
  });
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await Dokumentasi.destroy({ where: { id } });
    res.json({ message: 'Dokumentasi berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting dokumentasi:', error);
    res.status(500).json({ message: 'Gagal menghapus dokumentasi' });
  }
}; 