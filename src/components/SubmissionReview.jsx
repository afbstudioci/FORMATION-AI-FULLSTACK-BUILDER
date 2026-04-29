import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Download, CheckCircle2, XCircle, Clock, User, Hash, FileText, Calendar, Award, ShieldCheck, Mail, Phone } from 'lucide-react';
import { theme } from '../theme';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const SubmissionReview = ({ submission, onClose }) => {
  const printRef = useRef();

  const handleDownloadPDF = async () => {
    const element = printRef.current;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = 210;
    const pdfHeight = 297;
    const margin = 10;
    const contentWidth = pdfWidth - (2 * margin);
    
    // On récupère tous les blocs qui ne doivent pas être coupés
    // On utilise querySelectorAll sur les éléments ayant un style spécifique ou une classe
    const blocks = element.querySelectorAll('[data-pdf-block="true"]');
    
    let currentY = margin;

    const addBlockToPDF = async (block, isFirst = false) => {
      const canvas = await html2canvas(block, { 
        scale: 2, 
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const imgHeight = (canvas.height * contentWidth) / canvas.width;

      // Si le bloc dépasse de la page actuelle, on change de page
      if (!isFirst && (currentY + imgHeight > pdfHeight - margin)) {
        pdf.addPage();
        currentY = margin;
      }

      pdf.addImage(imgData, 'PNG', margin, currentY, contentWidth, imgHeight);
      currentY += imgHeight + 5; // Petit espacement entre les blocs
    };

    try {
      // On traite chaque bloc séquentiellement
      for (let i = 0; i < blocks.length; i++) {
        await addBlockToPDF(blocks[i], i === 0);
      }
      
      pdf.save(`RAPPORT_OFFICIEL_AFB_STUDIO_${submission.user.fullname.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error("PDF Error:", err);
      alert("Erreur lors de la génération intelligente du PDF");
    }
  };

  const calculateOfficialDuration = (start, end) => {
    if (!start || !end) return "Non définie";
    const dStart = new Date(start);
    const dEnd = new Date(end);
    const diff = dEnd - dStart;
    if (isNaN(diff) || diff <= 0) return "Non définie";
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return `${hours > 0 ? hours + 'H ' : ''}${mins}min`;
  };

  // On s'assure de récupérer les points depuis la soumission (instantané au moment de l'examen)
  const pointsPerQ = Number(submission.pointsPerQuestion || submission.exam?.pointsPerQuestion || 1);
  const totalPossible = (submission.exam?.questions?.length || 0) * pointsPerQ;
  const isAdmis = submission.score >= (totalPossible / 2);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(20px)' }}>
      <motion.div 
        initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: 'white', width: '100%', maxWidth: '1000px', maxHeight: '95vh', borderRadius: '30px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.6)' }}
      >
        <div style={{ padding: '20px 40px', borderBottom: `1px solid ${theme.colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ padding: '12px', background: 'linear-gradient(135deg, #0984e3, #6c5ce7)', borderRadius: '15px', boxShadow: '0 4px 12px rgba(9, 132, 227, 0.3)' }}>
              <ShieldCheck color="#fff" size={24} />
            </div>
            <div>
              <h3 style={{ fontWeight: '900', margin: 0, color: theme.colors.text, fontSize: '1.3rem', letterSpacing: '-0.5px' }}>OFFICIAL ACADEMIC REPORT</h3>
              <p style={{ fontSize: '0.75rem', color: theme.colors.textLight, fontWeight: '700', textTransform: 'uppercase' }}>Verified by AFB STUDIO - Administration</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button onClick={handleDownloadPDF} style={{ background: theme.colors.primary, color: 'white', padding: '14px 30px', borderRadius: '15px', border: 'none', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 10px 20px rgba(9, 132, 227, 0.4)' }}>
              <Download size={20} /> TÉLÉCHARGER LE PDF INTELLIGENT
            </button>
            <button onClick={onClose} style={{ background: '#f1f2f6', border: 'none', padding: '14px', borderRadius: '50%', cursor: 'pointer', color: theme.colors.text }}><X size={20} /></button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', background: '#f4f7f6', padding: '40px' }}>
          <div ref={printRef} style={{ background: 'white', margin: '0 auto', padding: '20px', width: '100%', maxWidth: '800px', color: '#000' }}>
            
            {/* BLOC 1: HEADER */}
            <div data-pdf-block="true" style={{ border: '5px solid #000', padding: '45px', marginBottom: '30px', background: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
                <div style={{ textAlign: 'center' }}>
                  <img src="/logo.png" alt="Logo" style={{ width: '100px', marginBottom: '10px' }} />
                  <div style={{ fontWeight: '900', fontSize: '0.8rem', letterSpacing: '3px', color: '#000' }}>AFB EXAM ACADEMY</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '900', fontSize: '1.8rem', marginBottom: '10px', color: '#000' }}>RAPPORT D'EXAMEN</div>
                  <div style={{ background: '#000', color: '#fff', padding: '10px 30px', fontWeight: '900', fontSize: '1.5rem', borderRadius: '4px', display: 'inline-block' }}>
                    NOTE : {submission.score} / {totalPossible}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', borderTop: '3px solid #000', paddingTop: '30px' }}>
                <div>
                  <div style={{ marginBottom: '15px', fontSize: '1rem' }}><strong>CANDIDAT :</strong> {submission.user.fullname.toUpperCase()}</div>
                  <div style={{ marginBottom: '15px', fontSize: '1rem' }}><strong>MATRICULE :</strong> {submission.user.matricule}</div>
                  <div style={{ marginBottom: '15px', fontSize: '1rem' }}><strong>ÉPREUVE :</strong> {submission.exam.title}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ marginBottom: '15px', fontSize: '1rem' }}><strong>SESSION DU :</strong> {new Date(submission.createdAt).toLocaleDateString('fr-FR')}</div>
                  <div style={{ fontWeight: '900', fontSize: '1rem', color: theme.colors.primary }}><strong>DURÉE OFFICIELLE :</strong> {calculateOfficialDuration(submission.exam.startTime, submission.exam.endTime)}</div>
                </div>
              </div>
            </div>

            {/* BLOC 2: VERDICT */}
            <div data-pdf-block="true" style={{ marginBottom: '40px', background: 'white', padding: '10px' }}>
              <div style={{ borderBottom: '3px solid #000', paddingBottom: '10px', fontWeight: '900', fontSize: '1.3rem', marginBottom: '20px' }}>
                DÉCISION DU CONSEIL ACADÉMIQUE
              </div>
              <div style={{ padding: '30px', background: isAdmis ? '#f6ffed' : '#fff1f0', border: `3px solid ${isAdmis ? '#52c41a' : '#f5222d'}`, borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '5px' }}>RÉSULTAT :</div>
                  <div style={{ fontSize: '2.2rem', fontWeight: '950', color: isAdmis ? '#52c41a' : '#f5222d' }}>{isAdmis ? 'ADMIS' : 'REFUSÉ'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1rem', fontWeight: '800', color: '#666' }}>TENTATIVE</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '900' }}>UNIQUE</div>
                </div>
              </div>
            </div>

            {/* BLOCS QUESTIONS */}
            {submission.exam.questions.map((q, idx) => {
              const subAnswer = submission.answers.find(a => a.questionId.toString() === (q._id?.toString() || q.id?.toString()));
              const studentChoice = subAnswer?.selectedOption || null;
              const isCorrect = studentChoice === q.correctAnswer;
              const isNotAnswered = !studentChoice;

              return (
                <div key={idx} data-pdf-block="true" style={{ padding: '30px', border: '2px solid #000', borderRadius: '15px', background: isNotAnswered ? '#fafafa' : (isCorrect ? '#f6ffed' : '#fff1f0'), marginBottom: '25px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <span style={{ fontWeight: '900', fontSize: '1rem', background: '#eee', padding: '4px 12px', borderRadius: '4px' }}>QUESTION {idx + 1} / {submission.exam.questions.length}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '900' }}>
                      {isNotAnswered ? (
                        <span style={{ color: '#888' }}>NON RÉPONDU (0 pts)</span>
                      ) : isCorrect ? (
                        <span style={{ color: '#52c41a' }}>CORRECT (+{pointsPerQ} pts)</span>
                      ) : (
                        <span style={{ color: '#ff4d4f' }}>ERREUR (-{pointsPerQ} pts)</span>
                      )}
                    </div>
                  </div>
                  <p style={{ fontWeight: '900', fontSize: '1.2rem', marginBottom: '25px' }}>{q.text}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: '900', color: '#666', marginBottom: '8px' }}>Réponse du Candidat</div>
                      <div style={{ padding: '15px', borderRadius: '10px', background: isNotAnswered ? '#eee' : (isCorrect ? '#d9f7be' : '#ffccc7'), border: `2px solid ${isNotAnswered ? '#ccc' : (isCorrect ? '#52c41a' : '#ff4d4f')}`, fontWeight: '900' }}>
                        {studentChoice || 'AUCUNE RÉPONSE'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: '900', color: '#666', marginBottom: '8px' }}>Clé de Correction</div>
                      <div style={{ padding: '15px', borderRadius: '10px', background: '#e6f7ff', border: '2px solid #91d5ff', fontWeight: '900' }}>
                        {q.correctAnswer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* BLOC FINAL: SIGNATURE & CONTACTS */}
            <div data-pdf-block="true" style={{ marginTop: '50px', background: 'white' }}>
              <div style={{ borderTop: '4px solid #000', paddingTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <Award size={24} />
                    <h4 style={{ fontWeight: '950', fontSize: '1.2rem', margin: 0 }}>CERTIFICATION LÉGALE</h4>
                  </div>
                  <div style={{ background: '#f8f9fa', padding: '20px', borderLeft: '6px solid #000' }}>
                    <p style={{ fontSize: '0.9rem', color: '#000', lineHeight: '1.4', margin: 0, fontStyle: 'italic' }}>
                      "Le présent rapport d'examen est un document authentique généré par le système AFB EXAM. Il atteste des compétences du candidat sur le module cité. Toute altération rend ce document nul et non avenu."
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '900', marginBottom: '10px' }}>DIRECTION GÉNÉRALE AFB STUDIO</div>
                  <div style={{ height: '100px', border: '2px dashed #000', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fcfcfc', borderRadius: '15px', position: 'relative' }}>
                    <div style={{ transform: 'rotate(-15deg)', fontSize: '1rem', fontWeight: '950', color: 'rgba(9, 132, 227, 0.1)', whiteSpace: 'nowrap' }}>
                      AFB STUDIO - CERTIFIED SYSTEM
                    </div>
                  </div>
                  <div style={{ fontWeight: '950', fontSize: '1.3rem' }}>AFB STUDIO</div>
                  <div style={{ fontSize: '0.9rem', color: theme.colors.primary, fontWeight: '900' }}>ADMINISTRATION CENTRALE</div>
                </div>
              </div>

              <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666', fontWeight: '700' }}>
                    <Mail size={14} color={theme.colors.primary} /> afbstudioci@gmail.com
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666', fontWeight: '700' }}>
                    <Phone size={14} color={theme.colors.primary} /> +225 0768388770
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666', fontWeight: '700' }}>
                    <Phone size={14} color={theme.colors.primary} /> +229 43706402
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SubmissionReview;
