import { agents } from '../data/agents.js';

function ChatMessage({ message }) {
  return (
    <div className={`chat-message ${message.role}`}>
      <div className="chat-bubble">
        {message.role === 'assistant' && (
          <div className="chat-avatar">{'\u{1F916}'}</div>
        )}
        <div className="chat-content">
          {message.role === 'assistant' && message.agent && agents[message.agent] && (
            <div className="chat-agent-name">{agents[message.agent].name}</div>
          )}
          <p>{message.text}</p>
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
