import {
  useEffect,
  useState,
} from 'react';

import {
  Link,
} from 'react-router-dom';

import RequestCard from '../components/RequestCard.jsx';

import {
  requestApi,
  ratingApi,
} from '../services/api.js';

function Stars({
  value,
  onChange,
}) {
  return (
    <div
      style={{
        fontSize: '1.5rem',
        cursor: 'pointer',
        lineHeight: 1,
      }}
    >
      {[1, 2, 3, 4, 5].map(
        (star) => (
          <span
            key={star}
            onClick={() =>
              onChange(star)
            }
            style={{
              color:
                star <= value
                  ? '#f5b301'
                  : '#d1d5db',
            }}
          >
            ★
          </span>
        )
      )}
    </div>
  );
}

export default function MyRequests() {
  const [
    requests,
    setRequests,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    msg,
    setMsg,
  ] = useState('');

  const [
    rating,
    setRating,
  ] = useState({});

  const load = () => {
    setLoading(true);

    requestApi
      .mine()
      .then((response) =>
        setRequests(
          response.data
        )
      )
      .catch((err) =>
        setMsg(err.message)
      )
      .finally(() =>
        setLoading(false)
      );
  };

  useEffect(() => {
    load();
  }, []);

  const submitRating =
    async (id) => {
      const current =
        rating[id] || {};

      if (!current.stars) {
        setMsg(
          'Please pick a star rating first.'
        );

        return;
      }

      try {
        await ratingApi.confirmAndRate({
          requestId: id,

          stars:
            current.stars,

          comment:
            current.comment || '',
        });

        setMsg(
          'Thanks! Help confirmed and your volunteer was rated.'
        );

        load();
      } catch (err) {
        setMsg(
          err.message
        );
      }
    };

  if (loading) {
    return (
      <div className="spinner">
        Loading your requests…
      </div>
    );
  }

  return (
    <div className="container">
      <div className="spread">
        <h1 className="page-title">
          My Requests
        </h1>

        <Link
          to="/post"
          className="btn"
        >
          + Post Request
        </Link>
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

      {!requests.length ? (
        <div className="empty">
          You haven't posted any
          requests yet.
        </div>
      ) : (
        <div
          className="grid grid-2"
          style={{
            marginTop: 12,
          }}
        >
          {requests.map(
            (request) => (
              <RequestCard
                key={
                  request._id
                }

                request={
                  request
                }

                footer={
                  request.status ===
                    'fulfilled' &&
                  !request.confirmedByCitizen ? (
                    <div
                      className="card"

                      style={{
                        marginTop:
                          12,

                        background:
                          '#f8fafc',
                      }}
                    >
                      <b>
                        Confirm help
                        &amp; rate{' '}
                        {request
                          .claimedBy
                          ?.name ||
                          'your volunteer'}
                      </b>

                      <Stars
                        value={
                          rating[
                            request
                              ._id
                          ]?.stars ||
                          0
                        }

                        onChange={(
                          stars
                        ) =>
                          setRating(
                            {
                              ...rating,

                              [request._id]:
                                {
                                  ...rating[
                                    request
                                      ._id
                                  ],

                                  stars,
                                },
                            }
                          )
                        }
                      />

                      <input
                        placeholder="Comment (optional)"

                        value={
                          rating[
                            request
                              ._id
                          ]?.comment ||
                          ''
                        }

                        onChange={(
                          e
                        ) =>
                          setRating(
                            {
                              ...rating,

                              [request._id]:
                                {
                                  ...rating[
                                    request
                                      ._id
                                  ],

                                  comment:
                                    e
                                      .target
                                      .value,
                                },
                            }
                          )
                        }

                        style={{
                          marginTop:
                            8,
                        }}
                      />

                      <button
                        className="btn btn-success btn-sm"

                        style={{
                          marginTop:
                            8,
                        }}

                        onClick={() =>
                          submitRating(
                            request._id
                          )
                        }
                      >
                        ✔ Confirm &amp;
                        submit rating
                      </button>
                    </div>
                  ) : request.status ===
                    'closed' ? (
                    <div
                      className="alert alert-success"

                      style={{
                        marginTop:
                          10,
                      }}
                    >
                      ✔ Completed
                      &amp;
                      confirmed.
                    </div>
                  ) : null
                }
              />
            )
          )}
        </div>
      )}
    </div>
  );
}