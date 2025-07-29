const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('cleanearth', 'root', '', {
  host: 'localhost',
  port: 3308,
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize; 