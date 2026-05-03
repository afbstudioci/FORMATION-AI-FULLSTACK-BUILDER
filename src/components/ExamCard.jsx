import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Lock, CheckCircle2, Sparkles } from 'lucide-react';
import { theme } from '../theme';

const ExamCard = ({ exam, onStart, currentTime = new Date() }) => {
  const start = new Date(exam.startTime);
  const end = new Date(exam.endTime);

  const isLocked = currentTime < start;
  const isExpired = currentTime > end;
  const isOpen = currentTime >= start && currentTime <= end && !exam.hasSubmitted;

  const getCountdown = () => {
    const diff = start - currentTime;
    if (diff <= 0) return null;
    
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const getStatus = () => {
    if (exam.hasSubmitted) return { label: 'Déjà Composé', color: theme.colors.success, icon: <CheckCircle2 size={14} /> };
    if (isLocked) return { label: 'En attente', color: theme.colors.warning, icon: <Clock size={14} className="animate-pulse" /> };
    if (isExpired) return { label: 'Terminé', color: theme.colors.textLight, icon: <Lock size={14} /> };
    return { label: 'Disponible', color: theme.colors.success, icon: <Sparkles size={14} className="animate-pulse" /> };
  };

  const status = getStatus();
  const countdown = getCountdown();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, boxShadow: theme.shadows.large }}
      onClick={() => !exam.hasSubmitted && isOpen && onStart(exam._id)}
      style={{
        background: theme.colors.surface,
        borderRadius: theme.borderRadius.large,
        padding: '24px',
        boxShadow: theme.shadows.medium,
        border: `1px solid ${exam.hasSubmitted ? theme.colors.success : theme.colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        cursor: isOpen ? 'pointer' : 'default',
        opacity: isExpired && !exam.hasSubmitted ? 0.7 : 1
      }}
    >
      {/* Glossy overlay for active exams */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, ${theme.colors.primary}, transparent)`,
            pointerEvents: 'none'
          }}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <AnimatePresence mode="wait">
          <motion.span
            key={status.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{ 
              padding: '6px 14px', 
              borderRadius: '20px', 
              fontSize: '0.7rem', 
              fontWeight: '900', 
              background: `${status.color}15`, 
              color: status.color,
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: `1px solid ${status.color}30`,
              letterSpacing: '0.5px'
            }}
          >
            {status.icon}
            {status.label}
          </motion.span>
        </AnimatePresence>

        {isLocked && countdown && (
          <span style={{ fontSize: '0.8rem', fontWeight: '800', color: theme.colors.warning, fontVariantNumeric: 'tabular-nums' }}>
            {countdown}
          </span>
        )}
      </div>

      <div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: theme.colors.text, marginBottom: '8px', lineHeight: '1.2' }}>{exam.title}</h3>
        <p style={{ color: theme.colors.textLight, fontSize: '0.85rem', fontWeight: '500', minHeight: '40px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{exam.description}</p>
      </div>

      <div style={{ borderTop: `1px solid ${theme.colors.border}`, paddingTop: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.colors.textLight, fontSize: '0.8rem', fontWeight: '600' }}>
          <Calendar size={14} />
          <span>{start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} à {start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.colors.textLight, fontSize: '0.8rem', fontWeight: '600' }}>
          <Clock size={14} />
          <span>Durée estimée : {Math.round((end - start) / 60000)} minutes</span>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: isOpen ? 0.98 : 1 }}
        onClick={(e) => {
          e.stopPropagation();
          !exam.hasSubmitted && isOpen && onStart(exam._id);
        }}
        disabled={!isOpen && !exam.hasSubmitted}
        style={{
          width: '100%',
          padding: '14px',
          background: isOpen ? theme.colors.primary : (exam.hasSubmitted ? `${theme.colors.success}10` : theme.colors.background),
          color: isOpen ? 'white' : (exam.hasSubmitted ? theme.colors.success : theme.colors.textLight),
          borderRadius: theme.borderRadius.medium,
          fontWeight: '900',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          cursor: isOpen ? 'pointer' : 'not-allowed',
          border: exam.hasSubmitted ? `1px solid ${theme.colors.success}` : (isOpen ? 'none' : `1px solid ${theme.colors.border}`),
          boxShadow: isOpen ? `0 8px 20px ${theme.colors.primary}40` : 'none',
          transition: 'all 0.3s ease',
          marginTop: '5px'
        }}
      >
        <AnimatePresence mode="wait">
          {exam.hasSubmitted ? (
            <motion.div key="submitted" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} /> DÉJÀ COMPOSÉ
            </motion.div>
          ) : isLocked ? (
            <motion.div key="locked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={18} /> EN ATTENTE
            </motion.div>
          ) : isExpired ? (
            <motion.div key="expired" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              SESSION TERMINÉE
            </motion.div>
          ) : (
            <motion.div key="start" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              COMMENCER <ArrowRight size={18} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
};

export default ExamCard;
