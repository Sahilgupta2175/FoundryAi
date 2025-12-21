import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const OurModel = lazy(() => import('./pages/OurModel'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Careers = lazy(() => import('./pages/Careers'));
const JobOpenings = lazy(() => import('./pages/JobOpenings'));
const Contact = lazy(() => import('./pages/Contact'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function App() {
  return (
    <Router>
      <div className="app">
        <ScrollToTop />
        <Suspense fallback={
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: '#0a0a0f'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '3px solid rgba(99, 102, 241, 0.2)',
              borderTopColor: '#6366f1',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          </div>
        }>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes with Navbar and Footer */}
              <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
            <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
            <Route path="/our-model" element={<><Navbar /><OurModel /><Footer /></>} />
            <Route path="/portfolio" element={<><Navbar /><Portfolio /><Footer /></>} />
            <Route path="/careers" element={<><Navbar /><Careers /><Footer /></>} />
            <Route path="/jobs" element={<><Navbar /><JobOpenings /><Footer /></>} />
            <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />
            
            {/* Admin Routes (without Navbar and Footer) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </AnimatePresence>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
