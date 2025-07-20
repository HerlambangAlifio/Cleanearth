const Sertifikat = require('../models/Sertifikat');
const User = require('../models/User');
const Event = require('../models/Event');

exports.getAll = async (req, res) => {
  const data = await Sertifikat.findAll({
    include: [
      { model: User, attributes: ['id', 'username', 'email'] },
      { model: Event, attributes: ['id', 'judul'] }
    ]
  });
  res.json(data);
};

exports.create = async (req, res) => {
  try {
    const userId = req.body.userId || req.user.id;
    const eventId = req.body.eventId || null;
    const gambar = req.file ? req.file.filename : '';
    if (!userId || !gambar) {
      return res.status(400).json({ message: 'User dan gambar sertifikat wajib diisi' });
    }
    const sertifikat = await Sertifikat.create({ userId, eventId, gambar });
    res.json({ message: 'Sertifikat berhasil diupload', sertifikat });
  } catch (err) {
    res.status(500).json({ message: 'Gagal upload sertifikat', error: err.message });
  }
};

// Tambahan: update sertifikat
exports.update = async (req, res) => {
  const { id } = req.params;
  const gambar = req.file ? req.file.filename : undefined;
  const updateData = {};
  if (gambar) updateData.gambar = gambar;
  if (req.body.userId) updateData.userId = req.body.userId;
  if (req.body.eventId) updateData.eventId = req.body.eventId;
  await Sertifikat.update(updateData, { where: { id } });
  const sertifikat = await Sertifikat.findByPk(id, {
    include: [
      { model: User, attributes: ['id', 'username', 'email'] },
      { model: Event, attributes: ['id', 'judul'] }
    ]
  });
  res.json({ message: 'Sertifikat berhasil diupdate', sertifikat });
};

// Tambahan: hapus sertifikat
exports.remove = async (req, res) => {
  const { id } = req.params;
  await Sertifikat.destroy({ where: { id } });
  res.json({ message: 'Sertifikat berhasil dihapus' });
}; 