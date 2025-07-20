const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Dokumentasi = sequelize.define('Dokumentasi', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  judul: DataTypes.STRING,
  deskripsi: DataTypes.STRING,
  gambar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tanggal: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'dokumentasi',
  timestamps: false
});

module.exports = Dokumentasi; 