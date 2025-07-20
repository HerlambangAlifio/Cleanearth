const mongoose = require('mongoose');
const tipsSchema = new mongoose.Schema({
  judul: String,
  isi: String,
  gambar: String, // opsional, jika ingin tips ada gambar
  tanggal: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Tips', tipsSchema); 