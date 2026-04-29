import React, { createContext, useState, useEffect, useContext } from 'react';
import socket from '../services/socket';

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

  // Écoute temps réel du changement de rôle
  useEffect(() => {
    if (!user) return;

    socket.on('role_updated', (data) => {
      if (data.userId === user._id) {
        const updatedUser = { ...user, role: data.newRole };
        setUser(updatedUser);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        
        // Notification visuelle
        alert(`Vos droits ont été mis à jour : vous êtes désormais ${data.newRole.toUpperCase()}`);
        
        // Redirection si nécessaire (ex: vers le dashboard admin)
        if (data.newRole === 'admin') window.location.href = '/admin';
        else window.location.href = '/';
      }
    });

    return () => socket.off('role_updated');
  }, [user]);

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
