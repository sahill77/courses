import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, PlayCircle, BookOpen, User, ChevronDown, ChevronLeft } from 'lucide-react';

const FAQItem = ({ faq }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', background: 'rgba(0,0,0,0.02)' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{ width: '100%', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'transparent', color: 'var(--text-main)', textAlign: 'left', transition: 'var(--transition)' }}
            >
                <span style={{ fontWeight: 600, fontSize: '1rem' }}>{faq.question}</span>
                <ChevronDown size={20} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s', color: 'var(--primary)' }} />
            </button>
            <div style={{
                maxHeight: isOpen ? '500px' : '0',
                overflow: 'hidden',
                transition: 'all 0.3s ease-in-out',
                background: 'rgba(0,0,0,0.05)'
            }}>
                <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border)', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                    {faq.answer}
                </div>
            </div>
        </div>
    );
};

export default function CourseDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data } = await axios.get(`/courses/${id}`);
                setCourse(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    const handleEnroll = async () => {
        if (!user) return navigate('/login');
        setEnrolling(true);
        try {
            await axios.post(`/courses/${id}/enroll`);
            alert('Successfully enrolled!');
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.error || 'Enrollment failed');
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading course details...</div>;
    if (!course) return <div style={{ textAlign: 'center', padding: '4rem' }}>Course not found</div>;

    const isEnrolled = user?.enrolledCourses?.includes(course._id);

    return (
        <div className="animate-fade-in" style={{ marginTop: '1.5rem' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', transition: 'var(--transition)' }} onMouseOver={(e) => e.target.style.color = 'var(--primary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>
                <ChevronLeft size={16} /> Back to Courses
            </Link>

            <div className="grid grid-sidebar-reverse" style={{ gap: '2rem' }}>
                <style>{`
                    .grid-sidebar-reverse {
                        display: grid;
                        grid-template-columns: 1fr 350px;
                    }
                    @media (max-width: 992px) {
                        .grid-sidebar-reverse {
                            grid-template-columns: 1fr;
                        }
                        .grid-sidebar-reverse aside {
                            order: -1;
                        }
                    }
                `}</style>
                <div>
                    <div style={{ marginBottom: '2rem' }}>
                        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{course.category}</span>
                        <h1 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{course.title}</h1>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>{course.description}</p>
                    </div>

                    <div className="glass" style={{ padding: '2rem', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Course Content</h2>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {course.content?.map((module, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'rgba(0,0,0,0.03)' }}>
                                    <PlayCircle size={20} color="var(--primary)" />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600 }}>{module.title}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{module.description}</div>
                                    </div>
                                </div>
                            ))}
                            {(!course.content || course.content.length === 0) && (
                                <div style={{ color: 'var(--text-muted)' }}>No curriculum added yet for this course.</div>
                            )}
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="glass" style={{ padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Frequently Asked Questions</h2>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {course.faqs?.map((faq, index) => (
                                <FAQItem key={index} faq={faq} />
                            ))}
                            {(!course.faqs || course.faqs.length === 0) && (
                                <div style={{ color: 'var(--text-muted)' }}>No FAQs available for this course.</div>
                            )}
                        </div>
                    </div>
                </div>

                <aside>
                    <div className="glass" style={{ padding: '1.5rem', position: 'sticky', top: '90px' }}>
                        <div style={{ height: '200px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
                            {course.thumbnail ? (
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <div style={{ height: '100%', background: 'linear-gradient(45deg, #1e293b, #334155)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <BookOpen size={64} color="var(--primary)" opacity={0.3} />
                                </div>
                            )}
                        </div>

                        <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                            ₹{Math.floor(course.price)}
                        </div>

                        {isEnrolled ? (
                            <Link to="/dashboard" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
                                <CheckCircle size={20} /> Already Enrolled
                            </Link>
                        ) : (
                            <button
                                onClick={handleEnroll}
                                disabled={enrolling}
                                className="btn btn-primary"
                                style={{ width: '100%', justifyContent: 'center', fontSize: '1rem' }}
                            >
                                {enrolling ? 'Processing...' : 'Enroll Now'}
                            </button>
                        )}

                        <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><User size={16} /> Instructor: {course.instructor}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><BookOpen size={16} /> Lifetime Access</div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
