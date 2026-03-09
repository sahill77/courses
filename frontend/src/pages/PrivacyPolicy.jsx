import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '800px' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', transition: 'var(--transition)' }} onMouseOver={(e) => e.target.style.color = 'var(--primary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>
                <ChevronLeft size={16} /> Back to Home
            </Link>
            <h1 style={{ marginBottom: '2rem' }}>Privacy Policy</h1>
            <div className="glass" style={{ padding: '2.5rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>
                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>1. Information We Collect</h2>
                    <p>We collect information you provide directly to us, such as when you create an account, enroll in a course, or communicate with us. This may include your name, email address, and payment information.</p>
                </section>
                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>2. How We Use Your Information</h2>
                    <p>We use the information we collect to provide, maintain, and improve our services, to process your transactions, and to communicate with you about your courses and updates to SparksStream.</p>
                </section>
                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>3. Data Security</h2>
                    <p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.</p>
                </section>
                <p style={{ marginTop: '3rem', fontSize: '0.85rem' }}>Last updated: March 7, 2026</p>
            </div>
        </div>
    );
}
