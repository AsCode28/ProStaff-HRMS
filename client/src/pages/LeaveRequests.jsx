import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';

export default function LeaveRequests() {
  const [list, setList] = useState([]);
  const [msg, setMsg] = useState('');

  const load = () => api.get('/leaves/pending').then((r) => setList(r.data));
  useEffect(() => { load(); }, []);

  const review = async (id, status) => {
    try { await api.put(`/leaves/${id}/status`, { status }); setMsg(''); load(); }
    catch (x) { setMsg(errMsg(x)); }
  };

  return (
    <>
      <h3>Pending Leave Requests</h3>
      {msg && <div className="alert alert-danger">{msg}</div>}
      <div className="table-responsive">
        <table className="table table-striped">
          <thead><tr><th>Employee</th><th>Type</th><th>From</th><th>To</th><th>Reason</th><th>Action</th></tr></thead>
          <tbody>
            {list.map((l) => (
              <tr key={l._id}>
                <td>{l.user?.name}</td>
                <td>{l.type}</td>
                <td>{l.from?.slice(0, 10)}</td>
                <td>{l.to?.slice(0, 10)}</td>
                <td>{l.reason}</td>
                <td>
                  <button className="btn btn-sm btn-success me-1" onClick={() => review(l._id, 'approved')}>Approve</button>
                  <button className="btn btn-sm btn-danger" onClick={() => review(l._id, 'rejected')}>Reject</button>
                </td>
              </tr>
            ))}
            {!list.length && <tr><td colSpan="6" className="text-center text-muted">Nothing pending</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
