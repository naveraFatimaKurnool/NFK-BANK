import { useState, useCallback, useRef, useEffect } from 'react';
import Header from '../components/Header.jsx';
import ChatWindow from '../components/ChatWindow.jsx';
import QuickActions from '../components/QuickActions.jsx';
import ChatInput from '../components/ChatInput.jsx';
import HistoryPanel from '../components/HistoryPanel.jsx';
import { actionResponses } from '../data/quickActions.js';
import { routeToAgent, generateResponse } from '../data/agents.js';
import '../styles/chatbot.css';

const welcomeMessage = {
  role: 'assistant',
  agent: 'secureAssist',
  text: `\u{1F44B} Welcome to NFK Bank.\n\nI'm NFK SecureAssist, your AI Fraud Protection Assistant. I handle fraud detection, card services, and security concerns.\n\nMy colleague Jay is our Banking Business Expert and can help with loans, savings, credit cards, and general banking.\n\nHow can I help you today?`,
};

function Home() {
  const [messages, setMessages] = useState([welcomeMessage]);
  const [awaitingInput, setAwaitingInput] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [cardDigits, setCardDigits] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [merchant, setMerchant] = useState('');
  const [conversationEnded, setConversationEnded] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const timerRef = useRef(null);
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  function determineTitle(msgs) {
    const userMsgs = msgs.filter((m) => m.role === 'user');
    if (userMsgs.length === 0) return 'General Inquiry';
    const first = userMsgs[0].text;
    const actionLabels = ['Report Fraud', 'Pay a Bill', 'Loan Inquiry', 'Open Account', 'Freeze Card', 'Speak to Frank'];
    for (const label of actionLabels) {
      if (first.includes(label)) return label;
    }
    return first.replace(/[^\w\s]/g, '').trim().substring(0, 60) || 'General Inquiry';
  }

  function determineAgent(msgs) {
    const agentSet = new Set();
    msgs.forEach((m) => {
      if (m.role === 'assistant' && m.agent) agentSet.add(m.agent);
    });
    const displayNames = { secureAssist: 'NFK SecureAssist', jay: 'Jay' };
    return Array.from(agentSet).map((id) => displayNames[id] || id);
  }

  function saveConversation(msgs) {
    if (msgs.length <= 1) return;
    const item = {
      id: Date.now(),
      agent: determineAgent(msgs)[0] || 'NFK SecureAssist',
      agents: determineAgent(msgs),
      title: determineTitle(msgs),
      messages: msgs,
      status: 'Completed',
    };
    try {
      const existing = JSON.parse(localStorage.getItem('nfk-chat-history') || '[]');
      existing.unshift(item);
      localStorage.setItem('nfk-chat-history', JSON.stringify(existing));
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    if (conversationEnded) {
      saveConversation(messagesRef.current);
    }
  }, [conversationEnded]);

  const handleAction = useCallback((label, icon, agentId) => {
    const userMsg = { role: 'user', text: `${icon} ${label}` };
    setMessages((prev) => [...prev, userMsg]);
    setAwaitingInput(null);

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      const reply = actionResponses[label] || 'I\'ll help you with that shortly.';
      const botMsg = { role: 'assistant', text: reply, agent: agentId || undefined };
      setMessages((prev) => [...prev, botMsg]);

      if (label === 'Report Fraud') {
        setAwaitingInput('customerId');
      }
    }, 800);
  }, []);

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text || isBusy) return;

    const userMsg = { role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');

    const stage = awaitingInput;
    setAwaitingInput(null);
    setIsBusy(true);

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      if (stage) {
        let reply = '';
        let nextStage = null;

        switch (stage) {
          case 'customerId':
            reply = 'Thank you. Your identity has been verified. Please enter the last 4 digits of the card involved.';
            nextStage = 'cardDigits';
            break;
          case 'cardDigits':
            setCardDigits(text);
            reply = 'Thank you. Please enter the suspicious transaction amount.';
            nextStage = 'amount';
            break;
          case 'amount':
            setAmount(text);
            reply = 'Please enter the transaction date (DD/MM/YYYY).';
            nextStage = 'date';
            break;
          case 'date':
            setTransactionDate(text);
            reply = 'Please enter the merchant or business name.';
            nextStage = 'merchant';
            break;
          case 'merchant':
            setMerchant(text);
            reply = 'Would you like me to freeze your card immediately?\n\nReply Yes or No.';
            nextStage = 'freezeConfirm';
            break;
          case 'freezeConfirm':
            if (text.toLowerCase() === 'yes' || text.toLowerCase() === 'y') {
              reply = 'Your card has been temporarily frozen.\n\nA replacement card request has also been created.\n\nFraud Case ID:\n\nNFK-FR-2026-10452\n\nOur Fraud Support Specialist Frank has been notified.\n\nYou will receive an email confirmation shortly.\n\nIs there anything else I can help you with today?';
            } else {
              reply = 'Your card will remain active.\n\nYour fraud report has still been submitted.\n\nFraud Case ID:\n\nNFK-FR-2026-10452\n\nIf you notice any further suspicious activity, please contact us immediately.\n\nIs there anything else I can help you with today?';
            }
            break;
          default:
            reply = '';
        }

        if (reply) {
          const botMsg = { role: 'assistant', text: reply, agent: 'secureAssist' };
          setMessages((prev) => [...prev, botMsg]);
        }

        if (nextStage) {
          setAwaitingInput(nextStage);
        }

        if (stage === 'freezeConfirm') {
          setConversationEnded(true);
        }
      } else {
        const agentId = routeToAgent(text);
        const reply = generateResponse(text, agentId);
        if (reply) {
          const botMsg = { role: 'assistant', text: reply, agent: agentId };
          setMessages((prev) => [...prev, botMsg]);
        }
      }

      setIsBusy(false);
    }, 800);
  };

  const restartConversation = () => {
    if (!conversationEnded) {
      saveConversation(messagesRef.current);
    }
    setMessages([welcomeMessage]);
    setAwaitingInput(null);
    setInputValue('');
    setCardDigits('');
    setAmount('');
    setTransactionDate('');
    setMerchant('');
    setConversationEnded(false);
    setIsBusy(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  return (
    <div className="home">
      <Header onHistoryClick={() => setHistoryOpen(true)} />
      <HistoryPanel open={historyOpen} onClose={() => setHistoryOpen(false)} />
      <main className="main-content">
        <div className="chat-container">
          <ChatWindow messages={messages} />
          <QuickActions onAction={handleAction} />
          {conversationEnded && (
            <div className="restart-wrapper">
              <button type="button" className="restart-btn" onClick={restartConversation}>
                Restart Conversation
              </button>
            </div>
          )}
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSend}
            disabled={isBusy}
          />
        </div>
      </main>
    </div>
  );
}

export default Home;
