import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../AuthContext';

const Card = ({ title, value, to, color = 'primary' }) => (
  <div className="col-md-4 mb-3">
    <div className={`card border-${color} h-100`}>
      <div className="card-body">
        <h6 className="text-muted">{title}</h6>
        <h2 className={`text-${color}`}>{value}</h2>
        {to && <Link to={to}>View</Link>}
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [d, setD] = useState({});

  useEffect(() => {
    const get = (url) => api.get(url).then((r) => r.data).catch(() => []);
    (async () => {
      const [att, leaves, ann, tr] = await Promise.all([
        get('/attendance/me'), get('/leaves/me'), get('/announcements'), get('/trainings'),
      ]);
      const data = { att, leaves, ann, tr };
      if (user.role !== 'employee') data.pending = await get('/leaves/pending');
      if (user.role === 'manager') data.team = await get('/users/team');
      if (user.role === 'hr') data.users = await get('/users');
      setD(data);
    })();
  }, [user.role]);

  const today = new Date().toISOString().slice(0, 10);
  const todayRec = (d.att || []).find((a) => a.date === today);
  const myPending = (d.leaves || []).filter((l) => l.status === 'pending').length;

  return (
    <>
      <h3 className="mb-1">{user.role.toUpperCase()} Dashboard</h3>
      <p className="text-muted">Welcome, {user.name}</p>
      <div className="row">
        <Card title="Today's attendance" value={todayRec ? (todayRec.checkOut ? 'Checked out' : 'Checked in') : 'Not marked'} to="/attendance" color={todayRec ? 'success' : 'warning'} />
        <Card title="My pending leaves" value={myPending} to="/leaves" />
        <Card title="Announcements" value={(d.ann || []).length} to="/announcements" color="info" />
        <Card title="Training programs" value={(d.tr || []).length} to="/trainings" color="secondary" />
        {user.role !== 'employee' && <Card title="Leave requests awaiting review" value={(d.pending || []).length} to="/requests" color="danger" />}
        {user.role === 'manager' && <Card title="My team size" value={(d.team || []).length} color="success" />}
        {user.role === 'hr' && <Card title="Total employees" value={(d.users || []).length} to="/users" color="success" />}
      </div>
      {(d.ann || []).length > 0 && (
        <div className="card mt-3">
          <div className="card-header">Latest announcement</div>
          <div className="card-body">
            <h5>{d.ann[0].title}</h5>
            <p className="mb-0">{d.ann[0].body}</p>
          </div>
        </div>
      )}
    </>
  );
}
