const Laporan = require('../models/Laporan');

exports.getAll = async (req, res) => {
  const data = await Laporan.findAll();
  res.json(data);
};

exports.getMine = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Unauthorized: Token tidak valid atau tidak dikirim' });
  }
  const data = await Laporan.findAll({ where: { userId: req.user.id } });
  res.json(data);
};

exports.create = async (req, res) => {
  const { lokasi, maps, jenis, deskripsi, nama, kontak } = req.body;
  const gambar = req.files ? req.files.map(f => f.filename) : [];
  const laporan = await Laporan.create({
    userId: req.user.id,
    lokasi,
    maps,
    jenis: Array.isArray(jenis) ? jenis : [jenis],
    deskripsi,
    gambar,
    nama,
    kontak
  });
  res.json({ message: 'Laporan berhasil dikirim', laporan });
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { lokasi, maps, jenis, deskripsi, nama, kontak } = req.body;
  const updateData = { lokasi, maps, jenis, deskripsi, nama, kontak };
  if (req.files && req.files.length > 0) updateData.gambar = req.files.map(f => f.filename);
  await Laporan.update(updateData, { where: { id } });
  const laporan = await Laporan.findByPk(id);
  res.json({ message: 'Laporan berhasil diupdate', laporan });
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  await Laporan.destroy({ where: { id } });
  res.json({ message: 'Laporan berhasil dihapus' });
};

exports.validate = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // valid/invalid
  await Laporan.update({ status }, { where: { id } });
  const laporan = await Laporan.findByPk(id);
  res.json({ message: 'Status laporan diupdate', laporan });
}; 