const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const Usuario = sequelize.define('Produto', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    preco: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        unique: true
    },
    estoque: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Usuario;
