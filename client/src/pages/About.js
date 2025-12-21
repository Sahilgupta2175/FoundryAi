import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { HiLightningBolt, HiUserGroup, HiChip, HiTrendingUp, HiMail } from 'react-icons/hi';
import { FaLinkedin } from 'react-icons/fa';
import './About.css';

const About = () => {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [missionRef, missionInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [founderRef, founderInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [valuesRef, valuesInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const values = [
    {
      icon: <HiLightningBolt />,
      title: 'Innovation First',
      description: 'We prioritize breakthrough solutions over incremental improvements.',
    },
    {
      icon: <HiUserGroup />,
      title: 'True Partnership',
      description: 'We succeed only when our partners succeed. Aligned incentives drive results.',
    },
    {
      icon: <HiChip />,
      title: 'AI Powered',
      description: 'Every solution leverages artificial intelligence for sustainable advantage.',
    },
    {
      icon: <HiTrendingUp />,
      title: 'Future Focused',
      description: "We build for tomorrow's challenges, not just today's problems.",
    },
  ];

  const visionPoints = [
    'Bridge the gap between visionary ideas and technical execution',
    'Make cutting edge AI accessible to all entrepreneurs',
    'Foster innovation that creates positive global impact',
  ];

  return (
    <main className="about-page">
      {/* Hero Section */}
      <section className="about-hero" ref={heroRef}>
        <div className="about-hero-bg">
          <div className="hero-grid"></div>
          <div className="hero-glow"></div>
        </div>
        <div className="container">
          <motion.div
            className="about-hero-content"
            initial="hidden"
            animate={heroInView ? 'visible' : 'hidden'}
            variants={fadeUp}
          >
            <span className="section-label">About Us</span>
            <h1 className="about-hero-title">
              We Are a Factory <span className="gradient-text">for the Future</span>
            </h1>
            <p className="about-hero-subtitle">
              Our mission is to democratize access to elite artificial intelligence and
              technology, empowering the next generation of entrepreneurs to solve humanity's most
              pressing challenges.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section section" ref={missionRef}>
        <div className="container">
          <div className="mission-grid">
            <motion.div
              className="mission-content"
              initial={{ opacity: 0, x: -40 }}
              animate={missionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
              transition={{ duration: 0.6 }}
            >
              <span className="section-label">Our Mission</span>
              <h2 className="mission-title">
                To democratize access to elite artificial intelligence and technology
              </h2>
              <p className="mission-description">
                Empowering the next generation of entrepreneurs to solve humanity's most pressing challenges.
              </p>
              <ul className="mission-points">
                {visionPoints.map((point, index) => (
                  <motion.li
                    key={index}
                    className="mission-point"
                    initial={{ opacity: 0, x: -20 }}
                    animate={missionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <span className="point-icon">✓</span>
                    {point}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="vision-card"
              initial={{ opacity: 0, x: 40 }}
              animate={missionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="vision-icon">
                <HiChip />
              </div>
              <h3 className="vision-title">Our Vision</h3>
              <p className="vision-text">
                A world where every breakthrough idea has access to the technology and expertise
                needed to become reality. We envision a future where the barriers between
                innovation and implementation are eliminated through AI powered collaboration.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="founder-section section" ref={founderRef}>
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            animate={founderInView ? 'visible' : 'hidden'}
            variants={fadeUp}
          >
            <span className="section-label">Leadership</span>
            <h2 className="section-title">The Founder's Vision</h2>
          </motion.div>

          <motion.div
            className="founder-card"
            initial={{ opacity: 0, y: 40 }}
            animate={founderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="founder-image">
              <div className="founder-avatar">
                <span className="avatar-letter">H</span>
              </div>
              <div className="founder-glow"></div>
            </div>
            <div className="founder-content">
              <h3 className="founder-name">HARIKRISHNA</h3>
              <p className="founder-role">Founder & CEO</p>
              <p className="founder-bio">
                FoundryAI was born from a simple observation: countless brilliant startup ideas
                die because their founders lack a technical partner. Harikrishna envisioned a
                new kind of company - a "foundry" - that would not just fund ideas but actively forge
                them into reality using the transformative power of AI.
              </p>
              <p className="founder-bio">
                With a deep background in artificial intelligence and a passion for
                entrepreneurship, he created FoundryAI to serve as the ultimate technical co-founder for
                visionary leaders.
              </p>
              <div className="founder-socials">
                <a href="https://linkedin.com" className="social-btn" target="_blank" rel="noopener noreferrer">
                  <FaLinkedin />
                </a>
                <a href="mailto:foundryai.india@gmail.com" className="social-btn">
                  <HiMail />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section section" ref={valuesRef}>
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            animate={valuesInView ? 'visible' : 'hidden'}
            variants={fadeUp}
          >
            <span className="section-label">Our Principles</span>
            <h2 className="section-title">Our Core Values</h2>
            <p className="section-subtitle">
              These principles guide every decision we make and every partnership we forge.
            </p>
          </motion.div>

          <div className="values-grid grid grid-4">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="value-card card"
                initial={{ opacity: 0, y: 40 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
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

export default About;
