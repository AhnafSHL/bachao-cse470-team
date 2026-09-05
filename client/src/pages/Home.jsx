import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import MapView from '../components/MapView.jsx';
import { requestApi, volunteerApi, reportApi, dashboardApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLang } from '../context/LangContext.jsx';
import { NEED_TYPES, URGENCIES, DISTRICTS, DISTRICT_NAMES, NEED_COLORS, BD_CENTER } from '../constants.js';

export default function Home() {
  const { user } = useAuth();
  const { t } = useLang();
  const [requests, setRequests] = useState([]);
  const [heat, setHeat] = useState([]);
  const [showHeat, setShowHeat] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [filters, setFilters] = useState({ needType: '', urgency: '', district: '', status: '' });

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

  useEffect(() => {
    if (showHeat) dashboardApi.heatmap().then((res) => setHeat(res.data)).catch(() => {});
  }, [showHeat, requests]);

  const claim = async (id) => {
    try {
      await volunteerApi.claim(id);
      setMsg('Request claimed — check your Volunteer dashboard.');
      load();
    } catch (err) {
      setMsg(err.message);
    }
  };

  const report = async (id) => {
    const reason = window.prompt('Why are you flagging this request? (e.g. fake / duplicate)');
    if (!reason) return;
    try {
      await reportApi.create({ targetType: 'HelpRequest', targetId: id, reason });
      setMsg('Reported. An admin will review it.');
    } catch (err) {
      setMsg(err.message);
    }
  };

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
          <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {user?.role === 'volunteer' && r.status === 'open' && (
              <button className="btn btn-sm btn-success" onClick={() => claim(r._id)}>
                {t('claim')}
              </button>
            )}
            {user && (
              <button className="btn btn-sm btn-ghost" onClick={() => report(r._id)}>
                🚩 Flag
              </button>
            )}
          </div>
        </div>
      ),
    }));

  const center = filters.district ? [DISTRICTS[filters.district][1], DISTRICTS[filters.district][0]] : BD_CENTER;

  return (
    <div className="container">
      <div className="spread" style={{ marginBottom: 6 }}>
        <div>
          <h1 className="page-title">{t('home')}</h1>
          <p className="page-sub">{t('tagline')}</p>
        </div>
        {user ? (
          <Link to="/post" className="btn">+ {t('postRequest')}</Link>
        ) : (
          <Link to="/register" className="btn">{t('register')}</Link>
        )}
      </div>

      {msg && <div className="alert alert-info" onClick={() => setMsg('')}>{msg}</div>}

      <div className="card" style={{ marginBottom: 14 }}>
        <div className="row">
          <div>
            <label>{t('needType')}</label>
            <select value={filters.needType} onChange={(e) => setFilters({ ...filters, needType: e.target.value })}>
              <option value="">{t('all')}</option>
              {NEED_TYPES.map((n) => <option key={n} value={n}>{t(n)}</option>)}
            </select>
          </div>
          <div>
            <label>{t('urgency')}</label>
            <select value={filters.urgency} onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}>
              <option value="">{t('all')}</option>
              {URGENCIES.map((u) => <option key={u} value={u}>{u === 'sos' ? 'SOS' : t(u)}</option>)}
            </select>
          </div>
          <div>
            <label>{t('district')}</label>
            <select value={filters.district} onChange={(e) => setFilters({ ...filters, district: e.target.value })}>
              <option value="">{t('all')}</option>
              {DISTRICT_NAMES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label>{t('status')}</label>
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="">{t('all')} (active)</option>
              <option value="open">{t('open')}</option>
              <option value="claimed">{t('claimed')}</option>
              <option value="fulfilled">{t('fulfilled')}</option>
            </select>
          </div>
          <div style={{ alignSelf: 'flex-end' }}>
            <label style={{ visibility: 'hidden' }}>x</label>
            <label className="row" style={{ gap: 6, margin: 0, cursor: 'pointer' }}>
              <input type="checkbox" style={{ width: 'auto' }} checked={showHeat} onChange={(e) => setShowHeat(e.target.checked)} />
              <span>Unmet-needs heatmap</span>
            </label>
          </div>
        </div>
      </div>

      <MapView points={showHeat ? [] : points} heat={showHeat ? heat : null} center={center} zoom={filters.district ? 10 : 7} />

      <h3 style={{ marginTop: 20 }}>
        {loading ? 'Loading…' : `${requests.length} active request${requests.length === 1 ? '' : 's'}`}
      </h3>
      <div className="grid grid-2">
        {requests.map((r) => (
          <div className="card" key={r._id}>
            <div className="spread">
              <b style={{ textTransform: 'capitalize', color: NEED_COLORS[r.needType] }}>{t(r.needType)}</b>
              <span className={`badge badge-${r.status}`}>{t(r.status)}</span>
            </div>
            <div className="row" style={{ margin: '6px 0', gap: 6 }}>
              <span className={`badge badge-${r.urgency}`}>{r.urgency === 'sos' ? 'SOS' : t(r.urgency)}</span>
              <span className="muted">👥 {r.peopleAffected}</span>
              <span className="muted">📍 {r.location?.district}</span>
            </div>
            {r.description && <p style={{ margin: '4px 0' }}>{r.description}</p>}
            {user?.role === 'volunteer' && r.status === 'open' && (
              <button className="btn btn-sm btn-success" onClick={() => claim(r._id)} style={{ marginTop: 6 }}>
                {t('claim')}
              </button>
            )}
          </div>
        ))}
        {!loading && !requests.length && <div className="empty">No requests match these filters.</div>}
      </div>
    </div>
  );
}
