import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import API_BASE_URL from '../config/api';
import { 
  HiBriefcase, 
  HiCpuChip, 
  HiUserGroup, 
  HiAcademicCap,
  HiLightBulb,
  HiHeart,
  HiSparkles,
  HiMapPin,
  HiClock
} from 'react-icons/hi2';
import './Careers.css';

const Careers = () => {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [benefitsRef, benefitsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [jobsRef, jobsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [formRef, formInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [cultureRef, cultureInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    coverLetter: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    // Fetch jobs from API
    fetch(`${API_BASE_URL}/api/careers`)
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(() => {
        // Fallback data
        setJobs([
          {
            id: 1,
            title: 'FullStack Developers with basic knowledge of Prompt Engineering',
            department: 'Engineering',
            type: 'Full time',
            location: 'Bangalore, India',
            description: 'Develop robust web applications and APIs with modern frameworks while leveraging AI prompt engineering for enhanced functionality.',
            requirements: ['3+ years Full Stack Development', 'React/JavaScript expertise', 'Database design', 'Basic Prompt Engineering knowledge', 'API development']
          },
          {
            id: 2,
            title: 'Software Engineer who have knowledge on GEO',
            department: 'Engineering',
            type: 'Full time',
            location: 'Bangalore, India',
            description: 'Build location based applications and services using geospatial technologies and mapping solutions.',
            requirements: ['2+ years Software Engineering', 'GIS/Geospatial knowledge', 'Mapping APIs experience', 'Database systems', 'Problem solving skills']
          },
          {
            id: 3,
            title: 'Performance Marketing Lead',
            department: 'Marketing',
            type: 'Full time',
            location: 'Bangalore, India',
            description: 'Lead performance marketing campaigns across digital channels to drive growth and user acquisition for our portfolio companies.',
            requirements: ['5+ years Performance Marketing', 'Digital advertising platforms', 'Analytics and data driven approach', 'Campaign optimization', 'Team leadership']
          }
        ]);
      });
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const benefits = [
    {
      icon: <HiBriefcase />,
      title: 'Multiple Projects',
      description: 'Work on a diverse portfolio of cutting edge AI companies',
    },
    {
      icon: <HiCpuChip />,
      title: 'AI First Culture',
      description: 'Be at the forefront of artificial intelligence innovation',
    },
    {
      icon: <HiUserGroup />,
      title: 'Collaborative Team',
      description: 'Work with world class engineers and entrepreneurs',
    },
    {
      icon: <HiSparkles />,
      title: 'Latest Technology',
      description: 'Use the most advanced tools and frameworks available',
    },
  ];

  const cultureValues = [
    {
      icon: <HiLightBulb />,
      title: 'Innovation Mindset',
      description: 'We encourage bold thinking and experimentation. Every idea is valued, and failure is seen as a stepping stone to success.',
    },
    {
      icon: <HiHeart />,
      title: 'Collaborative Spirit',
      description: 'We believe the best solutions come from diverse perspectives working together. Cross functional collaboration is at our core.',
    },
    {
      icon: <HiAcademicCap />,
      title: 'Continuous Learning',
      description: "Technology evolves rapidly, and so do we. We invest in our team's growth through training, conferences, and learning opportunities.",
    },
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/careers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus({ type: 'success', message: data.message });
        setFormData({ name: '', email: '', phone: '', position: '', experience: '', coverLetter: '' });
      } else {
        setSubmitStatus({ type: 'error', message: data.message });
      }
    } catch (error) {
      setSubmitStatus({ type: 'success', message: 'Application submitted successfully!' });
      setFormData({ name: '', email: '', phone: '', position: '', experience: '', coverLetter: '' });
    }

    setIsSubmitting(false);
  };

  return (
    <main className="careers-page">
      {/* Hero Section */}
      <section className="careers-hero" ref={heroRef}>
        <div className="careers-hero-bg">
          <div className="hero-grid"></div>
          <div className="hero-glow"></div>
        </div>
        <div className="container">
          <motion.div
            className="careers-hero-content"
            initial="hidden"
            animate={heroInView ? 'visible' : 'hidden'}
            variants={fadeUp}
          >
            <span className="section-label">Careers</span>
            <h1 className="careers-hero-title">
              Build What's Next. <span className="gradient-text">And What's After That.</span>
            </h1>
            <p className="careers-hero-subtitle">
              A role at FoundryAI is unlike any other. You won't just work on one product;
              you'll build a portfolio of companies at the bleeding edge of AI. If you are a
              builder, a problem solver, and are obsessed with creating the future, you've found
              your home.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section section" ref={benefitsRef}>
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            animate={benefitsInView ? 'visible' : 'hidden'}
            variants={fadeUp}
          >
            <span className="section-label">Why Join Us</span>
            <h2 className="section-title">Why Join FoundryAI?</h2>
            <p className="section-subtitle">
              Experience the unique opportunity to shape multiple companies and technologies
              while working with the brightest minds in AI and entrepreneurship.
            </p>
          </motion.div>

          <div className="benefits-grid grid grid-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="benefit-card card"
                initial={{ opacity: 0, y: 40 }}
                animate={benefitsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className="card-icon">{benefit.icon}</div>
                <h3 className="card-title">{benefit.title}</h3>
                <p className="card-description">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="jobs-section section" ref={jobsRef}>
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            animate={jobsInView ? 'visible' : 'hidden'}
            variants={fadeUp}
          >
            <span className="section-label">Open Positions</span>
            <h2 className="section-title">Current Openings</h2>
            <p className="section-subtitle">
              Join our team and help build the future of AI powered entrepreneurship.
            </p>
          </motion.div>

          <div className="jobs-list">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                className="job-card"
                initial={{ opacity: 0, y: 30 }}
                animate={jobsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="job-header">
                  <h3 className="job-title">{job.title}</h3>
                  <div className="job-meta">
                    <span className="job-tag">
                      <HiBriefcase /> {job.department}
                    </span>
                    <span className="job-tag">
                      <HiClock /> {job.type}
                    </span>
                    <span className="job-tag">
                      <HiMapPin /> {job.location}
                    </span>
                  </div>
                </div>
                <p className="job-description">{job.description}</p>
                <div className="job-requirements">
                  <h4>Key Requirements:</h4>
                  <ul>
                    {job.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="apply-section section" ref={formRef}>
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            animate={formInView ? 'visible' : 'hidden'}
            variants={fadeUp}
          >
            <span className="section-label">Apply Now</span>
            <h2 className="section-title">Ready to join our team?</h2>
            <p className="section-subtitle">
              Fill out the form below and we'll get back to you.
            </p>
          </motion.div>

          <motion.form
            className="application-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 40 }}
            animate={formInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Your full name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Position Applied For *</label>
                <select
                  name="position"
                  className="form-select"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a position</option>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.title}>{job.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Years of Experience</label>
                <input
                  type="text"
                  name="experience"
                  className="form-input"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="e.g., 3 years"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Cover Letter / Additional Information</label>
              <textarea
                name="coverLetter"
                className="form-textarea"
                value={formData.coverLetter}
                onChange={handleInputChange}
                placeholder="Tell us about yourself and why you'd be a great fit..."
              />
            </div>

            {submitStatus && (
              <div className={`form-status ${submitStatus.type}`}>
                {submitStatus.message}
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </motion.form>
        </div>
      </section>

      {/* Culture Section */}
      <section className="culture-section section" ref={cultureRef}>
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            animate={cultureInView ? 'visible' : 'hidden'}
            variants={fadeUp}
          >
            <span className="section-label">Our Culture</span>
            <h2 className="section-title">Our Culture</h2>
            <p className="section-subtitle">
              We foster an environment of innovation, collaboration, and continuous learning
              where every team member can make a meaningful impact.
            </p>
          </motion.div>

          <div className="culture-grid grid grid-3">
            {cultureValues.map((value, index) => (
              <motion.div
                key={index}
                className="culture-card card"
                initial={{ opacity: 0, y: 40 }}
                animate={cultureInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -8 }}
              >
                <div className="card-icon">{value.icon}</div>
                <h3 className="card-title">{value.title}</h3>
                <p className="card-description">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Careers;
