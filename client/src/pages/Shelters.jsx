import { useEffect, useState } from 'react';
import MapView from '../components/MapView.jsx';
import { shelterApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { DISTRICTS, DISTRICT_NAMES } from '../constants.js';

export default function Shelters() {
  const { user } = useAuth();

  const [shelters, setShelters] = useState([]);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [msg, setMsg] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [occEdit, setOccEdit] = useState({});

  const [form, setForm] = useState({
    name: '',
    district: 'Sylhet',
    capacity: 100,
    currentOccupancy: 0,
    facilities: 'water, food',
    contact: '',
  });

  const canManage =
    user &&
    ['org_admin', 'admin'].includes(user.role);

  const load = () =>
    shelterApi
      .list(
        onlyAvailable
          ? { available: true }
          : {}
      )
      .then((res) =>
        setShelters(res.data)
      )
      .catch((err) =>
        setMsg(err.message)
      );

  useEffect(() => {
    load();
  }, [onlyAvailable]);

  const create = async (e) => {
    e.preventDefault();

    try {
      await shelterApi.create({
        name: form.name,

        location: {
          district: form.district,
          coords: DISTRICTS[form.district],
        },

        capacity:
          Number(form.capacity),

        currentOccupancy:
          Number(form.currentOccupancy),

        facilities:
          form.facilities
            .split(',')
            .map((facility) =>
              facility.trim()
            )
            .filter(Boolean),

        contact: form.contact,
      });

      setMsg('Shelter added.');
      setShowForm(false);

      setForm({
        name: '',
        district: 'Sylhet',
        capacity: 100,
        currentOccupancy: 0,
        facilities: 'water, food',
        contact: '',
      });

      load();
    } catch (err) {
      setMsg(err.message);
    }
  };

  const updateOcc = async (id) => {
    try {
      await shelterApi.setOccupancy(
        id,
        Number(occEdit[id])
      );

      setMsg('Occupancy updated.');

      setOccEdit({
        ...occEdit,
        [id]: '',
      });

      load();
    } catch (err) {
      setMsg(err.message);
    }
  };

  const points = shelters
    .filter((shelter) =>
      Array.isArray(
        shelter.location?.coords
      )
    )
    .map((shelter) => {
      const free =
        shelter.capacity -
        shelter.currentOccupancy;

      return {
        id: shelter._id,
        lat: shelter.location.coords[1],
        lng: shelter.location.coords[0],
        color:
          free > 0
            ? '#198754'
            : '#dc3545',

        popup: (
          <div>
            <b>{shelter.name}</b>

            <br />

            {free > 0
              ? `${free} beds free`
              : 'Full'}{' '}

            ({shelter.currentOccupancy}/
            {shelter.capacity})
          </div>
        ),
      };
    });

  return (
    <div className="container">
      <div className="spread">
        <div>
          <h1 className="page-title">
            Shelter Directory
          </h1>

          <p className="page-sub">
            Find the nearest shelter with free beds.
          </p>
        </div>

        <div className="row">
          <label
            className="row"
            style={{
              gap: 6,
              margin: 0,
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              style={{
                width: 'auto',
              }}
              checked={onlyAvailable}
              onChange={(e) =>
                setOnlyAvailable(
                  e.target.checked
                )
              }
            />

            <span>
              Only with free beds
            </span>
          </label>

          {canManage && (
            <button
              className="btn"
              onClick={() =>
                setShowForm(
                  (value) => !value
                )
              }
            >
              {showForm
                ? 'Close'
                : '+ Add shelter'}
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

      {showForm && canManage && (
        <form
          className="card"
          onSubmit={create}
          style={{
            marginBottom: 14,
          }}
        >
          <div className="row">
            <div style={{ flex: 2 }}>
              <label>Name</label>

              <input
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                required
              />
            </div>

            <div style={{ flex: 1 }}>
              <label>District</label>

              <select
                value={form.district}
                onChange={(e) =>
                  setForm({
                    ...form,
                    district: e.target.value,
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
          </div>

          <div className="row">
            <div style={{ flex: 1 }}>
              <label>Capacity</label>

              <input
                type="number"
                min={0}
                value={form.capacity}
                onChange={(e) =>
                  setForm({
                    ...form,
                    capacity:
                      e.target.value,
                  })
                }
              />
            </div>

            <div style={{ flex: 1 }}>
              <label>
                Current occupancy
              </label>

              <input
                type="number"
                min={0}
                value={
                  form.currentOccupancy
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    currentOccupancy:
                      e.target.value,
                  })
                }
              />
            </div>

            <div style={{ flex: 1 }}>
              <label>Contact</label>

              <input
                value={form.contact}
                onChange={(e) =>
                  setForm({
                    ...form,
                    contact:
                      e.target.value,
                  })
                }
              />
            </div>
          </div>

          <label>
            Facilities (comma separated)
          </label>

          <input
            value={form.facilities}
            onChange={(e) =>
              setForm({
                ...form,
                facilities:
                  e.target.value,
              })
            }
          />

          <button
            className="btn"
            style={{
              marginTop: 12,
            }}
          >
            Add shelter
          </button>
        </form>
      )}

      <MapView
        points={points}
        className="map-wrap map-sm"
      />

      <div
        className="grid grid-2"
        style={{
          marginTop: 16,
        }}
      >
        {shelters.map((shelter) => {
          const free =
            shelter.capacity -
            shelter.currentOccupancy;

          const isManager =
            user &&
            (
              String(
                shelter.managedBy?._id ||
                shelter.managedBy
              ) ===
                String(user._id) ||
              user.role === 'admin'
            );

          return (
            <div
              className="card"
              key={shelter._id}
            >
              <div className="spread">
                <b>
                  {shelter.name}
                </b>

                <span
                  className={`badge ${
                    free > 0
                      ? 'badge-fulfilled'
                      : 'badge-sos'
                  }`}
                >
                  {free > 0
                    ? `${free} free`
                    : 'Full'}
                </span>
              </div>

              <div
                className="muted"
                style={{
                  margin: '6px 0',
                }}
              >
                📍{' '}
                {shelter.location?.district}
                {' · '}
                {shelter.currentOccupancy}/
                {shelter.capacity} occupied

                {shelter.contact &&
                  ` · ☎ ${shelter.contact}`}
              </div>

              <div className="progress">
                <div
                  style={{
                    width: `${
                      shelter.capacity
                        ? (
                            shelter.currentOccupancy /
                            shelter.capacity
                          ) * 100
                        : 0
                    }%`,

                    background:
                      free > 0
                        ? 'var(--warning)'
                        : 'var(--danger)',
                  }}
                />
              </div>

              <div
                style={{
                  marginTop: 8,
                }}
              >
                {shelter.facilities?.map(
                  (facility) => (
                    <span
                      className="tag"
                      key={facility}
                    >
                      {facility}
                    </span>
                  )
                )}
              </div>

              {isManager && (
                <div
                  className="row"
                  style={{
                    marginTop: 10,
                  }}
                >
                  <input
                    type="number"
                    min={0}
                    placeholder="Set occupancy"
                    value={
                      occEdit[
                        shelter._id
                      ] ?? ''
                    }
                    onChange={(e) =>
                      setOccEdit({
                        ...occEdit,

                        [shelter._id]:
                          e.target.value,
                      })
                    }
                    style={{
                      flex: 1,
                    }}
                  />

                  <button
                    className="btn btn-sm"
                    onClick={() =>
                      updateOcc(
                        shelter._id
                      )
                    }
                  >
                    Update
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {!shelters.length && (
          <div className="empty">
            No shelters listed.
          </div>
        )}
      </div>
    </div>
  );
}