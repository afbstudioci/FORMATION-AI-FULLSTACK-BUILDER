import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Zap, BarChart3, ArrowRight, CheckCircle2, Globe, Users, Trophy } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    { 
      icon: <Shield size={32} />, 
      title: "Sécurité Maximale", 
      desc: "Protocoles anti-triche avancés et surveillance en temps réel des sessions." 
    },
    { 
      icon: <Zap size={32} />, 
      title: "Génération par IA", 
      desc: "Créez des épreuves pertinentes en quelques secondes grâce à notre IA intégrée." 
    },
    { 
      icon: <BarChart3 size={32} />, 
      title: "Analyses Précises", 
      desc: "Rapports détaillés et radar de performance pour chaque étudiant." 
    }
  ];

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      {/* Header / Navbar */}
      <nav style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '25px 5%', background: 'var(--glass)', backdropFilter: 'blur(10px)',
        position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid var(--border)'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: '1000', color: 'var(--primary)', letterSpacing: '-1px' }}>
          AFB STUDIO
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <button onClick={() => navigate('/login')} style={{ background: 'none', color: 'var(--text)', fontWeight: '700' }}>Connexion</button>
          <button 
            onClick={() => navigate('/register')} 
            style={{ background: 'var(--primary)', color: 'white', padding: '10px 25px', borderRadius: '12px', fontWeight: '800', boxShadow: 'var(--shadow-medium)' }}
          >
            S'inscrire
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '100px 5%', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)', opacity: 0.05, filter: 'blur(50px)', pointerEvents: 'none' }} />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: '1000', lineHeight: 1.1, letterSpacing: '-2px', marginBottom: '25px', color: 'var(--text)' }}>
            L'excellence académique <br /> 
            <span style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>propulsée par l'IA</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-light)', maxWidth: '700px', margin: '0 auto 40px', fontWeight: '500', lineHeight: 1.6 }}>
            Une plateforme d'évaluation sécurisée, intelligente et intuitive conçue pour les institutions modernes.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => navigate('/register')}
              style={{ background: 'var(--primary)', color: 'white', padding: '18px 40px', borderRadius: '16px', fontWeight: '900', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 20px 40px rgba(9, 132, 227, 0.3)' }}
            >
              Démarrer maintenant <ArrowRight size={22} />
            </button>
            <button style={{ background: 'var(--surface)', color: 'var(--text)', padding: '18px 40px', borderRadius: '16px', fontWeight: '800', fontSize: '1.1rem', border: '1px solid var(--border)' }}>
              Voir la démo
            </button>
          </div>
        </motion.div>

        {/* Floating Badges Simulation */}
        <div className="hide-mobile" style={{ marginTop: '80px', display: 'flex', gap: '40px', justifyContent: 'center' }}>
          {[
            { icon: <CheckCircle2 color="var(--success)" />, text: "Certification ISO" },
            { icon: <Globe color="var(--primary)" />, text: "Accès mondial" },
            { icon: <Trophy color="var(--warning)" />, text: "Leader 2024" }
          ].map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.2 }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', background: 'var(--surface)', borderRadius: '50px', border: '1px solid var(--border)', fontWeight: '700', fontSize: '0.9rem' }}
            >
              {b.icon} {b.text}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 5%', background: 'var(--surface)' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontWeight: '900', fontSize: '2rem', marginBottom: '15px' }}>Pourquoi choisir AFB Studio ?</h2>
          <div style={{ width: '60px', height: '4px', background: 'var(--primary)', margin: '0 auto', borderRadius: '2px' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              style={{ background: 'var(--background)', padding: '40px', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-soft)' }}
            >
              <div style={{ color: 'var(--primary)', marginBottom: '20px' }}>{f.icon}</div>
              <h3 style={{ fontWeight: '900', fontSize: '1.25rem', marginBottom: '15px' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-light)', lineHeight: 1.6, fontWeight: '500' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '80px 5%', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: '1000', color: 'var(--primary)' }}>15k+</div>
            <div style={{ color: 'var(--text-light)', fontWeight: '700' }}>Étudiants</div>
          </div>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: '1000', color: 'var(--secondary)' }}>500+</div>
            <div style={{ color: 'var(--text-light)', fontWeight: '700' }}>Établissements</div>
          </div>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: '1000', color: 'var(--success)' }}>99%</div>
            <div style={{ color: 'var(--text-light)', fontWeight: '700' }}>Satisfaction</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '60px 5%', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '30px' }}>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: '1000', color: 'var(--primary)', marginBottom: '10px' }}>AFB STUDIO</div>
            <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', fontWeight: '600' }}>© 2024 AFB STUDIO. Tous droits réservés.</p>
          </div>
          <div style={{ display: 'flex', gap: '30px' }}>
            <a href="#" style={{ color: 'var(--text-light)', textDecoration: 'none', fontWeight: '700', fontSize: '0.9rem' }}>Mentions légales</a>
            <a href="#" style={{ color: 'var(--text-light)', textDecoration: 'none', fontWeight: '700', fontSize: '0.9rem' }}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
