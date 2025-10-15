const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Função: Validação da pergunta
async function validateHabitQuestion(question) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

  const prompt = `
You are a habit validation expert. Strictly analyze if this is a request to create or modify a habit.
Consider only these as valid habit requests:
- Creating new habits
- Modifying existing habits
- Habit tracking requests
- Habit improvement suggestions

If the input is unclear, too short, or not about habits, reject it.
Answer only "yes" or "no".

Question: ${question}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response.text();
  return response.trim().toLowerCase().includes('yes');
}

// Função: Gerar hábito em JSON
async function generateHabit(question) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

  const prompt = `
Você é um especialista em criação de hábitos. Sua tarefa é ler a solicitação do usuário e gerar um JSON com:

- "name": nome curto do hábito
- "description": descrição detalhada
- "color": número inteiro entre 1 e 5 (1=azul, 2=roxo, 3=vermelho, 4=laranja, 5=verde) — escolha a melhor cor que combine com o hábito
- "daysOfTheWeek": lista de números de 0 a 6 (0=domingo)
- "frequency": quantidade de vezes por dia

Responda SOMENTE com JSON válido, sem texto adicional, e traduzido para português brasileiro.

Pergunta: ${question}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response.text();

  try {
    // Algumas respostas podem ter blocos de código ou texto extra — tenta limpar
    const match = response.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('JSON não encontrado na resposta.');

    const json = JSON.parse(match[0]);
    return json;
  } catch (err) {
    console.error('Erro ao interpretar JSON:', err);
    throw new Error('Erro ao interpretar a resposta da IA.');
  }
}

module.exports = {
  validateHabitQuestion,
  generateHabit,
};
