const { confirmar } = require('../controllers/pedidoController');
const Carrinho = require('../models/Carrinho');
const Produto = require('../models/Produto');
const Pedido = require('../models/Pedido');

// Mock de objetos necessários
jest.mock('../models/Carrinho', () => ({
  findAll: jest.fn(),
  destroy: jest.fn(),
}));

jest.mock('../models/Produto', () => ({})); // Mock vazio para Produto, pois não estamos acessando diretamente seus métodos nesta função
jest.mock('../models/Pedido', () => ({
    create: jest.fn(),
  }));
  

// Mock de req, res e next
const req = {
  user: { id: 'usuarioId' },
};

const res = {
  json: jest.fn(),
  status: jest.fn(() => res),
};

const next = jest.fn();

describe('Testes para exports.confirmar', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpar os mocks antes de cada teste
  });

  it('Deve confirmar o pedido de compra com sucesso', async () => {
    const carrinhoItens = [
      { quantidade: 2, Produto: { preco: 10 } }, // Mock de um item do carrinho
      { quantidade: 3, Produto: { preco: 20 } }, // Mock de outro item do carrinho
    ];

    Carrinho.findAll.mockResolvedValue(carrinhoItens);
    Pedido.create.mockResolvedValue({ id: 'pedidoId' });

    await confirmar(req, res, next);

    expect(Carrinho.findAll).toHaveBeenCalledWith({ where: { usuario_id: req.user.id }, include: [Produto] });
    expect(Pedido.create).toHaveBeenCalledWith({
      usuario_id: req.user.id,
      custo_total: 2 * 10 + 3 * 20, // Calcula o custo total corretamente
      quantidade_de_itens: 2 + 3, // Calcula a quantidade total de itens corretamente
    });
    expect(Carrinho.destroy).toHaveBeenCalledWith({ where: { usuario_id: req.user.id } });
    expect(res.json).toHaveBeenCalledWith({ success: true, pedido: { id: 'pedidoId' }, message: 'Pedido de compra confirmado com sucesso.' });
  });

  it('Deve retornar erro 500 se ocorrer um erro interno', async () => {
    const error = new Error('Erro interno');
    Carrinho.findAll.mockRejectedValue(error);

    await confirmar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, error, message: 'Erro interno do servidor.' });
  });
});
