const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Usuario = require('../models/Usuario');
const dotenv= require('dotenv').config();

exports.registrar= async (req, res, next) => {
    const { nome, email, senha } = req.body;

    try {
      // Hash da senha antes de armazenar no banco de dados
      const hashedSenha = await bcrypt.hash(senha, 10);
  
      // Crie um novo usuário com os dados fornecidos
      const novoUsuario = await Usuario.create({
        nome: nome,
        email: email,
        senha: hashedSenha
      });
  
      res.status(201).json({ message: 'Usuário criado com sucesso'});
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar usuário', error: error.message });
    }
}
exports.login = async (req, res) => {
  const { email, senha } = req.body;
  try {
      const user = await Usuario.findOne({ where: { email } });

      if (!user) {
          return res.status(401).json({ message: 'Usuário não encontrado' });
      }

      const match = await bcrypt.compare(senha, user.senha);
      if (!match) {
          return res.status(401).json({ message: 'Senha incorreta' });
      }

      // Criando um objeto com as informações do usuário que você deseja incluir no payload do token
      const tokenPayload = {
          id: user.id,
          email: user.email // Você pode adicionar mais informações aqui, se desejar
      };

      const token = jwt.sign(tokenPayload, process.env.SECRET_TOKEN, { expiresIn: '1h' });
      res.status(200).json({ token });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao fazer login' });
  }
};
