import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Login from './pages/Login';
import Register from './pages/Register';
import CourseDetail from './pages/CourseDetail';
import StudentDashboard from './pages/StudentDashboard';
import AdminPanel from './pages/AdminPanel';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import SettingsPage from './pages/SettingsPage';
import Contact from './pages/Contact';
import Footer from './components/Footer';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to='/login' />;
  if (adminOnly && user.role !== 'admin') return <Navigate to='/' />;
  return children;
};

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (user) return <Navigate to='/' />;
  return children;
};

function AppContent() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main className='container' style={{ flex: 1 }}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/courses' element={<Courses />} />
            <Route path='/login' element={<GuestRoute><Login /></GuestRoute>} />
            <Route path='/register' element={<GuestRoute><Register /></GuestRoute>} />
            <Route path='/course/:id' element={<CourseDetail />} />
            <Route path='/privacy' element={<PrivacyPolicy />} />
            <Route path='/terms' element={<Terms />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/settings' element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path='/forgot-password' element={<GuestRoute><ForgotPassword /></GuestRoute>} />
            <Route path='/reset-password/:token' element={<GuestRoute><ResetPassword /></GuestRoute>} />
            <Route path='/dashboard' element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
            <Route path='/admin' element={<ProtectedRoute adminOnly={true}><AdminPanel /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}