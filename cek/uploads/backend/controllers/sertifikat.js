const Sertifikat = require('../models/Sertifikat');

exports.getAll = async (req, res) => {
  const data = await Sertifikat.find();
  res.json(data);
};

exports.create = async (req, res) => {
  const userId = req.body.userId || req.user.id;
  const gambar = req.file ? req.file.filename : '';
  const sertifikat = new Sertifikat({ userId, gambar });
  await sertifikat.save();
  res.json({ message: 'Sertifikat berhasil diupload', sertifikat });
};

// Tambahan: update sertifikat
exports.update = async (req, res) => {
  const { id } = req.params;
  const gambar = req.file ? req.file.filename : undefined;
  const updateData = {};
  if (gambar) updateData.gambar = gambar;
  if (req.body.userId) updateData.userId = req.body.userId;
  const sertifikat = await Sertifikat.findByIdAndUpdate(id, updateData, { new: true });
  res.json({ message: 'Sertifikat berhasil diupdate', sertifikat });
};

// Tambahan: hapus sertifikat
exports.remove = async (req, res) => {
  const { id } = req.params;
  await Sertifikat.findByIdAndDelete(id);
  res.json({ message: 'Sertifikat berhasil dihapus' });
}; 