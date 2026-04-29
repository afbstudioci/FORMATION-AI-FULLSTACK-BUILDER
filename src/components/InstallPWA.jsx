import React, { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';
import { theme } from '../theme';

const InstallPWA = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detecter iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(ios);

    // Ecouter l'evenement d'installation pour Android/Windows
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    });

    // Pour iOS, on affiche le prompt apres un petit delai si non installe
    if (ios && !window.navigator.standalone) {
      const hasSeenPrompt = localStorage.getItem('pwaPromptSeen');
      if (!hasSeenPrompt) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
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
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 999,
      width: '90%',
      maxWidth: '400px',
      background: 'white',
      padding: '20px',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
      border: `1px solid ${theme.colors.border}`,
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      animation: 'slideUp 0.5s ease-out'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ background: theme.colors.primary, padding: '10px', borderRadius: '12px' }}>
            <Download color="white" size={24} />
          </div>
          <div>
            <h4 style={{ fontWeight: '800', margin: 0 }}>Installer AFB EXAM</h4>
            <p style={{ fontSize: '0.85rem', color: theme.colors.textLight, margin: '2px 0 0' }}>Accédez plus vite à vos examens !</p>
          </div>
        </div>
        <button onClick={closePrompt} style={{ background: 'none', border: 'none', color: theme.colors.textLight }}><X size={20} /></button>
      </div>

      {isIOS ? (
        <div style={{ fontSize: '0.9rem', color: theme.colors.text, background: '#f8f9fa', padding: '12px', borderRadius: '10px', lineHeight: '1.4' }}>
          Appuyez sur <Share size={16} style={{ verticalAlign: 'middle', display: 'inline' }} /> puis sur <strong>"Sur l'écran d'accueil"</strong> pour installer l'application.
        </div>
      ) : (
        <button 
          onClick={handleInstallClick}
          style={{ 
            background: theme.colors.primary, 
            color: 'white', 
            padding: '12px', 
            borderRadius: '12px', 
            fontWeight: '700', 
            border: 'none',
            boxShadow: `0 8px 15px ${theme.colors.primary}30`
          }}
        >
          Installer l'App
        </button>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translate(-50%, 100px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default InstallPWA;
