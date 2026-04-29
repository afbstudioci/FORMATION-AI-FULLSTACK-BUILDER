import { useState, useEffect } from 'react';
import { Download, Loader2, User, FileCheck, ShieldAlert } from 'lucide-react';
import api from '../services/api';
import { theme } from '../theme';
import Alert from '../components/Alert';

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);
  const [adminPass, setAdminPass] = useState(localStorage.getItem('adminPass') || '');
  const [passInput, setPassInput] = useState('');

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/submissions', {
        headers: { 'x-admin-password': adminPass }
      });
      setSubmissions(data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem('adminPass');
        setAdminPass('');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (adminPass) fetchSubmissions(); 
    else setLoading(false);
  }, [adminPass]);

  const handleDownload = async (id, matricule) => {
    setDownloading(id);
    try {
      const response = await api.get(`/admin/submissions/${id}/pdf`, {
        headers: { 'x-admin-password': adminPass },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `copie_${matricule}.pdf`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(null);
    }
  };

  if (!adminPass) {
    return (
      <div style={{ maxWidth: '420px', margin: '120px auto', textAlign: 'center', background: 'white', padding: '40px', borderRadius: theme.borderRadius.large, boxShadow: theme.shadows.medium }}>
        <div style={{ background: `${theme.colors.error}10`, width: '60px', height: '60px', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShieldAlert color={theme.colors.error} size={32} />
        </div>
        <h3 style={{ fontWeight: '800', marginBottom: '10px' }}>Acces Securise</h3>
        <p style={{ color: theme.colors.textLight, fontSize: '0.9rem', marginBottom: '25px' }}>Veuillez entrer le mot de passe administrateur pour acceder aux copies.</p>
        <input 
          type="password" 
          placeholder="Mot de passe specifique..."
          value={passInput}
          onChange={(e) => setPassInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              localStorage.setItem('adminPass', passInput);
              setAdminPass(passInput);
            }
          }}
          style={{ width: '100%', padding: '14px', borderRadius: '10px', border: `2px solid ${theme.colors.border}`, outline: 'none', textAlign: 'center', fontSize: '1rem' }}
        />
        <button 
          onClick={() => { localStorage.setItem('adminPass', passInput); setAdminPass(passInput); }}
          style={{ width: '100%', marginTop: '15px', padding: '14px', background: theme.colors.text, color: 'white', borderRadius: '10px', fontWeight: '700' }}
        >
          Valider
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '35px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: theme.colors.text }}>Gestion des Copies</h2>
        <p style={{ color: theme.colors.textLight }}>Visualisez les resultats et telechargez les rapports PDF</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}><Loader2 className="spin" size={32} color={theme.colors.primary} /></div>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {submissions.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', background: 'white', borderRadius: '12px', color: theme.colors.textLight }}>Aucune soumission pour le moment.</div>
          ) : (
            submissions.map(sub => (
              <div key={sub._id} style={{ 
                background: 'white', 
                padding: '24px', 
                borderRadius: theme.borderRadius.large, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                boxShadow: theme.shadows.soft,
                border: `1px solid ${theme.colors.border}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ background: theme.colors.background, width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={24} color={theme.colors.text} />
                  </div>
                  <div>
                    <p style={{ fontWeight: '800', color: theme.colors.text, fontSize: '1.05rem' }}>{sub.user.fullname}</p>
                    <p style={{ fontSize: '0.8rem', color: theme.colors.primary, fontWeight: '700' }}>{sub.user.matricule}</p>
                    <p style={{ fontSize: '0.85rem', color: theme.colors.textLight, marginTop: '4px' }}>Examen : <strong>{sub.exam.title}</strong></p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                      <FileCheck size={18} color={sub.score >= 0 ? theme.colors.success : theme.colors.error} />
                      <span style={{ fontSize: '1.5rem', fontWeight: '900', color: sub.score >= 0 ? theme.colors.success : theme.colors.error }}>{sub.score}</span>
                      <span style={{ color: theme.colors.textLight, fontSize: '0.9rem', fontWeight: '600' }}>pts</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: theme.colors.error, fontWeight: '700', marginTop: '2px' }}>TRICHE : {sub.tabSwitchesCount} detections</p>
                  </div>
                  <button 
                    onClick={() => handleDownload(sub._id, sub.user.matricule)}
                    disabled={downloading === sub._id}
                    style={{ 
                      background: theme.colors.primary, 
                      color: 'white', 
                      padding: '12px 20px', 
                      borderRadius: '10px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px',
                      fontWeight: '700',
                      fontSize: '0.9rem',
                      boxShadow: `0 4px 10px ${theme.colors.primary}30`
                    }}
                  >
                    {downloading === sub._id ? <Loader2 size={18} className="spin" /> : <Download size={18} />} PDF
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AdminSubmissions;
