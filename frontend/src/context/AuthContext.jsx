import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('taskplanet_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('taskplanet_user');
    const savedToken = localStorage.getItem('taskplanet_token');

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (error) {
        localStorage.removeItem('taskplanet_user');
        localStorage.removeItem('taskplanet_token');
      }
    }
    setLoading(false);
  }, []);

  const signup = async (username, email, password) => {
    const response = await api.post('/api/auth/signup', { username, email, password });
    return response.data;
  };

  const login = async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    if (response.data && response.data.success) {
      const { user: userData, token: tokenData } = response.data.data;
      setUser(userData);
      setToken(tokenData);
      localStorage.setItem('taskplanet_user', JSON.stringify(userData));
      localStorage.setItem('taskplanet_token', tokenData);
    }
    return response.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('taskplanet_user');
    localStorage.removeItem('taskplanet_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
