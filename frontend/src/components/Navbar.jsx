import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogOut, LayoutDashboard, Settings, Sparkles, Sun, Moon, Mail, Menu, X, User, Check, Pencil } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import axios from '../services/api';

export default function Navbar() {
  const { user, logout, updateUser } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editingField, setEditingField] = useState(null); // 'email' | 'password'
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
        setEditing(false);
        setSettingsOpen(false);
        setEditingField(null);
        setSaveMsg('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveField = async (field) => {
    const value = field === 'email' ? editEmail.trim() : editPassword;
    if (!value || (field === 'email' && value === user.email)) { setEditingField(null); return; }
    setSaving(true);
    try {
      const { data } = await axios.put('/auth/profile', { [field]: value });
      updateUser(data.user);
      setSaveMsg(`${field.charAt(0).toUpperCase() + field.slice(1)} updated!`);
      setEditingField(null);
      if (field === 'password') setEditPassword('');
      setTimeout(() => setSaveMsg(''), 2000);
    } catch (err) {
      setSaveMsg('Failed to update.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveName = async () => {
    if (!editName.trim() || editName === user.name) { setEditing(false); return; }
    setSaving(true);
    try {
      const { data } = await axios.put('/auth/profile', { name: editName.trim() });
      updateUser(data.user);
      setSaveMsg('Name updated!');
      setEditing(false);
      setTimeout(() => setSaveMsg(''), 2000);
    } catch (err) {
      setSaveMsg('Failed to update.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
    setProfileOpen(false);
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
              <div style={{ display: 'flex', flexDirection: isMenuOpen ? 'column' : 'row', gap: '0.5rem', alignItems: isMenuOpen ? 'stretch' : 'center', width: isMenuOpen ? '100%' : 'auto' }} ref={dropdownRef}>
                {user.role === 'admin' ? (
                  <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '0.5rem' }}>
                    <Settings size={16} /> <span>Admin</span>
                  </Link>
                ) : (
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '0.5rem' }}>
                    <LayoutDashboard size={16} /> <span>Learning</span>
                  </Link>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderLeft: isMenuOpen ? 'none' : '1px solid var(--border)', paddingLeft: isMenuOpen ? '0' : '0.75rem', position: isMenuOpen ? 'static' : 'relative' }} ref={dropdownRef}>
                  {/* Profile Avatar Button */}
                  <button
                    onClick={() => { setProfileOpen(!profileOpen); setEditing(false); setSaveMsg(''); setEditName(user.name); }}
                    style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', fontWeight: 700, fontSize: '0.9rem', border: '2px solid transparent', outline: profileOpen ? '2px solid var(--primary)' : 'none', outlineOffset: '2px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'var(--transition)' }}
                    title={user.name}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </button>

                  {/* Profile Dropdown */}
                  {profileOpen && (
                    <div style={isMenuOpen ? {
                      width: '100%', marginTop: '0.5rem',
                      background: 'var(--bg-card)', border: '1px solid var(--border)',
                      borderRadius: '12px', padding: '1rem',
                    } : {
                      position: 'fixed', top: '74px', right: '1rem',
                      width: 'min(270px, calc(100vw - 2rem))',
                      background: 'var(--bg-card)', border: '1px solid var(--border)',
                      borderRadius: '14px', boxShadow: '0 12px 36px rgba(0,0,0,0.25)',
                      backdropFilter: 'blur(12px)', zIndex: 999, padding: '1.25rem',
                      maxHeight: 'calc(100vh - 90px)', overflowY: 'auto'
                    }}>
                      {/* User Info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                        </div>
                      </div>

                      {/* Edit Name */}
                      <div style={{ marginBottom: '0.75rem' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>DISPLAY NAME</div>
                        {editing ? (
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <input
                              autoFocus
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') setEditing(false); }}
                              style={{ flex: 1, padding: '0.4rem 0.6rem', borderRadius: '6px', background: 'rgba(0,0,0,0.1)', border: '1px solid var(--primary)', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none' }}
                            />
                            <button onClick={handleSaveName} disabled={saving} style={{ padding: '0.4rem', borderRadius: '6px', background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                              <Check size={14} />
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.6rem', borderRadius: '6px', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{user.name}</span>
                            <button onClick={() => { setEditing(true); setEditName(user.name); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: '0' }}>
                              <Pencil size={13} />
                            </button>
                          </div>
                        )}
                        {saveMsg && <div style={{ fontSize: '0.75rem', color: saveMsg.includes('updated') ? '#22c55e' : '#ef4444', marginTop: '0.3rem' }}>{saveMsg}</div>}
                      </div>

                      {/* Settings Toggle */}
                      <button
                        onClick={() => { setSettingsOpen(!settingsOpen); setEditingField(null); }}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.6rem', borderRadius: '8px', background: settingsOpen ? 'rgba(99,102,241,0.08)' : 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, marginBottom: settingsOpen ? '0.75rem' : '0.75rem' }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Settings size={14} /> Settings</span>
                        <span style={{ fontSize: '0.7rem' }}>{settingsOpen ? '▲' : '▼'}</span>
                      </button>

                      {/* Email & Password Fields */}
                      {settingsOpen && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '0.75rem' }}>
                          {/* Email */}
                          <div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontWeight: 600 }}>EMAIL</div>
                            {editingField === 'email' ? (
                              <div style={{ display: 'flex', gap: '0.4rem' }}>
                                <input autoFocus type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)}
                                  onKeyDown={(e) => { if (e.key === 'Enter') handleSaveField('email'); if (e.key === 'Escape') setEditingField(null); }}
                                  style={{ flex: 1, padding: '0.4rem 0.6rem', borderRadius: '6px', background: 'rgba(0,0,0,0.1)', border: '1px solid var(--primary)', color: 'var(--text-main)', fontSize: '0.8rem', outline: 'none' }}
                                />
                                <button onClick={() => handleSaveField('email')} disabled={saving} style={{ padding: '0.4rem', borderRadius: '6px', background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Check size={13} /></button>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.6rem', borderRadius: '6px', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</span>
                                <button onClick={() => { setEditingField('email'); setEditEmail(user.email); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: '0', flexShrink: 0 }}><Pencil size={12} /></button>
                              </div>
                            )}
                          </div>

                          {/* Password */}
                          <div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontWeight: 600 }}>PASSWORD</div>
                            {editingField === 'password' ? (
                              <div style={{ display: 'flex', gap: '0.4rem' }}>
                                <input autoFocus type="password" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} placeholder="New password"
                                  onKeyDown={(e) => { if (e.key === 'Enter') handleSaveField('password'); if (e.key === 'Escape') setEditingField(null); }}
                                  style={{ flex: 1, padding: '0.4rem 0.6rem', borderRadius: '6px', background: 'rgba(0,0,0,0.1)', border: '1px solid var(--primary)', color: 'var(--text-main)', fontSize: '0.8rem', outline: 'none' }}
                                />
                                <button onClick={() => handleSaveField('password')} disabled={saving} style={{ padding: '0.4rem', borderRadius: '6px', background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Check size={13} /></button>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.6rem', borderRadius: '6px', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>••••••••</span>
                                <button onClick={() => { setEditingField('password'); setEditPassword(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: '0', flexShrink: 0 }}><Pencil size={12} /></button>
                              </div>
                            )}
                          </div>

                          {saveMsg && <div style={{ fontSize: '0.75rem', color: saveMsg.includes('updated') ? '#22c55e' : '#ef4444' }}>{saveMsg}</div>}
                        </div>
                      )}

                      {/* Logout */}
                      <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                        <LogOut size={15} /> Logout
                      </button>
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
