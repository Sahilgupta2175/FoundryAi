import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  HiCpuChip, 
  HiRocketLaunch, 
  HiChartBar, 
  HiArrowRight,
  HiClock,
  HiSparkles,
  HiDocumentText
} from 'react-icons/hi2';
import './Portfolio.css';

const Portfolio = () => {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [projectRef, projectInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [approachRef, approachInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const techStack = ['AI Agents', 'Machine Learning', 'Python (Django)', 'React Native', 'Marketing Automation APIs'];

  const metrics = [
    { value: '90%', label: 'Time Reduction' },
    { value: 'AI Powered', label: '24/7 Automation' },
    { value: 'Real-time', label: 'Reporting' },
  ];

  const approach = [
    {
      icon: <HiCpuChip />,
      title: 'AI-First Solutions',
      description: 'Every project starts with AI at its core, ensuring sustainable competitive advantages and scalable automation.',
    },
    {
      icon: <HiRocketLaunch />,
      title: 'Rapid Development',
      description: 'Our agile methodology and pre-built components allow us to move from concept to MVP in record time.',
    },
    {
      icon: <HiChartBar />,
      title: 'Market Validation',
      description: 'Data-driven market analysis and user feedback loops ensure product-market fit before major resource investment.',
    },
  ];

  return (
    <main className="portfolio-page">
      {/* Hero Section */}
      <section className="portfolio-hero" ref={heroRef}>
        <div className="portfolio-hero-bg">
          <div className="hero-grid"></div>
          <div className="hero-glow"></div>
        </div>
        <div className="container">
          <motion.div
            className="portfolio-hero-content"
            initial="hidden"
            animate={heroInView ? 'visible' : 'hidden'}
            variants={fadeUp}
          >
            <span className="section-label">Portfolio</span>
            <h1 className="portfolio-hero-title">
              Ventures Forged <span className="gradient-text">in Our Foundry</span>
            </h1>
            <p className="portfolio-hero-subtitle">
              We are actively building a portfolio of category-defining companies. Each one
              leverages our core AI technology to solve a major industry problem.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Project Section */}
      <section className="featured-project section" ref={projectRef}>
        <div className="container">
          <motion.div
            className="project-card"
            initial={{ opacity: 0, y: 40 }}
            animate={projectInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            <div className="project-header">
              <div className="project-status badge badge-warning">
                <HiClock /> In Development
              </div>
              <h2 className="project-name">Addzipzz</h2>
              <p className="project-tagline">Rapid Advertisement & Branding, Automated.</p>
            </div>

            <div className="project-content">
              <div className="project-info">
                <div className="info-section">
                  <h3 className="info-title">The Problem</h3>
                  <p className="info-text">
                    Startups and small businesses lack the time, budget, and expertise to run
                    effective marketing campaigns, slowing their growth.
                  </p>
                </div>

                <div className="info-section">
                  <h3 className="info-title">Our Solution</h3>
                  <p className="info-text">
                    FoundryAI is building Addzipzz, a gig platform where AI agents manage and
                    execute branding tasks. It connects businesses with vetted marketers, while our AI
                    automates the briefing, deployment, and reporting of campaigns, reducing costs and
                    time-to-market by over 90%.
                  </p>
                </div>

                <div className="info-section">
                  <h3 className="info-title">Technology Stack</h3>
                  <div className="tech-tags">
                    {techStack.map((tech, index) => (
                      <span key={index} className="tech-tag badge badge-primary">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="project-metrics-card">
                <h3 className="metrics-title">Key Metrics</h3>
                <div className="metrics-grid">
                  {metrics.map((metric, index) => (
                    <div key={index} className="metric-box">
                      <span className="metric-value gradient-text">{metric.value}</span>
                      <span className="metric-label">{metric.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Approach Section */}
      <section className="approach-section section" ref={approachRef}>
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            animate={approachInView ? 'visible' : 'hidden'}
            variants={fadeUp}
          >
            <span className="section-label">Our Approach</span>
            <h2 className="section-title">Our Portfolio Approach</h2>
            <p className="section-subtitle">
              Every venture in our portfolio follows our proven methodology, ensuring
              consistent quality and market success.
            </p>
          </motion.div>

          <div className="approach-grid grid grid-3">
            {approach.map((item, index) => (
              <motion.div
                key={index}
                className="approach-card card"
                initial={{ opacity: 0, y: 40 }}
                animate={approachInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -8 }}
              >
                <div className="card-icon">{item.icon}</div>
                <h3 className="card-title">{item.title}</h3>
                <p className="card-description">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="coming-soon section">
        <div className="container">
          <div className="coming-soon-content">
            <HiSparkles className="coming-icon" />
            <h2 className="coming-title">More Ventures Coming Soon</h2>
            <p className="coming-description">
              We're constantly working with new founders to bring innovative AI-powered
              solutions to market. Stay tuned for our next breakthrough ventures.
            </p>
            <Link to="/contact" className="btn btn-primary">
              Partner With Us
              <HiArrowRight className="btn-icon" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Portfolio;
