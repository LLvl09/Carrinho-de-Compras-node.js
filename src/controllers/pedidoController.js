const Carrinho = require('../models/Carrinho');
const Pedido = require('../models/Pedido');
const Produto = require('../models/Produto'); // Importe o modelo Produto

exports.confirmar = async (req, res, next) => {
  try {
      const usuarioId = req.user.id;
      // Calcula o custo total e a quantidade de itens do carrinho do usuário
      const carrinhoItens = await Carrinho.findAll({ 
          where: { usuario_id: usuarioId },
          include: [Produto] // Inclua o modelo Produto aqui
      });
      const quantidadeDeItens = carrinhoItens.reduce((total, item) => total + item.quantidade, 0);
      const custoTotal = carrinhoItens.reduce((total, item) => total + (item.quantidade * item.Produto.preco), 0); // Acesse a propriedade preco através de item.Produto
  
      // Cria um novo pedido de compra
      const pedido = await Pedido.create({
        usuario_id: usuarioId,
        custo_total: custoTotal, // Use o nome correto da coluna, que parece ser 'preco'
        quantidade_de_itens: quantidadeDeItens,
      });
      
  
      // Limpa o carrinho de compras do usuário
      await Carrinho.destroy({ where: { usuario_id: usuarioId } });
  
      res.json({ success: true, pedido, message: 'Pedido de compra confirmado com sucesso.' });
  } catch (error) {
      res.status(500).json({ success: false, error: error, message: 'Erro interno do servidor.' });
  }
}
