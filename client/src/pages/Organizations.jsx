import { useEffect, useState } from 'react';
import { orgApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

function Inventory({ org, canManage }) {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    itemName: '',
    quantity: 0,
    unit: 'units',
  });
  const [open, setOpen] = useState(false);

  const load = () =>
    orgApi
      .inventory(org._id)
      .then((res) => setItems(res.data))
      .catch(() => {});

  useEffect(() => {
    if (open) load();
  }, [open]); // eslint-disable-line

  const add = async (e) => {
    e.preventDefault();

    await orgApi.addItem(org._id, {
      ...newItem,
      quantity: Number(newItem.quantity),
    });

    setNewItem({
      itemName: '',
      quantity: 0,
      unit: 'units',
    });

    load();
  };

  const adjust = async (item, delta) => {
    await orgApi.updateItem(
      item._id,
      {
        quantity: Math.max(
          0,
          item.quantity + delta
        ),
      }
    );

    load();
  };

  return (
    <div style={{ marginTop: 10 }}>
      <button
        className="btn btn-sm btn-ghost"
        onClick={() =>
          setOpen((value) => !value)
        }
      >
        {open ? 'Hide' : 'View'} inventory
      </button>

      {open && (
        <div style={{ marginTop: 8 }}>
          {items.length ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  {canManage && <th></th>}
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td>
                      {item.itemName}
                    </td>

                    <td>
                      <b>
                        {item.quantity}
                      </b>{' '}
                      {item.unit}
                    </td>

                    {canManage && (
                      <td>
                        <button
                          className="btn btn-sm btn-ghost"
                          onClick={() =>
                            adjust(
                              item,
                              -10
                            )
                          }
                        >
                          -10
                        </button>{' '}

                        <button
                          className="btn btn-sm btn-ghost"
                          onClick={() =>
                            adjust(
                              item,
                              10
                            )
                          }
                        >
                          +10
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="muted">
              No inventory items.
            </div>
          )}

          {canManage && (
            <form
              className="row"
              onSubmit={add}
              style={{ marginTop: 8 }}
            >
              <input
                placeholder="Item name"
                value={newItem.itemName}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    itemName:
                      e.target.value,
                  })
                }
                required
                style={{ flex: 2 }}
              />

              <input
                type="number"
                min={0}
                placeholder="Qty"
                value={newItem.quantity}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    quantity:
                      e.target.value,
                  })
                }
                style={{ flex: 1 }}
              />

              <input
                placeholder="Unit"
                value={newItem.unit}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    unit:
                      e.target.value,
                  })
                }
                style={{ flex: 1 }}
              />

              <button className="btn btn-sm">
                Add
              </button>
            </form>
          )}

          <p
            className="muted"
            style={{
              fontSize: '0.78rem',
              marginTop: 6,
            }}
          >
            Tip: when a volunteer logs a
            distribution with a matching
            item name, this stock
            auto-decrements.
          </p>
        </div>
      )}
    </div>
  );
}

export default function Organizations() {
  const { user } = useAuth();

  const [orgs, setOrgs] =
    useState([]);

  const [
    onlyVerified,
    setOnlyVerified,
  ] = useState(false);

  const [msg, setMsg] =
    useState('');

  const [
    showForm,
    setShowForm,
  ] = useState(false);

  const [form, setForm] =
    useState({
      name: '',
      contact: '',
      description: '',
      areasServed: '',
    });

  const canCreate =
    user &&
    [
      'org_admin',
      'admin',
    ].includes(user.role);

  const load = () =>
    orgApi
      .list(
        onlyVerified
          ? { verified: true }
          : {}
      )
      .then((res) =>
        setOrgs(res.data)
      )
      .catch((err) =>
        setMsg(err.message)
      );

  useEffect(() => {
    load();
  }, [onlyVerified]); // eslint-disable-line

  const create = async (e) => {
    e.preventDefault();

    try {
      await orgApi.create(form);

      setMsg(
        'Organization registered — pending admin verification.'
      );

      setShowForm(false);

      setForm({
        name: '',
        contact: '',
        description: '',
        areasServed: '',
      });

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
            Organizations / NGOs
          </h1>

          <p className="page-sub">
            Verified relief organizations
            and their live inventory.
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
              checked={onlyVerified}
              onChange={(e) =>
                setOnlyVerified(
                  e.target.checked
                )
              }
            />

            <span>
              Verified only
            </span>
          </label>

          {canCreate && (
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
                : '+ Register org'}
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

      {showForm &&
        canCreate && (
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
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name:
                        e.target.value,
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
                        e.target.value,
                    })
                  }
                />
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
            />

            <label>
              Areas served
              (comma separated)
            </label>

            <input
              value={
                form.areasServed
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  areasServed:
                    e.target.value,
                })
              }
              placeholder="Sylhet, Sunamganj"
            />

            <button
              className="btn"
              style={{
                marginTop: 12,
              }}
            >
              Register
            </button>
          </form>
        )}

      <div className="grid grid-2">
        {orgs.map((org) => {
          const canManage =
            user &&
            (
              String(
                org.owner?._id ||
                org.owner
              ) ===
                String(user._id) ||
              user.role ===
                'admin'
            );

          return (
            <div
              className="card"
              key={org._id}
            >
              <div className="spread">
                <b>
                  {org.name}
                </b>

                {org.isVerified ? (
                  <span className="badge badge-verified">
                    ✔ Verified
                  </span>
                ) : (
                  <span className="badge badge-closed">
                    Unverified
                  </span>
                )}
              </div>

              {org.description && (
                <p
                  className="muted"
                  style={{
                    margin:
                      '6px 0',
                  }}
                >
                  {
                    org.description
                  }
                </p>
              )}

              <div
                className="muted"
                style={{
                  fontSize:
                    '0.84rem',
                }}
              >
                {org.contact &&
                  `☎ ${org.contact} · `}
                Owner:{' '}
                {org.owner?.name}
              </div>

              <div
                style={{
                  marginTop: 6,
                }}
              >
                {org.areasServed?.map(
                  (area) => (
                    <span
                      className="tag"
                      key={area}
                    >
                      {area}
                    </span>
                  )
                )}
              </div>

              <Inventory
                org={org}
                canManage={
                  canManage
                }
              />
            </div>
          );
        })}

        {!orgs.length && (
          <div className="empty">
            No organizations listed.
          </div>
        )}
      </div>
    </div>
  );
}