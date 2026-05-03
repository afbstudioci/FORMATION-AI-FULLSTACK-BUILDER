import React from 'react';
import { motion } from 'framer-motion';

const PremiumLoader = () => {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--background)',
      zIndex: 9999
    }}>
      <div style={{ position: 'relative', width: '120px', height: '120px' }}>
        {/* Anneau extérieur rotatif */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '4px solid var(--border)',
            borderTopColor: 'var(--primary)',
            boxShadow: '0 0 15px rgba(9, 132, 227, 0.2)'
          }}
        />
        
        {/* Cercle central pulsant */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            inset: '30px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 20px rgba(108, 92, 231, 0.3)'
          }}
        >
          <div style={{ color: 'white', fontWeight: '1000', fontSize: '1.2rem' }}>AFB</div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{ marginTop: '30px', textAlign: 'center' }}
      >
        <h2 style={{ fontWeight: '900', color: 'var(--text)', letterSpacing: '2px', marginBottom: '8px' }}>SYNCHRONISATION</h2>
        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%' }}
            />
          ))}
        </div>
      </motion.div>

      <div style={{ position: 'absolute', bottom: '40px', color: 'var(--text-light)', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '4px' }}>
        AFB STUDIO CI - SECURE ACCESS
      </div>
    </div>
  );
};

export default PremiumLoader;
