require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/coach", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        error: "A correção por IA ainda não foi configurada. Configure OPENAI_API_KEY no arquivo .env."
      });
    }
    const { task, text, topic } = req.body || {};
    if (!text || typeof text !== "string" || text.length > 5000) {
      return res.status(400).json({ error: "Envie um texto válido de até 5.000 caracteres." });
    }

    const instructions = `Você é um professor de inglês paciente para um estudante brasileiro de nível intermediário.
Responda em português, mantendo os exemplos em inglês. Seja encorajador e objetivo.
Para escrita: corrija gramática, ortografia, vocabulário e naturalidade; mostre a versão corrigida, explique os principais erros e dê uma dica.
Para conversação: responda naturalmente ao que o aluno disse, corrija os erros mais importantes sem interromper a conversa e termine com uma pergunta simples em inglês.
Para pronúncia: avalie apenas o texto transcrito; não afirme que ouviu ou mediu sons. Mostre palavras que merecem atenção e uma pronúncia aproximada para brasileiros.
Para vocabulário: explique usos e dê exemplos.
Use títulos curtos e não invente uma avaliação acústica.`;

    const prompt = `Atividade: ${task || "writing"}.
Tema: ${topic || "cotidiano"}.
Texto do aluno: ${text}`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        instructions,
        input: prompt
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Não foi possível obter a correção da IA."
      });
    }

    const answer = (data.output || [])
      .flatMap(item => item.content || [])
      .filter(item => item.type === "output_text")
      .map(item => item.text)
      .join("\n");

    res.json({ answer: answer || "Não foi possível gerar uma resposta. Tente novamente." });
  } catch (err) {
    res.status(500).json({ error: "Erro no servidor. Verifique a conexão e tente novamente." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`English Trainer disponível em http://localhost:${port}`));