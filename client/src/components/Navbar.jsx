import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLang } from '../context/LangContext.jsx';
import { notificationApi } from '../services/api.js';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t, lang, toggle } = useLang();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  // Feature 20: poll the unread notification count for the bell.
  useEffect(() => {
    if (!user) {
      setUnread(0);
      return;
    }
    let active = true;
    const load = () =>
      notificationApi
        .list()
        .then((res) => active && setUnread(res.data.unread))
        .catch(() => {});
    load();
    const id = setInterval(load, 30000);
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
          {t('appName')}<span>.</span>
        </NavLink>

        <div className="nav-links">
          {link('/', t('home'), true)}
          {link('/campaigns', t('campaigns'))}
          {link('/shelters', t('shelters'))}
          {link('/missing', t('missing'))}
          {link('/organizations', t('organizations'))}
          {link('/resources', t('resourceBoard'))}
          {link('/impact', t('impact'))}
          {user && link('/post', t('postRequest'))}
          {user && link('/my-requests', t('myRequests'))}
          {user?.role === 'volunteer' && link('/volunteer', t('volunteer'))}
          {user?.role === 'admin' && link('/admin', t('admin'))}
        </div>

        <div className="nav-right">
          <button className="btn btn-ghost btn-sm" onClick={toggle} title="Language">
            {lang === 'en' ? 'বাংলা' : 'EN'}
          </button>

          {user ? (
            <>
              <NavLink to="/notifications" className="nav-link" title={t('notifications')}>
                🔔{unread > 0 && <span className="notif-dot">{unread}</span>}
              </NavLink>
              <span className="muted nav-user">
                {user.name.split(' ')[0]} · {user.role}
              </span>
              <button className="btn btn-ghost btn-sm" onClick={onLogout}>
                {t('logout')}
              </button>
            </>
          ) : (
            <>
              {link('/login', t('login'))}
              <NavLink to="/register" className="btn btn-sm">
                {t('register')}
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
