import { createContext, useContext, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

  const login = async (payload) => {
    const { data } = await api.post('/auth/login', payload);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const loginWithGoogle = async (profile) => {
    const { data } = await api.post('/auth/google', profile);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const register = (payload) => api.post('/auth/register', payload);
  const logout = () => { localStorage.clear(); setUser(null); };

  return <AuthContext.Provider value={{ user, login, register, logout, loginWithGoogle }}>{children}</AuthContext.Provider>;
};
