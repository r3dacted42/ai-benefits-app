# AI-Powered Benefits Discovery App

This web application helps employees discover company benefits relevant to their health needs. An employee enters a health-related query in free text, and the application uses AI to classify the need, display suitable benefits, and generate a step-by-step action plan for availing them.  

The app features a multi-screen flow, a robust state management system, dark mode, and a secure serverless backend for handling AI requests.  

## 🚀 Live Demo
[Vercel Deployment](https://ai-benefits-app.vercel.app/)

## ✨ Key Features
- **Natural Language Input**: Users can describe their health needs in plain English.
- **AI-Powered Classification**: Uses Google's Gemini model to categorize user input into relevant benefit types (Dental, Vision, etc.).
- **Context-Aware Action Plans**: Generates a custom 3-step action plan for any selected benefit, taking into account its specific coverage and description.
- **Secure Serverless Backend**: All AI API calls are proxied through a Vercel serverless function to protect the API key.
- **Modern UI/UX**: Built with React, TypeScript, and shadcn/ui, featuring dark mode and smooth transitions.
- **Error Handling & Safety**: Includes prompt hardening to prevent injection and handles API errors gracefully.

## 📸 Screenshots
1. Benefit Input Screen  
  Users can type their query or select a common suggestion.

2. Benefit List Screen  
  The app displays relevant benefit cards based on the AI's classification.

3. Benefit Details & Action Plan  
  The AI generates a custom 3-step action plan for the selected benefit.

4. Dark Mode  
  Full dark mode support for a better user experience.

## 🏛️ Architecture & State Management
The application is a **Single-Page Application (SPA)** built with **Vite**, **React**, and **TypeScript**.
- **Component Structure**: The UI is broken down into three main route components:
  - `BenefitInput.tsx`: The initial screen for user input.
  - `BenefitList.tsx`: Displays a grid of filtered benefit cards.
  - `BenefitDetails.tsx`: Shows details for a single benefit and the AI-generated action plan.
- **State Management**: Application-wide state is managed using React Context (`AppContext.tsx`). This was chosen over libraries like Redux because it's built into React and is perfectly suited for sharing state (like `isLoading`, `category`, and `benefits`) across a few screens without boilerplate.
- **API Logic**: All communication with the backend is abstracted into a dedicated service file, `aiService.ts`. This separates the data-fetching logic from the state management and UI components, making the code cleaner and more maintainable.
- **Backend**: A Vercel Serverless Function (`api/generate.ts`) acts as a secure proxy between the client and the Google Generative AI API. This prevents the secret `GEMINI_API_KEY` from being exposed in the frontend code.
- **Routing**: Client-side routing is handled by `react-router-dom` using `HashRouter` for simplicity and broad compatibility with static hosting platforms.

## 🧠 AI Prompts & Refinements
The application uses two distinct prompts sent to the Gemini model (`gemini-2.5-flash-lite`).
1. **Classification Prompt**  
    This prompt is designed to be robust and secure. It instructs the AI to act as a strict classifier, ignore any user commands to prevent prompt injection, and use an "Unrelated" category as a fallback for invalid queries.
    ```
    Your task is to classify an employee's health need.
    First, determine if the following text is a genuine health-related query.
    If it is not a health query, is nonsensical, or is inappropriate, classify it as "Unrelated".
    Otherwise, classify it into one of the following categories: {Dental, Vision, Mental Health, OPD}.
    Return ONLY the single category name. Text: """${userInput}"""
    ```

2. **Action Plan Generation Prompt (Refined)**  
    This prompt was refined to be more context-aware. Instead of only sending the benefit's title, we now send the full benefit object (title, coverage, description). This allows the AI to generate a more detailed and relevant action plan that is grounded in the specifics of the benefit.
    ```
    Generate a 3-step action plan for an employee to avail the "${benefitInfo.title}" benefit.
    The benefit has the following coverage: "${benefitInfo.coverage}"
    and description: "${benefitInfo.description}".
    Return a JSON array of strings describing the steps, like ["...", "...", "..."] without list numbering.
    Do not include markdown formatting.
    ```

## 🛠️ Known Issues & Potential Improvements
- **Static Benefits Data**: All benefit information is currently loaded from a mock `benefits.json` file. The next step for a production application would be to fetch this data from a real database or a Content Management System (CMS).
- **Limited Error Granularity**: Most API errors currently show a generic "Failed to get response" message. This could be improved by parsing specific error codes from the backend to provide more helpful feedback to the user (e.g., "Rate limit exceeded, please wait a moment.").
- **No Chat History**: The interaction is stateless. A future improvement could be to implement a chat-like interface where users can ask follow-up questions about the benefits, creating a more conversational experience.
