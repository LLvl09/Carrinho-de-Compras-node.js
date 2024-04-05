const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token de acesso ausente.' });
    }

    jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Falha na autenticação do token.' });
        }
        else {
            req.user = decoded;
            next();
        }
    });
}

module.exports = {
    authenticateToken
};
