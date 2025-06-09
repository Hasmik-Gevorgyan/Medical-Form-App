import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { OpenAI } from "openai";
import cors from "cors";

const OPENAI_KEY = defineSecret("OPENAPI_KEY");

const STRIPE_SECRET = defineSecret("STRIPE_SECRET");

// Setting up CORS to allow requests from a specific origin
const corsHandler = cors({
  origin: "http://localhost:5173",
});

// Exporting the askGpt function as a Firebase Cloud Function
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

import * as functions from "firebase-functions/v2";
import Stripe from "stripe";

// const stripe = new Stripe(functions.config().stripe.secret, {
//   apiVersion: "2022-11-15" as any,
// });

export const createPaymentIntent = functions.https.onRequest(
  {
    region: "us-central1",
    memory: "256MiB",
    secrets: [STRIPE_SECRET], // 🔑 declare dependency
  },
  (req, res) => {
    corsHandler(req, res, async () => {
      try {
        const stripe = new Stripe(STRIPE_SECRET.value(), {
          apiVersion: "2022-11-15" as any,
        });

        const amount = req.body.amount;
        if (!amount) {
          res.status(400).send("Amount must be provided");
          return;
        }

        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency: "usd",
        });

        res.json({ clientSecret: paymentIntent.client_secret });
      } catch (error: any) {
        console.error("Payment error:", error);
        res.status(500).send(error.message || "Failed to create payment intent");
      }
    });
  }
);