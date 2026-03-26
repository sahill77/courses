import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { queryClient } from './lib/queryClient';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LoadingProvider, useLoading } from './context/LoadingContext';
import { setLoadingCallbacks } from './services/api';
import Navbar from './components/Navbar';
import LoadingOverlay from './components/LoadingOverlay';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Login from './pages/Login';
import Register from './pages/Register';
import CourseDetail from './pages/CourseDetail';
import StudentDashboard from './pages/StudentDashboard';
import AdminPanel from './pages/AdminPanel';
import InstructorPanel from './pages/InstructorPanel';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import SettingsPage from './pages/SettingsPage';
import Contact from './pages/Contact';
import HelpCenter from './pages/HelpCenter';
import LearningMode from './pages/LearningMode';
import Footer from './components/Footer';

// Requires login; admins/instructors are redirected to their panels
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to='/login' />;
  if (user.role === 'admin') return <Navigate to='/admin' />;
  if (user.role === 'instructor') return <Navigate to='/instructor' />;
  return children;
};

// Admin-only route
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to='/login' />;
  if (user.role !== 'admin') return <Navigate to='/' />;
  return children;
};

// Instructor-only route
const InstructorRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to='/login' />;
  if (user.role !== 'instructor') return <Navigate to='/' />;
  return children;
};

// Redirect logged-in users away from guest pages
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (user) {
    if (user.role === 'admin') return <Navigate to='/admin' />;
    if (user.role === 'instructor') return <Navigate to='/instructor' />;
    return <Navigate to='/' />;
  }
  return children;
};

// Redirect admins/instructors away from user-facing pages
const AdminRedirect = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (user?.role === 'admin') return <Navigate to='/admin' />;
  if (user?.role === 'instructor') return <Navigate to='/instructor' />;
  return children;
};

function AppContent() {
  const { user } = useAuth();
  const { isLoading, showLoading, hideLoading } = useLoading();
  const isAdmin = user?.role === 'admin';
  const isInstructor = user?.role === 'instructor';

  // Set loading callbacks for axios interceptors
  useEffect(() => {
    setLoadingCallbacks(showLoading, hideLoading);
  }, [showLoading, hideLoading]);

  return (
    <Router>
      <LoadingOverlay isLoading={isLoading} />
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: 'transparent',
            boxShadow: 'none',
            padding: 0,
          },
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
        {!isAdmin && !isInstructor && <Navbar />}
        <main className='container' style={{ flex: '1 0 auto', paddingBottom: '2rem' }}>
          <Routes>
            {/* Public user-facing pages — admins/instructors get bounced */}
            <Route path='/' element={<AdminRedirect><Home /></AdminRedirect>} />
            <Route path='/courses' element={<AdminRedirect><Courses /></AdminRedirect>} />
            <Route path='/course/:id' element={<AdminRedirect><CourseDetail /></AdminRedirect>} />
            <Route path='/contact' element={<AdminRedirect><Contact /></AdminRedirect>} />
            <Route path='/help' element={<HelpCenter />} />
            <Route path='/privacy' element={<PrivacyPolicy />} />
            <Route path='/terms' element={<Terms />} />

            {/* Guest-only routes */}
            <Route path='/login' element={<GuestRoute><Login /></GuestRoute>} />
            <Route path='/register' element={<GuestRoute><Register /></GuestRoute>} />
            <Route path='/forgot-password' element={<GuestRoute><ForgotPassword /></GuestRoute>} />
            <Route path='/reset-password/:token' element={<GuestRoute><ResetPassword /></GuestRoute>} />

            {/* Student-only routes */}
            <Route path='/dashboard' element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
            <Route path='/learn/:id' element={<ProtectedRoute><LearningMode /></ProtectedRoute>} />
            <Route path='/settings' element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

            {/* Admin-only routes */}
            <Route path='/admin' element={<AdminRoute><AdminPanel /></AdminRoute>} />

            {/* Instructor-only routes */}
            <Route path='/instructor' element={<InstructorRoute><InstructorPanel /></InstructorRoute>} />

            <Route path='*' element={<Navigate to='/' />} />
          </Routes>
        </main>
        {!isAdmin && !isInstructor && <Footer />}
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LoadingProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </LoadingProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}