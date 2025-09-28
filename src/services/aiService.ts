const API_ENDPOINT = '/api/generate';

/**
 * Sends user input to the backend for classification into a benefit category.
 * @param userInput The free-text input from the user.
 * @param signal An optional AbortSignal to cancel the request.
 * @returns The classified category name as a string.
 */
export async function classifyBenefit(userInput: string, signal?: AbortSignal): Promise<string> {
    const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptType: 'classification', userInput }),
        signal,
    });

    if (!response.ok) {
        throw new Error('Failed to get a response from the AI.');
    }

    const data = await response.json();
    return data.response;
}

/**
 * Sends a benefit title to the backend to generate a 3-step action plan.
 * @param benefitTitle The title of the selected benefit.
 * @param signal An optional AbortSignal to cancel the request.
 * @returns An array of strings representing the action plan.
 */
export async function fetchActionPlan(benefitTitle: string, signal?: AbortSignal): Promise<string[]> {
    const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptType: 'action-plan', userInput: benefitTitle }),
        signal,
    });

    if (!response.ok) {
        throw new Error('Failed to generate action plan.');
    }

    const data = await response.json();
    try {
        return JSON.parse(data.response);
    } catch {
        throw new Error('AI returned an invalid format for the action plan.');
    }
}