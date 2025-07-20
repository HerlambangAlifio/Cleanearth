const mongoose = require('mongoose');
const laporanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lokasi: String,
  maps: String,
  jenis: [String],
  deskripsi: String,
  gambar: [String],
  nama: String,
  kontak: String,
  status: { type: String, default: 'pending' }, // pending, valid, invalid
  tanggal: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Laporan', laporanSchema); 