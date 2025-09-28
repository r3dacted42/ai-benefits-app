import { createContext, useContext, useState, type ReactNode } from 'react';
import * as aiService from '@/services/aiService';
import allBenefits from '@/data/benefits.json';

interface AppContextType {
    isLoading: boolean;
    category: string | null;
    benefits: any[];
    apiError: string | null;
    startBenefitSearch: (userInput: string, signal?: AbortSignal) => Promise<void>;
    generateActionPlan: (benefitTitle: string, signal?: AbortSignal) => Promise<string[]>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);
    const [category, setCategory] = useState<string | null>(null);
    const [benefits, setBenefits] = useState<any[]>([]);
    const [apiError, setApiError] = useState<string | null>(null);

    const startBenefitSearch = async (userInput: string, signal?: AbortSignal) => {
        setIsLoading(true);
        setApiError(null);
        setCategory(null);
        setBenefits([]);
        try {
            const classifiedCategory = await aiService.classifyBenefit(userInput, signal);
            if (classifiedCategory === "Unrelated") {
                throw new Error("Query is not related to health benefits.");
            }
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

    const generateActionPlan = async (benefitTitle: string, signal?: AbortSignal): Promise<string[]> => {
        return aiService.fetchActionPlan(benefitTitle, signal);
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