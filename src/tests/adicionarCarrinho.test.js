const request = require('supertest');
const { adicionar } = require('../controllers/carrinhoController'); // Suponha que o arquivo seja carrinhoController.js
const Carrinho = require('../models/Carrinho'); // Suponha que você tenha um modelo chamado carrinhoModel.js

// Mock do objeto 'req' para testar o método adicionar
const mockReq = (user, body) => ({
    user,
    body,
});

// Mock do objeto 'res' para testar o método adicionar
const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

// Testes
describe('Testes do método adicionar', () => {
    it('Deve adicionar um novo item ao carrinho', async () => {
        // Mock do usuário e do corpo da requisição
        const user = { id: 1 };
        const body = { produtoId: 1, quantidade: 2 };

        // Mock dos métodos do Sequelize
        Carrinho.findOne = jest.fn().mockResolvedValue(null);
        Carrinho.create = jest.fn().mockResolvedValue({});

        const req = mockReq(user, body);
        const res = mockRes();

        // Chama o método adicionar
        await adicionar(req, res);

        // Verifica se a resposta foi enviada corretamente
        expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Item adicionado ao carrinho com sucesso.' });

        // Verifica se os métodos do Sequelize foram chamados corretamente
        expect(Carrinho.findOne).toHaveBeenCalledWith({ where: { usuario_id: user.id, produto_id: body.produtoId } });
        expect(Carrinho.create).toHaveBeenCalledWith({ usuario_id: user.id, produto_id: body.produtoId, quantidade: body.quantidade });
    });

    it('Deve retornar um erro interno do servidor se ocorrer um erro', async () => {
        // Mock do usuário e do corpo da requisição
        const user = { id: 1 };
        const body = { produtoId: 1, quantidade: 2 };
    
        // Mock dos métodos do Sequelize
        Carrinho.findOne = jest.fn().mockRejectedValue(new Error('Erro interno'));
    
        const req = mockReq(user, body);
        const res = mockRes();
    
        // Chama o método adicionar
        await adicionar(req, res);
    
        // Verifica se a resposta foi enviada corretamente
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: expect.any(Error), success: false, message: 'Erro interno do servidor.' });
    });
    
});
