import ChatMessage from './ChatMessage.jsx';

function ChatWindow({ messages }) {
  return (
    <div className="chat-window">
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
      </div>
    </div>
  );
}

export default ChatWindow;
