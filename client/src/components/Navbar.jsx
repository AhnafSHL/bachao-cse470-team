import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { notificationApi } from '../services/api.js';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) {
      setUnread(0);
      return;
    }

    let active = true;

    const load = () =>
      notificationApi
        .list()
        .then((res) => {
          if (active) {
            setUnread(
              res.data.unread
            );
          }
        })
        .catch(() => {});

    load();

    const id =
      setInterval(
        load,
        30000
      );

    return () => {
      active = false;
      clearInterval(id);
    };
  }, [user]);

  const onLogout = () => {
    logout();
    navigate('/');
  };

  const link = (to, label, end = false) => (
    <NavLink to={to} end={end} className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
      {label}
    </NavLink>
  );

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand">
          Bachao<span>.</span>
        </NavLink>

        <div className="nav-links">
          {link('/', 'Home', true)}
          {link('/campaigns', 'Campaigns')}
          {link('/shelters', 'Shelters')}
          {link('/missing', 'Missing Persons')}
          {link('/organizations', 'Organizations')}
          {user && link('/post', 'Post Request')}
          {user && link('/my-requests', 'My Requests')}
          {user?.role === 'volunteer' && link('/volunteer', 'Volunteer')}
          {user?.role === 'admin' && link('/admin', 'Admin')}
        </div>

        <div className="nav-right">
          {user ? (
            <>
              <NavLink
                to="/notifications"
                className="nav-link"
                title="Notifications"
              >
                🔔
                {unread > 0 && (
                  <span className="notif-dot">
                    {unread}
                  </span>
                )}
              </NavLink>

              <span className="muted nav-user">
                {user.name.split(' ')[0]} · {user.role}
              </span>
              <button className="btn btn-ghost btn-sm" onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              {link('/login', 'Login')}
              <NavLink to="/register" className="btn btn-sm">
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
