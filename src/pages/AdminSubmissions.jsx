import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, Loader2, ArrowLeft, Search, Eye, Trash2 } from 'lucide-react';
import api from '../services/api';
import SubmissionReview from '../components/SubmissionReview';
import ConfirmModal from '../components/ConfirmModal';
import { useNotification } from '../context/NotificationContext';

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const { addNotification } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();
  const { examId, examTitle } = location.state || {};

  const fetchSubmissions = async () => {
    try {
      const { data } = await api.get('/admin/submissions');
      const filtered = examId 
        ? data.filter(s => s.exam?._id === examId)
        : data;
      setSubmissions(filtered);
    } catch (err) {
      addNotification("Impossible de charger les copies", 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [examId]);

  const handleDeleteSubmission = (id) => {
    setConfirmDelete({ open: true, id });
  };

  const handleActualDelete = async () => {
    try {
      await api.delete(`/admin/submissions/${confirmDelete.id}`);
      addNotification("Copie supprimée", 'success');
      fetchSubmissions();
    } catch (err) {
      addNotification("Erreur lors de la suppression", 'error');
    } finally {
      setConfirmDelete({ open: false, id: null });
    }
  };

  const filteredSubmissions = submissions.filter(s => 
    s.user?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.user?.matricule?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 className="animate-spin" size={48} color="var(--primary)" />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} className="fade-in">

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            onClick={() => navigate('/admin')}
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '10px', borderRadius: '50%', display: 'flex', color: 'var(--text)', cursor: 'pointer' }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 style={{ fontWeight: '900', color: 'var(--text)', fontSize: '1.5rem' }}>
              {examTitle ? `Copies : ${examTitle}` : 'Copies reçues'}
            </h2>
            <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>{filteredSubmissions.length} copies archivées</p>
          </div>
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} size={18} />
          <input 
            type="text"
            placeholder="Chercher une copie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none', background: 'var(--surface)', color: 'var(--text)'
            }}
          />
        </div>
      </div>

      {window.innerWidth > 768 ? (
        <div style={{ background: 'var(--surface)', borderRadius: '20px', overflow: 'hidden', boxShadow: 'var(--shadow-soft)', border: '1px solid var(--border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--background)', borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '20px', fontWeight: '800', color: 'var(--text)', textTransform: 'uppercase', fontSize: '0.75rem' }}>Étudiant</th>
                <th style={{ padding: '20px', fontWeight: '800', color: 'var(--text)', textTransform: 'uppercase', fontSize: '0.75rem' }}>Matricule</th>
                <th style={{ padding: '20px', fontWeight: '800', color: 'var(--text)', textTransform: 'uppercase', fontSize: '0.75rem' }}>Résultat</th>
                <th style={{ padding: '20px', fontWeight: '800', color: 'var(--text)', textTransform: 'uppercase', fontSize: '0.75rem' }}>Date</th>
                <th style={{ padding: '20px', fontWeight: '800', color: 'var(--text)', textTransform: 'uppercase', fontSize: '0.75rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((sub) => (
                <tr key={sub._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img 
                        src={sub.user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(sub.user?.fullname)}&background=random&color=fff`} 
                        alt={sub.user?.fullname}
                        style={{ width: '35px', height: '35px', borderRadius: '10px' }}
                      />
                      <span style={{ fontWeight: '700', color: 'var(--text)' }}>{sub.user?.fullname}</span>
                    </div>
                  </td>
                  <td style={{ padding: '20px', color: 'var(--text-light)', fontWeight: '600', fontFamily: 'monospace' }}>{sub.user?.matricule}</td>
                  <td style={{ padding: '20px' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '8px', fontWeight: '900', fontSize: '0.8rem',
                      background: sub.score >= (sub.exam?.questions?.length / 2) ? 'rgba(0, 184, 148, 0.1)' : 'rgba(214, 48, 49, 0.1)',
                      color: sub.score >= (sub.exam?.questions?.length / 2) ? 'var(--success)' : 'var(--error)'
                    }}>
                      {sub.score} / {sub.exam?.questions?.length}
                    </span>
                  </td>
                  <td style={{ padding: '20px', color: 'var(--text-light)', fontSize: '0.85rem' }}>
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => setSelectedSubmission(sub)}
                        style={{ background: 'var(--background)', color: 'var(--text)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Eye size={16} /> Voir
                      </button>
                      <button 
                        onClick={() => handleDeleteSubmission(sub._id)}
                        style={{ background: 'rgba(214, 48, 49, 0.1)', color: 'var(--error)', padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filteredSubmissions.map((sub) => (
            <div key={sub._id} style={{ background: 'var(--surface)', padding: '20px', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-soft)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                <img 
                  src={sub.user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(sub.user?.fullname)}&background=random&color=fff`} 
                  alt={sub.user?.fullname}
                  style={{ width: '45px', height: '45px', borderRadius: '12px' }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '800', color: 'var(--text)', margin: 0, fontSize: '0.95rem' }}>{sub.user?.fullname}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: 0 }}>{sub.user?.matricule}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: '900', color: sub.score >= (sub.exam?.questions?.length / 2) ? 'var(--success)' : 'var(--error)', margin: 0 }}>
                    {sub.score}/{sub.exam?.questions?.length}
                  </p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-light)', margin: 0 }}>{new Date(sub.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => setSelectedSubmission(sub)}
                  style={{ flex: 1, background: 'var(--primary)', color: 'white', padding: '12px', borderRadius: '10px', border: 'none', fontWeight: '800', fontSize: '0.85rem' }}
                >
                  Voir la copie
                </button>
                <button 
                  onClick={() => handleDeleteSubmission(sub._id)}
                  style={{ background: 'rgba(214, 48, 49, 0.1)', color: 'var(--error)', padding: '12px', borderRadius: '10px', border: 'none' }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredSubmissions.length === 0 && (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-light)', fontWeight: '600' }}>
          Aucune copie trouvée pour cette épreuve.
        </div>
      )}

      {selectedSubmission && (
        <SubmissionReview 
          submission={selectedSubmission} 
          onClose={() => setSelectedSubmission(null)} 
        />
      )}

      <ConfirmModal 
        isOpen={confirmDelete.open}
        title="Supprimer ?"
        message="Voulez-vous supprimer définitivement cette copie ?"
        onConfirm={handleActualDelete}
        onCancel={() => setConfirmDelete({ open: false, id: null })}
      />
    </div>
  );
};

export default AdminSubmissions;
