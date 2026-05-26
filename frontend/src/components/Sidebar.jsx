import { NavLink } from 'react-router-dom';
import '../styles/sidebar.css';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">N</div>
        <div>
          <h1>NALCO ESMA</h1>
          <span>External Storage Media Access</span>
        </div>
      </div>

      <nav className="nav-list" aria-label="Primary">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          Dashboard
        </NavLink>
        <NavLink to="/request" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          Request Form
        </NavLink>
        <NavLink to="/data" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          Data Management
        </NavLink>
        <NavLink to="/approvals" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          Approvals
        </NavLink>
        <NavLink to="/reports" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          Reports
        </NavLink>
      </nav>
    </aside>
  );
}
