import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingOverlay({ isLoading }) {
  if (!isLoading) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        animation: 'fadeIn 0.2s ease-in-out',
      }}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          borderRadius: '16px',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
          border: '1px solid var(--border)',
          minWidth: '200px',
          maxWidth: '90vw',
        }}
      >
        <Loader2
          size={48}
          color="var(--primary)"
          style={{
            animation: 'spin 1s linear infinite',
          }}
        />
        <p
          style={{
            color: 'var(--text-main)',
            fontSize: '0.95rem',
            fontWeight: 500,
            margin: 0,
            textAlign: 'center',
          }}
        >
          Loading...
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
