const mongoose = require('mongoose');
const dokumentasiSchema = new mongoose.Schema({
  judul: String,
  deskripsi: String,
  gambar: String, // path atau url gambar
  tanggal: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Dokumentasi', dokumentasiSchema); 