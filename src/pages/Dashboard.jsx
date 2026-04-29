import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ExamCard from '../components/ExamCard';
import { theme } from '../theme';
import { Search, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const { data } = await api.get('/exams');
        setExams(data);
      } catch (err) {
        console.error('Erreur chargement examens', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const filteredExams = exams.filter(exam => 
    exam.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
        <Loader2 style={{ animation: 'spin 1s linear infinite' }} color={theme.colors.primary} size={48} />
        <p style={{ color: theme.colors.textLight, fontWeight: '500' }}>Chargement des examens...</p>
        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={{ 
        marginBottom: '45px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '24px',
        padding: '10px 0'
      }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: '900', color: theme.colors.text, letterSpacing: '-0.5px' }}>Tableau de bord</h2>
          <p style={{ color: theme.colors.textLight, marginTop: '5px' }}>Bienvenue ! Voici vos sessions d'examens disponibles.</p>
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: '350px' }}>
          <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: theme.colors.textLight }} size={20} />
          <input 
            type="text"
            placeholder="Rechercher une epreuve..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 14px 14px 50px',
              borderRadius: theme.borderRadius.full,
              border: `2px solid ${theme.colors.border}`,
              background: theme.colors.surface,
              fontSize: '0.95rem',
              boxShadow: theme.shadows.soft,
              transition: 'all 0.2s ease'
            }}
          />
        </div>
      </div>

      {filteredExams.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '80px 20px', 
          background: theme.colors.surface, 
          borderRadius: theme.borderRadius.large,
          border: `2px dashed ${theme.colors.border}`,
          color: theme.colors.textLight
        }}>
          <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>
            {searchTerm ? `Aucun resultat pour "${searchTerm}"` : "Aucun examen n'est prevu pour le moment."}
          </p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '30px' 
        }}>
          {filteredExams.map(exam => (
            <ExamCard key={exam._id} exam={exam} onStart={(id) => navigate(`/exam/${id}`)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
