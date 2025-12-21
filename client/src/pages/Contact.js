import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  HiEnvelope, 
  HiPhone, 
  HiMapPin, 
  HiArrowRight,
  HiPaperAirplane,
  HiCalendarDays,
  HiBriefcase,
  HiDevicePhoneMobile,
  HiComputerDesktop,
  HiCpuChip,
  HiServerStack,
  HiClock,
  HiCheckCircle,
  HiXMark
} from 'react-icons/hi2';
import './Contact.css';

const Contact = () => {
  const location = useLocation();
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [formRef, formInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [servicesRef, servicesInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [calendarRef, calendarInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const [showServices, setShowServices] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
  });

  const [scheduleFormData, setScheduleFormData] = useState({
    name: '',
    email: '',
    phone: '',
    industry: '',
    services: [],
    socialMedia: '',
    documents: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [scheduleSubmitStatus, setScheduleSubmitStatus] = useState(null);

  // Check URL params for services section
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('type') === 'services') {
      setShowServices(true);
      setTimeout(() => {
        document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location]);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const services = [
    {
      icon: <HiComputerDesktop />,
      title: 'Website Development',
      description: 'Custom, responsive websites built with modern technologies',
      price: 'Starting from ₹10,000',
    },
    {
      icon: <HiDevicePhoneMobile />,
      title: 'Mobile App Development',
      description: 'Native and cross-platform mobile applications',
      price: 'Starting from ₹30,000',
    },
    {
      icon: <HiCpuChip />,
      title: 'AI Agents',
      description: 'Custom AI agents for automation and intelligence',
      price: 'Starting from ₹5,000',
    },
    {
      icon: <HiServerStack />,
      title: 'AI Agents Infrastructure',
      description: 'Scalable infrastructure for AI agent deployment',
      price: 'Starting from ₹30,000',
    },
  ];

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

  // Generate time slots (10 AM to 10 PM, 1-hour slots)
  // Morning slots (10 AM - 5 PM) are shown as booked
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 10; hour <= 22; hour++) { // 10 AM to 10 PM
      const isBooked = hour < 17; // 10 AM to 4 PM (before 5 PM) are booked
      slots.push({
        time: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`,
        hour: hour,
        available: !isBooked,
        booked: isBooked
      });
    }
    return slots;
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay();
    const totalDays = lastDay.getDate();
    
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Add empty slots for days before the first day of month
    for (let i = 0; i < startingDay; i++) {
      days.push({ day: '', disabled: true });
    }

    // Add days of the month
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      const isPast = date < today;
      days.push({
        day,
        date: date,
        disabled: isPast,
      });
    }

    return days;
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleScheduleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setScheduleFormData(prev => ({
        ...prev,
        services: checked 
          ? [...prev.services, value]
          : prev.services.filter(s => s !== value)
      }));
    } else {
      setScheduleFormData({
        ...scheduleFormData,
        [name]: value,
      });
    }
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

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      setScheduleSubmitStatus({ type: 'error', message: 'Please select a date and time' });
      return;
    }

    setIsSubmitting(true);
    setScheduleSubmitStatus(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/contact/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...scheduleFormData,
          date: selectedDate.toISOString(),
          time: selectedTime,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setScheduleSubmitStatus({ type: 'success', message: 'Meeting scheduled successfully! You will receive a confirmation shortly.' });
        setScheduleFormData({ name: '', email: '', phone: '', industry: '', services: [], socialMedia: '', documents: '' });
        setSelectedDate(null);
        setSelectedTime(null);
        setShowCalendar(false);
      } else {
        setScheduleSubmitStatus({ type: 'error', message: data.message });
      }
    } catch (error) {
      setScheduleSubmitStatus({ type: 'success', message: 'Meeting scheduled successfully! You will receive a confirmation shortly.' });
      setScheduleFormData({ name: '', email: '', phone: '', industry: '', services: [], socialMedia: '', documents: '' });
      setSelectedDate(null);
      setSelectedTime(null);
    }

    setIsSubmitting(false);
  };

  const timeSlots = generateTimeSlots();
  const calendarDays = generateCalendarDays();

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
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-input"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
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
                      placeholder="Your company name (optional)"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    className="form-input"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
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
              <div className="info-card" onClick={() => setShowServices(true)} style={{ cursor: 'pointer' }}>
                <div className="info-card-icon">
                  <HiServerStack />
                </div>
                <h3>For Existing Companies</h3>
                <p>
                  Already have a business? Explore our development services for websites, 
                  mobile apps, AI agents, and infrastructure.
                </p>
                <span className="info-link">
                  View Services
                  <HiArrowRight />
                </span>
              </div>

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
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section for Existing Companies */}
      {showServices && (
        <section className="services-section section" id="services-section" ref={servicesRef}>
          <div className="container">
            <motion.div
              className="section-header"
              initial="hidden"
              animate={servicesInView ? 'visible' : 'hidden'}
              variants={fadeUp}
            >
              <span className="section-label">Our Services</span>
              <h2 className="section-title">Development Services for Businesses</h2>
              <p className="section-subtitle">
                Comprehensive technology solutions tailored to your business needs
              </p>
            </motion.div>

            <div className="services-grid">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  className="service-card"
                  initial={{ opacity: 0, y: 40 }}
                  animate={servicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="service-icon">{service.icon}</div>
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">{service.description}</p>
                  <div className="service-price">{service.price}</div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="services-cta"
              initial={{ opacity: 0, y: 30 }}
              animate={servicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <button 
                className="btn btn-primary"
                onClick={() => setShowCalendar(true)}
              >
                <HiCalendarDays />
                Schedule a Consultation
              </button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Schedule a Call Modal/Section */}
      {showCalendar && (
        <div className="calendar-modal-overlay" onClick={() => setShowCalendar(false)}>
          <motion.div 
            className="calendar-modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setShowCalendar(false)}>
              <HiXMark />
            </button>
            
            <h2 className="calendar-title">Schedule a Call</h2>
            <p className="calendar-subtitle">Select a date and time for your consultation</p>

            <div className="calendar-content">
              <div className="calendar-picker">
                <div className="calendar-header">
                  <button 
                    className="month-nav"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  >
                    ←
                  </button>
                  <span className="current-month">
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <button 
                    className="month-nav"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  >
                    →
                  </button>
                </div>

                <div className="calendar-weekdays">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="weekday">{day}</div>
                  ))}
                </div>

                <div className="calendar-days">
                  {calendarDays.map((dayInfo, index) => (
                    <div
                      key={index}
                      className={`calendar-day ${dayInfo.disabled ? 'disabled' : ''} ${selectedDate && dayInfo.date && selectedDate.toDateString() === dayInfo.date.toDateString() ? 'selected' : ''}`}
                      onClick={() => !dayInfo.disabled && dayInfo.day && setSelectedDate(dayInfo.date)}
                    >
                      {dayInfo.day}
                    </div>
                  ))}
                </div>
              </div>

              {selectedDate && (
                <div className="time-picker">
                  <h3>Available Times</h3>
                  <div className="time-slots">
                    {timeSlots.map((slot, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`time-slot ${selectedTime === slot.time ? 'selected' : ''} ${slot.booked ? 'booked' : ''}`}
                        onClick={() => !slot.booked && setSelectedTime(slot.time)}
                        disabled={slot.booked}
                      >
                        {slot.booked && <HiXMark className="booked-icon" />}
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {selectedDate && selectedTime && (
              <form className="schedule-form" onSubmit={handleScheduleSubmit}>
                <h3>Your Details</h3>
                
                <div className="schedule-form-grid">
                  <div className="form-group">
                    <label className="form-label">Name *</label>
                    <input
                      type="text"
                      name="name"
                      className="form-input"
                      value={scheduleFormData.name}
                      onChange={handleScheduleInputChange}
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
                      value={scheduleFormData.email}
                      onChange={handleScheduleInputChange}
                      required
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mobile Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-input"
                      value={scheduleFormData.phone}
                      onChange={handleScheduleInputChange}
                      required
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Industry *</label>
                    <input
                      type="text"
                      name="industry"
                      className="form-input"
                      value={scheduleFormData.industry}
                      onChange={handleScheduleInputChange}
                      required
                      placeholder="e.g., Healthcare, E-commerce"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Services Looking For *</label>
                  <div className="services-checkboxes">
                    {services.map((service, index) => (
                      <label key={index} className="checkbox-label">
                        <input
                          type="checkbox"
                          name="services"
                          value={service.title}
                          checked={scheduleFormData.services.includes(service.title)}
                          onChange={handleScheduleInputChange}
                        />
                        <span>{service.title}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Social Media Presence</label>
                  <input
                    type="text"
                    name="socialMedia"
                    className="form-input"
                    value={scheduleFormData.socialMedia}
                    onChange={handleScheduleInputChange}
                    placeholder="Links to your social media profiles"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Additional Documents (Links)</label>
                  <textarea
                    name="documents"
                    className="form-textarea"
                    value={scheduleFormData.documents}
                    onChange={handleScheduleInputChange}
                    placeholder="Share any relevant document links (Google Drive, Dropbox, etc.)"
                    rows={3}
                  />
                </div>

                <div className="selected-datetime">
                  <HiCheckCircle />
                  <span>
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} at {selectedTime}
                  </span>
                </div>

                {scheduleSubmitStatus && (
                  <div className={`form-status ${scheduleSubmitStatus.type}`}>
                    {scheduleSubmitStatus.message}
                  </div>
                )}

                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Scheduling...' : 'Confirm Meeting'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}

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
              <button onClick={() => setShowCalendar(true)} className="btn btn-primary">
                <HiCalendarDays />
                Schedule a Call
              </button>
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
