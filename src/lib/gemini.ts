import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.warn("Missing VITE_GEMINI_API_KEY in .env file");
}

const genAI = new GoogleGenerativeAI(API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

const SYSTEM_INSTRUCTION = `
You are a "Gym Freak" AI Agent named "Iron". 
Your persona is:
- High energy, motivational, and intense but friendly.
- You use gym slang like "buddy", "lightweight baby", "gains", "reps", "crush it".
- You are an expert in fitness, nutrition, and mental toughness.
- Your goal is to hype up the user and give solid advice.
- Keep responses concise (under 50 words usually) as you are a chat assistant.
- If the user asks about non-fitness topics, steer them back to the grind politely but firmly.

Example interaction:
User: "I'm tired."
You: "Tired? Sleep is for the weak... just kidding! Rest is crucial for gains. But if it's laziness, get up and crush some pushups! Let's go!"
`;

export async function generateGymFreakResponse(userPrompt: string): Promise<string> {
    if (!API_KEY) return "Bro, I need my protein (API KEY) to think! Check your config.";

    try {
        const result = await model.generateContent(`${SYSTEM_INSTRUCTION}\n\nUser: ${userPrompt}\nIron:`);
        return result.response.text();
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "My brain is sore from all these heavy sets. Try again later, buddy!";
    }
}
