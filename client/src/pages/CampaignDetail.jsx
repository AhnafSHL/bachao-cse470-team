import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  Link,
  useParams,
} from 'react-router-dom';

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  campaignApi,
} from '../services/api.js';

import {
  useAuth,
} from '../context/AuthContext.jsx';

export default function CampaignDetail() {
  const { id } =
    useParams();

  const { user } =
    useAuth();

  const [
    campaign,
    setCampaign,
  ] = useState(null);

  const [
    donations,
    setDonations,
  ] = useState([]);

  const [
    matches,
    setMatches,
  ] = useState({
    remaining: 0,
    matches: [],
  });

  const [msg, setMsg] =
    useState('');

  const [
    donation,
    setDonation,
  ] = useState({
    amount: '',
    itemDescription: '',
  });

  const [
    distAmount,
    setDistAmount,
  ] = useState('');

  const load =
    useCallback(
      async () => {
        try {
          const [
            campaignRes,
            donationsRes,
            matchesRes,
          ] =
            await Promise.all([
              campaignApi.get(
                id
              ),

              campaignApi.donations(
                id
              ),

              campaignApi.matches(
                id
              ),
            ]);

          setCampaign(
            campaignRes.data
          );

          setDonations(
            donationsRes.data
          );

          setMatches(
            matchesRes.data
          );
        } catch (err) {
          setMsg(
            err.message
          );
        }
      },
      [id]
    );

  useEffect(() => {
    load();
  }, [load]);

  const donate =
    async (e) => {
      e.preventDefault();

      try {
        await campaignApi.donate(
          id,
          {
            amount:
              Number(
                donation.amount
              ) || 0,

            itemDescription:
              donation.itemDescription,
          }
        );

        setMsg(
          'Thank you for your donation!'
        );

        setDonation({
          amount: '',
          itemDescription: '',
        });

        load();
      } catch (err) {
        setMsg(
          err.message
        );
      }
    };

  const recordDistribution =
    async (e) => {
      e.preventDefault();

      try {
        await campaignApi.distribute(
          id,
          Number(
            distAmount
          )
        );

        setMsg(
          'Distribution recorded.'
        );

        setDistAmount(
          ''
        );

        load();
      } catch (err) {
        setMsg(
          err.message
        );
      }
    };

  if (!campaign) {
    return (
      <div className="spinner">
        {msg ||
          'Loading...'}
      </div>
    );
  }

  const isMoney =
    campaign.type ===
    'money';

  const isOrganizer =
    user &&
    (String(
      campaign.organizer
        ?._id
    ) ===
      String(user._id) ||
      user.role === 'admin');

  const chartData = [
    {
      name: 'Raised',
      value:
        campaign.raisedAmount,
    },

    {
      name:
        'Distributed',

      value:
        campaign.distributedAmount,
    },

    {
      name:
        'Remaining',

      value:
        Math.max(
          0,
          campaign.raisedAmount -
            campaign.distributedAmount
        ),
    },
  ];

  const colors = [
    '#0d6efd',
    '#198754',
    '#fd7e14',
  ];

  return (
    <div className="container">
      <Link
        to="/campaigns"
        className="muted"
      >
        ← All campaigns
      </Link>

      <div
        className="spread"
        style={{
          marginTop: 8,
        }}
      >
        <h1 className="page-title">
          {campaign.title}
        </h1>

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

      <p className="page-sub">
        {
          campaign.description
        }
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
        className="grid"
        style={{
          gridTemplateColumns:
            '1.2fr 1fr',

          alignItems:
            'start',
        }}
      >
        <div className="card">
          <h3>
            Transparency tracker
          </h3>

          <div
            className="row"
            style={{
              gap: 24,
            }}
          >
            <div>
              <div className="stat">
                {isMoney
                  ? '৳'
                  : ''}
                {campaign.raisedAmount.toLocaleString()}
              </div>

              <div className="stat-label">
                Raised
              </div>
            </div>

            <div>
              <div
                className="stat"
                style={{
                  color:
                    'var(--success)',
                }}
              >
                {isMoney
                  ? '৳'
                  : ''}
                {campaign.distributedAmount.toLocaleString()}
              </div>

              <div className="stat-label">
                Distributed
              </div>
            </div>

            <div>
              <div
                className="stat"
                style={{
                  color:
                    'var(--warning)',
                }}
              >
                {isMoney
                  ? '৳'
                  : ''}
                {matches.remaining.toLocaleString()}
              </div>

              <div className="stat-label">
                Remaining
              </div>
            </div>
          </div>

          <div
            style={{
              height: 220,
              marginTop: 10,
            }}
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={
                  chartData
                }
              >
                <XAxis
                  dataKey="name"
                />

                <YAxis />

                <Tooltip
                  formatter={(
                    value
                  ) =>
                    isMoney
                      ? `৳${value.toLocaleString()}`
                      : value
                  }
                />

                <Bar dataKey="value">
                  {chartData.map(
                    (
                      entry,
                      index
                    ) => (
                      <Cell
                        key={
                          entry.name
                        }
                        fill={
                          colors[
                            index
                          ]
                        }
                      />
                    )
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {isOrganizer && (
            <form
              className="row"
              onSubmit={
                recordDistribution
              }
              style={{
                marginTop: 8,
              }}
            >
              <input
                type="number"
                min={1}
                placeholder="Amount distributed"
                value={
                  distAmount
                }
                onChange={(e) =>
                  setDistAmount(
                    e.target
                      .value
                  )
                }
                style={{
                  flex: 1,
                }}
                required
              />

              <button className="btn btn-sm">
                Record distribution
              </button>
            </form>
          )}
        </div>

        <div className="card">
          <h3>
            {isMoney
              ? 'Donate'
              : 'Pledge goods'}
          </h3>

          {!user ? (
            <div className="alert alert-info">
              Please{' '}
              <Link to="/login">
                login
              </Link>{' '}
              to donate.
            </div>
          ) : campaign.status !==
            'active' ? (
            <div className="muted">
              This campaign is
              closed.
            </div>
          ) : (
            <form
              onSubmit={
                donate
              }
            >
              {isMoney ? (
                <>
                  <label>
                    Amount
                  </label>

                  <input
                    type="number"
                    min={1}
                    value={
                      donation.amount
                    }
                    onChange={(e) =>
                      setDonation({
                        ...donation,

                        amount:
                          e.target
                            .value,
                      })
                    }
                    required
                  />
                </>
              ) : (
                <>
                  <label>
                    What are you
                    donating?
                  </label>

                  <input
                    value={
                      donation.itemDescription
                    }
                    onChange={(e) =>
                      setDonation({
                        ...donation,

                        itemDescription:
                          e.target
                            .value,
                      })
                    }
                    placeholder="e.g. 50 blankets"
                    required
                  />
                </>
              )}

              <button
                className="btn btn-block"
                style={{
                  marginTop: 12,
                }}
              >
                Give now
              </button>
            </form>
          )}

          <div className="divider" />

          <h4
            style={{
              margin:
                '0 0 6px',
            }}
          >
            Donation ledger
          </h4>

          {donations.length ? (
            <ul
              className="list-clean"
              style={{
                maxHeight: 160,
                overflow:
                  'auto',
              }}
            >
              {donations.map(
                (item) => (
                  <li
                    key={
                      item._id
                    }
                    style={{
                      padding:
                        '5px 0',

                      borderBottom:
                        '1px solid var(--border)',

                      fontSize:
                        '0.86rem',
                    }}
                  >
                    <b>
                      {item.donor
                        ?.name ||
                        'Anonymous'}
                    </b>
                    {' — '}

                    {item.amount
                      ? `৳${item.amount.toLocaleString()}`
                      : item.itemDescription}

                    <div
                      className="muted"
                      style={{
                        fontSize:
                          '0.74rem',
                      }}
                    >
                      {new Date(
                        item.createdAt
                      ).toLocaleString()}
                    </div>
                  </li>
                )
              )}
            </ul>
          ) : (
            <div className="muted">
              No donations yet.
            </div>
          )}
        </div>
      </div>

      <h3
        style={{
          marginTop: 22,
        }}
      >
        Open needs this
        campaign can cover
      </h3>

      <p className="muted">
        Based on{' '}
        {isMoney
          ? `৳${matches.remaining.toLocaleString()} remaining`
          : 'remaining funds'}{' '}
        and an estimated
        relief cost.
      </p>

      <div className="grid grid-2">
        {matches.matches.map(
          (match) => (
            <div
              className="card"
              key={
                match.request
                  ._id
              }
              style={{
                borderLeft:
                  `4px solid ${
                    match.coverable
                      ? 'var(--success)'
                      : 'var(--border)'
                  }`,
              }}
            >
              <div className="spread">
                <b
                  style={{
                    textTransform:
                      'capitalize',
                  }}
                >
                  {
                    match.request
                      .needType
                  }
                </b>

                <span
                  className={`badge ${
                    match.coverable
                      ? 'badge-fulfilled'
                      : 'badge-closed'
                  }`}
                >
                  {match.coverable
                    ? 'Coverable'
                    : 'Insufficient funds'}
                </span>
              </div>

              <p
                style={{
                  margin:
                    '6px 0',
                }}
              >
                {
                  match.request
                    .description
                }
              </p>

              <div
                className="muted"
                style={{
                  fontSize:
                    '0.84rem',
                }}
              >
                {
                  match.request
                    .peopleAffected
                }{' '}
                people
                {' · '}
                {
                  match.request
                    .location
                    ?.district
                }
                {' · '}
                estimated{' '}
                ৳
                {match.estimatedCost.toLocaleString()}
              </div>
            </div>
          )
        )}

        {!matches.matches.length && (
          <div className="empty">
            No open requests in
            this campaign&apos;s
            area right now.
          </div>
        )}
      </div>
    </div>
  );
}