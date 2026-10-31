import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../AuthContext';

export default function Trainings() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [f, setF] = useState({ title: '', description: '', date: '' });
  const [err, setErr] = useState('');
  const canCreate = user.role !== 'employee';

  const load = () => api.get('/trainings').then((r) => setList(r.data));
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    try { await api.post('/trainings', f); setF({ title: '', description: '', date: '' }); setErr(''); load(); }
    catch (x) { setErr(errMsg(x)); }
  };

  const enroll = async (id) => {
    try { await api.post(`/trainings/${id}/enroll`); load(); }
    catch (x) { setErr(errMsg(x)); }
  };

  return (
    <>
      <h3>Training Programs</h3>
      {err && <div className="alert alert-danger">{err}</div>}
      {canCreate && (
        <form onSubmit={create} className="card p-3 mb-4 shadow-sm">
          <input className="form-control mb-2" placeholder="Title" required value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
          <textarea className="form-control mb-2" rows={2} placeholder="Description" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
          <input type="date" className="form-control mb-2" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} />
          <button className="btn btn-primary align-self-start">Create program</button>
        </form>
      )}
      <div className="row">
        {list.map((t) => {
          const joined = t.participants?.includes(user.id);
          return (
            <div className="col-md-6 mb-3" key={t._id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5>{t.title}</h5>
                  <p>{t.description}</p>
                  <small className="text-muted d-block mb-2">
                    {t.date ? new Date(t.date).toLocaleDateString() : 'Date TBD'} | {t.participants?.length || 0} enrolled
                  </small>
                  <button className="btn btn-sm btn-outline-primary" disabled={joined} onClick={() => enroll(t._id)}>
                    {joined ? 'Enrolled' : 'Enroll'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {!list.length && <p className="text-muted">No training programs yet.</p>}
    </>
  );
}
