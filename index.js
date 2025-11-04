require('dotenv').config();
const express = require('express');
const cors = require('cors');
const habitRoutes = require('./habitController');

const app = express();

app.use(cors());
app.use(express.json({
    verify: (req, _, buf) => {
        req.rawBody = buf && buf.toString ? buf.toString() : '';
    }
}));

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use('/', habitRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
