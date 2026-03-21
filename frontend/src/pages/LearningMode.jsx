import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../services/api';
import { CheckCircle, PlayCircle, ChevronLeft, ChevronRight, BookOpen, Menu, X, ArrowLeft } from 'lucide-react';

export default function LearningMode() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [enrollment, setEnrollment] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [courseRes, enrollRes] = await Promise.all([
                    axios.get(`/courses/${id}`),
                    axios.get(`/courses/${id}/enrollment`)
                ]);
                setCourse(courseRes.data);
                setEnrollment(enrollRes.data);
                setActiveIndex(enrollRes.data.lastAccessedModuleIndex || 0);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const saveProgress = async (moduleId, completed, newIndex) => {
        try {
            const { data } = await axios.post(`/courses/${id}/progress`, {
                moduleId,
                completed,
                lastAccessedModuleIndex: newIndex !== undefined ? newIndex : activeIndex
            });
            setEnrollment(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleModuleClick = (index) => {
        setActiveIndex(index);
        saveProgress(null, null, index);
    };

    const toggleComplete = (moduleId) => {
        const isCompleted = enrollment?.completedModules?.includes(moduleId);
        saveProgress(moduleId, !isCompleted);
    };

    const goNext = () => {
        if (activeIndex < (course?.content?.length || 0) - 1) {
            const next = activeIndex + 1;
            setActiveIndex(next);
            saveProgress(null, null, next);
        }
    };

    const goPrev = () => {
        if (activeIndex > 0) {
            const prev = activeIndex - 1;
            setActiveIndex(prev);
            saveProgress(null, null, prev);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading your lesson...</div>;
    if (!course || !enrollment) return <div style={{ textAlign: 'center', padding: '4rem' }}>Course or enrollment not found. <Link to="/dashboard" style={{ color: 'var(--primary)' }}>Go to Dashboard</Link></div>;

    const modules = course.content || [];
    const activeModule = modules[activeIndex];
    const completedModules = enrollment.completedModules || [];
    const progress = enrollment.progress || 0;

    const renderVideo = (mod) => {
        if (!mod?.videoUrl) return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', color: 'var(--text-muted)' }}>
                <div style={{ textAlign: 'center' }}>
                    <BookOpen size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                    <p>No video content for this module.</p>
                </div>
            </div>
        );
        if (mod.videoUrl.includes('youtube.com') || mod.videoUrl.includes('youtu.be')) {
            const embedUrl = mod.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/');
            return (
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', background: '#000' }}>
                    <iframe src={embedUrl} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} allowFullScreen title={mod.title} />
                </div>
            );
        }
        return (
            <video controls autoPlay style={{ width: '100%', borderRadius: '12px', background: '#000' }}>
                <source src={mod.videoUrl} type="video/mp4" />
            </video>
        );
    };

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 80px)', overflow: 'hidden', margin: '-1rem -1.5rem' }}>
            <style>{`
                .lm-sidebar-item { padding: 1rem 1.25rem; display: flex; align-items: flex-start; gap: 0.75rem; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.05); transition: background 0.2s; }
                .lm-sidebar-item:hover { background: rgba(99,102,241,0.08); }
                .lm-sidebar-item.active { background: rgba(99,102,241,0.15); border-left: 3px solid var(--primary); }
                @media (max-width: 768px) {
                    .lm-sidebar { position: fixed !important; z-index: 100; height: 100vh !important; top: 0; }
                    .lm-sidebar-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 99; }
                }
            `}</style>

            {/* Mobile overlay */}
            {sidebarOpen && window.innerWidth <= 768 && (
                <div className="lm-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className="lm-sidebar" style={{
                width: sidebarOpen ? '340px' : '0px',
                minWidth: sidebarOpen ? '340px' : '0px',
                background: 'var(--bg-card)',
                borderRight: sidebarOpen ? '1px solid var(--border)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                transition: 'width 0.3s, min-width 0.3s',
                height: '100%'
            }}>
                {/* Sidebar Header */}
                <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
                    <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.75rem', textDecoration: 'none' }}>
                        <ArrowLeft size={14} /> Back to Dashboard
                    </Link>
                    <h3 style={{ fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '0.5rem' }}>{course.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(to right, var(--primary), #22c55e)', transition: 'width 0.4s' }} />
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: progress === 100 ? '#22c55e' : 'var(--primary)', whiteSpace: 'nowrap' }}>{progress}%</span>
                    </div>
                </div>

                {/* Module List */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {modules.map((mod, i) => {
                        const isComplete = completedModules.includes(mod._id);
                        const isActive = i === activeIndex;
                        return (
                            <div key={mod._id || i} className={`lm-sidebar-item ${isActive ? 'active' : ''}`} onClick={() => handleModuleClick(i)}>
                                <div style={{
                                    width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px',
                                    background: isComplete ? 'rgba(34,197,94,0.15)' : isActive ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)',
                                    color: isComplete ? '#22c55e' : isActive ? 'var(--primary)' : 'var(--text-muted)',
                                    border: `1px solid ${isComplete ? '#22c55e' : isActive ? 'var(--primary)' : 'var(--border)'}`
                                }}>
                                    {isComplete ? <CheckCircle size={16} /> : <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{i + 1}</span>}
                                </div>
                                <div style={{ overflow: 'hidden' }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--primary)' : 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{mod.title}</div>
                                    {mod.description && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{mod.description}</div>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                {/* Top Bar */}
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0, background: 'rgba(0,0,0,0.1)' }}>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}>
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Module {activeIndex + 1} of {modules.length}
                    </div>
                </div>

                {/* Video Area */}
                <div style={{ flex: 1, padding: '2rem', maxWidth: '1100px', width: '100%', margin: '0 auto' }}>
                    {activeModule ? (
                        <>
                            {renderVideo(activeModule)}

                            {/* Module Info & Controls */}
                            <div style={{ marginTop: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{activeModule.title}</h2>
                                {activeModule.description && <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>{activeModule.description}</p>}

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                                    <button onClick={goPrev} disabled={activeIndex === 0} className="btn btn-ghost" style={{ gap: '0.4rem', opacity: activeIndex === 0 ? 0.4 : 1 }}>
                                        <ChevronLeft size={18} /> Previous
                                    </button>

                                    <button
                                        onClick={() => toggleComplete(activeModule._id)}
                                        className={completedModules.includes(activeModule._id) ? 'btn btn-ghost' : 'btn btn-primary'}
                                        style={{ gap: '0.5rem', padding: '0.6rem 1.5rem' }}
                                    >
                                        <CheckCircle size={18} />
                                        {completedModules.includes(activeModule._id) ? 'Completed ✓' : 'Mark as Complete'}
                                    </button>

                                    <button onClick={goNext} disabled={activeIndex === modules.length - 1} className="btn btn-ghost" style={{ gap: '0.4rem', opacity: activeIndex === modules.length - 1 ? 0.4 : 1 }}>
                                        Next <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                            <BookOpen size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                            <p>No modules available for this course yet.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
