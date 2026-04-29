import React, { createContext, useState, useEffect, useContext } from 'react';
import { socket } from '../services/socket';
import Alert from '../components/Alert';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          // On récupère le profil frais depuis le serveur pour synchroniser la photo, le rôle, etc.
          const { data } = await api.get('/users/profile');
          const userData = { ...data.user, accessToken: token };
          setUser(userData);
          localStorage.setItem('userData', JSON.stringify(userData));
        }
      } catch (error) {
        console.error("Auth check failed, user might be logged out", error);
        // Si le refresh échoue, on peut garder ce qu'on a en local ou vider
        const storedUser = localStorage.getItem('userData');
        if (storedUser) setUser(JSON.parse(storedUser));
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  // Écoute temps réel du changement de rôle
  useEffect(() => {
    socket.on('role_updated', (data) => {
      if (data.userId === user?._id) {
        const updatedUser = { ...user, role: data.newRole };
        setUser(updatedUser);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        setRoleUpdateNotification(`Vos droits ont été mis à jour : vous êtes désormais ${data.newRole.toUpperCase()}`);
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
