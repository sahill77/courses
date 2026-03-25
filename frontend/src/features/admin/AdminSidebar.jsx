import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Menu, X, BarChart2, PlusCircle, Users, Settings, LogOut, GraduationCap, AlertCircle, HelpCircle } from 'lucide-react';

export default function AdminSidebar({ 
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
      {isSidebarOpen && window.innerWidth <= 768 && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, backdropFilter: 'blur(4px)' }} 
        />
      )}
      <aside 
        className={`admin-sidebar ${!isSidebarOpen ? 'collapsed' : ''}`} 
        style={{ 
          padding: '1.25rem 1.5rem',
          position: window.innerWidth <= 768 ? 'fixed' : 'relative',
          zIndex: 1001,
          left: 0,
          top: 0,
          bottom: 0,
          transform: (window.innerWidth <= 768 && !isSidebarOpen) ? 'translateX(-100%)' : 'translateX(0)',
          boxShadow: (window.innerWidth <= 768 && isSidebarOpen) ? '10px 0 30px rgba(0,0,0,0.5)' : 'none',
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
            onClick={() => { setSearchParams({ tab: 'dashboard' }); window.innerWidth <= 768 && setIsSidebarOpen(false); }}
            style={{ justifyContent: 'flex-start', padding: '1rem', fontSize: '1rem', gap: '1rem' }}
          >
            <BarChart2 size={20} style={{ flexShrink: 0 }} /> <span className="nav-text">Dashboard</span>
          </button>
          <button 
            className={`btn ${activeTab === 'courses' ? 'btn-primary' : 'btn-ghost'}`} 
            onClick={() => { setSearchParams({ tab: 'courses' }); window.innerWidth <= 768 && setIsSidebarOpen(false); }}
            style={{ justifyContent: 'flex-start', padding: '1rem', fontSize: '1rem', gap: '1rem' }}
          >
            <BookOpen size={20} style={{ flexShrink: 0 }} /> <span className="nav-text">Manage Courses</span>
          </button>
          <button 
            className={`btn ${activeTab === 'categories' ? 'btn-primary' : 'btn-ghost'}`} 
            onClick={() => { setSearchParams({ tab: 'categories' }); window.innerWidth <= 768 && setIsSidebarOpen(false); }}
            style={{ justifyContent: 'flex-start', padding: '1rem', fontSize: '1rem', gap: '1rem' }}
          >
            <PlusCircle size={20} style={{ flexShrink: 0 }} /> <span className="nav-text">Manage Categories</span>
          </button>
          <button 
            className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-ghost'}`} 
            onClick={() => { setSearchParams({ tab: 'users' }); window.innerWidth <= 768 && setIsSidebarOpen(false); }}
            style={{ justifyContent: 'flex-start', padding: '1rem', fontSize: '1rem', gap: '1rem' }}
          >
            <Users size={20} style={{ flexShrink: 0 }} /> <span className="nav-text">Users & Enrollments</span>
          </button>
          <button 
            className={`btn ${activeTab === 'instructors' ? 'btn-primary' : 'btn-ghost'}`} 
            onClick={() => { setSearchParams({ tab: 'instructors' }); window.innerWidth <= 768 && setIsSidebarOpen(false); }}
            style={{ justifyContent: 'flex-start', padding: '1rem', fontSize: '1rem', gap: '1rem' }}
          >
            <GraduationCap size={20} style={{ flexShrink: 0 }} /> <span className="nav-text">Instructors</span>
          </button>
          <button 
            className={`btn ${activeTab === 'approvals' ? 'btn-primary' : 'btn-ghost'}`} 
            onClick={() => { setSearchParams({ tab: 'approvals' }); window.innerWidth <= 768 && setIsSidebarOpen(false); }}
            style={{ justifyContent: 'flex-start', padding: '1rem', fontSize: '1rem', gap: '1rem' }}
          >
            <AlertCircle size={20} style={{ flexShrink: 0 }} /> <span className="nav-text">Approvals</span>
          </button>
          <button 
            className={`btn ${activeTab === 'help' ? 'btn-primary' : 'btn-ghost'}`} 
            onClick={() => { setSearchParams({ tab: 'help' }); window.innerWidth <= 768 && setIsSidebarOpen(false); }}
            style={{ justifyContent: 'flex-start', padding: '1rem', fontSize: '1rem', gap: '1rem' }}
          >
            <HelpCircle size={20} style={{ flexShrink: 0 }} /> <span className="nav-text">Help Tickets</span>
          </button>
          <button 
            className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-ghost'}`} 
            onClick={() => { setSearchParams({ tab: 'settings' }); window.innerWidth <= 768 && setIsSidebarOpen(false); }}
            style={{ justifyContent: 'flex-start', padding: '1rem', fontSize: '1rem', gap: '1rem' }}
          >
            <Settings size={20} style={{ flexShrink: 0 }} /> <span className="nav-text">Profile Settings</span>
          </button>

          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0 0.5rem', marginBottom: '1rem', justifyContent: !isSidebarOpen ? 'center' : 'flex-start' }}>
               <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem', flexShrink: 0 }}>
                 {user?.name?.charAt(0) || 'A'}
               </div>
               <div className="nav-text" style={{ overflow: 'hidden' }}>
                 <div style={{ fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.name}</div>
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Administrator</div>
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
