const Laporan = require('../models/Laporan');

exports.getAll = async (req, res) => {
  const data = await Laporan.find();
  res.json(data);
};

exports.getMine = async (req, res) => {
  const data = await Laporan.find({ userId: req.user.id });
  res.json(data);
};

exports.create = async (req, res) => {
  const { lokasi, maps, jenis, deskripsi, nama, kontak } = req.body;
  const gambar = req.files ? req.files.map(f => f.filename) : [];
  const laporan = new Laporan({
    userId: req.user.id,
    lokasi,
    maps,
    jenis: Array.isArray(jenis) ? jenis : [jenis],
    deskripsi,
    gambar,
    nama,
    kontak
  });
  await laporan.save();
  res.json({ message: 'Laporan berhasil dikirim', laporan });
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { lokasi, maps, jenis, deskripsi, nama, kontak } = req.body;
  const updateData = { lokasi, maps, jenis, deskripsi, nama, kontak };
  if (req.files && req.files.length > 0) updateData.gambar = req.files.map(f => f.filename);
  const laporan = await Laporan.findByIdAndUpdate(id, updateData, { new: true });
  res.json({ message: 'Laporan berhasil diupdate', laporan });
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  await Laporan.findByIdAndDelete(id);
  res.json({ message: 'Laporan berhasil dihapus' });
};

exports.validate = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // valid/invalid
  const laporan = await Laporan.findByIdAndUpdate(id, { status }, { new: true });
  res.json({ message: 'Status laporan diupdate', laporan });
}; 