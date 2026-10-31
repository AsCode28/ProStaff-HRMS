import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { errMsg } from '../api';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '', department: '' });
  const [err, setErr] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try { await register(f); nav('/dashboard'); }
    catch (x) { setErr(errMsg(x)); }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <div className="card p-4 shadow-sm">
          <h3 className="mb-3">Register</h3>
          {err && <div className="alert alert-danger">{err}</div>}
          <form onSubmit={submit}>
            <input className="form-control mb-3" placeholder="Full name" required value={f.name} onChange={set('name')} />
            <input className="form-control mb-3" type="email" placeholder="Email" required value={f.email} onChange={set('email')} />
            <input className="form-control mb-3" type="password" placeholder="Password (min 6)" minLength={6} required value={f.password} onChange={set('password')} />
            <input className="form-control mb-3" placeholder="Department" value={f.department} onChange={set('department')} />
            <button className="btn btn-primary w-100">Create account</button>
          </form>
          <p className="mt-3 mb-0">Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
}
