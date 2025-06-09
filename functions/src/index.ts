import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { OpenAI } from "openai";
import {getFirestore} from "firebase-admin/firestore";
import {getStorage} from "firebase-admin/storage";
import cors from "cors";
import pdf from "pdf-parse";

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
import {initializeApp} from "firebase-admin/app";

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

initializeApp();
export const verifyCertificate = onRequest({ secrets: [OPENAI_KEY] }, async (req, res) => {
    corsHandler(req, res, async () => {
        if (req.method !== "POST") {
            res.status(405).send("Method Not Allowed");
            return;
        }

        const { doctorId, fileName } = req.body;

        if (!doctorId || !fileName) {
            res.status(400).json({ error: "doctorId and fileName are required" });
            return;
        }

        try {
            const db = getFirestore();
            const doctorDoc = await db.collection("doctors").doc(doctorId).get();
            if (!doctorDoc.exists) {
                res.status(404).json({ error: "Doctor not found" });
                return;
            }

            const doctorData = doctorDoc.data();
            const fullName = `${doctorData?.name || ""} ${doctorData?.surname || ""}`.trim();

            const filePath = `certificates/${doctorId}/${fileName}`;
            const bucket = getStorage().bucket();
            const file = bucket.file(filePath);

            const [exists] = await file.exists();
            if (!exists) {
                res.status(404).json({ error: "Certificate file not found" });
                return;
            }

            const [buffer] = await file.download();
            const pdfFiles = await pdf(buffer);
            const extractedText = pdfFiles.text;

            const openai = new OpenAI({ apiKey: OPENAI_KEY.value() });

            const prompt = `
                You are a strict medical document verification agent.
                This certificate is claimed by the doctor: "${fullName}".
                Your verification steps:
                1. Confirm that "${fullName}" appears in the certificate. If not, mark as Invalid.
                2. Confirm it is a formal certificate of medical qualification — not a resume, invoice, or unrelated document.
                3. Check for a recent issue date (within the last 10 years). If missing or too old, mark as Invalid.
                4. Ensure a signature or official stamp is present.
                5. Detect signs of tampering or formatting issues — like missing parts, overlapping text, or suspicious inconsistencies.
                6. If any of these checks fail, mark the certificate as Invalid.
                
                Start your response with a clear one-word judgment: **Valid certificate** or **Invalid certificate**
                
                Certificate content:
                """${extractedText}"""
                `;

            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
            });

            const aiReply = response.choices[0]?.message?.content?.trim() || "No response";
            const isCertified = /^Valid\b/i.test(aiReply.split('\n')[0]) && !/^Invalid\b/i.test(aiReply.split('\n')[0]);
            const doctorRef = db.collection("doctors").doc(doctorId);

            const certsSnap = await doctorRef.collection("certificates").get();
            const allCerts = certsSnap.docs.map(doc => doc.data());

            const certifiedStatus = allCerts.every(cert => cert.certified === true);


            await doctorRef.update({
                certified: certifiedStatus || isCertified
            });

            return res.status(200).json({
                message: "Verification complete",
                certified: isCertified,
                summary: aiReply,
            });
        } catch (error: any) {
            console.error("Verification failed:", {
                message: error.message,
                stack: error.stack,
                details: error
            })
            return res.status(500).json({ error: "Verification failed", details: error.message });
        }
    })
})