import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { OpenAI } from "openai";

const OPENAI_KEY = defineSecret("OPENAPI_KEY");

export const askGpt = onRequest(
  { secrets: [OPENAI_KEY] },
  async (req, res) => {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://your-production-domain.com" // Добавь свой продакшен-домен
    ];

    const origin = req.headers.origin || "";
    if (allowedOrigins.includes(origin)) {
      res.set("Access-Control-Allow-Origin", origin);
    }
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    // Обработка preflight запроса
    if (req.method === "OPTIONS") {
      res.status(204).send(""); // Нет контента — ок для CORS
      return;
    }

    // Только POST-запросы
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    // Проверка prompt
    const prompt = req.body.prompt;
    if (!prompt) {
      res.status(400).json({ error: "Prompt is required." });
      return;
    }

    // Инициализация OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAPI_KEY,
    });

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      });

      const reply = completion.choices[0]?.message?.content || "";
      res.status(200).json({ reply });
    } catch (error) {
      console.error("OpenAI error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);