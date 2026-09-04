import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
          {user && link('/post', 'Post Request')}
          {user && link('/my-requests', 'My Requests')}
          {user?.role === 'volunteer' && link('/volunteer', 'Volunteer')}
        </div>

        <div className="nav-right">
          {user ? (
            <>
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
