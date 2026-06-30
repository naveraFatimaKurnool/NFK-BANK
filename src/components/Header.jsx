function Header({ onHistoryClick }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <span className="header-icon">{'\u{1F3E6}'}</span>
          <div className="header-text">
            <h1 className="header-title">NFK Bank</h1>
            <p className="header-subtitle">NFK SecureAssist</p>
          </div>
        </div>
        <button type="button" className="header-history-btn" onClick={onHistoryClick} title="Conversation History">
          {'\u{1F4CB}'} History
        </button>
      </div>
    </header>
  );
}

export default Header;
