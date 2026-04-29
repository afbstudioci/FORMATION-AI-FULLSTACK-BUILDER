import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, GraduationCap, LayoutDashboard } from 'lucide-react';
import { theme } from '../theme';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: theme.colors.background }}>
      <nav style={{ 
        background: theme.colors.surface, 
        padding: '0.75rem 2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        boxShadow: theme.shadows.soft,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: `1px solid ${theme.colors.border}`
      }}>
        <div 
          onClick={() => navigate('/')} 
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{ 
            background: theme.colors.primary, 
            padding: '8px', 
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <GraduationCap color="white" size={24} />
          </div>
          <h1 style={{ fontSize: '1.25rem', color: theme.colors.text, fontWeight: '800', letterSpacing: '-0.5px' }}>
            LMS<span style={{ color: theme.colors.primary }}>EXAM</span>
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {user?.role === 'admin' && (
            <button 
              onClick={() => navigate('/admin')}
              style={{
                background: 'transparent',
                color: theme.colors.primary,
                fontWeight: '600',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <LayoutDashboard size={18} />
              Panel Admin
            </button>
          )}

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            padding: '6px 12px',
            background: theme.colors.background,
            borderRadius: theme.borderRadius.medium
          }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              background: theme.colors.secondary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.8rem',
              fontWeight: 'bold'
            }}>
              {user?.fullname?.charAt(0).toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: theme.colors.text }}>{user?.fullname}</span>
              <span style={{ fontSize: '0.7rem', color: theme.colors.textLight }}>{user?.matricule}</span>
            </div>
          </div>

          <button 
            onClick={logout}
            style={{ 
              background: 'rgba(214, 48, 49, 0.1)', 
              color: theme.colors.error, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '10px',
              borderRadius: '10px',
              transition: 'all 0.2s ease'
            }}
            title="Se deconnecter"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <main style={{ flex: 1, padding: '2.5rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
