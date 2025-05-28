// Importing config for environment variables
import { config } from 'dotenv';

// Importing express for creating the server
import express from 'express';

// Importing cors for handling CORS issues
import cors from 'cors';

// Importing OpenAI for AI functionalities
import OpenAI from 'openai';


// Getting the environment variables from .env file
config();

// Creating app instance of express
const app = express();

// Setting rule for parse JSON data
app.use(express.json());

// Setting rule for accepting requests from any origin
app.use(cors());

// Initing OpenAI with the API key from environment variables
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
});

// Port for the server to listen on
const PORT = process.env.PORT || 3001;

// Part for handleing post requests to /api/chat from our frontend
app.post('/api/chat', (req, res) => {

	// Getting messages from the request body
	const { message } = req.body;

	// Validating if messages are provided
	if (!message || message.length === 0) {
		res.status(400).json({ error: 'Messages are required' });
		return ;
	}

	// Sending messages to OpenAI and getting the response
	openai.chat.completions.create({
		model: 'gpt-3.5-turbo',
		messages: message,
	}).then((response) => {
		// Sending the response back to the client
		res.json({reply: response.choices[0].message.content,});
	}).catch((error) => {
		// Handling errors and sending error response
		console.error('Error:', error);
		res.status(500).json({ error: 'An error occurred while processing your request.' });
	});
});

// Endpoint for handling chat requests
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

// Firebase function for getting doctors and articles json

export const getDataJson = (message : string) => {

}