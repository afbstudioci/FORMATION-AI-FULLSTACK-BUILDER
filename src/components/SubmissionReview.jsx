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
    const originalStyle = element.style.cssText;
    
    element.style.width = '800px';
    element.style.height = 'auto';

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
      
      const imgWidth = 210; 
      const pageHeight = 297; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`RAPPORT_OFFICIEL_AFB_STUDIO_${submission.user.fullname.replace(/\s+/g, '_')}.pdf`);
    } finally {
      element.style.cssText = originalStyle;
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

  const pointsPerQ = submission.exam.pointsPerQuestion || 1;
  const totalPossible = submission.exam.questions.length * pointsPerQ;
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
              <Download size={20} /> TÉLÉCHARGER LE PDF NASA
            </button>
            <button onClick={onClose} style={{ background: '#f1f2f6', border: 'none', padding: '14px', borderRadius: '50%', cursor: 'pointer', color: theme.colors.text }}><X size={20} /></button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', background: '#f4f7f6', padding: '40px' }}>
          <div ref={printRef} style={{ background: 'white', margin: '0 auto', padding: '80px', width: '100%', color: '#000', position: 'relative' }}>
            
            <div style={{ border: '5px solid #000', padding: '45px', marginBottom: '60px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
                <div style={{ textAlign: 'center' }}>
                  <img src="/logo.png" alt="Logo" style={{ width: '130px', marginBottom: '15px' }} />
                  <div style={{ fontWeight: '900', fontSize: '0.9rem', letterSpacing: '5px', color: '#000' }}>AFB EXAM ACADEMY</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '900', fontSize: '2rem', marginBottom: '15px', color: '#000', lineHeight: '1' }}>RAPPORT D'EXAMEN</div>
                  <div style={{ background: '#000', color: '#fff', padding: '15px 40px', fontWeight: '900', fontSize: '1.8rem', borderRadius: '4px', display: 'inline-block' }}>
                    NOTE : {submission.score} / {totalPossible}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '50px', borderTop: '3px solid #000', paddingTop: '40px' }}>
                <div>
                  <div style={{ marginBottom: '20px', fontSize: '1.1rem' }}><User size={20} style={{ marginRight: '15px', verticalAlign: 'middle' }} /> <strong>CANDIDAT :</strong> {submission.user.fullname.toUpperCase()}</div>
                  <div style={{ marginBottom: '20px', fontSize: '1.1rem' }}><Hash size={20} style={{ marginRight: '15px', verticalAlign: 'middle' }} /> <strong>MATRICULE :</strong> {submission.user.matricule}</div>
                  <div style={{ marginBottom: '20px', fontSize: '1.1rem' }}><FileText size={20} style={{ marginRight: '15px', verticalAlign: 'middle' }} /> <strong>ÉPREUVE :</strong> {submission.exam.title}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ marginBottom: '20px', fontSize: '1.1rem' }}><Calendar size={20} style={{ marginRight: '15px', verticalAlign: 'middle' }} /> <strong>SESSION DU :</strong> {new Date(submission.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                  <div style={{ marginBottom: '20px', fontSize: '1.1rem' }}><Clock size={20} style={{ marginRight: '15px', verticalAlign: 'middle' }} /> <strong>TERMINÉ À :</strong> {new Date(submission.createdAt).toLocaleTimeString('fr-FR')}</div>
                  <div style={{ fontWeight: '900', fontSize: '1.1rem', color: theme.colors.primary }}><Clock size={20} style={{ marginRight: '15px', verticalAlign: 'middle' }} /> <strong>DURÉE OFFICIELLE :</strong> {calculateOfficialDuration(submission.exam.startTime, submission.exam.endTime)}</div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '60px' }}>
              <div style={{ borderBottom: '3px solid #000', paddingBottom: '12px', fontWeight: '900', fontSize: '1.5rem', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <ShieldCheck size={28} /> DÉCISION DU CONSEIL ACADÉMIQUE
              </div>
              <div style={{ padding: '40px', background: isAdmis ? '#f6ffed' : '#fff1f0', border: `3px solid ${isAdmis ? '#52c41a' : '#f5222d'}`, borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px', color: '#333' }}>RÉSULTAT DE LA SESSION :</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '950', color: isAdmis ? '#52c41a' : '#f5222d', letterSpacing: '2px' }}>{isAdmis ? 'ADMIS' : 'REFUSÉ'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1rem', fontWeight: '800', color: '#666', marginBottom: '5px' }}>TENTATIVE</div>
                  <div style={{ fontSize: '2rem', fontWeight: '900' }}>UNIQUE</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              {submission.exam.questions.map((q, idx) => {
                const subAnswer = submission.answers.find(a => a.questionId.toString() === q._id.toString());
                const studentChoice = subAnswer?.selectedOption || null;
                const isCorrect = studentChoice === q.correctAnswer;
                const isNotAnswered = !studentChoice;

                return (
                  <div key={idx} style={{ padding: '40px', border: '2px solid #000', borderRadius: '20px', background: isNotAnswered ? '#fafafa' : (isCorrect ? '#f6ffed' : '#fff1f0'), pageBreakInside: 'avoid' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', alignItems: 'center' }}>
                      <span style={{ fontWeight: '900', fontSize: '1.1rem', color: '#000', background: '#eee', padding: '5px 15px', borderRadius: '5px' }}>QUESTION {idx + 1} / {submission.exam.questions.length}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '900', fontSize: '1.1rem' }}>
                        {isNotAnswered ? (
                          <span style={{ color: '#888' }}>NON RÉPONDU (0 pts)</span>
                        ) : isCorrect ? (
                          <><CheckCircle2 color="#52c41a" size={28} /> <span style={{ color: '#52c41a' }}>CORRECT (+{pointsPerQ} pts)</span></>
                        ) : (
                          <><XCircle color="#ff4d4f" size={28} /> <span style={{ color: '#ff4d4f' }}>ERREUR (-{pointsPerQ} pts)</span></>
                        )}
                      </div>
                    </div>
                    <p style={{ fontWeight: '900', fontSize: '1.3rem', marginBottom: '35px', lineHeight: '1.4', color: '#000' }}>{q.text}</p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: '900', color: '#666', marginBottom: '12px', textTransform: 'uppercase' }}>Réponse du Candidat</div>
                        <div style={{ padding: '20px', borderRadius: '12px', background: isNotAnswered ? '#eee' : (isCorrect ? '#d9f7be' : '#ffccc7'), border: `3px solid ${isNotAnswered ? '#ccc' : (isCorrect ? '#52c41a' : '#ff4d4f')}`, fontWeight: '900', fontSize: '1.2rem', color: '#000' }}>
                          {studentChoice || 'AUCUNE RÉPONSE'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: '900', color: '#666', marginBottom: '12px', textTransform: 'uppercase' }}>Clé de Correction</div>
                        <div style={{ padding: '20px', borderRadius: '12px', background: '#e6f7ff', border: '3px solid #91d5ff', fontWeight: '900', fontSize: '1.2rem', color: '#000' }}>
                          {q.correctAnswer}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '100px', pageBreakInside: 'avoid' }}>
              <div style={{ borderTop: '4px solid #000', paddingTop: '50px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '60px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                    <div style={{ padding: '12px', background: '#000', borderRadius: '12px' }}>
                      <Award color="#fff" size={32} />
                    </div>
                    <h4 style={{ fontWeight: '950', fontSize: '1.5rem', margin: 0 }}>CERTIFICATION LÉGALE</h4>
                  </div>
                  <div style={{ background: '#f8f9fa', padding: '25px', borderLeft: '10px solid #000', borderRadius: '0 15px 15px 0' }}>
                    <p style={{ fontSize: '1.1rem', color: '#000', lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>
                      "Le présent rapport d'examen est un document authentique généré par le système AFB EXAM. Il atteste des compétences du candidat sur le module cité. Toute altération rend ce document nul et non avenu."
                    </p>
                  </div>
                  <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666', fontWeight: '800' }}>
                    Généré électroniquement le {new Date().toLocaleString('fr-FR')} - ID RÉF : {submission._id.toString().toUpperCase()}
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>DIRECTION GÉNÉRALE AFB STUDIO</div>
                  <div style={{ height: '140px', border: '3px dashed #000', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fcfcfc', borderRadius: '20px', position: 'relative', overflow: 'hidden' }}>
                    <img src="/logo.png" alt="Sceau" style={{ height: '90px', opacity: 0.1, filter: 'grayscale(1)' }} />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-20deg)', border: '4px double rgba(9, 132, 227, 0.2)', padding: '10px 20px', borderRadius: '10px', fontSize: '1.2rem', fontWeight: '950', color: 'rgba(9, 132, 227, 0.2)', whiteSpace: 'nowrap' }}>
                      AFB STUDIO - CERTIFIED SYSTEM
                    </div>
                  </div>
                  <div style={{ fontWeight: '950', fontSize: '1.6rem', color: '#000', marginBottom: '5px' }}>AFB STUDIO</div>
                  <div style={{ fontSize: '1.1rem', color: theme.colors.primary, fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px' }}>ADMINISTRATION CENTRALE</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '80px', borderTop: '1px solid #eee', paddingTop: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#666', fontWeight: '700' }}>
                  <Mail size={18} color={theme.colors.primary} /> afbstudioci@gmail.com
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#666', fontWeight: '700' }}>
                  <Phone size={18} color={theme.colors.primary} /> 225 07 68 38 87 70
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#666', fontWeight: '700' }}>
                  <Phone size={18} color={theme.colors.primary} /> 229 43 70 64 02
                </div>
              </div>
              <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '0.9rem', color: '#bbb', letterSpacing: '5px', fontWeight: '800' }}>
                AFB EXAM SYSTEM
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SubmissionReview;
