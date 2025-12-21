import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { 
  HiBriefcase, 
  HiMapPin,
  HiArrowRight,
  HiSparkles,
  HiCurrencyRupee
} from 'react-icons/hi2';
import './JobOpenings.css';

const JobOpenings = () => {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [jobsRef, jobsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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

  // Get unique departments for filter
  const departments = ['all', ...new Set(jobs.map(job => job.department))];

  // Filter jobs by department
  const filteredJobs = filter === 'all' 
    ? jobs 
    : jobs.filter(job => job.department === filter);

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
          {/* Department Filter */}
          <motion.div
            className="jobs-filter"
            initial="hidden"
            animate={jobsInView ? 'visible' : 'hidden'}
            variants={fadeUp}
          >
            <div className="filter-tabs">
              {departments.map((dept) => (
                <button
                  key={dept}
                  className={`filter-tab ${filter === dept ? 'active' : ''}`}
                  onClick={() => setFilter(dept)}
                >
                  {dept === 'all' ? 'All Departments' : dept}
                  {dept !== 'all' && (
                    <span className="filter-count">
                      {jobs.filter(j => j.department === dept).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
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
                      <ul>
                        {job.requirements.slice(0, 4).map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                        {job.requirements.length > 4 && (
                          <li className="more-reqs">+{job.requirements.length - 4} more</li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  <Link to="/careers" className="apply-btn">
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
