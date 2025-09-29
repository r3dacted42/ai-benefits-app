import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import type { AIRequestBody, AIResponse } from '../src/lib/types.ts';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
if (!process.env.GEMINI_API_KEY) {
    console.warn("Warning: GEMINI_API_KEY is not set. AI functionalities will not work.");
}
const modelVersion = 'gemini-2.5-flash-lite';
console.log(`Using model version: ${modelVersion}`);

export default async function handler(
    req: VercelRequest,
    res: VercelResponse,
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { promptType, clfInfo, benefitInfo } = req.body as AIRequestBody;
        const model = genAI.getGenerativeModel({
            model: modelVersion,
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
                },
            ],
        });

        let prompt = '';

        if (promptType === 'classification' && clfInfo) {
            prompt = `Your task is to classify an employee's health need. \
                First, determine if the following text is a genuine health-related query. \
                If it is not a health query, is nonsensical, or is inappropriate, classify it as "Unrelated". \
                Otherwise, classify it into one of the following categories: {${clfInfo.categories.join(', ')}}. \
                Return ONLY the single category name. Text: """${clfInfo.userInput}"""`;
        } else if (promptType === 'action-plan' && benefitInfo) {
            prompt = `Generate a 3-step action plan for an employee to avail the """${benefitInfo.title}""" benefit. \
                The benefit has the following coverage: """${benefitInfo.coverage}""" \
                and description: """${benefitInfo.description}""". \
                Return ONLY a JSON array of strings describing the steps, like ["1. ...", "2. ...", "3. ..."].`;
        } else {
            return res.status(400).json({ error: 'Invalid prompt type or missing required data' });
        }

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        res.status(200).json({ response: text.trim() } as AIResponse);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate AI response.' });
    }
}