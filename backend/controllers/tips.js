const Tips = require('../models/Tips');

exports.getAll = async (req, res) => {
  const data = await Tips.findAll();
  res.json(data);
};

exports.create = async (req, res) => {
  const { judul, isi } = req.body;
  const gambar = req.file ? req.file.filename : '';
  const tip = await Tips.create({ judul, isi, gambar });
  res.json({ message: 'Tips berhasil ditambah', tip });
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { judul, isi } = req.body;
  const updateData = { judul, isi };
  if (req.file) updateData.gambar = req.file.filename;
  await Tips.update(updateData, { where: { id } });
  const tip = await Tips.findByPk(id);
  res.json({ message: 'Tips berhasil diupdate', tip });
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  await Tips.destroy({ where: { id } });
  res.json({ message: 'Tips berhasil dihapus' });
}; 