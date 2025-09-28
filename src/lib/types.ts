import categories from '@/data/categories';

export type Category = typeof categories[number];

export type Benefit = {
    id: string;
    category: Category;
    title: string;
    coverage: string;
    description: string;
};

export type PromptType = 'classification' | 'action-plan';

export type AIRequestBody = {
    promptType: PromptType;
    userInput: string;
};

export type AIResponse = {
    response: string;
};
