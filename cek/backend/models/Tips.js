const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Tips = sequelize.define('Tips', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  judul: DataTypes.STRING,
  isi: DataTypes.STRING,
  gambar: DataTypes.STRING,
  tanggal: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'tips',
  timestamps: false
});

module.exports = Tips; 