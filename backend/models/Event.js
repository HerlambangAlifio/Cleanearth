const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  judul: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  lokasi: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tanggal: {
    type: DataTypes.DATE,
    allowNull: false
  },
  waktu_mulai: {
    type: DataTypes.STRING,
    allowNull: false
  },
  waktu_selesai: {
    type: DataTypes.STRING,
    allowNull: false
  },
  kapasitas: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('upcoming', 'ongoing', 'completed', 'cancelled'),
    defaultValue: 'upcoming'
  },
  gambar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dibuatOlehId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'event',
  timestamps: false
});

Event.belongsTo(User, { as: 'dibuatOleh', foreignKey: 'dibuatOlehId' });
User.hasMany(Event, { as: 'eventDibuat', foreignKey: 'dibuatOlehId' });

// Untuk peserta, perlu tabel relasi many-to-many (EventUser) jika ingin diimplementasikan

module.exports = Event; 