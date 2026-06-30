import { useState, useEffect } from 'react';
import { agents } from '../data/agents.js';

function HistoryPanel({ open, onClose }) {
  const [history, setHistory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (open) {
      try {
        const data = localStorage.getItem('nfk-chat-history');
        setHistory(data ? JSON.parse(data) : []);
      } catch {
        setHistory([]);
      }
      setSelectedItem(null);
    }
  }, [open]);

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className={`history-overlay ${open ? 'history-overlay--open' : ''}`} onClick={onClose}>
      <aside className={`history-panel ${open ? 'history-panel--open' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="history-panel-header">
          <h2 className="history-panel-title">
            {selectedItem ? '\u{1F4DD} Conversation' : '\u{1F4CB} Conversation History'}
          </h2>
          <div className="history-panel-header-actions">
            {selectedItem && (
              <button type="button" className="history-back-btn" onClick={() => setSelectedItem(null)}>
                {'\u{2190}'} Back
              </button>
            )}
            <button type="button" className="history-close-btn" onClick={onClose}>
              {'\u2715'}
            </button>
          </div>
        </div>

        <div className="history-panel-body">
          {selectedItem ? (
            <div className="history-detail">
              <div className="history-detail-meta">
                <span className="history-detail-agent">{selectedItem.agent}</span>
                {selectedItem.agents && selectedItem.agents.length > 1 && (
                  <span className="history-detail-agent history-detail-agent--multi">
                    {'\u002B'} {selectedItem.agents.slice(1).join(', ')}
                  </span>
                )}
                <span className="history-detail-status">{selectedItem.status}</span>
              </div>
              <p className="history-detail-date">{formatTime(selectedItem.id)}</p>
              <div className="history-detail-messages">
                {selectedItem.messages.map((msg, i) => (
                  <div key={i} className={`history-msg history-msg--${msg.role}`}>
                    {msg.role === 'assistant' && msg.agent && (
                      <span className="history-msg-agent">{agents[msg.agent]?.name || msg.agent}</span>
                    )}
                    <div className="history-msg-text">{msg.text}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : history.length === 0 ? (
            <div className="history-empty">
              <p className="history-empty-text">No conversation history yet.</p>
              <p className="history-empty-sub">Your completed conversations will appear here.</p>
            </div>
          ) : (
            <ul className="history-list">
              {history.map((item) => (
                <li key={item.id} className="history-list-item" onClick={() => setSelectedItem(item)}>
                  <div className="history-item-header">
                    <span className="history-item-title">{item.title}</span>
                    <span className="history-item-time">{formatTime(item.id)}</span>
                  </div>
                  <div className="history-item-meta">
                    <span className="history-item-agent">{item.agent}</span>
                    <span className="history-item-status">{item.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}

export default HistoryPanel;
