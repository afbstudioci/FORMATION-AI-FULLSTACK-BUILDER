import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, ArrowLeft, User, ShieldCheck, ShieldAlert, UserPlus, UserMinus } from 'lucide-react';
import api from '../services/api';
import { theme } from '../theme';
import ConfirmModal from '../components/ConfirmModal';
import { useNotification } from '../context/NotificationContext';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmRole, setConfirmRole] = useState({ open: false, user: null });
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch (err) {
      addNotification("Impossible de charger les utilisateurs", 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = (user) => {
    setConfirmRole({ open: true, user });
  };

  const handleActualToggle = async () => {
    const { user } = confirmRole;
    const newRole = user.role === 'admin' ? 'student' : 'admin';
    try {
      await api.patch(`/admin/users/${user._id}/role`, { role: newRole });
      addNotification(`Rôle mis à jour pour ${user.fullname}`, 'success');
      fetchUsers();
    } catch (err) {
      addNotification(err.response?.data?.message || "Erreur lors du changement de rôle", 'error');
    } finally {
      setConfirmRole({ open: false, user: null });
    }
  };

  const filteredUsers = users.filter(u => 
    u.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.matricule.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 className="animate-spin" size={48} color="var(--primary)" />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} className="fade-in">

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate('/admin')} style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '10px', borderRadius: '50%', display: 'flex', cursor: 'pointer', color: 'var(--text)' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 style={{ fontWeight: '900', color: 'var(--text)', fontSize: '1.5rem' }}>Utilisateurs</h2>
          <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Gérez les accès et privilèges</p>
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <Search size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
        <input 
          type="text" 
          placeholder="Rechercher par nom ou matricule..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '15px 15px 15px 50px', borderRadius: '15px', border: '1px solid var(--border)', outline: 'none', fontSize: '1rem', background: 'var(--surface)', color: 'var(--text)' }}
        />
      </div>

      {window.innerWidth > 768 ? (
        <div style={{ background: 'var(--surface)', borderRadius: '20px', overflow: 'hidden', boxShadow: 'var(--shadow-soft)', border: '1px solid var(--border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--background)', borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '20px', fontWeight: '800', color: 'var(--text)' }}>Utilisateur</th>
                <th style={{ padding: '20px', fontWeight: '800', color: 'var(--text)' }}>Matricule</th>
                <th style={{ padding: '20px', fontWeight: '800', color: 'var(--text)' }}>Rôle</th>
                <th style={{ padding: '20px', fontWeight: '800', color: 'var(--text)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} style={{ borderBottom: '1px solid var(--border)', transition: 'all 0.2s' }}>
                  <td style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img 
                        src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullname)}&background=random&color=fff`} 
                        alt={user.fullname}
                        style={{ width: '40px', height: '40px', borderRadius: '12px', objectFit: 'cover' }}
                      />
                      <span style={{ fontWeight: '700', color: 'var(--text)' }}>{user.fullname}</span>
                    </div>
                  </td>
                  <td style={{ padding: '20px', color: 'var(--text-light)', fontWeight: '600' }}>{user.matricule}</td>
                  <td style={{ padding: '20px' }}>
                    <span style={{ 
                      padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '900',
                      background: user.role === 'admin' ? 'var(--secondary)' : 'var(--border)',
                      color: user.role === 'admin' ? 'white' : 'var(--text-light)',
                      textTransform: 'uppercase'
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '20px' }}>
                    <button 
                      onClick={() => handleRoleToggle(user)}
                      style={{ 
                        background: user.role === 'admin' ? 'rgba(214, 48, 49, 0.1)' : 'rgba(108, 92, 231, 0.1)', 
                        color: user.role === 'admin' ? 'var(--error)' : 'var(--secondary)', 
                        padding: '10px 15px', borderRadius: '10px', border: 'none', fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                      }}
                    >
                      {user.role === 'admin' ? <><UserMinus size={16} /> Retirer Admin</> : <><UserPlus size={16} /> Promouvoir Admin</>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filteredUsers.map((user) => (
            <div key={user._id} style={{ background: 'var(--surface)', padding: '20px', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-soft)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                <img 
                  src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullname)}&background=random&color=fff`} 
                  alt={user.fullname}
                  style={{ width: '50px', height: '50px', borderRadius: '14px', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '800', color: 'var(--text)', margin: 0 }}>{user.fullname}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: 0 }}>{user.matricule}</p>
                </div>
                <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '900', background: user.role === 'admin' ? 'var(--secondary)' : 'var(--border)', color: user.role === 'admin' ? 'white' : 'var(--text-light)' }}>
                  {user.role.toUpperCase()}
                </span>
              </div>
              <button 
                onClick={() => handleRoleToggle(user)}
                style={{ 
                  width: '100%', background: user.role === 'admin' ? 'rgba(214, 48, 49, 0.1)' : 'rgba(108, 92, 231, 0.1)', 
                  color: user.role === 'admin' ? 'var(--error)' : 'var(--secondary)', padding: '12px', borderRadius: '12px', border: 'none', fontWeight: '800', fontSize: '0.85rem'
                }}
              >
                {user.role === 'admin' ? 'Retirer les droits Admin' : 'Promouvoir Administrateur'}
              </button>
            </div>
          ))}
        </div>
      )}

      {filteredUsers.length === 0 && (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-light)', fontWeight: '600' }}>
          Aucun utilisateur trouvé.
        </div>
      )}

      <ConfirmModal 
        isOpen={confirmRole.open}
        title={confirmRole.user?.role === 'admin' ? "Rétrograder ?" : "Promouvoir ?"}
        message={confirmRole.user?.role === 'admin' 
          ? `Voulez-vous retirer les droits d'administration à ${confirmRole.user?.fullname} ?` 
          : `Voulez-vous donner les pleins pouvoirs d'administration à ${confirmRole.user?.fullname} ?`
        }
        confirmText="Confirmer"
        type={confirmRole.user?.role === 'admin' ? "danger" : "info"}
        onConfirm={handleActualToggle}
        onCancel={() => setConfirmRole({ open: false, user: null })}
      />
    </div>
  );
};

export default AdminUsers;
