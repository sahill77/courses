import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function Terms() {
    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '800px' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', transition: 'var(--transition)' }} onMouseOver={(e) => e.target.style.color = 'var(--primary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>
                <ChevronLeft size={16} /> Back to Home
            </Link>
            <h1 style={{ marginBottom: '2rem' }}>Terms of Service</h1>
            <div className="glass" style={{ padding: '2.5rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>
                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>1. Acceptance of Terms</h2>
                    <p>By accessing or using SparksStream, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services.</p>
                </section>
                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>2. Course Enrollment</h2>
                    <p>Registration is required to access most of our courses. You are responsible for maintaining the confidentiality of your account credentials.</p>
                </section>
                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>3. Intellectual Property</h2>
                    <p>All content provided on SparksStream, including videos, text, and graphics, is the property of SparksStream or its licensors and is protected by copyright laws.</p>
                </section>
                <p style={{ marginTop: '3rem', fontSize: '0.85rem' }}>Last updated: March 7, 2026</p>
            </div>
        </div>
    );
}
