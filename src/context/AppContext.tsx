import { createContext, useContext, useState, type ReactNode } from 'react';
// We'll import the AI service function later
// import { classifyBenefit } from '@/services/aiService'; 
// And our mock data
import allBenefits from '@/data/benefits.json';

interface AppContextType {
    isLoading: boolean;
    category: string | null;
    benefits: any[]; // Replace 'any' with a proper Benefit type later
    startBenefitSearch: (userInput: string) => Promise<void>;
    generateActionPlan: (benefitTitle: string) => Promise<string[]>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);
    const [category, setCategory] = useState<string | null>(null);
    const [benefits, setBenefits] = useState<any[]>([]);
    const [apiError, setApiError] = useState<string | null>(null);

    const startBenefitSearch = async (userInput: string) => {
        setIsLoading(true);
        setCategory(null);
        setBenefits([]);
        try {
            console.log(`Simulating AI classification for: "${userInput}"`);
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

            // --- SIMULATE AN AI ERROR ---
            if (userInput.toLowerCase().includes("skydiving")) {
                // This is where you'd handle a vague/unsupported prompt from the AI
                throw new Error("Query is not related to health benefits.");
            }

            const classifiedCategory = "Dental";
            setCategory(classifiedCategory);

            const filteredBenefits = allBenefits.filter(b => b.category === classifiedCategory);
            setBenefits(filteredBenefits);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            console.error("Benefit search failed:", errorMessage);
            setApiError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const generateActionPlan = async (benefitTitle: string): Promise<string[]> => {
        console.log(`Generating action plan for: "${benefitTitle}"`);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

        // In your real serverless function, you would use a prompt like:
        // `Generate a 3-step action plan for an employee to avail the "${benefitTitle}" benefit. Return it as a JSON array of strings.`

        // --- SIMULATE A SUCCESSFUL AI RESPONSE ---
        const simulatedPlan = [
            "Find an in-network provider using the company's insurance portal.",
            "Schedule an appointment and mention your insurance details.",
            "Submit the final bill on the reimbursement portal for a claim."
        ];

        // return JSON.parse(aiResponse);
        return simulatedPlan;
    };

    const value = {
        isLoading,
        category,
        benefits,
        apiError,
        startBenefitSearch,
        generateActionPlan,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}