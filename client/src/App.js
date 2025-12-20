import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import OurModel from './pages/OurModel';
import Portfolio from './pages/Portfolio';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <div className="app">
        <ScrollToTop />
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes with Navbar and Footer */}
            <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
            <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
            <Route path="/our-model" element={<><Navbar /><OurModel /><Footer /></>} />
            <Route path="/portfolio" element={<><Navbar /><Portfolio /><Footer /></>} />
            <Route path="/careers" element={<><Navbar /><Careers /><Footer /></>} />
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
      </div>
    </Router>
  );
}

export default App;
