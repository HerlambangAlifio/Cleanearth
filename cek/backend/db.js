const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('cleanearth', 'root', 'endank122', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize; 