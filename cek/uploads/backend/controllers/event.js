const Event = require('../models/Event');

// Admin: Buat event
exports.create = async (req, res) => {
  const { nama, deskripsi, tanggal, lokasi } = req.body;
  const event = new Event({
    nama,
    deskripsi,
    tanggal,
    lokasi,
    dibuatOleh: req.user.id
  });
  await event.save();
  res.json({ message: 'Event berhasil dibuat', event });
};

// Admin: Update event
exports.update = async (req, res) => {
  const { id } = req.params;
  const { nama, deskripsi, tanggal, lokasi } = req.body;
  const event = await Event.findByIdAndUpdate(id, { nama, deskripsi, tanggal, lokasi }, { new: true });
  res.json({ message: 'Event berhasil diupdate', event });
};

// Admin: Hapus event
exports.remove = async (req, res) => {
  const { id } = req.params;
  await Event.findByIdAndDelete(id);
  res.json({ message: 'Event berhasil dihapus' });
};

// Admin: List semua event
exports.getAll = async (req, res) => {
  const data = await Event.find().populate('peserta', 'username email').populate('dibuatOleh', 'username email');
  res.json(data);
};

// Publik: List event (guest & user)
exports.getPublic = async (req, res) => {
  const data = await Event.find().select('-peserta -dibuatOleh');
  res.json(data);
};

// User: Daftar event
exports.join = async (req, res) => {
  const { id } = req.params;
  const event = await Event.findById(id);
  if (!event) return res.status(404).json({ message: 'Event tidak ditemukan' });
  if (event.peserta.includes(req.user.id)) return res.status(400).json({ message: 'Sudah terdaftar di event ini' });
  event.peserta.push(req.user.id);
  await event.save();
  res.json({ message: 'Berhasil mendaftar event', event });
};

// User: List event yang diikuti user
exports.getMine = async (req, res) => {
  const data = await Event.find({ peserta: req.user.id });
  res.json(data);
}; 