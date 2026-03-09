import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import CourseCard from '../components/CourseCard';
import { Search, Sparkles, BookOpen, Clock, Award, Users, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await axios.get('/courses');
                // For home page, we only show top 4 courses
                setCourses(data.slice(0, 4));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const categories = [
        { name: 'Development', icon: '💻' },
        { name: 'Design', icon: '🎨' },
        { name: 'Analysis', icon: '📊' },
        { name: 'Marketing', icon: '📈' }
    ];

    return (
        <div className="animate-fade-in">
            {/* Category Bar */}
            <div style={{
                display: 'flex',
                gap: '1.5rem',
                overflowX: 'auto',
                padding: '0.75rem 1rem',
                margin: '0 -1rem 2rem',
                borderBottom: '1px solid var(--border)',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
            }} className="no-scrollbar">
                {categories.map(cat => (
                    <Link
                        key={cat.name}
                        to={`/courses?category=${cat.name}`}
                        style={{
                            whiteSpace: 'nowrap',
                            fontSize: '0.9rem',
                            color: 'var(--text-muted)',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.25rem 0.5rem',
                            transition: 'var(--transition)'
                        }}
                        onMouseOver={(e) => e.target.style.color = 'var(--primary)'}
                        onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}
                    >
                        <span>{cat.icon}</span> {cat.name}
                    </Link>
                ))}
            </div>

            {/* Hero Section */}
            <section style={{
                padding: '4rem 0',
                gap: '3rem',
                alignItems: 'center',
                marginBottom: '4rem'
            }} className="grid grid-2">
                <div>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'rgba(99,102,241,0.1)',
                        color: 'var(--primary)',
                        padding: '0.4rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        marginBottom: '1.5rem'
                    }}>
                        <Sparkles size={16} /> Empowering Future Developers
                    </div>
                    <h1 style={{ lineHeight: 1.1, marginBottom: '1.5rem', fontWeight: 800 }} className="text-h1">
                        Master Your Craft with <span style={{ color: 'var(--primary)' }}>Expert-Led</span> Courses
                    </h1>
                    <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.6, maxWidth: '550px' }}>
                        Join over 10,000+ students worldwide. Learn web development, design, busines, and more from industry professionals.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }} className="stack-on-mobile">
                        <Link to="/courses" className="btn btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1rem', gap: '0.75rem', color: '#fff' }}>
                            Explore All Courses <ArrowRight size={18} />
                        </Link>
                        <Link to="/register" className="btn btn-ghost" style={{ padding: '0.8rem 2rem', fontSize: '1rem', border: '1px solid var(--border)' }}>
                            Join for Free
                        </Link>
                    </div>
                </div>
                <div style={{ position: 'relative' }}>
                    <div className="glass shadow-lg" style={{
                        aspectRatio: '16/10',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        position: 'relative',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                    }}>
                        <img
                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000"
                            alt="Student learning"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,17,26,0.8), transparent)' }}></div>
                    </div>
                </div>
            </section>

            {/* Features Bar */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ color: 'var(--primary)', background: 'rgba(99,102,241,0.1)', padding: '0.75rem', borderRadius: '12px' }}>
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 700 }}>100+ Courses</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Explore various topics</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ color: '#ec4899', background: 'rgba(236,72,153,0.1)', padding: '0.75rem', borderRadius: '12px' }}>
                        <Users size={24} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 700 }}>Expert Tutors</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Learn from the best</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ color: '#22c55e', background: 'rgba(34,197,94,0.1)', padding: '0.75rem', borderRadius: '12px' }}>
                        <Clock size={24} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 700 }}>Lifetime Access</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Learn at your own pace</div>
                    </div>
                </div>
            </div>

            {/* Popular Courses Section */}
            <section style={{ marginBottom: '5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                    <div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Top Rated Courses</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Handpicked selections to help you get started on your journey.</p>
                    </div>
                    <Link to="/courses" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        View All <ArrowRight size={16} />
                    </Link>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>Loading courses...</div>
                ) : (
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                        {courses.map(course => (
                            <CourseCard key={course._id} course={course} />
                        ))}
                    </div>
                )}
            </section>

            {/* CTA Section */}
            <section className="glass container-mobile-padding" style={{ padding: '4rem 2rem', textAlign: 'center', borderRadius: '32px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '200px', height: '200px', background: 'var(--primary)', opacity: 0.1, filter: 'blur(50px)', borderRadius: '50%' }}></div>
                <div style={{ position: 'absolute', bottom: '-50px', right: '-50px', width: '250px', height: '250px', background: '#ec4899', opacity: 0.1, filter: 'blur(60px)', borderRadius: '50%' }}></div>

                <h2 style={{ marginBottom: '1rem', position: 'relative' }} className="text-h2">Ready to Start Your Learning Journey?</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2.5rem', position: 'relative' }}>
                    Get unlimited access to all of our courses today. Plan starts at just ₹15/month.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', position: 'relative' }} className="stack-on-mobile">
                    <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem', color: '#fff' }}>Get Started Now</Link>
                </div>
            </section>
        </div>
    );
}
