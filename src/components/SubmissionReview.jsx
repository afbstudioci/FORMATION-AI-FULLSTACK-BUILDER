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
    const canvas = await html2canvas(element, { 
      scale: 2,
      useCORS: true,
      logging: false
    });
    const data = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Copie_Corrigee_${submission.user.fullname}_${submission.exam.title}.pdf`);
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) return "N/A";
    const diff = new Date(end) - new Date(start);
    if (isNaN(diff)) return "N/A";
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${mins} min ${secs} s`;
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(10px)' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        style={{ background: 'white', width: '100%', maxWidth: '900px', maxHeight: '95vh', borderRadius: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: theme.shadows.premium }}
      >
        {/* Toolbar */}
        <div style={{ padding: '15px 30px', borderBottom: `1px solid ${theme.colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa' }}>
          <h3 style={{ fontWeight: '800', margin: 0, color: theme.colors.text }}>Revue NASA Style</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleDownloadPDF} style={{ background: theme.colors.primary, color: 'white', padding: '10px 20px', borderRadius: '12px', border: 'none', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(9, 132, 227, 0.3)' }}>
              <Download size={18} /> GÉNÉRER PDF OFFICIEL
            </button>
            <button onClick={onClose} style={{ background: 'white', border: `1px solid ${theme.colors.border}`, padding: '10px', borderRadius: '50%', cursor: 'pointer' }}><X size={20} /></button>
          </div>
        </div>

        {/* PDF Content Area */}
        <div ref={printRef} style={{ flex: 1, overflowY: 'auto', padding: '60px', background: 'white', color: '#000' }}>
          
          {/* NASA Header Premium */}
          <div style={{ border: '4px solid #000', padding: '40px', marginBottom: '40px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
              <div style={{ textAlign: 'center' }}>
                <img src="/logo.png" alt="AFB" style={{ width: '100px', marginBottom: '10px' }} />
                <div style={{ fontWeight: '900', fontSize: '0.9rem', letterSpacing: '3px', textTransform: 'uppercase' }}>AFB EXAM ACADEMY</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '900', fontSize: '1.4rem', marginBottom: '8px', letterSpacing: '1px' }}>RAPPORT D'EXAMEN OFFICIEL</div>
                <div style={{ background: '#000', color: '#fff', padding: '10px 25px', fontWeight: '900', fontSize: '1.3rem', borderRadius: '4px' }}>NOTE : {submission.score} / {submission.exam.questions.length}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', borderTop: '3px solid #000', paddingTop: '30px' }}>
              <div style={{ borderRight: '1px solid #eee', paddingRight: '20px' }}>
                <p style={{ margin: '8px 0', fontSize: '1rem' }}><User size={16} style={{ marginRight: '10px', verticalAlign: 'middle' }} /> <strong>ÉTUDIANT :</strong> {submission.user.fullname.toUpperCase()}</p>
                <p style={{ margin: '8px 0', fontSize: '1rem' }}><Hash size={16} style={{ marginRight: '10px', verticalAlign: 'middle' }} /> <strong>MATRICULE :</strong> {submission.user.matricule}</p>
                <p style={{ margin: '8px 0', fontSize: '1rem' }}><FileText size={16} style={{ marginRight: '10px', verticalAlign: 'middle' }} /> <strong>ÉPREUVE :</strong> {submission.exam.title}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '8px 0', fontSize: '1rem' }}><Calendar size={16} style={{ marginRight: '10px', verticalAlign: 'middle' }} /> <strong>DATE :</strong> {new Date(submission.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                <p style={{ margin: '8px 0', fontSize: '1rem' }}><Clock size={16} style={{ marginRight: '10px', verticalAlign: 'middle' }} /> <strong>HEURE :</strong> {new Date(submission.createdAt).toLocaleTimeString('fr-FR')}</p>
                <p style={{ margin: '8px 0', fontSize: '1rem', color: theme.colors.primary, fontWeight: '700' }}><Clock size={16} style={{ marginRight: '10px', verticalAlign: 'middle' }} /> <strong>DURÉE EFFECTIVE :</strong> {calculateDuration(submission.exam.startTime, submission.createdAt)}</p>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h4 style={{ borderBottom: '3px solid #000', paddingBottom: '12px', fontWeight: '900', textTransform: 'uppercase', fontSize: '1.1rem' }}>Verdict du Barème Automatique</h4>
            <div style={{ padding: '20px', background: '#f8f9fa', borderLeft: '8px solid #000', marginTop: '15px', fontSize: '1rem', lineHeight: '1.6' }}>
              Le barème officiel a été appliqué sur la base des réponses validées par l'administrateur lors de la conception de l'épreuve. 
              Précision académique du candidat : <strong>{((submission.score / submission.exam.questions.length) * 100).toFixed(1)}%</strong>. 
              Statut final : <strong style={{ color: submission.score >= submission.exam.questions.length / 2 ? 'green' : 'red' }}>{submission.score >= submission.exam.questions.length / 2 ? 'ADMIS' : 'ÉCHEC'}</strong>.
            </div>
          </div>

          {/* Questions & Answers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {submission.exam.questions.map((q, idx) => {
              // Récupération sécurisée de la réponse de l'étudiant
              const subAnswer = submission.answers.find(a => a.questionId === q._id);
              const studentChoice = subAnswer ? subAnswer.answer : 'AUCUNE RÉPONSE';
              const isCorrect = studentChoice === q.correctAnswer;

              return (
                <div key={idx} style={{ padding: '25px', border: '2px solid #eee', borderRadius: '16px', background: isCorrect ? '#f0fff4' : '#fff5f5', pageBreakInside: 'avoid' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <span style={{ fontWeight: '900', fontSize: '0.9rem', color: '#666' }}>QUESTION {idx + 1} / {submission.exam.questions.length}</span>
                    {isCorrect ? <CheckCircle2 color={theme.colors.success} size={24} /> : <XCircle color={theme.colors.error} size={24} />}
                  </div>
                  <p style={{ fontWeight: '800', marginBottom: '20px', fontSize: '1.1rem', lineHeight: '1.4' }}>{q.text}</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#777', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Réponse du Candidat</span>
                      <div style={{ padding: '12px 15px', borderRadius: '10px', background: isCorrect ? '#dcfce7' : '#fee2e2', border: `2px solid ${isCorrect ? '#22c55e' : '#ef4444'}`, fontSize: '0.95rem', fontWeight: '700' }}>
                        {studentChoice}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#777', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Correction Officielle</span>
                      <div style={{ padding: '12px 15px', borderRadius: '10px', background: '#f1f5f9', border: '2px solid #cbd5e1', fontSize: '0.95rem', fontWeight: '700' }}>
                        {q.correctAnswer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* New Certification Section (Signature) */}
          <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '2px solid #000', paddingTop: '40px' }}>
            <div style={{ maxWidth: '400px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <Award color={theme.colors.primary} size={32} />
                <div style={{ fontWeight: '900', fontSize: '1.1rem' }}>CERTIFICATION ACADÉMIQUE</div>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#555', lineHeight: '1.5' }}>
                Ce rapport atteste de la participation effective de l'étudiant susmentionné à l'épreuve de formation. 
                Les données de correction sont immuables et certifiées par le système de gestion AFB EXAM.
              </p>
            </div>
            
            <div style={{ textAlign: 'center', minWidth: '250px' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '10px', textTransform: 'uppercase' }}>Cachet & Signature de l'Administrateur</div>
              <div style={{ height: '80px', border: '1px dashed #ccc', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', borderRadius: '8px' }}>
                <img src="/logo.png" alt="Signature" style={{ height: '50px', opacity: 0.2, filter: 'grayscale(1)' }} />
              </div>
              <div style={{ fontWeight: '900', fontSize: '1.1rem', color: theme.colors.text }}>DIRECTION AFB EXAM</div>
              <div style={{ fontSize: '0.8rem', color: theme.colors.primary, fontWeight: '700' }}>Document Officiel Certifié</div>
            </div>
          </div>

          {/* Footer NASA Professional */}
          <div style={{ marginTop: '40px', textAlign: 'center', fontSize: '0.7rem', color: '#bbb', letterSpacing: '1px' }}>
            GÉNÉRÉ PAR LE SYSTÈME D'EXAMENS AFB - PROJET : FORMATION AI FULLSTACK BUILDER - 2026
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SubmissionReview;
