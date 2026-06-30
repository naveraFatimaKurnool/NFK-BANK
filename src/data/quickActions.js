export const quickActions = [
  { id: 1, label: 'Report Fraud', icon: '\u{1F6A8}', agent: 'secureAssist' },
  { id: 2, label: 'Freeze My Card', icon: '\u2744\uFE0F', agent: 'secureAssist' },
  { id: 3, label: 'Replace My Card', icon: '\u{1F4B3}', agent: 'secureAssist' },
  { id: 4, label: 'Check Fraud Status', icon: '\u{1F4C4}', agent: 'secureAssist' },
  { id: 5, label: 'Security Tips', icon: '\u{1F6E1}\uFE0F', agent: 'secureAssist' },
  { id: 6, label: 'Speak to Frank', icon: '\u{1F468}\u200D\u{1F4BC}', agent: null },
];

export const actionResponses = {
  'Report Fraud':
    'I can help you report a suspicious transaction. Before we begin, I\'ll need to verify your identity. Please enter your Customer ID.',
  'Freeze My Card':
    'I can help you freeze your card right away. Before proceeding, please enter your Customer ID so I can verify your identity.',
  'Replace My Card':
    'I can help you order a replacement card. For security purposes, please verify your identity first by entering your Customer ID.',
  'Check Fraud Status':
    'I\'d be happy to check the status of your fraud case. Please enter your Fraud Case ID to look it up.',
  'Security Tips':
    'Here are some important security tips to keep your account safe:\n\n\u0031\ufe0f\u20e3 Never share your PIN, OTP, or card details with anyone.\n\n\u0032\ufe0f\u20e3 Use strong, unique passwords for online banking.\n\n\u0033\ufe0f\u20e3 Enable two-factor authentication on all accounts.\n\n\u0034\ufe0f\u20e3 Monitor your account regularly for unauthorized transactions.\n\n\u0035\ufe0f\u20e3 Avoid using public Wi-Fi for banking transactions.\n\nStay safe and feel free to reach out if you need anything else.',
  'Speak to Frank':
    'I\'ll connect you with Frank, our Fraud Support Specialist. Please hold while I transfer you.',
};
