import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, Settings, User, Mail, Lock, Save, CheckCircle } from 'lucide-react';
import axios from '../services/api';

export default function SettingsPage() {
    const { user, updateUser } = useAuth();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [saving, setSaving] = useState(null); // 'name' | 'email' | 'password'
    const [messages, setMessages] = useState({});

    useEffect(() => {
        if (user) setForm(f => ({ ...f, name: user.name, email: user.email }));
    }, [user]);

    const setMsg = (field, type, text) => {
        setMessages(m => ({ ...m, [field]: { type, text } }));
        setTimeout(() => setMessages(m => ({ ...m, [field]: null })), 3000);
    };

    const handleSave = async (field) => {
        if (field === 'name' && !form.name.trim()) return;
        if (field === 'email' && !form.email.trim()) return;
        if (field === 'password') {
            if (!form.password) return;
            if (form.password.length < 6) { setMsg('password', 'error', 'Min 6 characters required.'); return; }
            if (form.password !== form.confirmPassword) { setMsg('password', 'error', 'Passwords do not match.'); return; }
        }

        setSaving(field);
        try {
            const payload = field === 'password' ? { password: form.password } : { [field]: form[field] };
            const { data } = await axios.put('/auth/profile', payload);
            updateUser(data.user);
            setMsg(field, 'success', `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`);
            if (field === 'password') setForm(f => ({ ...f, password: '', confirmPassword: '' }));
        } catch (err) {
            setMsg(field, 'error', err.response?.data?.error || 'Update failed.');
        } finally {
            setSaving(null);
        }
    };

    const inputStyle = {
        width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.75rem',
        borderRadius: '8px', background: 'rgba(0,0,0,0.05)',
        border: '1px solid var(--border)', color: 'var(--text-main)',
        fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s'
    };
    const iconStyle = { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' };

    const Section = ({ title, field, children, onSave }) => (
        <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{title}</h3>
                {messages[field] && (
                    <span style={{ fontSize: '0.8rem', color: messages[field].type === 'success' ? '#22c55e' : '#ef4444', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        {messages[field].type === 'success' && <CheckCircle size={14} />}
                        {messages[field].text}
                    </span>
                )}
            </div>
            {children}
            <button
                onClick={onSave}
                disabled={saving === field}
                className="btn btn-primary"
                style={{ marginTop: '1rem', padding: '0.6rem 1.5rem', fontSize: '0.9rem', gap: '0.5rem' }}
            >
                <Save size={15} /> {saving === field ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
    );

    return (
        <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '1.5rem auto' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}
                onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
                onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
                <ChevronLeft size={16} /> Back to Home
            </Link>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', fontWeight: 800, fontSize: '1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Settings size={22} color="var(--primary)" /> Account Settings
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage your profile information</p>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Name */}
                <Section title="Display Name" field="name" onSave={() => handleSave('name')}>
                    <div style={{ position: 'relative' }}>
                        <User size={17} style={iconStyle} />
                        <input
                            type="text" value={form.name}
                            onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                            style={inputStyle}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                        />
                    </div>
                </Section>

                {/* Email */}
                <Section title="Email Address" field="email" onSave={() => handleSave('email')}>
                    <div style={{ position: 'relative' }}>
                        <Mail size={17} style={iconStyle} />
                        <input
                            type="email" value={form.email}
                            onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                            style={inputStyle}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                        />
                    </div>
                </Section>

                {/* Password */}
                <Section title="Change Password" field="password" onSave={() => handleSave('password')}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Lock size={17} style={iconStyle} />
                            <input
                                type="password" placeholder="New Password" value={form.password}
                                onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                                style={inputStyle}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                            />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Lock size={17} style={iconStyle} />
                            <input
                                type="password" placeholder="Confirm New Password" value={form.confirmPassword}
                                onChange={(e) => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                                style={inputStyle}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                            />
                        </div>
                    </div>
                </Section>
            </div>
        </div>
    );
}
