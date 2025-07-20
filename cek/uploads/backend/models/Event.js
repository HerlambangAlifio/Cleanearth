const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  deskripsi: String,
  tanggal: Date,
  lokasi: String,
  peserta: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dibuatOleh: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Event', eventSchema); 