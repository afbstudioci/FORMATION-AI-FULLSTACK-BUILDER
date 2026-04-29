import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Download, CheckCircle2, XCircle, Clock, User, Hash, FileText, Calendar, Award, AlertCircle } from 'lucide-react';
import { theme } from '../theme';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const SubmissionReview = ({ submission, onClose }) => {
  const printRef = useRef();

  const handleDownloadPDF = async () => {
    const element = printRef.current;
    
    // Optimisation pour éviter les coupures PDF
    const originalStyle = element.style.cssText;
    element.style.width = '800px';
    element.style.height = 'auto';
    element.style.overflow = 'visible';

    try {
      const canvas = await html2canvas(element, { 
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 800
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Si le contenu est trop long, on peut ajouter une logique multi-pages ici si nécessaire
      // Mais pour l'instant on ajuste l'image sur une page ou on augmente la hauteur du PDF
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`RAPPORT_OFFICIEL_${submission.user.fullname.replace(/\s+/g, '_')}.pdf`);
    } finally {
      element.style.cssText = originalStyle;
    }
  };

  // Durée officielle de l'épreuve (Fin - Début)
  const calculateOfficialDuration = (start, end) => {
    if (!start || !end) return "Non définie";
    const dStart = new Date(start);
    const dEnd = new Date(end);
    const diff = dEnd - dStart;
    if (isNaN(diff) || diff <= 0) return "Non définie";
    
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    
    let result = "";
    if (hours > 0) result += `${hours}H `;
    if (mins > 0) result += `${mins}min`;
    return result || "Moins d'une minute";
  };

  const pointsPerQ = submission.exam.pointsPerQuestion || 1;
  const totalPossible = submission.exam.questions.length * pointsPerQ;
  const isAdmis = submission.score >= (totalPossible / 2);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(15px)' }}>
      <motion.div 
        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: 'white', width: '100%', maxWidth: '950px', maxHeight: '95vh', borderRadius: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
      >
        {/* Header de Contrôle */}
        <div style={{ padding: '20px 40px', borderBottom: `1px solid ${theme.colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ padding: '10px', background: `${theme.colors.primary}10`, borderRadius: '12px' }}>
              <FileText color={theme.colors.primary} size={24} />
            </div>
            <div>
              <h3 style={{ fontWeight: '900', margin: 0, color: theme.colors.text }}>REVUE DE COPIE CERTIFIÉE</h3>
              <p style={{ fontSize: '0.8rem', color: theme.colors.textLight }}>Examen ID : {submission.exam._id.toString().slice(-8).toUpperCase()}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handleDownloadPDF} style={{ background: theme.colors.primary, color: 'white', padding: '12px 28px', borderRadius: '12px', border: 'none', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(9, 132, 227, 0.4)' }}>
              <Download size={18} /> EXPORTER EN PDF NASA
            </button>
            <button onClick={onClose} style={{ background: '#f5f6fa', border: 'none', padding: '12px', borderRadius: '50%', cursor: 'pointer', color: theme.colors.text }}><X size={20} /></button>
          </div>
        </div>

        {/* Zone de Contenu Impression */}
        <div style={{ flex: 1, overflowY: 'auto', background: '#f8f9fc', padding: '30px' }}>
          <div ref={printRef} style={{ background: 'white', margin: '0 auto', padding: '60px', width: '100%', boxShadow: '0 0 40px rgba(0,0,0,0.05)', position: 'relative' }}>
            
            {/* Filigrane Officiel */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-45deg)', fontSize: '8rem', fontWeight: '900', color: 'rgba(0,0,0,0.02)', pointerEvents: 'none', zIndex: 0 }}>AFB EXAM</div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Header PDF */}
              <div style={{ border: '3px solid #000', padding: '40px', marginBottom: '50px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <img src="/logo.png" alt="Logo" style={{ width: '120px', marginBottom: '15px' }} />
                    <div style={{ fontWeight: '900', fontSize: '0.8rem', letterSpacing: '4px', color: '#333' }}>AFB EXAM ACADEMY</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '900', fontSize: '1.8rem', marginBottom: '10px', color: '#000' }}>RAPPORT D'EXAMEN</div>
                    <div style={{ background: '#000', color: '#fff', padding: '15px 35px', fontWeight: '900', fontSize: '1.6rem', borderRadius: '4px', display: 'inline-block' }}>
                      NOTE : {submission.score} / {totalPossible}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '40px', borderTop: '2px solid #000', paddingTop: '30px' }}>
                  <div>
                    <div style={{ marginBottom: '15px', fontSize: '1.1rem' }}><User size={18} style={{ marginRight: '15px', verticalAlign: 'middle' }} /> <strong>CANDIDAT :</strong> {submission.user.fullname.toUpperCase()}</div>
                    <div style={{ marginBottom: '15px', fontSize: '1.1rem' }}><Hash size={18} style={{ marginRight: '15px', verticalAlign: 'middle' }} /> <strong>ID MATRICULE :</strong> {submission.user.matricule}</div>
                    <div style={{ marginBottom: '15px', fontSize: '1.1rem' }}><FileText size={18} style={{ marginRight: '15px', verticalAlign: 'middle' }} /> <strong>MODULE :</strong> {submission.exam.title}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ marginBottom: '15px', fontSize: '1.1rem' }}><Calendar size={18} style={{ marginRight: '15px', verticalAlign: 'middle' }} /> <strong>DATE DE COMPOSITION :</strong> {new Date(submission.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                    <div style={{ marginBottom: '15px', fontSize: '1.1rem' }}><Clock size={18} style={{ marginRight: '15px', verticalAlign: 'middle' }} /> <strong>SESSION :</strong> {new Date(submission.createdAt).toLocaleTimeString('fr-FR')}</div>
                    <div style={{ fontWeight: '900', fontSize: '1.1rem', color: theme.colors.primary }}><Clock size={18} style={{ marginRight: '15px', verticalAlign: 'middle' }} /> <strong>DURÉE OFFICIELLE :</strong> {calculateOfficialDuration(submission.exam.startTime, submission.exam.endTime)}</div>
                  </div>
                </div>
              </div>

              {/* Statut Académique */}
              <div style={{ marginBottom: '50px' }}>
                <div style={{ borderBottom: '2px solid #000', paddingBottom: '10px', fontWeight: '900', fontSize: '1.3rem', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Award size={24} /> VERDICT ACADÉMIQUE
                </div>
                <div style={{ padding: '30px', background: isAdmis ? '#f0fff4' : '#fff5f5', border: `2px solid ${isAdmis ? '#2ecc71' : '#e74c3c'}`, borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '5px' }}>
                      RÉSULTAT FINAL : <span style={{ color: isAdmis ? '#2ecc71' : '#e74c3c', fontSize: '1.5rem' }}>{isAdmis ? 'ADMIS' : 'REFUSÉ'}</span>
                    </div>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>Analyse basée sur un barème de {pointsPerQ} pts/question avec pénalités d'erreurs.</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#888' }}>TENTATIVE</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '900' }}>UNIQUE</div>
                  </div>
                </div>
              </div>

              {/* Détails Questions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                {submission.exam.questions.map((q, idx) => {
                  // FIX BUG : Utilisation de selectedOption
                  const subAnswer = submission.answers.find(a => a.questionId.toString() === q._id.toString());
                  const studentChoice = subAnswer?.selectedOption || null;
                  const isCorrect = studentChoice === q.correctAnswer;
                  const isNotAnswered = !studentChoice;

                  return (
                    <div key={idx} style={{ padding: '35px', border: '1px solid #ddd', borderRadius: '20px', background: isNotAnswered ? '#fafafa' : (isCorrect ? '#f6ffed' : '#fff1f0'), pageBreakInside: 'avoid' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                        <span style={{ fontWeight: '900', fontSize: '1rem', color: '#555' }}>QUESTION {idx + 1} / {submission.exam.questions.length}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '900', fontSize: '1rem' }}>
                          {isNotAnswered ? (
                            <span style={{ color: '#888' }}>NON RÉPONDU (0 pts)</span>
                          ) : isCorrect ? (
                            <><CheckCircle2 color="#52c41a" size={24} /> <span style={{ color: '#52c41a' }}>CORRECT (+{pointsPerQ} pts)</span></>
                          ) : (
                            <><XCircle color="#ff4d4f" size={24} /> <span style={{ color: '#ff4d4f' }}>ERREUR (-{pointsPerQ} pts)</span></>
                          )}
                        </div>
                      </div>
                      <p style={{ fontWeight: '800', fontSize: '1.2rem', marginBottom: '30px', lineHeight: '1.5', color: '#000' }}>{q.text}</p>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: '900', color: '#999', marginBottom: '10px', textTransform: 'uppercase' }}>Réponse du Candidat</div>
                          <div style={{ padding: '18px', borderRadius: '12px', background: isNotAnswered ? '#eee' : (isCorrect ? '#d9f7be' : '#ffccc7'), border: `2px solid ${isNotAnswered ? '#ccc' : (isCorrect ? '#52c41a' : '#ff4d4f')}`, fontWeight: '900', fontSize: '1.1rem' }}>
                            {studentChoice || '---'}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: '900', color: '#999', marginBottom: '10px', textTransform: 'uppercase' }}>Clé de Correction</div>
                          <div style={{ padding: '18px', borderRadius: '12px', background: '#e6f7ff', border: '2px solid #91d5ff', fontWeight: '900', fontSize: '1.1rem' }}>
                            {q.correctAnswer}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Signature NASA */}
              <div style={{ marginTop: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '3px solid #000', paddingTop: '60px' }}>
                <div style={{ maxWidth: '480px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                    <div style={{ width: '50px', height: '50px', background: '#000', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Award color="#fff" size={30} />
                    </div>
                    <div style={{ fontWeight: '900', fontSize: '1.4rem' }}>CERTIFICATION ACADÉMIQUE</div>
                  </div>
                  <p style={{ fontSize: '1rem', color: '#444', lineHeight: '1.7', textAlign: 'justify' }}>
                    Le présent rapport d'examen est un document authentique généré par le système AFB EXAM. 
                    Il atteste des compétences du candidat sur le module cité. Toute altération rend ce document nul et non avenu.
                  </p>
                </div>
                
                <div style={{ textAlign: 'center', minWidth: '320px' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '20px', textTransform: 'uppercase' }}>Direction Générale</div>
                  <div style={{ height: '120px', border: '2px dashed #000', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fcfcfc', borderRadius: '15px', position: 'relative' }}>
                    <img src="/logo.png" alt="Cachet" style={{ height: '70px', opacity: 0.1, filter: 'grayscale(1)' }} />
                    <div style={{ position: 'absolute', fontWeight: '900', fontSize: '0.9rem', color: 'rgba(0,0,0,0.2)', transform: 'rotate(-15deg)' }}>AFB EXAM ACADEMY</div>
                  </div>
                  <div style={{ fontWeight: '900', fontSize: '1.3rem', color: '#000' }}>CERTIFIÉ CONFORME</div>
                  <div style={{ fontSize: '1rem', color: theme.colors.primary, fontWeight: '800', marginTop: '5px' }}>AMON CHRIST - ADMINISTRATEUR</div>
                </div>
              </div>

              <div style={{ marginTop: '60px', textAlign: 'center', fontSize: '0.85rem', color: '#bbb', letterSpacing: '3px', borderTop: '1px solid #f0f0f0', paddingTop: '30px', fontWeight: '600' }}>
                SYSTÈME DE GESTION D'EXAMENS AFB - SESSION 2026 - RAPPORT # {submission._id.toString().toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SubmissionReview;
