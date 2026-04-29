import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Download, CheckCircle2, XCircle, Clock, User, Hash, FileText, Printer } from 'lucide-react';
import { theme } from '../theme';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const SubmissionReview = ({ submission, onClose }) => {
  const printRef = useRef();

  const handleDownloadPDF = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const data = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Copie_${submission.user.fullname}_${submission.exam.title}.pdf`);
  };

  const calculateDuration = (start, end) => {
    const diff = new Date(end) - new Date(start);
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${mins}m ${secs}s`;
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(10px)' }}>
      <motion.div 
        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: 'white', width: '100%', maxWidth: '900px', maxHeight: '95vh', borderRadius: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: theme.shadows.premium }}
      >
        {/* Toolbar */}
        <div style={{ padding: '15px 30px', borderBottom: `1px solid ${theme.colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa' }}>
          <h3 style={{ fontWeight: '800', margin: 0 }}>Visualisation de la Copie Corrigée</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleDownloadPDF} style={{ background: theme.colors.success, color: 'white', padding: '10px 20px', borderRadius: '12px', border: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <Download size={18} /> Télécharger PDF (NASA Style)
            </button>
            <button onClick={onClose} style={{ background: 'white', border: `1px solid ${theme.colors.border}`, padding: '10px', borderRadius: '50%', cursor: 'pointer' }}><X size={20} /></button>
          </div>
        </div>

        {/* PDF Content Area */}
        <div ref={printRef} style={{ flex: 1, overflowY: 'auto', padding: '60px', background: 'white', color: '#000' }}>
          
          {/* NASA Header */}
          <div style={{ border: '3px solid #000', padding: '30px', marginBottom: '40px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '0.7rem', fontWeight: '900', opacity: 0.3 }}>AFB-INTERNAL-SYSTEM-v2.0</div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
              <div style={{ textAlign: 'center' }}>
                <img src="/logo.png" alt="AFB" style={{ width: '80px', marginBottom: '10px' }} />
                <div style={{ fontWeight: '900', fontSize: '0.8rem', letterSpacing: '2px' }}>FORMATION AI FULLSTACK BUILDER</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '900', fontSize: '1.2rem', marginBottom: '5px' }}>RAPPORT D'EXAMEN OFFICIEL</div>
                <div style={{ background: '#000', color: '#fff', padding: '5px 15px', fontWeight: '800', fontSize: '1.1rem' }}>NOTE: {submission.score} / {submission.exam.questions.length}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', borderTop: '2px solid #000', paddingTop: '20px' }}>
              <div>
                <p style={{ margin: '5px 0', fontSize: '0.9rem' }}><User size={14} style={{ marginRight: '8px' }} /> <strong>CANDIDAT :</strong> {submission.user.fullname.toUpperCase()}</p>
                <p style={{ margin: '5px 0', fontSize: '0.9rem' }}><Hash size={14} style={{ marginRight: '8px' }} /> <strong>MATRICULE :</strong> {submission.user.matricule}</p>
                <p style={{ margin: '5px 0', fontSize: '0.9rem' }}><FileText size={14} style={{ marginRight: '8px' }} /> <strong>ÉPREUVE :</strong> {submission.exam.title}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '5px 0', fontSize: '0.9rem' }}><Calendar size={14} style={{ marginRight: '8px' }} /> <strong>DATE :</strong> {new Date(submission.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                <p style={{ margin: '5px 0', fontSize: '0.9rem' }}><Clock size={14} style={{ marginRight: '8px' }} /> <strong>HEURE :</strong> {new Date(submission.createdAt).toLocaleTimeString('fr-FR')}</p>
                <p style={{ margin: '5px 0', fontSize: '0.9rem' }}><Clock size={14} style={{ marginRight: '8px' }} /> <strong>DURÉE EFFECTIVE :</strong> {calculateDuration(submission.exam.startTime, submission.createdAt)}</p>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h4 style={{ borderBottom: '2px solid #000', paddingBottom: '10px', fontWeight: '900', textTransform: 'uppercase' }}>Verdict du Barème Automatique</h4>
            <div style={{ padding: '15px', background: '#f8f9fa', borderLeft: '5px solid #000', marginTop: '10px', fontSize: '0.9rem' }}>
              Le barème a été appliqué sur la base des réponses validées lors de la création de l'épreuve. 
              Précision du candidat : <strong>{((submission.score / submission.exam.questions.length) * 100).toFixed(1)}%</strong>. 
              Nombre de tentatives : 1 (Tentative Unique Verrouillée).
            </div>
          </div>

          {/* Questions & Answers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {submission.exam.questions.map((q, idx) => {
              const studentAnswer = submission.answers[idx]?.answer;
              const isCorrect = studentAnswer === q.correctAnswer;

              return (
                <div key={idx} style={{ padding: '20px', border: '1px solid #eee', borderRadius: '12px', background: isCorrect ? '#f0fff4' : '#fff5f5' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontWeight: '900', fontSize: '0.8rem', color: '#666' }}>QUESTION {idx + 1}</span>
                    {isCorrect ? <CheckCircle2 color={theme.colors.success} size={20} /> : <XCircle color={theme.colors.error} size={20} />}
                  </div>
                  <p style={{ fontWeight: '700', marginBottom: '15px', fontSize: '1rem' }}>{q.text}</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#999', display: 'block', marginBottom: '5px' }}>RÉPONSE ÉTUDIANT</span>
                      <div style={{ padding: '10px', borderRadius: '8px', background: isCorrect ? '#dcfce7' : '#fee2e2', border: `1px solid ${isCorrect ? '#22c55e' : '#ef4444'}`, fontSize: '0.9rem', fontWeight: '600' }}>
                        {studentAnswer || 'AUCUNE RÉPONSE'}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#999', display: 'block', marginBottom: '5px' }}>BARÈME OFFICIEL</span>
                      <div style={{ padding: '10px', borderRadius: '8px', background: '#f1f5f9', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: '600' }}>
                        {q.correctAnswer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer NASA */}
          <div style={{ marginTop: '50px', paddingTop: '20px', borderTop: '1px dashed #000', textAlign: 'center', fontSize: '0.75rem', color: '#999' }}>
            Ce document est généré numériquement par AFB EXAM Platform. Toute falsification est passible de sanctions. 
            <br />Certifié conforme au barème académique - ID: {submission._id}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SubmissionReview;
