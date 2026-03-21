import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, GraduationCap } from 'lucide-react';

export default function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData.name, formData.email, formData.password, formData.role);
            if (formData.role === 'instructor') {
                setSuccess('Registration successful! Your instructor account is pending admin approval. You will be notified once approved.');
                setError('');
            } else {
                navigate('/login');
            }
        } catch (err) {
            const message = err.response?.data?.error || err.message || 'Registration failed';
            setError(typeof message === 'object' ? JSON.stringify(message) : String(message));
            setSuccess('');
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '400px', margin: '2rem auto', padding: '0 0.5rem' }}>
            <div className="glass" style={{ padding: '2rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <UserPlus color="var(--primary)" /> Join SparksStream
                </h2>
                {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
                {success && <div style={{ color: '#22c55e', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center', background: 'rgba(34,197,94,0.1)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(34,197,94,0.3)' }}>{success}</div>}
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text" placeholder="Full Name" required
                            style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="email" placeholder="Email Address" required
                            style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="password" placeholder="Password" required
                            style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <GraduationCap size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--border)', color: 'var(--text-main)', cursor: 'pointer', appearance: 'auto', outline: 'none' }}
                        >
                            <option value="student" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Student</option>
                            <option value="instructor" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Instructor</option>
                        </select>
                    </div>
                    {formData.role === 'instructor' && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(99,102,241,0.08)', padding: '0.6rem 0.75rem', borderRadius: '6px', margin: 0, lineHeight: 1.4 }}>
                            ℹ️ Instructor accounts require admin approval before you can start adding courses.
                        </p>
                    )}
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', justifyContent: 'center' }}>Create Account</button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
                </p>
            </div>
        </div>
    );
}
