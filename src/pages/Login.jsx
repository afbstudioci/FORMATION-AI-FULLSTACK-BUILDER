import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Lock, Hash, Eye, EyeOff, ShieldCheck, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { theme } from '../theme';
import Alert from '../components/Alert';

const Login = () => {
  const [formData, setFormData] = useState({ matricule: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [enigmeState, setEnigmeState] = useState(0); // 0: init, 1: step1_ok, 2: admin_form
  const [adminPass, setAdminPass] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // Logique cryptique pour le Step 2 (10 secondes sur le cadenas)
  const _resonance = useRef(null);
  const [_focalPoint, _setFocalPoint] = useState(0);

  const _handleResonanceStart = () => {
    if (enigmeState !== 1) return;
    _resonance.current = setInterval(() => {
      _setFocalPoint(prev => {
        if (prev >= 100) {
          clearInterval(_resonance.current);
          setEnigmeState(2);
          return 100;
        }
        return prev + 1;
      });
    }, 100); // 100ms * 100 = 10s
  };

  const _handleResonanceEnd = () => {
    clearInterval(_resonance.current);
    if (enigmeState !== 2) _setFocalPoint(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Tentative de passage de la Gatekeeper (Enigme Step 1)
    if (formData.matricule === formData.password && formData.matricule.length > 5) {
      try {
        const { data } = await api.post('/auth/gatekeeper', { k: formData.matricule, s: formData.password });
        if (data.status === 'alpha_clear') {
          setEnigmeState(1);
          setLoading(false);
          return;
        }
      } catch (err) { /* Silence */ }
    }

    try {
      const { data } = await api.post('/auth/login', formData);
      login(data, data.accessToken);
      navigate(data.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { matricule: 'ADMIN_MASTER', password: adminPass, isSecret: true });
      // Note: On pourrait utiliser la route login standard avec un flag ou une logique specifique
      // Mais pour rester simple et fonctionnel selon la demande:
      const { data: adminData } = await api.post('/auth/login', { matricule: adminPass, password: adminPass });
      login(adminData, adminData.accessToken);
      navigate('/admin');
    } catch (err) {
      setError("Cle d'acces invalide");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: enigmeState === 1 ? '#2d3436' : `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
      padding: '20px',
      transition: 'all 1s ease'
    }}>
      <Alert message={error} onClose={() => setError('')} />
      
      {enigmeState === 1 && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ position: 'fixed', top: '40px', color: theme.colors.success, fontWeight: '900', letterSpacing: '4px' }}
        >
          ETAPE 1 REUSSIE. MAINTENEZ LE NOEUD CENTRAL.
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: theme.colors.surface,
          padding: '40px',
          borderRadius: theme.borderRadius.large,
          boxShadow: theme.shadows.premium,
          width: '100%',
          maxWidth: '400px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Barre de chargement secrete Step 2 */}
        {_focalPoint > 0 && (
          <div style={{ position: 'absolute', top: 0, left: 0, height: '4px', background: theme.colors.primary, width: `${_focalPoint}%`, transition: 'width 0.1s' }} />
        )}

        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <motion.div 
            onMouseDown={_handleResonanceStart}
            onMouseUp={_handleResonanceEnd}
            onTouchStart={_handleResonanceStart}
            onTouchEnd={_handleResonanceEnd}
            animate={enigmeState === 1 ? { rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ 
              background: enigmeState === 1 ? '#000' : theme.colors.primary, 
              width: '60px', 
              height: '60px', 
              borderRadius: '15px', 
              margin: '0 auto 15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: enigmeState === 1 ? 'help' : 'default',
              boxShadow: `0 8px 15px rgba(0,0,0,0.2)`
            }}
          >
            {enigmeState === 2 ? <ShieldCheck size={30} /> : <Lock size={30} />}
          </motion.div>
          <h2 style={{ fontSize: '1.75rem', color: theme.colors.text, fontWeight: '800' }}>
            {enigmeState === 2 ? 'Terminal Alpha' : 'Espace Connexion'}
          </h2>
          <p style={{ color: theme.colors.textLight, fontSize: '0.9rem', marginTop: '5px' }}>
            {enigmeState === 2 ? 'Veuillez introduire la cle maitresse' : 'Entrez vos identifiants pour continuer'}
          </p>
        </div>

        {enigmeState === 2 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ marginBottom: '30px' }}>
              <div style={{ position: 'relative' }}>
                <Key style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: theme.colors.textLight }} size={18} />
                <input 
                  type="password"
                  placeholder="Master Key..."
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  style={{
                    width: '100%', padding: '14px 14px 14px 45px', borderRadius: theme.borderRadius.medium,
                    border: `2px solid ${theme.colors.text}`, fontSize: '0.95rem', background: '#f9f9f9', outline: 'none'
                  }}
                />
              </div>
            </div>
            <button 
              onClick={handleAdminLogin}
              style={{ width: '100%', padding: '16px', background: '#000', color: 'white', borderRadius: theme.borderRadius.medium, fontWeight: '900' }}
            >
              INITIALISER L'ACCES
            </button>
            <button onClick={() => setEnigmeState(0)} style={{ width: '100%', marginTop: '15px', color: theme.colors.textLight, fontSize: '0.8rem', background: 'none', border: 'none' }}>Abandonner</button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '700', color: theme.colors.text }}>Matricule</label>
              <div style={{ position: 'relative' }}>
                <Hash style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: theme.colors.textLight }} size={18} />
                <input 
                  type="text" required placeholder="Votre matricule"
                  value={formData.matricule}
                  onChange={(e) => setFormData({...formData, matricule: e.target.value})}
                  style={{
                    width: '100%', padding: '14px 14px 14px 45px', borderRadius: theme.borderRadius.medium,
                    border: `2px solid ${theme.colors.border}`, fontSize: '0.95rem', color: theme.colors.text,
                    backgroundColor: theme.colors.background, outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '700', color: theme.colors.text }}>Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: theme.colors.textLight }} size={18} />
                <input 
                  type={showPassword ? "text" : "password"} required placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  style={{
                    width: '100%', padding: '14px 45px 14px 45px', borderRadius: theme.borderRadius.medium,
                    border: `2px solid ${theme.colors.border}`, fontSize: '0.95rem', color: theme.colors.text,
                    backgroundColor: theme.colors.background, outline: 'none'
                  }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: theme.colors.textLight, cursor: 'pointer', padding: '4px' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              style={{ width: '100%', padding: '16px', background: theme.colors.primary, color: 'white', borderRadius: theme.borderRadius.medium, fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: `0 10px 20px rgba(9, 132, 227, 0.2)` }}
            >
              {loading ? 'Traitement...' : <><LogIn size={20} /> Se connecter</>}
            </button>
          </form>
        )}

        {enigmeState === 0 && (
          <p style={{ marginTop: '25px', textAlign: 'center', color: theme.colors.textLight, fontSize: '0.9rem' }}>
            Vous n'avez pas de matricule ? <Link to="/register" style={{ color: theme.colors.primary, fontWeight: '700', textDecoration: 'none' }}>Créer un compte</Link>
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
