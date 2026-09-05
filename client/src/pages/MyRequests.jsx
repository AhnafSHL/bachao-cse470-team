import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RequestCard from '../components/RequestCard.jsx';
import { requestApi, ratingApi } from '../services/api.js';
import { useLang } from '../context/LangContext.jsx';

// Simple star picker.
function Stars({ value, onChange }) {
  return (
    <div style={{ fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} onClick={() => onChange(s)} style={{ color: s <= value ? '#f5b301' : '#d1d5db' }}>★</span>
      ))}
    </div>
  );
}

export default function MyRequests() {
  const { t } = useLang();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [rating, setRating] = useState({}); // requestId -> { stars, comment }

  const load = () => {
    setLoading(true);
    requestApi
      .mine()
      .then((res) => setRequests(res.data))
      .catch((err) => setMsg(err.message))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
  }, []);

  const submitRating = async (id) => {
    const r = rating[id] || {};
    if (!r.stars) {
      setMsg('Please pick a star rating first.');
      return;
    }
    try {
      await ratingApi.confirmAndRate({ requestId: id, stars: r.stars, comment: r.comment || '' });
      setMsg('Thanks! Help confirmed and your volunteer was rated.');
      load();
    } catch (err) {
      setMsg(err.message);
    }
  };

  if (loading) return <div className="spinner">Loading your requests…</div>;

  return (
    <div className="container">
      <div className="spread">
        <h1 className="page-title">{t('myRequests')}</h1>
        <Link to="/post" className="btn">+ {t('postRequest')}</Link>
      </div>
      {msg && <div className="alert alert-info" onClick={() => setMsg('')}>{msg}</div>}

      {!requests.length ? (
        <div className="empty">You haven't posted any requests yet.</div>
      ) : (
        <div className="grid grid-2" style={{ marginTop: 12 }}>
          {requests.map((r) => (
            <RequestCard
              key={r._id}
              request={r}
              footer={
                r.status === 'fulfilled' && !r.confirmedByCitizen ? (
                  <div className="card" style={{ marginTop: 12, background: '#f8fafc' }}>
                    <b>Confirm help & rate {r.claimedBy?.name || 'your volunteer'}</b>
                    <Stars
                      value={rating[r._id]?.stars || 0}
                      onChange={(s) => setRating({ ...rating, [r._id]: { ...rating[r._id], stars: s } })}
                    />
                    <input
                      placeholder="Comment (optional)"
                      value={rating[r._id]?.comment || ''}
                      onChange={(e) => setRating({ ...rating, [r._id]: { ...rating[r._id], comment: e.target.value } })}
                      style={{ marginTop: 8 }}
                    />
                    <button className="btn btn-success btn-sm" style={{ marginTop: 8 }} onClick={() => submitRating(r._id)}>
                      ✔ Confirm & submit rating
                    </button>
                  </div>
                ) : r.status === 'closed' ? (
                  <div className="alert alert-success" style={{ marginTop: 10 }}>✔ Completed & confirmed.</div>
                ) : null
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
