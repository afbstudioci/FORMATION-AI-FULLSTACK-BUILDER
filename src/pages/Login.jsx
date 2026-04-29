import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Lock, Hash } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { theme } from '../theme';
import Alert from '../components/Alert';

const Login = () => {
  const [formData, setFormData] = useState({ matricule: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
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

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
      padding: '20px'
    }}>
      <Alert message={error} onClose={() => setError('')} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: theme.colors.surface,
          padding: '40px',
          borderRadius: theme.borderRadius.large,
          boxShadow: theme.shadows.premium,
          width: '100%',
          maxWidth: '400px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <div style={{ 
            background: theme.colors.primary, 
            width: '60px', 
            height: '60px', 
            borderRadius: '15px', 
            margin: '0 auto 15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: `0 8px 15px rgba(9, 132, 227, 0.3)`
          }}>
            <Lock size={30} />
          </div>
          <h2 style={{ fontSize: '1.75rem', color: theme.colors.text, fontWeight: '800' }}>Espace Connexion</h2>
          <p style={{ color: theme.colors.textLight, fontSize: '0.9rem', marginTop: '5px' }}>Entrez vos identifiants pour continuer</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '700', color: theme.colors.text }}>Matricule</label>
            <div style={{ position: 'relative' }}>
              <Hash style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: theme.colors.textLight }} size={18} />
              <input 
                type="text"
                required
                placeholder="LMS-2024-XXXX"
                value={formData.matricule}
                onChange={(e) => setFormData({...formData, matricule: e.target.value})}
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 45px',
                  borderRadius: theme.borderRadius.medium,
                  border: `2px solid ${theme.colors.border}`,
                  fontSize: '0.95rem',
                  color: theme.colors.text,
                  backgroundColor: theme.colors.background
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '700', color: theme.colors.text }}>Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: theme.colors.textLight }} size={18} />
              <input 
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 45px',
                  borderRadius: theme.borderRadius.medium,
                  border: `2px solid ${theme.colors.border}`,
                  fontSize: '0.95rem',
                  color: theme.colors.text,
                  backgroundColor: theme.colors.background
                }}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: theme.colors.primary,
              color: 'white',
              borderRadius: theme.borderRadius.medium,
              fontWeight: '700',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              boxShadow: `0 10px 20px rgba(9, 132, 227, 0.2)`
            }}
          >
            {loading ? 'Traitement...' : <><LogIn size={20} /> Se connecter</>}
          </button>
        </form>

        <p style={{ marginTop: '25px', textAlign: 'center', color: theme.colors.textLight, fontSize: '0.9rem' }}>
          Vous n'avez pas de matricule ? <Link to="/register" style={{ color: theme.colors.primary, fontWeight: '700', textDecoration: 'none' }}>Créer un compte</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
