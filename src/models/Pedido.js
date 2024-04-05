// models/Pedido.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const Pedido = sequelize.define('Pedido', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  custo_total: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  quantidade_de_itens: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  // Outras informações relevantes aqui
});

module.exports = Pedido;
