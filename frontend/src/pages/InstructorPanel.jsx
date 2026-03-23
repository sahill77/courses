import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { PlusCircle, Edit, Trash2, Settings, Users, BookOpen, CheckCircle, LogOut, BarChart2, Activity, Save, User, Mail, Lock, Layers, X, Plus, Video, HelpCircle, Clock, ShieldOff, AlertTriangle, Menu } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InstructorSidebar from '../features/instructor/InstructorSidebar';
import Pagination from '../features/common/Pagination';

const Section = ({ title, field, children, onSave, messages, saving }) => (
    <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{title}</h3>
            {messages[field] && (
                <span style={{ fontSize: '0.8rem', color: messages[field].type === 'success' ? '#22c55e' : '#ef4444', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {messages[field].type === 'success' && <CheckCircle size={14} />}
                    {messages[field].text}
                </span>
            )}
        </div>
        {children}
        <button
            onClick={onSave}
            disabled={saving === field}
            className="btn btn-primary"
            style={{ marginTop: '1rem', padding: '0.6rem 1.5rem', fontSize: '0.9rem', gap: '0.5rem' }}
        >
            <Save size={15} /> {saving === field ? 'Saving...' : 'Save Changes'}
        </button>
    </div>
);

export default function InstructorPanel() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('instructor_sidebar_open');
    if (saved !== null) return JSON.parse(saved);
    return window.innerWidth > 768;
  });

  useEffect(() => {
    localStorage.setItem('instructor_sidebar_open', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  const [currentCourse, setCurrentCourse] = useState({ title: '', description: '', category: '', price: '', thumbnail: '' });
  const [loading, setLoading] = useState(true);
  const [customCategory, setCustomCategory] = useState('');
  const activeTab = searchParams.get('tab') || 'dashboard';
  const [stats, setStats] = useState({ totalCourses: 0, totalStudents: 0, totalCategories: 0 });
  const [students, setStudents] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [instructorStatus, setInstructorStatus] = useState({ isApproved: true, isBlocked: false, checked: false });

  // Content/FAQ modal state
  const [contentModalCourse, setContentModalCourse] = useState(null);
  const [contentActiveTab, setContentActiveTab] = useState('curriculum');
  const [contentModules, setContentModules] = useState([]);
  const [contentFaqs, setContentFaqs] = useState([]);
  const [contentSaving, setContentSaving] = useState(false);

  const ITEMS_PER_PAGE = 5;
  const [coursePage, setCoursePage] = useState(1);
  const [studentPage, setStudentPage] = useState(1);

  const sortedCourses = [...courses].sort((a, b) => (a.category || '').localeCompare(b.category || ''));
  const totalCoursePages = Math.ceil(sortedCourses.length / ITEMS_PER_PAGE);
  const paginatedCourses = sortedCourses.slice((coursePage - 1) * ITEMS_PER_PAGE, coursePage * ITEMS_PER_PAGE);

  const totalStudentPages = Math.ceil(students.length / ITEMS_PER_PAGE);
  const paginatedStudents = students.slice((studentPage - 1) * ITEMS_PER_PAGE, studentPage * ITEMS_PER_PAGE);

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [saving, setSaving] = useState(null);
  const [messages, setMessages] = useState({});

  useEffect(() => {
      if (user) setForm(f => ({ ...f, name: user.name || '', email: user.email || '' }));
  }, [user]);

  const setMsg = (field, type, text) => {
      setMessages(m => ({ ...m, [field]: { type, text } }));
      setTimeout(() => setMessages(m => ({ ...m, [field]: null })), 3000);
  };

  const handleProfileSave = async (field) => {
      if (field === 'name' && !form.name.trim()) return;
      if (field === 'email' && !form.email.trim()) return;
      if (field === 'password') {
          if (!form.password) return;
          if (form.password.length < 6) { setMsg('password', 'error', 'Min 6 characters required.'); return; }
          if (form.password !== form.confirmPassword) { setMsg('password', 'error', 'Passwords do not match.'); return; }
      }

      setSaving(field);
      try {
          const payload = field === 'password' ? { password: form.password } : { [field]: form[field] };
          const { data } = await axios.put('/auth/profile', payload);
          updateUser(data.user);
          setMsg(field, 'success', `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`);
          if (field === 'password') setForm(f => ({ ...f, password: '', confirmPassword: '' }));
      } catch (err) {
          setMsg(field, 'error', err.response?.data?.error || 'Update failed.');
      } finally {
          setSaving(null);
      }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/categories');
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get('/instructor/courses');
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const { data } = await axios.get('/instructor/students');
      setStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/instructor/stats');
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const checkInstructorStatus = async () => {
    try {
      const { data } = await axios.get('/instructor/status');
      setInstructorStatus({ ...data, checked: true });
      return data;
    } catch (err) {
      setInstructorStatus({ isApproved: false, isBlocked: false, checked: true });
      return null;
    }
  };

  useEffect(() => {
    const init = async () => {
      const status = await checkInstructorStatus();
      if (status && status.isApproved && !status.isBlocked) {
        fetchCourses();
        fetchStudents();
        fetchStats();
        fetchCategories();
      }
    };
    init();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only JPEG, JPG, and PNG are allowed.');
      return;
    }
    const formData = new FormData();
    formData.append('image', file);
    try {
      setUploading(true);
      const { data } = await axios.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setCurrentCourse({ ...currentCourse, thumbnail: data.url });
    } catch (err) {
      alert(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let courseData = { ...currentCourse };
      if (courseData.category === '__custom__') {
        if (!customCategory.trim()) { alert("Please enter a category name"); return; }
        try {
          const { data: newCat } = await axios.post('/categories', { name: customCategory.trim() });
          courseData.category = newCat.name;
        } catch (catErr) {
          if (catErr.response?.status === 400) {
            courseData.category = customCategory.trim();
          } else {
            throw catErr;
          }
        }
      }
      if (courseData._id) {
        await axios.put(`/instructor/courses/${courseData._id}`, courseData);
      } else {
        await axios.post('/instructor/courses', courseData);
      }
      setShowModal(false);
      setCurrentCourse({ title: '', description: '', category: '', price: '', thumbnail: '' });
      setCustomCategory('');
      fetchCourses();
      fetchStats();
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await axios.delete(`/instructor/courses/${id}`);
      fetchCourses();
      fetchStats();
    } catch (err) {
      alert('Delete failed');
    }
  };

  // Content/FAQ modal functions
  const openContentModal = (course) => {
    setContentModalCourse(course);
    setContentModules(course.content || []);
    setContentFaqs(course.faqs || []);
    setContentActiveTab('curriculum');
  };

  const handleContentSave = async () => {
    setContentSaving(true);
    try {
      await axios.put(`/instructor/courses/${contentModalCourse._id}`, {
        ...contentModalCourse,
        content: contentModules,
        faqs: contentFaqs
      });
      setContentModalCourse(null);
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save content');
    } finally {
      setContentSaving(false);
    }
  };

  // Pending / Blocked full-screen states
  if (instructorStatus.checked && (instructorStatus.isBlocked || !instructorStatus.isApproved)) {
    const isBlocked = instructorStatus.isBlocked;
    return (
      <div className="animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--bg-main)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass" style={{ maxWidth: '480px', padding: '3rem', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: isBlocked ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            {isBlocked ? <ShieldOff size={40} color="#ef4444" /> : <Clock size={40} color="#f59e0b" />}
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            {isBlocked ? 'Account Suspended' : 'Pending Approval'}
          </h1>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
            {isBlocked
              ? 'Your instructor account has been suspended by the administrator. You cannot access any features at this time. Please contact support for assistance.'
              : 'Your instructor account is awaiting admin approval. Once approved, you will be able to create courses, manage content, and view enrolled students.'}
          </p>
          <button className="btn btn-ghost" onClick={() => { logout(); navigate('/login'); }} style={{ gap: '0.5rem' }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--bg-main)', zIndex: 1000 }}>
      <InstructorSidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        activeTab={activeTab} 
        setSearchParams={setSearchParams} 
        user={user} 
        logout={logout} 
        navigate={navigate} 
      />

      <main className="admin-main" style={{ flex: 1, padding: window.innerWidth <= 768 ? '1rem' : '1.5rem 3rem', overflowY: 'auto', height: '100%' }}>
        {/* Mobile Header Toggle */}
        <div style={{ display: window.innerWidth <= 768 ? 'flex' : 'none', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', background: 'var(--bg-card)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(10px)' }}>
          <button className="btn btn-ghost" onClick={() => setIsSidebarOpen(true)} style={{ padding: '0.5rem' }}>
            <Menu size={24} />
          </button>
          <span style={{ fontWeight: 700, fontSize: '1rem', color: '#22c55e' }}>Instructor Panel</span>
        </div>
        {activeTab === 'dashboard' ? (
          <div className="animate-fade-in">
            <header style={{ marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 800 }}>Instructor Dashboard</h1>
              <p style={{ color: 'var(--text-muted)' }}>Welcome back, <strong>{user?.name}</strong>. Here's your teaching overview.</p>
            </header>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              <div className="glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ padding: '1rem', background: 'rgba(99,102,241,0.1)', borderRadius: '12px' }}>
                  <BookOpen size={28} color="var(--primary)" />
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>My Courses</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.totalCourses}</div>
                </div>
              </div>
              <div className="glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ padding: '1rem', background: 'rgba(34,197,94,0.1)', borderRadius: '12px' }}>
                  <Users size={28} color="#22c55e" />
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Total Students</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.totalStudents}</div>
                </div>
              </div>
              <div className="glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ padding: '1rem', background: 'rgba(245,158,11,0.1)', borderRadius: '12px' }}>
                  <CheckCircle size={28} color="#f59e0b" />
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Categories</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.totalCategories}</div>
                </div>
              </div>
            </div>

            {/* Recent students */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Activity size={20} color="var(--primary)" /> Recent Enrollments
              </h2>
              <div className="glass" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                      <th style={{ padding: '1.25rem' }}>Student</th>
                      <th style={{ padding: '1.25rem' }}>Course</th>
                      <th style={{ padding: '1.25rem' }}>Enrolled On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.slice(0, 5).map(en => (
                      <tr key={en._id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '1rem 1.25rem' }}>{en.user?.name || 'Unknown'}</td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <span style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>{en.course?.title || '-'}</span>
                        </td>
                        <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          {new Date(en.enrolledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                    {students.length === 0 && (
                      <tr><td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No enrollments yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : activeTab === 'courses' ? (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={20} color="var(--primary)" /> My Courses
              </h2>
              <button className="btn btn-primary" onClick={() => { setCurrentCourse({ title: '', description: '', category: '', price: '', thumbnail: '' }); setShowModal(true); }}>
                <PlusCircle size={18} /> Add New Course
              </button>
            </div>
            <div className="glass" style={{ overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(0,0,0,0.05)', textAlign: 'left' }}>
                    <th style={{ padding: '1.25rem' }}>Course Title</th>
                    <th style={{ padding: '1.25rem' }}>Category</th>
                    <th style={{ padding: '1.25rem' }}>Status</th>
                    <th style={{ padding: '1.25rem' }}>Price</th>
                    <th style={{ padding: '1.25rem' }}>Students</th>
                    <th style={{ padding: '1.25rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCourses.map(course => (
                    <tr key={course._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem 1.25rem' }}>{course.title}</td>
                      <td style={{ padding: '1rem 1.25rem' }}><span style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>{course.category}</span></td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                          background: course.status === 'approved' ? 'rgba(34,197,94,0.1)' : course.status === 'rejected' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                          color: course.status === 'approved' ? '#22c55e' : course.status === 'rejected' ? '#ef4444' : '#f59e0b'
                        }}>
                          {course.status === 'approved' ? '✓ Approved' : course.status === 'rejected' ? '✗ Rejected' : '⏳ Pending'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>₹{Math.floor(course.price)}</td>
                      <td style={{ padding: '1rem 1.25rem' }}>{course.students?.length || 0}</td>
                      <td style={{ padding: '1rem 1.25rem', display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-ghost" style={{ padding: '0.4rem', color: 'var(--primary)' }} onClick={() => openContentModal(course)} title="Manage Content & FAQs"><Layers size={16} /></button>
                        <button className="btn btn-ghost" style={{ padding: '0.4rem' }} onClick={() => { setCurrentCourse(course); setShowModal(true); }} title="Edit Course Details"><Edit size={16} /></button>
                        <button className="btn btn-ghost" style={{ padding: '0.4rem', color: '#ef4444' }} onClick={() => handleDelete(course._id)} title="Delete Course"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                  {courses.length === 0 && (
                    <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No courses yet. Click "Add New Course" to create one.</td></tr>
                  )}
                </tbody>
              </table>
              <Pagination currentPage={coursePage} totalPages={totalCoursePages} setPage={setCoursePage} />
            </div>
          </div>
        ) : activeTab === 'students' ? (
          <div className="animate-fade-in">
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={20} color="var(--primary)" /> My Students
              </h2>
            </div>
            <div className="glass" style={{ overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                    <th style={{ padding: '1.25rem' }}>Student Name</th>
                    <th style={{ padding: '1.25rem' }}>Email</th>
                    <th style={{ padding: '1.25rem' }}>Course</th>
                    <th style={{ padding: '1.25rem' }}>Progress</th>
                    <th style={{ padding: '1.25rem' }}>Enrolled On</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.map(en => (
                    <tr key={en._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem 1.25rem' }}>{en.user?.name || 'Unknown'}</td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>{en.user?.email || '-'}</td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>{en.course?.title || '-'}</span>
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ flex: 1, maxWidth: '100px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${en.progress || 0}%`, height: '100%', background: en.progress >= 100 ? '#22c55e' : 'var(--primary)', borderRadius: '3px', transition: 'width 0.3s' }}></div>
                          </div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{en.progress || 0}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {new Date(en.enrolledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No students enrolled yet</td></tr>
                  )}
                </tbody>
              </table>
              <Pagination currentPage={studentPage} totalPages={totalStudentPages} setPage={setStudentPage} />
            </div>
          </div>
        ) : activeTab === 'settings' ? (
          <div className="animate-fade-in" style={{ maxWidth: '600px' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Settings size={20} color="var(--primary)" /> Profile Settings
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>Update your instructor account details.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <Section title="Display Name" field="name" onSave={() => handleProfileSave('name')} messages={messages} saving={saving}>
                    <div style={{ position: 'relative' }}>
                        <User size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text" value={form.name}
                            onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                            style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--border)', color: 'var(--text-main)', fontSize: '0.95rem', outline: 'none' }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                        />
                    </div>
                </Section>

                <Section title="Email Address" field="email" onSave={() => handleProfileSave('email')} messages={messages} saving={saving}>
                    <div style={{ position: 'relative' }}>
                        <Mail size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="email" value={form.email}
                            onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                            style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--border)', color: 'var(--text-main)', fontSize: '0.95rem', outline: 'none' }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                        />
                    </div>
                </Section>

                <Section title="Change Password" field="password" onSave={() => handleProfileSave('password')} messages={messages} saving={saving}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Lock size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="password" placeholder="New Password" value={form.password}
                                onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                                style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--border)', color: 'var(--text-main)', fontSize: '0.95rem', outline: 'none' }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                            />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Lock size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="password" placeholder="Confirm New Password" value={form.confirmPassword}
                                onChange={(e) => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                                style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--border)', color: 'var(--text-main)', fontSize: '0.95rem', outline: 'none' }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                            />
                        </div>
                    </div>
                </Section>
            </div>
          </div>
        ) : null}
      </main>

      {/* Course Create/Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
          <div className="glass container-mobile-padding" style={{ padding: '2rem', width: '95%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>{currentCourse._id ? 'Edit Course' : 'Create New Course'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
              <input
                type="text" placeholder="Course Title" required
                value={currentCourse.title}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: '#fff' }}
                onChange={(e) => setCurrentCourse({ ...currentCourse, title: e.target.value })}
              />
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="text" placeholder="Thumbnail URL"
                  value={currentCourse.thumbnail || ''}
                  style={{ flex: 1, width: 0, minWidth: 0, padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: '#fff', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, thumbnail: e.target.value })}
                />
                <label className="btn btn-secondary" style={{ padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', minWidth: '100px', justifyContent: 'center' }}>
                  <PlusCircle size={18} />
                  <input type="file" hidden accept=".jpeg,.jpg,.png" onChange={handleFileUpload} />
                  {uploading ? '...' : 'Upload'}
                </label>
              </div>
              <textarea
                placeholder="Description" required rows="3"
                value={currentCourse.description}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: '#fff' }}
                onChange={(e) => setCurrentCourse({ ...currentCourse, description: e.target.value })}
              />
              <select
                required
                value={currentCourse.category}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: currentCourse.category ? 'var(--text-main)' : 'var(--text-muted)', cursor: 'pointer' }}
                onChange={(e) => {
                  if (e.target.value === '__custom__') {
                    setCustomCategory('');
                    setCurrentCourse({ ...currentCourse, category: '__custom__' });
                  } else {
                    setCurrentCourse({ ...currentCourse, category: e.target.value });
                  }
                }}
              >
                <option value="" disabled style={{ background: 'var(--bg-card)', color: 'var(--text-muted)' }}>Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.name} style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>{cat.name}</option>
                ))}
                <option value="__custom__" style={{ background: 'var(--bg-card)', color: 'var(--primary)', fontWeight: '600' }}>＋ Add new category</option>
              </select>
              {currentCourse.category === '__custom__' && (
                <input
                  type="text" placeholder="Enter new category name" required
                  value={customCategory}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--primary)', color: 'var(--text-main)' }}
                  onChange={(e) => setCustomCategory(e.target.value)}
                />
              )}
              <style>{`.price-no-spin::-webkit-outer-spin-button,.price-no-spin::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}.price-no-spin{-moz-appearance:textfield}`}</style>
              <input
                type="number" placeholder="Price (₹)" required
                className="price-no-spin"
                value={currentCourse.price}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: '#fff' }}
                onChange={(e) => setCurrentCourse({ ...currentCourse, price: e.target.value })}
              />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => { setShowModal(false); setCustomCategory(''); }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{currentCourse._id ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Content & FAQ Modal (inline, uses instructor routes) */}
      {contentModalCourse && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
          <div className="glass container-mobile-padding" style={{ width: '95%', maxWidth: '800px', height: '90vh', display: 'flex', flexDirection: 'column', borderRadius: '16px', overflow: 'hidden' }}>
            
            {/* Header */}
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers size={20} color="var(--primary)" /> Manage Content: {contentModalCourse.title}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Build the curriculum and FAQ section for this course.</p>
              </div>
              <button className="btn btn-ghost" onClick={() => setContentModalCourse(null)} style={{ padding: '0.5rem' }}>
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
              <button 
                onClick={() => setContentActiveTab('curriculum')}
                style={{ flex: 1, padding: '1rem', background: contentActiveTab === 'curriculum' ? 'rgba(99,102,241,0.1)' : 'transparent', color: contentActiveTab === 'curriculum' ? 'var(--primary)' : 'var(--text-muted)', border: 'none', borderBottom: contentActiveTab === 'curriculum' ? '2px solid var(--primary)' : '2px solid transparent', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', outline: 'none', transition: 'all 0.2s' }}
              >
                <Video size={18} /> Curriculum Components
              </button>
              <button 
                onClick={() => setContentActiveTab('faqs')}
                style={{ flex: 1, padding: '1rem', background: contentActiveTab === 'faqs' ? 'rgba(99,102,241,0.1)' : 'transparent', color: contentActiveTab === 'faqs' ? 'var(--primary)' : 'var(--text-muted)', border: 'none', borderBottom: contentActiveTab === 'faqs' ? '2px solid var(--primary)' : '2px solid transparent', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', outline: 'none', transition: 'all 0.2s' }}
              >
                <HelpCircle size={18} /> Frequently Asked Questions
              </button>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
              {contentActiveTab === 'curriculum' && (
                <div className="animate-fade-in">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Course Modules</h3>
                    <button onClick={() => setContentModules([...contentModules, { title: '', description: '', videoUrl: '' }])} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', gap: '0.4rem' }}>
                      <Plus size={16} /> Add Module
                    </button>
                  </div>
                  {contentModules.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border)', borderRadius: '12px' }}>
                      <Video size={32} opacity={0.5} style={{ margin: '0 auto 1rem' }} />
                      <p>No curriculum modules added yet.</p>
                      <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Click "Add Module" to start building your course content.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                      {contentModules.map((module, index) => (
                        <div key={index} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', position: 'relative' }}>
                          <div style={{ position: 'absolute', top: '-12px', left: '1.5rem', background: 'var(--primary)', color: '#fff', padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                            Module {index + 1}
                          </div>
                          <button onClick={() => setContentModules(contentModules.filter((_, i) => i !== index))} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.7 }} title="Remove Module">
                            <Trash2 size={18} />
                          </button>
                          <div style={{ display: 'grid', gap: '1rem', marginTop: '0.5rem' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Module Title <span style={{color: '#ef4444'}}>*</span></label>
                              <input type="text" placeholder="e.g. Introduction to React" value={module.title} onChange={(e) => { const n = [...contentModules]; n[index].title = e.target.value; setContentModules(n); }}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff', outline: 'none' }} />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Video URL (Optional)</label>
                              <input type="text" placeholder="https://youtube.com/..." value={module.videoUrl} onChange={(e) => { const n = [...contentModules]; n[index].videoUrl = e.target.value; setContentModules(n); }}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff', outline: 'none' }} />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Description / Learning Outcomes</label>
                              <textarea rows="2" placeholder="What will students learn in this module?" value={module.description} onChange={(e) => { const n = [...contentModules]; n[index].description = e.target.value; setContentModules(n); }}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff', outline: 'none', resize: 'vertical' }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {contentActiveTab === 'faqs' && (
                <div className="animate-fade-in">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Frequently Asked Questions</h3>
                    <button onClick={() => setContentFaqs([...contentFaqs, { question: '', answer: '' }])} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', gap: '0.4rem' }}>
                      <Plus size={16} /> Add FAQ
                    </button>
                  </div>
                  {contentFaqs.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border)', borderRadius: '12px' }}>
                      <HelpCircle size={32} opacity={0.5} style={{ margin: '0 auto 1rem' }} />
                      <p>No FAQs added yet.</p>
                      <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Address common student queries before they ask.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                      {contentFaqs.map((faq, index) => (
                        <div key={index} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', position: 'relative' }}>
                          <button onClick={() => setContentFaqs(contentFaqs.filter((_, i) => i !== index))} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.7 }} title="Remove FAQ">
                            <Trash2 size={18} />
                          </button>
                          <div style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Question <span style={{color: '#ef4444'}}>*</span></label>
                              <input type="text" placeholder="e.g. Do I need prior experience?" value={faq.question} onChange={(e) => { const n = [...contentFaqs]; n[index].question = e.target.value; setContentFaqs(n); }}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff', outline: 'none' }} />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Answer <span style={{color: '#ef4444'}}>*</span></label>
                              <textarea rows="2" placeholder="Provide a helpful answer..." value={faq.answer} onChange={(e) => { const n = [...contentFaqs]; n[index].answer = e.target.value; setContentFaqs(n); }}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff', outline: 'none', resize: 'vertical' }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '1rem', background: 'rgba(255,255,255,0.02)' }}>
              <button onClick={() => setContentModalCourse(null)} className="btn btn-ghost" disabled={contentSaving}>Cancel</button>
              <button onClick={handleContentSave} className="btn btn-primary" disabled={contentSaving} style={{ gap: '0.5rem', padding: '0.6rem 2rem' }}>
                <Save size={18} /> {contentSaving ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
