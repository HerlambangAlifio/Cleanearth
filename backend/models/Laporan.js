const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const Laporan = sequelize.define('Laporan', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  lokasi: DataTypes.STRING,
  maps: DataTypes.STRING,
  jenis: {
    type: DataTypes.TEXT, // Simpan array sebagai JSON string
    get() {
      const raw = this.getDataValue('jenis');
      return raw ? JSON.parse(raw) : [];
    },
    set(val) {
      this.setDataValue('jenis', JSON.stringify(val));
    }
  },
  deskripsi: DataTypes.STRING,
  gambar: {
    type: DataTypes.TEXT, // Simpan array sebagai JSON string
    get() {
      const raw = this.getDataValue('gambar');
      return raw ? JSON.parse(raw) : [];
    },
    set(val) {
      this.setDataValue('gambar', JSON.stringify(val));
    }
  },
  nama: DataTypes.STRING,
  kontak: DataTypes.STRING,
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending'
  },
  tanggal: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'laporan',
  timestamps: false
});

Laporan.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Laporan, { foreignKey: 'userId' });

module.exports = Laporan; 