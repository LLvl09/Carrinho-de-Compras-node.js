const { atualizar } = require('../controllers/carrinhoController');
const Carrinho = require('../models/Carrinho');

// Mock de objetos necessários
jest.mock('../models/Carrinho', () => ({
  findOne: jest.fn(),
}));

// Mock de req, res e next
const req = {
  user: { id: 'usuarioId' },
  body: { produtoId: 'produtoId', novaQuantidade: 5 },
};

const res = {
  json: jest.fn(),
  status: jest.fn(() => res),
};

const next = jest.fn();

describe('Testes para exports.atualizar', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpar os mocks antes de cada teste
  });

  it('Deve retornar erro 404 se o produto não estiver no carrinho', async () => {
    Carrinho.findOne.mockResolvedValue(null);

    await atualizar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Produto não encontrado no carrinho.' });
  });

  it('Deve atualizar a quantidade do item no carrinho', async () => {
    const itemExistenteMock = { quantidade: 2, save: jest.fn() };
    Carrinho.findOne.mockResolvedValue(itemExistenteMock);

    await atualizar(req, res, next);

    expect(itemExistenteMock.quantidade).toBe(req.body.novaQuantidade);
    expect(itemExistenteMock.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Quantidade ajustada com sucesso.' });
  });

  it('Deve retornar erro 500 se ocorrer um erro interno', async () => {
    const error = new Error('Erro interno');
    Carrinho.findOne.mockRejectedValue(error);
  
    await atualizar(req, res, next);
  
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, error, message: 'Erro interno do servidor.' });
  });  
});
