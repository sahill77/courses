import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { CheckCircle, XCircle, AlertCircle, Info, BookOpen } from 'lucide-react';

// Simple, modern toast with website logo
const CustomToast = ({ type, title, message }) => {
  const config = {
    success: {
      icon: CheckCircle,
      bg: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%)',
      border: 'rgba(34, 197, 94, 0.3)',
      iconColor: '#22c55e',
      titleColor: '#22c55e'
    },
    error: {
      icon: XCircle,
      bg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)',
      border: 'rgba(239, 68, 68, 0.3)',
      iconColor: '#ef4444',
      titleColor: '#ef4444'
    },
    warning: {
      icon: AlertCircle,
      bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)',
      border: 'rgba(245, 158, 11, 0.3)',
      iconColor: '#f59e0b',
      titleColor: '#f59e0b'
    },
    info: {
      icon: Info,
      bg: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.05) 100%)',
      border: 'rgba(99, 102, 241, 0.3)',
      iconColor: '#6366f1',
      titleColor: '#6366f1'
    }
  };

  const { icon: StatusIcon, bg, border, iconColor, titleColor } = config[type];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'clamp(0.75rem, 2vw, 1rem)',
        padding: 'clamp(0.875rem, 2vw, 1rem)',
        background: bg,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${border}`,
        borderRadius: 'clamp(10px, 2vw, 12px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        minWidth: 'clamp(280px, 90vw, 360px)',
        maxWidth: 'min(90vw, 420px)',
        color: 'var(--text-main)'
      }}
    >
      {/* Website Logo */}
      <div
        style={{
          flexShrink: 0,
          width: 'clamp(32px, 8vw, 40px)',
          height: 'clamp(32px, 8vw, 40px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(99, 102, 241, 0.15)',
          borderRadius: '8px',
          border: '1px solid rgba(99, 102, 241, 0.3)'
        }}
      >
        <BookOpen size={20} color="#6366f1" strokeWidth={2.5} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.25rem'
          }}
        >
          <StatusIcon size={16} color={iconColor} strokeWidth={2.5} />
          <span
            style={{
              fontWeight: 700,
              fontSize: 'clamp(0.875rem, 2.5vw, 0.95rem)',
              color: titleColor,
              lineHeight: 1.2
            }}
          >
            {title}
          </span>
        </div>
        {message && (
          <p
            style={{
              margin: 0,
              fontSize: 'clamp(0.8rem, 2.2vw, 0.875rem)',
              color: 'var(--text-muted)',
              lineHeight: 1.4,
              wordWrap: 'break-word',
              paddingLeft: '1.5rem'
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

// Toast functions
export const showToast = {
  success: (title, message) => {
    toast.custom((t) => <CustomToast type="success" title={title} message={message} />, {
      duration: 4000,
      position: window.innerWidth <= 768 ? 'top-center' : 'top-right'
    });
  },

  error: (title, message) => {
    toast.custom((t) => <CustomToast type="error" title={title} message={message} />, {
      duration: 5000,
      position: window.innerWidth <= 768 ? 'top-center' : 'top-right'
    });
  },

  warning: (title, message) => {
    toast.custom((t) => <CustomToast type="warning" title={title} message={message} />, {
      duration: 4000,
      position: window.innerWidth <= 768 ? 'top-center' : 'top-right'
    });
  },

  info: (title, message) => {
    toast.custom((t) => <CustomToast type="info" title={title} message={message} />, {
      duration: 4000,
      position: window.innerWidth <= 768 ? 'top-center' : 'top-right'
    });
  },

  // Specialized toasts
  loginSuccess: (userName) => {
    showToast.success('Welcome Back!', `Hi ${userName}, you're successfully logged in`);
  },

  enrollmentSuccess: (courseName) => {
    showToast.success('Enrollment Successful', `You're now enrolled in ${courseName}`);
  },

  enrollmentError: (error) => {
    showToast.error('Enrollment Failed', error || 'Unable to enroll in this course');
  },

  paymentSuccess: (amount, courseName) => {
    showToast.success('Payment Successful', `₹${amount} paid for ${courseName}`);
  },

  paymentError: (error) => {
    showToast.error('Payment Failed', error || 'Payment could not be processed');
  }
};

// Toaster component with responsive positioning
export default function Toast() {
  return (
    <Toaster
      position={window.innerWidth <= 768 ? 'top-center' : 'top-right'}
      toastOptions={{
        style: {
          background: 'transparent',
          boxShadow: 'none',
          padding: 0
        }
      }}
      containerStyle={{
        top: window.innerWidth <= 768 ? '80px' : '20px',
        right: window.innerWidth <= 768 ? 'auto' : '20px',
        left: window.innerWidth <= 768 ? '50%' : 'auto',
        transform: window.innerWidth <= 768 ? 'translateX(-50%)' : 'none'
      }}
    />
  );
}
