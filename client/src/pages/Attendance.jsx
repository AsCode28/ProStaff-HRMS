import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../AuthContext';

const fmt = (d) => (d ? new Date(d).toLocaleTimeString() : '-');

export default function Attendance() {
  const { user } = useAuth();
  const [mine, setMine] = useState([]);
  const [team, setTeam] = useState([]);
  const [msg, setMsg] = useState('');
  const lead = user.role !== 'employee';

  const load = () => {
    api.get('/attendance/me').then((r) => setMine(r.data));
    if (lead) api.get('/attendance/team').then((r) => setTeam(r.data));
  };
  useEffect(load, []);

  const act = async (path) => {
    try { await api.post(`/attendance/${path}`); setMsg(''); load(); }
    catch (x) { setMsg(errMsg(x)); }
  };

  return (
    <>
      <h3>Attendance</h3>
      {msg && <div className="alert alert-warning">{msg}</div>}
      <div className="mb-3">
        <button className="btn btn-success me-2" onClick={() => act('checkin')}>Check In</button>
        <button className="btn btn-danger" onClick={() => act('checkout')}>Check Out</button>
      </div>
      <h5>My records</h5>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead><tr><th>Date</th><th>In</th><th>Out</th><th>Status</th></tr></thead>
          <tbody>
            {mine.map((a) => (
              <tr key={a._id}><td>{a.date}</td><td>{fmt(a.checkIn)}</td><td>{fmt(a.checkOut)}</td><td>{a.status}</td></tr>
            ))}
            {!mine.length && <tr><td colSpan="4" className="text-center text-muted">No records yet</td></tr>}
          </tbody>
        </table>
      </div>
      {lead && (
        <>
          <h5 className="mt-4">{user.role === 'hr' ? 'All employees' : 'My team'}</h5>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead><tr><th>Name</th><th>Date</th><th>In</th><th>Out</th></tr></thead>
              <tbody>
                {team.map((a) => (
                  <tr key={a._id}><td>{a.user?.name}</td><td>{a.date}</td><td>{fmt(a.checkIn)}</td><td>{fmt(a.checkOut)}</td></tr>
                ))}
                {!team.length && <tr><td colSpan="4" className="text-center text-muted">No records</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
