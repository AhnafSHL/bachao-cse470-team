import { NEED_COLORS } from '../constants.js';

export default function RequestCard({
  request: r,
  actions = null,
  footer = null,
}) {
  const color = NEED_COLORS[r.needType] || '#0d6efd';

  return (
    <div className="card">
      <div className="spread">
        <span style={{ fontWeight: 700, textTransform: 'capitalize', color }}>
          {r.needType}
        </span>
        <span className={`badge badge-${r.status}`}>{r.status}</span>
      </div>

      <div className="row" style={{ margin: '8px 0', gap: 6 }}>
        <span className={`badge badge-${r.urgency}`}>{r.urgency === 'sos' ? 'SOS' : r.urgency}</span>
        <span className="muted">👥 {r.peopleAffected}</span>
        <span className="muted">📍 {r.location?.district || '—'}{r.location?.upazila ? `, ${r.location.upazila}` : ''}</span>
      </div>

      {r.description && <p style={{ margin: '6px 0' }}>{r.description}</p>}

      <div className="muted" style={{ fontSize: '0.82rem' }}>
        {r.createdBy?.name && <>By {r.createdBy.name} · </>}
        {new Date(r.createdAt).toLocaleString()}
      </div>
      {r.claimedBy && (
        <div
          className="muted"
          style={{ fontSize: '0.82rem', marginTop: 4 }}
        >
          🙋 Claimed by <b>{r.claimedBy.name}</b>
          {r.claimedBy.ratingAvg ? ` (★ ${r.claimedBy.ratingAvg})` : ''}
        </div>
      )}

      {actions && <div style={{ marginTop: 12 }}>{actions}</div>}
      {footer}
    </div>
  );
}
