import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';

export default function Profile() {
  const [f, setF] = useState({ name: '', phone: '', address: '' });
  const [info, setInfo] = useState({});
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    api.get('/auth/me').then((r) => {
      setInfo(r.data);
      setF({ name: r.data.name || '', phone: r.data.phone || '', address: r.data.address || '' });
    });
  }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/me', f);
      const u = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({ ...u, name: f.name }));
      setMsg({ type: 'success', text: 'Profile updated' });
    } catch (x) { setMsg({ type: 'danger', text: errMsg(x) }); }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card p-4 shadow-sm">
          <h3>My Profile</h3>
          <p className="text-muted mb-3">{info.email} | {info.role} | {info.department || 'No department'}</p>
          {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
          <form onSubmit={save}>
            <label className="form-label">Name</label>
            <input className="form-control mb-3" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
            <label className="form-label">Phone</label>
            <input className="form-control mb-3" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
            <label className="form-label">Address</label>
            <textarea className="form-control mb-3" rows={2} value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} />
            <button className="btn btn-primary">Save</button>
          </form>
        </div>
      </div>
    </div>
  );
}
