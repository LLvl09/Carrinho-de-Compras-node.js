const express = require('express');
const sequelize = require('./db/database');
const Usuario = require('./models/Usuario');
const Carrinho = require('./models/Carrinho');
const Produto = require('./models/Produto');
const dotenv = require('dotenv').config();

const router = require('./routes/routes');
const app = express();

// Configuração do Body Parser
app.use(express.json());

// Sincronize os modelos com o banco de dados
sequelize.sync()
    .then(() => {
        console.log('Conexão com o banco de dados estabelecida com sucesso.');
    })
    .catch(err => {
        console.error('Erro ao conectar ao banco de dados:', err);
    });

// Rota principal
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Rotas API
app.use('/api', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor Express em execução na porta ${PORT}`);
});
