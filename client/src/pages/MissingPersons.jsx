import {
  useEffect,
  useState,
} from 'react';

import {
  missingApi,
} from '../services/api.js';

import {
  useAuth,
} from '../context/AuthContext.jsx';

import {
  DISTRICT_NAMES,
} from '../constants.js';

export default function MissingPersons() {
  const { user } =
    useAuth();

  const [
    people,
    setPeople,
  ] = useState([]);

  const [
    statusFilter,
    setStatusFilter,
  ] = useState('');

  const [
    msg,
    setMsg,
  ] = useState('');

  const [
    showForm,
    setShowForm,
  ] = useState(false);

  const [
    form,
    setForm,
  ] = useState({
    name: '',
    age: '',
    district: 'Sylhet',
    description: '',
    contact: '',
    photoUrl: '',
  });

  const load = () =>
    missingApi
      .list(
        statusFilter
          ? {
              status:
                statusFilter,
            }
          : {}
      )
      .then((res) =>
        setPeople(res.data)
      )
      .catch((err) =>
        setMsg(err.message)
      );

  useEffect(() => {
    load();
  }, [statusFilter]);

  const create =
    async (e) => {
      e.preventDefault();

      try {
        await missingApi.create({
          name:
            form.name,

          age:
            form.age
              ? Number(
                  form.age
                )
              : undefined,

          description:
            form.description,

          contact:
            form.contact,

          photoUrl:
            form.photoUrl,

          lastSeenLocation: {
            district:
              form.district,
          },
        });

        setMsg(
          'Report posted.'
        );

        setShowForm(
          false
        );

        setForm({
          name: '',
          age: '',
          district: 'Sylhet',
          description: '',
          contact: '',
          photoUrl: '',
        });

        load();
      } catch (err) {
        setMsg(
          err.message
        );
      }
    };

  const markFound =
    async (id) => {
      try {
        await missingApi.markFound(
          id
        );

        setMsg(
          'Marked as found.'
        );

        load();
      } catch (err) {
        setMsg(
          err.message
        );
      }
    };

  return (
    <div className="container">
      <div className="spread">
        <div>
          <h1 className="page-title">
            Missing Persons Board
          </h1>

          <p className="page-sub">
            Report someone
            missing during the
            disaster, or mark
            them found.
          </p>
        </div>

        <div className="row">
          <select
            value={
              statusFilter
            }
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
          >
            <option value="">
              All
            </option>

            <option value="missing">
              Missing
            </option>

            <option value="found">
              Found
            </option>
          </select>

          {user && (
            <button
              className="btn"
              onClick={() =>
                setShowForm(
                  (value) =>
                    !value
                )
              }
            >
              {showForm
                ? 'Close'
                : '+ Report missing'}
            </button>
          )}
        </div>
      </div>

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

      {showForm && user && (
        <form
          className="card"
          onSubmit={create}
          style={{
            marginBottom: 14,
          }}
        >
          <div className="row">
            <div
              style={{
                flex: 2,
              }}
            >
              <label>
                Name
              </label>

              <input
                value={
                  form.name
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    name:
                      e.target
                        .value,
                  })
                }
                required
              />
            </div>

            <div
              style={{
                flex: 1,
              }}
            >
              <label>
                Age
              </label>

              <input
                type="number"
                min={0}
                value={
                  form.age
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    age:
                      e.target
                        .value,
                  })
                }
              />
            </div>

            <div
              style={{
                flex: 1,
              }}
            >
              <label>
                Last seen district
              </label>

              <select
                value={
                  form.district
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    district:
                      e.target
                        .value,
                  })
                }
              >
                {DISTRICT_NAMES.map(
                  (district) => (
                    <option
                      key={
                        district
                      }
                      value={
                        district
                      }
                    >
                      {district}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          <label>
            Description
          </label>

          <textarea
            value={
              form.description
            }
            onChange={(e) =>
              setForm({
                ...form,
                description:
                  e.target.value,
              })
            }
            placeholder="Clothing, distinguishing features..."
          />

          <div className="row">
            <div
              style={{
                flex: 1,
              }}
            >
              <label>
                Contact
              </label>

              <input
                value={
                  form.contact
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    contact:
                      e.target
                        .value,
                  })
                }
              />
            </div>

            <div
              style={{
                flex: 2,
              }}
            >
              <label>
                Photo URL (optional)
              </label>

              <input
                value={
                  form.photoUrl
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    photoUrl:
                      e.target
                        .value,
                  })
                }
              />
            </div>
          </div>

          <button
            className="btn"
            style={{
              marginTop: 12,
            }}
          >
            Post report
          </button>
        </form>
      )}

      <div className="grid grid-3">
        {people.map(
          (person) => {
            const canResolve =
              user &&
              (
                String(
                  person.reportedBy
                    ?._id ||
                  person.reportedBy
                ) ===
                  String(
                    user._id
                  ) ||
                user.role ===
                  'admin'
              );

            return (
              <div
                className="card"
                key={
                  person._id
                }
              >
                {person.photoUrl ? (
                  <img
                    src={
                      person.photoUrl
                    }
                    alt={
                      person.name
                    }
                    style={{
                      width:
                        '100%',

                      height:
                        140,

                      objectFit:
                        'cover',

                      borderRadius:
                        8,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      height:
                        140,

                      background:
                        '#eef2f7',

                      borderRadius:
                        8,

                      display:
                        'grid',

                      placeItems:
                        'center',

                      fontSize:
                        40,
                    }}
                  >
                    👤
                  </div>
                )}

                <div
                  className="spread"
                  style={{
                    marginTop:
                      8,
                  }}
                >
                  <b>
                    {
                      person.name
                    }

                    {person.age
                      ? `, ${person.age}`
                      : ''}
                  </b>

                  <span
                    className={`badge ${
                      person.status ===
                      'found'
                        ? 'badge-fulfilled'
                        : 'badge-sos'
                    }`}
                  >
                    {
                      person.status
                    }
                  </span>
                </div>

                <div
                  className="muted"
                  style={{
                    fontSize:
                      '0.84rem',
                  }}
                >
                  📍{' '}
                  {person.lastSeenLocation
                    ?.district ||
                    '—'}
                </div>

                {person.description && (
                  <p
                    style={{
                      margin:
                        '6px 0',

                      fontSize:
                        '0.9rem',
                    }}
                  >
                    {
                      person.description
                    }
                  </p>
                )}

                {person.contact && (
                  <div
                    className="muted"
                    style={{
                      fontSize:
                        '0.82rem',
                    }}
                  >
                    ☎{' '}
                    {
                      person.contact
                    }
                  </div>
                )}

                {canResolve &&
                  person.status ===
                    'missing' && (
                    <button
                      className="btn btn-sm btn-success"
                      style={{
                        marginTop:
                          8,
                      }}
                      onClick={() =>
                        markFound(
                          person._id
                        )
                      }
                    >
                      Mark found
                    </button>
                  )}
              </div>
            );
          }
        )}

        {!people.length && (
          <div className="empty">
            No records.
          </div>
        )}
      </div>
    </div>
  );
}