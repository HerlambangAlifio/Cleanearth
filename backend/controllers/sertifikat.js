const Sertifikat = require('../models/Sertifikat');
const User = require('../models/User');
const Event = require('../models/Event');
const fs = require('fs');
const path = require('path');

exports.getAll = async (req, res) => {
  try {
    const data = await Sertifikat.findAll({
      include: [
        { model: User, attributes: ['id', 'username', 'email'] },
        { model: Event, attributes: ['id', 'judul'] }
      ],
      order: [['tanggal', 'DESC']]
    });
    res.json(data);
  } catch (error) {
    console.error('Error getting sertifikat:', error);
    res.status(500).json({ message: 'Gagal mengambil data sertifikat', error: error.message });
  }
};

// Get sertifikat for current user
exports.getUserSertifikat = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const data = await Sertifikat.findAll({
      where: { userId },
      include: [
        { model: User, attributes: ['id', 'username', 'email'] },
        { model: Event, attributes: ['id', 'judul', 'tanggal', 'waktu_mulai', 'waktu_selesai', 'lokasi', 'status'] }
      ],
      order: [['tanggal', 'DESC']]
    });
    
    res.json(data);
  } catch (error) {
    console.error('Error getting user sertifikat:', error);
    res.status(500).json({ message: 'Gagal mengambil data sertifikat user', error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const sertifikat = await Sertifikat.findByPk(id, {
      include: [
        { model: User, attributes: ['id', 'username', 'email'] },
        { model: Event, attributes: ['id', 'judul'] }
      ]
    });

    if (!sertifikat) {
      return res.status(404).json({ message: 'Sertifikat tidak ditemukan' });
    }

    res.json(sertifikat);
  } catch (error) {
    console.error('Error getting sertifikat by id:', error);
    res.status(500).json({ message: 'Gagal mengambil data sertifikat', error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const userId = req.body.userId;
    const eventId = req.body.eventId || null;
    const gambar = req.file ? req.file.filename : '';
    
    // Validation
    if (!userId) {
      return res.status(400).json({ message: 'User wajib diisi' });
    }
    
    if (!gambar) {
      return res.status(400).json({ message: 'File sertifikat wajib diupload' });
    }
    
    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(400).json({ message: 'User tidak ditemukan' });
    }
    
    // Check if event exists (if provided)
    if (eventId) {
      const event = await Event.findByPk(eventId);
      if (!event) {
        return res.status(400).json({ message: 'Event tidak ditemukan' });
      }
    }
    
    // Check if sertifikat already exists for this user and event
    const existingSertifikat = await Sertifikat.findOne({
      where: { userId, eventId }
    });
    
    if (existingSertifikat) {
      // Delete the uploaded file if sertifikat already exists
      if (req.file) {
        const filePath = path.join(__dirname, '../uploads', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return res.status(400).json({ message: 'Sertifikat untuk user dan event ini sudah ada' });
    }
    
    const sertifikat = await Sertifikat.create({ 
      userId, 
      eventId, 
      gambar,
      tanggal: new Date()
    });
    
    // Get the created sertifikat with user and event data
    const createdSertifikat = await Sertifikat.findByPk(sertifikat.id, {
      include: [
        { model: User, attributes: ['id', 'username', 'email'] },
        { model: Event, attributes: ['id', 'judul'] }
      ]
    });
    
    res.status(201).json({ 
      message: 'Sertifikat berhasil diupload', 
      sertifikat: createdSertifikat 
    });
  } catch (error) {
    console.error('Error creating sertifikat:', error);
    
    // Delete uploaded file if error occurs
    if (req.file) {
      const filePath = path.join(__dirname, '../uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res.status(500).json({ message: 'Gagal upload sertifikat', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, eventId } = req.body;
    const gambar = req.file ? req.file.filename : undefined;
    
    // Check if sertifikat exists
    const existingSertifikat = await Sertifikat.findByPk(id);
    if (!existingSertifikat) {
      // Delete uploaded file if sertifikat doesn't exist
      if (req.file) {
        const filePath = path.join(__dirname, '../uploads', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return res.status(404).json({ message: 'Sertifikat tidak ditemukan' });
    }
    
    // Validation
    if (userId) {
      const user = await User.findByPk(userId);
      if (!user) {
        // Delete uploaded file if user doesn't exist
        if (req.file) {
          const filePath = path.join(__dirname, '../uploads', req.file.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
        return res.status(400).json({ message: 'User tidak ditemukan' });
      }
    }
    
    if (eventId) {
      const event = await Event.findByPk(eventId);
      if (!event) {
        // Delete uploaded file if event doesn't exist
        if (req.file) {
          const filePath = path.join(__dirname, '../uploads', req.file.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
        return res.status(400).json({ message: 'Event tidak ditemukan' });
      }
    }
    
    // Check if sertifikat already exists for this user and event (excluding current sertifikat)
    if (userId || eventId) {
      const checkUserId = userId || existingSertifikat.userId;
      const checkEventId = eventId || existingSertifikat.eventId;
      
      const duplicateSertifikat = await Sertifikat.findOne({
        where: { 
          userId: checkUserId, 
          eventId: checkEventId,
          id: { [require('sequelize').Op.ne]: id }
        }
      });
      
      if (duplicateSertifikat) {
        // Delete uploaded file if duplicate exists
        if (req.file) {
          const filePath = path.join(__dirname, '../uploads', req.file.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
        return res.status(400).json({ message: 'Sertifikat untuk user dan event ini sudah ada' });
      }
    }
    
    // Prepare update data
    const updateData = {};
    if (userId) updateData.userId = userId;
    if (eventId !== undefined) updateData.eventId = eventId;
    if (gambar) {
      // Delete old file if new file is uploaded
      if (existingSertifikat.gambar) {
        const oldFilePath = path.join(__dirname, '../uploads', existingSertifikat.gambar);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      updateData.gambar = gambar;
    }
    
    await Sertifikat.update(updateData, { where: { id } });
    
    // Get updated sertifikat
    const updatedSertifikat = await Sertifikat.findByPk(id, {
      include: [
        { model: User, attributes: ['id', 'username', 'email'] },
        { model: Event, attributes: ['id', 'judul'] }
      ]
    });
    
    res.json({ 
      message: 'Sertifikat berhasil diupdate', 
      sertifikat: updatedSertifikat 
    });
  } catch (error) {
    console.error('Error updating sertifikat:', error);
    
    // Delete uploaded file if error occurs
    if (req.file) {
      const filePath = path.join(__dirname, '../uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res.status(500).json({ message: 'Gagal update sertifikat', error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if sertifikat exists
    const sertifikat = await Sertifikat.findByPk(id);
    if (!sertifikat) {
      return res.status(404).json({ message: 'Sertifikat tidak ditemukan' });
    }
    
    // Delete file from uploads folder
    if (sertifikat.gambar) {
      const filePath = path.join(__dirname, '../uploads', sertifikat.gambar);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await Sertifikat.destroy({ where: { id } });
    res.json({ message: 'Sertifikat berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting sertifikat:', error);
    res.status(500).json({ message: 'Gagal menghapus sertifikat', error: error.message });
  }
}; 