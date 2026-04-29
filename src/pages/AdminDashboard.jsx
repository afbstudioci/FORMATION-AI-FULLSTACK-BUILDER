import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Users, Download, Loader2, Trash2 } from 'lucide-react';
import api from '../services/api';
import { theme } from '../theme';
import CreateExamModal from '../components/CreateExamModal';

const AdminDashboard = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const fetchExams = async () => {
    try {
      const { data } = await api.get('/exams');
      setExams(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExams(); }, []);

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: '900', color: theme.colors.text }}>Gestion des Examens</h2>
          <p style={{ color: theme.colors.textLight }}>Creez et gerez vos epreuves en ligne</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          style={{ 
            background: theme.colors.primary, 
            color: 'white', 
            padding: '12px 24px', 
            borderRadius: theme.borderRadius.medium, 
            fontWeight: '700', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            boxShadow: `0 4px 15px ${theme.colors.primary}40`
          }}
        >
          <Plus size={20} /> Nouvel Examen
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        <StatCard icon={<FileText color={theme.colors.primary} />} label="Total Examens" value={exams.length} />
        <StatCard 
          icon={<Users color={theme.colors.secondary} />} 
          label="Soumissions" 
          value="Consulter les copies" 
          onClick={() => navigate('/admin/submissions')} 
          clickable
        />
      </div>

      <h3 style={{ margin: '40px 0 20px', fontWeight: '800', color: theme.colors.text }}>Liste des epreuves actives</h3>
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center' }}><Loader2 className="spin" size={32} color={theme.colors.primary} /></div>
      ) : (
        <div style={{ background: 'white', borderRadius: theme.borderRadius.large, overflow: 'hidden', boxShadow: theme.shadows.soft, border: `1px solid ${theme.colors.border}` }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: theme.colors.background, textAlign: 'left' }}>
                <th style={{ padding: '18px', fontSize: '0.8rem', textTransform: 'uppercase', color: theme.colors.textLight }}>Titre</th>
                <th style={{ padding: '18px', fontSize: '0.8rem', textTransform: 'uppercase', color: theme.colors.textLight }}>Debut</th>
                <th style={{ padding: '18px', fontSize: '0.8rem', textTransform: 'uppercase', color: theme.colors.textLight }}>Fin</th>
                <th style={{ padding: '18px', fontSize: '0.8rem', textTransform: 'uppercase', color: theme.colors.textLight }}>Questions</th>
                <th style={{ padding: '18px', fontSize: '0.8rem', textTransform: 'uppercase', color: theme.colors.textLight, textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.length === 0 ? (
                <tr><td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: theme.colors.textLight }}>Aucun examen cree.</td></tr>
              ) : (
                exams.map(exam => (
                  <tr key={exam._id} style={{ borderBottom: `1px solid ${theme.colors.border}`, transition: 'background 0.2s' }}>
                    <td style={{ padding: '18px', fontWeight: '700', color: theme.colors.text }}>{exam.title}</td>
                    <td style={{ padding: '18px', fontSize: '0.85rem', color: theme.colors.textLight }}>{new Date(exam.startTime).toLocaleString('fr-FR')}</td>
                    <td style={{ padding: '18px', fontSize: '0.85rem', color: theme.colors.textLight }}>{new Date(exam.endTime).toLocaleString('fr-FR')}</td>
                    <td style={{ padding: '18px', fontWeight: '600' }}>{exam.questions?.length || 0}</td>
                    <td style={{ padding: '18px', textAlign: 'center' }}>
                      <button style={{ color: theme.colors.error, background: 'transparent', padding: '8px', borderRadius: '50%' }}><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && <CreateExamModal onClose={() => setShowModal(false)} onCreated={fetchExams} />}
    </div>
  );
};

const StatCard = ({ icon, label, value, onClick, clickable }) => (
  <div 
    onClick={onClick}
    style={{ 
      background: 'white', 
      padding: '25px', 
      borderRadius: theme.borderRadius.large, 
      boxShadow: theme.shadows.soft, 
      display: 'flex', 
      alignItems: 'center', 
      gap: '20px', 
      cursor: clickable ? 'pointer' : 'default',
      border: `1px solid ${theme.colors.border}`,
      transition: 'transform 0.2s'
    }}
  >
    <div style={{ background: theme.colors.background, padding: '15px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
    <div>
      <p style={{ color: theme.colors.textLight, fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase' }}>{label}</p>
      <p style={{ fontSize: '1.2rem', fontWeight: '800', color: theme.colors.text }}>{value}</p>
    </div>
  </div>
);

export default AdminDashboard;
