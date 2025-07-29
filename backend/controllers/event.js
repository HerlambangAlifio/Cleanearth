const Event = require('../models/Event');
const User = require('../models/User');
const EventRegistration = require('../models/EventRegistration');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Konfigurasi multer untuk upload gambar
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diperbolehkan'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
}).single('gambar');

// Admin: Buat event
exports.create = async (req, res) => {
  upload(req, res, async function(err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { 
        judul, 
        deskripsi, 
        lokasi, 
        tanggal, 
        waktu_mulai, 
        waktu_selesai, 
        kapasitas, 
        status 
      } = req.body;

      // Validasi input
      if (!judul || !deskripsi || !lokasi || !tanggal || !waktu_mulai || !waktu_selesai || !kapasitas || !status) {
        return res.status(400).json({ message: 'Semua field harus diisi' });
      }

      const eventData = {
        judul,
        deskripsi,
        lokasi,
        tanggal: new Date(tanggal),
        waktu_mulai,
        waktu_selesai,
        kapasitas: parseInt(kapasitas),
        status,
        gambar: req.file ? req.file.filename : null,
        dibuatOlehId: req.user.id
      };

      const event = await Event.create(eventData);
      res.status(201).json({ message: 'Event berhasil dibuat', event });
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ message: 'Gagal membuat event' });
    }
  });
};

// Admin: Update event
exports.update = async (req, res) => {
  upload(req, res, async function(err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { id } = req.params;
      const { 
        judul, 
        deskripsi, 
        lokasi, 
        tanggal, 
        waktu_mulai, 
        waktu_selesai, 
        kapasitas, 
        status 
      } = req.body;

      // Validasi input
      if (!judul || !deskripsi || !lokasi || !tanggal || !waktu_mulai || !waktu_selesai || !kapasitas || !status) {
        return res.status(400).json({ message: 'Semua field harus diisi' });
      }

      const eventData = {
        judul,
        deskripsi,
        lokasi,
        tanggal: new Date(tanggal),
        waktu_mulai,
        waktu_selesai,
        kapasitas: parseInt(kapasitas),
        status
      };

      // Jika ada file gambar baru
      if (req.file) {
        eventData.gambar = req.file.filename;
        
        // Hapus gambar lama jika ada
        const oldEvent = await Event.findByPk(id);
        if (oldEvent && oldEvent.gambar) {
          const oldImagePath = path.join(__dirname, '../uploads', oldEvent.gambar);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      }

      await Event.update(eventData, { where: { id } });
      const event = await Event.findByPk(id);
      res.json({ message: 'Event berhasil diupdate', event });
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({ message: 'Gagal mengupdate event' });
    }
  });
};

// Admin: Hapus event
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Ambil data event untuk menghapus gambar
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: 'Event tidak ditemukan' });
    }
    
    // Hapus semua pendaftaran event terlebih dahulu
    await EventRegistration.destroy({ where: { eventId: id } });
    
    // Hapus gambar jika ada
    if (event.gambar) {
      const imagePath = path.join(__dirname, '../uploads', event.gambar);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Hapus event
    await Event.destroy({ where: { id } });
    res.json({ message: 'Event berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Gagal menghapus event: ' + error.message });
  }
};

// Admin: List semua event
exports.getAll = async (req, res) => {
  try {
    const data = await Event.findAll({
      include: [
        { model: User, as: 'dibuatOleh', attributes: ['username', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(data);
  } catch (error) {
    console.error('Error getting events:', error);
    res.status(500).json({ message: 'Gagal mengambil data event' });
  }
};

// Publik: List event (guest & user)
exports.getPublic = async (req, res) => {
  try {
    const data = await Event.findAll({ 
      attributes: { exclude: ['dibuatOlehId'] },
      order: [['tanggal', 'ASC']]
    });
    res.json(data);
  } catch (error) {
    console.error('Error getting public events:', error);
    res.status(500).json({ message: 'Gagal mengambil data event' });
  }
};

// Get single event by ID (public)
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id, {
      attributes: { exclude: ['dibuatOlehId'] }
    });
    
    if (!event) {
      return res.status(404).json({ message: 'Event tidak ditemukan' });
    }
    
    res.json(event);
  } catch (error) {
    console.error('Error getting event by ID:', error);
    res.status(500).json({ message: 'Gagal mengambil data event' });
  }
};

// User: Daftar event
exports.join = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nama, 
      email, 
      telepon, 
      usia, 
      alamat, 
      alasan, 
      pengalaman 
    } = req.body;
    const userId = req.user.id;

    // Cek apakah event ada
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: 'Event tidak ditemukan' });
    }

    // Cek apakah user sudah mendaftar
    const existingRegistration = await EventRegistration.findOne({
      where: { eventId: id, userId: userId }
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'Anda sudah mendaftar ke event ini' });
    }

    // Cek kapasitas event
    const registeredCount = await EventRegistration.count({
      where: { eventId: id, status: ['pending', 'approved'] }
    });

    if (registeredCount >= event.kapasitas) {
      return res.status(400).json({ message: 'Event sudah penuh' });
    }

    // Validasi data yang diperlukan
    if (!nama || !email || !telepon || !usia || !alamat || !alasan) {
      return res.status(400).json({ 
        message: 'Semua field wajib diisi (kecuali pengalaman)' 
      });
    }

    // Buat pendaftaran baru
    const registration = await EventRegistration.create({
      eventId: id,
      userId: userId,
      nama: nama.trim(),
      email: email.trim(),
      telepon: telepon.trim(),
      usia: parseInt(usia),
      alamat: alamat.trim(),
      alasan: alasan.trim(),
      pengalaman: pengalaman ? pengalaman.trim() : null,
      status: 'pending',
      tanggal_daftar: new Date()
    });

    res.status(201).json({ 
      message: 'Pendaftaran berhasil', 
      registration 
    });
  } catch (error) {
    console.error('Error joining event:', error);
    res.status(500).json({ message: 'Gagal mendaftar ke event' });
  }
};

// User: List event yang diikuti user
exports.getMine = async (req, res) => {
  try {
    const userId = req.user.id;

    const registrations = await EventRegistration.findAll({
      where: { userId: userId },
      include: [
        {
          model: Event,
          attributes: ['id', 'judul', 'deskripsi', 'lokasi', 'tanggal', 'waktu_mulai', 'waktu_selesai', 'kapasitas', 'status', 'gambar']
        }
      ],
      order: [['tanggal_daftar', 'DESC']]
    });

    res.json(registrations);
  } catch (error) {
    console.error('Error getting user events:', error);
    res.status(500).json({ message: 'Gagal mengambil data event yang diikuti' });
  }
};

// Admin: List semua pendaftaran event
exports.getAllRegistrations = async (req, res) => {
  try {
    const registrations = await EventRegistration.findAll({
      include: [
        {
          model: Event,
          attributes: ['id', 'judul', 'lokasi', 'tanggal', 'waktu_mulai', 'waktu_selesai', 'status', 'gambar']
        },
        {
          model: User,
          attributes: ['id', 'username', 'email']
        }
      ],
      order: [['tanggal_daftar', 'DESC']]
    });

    res.json(registrations);
  } catch (error) {
    console.error('Error getting all registrations:', error);
    res.status(500).json({ message: 'Gagal mengambil data pendaftaran' });
  }
};

// Admin: Get single registration by ID
exports.getRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;
    const registration = await EventRegistration.findByPk(id, {
      include: [
        {
          model: Event,
          attributes: ['id', 'judul', 'deskripsi', 'lokasi', 'tanggal', 'waktu_mulai', 'waktu_selesai', 'kapasitas', 'status', 'gambar']
        },
        {
          model: User,
          attributes: ['id', 'username', 'email']
        }
      ]
    });
    
    if (!registration) {
      return res.status(404).json({ message: 'Pendaftaran tidak ditemukan' });
    }
    
    res.json(registration);
  } catch (error) {
    console.error('Error getting registration by ID:', error);
    res.status(500).json({ message: 'Gagal mengambil data pendaftaran' });
  }
};

// Admin: Update status pendaftaran
exports.updateRegistrationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, catatan } = req.body;

    const registration = await EventRegistration.findByPk(id);
    if (!registration) {
      return res.status(404).json({ message: 'Pendaftaran tidak ditemukan' });
    }

    // Validasi status
    const validStatuses = ['pending', 'approved', 'rejected', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Status tidak valid' });
    }

    await registration.update({
      status: status,
      catatan: catatan || registration.catatan
    });

    res.json({ 
      message: 'Status pendaftaran berhasil diupdate', 
      registration 
    });
  } catch (error) {
    console.error('Error updating registration status:', error);
    res.status(500).json({ message: 'Gagal mengupdate status pendaftaran' });
  }
}; 