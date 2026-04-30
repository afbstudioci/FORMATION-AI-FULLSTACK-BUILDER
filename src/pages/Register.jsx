import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, User, Lock, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { Loader2 } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ fullname: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [matriculeGenere, setMatriculeGenere] = useState('');
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', formData);
      setMatriculeGenere(data.matricule);
      
      // Auto-copy to clipboard
      try {
        await navigator.clipboard.writeText(data.matricule);
        addNotification('Compte créé et matricule copié !', 'success');
      } catch (err) {
        addNotification('Compte créé avec succès !', 'success');
      }
    } catch (err) {
      addNotification(err.response?.data?.message || "Erreur lors de l'inscription", 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--background)',
      padding: '20px'
    }}>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'var(--surface)',
          padding: window.innerWidth < 480 ? '30px 20px' : '40px',
          borderRadius: '24px',
          boxShadow: 'var(--shadow-premium)',
          width: '100%',
          maxWidth: '440px',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid var(--border)'
        }}
      >
        {/* Jauge de chargement premium */}
        {loading && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'var(--border)' }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ height: '100%', background: 'var(--secondary)', boxShadow: '0 0 10px var(--secondary)' }}
            />
          </div>
        )}

        {!matriculeGenere ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: '35px' }}>
              <div style={{ 
                background: 'var(--secondary)', 
                width: '60px', 
                height: '60px', 
                borderRadius: '16px', 
                margin: '0 auto 15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: `0 8px 15px rgba(108, 92, 231, 0.1)`
              }}>
                <UserPlus size={30} />
              </div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--text)', fontWeight: '900' }}>Inscription Étudiant</h2>
              <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginTop: '5px' }}>Créez votre compte pour accéder aux épreuves</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: '800', color: 'var(--text)' }}>NOM COMPLET</label>
                <div style={{ position: 'relative' }}>
                  <User style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} size={18} />
                  <input 
                    type="text"
                    required
                    placeholder="Ex: Jean Dupont"
                    value={formData.fullname}
                    onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '14px 14px 14px 45px',
                      borderRadius: '12px',
                      border: '2px solid var(--border)',
                      fontSize: '0.95rem',
                      color: 'var(--text)',
                      backgroundColor: 'var(--background)',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: '800', color: 'var(--text)' }}>MOT DE PASSE</label>
                <div style={{ position: 'relative' }}>
                  <Lock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} size={18} />
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Choisissez un mot de passe"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '14px 45px 14px 45px',
                      borderRadius: '12px',
                      border: '2px solid var(--border)',
                      fontSize: '0.95rem',
                      color: 'var(--text)',
                      backgroundColor: 'var(--background)',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-light)',
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: 'var(--secondary)',
                  color: 'white',
                  borderRadius: '12px',
                  fontWeight: '800',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  boxShadow: `0 10px 20px rgba(108, 92, 231, 0.2)`,
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? <Loader2 className="animate-spin" /> : <><ArrowRight size={20} /> Créer mon compte</>}
              </button>
            </form>

            <p style={{ marginTop: '25px', textAlign: 'center', color: 'var(--text-light)', fontSize: '0.85rem' }}>
              Déjà un compte ? <Link to="/login" style={{ color: 'var(--secondary)', fontWeight: '800', textDecoration: 'none' }}>Se connecter</Link>
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
              color: 'var(--success)'
            }}>
              <CheckCircle2 size={48} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text)', marginBottom: '15px' }}>Compte créé !</h3>
            <p style={{ color: 'var(--text-light)', marginBottom: '25px', lineHeight: '1.5', fontSize: '0.9rem' }}>
              Veuillez noter précieusement votre <strong>matricule</strong>. Il est indispensable pour vous connecter :
            </p>
            <div style={{ 
              background: 'var(--background)', 
              padding: '20px', 
              borderRadius: '12px', 
              fontSize: '1.75rem', 
              fontWeight: '900', 
              color: 'var(--primary)', 
              letterSpacing: '3px',
              border: `2px dashed var(--primary)`,
              marginBottom: '35px'
            }}>
              {matriculeGenere}
            </div>
            <button 
              onClick={() => navigate('/login', { state: { matricule: matriculeGenere } })}
              style={{
                width: '100%',
                padding: '16px',
                background: 'var(--primary)',
                color: 'white',
                borderRadius: '12px',
                fontWeight: '800',
                fontSize: '1rem'
              }}
            >
              Aller à la connexion
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Register;
