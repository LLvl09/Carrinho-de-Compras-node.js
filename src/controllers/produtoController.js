const express = require('express');
const Produto = require('../models/Produto');

exports.registrar= async (req, res, next) => {
    try {
        const { nome, preco, estoque } = req.body;
        const novoProduto = await Produto.create({ nome, preco, estoque });
        res.status(201).json({ success: true, produto: novoProduto });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    }

exports.get = async (req, res, next) => {
    try {
        const produtos = await Produto.findAll();
        res.status(200).json(produtos);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({ message: 'Erro ao buscar produtos.' });
    }
}
exports.getById = async (req, res) => {
    const pedidoId = req.params.id;
  
    try {
      const pedido = await Pedido.findByPk(pedidoId);
  
      if (!pedido) {
        return res.status(404).json({ message: 'Pedido não encontrado.' });
      }
  
      res.status(200).json(pedido);
    } catch (error) {
      console.error('Erro ao buscar pedido por ID:', error);
      res.status(500).json({ message: 'Erro ao buscar pedido por ID.' });
    }
  };