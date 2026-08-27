import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Guards a route: redirects to /login if not authenticated, and (optionally)
// blocks users whose role isn't allowed.
export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="spinner">Loading…</div>;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (roles && !roles.includes(user.role)) {
    return (
      <div className="container">
        <div className="alert alert-error">
          This page is for {roles.join(' / ')} accounts. You are signed in as <b>{user.role}</b>.
        </div>
      </div>
    );
  }
  return children;
}
