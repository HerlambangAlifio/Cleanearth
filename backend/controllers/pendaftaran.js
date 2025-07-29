const Pendaftaran = require('../models/Pendaftaran');
const User = require('../models/User');

exports.daftar = async (req, res) => {
  const { nama, email } = req.body;
  await Pendaftaran.create({
    userId: req.user.id,
    nama,
    email
  });
  res.json({ message: 'Pendaftaran berhasil' });
};

exports.getMine = async (req, res) => {
  const data = await Pendaftaran.findAll({ where: { userId: req.user.id } });
  res.json(data);
};

exports.getAll = async (req, res) => {
  const data = await Pendaftaran.findAll({ include: [{ model: User, attributes: ['username', 'email'] }] });
  res.json(data);
}; 