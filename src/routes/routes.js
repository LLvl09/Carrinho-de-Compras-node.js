const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const carrinhoController = require('../controllers/carrinhoController');
const pedidoController = require('../controllers/pedidoController');
const produtoController = require('../controllers/produtoController');
const {authenticateToken}= require('../services/checkToken');

router.post('/register', userController.registrar);
router.post('/login', userController.login);

router.post('/carrinho/adicionar',authenticateToken, carrinhoController.adicionar);
router.get('/carrinho',authenticateToken, carrinhoController.get);
router.put('/carrinho/atualizar', authenticateToken, carrinhoController.atualizar);
router.delete('/carrinho/limpar', authenticateToken, carrinhoController.limpar);

router.post('/pedido', authenticateToken, pedidoController.confirmar);

router.get('/produtos', produtoController.get);
router.get('/produto:id', produtoController.getById);
module.exports = router;
