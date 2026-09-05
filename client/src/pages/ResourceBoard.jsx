import { useEffect, useState } from 'react';
import { requestApi, volunteerApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  DISTRICTS,
  DISTRICT_NAMES,
} from '../constants.js';

export default function ResourceBoard() {
  const { user } = useAuth();

  const [needs, setNeeds] =
    useState([]);

  const [msg, setMsg] =
    useState('');

  const [showForm, setShowForm] =
    useState(false);

  const [form, setForm] =
    useState({
      description: '',
      district: 'Sylhet',
      urgency: 'high',
      peopleAffected: 1,
    });

  const load = () =>
    requestApi
      .list({
        resourceOnly: true,
      })
      .then((res) =>
        setNeeds(res.data)
      )
      .catch((err) =>
        setMsg(err.message)
      );

  useEffect(() => {
    load();
  }, []);

  const post = async (e) => {
    e.preventDefault();

    try {
      await requestApi.create({
        needType: 'resource',

        description:
          form.description,

        peopleAffected:
          Number(
            form.peopleAffected
          ),

        urgency:
          form.urgency,

        isResourceNeed: true,

        location: {
          district:
            form.district,

          coords:
            DISTRICTS[
              form.district
            ],
        },
      });

      setMsg(
        'Resource need posted.'
      );

      setShowForm(false);

      setForm({
        description: '',
        district: 'Sylhet',
        urgency: 'high',
        peopleAffected: 1,
      });

      load();
    } catch (err) {
      setMsg(err.message);
    }
  };

  const respond = async (id) => {
    try {
      await volunteerApi.claim(
        id
      );

      setMsg(
        'You responded to this need — it is now assigned to you.'
      );

      load();
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <div className="container">
      <div className="spread">
        <div>
          <h1 className="page-title">
            Resource Board
          </h1>

          <p className="page-sub">
            Volunteers post
            logistics needs
            (boats, transport,
            equipment) and
            respond to each
            other.
          </p>
        </div>

        {user && (
          <button
            className="btn"
            onClick={() =>
              setShowForm(
                (show) => !show
              )
            }
          >
            {showForm
              ? 'Close'
              : '+ Post a need'}
          </button>
        )}
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
          onSubmit={post}
          style={{
            marginBottom: 14,
          }}
        >
          <label>
            What do you need?
          </label>

          <input
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
            placeholder="e.g. Need a boat to evacuate 10 people"
            required
          />

          <div className="row">
            <div
              style={{
                flex: 1,
              }}
            >
              <label>
                District
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
                      key={district}
                      value={district}
                    >
                      {district}
                    </option>
                  )
                )}
              </select>
            </div>

            <div
              style={{
                flex: 1,
              }}
            >
              <label>
                Urgency
              </label>

              <select
                value={
                  form.urgency
                }
                onChange={(e) =>
                  setForm({
                    ...form,

                    urgency:
                      e.target
                        .value,
                  })
                }
              >
                <option value="normal">
                  Normal
                </option>

                <option value="high">
                  High
                </option>

                <option value="sos">
                  SOS
                </option>
              </select>
            </div>

            <div
              style={{
                flex: 1,
              }}
            >
              <label>
                People affected
              </label>

              <input
                type="number"
                min={1}
                value={
                  form.peopleAffected
                }
                onChange={(e) =>
                  setForm({
                    ...form,

                    peopleAffected:
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
            Post
          </button>
        </form>
      )}

      <div className="grid grid-2">
        {needs.map((request) => (
          <div
            className="card"
            key={request._id}
          >
            <div className="spread">
              <b>
                🛟 Resource need
              </b>

              <span
                className={`badge badge-${request.status}`}
              >
                {request.status}
              </span>
            </div>

            <p
              style={{
                margin: '6px 0',
              }}
            >
              {
                request.description
              }
            </p>

            <div
              className="muted"
              style={{
                fontSize:
                  '0.84rem',
              }}
            >
              <span
                className={`badge badge-${request.urgency}`}
              >
                {request.urgency ===
                'sos'
                  ? 'SOS'
                  : request.urgency}
              </span>

              {' · '}📍{' '}
              {
                request.location
                  ?.district
              }

              {' · '}👥{' '}
              {
                request.peopleAffected
              }

              {' · '}by{' '}
              {
                request.createdBy
                  ?.name
              }
            </div>

            {request.claimedBy && (
              <div
                className="muted"
                style={{
                  fontSize:
                    '0.82rem',

                  marginTop: 4,
                }}
              >
                🙋{' '}
                {
                  request.claimedBy
                    .name
                }{' '}
                is on it
              </div>
            )}

            {user?.role ===
              'volunteer' &&
              request.status ===
                'open' && (
                <button
                  className="btn btn-sm btn-success"
                  style={{
                    marginTop: 8,
                  }}
                  onClick={() =>
                    respond(
                      request._id
                    )
                  }
                >
                  I can help
                </button>
              )}
          </div>
        ))}

        {!needs.length && (
          <div className="empty">
            No resource needs
            posted right now.
          </div>
        )}
      </div>
    </div>
  );
}