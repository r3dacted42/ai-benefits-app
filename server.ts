import dotenv from 'dotenv';
import express from 'express';
import handler from './api/generate';

// load GEMINI_API_KEY from .env file
dotenv.config();

const app = express();
const port = 3001;

app.use(express.json());

// requests to /api/generate will be handled by existing Vercel function
app.all('/api/generate', (req, res) => {
    handler(req as any, res as any);
});

app.listen(port, () => {
    console.log(`[server]: Local API server is running at http://localhost:${port}`);
});
