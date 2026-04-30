import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { theme } from '../theme';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Supprimer", cancelText = "Annuler", type = "danger" }) => {
  if (!isOpen) return null;

  const isDanger = type === "danger";

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        {/* Overlay flouté */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onCancel}
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          style={{
            position: 'relative',
            background: 'var(--background)',
            width: '100%',
            maxWidth: '450px',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: 'var(--shadow-premium)',
            textAlign: 'center',
            border: '1px solid var(--border)'
          }}
        >
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            background: isDanger ? 'rgba(214, 48, 49, 0.1)' : 'rgba(9, 132, 227, 0.1)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 24px',
            color: isDanger ? 'var(--error)' : 'var(--primary)'
          }}>
            <AlertTriangle size={40} />
          </div>

          <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: theme.colors.text, marginBottom: '12px' }}>{title}</h3>
          <p style={{ color: theme.colors.textLight, lineHeight: '1.6', marginBottom: '32px' }}>{message}</p>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button 
              onClick={onCancel}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '12px',
                border: `1px solid var(--border)`,
                background: 'var(--surface)',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {cancelText}
            </button>
            <button 
              onClick={onConfirm}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: isDanger ? theme.colors.error : theme.colors.primary,
                color: 'white',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: `0 8px 16px ${isDanger ? theme.colors.error : theme.colors.primary}30`
              }}
            >
              {confirmText}
            </button>
          </div>

          <button onClick={onCancel} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', cursor: 'pointer', color: theme.colors.textLight }}><X size={20} /></button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmModal;
