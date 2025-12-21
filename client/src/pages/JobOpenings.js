import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { 
  HiBriefcase, 
  HiMapPin,
  HiArrowRight,
  HiSparkles,
  HiCurrencyRupee,
  HiFunnel
} from 'react-icons/hi2';
import './JobOpenings.css';

const JobOpenings = () => {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [jobsRef, jobsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/careers`);
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Get unique values for filters
  const departments = ['all', ...new Set(jobs.map(job => job.department))];
  const jobTypes = ['all', ...new Set(jobs.map(job => job.type))];
  const locations = ['all', ...new Set(jobs.map(job => job.location))];

  // Filter jobs by all criteria
  const filteredJobs = jobs.filter(job => {
    const matchesDepartment = departmentFilter === 'all' || job.department === departmentFilter;
    const matchesType = typeFilter === 'all' || job.type === typeFilter;
    const matchesLocation = locationFilter === 'all' || job.location === locationFilter;
    return matchesDepartment && matchesType && matchesLocation;
  });

  // Clear all filters
  const clearFilters = () => {
    setDepartmentFilter('all');
    setTypeFilter('all');
    setLocationFilter('all');
  };

  // Check if any filter is active
  const hasActiveFilters = departmentFilter !== 'all' || typeFilter !== 'all' || locationFilter !== 'all';

  return (
    <main className="job-openings-page">
      {/* Hero Section */}
      <section className="job-hero" ref={heroRef}>
        <div className="job-hero-bg">
          <div className="hero-grid"></div>
          <div className="hero-glow"></div>
          <div className="hero-particles">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="particle" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }} />
            ))}
          </div>
        </div>
        <div className="container">
          <motion.div
            className="job-hero-content"
            initial="hidden"
            animate={heroInView ? 'visible' : 'hidden'}
            variants={fadeUp}
          >
            <span className="section-label">
              <HiSparkles /> Current Openings
            </span>
            <h1 className="job-hero-title">
              Join Our <span className="gradient-text">Mission</span>
            </h1>
            <p className="job-hero-subtitle">
              Explore exciting opportunities to work on cutting-edge AI projects 
              and help shape the future of technology-driven entrepreneurship.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">{jobs.length}</span>
                <span className="stat-label">Open Positions</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{departments.length - 1}</span>
                <span className="stat-label">Departments</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="jobs-section section" ref={jobsRef}>
        <div className="container">
          {/* Filter Section */}
          <motion.div
            className="jobs-filter-section"
            initial={{ opacity: 0, y: 20 }}
            animate={jobsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className="filter-header" onClick={() => setIsFilterOpen(!isFilterOpen)}>
              <h3 className="filter-title">
                <HiFunnel /> Filter Positions
                <span className="filter-count-badge">{filteredJobs.length}</span>
              </h3>
              <div className="filter-header-actions">
                {hasActiveFilters && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFilters();
                    }} 
                    className="clear-filters-btn"
                  >
                    Clear All
                  </button>
                )}
                <button className={`filter-toggle-btn ${isFilterOpen ? 'open' : ''}`}>
                  <HiArrowRight />
                </button>
              </div>
            </div>

            <motion.div 
              className="filter-content"
              initial={false}
              animate={{ 
                height: isFilterOpen ? 'auto' : 0,
                opacity: isFilterOpen ? 1 : 0
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="filters-grid">
                <div className="filter-group">
                  <label className="filter-label">Department</label>
                  <select 
                    className="filter-select"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>
                        {dept === 'all' ? 'All Departments' : dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Job Type</label>
                  <select 
                    className="filter-select"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    {jobTypes.map(type => (
                      <option key={type} value={type}>
                        {type === 'all' ? 'All Types' : type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Location</label>
                  <select 
                    className="filter-select"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  >
                    {locations.map(loc => (
                      <option key={loc} value={loc}>
                        {loc === 'all' ? 'All Locations' : loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Jobs List */}
          {loading ? (
            <div className="jobs-loading">
              <div className="loading-spinner"></div>
              <p>Loading positions...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <motion.div
              className="no-jobs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <HiBriefcase className="no-jobs-icon" />
              <h3>No positions available</h3>
              <p>Check back later for new opportunities or explore other departments.</p>
            </motion.div>
          ) : (
            <motion.div
              className="jobs-grid"
              variants={staggerContainer}
              initial="hidden"
              animate={jobsInView ? 'visible' : 'hidden'}
            >
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job._id || index}
                  className="job-card"
                  variants={fadeUp}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="job-card-header">
                    <span className="job-department">{job.department}</span>
                    <span className="job-type">{job.type}</span>
                  </div>

                  <h3 className="job-title">{job.title}</h3>
                  
                  <div className="job-meta">
                    <span className="job-location">
                      <HiMapPin /> {job.location}
                    </span>
                    {job.salary && (
                      <span className="job-salary">
                        <HiCurrencyRupee /> {job.salary}
                      </span>
                    )}
                  </div>
                  
                  <p className="job-description">{job.description}</p>
                  
                  {job.requirements && job.requirements.length > 0 && (
                    <div className="job-requirements">
                      <h4>Key Requirements:</h4>
                      <div className="requirements-tags">
                        {job.requirements.map((req, idx) => (
                          <span key={idx} className="requirement-tag">{req}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Link 
                    to="/careers" 
                    state={{ position: job.title }}
                    className="apply-btn"
                  >
                    Apply Now <HiArrowRight />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="job-cta-section">
        <div className="container">
          <motion.div
            className="job-cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Don't See the Right Role?</h2>
            <p>
              We're always looking for talented individuals. Send us your resume 
              and we'll keep you in mind for future opportunities.
            </p>
            <Link to="/careers" className="cta-btn">
              Submit Your Application <HiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default JobOpenings;
