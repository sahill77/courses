import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import CourseCard from '../components/CourseCard';
import { Search, Filter, BookOpen, ChevronLeft } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';

export default function Courses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryQuery = searchParams.get('category') || '';
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await axios.get('/api/courses');
                setCourses(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const filteredCourses = courses.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
            c.instructor.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryQuery ? c.category === categoryQuery : true;
        return matchesSearch && matchesCategory;
    });

    const categories = ['Development', 'Design', 'Analysis', 'Marketing'];

    return (
        <div className="animate-fade-in" style={{ marginTop: '1.5rem' }}>
            <div style={{ marginBottom: '3rem' }}>
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', transition: 'var(--transition)' }} onMouseOver={(e) => e.target.style.color = 'var(--primary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>
                    <ChevronLeft size={16} /> Back to Home
                </Link>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Explore Courses</h1>
                <p style={{ color: 'var(--text-muted)', maxWidth: '600px' }}>
                    Browse our extensive catalog of courses and find the perfect path to advance your skills.
                </p>
            </div>

            <div style={{ gap: '2rem' }} className="grid-responsive grid-sidebar-main">
                <style>{`
                    .grid-sidebar-main {
                        display: grid;
                        grid-template-columns: 300px 1fr;
                    }
                    @media (max-width: 900px) {
                        .grid-sidebar-main {
                            grid-template-columns: 1fr;
                        }
                    }
                `}</style>
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glass" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Search size={18} color="var(--primary)" /> Search
                        </h3>
                        <input
                            type="text"
                            placeholder="Course title or instructor..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
                        />
                    </div>

                    <div className="glass" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Filter size={18} color="var(--primary)" /> Categories
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <button
                                onClick={() => setSearchParams({})}
                                style={{
                                    textAlign: 'left',
                                    padding: '0.6rem 1rem',
                                    borderRadius: '6px',
                                    background: !categoryQuery ? 'rgba(99,102,241,0.1)' : 'transparent',
                                    color: !categoryQuery ? 'var(--primary)' : 'var(--text-muted)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    transition: 'var(--transition)'
                                }}
                            >
                                All Categories
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSearchParams({ category: cat })}
                                    style={{
                                        textAlign: 'left',
                                        padding: '0.6rem 1rem',
                                        borderRadius: '6px',
                                        background: categoryQuery === cat ? 'rgba(99,102,241,0.1)' : 'transparent',
                                        color: categoryQuery === cat ? 'var(--primary)' : 'var(--text-muted)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        transition: 'var(--transition)'
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                <main>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            Found <strong>{filteredCourses.length}</strong> {categoryQuery || 'total'} courses
                        </div>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading courses...</div>
                    ) : filteredCourses.length === 0 ? (
                        <div className="glass" style={{ padding: '4rem', textAlign: 'center' }}>
                            <div style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                <BookOpen size={48} style={{ margin: '0 auto' }} />
                            </div>
                            <h3>No courses found</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search or filters.</p>
                        </div>
                    ) : (
                        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            {filteredCourses.map(course => (
                                <CourseCard key={course._id} course={course} />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
