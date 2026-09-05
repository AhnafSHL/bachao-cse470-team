import {
  useEffect,
  useState,
} from 'react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

import {
  dashboardApi,
} from '../services/api.js';

import {
  NEED_COLORS,
} from '../constants.js';

function Stat({
  label,
  value,
  color,
}) {
  return (
    <div className="card center">
      <div
        className="stat"
        style={{ color }}
      >
        {value}
      </div>

      <div className="stat-label">
        {label}
      </div>
    </div>
  );
}

export default function ImpactDashboard() {
  const [data, setData] =
    useState(null);

  const [msg, setMsg] =
    useState('');

  useEffect(() => {
    dashboardApi
      .impact()
      .then((res) =>
        setData(res.data)
      )
      .catch((err) =>
        setMsg(err.message)
      );
  }, []);

  if (!data) {
    return (
      <div className="spinner">
        {msg ||
          'Loading impact data…'}
      </div>
    );
  }

  const {
    totals,
    byDistrict,
    byNeedType,
  } = data;

  return (
    <div className="container">
      <h1 className="page-title">
        Area-wise Impact
        Dashboard
      </h1>

      <p className="page-sub">
        How Bachao is helping,
        district by district.
      </p>

      {msg && (
        <div className="alert alert-error">
          {msg}
        </div>
      )}

      <div
        className="grid grid-3"
        style={{
          marginBottom: 18,
        }}
      >
        <Stat
          label="Total requests"
          value={
            totals.totalRequests
          }
          color="#0d6efd"
        />

        <Stat
          label="Open (unmet)"
          value={
            totals.openRequests
          }
          color="#dc3545"
        />

        <Stat
          label="Requests served"
          value={totals.served}
          color="#198754"
        />

        <Stat
          label="People helped"
          value={
            totals.peopleHelped
          }
          color="#6610f2"
        />

        <Stat
          label="Donations (৳)"
          value={totals.donationsTotal.toLocaleString()}
          color="#fd7e14"
        />

        <Stat
          label="Distributions logged"
          value={
            totals.distributions
          }
          color="#0dcaf0"
        />
      </div>

      <div
        className="grid"
        style={{
          gridTemplateColumns:
            '1.4fr 1fr',

          alignItems: 'start',
        }}
      >
        <div className="card">
          <h3>
            Requests by district
            (total vs. served)
          </h3>

          <div
            style={{
              height: 300,
            }}
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={byDistrict}
              >
                <XAxis
                  dataKey="district"
                />

                <YAxis
                  allowDecimals={
                    false
                  }
                />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="total"
                  name="Total"
                  fill="#0d6efd"
                />

                <Bar
                  dataKey="served"
                  name="Served"
                  fill="#198754"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3>
            Requests by need
            type
          </h3>

          <div
            style={{
              height: 300,
            }}
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={byNeedType}
                  dataKey="count"
                  nameKey="needType"
                  outerRadius={100}
                  label
                >
                  {byNeedType.map(
                    (need) => (
                      <Cell
                        key={
                          need.needType
                        }
                        fill={
                          NEED_COLORS[
                            need
                              .needType
                          ] ||
                          '#888'
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div
        className="card"
        style={{
          marginTop: 18,
        }}
      >
        <h3>
          Shelter capacity
        </h3>

        <p className="muted">
          {totals.shelterCount}{' '}
          shelters ·{' '}
          {
            totals.shelterOccupancy
          }{' '}
          /{' '}
          {
            totals.shelterCapacity
          }{' '}
          beds occupied ·{' '}

          <b>
            {Math.max(
              0,

              totals.shelterCapacity -
                totals.shelterOccupancy
            )}{' '}
            free
          </b>
        </p>

        <div
          className="progress"
          style={{
            height: 14,
          }}
        >
          <div
            style={{
              width: `${
                totals.shelterCapacity
                  ? (totals.shelterOccupancy /
                      totals.shelterCapacity) *
                    100
                  : 0
              }%`,

              background:
                'var(--warning)',
            }}
          />
        </div>
      </div>
    </div>
  );
}