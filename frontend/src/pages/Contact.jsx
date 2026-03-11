import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Mail, Send, User, MessageCircle, Info } from 'lucide-react';

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Contact form submitted:', formData);
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        // In a real app, you'd send this to your backend
    };

    return (
        <div className="animate-fade-in" style={{ marginTop: '1.5rem', paddingBottom: '4rem' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', transition: 'var(--transition)' }} onMouseOver={(e) => e.target.style.color = 'var(--primary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>
                <ChevronLeft size={16} /> Back to Home
            </Link>

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <header style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(99,102,241,0.1)', borderRadius: '20px', marginBottom: '1.5rem' }}>
                        <Mail size={32} color="var(--primary)" />
                    </div>
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Get in Touch</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                        Have questions about our courses or need assistance? Our team is here to help you on your learning journey.
                    </p>
                </header>

                <div className="grid stack-on-mobile" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 0.7fr)', gap: '2rem' }}>
                    <div className="glass" style={{ padding: '2.5rem' }}>
                        {submitted ? (
                            <div className="animate-fade-in" style={{ textAlign: 'center', padding: '2rem 0' }}>
                                <div style={{ width: '64px', height: '64px', background: 'rgba(34,197,94,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                    <Send size={32} color="#22c55e" />
                                </div>
                                <h2 style={{ marginBottom: '1rem' }}>Message Sent!</h2>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Thank you for reaching out. We'll get back to you shortly.</p>
                                <button className="btn btn-primary" onClick={() => setSubmitted(false)}>Send Another Message</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="stack-on-mobile">
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Name</label>
                                        <div style={{ position: 'relative' }}>
                                            <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                            <input
                                                type="text" required
                                                placeholder="Your Name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.8rem', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-main)' }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email</label>
                                        <div style={{ position: 'relative' }}>
                                            <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                            <input
                                                type="email" required
                                                placeholder="your@email.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.8rem', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-main)' }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Subject</label>
                                    <div style={{ position: 'relative' }}>
                                        <Info size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        <input
                                            type="text" required
                                            placeholder="How can we help?"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.8rem', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-main)' }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Message</label>
                                    <div style={{ position: 'relative' }}>
                                        <MessageCircle size={16} style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--text-muted)' }} />
                                        <textarea
                                            required rows="5"
                                            placeholder="Write your message here..."
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.8rem', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-main)', resize: 'none' }}
                                        ></textarea>
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem', gap: '0.75rem', marginTop: '0.5rem' }}>
                                    <Send size={18} /> Send Message
                                </button>
                            </form>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="glass" style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Mail size={18} color="var(--primary)" /> Email Support
                            </h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Direct inquiries to:</p>
                            <a href="mailto:support@sparksstream.com" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>support@sparksstream.com</a>
                        </div>

                        <div className="glass" style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Send size={18} color="var(--primary)" /> Social Media
                            </h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>Follow us for the latest updates and course releases.</p>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {/* Social placeholders */}
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', cursor: 'pointer' }}>𝕏</div>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', cursor: 'pointer' }}>in</div>
                            </div>
                        </div>

                        <div className="glass" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.1) 100%)' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Office Hours</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                                Monday - Friday<br />
                                9:00 AM - 6:00 PM EST
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
