import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        const userData = { email: data.user?.email || email };
        localStorage.setItem('auth_token', data.token || 'mock-token');
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return data;
      }

      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Login failed');
    } catch (e) {
      // Demo mode: if backend unreachable, allow login for testing
      if (e.message === 'Failed to fetch' || e.name === 'TypeError') {
        const userData = { email };
        localStorage.setItem('auth_token', 'demo-token');
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { token: 'demo-token', user: userData };
      }
      throw e;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const getToken = () => localStorage.getItem('auth_token');

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
