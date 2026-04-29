import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, Loader2, User, FileCheck, ShieldAlert, ArrowLeft, Search } from 'lucide-react';
import api from '../services/api';
import { theme } from '../theme';
import Alert from '../components/Alert';

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
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
      setError("Erreur lors de la generation du PDF");
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button 
            onClick={() => navigate('/admin')}
            style={{ background: 'white', border: `1px solid ${theme.colors.border}`, padding: '10px', borderRadius: '50%', display: 'flex' }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '900', color: theme.colors.text }}>
              {examTitle ? `Copies : ${examTitle}` : 'Toutes les copies'}
            </h1>
            <p style={{ color: theme.colors.textLight }}>{filteredSubmissions.length} copies trouvees</p>
          </div>
        </div>

        <div style={{ position: 'relative', width: '300px' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: theme.colors.textLight }} size={18} />
          <input 
            type="text"
            placeholder="Rechercher un etudiant..."
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
        background: 'white', borderRadius: theme.borderRadius.large, boxShadow: theme.shadows.soft, 
        border: `1px solid ${theme.colors.border}`, overflow: 'hidden' 
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#fcfcfc', borderBottom: `1px solid ${theme.colors.border}` }}>
              <th style={{ padding: '20px', fontWeight: '800', color: theme.colors.textLight, fontSize: '0.85rem' }}>ETUDIANT</th>
              <th style={{ padding: '20px', fontWeight: '800', color: theme.colors.textLight, fontSize: '0.85rem' }}>MATRICULE</th>
              <th style={{ padding: '20px', fontWeight: '800', color: theme.colors.textLight, fontSize: '0.85rem' }}>SCORE</th>
              <th style={{ padding: '20px', fontWeight: '800', color: theme.colors.textLight, fontSize: '0.85rem' }}>DATE RENDUE</th>
              <th style={{ padding: '20px', fontWeight: '800', color: theme.colors.textLight, fontSize: '0.85rem', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '60px', textAlign: 'center', color: theme.colors.textLight }}>
                  Aucune copie trouvee.
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
                    {new Date(sub.createdAt).toLocaleString()}
                  </td>
                  <td style={{ padding: '20px', textAlign: 'right' }}>
                    <button 
                      onClick={() => handleDownloadPDF(sub._id, sub.user?.matricule)}
                      style={{ 
                        background: theme.colors.primary, color: 'white', padding: '10px 15px', borderRadius: '8px', 
                        fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto', fontSize: '0.85rem'
                      }}
                    >
                      <Download size={16} /> Rapport PDF
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSubmissions;
