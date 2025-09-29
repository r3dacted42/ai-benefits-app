import categories from "@/data/categories";
import type { AIRequestBody, AIResponse, Benefit, Category } from "@/lib/types";

const API_ENDPOINT = '/api/generate';

/**
 * Sends user input to the backend for classification into a benefit category.
 * @param userInput The free-text input from the user.
 * @returns The classified category name as a string.
 */
export async function classifyBenefit(userInput: string): Promise<Category> {
    const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            promptType: 'classification',
            clfInfo: { userInput: userInput, categories: categories },
        } as AIRequestBody),
    });

    if (!response.ok) {
        throw new Error('Failed to get a response from the AI.');
    }

    const data = await response.json() as AIResponse;
    if (!categories.includes(data.response as Category)) {
        throw new Error('AI returned an invalid category.');
    }
    return data.response as Category;
}

/**
 * Sends a benefit title to the backend to generate a 3-step action plan.
 * @param benefitId The id of the selected benefit.
 * @returns An array of strings representing the action plan.
 */
export async function fetchActionPlan(benefit: Benefit): Promise<string[]> {
    const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptType: 'action-plan', benefitInfo: benefit } as AIRequestBody),
    });

    if (!response.ok) {
        throw new Error('Failed to generate action plan.');
    }

    const data = await response.json() as AIResponse;
    let text = data.response;
    if (text.includes("```json") || text.includes("```")) {
        // Remove any markdown code block formatting
        const codeBlockRegex = /```json\s*([\s\S]*?)\s*```|```\s*([\s\S]*?)\s*```/;
        const match = text.match(codeBlockRegex);
        if (match) {
            text = match[1] || match[2];
        }
    }
    try {
        return JSON.parse(text);
    } catch {
        throw new Error(`AI returned an invalid format for the action plan: ${text}`);
    }
}