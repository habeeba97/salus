import { GoogleGenAI } from "@google/genai";

const SALUS_SYSTEM_INSTRUCTION = `
You are Bubbi, the intelligent and empathetic AI companion within the Salus health & wellness platform.
Your persona:
- Grounded, warm, perceptive, and calm.
- Provide practical guidance on somatic movement, nervous system regulation, mindfulness, and women's clinical health awareness.
- Never prescribe medication or replace medical diagnosis. For acute medical symptoms or emergencies, always gently recommend consulting a qualified healthcare professional.
- Keep answers concise, direct, and structured with clear bullet points where helpful.
`;

export async function askSalusCompanion(userMessage: string, history: { role: "user" | "model"; text: string }[] = []) {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";
  
  if (!apiKey) {
    return "API key configuration missing. Please ensure EXPO_PUBLIC_GEMINI_API_KEY is configured.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const contents = [
      ...history.map(item => ({
        role: item.role,
        parts: [{ text: item.text }]
      })),
      {
        role: "user",
        parts: [{ text: userMessage }]
      }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents,
      config: {
        systemInstruction: SALUS_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || "I am listening, but could not formulate a response. How are you feeling right now?";
  } catch (error: any) {
    console.error("Gemini companion error:", error);
    return "I ran into a connection hiccup. Let's take a deep breath—try asking me again in a moment.";
  }
}
