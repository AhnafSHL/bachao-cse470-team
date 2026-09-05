import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapView from '../components/MapView.jsx';
import { requestApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLang } from '../context/LangContext.jsx';
import { NEED_TYPES, URGENCIES, DISTRICTS, DISTRICT_NAMES } from '../constants.js';

export default function PostRequest() {
  const { user } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const startDistrict = user?.location?.district && DISTRICTS[user.location.district] ? user.location.district : 'Dhaka';
  const [district, setDistrict] = useState(startDistrict);
  const [picked, setPicked] = useState({
    lat: DISTRICTS[startDistrict][1],
    lng: DISTRICTS[startDistrict][0],
  });
  const [form, setForm] = useState({
    needType: 'food',
    urgency: 'normal',
    description: '',
    peopleAffected: 1,
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onDistrict = (e) => {
    const d = e.target.value;
    setDistrict(d);
    setPicked({ lat: DISTRICTS[d][1], lng: DISTRICTS[d][0] });
  };

  const buildLocation = () => ({
    district,
    upazila: '',
    coords: [picked.lng, picked.lat], // store as [lng, lat]
  });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await requestApi.create({ ...form, location: buildLocation() });
      navigate('/my-requests');
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  const sendSOS = async () => {
    setError('');
    setBusy(true);
    try {
      await requestApi.sos({
        location: buildLocation(),
        needType: form.needType,
        peopleAffected: form.peopleAffected,
        description: form.description,
      });
      navigate('/my-requests');
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">{t('postRequest')}</h1>
      <p className="page-sub">{t('clickMapToPin')}</p>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="grid" style={{ gridTemplateColumns: 'minmax(280px, 1fr) 1.4fr' }}>
        <form className="card" onSubmit={submit}>
          <label>{t('needType')}</label>
          <select value={form.needType} onChange={(e) => setForm({ ...form, needType: e.target.value })}>
            {NEED_TYPES.map((n) => <option key={n} value={n}>{t(n)}</option>)}
          </select>

          <label>{t('urgency')}</label>
          <select value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value })}>
            {URGENCIES.map((u) => <option key={u} value={u}>{u === 'sos' ? 'SOS' : t(u)}</option>)}
          </select>

          <label>{t('district')}</label>
          <select value={district} onChange={onDistrict}>
            {DISTRICT_NAMES.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>

          <label>{t('peopleAffected')}</label>
          <input
            type="number"
            min={1}
            value={form.peopleAffected}
            onChange={(e) => setForm({ ...form, peopleAffected: Number(e.target.value) })}
          />

          <label>{t('description')}</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe what you need…"
          />

          <div className="muted" style={{ margin: '8px 0' }}>
            📍 Pinned: {picked.lat.toFixed(4)}, {picked.lng.toFixed(4)}
          </div>

          <button className="btn btn-block" disabled={busy} style={{ marginTop: 6 }}>
            {busy ? 'Sending…' : t('submit')}
          </button>

          <div className="divider" />
          <p className="muted" style={{ marginTop: 0 }}>In immediate danger? Send a one-tap SOS:</p>
          <button type="button" className="btn btn-sos btn-block" disabled={busy} onClick={sendSOS}>
            🆘 {t('sos')} — Send urgent alert
          </button>
        </form>

        <div>
          <MapView
            points={[]}
            onPick={(lat, lng) => setPicked({ lat, lng })}
            picked={picked}
            center={[picked.lat, picked.lng]}
            zoom={11}
          />
        </div>
      </div>
    </div>
  );
}
