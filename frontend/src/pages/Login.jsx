import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/Toast';
import { LogIn, Mail, Lock } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const loggedInUser = await login(email, password);
            showToast.loginSuccess(loggedInUser.name);
            if (loggedInUser.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            const message = err.response?.data?.error || err.message || 'Login failed';
            showToast.loginError(message);
            setError(typeof message === 'object' ? JSON.stringify(message) : String(message));
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '400px', margin: '2rem auto', padding: '0 0.5rem' }}>
            <div className="glass" style={{ padding: '2rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <LogIn color="var(--primary)" /> SparksStream
                </h2>
                {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="email" placeholder="Email Address" required
                            style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="password" placeholder="Password" required
                            style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }}>Login</button>
                </form>
                <p style={{ textAlign: 'right', marginTop: '0.75rem', fontSize: '0.85rem' }}>
                    <Link to="/forgot-password" style={{ color: 'var(--primary)' }}>Forgot password?</Link>
                </p>
                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary)' }}>Register</Link>
                </p>
            </div>
        </div>
    );
}
