const Sequelize = require('sequelize');
const dotenv= require('dotenv').config();

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.MYSQL_HOSTNAME,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE_NAME
});

module.exports = sequelize;
