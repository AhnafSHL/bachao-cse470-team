import {
  useEffect,
  useState,
} from 'react';

import {
  Link,
} from 'react-router-dom';

import {
  notificationApi,
} from '../services/api.js';

const ICON = {
  request: '🆘',
  status: '🔄',
  donation: '💰',
  admin: '🛡️',
  info: 'ℹ️',
};

export default function Notifications() {
  const [
    items,
    setItems,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const load = () => {
    setLoading(true);

    notificationApi
      .list()
      .then((res) =>
        setItems(
          res.data.notifications
        )
      )
      .finally(() =>
        setLoading(false)
      );
  };

  useEffect(() => {
    load();
  }, []);

  const markRead =
    async (id) => {
      await notificationApi.markRead(
        id
      );

      load();
    };

  const markAll =
    async () => {
      await notificationApi.markAllRead();

      load();
    };

  if (loading) {
    return (
      <div className="spinner">
        Loading…
      </div>
    );
  }

  return (
    <div className="container">
      <div className="spread">
        <h1 className="page-title">
          Notifications
        </h1>

        {items.some(
          (notification) =>
            !notification.isRead
        ) && (
          <button
            className="btn btn-sm btn-ghost"
            onClick={markAll}
          >
            Mark all read
          </button>
        )}
      </div>

      {!items.length ? (
        <div className="empty">
          No notifications yet.
        </div>
      ) : (
        <div className="card table-card">
          <ul className="list-clean">
            {items.map(
              (notification) => (
                <li
                  key={
                    notification._id
                  }
                  style={{
                    padding:
                      '12px 16px',

                    borderBottom:
                      '1px solid var(--border)',

                    background:
                      notification.isRead
                        ? '#fff'
                        : '#f0f7ff',

                    display:
                      'flex',

                    gap: 12,

                    alignItems:
                      'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: 20,
                    }}
                  >
                    {ICON[
                      notification.type
                    ] || 'ℹ️'}
                  </span>

                  <div
                    style={{
                      flex: 1,
                    }}
                  >
                    <div>
                      {
                        notification.message
                      }
                    </div>

                    <div
                      className="muted"
                      style={{
                        fontSize:
                          '0.78rem',
                      }}
                    >
                      {new Date(
                        notification.createdAt
                      ).toLocaleString()}
                    </div>
                  </div>

                  {notification.link && (
                    <Link
                      to={
                        notification.link
                      }
                      className="btn btn-sm btn-ghost"
                    >
                      Open
                    </Link>
                  )}

                  {!notification.isRead && (
                    <button
                      className="btn btn-sm"
                      onClick={() =>
                        markRead(
                          notification._id
                        )
                      }
                    >
                      Mark read
                    </button>
                  )}
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
}