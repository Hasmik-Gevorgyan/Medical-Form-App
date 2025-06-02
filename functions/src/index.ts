// Getting Started with Firebase Functions
import { onRequest } from "firebase-functions/v2/https";
// Secrets are used to store sensitive information like API keys
import { defineSecret } from "firebase-functions/params";
// Importing OpenAI SDK for making requests to the OpenAI API
import { OpenAI } from "openai";
// Importing CORS middleware to handle cross-origin requests
import cors from "cors";

// Getting the OpenAI API key from Firebase Functions secrets
const OPENAI_KEY = defineSecret("OPENAPI_KEY");

// Setting up CORS to allow requests from a specific origin
const corsHandler = cors({
  origin: "http://localhost:5173",
});

// Exporting the askGpt function as a Firebase Cloud Function
export const askGpt = onRequest(
  {
    secrets: [OPENAI_KEY],
  },
//   Part of the code that handles incoming requests
  async (req, res) => {
    
	// Using the CORS handler to manage cross-origin requests
	corsHandler(req, res, async () => {
	  // Check if the request method is POST
      if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
      }
	  // Check if the request body contains a prompt
      const prompt = req.body.prompt;
      if (!prompt) {
        res.status(400).json({ error: "Give the prompt" });
        return;
      }

	//   Initializing the OpenAI client with the API key
      const openai = new OpenAI({
        apiKey: process.env.OPENAPI_KEY,
      });

	//   Sending a chat completion request to OpenAI with the provided prompt
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
        });

        const reply = completion.choices[0]?.message?.content || "";
        res.status(200).json({ reply });
      } catch (error) {
		// Log the error and send a 500 response
        console.error(error);
        res.status(500).json({ error: error});
      }
    });
  }
);

