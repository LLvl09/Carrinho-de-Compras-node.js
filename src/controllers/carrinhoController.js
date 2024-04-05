const express = require('express');
const Carrinho = require('../models/Carrinho');
const jwt = require('jsonwebtoken');

exports.adicionar = async (req, res, next) => {
    try {
        const usuarioId = req.user.id;
        const { produtoId, quantidade } = req.body;

        // Verifica se o produto já está no carrinho
        let itemExistente = await Carrinho.findOne({ where: { usuario_id: usuarioId, produto_id: produtoId } });

        if (itemExistente) {
            // Se o item já existir, atualiza a quantidade
            itemExistente.quantidade += quantidade;
            await itemExistente.save();
        } else {
            // Caso contrário, cria um novo registro no carrinho
            await Carrinho.create({ usuario_id: usuarioId, produto_id: produtoId, quantidade: quantidade });
        }

        res.json({ success: true, message: 'Item adicionado ao carrinho com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: error, success: false, message: 'Erro interno do servidor.' });
    }
}

exports.get = async (req, res, next) => {
    try {
        const usuarioId = req.user.id;

        // Recupera todos os itens do carrinho do usuário atual
        const itensCarrinho = await Carrinho.findAll({ where: { usuario_id: usuarioId } });

        res.json({ success: true, carrinho: itensCarrinho });
    } catch (error) {
        console.error('Erro ao visualizar o carrinho:', error);
        res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }

}
exports.atualizar = async (req, res, next) => {
    try {
        const usuarioId = req.user.id;
        const { produtoId, novaQuantidade } = req.body;

        // Verifica se o produto já está no carrinho
        let itemExistente = await Carrinho.findOne({ where: { usuario_id: usuarioId, produto_id: produtoId } });

        if (!itemExistente) {
            return res.status(404).json({ success: false, message: 'Produto não encontrado no carrinho.' });
        }

        // Atualiza a quantidade do item no carrinho
        itemExistente.quantidade = novaQuantidade;
        await itemExistente.save();

        res.json({ success: true, message: 'Quantidade ajustada com sucesso.' });
    } catch (error) {
        res.status(500).json({error:error, success: false, message: 'Erro interno do servidor.' });
    }
}


exports.limpar = async (req, res, next) => {
    try {
        const usuarioId = req.user.id;

        // Remove todos os itens do carrinho do usuário
        await Carrinho.destroy({ where: { usuario_id: usuarioId } });

        res.json({ success: true, message: 'Carrinho de compras limpo com sucesso.' });
    } catch (error) {
        res.status(500).json({ success: false, error: error, message: 'Erro interno do servidor.' });
    }
};