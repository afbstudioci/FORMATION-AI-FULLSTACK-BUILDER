import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, Loader2, User, FileCheck, ShieldAlert, ArrowLeft, Search, Eye } from 'lucide-react';
import api from '../services/api';
import { theme } from '../theme';
import Alert from '../components/Alert';
import SubmissionReview from '../components/SubmissionReview';

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { examId, examTitle } = location.state || {};

  const fetchSubmissions = async () => {
    try {
      const { data } = await api.get('/admin/submissions');
      // Filtrer si un examId est specifie
      const filtered = examId 
        ? data.filter(s => s.exam?._id === examId)
        : data;
      setSubmissions(filtered);
    } catch (err) {
      setError("Impossible de charger les copies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [examId]);

  const handleDownloadPDF = async (submissionId, matricule) => {
    try {
      const response = await api.get(`/admin/submissions/${submissionId}/pdf`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `copie_${matricule}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError("Erreur lors de la génération du PDF");
    }
  };

  const filteredSubmissions = submissions.filter(s => 
    s.user?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.user?.matricule?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 className="animate-spin" size={48} color={theme.colors.primary} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <Alert message={error} onClose={() => setError('')} />

      {/* Header */}
      <div className="mobile-stack" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            onClick={() => navigate('/admin')}
            style={{ background: 'white', border: `1px solid ${theme.colors.border}`, padding: '8px', borderRadius: '50%', display: 'flex' }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 style={{ fontWeight: '900', color: theme.colors.text }}>
              {examTitle ? `Copies : ${examTitle}` : 'Toutes les copies'}
            </h2>
            <p style={{ color: theme.colors.textLight, fontSize: '0.85rem' }}>{filteredSubmissions.length} copies</p>
          </div>
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: theme.colors.textLight }} size={18} />
          <input 
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%', padding: '12px 12px 12px 40px', borderRadius: '10px', border: `1px solid ${theme.colors.border}`, outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Table des copies */}
      <div style={{ 
        background: 'white', borderRadius: theme.borderRadius.large, boxShadow: theme.shadows.soft, overflowX: 'auto'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${theme.colors.border}`, background: '#fcfcfc' }}>
              <th style={{ padding: '20px', fontWeight: '800', fontSize: '0.85rem', color: theme.colors.textLight, textTransform: 'uppercase' }}>Étudiant</th>
              <th style={{ padding: '20px', fontWeight: '800', fontSize: '0.85rem', color: theme.colors.textLight, textTransform: 'uppercase' }}>Matricule</th>
              <th style={{ padding: '20px', fontWeight: '800', fontSize: '0.85rem', color: theme.colors.textLight, textTransform: 'uppercase' }}>Score / Barème</th>
              <th style={{ padding: '20px', fontWeight: '800', fontSize: '0.85rem', color: theme.colors.textLight, textTransform: 'uppercase' }}>Date de rendu</th>
              <th style={{ padding: '20px', fontWeight: '800', fontSize: '0.85rem', color: theme.colors.textLight, textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: theme.colors.textLight, fontWeight: '600' }}>
                  Aucune copie trouvée.
                </td>
              </tr>
            ) : (
              filteredSubmissions.map((sub) => (
                <tr key={sub._id} style={{ borderBottom: `1px solid ${theme.colors.border}`, transition: 'background 0.2s' }}>
                  <td style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: theme.colors.background, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.colors.primary, fontWeight: 'bold' }}>
                        {sub.user?.fullname?.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: '700', color: theme.colors.text }}>{sub.user?.fullname}</span>
                    </div>
                  </td>
                  <td style={{ padding: '20px', color: theme.colors.textLight, fontFamily: 'monospace', fontWeight: '600' }}>{sub.user?.matricule}</td>
                  <td style={{ padding: '20px' }}>
                    <span style={{ 
                      padding: '4px 12px', borderRadius: '20px', fontWeight: '800', fontSize: '0.85rem',
                      background: sub.score >= (sub.exam?.questions?.length / 2) ? `${theme.colors.success}15` : `${theme.colors.error}15`,
                      color: sub.score >= (sub.exam?.questions?.length / 2) ? theme.colors.success : theme.colors.error
                    }}>
                      {sub.score} / {sub.exam?.questions?.length}
                    </span>
                  </td>
                  <td style={{ padding: '20px', color: theme.colors.textLight, fontSize: '0.9rem' }}>
                    {new Date(sub.createdAt).toLocaleString('fr-FR')}
                  </td>
                  <td style={{ padding: '20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => setSelectedSubmission(sub)}
                        style={{ 
                          background: '#f8f9fa', color: theme.colors.text, padding: '10px 15px', borderRadius: '8px', 
                          fontWeight: '700', border: `1px solid ${theme.colors.border}`, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem'
                        }}
                      >
                        <Eye size={16} /> Voir Copie
                      </button>
                      <button 
                        onClick={() => setSelectedSubmission(sub)}
                        style={{ 
                          background: theme.colors.primary, color: 'white', padding: '10px 15px', borderRadius: '8px', 
                          fontWeight: '700', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem'
                        }}
                      >
                        <Download size={16} /> PDF NASA
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedSubmission && (
        <SubmissionReview 
          submission={selectedSubmission} 
          onClose={() => setSelectedSubmission(null)} 
        />
      )}
    </div>
  );
};

export default AdminSubmissions;
