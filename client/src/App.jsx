import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ReportFormPage from './pages/ReportFormPage';
import MyReportsPage from './pages/MyReportsPage';
import ReportDetailsPage from './pages/ReportDetailsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import PageTransition from './components/animations/PageTransition';
import InitialLoader from './components/animations/InitialLoader';

// Animated background wrapper
const GlobalBackground = () => (
  <div className="fixed inset-0 z-[-1] pointer-events-none bg-cyber-dark overflow-hidden">
    <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyber-accent rounded-full blur-[150px] opacity-10 animate-float"></div>
    <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[150px] opacity-10 animate-float" style={{ animationDelay: '-3s' }}></div>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes key={location.pathname} location={location}>
        {/* Public Routes */}
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />

        {/* Protected User Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/report" element={<PageTransition><ReportFormPage /></PageTransition>} />
          <Route path="/my-reports" element={<PageTransition><MyReportsPage /></PageTransition>} />
          <Route path="/reports/:id" element={<PageTransition><ReportDetailsPage /></PageTransition>} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<PageTransition><AdminDashboardPage /></PageTransition>} />
        </Route>

        {/* Catch-all 404 Route */}
        <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <InitialLoader>
      <AuthProvider>
        <Router>
          <GlobalBackground />
          <div className="flex flex-col min-h-screen text-cyber-text font-sans relative z-10 selection:bg-cyber-accent selection:text-white">
            <Navbar />
            <main className="flex-grow flex flex-col relative z-0">
              <AnimatedRoutes />
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </InitialLoader>
  );
}

export default App;
