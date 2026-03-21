import React from 'react';

export default function Pagination({ currentPage, totalPages, setPage }) {
    if (totalPages <= 1) return null;
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1.5rem', padding: '1rem' }}>
            <button className="btn btn-ghost" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} style={{ padding: '0.4rem 0.8rem', opacity: currentPage === 1 ? 0.5 : 1 }}>Prev</button>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Page {currentPage} of {totalPages}</span>
            <button className="btn btn-ghost" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)} style={{ padding: '0.4rem 0.8rem', opacity: currentPage === totalPages ? 0.5 : 1 }}>Next</button>
        </div>
    );
}
