import React, { useState } from 'react';
import { X, Plus, Trash2, Video, HelpCircle, Save, Layers } from 'lucide-react';
import axios from '../../services/api';

export default function ManageCourseContentModal({ course, onClose, onSaveSuccess }) {
  const [activeTab, setActiveTab] = useState('curriculum');
  const [content, setContent] = useState(course.content || []);
  const [faqs, setFaqs] = useState(course.faqs || []);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`/admin/courses/${course._id}`, {
        ...course,
        content,
        faqs
      });
      onSaveSuccess();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const addModule = () => setContent([...content, { title: '', description: '', videoUrl: '' }]);
  const removeModule = (index) => setContent(content.filter((_, i) => i !== index));
  const updateModule = (index, field, value) => {
    const newContent = [...content];
    newContent[index][field] = value;
    setContent(newContent);
  };

  const addFaq = () => setFaqs([...faqs, { question: '', answer: '' }]);
  const removeFaq = (index) => setFaqs(faqs.filter((_, i) => i !== index));
  const updateFaq = (index, field, value) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
      {/* Container */}
      <div className="glass container-mobile-padding" style={{ width: '95%', maxWidth: '800px', height: '90vh', display: 'flex', flexDirection: 'column', borderRadius: '16px', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={20} color="var(--primary)" /> Manage Content: {course.title}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Build the curriculum and FAQ section for this course.</p>
          </div>
          <button className="btn btn-ghost" onClick={onClose} style={{ padding: '0.5rem' }}>
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
          <button 
            onClick={() => setActiveTab('curriculum')}
            style={{ flex: 1, padding: '1rem', background: activeTab === 'curriculum' ? 'rgba(99,102,241,0.1)' : 'transparent', color: activeTab === 'curriculum' ? 'var(--primary)' : 'var(--text-muted)', border: 'none', borderBottom: activeTab === 'curriculum' ? '2px solid var(--primary)' : '2px solid transparent', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', outline: 'none', transition: 'all 0.2s' }}
          >
            <Video size={18} /> Curriculum Components
          </button>
          <button 
            onClick={() => setActiveTab('faqs')}
            style={{ flex: 1, padding: '1rem', background: activeTab === 'faqs' ? 'rgba(99,102,241,0.1)' : 'transparent', color: activeTab === 'faqs' ? 'var(--primary)' : 'var(--text-muted)', border: 'none', borderBottom: activeTab === 'faqs' ? '2px solid var(--primary)' : '2px solid transparent', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', outline: 'none', transition: 'all 0.2s' }}
          >
            <HelpCircle size={18} /> Frequently Asked Questions
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          
          {/* CURRICULUM TAB */}
          {activeTab === 'curriculum' && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Course Modules</h3>
                <button onClick={addModule} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', gap: '0.4rem' }}>
                  <Plus size={16} /> Add Module
                </button>
              </div>
              
              {content.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border)', borderRadius: '12px' }}>
                  <Video size={32} opacity={0.5} style={{ margin: '0 auto 1rem' }} />
                  <p>No curriculum modules added yet.</p>
                  <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Click "Add Module" to start building your course content.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {content.map((module, index) => (
                    <div key={index} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '-12px', left: '1.5rem', background: 'var(--primary)', color: '#fff', padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                        Module {index + 1}
                      </div>
                      <button 
                        onClick={() => removeModule(index)}
                        style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.7 }}
                        title="Remove Module"
                      >
                        <Trash2 size={18} />
                      </button>
                      
                      <div style={{ display: 'grid', gap: '1rem', marginTop: '0.5rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Module Title <span style={{color: '#ef4444'}}>*</span></label>
                          <input 
                            type="text" placeholder="e.g. Introduction to React" 
                            value={module.title} onChange={(e) => updateModule(index, 'title', e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff', outline: 'none' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Video URL (Optional)</label>
                          <input 
                            type="text" placeholder="https://youtube.com/..." 
                            value={module.videoUrl} onChange={(e) => updateModule(index, 'videoUrl', e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff', outline: 'none' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Description / Learning Outcomes</label>
                          <textarea 
                            rows="2" placeholder="What will students learn in this module?"
                            value={module.description} onChange={(e) => updateModule(index, 'description', e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff', outline: 'none', resize: 'vertical' }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* FAQS TAB */}
          {activeTab === 'faqs' && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Frequently Asked Questions</h3>
                <button onClick={addFaq} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', gap: '0.4rem' }}>
                  <Plus size={16} /> Add FAQ
                </button>
              </div>
              
              {faqs.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border)', borderRadius: '12px' }}>
                  <HelpCircle size={32} opacity={0.5} style={{ margin: '0 auto 1rem' }} />
                  <p>No FAQs added yet.</p>
                  <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Address common student queries before they ask.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {faqs.map((faq, index) => (
                    <div key={index} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', position: 'relative' }}>
                      <button 
                        onClick={() => removeFaq(index)}
                        style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.7 }}
                        title="Remove FAQ"
                      >
                        <Trash2 size={18} />
                      </button>
                      
                      <div style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Question <span style={{color: '#ef4444'}}>*</span></label>
                          <input 
                            type="text" placeholder="e.g. Do I need prior experience?" 
                            value={faq.question} onChange={(e) => updateFaq(index, 'question', e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff', outline: 'none', paddingRight: '2.5rem' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Answer <span style={{color: '#ef4444'}}>*</span></label>
                          <textarea 
                            rows="2" placeholder="Provide a helpful answer..."
                            value={faq.answer} onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff', outline: 'none', resize: 'vertical' }}
                          />
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
          <button onClick={onClose} className="btn btn-ghost" disabled={saving}>Cancel</button>
          <button onClick={handleSave} className="btn btn-primary" disabled={saving} style={{ gap: '0.5rem', padding: '0.6rem 2rem' }}>
            <Save size={18} /> {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>

      </div>
    </div>
  );
}
