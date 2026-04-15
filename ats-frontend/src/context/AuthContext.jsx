import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    const data = response.data.data;
    const userData = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
    };
    setToken(data.token);
    setUser(userData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  };

  const register = async (formData) => {
    const response = await authAPI.register(formData);
    const data = response.data.data;
    const userData = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
    };
    setToken(data.token);
    setUser(userData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAdmin = () => user?.role === 'ADMIN';
  const isRecruiter = () => user?.role === 'RECRUITER';
  const isCandidate = () => user?.role === 'CANDIDATE';
  const isAuthenticated = () => !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isRecruiter,
        isCandidate,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
