import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertTriangle, ChevronRight, ChevronLeft, Send, Loader2, DoorOpen } from 'lucide-react';
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
  
  const answersRef = useRef([]); // Pour garder trace dans l'unload
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
        setInfo({ message: "Alerte : Changement d'onglet detecte. Penalite de score appliquee.", type: 'error' });
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Detection de tentative de sortie (Fermeture onglet ou retour)
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
  }, [isSubmitting]);

  // Chargement de l'examen et verification de tentative unique
  useEffect(() => {
    const fetchExam = async () => {
      try {
        // Verifier si deja soumis
        const { data: mySubmissions } = await api.get('/submissions/my');
        if (mySubmissions.some(s => s.exam?._id === id)) {
          setInfo({ message: "Vous avez deja compose pour cet examen. Tentative unique autorisee.", type: 'error' });
          setTimeout(() => navigate('/'), 3000);
          return;
        }

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

  // Chronometre
  useEffect(() => {
    if (!exam) return;
    const timer = setInterval(() => {
      const now = new Date();
      const end = new Date(exam.endTime);
      const diff = end - now;
      
      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft('00:00');
        if (!isSubmitting) handleSubmit('COMPLETED'); 
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
      setInfo({ 
        message: status === 'ABANDONED' ? "Session interrompue. Votre copie a ete envoyee avec la mention ABANDON." : "Examen soumis avec succes !", 
        type: status === 'ABANDONED' ? 'error' : 'success' 
      });
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setInfo({ message: err.response?.data?.message || "Erreur de soumission", type: 'error' });
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
        <Loader2 className="animate-spin" color={theme.colors.primary} size={48} />
        <p style={{ color: theme.colors.textLight }}>Verification de la session...</p>
      </div>
    );
  }

  const question = exam.questions[currentQuestion];

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', paddingBottom: '40px' }} className="fade-in">
      <Alert message={info.message} type={info.type} onClose={() => setInfo({ ...info, message: '' })} />
      
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '24px', 
        borderRadius: theme.borderRadius.large, marginBottom: '25px', boxShadow: theme.shadows.soft, border: `1px solid ${theme.colors.border}`
      }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '900', color: theme.colors.text }}>{exam.title}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.colors.error, fontSize: '0.8rem', fontWeight: '800' }}>
            <AlertTriangle size={14} /> <span>ALERTES : {tabSwitches}</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: theme.colors.primary, background: `${theme.colors.primary}08`, padding: '12px 25px', borderRadius: '15px', border: `1px solid ${theme.colors.primary}20` }}>
          <Clock size={24} />
          <span style={{ fontSize: '1.6rem', fontWeight: '900', fontVariantNumeric: 'tabular-nums' }}>{timeLeft}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '35px' }}>
        {exam.questions.map((_, idx) => (
          <div key={idx} onClick={() => !isSubmitting && setCurrentQuestion(idx)}
            style={{ flex: 1, height: '10px', borderRadius: '5px', cursor: 'pointer', background: idx === currentQuestion ? theme.colors.primary : (answers[idx]?.selectedOption ? theme.colors.success : '#e0e0e0'), transition: 'all 0.3s' }} 
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentQuestion} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
          style={{ background: 'white', padding: window.innerWidth < 768 ? '25px' : '50px', borderRadius: '24px', boxShadow: theme.shadows.medium, border: `1px solid ${theme.colors.border}`, position: 'relative' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
            <span style={{ color: theme.colors.primary, fontWeight: '800', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Question {currentQuestion + 1}</span>
            <span style={{ color: theme.colors.textLight, fontWeight: '700' }}>{currentQuestion + 1} / {exam.questions.length}</span>
          </div>
          
          <h3 style={{ fontSize: '1.5rem', marginBottom: '40px', color: theme.colors.text, lineHeight: '1.5', fontWeight: '800' }}>{question.text}</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {question.options.map((option, idx) => (
              <button key={idx} onClick={() => handleAnswerSelect(option)}
                style={{
                  padding: '20px 30px', borderRadius: '15px', border: `2px solid ${answers[currentQuestion].selectedOption === option ? theme.colors.primary : theme.colors.border}`,
                  background: answers[currentQuestion].selectedOption === option ? `${theme.colors.primary}05` : 'white',
                  textAlign: 'left', fontSize: '1.1rem', fontWeight: '600', color: theme.colors.text, display: 'flex', alignItems: 'center', gap: '20px', transition: 'all 0.2s'
                }}
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid currentColor', display: 'flex', alignItems: 'center', justifyContent: 'center', background: answers[currentQuestion].selectedOption === option ? theme.colors.primary : 'transparent', color: answers[currentQuestion].selectedOption === option ? 'white' : theme.colors.textLight }}>
                  {String.fromCharCode(65 + idx)}
                </div>
                {option}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', alignItems: 'center' }}>
        <button disabled={currentQuestion === 0} onClick={() => setCurrentQuestion(prev => prev - 1)} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.colors.textLight, fontWeight: '800', opacity: currentQuestion === 0 ? 0.3 : 1, background: 'none', border: 'none' }}>
          <ChevronLeft size={24} /> Précedent
        </button>

        <div style={{ display: 'flex', gap: '20px' }}>
          <button onClick={() => { if(window.confirm("Voulez-vous vraiment abandonner l'examen ? Une copie vide sera soumise.")) handleSubmit('ABANDONED'); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.colors.error, background: 'none', border: 'none', fontWeight: '700', fontSize: '0.9rem' }}>
            <DoorOpen size={18} /> Abandonner
          </button>
          
          {currentQuestion === exam.questions.length - 1 ? (
            <button onClick={() => handleSubmit('COMPLETED')} disabled={isSubmitting} style={{ padding: '16px 45px', background: theme.colors.success, color: 'white', borderRadius: '50px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: `0 10px 25px ${theme.colors.success}40` }}>
              {isSubmitting ? 'Traitement...' : <><Send size={20} /> Terminer maintenant</>}
            </button>
          ) : (
            <button onClick={() => setCurrentQuestion(prev => prev + 1)} style={{ padding: '16px 40px', background: theme.colors.primary, color: 'white', borderRadius: '50px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: `0 10px 25px ${theme.colors.primary}30` }}>
              Suivant <ChevronRight size={22} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamSession;
