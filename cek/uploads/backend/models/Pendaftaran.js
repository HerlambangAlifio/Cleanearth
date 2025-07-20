const mongoose = require('mongoose');
const pendaftaranSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  nama: String,
  email: String,
  tanggal: { type: Date, default: Date.now },
  // tambahkan field lain sesuai kebutuhan
});
module.exports = mongoose.model('Pendaftaran', pendaftaranSchema); 