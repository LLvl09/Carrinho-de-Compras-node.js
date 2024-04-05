const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');
const Produto = require('./Produto'); // Importe o modelo Produto


const Carrinho = sequelize.define('Carrinho', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    produto_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'Carrinho',
    timestamps: false
});
Carrinho.belongsTo(Produto, { foreignKey: 'produto_id' });

// Método para atualizar a quantidade de um item no carrinho
Carrinho.atualizarQuantidade = async function(usuarioId, produtoId, novaQuantidade) {
    const itemExistente = await this.findOne({ where: { usuario_id: usuarioId, produto_id: produtoId } });
  
    if (!itemExistente) {
      throw new Error('Item não encontrado no carrinho.');
    }
  
    if (novaQuantidade < 1) {
      throw new Error('A quantidade mínima de um item no carrinho deve ser 1.');
    }
  
    // Aqui você pode adicionar a lógica para verificar o estoque e ajustar a quantidade máxima, se necessário
  
    itemExistente.quantidade = novaQuantidade;
    await itemExistente.save();
  
    return itemExistente;
  };
  
module.exports = Carrinho;
