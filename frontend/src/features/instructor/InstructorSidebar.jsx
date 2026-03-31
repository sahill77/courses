import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Menu, X, BarChart2, Users, Settings, LogOut, GraduationCap } from 'lucide-react';

export default function InstructorSidebar({ 
  isSidebarOpen, 
  setIsSidebarOpen, 
  activeTab, 
  setSearchParams, 
  user, 
  logout, 
  navigate 
}) {
  return (
    <>
      <div 
        className={`sidebar-backdrop ${isSidebarOpen ? 'visible' : ''}`}
        onClick={() => setIsSidebarOpen(false)} 
      />
      <aside 
        className={`admin-sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`} 
        style={{ 
          padding: '1.25rem 1.5rem',
          left: 0,
          top: 0,
          bottom: 0,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s, min-width 0.3s'
        }}
      >
        <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '0.5rem' }}>
          <Link to="/" className="admin-logo-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary)', textDecoration: 'none' }}>
            <BookOpen size={28} style={{ flexShrink: 0 }} /> <span className="nav-text" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>SparksStream</span>
          </Link>
          <button className="btn btn-ghost" onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ padding: '0.5rem', marginLeft: isSidebarOpen ? 'auto' : '0', marginRight: isSidebarOpen ? '-0.5rem' : '0' }}>
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        <div className="admin-nav-links" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', height: '100%' }}>
          <button 
            className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-ghost'}`} 
            onClick={() => { setSearchParams({ tab: 'dashboard' }); setIsSidebarOpen(false); }}
            style={{ justifyContent: 'flex-start', padding: '1rem', fontSize: '1rem', gap: '1rem' }}
          >
            <BarChart2 size={20} style={{ flexShrink: 0 }} /> <span className="nav-text">Dashboard</span>
          </button>
          <button 
            className={`btn ${activeTab === 'courses' ? 'btn-primary' : 'btn-ghost'}`} 
            onClick={() => { setSearchParams({ tab: 'courses' }); setIsSidebarOpen(false); }}
            style={{ justifyContent: 'flex-start', padding: '1rem', fontSize: '1rem', gap: '1rem' }}
          >
            <BookOpen size={20} style={{ flexShrink: 0 }} /> <span className="nav-text">My Courses</span>
          </button>
          <button 
            className={`btn ${activeTab === 'students' ? 'btn-primary' : 'btn-ghost'}`} 
            onClick={() => { setSearchParams({ tab: 'students' }); setIsSidebarOpen(false); }}
            style={{ justifyContent: 'flex-start', padding: '1rem', fontSize: '1rem', gap: '1rem' }}
          >
            <Users size={20} style={{ flexShrink: 0 }} /> <span className="nav-text">My Students</span>
          </button>
          <button 
            className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-ghost'}`} 
            onClick={() => { setSearchParams({ tab: 'settings' }); setIsSidebarOpen(false); }}
            style={{ justifyContent: 'flex-start', padding: '1rem', fontSize: '1rem', gap: '1rem' }}
          >
            <Settings size={20} style={{ flexShrink: 0 }} /> <span className="nav-text">Profile Settings</span>
          </button>

          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0 0.5rem', marginBottom: '1rem', justifyContent: !isSidebarOpen ? 'center' : 'flex-start' }}>
               <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e', fontWeight: 'bold', fontSize: '1.2rem', flexShrink: 0 }}>
                 {user?.name?.charAt(0) || 'I'}
               </div>
               <div className="nav-text" style={{ overflow: 'hidden' }}>
                 <div style={{ fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.name}</div>
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Instructor</div>
               </div>
            </div>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="btn btn-ghost"
              style={{ width: '100%', justifyContent: !isSidebarOpen ? 'center' : 'flex-start', padding: '1rem', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', gap: '1rem' }}
            >
              <LogOut size={16} style={{ flexShrink: 0 }} /> <span className="nav-text">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
