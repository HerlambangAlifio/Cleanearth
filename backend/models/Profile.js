const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nama_lengkap: DataTypes.STRING,
  alamat: DataTypes.STRING,
  no_hp: DataTypes.STRING,
  foto_profil: DataTypes.STRING,
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'profiles',
  timestamps: false
});

Profile.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Profile, { foreignKey: 'userId' });

module.exports = Profile; 