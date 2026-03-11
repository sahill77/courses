import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link, useSearchParams } from 'react-router-dom';
import { Book, Play, LayoutDashboard, ChevronLeft, User, Settings, Save, Lock, Sparkles } from 'lucide-react';

export default function StudentDashboard() {
    const { user, updateUser } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const activeTab = searchParams.get('tab') || 'learning';

    // Profile form state
    const [profileData, setProfileData] = useState({ name: user?.name || '', email: user?.email || '', password: '' });
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchMyCourses = async () => {
            try {
                const { data } = await axios.get('/courses/my/courses');
                setEnrollments(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyCourses();
    }, []);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setMessage({ type: '', text: '' });
        try {
            const { data } = await axios.put('/auth/profile', profileData);
            updateUser(data.user);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setProfileData({ ...profileData, password: '' }); // Clear password field
        } catch (err) {
            const message = err.response?.data?.error || err.message || 'Failed to update profile';
            setMessage({ 
                type: 'error', 
                text: typeof message === 'object' ? JSON.stringify(message) : String(message) 
            });
        } finally {
            setUpdating(false);
        }
    };

    const validEnrollments = enrollments.filter(enr => enr && enr.course);

    return (
        <div className="animate-fade-in" style={{ marginTop: '1.5rem' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', transition: 'var(--transition)' }} onMouseOver={(e) => e.target.style.color = 'var(--primary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>
                <ChevronLeft size={16} /> Back to Home
            </Link>

            <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome back, <span style={{ color: 'var(--header-text)', fontWeight: 600 }}>{user?.name}</span></p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <button
                        onClick={() => setSearchParams({ tab: 'learning' })}
                        className={`btn ${activeTab === 'learning' ? 'btn-primary' : 'btn-ghost'}`}
                        style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', gap: '0.5rem' }}
                    >
                        <Book size={18} /> My Learning
                    </button>
                    <button
                        onClick={() => setSearchParams({ tab: 'profile' })}
                        className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-ghost'}`}
                        style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', gap: '0.5rem' }}
                    >
                        <User size={18} /> Profile
                    </button>
                </div>
            </header>

            {activeTab === 'learning' ? (
                <section className="animate-fade-in">
                    {validEnrollments.length > 0 && (
                        <div className="glass stack-on-mobile" style={{ marginBottom: '3rem', padding: '2rem', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', alignItems: 'center', border: '1px solid rgba(99,102,241,0.2)' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1rem' }}>
                                    <Sparkles size={16} /> RECOMMENDED FOR YOU
                                </div>
                                <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Resume: {validEnrollments[0].course?.title}</h2>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
                                    You were last learning about <strong>{validEnrollments[0].course?.category}</strong>. Pick up exactly where you left off and keep the momentum going!
                                </p>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <Link to={`/courses/${validEnrollments[0].course?._id}`} className="btn btn-primary" style={{ padding: '0.75rem 2rem', gap: '0.75rem' }}>
                                        <Play size={18} fill="currentColor" /> Resume Lesson
                                    </Link>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Progress: {validEnrollments[0].progress}%</span>
                                </div>
                            </div>
                            <div style={{ aspectRatio: '16/9', borderRadius: '16px', overflow: 'hidden', background: 'rgba(0,0,0,0.2)' }}>
                                <img
                                    src={`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800`}
                                    alt="Learning preview"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
                                />
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <LayoutDashboard size={20} color="var(--primary)" /> Your Learning Path
                        </h2>
                        <Link to="/courses" style={{ fontSize: '0.9rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Explore More Courses</Link>
                    </div>

                    {loading ? (
                        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading your courses...</div>
                    ) : validEnrollments.length === 0 ? (
                        <div className="glass" style={{ padding: '4rem', textAlign: 'center' }}>
                            <div style={{ marginBottom: '1.5rem', opacity: 0.3 }}>
                                <Book size={64} style={{ margin: '0 auto' }} />
                            </div>
                            <h3 style={{ marginBottom: '0.5rem' }}>Your journey starts here</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Enroll in your first course and start mastering new skills today.</p>
                            <Link to="/courses" className="btn btn-primary">Browse All Courses</Link>
                        </div>
                    ) : (
                        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                            {validEnrollments.map(enr => (
                                <div key={enr._id} className="glass card-hover" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ width: '50px', height: '50px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Book size={20} color="var(--primary)" />
                                        </div>
                                        <div style={{ overflow: 'hidden' }}>
                                            <h3 style={{ fontSize: '1rem', marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--header-text)' }}>{enr.course?.title}</h3>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{enr.course?.instructor}</div>
                                        </div>
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                                            <span style={{ color: 'var(--text-muted)' }}>Learning Progress</span>
                                            <span style={{ fontWeight: 600 }}>{enr.progress}%</span>
                                        </div>
                                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ width: `${enr.progress}%`, height: '100%', background: 'linear-gradient(to right, var(--primary), #818cf8)' }}></div>
                                        </div>
                                    </div>

                                    <Link to={`/courses/${enr.course?._id}`} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', fontSize: '0.9rem' }}>
                                        Continue Path
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            ) : (
                <section className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div className="glass container-mobile-padding" style={{ padding: '2.5rem 1.5rem' }}>
                        <h2 style={{ fontSize: '1.4rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Settings size={20} color="var(--primary)" /> Account Settings
                        </h2>

                        {message.text && (
                            <div style={{
                                padding: '1rem',
                                borderRadius: '8px',
                                marginBottom: '1.5rem',
                                background: message.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                                border: `1px solid ${message.type === 'success' ? '#22c55e' : '#ef4444'}`,
                                color: message.type === 'success' ? '#4ade80' : '#f87171',
                                fontSize: '0.9rem'
                            }}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleProfileUpdate} style={{ display: 'grid', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 3rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '8px', color: '#fff' }}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Settings size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                        style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 3rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '8px', color: '#fff' }}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>New Password (Leave blank to keep current)</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        type="password"
                                        value={profileData.password}
                                        onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
                                        placeholder="••••••••"
                                        style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 3rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '8px', color: '#fff' }}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={updating} style={{ marginTop: '1rem', justifyContent: 'center', padding: '1rem' }}>
                                {updating ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                            </button>
                        </form>
                    </div>

                    <div className="glass" style={{ marginTop: '1.5rem', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(99,102,241,0.1)', borderRadius: '10px' }}>
                            <Lock size={20} color="var(--primary)" />
                        </div>
                        <div style={{ fontSize: '0.85rem' }}>
                            <div style={{ fontWeight: 600, marginBottom: '0.1rem' }}>Security Protocol</div>
                            <div style={{ color: 'var(--text-muted)' }}>Your data is encrypted and protected with industry-standard protocols.</div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
