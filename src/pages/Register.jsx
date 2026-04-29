import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, User, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { theme } from '../theme';
import Alert from '../components/Alert';

const Register = () => {
  const [formData, setFormData] = useState({ fullname: '', password: '' });
  const [info, setInfo] = useState({ message: '', type: 'error' });
  const [loading, setLoading] = useState(false);
  const [matriculeGenere, setMatriculeGenere] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setInfo({ message: '', type: 'error' });
    try {
      const { data } = await api.post('/auth/register', formData);
      setMatriculeGenere(data.matricule);
      setInfo({ message: 'Compte cree avec succes !', type: 'success' });
    } catch (err) {
      setInfo({ message: err.response?.data?.message || "Erreur lors de l'inscription", type: 'error' });
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
      background: `linear-gradient(135deg, ${theme.colors.secondary} 0%, ${theme.colors.primary} 100%)`,
      padding: '20px'
    }}>
      <Alert message={info.message} type={info.type} onClose={() => setInfo({ ...info, message: '' })} />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: theme.colors.surface,
          padding: '40px',
          borderRadius: theme.borderRadius.large,
          boxShadow: theme.shadows.premium,
          width: '100%',
          maxWidth: '440px'
        }}
      >
        {!matriculeGenere ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: '35px' }}>
              <div style={{ 
                background: theme.colors.secondary, 
                width: '60px', 
                height: '60px', 
                borderRadius: '15px', 
                margin: '0 auto 15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: `0 8px 15px rgba(108, 92, 231, 0.3)`
              }}>
                <UserPlus size={30} />
              </div>
              <h2 style={{ fontSize: '1.75rem', color: theme.colors.text, fontWeight: '800' }}>Inscription Etudiant</h2>
              <p style={{ color: theme.colors.textLight, fontSize: '0.9rem', marginTop: '5px' }}>Creez votre compte pour passer vos examens</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '700', color: theme.colors.text }}>Nom Complet</label>
                <div style={{ position: 'relative' }}>
                  <User style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: theme.colors.textLight }} size={18} />
                  <input 
                    type="text"
                    required
                    placeholder="Ex: Jean Dupont"
                    value={formData.fullname}
                    onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '14px 14px 14px 45px',
                      borderRadius: theme.borderRadius.medium,
                      border: `2px solid ${theme.colors.border}`,
                      fontSize: '0.95rem',
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
                    placeholder="Choisissez un mot de passe"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '14px 14px 14px 45px',
                      borderRadius: theme.borderRadius.medium,
                      border: `2px solid ${theme.colors.border}`,
                      fontSize: '0.95rem',
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
                  background: theme.colors.secondary,
                  color: 'white',
                  borderRadius: theme.borderRadius.medium,
                  fontWeight: '700',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  boxShadow: `0 10px 20px rgba(108, 92, 231, 0.2)`
                }}
              >
                {loading ? 'Creation...' : <><ArrowRight size={20} /> Creer mon compte</>}
              </button>
            </form>

            <p style={{ marginTop: '25px', textAlign: 'center', color: theme.colors.textLight, fontSize: '0.9rem' }}>
              Deja un compte ? <Link to="/login" style={{ color: theme.colors.secondary, fontWeight: '700', textDecoration: 'none' }}>Se connecter</Link>
            </p>
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '10px' }}
          >
            <div style={{ 
              background: 'rgba(0, 184, 148, 0.1)', 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.colors.success
            }}>
              <CheckCircle2 size={48} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: theme.colors.text, marginBottom: '15px' }}>Inscription Validee !</h3>
            <p style={{ color: theme.colors.textLight, marginBottom: '25px', lineHeight: '1.5' }}>
              Veuillez noter precieusement votre <strong>matricule</strong>. Il est indispensable pour vous connecter :
            </p>
            <div style={{ 
              background: theme.colors.background, 
              padding: '20px', 
              borderRadius: theme.borderRadius.medium, 
              fontSize: '1.75rem', 
              fontWeight: '900', 
              color: theme.colors.primary, 
              letterSpacing: '3px',
              border: `2px dashed ${theme.colors.primary}`,
              marginBottom: '35px'
            }}>
              {matriculeGenere}
            </div>
            <button 
              onClick={() => navigate('/login')}
              style={{
                width: '100%',
                padding: '16px',
                background: theme.colors.primary,
                color: 'white',
                borderRadius: theme.borderRadius.medium,
                fontWeight: '700',
                fontSize: '1rem'
              }}
            >
              Aller a la connexion
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Register;
