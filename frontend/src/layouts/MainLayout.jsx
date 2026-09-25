import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileSearch, ShieldAlert, FileWarning, Search, Bell, User, Settings, LogOut, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { config } = useConfig();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    { name: 'New Analysis', path: '/app/new-analysis', icon: FileSearch },
    { name: 'Threats', path: '/app/threats', icon: ShieldAlert },
    { name: 'Quarantine', path: '/app/quarantine', icon: FileWarning },
  ];

  if (user?.role === 'admin') {
    navItems.push({ name: 'SQL Database', path: '/app/database', icon: Database });
    navItems.push({ name: 'Settings (CMS)', path: '/app/settings', icon: Settings });
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'transparent' }}>
      {/* Sidebar */}
      <aside style={{
        width: '250px',
        backgroundColor: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <h2 className="brand-font" style={{ color: 'var(--primary-color)', fontSize: '1.25rem', fontWeight: 700 }}>
            {config.brandName}
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{config.tagline.split('.')[0] + '.'}</p>
        </div>
        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem 1.5rem',
                  color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                  borderRight: isActive ? '3px solid var(--primary-color)' : '3px solid transparent',
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                <Icon size={18} style={{ marginRight: '0.75rem' }} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Header */}
        <header style={{
          height: '64px',
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', width: '300px', backgroundColor: 'var(--bg-primary)', padding: '0.5rem', borderRadius: '0.5rem' }}>
            <Search size={16} color="var(--text-secondary)" style={{ marginRight: '0.5rem' }} />
            <input 
              type="text" 
              placeholder="Search analysis..." 
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.875rem' }} 
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative' }}>
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => { setShowNotifications(!showNotifications); setShowDropdown(false); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <Bell size={20} />
                <div style={{ position: 'absolute', top: '0', right: '0', width: '8px', height: '8px', backgroundColor: 'var(--danger)', borderRadius: '50%' }} />
              </button>
              
              {showNotifications && (
                <div className="card" style={{ position: 'absolute', top: '100%', right: '-10px', marginTop: '1rem', padding: '1rem', width: '280px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '0.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                  <h4 style={{ margin: 0, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Notifications</h4>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', padding: '0.5rem 0' }}>
                    <div style={{ color: 'var(--success)', fontWeight: 500, marginBottom: '0.25rem' }}>System Update</div>
                    Deep Tracer AI engine has been updated with Deep Sector Recovery v1.2.
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', padding: '0.5rem 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ color: 'var(--warning)', fontWeight: 500, marginBottom: '0.25rem' }}>Scan Alert</div>
                    High volume of duplicates detected in recent sessions.
                  </div>
                </div>
              )}
            </div>

            <div 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
              onClick={() => { setShowDropdown(!showDropdown); setShowNotifications(false); }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: user?.role === 'admin' ? 'var(--primary-color)' : 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: user?.role === 'admin' ? 'white' : 'var(--primary-color)' }}>
                {user?.role === 'admin' ? <ShieldAlert size={16} /> : <User size={16} />}
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{user?.name || (user?.role === 'admin' ? 'Admin' : 'User')}</span>
            </div>
            
            {showDropdown && (
              <div className="card" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', padding: '0.5rem', width: '150px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <button 
                  onClick={handleLogout}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', borderRadius: '0.25rem', color: 'var(--danger)' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-primary)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
