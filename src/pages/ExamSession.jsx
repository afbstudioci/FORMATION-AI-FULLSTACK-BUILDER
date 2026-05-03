import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertTriangle, ChevronRight, ChevronLeft, Send, Loader2, DoorOpen } from 'lucide-react';
import api from '../services/api';
import { theme } from '../theme';
import { useNotification } from '../context/NotificationContext';
import ConfirmModal from '../components/ConfirmModal';

const ExamSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [timeLeft, setTimeLeft] = useState('');
  const [timePercent, setTimePercent] = useState(100);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmAbandon, setShowConfirmAbandon] = useState(false);
  
  const answersRef = useRef([]);
  const tabSwitchesRef = useRef(0);

  useEffect(() => {
    answersRef.current = answers;
    tabSwitchesRef.current = tabSwitches;
  }, [answers, tabSwitches]);

  // Detection changement d'onglet (Anti-triche)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches(prev => prev + 1);
        addNotification("Attention : Changement d'onglet détecté !", 'error');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    const handleBeforeUnload = (e) => {
      if (!isSubmitting) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isSubmitting, addNotification]);

  // Chargement de l'examen
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const { data } = await api.get(`/exams/${id}`);
        setExam(data);
        setAnswers(data.questions.map(q => ({ questionId: q._id, selectedOption: null })));
        
        // Brûler la tentative unique dès que l'étudiant entre
        await api.post('/submissions/start', { examId: id });
      } catch (err) {
        addNotification(err.response?.data?.message || "Impossible de charger l'examen", 'error');
        setTimeout(() => navigate('/dashboard'), 2000);
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [id, navigate, addNotification]);

  // Chronometre
  useEffect(() => {
    if (!exam) return;
    const startTime = new Date(exam.startTime).getTime();
    const endTime = new Date(exam.endTime).getTime();
    const totalDuration = endTime - startTime;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = endTime - now;
      
      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft('00:00');
        setTimePercent(0);
        if (!isSubmitting) handleSubmit('COMPLETED'); 
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
        setTimePercent((diff / totalDuration) * 100);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [exam, isSubmitting]);

  const handleAnswerSelect = (option) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion].selectedOption = option;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (status = 'COMPLETED') => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await api.post('/submissions', {
        examId: id,
        answers: answersRef.current,
        tabSwitchesCount: tabSwitchesRef.current,
        status: status
      });
      addNotification(status === 'ABANDONED' ? "Session interrompue." : "Examen soumis avec succès !", status === 'ABANDONED' ? 'error' : 'success');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      addNotification(err.response?.data?.message || "Erreur de soumission", 'error');
      setIsSubmitting(false);
    }
  };

  if (loading || !exam) {
    return (
      <div style={{ height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
        <Loader2 className="animate-spin" color="var(--primary)" size={48} />
        <p style={{ color: 'var(--text-light)' }}>Préparation de la session...</p>
      </div>
    );
  }

  const question = exam.questions[currentQuestion];
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (timePercent / 100) * circumference;

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', padding: '0 15px 40px 15px' }} className="fade-in">
      
      <div style={{ 
        display: 'flex', flexDirection: window.innerWidth < 600 ? 'column' : 'row', justifyContent: 'space-between', alignItems: window.innerWidth < 600 ? 'stretch' : 'center', background: 'var(--surface)', padding: window.innerWidth < 600 ? '16px' : '24px', 
        borderRadius: '20px', marginBottom: '25px', boxShadow: 'var(--shadow-soft)', border: '1px solid var(--border)', gap: '15px'
      }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: window.innerWidth < 600 ? '1rem' : '1.2rem', fontWeight: '900', color: 'var(--text)' }}>{exam.title}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--error)', fontSize: '0.75rem', fontWeight: '800', marginTop: '4px' }}>
            <AlertTriangle size={14} /> <span>ALERTES : {tabSwitches}</span>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--primary)', background: 'var(--background)', padding: '8px 20px', borderRadius: '15px', border: '1px solid var(--border)', alignSelf: window.innerWidth < 600 ? 'center' : 'auto'
        }}>
          <div style={{ position: 'relative', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ transform: 'rotate(-90deg)', width: '56px', height: '56px' }}>
              <circle cx="28" cy="28" r={radius} fill="transparent" stroke="var(--border)" strokeWidth="4" />
              <motion.circle cx="28" cy="28" r={radius} fill="transparent" stroke="var(--primary)" strokeWidth="4" strokeDasharray={circumference} animate={{ strokeDashoffset: offset }} strokeLinecap="round" />
            </svg>
            <Clock size={20} style={{ position: 'absolute' }} />
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: '900', fontVariantNumeric: 'tabular-nums' }}>{timeLeft}</span>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-light)' }}>
          <span>Progression</span>
          <span>{currentQuestion + 1} / {exam.questions.length}</span>
        </div>
        <div style={{ width: '100%', height: '10px', background: 'var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / exam.questions.length) * 100}%` }}
            style={{ height: '100%', background: 'var(--primary)', borderRadius: '10px' }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          style={{ background: 'var(--surface)', padding: window.innerWidth < 768 ? '25px' : '45px', borderRadius: '24px', boxShadow: 'var(--shadow-medium)', border: '1px solid var(--border)', position: 'relative' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <span style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Question {currentQuestion + 1}</span>
            <span style={{ color: 'var(--text-light)', fontWeight: '700', fontSize: '0.85rem' }}>{currentQuestion + 1} / {exam.questions.length}</span>
          </div>
          
          <h3 style={{ fontSize: window.innerWidth < 768 ? '1.25rem' : '1.5rem', marginBottom: '30px', color: 'var(--text)', lineHeight: '1.4', fontWeight: '800' }}>{question.text}</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {question.options.map((option, idx) => (
              <button key={idx} onClick={() => handleAnswerSelect(option)}
                style={{
                  padding: window.innerWidth < 768 ? '15px 20px' : '18px 25px', borderRadius: '14px', border: `2px solid ${answers[currentQuestion].selectedOption === option ? 'var(--primary)' : 'var(--border)'}`,
                  background: answers[currentQuestion].selectedOption === option ? 'var(--background)' : 'var(--surface)',
                  textAlign: 'left', fontSize: window.innerWidth < 768 ? '0.95rem' : '1.05rem', fontWeight: '600', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '15px', transition: 'all 0.2s'
                }}
              >
                <div style={{ width: '26px', height: '26px', minWidth: '26px', borderRadius: '50%', border: '2px solid currentColor', display: 'flex', alignItems: 'center', justifyContent: 'center', background: answers[currentQuestion].selectedOption === option ? 'var(--primary)' : 'transparent', color: answers[currentQuestion].selectedOption === option ? 'white' : 'var(--text-light)', fontSize: '0.8rem' }}>
                  {String.fromCharCode(65 + idx)}
                </div>
                {option}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div style={{ display: 'flex', flexDirection: window.innerWidth < 500 ? 'column' : 'row', justifyContent: 'space-between', marginTop: '30px', alignItems: 'center', gap: '20px' }}>
        <button disabled={currentQuestion === 0} onClick={() => setCurrentQuestion(prev => prev - 1)} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-light)', fontWeight: '800', opacity: currentQuestion === 0 ? 0.3 : 1, background: 'none', border: 'none', fontSize: '0.9rem' }}>
          <ChevronLeft size={20} /> Précédent
        </button>

        <div style={{ display: 'flex', gap: '15px', width: window.innerWidth < 500 ? '100%' : 'auto' }}>
          <button onClick={() => setShowConfirmAbandon(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--error)', background: 'none', border: 'none', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>
             Abandonner
          </button>
          
          {currentQuestion === exam.questions.length - 1 ? (
            <button onClick={() => handleSubmit('COMPLETED')} disabled={isSubmitting} style={{ flex: 1, padding: '14px 30px', background: 'var(--success)', color: 'white', borderRadius: '50px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 8px 20px rgba(0, 184, 148, 0.3)', cursor: 'pointer', fontSize: '0.95rem' }}>
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <><Send size={18} /> Terminer</>}
            </button>
          ) : (
            <button onClick={() => setCurrentQuestion(prev => prev + 1)} style={{ flex: 1, padding: '14px 30px', background: 'var(--primary)', color: 'white', borderRadius: '50px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 20px rgba(9, 132, 227, 0.3)', cursor: 'pointer', fontSize: '0.95rem' }}>
              Suivant <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>

      <ConfirmModal 
        isOpen={showConfirmAbandon}
        title="Abandonner l'examen ?"
        message="Attention : En abandonnant maintenant, une copie vide sera soumise et vous ne pourrez plus retenter cette épreuve. Voulez-vous vraiment continuer ?"
        confirmText="Oui, abandonner"
        cancelText="Rester et continuer"
        onConfirm={() => { setShowConfirmAbandon(false); handleSubmit('ABANDONED'); }}
        onCancel={() => setShowConfirmAbandon(false)}
      />
    </div>
  );
};

export default ExamSession;
