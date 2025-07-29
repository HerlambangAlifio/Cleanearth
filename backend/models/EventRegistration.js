const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Event = require('./Event');
const User = require('./User');

const EventRegistration = sequelize.define('EventRegistration', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  telepon: {
    type: DataTypes.STRING,
    allowNull: true
  },
  usia: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  alamat: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  alasan: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  pengalaman: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'cancelled'),
    defaultValue: 'pending'
  },
  tanggal_daftar: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  catatan: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'event_registration',
  timestamps: false
});

// Relasi dengan Event
EventRegistration.belongsTo(Event, { foreignKey: 'eventId' });
Event.hasMany(EventRegistration, { foreignKey: 'eventId' });

// Relasi dengan User
EventRegistration.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(EventRegistration, { foreignKey: 'userId' });

module.exports = EventRegistration; 