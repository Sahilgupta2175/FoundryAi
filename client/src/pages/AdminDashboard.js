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
  HiCalendarDays,
  HiMapPin,
} from 'react-icons/hi2';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' or 'meetings'
  const [meetingFilter, setMeetingFilter] = useState('upcoming'); // 'upcoming' or 'cancelled'

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

  const handleDownloadResume = async (resumeUrl, applicantName) => {
    try {
      // For Cloudinary URLs, open directly in new tab (will download)
      window.open(resumeUrl, '_blank');
    } catch (error) {
      console.error('Download failed:', error);
      alert(`Failed to download resume: ${error.message}`);
    }
  };

  const handlePreviewResume = (resumeUrl) => {
    if (resumeUrl && resumeUrl.includes('.pdf')) {
      // For PDFs from Cloudinary, we can embed them
      setPreviewUrl(resumeUrl);
      setShowPdfPreview(true);
    } else {
      // For other file types, just download
      window.open(resumeUrl, '_blank');
    }
  };

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

  const fetchMeetings = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/meetings`,
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
        setMeetings(data.meetings);
      }
    } catch (error) {
      console.error('Failed to fetch meetings:', error);
    }
  }, [handleLogout]);

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
    fetchMeetings();
  }, [navigate, fetchStats, fetchApplications, fetchMeetings]);

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

  const handleCancelMeeting = async (meetingId, meetingDetails) => {
    const reason = window.prompt('Please provide a reason for cancellation (this will be sent to the client):');
    
    if (reason === null) {
      return; // User clicked cancel
    }
    
    if (!reason.trim()) {
      alert('Please provide a reason for cancellation.');
      return;
    }
    
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/meetings/${meetingId}/cancel`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ reason }),
        }
      );
      
      const data = await response.json();
      if (data.success) {
        alert('Meeting cancelled successfully. Email notification sent to the client.');
        fetchMeetings();
        setSelectedMeeting(null);
      } else {
        alert(data.message || 'Failed to cancel meeting');
      }
    } catch (error) {
      console.error('Failed to cancel meeting:', error);
      alert('Failed to cancel meeting. Please try again.');
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

            <motion.div
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={() => setActiveTab('meetings')}
              style={{ cursor: 'pointer' }}
            >
              <div className="stat-icon meetings">
                <HiCalendarDays />
              </div>
              <div className="stat-info">
                <h3>{meetings.filter(m => m.status !== 'cancelled').length}</h3>
                <p>Upcoming Meetings</p>
              </div>
            </motion.div>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="tab-switcher">
          <button
            className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            <HiDocumentText />
            Applications
          </button>
          <button
            className={`tab-btn ${activeTab === 'meetings' ? 'active' : ''}`}
            onClick={() => setActiveTab('meetings')}
          >
            <HiCalendarDays />
            Meetings ({meetings.filter(m => m.status !== 'cancelled').length})
          </button>
        </div>

        {activeTab === 'applications' && (
          <>
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
                        <button
                          className="action-btn download"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadResume(app.resumeUrl, app.name);
                          }}
                          title="Download Resume"
                        >
                          <HiArrowDownTray />
                        </button>
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
          </>
        )}

        {/* Meetings Section */}
        {activeTab === 'meetings' && (
          <div className="meetings-container">
            {/* Meeting Filter Tabs */}
            <div className="meeting-filter-tabs">
              <button
                className={`meeting-filter-btn ${meetingFilter === 'upcoming' ? 'active' : ''}`}
                onClick={() => setMeetingFilter('upcoming')}
              >
                <HiClock />
                Upcoming ({meetings.filter(m => m.status !== 'cancelled').length})
              </button>
              <button
                className={`meeting-filter-btn cancelled ${meetingFilter === 'cancelled' ? 'active' : ''}`}
                onClick={() => setMeetingFilter('cancelled')}
              >
                <HiXCircle />
                Cancelled ({meetings.filter(m => m.status === 'cancelled').length})
              </button>
            </div>

            {(() => {
              const filteredMeetings = meetingFilter === 'upcoming' 
                ? meetings.filter(m => m.status !== 'cancelled')
                : meetings.filter(m => m.status === 'cancelled');
              
              return filteredMeetings.length === 0 ? (
                <div className="empty-state">
                  <HiCalendarDays />
                  <h3>{meetingFilter === 'upcoming' ? 'No upcoming meetings' : 'No cancelled meetings'}</h3>
                  <p>{meetingFilter === 'upcoming' ? 'There are no meetings scheduled yet.' : 'No meetings have been cancelled.'}</p>
                </div>
              ) : (
                <div className="meetings-table">
                  <div className="table-header">
                    <div className="th name-col">Client</div>
                    <div className="th contact-col">Contact</div>
                    <div className="th date-col">Date & Time</div>
                    <div className="th status-col">Status</div>
                    <div className="th actions-col">Actions</div>
                  </div>

                  {filteredMeetings.map((meeting) => (
                    <motion.div
                      key={meeting._id}
                      className="table-row meeting-row"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setSelectedMeeting(meeting)}
                    >
                      <div className="td name-col">
                        <div className="applicant-info">
                          <HiUserCircle className="user-avatar" />
                          <div>
                            <p className="applicant-name">{meeting.name}</p>
                            {meeting.company && <p className="applicant-experience">{meeting.company}</p>}
                          </div>
                        </div>
                      </div>
                      <div className="td contact-col">
                        <div className="contact-info">
                          <span><HiEnvelope /> {meeting.email}</span>
                          {meeting.phone && <span><HiPhone /> {meeting.phone}</span>}
                        </div>
                      </div>
                      <div className="td date-col">
                        <div className="meeting-datetime">
                          <span className="meeting-date"><HiCalendarDays /> {meeting.date}</span>
                          <span className="meeting-time"><HiClock /> {meeting.time}</span>
                        </div>
                      </div>
                      <div className="td status-col">
                        <span className={`meeting-status-badge ${meeting.status || 'scheduled'}`}>
                          {meeting.status === 'completed' && <HiCheckCircle />}
                          {meeting.status === 'cancelled' && <HiXCircle />}
                          {(!meeting.status || meeting.status === 'scheduled') && <HiClock />}
                          {meeting.status ? meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1) : 'Scheduled'}
                        </span>
                      </div>
                      <div className="td actions-col">
                        <button
                          className="action-btn view"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMeeting(meeting);
                          }}
                          title="View Details"
                        >
                          <HiEye />
                        </button>
                        {meeting.status !== 'cancelled' && (
                          <button
                            className="action-btn cancel"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelMeeting(meeting._id, meeting);
                            }}
                            title="Cancel Meeting"
                          >
                            <HiXCircle />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}
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

              {selectedApplication.coverLetter && (
                <div className="detail-section">
                  <h3><HiDocumentText /> Cover Letter / Description</h3>
                  <div className="cover-letter-content">
                    <p>{selectedApplication.coverLetter}</p>
                  </div>
                </div>
              )}

              {selectedApplication.resumeUrl && (
                <div className="detail-section">
                  <h3><HiDocumentText /> Resume</h3>
                  <div className="resume-actions">
                    <button
                      onClick={() => handlePreviewResume(selectedApplication.resumeUrl)}
                      className="resume-action-btn preview"
                    >
                      <HiEye />
                      Preview Resume
                    </button>
                    <button
                      onClick={() => handleDownloadResume(selectedApplication.resumeUrl, selectedApplication.name)}
                      className="resume-action-btn download"
                    >
                      <HiArrowDownTray />
                      Download Resume
                    </button>
                  </div>
                  {selectedApplication.resumeFilename && (
                    <p className="resume-filename">
                      <HiDocumentText />
                      {selectedApplication.resumeFilename}
                    </p>
                  )}
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

      {/* Meeting Detail Modal */}
      {selectedMeeting && (
        <div className="modal-overlay" onClick={() => setSelectedMeeting(null)}>
          <motion.div
            className="modal-content meeting-modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header meeting-header">
              <h2><HiCalendarDays /> Meeting Details</h2>
              <button
                className="close-btn"
                onClick={() => setSelectedMeeting(null)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3><HiUserCircle /> Client Information</h3>
                <div className="detail-grid meeting-detail-grid">
                  <div className="detail-item">
                    <label>Name</label>
                    <p>{selectedMeeting.name}</p>
                  </div>
                  <div className="detail-item">
                    <label>Email</label>
                    <p>{selectedMeeting.email}</p>
                  </div>
                  <div className="detail-item">
                    <label>Phone</label>
                    <p>{selectedMeeting.phone || 'Not provided'}</p>
                  </div>
                  <div className="detail-item">
                    <label>Industry</label>
                    <p>{selectedMeeting.industry || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3><HiCalendarDays /> Meeting Schedule</h3>
                <div className="meeting-schedule-details">
                  <div className="schedule-item">
                    <HiCalendarDays className="schedule-icon" />
                    <div>
                      <label>Date</label>
                      <p className="schedule-value">{selectedMeeting.date}</p>
                    </div>
                  </div>
                  <div className="schedule-item">
                    <HiClock className="schedule-icon" />
                    <div>
                      <label>Time</label>
                      <p className="schedule-value">{selectedMeeting.time}</p>
                    </div>
                  </div>
                  <div className="schedule-item">
                    <HiMapPin className="schedule-icon" />
                    <div>
                      <label>Type</label>
                      <p className="schedule-value">{selectedMeeting.meetingType || 'Video Call'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedMeeting.message && (
                <div className="detail-section">
                  <h3><HiDocumentText /> Message</h3>
                  <div className="cover-letter-content">
                    <p>{selectedMeeting.message}</p>
                  </div>
                </div>
              )}

              <div className="detail-section">
                <h3>Meeting Status</h3>
                <div className="meeting-status-info">
                  <span className={`meeting-status-badge large ${selectedMeeting.status || 'scheduled'}`}>
                    {selectedMeeting.status === 'completed' && <HiCheckCircle />}
                    {selectedMeeting.status === 'cancelled' && <HiXCircle />}
                    {(!selectedMeeting.status || selectedMeeting.status === 'scheduled') && <HiClock />}
                    {selectedMeeting.status ? selectedMeeting.status.charAt(0).toUpperCase() + selectedMeeting.status.slice(1) : 'Scheduled'}
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              {selectedMeeting.status !== 'cancelled' && (
                <button
                  className="cancel-meeting-btn"
                  onClick={() => handleCancelMeeting(selectedMeeting._id, selectedMeeting)}
                >
                  <HiXCircle />
                  Cancel Meeting
                </button>
              )}
              <button
                className="close-modal-btn"
                onClick={() => setSelectedMeeting(null)}
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* PDF Preview Modal */}
      {showPdfPreview && previewUrl && (
        <div className="modal-overlay pdf-preview-overlay" onClick={() => setShowPdfPreview(false)}>
          <motion.div
            className="pdf-preview-modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pdf-preview-header">
              <h2>Resume Preview</h2>
              <div className="pdf-preview-actions">
                <button
                  className="pdf-action-btn"
                  onClick={() => window.open(previewUrl, '_blank')}
                  title="Open in new tab"
                >
                  <HiArrowDownTray />
                  Download
                </button>
                <button
                  className="close-btn"
                  onClick={() => setShowPdfPreview(false)}
                >
                  ×
                </button>
              </div>
            </div>
            <div className="pdf-preview-body">
              <iframe
                src={previewUrl}
                title="Resume Preview"
                className="pdf-iframe"
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
