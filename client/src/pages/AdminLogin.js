import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const AdminLogin = () => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    const savedKey = localStorage.getItem('admin_api_key');
    if (savedKey) {
      // Verify the key is still valid
      verifyAndRedirect(savedKey);
    }
  }, []);

  const verifyAndRedirect = async (key) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/careers/applications`, {
        headers: { 'x-api-key': key }
      });
      if (res.ok) {
        navigate('/admin');
      } else {
        localStorage.removeItem('admin_api_key');
      }
    } catch (err) {
      localStorage.removeItem('admin_api_key');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!apiKey.trim()) {
      setError('Please enter your API key');
      return;
    }
    
    setLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/careers/applications`, {
        headers: { 'x-api-key': apiKey.trim() }
      });

      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('admin_api_key', apiKey.trim());
        navigate('/admin');
      } else {
        setError(data.message || 'Invalid API key. Please check and try again.');
      }
    } catch (err) {
      setError('Unable to connect to server. Please check your network connection.');
    }

    setLoading(false);
  };

  return (
    <main className="admin-login-page">
      <div className="login-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
      </div>
      
      <div className="admin-login-card">
        <div className="login-logo">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="url(#gradient)" strokeWidth="2">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0066ff" />
                <stop offset="100%" stopColor="#00d4ff" />
              </linearGradient>
            </defs>
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        
        <h1>Admin Portal</h1>
        <p className="login-subtitle">Enter your credentials to access the hiring dashboard</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="apiKey">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
              </svg>
              API Key
            </label>
            <div className="input-wrapper">
              <input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your admin API key"
                autoComplete="off"
                disabled={loading}
              />
            </div>
          </div>
          
          {error && (
            <div className="form-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4M12 16h.01"/>
              </svg>
              {error}
            </div>
          )}
          
          <button 
            className="btn btn-primary login-btn" 
            type="submit" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="btn-spinner"></span>
                Verifying...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/>
                </svg>
                Sign In
              </>
            )}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Protected area. Authorized personnel only.</p>
        </div>
      </div>
    </main>
  );
};

export default AdminLogin;
