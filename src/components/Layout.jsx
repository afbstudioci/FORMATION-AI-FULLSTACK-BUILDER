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
        padding: '0.75rem 1rem', 
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
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        >
          <div style={{ 
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <h1 style={{ fontSize: '1.1rem', color: theme.colors.text, fontWeight: '900', letterSpacing: '-0.5px' }}>
            AFB<span style={{ color: theme.colors.primary }}>EXAM</span>
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {user?.role === 'admin' && (
            <button 
              onClick={() => navigate('/admin')}
              style={{
                background: 'transparent',
                color: theme.colors.primary,
                fontWeight: '700',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <LayoutDashboard size={18} />
              <span className="hide-mobile">Admin</span>
            </button>
          )}

          <div 
            onClick={() => navigate('/profile')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              padding: '4px 8px',
              background: theme.colors.background,
              borderRadius: theme.borderRadius.medium,
              cursor: 'pointer'
            }}
          >
            <div style={{ 
              width: '30px', 
              height: '30px', 
              borderRadius: '50%', 
              background: theme.colors.secondary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              overflow: 'hidden'
            }}>
              {user?.profilePic ? (
                <img src={user.profilePic} alt="P" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                user?.fullname?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="hide-mobile" style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: theme.colors.text }}>{user?.fullname?.split(' ')[0]}</span>
            </div>
          </div>

          <button 
            onClick={logout}
            style={{ 
              background: 'rgba(214, 48, 49, 0.1)', 
              color: theme.colors.error, 
              padding: '8px', 
              borderRadius: '8px'
            }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      <main className="main-container" style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
