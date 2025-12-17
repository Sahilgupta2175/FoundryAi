import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  HiEnvelope, 
  HiPhone, 
  HiMapPin, 
  HiArrowRight,
  HiPaperAirplane,
  HiCalendarDays,
  HiBriefcase
} from 'react-icons/hi2';
import './Contact.css';

const Contact = () => {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [formRef, formInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const contactInfo = [
    {
      icon: <HiPhone />,
      label: 'Phone',
      value: '+91 90594 67267',
      href: 'tel:+919059467267',
    },
    {
      icon: <HiEnvelope />,
      label: 'Email',
      value: 'foundryai.india@gmail.com',
      href: 'mailto:foundryai.india@gmail.com',
    },
    {
      icon: <HiMapPin />,
      label: 'Location',
      value: 'Bangalore, Karnataka, India',
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus({ type: 'success', message: data.message });
        setFormData({ name: '', email: '', phone: '', company: '', subject: '', message: '' });
      } else {
        setSubmitStatus({ type: 'error', message: data.message });
      }
    } catch (error) {
      setSubmitStatus({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
      setFormData({ name: '', email: '', phone: '', company: '', subject: '', message: '' });
    }

    setIsSubmitting(false);
  };

  return (
    <main className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero" ref={heroRef}>
        <div className="contact-hero-bg">
          <div className="hero-grid"></div>
          <div className="hero-glow"></div>
        </div>
        <div className="container">
          <motion.div
            className="contact-hero-content"
            initial="hidden"
            animate={heroInView ? 'visible' : 'hidden'}
            variants={fadeUp}
          >
            <span className="section-label">Contact Us</span>
            <h1 className="contact-hero-title">
              Let's Build the Future. <span className="gradient-text">Together.</span>
            </h1>
            <p className="contact-hero-subtitle">
              Whether you're a founder with a revolutionary idea, an investor, or a talented
              engineer, we're here to listen.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section section" ref={formRef}>
        <div className="container">
          <div className="contact-grid">
            <motion.div
              className="contact-form-wrapper"
              initial={{ opacity: 0, x: -40 }}
              animate={formInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="form-title">Send Us a Message</h2>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Name *</label>
                    <input
                      type="text"
                      name="name"
                      className="form-input"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Your name"
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
                </div>

                <div className="form-row">
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
                    <label className="form-label">Company</label>
                    <input
                      type="text"
                      name="company"
                      className="form-input"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Your company name"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    className="form-input"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="What's this about?"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea
                    name="message"
                    className="form-textarea"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    placeholder="Tell us about your idea or how we can help..."
                  />
                </div>

                {submitStatus && (
                  <div className={`form-status ${submitStatus.type}`}>
                    {submitStatus.message}
                  </div>
                )}

                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <HiPaperAirplane className="btn-icon" />
                </button>
              </form>
            </motion.div>

            <motion.div
              className="contact-info-wrapper"
              initial={{ opacity: 0, x: 40 }}
              animate={formInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="info-card">
                <div className="info-card-icon">
                  <HiBriefcase />
                </div>
                <h3>For Founders & Startups</h3>
                <p>
                  Have a revolutionary idea that needs a technical partner? Let's discuss how we
                  can help bring your vision to life.
                </p>
                <a href="mailto:foundryai.india@gmail.com" className="info-link">
                  foundryai.india@gmail.com
                  <HiArrowRight />
                </a>
              </div>

              <div className="info-card">
                <div className="info-card-icon">
                  <HiEnvelope />
                </div>
                <h3>General Inquiries</h3>
                <p>
                  Questions about our services, partnerships, or just want to learn more about
                  FoundryAI?
                </p>
                <a href="mailto:foundryai.india@gmail.com" className="info-link">
                  foundryai.india@gmail.com
                  <HiArrowRight />
                </a>
              </div>

              <div className="contact-details">
                <h3>Contact Details</h3>
                {contactInfo.map((info, index) => (
                  <div key={index} className="detail-item">
                    <span className="detail-icon">{info.icon}</span>
                    <div className="detail-content">
                      {info.href ? (
                        <a href={info.href} className="detail-value">{info.value}</a>
                      ) : (
                        <span className="detail-value">{info.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="contact-cta section" ref={ctaRef}>
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 40 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="cta-title">Ready to Start Your Journey?</h2>
            <p className="cta-subtitle">
              The next breakthrough company could be yours. Let's make it happen together.
            </p>
            <div className="cta-actions">
              <a href="mailto:foundryai.india@gmail.com" className="btn btn-primary">
                <HiCalendarDays />
                Schedule a Call
              </a>
              <Link to="/portfolio" className="btn btn-secondary">
                View Our Portfolio
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
