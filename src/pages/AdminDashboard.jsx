import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Users, Download, Loader2, Trash2, Calendar, Clock, ChevronRight } from 'lucide-react';
import api from '../services/api';
import { theme } from '../theme';
import CreateExamModal from '../components/CreateExamModal';
import ConfirmModal from '../components/ConfirmModal';
import Alert from '../components/Alert';
import { subscribeToSubmissions } from '../services/socket';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalStudents: 0, totalExams: 0, totalSubmissions: 0 });
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [statsRes, examsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/exams')
      ]);
      setStats(statsRes.data);
      setExams(examsRes.data);
    } catch (err) {
      setError("Erreur lors de la recuperation des donnees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Ecoute temps reel des nouvelles copies
    subscribeToSubmissions((newSub) => {
      setStats(prev => ({ ...prev, totalSubmissions: prev.totalSubmissions + 1 }));
      // Optionnel : Notification sonore ou visuelle ici
    });
  }, []);

  const handleDeleteExam = (id) => {
    setConfirmDelete({ open: true, id });
  };

  const handleActualDelete = async () => {
    try {
      await api.delete(`/exams/${confirmDelete.id}`);
      fetchData();
    } catch (err) {
      setError("Impossible de supprimer l'epreuve");
    } finally {
      setConfirmDelete({ open: false, id: null });
    }
  };

  if (loading) return (
    <div style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 className="animate-spin" size={48} color={theme.colors.primary} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <Alert message={error} onClose={() => setError('')} />

      {/* Header avec bouton d'action */}
      <div className="mobile-stack" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
        <div>
          <h2 style={{ fontWeight: '900', color: theme.colors.text, letterSpacing: '-1px' }}>Dashboard Admin</h2>
          <p style={{ color: theme.colors.textLight, marginTop: '5px', fontSize: '0.9rem' }}>Gérez vos épreuves et suivez les performances</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          style={{
            background: theme.colors.primary,
            color: 'white',
            padding: '12px 24px',
            borderRadius: theme.borderRadius.medium,
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: `0 10px 20px ${theme.colors.primary}30`,
            width: window.innerWidth < 768 ? '100%' : 'auto'
          }}
        >
          <Plus size={20} /> Nouvelle Epreuve
        </button>
      </div>

      {/* Cartes de statistiques */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
        {[
          { label: 'Etudiants Inscrits', value: stats.totalStudents, icon: <Users />, color: theme.colors.primary },
          { label: 'Epreuves Publiees', value: stats.totalExams, icon: <FileText />, color: theme.colors.secondary },
          { label: 'Copies Rendues', value: stats.totalSubmissions, icon: <Download />, color: theme.colors.success }
        ].map((item, idx) => (
          <div key={idx} style={{ 
            background: theme.colors.surface, 
            padding: '30px', 
            borderRadius: theme.borderRadius.large, 
            boxShadow: theme.shadows.soft,
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            border: `1px solid ${theme.colors.border}`,
            cursor: idx === 0 ? 'pointer' : 'default'
          }}
          onClick={() => idx === 0 && navigate('/admin/users')}
          >
            <div style={{ 
              background: `${item.color}15`, 
              padding: '15px', 
              borderRadius: '15px',
              color: item.color
            }}>
              {React.cloneElement(item.icon, { size: 28 })}
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: theme.colors.text }}>{item.value}</div>
              <div style={{ fontSize: '0.85rem', color: theme.colors.textLight, fontWeight: '700' }}>{item.label}</div>
              {idx === 0 && (
                <div style={{ fontSize: '0.75rem', color: theme.colors.primary, fontWeight: '800', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Gérer les accès <ChevronRight size={14} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Liste des Epreuves */}
      <div style={{ 
        background: theme.colors.surface, 
        borderRadius: theme.borderRadius.large, 
        boxShadow: theme.shadows.soft,
        border: `1px solid ${theme.colors.border}`,
        overflow: 'hidden'
      }}>
        <div style={{ padding: '25px', borderBottom: `1px solid ${theme.colors.border}`, background: '#fcfcfc' }}>
          <h2 style={{ fontWeight: '800', fontSize: '1.2rem' }}>Epreuves en cours</h2>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {exams.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: theme.colors.textLight }}>
              Aucune epreuve creee pour le moment.
            </div>
          ) : (
            exams.map((exam) => (
              <div key={exam._id} className="mobile-stack" style={{ 
                padding: '25px', 
                borderBottom: `1px solid ${theme.colors.border}`, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                gap: '20px'
              }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <div className="hide-mobile" style={{ 
                    width: '45px', height: '45px', background: theme.colors.background, 
                    borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.colors.primary 
                  }}>
                    <FileText size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: '700', color: theme.colors.text, fontSize: '1rem' }}>{exam.title}</h3>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '5px', fontSize: '0.8rem', color: theme.colors.textLight }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {new Date(exam.startTime).toLocaleDateString()}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {exam.questions?.length} Q.</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', width: window.innerWidth < 768 ? '100%' : 'auto' }}>
                  <button 
                    onClick={() => navigate('/admin/submissions', { state: { examId: exam._id, examTitle: exam.title } })}
                    style={{ 
                      flex: 1, padding: '10px 18px', borderRadius: '8px', background: theme.colors.background, 
                      color: theme.colors.text, fontWeight: '700', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }}
                  >
                    Copies <ChevronRight size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteExam(exam._id)}
                    style={{ 
                      padding: '10px', borderRadius: '8px', background: '#fff0f0', color: theme.colors.error, border: 'none'
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showCreateModal && (
        <CreateExamModal 
          onClose={() => setShowCreateModal(false)} 
          onCreated={() => { fetchData(); setShowCreateModal(false); }} 
        />
      )}

      <ConfirmModal 
        isOpen={confirmDelete.open}
        title="Supprimer l'épreuve ?"
        message="Cette action est irréversible. Toutes les soumissions liées seront également perdues."
        onConfirm={handleActualDelete}
        onCancel={() => setConfirmDelete({ open: false, id: null })}
      />
    </div>
  );
};

export default AdminDashboard;
