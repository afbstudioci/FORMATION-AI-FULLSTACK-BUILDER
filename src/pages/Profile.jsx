import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Edit2, Shield, Award, Zap, Target, BarChart3, Activity, Settings, Save, LogOut, Hash, Mail, User as UserIcon, CheckCircle2, TrendingUp, BookOpen, Clock, X } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import { theme } from '../theme';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';

const Profile = () => {
  const { user, login, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [editForm, setEditForm] = useState({ fullname: '', bio: '' });
  const fileInputRef = useRef();

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/users/profile');
      setProfileData(data);
      setEditForm({ fullname: data.user.fullname, bio: data.user.bio || '' });
    } catch (err) {
      setError("Impossible de charger le profil");
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
      // Mettre a jour le contexte auth pour la navbar
      login(data, localStorage.getItem('accessToken'));
    } catch (err) {
      setError("Erreur lors de l'upload de l'image");
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
    } catch (err) {
      setError("Erreur lors de la mise a jour");
    }
  };

  if (loading || !profileData) return <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Activity className="animate-spin" color={theme.colors.primary} size={40} /></div>;

  const isStudent = profileData.user.role === 'student';

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      <Alert message={error} onClose={() => setError('')} />

      {/* Header Profile Premium */}
      <div style={{ position: 'relative', marginBottom: '40px' }}>
        <div style={{ height: '200px', background: `linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.secondary})`, borderRadius: theme.borderRadius.large, overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.2, backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        </div>
        
        <div className="mobile-stack" style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', padding: '0 20px', marginTop: '-60px', position: 'relative' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: window.innerWidth < 768 ? '120px' : '160px', height: window.innerWidth < 768 ? '120px' : '160px', borderRadius: '30px', border: '6px solid white', overflow: 'hidden', background: '#f5f5f5', boxShadow: theme.shadows.premium }}>
              {profileData.user.profilePic ? (
                <img src={profileData.user.profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.colors.textLight }}>
                  <UserIcon size={60} />
                </div>
              )}
              {uploading && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Activity className="animate-spin" color="white" /></div>}
            </div>
            <button 
              onClick={() => fileInputRef.current.click()}
              style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'white', border: 'none', padding: '10px', borderRadius: '15px', boxShadow: theme.shadows.soft, cursor: 'pointer', display: 'flex' }}
            >
              <Camera size={20} color={theme.colors.primary} />
            </button>
            <input type="file" ref={fileInputRef} hidden onChange={handleImageUpload} accept="image/*" />
          </div>

          <div style={{ paddingBottom: '15px', flex: 1, width: '100%' }}>
            <div className="mobile-stack" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', textAlign: window.innerWidth < 768 ? 'center' : 'left' }}>
              <div style={{ width: '100%' }}>
                <h1 style={{ fontWeight: '900', color: theme.colors.text, letterSpacing: '-1px' }}>{profileData.user.fullname}</h1>
                <p style={{ color: theme.colors.textLight, fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: window.innerWidth < 768 ? 'center' : 'flex-start', gap: '8px' }}>
                  <Hash size={16} /> {profileData.user.matricule} • <Shield size={16} /> {profileData.user.role.toUpperCase()}
                </p>
              </div>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                style={{ background: isEditing ? theme.colors.error : theme.colors.background, color: isEditing ? 'white' : theme.colors.text, padding: '10px 20px', borderRadius: '12px', border: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {isEditing ? <X size={18} /> : <Edit2 size={18} />} {isEditing ? 'Annuler' : 'Editer Profil'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 900 ? '1fr' : '1.5fr 1fr', gap: '30px' }}>
        
        {/* Left Column: Stats or Audit */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {isEditing ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'white', padding: '30px', borderRadius: theme.borderRadius.large, boxShadow: theme.shadows.soft }}>
              <h2 style={{ fontWeight: '800', marginBottom: '25px' }}>Informations Personnelles</h2>
              <form onSubmit={handleUpdateProfile}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px' }}>Nom Complet</label>
                  <input type="text" value={editForm.fullname} onChange={e => setEditForm({...editForm, fullname: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${theme.colors.border}`, outline: 'none' }} />
                </div>
                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px' }}>Biographie / Objectifs</label>
                  <textarea value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} placeholder="Parlez-nous de vous..." style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${theme.colors.border}`, outline: 'none', minHeight: '100px' }} />
                </div>
                <button type="submit" style={{ width: '100%', padding: '15px', background: theme.colors.primary, color: 'white', borderRadius: '10px', border: 'none', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <Save size={20} /> Enregistrer les modifications
                </button>
              </form>
            </motion.div>
          ) : (
            <>
              {/* Radar Chart Section (Cool Feature 1 - Student) */}
              {isStudent && (
                <div style={{ background: 'white', padding: '30px', borderRadius: theme.borderRadius.large, boxShadow: theme.shadows.soft, height: '450px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}><Zap size={20} color={theme.colors.secondary} /> Radar de Compétences</h3>
                    <div style={{ fontSize: '0.8rem', color: theme.colors.textLight, padding: '5px 12px', background: theme.colors.background, borderRadius: '20px', fontWeight: '700' }}>Basé sur {profileData.stats.totalExams} examens</div>
                  </div>
                  <div style={{ width: '100%', height: '350px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={profileData.stats.radar}>
                        <PolarGrid stroke="#e0e0e0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: theme.colors.textLight, fontSize: 12, fontWeight: 600 }} />
                        <Radar
                          name="Performance"
                          dataKey="A"
                          stroke={theme.colors.primary}
                          fill={theme.colors.primary}
                          fillOpacity={0.4}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {!isStudent && (
                <div style={{ background: 'white', padding: '30px', borderRadius: theme.borderRadius.large, boxShadow: theme.shadows.soft }}>
                  <h3 style={{ fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><Activity size={20} color={theme.colors.primary} /> Journal d'Audit Admin</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {[
                      { action: 'Connexion securisee etablie', date: 'A l\'instant', icon: <Shield size={16} /> },
                      { action: 'Mise a jour du systeme effectuee', date: 'Il y a 2h', icon: <Settings size={16} /> },
                      { action: 'Sauvegarde automatique reussie', date: 'Hier', icon: <Save size={16} /> }
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: theme.colors.background, borderRadius: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ color: theme.colors.primary }}>{item.icon}</div>
                          <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{item.action}</span>
                        </div>
                        <span style={{ fontSize: '0.8rem', color: theme.colors.textLight }}>{item.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Badges Section (Cool Feature 2) */}
          <div style={{ background: 'white', padding: '30px', borderRadius: theme.borderRadius.large, boxShadow: theme.shadows.soft }}>
            <h3 style={{ fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><Award size={20} color={theme.colors.success} /> {isStudent ? 'Mes Trophées' : 'Rôles & Privilèges'}</h3>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              {isStudent ? (
                <>
                  <Badge label="Pionnier" icon={<TrendingUp size={16} />} color="#0984e3" active={true} />
                  <Badge label="Flash" icon={<Zap size={16} />} color="#fdcb6e" active={profileData.stats.totalExams > 2} />
                  <Badge label="Invaincu" icon={<Target size={16} />} color="#00b894" active={profileData.stats.averageScore > 80} />
                  <Badge label="Sérieux" icon={<CheckCircle2 size={16} />} color="#6c5ce7" active={profileData.stats.resilience > 90} />
                </>
              ) : (
                <>
                  <Badge label="Root Access" icon={<Shield size={16} />} color="#d63031" active={true} />
                  <Badge label="System Architect" icon={<Settings size={16} />} color="#2d3436" active={true} />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Key Stats & Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div style={{ background: 'white', padding: '30px', borderRadius: theme.borderRadius.large, boxShadow: theme.shadows.soft, textAlign: 'center' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: theme.colors.textLight, textTransform: 'uppercase', marginBottom: '10px' }}>
              {isStudent ? 'Moyenne Générale' : 'Statut Système'}
            </div>
            {isStudent ? (
              <div style={{ fontSize: '4rem', fontWeight: '900', color: theme.colors.primary }}>{profileData.stats.averageScore}<span style={{ fontSize: '1.5rem', opacity: 0.5 }}>%</span></div>
            ) : (
              <div style={{ fontSize: '1.5rem', fontWeight: '900', color: theme.colors.success, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <div style={{ width: '12px', height: '12px', background: theme.colors.success, borderRadius: '50%' }} /> OPERATIONNEL
              </div>
            )}
            <p style={{ marginTop: '10px', color: theme.colors.textLight, fontSize: '0.9rem' }}>
              {isStudent ? `Rang actuel : Top ${100 - profileData.stats.precision}%` : 'Dernière maintenance : Aujourd\'hui'}
            </p>
          </div>

          <div style={{ background: 'white', padding: '30px', borderRadius: theme.borderRadius.large, boxShadow: theme.shadows.soft }}>
            <h3 style={{ fontWeight: '800', marginBottom: '20px' }}>À propos</h3>
            <p style={{ color: theme.colors.textLight, lineHeight: '1.6', fontSize: '0.95rem' }}>
              {profileData.user.bio || "Aucune biographie renseignée. Cliquez sur Editer pour personnaliser votre profil."}
            </p>
            <div style={{ marginTop: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: theme.colors.textLight }}>
                <Clock size={18} /> <span>Membre depuis : {new Date(profileData.user.createdAt).toLocaleDateString()}</span>
              </div>
              {isStudent && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: theme.colors.textLight }}>
                  <BookOpen size={18} /> <span>Examens passés : {profileData.stats.totalExams}</span>
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={logout}
            style={{ width: '100%', padding: '16px', background: '#fff0f0', color: theme.colors.error, border: 'none', borderRadius: '15px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer' }}
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
    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 15px', borderRadius: '12px',
    background: active ? `${color}15` : '#f5f5f5',
    color: active ? color : '#b2bec3',
    border: `1px solid ${active ? `${color}30` : '#dfe6e9'}`,
    transition: 'all 0.3s ease',
    opacity: active ? 1 : 0.6,
    filter: active ? 'none' : 'grayscale(1)'
  }}>
    {icon} <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>{label}</span>
  </div>
);

export default Profile;
