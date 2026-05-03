import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import { useGlobalSocket } from '../hooks/useGlobalSocket';
import { LogOut, LayoutDashboard, Sun, Moon } from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { addNotification } = useNotification();
  const { notification, clearNotification } = useGlobalSocket();

  // Socket notifications
  React.useEffect(() => {
    if (notification) {
      addNotification(notification, 'success');
      clearNotification();
    }
  }, [notification, addNotification, clearNotification]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--background)' }}>

      <nav style={{
        background: 'var(--glass)',
        backdropFilter: 'blur(12px)',
        padding: '0.6rem 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: 'var(--shadow-soft)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderBottom: '1px solid var(--border)'
      }}>
        <div
          onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            background: 'var(--primary)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '900',
            fontSize: '0.8rem'
          }}>
            AFB
          </div>
          <h1 style={{ fontSize: '1rem', color: 'var(--text)', fontWeight: '900', letterSpacing: '-0.5px' }} className="hide-mobile">
            AFB<span style={{ color: 'var(--primary)' }}>EXAM</span>
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          <button
            onClick={toggleTheme}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              padding: '8px',
              borderRadius: '12px',
              color: 'var(--text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {user?.role === 'admin' && (
            <button
              onClick={() => navigate('/admin')}
              style={{
                background: 'rgba(9, 132, 227, 0.1)',
                color: 'var(--primary)',
                padding: '8px 12px',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <LayoutDashboard size={18} />
              <span className="hide-mobile">Dashboard</span>
            </button>
          )}

          <div
            onClick={() => navigate('/profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '4px',
              background: 'var(--surface)',
              borderRadius: '14px',
              border: '1px solid var(--border)',
              cursor: 'pointer'
            }}
          >
            <img
              src={user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullname || 'User')}&background=random&color=fff`}
              alt="Profile"
              style={{ width: '32px', height: '32px', borderRadius: '10px', objectFit: 'cover' }}
            />
            <div className="hide-mobile" style={{ paddingRight: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text)', display: 'block' }}>{user?.fullname?.split(' ')[0]}</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-light)', fontWeight: '600' }}>{user?.role?.toUpperCase()}</span>
            </div>
          </div>

          <button
            onClick={logout}
            style={{
              background: 'rgba(214, 48, 49, 0.1)',
              color: 'var(--error)',
              padding: '8px',
              borderRadius: '12px',
              border: 'none'
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