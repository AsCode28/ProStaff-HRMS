import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { errMsg } from '../api';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try { await login(f.email, f.password); nav('/dashboard'); }
    catch (x) { setErr(errMsg(x)); }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <div className="card p-4 shadow-sm">
          <h3 className="mb-3">Login</h3>
          {err && <div className="alert alert-danger">{err}</div>}
          <form onSubmit={submit}>
            <input className="form-control mb-3" type="email" placeholder="Email" required
              value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
            <input className="form-control mb-3" type="password" placeholder="Password" required
              value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
            <button className="btn btn-primary w-100">Login</button>
          </form>
          <p className="mt-3 mb-0">New here? <Link to="/register">Register</Link></p>
        </div>
      </div>
    </div>
  );
}
