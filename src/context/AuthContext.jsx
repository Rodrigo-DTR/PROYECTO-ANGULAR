import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('usuario');
      const tk = localStorage.getItem('token');
      setUser(raw ? JSON.parse(raw) : null);
      setToken(tk || null);
    } catch (e) {
      setUser(null);
      setToken(null);
    }
  }, []);

  const login = (userData, newToken) => {
    try {
      if (userData) {
        localStorage.setItem('usuario', JSON.stringify(userData));
        setUser(userData);
      }
      if (newToken) {
        localStorage.setItem('token', newToken);
        setToken(newToken);
      }
    } catch (e) {
      console.error('Error guardando auth en localStorage', e);
    }
  };

  const logout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
