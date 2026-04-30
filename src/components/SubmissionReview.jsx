import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Download, CheckCircle2, XCircle, Clock, User, Hash, FileText, Calendar, Award, ShieldCheck, Mail, Phone, Loader2 } from 'lucide-react';
import { theme } from '../theme';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Alert from './Alert';

import { useNotification } from '../context/NotificationContext';

const SubmissionReview = ({ submission, onClose }) => {
  const printRef = useRef();
  const { addNotification } = useNotification();
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    addNotification("Génération du rapport en cours...", 'info');
    
    const element = printRef.current;
    
    // Sauvegarder les styles originaux
    const originalWidth = element.style.width;
    const originalMaxWidth = element.style.maxWidth;
    
    // Forcer une largeur standard pour une capture PDF propre
    element.style.width = '800px';
    element.style.maxWidth = 'none';

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210;
      const pdfHeight = 297;
      const margin = 10;
      const contentWidth = pdfWidth - (2 * margin);
      
      const blocks = element.querySelectorAll('[data-pdf-block="true"]');
      let currentY = margin;

      for (let i = 0; i < blocks.length; i++) {
        const canvas = await html2canvas(blocks[i], { 
          scale: 2, 
          useCORS: true,
          backgroundColor: '#ffffff',
          windowWidth: 800 // Forcer le rendu à 800px pour la capture
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const imgHeight = (canvas.height * contentWidth) / canvas.width;

        if (i > 0 && (currentY + imgHeight > pdfHeight - margin)) {
          pdf.addPage();
          currentY = margin;
        }

        pdf.addImage(imgData, 'JPEG', margin, currentY, contentWidth, imgHeight);
        currentY += imgHeight + 5;
      }
      
      // Ajouter la numérotation des pages
      const totalPages = pdf.internal.getNumberOfPages();
      for (let j = 1; j <= totalPages; j++) {
        pdf.setPage(j);
        pdf.setFontSize(10);
        pdf.setTextColor(150);
        pdf.text(`Page ${j} / ${totalPages}`, pdfWidth - 25, pdfHeight - 10);
      }
      
      pdf.save(`RAPPORT_ACADEMIQUE_AFB_${submission.user.matricule}.pdf`);
      addNotification("Rapport téléchargé !", 'success');
    } catch (err) {
      addNotification("Erreur lors de la génération PDF", 'error');
    } finally {
      // Restaurer les styles
      element.style.width = originalWidth;
      element.style.maxWidth = originalMaxWidth;
      setDownloading(false);
    }
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) return "Session standard";
    const diff = new Date(end) - new Date(start);
    const mins = Math.floor(diff / 60000);
    return `${mins} minutes`;
  };

  const pointsPerQ = Number(submission.pointsPerQuestion || submission.exam?.pointsPerQuestion || 1);
  const totalPossible = (submission.exam?.questions?.length || 0) * pointsPerQ;
  
  // Recalcul du score avec pénalités
  const calculatedScore = submission.answers.reduce((acc, ans) => {
    const q = submission.exam.questions.find(quest => (quest._id || quest.id) === ans.questionId);
    if (!q) return acc;
    if (ans.selectedOption === q.correctAnswer) return acc + pointsPerQ;
    if (!ans.selectedOption) return acc; // Vide = 0
    return acc - pointsPerQ; // Erreur = Pénalité
  }, 0);

  const isAdmis = calculatedScore >= (totalPossible / 2);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        style={{ background: 'var(--background)', width: '95%', maxWidth: '1000px', height: '90vh', borderRadius: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: 'var(--shadow-premium)' }}
      >
        {/* Modal Header */}
        <div style={{ padding: '15px 25px', background: 'var(--glass)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(10px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', background: 'var(--primary)', borderRadius: '12px', color: 'white' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, color: 'var(--text)', fontWeight: '900', fontSize: '1.1rem' }}>Rapport Académique</h3>
              <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-light)', fontWeight: '700' }}>AFB STUDIO - SECURE VERIFICATION</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={handleDownloadPDF} 
              disabled={downloading}
              style={{ background: 'var(--primary)', color: 'white', padding: '10px 20px', borderRadius: '12px', border: 'none', fontWeight: '800', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              {downloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
              <span className="hide-mobile">PDF NASA</span>
            </button>
            <button onClick={onClose} style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '10px', borderRadius: '12px', cursor: 'pointer', color: 'var(--text)' }}><X size={20} /></button>
          </div>
        </div>

        {/* Modal Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', background: 'var(--background)' }}>
          <div ref={printRef} style={{ background: 'white', margin: '0 auto', padding: '15px', width: '100%', maxWidth: '800px', borderRadius: '12px', boxShadow: 'var(--shadow-soft)' }}>
            
            {/* Header Block */}
            <div data-pdf-block="true" style={{ padding: '50px 40px', border: '6px solid #000', marginBottom: '20px', textAlign: 'center', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Logo Top Left */}
              <img 
                src={window.location.origin + "/logo.png"} 
                crossOrigin="anonymous" 
                alt="LOGO" 
                style={{ position: 'absolute', top: '25px', left: '25px', height: '70px', width: 'auto' }} 
              />
              
              {/* NOTE Top Right */}
              <div style={{ position: 'absolute', top: '25px', right: '25px' }}>
                <div style={{ background: '#000', color: '#fff', padding: '12px 25px', fontWeight: '1000', fontSize: '1.4rem', borderRadius: '4px' }}>
                  NOTE : {calculatedScore} / {totalPossible}
                </div>
              </div>

              {/* Center Title */}
              <div style={{ marginTop: '20px', marginBottom: '30px' }}>
                <h1 style={{ 
                  margin: 0, 
                  fontSize: '2.5rem', 
                  fontWeight: '1000', 
                  color: '#000', 
                  letterSpacing: '-1.5px',
                  display: 'inline-block',
                  borderBottom: '8px solid #000',
                  paddingBottom: '8px',
                  lineHeight: '1'
                }}>
                  AFB STUDIO
                </h1>
              </div>
              <div style={{ borderTop: '2px solid #000', paddingTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', textAlign: 'left' }}>
                <div>
                  <p style={{ margin: '5px 0', fontSize: '0.85rem' }}><strong>NOM :</strong> {submission.user.fullname.toUpperCase()}</p>
                  <p style={{ margin: '5px 0', fontSize: '0.85rem' }}><strong>MATRICULE :</strong> {submission.user.matricule}</p>
                </div>
                <div>
                  <p style={{ margin: '5px 0', fontSize: '0.85rem' }}><strong>EXAMEN :</strong> {submission.exam.title}</p>
                  <p style={{ margin: '5px 0', fontSize: '0.85rem' }}><strong>DATE :</strong> {new Date(submission.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Verdict Block */}
            <div data-pdf-block="true" style={{ padding: '30px', border: '5px solid #000', marginBottom: '20px', background: isAdmis ? '#f6ffed' : '#fff1f0', textAlign: 'center' }}>
              <p style={{ margin: '0 0 10px 0', fontWeight: '950', fontSize: '1.1rem', letterSpacing: '2px', color: '#000' }}>VERDICT FINAL</p>
              <h2 style={{ margin: 0, fontSize: '4.5rem', fontWeight: '1000', color: isAdmis ? '#52c41a' : '#ff4d4f', letterSpacing: '-2px', lineHeight: '1' }}>{isAdmis ? 'ADMIS' : 'REFUSÉ'}</h2>
            </div>

            {/* Questions Blocks */}
            {submission.exam.questions.map((q, idx) => {
              const subAnswer = submission.answers.find(a => a.questionId.toString() === (q._id?.toString() || q.id?.toString()));
              const studentChoice = subAnswer?.selectedOption || null;
              const isCorrect = studentChoice === q.correctAnswer;
              
              return (
                <div key={idx} data-pdf-block="true" style={{ padding: '20px', border: '2px solid #000', marginBottom: '15px', background: studentChoice ? (isCorrect ? '#f6ffed' : '#fff1f0') : '#fafafa' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontWeight: '800', fontSize: '0.8rem' }}>
                    <span>QUESTION {idx + 1}</span>
                    <span style={{ color: studentChoice ? (isCorrect ? '#52c41a' : '#ff4d4f') : '#888' }}>
                      {studentChoice ? (isCorrect ? `CORRECT (+${pointsPerQ})` : `ERREUR (-${pointsPerQ})`) : 'NON RÉPONDU (0)'}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 20px 0', fontWeight: '900', fontSize: '1rem', lineHeight: '1.4' }}>{q.text}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}>
                      <p style={{ margin: '0 0 5px 0', fontSize: '0.7rem', fontWeight: '800', color: '#666' }}>VOTRE CHOIX</p>
                      <p style={{ margin: 0, fontWeight: '900', fontSize: '0.9rem' }}>{studentChoice || '---'}</p>
                    </div>
                    <div style={{ padding: '10px', border: '1px solid #000', borderRadius: '8px', background: '#f0f7ff' }}>
                      <p style={{ margin: '0 0 5px 0', fontSize: '0.7rem', fontWeight: '800', color: '#0052cc' }}>RÉPONSE CORRECTE</p>
                      <p style={{ margin: 0, fontWeight: '900', fontSize: '0.9rem' }}>{q.correctAnswer}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Footer Block */}
            <div data-pdf-block="true" style={{ marginTop: '30px', borderTop: '4px solid #000', paddingTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 10px 0', fontWeight: '950', color: '#000' }}>CERTIFICATION OFFICIELLE</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#444', fontStyle: 'italic', maxWidth: '350px', lineHeight: '1.5' }}>
                  Ce rapport académique est généré et certifié par AFB STUDIO. Toute modification ou falsification est passible de poursuites judiciaires.
                </p>
              </div>
              <div style={{ textAlign: 'center', minWidth: '180px', position: 'relative' }}>
                <div style={{ 
                  border: '3px solid #000', 
                  height: '100px', 
                  width: '180px',
                  marginBottom: '5px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={window.location.origin + "/logo.png"} 
                    crossOrigin="anonymous" 
                    alt="WATERMARK" 
                    style={{ position: 'absolute', width: '80%', opacity: 0.15, filter: 'grayscale(1)' }} 
                  />
                  <span style={{ fontSize: '0.7rem', fontWeight: '1000', color: '#000', zIndex: 1, letterSpacing: '1px' }}>CERTIFIÉ CONFORME</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '1000', color: '#000' }}>AFB STUDIO CI</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SubmissionReview;
