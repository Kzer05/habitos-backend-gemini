const express = require('express');
const router = express.Router();
const { validateHabitQuestion, generateHabit } = require('./helper');

const TOKEN_FIXO = process.env.TOKEN_FIXO;

// Middleware de autenticação
function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${TOKEN_FIXO}`) {
    return res.status(401).json({ error: 'Token inválido ou ausente' });
  }
  next();
}

// POST /habito
router.post('/habito', verificarToken, async (req, res) => {
console.log(req.body)
  const question = req.body.question?.trim();

  if (!question) {
    return res.status(400).json({ error: 'A pergunta está vazia.' });
  }

  try {
    const isValid = await validateHabitQuestion(question);
    if (!isValid) {
      return res.status(400).json({ error: 'Isso não é uma pergunta válida sobre hábito.' });
    }

    const habitData = await generateHabit(question);

    if (!habitData || !habitData.name) {
      return res.status(500).json({ error: 'Hábito inválido gerado.' });
    }

    return res.json(habitData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

module.exports = router;
