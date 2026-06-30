import { quickActions } from '../data/quickActions.js';

function QuickActions({ onAction }) {
  return (
    <div className="quick-actions">
      <h2 className="quick-actions-title">Quick Actions</h2>
      <div className="quick-actions-grid">
        {quickActions.map((action) => (
          <button
            key={action.id}
            type="button"
            className="quick-action-btn"
            onClick={() => onAction(action.label, action.icon, action.agent)}
          >
            <span className="quick-action-icon">{action.icon}</span>
            <span className="quick-action-label">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;
