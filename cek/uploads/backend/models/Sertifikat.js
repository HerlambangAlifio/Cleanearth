const mongoose = require('mongoose');
const sertifikatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  gambar: String, // path atau url gambar
  tanggal: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Sertifikat', sertifikatSchema); 