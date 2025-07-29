const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const Pendaftaran = sequelize.define('Pendaftaran', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nama: DataTypes.STRING,
  email: DataTypes.STRING,
  tanggal: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
  // tambahkan field lain sesuai kebutuhan
}, {
  tableName: 'pendaftaran',
  timestamps: false
});

Pendaftaran.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Pendaftaran, { foreignKey: 'userId' });

module.exports = Pendaftaran; 