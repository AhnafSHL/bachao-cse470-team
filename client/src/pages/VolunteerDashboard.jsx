import { useEffect, useState, useCallback } from 'react';
import RequestCard from '../components/RequestCard.jsx';
import { requestApi, volunteerApi } from '../services/api.js';
import { useLang } from '../context/LangContext.jsx';

export default function VolunteerDashboard() {
  const { t } = useLang();
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState([]);
  const [logs, setLogs] = useState([]);
  const [msg, setMsg] = useState('');
  const [dist, setDist] = useState({ request: '', itemsGiven: '', quantity: 1, peopleHelped: 0, area: '' });

  const load = useCallback(async () => {
    try {
      const [tRes, oRes, lRes] = await Promise.all([
        volunteerApi.tasks(),
        requestApi.list({ status: 'open' }),
        volunteerApi.distributions({ mine: true }),
      ]);
      setTasks(tRes.data);
      setOpen(oRes.data);
      setLogs(lRes.data);
    } catch (err) {
      setMsg(err.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const claim = async (id) => {
    try {
      await volunteerApi.claim(id);
      setMsg('Claimed! It moved to your active tasks.');
      load();
    } catch (err) {
      setMsg(err.message);
    }
  };

  const setStatus = async (id, status) => {
    try {
      await volunteerApi.setStatus(id, status);
      setMsg(`Marked ${status}.`);
      load();
    } catch (err) {
      setMsg(err.message);
    }
  };

  const logDistribution = async (e) => {
    e.preventDefault();
    try {
      await volunteerApi.logDistribution({
        ...dist,
        request: dist.request || undefined,
        quantity: Number(dist.quantity),
        peopleHelped: Number(dist.peopleHelped),
      });
      setMsg('Distribution logged.');
      setDist({ request: '', itemsGiven: '', quantity: 1, peopleHelped: 0, area: '' });
      load();
    } catch (err) {
      setMsg(err.message);
    }
  };

  const active = tasks.filter((tk) => tk.status !== 'closed');
  const completed = tasks.filter((tk) => tk.status === 'closed');

  return (
    <div className="container">
      <h1 className="page-title">{t('volunteer')} Dashboard</h1>
      <p className="page-sub">Claim requests, advance their status, and log what you deliver.</p>
      {msg && <div className="alert alert-info" onClick={() => setMsg('')}>{msg}</div>}

      <h3>My active tasks ({active.length})</h3>
      <div className="grid grid-2">
        {active.map((r) => (
          <RequestCard
            key={r._id}
            request={r}
            actions={
              <div className="row">
                {r.status === 'claimed' && (
                  <button className="btn btn-sm btn-success" onClick={() => setStatus(r._id, 'fulfilled')}>
                    Mark fulfilled →
                  </button>
                )}
                {r.status === 'fulfilled' && (
                  <span className="muted">Waiting for the citizen to confirm & rate.</span>
                )}
              </div>
            }
          />
        ))}
        {!active.length && <div className="empty">No active tasks. Claim an open request below.</div>}
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.3fr 1fr', marginTop: 24, alignItems: 'start' }}>
        <div>
          <h3>Open requests ({open.length})</h3>
          <div className="grid">
            {open.map((r) => (
              <RequestCard
                key={r._id}
                request={r}
                actions={
                  <button className="btn btn-sm btn-success" onClick={() => claim(r._id)}>{t('claim')}</button>
                }
              />
            ))}
            {!open.length && <div className="empty">No open requests right now.</div>}
          </div>
        </div>

        <div>
          <h3>Log a distribution</h3>
          <form className="card" onSubmit={logDistribution}>
            <label>Linked request (optional)</label>
            <select value={dist.request} onChange={(e) => setDist({ ...dist, request: e.target.value })}>
              <option value="">— none —</option>
              {tasks.map((tk) => (
                <option key={tk._id} value={tk._id}>
                  {tk.needType} · {tk.location?.district}
                </option>
              ))}
            </select>
            <label>Items given</label>
            <input
              value={dist.itemsGiven}
              onChange={(e) => setDist({ ...dist, itemsGiven: e.target.value })}
              placeholder="e.g. Rice, Water"
              required
            />
            <div className="row">
              <div style={{ flex: 1 }}>
                <label>Quantity</label>
                <input type="number" min={1} value={dist.quantity} onChange={(e) => setDist({ ...dist, quantity: e.target.value })} />
              </div>
              <div style={{ flex: 1 }}>
                <label>People helped</label>
                <input type="number" min={0} value={dist.peopleHelped} onChange={(e) => setDist({ ...dist, peopleHelped: e.target.value })} />
              </div>
            </div>
            <label>Area</label>
            <input value={dist.area} onChange={(e) => setDist({ ...dist, area: e.target.value })} placeholder="District / locality" />
            <button className="btn btn-block" style={{ marginTop: 12 }}>Log distribution</button>
          </form>

          <h3 style={{ marginTop: 18 }}>Distribution history</h3>
          <div className="card">
            {logs.length ? (
              <ul className="list-clean">
                {logs.map((l) => (
                  <li key={l._id} style={{ padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                    <b>{l.itemsGiven}</b> ×{l.quantity}
                    {l.peopleHelped ? ` · ${l.peopleHelped} helped` : ''} {l.area ? `· ${l.area}` : ''}
                    <div className="muted" style={{ fontSize: '0.78rem' }}>{new Date(l.createdAt).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="muted">No distributions logged yet.</div>
            )}
          </div>
        </div>
      </div>

      {completed.length > 0 && (
        <>
          <h3 style={{ marginTop: 24 }}>Completed ({completed.length})</h3>
          <div className="grid grid-2">
            {completed.map((r) => <RequestCard key={r._id} request={r} />)}
          </div>
        </>
      )}
    </div>
  );
}
