const Pendaftaran = require('../models/Pendaftaran');

exports.daftar = async (req, res) => {
  const { nama, email } = req.body;
  const pendaftaran = new Pendaftaran({
    userId: req.user.id,
    nama,
    email
  });
  await pendaftaran.save();
  res.json({ message: 'Pendaftaran berhasil' });
};

exports.getMine = async (req, res) => {
  const data = await Pendaftaran.find({ userId: req.user.id });
  res.json(data);
};

exports.getAll = async (req, res) => {
  const data = await Pendaftaran.find().populate('userId', 'username email');
  res.json(data);
}; 