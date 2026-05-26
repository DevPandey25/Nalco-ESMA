import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore.js';
import { ROLE_NAMES } from '../constants/roles.js';
import { exportCsv } from '../utils/exportCsv.js';
import '../styles/topbar.css';

// Fix import for PAGE_TITLES
import { PAGE_TITLES as TITLES } from '../constants/workflow.js';

export default function Topbar() {
  const role = useAppStore(state => state.role);
  const setRole = useAppStore(state => state.setRole);
  const showToast = useAppStore(state => state.showToast);
  const requests = useAppStore(state => state.requests);
  const location = useLocation();
  const navigate = useNavigate();

  const [crumb, title] = TITLES[location.pathname] || ['Dashboard', 'ESMA Command Center'];

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    showToast(`Role switched to ${e.target.value}.`);
  };

  const handleNewRequest = () => {
    navigate('/request');
    showToast("Request form is ready for a new digitally signed submission.");
  };

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">{crumb}</p>
        <h2>{title}</h2>
      </div>
      <div className="topbar-actions">
        <label className="role-switcher">
          <span>Active Role</span>
          <select value={role} onChange={handleRoleChange}>
            {ROLE_NAMES.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </label>
        <button className="btn secondary" type="button" onClick={() => exportCsv(requests)}>
          Export CSV
        </button>
        <button className="btn primary" type="button" onClick={handleNewRequest}>
          New Request
        </button>
      </div>
    </header>
  );
}
