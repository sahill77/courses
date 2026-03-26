import toast from 'react-hot-toast';
import { CheckCircle, XCircle, AlertCircle, Info, Sparkles, CreditCard, BookOpen, UserCheck } from 'lucide-react';

// Custom toast styles
const toastStyles = {
  success: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4)',
  },
  error: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: '#fff',
    boxShadow: '0 10px 40px rgba(245, 87, 108, 0.4)',
  },
  warning: {
    background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    color: '#333',
    boxShadow: '0 10px 40px rgba(252, 182, 159, 0.4)',
  },
  info: {
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    color: '#333',
    boxShadow: '0 10px 40px rgba(168, 237, 234, 0.4)',
  },
};

// Custom toast component with full responsiveness
const CustomToast = ({ icon: Icon, title, message, type = 'success' }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'clamp(0.75rem, 2vw, 1rem)',
      padding: 'clamp(0.875rem, 2.5vw, 1.25rem)',
      borderRadius: 'clamp(10px, 2vw, 12px)',
      minWidth: 'min(280px, 85vw)',
      maxWidth: 'min(500px, 90vw)',
      width: 'auto',
      ...toastStyles[type],
      animation: 'slideIn 0.3s ease-out',
      wordBreak: 'break-word',
      overflowWrap: 'break-word',
    }}
  >
    <div
      style={{
        flexShrink: 0,
        width: 'clamp(32px, 8vw, 40px)',
        height: 'clamp(32px, 8vw, 40px)',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'bounce 0.6s ease-in-out',
      }}
    >
      <Icon size={window.innerWidth < 768 ? 18 : 24} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ 
        fontWeight: 700, 
        fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', 
        marginBottom: '0.25rem',
        lineHeight: 1.3,
      }}>
        {title}
      </div>
      <div style={{ 
        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
        opacity: 0.9,
        lineHeight: 1.4,
      }}>
        {message}
      </div>
    </div>
  </div>
);

// Toast notification functions
export const showToast = {
  // Enrollment Success
  enrollmentSuccess: (courseName) => {
    toast.custom(
      (t) => (
        <CustomToast
          icon={Sparkles}
          title="Enrollment Successful! 🎉"
          message={`You're now enrolled in "${courseName}". Start learning today!`}
          type="success"
        />
      ),
      {
        duration: 4000,
        position: window.innerWidth < 768 ? 'top-center' : 'top-right',
      }
    );
  },

  // Enrollment Error
  enrollmentError: (error) => {
    toast.custom(
      (t) => (
        <CustomToast
          icon={XCircle}
          title="Enrollment Failed"
          message={error || 'Unable to enroll. Please try again.'}
          type="error"
        />
      ),
      {
        duration: 4000,
        position: window.innerWidth < 768 ? 'top-center' : 'top-right',
      }
    );
  },

  // Payment Success
  paymentSuccess: (amount, courseName) => {
    toast.custom(
      (t) => (
        <CustomToast
          icon={CreditCard}
          title="Payment Successful! 💳"
          message={`₹${amount} paid for "${courseName}". Receipt sent to your email.`}
          type="success"
        />
      ),
      {
        duration: 5000,
        position: window.innerWidth < 768 ? 'top-center' : 'top-right',
      }
    );
  },

  // Payment Error
  paymentError: (error) => {
    toast.custom(
      (t) => (
        <CustomToast
          icon={XCircle}
          title="Payment Failed"
          message={error || 'Payment could not be processed. Please try again.'}
          type="error"
        />
      ),
      {
        duration: 4000,
        position: window.innerWidth < 768 ? 'top-center' : 'top-right',
      }
    );
  },

  // Login Success
  loginSuccess: (userName) => {
    toast.custom(
      (t) => (
        <CustomToast
          icon={UserCheck}
          title={`Welcome back, ${userName}! 👋`}
          message="You've successfully logged in."
          type="success"
        />
      ),
      {
        duration: 3000,
        position: window.innerWidth < 768 ? 'top-center' : 'top-right',
      }
    );
  },

  // Login Error
  loginError: (error) => {
    toast.custom(
      (t) => (
        <CustomToast
          icon={XCircle}
          title="Login Failed"
          message={error || 'Invalid credentials. Please try again.'}
          type="error"
        />
      ),
      {
        duration: 4000,
        position: window.innerWidth < 768 ? 'top-center' : 'top-right',
      }
    );
  },

  // Registration Success
  registrationSuccess: () => {
    toast.custom(
      (t) => (
        <CustomToast
          icon={CheckCircle}
          title="Account Created! 🎊"
          message="Welcome to SparksStream! You can now log in."
          type="success"
        />
      ),
      {
        duration: 4000,
        position: window.innerWidth < 768 ? 'top-center' : 'top-right',
      }
    );
  },

  // Registration Error
  registrationError: (error) => {
    toast.custom(
      (t) => (
        <CustomToast
          icon={XCircle}
          title="Registration Failed"
          message={error || 'Unable to create account. Please try again.'}
          type="error"
        />
      ),
      {
        duration: 4000,
        position: window.innerWidth < 768 ? 'top-center' : 'top-right',
      }
    );
  },

  // Course Created
  courseCreated: (courseName) => {
    toast.custom(
      (t) => (
        <CustomToast
          icon={BookOpen}
          title="Course Created! 📚"
          message={`"${courseName}" has been created successfully.`}
          type="success"
        />
      ),
      {
        duration: 4000,
        position: window.innerWidth < 768 ? 'top-center' : 'top-right',
      }
    );
  },

  // Generic Success
  success: (title, message) => {
    toast.custom(
      (t) => (
        <CustomToast
          icon={CheckCircle}
          title={title}
          message={message}
          type="success"
        />
      ),
      {
        duration: 3000,
        position: window.innerWidth < 768 ? 'top-center' : 'top-right',
      }
    );
  },

  // Generic Error
  error: (title, message) => {
    toast.custom(
      (t) => (
        <CustomToast
          icon={XCircle}
          title={title}
          message={message}
          type="error"
        />
      ),
      {
        duration: 4000,
        position: window.innerWidth < 768 ? 'top-center' : 'top-right',
      }
    );
  },

  // Generic Warning
  warning: (title, message) => {
    toast.custom(
      (t) => (
        <CustomToast
          icon={AlertCircle}
          title={title}
          message={message}
          type="warning"
        />
      ),
      {
        duration: 3000,
        position: window.innerWidth < 768 ? 'top-center' : 'top-right',
      }
    );
  },

  // Generic Info
  info: (title, message) => {
    toast.custom(
      (t) => (
        <CustomToast
          icon={Info}
          title={title}
          message={message}
          type="info"
        />
      ),
      {
        duration: 3000,
        position: window.innerWidth < 768 ? 'top-center' : 'top-right',
      }
    );
  },

  // Password Reset Success
  passwordResetSuccess: () => {
    toast.custom(
      (t) => (
        <CustomToast
          icon={CheckCircle}
          title="Password Reset! 🔐"
          message="Your password has been updated successfully."
          type="success"
        />
      ),
      {
        duration: 4000,
        position: window.innerWidth < 768 ? 'top-center' : 'top-right',
      }
    );
  },

  // Profile Updated
  profileUpdated: () => {
    toast.custom(
      (t) => (
        <CustomToast
          icon={CheckCircle}
          title="Profile Updated! ✨"
          message="Your profile has been updated successfully."
          type="success"
        />
      ),
      {
        duration: 3000,
        position: window.innerWidth < 768 ? 'top-center' : 'top-right',
      }
    );
  },
};

// Add animations with media queries for responsiveness
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes bounce {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }

  /* Mobile responsiveness */
  @media (max-width: 767px) {
    @keyframes slideIn {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }
`;
document.head.appendChild(style);

export default showToast;
