import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import PostRequest from './pages/PostRequest.jsx';
import MyRequests from './pages/MyRequests.jsx';
import VolunteerDashboard from './pages/VolunteerDashboard.jsx';
import Campaigns from './pages/Campaigns.jsx';
import CampaignDetail from './pages/CampaignDetail.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/campaigns/:id" element={<CampaignDetail />} />
        <Route path="/post" element={<ProtectedRoute><PostRequest /></ProtectedRoute>} />
        <Route path="/my-requests" element={<ProtectedRoute><MyRequests /></ProtectedRoute>} />
        <Route
          path="/volunteer"
          element={
            <ProtectedRoute roles={['volunteer', 'admin']}>
              <VolunteerDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
