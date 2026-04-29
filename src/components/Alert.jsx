import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, X, Info } from 'lucide-react';
import { theme } from '../theme';

const Alert = ({ message, type = 'error', onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const config = {
    error: { color: theme.colors.error, icon: <AlertCircle size={22} />, bg: '#fff5f5' },
    success: { color: theme.colors.success, icon: <CheckCircle2 size={22} />, bg: '#f6ffed' },
    info: { color: theme.colors.primary, icon: <Info size={22} />, bg: '#e6f7ff' }
  };

  const current = config[type] || config.error;

  return (
    <AnimatePresence>
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 300 }}
        dragElastic={0.7}
        onDragEnd={(e, info) => {
          if (info.offset.x > 150) {
            onClose();
          }
        }}
        initial={{ opacity: 0, x: 100, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 100, scale: 0.9, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98 }}
        style={{
          position: 'fixed',
          top: '25px',
          right: '25px',
          zIndex: 9999,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
          padding: '16px 20px',
          borderRadius: '20px',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          border: `1px solid ${theme.colors.border}`,
          borderLeft: `6px solid ${current.color}`,
          minWidth: '350px',
          maxWidth: '450px',
          cursor: 'grab',
          userSelect: 'none'
        }}
      >
        <div style={{ 
          background: `${current.color}15`, 
          padding: '10px', 
          borderRadius: '14px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: current.color 
        }}>
          {current.icon}
        </div>

        <div style={{ flex: 1 }}>
          <p style={{ 
            margin: 0, 
            fontSize: '0.95rem', 
            fontWeight: '800', 
            color: theme.colors.text,
            lineHeight: '1.4'
          }}>
            {type === 'error' ? 'Attention' : (type === 'success' ? 'Succès' : 'Information')}
          </p>
          <p style={{ 
            margin: 0, 
            fontSize: '0.85rem', 
            fontWeight: '500', 
            color: theme.colors.textLight 
          }}>
            {message}
          </p>
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); onClose(); }} 
          style={{ 
            background: '#f1f2f6', 
            border: 'none',
            color: theme.colors.textLight,
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <X size={16} />
        </button>

        {/* Barre de progression automatique */}
        <motion.div 
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 5, ease: "linear" }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '3px',
            background: current.color,
            opacity: 0.3,
            borderRadius: '0 0 0 20px'
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default Alert;
