//src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Users, Download, Loader2, Trash2, Calendar, Clock, ChevronRight } from 'lucide-react';
import api from '../services/api';
import { theme } from '../theme';
import CreateExamModal from '../components/CreateExamModal';
import ConfirmModal from '../components/ConfirmModal';
import Alert from '../components/Alert';
import { subscribeToSubmissions, subscribeToExams, subscribeToDeletedExams, subscribeToUserRegistered } from '../services/socket';
import FloatingScrollToTop from '../components/FloatingScrollToTop';

import { useNotification } from '../context/NotificationContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalStudents: 0, totalExams: 0, totalSubmissions: 0 });
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [statsRes, examsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/exams')
      ]);
      setStats(statsRes.data);
      setExams(examsRes.data.reverse());
    } catch (err) {
      addNotification("Erreur de synchronisation des données", 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    subscribeToSubmissions((newSub) => {
      setStats(prev => ({ ...prev, totalSubmissions: prev.totalSubmissions + 1 }));
      addNotification(`Nouvelle copie : ${newSub.user.fullname}`, 'info');
    });

    subscribeToUserRegistered(() => {
      setStats(prev => ({ ...prev, totalStudents: prev.totalStudents + 1 }));
    });

    subscribeToExams((newExam) => {
      setStats(prev => ({ ...prev, totalExams: prev.totalExams + 1 }));
      setExams(prev => [newExam, ...prev]);
    });

    subscribeToDeletedExams((deletedId) => {
      setStats(prev => ({ ...prev, totalExams: Math.max(0, prev.totalExams - 1) }));
      setExams(prev => prev.filter(e => e._id !== deletedId));
    });
  }, []);

  const handleDeleteExam = (id) => {
    setConfirmDelete({ open: true, id });
  };

  const handleActualDelete = async () => {
    try {
      await api.delete(`/exams/${confirmDelete.id}`);
      addNotification("Épreuve supprimée", 'success');
    } catch (err) {
      addNotification("Erreur de suppression", 'error');
    } finally {
      setConfirmDelete({ open: false, id: null });
    }
  };

  if (loading) return (
    <div style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 className="animate-spin" size={48} color="var(--primary)" />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} className="fade-in">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontWeight: '950', color: 'var(--text)', fontSize: '2rem', letterSpacing: '-1px', margin: 0 }}>Gestion</h2>
          <p style={{ color: 'var(--text-light)', fontWeight: '700', fontSize: '0.9rem', margin: '5px 0 0 0' }}>Centre de contrôle AFB STUDIO</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            background: 'var(--primary)', color: 'white', padding: '12px 25px', borderRadius: '16px', fontWeight: '900',
            display: 'flex', alignItems: 'center', gap: '10px', border: 'none', cursor: 'pointer', boxShadow: 'var(--shadow-premium)', fontSize: '0.9rem'
          }}
        >
          <Plus size={20} /> Nouvelle Épreuve
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {[
          { label: 'Étudiants', value: stats.totalStudents, icon: <Users />, color: 'var(--primary)', path: '/admin/users' },
          { label: 'Épreuves', value: stats.totalExams, icon: <FileText />, color: 'var(--secondary)', path: null },
          { label: 'Copies', value: stats.totalSubmissions, icon: <Download />, color: 'var(--success)', path: '/admin/submissions' }
        ].map((item, idx) => (
          <div key={idx} onClick={() => item.path && navigate(item.path)} style={{
            background: 'var(--surface)', padding: '25px', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-soft)',
            display: 'flex', alignItems: 'center', gap: '20px', cursor: item.path ? 'pointer' : 'default', transition: 'transform 0.2s'
          }}>
            <div style={{ background: `${item.color}15`, padding: '15px', borderRadius: '15px', color: item.color }}>
              {React.cloneElement(item.icon, { size: 24 })}
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: '950', color: 'var(--text)', lineHeight: 1 }}>{item.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: '800', marginTop: '5px' }}>{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Exams Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ fontWeight: '900', fontSize: '1.2rem', color: 'var(--text)', margin: 0 }}>Épreuves actives</h3>
        
        {exams.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', background: 'var(--surface)', borderRadius: '24px', border: '2px dashed var(--border)', color: 'var(--text-light)' }}>
            Aucune épreuve publiée.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {exams.map((exam) => (
              <div key={exam._id} style={{ background: 'var(--surface)', padding: '20px', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-soft)', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontWeight: '800', color: 'var(--text)', fontSize: '1rem' }}>{exam.title}</h4>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {new Date(exam.startTime).toLocaleDateString()}</span>
                      <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {exam.questions?.length} questions</span>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteExam(exam._id)} style={{ color: 'var(--error)', background: 'rgba(214, 48, 49, 0.1)', border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer' }}><Trash2 size={16} /></button>
                </div>
                
                <button
                  onClick={() => navigate('/admin/submissions', { state: { examId: exam._id, examTitle: exam.title } })}
                  style={{
                    background: 'var(--background)', color: 'var(--text)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)',
                    fontWeight: '900', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                  }}
                >
                  Consulter les copies <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateExamModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => { setShowCreateModal(false); fetchData(); }}
        />
      )}

      <ConfirmModal
        isOpen={confirmDelete.open}
        title="Supprimer ?"
        message="Cette action est irréversible et supprimera toutes les copies liées."
        onConfirm={handleActualDelete}
        onCancel={() => setConfirmDelete({ open: false, id: null })}
      />
      <FloatingScrollToTop />
    </div>
  );
};

export default AdminDashboard;