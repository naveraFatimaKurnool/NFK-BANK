const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

function getApiKey() {
  return import.meta.env.VITE_GEMINI_API_KEY || '';
}

function buildPrompt(userText, agentName, agentRole) {
  return {
    contents: [
      {
        parts: [
          {
            text: `You are a banking assistant for NFK Bank.

Agent:
${agentName}
Role:
${agentRole}

Guidelines:
- Answer professionally and concisely in 2-4 sentences.
- Never invent customer information, account numbers, balances, or transaction history.
- Never request passwords, PINs, OTPs, or full card numbers.
- For sensitive actions like freezing cards, reporting fraud, or replacing cards, encourage the customer to use the chat's dedicated features.
- If you don't know something, be honest and suggest contacting the bank directly.

Customer message: ${userText}`,
          },
        ],
      },
    ],
  };
}

export async function getGeminiResponse(userText, agentName, agentRole) {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  try {
    const body = buildPrompt(userText, agentName, agentRole);
    const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch {
    return null;
  }
}
