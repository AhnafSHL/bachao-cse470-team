import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RequestCard from '../components/RequestCard.jsx';
import { requestApi } from '../services/api.js';

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    requestApi
      .mine()
      .then((res) => setRequests(res.data))
      .catch((err) => setMsg(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner">Loading your requests…</div>;

  return (
    <div className="container">
      <div className="spread">
        <h1 className="page-title">My Requests</h1>
        <Link to="/post" className="btn">+ Post Request</Link>
      </div>

      {msg && <div className="alert alert-info" onClick={() => setMsg('')}>{msg}</div>}

      {!requests.length ? (
        <div className="empty">You haven't posted any requests yet.</div>
      ) : (
        <div className="grid grid-2" style={{ marginTop: 12 }}>
          {requests.map((r) => (
            <RequestCard key={r._id} request={r} />
          ))}
        </div>
      )}
    </div>
  );
}
