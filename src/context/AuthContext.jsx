import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('userData');
        if (token && storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Auth check failed", error);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = (userData, accessToken) => {
    setUser(userData);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
