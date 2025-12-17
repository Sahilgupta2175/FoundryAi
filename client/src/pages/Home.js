import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { HiArrowRight, HiLightningBolt, HiCode, HiChartBar, HiClock, HiSparkles, HiUsers } from 'react-icons/hi';
import './Home.css';

const Home = () => {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [servicesRef, servicesInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [portfolioRef, portfolioInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  };

  const services = [
    {
      icon: <HiLightningBolt />,
      title: 'AI Agent Development',
      description: 'We build proprietary AI agents to automate core business functions, giving your startup an immediate and sustainable competitive advantage.',
    },
    {
      icon: <HiCode />,
      title: 'Full Stack Product Engineering',
      description: 'From complex web applications to intuitive mobile apps, our in house teams design, build, and scale your technology platform.',
    },
    {
      icon: <HiChartBar />,
      title: 'AI Driven Financial Analysis',
      description: 'We leverage predictive analytics and AI modeling to validate your business case, optimize your financial strategy, and prepare you for future growth.',
    },
  ];

  const metrics = [
    { value: '90%', label: 'Time Reduction' },
    { value: '24/7', label: 'AI Automation' },
    { value: 'Real-time', label: 'Reporting' },
  ];

  return (
    <main className="home-page">
      {/* Hero Section */}
      <section className="hero-section" ref={heroRef}>
        <div className="hero-bg">
          <div className="hero-grid"></div>
          <div className="hero-glow hero-glow-1"></div>
          <div className="hero-glow hero-glow-2"></div>
          <div className="hero-particles"></div>
        </div>

        <div className="container hero-container">
          <motion.div
            className="hero-content"
            initial="hidden"
            animate={heroInView ? 'visible' : 'hidden'}
          >
            <motion.div className="hero-badge" custom={0} variants={fadeUpVariants}>
              <HiSparkles className="badge-icon" />
              <span>AI Native Startup Studio</span>
            </motion.div>

            <motion.h1 className="hero-title" custom={1} variants={fadeUpVariants}>
              We Don't Fund Startups.
              <br />
              <span className="gradient-text">We Build Them.</span>
            </motion.h1>

            <motion.p className="hero-subtitle" custom={2} variants={fadeUpVariants}>
              FoundryAI is an AI native startup studio. We partner with visionary founders to
              provide the technology, development team, and strategic capital to forge world
              class companies from the ground up.
            </motion.p>

            <motion.div className="hero-actions" custom={3} variants={fadeUpVariants}>
              <Link to="/contact" className="btn btn-primary">
                Partner With Us
                <HiArrowRight className="btn-icon" />
              </Link>
              <Link to="/our-model" className="btn btn-secondary">
                Explore Our Model
              </Link>
            </motion.div>

            <motion.div className="hero-stats" custom={4} variants={fadeUpVariants}>
              <div className="stat-item">
                <span className="stat-value">AI-First</span>
                <span className="stat-label">Technology Stack</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-value">Full-Stack</span>
                <span className="stat-label">Development Team</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-value">Equity</span>
                <span className="stat-label">Based Partnership</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="hero-card-stack">
              <div className="floating-card card-1">
                <div className="card-icon"><HiLightningBolt /></div>
                <span>AI Agents</span>
              </div>
              <div className="floating-card card-2">
                <div className="card-icon"><HiCode /></div>
                <span>Full Stack</span>
              </div>
              <div className="floating-card card-3">
                <div className="card-icon"><HiChartBar /></div>
                <span>Analytics</span>
              </div>
              <div className="hero-orb"></div>
            </div>
          </motion.div>
        </div>

        <div className="scroll-indicator">
          <motion.div
            className="scroll-mouse"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="scroll-wheel"></div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section section" ref={servicesRef}>
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label">What We Do</span>
            <h2 className="section-title">
              Your Technical Co-Founder,
              <br />
              <span className="gradient-text">Supercharged by AI</span>
            </h2>
            <p className="section-subtitle">
              You have the vision. We have the AI and engineering firepower to make it a
              reality. We embed our teams with yours, building your product, your platform, and
              your path to market.
            </p>
          </motion.div>

          <div className="services-grid grid grid-3">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="service-card card"
                initial={{ opacity: 0, y: 40 }}
                animate={servicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -8 }}
              >
                <div className="card-icon">{service.icon}</div>
                <h3 className="card-title">{service.title}</h3>
                <p className="card-description">{service.description}</p>
                <div className="card-arrow">
                  <HiArrowRight />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Preview Section */}
      <section className="portfolio-preview-section section" ref={portfolioRef}>
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            animate={portfolioInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label">From Our Foundry</span>
            <h2 className="section-title">Addzipzz</h2>
            <p className="section-subtitle">Revolutionary Marketing Gig Platform</p>
          </motion.div>

          <div className="portfolio-showcase">
            <motion.div
              className="portfolio-content"
              initial={{ opacity: 0, x: -40 }}
              animate={portfolioInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="portfolio-description">
                Addzipzz is our inaugural venture—a revolutionary marketing gig platform. It
                uses a fleet of proprietary AI agents to automate rapid advertisement and branding
                campaigns, connecting businesses with marketing talent instantly and
                efficiently.
              </p>

              <div className="portfolio-metrics">
                {metrics.map((metric, index) => (
                  <div key={index} className="metric-item">
                    <span className="metric-value gradient-text">{metric.value}</span>
                    <span className="metric-label">{metric.label}</span>
                  </div>
                ))}
              </div>

              <div className="portfolio-actions">
                <Link to="/portfolio" className="btn btn-primary">
                  See Our Portfolio
                  <HiArrowRight className="btn-icon" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="portfolio-visual"
              initial={{ opacity: 0, x: 40 }}
              animate={portfolioInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="platform-preview">
                <div className="preview-header">
                  <div className="preview-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="preview-title">Addzipzz Platform</span>
                </div>
                <div className="preview-content">
                  <div className="preview-card">
                    <HiLightningBolt className="preview-icon" />
                    <span>Campaign Automation</span>
                    <span className="preview-stat">90% Time Reduction</span>
                  </div>
                  <div className="preview-card">
                    <HiUsers className="preview-icon" />
                    <span>AI Agent Management</span>
                    <span className="preview-stat">Real-time Optimization</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section section" ref={ctaRef}>
        <div className="cta-bg">
          <div className="cta-glow"></div>
        </div>
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 40 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="cta-title">
              Have an idea that needs a home?
            </h2>
            <p className="cta-subtitle">
              Let's have the conversation that could define your future.
            </p>
            <Link to="/contact" className="btn btn-primary btn-lg">
              Start Building Today
              <HiArrowRight className="btn-icon" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Home;
