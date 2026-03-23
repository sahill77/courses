import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogOut, LayoutDashboard, Settings, Sparkles, Sun, Moon, Mail, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
    setProfileOpen(false);
  };

  return (
    <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 100, marginBottom: '2rem' }}>
      <div className="container" style={{ minHeight: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 1rem' }}>
        <Link to="/" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: 'clamp(0.9rem, 3.5vw, 1.25rem)', color: 'var(--primary)', padding: '0.5rem 0', maxWidth: '60%', minWidth: '120px' }}>
          <BookOpen style={{ flexShrink: 0, width: 'clamp(18px, 4vw, 24px)' }} /> <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>SparksStream</span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button className="mobile-only btn btn-ghost" onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ padding: '0.5rem' }}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop and Mobile Menu */}
        <div
          className={`${isMenuOpen ? 'mobile-menu-active' : 'hide-on-mobile'}`}
          style={isMenuOpen ? {
            position: 'absolute', top: '70px', left: 0, right: 0,
            background: 'var(--bg-card)', backdropFilter: 'blur(12px)',
            padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem',
            borderBottom: '1px solid var(--border)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
          } : { display: 'flex', gap: '1rem', alignItems: 'center' }}
        >
          <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="btn btn-ghost" style={{ fontSize: '0.8rem', color: 'var(--text-main)', gap: '0.5rem', width: isMenuOpen ? '100%' : 'auto' }}>
            <Mail size={16} color="var(--primary)" /> Contact Us
          </Link>
          <Link to="/courses" onClick={() => setIsMenuOpen(false)} className="btn btn-ghost" style={{ fontSize: '0.8rem', color: 'var(--text-main)', gap: '0.5rem', width: isMenuOpen ? '100%' : 'auto' }}>
            <Sparkles size={16} color="var(--primary)" /> Explore Courses
          </Link>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', width: isMenuOpen ? '100%' : 'auto' }}>
            <button
              onClick={() => { toggleTheme(); if (isMenuOpen) setIsMenuOpen(false); }}
              className="btn btn-ghost"
              style={{ padding: '0.5rem', borderRadius: '10px', color: 'var(--text-main)', flex: isMenuOpen ? 1 : 'none' }}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />} {isMenuOpen && 'Toggle Theme'}
            </button>

            {user ? (
              <div style={{ display: 'flex', flexDirection: isMenuOpen ? 'column' : 'row', gap: '0.5rem', alignItems: isMenuOpen ? 'stretch' : 'center', width: isMenuOpen ? '100%' : 'auto' }}>
                {user.role === 'admin' ? (
                  <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '0.5rem' }}>
                    <Settings size={16} /> <span>Admin</span>
                  </Link>
                ) : (
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '0.5rem' }}>
                    <LayoutDashboard size={16} /> <span>Learning</span>
                  </Link>
                )}

                {/* Profile Avatar + Dropdown */}
                <div style={{ borderLeft: isMenuOpen ? 'none' : '1px solid var(--border)', paddingLeft: isMenuOpen ? '0' : '0.75rem', position: 'relative' }} ref={dropdownRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', fontWeight: 700, fontSize: '0.9rem', border: 'none', outline: profileOpen ? '2px solid var(--primary)' : 'none', outlineOffset: '2px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'var(--transition)' }}
                    title={user.name}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </button>

                  {profileOpen && (
                    <div style={{
                      position: isMenuOpen ? 'relative' : 'absolute', 
                      top: isMenuOpen ? '0.5rem' : '50px', 
                      right: isMenuOpen ? '0' : '0',
                      width: isMenuOpen ? '100%' : 'min(260px, calc(100vw - 2rem))',
                      background: 'var(--bg-card)', border: '1px solid var(--border)',
                      borderRadius: '14px', boxShadow: '0 12px 36px rgba(0,0,0,0.25)',
                      backdropFilter: 'blur(12px)', zIndex: 999, overflow: 'hidden',
                      marginTop: isMenuOpen ? '0.5rem' : '0'
                    }}>
                      {/* User Info Header */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', background: 'rgba(99,102,241,0.05)' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', fontWeight: 700, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div style={{ padding: '0.5rem' }}>
                        <Link
                          to="/settings"
                          onClick={() => { setProfileOpen(false); setIsMenuOpen(false); }}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.75rem', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.875rem', fontWeight: 500, transition: 'var(--transition)' }}
                          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(99,102,241,0.08)'}
                          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <Settings size={16} color="var(--primary)" /> Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.75rem', borderRadius: '8px', background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, transition: 'var(--transition)' }}
                          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem', flex: isMenuOpen ? 1 : 'none' }}>
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem', flex: 1, textAlign: 'center' }}>Login</Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem', flex: 1, textAlign: 'center' }}>Join</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
