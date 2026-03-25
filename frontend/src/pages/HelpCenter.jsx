import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../services/api';
import { HelpCircle, Send, CheckCircle } from 'lucide-react';

export default function HelpCenter() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [ticketNumber, setTicketNumber] = useState('');
    const [error, setError] = useState('');
    
    // Update form when user data loads
    React.useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        // Client-side validation
        if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
            setError('All fields are required');
            setLoading(false);
            return;
        }
        
        try {
            console.log('Submitting help ticket:', formData);
            const { data } = await axios.post('/help', formData);
            console.log('Ticket created:', data);
            setTicketNumber(data.ticket.ticketNumber);
            setSuccess(true);
            setFormData({ name: user?.name || '', email: user?.email || '', subject: '', message: '' });
            setTimeout(() => {
                navigate('/settings');
            }, 4000);
        } catch (err) {
            console.error('Help ticket error:', err);
            console.error('Error response:', err.response?.data);
            const errorMsg = err.response?.data?.error || err.message || 'Failed to submit request';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
                <div className="glass" style={{ padding: '3rem 2rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <CheckCircle size={64} color="#22c55e" style={{ margin: '0 auto' }} />
                    </div>
                    <h2 style={{ marginBottom: '1rem' }}>Request Submitted!</h2>
                    <div style={{ 
                        background: 'rgba(99,102,241,0.1)', 
                        border: '1px solid var(--primary)', 
                        padding: '1rem', 
                        borderRadius: '8px', 
                        marginBottom: '1.5rem' 
                    }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Your Ticket Number</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>{ticketNumber}</div>
                    </div>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        Thank you for reaching out. Our support team will review your request and get back to you soon. 
                        You can track your ticket status in your profile settings.
                    </p>
                    <button onClick={() => navigate('/settings')} className="btn btn-primary">
                        View My Tickets
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in" style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div className="glass" style={{ padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <HelpCircle size={48} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Help Center</h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Need assistance? Submit your request and our team will help you out.
                    </p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                                Your Name
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                            Subject
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
                            placeholder="What do you need help with?"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                            Message
                        </label>
                        <textarea
                            required
                            rows="6"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: 'var(--text-main)', resize: 'vertical' }}
                            placeholder="Please describe your issue or question in detail..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ marginTop: '1rem', justifyContent: 'center', gap: '0.75rem', opacity: loading ? 0.6 : 1 }}
                    >
                        <Send size={18} /> {loading ? 'Submitting...' : 'Submit Request'}
                    </button>
                </form>
            </div>
        </div>
    );
}
