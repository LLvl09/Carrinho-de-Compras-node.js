const { limpar } = require('../controllers/carrinhoController');
const Carrinho = require('../models/Carrinho');

// Mock de objetos necessários
jest.mock('../models/Carrinho', () => ({
  destroy: jest.fn(),
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

describe('Testes para exports.limpar', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpar os mocks antes de cada teste
  });

  it('Deve limpar o carrinho de compras com sucesso', async () => {
    await limpar(req, res, next);

    expect(Carrinho.destroy).toHaveBeenCalledWith({ where: { usuario_id: req.user.id } });
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Carrinho de compras limpo com sucesso.' });
  });

  it('Deve retornar erro 500 se ocorrer um erro interno', async () => {
    const error = new Error('Erro interno');
    Carrinho.destroy.mockRejectedValue(error);

    await limpar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, error, message: 'Erro interno do servidor.' });
  });
});
