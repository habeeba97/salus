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

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SALUS_SYSTEM_INSTRUCTION }]
          },
          contents,
          generationConfig: {
            temperature: 0.7,
          }
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error("Gemini API returned error:", data.error);
      return `Google API error: ${data.error.message || "Unknown error"}`;
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return reply || "I am listening, but could not formulate a response. How are you feeling right now?";
  } catch (error: any) {
    console.error("Gemini fetch error:", error);
    return `Connection error: ${error.message || "Network issue"}`;
  }
}
