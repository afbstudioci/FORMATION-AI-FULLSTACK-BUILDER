import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Save, Calendar, Clock, Sparkles, Wand2, Loader2 } from 'lucide-react';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { fr } from 'date-fns/locale/fr';
import api from '../services/api';
import { theme } from '../theme';

registerLocale('fr', fr);

const CreateExamModal = ({ onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: new Date(),
    endTime: new Date(Date.now() + 3600000), // +1h par défaut
    pointsPerQuestion: 2,
    questions: [{ text: '', options: ['', ''], correctAnswer: '' }]
  });

  const [aiContent, setAiContent] = useState('');
  const [aiConfig, setAiConfig] = useState({ qCount: 5, optCount: 4 });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAiGenerate = async () => {
    if (!aiContent) return alert("Veuillez coller le contenu de la lecon.");
    setIsGenerating(true);
    try {
      const { data } = await api.post('/exams/generate', { 
        lessonContent: aiContent, 
        questionCount: aiConfig.qCount, 
        optionsCount: aiConfig.optCount 
      });
      setFormData({
        ...formData,
        title: data.title,
        description: data.description,
        questions: data.questions
      });
      setShowAiPanel(false);
    } catch (err) {
      alert("Erreur lors de la generation IA");
    } finally {
      setIsGenerating(false);
    }
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { text: '', options: ['', ''], correctAnswer: '' }]
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

  const addOption = (qIndex) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].options.push('');
    setFormData({ ...formData, questions: newQuestions });
  };

  const removeOption = (qIndex, oIndex) => {
    const newQuestions = [...formData.questions];
    if (newQuestions[qIndex].options.length <= 2) return;
    const removedOption = newQuestions[qIndex].options[oIndex];
    newQuestions[qIndex].options.splice(oIndex, 1);
    if (newQuestions[qIndex].correctAnswer === removedOption) newQuestions[qIndex].correctAnswer = '';
    setFormData({ ...formData, questions: newQuestions });
  };

  const updateOption = (qIndex, oIndex, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].options[oIndex] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (formData.questions.some(q => !q.correctAnswer || q.options.some(opt => opt.trim() === ''))) {
      alert("Veuillez remplir toutes les questions et selectionner une bonne reponse.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/exams', formData);
      onCreated();
    } catch (err) {
      alert(err.response?.data?.message || "Erreur de creation");
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(8px)' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        style={{ background: 'white', width: '100%', maxWidth: '950px', maxHeight: '95vh', borderRadius: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: theme.shadows.premium }}
      >
        <div style={{ padding: '24px 40px', borderBottom: `1px solid ${theme.colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fcfcfc' }}>
          <div>
            <h2 style={{ fontWeight: '900', color: theme.colors.text, fontSize: '1.5rem' }}>Publication d'Epreuve</h2>
            <p style={{ fontSize: '0.85rem', color: theme.colors.textLight }}>Configurez manuellement ou utilisez l'IA</p>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button type="button" onClick={() => setShowAiPanel(!showAiPanel)} style={{ background: theme.colors.secondary, color: 'white', padding: '10px 20px', borderRadius: '12px', border: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={18} /> {showAiPanel ? 'Cacher IA' : 'Générateur Magique (IA)'}
            </button>
            <button onClick={onClose} style={{ background: 'white', border: `1px solid ${theme.colors.border}`, padding: '10px', borderRadius: '50%', display: 'flex' }}><X size={20} /></button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '40px' }}>
          <AnimatePresence>
            {showAiPanel && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', marginBottom: '40px', background: `${theme.colors.secondary}08`, borderRadius: '20px', border: `2px dashed ${theme.colors.secondary}40`, padding: '25px' }}>
                <h3 style={{ color: theme.colors.secondary, fontWeight: '900', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}><Wand2 size={20} /> Assistant Intelligent</h3>
                <textarea 
                  placeholder="Collez ici le contenu de votre lecon ou vos notes de cours..."
                  value={aiContent} onChange={e => setAiContent(e.target.value)}
                  style={{ width: '100%', minHeight: '150px', padding: '15px', borderRadius: '12px', border: `1px solid ${theme.colors.border}`, marginBottom: '20px', outline: 'none' }}
                />
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>Questions:</span>
                    <input type="number" min="1" max="20" value={aiConfig.qCount} onChange={e => setAiConfig({...aiConfig, qCount: parseInt(e.target.value)})} style={{ width: '60px', padding: '8px', borderRadius: '8px', border: `1px solid ${theme.colors.border}` }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>Options:</span>
                    <input type="number" min="2" max="6" value={aiConfig.optCount} onChange={e => setAiConfig({...aiConfig, optCount: parseInt(e.target.value)})} style={{ width: '60px', padding: '8px', borderRadius: '8px', border: `1px solid ${theme.colors.border}` }} />
                  </div>
                  <button type="button" onClick={handleAiGenerate} disabled={isGenerating} style={{ flex: 1, background: theme.colors.secondary, color: 'white', padding: '12px', borderRadius: '12px', fontWeight: '800', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    {isGenerating ? <Loader2 className="animate-spin" /> : <><Sparkles size={18} /> Generer l'examen instantanement</>}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontWeight: '800', marginBottom: '10px', fontSize: '0.85rem', color: theme.colors.text }}>TITRE DE L'EPREUVE</label>
              <input type="text" required placeholder="Ex: Devoir de Synthese : Algorithmique" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `2px solid ${theme.colors.border}`, fontSize: '1rem', outline: 'none' }} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontWeight: '800', marginBottom: '10px', fontSize: '0.85rem', color: theme.colors.text }}>CONSIGNES</label>
              <textarea value={formData.description} placeholder="Ex: Pas de calculatrice autorisee..." onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `2px solid ${theme.colors.border}`, fontSize: '1rem', minHeight: '80px', outline: 'none', resize: 'vertical' }} />
            </div>
            
            {/* Pickers Premium */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', marginBottom: '10px', fontSize: '0.85rem', color: theme.colors.success }}><Calendar size={16} /> DATE & HEURE DE DEBUT</label>
              <DatePicker
                selected={formData.startTime}
                onChange={date => setFormData({...formData, startTime: date})}
                showTimeSelect
                locale="fr"
                dateFormat="dd/MM/yyyy HH:mm"
                timeFormat="HH:mm"
                timeIntervals={15}
                className="custom-datepicker"
              />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', marginBottom: '10px', fontSize: '0.85rem', color: theme.colors.error }}><Clock size={16} /> DATE & HEURE DE FIN</label>
              <DatePicker
                selected={formData.endTime}
                onChange={date => setFormData({...formData, endTime: date})}
                showTimeSelect
                locale="fr"
                dateFormat="dd/MM/yyyy HH:mm"
                timeFormat="HH:mm"
                timeIntervals={15}
                className="custom-datepicker"
              />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', marginBottom: '10px', fontSize: '0.85rem', color: theme.colors.primary }}><Plus size={16} /> BAREME : POINTS PAR QUESTION (+X / -X)</label>
              <input 
                type="number" 
                min="1" 
                value={formData.pointsPerQuestion} 
                onChange={e => setFormData({...formData, pointsPerQuestion: parseInt(e.target.value)})} 
                style={{ width: '150px', padding: '14px', borderRadius: '12px', border: `2px solid ${theme.colors.border}`, fontSize: '1rem', outline: 'none', fontWeight: '800' }} 
              />
              <p style={{ fontSize: '0.8rem', color: theme.colors.textLight, marginTop: '5px' }}>Chaque bonne réponse donne +{formData.pointsPerQuestion}, chaque erreur retire -{formData.pointsPerQuestion}. Pas de réponse = 0.</p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderTop: `1px solid ${theme.colors.border}`, paddingTop: '30px' }}>
            <h3 style={{ fontWeight: '900', fontSize: '1.2rem' }}>Questions ({formData.questions.length})</h3>
            <button type="button" onClick={addQuestion} style={{ background: theme.colors.primary, color: 'white', padding: '12px 24px', borderRadius: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}><Plus size={18} /> Nouvelle question</button>
          </div>

          {formData.questions.map((q, qIdx) => (
            <div key={qIdx} style={{ background: '#f8f9fa', padding: '30px', borderRadius: '20px', marginBottom: '30px', border: `1px solid ${theme.colors.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <span style={{ fontWeight: '900', color: theme.colors.primary, fontSize: '0.9rem' }}>QUESTION {qIdx + 1}</span>
                <button type="button" onClick={() => removeQuestion(qIdx)} style={{ color: theme.colors.error, background: 'white', padding: '8px', borderRadius: '10px', border: `1px solid ${theme.colors.border}` }}><Trash2 size={18} /></button>
              </div>
              <input placeholder="Libelle de la question..." required value={q.text} onChange={e => updateQuestion(qIdx, 'text', e.target.value)} style={{ width: '100%', padding: '16px', marginBottom: '25px', borderRadius: '12px', border: `2px solid ${theme.colors.border}`, fontWeight: '600' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: '900', color: theme.colors.textLight, textTransform: 'uppercase' }}>Options de reponse</p>
                <button type="button" onClick={() => addOption(qIdx)} style={{ fontSize: '0.75rem', background: '#000', color: 'white', padding: '6px 12px', borderRadius: '6px', border: 'none', fontWeight: '700' }}>+ Ajouter option</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'white', padding: '12px', borderRadius: '12px', border: `1px solid ${theme.colors.border}` }}>
                    <input type="radio" name={`correct-${qIdx}`} required checked={q.correctAnswer === opt && opt !== ''} onChange={() => updateQuestion(qIdx, 'correctAnswer', opt)} style={{ width: '20px', height: '20px', accentColor: theme.colors.success }} />
                    <input placeholder={`Option ${oIdx + 1}`} required value={opt} onChange={e => updateOption(qIdx, oIdx, e.target.value)} style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.95rem', fontWeight: '500' }} />
                    {q.options.length > 2 && (
                      <button type="button" onClick={() => removeOption(qIdx, oIdx)} style={{ color: theme.colors.error, background: 'none', border: 'none', padding: '4px' }}><X size={16} /></button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '20px', background: isSubmitting ? theme.colors.textLight : theme.colors.primary, color: 'white', borderRadius: '15px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginTop: '20px', fontSize: '1.1rem', boxShadow: isSubmitting ? 'none' : `0 12px 30px ${theme.colors.primary}40`, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={24} />} 
            {isSubmitting ? 'PUBLICATION EN COURS...' : "PUBLIER L'EPREUVE MAINTENANT"}
          </button>
        </form>
      </motion.div>
      <style>{`
        .custom-datepicker { width: 100%; padding: 14px; border-radius: 12px; border: 2px solid ${theme.colors.border}; font-size: 1rem; outline: none; }
        .react-datepicker-wrapper { width: 100%; }
      `}</style>
    </div>
  );
};

export default CreateExamModal;
