import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import MapView from '../components/MapView.jsx';
import { requestApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { NEED_TYPES, URGENCIES, DISTRICTS, DISTRICT_NAMES, NEED_COLORS, BD_CENTER } from '../constants.js';

export default function Home() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [filters, setFilters] = useState({ needType: '', urgency: '', district: '' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => v && (params[k] = v));
      const { data } = await requestApi.list(params);
      setRequests(data);
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const points = requests
    .filter((r) => Array.isArray(r.location?.coords) && r.location.coords.length === 2)
    .map((r) => ({
      id: r._id,
      lat: r.location.coords[1],
      lng: r.location.coords[0],
      color: r.urgency === 'sos' ? '#dc3545' : NEED_COLORS[r.needType] || '#0d6efd',
      radius: r.urgency === 'sos' ? 13 : 9,
      popup: (
        <div style={{ minWidth: 180 }}>
          <b style={{ textTransform: 'capitalize' }}>{r.needType}</b>{' '}
          <span className={`badge badge-${r.urgency}`}>{r.urgency === 'sos' ? 'SOS' : r.urgency}</span>
          <br />
          {r.description && <span>{r.description}<br /></span>}
          <span className="muted">👥 {r.peopleAffected} · 📍 {r.location.district}</span>
          <br />
          <span className={`badge badge-${r.status}`}>{r.status}</span>
        </div>
      ),
    }));

  const center = filters.district
    ? [DISTRICTS[filters.district][1], DISTRICTS[filters.district][0]]
    : BD_CENTER;

  return (
    <div className="container">
      <div className="spread" style={{ marginBottom: 6 }}>
        <div>
          <h1 className="page-title">Live Relief Map</h1>
          <p className="page-sub">See active help requests and filter them by need, urgency, or district.</p>
        </div>
        {user ? (
          <Link to="/post" className="btn">+ Post Request</Link>
        ) : (
          <Link to="/register" className="btn">Register</Link>
        )}
      </div>

      {msg && <div className="alert alert-info" onClick={() => setMsg('')}>{msg}</div>}

      <div className="card" style={{ marginBottom: 14 }}>
        <div className="row">
          <div>
            <label>Need type</label>
            <select value={filters.needType} onChange={(e) => setFilters({ ...filters, needType: e.target.value })}>
              <option value="">All</option>
              {NEED_TYPES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <div>
            <label>Urgency</label>
            <select value={filters.urgency} onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}>
              <option value="">All</option>
              {URGENCIES.map((u) => <option key={u} value={u}>{u === 'sos' ? 'SOS' : u}</option>)}
            </select>
          </div>

          <div>
            <label>District</label>
            <select value={filters.district} onChange={(e) => setFilters({ ...filters, district: e.target.value })}>
              <option value="">All</option>
              {DISTRICT_NAMES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </div>

      <MapView points={points} center={center} zoom={filters.district ? 10 : 7} />

      <h3 style={{ marginTop: 20 }}>
        {loading ? 'Loading…' : `${requests.length} active request${requests.length === 1 ? '' : 's'}`}
      </h3>

      <div className="grid grid-2">
        {requests.map((r) => (
          <div className="card" key={r._id}>
            <div className="spread">
              <b style={{ textTransform: 'capitalize', color: NEED_COLORS[r.needType] }}>{r.needType}</b>
              <span className={`badge badge-${r.status}`}>{r.status}</span>
            </div>
            <div className="row" style={{ margin: '6px 0', gap: 6 }}>
              <span className={`badge badge-${r.urgency}`}>{r.urgency === 'sos' ? 'SOS' : r.urgency}</span>
              <span className="muted">👥 {r.peopleAffected}</span>
              <span className="muted">📍 {r.location?.district}</span>
            </div>
            {r.description && <p style={{ margin: '4px 0' }}>{r.description}</p>}
          </div>
        ))}
        {!loading && !requests.length && <div className="empty">No requests match these filters.</div>}
      </div>
    </div>
  );
}
