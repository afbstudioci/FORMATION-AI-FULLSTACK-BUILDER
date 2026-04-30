//src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ExamCard from '../components/ExamCard';
import { Search, Loader2 } from 'lucide-react';
import FloatingScrollToTop from '../components/FloatingScrollToTop';
import { subscribeToExams, subscribeToDeletedExams, subscribeToSubmissionUpdates } from '../services/socket';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const Dashboard = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const { data } = await api.get('/exams');
        setExams(data.reverse());
      } catch (err) {
        addNotification("Erreur lors du chargement des examens", 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchExams();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    subscribeToExams((newExam) => {
      setExams(prev => {
        if (prev.some(e => e._id === newExam._id)) return prev;
        return [newExam, ...prev];
      });
      addNotification("Nouvel examen disponible !", 'info');
    });

    // Écoute spécifique pour les mises à jour de statut (DÉJÀ COMPOSÉ)
    subscribeToSubmissionUpdates((update) => {
      if (update.userId.toString() === user?._id?.toString()) {
        setExams(prev => prev.map(exam =>
          exam._id.toString() === update.examId.toString()
            ? { ...exam, hasSubmitted: true }
            : exam
        ));
      }
    });

    subscribeToDeletedExams((deletedId) => {
      setExams(prev => prev.filter(e => e._id !== deletedId));
    });

    return () => clearInterval(timer);
  }, [user]);

  const filteredExams = exams.filter(exam =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
        <Loader2 className="animate-spin" color="var(--primary)" size={48} />
        <p style={{ color: 'var(--text-light)', fontWeight: '700' }}>Synchronisation des sessions...</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={{
        marginBottom: '40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        <div>
          <h2 style={{ fontWeight: '900', color: 'var(--text)', fontSize: '1.8rem', letterSpacing: '-0.8px' }}>Tableau de bord</h2>
          <p style={{ color: 'var(--text-light)', fontWeight: '600', fontSize: '0.9rem' }}>Suivez vos sessions et résultats en temps réel.</p>
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: '350px' }}>
          <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} size={20} />
          <input
            type="text"
            placeholder="Rechercher une épreuve..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 14px 14px 50px',
              borderRadius: '16px',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              fontSize: '0.95rem',
              color: 'var(--text)',
              boxShadow: 'var(--shadow-soft)',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {filteredExams.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          background: 'var(--surface)',
          borderRadius: '24px',
          border: '2px dashed var(--border)',
          color: 'var(--text-light)'
        }}>
          <p style={{ fontSize: '1.1rem', fontWeight: '700' }}>
            {searchTerm ? `Aucun examen trouvé pour "${searchTerm}"` : "Aucun examen disponible pour le moment."}
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '30px'
        }}>
          {filteredExams.map(exam => (
            <ExamCard key={exam._id} exam={exam} onStart={(id) => navigate(`/exam/${id}`)} />
          ))}
        </div>
      )}
      <FloatingScrollToTop />
    </div>
  );
};

export default Dashboard;