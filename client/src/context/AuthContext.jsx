import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, if a token exists, fetch the current user.
  useEffect(() => {
    const token = localStorage.getItem('bachao_token');
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem('bachao_token'))
      .finally(() => setLoading(false));
  }, []);

  const handleAuth = (data) => {
    localStorage.setItem('bachao_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const login = useCallback(async (credentials) => {
    const res = await authApi.login(credentials);
    return handleAuth(res.data);
  }, []);

  const register = useCallback(async (info) => {
    const res = await authApi.register(info);
    return handleAuth(res.data);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('bachao_token');
    setUser(null);
  }, []);

  // Lets pages update the cached user (e.g. after editing the profile or
  // creating an organization that changes the user's linked org).
  const refresh = useCallback(async () => {
    try {
      const res = await authApi.me();
      setUser(res.data);
      return res.data;
    } catch {
      return null;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
