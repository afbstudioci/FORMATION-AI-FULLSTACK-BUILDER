import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertTriangle, ChevronRight, ChevronLeft, Send, Loader2 } from 'lucide-react';
import api from '../services/api';
import { theme } from '../theme';
import Alert from '../components/Alert';

const ExamSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [timeLeft, setTimeLeft] = useState('');
  const [info, setInfo] = useState({ message: '', type: 'error' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Detection changement d'onglet (Anti-triche)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches(prev => prev + 1);
        setInfo({ message: "Alerte : Changement d'onglet detecte. Penalite de score appliquee.", type: 'error' });
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Chargement de l'examen
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const { data } = await api.get(`/exams/${id}`);
        setExam(data);
        setAnswers(data.questions.map(q => ({ questionId: q._id, selectedOption: null })));
      } catch (err) {
        setInfo({ message: "Impossible de charger l'examen", type: 'error' });
        setTimeout(() => navigate('/'), 2000);
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [id, navigate]);

  // Chronometre synchronise
  useEffect(() => {
    if (!exam) return;
    const timer = setInterval(() => {
      const now = new Date();
      const end = new Date(exam.endTime);
      const diff = end - now;
      
      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft('00:00');
        if (!isSubmitting) handleSubmit(); // Soumission automatique a la fin
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [exam, isSubmitting]);

  const handleAnswerSelect = (option) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion].selectedOption = option;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await api.post('/submissions', {
        examId: id,
        answers,
        tabSwitchesCount: tabSwitches
      });
      setInfo({ message: "Examen soumis avec succes !", type: 'success' });
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setInfo({ message: err.response?.data?.message || "Erreur de soumission", type: 'error' });
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
        <Loader2 style={{ animation: 'spin 1s linear infinite' }} color={theme.colors.primary} size={48} />
        <p style={{ color: theme.colors.textLight }}>Preparation de la session...</p>
      </div>
    );
  }

  const question = exam.questions[currentQuestion];

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', paddingBottom: '40px' }} className="fade-in">
      <Alert message={info.message} type={info.type} onClose={() => setInfo({ ...info, message: '' })} />
      
      {/* Barre d'etat de l'examen */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        background: theme.colors.surface, 
        padding: '24px', 
        borderRadius: theme.borderRadius.large,
        marginBottom: '25px',
        boxShadow: theme.shadows.soft,
        border: `1px solid ${theme.colors.border}`
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: theme.colors.text }}>{exam.title}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.colors.error, fontSize: '0.8rem', fontWeight: '700' }}>
            <AlertTriangle size={14} />
            <span>INFRACTIONS : {tabSwitches}</span>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          color: theme.colors.primary, 
          background: `${theme.colors.primary}10`,
          padding: '10px 20px',
          borderRadius: theme.borderRadius.full,
          border: `1px solid ${theme.colors.primary}30`
        }}>
          <Clock size={24} />
          <span style={{ fontSize: '1.4rem', fontWeight: '900', fontVariantNumeric: 'tabular-nums' }}>{timeLeft}</span>
        </div>
      </div>

      {/* Indicateur de progression */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '30px' }}>
        {exam.questions.map((_, idx) => (
          <div 
            key={idx} 
            onClick={() => setCurrentQuestion(idx)}
            style={{ 
              flex: 1, 
              height: '8px', 
              borderRadius: '4px',
              cursor: 'pointer',
              background: idx === currentQuestion ? theme.colors.primary : (answers[idx]?.selectedOption ? theme.colors.success : theme.colors.border),
              transition: 'all 0.3s ease'
            }} 
          />
        ))}
      </div>

      {/* Zone de Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          style={{ 
            background: theme.colors.surface, 
            padding: '45px', 
            borderRadius: theme.borderRadius.large, 
            boxShadow: theme.shadows.medium,
            border: `1px solid ${theme.colors.border}`
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <span style={{ color: theme.colors.primary, fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase' }}>Question {currentQuestion + 1}</span>
            <span style={{ color: theme.colors.textLight, fontSize: '0.85rem' }}>{currentQuestion + 1} / {exam.questions.length}</span>
          </div>
          
          <h3 style={{ fontSize: '1.35rem', marginBottom: '35px', color: theme.colors.text, lineHeight: '1.4', fontWeight: '700' }}>
            {question.text}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(option)}
                style={{
                  padding: '18px 24px',
                  borderRadius: theme.borderRadius.medium,
                  border: `2px solid ${answers[currentQuestion].selectedOption === option ? theme.colors.primary : theme.colors.border}`,
                  background: answers[currentQuestion].selectedOption === option ? `${theme.colors.primary}08` : 'transparent',
                  textAlign: 'left',
                  fontSize: '1.05rem',
                  fontWeight: '600',
                  color: answers[currentQuestion].selectedOption === option ? theme.colors.primary : theme.colors.text,
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px'
                }}
              >
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  border: `2px solid ${answers[currentQuestion].selectedOption === option ? theme.colors.primary : theme.colors.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  color: answers[currentQuestion].selectedOption === option ? 'white' : theme.colors.textLight,
                  background: answers[currentQuestion].selectedOption === option ? theme.colors.primary : 'transparent'
                }}>
                  {String.fromCharCode(65 + idx)}
                </div>
                {option}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '35px', alignItems: 'center' }}>
        <button
          disabled={currentQuestion === 0}
          onClick={() => setCurrentQuestion(prev => prev - 1)}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: theme.colors.textLight, 
            fontWeight: '700', 
            fontSize: '0.95rem',
            opacity: currentQuestion === 0 ? 0.3 : 1,
            background: 'transparent'
          }}
        >
          <ChevronLeft size={20} /> Precedent
        </button>

        <div style={{ display: 'flex', gap: '15px' }}>
          {currentQuestion === exam.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{ 
                padding: '14px 35px', 
                background: theme.colors.success, 
                color: 'white', 
                borderRadius: theme.borderRadius.full, 
                fontWeight: '800', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                boxShadow: `0 8px 20px rgba(0, 184, 148, 0.3)`,
                fontSize: '1rem'
              }}
            >
              {isSubmitting ? 'Soumission...' : <><Send size={18} /> Finaliser l'examen</>}
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(prev => prev + 1)}
              style={{ 
                padding: '14px 30px',
                background: theme.colors.primary,
                color: 'white',
                borderRadius: theme.borderRadius.full,
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                fontWeight: '700',
                boxShadow: `0 8px 20px rgba(9, 132, 227, 0.2)`
              }}
            >
              Suivant <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamSession;
