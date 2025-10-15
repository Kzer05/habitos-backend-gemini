require('dotenv').config();
const express = require('express');
const cors = require('cors');
const habitRoutes = require('./habitController');

const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.json({
    verify: (req, _, buf) => {
        req.rawBody = buf && buf.toString ? buf.toString() : '';
    }
}));

// Log global para ver requisições
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Rotas
app.use('/', habitRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
