import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { PlusCircle, Edit, Trash2, Settings, Users, BookOpen, CheckCircle, ChevronLeft } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export default function AdminPanel() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(() => {
    const saved = localStorage.getItem('admin_course_draft');
    return saved ? JSON.parse(saved) : { title: '', description: '', instructor: '', category: '', price: 0 };
  });
  const [loading, setLoading] = useState(true);
  const activeTab = searchParams.get('tab') || 'courses';
  const [usersList, setUsersList] = useState([]);
  const [stats, setStats] = useState({ users: 0, courses: 0, enrollments: 0 });

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get('/courses');
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/admin/users');
      setUsersList(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/admin/stats');
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchUsers();
    fetchStats();
  }, []);

  useEffect(() => {
    if (showModal) {
      localStorage.setItem('admin_course_draft', JSON.stringify(currentCourse));
    } else {
      localStorage.removeItem('admin_course_draft');
    }
  }, [currentCourse, showModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentCourse._id) {
        await axios.put(`/admin/courses/${currentCourse._id}`, currentCourse);
      } else {
        await axios.post('/admin/courses', currentCourse);
      }
      setShowModal(false);
      setCurrentCourse({ title: '', description: '', instructor: '', category: '', price: 0 });
      fetchCourses();
    } catch (err) {
      alert('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await axios.delete(`/admin/courses/${id}`);
      fetchCourses();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="animate-fade-in" style={{ marginTop: '2rem' }}>
      <header style={{ marginBottom: '3rem' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', transition: 'var(--transition)' }} onMouseOver={(e) => e.target.style.color = 'var(--primary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>
          <ChevronLeft size={16} /> Back to Home
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Settings size={40} color="var(--primary)" /> Admin Dashboard
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage your platform resources and monitor student activity.</p>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(99,102,241,0.1)', borderRadius: '12px' }}>
            <Users size={28} color="var(--primary)" />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Total Users</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.users}</div>
          </div>
        </div>
        <div className="glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(34,197,94,0.1)', borderRadius: '12px' }}>
            <BookOpen size={28} color="#22c55e" />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Active Courses</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.courses}</div>
          </div>
        </div>
        <div className="glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(245,158,11,0.1)', borderRadius: '12px' }}>
            <CheckCircle size={28} color="#f59e0b" />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Total Enrollments</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.enrollments}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button
          className={`btn ${activeTab === 'courses' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setSearchParams({ tab: 'courses' })}
          style={{ gap: '0.5rem' }}
        >
          <BookOpen size={18} /> Manage Courses
        </button>
        <button
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setSearchParams({ tab: 'users' })}
          style={{ gap: '0.5rem' }}
        >
          <Users size={18} /> Users & Enrollments
        </button>
      </div>

      {activeTab === 'courses' ? (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={20} color="var(--primary)" /> Course Inventory
            </h2>
            <button className="btn btn-primary" onClick={() => { setCurrentCourse({ title: '', description: '', instructor: '', category: '', price: 0 }); setShowModal(true); }}>
              <PlusCircle size={18} /> Add New Course
            </button>
          </div>
          <div className="glass" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.05)', textAlign: 'left' }}>
                  <th style={{ padding: '1.25rem' }}>Course Title</th>
                  <th style={{ padding: '1.25rem' }}>Category</th>
                  <th style={{ padding: '1.25rem' }}>Instructor</th>
                  <th style={{ padding: '1.25rem' }}>Price</th>
                  <th style={{ padding: '1.25rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>{course.title}</td>
                    <td style={{ padding: '1rem 1.25rem' }}><span style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>{course.category}</span></td>
                    <td style={{ padding: '1rem 1.25rem' }}>{course.instructor}</td>
                    <td style={{ padding: '1rem 1.25rem' }}>₹{Math.floor(course.price)}</td>
                    <td style={{ padding: '1rem 1.25rem', display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-ghost" style={{ padding: '0.4rem' }} onClick={() => { setCurrentCourse(course); setShowModal(true); }}><Edit size={16} /></button>
                      <button className="btn btn-ghost" style={{ padding: '0.4rem', color: '#ef4444' }} onClick={() => handleDelete(course._id)}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="animate-fade-in">
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} color="var(--primary)" /> Student Enrollments
            </h2>
          </div>
          <div className="glass" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                  <th style={{ padding: '1.25rem' }}>User Name</th>
                  <th style={{ padding: '1.25rem' }}>Email</th>
                  <th style={{ padding: '1.25rem' }}>Enrolled Courses</th>
                  <th style={{ padding: '1.25rem' }}>Joined On</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map(userItem => (
                  <tr key={userItem._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>{userItem.name} {userItem.role === 'admin' && <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 800 }}>(Admin)</span>}</td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>{userItem.email}</td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {userItem.enrolledCourses?.length > 0 ? (
                          userItem.enrolledCourses.map(c => (
                            <span key={c._id} style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid var(--border)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                              {c.title}
                            </span>
                          ))
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No enrollments</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {new Date(userItem.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass container-mobile-padding" style={{ padding: '2rem', width: '95%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>{currentCourse._id ? 'Edit Course' : 'Create New Course'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
              <input
                type="text" placeholder="Course Title" required
                value={currentCourse.title}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: '#fff' }}
                onChange={(e) => setCurrentCourse({ ...currentCourse, title: e.target.value })}
              />
              <textarea
                placeholder="Description" required rows="3"
                value={currentCourse.description}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: '#fff' }}
                onChange={(e) => setCurrentCourse({ ...currentCourse, description: e.target.value })}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input
                  type="text" placeholder="Instructor" required
                  value={currentCourse.instructor}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, instructor: e.target.value })}
                />
                <input
                  type="text" placeholder="Category" required
                  value={currentCourse.category}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, category: e.target.value })}
                />
              </div>
              <input
                type="number" placeholder="Price (₹)" required step="1"
                value={currentCourse.price}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: '#fff' }}
                onChange={(e) => setCurrentCourse({ ...currentCourse, price: Math.floor(e.target.value) })}
              />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{currentCourse._id ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
