import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiMagnifyingGlass,
  HiArrowRightOnRectangle,
  HiDocumentText,
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiEye,
  HiTrash,
  HiChevronLeft,
  HiChevronRight,
  HiUserCircle,
  HiEnvelope,
  HiPhone,
  HiBriefcase,
  HiCalendar,
  HiArrowDownTray,
} from 'react-icons/hi2';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [adminUser, setAdminUser] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  }, [navigate]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/stats`, {
        headers: getAuthHeaders(),
      });
      
      if (response.status === 401) {
        handleLogout();
        return;
      }
      
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, [handleLogout]);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const statusParam = filter !== 'all' ? `&status=${filter}` : '';
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/applications?page=${currentPage}&limit=10${statusParam}`,
        {
          headers: getAuthHeaders(),
        }
      );
      
      if (response.status === 401) {
        handleLogout();
        return;
      }
      
      const data = await response.json();
      if (data.success) {
        setApplications(data.applications);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    }
    setLoading(false);
  }, [filter, currentPage, handleLogout]);

  useEffect(() => {
    // Check if logged in
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    if (user) {
      setAdminUser(JSON.parse(user));
    }
    
    fetchStats();
    fetchApplications();
  }, [navigate, fetchStats, fetchApplications]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/applications/${applicationId}/status`,
        {
          method: 'PATCH',
          headers: getAuthHeaders(),
          body: JSON.stringify({ status: newStatus }),
        }
      );
      
      const data = await response.json();
      if (data.success) {
        fetchApplications();
        fetchStats();
        if (selectedApplication && selectedApplication._id === applicationId) {
          setSelectedApplication(data.application);
        }
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDelete = async (applicationId) => {
    if (!window.confirm('Are you sure you want to delete this application?')) {
      return;
    }
    
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/applications/${applicationId}`,
        {
          method: 'DELETE',
          headers: getAuthHeaders(),
        }
      );
      
      const data = await response.json();
      if (data.success) {
        fetchApplications();
        fetchStats();
        setSelectedApplication(null);
      }
    } catch (error) {
      console.error('Failed to delete application:', error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { icon: <HiClock />, class: 'status-pending', text: 'Pending' },
      reviewed: { icon: <HiEye />, class: 'status-reviewed', text: 'Reviewed' },
      shortlisted: { icon: <HiCheckCircle />, class: 'status-shortlisted', text: 'Shortlisted' },
      rejected: { icon: <HiXCircle />, class: 'status-rejected', text: 'Rejected' },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`status-badge ${badge.class}`}>
        {badge.icon}
        {badge.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredApplications = applications.filter((app) =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Admin Dashboard</h1>
            <p>Manage job applications</p>
          </div>
          <div className="header-right">
            {adminUser && (
              <div className="admin-info">
                <HiUserCircle />
                <span>{adminUser.username}</span>
              </div>
            )}
            <button onClick={handleLogout} className="logout-button">
              <HiArrowRightOnRectangle />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Stats Cards */}
        {stats && (
          <div className="stats-grid">
            <motion.div
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="stat-icon total">
                <HiDocumentText />
              </div>
              <div className="stat-info">
                <h3>{stats.total}</h3>
                <p>Total Applications</p>
              </div>
            </motion.div>

            <motion.div
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="stat-icon pending">
                <HiClock />
              </div>
              <div className="stat-info">
                <h3>{stats.pending}</h3>
                <p>Pending</p>
              </div>
            </motion.div>

            <motion.div
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="stat-icon shortlisted">
                <HiCheckCircle />
              </div>
              <div className="stat-info">
                <h3>{stats.shortlisted}</h3>
                <p>Shortlisted</p>
              </div>
            </motion.div>

            <motion.div
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="stat-icon recent">
                <HiCalendar />
              </div>
              <div className="stat-info">
                <h3>{stats.recent}</h3>
                <p>Last 7 Days</p>
              </div>
            </motion.div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="controls-bar">
          <div className="filter-buttons">
            {['all', 'pending', 'reviewed', 'shortlisted', 'rejected'].map((status) => (
              <button
                key={status}
                className={`filter-btn ${filter === status ? 'active' : ''}`}
                onClick={() => {
                  setFilter(status);
                  setCurrentPage(1);
                }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <div className="search-box">
            <HiMagnifyingGlass />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Applications Table */}
        <div className="applications-container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner-large"></div>
              <p>Loading applications...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="empty-state">
              <HiDocumentText />
              <h3>No applications found</h3>
              <p>There are no applications matching your criteria.</p>
            </div>
          ) : (
            <>
              <div className="applications-table">
                <div className="table-header">
                  <div className="th name-col">Applicant</div>
                  <div className="th contact-col">Contact</div>
                  <div className="th position-col">Position</div>
                  <div className="th status-col">Status</div>
                  <div className="th date-col">Date</div>
                  <div className="th actions-col">Actions</div>
                </div>

                {filteredApplications.map((app) => (
                  <motion.div
                    key={app._id}
                    className="table-row"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setSelectedApplication(app)}
                  >
                    <div className="td name-col">
                      <div className="applicant-info">
                        <HiUserCircle className="user-avatar" />
                        <div>
                          <p className="applicant-name">{app.name}</p>
                          <p className="applicant-experience">{app.experience || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="td contact-col">
                      <div className="contact-info">
                        <span><HiEnvelope /> {app.email}</span>
                        {app.phone && <span><HiPhone /> {app.phone}</span>}
                      </div>
                    </div>
                    <div className="td position-col">
                      <span className="position-tag">{app.position}</span>
                    </div>
                    <div className="td status-col">
                      {getStatusBadge(app.status)}
                    </div>
                    <div className="td date-col">
                      {formatDate(app.createdAt)}
                    </div>
                    <div className="td actions-col">
                      {app.resumeUrl && (
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action-btn download"
                          onClick={(e) => e.stopPropagation()}
                          title="Download Resume"
                        >
                          <HiArrowDownTray />
                        </a>
                      )}
                      <button
                        className="action-btn view"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedApplication(app);
                        }}
                        title="View Details"
                      >
                        <HiEye />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="pagination">
                  <button
                    className="page-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    <HiChevronLeft />
                  </button>
                  <span className="page-info">
                    Page {currentPage} of {pagination.pages}
                  </span>
                  <button
                    className="page-btn"
                    disabled={currentPage === pagination.pages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    <HiChevronRight />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="modal-overlay" onClick={() => setSelectedApplication(null)}>
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Application Details</h2>
              <button
                className="close-btn"
                onClick={() => setSelectedApplication(null)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3><HiUserCircle /> Applicant Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Name</label>
                    <p>{selectedApplication.name}</p>
                  </div>
                  <div className="detail-item">
                    <label>Email</label>
                    <p>{selectedApplication.email}</p>
                  </div>
                  <div className="detail-item">
                    <label>Phone</label>
                    <p>{selectedApplication.phone || 'Not provided'}</p>
                  </div>
                  <div className="detail-item">
                    <label>Experience</label>
                    <p>{selectedApplication.experience || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3><HiBriefcase /> Position Details</h3>
                <div className="detail-item">
                  <label>Applied Position</label>
                  <p className="position-highlight">{selectedApplication.position}</p>
                </div>
                <div className="detail-item">
                  <label>Application Date</label>
                  <p>{formatDate(selectedApplication.createdAt)}</p>
                </div>
                <div className="detail-item">
                  <label>Current Status</label>
                  <p>{getStatusBadge(selectedApplication.status)}</p>
                </div>
              </div>

              {selectedApplication.resumeUrl && (
                <div className="detail-section">
                  <h3><HiDocumentText /> Resume</h3>
                  <a
                    href={selectedApplication.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resume-link"
                  >
                    <HiArrowDownTray />
                    Download Resume
                  </a>
                </div>
              )}

              <div className="detail-section">
                <h3>Update Status</h3>
                <div className="status-buttons">
                  {['pending', 'reviewed', 'shortlisted', 'rejected'].map((status) => (
                    <button
                      key={status}
                      className={`status-update-btn ${status} ${selectedApplication.status === status ? 'active' : ''}`}
                      onClick={() => handleStatusChange(selectedApplication._id, status)}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="delete-btn"
                onClick={() => handleDelete(selectedApplication._id)}
              >
                <HiTrash />
                Delete Application
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
