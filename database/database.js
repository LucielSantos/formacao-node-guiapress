const Sequelize = require('sequelize');

const connection = new Sequelize('heroku_1238e44da734034', 'b8e6cf29b4f864', '10d42779', {
  host: 'us-cdbr-east-02.cleardb.com',
  dialect: 'mysql',
  timezone: '-03:00'
});

module.exports = connection;