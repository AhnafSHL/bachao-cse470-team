import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { campaignApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { DISTRICT_NAMES } from '../constants.js';

function Progress({ value, max }) {
  const pct =
    max > 0
      ? Math.min(
          100,
          Math.round(
            (value / max) * 100
          )
        )
      : 0;

  return (
    <div
      className="progress"
      title={`${pct}%`}
    >
      <div
        style={{
          width: `${pct}%`,
          background:
            'var(--success)',
        }}
      />
    </div>
  );
}

export default function Campaigns() {
  const { user } = useAuth();

  const [campaigns, setCampaigns] =
    useState([]);

  const [msg, setMsg] =
    useState('');

  const [showForm, setShowForm] =
    useState(false);

  const [form, setForm] =
    useState({
      title: '',
      description: '',
      goalAmount: 10000,
      type: 'money',
      district: 'Sylhet',
    });

  const canCreate =
    user &&
    ['donor', 'org_admin', 'admin'].includes(
      user.role
    );

  const load = () =>
    campaignApi
      .list()
      .then((res) =>
        setCampaigns(res.data)
      )
      .catch((err) =>
        setMsg(err.message)
      );

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();

    try {
      await campaignApi.create({
        ...form,
        goalAmount:
          Number(
            form.goalAmount
          ) || 0,
      });

      setMsg(
        'Campaign created.'
      );

      setShowForm(false);

      setForm({
        title: '',
        description: '',
        goalAmount: 10000,
        type: 'money',
        district: 'Sylhet',
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
            Relief Campaigns
          </h1>

          <p className="page-sub">
            Fund relief and track
            money raised versus
            distributed.
          </p>
        </div>

        {canCreate && (
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
              : '+ New campaign'}
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

      {showForm &&
        canCreate && (
          <form
            className="card"
            onSubmit={create}
            style={{
              marginBottom: 16,
            }}
          >
            <div className="row">
              <div
                style={{
                  flex: 2,
                }}
              >
                <label>
                  Title
                </label>

                <input
                  value={
                    form.title
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title:
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
                  Type
                </label>

                <select
                  value={
                    form.type
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type:
                        e.target
                          .value,
                    })
                  }
                >
                  <option value="money">
                    Money
                  </option>

                  <option value="goods">
                    Goods
                  </option>
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
            />

            <div className="row">
              <div
                style={{
                  flex: 1,
                }}
              >
                <label>
                  Goal
                </label>

                <input
                  type="number"
                  min={0}
                  value={
                    form.goalAmount
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      goalAmount:
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
                  Target district
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

            <button
              className="btn"
              style={{
                marginTop: 12,
              }}
            >
              Create campaign
            </button>
          </form>
        )}

      <div className="grid grid-2">
        {campaigns.map(
          (campaign) => (
            <div
              className="card"
              key={
                campaign._id
              }
            >
              <div className="spread">
                <Link
                  to={`/campaigns/${campaign._id}`}
                >
                  <b>
                    {campaign.title}
                  </b>
                </Link>

                <span
                  className={`badge ${
                    campaign.status ===
                    'active'
                      ? 'badge-open'
                      : 'badge-closed'
                  }`}
                >
                  {campaign.status}
                </span>
              </div>

              <p
                className="muted"
                style={{
                  margin:
                    '6px 0',
                }}
              >
                {
                  campaign.description
                }
              </p>

              <div
                className="muted"
                style={{
                  fontSize:
                    '0.82rem',
                }}
              >
                {campaign.district ||
                  'Nationwide'}
                {' · '}
                by{' '}
                {
                  campaign.organizer
                    ?.name
                }
                {' · '}
                {campaign.type}
              </div>

              <div
                style={{
                  marginTop: 10,
                }}
              >
                <div
                  className="spread"
                  style={{
                    fontSize:
                      '0.85rem',
                  }}
                >
                  <span>
                    Raised:{' '}
                    <b>
                      {campaign.raisedAmount.toLocaleString()}
                    </b>
                  </span>

                  <span className="muted">
                    Goal:{' '}
                    {campaign.goalAmount.toLocaleString()}
                  </span>
                </div>

                <Progress
                  value={
                    campaign.raisedAmount
                  }
                  max={
                    campaign.goalAmount
                  }
                />
              </div>

              <Link
                to={`/campaigns/${campaign._id}`}
                className="btn btn-sm"
                style={{
                  marginTop: 12,
                }}
              >
                View details
              </Link>
            </div>
          )
        )}

        {!campaigns.length && (
          <div className="empty">
            No campaigns yet.
          </div>
        )}
      </div>
    </div>
  );
}