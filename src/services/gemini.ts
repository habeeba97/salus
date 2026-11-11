const SALUS_SYSTEM_INSTRUCTION = `You are Bubbi, the intelligent and empathetic AI companion within the Salus health & wellness platform.
Your persona:
- Grounded, warm, perceptive, and calm.
- Provide practical guidance on somatic movement, nervous system regulation, mindfulness, and women's clinical health awareness.
- Never prescribe medication or replace medical diagnosis. For acute medical symptoms or emergencies, always gently recommend consulting a qualified healthcare professional.
- Keep answers concise, direct, and structured with clear bullet points where helpful.`;

export async function askSalusCompanion(userMessage: string, history: { role: "user" | "model"; text: string }[] = []) {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";

  if (!apiKey) {
    return "API key configuration missing. Please ensure EXPO_PUBLIC_GEMINI_API_KEY is configured.";
  }

  const contents = [
    {
      role: "user",
      parts: [{ text: `System Instruction: ${SALUS_SYSTEM_INSTRUCTION}` }]
    },
    {
      role: "model",
      parts: [{ text: "Understood. I am Bubbi, ready to support you with calm, grounded wellness guidance." }]
    },
    ...history.map(item => ({
      role: item.role,
      parts: [{ text: item.text }]
    })),
    {
      role: "user",
      parts: [{ text: userMessage }]
    }
  ];

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        }),
      }
    );

    const data = await response.json();

    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }

    if (data.error) {
      return `Google API error: ${data.error.message || "Model failed"}`;
    }

    return "I am listening, but could not formulate a response. How are you feeling right now?";
  } catch (err: any) {
    return `Connection error: ${err.message || "Network issue"}`;
  }
}
