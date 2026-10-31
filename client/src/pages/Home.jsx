import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="text-center py-5">
      <h1 className="display-5">Human Resource Management System</h1>
      <p className="lead text-muted">Attendance, leaves, announcements and training in one place.</p>
      {user ? (
        <Link to="/dashboard" className="btn btn-primary btn-lg">Go to Dashboard</Link>
      ) : (
        <>
          <Link to="/login" className="btn btn-primary btn-lg me-2">Login</Link>
          <Link to="/register" className="btn btn-outline-primary btn-lg">Register</Link>
        </>
      )}
    </div>
  );
}
