import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Instagram, Facebook, MessageCircle, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    

    return (
        <footer className="glass" style={{ marginTop: '4rem', padding: '4rem 0 2rem', borderTop: '1px solid var(--border)' }}>
            <div className="container">
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>

                    {/* Brand Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary)' }}>
                            <BookOpen size={28} /> <span>SparksStream</span>
                        </Link>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                            Empowering learners worldwide with industry-leading IT courses and hands-on technical skills.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <a href="https://www.instagram.com/sparkstoideas?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ padding: '0.6rem', borderRadius: '50%' }}>
                                <Instagram size={20} />
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ padding: '0.6rem', borderRadius: '50%' }}>
                                <Facebook size={20} />
                            </a>
                            <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ padding: '0.6rem', borderRadius: '50%' }}>
                                <MessageCircle size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--header-text)' }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none', display: 'grid', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                            <li><Link to="/" style={{ transition: 'var(--transition)' }} onMouseOver={(e) => e.target.style.color = 'var(--primary)'} onMouseOut={(e) => e.target.style.color = 'inherit'}>Browse Courses</Link></li>
                            <li><Link to="/login" style={{ transition: 'var(--transition)' }} onMouseOver={(e) => e.target.style.color = 'var(--primary)'} onMouseOut={(e) => e.target.style.color = 'inherit'}>Login</Link></li>
                            <li><Link to="/register" style={{ transition: 'var(--transition)' }} onMouseOver={(e) => e.target.style.color = 'var(--primary)'} onMouseOut={(e) => e.target.style.color = 'inherit'}>Register</Link></li>
                            <li><Link to="/dashboard" style={{ transition: 'var(--transition)' }} onMouseOver={(e) => e.target.style.color = 'var(--primary)'} onMouseOut={(e) => e.target.style.color = 'inherit'}>My Learning</Link></li>
                        </ul>
                    </div>

                    {/* Support / Legal */}
                    <div>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--header-text)' }}>Support</h4>
                        <ul style={{ listStyle: 'none', display: 'grid', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                            <li><Link to="/privacy" style={{ transition: 'var(--transition)' }} onMouseOver={(e) => e.target.style.color = 'var(--primary)'} onMouseOut={(e) => e.target.style.color = 'inherit'}>Privacy Policy</Link></li>
                            <li><Link to="/terms" style={{ transition: 'var(--transition)' }} onMouseOver={(e) => e.target.style.color = 'var(--primary)'} onMouseOut={(e) => e.target.style.color = 'inherit'}>Terms of Service</Link></li>
                            <li><a href="#" style={{ transition: 'var(--transition)' }} onMouseOver={(e) => e.target.style.color = 'var(--primary)'} onMouseOut={(e) => e.target.style.color = 'inherit'}>Help Center</a></li>
                            <li><Link to="/contact" style={{ transition: 'var(--transition)' }} onMouseOver={(e) => e.target.style.color = 'var(--primary)'} onMouseOut={(e) => e.target.style.color = 'inherit'}>Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--header-text)' }}>Contact</h4>
                        <ul style={{ listStyle: 'none', display: 'grid', gap: '1rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                <MapPin size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                <span>123 Tech Avenue, Silicon Valley, CA 94025</span>
                            </li>
                            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <Phone size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
                                <span>+1 (555) 000-1234</span>
                            </li>
                            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <Mail size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
                                <span>support@sparksstream.com</span>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div style={{ paddingTop: '2rem', borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <p>&copy; {currentYear} SparksStream. All rights reserved. Made with ❤️ by Sparks Developers.</p>
                </div>
            </div>
        </footer>
    );
}
