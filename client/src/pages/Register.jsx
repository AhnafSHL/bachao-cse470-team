import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { DISTRICTS, DISTRICT_NAMES } from '../constants.js';

const ROLES = [
  { value: 'citizen', label: 'Citizen (need help)' },
  { value: 'volunteer', label: 'Volunteer (give help)' },
  { value: 'donor', label: 'Donor (fund relief)' },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'citizen',
    district: 'Dhaka',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        role: form.role,
        location: { district: form.district, coords: DISTRICTS[form.district] },
      });
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container">
      <div className="card form-narrow" style={{ margin: '24px auto' }}>
        <h2 className="page-title">Create your account</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={submit}>
          <label>Full name</label>
          <input value={form.name} onChange={set('name')} required />

          <label>Email</label>
          <input type="email" value={form.email} onChange={set('email')} required />

          <label>Password (min 6 chars)</label>
          <input type="password" value={form.password} onChange={set('password')} required minLength={6} />

          <label>Phone</label>
          <input value={form.phone} onChange={set('phone')} placeholder="01XXXXXXXXX" />

          <div className="row">
            <div style={{ flex: 1 }}>
              <label>I am a…</label>
              <select value={form.role} onChange={set('role')}>
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label>District</label>
              <select value={form.district} onChange={set('district')}>
                {DISTRICT_NAMES.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <button className="btn btn-block" style={{ marginTop: 16 }} disabled={busy}>
            {busy ? 'Creating…' : 'Register'}
          </button>
        </form>
        <p className="muted" style={{ marginTop: 14 }}>
          Already registered? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
