import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Zap, BarChart3, ArrowRight, CheckCircle2, Globe, Trophy, Sparkles, GraduationCap, FileCheck, Users, ChevronDown } from 'lucide-react';

const FloatingParticle = ({ delay, x, y, size }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: [0, 0.3, 0], scale: [0, 1, 0] }}
    transition={{ duration: 6, repeat: Infinity, delay, ease: "easeInOut" }}
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'var(--primary)',
      filter: 'blur(2px)',
    }}
  />
);

const LandingPage = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(false);

  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const features = [
    { 
      icon: <Shield size={28} />, 
      title: "Sécurité Avancée", 
      desc: "Anticheat intelligent, surveillance temps réel et détection de comportements suspects.",
      color: "var(--primary)"
    },
    { 
      icon: <Zap size={28} />, 
      title: "IA Puissante", 
      desc: "Générez des épreuves pertinentes en quelques secondes avec notre IA propriétaire.",
      color: "var(--secondary)"
    },
    { 
      icon: <BarChart3 size={28} />, 
      title: "Analytics Pro", 
      desc: "Tableaux de bord détaillés, radar de compétences et suivi personnalisé.",
      color: "var(--success)"
    }
  ];

  const stats = [
    { value: "15K+", label: "Étudiants", icon: <GraduationCap size={20} /> },
    { value: "500+", label: "Établissements", icon: <Users size={20} /> },
    { value: "50K+", label: "Examens", icon: <FileCheck size={20} /> },
    { value: "99%", label: "Satisfaction", icon: <Sparkles size={20} /> }
  ];

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Animated Background */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <motion.div 
          style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
            opacity: 0.08,
            filter: 'blur(80px)',
          }}
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--secondary) 0%, transparent 70%)',
            opacity: 0.08,
            filter: 'blur(80px)',
          }}
          animate={{ 
            x: [0, -30, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        {[...Array(8)].map((_, i) => (
          <FloatingParticle 
            key={i}
            delay={i * 0.8}
            x={`${10 + Math.random() * 80}%`}
            y={`${10 + Math.random() * 80}%`}
            size={`${4 + Math.random() * 8}px`}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '20px 8%', position: 'fixed', top: 0, left: 0, right: 0, 
        zIndex: 1000, background: 'var(--glass)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)'
      }}>
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          <div style={{ 
            width: '40px', height: '40px', borderRadius: '12px', 
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <GraduationCap size={22} color="white" />
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: '900', letterSpacing: '-1px', color: 'var(--text)' }}>
            AFB<span style={{ color: 'var(--primary)' }}>STUDIO</span>
          </span>
        </motion.div>
        
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          style={{ display: 'flex', gap: '16px', alignItems: 'center' }}
        >
          <button 
            onClick={() => navigate('/login')}
            style={{ 
              background: 'none', color: 'var(--text)', fontWeight: '700', 
              fontSize: '0.95rem', padding: '10px 20px', borderRadius: '10px'
            }}
          >
            Connexion
          </button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/register')}
            style={{ 
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
              color: 'white', padding: '12px 28px', borderRadius: '14px', 
              fontWeight: '800', fontSize: '0.95rem', boxShadow: '0 8px 25px rgba(9, 132, 227, 0.35)'
            }}
          >
            Commencer
          </motion.button>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section style={{ 
        minHeight: '100vh', display: 'flex', flexDirection: 'column', 
        justifyContent: 'center', alignItems: 'center', textAlign: 'center', 
        padding: '120px 8% 80px', position: 'relative', zIndex: 1
      }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          style={{ maxWidth: '900px' }}
        >
          <motion.div variants={itemVariants} style={{ marginBottom: '24px' }}>
            <span style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', background: 'var(--surface)', borderRadius: '50px',
              fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)',
              border: '1px solid var(--border)'
            }}>
              <Sparkles size={16} />
              La nouvelle génération d'examens en ligne
            </span>
          </motion.div>

          <motion.h1 variants={itemVariants} style={{ 
            fontSize: 'clamp(2.8rem, 7vw, 4.5rem)', fontWeight: '1000', 
            lineHeight: 1.1, letterSpacing: '-2px', marginBottom: '28px', 
            color: 'var(--text)'
          }}>
            L'excellence académique
            <br />
            <span style={{ 
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              boostée par l'IA
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} style={{ 
            fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'var(--text-light)', 
            maxWidth: '650px', margin: '0 auto 45px', fontWeight: '500', 
            lineHeight: 1.7
          }}>
            Créez, surveillez et analysez vos évaluations avec une plateforme sécurisée, 
            intuitive et propulsée par l'intelligence artificielle.
          </motion.p>

          <motion.div variants={itemVariants} style={{ 
            display: 'flex', gap: '20px', justifyContent: 'center', 
            flexWrap: 'wrap', marginBottom: '60px'
          }}>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 15px 40px rgba(9, 132, 227, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/register')}
              style={{ 
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
                color: 'white', padding: '20px 45px', borderRadius: '16px', 
                fontWeight: '900', fontSize: '1.1rem', display: 'flex', 
                alignItems: 'center', gap: '12px', border: 'none',
                boxShadow: '0 10px 30px rgba(9, 132, 227, 0.3)'
              }}
            >
              Créer mon compte gratuit
              <ArrowRight size={22} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, background: 'var(--surface)' }}
              whileTap={{ scale: 0.98 }}
              onClick={scrollToFeatures}
              style={{ 
                background: 'transparent', color: 'var(--text)', padding: '20px 40px', 
                borderRadius: '16px', fontWeight: '800', fontSize: '1.1rem', 
                border: '2px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px'
              }}
            >
              Découvrir
            </motion.button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div 
            variants={itemVariants}
            style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            {[
              { icon: <CheckCircle2 size={20} />, text: "Anticheat intégré", color: "var(--success)" },
              { icon: <Globe size={20} />, text: "Données sécurisées", color: "var(--primary)" },
              { icon: <Shield size={20} />, text: "Support 24/7", color: "var(--warning)" }
            ].map((badge, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '10px', 
                  padding: '14px 24px', background: 'var(--surface)', 
                  borderRadius: '50px', border: '1px solid var(--border)',
                  fontWeight: '700', fontSize: '0.9rem'
                }}
              >
                <span style={{ color: badge.color }}>{badge.icon}</span>
                <span style={{ color: 'var(--text)' }}>{badge.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          style={{ position: 'absolute', bottom: '40px' }}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <button onClick={scrollToFeatures} style={{ 
            background: 'none', color: 'var(--text-light)', 
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            fontSize: '0.85rem', fontWeight: '600'
          }}>
            Découvrir
            <ChevronDown size={24} />
          </button>
        </motion.div>
      </section>

      {/* Stats Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        style={{ 
          padding: '60px 8%', background: 'var(--surface)', 
          borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)'
        }}
      >
        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px', 
          maxWidth: '1100px', margin: '0 auto'
        }}>
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ 
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '60px', height: '60px', borderRadius: '16px',
                background: 'var(--background)', marginBottom: '15px',
                color: 'var(--primary)'
              }}>
                {stat.icon}
              </div>
              <div style={{ 
                fontSize: '2.5rem', fontWeight: '1000', 
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>
                {stat.value}
              </div>
              <div style={{ color: 'var(--text-light)', fontWeight: '700', fontSize: '0.95rem' }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" style={{ padding: '100px 8%', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '70px' }}
        >
          <span style={{ 
            display: 'inline-block', padding: '8px 20px', 
            background: 'linear-gradient(135deg, rgba(9, 132, 227, 0.1), rgba(108, 92, 231, 0.1))',
            borderRadius: '50px', fontSize: '0.85rem', fontWeight: '800', 
            color: 'var(--primary)', marginBottom: '20px'
          }}>
            Fonctionnalités
          </span>
          <h2 style={{ 
            fontWeight: '1000', fontSize: 'clamp(2rem, 5vw, 2.8rem)', 
            marginBottom: '20px', letterSpacing: '-1px', color: 'var(--text)'
          }}>
            Tout ce dont vous avez besoin
          </h2>
          <p style={{ 
            color: 'var(--text-light)', maxWidth: '600px', margin: '0 auto',
            fontSize: '1.1rem', fontWeight: '500'
          }}>
            Une plateforme complète pour gérer vos évaluations de A à Z
          </p>
        </motion.div>

        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
          gap: '30px', maxWidth: '1200px', margin: '0 auto'
        }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={{ y: -15, boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)' }}
              style={{ 
                background: 'var(--background)', padding: '45px', 
                borderRadius: '28px', border: '1px solid var(--border)',
                cursor: 'pointer'
              }}
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                style={{ 
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '70px', height: '70px', borderRadius: '20px',
                  background: `linear-gradient(135deg, ${f.color}15, ${f.color}05)`,
                  marginBottom: '25px', color: f.color
                }}
              >
                {f.icon}
              </motion.div>
              <h3 style={{ 
                fontWeight: '900', fontSize: '1.35rem', marginBottom: '15px',
                color: 'var(--text)'
              }}>
                {f.title}
              </h3>
              <p style={{ 
                color: 'var(--text-light)', lineHeight: 1.7, 
                fontWeight: '500', fontSize: '1rem'
              }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '100px 8%', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ 
          position: 'absolute', top: '50%', left: '50%', 
          transform: 'translate(-50%, -50%)',
          width: '800px', height: '400px',
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          borderRadius: '50%', filter: 'blur(100px)', opacity: 0.1
        }} />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ 
            maxWidth: '800px', margin: '0 auto', textAlign: 'center',
            background: 'var(--surface)', padding: '60px', 
            borderRadius: '32px', border: '1px solid var(--border)',
            position: 'relative', zIndex: 1
          }}
        >
          <h2 style={{ 
            fontWeight: '1000', fontSize: '2.2rem', marginBottom: '20px',
            color: 'var(--text)'
          }}>
            Prêt à transformer vos évaluations ?
          </h2>
          <p style={{ 
            color: 'var(--text-light)', fontSize: '1.15rem', 
            marginBottom: '35px', fontWeight: '500'
          }}>
            Rejoignez des milliers d'établissements qui font confiance à AFB Studio
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/register')}
            style={{ 
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
              color: 'white', padding: '20px 50px', borderRadius: '16px', 
              fontWeight: '900', fontSize: '1.15rem', display: 'inline-flex', 
              alignItems: 'center', gap: '12px', border: 'none',
              boxShadow: '0 15px 40px rgba(9, 132, 227, 0.35)'
            }}
          >
            Commencer gratuitement
            <ArrowRight size={22} />
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ 
        padding: '40px 8%', borderTop: '1px solid var(--border)', 
        background: 'var(--surface)'
      }}>
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          flexWrap: 'wrap', gap: '20px', maxWidth: '1200px', margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '10px', 
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <GraduationCap size={18} color="white" />
            </div>
            <span style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--text)' }}>
              AFB<span style={{ color: 'var(--primary)' }}>STUDIO</span>
            </span>
          </div>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', fontWeight: '600' }}>
            © 2024 AFB STUDIO. Tous droits réservés.
          </p>
          <div style={{ display: 'flex', gap: '25px' }}>
            <a href="#" style={{ color: 'var(--text-light)', textDecoration: 'none', fontWeight: '700', fontSize: '0.9rem' }}>Mentions légales</a>
            <a href="#" style={{ color: 'var(--text-light)', textDecoration: 'none', fontWeight: '700', fontSize: '0.9rem' }}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;