import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../AuthContext';

export default function Announcements() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [f, setF] = useState({ title: '', body: '' });
  const [err, setErr] = useState('');
  const canPost = user.role !== 'employee';

  const load = () => api.get('/announcements').then((r) => setList(r.data));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try { await api.post('/announcements', f); setF({ title: '', body: '' }); setErr(''); load(); }
    catch (x) { setErr(errMsg(x)); }
  };

  return (
    <>
      <h3>Announcements</h3>
      {canPost && (
        <form onSubmit={submit} className="card p-3 mb-4 shadow-sm">
          {err && <div className="alert alert-danger">{err}</div>}
          <input className="form-control mb-2" placeholder="Title" required value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
          <textarea className="form-control mb-2" rows={3} placeholder="Message" required value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} />
          <button className="btn btn-primary align-self-start">Post</button>
        </form>
      )}
      {list.map((a) => (
        <div className="card mb-3" key={a._id}>
          <div className="card-body">
            <h5 className="card-title">{a.title}</h5>
            <p className="card-text">{a.body}</p>
            <small className="text-muted">{a.createdBy?.name} | {new Date(a.createdAt).toLocaleDateString()}</small>
          </div>
        </div>
      ))}
      {!list.length && <p className="text-muted">No announcements yet.</p>}
    </>
  );
}
