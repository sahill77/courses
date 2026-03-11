import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogOut, LayoutDashboard, Settings, Sparkles, Sun, Moon, Mail, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  return (
    <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 100, marginBottom: '2rem' }}>
      <div className="container" style={{ minHeight: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 1rem' }}>
        <Link to="/" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: 'clamp(1rem, 4vw, 1.25rem)', color: 'var(--primary)', padding: '0.5rem 0', maxWidth: '70%' }}>
          <BookOpen style={{ flexShrink: 0 }} /> <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>SparksStream</span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-only btn btn-ghost"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ padding: '0.5rem' }}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop and Mobile Menu */}
        <div
          className={`${isMenuOpen ? 'mobile-menu-active' : 'hide-on-mobile'}`}
          style={isMenuOpen ? {
            position: 'absolute',
            top: '70px',
            left: 0,
            right: 0,
            background: 'var(--bg-card)',
            backdropFilter: 'blur(12px)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            borderBottom: '1px solid var(--border)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          } : {
            display: 'flex',
            gap: '1rem',
            alignItems: 'center'
          }}
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
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />} {isMenuOpen && "Toggle Theme"}
            </button>

            {user ? (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flex: isMenuOpen ? 2 : 'none', justifyContent: isMenuOpen ? 'flex-end' : 'flex-start' }}>
                {user.role === 'admin' ? (
                  <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '0.5rem' }}>
                    <Settings size={16} /> <span>Admin</span>
                  </Link>
                ) : (
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '0.5rem' }}>
                    <LayoutDashboard size={16} /> <span>Learning</span>
                  </Link>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderLeft: '1px solid var(--border)', paddingLeft: '0.5rem' }}>
                  {!isMenuOpen && <span className="hide-on-mobile" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.name}</span>}
                  <button onClick={handleLogout} className="btn btn-ghost" style={{ padding: '0.4rem', borderRadius: '50%' }}>
                    <LogOut size={16} />
                  </button>
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
