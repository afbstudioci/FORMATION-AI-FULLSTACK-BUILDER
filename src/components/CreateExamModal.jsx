import { useNotification } from '../context/NotificationContext';

registerLocale('fr', fr);

const CreateExamModal = ({ onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: new Date(),
    endTime: new Date(Date.now() + 3600000),
    pointsPerQuestion: 2,
    questions: [{ text: '', options: ['', ''], correctAnswer: '' }]
  });

  const [aiContent, setAiContent] = useState('');
  const [aiConfig, setAiConfig] = useState({ qCount: 5, optCount: 4 });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNotification } = useNotification();

  const handleAiGenerate = async () => {
    if (!aiContent) return addNotification("Collez le contenu de la leçon d'abord.", 'error');
    setIsGenerating(true);
    addNotification("L'IA AFB analyse votre contenu...", 'info');
    try {
      const { data } = await api.post('/exams/generate', { 
        lessonContent: aiContent, 
        questionCount: aiConfig.qCount, 
        optionsCount: aiConfig.optCount 
      });
      setFormData({
        ...formData,
        title: data.title || formData.title,
        description: data.description || formData.description,
        questions: data.questions
      });
      setShowAiPanel(false);
      addNotification("Examen généré avec succès !", 'success');
    } catch (err) {
      addNotification("Échec de la génération IA.", 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [{ text: '', options: ['', ''], correctAnswer: '' }, ...formData.questions]
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
      addNotification("Veuillez valider toutes les questions et réponses.", 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/exams', formData);
      addNotification("Épreuve publiée !", 'success');
      onCreated();
    } catch (err) {
      addNotification(err.response?.data?.message || "Erreur de publication", 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)', padding: '10px' }}>
      <motion.div 
        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: 'var(--background)', width: '100%', maxWidth: '900px', maxHeight: '90vh', borderRadius: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: 'var(--shadow-premium)' }}
      >
        {/* Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass)', backdropFilter: 'blur(10px)' }}>
          <div>
            <h2 style={{ fontWeight: '900', color: 'var(--text)', margin: 0 }}>Nouvelle Épreuve</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', margin: 0, fontWeight: '700' }}>AFB STUDIO - ÉDITION</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={() => setShowAiPanel(!showAiPanel)} style={{ background: 'var(--primary)', color: 'white', padding: '8px 15px', borderRadius: '10px', border: 'none', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>
              <Sparkles size={16} /> <span className="hide-mobile">Générateur IA</span>
            </button>
            <button onClick={onClose} style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '8px', borderRadius: '10px', color: 'var(--text)', cursor: 'pointer' }}><X size={20} /></button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <AnimatePresence>
            {showAiPanel && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: '20px', background: 'rgba(9, 132, 227, 0.05)', borderRadius: '15px', padding: '15px', border: '2px dashed var(--primary)' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}><Wand2 size={18} /> Génération IA</h3>
                <textarea 
                  placeholder="Collez ici le contenu de la leçon..."
                  value={aiContent} onChange={e => setAiContent(e.target.value)}
                  style={{ width: '100%', minHeight: '100px', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)', outline: 'none', marginBottom: '15px' }}
                />
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '120px' }}>
                    <label style={{ fontSize: '0.7rem', fontWeight: '800' }}>QUESTIONS</label>
                    <input type="number" value={aiConfig.qCount} onChange={e => setAiConfig({...aiConfig, qCount: parseInt(e.target.value)})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: '120px' }}>
                    <label style={{ fontSize: '0.7rem', fontWeight: '800' }}>OPTIONS</label>
                    <input type="number" value={aiConfig.optCount} onChange={e => setAiConfig({...aiConfig, optCount: parseInt(e.target.value)})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }} />
                  </div>
                  <button type="button" onClick={handleAiGenerate} disabled={isGenerating} style={{ flex: 2, background: 'var(--primary)', color: 'white', padding: '12px', borderRadius: '10px', border: 'none', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <><Sparkles size={18} /> Générer</>}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '30px' }} className="grid-2-desktop">
            <div className="span-2-desktop">
              <label style={{ display: 'block', fontWeight: '900', marginBottom: '8px', fontSize: '0.7rem', color: 'var(--text-light)' }}>TITRE DE L'ÉPREUVE</label>
              <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', outline: 'none' }} />
            </div>
            <div className="span-2-desktop">
              <label style={{ display: 'block', fontWeight: '900', marginBottom: '8px', fontSize: '0.7rem', color: 'var(--text-light)' }}>CONSIGNES</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', outline: 'none', minHeight: '80px' }} />
            </div>
            
            <div>
              <label style={{ display: 'block', fontWeight: '900', marginBottom: '8px', fontSize: '0.7rem', color: 'var(--success)' }}>DEBUT</label>
              <DatePicker selected={formData.startTime} onChange={d => setFormData({...formData, startTime: d})} showTimeSelect locale="fr" dateFormat="dd/MM/yyyy HH:mm" className="full-width-input" />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '900', marginBottom: '8px', fontSize: '0.7rem', color: 'var(--error)' }}>FIN</label>
              <DatePicker selected={formData.endTime} onChange={d => setFormData({...formData, endTime: d})} showTimeSelect locale="fr" dateFormat="dd/MM/yyyy HH:mm" className="full-width-input" />
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontWeight: '900', fontSize: '1.1rem' }}>Questions ({formData.questions.length})</h3>
              <button type="button" onClick={addQuestion} style={{ background: 'var(--primary)', color: 'white', padding: '8px 15px', borderRadius: '10px', border: 'none', fontWeight: '800', cursor: 'pointer', fontSize: '0.8rem' }}>+ Ajouter</button>
            </div>

            {formData.questions.map((q, qIdx) => (
              <div key={qIdx} style={{ background: 'var(--surface)', padding: '20px', borderRadius: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <span style={{ fontWeight: '900', color: 'var(--primary)', fontSize: '0.8rem' }}>QUESTION {qIdx + 1}</span>
                  <button type="button" onClick={() => removeQuestion(qIdx)} style={{ color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
                </div>
                <input required value={q.text} onChange={e => updateQuestion(qIdx, 'text', e.target.value)} placeholder="Intitulé de la question..." style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)', marginBottom: '15px', fontWeight: '700' }} />
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }} className="grid-2-desktop">
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} style={{ display: 'flex', gap: '10px', alignItems: 'center', background: 'var(--background)', padding: '10px', borderRadius: '12px', border: q.correctAnswer === opt && opt !== '' ? '2px solid var(--success)' : '1px solid var(--border)' }}>
                      <input type="radio" name={`correct-${qIdx}`} required checked={q.correctAnswer === opt && opt !== ''} onChange={() => updateQuestion(qIdx, 'correctAnswer', opt)} style={{ accentColor: 'var(--success)' }} />
                      <input required value={opt} onChange={e => updateOption(qIdx, oIdx, e.target.value)} placeholder={`Option ${oIdx + 1}`} style={{ flex: 1, border: 'none', background: 'none', color: 'var(--text)', outline: 'none', fontSize: '0.9rem' }} />
                      {q.options.length > 2 && <button type="button" onClick={() => removeOption(qIdx, oIdx)} style={{ color: 'var(--text-light)', background: 'none', border: 'none' }}><X size={14} /></button>}
                    </div>
                  ))}
                  <button type="button" onClick={() => addOption(qIdx)} style={{ border: '1px dashed var(--border)', background: 'none', color: 'var(--text-light)', padding: '10px', borderRadius: '12px', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}>+ Option</button>
                </div>
              </div>
            ))}
          </div>

          <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '15px', background: 'var(--primary)', color: 'white', borderRadius: '15px', border: 'none', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '10px' }}>
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            {isSubmitting ? 'Publication...' : 'PUBLIER L\'ÉPREUVE'}
          </button>
        </form>
      </motion.div>

      <style>{`
        .full-width-input { width: 100%; padding: 12px; border-radius: 12px; border: 1px solid var(--border); background: var(--surface); color: var(--text); outline: none; }
        .react-datepicker-wrapper { width: 100%; }
        @media (min-width: 768px) {
          .grid-2-desktop { grid-template-columns: 1fr 1fr !important; }
          .span-2-desktop { grid-column: span 2; }
        }
      `}</style>
    </div>
  );
};

export default CreateExamModal;
