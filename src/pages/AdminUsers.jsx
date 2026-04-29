import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, ArrowLeft, User, ShieldCheck, ShieldAlert, UserPlus, UserMinus } from 'lucide-react';
import api from '../services/api';
import { theme } from '../theme';
import Alert from '../components/Alert';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch (err) {
      setError("Impossible de charger les utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = async (user) => {
    const newRole = user.role === 'admin' ? 'student' : 'admin';
    const confirmMsg = user.role === 'admin' 
      ? `Retirer les droits d'administrateur à ${user.fullname} ?` 
      : `Donner les droits d'administrateur à ${user.fullname} ?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      await api.patch(`/admin/users/${user._id}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du changement de rôle");
    }
  };

  const filteredUsers = users.filter(u => 
    u.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.matricule.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 className="animate-spin" size={48} color={theme.colors.primary} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <Alert message={error} onClose={() => setError('')} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button onClick={() => navigate('/admin')} style={{ background: 'white', border: `1px solid ${theme.colors.border}`, padding: '10px', borderRadius: '50%', display: 'flex', cursor: 'pointer' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 style={{ fontWeight: '900', color: theme.colors.text }}>Gestion des Utilisateurs</h2>
          <p style={{ color: theme.colors.textLight, fontSize: '0.9rem' }}>Promouvoir ou retirer des administrateurs</p>
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <Search size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: theme.colors.textLight }} />
        <input 
          type="text" 
          placeholder="Rechercher par nom ou matricule..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '15px 15px 15px 50px', borderRadius: '15px', border: `1px solid ${theme.colors.border}`, outline: 'none', fontSize: '1rem' }}
        />
      </div>

      <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: theme.shadows.soft }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: `2px solid ${theme.colors.border}` }}>
                <th style={{ padding: '20px', fontWeight: '800' }}>Utilisateur</th>
                <th style={{ padding: '20px', fontWeight: '800' }}>Matricule</th>
                <th style={{ padding: '20px', fontWeight: '800' }}>Rôle Actuel</th>
                <th style={{ padding: '20px', fontWeight: '800' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} style={{ borderBottom: `1px solid ${theme.colors.border}`, transition: 'all 0.2s' }}>
                  <td style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: user.role === 'admin' ? `${theme.colors.secondary}15` : `${theme.colors.primary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={20} color={user.role === 'admin' ? theme.colors.secondary : theme.colors.primary} />
                      </div>
                      <span style={{ fontWeight: '700' }}>{user.fullname}</span>
                    </div>
                  </td>
                  <td style={{ padding: '20px', color: theme.colors.textLight }}>{user.matricule}</td>
                  <td style={{ padding: '20px' }}>
                    <span style={{ 
                      padding: '6px 12px', 
                      borderRadius: '8px', 
                      fontSize: '0.8rem', 
                      fontWeight: '800',
                      background: user.role === 'admin' ? `${theme.colors.secondary}20` : '#f1f2f6',
                      color: user.role === 'admin' ? theme.colors.secondary : '#666',
                      textTransform: 'uppercase'
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '20px' }}>
                    <button 
                      onClick={() => handleRoleToggle(user)}
                      style={{ 
                        background: user.role === 'admin' ? '#fff5f5' : `${theme.colors.secondary}10`, 
                        color: user.role === 'admin' ? theme.colors.error : theme.colors.secondary, 
                        padding: '10px 15px', 
                        borderRadius: '10px', 
                        border: 'none', 
                        fontWeight: '800', 
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      {user.role === 'admin' ? (
                        <><UserMinus size={16} /> Retirer Admin</>
                      ) : (
                        <><UserPlus size={16} /> Promouvoir Admin</>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div style={{ padding: '60px', textAlign: 'center', color: theme.colors.textLight }}>
            Aucun utilisateur trouvé.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
