import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const load = () => api.get('/users').then((r) => setUsers(r.data));
  useEffect(() => { load(); }, []);

  const managers = users.filter((u) => u.role === 'manager');
  const edit = (id, k, v) => setUsers(users.map((u) => (u._id === id ? { ...u, [k]: v } : u)));

  const save = async (u) => {
    try {
      await api.put(`/users/${u._id}`, {
        name: u.name, role: u.role, department: u.department,
        manager: u.manager?._id || u.manager || null,
      });
      setMsg({ type: 'success', text: `${u.name} updated` });
      load();
    } catch (x) { setMsg({ type: 'danger', text: errMsg(x) }); }
  };

  const remove = async (u) => {
    if (!window.confirm(`Delete ${u.name}?`)) return;
    try { await api.delete(`/users/${u._id}`); load(); }
    catch (x) { setMsg({ type: 'danger', text: errMsg(x) }); }
  };

  return (
    <>
      <h3>Manage Employees and Managers</h3>
      {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead><tr><th>Name</th><th>Email</th><th>Department</th><th>Role</th><th>Manager</th><th></th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td><input className="form-control form-control-sm" value={u.department || ''} onChange={(e) => edit(u._id, 'department', e.target.value)} /></td>
                <td>
                  <select className="form-select form-select-sm" value={u.role} onChange={(e) => edit(u._id, 'role', e.target.value)}>
                    <option value="employee">employee</option>
                    <option value="manager">manager</option>
                    <option value="hr">hr</option>
                  </select>
                </td>
                <td>
                  <select className="form-select form-select-sm" value={u.manager?._id || u.manager || ''} onChange={(e) => edit(u._id, 'manager', e.target.value)}>
                    <option value="">None</option>
                    {managers.filter((m) => m._id !== u._id).map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
                  </select>
                </td>
                <td className="text-nowrap">
                  <button className="btn btn-sm btn-primary me-1" onClick={() => save(u)}>Save</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => remove(u)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
