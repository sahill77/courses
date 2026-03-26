import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { KeyRound, Lock, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import axios from '../services/api';

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying | valid | expired | success
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                await axios.get(`/auth/reset-password/${token}`);
                setStatus('valid');
            } catch (err) {
                setStatus('expired');
            }
        };
        verifyToken();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirm) { setError('Passwords do not match.'); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        setLoading(true);
        try {
            await axios.post(`/auth/reset-password/${token}`, { password });
            setStatus('success');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Reset failed. Link may have expired.');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = { width: '100%', padding: '0.75rem 2.5rem 0.75rem 2.5rem', borderRadius: '8px', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--border)', color: 'var(--text-main)' };
    const iconStyle = { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' };
    const eyeIconStyle = { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '400px', margin: '4rem auto' }}>
            <div className="glass" style={{ padding: '2rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <KeyRound color="var(--primary)" /> Reset Password
                </h2>

                {status === 'verifying' && (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Verifying your reset link...</p>
                )}

                {status === 'expired' && (
                    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                        <XCircle size={48} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
                        <h3 style={{ marginBottom: '0.5rem' }}>Link Expired or Invalid</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            This reset link has expired or is invalid. Please request a new one.
                        </p>
                        <Link to="/forgot-password" className="btn btn-primary" style={{ color: '#fff' }}>Request New Link</Link>
                    </div>
                )}

                {status === 'success' && (
                    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                        <CheckCircle size={48} color="#22c55e" style={{ margin: '0 auto 1rem' }} />
                        <h3 style={{ marginBottom: '0.5rem' }}>Password Reset!</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            Your password has been updated. Redirecting to login...
                        </p>
                    </div>
                )}

                {status === 'valid' && (
                    <>
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            Enter your new password below.
                        </p>
                        {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={iconStyle} />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="New Password" 
                                    required 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    style={inputStyle} 
                                />
                                <div 
                                    onClick={() => setShowPassword(!showPassword)} 
                                    style={eyeIconStyle}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </div>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={iconStyle} />
                                <input 
                                    type={showConfirm ? "text" : "password"} 
                                    placeholder="Confirm New Password" 
                                    required 
                                    value={confirm} 
                                    onChange={(e) => setConfirm(e.target.value)} 
                                    style={inputStyle} 
                                />
                                <div 
                                    onClick={() => setShowConfirm(!showConfirm)} 
                                    style={eyeIconStyle}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                                >
                                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent: 'center' }}>
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
