import React, { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';
import { theme } from '../theme';

const InstallPWA = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Détecter iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(ios);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Ne pas montrer si déjà vu dans cette session ou si déjà installé
      if (!localStorage.getItem('pwaPromptSeen')) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Pour iOS, on affiche le prompt si non installe
    if (ios && !window.navigator.standalone && !localStorage.getItem('pwaPromptSeen')) {
      const timer = setTimeout(() => setShowPrompt(true), 4000);
      return () => clearTimeout(timer);
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
      localStorage.setItem('pwaPromptSeen', 'true');
    }
    setDeferredPrompt(null);
  };

  const closePrompt = () => {
    setShowPrompt(false);
    localStorage.setItem('pwaPromptSeen', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '25px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      width: 'calc(100% - 40px)',
      maxWidth: '420px',
      background: 'var(--surface)',
      padding: '24px',
      borderRadius: '28px',
      boxShadow: 'var(--shadow-premium)',
      border: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      animation: 'pwaSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      backdropFilter: 'blur(15px)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
          <div style={{ 
            background: 'var(--primary)', 
            width: '52px', 
            height: '52px', 
            borderRadius: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 8px 16px var(--primary-light)'
          }}>
            <Download color="white" size={26} />
          </div>
          <div>
            <h4 style={{ fontWeight: '950', margin: 0, color: 'var(--text)', fontSize: '1.1rem', letterSpacing: '-0.5px' }}>AFB EXAM PRO</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: '4px 0 0', fontWeight: '700' }}>Installation instantanée</p>
          </div>
        </div>
        <button onClick={closePrompt} style={{ background: 'var(--background)', border: 'none', color: 'var(--text-light)', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex' }}><X size={18} /></button>
      </div>

      {isIOS ? (
        <div style={{ fontSize: '0.85rem', color: 'var(--text)', background: 'var(--background)', padding: '15px', borderRadius: '16px', lineHeight: '1.5', border: '1px solid var(--border)', fontWeight: '600' }}>
          Pour installer : appuyez sur <Share size={18} style={{ verticalAlign: 'middle', margin: '0 4px', color: 'var(--primary)' }} /> puis <strong style={{ color: 'var(--primary)' }}>"Sur l'écran d'accueil"</strong>.
        </div>
      ) : (
        <button 
          onClick={handleInstallClick}
          style={{ 
            background: 'var(--primary)', 
            color: 'white', 
            padding: '16px', 
            borderRadius: '18px', 
            fontWeight: '900', 
            border: 'none',
            fontSize: '0.95rem',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-premium)',
            transition: 'transform 0.2s active'
          }}
        >
          Installer maintenant
        </button>
      )}

      <style>{`
        @keyframes pwaSlideUp {
          from { transform: translate(-50%, 120%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default InstallPWA;
