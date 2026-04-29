import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { theme } from '../theme';

const Alert = ({ message, type = 'error', onClose }) => {
  if (!message) return null;

  const config = {
    error: { color: theme.colors.error, icon: <AlertCircle size={20} /> },
    success: { color: theme.colors.success, icon: <CheckCircle2 size={20} /> }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, x: '-50%' }}
        animate={{ opacity: 1, y: 0, x: '-50%' }}
        exit={{ opacity: 0, y: -20, x: '-50%' }}
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          zIndex: 1000,
          background: theme.colors.surface,
          padding: '12px 20px',
          borderRadius: theme.borderRadius.medium,
          boxShadow: theme.shadows.premium,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderLeft: `5px solid ${config[type]?.color || theme.colors.error}`,
          minWidth: '320px'
        }}
      >
        <span style={{ color: config[type]?.color || theme.colors.error }}>
          {config[type]?.icon || <AlertCircle size={20} />}
        </span>
        <span style={{ flex: 1, fontSize: '0.9rem', fontWeight: '500', color: theme.colors.text }}>{message}</span>
        <button 
          onClick={onClose} 
          style={{ 
            background: 'transparent', 
            color: theme.colors.textLight,
            padding: '4px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default Alert;
