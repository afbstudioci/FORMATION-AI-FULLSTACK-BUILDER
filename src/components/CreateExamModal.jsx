import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2, Save, Calendar, Clock } from 'lucide-react';
import api from '../services/api';
import { theme } from '../theme';

const CreateExamModal = ({ onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    questions: [{ text: '', options: ['', '', '', ''], correctAnswer: '' }]
  });

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { text: '', options: ['', '', '', ''], correctAnswer: '' }]
    });
  };

  const removeQuestion = (index) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: newQuestions });
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index][field] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const updateOption = (qIndex, oIndex, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].options[oIndex] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation basique
    if (formData.questions.some(q => !q.correctAnswer)) {
      alert("Veuillez selectionner une bonne reponse pour chaque question");
      return;
    }

    try {
      await api.post('/exams', formData);
      onCreated();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Erreur de creation");
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{ background: 'white', width: '100%', maxWidth: '850px', maxHeight: '90vh', borderRadius: theme.borderRadius.large, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: theme.shadows.premium }}
      >
        <div style={{ padding: '24px', borderBottom: `1px solid ${theme.colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: theme.colors.background }}>
          <h2 style={{ fontWeight: '900', color: theme.colors.text, fontSize: '1.4rem' }}>Configuration de l'epreuve</h2>
          <button onClick={onClose} style={{ background: 'white', border: `1px solid ${theme.colors.border}`, padding: '8px', borderRadius: '50%', display: 'flex' }}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontWeight: '800', marginBottom: '10px', fontSize: '0.9rem', color: theme.colors.text }}>TITRE DU TP / DEVOIR</label>
              <input 
                type="text" 
                required 
                placeholder="Ex: Examen Final React JS"
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                style={{ width: '100%', padding: '14px', borderRadius: '10px', border: `2px solid ${theme.colors.border}`, fontSize: '1rem', outline: 'none' }}
              />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontWeight: '800', marginBottom: '10px', fontSize: '0.9rem', color: theme.colors.text }}>DESCRIPTION COURTE</label>
              <textarea 
                value={formData.description} 
                placeholder="Consignes particulieres..."
                onChange={e => setFormData({...formData, description: e.target.value})} 
                style={{ width: '100%', padding: '14px', borderRadius: '10px', border: `2px solid ${theme.colors.border}`, fontSize: '1rem', minHeight: '80px', outline: 'none', resize: 'vertical' }}
              />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', marginBottom: '10px', fontSize: '0.9rem', color: theme.colors.success }}>
                <Calendar size={16} /> DEBUT OFFICIEL
              </label>
              <input 
                type="datetime-local" 
                required 
                value={formData.startTime} 
                onChange={e => setFormData({...formData, startTime: e.target.value})} 
                style={{ width: '100%', padding: '14px', borderRadius: '10px', border: `2px solid ${theme.colors.border}`, fontSize: '1rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', marginBottom: '10px', fontSize: '0.9rem', color: theme.colors.error }}>
                <Clock size={16} /> FIN DE SESSION
              </label>
              <input 
                type="datetime-local" 
                required 
                value={formData.endTime} 
                onChange={e => setFormData({...formData, endTime: e.target.value})} 
                style={{ width: '100%', padding: '14px', borderRadius: '10px', border: `2px solid ${theme.colors.border}`, fontSize: '1rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderTop: `1px solid ${theme.colors.border}`, paddingTop: '30px' }}>
            <h3 style={{ fontWeight: '900', fontSize: '1.2rem' }}>Questions ({formData.questions.length})</h3>
            <button 
              type="button" 
              onClick={addQuestion} 
              style={{ background: theme.colors.secondary, color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}
            >
              <Plus size={18} /> Ajouter une question
            </button>
          </div>

          {formData.questions.map((q, qIdx) => (
            <div key={qIdx} style={{ background: theme.colors.background, padding: '25px', borderRadius: '16px', marginBottom: '25px', border: `1px solid ${theme.colors.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <span style={{ fontWeight: '900', color: theme.colors.primary, fontSize: '1rem' }}># QUESTION {qIdx + 1}</span>
                {formData.questions.length > 1 && (
                  <button type="button" onClick={() => removeQuestion(qIdx)} style={{ color: theme.colors.error, background: 'white', padding: '8px', borderRadius: '8px' }}><Trash2 size={18} /></button>
                )}
              </div>
              <input 
                placeholder="Libelle de la question..." 
                required 
                value={q.text} 
                onChange={e => updateQuestion(qIdx, 'text', e.target.value)} 
                style={{ width: '100%', padding: '14px', marginBottom: '20px', borderRadius: '10px', border: `2px solid ${theme.colors.border}`, fontWeight: '600' }}
              />
              <p style={{ fontSize: '0.75rem', fontWeight: '800', color: theme.colors.textLight, marginBottom: '10px', textTransform: 'uppercase' }}>Options de reponses (Cochez la bonne reponse)</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} style={{ display: 'flex', gap: '10px', alignItems: 'center', background: 'white', padding: '10px', borderRadius: '10px', border: `1px solid ${theme.colors.border}` }}>
                    <input 
                      type="radio" 
                      name={`correct-${qIdx}`} 
                      required 
                      checked={q.correctAnswer === opt && opt !== ''} 
                      onChange={() => updateQuestion(qIdx, 'correctAnswer', opt)} 
                      style={{ width: '18px', height: '18px', accentColor: theme.colors.success }}
                    />
                    <input 
                      placeholder={`Option ${oIdx + 1}`} 
                      required 
                      value={opt} 
                      onChange={e => updateOption(qIdx, oIdx, e.target.value)} 
                      style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.9rem', fontWeight: '500' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              padding: '18px', 
              background: theme.colors.primary, 
              color: 'white', 
              borderRadius: '12px', 
              fontWeight: '900', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '12px', 
              marginTop: '10px',
              fontSize: '1.1rem',
              boxShadow: `0 10px 25px ${theme.colors.primary}40`
            }}
          >
            <Save size={22} /> PUBLIER L'EPREUVE
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateExamModal;
