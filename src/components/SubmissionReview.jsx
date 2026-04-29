import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Download, CheckCircle2, XCircle, Clock, User, Hash, FileText, Calendar, Award } from 'lucide-react';
import { theme } from '../theme';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const SubmissionReview = ({ submission, onClose }) => {
  const printRef = useRef();

  const handleDownloadPDF = async () => {
    const element = printRef.current;
    
    // Forcer une largeur de capture pour la cohérence du PDF
    const originalWidth = element.style.width;
    element.style.width = '850px'; 

    try {
      const canvas = await html2canvas(element, { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        windowWidth: 850
      });

      const data = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Copie_Officielle_${submission.user.fullname}_${submission.exam.title}.pdf`);
    } finally {
      element.style.width = originalWidth;
    }
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) return "N/A";
    const dStart = new Date(start);
    const dEnd = new Date(end);
    const diff = dEnd - dStart;
    if (isNaN(diff) || diff < 0) return "N/A";
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${mins} min ${secs} s`;
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(10px)' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        style={{ background: 'white', width: '100%', maxWidth: '1000px', maxHeight: '95vh', borderRadius: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: theme.shadows.premium }}
      >
        {/* Navigation NASA */}
        <div style={{ padding: '20px 40px', borderBottom: `1px solid ${theme.colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff' }}>
          <div>
            <h3 style={{ fontWeight: '900', margin: 0, color: theme.colors.text, fontSize: '1.2rem' }}>REVUE DE COPIE ACADÉMIQUE</h3>
            <p style={{ fontSize: '0.8rem', color: theme.colors.textLight }}>Génération de rapport officiel certifié</p>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button onClick={handleDownloadPDF} style={{ background: theme.colors.primary, color: 'white', padding: '12px 25px', borderRadius: '12px', border: 'none', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', boxShadow: '0 8px 20px rgba(9, 132, 227, 0.3)' }}>
              <Download size={20} /> TÉLÉCHARGER LE PDF NASA
            </button>
            <button onClick={onClose} style={{ background: '#f5f5f5', border: 'none', padding: '12px', borderRadius: '50%', cursor: 'pointer' }}><X size={20} /></button>
          </div>
        </div>

        {/* Content for PDF */}
        <div style={{ flex: 1, overflowY: 'auto', background: '#f0f2f5', padding: '40px' }}>
          <div ref={printRef} style={{ background: 'white', margin: '0 auto', padding: '50px', color: '#000', width: '100%', minHeight: '100%' }}>
            
            {/* Header Officiel */}
            <div style={{ border: '4px solid #000', padding: '35px', marginBottom: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
                <div style={{ textAlign: 'center' }}>
                  <img src="/logo.png" alt="Logo" style={{ width: '110px', marginBottom: '12px' }} />
                  <div style={{ fontWeight: '900', fontSize: '0.85rem', letterSpacing: '3px' }}>AFB EXAM ACADEMY</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '900', fontSize: '1.5rem', marginBottom: '10px' }}>RAPPORT D'EXAMEN</div>
                  <div style={{ background: '#000', color: '#fff', padding: '12px 30px', fontWeight: '900', fontSize: '1.4rem', borderRadius: '4px', display: 'inline-block' }}>
                    NOTE : {submission.score} / {submission.exam.questions.length}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '40px', borderTop: '3px solid #000', paddingTop: '30px' }}>
                <div>
                  <div style={{ marginBottom: '12px', fontSize: '1.05rem' }}><User size={18} style={{ marginRight: '12px', verticalAlign: 'middle' }} /> <strong>ÉTUDIANT :</strong> {submission.user.fullname.toUpperCase()}</div>
                  <div style={{ marginBottom: '12px', fontSize: '1.05rem' }}><Hash size={18} style={{ marginRight: '12px', verticalAlign: 'middle' }} /> <strong>MATRICULE :</strong> {submission.user.matricule}</div>
                  <div style={{ marginBottom: '12px', fontSize: '1.05rem' }}><FileText size={18} style={{ marginRight: '12px', verticalAlign: 'middle' }} /> <strong>ÉPREUVE :</strong> {submission.exam.title}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ marginBottom: '12px', fontSize: '1.05rem' }}><Calendar size={18} style={{ marginRight: '12px', verticalAlign: 'middle' }} /> <strong>DATE :</strong> {new Date(submission.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                  <div style={{ marginBottom: '12px', fontSize: '1.05rem' }}><Clock size={18} style={{ marginRight: '12px', verticalAlign: 'middle' }} /> <strong>HEURE :</strong> {new Date(submission.createdAt).toLocaleTimeString('fr-FR')}</div>
                  <div style={{ fontWeight: '900', fontSize: '1.05rem', color: theme.colors.primary }}><Clock size={18} style={{ marginRight: '12px', verticalAlign: 'middle' }} /> <strong>DURÉE :</strong> {calculateDuration(submission.exam.startTime, submission.createdAt)}</div>
                </div>
              </div>
            </div>

            {/* Verdict Section */}
            <div style={{ marginBottom: '45px' }}>
              <div style={{ borderBottom: '3px solid #000', paddingBottom: '10px', fontWeight: '900', textTransform: 'uppercase', fontSize: '1.2rem', marginBottom: '20px' }}>Verdict Académique</div>
              <div style={{ padding: '25px', background: '#f8f9fa', borderLeft: '10px solid #000', borderRadius: '4px' }}>
                <p style={{ margin: 0, fontSize: '1.1rem', lineHeight: '1.6' }}>
                  Précision globale : <strong>{((submission.score / submission.exam.questions.length) * 100).toFixed(1)}%</strong>. 
                  Statut : <strong style={{ color: submission.score >= submission.exam.questions.length / 2 ? '#2ecc71' : '#e74c3c' }}>
                    {submission.score >= (submission.exam.questions.length / 2) ? 'ADMIS' : 'ÉCHEC'}
                  </strong>
                </p>
                <p style={{ margin: '10px 0 0', fontSize: '0.9rem', color: '#666' }}>L'analyse des réponses ci-dessous confirme l'application stricte du barème officiel.</p>
              </div>
            </div>

            {/* Questions Detail */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
              {submission.exam.questions.map((q, idx) => {
                // Fix ID comparison bug using .toString()
                const subAnswer = submission.answers.find(a => a.questionId.toString() === q._id.toString());
                const studentChoice = subAnswer ? subAnswer.answer : 'AUCUNE RÉPONSE';
                const isCorrect = studentChoice === q.correctAnswer;

                return (
                  <div key={idx} style={{ padding: '30px', border: '2px solid #eee', borderRadius: '20px', background: isCorrect ? '#f0fff4' : '#fff5f5', pageBreakInside: 'avoid' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
                      <span style={{ fontWeight: '900', fontSize: '0.9rem', color: '#777', textTransform: 'uppercase' }}>Question {idx + 1} sur {submission.exam.questions.length}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isCorrect ? <><CheckCircle2 color="#2ecc71" size={22} /> <span style={{ color: '#2ecc71', fontWeight: '900' }}>VALIDE</span></> : <><XCircle color="#e74c3c" size={22} /> <span style={{ color: '#e74c3c', fontWeight: '900' }}>ERREUR</span></>}
                      </div>
                    </div>
                    <p style={{ fontWeight: '800', fontSize: '1.15rem', marginBottom: '25px', lineHeight: '1.4' }}>{q.text}</p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: '900', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Réponse Soumise</div>
                        <div style={{ padding: '15px', borderRadius: '12px', background: isCorrect ? '#dcfce7' : '#fee2e2', border: `2px solid ${isCorrect ? '#2ecc71' : '#e74c3c'}`, fontWeight: '800', fontSize: '1rem' }}>
                          {studentChoice}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: '900', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Correction Système</div>
                        <div style={{ padding: '15px', borderRadius: '12px', background: '#f1f5f9', border: '2px solid #cbd5e1', fontWeight: '800', fontSize: '1rem' }}>
                          {q.correctAnswer}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Signature & Cachet */}
            <div style={{ marginTop: '70px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '3px solid #000', paddingTop: '50px' }}>
              <div style={{ maxWidth: '450px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <Award color={theme.colors.primary} size={40} />
                  <div style={{ fontWeight: '900', fontSize: '1.3rem', letterSpacing: '1px' }}>CERTIFICATION OFFICIELLE</div>
                </div>
                <p style={{ fontSize: '0.95rem', color: '#444', lineHeight: '1.6' }}>
                  Ce document constitue la preuve légale et académique de la participation et de la réussite (ou échec) de l'étudiant. 
                  L'intégrité de ce rapport est garantie par la signature numérique du système AFB EXAM.
                </p>
              </div>
              
              <div style={{ textAlign: 'center', minWidth: '300px' }}>
                <div style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '15px', textTransform: 'uppercase' }}>Cachet de l'Académie</div>
                <div style={{ height: '100px', border: '2px dashed #000', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', borderRadius: '12px', opacity: 0.8 }}>
                  <img src="/logo.png" alt="Cachet" style={{ height: '60px', filter: 'grayscale(100%) brightness(0.2)' }} />
                </div>
                <div style={{ fontWeight: '900', fontSize: '1.2rem' }}>DIRECTION GÉNÉRALE</div>
                <div style={{ fontSize: '0.9rem', color: theme.colors.primary, fontWeight: '800' }}>AFB EXAM - CERTIFIÉ CONFORME</div>
              </div>
            </div>

            {/* Pied de page NASA */}
            <div style={{ marginTop: '50px', textAlign: 'center', fontSize: '0.8rem', color: '#aaa', letterSpacing: '2px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
              FORMATION AI FULLSTACK BUILDER - SYSTÈME D'ÉVALUATION SESSION 2026
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SubmissionReview;
