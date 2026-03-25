import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, Settings, User, Mail, Lock, Save, CheckCircle, HelpCircle, Eye, X } from 'lucide-react';
import axios from '../services/api';

const Section = ({ title, field, children, onSave, messages, saving }) => (
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

export default function SettingsPage() {
    const { user, updateUser } = useAuth();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [saving, setSaving] = useState(null); // 'name' | 'email' | 'password'
    const [messages, setMessages] = useState({});
    const [myTickets, setMyTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [loadingTickets, setLoadingTickets] = useState(true);

    useEffect(() => {
        if (user) setForm(f => ({ ...f, name: user.name, email: user.email }));
        fetchMyTickets();
    }, [user]);

    const fetchMyTickets = async () => {
        try {
            const { data } = await axios.get('/help/my-tickets');
            setMyTickets(data);
        } catch (err) {
            console.error('Failed to fetch tickets:', err);
        } finally {
            setLoadingTickets(false);
        }
    };

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
                <Section title="Display Name" field="name" onSave={() => handleSave('name')} messages={messages} saving={saving}>
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
                <Section title="Email Address" field="email" onSave={() => handleSave('email')} messages={messages} saving={saving}>
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
                <Section title="Change Password" field="password" onSave={() => handleSave('password')} messages={messages} saving={saving}>
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

                {/* My Help Tickets */}
                <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <HelpCircle size={18} color="var(--primary)" /> My Help Tickets
                        </h3>
                        <Link to="/help" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                            Submit New Request
                        </Link>
                    </div>

                    {loadingTickets ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading tickets...</div>
                    ) : myTickets.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                            <HelpCircle size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                            <p>No help requests yet.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {myTickets.map(ticket => {
                                const statusColors = {
                                    pending: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b' },
                                    'in-progress': { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
                                    resolved: { bg: 'rgba(34,197,94,0.1)', color: '#22c55e' },
                                    closed: { bg: 'rgba(107,114,128,0.1)', color: '#6b7280' }
                                };
                                const statusStyle = statusColors[ticket.status] || statusColors.pending;

                                return (
                                    <div
                                        key={ticket._id}
                                        style={{
                                            padding: '1.25rem',
                                            background: 'rgba(0,0,0,0.2)',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border)',
                                            cursor: 'pointer',
                                            transition: 'var(--transition)'
                                        }}
                                        onClick={() => setSelectedTicket(ticket)}
                                        onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                        onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                                    <span style={{ 
                                                        fontSize: '0.75rem', 
                                                        fontWeight: 700, 
                                                        color: 'var(--primary)',
                                                        background: 'rgba(99,102,241,0.1)',
                                                        padding: '0.25rem 0.6rem',
                                                        borderRadius: '4px'
                                                    }}>
                                                        {ticket.ticketNumber}
                                                    </span>
                                                    <span
                                                        style={{
                                                            background: statusStyle.bg,
                                                            color: statusStyle.color,
                                                            padding: '0.25rem 0.6rem',
                                                            borderRadius: '4px',
                                                            fontSize: '0.7rem',
                                                            fontWeight: 600,
                                                            textTransform: 'capitalize'
                                                        }}
                                                    >
                                                        {ticket.status.replace('-', ' ')}
                                                    </span>
                                                </div>
                                                <div style={{ fontWeight: 600, marginBottom: '0.25rem', fontSize: '0.95rem' }}>{ticket.subject}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                    Submitted: {new Date(ticket.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <Eye size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
                                        </div>
                                        {ticket.adminNotes && (
                                            <div style={{ 
                                                fontSize: '0.75rem', 
                                                color: '#22c55e',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                marginTop: '0.5rem',
                                                paddingTop: '0.75rem',
                                                borderTop: '1px solid var(--border)'
                                            }}>
                                                <CheckCircle size={14} /> Admin has responded
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Ticket Detail Modal */}
            {selectedTicket && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '1rem'
                    }}
                    onClick={() => setSelectedTicket(null)}
                >
                    <div
                        className="glass"
                        style={{
                            maxWidth: '600px',
                            width: '100%',
                            maxHeight: '80vh',
                            overflowY: 'auto',
                            padding: '2rem',
                            borderRadius: '16px'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Ticket Details</h3>
                                <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, marginTop: '0.25rem' }}>
                                    {selectedTicket.ticketNumber}
                                </div>
                            </div>
                            <button
                                className="btn btn-ghost"
                                style={{ padding: '0.5rem' }}
                                onClick={() => setSelectedTicket(null)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Subject</div>
                                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{selectedTicket.subject}</div>
                            </div>

                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Status</div>
                                <span
                                    style={{
                                        background: selectedTicket.status === 'resolved' ? 'rgba(34,197,94,0.1)' : selectedTicket.status === 'in-progress' ? 'rgba(59,130,246,0.1)' : 'rgba(245,158,11,0.1)',
                                        color: selectedTicket.status === 'resolved' ? '#22c55e' : selectedTicket.status === 'in-progress' ? '#3b82f6' : '#f59e0b',
                                        padding: '0.4rem 1rem',
                                        borderRadius: '8px',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        textTransform: 'capitalize',
                                        display: 'inline-block'
                                    }}
                                >
                                    {selectedTicket.status.replace('-', ' ')}
                                </span>
                            </div>

                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Your Message</div>
                                <div
                                    style={{
                                        padding: '1rem',
                                        background: 'rgba(0,0,0,0.2)',
                                        borderRadius: '8px',
                                        lineHeight: 1.6,
                                        whiteSpace: 'pre-wrap'
                                    }}
                                >
                                    {selectedTicket.message}
                                </div>
                            </div>

                            {selectedTicket.adminNotes && (
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Admin Response</div>
                                    <div
                                        style={{
                                            padding: '1rem',
                                            background: 'rgba(99,102,241,0.1)',
                                            border: '1px solid rgba(99,102,241,0.3)',
                                            borderRadius: '8px',
                                            lineHeight: 1.6,
                                            whiteSpace: 'pre-wrap'
                                        }}
                                    >
                                        {selectedTicket.adminNotes}
                                    </div>
                                </div>
                            )}

                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                                <div>Submitted: {new Date(selectedTicket.createdAt).toLocaleString()}</div>
                                <div>Last Updated: {new Date(selectedTicket.updatedAt).toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
