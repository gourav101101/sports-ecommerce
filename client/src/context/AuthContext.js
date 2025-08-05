import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import authService from '../services/authService';

const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 1. ADD a loading state, initially true

  useEffect(() => {
    try {
      const token = localStorage.getItem('userToken');
      if (token) {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          authService.logout();
          setUser(null);
        } else {
          setUser({ token, ...decoded });
        }
      }
    } catch (error) {
      // If any error occurs (e.g., invalid token), ensure user is logged out
      authService.logout();
      setUser(null);
    } finally {
      // 2. ALWAYS set loading to false after the check is complete
      setLoading(false);
    }
  }, []);

  const login = async (userData) => {
    const data = await authService.login(userData);
    const decoded = jwtDecode(data.token);
    setUser({ token: data.token, ...decoded });
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    loading, // 3. EXPORT the loading state
    login,
    logout,
  };

  // 4. PREVENT rendering children until the initial auth check is done
  return (
      <AuthContext.Provider value={value}>
        {!loading && children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};