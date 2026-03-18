import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Book, Play, LayoutDashboard, ChevronLeft, Sparkles } from 'lucide-react';

export default function StudentDashboard() {
    const { user } = useAuth();
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

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

            </header>

            {(
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
            )}
        </div>
    );
}
