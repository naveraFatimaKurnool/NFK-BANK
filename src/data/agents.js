const negativeKeywords = ['angry', 'frustrated', 'upset', 'worried', 'scared', 'confused', 'help', 'stolen', 'fraud', 'panic'];
const positiveKeywords = ['thanks', 'great', 'awesome', 'good'];

export function detectSentiment(text) {
  const lower = text.toLowerCase();
  const hasNegative = negativeKeywords.some((k) => lower.includes(k));
  const hasPositive = positiveKeywords.some((k) => lower.includes(k));
  if (hasNegative) return 'negative';
  if (hasPositive) return 'positive';
  return 'neutral';
}

const empathyPrefixes = {
  secureAssist: {
    negative: "I understand your concern. Don't worry, I'll help you through this.",
    positive: "You're welcome. I'm glad I could help.",
  },
  jay: {
    negative: "I hear you, and I want to make sure you're taken care of.",
    positive: "You're very welcome! Happy I could help out.",
  },
};

function getEmpathyPrefix(agentId, sentiment) {
  if (sentiment === 'neutral') return '';
  return empathyPrefixes[agentId]?.[sentiment] || '';
}

export const agents = {
  secureAssist: {
    id: 'secureAssist',
    name: 'NFK SecureAssist',
    role: 'Fraud Protection Assistant',
    keywords: ['fraud', 'suspicious', 'stolen', 'freeze', 'replace', 'unauthorized', 'security', 'phishing', 'scam'],
  },
  jay: {
    id: 'jay',
    name: 'Jay',
    role: 'Banking Business Expert',
    keywords: ['loan', 'mortgage', 'savings', 'interest', 'account opening', 'deposit', 'credit card', 'banking', 'investment', 'credit limit'],
  },
};

export function routeToAgent(text) {
  const lower = text.toLowerCase();
  for (const [, agent] of Object.entries(agents)) {
    if (agent.keywords.some((k) => lower.includes(k))) {
      return agent.id;
    }
  }
  return 'secureAssist';
}

export function generateResponse(text, agentId) {
  const lower = text.toLowerCase();
  const sentiment = detectSentiment(text);
  const prefix = getEmpathyPrefix(agentId, sentiment);

  let response = '';

  if (agentId === 'secureAssist') {
    if (lower.includes('fraud') || lower.includes('suspicious') || lower.includes('scam')) {
      response = "I understand you're concerned about fraudulent activity. To help you report a suspicious transaction, I'll need to verify your identity first. Please click the 'Report Fraud' quick action button above to begin the process.";
    } else if (lower.includes('freeze') || lower.includes('stolen')) {
      response = "I can help you freeze your card right away. Please click the 'Freeze My Card' quick action button above to get started.";
    } else if (lower.includes('replace')) {
      response = "I can assist you with ordering a replacement card. Click the 'Replace My Card' quick action button above to begin.";
    } else if (lower.includes('security') || lower.includes('tip') || lower.includes('protect')) {
      response = "I'd be happy to share some security tips. Click the 'Security Tips' quick action button above for our top recommendations to keep your account safe.";
    } else {
      response = "I'm NFK SecureAssist, your Fraud Protection Assistant. I can help with reporting fraud, freezing or replacing cards, and security concerns. Please use one of the quick action buttons above or describe what you need.";
    }
  } else if (agentId === 'jay') {
    if (lower.includes('loan') || lower.includes('mortgage')) {
      response = "I'd be happy to help you explore our loan options. We offer home loans, personal loans, and business loans with competitive rates. What type of loan are you interested in?";
    } else if (lower.includes('savings') || lower.includes('deposit')) {
      response = "Our savings accounts offer some of the best rates in the market. We have standard savings, high-yield accounts, and fixed deposit options. What type of savings product interests you?";
    } else if (lower.includes('credit card')) {
      response = "We offer a range of credit cards tailored to different lifestyles, from travel rewards to cashback. I'd be happy to walk you through the options and help you find the right one.";
    } else if (lower.includes('interest') || lower.includes('rate')) {
      response = "Our interest rates are competitive across all our products. Are you looking for savings rates, loan rates, or something else? I can provide the details you need.";
    } else if (lower.includes('account') || lower.includes('open')) {
      response = "Opening an account with NFK Bank is straightforward. We offer checking accounts, savings accounts, and business accounts. Would you like to know more about a specific type?";
    } else {
      response = "I'm Jay, your Banking Business Expert. I can help with loans, savings accounts, credit cards, deposits, and general banking questions. What would you like to know?";
    }
  } else {
    response = 'How can I help you today?';
  }

  if (prefix && sentiment === 'negative') {
    response = prefix + '\n\n' + response;
  } else if (prefix && sentiment === 'positive') {
    response = response + '\n\n' + prefix;
  }

  return response;
}
