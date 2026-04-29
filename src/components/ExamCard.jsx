import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { theme } from '../theme';

const ExamCard = ({ exam, onStart }) => {
  const now = new Date();
  const start = new Date(exam.startTime);
  const end = new Date(exam.endTime);

  const isLocked = now < start;
  const isExpired = now > end;
  const isOpen = now >= start && now <= end && !exam.hasSubmitted;

  const getStatus = () => {
    if (exam.hasSubmitted) return { label: 'Déjà Composé', color: theme.colors.success };
    if (isLocked) return { label: 'À venir', color: theme.colors.warning };
    if (isExpired) return { label: 'Terminé', color: theme.colors.textLight };
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
        border: `1px solid ${exam.hasSubmitted ? theme.colors.success : theme.colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        opacity: isExpired && !exam.hasSubmitted ? 0.7 : 1
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ 
          padding: '4px 12px', 
          borderRadius: '20px', 
          fontSize: '0.75rem', 
          fontWeight: '800', 
          background: `${status.color}20`, 
          color: status.color,
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          {exam.hasSubmitted && <CheckCircle2 size={14} />}
          {status.label}
        </span>
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: theme.colors.text }}>{exam.title}</h3>
      <p style={{ color: theme.colors.textLight, fontSize: '0.9rem', flex: 1, minHeight: '40px' }}>{exam.description}</p>

      <div style={{ borderTop: `1px solid ${theme.colors.border}`, paddingTop: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.colors.textLight, fontSize: '0.85rem' }}>
          <Calendar size={16} />
          <span>Début : {start.toLocaleString('fr-FR')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.colors.textLight, fontSize: '0.85rem' }}>
          <Clock size={16} />
          <span>Fin : {end.toLocaleString('fr-FR')}</span>
        </div>
      </div>

      <button
        onClick={() => !exam.hasSubmitted && onStart(exam._id)}
        disabled={!isOpen}
        style={{
          width: '100%',
          padding: '12px',
          background: isOpen ? theme.colors.primary : (exam.hasSubmitted ? `${theme.colors.success}10` : theme.colors.background),
          color: isOpen ? 'white' : (exam.hasSubmitted ? theme.colors.success : theme.colors.textLight),
          borderRadius: theme.borderRadius.medium,
          fontWeight: '800',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          cursor: isOpen ? 'pointer' : 'not-allowed',
          border: exam.hasSubmitted ? `1px solid ${theme.colors.success}` : 'none'
        }}
      >
        {exam.hasSubmitted ? (
          <><CheckCircle2 size={18} /> Déjà composé</>
        ) : isLocked ? (
          <><Lock size={18} /> Verrouillé</>
        ) : isExpired ? (
          'Session close'
        ) : (
          <><ArrowRight size={18} /> Commencer</>
        )}
      </button>
    </motion.div>
  );
};

export default ExamCard;
