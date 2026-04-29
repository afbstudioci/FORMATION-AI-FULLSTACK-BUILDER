import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Lock } from 'lucide-react';
import { theme } from '../theme';

const ExamCard = ({ exam, onStart }) => {
  const now = new Date();
  const start = new Date(exam.startTime);
  const end = new Date(exam.endTime);

  const isLocked = now < start;
  const isExpired = now > end;
  const isOpen = now >= start && now <= end;

  const getStatus = () => {
    if (isLocked) return { label: 'A venir', color: theme.colors.warning };
    if (isExpired) return { label: 'Termine', color: theme.colors.textLight };
    return { label: 'Disponible', color: theme.colors.success };
  };

  const status = getStatus();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      style={{
        background: theme.colors.surface,
        borderRadius: theme.borderRadius.large,
        padding: '24px',
        boxShadow: theme.shadows.medium,
        border: `1px solid ${theme.colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ 
          padding: '4px 12px', 
          borderRadius: '20px', 
          fontSize: '0.75rem', 
          fontWeight: '700', 
          background: `${status.color}20`, 
          color: status.color,
          textTransform: 'uppercase'
        }}>
          {status.label}
        </span>
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: theme.colors.text }}>{exam.title}</h3>
      <p style={{ color: theme.colors.textLight, fontSize: '0.9rem', flex: 1, minHeight: '40px' }}>{exam.description}</p>

      <div style={{ borderTop: `1px solid ${theme.colors.border}`, paddingTop: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.colors.textLight, fontSize: '0.85rem' }}>
          <Calendar size={16} />
          <span>Debut : {start.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.colors.textLight, fontSize: '0.85rem' }}>
          <Clock size={16} />
          <span>Fin : {end.toLocaleString()}</span>
        </div>
      </div>

      <button
        onClick={() => onStart(exam._id)}
        disabled={!isOpen}
        style={{
          width: '100%',
          padding: '12px',
          background: isOpen ? theme.colors.primary : theme.colors.background,
          color: isOpen ? 'white' : theme.colors.textLight,
          borderRadius: theme.borderRadius.medium,
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          opacity: isExpired ? 0.6 : 1
        }}
      >
        {isLocked ? <><Lock size={18} /> Verrouille</> : isExpired ? 'Session close' : <><ArrowRight size={18} /> Commencer</>}
      </button>
    </motion.div>
  );
};

export default ExamCard;
