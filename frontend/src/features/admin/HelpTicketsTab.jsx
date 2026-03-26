import React, { useState } from 'react';
import axios from '../../services/api';
import { HelpCircle, Trash2, Eye } from 'lucide-react';
import Pagination from '../common/Pagination';
import { showToast } from '../../components/Toast';

export default function HelpTicketsTab({ helpTickets, fetchHelpTickets }) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const totalPages = Math.ceil(helpTickets.length / ITEMS_PER_PAGE);
  const paginatedTickets = helpTickets.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleUpdateTicket = async (id, updates) => {
    try {
      await axios.put(`/admin/help-tickets/${id}`, updates);
      fetchHelpTickets();
      if (selectedTicket?._id === id) {
        setSelectedTicket({ ...selectedTicket, ...updates });
      }
      showToast.success('Ticket Updated', 'Help ticket has been updated successfully');
    } catch (err) {
      showToast.error('Update Failed', 'Failed to update ticket');
    }
  };

  const handleDeleteTicket = async (id) => {
    if (!window.confirm('Delete this help ticket?')) return;
    try {
      await axios.delete(`/admin/help-tickets/${id}`);
      fetchHelpTickets();
      if (selectedTicket?._id === id) setSelectedTicket(null);
      showToast.success('Ticket Deleted', 'Help ticket has been permanently removed');
    } catch (err) {
      showToast.error('Delete Failed', 'Failed to delete ticket');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      'in-progress': '#3b82f6',
      resolved: '#22c55e',
      closed: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#22c55e',
      medium: '#f59e0b',
      high: '#ef4444'
    };
    return colors[priority] || '#f59e0b';
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HelpCircle size={20} color="var(--primary)" /> Help Tickets
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          Manage user support requests and help tickets
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedTicket ? '1fr 400px' : '1fr', gap: '1.5rem' }}>
        <div className="glass" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                <th style={{ padding: '1.25rem' }}>Ticket #</th>
                <th style={{ padding: '1.25rem' }}>User</th>
                <th style={{ padding: '1.25rem' }}>Subject</th>
                <th style={{ padding: '1.25rem' }}>Status</th>
                <th style={{ padding: '1.25rem' }}>Priority</th>
                <th style={{ padding: '1.25rem' }}>Date</th>
                <th style={{ padding: '1.25rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTickets.map(ticket => (
                <tr key={ticket._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ 
                      fontSize: '0.8rem', 
                      fontWeight: 700, 
                      color: 'var(--primary)',
                      background: 'rgba(99,102,241,0.1)',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px'
                    }}>
                      {ticket.ticketNumber}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ fontWeight: 600 }}>{ticket.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ticket.email}</div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', maxWidth: '250px' }}>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ticket.subject}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <select
                      value={ticket.status}
                      onChange={(e) => handleUpdateTicket(ticket._id, { ...ticket, status: e.target.value })}
                      style={{
                        background: `rgba(${getStatusColor(ticket.status)}, 0.1)`,
                        color: getStatusColor(ticket.status),
                        border: 'none',
                        padding: '0.3rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <select
                      value={ticket.priority}
                      onChange={(e) => handleUpdateTicket(ticket._id, { ...ticket, priority: e.target.value })}
                      style={{
                        background: `rgba(${getPriorityColor(ticket.priority)}, 0.1)`,
                        color: getPriorityColor(ticket.priority),
                        border: 'none',
                        padding: '0.3rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="btn btn-ghost"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <Eye size={14} /> View
                    </button>
                    <button
                      className="btn btn-ghost"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: '#ef4444' }}
                      onClick={() => handleDeleteTicket(ticket._id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination currentPage={currentPage} totalPages={totalPages} setPage={setCurrentPage} />
        </div>

        {selectedTicket && (
          <div className="glass" style={{ padding: '1.5rem', maxHeight: '600px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem' }}>Ticket Details</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, marginTop: '0.25rem' }}>
                  {selectedTicket.ticketNumber}
                </div>
              </div>
              <button
                className="btn btn-ghost"
                style={{ padding: '0.3rem', fontSize: '0.8rem' }}
                onClick={() => setSelectedTicket(null)}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>From</div>
                <div style={{ fontWeight: 600 }}>{selectedTicket.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{selectedTicket.email}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Subject</div>
                <div style={{ fontWeight: 600 }}>{selectedTicket.subject}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Message</div>
                <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', lineHeight: 1.6, fontSize: '0.9rem' }}>
                  {selectedTicket.message}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Admin Notes</div>
                <textarea
                  value={selectedTicket.adminNotes || ''}
                  onChange={(e) => setSelectedTicket({ ...selectedTicket, adminNotes: e.target.value })}
                  placeholder="Add internal notes..."
                  rows="4"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: 'var(--text-main)', resize: 'vertical' }}
                />
                <button
                  className="btn btn-primary"
                  style={{ marginTop: '0.75rem', width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
                  onClick={() => handleUpdateTicket(selectedTicket._id, { 
                    status: selectedTicket.status, 
                    priority: selectedTicket.priority, 
                    adminNotes: selectedTicket.adminNotes 
                  })}
                >
                  Save Notes
                </button>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                Submitted: {new Date(selectedTicket.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
