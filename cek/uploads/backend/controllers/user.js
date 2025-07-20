const User = require('../models/User');

exports.getAll = async (req, res) => {
  const data = await User.find().select('-password');
  res.json(data);
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;
  const updateData = { username, email };
  const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
  res.json({ message: 'User berhasil diupdate', user });
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.json({ message: 'User berhasil dihapus' });
};

exports.changeRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
  res.json({ message: 'Role user berhasil diubah', user });
}; 