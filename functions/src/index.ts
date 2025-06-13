import {onRequest} from "firebase-functions/v2/https";
import {defineSecret} from "firebase-functions/params";
import {OpenAI} from "openai";
import {getFirestore} from "firebase-admin/firestore";
import {getStorage} from "firebase-admin/storage";
import {initializeApp} from "firebase-admin/app";
import * as functions from "firebase-functions/v2";
import Stripe from "stripe";
import cors from "cors";
import pdf from "pdf-parse";
import type {Request, Response} from "express";

const OPENAI_KEY = defineSecret("OPENAPI_KEY");

const STRIPE_SECRET = defineSecret("STRIPE_SECRET");

initializeApp();

// Setting up CORS to allow requests from a specific origin
const corsHandler = cors({
    origin: [
        "http://localhost:5173",
        "https://medical-project-2ba5d-7073c.web.app"
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
});


// Exporting the askGpt function as a Firebase Cloud Function
export const askGpt = onRequest(
    {secrets: [OPENAI_KEY]},
    async (req: Request, res: Response) => {
        const allowedOrigins = [
            "http://localhost:5173",
            "https://medical-project-2ba5d-7073c.web.app" // Добавь свой продакшен-домен
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
            res.status(400).json({error: "Prompt is required."});
            return;
        }

        // Инициализация OpenAI
        const openai = new OpenAI({
            apiKey: process.env.OPENAPI_KEY,
        });

        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{role: "user", content: prompt}],
            });

            const reply = completion.choices[0]?.message?.content || "";
            res.status(200).json({reply});
        } catch (error: any) {
            console.error("OpenAI error:", error);
            res.status(500).json({error: "Internal Server Error"});
        }
    }
);

export const createPaymentIntent = functions.https.onRequest(
    {
        region: "us-central1",
        memory: "256MiB",
        secrets: [STRIPE_SECRET], // 🔑 declare dependency
    },
    (req: Request, res: Response) => {
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

                res.json({clientSecret: paymentIntent.client_secret});
            } catch (error: any) {
                console.error("Payment error:", error);
                res.status(500).send(error.message || "Failed to create payment intent");
            }
        });
    }
);

export const verifyCertificate = functions.https.onRequest(
    {
        region: "us-central1",
        secrets: [OPENAI_KEY],
    },
    async (req, res) => {
        const allowedOrigins = [
            "http://localhost:5173",
            "https://medical-project-2ba5d-7073c.web.app",
        ];

        const origin = req.headers.origin || "";
        if (allowedOrigins.includes(origin)) {
            res.setHeader("Access-Control-Allow-Origin", origin);
            res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
            res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        }

        if (req.method === "OPTIONS") {
            res.status(204).send("");
            return;
        }

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
            const supportedFormats = [".pdf", ".png", ".jpg", ".jpeg"];

            const fileExtension = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();

            if (!supportedFormats.includes(fileExtension)) {
                res.status(400).json({ error: "Unsupported file format" });
                return;
            }

            const db = getFirestore();
            const doctorDoc = await db.collection("doctors").doc(doctorId).get();

            if (!doctorDoc.exists) {
                res.status(404).json({ error: "Doctor not found" });
                return;
            }

            const filePath = `certificates/${doctorId}/${fileName}`;
            const bucket = getStorage().bucket();
            const file = bucket.file(filePath);

            const [exists] = await file.exists();
            if (!exists) {
                res.status(404).json({ error: "Certificate file not found" });
                return;
            }

            const [buffer] = await file.download();

            let extractedText = "";
            if (fileExtension === ".pdf") {
                const pdfFiles = await pdf(buffer);
                extractedText = pdfFiles.text;
            } else if (fileExtension === ".txt") {
                extractedText = buffer.toString("utf-8");
            } else {
                extractedText = "File format accepted but text extraction not implemented yet.";
            }

            const openai = new OpenAI({ apiKey: process.env.OPENAPI_KEY });
            const prompt = `
                You are verifying a doctor's certificate.
                
                Validation Rules:
                1. If the document contains readable content related to **medical education**, **medical license**, **certification**, or **institution names** that issue such credentials, consider return only this message **valid medical certificate**.
                2. If the document is **blank**, **unreadable**, or clearly **not a medical certificate** (such as a CV, resume, job application, or unrelated text),return only this **invalid medical certificate**.
                
                Respond in a friendly and natural tone. Clearly state whether it's a valid or invalid certificate and briefly explain why. If you can find the full name of the doctor, include it in the response.
                
                Certificate text:  
                """${extractedText}"""
`;

            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
            });

            const aiReply = response.choices[0]?.message?.content?.trim() || "No response";
            const firstLine = aiReply.split("\n")[0] || "";
            const isCertified = /^valid\b/i.test(firstLine) && !/^invalid\b/i.test(firstLine);

            const doctorRef = db.collection("doctors").doc(doctorId);

            const certsSnap = await doctorRef.collection("certificates").get();
            const allCerts = certsSnap.docs.map((doc) => doc.data());

            const certifiedStatus = allCerts.every((cert: any) => cert.certified === true);

            await doctorRef.update({
                certified: certifiedStatus || isCertified,
            });

            res.status(200).json({
                message: "Verification complete",
                certified: isCertified,
                summary: aiReply,
            });
        } catch (error: any) {
            console.error("Verification failed:", {
                message: error.message,
                stack: error.stack,
                details: error,
            });
            res.status(500).json({ error: "Verification failed", details: error.message });
            return;
        }
    }
)