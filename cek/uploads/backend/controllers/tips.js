const Tips = require('../models/Tips');

exports.getAll = async (req, res) => {
  const data = await Tips.find();
  res.json(data);
};

exports.create = async (req, res) => {
  const { judul, isi } = req.body;
  const gambar = req.file ? req.file.filename : '';
  const tip = new Tips({ judul, isi, gambar });
  await tip.save();
  res.json({ message: 'Tips berhasil ditambah', tip });
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { judul, isi } = req.body;
  const updateData = { judul, isi };
  if (req.file) updateData.gambar = req.file.filename;
  const tip = await Tips.findByIdAndUpdate(id, updateData, { new: true });
  res.json({ message: 'Tips berhasil diupdate', tip });
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  await Tips.findByIdAndDelete(id);
  res.json({ message: 'Tips berhasil dihapus' });
}; 