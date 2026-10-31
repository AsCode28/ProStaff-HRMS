import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';

const badge = { pending: 'warning', approved: 'success', rejected: 'danger' };
const empty = { type: 'casual', from: '', to: '', reason: '' };

export default function Leaves() {
  const [list, setList] = useState([]);
  const [f, setF] = useState(empty);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const load = () => api.get('/leaves/me').then((r) => setList(r.data));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/leaves', f);
      setF(empty);
      setMsg({ type: 'success', text: 'Leave request submitted' });
      load();
    } catch (x) { setMsg({ type: 'danger', text: errMsg(x) }); }
  };

  return (
    <div className="row">
      <div className="col-md-4 mb-4">
        <div className="card p-3 shadow-sm">
          <h5>Apply for leave</h5>
          {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
          <form onSubmit={submit}>
            <select className="form-select mb-2" value={f.type} onChange={set('type')}>
              <option value="casual">Casual</option>
              <option value="sick">Sick</option>
              <option value="earned">Earned</option>
              <option value="unpaid">Unpaid</option>
            </select>
            <label className="form-label mb-0">From</label>
            <input type="date" className="form-control mb-2" required value={f.from} onChange={set('from')} />
            <label className="form-label mb-0">To</label>
            <input type="date" className="form-control mb-2" required value={f.to} onChange={set('to')} />
            <textarea className="form-control mb-2" rows={2} placeholder="Reason" value={f.reason} onChange={set('reason')} />
            <button className="btn btn-primary w-100">Submit</button>
          </form>
        </div>
      </div>
      <div className="col-md-8">
        <h5>My leave status</h5>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead><tr><th>Type</th><th>From</th><th>To</th><th>Reason</th><th>Status</th></tr></thead>
            <tbody>
              {list.map((l) => (
                <tr key={l._id}>
                  <td>{l.type}</td>
                  <td>{l.from?.slice(0, 10)}</td>
                  <td>{l.to?.slice(0, 10)}</td>
                  <td>{l.reason}</td>
                  <td><span className={`badge bg-${badge[l.status]}`}>{l.status}</span></td>
                </tr>
              ))}
              {!list.length && <tr><td colSpan="5" className="text-center text-muted">No leave requests</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
