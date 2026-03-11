import React from 'react';
import { Link } from 'react-router-dom';
import { User, BookOpen } from 'lucide-react';

export default function CourseCard({ course }) {
  return (
    <div className="glass card animate-fade-in" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '160px', overflow: 'hidden', position: 'relative' }}>
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(45deg, #1e293b, #334155)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={48} color="var(--primary)" opacity={0.5} />
          </div>
        )}
      </div>
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          {course.category}
        </div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', lineHeight: 1.3 }}>{course.title}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><User size={14} /> {course.instructor}</span>
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontWeight: 700, fontSize: '1.25rem', whiteSpace: 'nowrap' }}>₹{Math.floor(course.price)}</span>
          <Link to={`/course/${course._id}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', flexShrink: 0 }}>
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
