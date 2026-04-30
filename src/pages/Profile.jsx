import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Edit2, Shield, Award, Zap, Target, BarChart3, Activity, Settings, Save, LogOut, Hash, Mail, User as UserIcon, CheckCircle2, TrendingUp, BookOpen, Clock, X } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import { theme } from '../theme';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const Profile = () => {
  const { user, login, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editForm, setEditForm] = useState({ fullname: '', bio: '' });
  const { addNotification } = useNotification();
  const fileInputRef = useRef();

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/users/profile');
      setProfileData(data);
      setEditForm({ fullname: data.user.fullname, bio: data.user.bio || '' });
    } catch (err) {
      addNotification("Impossible de charger le profil", 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('profilePic', file);

    try {
      const { data } = await api.put('/users/profile', formData);
      setProfileData(prev => ({ ...prev, user: data }));
      login(data, localStorage.getItem('accessToken'));
      addNotification("Photo de profil mise à jour", 'success');
    } catch (err) {
      addNotification("Erreur lors de l'upload", 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/users/profile', editForm);
      setProfileData(prev => ({ ...prev, user: data }));
      setIsEditing(false);
      login(data, localStorage.getItem('accessToken'));
      addNotification("Profil mis à jour", 'success');
    } catch (err) {
      addNotification("Erreur lors de la mise à jour", 'error');
    }
  };

  if (loading || !profileData) return <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Activity className="animate-spin" color="var(--primary)" size={40} /></div>;

  const isStudent = profileData.user.role === 'student';

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }} className="fade-in">
      
      {/* Header Profile Premium */}
      <div style={{ position: 'relative', marginBottom: '40px' }}>
        <div style={{ height: '180px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderRadius: '24px', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', padding: '0 20px', marginTop: '-50px', position: 'relative', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: '140px', height: '140px', borderRadius: '32px', border: '6px solid var(--surface)', overflow: 'hidden', background: 'var(--background)', boxShadow: 'var(--shadow-premium)' }}>
              <img 
                src={profileData.user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.user.fullname)}&background=random&color=fff`} 
                alt="Profile" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              {uploading && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Activity className="animate-spin" color="white" /></div>}
            </div>
            <button 
              onClick={() => fileInputRef.current.click()}
              style={{ position: 'absolute', bottom: '5px', right: '5px', background: 'var(--primary)', border: 'none', padding: '10px', borderRadius: '14px', color: 'white', boxShadow: 'var(--shadow-soft)', cursor: 'pointer', display: 'flex' }}
            >
              <Camera size={18} />
            </button>
            <input type="file" ref={fileInputRef} hidden onChange={handleImageUpload} accept="image/*" />
          </div>

          <div style={{ flex: 1, minWidth: '250px', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
              <div>
                <h1 style={{ fontWeight: '900', color: 'var(--text)', fontSize: '1.8rem', margin: 0 }}>{profileData.user.fullname}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '5px', color: 'var(--text-light)', fontWeight: '700', fontSize: '0.9rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Hash size={14} /> {profileData.user.matricule}</span>
                  <span style={{ width: '4px', height: '4px', background: 'var(--border)', borderRadius: '50%' }} />
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Shield size={14} /> {profileData.user.role.toUpperCase()}</span>
                </div>
              </div>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                style={{ background: isEditing ? 'var(--error)' : 'var(--surface)', color: isEditing ? 'white' : 'var(--text)', padding: '10px 20px', borderRadius: '14px', border: '1px solid var(--border)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              >
                {isEditing ? <X size={18} /> : <Edit2 size={18} />} {isEditing ? 'Annuler' : 'Éditer'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 900 ? '1fr' : '1.5fr 1fr', gap: '30px' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {isEditing ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'var(--surface)', padding: '30px', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-soft)' }}>
              <h2 style={{ fontWeight: '900', marginBottom: '25px', color: 'var(--text)' }}>Paramètres du Profil</h2>
              <form onSubmit={handleUpdateProfile}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px', color: 'var(--text)', fontSize: '0.85rem' }}>NOM COMPLET</label>
                  <input type="text" value={editForm.fullname} onChange={e => setEditForm({...editForm, fullname: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid var(--border)', outline: 'none', background: 'var(--background)', color: 'var(--text)' }} />
                </div>
                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px', color: 'var(--text)', fontSize: '0.85rem' }}>BIOGRAPHIE / BIO</label>
                  <textarea value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} placeholder="Parlez-nous de vous..." style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid var(--border)', outline: 'none', background: 'var(--background)', color: 'var(--text)', minHeight: '120px' }} />
                </div>
                <button type="submit" style={{ width: '100%', padding: '16px', background: 'var(--primary)', color: 'white', borderRadius: '12px', border: 'none', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer' }}>
                  <Save size={20} /> Enregistrer
                </button>
              </form>
            </motion.div>
          ) : (
            <>
              {isStudent && (
                <div style={{ background: 'var(--surface)', padding: '30px', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-soft)', height: '450px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text)' }}><Zap size={20} color="var(--secondary)" /> Radar Analytique</h3>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', padding: '6px 14px', background: 'var(--background)', borderRadius: '20px', fontWeight: '800' }}>Basé sur {profileData.stats.totalExams} sessions</div>
                  </div>
                  <div style={{ width: '100%', height: '350px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={profileData.stats.radar}>
                        <PolarGrid stroke="var(--border)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-light)', fontSize: 11, fontWeight: 700 }} />
                        <Radar
                          name="Performance"
                          dataKey="A"
                          stroke="var(--primary)"
                          fill="var(--primary)"
                          fillOpacity={0.3}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {!isStudent && (
                <div style={{ background: 'var(--surface)', padding: '30px', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-soft)' }}>
                  <h3 style={{ fontWeight: '900', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text)' }}><Activity size={20} color="var(--primary)" /> Journal Système</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { action: 'Accès sécurisé actif', date: 'Maintenant', icon: <Shield size={16} /> },
                      { action: 'Module IA opérationnel', date: 'Sync', icon: <Settings size={16} /> },
                      { action: 'Base de données synchronisée', date: 'OK', icon: <Save size={16} /> }
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'var(--background)', borderRadius: '14px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ color: 'var(--primary)' }}>{item.icon}</div>
                          <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text)' }}>{item.action}</span>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: '700' }}>{item.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <div style={{ background: 'var(--surface)', padding: '30px', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-soft)' }}>
            <h3 style={{ fontWeight: '900', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text)' }}><Award size={20} color="var(--success)" /> Distinction</h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {isStudent ? (
                <>
                  <Badge label="Pionnier" icon={<TrendingUp size={16} />} color="var(--primary)" active={true} />
                  <Badge label="Expert" icon={<Zap size={16} />} color="var(--warning)" active={profileData.stats.totalExams > 2} />
                  <Badge label="Élite" icon={<Target size={16} />} color="var(--success)" active={profileData.stats.averageScore > 80} />
                </>
              ) : (
                <>
                  <Badge label="Administrateur" icon={<Shield size={16} />} color="var(--error)" active={true} />
                  <Badge label="Modérateur AI" icon={<Settings size={16} />} color="var(--text)" active={true} />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div style={{ background: 'var(--surface)', padding: '30px', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-soft)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '10px' }}>
              {isStudent ? 'MOYENNE' : 'ÉTAT SYSTÈME'}
            </div>
            {isStudent ? (
              <div style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--primary)' }}>{profileData.stats.averageScore}<span style={{ fontSize: '1.2rem', opacity: 0.5 }}>%</span></div>
            ) : (
              <div style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <div style={{ width: '10px', height: '10px', background: 'var(--success)', borderRadius: '50%' }} /> EN LIGNE
              </div>
            )}
            <p style={{ marginTop: '10px', color: 'var(--text-light)', fontSize: '0.85rem', fontWeight: '600' }}>
              {isStudent ? `Progression : Top ${100 - profileData.stats.precision}%` : 'Dernière vérification : OK'}
            </p>
          </div>

          <div style={{ background: 'var(--surface)', padding: '30px', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-soft)' }}>
            <h3 style={{ fontWeight: '900', marginBottom: '20px', color: 'var(--text)', fontSize: '1.1rem' }}>Biographie</h3>
            <p style={{ color: 'var(--text-light)', lineHeight: '1.6', fontSize: '0.9rem', fontWeight: '500' }}>
              {profileData.user.bio || "Personnalisez votre bio pour vous démarquer."}
            </p>
            <div style={{ marginTop: '25px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-light)', fontSize: '0.85rem', fontWeight: '600' }}>
                <Clock size={16} /> <span>Membre depuis le {new Date(profileData.user.createdAt).toLocaleDateString()}</span>
              </div>
              {isStudent && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-light)', fontSize: '0.85rem', fontWeight: '600' }}>
                  <BookOpen size={16} /> <span>{profileData.stats.totalExams} Examens complétés</span>
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={logout}
            style={{ width: '100%', padding: '16px', background: 'rgba(214, 48, 49, 0.1)', color: 'var(--error)', border: 'none', borderRadius: '16px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <LogOut size={20} /> Déconnexion
          </button>
        </div>

      </div>
    </div>
  );
};

const Badge = ({ label, icon, color, active }) => (
  <div style={{ 
    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '14px',
    background: active ? (color.startsWith('var') ? `rgba(var(--primary-rgb, 9, 132, 227), 0.1)` : `${color}15`) : 'var(--background)',
    color: active ? color : 'var(--text-light)',
    border: `1px solid ${active ? (color.startsWith('var') ? color : `${color}30`) : 'var(--border)'}`,
    transition: 'all 0.3s ease',
    opacity: active ? 1 : 0.6
  }}>
    {icon} <span style={{ fontWeight: '800', fontSize: '0.8rem' }}>{label}</span>
  </div>
);

// Note: Improved background logic for var() colors

export default Profile;
