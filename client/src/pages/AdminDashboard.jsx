import { useEffect, useState, useMemo } from 'react';
import { adminApi, reportApi } from '../services/api.js';
import {
  NEED_TYPES,
  STATUSES,
  DISTRICT_NAMES,
} from '../constants.js';

const TABS = [
  'Reports',
  'Organizations',
  'Volunteers',
  'Requests',
];

export default function AdminDashboard() {
  const [tab, setTab] =
    useState('Reports');

  const [reports, setReports] =
    useState([]);

  const [orgs, setOrgs] =
    useState([]);

  const [users, setUsers] =
    useState([]);

  const [requests, setRequests] =
    useState([]);

  const [msg, setMsg] =
    useState('');

  const [query, setQuery] =
    useState('');

  const [
    reportStatus,
    setReportStatus,
  ] = useState('');

  const [
    reportTarget,
    setReportTarget,
  ] = useState('');

  const [
    orgStatus,
    setOrgStatus,
  ] = useState('');

  const [
    volStatus,
    setVolStatus,
  ] = useState('');

  const [
    reqStatus,
    setReqStatus,
  ] = useState('');

  const [
    reqNeed,
    setReqNeed,
  ] = useState('');

  const [
    reqDistrict,
    setReqDistrict,
  ] = useState('');

  const load = async () => {
    try {
      const [r, o, u, q] =
        await Promise.all([
          reportApi.list(),
          adminApi.orgs(),
          adminApi.users({
            role: 'volunteer',
          }),
          adminApi.requests(),
        ]);

      setReports(r.data);
      setOrgs(o.data);
      setUsers(u.data);
      setRequests(q.data);
    } catch (err) {
      setMsg(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const act = async (
    fn,
    ok
  ) => {
    try {
      await fn();
      setMsg(ok);
      load();
    } catch (err) {
      setMsg(err.message);
    }
  };

  const switchTab = (tb) => {
    setTab(tb);
    setQuery('');
    setReportStatus('');
    setReportTarget('');
    setOrgStatus('');
    setVolStatus('');
    setReqStatus('');
    setReqNeed('');
    setReqDistrict('');
  };

  const q =
    query
      .trim()
      .toLowerCase();

  const has = (...parts) =>
    !q ||
    parts
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(q);

  const filteredReports =
    useMemo(
      () =>
        reports.filter(
          (r) =>
            (!reportStatus ||
              r.status ===
                reportStatus) &&
            (!reportTarget ||
              r.targetType ===
                reportTarget) &&
            has(
              r.reason,
              r.reportedBy?.name,
              r.targetType
            )
        ),
      [
        reports,
        reportStatus,
        reportTarget,
        q,
      ]
    );

  const filteredOrgs =
    useMemo(
      () =>
        orgs.filter(
          (o) =>
            (!orgStatus ||
              (orgStatus ===
              'verified'
                ? o.isVerified
                : !o.isVerified)) &&
            has(
              o.name,
              o.owner?.name,
              o.areasServed?.join(
                ' '
              )
            )
        ),
      [orgs, orgStatus, q]
    );

  const filteredUsers =
    useMemo(
      () =>
        users.filter(
          (u) =>
            (!volStatus ||
              (volStatus ===
              'verified'
                ? u.isVerified
                : !u.isVerified)) &&
            has(
              u.name,
              u.email
            )
        ),
      [users, volStatus, q]
    );

  const filteredRequests =
    useMemo(
      () =>
        requests.filter(
          (r) =>
            (!reqStatus ||
              r.status ===
                reqStatus) &&
            (!reqNeed ||
              r.needType ===
                reqNeed) &&
            (!reqDistrict ||
              r.location
                ?.district ===
                reqDistrict) &&
            has(
              r.needType,
              r.location?.district,
              r.createdBy?.name,
              r.description
            )
        ),
      [
        requests,
        reqStatus,
        reqNeed,
        reqDistrict,
        q,
      ]
    );

  const pendingReports =
    reports.filter(
      (r) =>
        r.status === 'pending'
    ).length;

  const pendingOrgs =
    orgs.filter(
      (o) => !o.isVerified
    ).length;

  const counts = {
    Reports: [
      filteredReports.length,
      reports.length,
    ],

    Organizations: [
      filteredOrgs.length,
      orgs.length,
    ],

    Volunteers: [
      filteredUsers.length,
      users.length,
    ],

    Requests: [
      filteredRequests.length,
      requests.length,
    ],
  }[tab];

  const Sel = ({
    value,
    onChange,
    children,
  }) => (
    <select
      value={value}
      onChange={(e) =>
        onChange(
          e.target.value
        )
      }
      style={{
        width: 'auto',
      }}
    >
      {children}
    </select>
  );

  return (
    <div className="container">
      <h1 className="page-title">
        Admin Dashboard
      </h1>

      <p className="page-sub">
        Verify organizations &
        volunteers, and act on
        flagged content.
      </p>

      {msg && (
        <div
          className="alert alert-info"
          onClick={() =>
            setMsg('')
          }
        >
          {msg}
        </div>
      )}

      <div
        className="row"
        style={{
          marginBottom: 14,
        }}
      >
        {TABS.map((tb) => (
          <button
            key={tb}
            className={`btn btn-sm ${
              tab === tb
                ? ''
                : 'btn-ghost'
            }`}
            onClick={() =>
              switchTab(tb)
            }
          >
            {tb}

            {tb === 'Reports' &&
              pendingReports >
                0 && (
                <span className="notif-dot">
                  {pendingReports}
                </span>
              )}

            {tb ===
              'Organizations' &&
              pendingOrgs > 0 && (
                <span className="notif-dot">
                  {pendingOrgs}
                </span>
              )}
          </button>
        ))}
      </div>

      <div
        className="card"
        style={{
          marginBottom: 12,
        }}
      >
        <div
          className="row"
          style={{
            alignItems:
              'flex-end',
          }}
        >
          <div
            style={{
              flex: 2,
              minWidth: 200,
            }}
          >
            <label
              style={{
                marginTop: 0,
              }}
            >
              🔍 Search{' '}
              {tab.toLowerCase()}
            </label>

            <input
              value={query}
              onChange={(e) =>
                setQuery(
                  e.target.value
                )
              }
              placeholder={
                tab === 'Reports'
                  ? 'reason, reporter, target type…'
                  : tab ===
                    'Organizations'
                    ? 'name, owner, area…'
                    : tab ===
                      'Volunteers'
                      ? 'name or email…'
                      : 'need, district, requester…'
              }
            />
          </div>

          {tab === 'Reports' && (
            <>
              <div>
                <label
                  style={{
                    marginTop: 0,
                  }}
                >
                  Status
                </label>

                <Sel
                  value={
                    reportStatus
                  }
                  onChange={
                    setReportStatus
                  }
                >
                  <option value="">
                    All
                  </option>

                  <option value="pending">
                    Pending
                  </option>

                  <option value="reviewed">
                    Reviewed
                  </option>

                  <option value="dismissed">
                    Dismissed
                  </option>
                </Sel>
              </div>

              <div>
                <label
                  style={{
                    marginTop: 0,
                  }}
                >
                  Target type
                </label>

                <Sel
                  value={
                    reportTarget
                  }
                  onChange={
                    setReportTarget
                  }
                >
                  <option value="">
                    All
                  </option>

                  <option value="HelpRequest">
                    HelpRequest
                  </option>

                  <option value="Organization">
                    Organization
                  </option>

                  <option value="User">
                    User
                  </option>
                </Sel>
              </div>
            </>
          )}

          {tab ===
            'Organizations' && (
            <div>
              <label
                style={{
                  marginTop: 0,
                }}
              >
                Verification
              </label>

              <Sel
                value={orgStatus}
                onChange={
                  setOrgStatus
                }
              >
                <option value="">
                  All
                </option>

                <option value="verified">
                  Verified
                </option>

                <option value="pending">
                  Pending
                </option>
              </Sel>
            </div>
          )}

          {tab ===
            'Volunteers' && (
            <div>
              <label
                style={{
                  marginTop: 0,
                }}
              >
                Verification
              </label>

              <Sel
                value={volStatus}
                onChange={
                  setVolStatus
                }
              >
                <option value="">
                  All
                </option>

                <option value="verified">
                  Verified
                </option>

                <option value="unverified">
                  Unverified
                </option>
              </Sel>
            </div>
          )}

          {tab === 'Requests' && (
            <>
              <div>
                <label
                  style={{
                    marginTop: 0,
                  }}
                >
                  Status
                </label>

                <Sel
                  value={reqStatus}
                  onChange={
                    setReqStatus
                  }
                >
                  <option value="">
                    All
                  </option>

                  {STATUSES.map(
                    (s) => (
                      <option
                        key={s}
                        value={s}
                      >
                        {s}
                      </option>
                    )
                  )}
                </Sel>
              </div>

              <div>
                <label
                  style={{
                    marginTop: 0,
                  }}
                >
                  Need type
                </label>

                <Sel
                  value={reqNeed}
                  onChange={
                    setReqNeed
                  }
                >
                  <option value="">
                    All
                  </option>

                  {NEED_TYPES.map(
                    (n) => (
                      <option
                        key={n}
                        value={n}
                      >
                        {n}
                      </option>
                    )
                  )}
                </Sel>
              </div>

              <div>
                <label
                  style={{
                    marginTop: 0,
                  }}
                >
                  District
                </label>

                <Sel
                  value={
                    reqDistrict
                  }
                  onChange={
                    setReqDistrict
                  }
                >
                  <option value="">
                    All
                  </option>

                  {DISTRICT_NAMES.map(
                    (d) => (
                      <option
                        key={d}
                        value={d}
                      >
                        {d}
                      </option>
                    )
                  )}
                </Sel>
              </div>
            </>
          )}

          <div
            style={{
              marginLeft: 'auto',
            }}
          >
            <span
              className="muted"
              style={{
                whiteSpace:
                  'nowrap',
              }}
            >
              Showing{' '}
              <b>
                {counts[0]}
              </b>{' '}
              of {counts[1]}
            </span>
          </div>
        </div>
      </div>

      {tab === 'Reports' && (
        <div className="card table-card">
          <table className="table">
            <thead>
              <tr>
                <th>Target</th>
                <th>Reason</th>
                <th>By</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredReports.map(
                (r) => (
                  <tr key={r._id}>
                    <td>
                      {
                        r.targetType
                      }
                    </td>

                    <td>
                      {r.reason}
                    </td>

                    <td>
                      {
                        r.reportedBy
                          ?.name
                      }
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          r.status ===
                          'pending'
                            ? 'badge-claimed'
                            : 'badge-closed'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>

                    <td>
                      {r.status ===
                        'pending' && (
                        <div
                          className="row"
                          style={{
                            gap: 4,
                          }}
                        >
                          <button
                            className="btn btn-sm btn-ghost"
                            onClick={() =>
                              act(
                                () =>
                                  reportApi.resolve(
                                    r._id,
                                    'dismiss'
                                  ),
                                'Report dismissed.'
                              )
                            }
                          >
                            Dismiss
                          </button>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() =>
                              act(
                                () =>
                                  reportApi.resolve(
                                    r._id,
                                    'remove'
                                  ),
                                'Target removed.'
                              )
                            }
                          >
                            Remove target
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              )}

              {!filteredReports.length && (
                <tr>
                  <td
                    colSpan={5}
                    className="muted center"
                  >
                    No matching
                    reports.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab ===
        'Organizations' && (
        <div className="card table-card">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Owner</th>
                <th>Areas</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrgs.map(
                (o) => (
                  <tr key={o._id}>
                    <td>{o.name}</td>

                    <td>
                      {
                        o.owner
                          ?.name
                      }
                    </td>

                    <td>
                      {o.areasServed?.join(
                        ', '
                      )}
                    </td>

                    <td>
                      {o.isVerified ? (
                        <span className="badge badge-verified">
                          Verified
                        </span>
                      ) : (
                        <span className="badge badge-closed">
                          Pending
                        </span>
                      )}
                    </td>

                    <td>
                      {o.isVerified ? (
                        <button
                          className="btn btn-sm btn-ghost"
                          onClick={() =>
                            act(
                              () =>
                                adminApi.verifyOrg(
                                  o._id,
                                  false
                                ),
                              'Verification revoked.'
                            )
                          }
                        >
                          Revoke
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() =>
                            act(
                              () =>
                                adminApi.verifyOrg(
                                  o._id,
                                  true
                                ),
                              'Organization verified.'
                            )
                          }
                        >
                          Verify
                        </button>
                      )}
                    </td>
                  </tr>
                )
              )}

              {!filteredOrgs.length && (
                <tr>
                  <td
                    colSpan={5}
                    className="muted center"
                  >
                    No matching
                    organizations.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab ===
        'Volunteers' && (
        <div className="card table-card">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map(
                (u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>

                    <td>
                      {u.email}
                    </td>

                    <td>
                      {u.ratingCount
                        ? `★ ${u.ratingAvg} (${u.ratingCount})`
                        : '—'}
                    </td>

                    <td>
                      {u.isVerified ? (
                        <span className="badge badge-verified">
                          Verified
                        </span>
                      ) : (
                        <span className="badge badge-closed">
                          Unverified
                        </span>
                      )}
                    </td>

                    <td>
                      {u.isVerified ? (
                        <button
                          className="btn btn-sm btn-ghost"
                          onClick={() =>
                            act(
                              () =>
                                adminApi.verifyUser(
                                  u._id,
                                  false
                                ),
                              'Revoked.'
                            )
                          }
                        >
                          Revoke
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() =>
                            act(
                              () =>
                                adminApi.verifyUser(
                                  u._id,
                                  true
                                ),
                              'Volunteer verified.'
                            )
                          }
                        >
                          Verify
                        </button>
                      )}
                    </td>
                  </tr>
                )
              )}

              {!filteredUsers.length && (
                <tr>
                  <td
                    colSpan={5}
                    className="muted center"
                  >
                    No matching
                    volunteers.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Requests' && (
        <div className="card table-card">
          <table className="table">
            <thead>
              <tr>
                <th>Need</th>
                <th>District</th>
                <th>By</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.map(
                (r) => (
                  <tr key={r._id}>
                    <td
                      style={{
                        textTransform:
                          'capitalize',
                      }}
                    >
                      {r.needType}{' '}

                      {r.urgency ===
                        'sos' && (
                        <span className="badge badge-sos">
                          SOS
                        </span>
                      )}
                    </td>

                    <td>
                      {
                        r.location
                          ?.district
                      }
                    </td>

                    <td>
                      {
                        r.createdBy
                          ?.name
                      }
                    </td>

                    <td>
                      <span
                        className={`badge badge-${r.status}`}
                      >
                        {r.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() =>
                          act(
                            () =>
                              adminApi.removeRequest(
                                r._id
                              ),
                            'Request removed.'
                          )
                        }
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                )
              )}

              {!filteredRequests.length && (
                <tr>
                  <td
                    colSpan={5}
                    className="muted center"
                  >
                    No matching
                    requests.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}