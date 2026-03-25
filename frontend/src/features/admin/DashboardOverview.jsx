import React from 'react';
import { Users, BookOpen, CheckCircle, Activity, GraduationCap } from 'lucide-react';

export default function DashboardOverview({ user, stats, usersList, categories }) {
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredCourseStats = selectedCategory === 'All'
    ? stats.courseStats
    : stats.courseStats?.filter(c => c.category?.trim().toLowerCase() === selectedCategory.trim().toLowerCase());

  const categoryNames = categories?.map(c => c.name) || [];

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 800 }}>Overview</h1>
        <p style={{ color: 'var(--text-muted)' }}>Welcome back, <strong>{user?.name}</strong>. Here's what's happening on your platform today.</p>
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
        <div className="glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(168,85,247,0.1)', borderRadius: '12px' }}>
            <GraduationCap size={28} color="#a855f7" />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Instructors</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.instructors || 0}</div>
          </div>
        </div>
      </div>

      {/* Enrollment Analytics Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
        {/* Course-wise Analytics (Formerly Popular Courses) */}
        <div className="glass" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GraduationCap size={22} color="var(--primary)" /> Category Enrollments
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Filter by Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  background: 'rgba(30,41,59,0.9)',
                  color: '#fff',
                  border: '1px solid var(--border)',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  outline: 'none',
                  minWidth: '180px'
                }}
              >
                <option value="All" style={{ background: '#1e293b', color: '#fff' }}>All Categories</option>
                {categoryNames.map(cat => (
                  <option key={cat} value={cat} style={{ background: '#1e293b', color: '#fff' }}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', textAlign: 'left' }}>
                  <th style={{ padding: '1rem', fontSize: '0.9rem' }}>Course Title</th>
                  <th style={{ padding: '1rem', fontSize: '0.9rem' }}>Category</th>
                  <th style={{ padding: '1rem', fontSize: '0.9rem', textAlign: 'right' }}>Students</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourseStats?.map((c, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '350px' }} title={c.title}>
                        {c.title}
                      </div>
                      {c.status && c.status !== 'approved' && (
                        <span style={{ fontSize: '0.75rem', color: c.status === 'pending' ? '#f59e0b' : '#ef4444', textTransform: 'capitalize' }}>
                          • {c.status}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        {c.category}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <span style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 700 }}>
                        {c.count} students
                      </span>
                    </td>
                  </tr>
                ))}
                {(!filteredCourseStats || filteredCourseStats.length === 0) && (
                  <tr><td colSpan="3" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No courses found in this category</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Activity size={20} color="var(--primary)" /> Recent Users
        </h2>
        <div className="glass" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                <th style={{ padding: '1.25rem' }}>User Name</th>
                <th style={{ padding: '1.25rem' }}>Email</th>
                <th style={{ padding: '1.25rem' }}>Role</th>
                <th style={{ padding: '1.25rem' }}>Joined On</th>
              </tr>
            </thead>
            <tbody>
              {usersList.filter(u => u.role !== 'admin').slice().reverse().slice(0, 5).map(userItem => (
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
                  <td style={{ padding: '1rem 1.25rem' }}>{new Date(userItem.createdAt || Date.now()).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
