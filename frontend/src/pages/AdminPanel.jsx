import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { PlusCircle, Edit, Trash2, Settings, Users, BookOpen, CheckCircle, LogOut, BarChart2, Activity, Save, User, Mail, Lock, Menu, X, Layers, GraduationCap, AlertCircle, ShieldCheck, ShieldOff, Clock, Eye, Video, HelpCircle } from 'lucide-react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../features/admin/AdminSidebar';
import DashboardOverview from '../features/admin/DashboardOverview';
import HelpTicketsTab from '../features/admin/HelpTicketsTab';
import Pagination from '../features/common/Pagination';
import ManageCourseContentModal from '../features/admin/ManageCourseContentModal';
import { showToast } from '../components/Toast';

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

export default function AdminPanel() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('admin_sidebar_open');
    if (saved !== null) return JSON.parse(saved);
    return window.innerWidth > 768;
  });

  useEffect(() => {
    localStorage.setItem('admin_sidebar_open', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);
  const [currentCategory, setCurrentCategory] = useState({ name: '', description: '', icon: '📚', color: '#6366f1', showOnHome: false });
  const [currentCourse, setCurrentCourse] = useState(() => {
    const saved = localStorage.getItem('admin_course_draft');
    return saved ? JSON.parse(saved) : { title: '', description: '', instructor: '', category: '', price: '', thumbnail: '' };
  });
  const [loading, setLoading] = useState(true);
  const [customCategory, setCustomCategory] = useState('');
  const activeTab = searchParams.get('tab') || 'dashboard';
  const [contentModalCourse, setContentModalCourse] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [instructorsList, setInstructorsList] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [pendingCategories, setPendingCategories] = useState([]);
  const [previewCourse, setPreviewCourse] = useState(null);
  const [stats, setStats] = useState({ users: 0, courses: 0, enrollments: 0, instructors: 0 });
  const [helpTickets, setHelpTickets] = useState([]);
  const [uploading, setUploading] = useState(false);

  const ITEMS_PER_PAGE = 5;
  const [coursePage, setCoursePage] = useState(1);
  const [categoryPage, setCategoryPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [instructorPage, setInstructorPage] = useState(1);

  const sortedCourses = [...courses].sort((a, b) => (a.category || '').localeCompare(b.category || ''));
  const totalCoursePages = Math.ceil(sortedCourses.length / ITEMS_PER_PAGE);
  const paginatedCourses = sortedCourses.slice((coursePage - 1) * ITEMS_PER_PAGE, coursePage * ITEMS_PER_PAGE);

  const totalCategoryPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
  const paginatedCategories = categories.slice((categoryPage - 1) * ITEMS_PER_PAGE, categoryPage * ITEMS_PER_PAGE);

  const nonAdminUsers = usersList.filter(u => u.role !== 'admin');
  const totalUserPages = Math.ceil(nonAdminUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = nonAdminUsers.slice((userPage - 1) * ITEMS_PER_PAGE, userPage * ITEMS_PER_PAGE);

  const sortedInstructors = [...instructorsList].sort((a, b) => {
    // Sort alphabetically by name (case-insensitive)
    const nameA = (a.name || '').toLowerCase();
    const nameB = (b.name || '').toLowerCase();
    return nameA.localeCompare(nameB);
  });
  const totalInstructorPages = Math.ceil(sortedInstructors.length / ITEMS_PER_PAGE);
  const paginatedInstructors = sortedInstructors.slice((instructorPage - 1) * ITEMS_PER_PAGE, instructorPage * ITEMS_PER_PAGE);

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
      const { data } = await axios.get('/admin/categories');
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPendingCategories = async () => {
    try {
      const { data } = await axios.get('/admin/pending-categories');
      setPendingCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

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

  const fetchInstructors = async () => {
    try {
      const { data} = await axios.get('/admin/instructors');
      setInstructorsList(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHelpTickets = async () => {
    try {
      const { data } = await axios.get('/admin/help-tickets');
      setHelpTickets(data);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchPendingCourses = async () => {
    try {
      const { data } = await axios.get('/admin/pending-courses');
      setPendingCourses(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Admin actions for instructors
  const handleApproveInstructor = async (id) => {
    try {
      await axios.put(`/admin/instructors/${id}/approve`);
      fetchInstructors();
      fetchPendingCourses();
      showToast.success('Instructor Approved', 'Instructor has been approved successfully');
    } catch (err) { 
      showToast.error('Approval Failed', 'Failed to approve instructor');
    }
  };
  const handleBlockInstructor = async (id) => {
    if (!window.confirm('Block this instructor? Their account will be suspended.')) return;
    try {
      await axios.put(`/admin/instructors/${id}/block`);
      fetchInstructors();
      showToast.success('Instructor Blocked', 'Instructor account has been suspended');
    } catch (err) { 
      showToast.error('Block Failed', 'Failed to block instructor');
    }
  };
  const handleUnblockInstructor = async (id) => {
    try {
      await axios.put(`/admin/instructors/${id}/unblock`);
      fetchInstructors();
      showToast.success('Instructor Unblocked', 'Instructor account has been restored');
    } catch (err) { 
      showToast.error('Unblock Failed', 'Failed to unblock instructor');
    }
  };

  // Admin actions for courses
  const handleApproveCourse = async (id) => {
    try {
      await axios.put(`/admin/courses/${id}/approve`);
      fetchPendingCourses();
      fetchCourses();
      showToast.success('Course Approved', 'Course is now live and visible to students');
    } catch (err) { 
      showToast.error('Approval Failed', 'Failed to approve course');
    }
  };
  const handleRejectCourse = async (id) => {
    if (!window.confirm('Are you sure you want to reject and delete this course?')) return;
    try {
      await axios.put(`/admin/courses/${id}/reject`);
      fetchPendingCourses();
      fetchCourses();
      showToast.success('Course Rejected', 'Course has been rejected and removed');
    } catch (err) { 
      showToast.error('Rejection Failed', 'Failed to reject course');
    }
  };
  const handleToggleCourseHome = async (id) => {
    try {
      await axios.put(`/admin/courses/${id}/toggle-home`);
      fetchCourses();
      showToast.success('Visibility Updated', 'Homepage visibility has been toggled');
    } catch (err) { 
      showToast.error('Update Failed', 'Failed to toggle homepage visibility');
    }
  };

  // Admin actions for categories
  const handleApproveCategory = async (id) => {
    try {
      await axios.put(`/admin/categories/${id}/approve`);
      fetchPendingCategories();
      fetchCategories();
      showToast.success('Category Approved', 'Category is now available for courses');
    } catch (err) { 
      showToast.error('Approval Failed', 'Failed to approve category');
    }
  };
  const handleRejectCategory = async (id) => {
    if (!window.confirm('Are you sure you want to reject and delete this category?')) return;
    try {
      await axios.put(`/admin/categories/${id}/reject`);
      fetchPendingCategories();
      fetchCategories();
      showToast.success('Category Rejected', 'Category has been rejected and removed');
    } catch (err) { 
      showToast.error('Rejection Failed', 'Failed to reject category');
    }
  };

  // Admin delete actions
  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await axios.delete(`/admin/categories/${id}`);
      fetchCategories();
      showToast.success('Category Deleted', 'Category has been permanently removed');
    } catch (err) { 
      showToast.error('Delete Failed', 'Failed to delete category');
    }
  };
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? All their enrollments will be removed.')) return;
    try {
      await axios.delete(`/admin/users/${id}`);
      fetchUsers();
      fetchStats();
      showToast.success('User Deleted', 'User account has been permanently removed');
    } catch (err) { 
      showToast.error('Delete Failed', 'Failed to delete user');
    }
  };
  const handleDeleteInstructor = async (id) => {
    if (!window.confirm('Are you sure you want to delete this instructor? All their courses and enrollments will be removed.')) return;
    try {
      await axios.delete(`/admin/instructors/${id}`);
      fetchInstructors();
      fetchCourses();
      fetchStats();
      showToast.success('Instructor Deleted', 'Instructor and all their courses have been removed');
    } catch (err) { 
      showToast.error('Delete Failed', 'Failed to delete instructor');
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchUsers();
    fetchStats();
    fetchCategories();
    fetchInstructors();
    fetchPendingCourses();
    fetchPendingCategories();
    fetchHelpTickets();
  }, []);

  useEffect(() => {
    if (showModal) {
      localStorage.setItem('admin_course_draft', JSON.stringify(currentCourse));
    } else {
      localStorage.removeItem('admin_course_draft');
    }
  }, [currentCourse, showModal]);

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      showToast.error('Invalid File Type', 'Only JPEG, JPG, and PNG files are allowed');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const { data } = await axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (type === 'course') {
        setCurrentCourse({ ...currentCourse, thumbnail: data.url });
      } else {
        setCurrentCategory({ ...currentCategory, icon: data.url });
      }
      showToast.success('Upload Successful', 'Image has been uploaded');
    } catch (err) {
      showToast.error('Upload Failed', err.response?.data?.error || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentCategory._id) {
        await axios.put(`/categories/${currentCategory._id}`, currentCategory);
        showToast.success('Category Updated', 'Category has been updated successfully');
      } else {
        await axios.post('/categories', currentCategory);
        showToast.success('Category Created', 'New category has been added');
      }
      setShowCategoryModal(false);
      fetchCategories();
      fetchCourses();
    } catch (err) {
      showToast.error('Operation Failed', err.response?.data?.error || 'Failed to save category');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let courseData = { ...currentCourse };
      
      // If adding a new category
      if (courseData.category === '__custom__') {
        if (!customCategory.trim()) {
           showToast.error('Category Required', 'Please enter a category name');
           return;
        }
        try {
          const { data: newCat } = await axios.post('/categories', { name: customCategory.trim() });
          courseData.category = newCat.name;
        } catch (catErr) {
          // If category already exists, just use it
          if (catErr.response?.status === 400) {
            courseData.category = customCategory.trim();
          } else {
            throw catErr;
          }
        }
      }

      if (courseData._id) {
        await axios.put(`/admin/courses/${courseData._id}`, courseData);
        showToast.success('Course Updated', 'Course details have been updated');
      } else {
        await axios.post('/admin/courses', courseData);
        showToast.success('Course Created', 'New course has been added successfully');
      }
      setShowModal(false);
      setCurrentCourse({ title: '', description: '', instructor: '', category: '', price: '', thumbnail: '' });
      setCustomCategory('');
      fetchCourses();
      fetchCategories();
    } catch (err) {
      showToast.error('Operation Failed', err.response?.data?.error || 'Failed to save course');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await axios.delete(`/admin/courses/${id}`);
      fetchCourses();
      showToast.success('Course Deleted', 'Course has been permanently removed');
    } catch (err) {
      showToast.error('Delete Failed', 'Failed to delete course');
    }
  };

  return (
    <div className="admin-layout animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--bg-main)', zIndex: 1000 }}>
      {/* Sidebar */}
      <AdminSidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        activeTab={activeTab} 
        setSearchParams={setSearchParams} 
        user={user} 
        logout={logout} 
        navigate={navigate} 
      />

      {/* Main Content Area */}
      <main className="admin-main" style={{ flex: 1, padding: window.innerWidth <= 768 ? '1rem' : '1.5rem 3rem', overflowY: 'auto', height: '100%' }}>
        {/* Mobile Header Toggle */}
        <div style={{ display: window.innerWidth <= 768 ? 'flex' : 'none', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', background: 'var(--bg-card)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(10px)' }}>
          <button className="btn btn-ghost" onClick={() => setIsSidebarOpen(true)} style={{ padding: '0.5rem' }}>
            <Menu size={24} />
          </button>
          <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--primary)' }}>Admin Panel</span>
        </div>
        {activeTab === 'dashboard' ? (
          <DashboardOverview user={user} stats={stats} usersList={usersList} categories={categories} />
        ) : activeTab === 'courses' ? (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={20} color="var(--primary)" /> Course Inventory
            </h2>
            <button className="btn btn-primary" onClick={() => { setCurrentCourse({ title: '', description: '', instructor: '', category: '', price: '' }); setShowModal(true); }}>
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
                  <th style={{ padding: '1.25rem' }}>Home</th>
                  <th style={{ padding: '1.25rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCourses.map(course => (
                  <tr key={course._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>{course.title}</td>
                    <td style={{ padding: '1rem 1.25rem' }}><span style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>{course.category}</span></td>
                    <td style={{ padding: '1rem 1.25rem' }}>{course.instructor?.name || course.instructor || '—'}</td>
                    <td style={{ padding: '1rem 1.25rem' }}>₹{Math.floor(course.price)}</td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <button 
                        onClick={() => handleToggleCourseHome(course._id)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: course.showOnHome ? 'var(--primary)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 600 }}
                      >
                        {course.showOnHome ? <CheckCircle size={16} /> : <div style={{ width: '16px', height: '16px', border: '2px solid var(--border)', borderRadius: '4px' }} />}
                        {course.showOnHome ? 'Shown' : 'Hidden'}
                      </button>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-ghost" style={{ padding: '0.4rem', color: 'var(--primary)' }} onClick={() => setContentModalCourse(course)} title="Manage Content & FAQs"><Layers size={16} /></button>
                      <button className="btn btn-ghost" style={{ padding: '0.4rem' }} onClick={() => { setCurrentCourse(course); setShowModal(true); }} title="Edit Course Details"><Edit size={16} /></button>
                      <button className="btn btn-ghost" style={{ padding: '0.4rem', color: '#ef4444' }} onClick={() => handleDelete(course._id)} title="Delete Course"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination currentPage={coursePage} totalPages={totalCoursePages} setPage={setCoursePage} />
          </div>
        </div>
      ) : activeTab === 'categories' ? (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PlusCircle size={20} color="var(--primary)" /> All Categories
            </h2>
            <button className="btn btn-primary" onClick={() => { setCurrentCategory({ name: '', description: '', icon: '', color: '#6366f1', showOnHome: false }); setShowCategoryModal(true); }}>
              <PlusCircle size={18} /> Add New Category
            </button>
          </div>
          <div className="glass" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.05)', textAlign: 'left' }}>
                  <th style={{ padding: '1.25rem', width: '80px' }}>Icon</th>
                  <th style={{ padding: '1.25rem', width: '150px' }}>Category Name</th>
                  <th style={{ padding: '1.25rem' }}>Description</th>
                  <th style={{ padding: '1.25rem', width: '120px' }}>Home Page</th>
                  <th style={{ padding: '1.25rem', width: '100px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCategories.map(cat => (
                  <tr key={cat._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 1.25rem', overflow: 'hidden' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', overflow: 'hidden' }}>
                        {cat.icon?.includes('http') || cat.icon?.startsWith('data:image') || cat.icon?.includes('/') ? (
                          <img src={cat.icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: cat.color || 'var(--primary)' }}>{cat.icon || cat.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><strong>{cat.name}</strong></td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.description || '-'}</td>
                    <td style={{ padding: '1rem 1.25rem', overflow: 'hidden' }}>
                      {cat.showOnHome ? (
                        <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}><CheckCircle size={14} /> Visible</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Hidden</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', overflow: 'hidden' }}>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button className="btn btn-ghost" style={{ padding: '0.4rem' }} onClick={() => { setCurrentCategory(cat); setShowCategoryModal(true); }}><Edit size={16} /></button>
                        <button className="btn btn-ghost" style={{ padding: '0.4rem', color: '#ef4444' }} onClick={() => handleDeleteCategory(cat._id)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination currentPage={categoryPage} totalPages={totalCategoryPages} setPage={setCategoryPage} />
          </div>
        </div>
      ) : activeTab === 'users' ? (
        <div className="animate-fade-in">
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} color="var(--primary)" /> Users & Enrollments
            </h2>
          </div>
          <div className="glass" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                  <th style={{ padding: '1.25rem' }}>User Name</th>
                  <th style={{ padding: '1.25rem' }}>Email</th>
                  <th style={{ padding: '1.25rem' }}>Role</th>
                  <th style={{ padding: '1.25rem' }}>Enrolled Courses</th>
                  <th style={{ padding: '1.25rem' }}>Joined On</th>
                  <th style={{ padding: '1.25rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map(userItem => (
                  <tr key={userItem._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>{userItem.name}</td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>{userItem.email}</td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{ 
                        background: userItem.role === 'instructor' ? 'rgba(245,158,11,0.1)' : 'rgba(99,102,241,0.1)', 
                        color: userItem.role === 'instructor' ? '#f59e0b' : 'var(--primary)', 
                        padding: '0.3rem 0.75rem', 
                        borderRadius: '6px', 
                        fontSize: '0.8rem', 
                        fontWeight: 600,
                        textTransform: 'capitalize'
                      }}>
                        {userItem.role}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {userItem.enrolledCourses?.length > 0 ? (
                          userItem.enrolledCourses.map(c => (
                            <div key={c._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', background: 'rgba(99,102,241,0.05)', border: '1px solid var(--border)', padding: '0.4rem 0.75rem', borderRadius: '6px' }}>
                              <span style={{ fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                                {c.title}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-main)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
                                Enrolled: {new Date(c.enrolledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                          ))
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No enrollments</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {new Date(userItem.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <button className="btn btn-ghost" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: '#ef4444' }} onClick={() => handleDeleteUser(userItem._id)}>
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination currentPage={userPage} totalPages={totalUserPages} setPage={setUserPage} />
          </div>
        </div>
      ) : activeTab === 'instructors' ? (
        <div className="animate-fade-in">
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GraduationCap size={20} color="var(--primary)" /> All Instructors
            </h2>
          </div>
          <div className="glass" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                    <th style={{ padding: '1rem', width: '20%', minWidth: '150px' }}>Name</th>
                    <th style={{ padding: '1rem', width: '20%', minWidth: '180px' }}>Email</th>
                    <th style={{ padding: '1rem', width: '10%', minWidth: '90px' }}>Status</th>
                    <th style={{ padding: '1rem', width: '15%', minWidth: '120px' }}>Categories</th>
                    <th style={{ padding: '1rem', width: '8%', minWidth: '70px', textAlign: 'center' }}>Courses</th>
                    <th style={{ padding: '1rem', width: '8%', minWidth: '80px', textAlign: 'center' }}>Students</th>
                    <th style={{ padding: '1rem', width: '19%', minWidth: '180px' }}>Actions</th>
                  </tr>
                </thead>
              <tbody>
                {paginatedInstructors.map(inst => (
                  <tr key={inst._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem 1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(168,85,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a855f7', fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0 }}>
                          {inst.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <strong style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={inst.name}>{inst.name}</strong>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={inst.email}>{inst.email}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, display: 'inline-block',
                        background: inst.isGhost ? 'rgba(148,163,184,0.1)' : inst.isBlocked ? 'rgba(239,68,68,0.1)' : inst.isApproved ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
                        color: inst.isGhost ? '#94a3b8' : inst.isBlocked ? '#ef4444' : inst.isApproved ? '#22c55e' : '#f59e0b'
                      }}>
                        {inst.isGhost ? 'Unreg' : inst.isBlocked ? 'Blocked' : inst.isApproved ? 'Active' : 'Pending'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', maxHeight: '60px', overflow: 'hidden' }}>
                        {inst.categories?.length > 0 ? inst.categories.slice(0, 2).map((cat, i) => (
                          <span key={i} style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', padding: '0.1rem 0.4rem', borderRadius: '3px', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>{cat}</span>
                        )) : <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>—</span>}
                        {inst.categories?.length > 2 && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>+{inst.categories.length - 2}</span>}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <BookOpen size={12} color="var(--primary)" />
                        <strong style={{ fontSize: '0.85rem' }}>{inst.totalCourses}</strong>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Users size={12} color="#22c55e" />
                        <strong style={{ fontSize: '0.85rem' }}>{inst.totalStudents}</strong>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        {!inst.isGhost && !inst.isApproved && !inst.isBlocked && (
                          <button className="btn btn-ghost" style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', color: '#22c55e', whiteSpace: 'nowrap', minWidth: 'auto' }} onClick={() => handleApproveInstructor(inst._id)} title="Approve">
                            <ShieldCheck size={12} />
                          </button>
                        )}
                        {!inst.isGhost && !inst.isBlocked ? (
                          <button className="btn btn-ghost" style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', color: '#ef4444', whiteSpace: 'nowrap', minWidth: 'auto' }} onClick={() => handleBlockInstructor(inst._id)} title="Block">
                            <ShieldOff size={12} />
                          </button>
                        ) : !inst.isGhost && (
                          <button className="btn btn-ghost" style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', color: '#22c55e', whiteSpace: 'nowrap', minWidth: 'auto' }} onClick={() => handleUnblockInstructor(inst._id)} title="Unblock">
                            <ShieldCheck size={12} />
                          </button>
                        )}
                        {inst.isGhost ? (
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>—</span>
                        ) : (
                          <button className="btn btn-ghost" style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', color: '#ef4444', whiteSpace: 'nowrap', minWidth: 'auto' }} onClick={() => handleDeleteInstructor(inst._id)} title="Delete">
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {instructorsList.length === 0 && (
                  <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No instructors registered yet</td></tr>
                )}
              </tbody>
            </table>
            </div>
            <Pagination currentPage={instructorPage} totalPages={totalInstructorPages} setPage={setInstructorPage} />
          </div>
        </div>
      ) : activeTab === 'approvals' ? (
        <div className="animate-fade-in">
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={20} color="var(--primary)" /> Pending Approvals
            </h2>
          </div>

          {/* Pending Instructors */}
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <Clock size={16} /> Pending Instructor Approvals
          </h3>
          <div className="glass" style={{ overflow: 'hidden', marginBottom: '2rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                  <th style={{ padding: '1rem' }}>Name</th>
                  <th style={{ padding: '1rem' }}>Email</th>
                  <th style={{ padding: '1rem' }}>Registered</th>
                  <th style={{ padding: '1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {instructorsList.filter(i => !i.isGhost && !i.isApproved && !i.isBlocked).map(inst => (
                  <tr key={inst._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(168,85,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a855f7', fontWeight: 'bold', fontSize: '0.85rem' }}>
                          {inst.name?.charAt(0) || '?'}
                        </div>
                        <strong>{inst.name}</strong>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{inst.email}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(inst.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button className="btn btn-primary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleApproveInstructor(inst._id)}>
                          <ShieldCheck size={14} /> Approve
                        </button>
                        <button className="btn btn-ghost" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', color: '#ef4444' }} onClick={() => handleBlockInstructor(inst._id)}>
                          <ShieldOff size={14} /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {instructorsList.filter(i => !i.isGhost && !i.isApproved && !i.isBlocked).length === 0 && (
                  <tr><td colSpan="4" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>No pending instructor approvals</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pending Categories */}
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <Layers size={16} /> Pending Category Approvals
          </h3>
          <div className="glass" style={{ overflow: 'hidden', marginBottom: '2rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                  <th style={{ padding: '1rem', width: '80px' }}>Icon</th>
                  <th style={{ padding: '1rem', width: '25%' }}>Category Name</th>
                  <th style={{ padding: '1rem', width: '100%' }}>Description</th>
                  <th style={{ padding: '1rem', whiteSpace: 'nowrap' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingCategories.map(cat => (
                  <tr key={cat._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: cat.color || 'var(--primary)', fontWeight: 'bold' }}>
                        {cat.icon?.includes('http') || cat.icon?.startsWith('data:image') || cat.icon?.includes('/') ? (
                          <img src={cat.icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          cat.icon || cat.name.charAt(0).toUpperCase()
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><strong>{cat.name}</strong></td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.description || '-'}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', whiteSpace: 'nowrap' }}>
                        <button className="btn btn-primary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleApproveCategory(cat._id)}>
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button className="btn btn-ghost" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', color: '#ef4444' }} onClick={() => handleRejectCategory(cat._id)}>
                          <X size={14} /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pendingCategories.length === 0 && (
                  <tr><td colSpan="4" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>No pending category approvals</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pending Courses */}
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <BookOpen size={16} /> Pending Course Approvals
          </h3>
          <div className="glass" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                  <th style={{ padding: '1rem' }}>Course Title</th>
                  <th style={{ padding: '1rem' }}>Instructor</th>
                  <th style={{ padding: '1rem' }}>Category</th>
                  <th style={{ padding: '1rem' }}>Price</th>
                  <th style={{ padding: '1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingCourses.map(course => (
                  <tr key={course._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem 1rem' }}><strong>{course.title}</strong></td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{course.instructor}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>{course.category}</span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>₹{Math.floor(course.price)}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <button className="btn btn-ghost" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', color: 'var(--primary)' }} onClick={() => setPreviewCourse(course)}>
                          <Eye size={14} /> Preview
                        </button>
                        <button className="btn btn-primary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleApproveCourse(course._id)}>
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button className="btn btn-ghost" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', color: '#ef4444' }} onClick={() => handleRejectCourse(course._id)}>
                          <X size={14} /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pendingCourses.length === 0 && (
                  <tr><td colSpan="5" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>No pending course approvals</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'help' ? (
        <HelpTicketsTab helpTickets={helpTickets} fetchHelpTickets={fetchHelpTickets} />
      ) : activeTab === 'settings' ? (
        <div className="animate-fade-in" style={{ maxWidth: '600px' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings size={20} color="var(--primary)" /> Profile Settings
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>Update your administrator account details.</p>
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
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="text" placeholder="Thumbnail URL"
                  value={currentCourse.thumbnail || ''}
                  style={{ flex: 1, width: 0, minWidth: 0, padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: '#fff', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, thumbnail: e.target.value })}
                />
                <label className="btn btn-secondary" style={{ padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', minWidth: '100px', justifyContent: 'center' }}>
                  <PlusCircle size={18} />
                  <input type="file" hidden accept=".jpeg,.jpg,.png" onChange={(e) => handleFileUpload(e, 'course')} />
                  {uploading ? '...' : 'Upload'}
                </label>
              </div>
              <textarea
                placeholder="Description" required rows="3"
                value={currentCourse.description}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: '#fff' }}
                onChange={(e) => setCurrentCourse({ ...currentCourse, description: e.target.value })}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <select
                  required
                  value={currentCourse.instructor}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: currentCourse.instructor ? 'var(--text-main)' : 'var(--text-muted)', cursor: 'pointer' }}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, instructor: e.target.value })}
                >
                  <option value="" disabled>Select Instructor</option>
                  {instructorsList.map(inst => (
                    <option key={inst._id} value={inst._id}>{inst.name}</option>
                  ))}
                  {instructorsList.length === 0 && <option value="" disabled>No instructors found</option>}
                </select>
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
                  <option value="" disabled>Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                  <option value="__custom__">＋ Add new category</option>
                </select>
                {currentCourse.category === '__custom__' && (
                  <input
                    type="text" placeholder="Enter new category name" required
                    value={customCategory}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--primary)', color: 'var(--text-main)', marginTop: '0.5rem' }}
                    onChange={(e) => setCustomCategory(e.target.value)}
                  />
                )}
              </div>
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
      {showCategoryModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass container-mobile-padding" style={{ padding: '2rem', width: '95%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>{currentCategory._id ? 'Edit Category' : 'Create New Category'}</h2>
            <form onSubmit={handleCategorySubmit} style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Category Name</label>
                <input
                  type="text" placeholder="e.g. Development" required
                  value={currentCategory.name}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: '#fff' }}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Description</label>
                <textarea
                  placeholder="Short description for home page..." required rows="2"
                  value={currentCategory.description}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: '#fff' }}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Icon (Emoji or URL)</label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="text" placeholder="💻 or URL (Leave blank for auto-logo)"
                      value={currentCategory.icon}
                      style={{ flex: 1, width: 0, minWidth: 0, padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: '#fff', fontSize: '1rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                      onChange={(e) => setCurrentCategory({ ...currentCategory, icon: e.target.value })}
                    />
                    <label className="btn btn-secondary" style={{ padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', minWidth: '100px', justifyContent: 'center' }}>
                      <PlusCircle size={18} />
                      <input type="file" hidden accept=".jpeg,.jpg,.png" onChange={(e) => handleFileUpload(e, 'category')} />
                      {uploading ? '...' : 'Upload'}
                    </label>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Color</label>
                  <input
                    type="color"
                    value={currentCategory.color || '#6366f1'}
                    style={{ width: '100%', height: '45px', padding: '0.2rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', cursor: 'pointer' }}
                    onChange={(e) => setCurrentCategory({ ...currentCategory, color: e.target.value })}
                  />
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.5rem 0' }}>
                <input
                  type="checkbox"
                  checked={currentCategory.showOnHome}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, showOnHome: e.target.checked })}
                  style={{ width: '18px', height: '18px' }}
                />
                <span>Show on Home Page</span>
              </label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowCategoryModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{currentCategory._id ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {contentModalCourse && (
        <ManageCourseContentModal 
          course={contentModalCourse} 
          onClose={() => setContentModalCourse(null)} 
          onSaveSuccess={() => { setContentModalCourse(null); fetchCourses(); }} 
        />
      )}

      {/* Course Preview Modal (for admin review before approval) */}
      {previewCourse && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 }}>
          <div className="glass" style={{ width: '95%', maxWidth: '750px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', borderRadius: '16px', overflow: 'hidden' }}>
            
            {/* Header */}
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Eye size={20} color="var(--primary)" /> Course Review
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Review this course before approving or rejecting.</p>
              </div>
              <button className="btn btn-ghost" onClick={() => setPreviewCourse(null)} style={{ padding: '0.5rem' }}>
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
              {/* Course Info */}
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {previewCourse.thumbnail && (
                  <img src={previewCourse.thumbnail} alt={previewCourse.title} style={{ width: '180px', height: '120px', objectFit: 'cover', borderRadius: '10px', border: '1px solid var(--border)' }} />
                )}
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>{previewCourse.title}</h3>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    <span style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>{previewCourse.category}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>by <strong>{previewCourse.instructor}</strong></span>
                    <span style={{ fontWeight: 700 }}>₹{Math.floor(previewCourse.price)}</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>{previewCourse.description}</p>
                </div>
              </div>

              {/* Curriculum Modules */}
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <Video size={16} /> Curriculum Modules ({previewCourse.content?.length || 0})
              </h4>
              {previewCourse.content?.length > 0 ? (
                <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '2rem' }}>
                  {previewCourse.content.map((mod, i) => (
                    <div key={i} style={{ background: 'rgba(0,0,0,0.15)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                        <span style={{ background: 'var(--primary)', color: '#fff', padding: '1px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800 }}>Module {i + 1}</span>
                        <strong style={{ fontSize: '0.95rem' }}>{mod.title || 'Untitled'}</strong>
                      </div>
                      {mod.description && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.3rem' }}>{mod.description}</p>}
                      {mod.videoUrl && <p style={{ fontSize: '0.8rem', marginTop: '0.3rem' }}><span style={{ color: 'var(--text-muted)' }}>Video:</span> <a href={mod.videoUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>{mod.videoUrl}</a></p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem', fontStyle: 'italic' }}>No curriculum modules added.</p>
              )}

              {/* FAQs */}
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <HelpCircle size={16} /> FAQs ({previewCourse.faqs?.length || 0})
              </h4>
              {previewCourse.faqs?.length > 0 ? (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {previewCourse.faqs.map((faq, i) => (
                    <div key={i} style={{ background: 'rgba(0,0,0,0.15)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem' }}>
                      <strong style={{ fontSize: '0.9rem', display: 'block', marginBottom: '0.3rem' }}>Q: {faq.question}</strong>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>A: {faq.answer}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>No FAQs added.</p>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '1.25rem 2rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', background: 'rgba(255,255,255,0.02)' }}>
              <button className="btn btn-ghost" onClick={() => setPreviewCourse(null)}>Close</button>
              <button className="btn btn-ghost" style={{ color: '#ef4444' }} onClick={() => { handleRejectCourse(previewCourse._id); setPreviewCourse(null); }}>
                <X size={16} /> Reject
              </button>
              <button className="btn btn-primary" style={{ gap: '0.5rem' }} onClick={() => { handleApproveCourse(previewCourse._id); setPreviewCourse(null); }}>
                <CheckCircle size={16} /> Approve Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
