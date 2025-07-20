const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');
const Event = require('./Event');

const Sertifikat = sequelize.define('Sertifikat', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  gambar: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tanggal: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'sertifikat',
  timestamps: false
});

Sertifikat.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Sertifikat, { foreignKey: 'userId' });
Sertifikat.belongsTo(Event, { foreignKey: 'eventId' });

module.exports = Sertifikat; 