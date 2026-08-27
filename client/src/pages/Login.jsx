import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(form);
      navigate(location.state?.from || '/');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container">
      <div className="card form-narrow" style={{ margin: '30px auto' }}>
        <h2 className="page-title">Login</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={submit}>
          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button className="btn btn-block" style={{ marginTop: 16 }} disabled={busy}>
            {busy ? 'Signing in…' : 'Login'}
          </button>
        </form>
        <p className="muted" style={{ marginTop: 14 }}>
          No account? <Link to="/register">Register</Link>
        </p>
        <div className="alert alert-info" style={{ marginTop: 10 }}>
          Demo: <b>admin@bachao.org</b> / <b>hasan@example.com</b> (volunteer) / <b>karim@example.com</b> (citizen) — password <b>password123</b>
        </div>
      </div>
    </div>
  );
}
