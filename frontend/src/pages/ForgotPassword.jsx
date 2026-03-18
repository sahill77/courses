import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Mail, CheckCircle } from 'lucide-react';
import axios from '../services/api';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await axios.post('/auth/forgot-password', { email });
            setSent(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '400px', margin: '4rem auto' }}>
            <div className="glass" style={{ padding: '2rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <KeyRound color="var(--primary)" /> Forgot Password
                </h2>

                {sent ? (
                    <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                        <CheckCircle size={48} color="#22c55e" style={{ margin: '0 auto 1rem' }} />
                        <h3 style={{ marginBottom: '0.5rem' }}>Check your email!</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            We sent a password reset link to <strong>{email}</strong>. It expires in 15 minutes.
                        </p>
                        <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Back to Login</Link>
                    </div>
                ) : (
                    <>
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            Enter your registered email and we'll send you a reset link.
                        </p>
                        {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="email" placeholder="Email Address" required value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent: 'center' }}>
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Remember your password? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
