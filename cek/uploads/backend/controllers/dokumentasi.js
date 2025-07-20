const Dokumentasi = require('../models/Dokumentasi');

exports.getAll = async (req, res) => {
  const data = await Dokumentasi.find();
  res.json(data);
};

exports.create = async (req, res) => {
  const { judul, deskripsi } = req.body;
  const gambar = req.file ? req.file.filename : '';
  const dok = new Dokumentasi({ judul, deskripsi, gambar });
  await dok.save();
  res.json({ message: 'Dokumentasi berhasil ditambah', dok });
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { judul, deskripsi } = req.body;
  const updateData = { judul, deskripsi };
  if (req.file) updateData.gambar = req.file.filename;
  const dok = await Dokumentasi.findByIdAndUpdate(id, updateData, { new: true });
  res.json({ message: 'Dokumentasi berhasil diupdate', dok });
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  await Dokumentasi.findByIdAndDelete(id);
  res.json({ message: 'Dokumentasi berhasil dihapus' });
}; 