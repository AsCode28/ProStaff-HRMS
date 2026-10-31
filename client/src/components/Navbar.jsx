import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const isLead = user && (user.role === 'manager' || user.role === 'hr');

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">HRMS</Link>
        <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#menu">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="menu">
          {user && (
            <ul className="navbar-nav me-auto">
              <li className="nav-item"><NavLink className="nav-link" to="/dashboard">Dashboard</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/attendance">Attendance</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/leaves">Leaves</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/announcements">Announcements</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/trainings">Training</NavLink></li>
              {isLead && <li className="nav-item"><NavLink className="nav-link" to="/requests">Leave Requests</NavLink></li>}
              {user.role === 'hr' && <li className="nav-item"><NavLink className="nav-link" to="/users">Manage Users</NavLink></li>}
            </ul>
          )}
          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                <li className="nav-item"><NavLink className="nav-link" to="/profile">{user.name} ({user.role})</NavLink></li>
                <li className="nav-item">
                  <button className="btn btn-sm btn-light ms-2 mt-1" onClick={() => { logout(); nav('/login'); }}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item"><NavLink className="nav-link" to="/login">Login</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/register">Register</NavLink></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
