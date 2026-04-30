import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { theme } from '../theme';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'error') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 10000, display: 'flex', flexDirection: 'column', gap: '10px', pointerEvents: 'none' }}>
        <AnimatePresence>
          {notifications.map(n => (
            <NotificationItem key={n.id} notification={n} onDismiss={() => removeNotification(n.id)} />
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

const NotificationItem = ({ notification, onDismiss }) => {
  const config = {
    error: { color: 'var(--error)', icon: <AlertCircle size={20} />, title: 'Attention' },
    success: { color: 'var(--success)', icon: <CheckCircle2 size={20} />, title: 'Succès' },
    info: { color: 'var(--primary)', icon: <Info size={20} />, title: 'Information' }
  };
  const current = config[notification.type] || config.error;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      style={{
        pointerEvents: 'auto',
        background: 'var(--surface)',
        backdropFilter: 'blur(10px)',
        padding: '12px 16px',
        borderRadius: '16px',
        boxShadow: '0 10px 25px var(--shadow-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        border: '1px solid var(--border)',
        borderLeft: `4px solid ${current.color}`,
        minWidth: '300px',
        maxWidth: '400px'
      }}
    >
      <div style={{ color: current.color }}>{current.icon}</div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '800', color: 'var(--text)' }}>{current.title}</p>
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-light)' }}>{notification.message}</p>
      </div>
      <button onClick={onDismiss} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', padding: '4px' }}>
        <X size={16} />
      </button>
    </motion.div>
  );
};

export const useNotification = () => useContext(NotificationContext);
