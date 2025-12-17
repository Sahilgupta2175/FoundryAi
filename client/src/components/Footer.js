import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Our Model', path: '/our-model' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'About Us', path: '/about' },
  ];

  const getInTouchLinks = [
    { name: 'Careers', path: '/careers' },
    { name: 'Contact', path: '/contact' },
    { name: 'For Founders', path: 'mailto:foundryai.india@gmail.com', external: true },
  ];

  const contactInfo = [
    { icon: <HiMail />, text: 'foundryai.india@gmail.com', href: 'mailto:foundryai.india@gmail.com' },
    { icon: <HiPhone />, text: '+91 90594 67267', href: 'tel:+919059467267' },
    { icon: <HiLocationMarker />, text: 'Bangalore, Karnataka, India' },
  ];

  return (
    <footer className="footer">
      <div className="footer-glow"></div>
      <div className="container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="logo-icon">
                <span className="logo-letter">F</span>
              </div>
              <span className="logo-text">FoundryAI</span>
            </Link>
            <p className="footer-description">
              We don't fund startups. We build them. Partner with us to forge world class
              companies using AI native technology and strategic capital.
            </p>
            <div className="footer-contact">
              {contactInfo.map((item, index) => (
                <div key={index} className="contact-item">
                  <span className="contact-icon">{item.icon}</span>
                  {item.href ? (
                    <a href={item.href} className="contact-link">{item.text}</a>
                  ) : (
                    <span className="contact-text">{item.text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="footer-link">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get In Touch */}
          <div className="footer-links-section">
            <h4 className="footer-title">Get In Touch</h4>
            <ul className="footer-links">
              {getInTouchLinks.map((link) => (
                <li key={link.path}>
                  {link.external ? (
                    <a href={link.path} className="footer-link">{link.name}</a>
                  ) : (
                    <Link to={link.path} className="footer-link">{link.name}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Section */}
          <div className="footer-cta">
            <h4 className="footer-title">Ready to Build?</h4>
            <p className="cta-text">
              Let's have the conversation that could define your future.
            </p>
            <Link to="/contact" className="btn btn-primary">
              Start Building Today
            </Link>
            <div className="social-links">
              <motion.a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaLinkedin />
              </motion.a>
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTwitter />
              </motion.a>
              <motion.a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaInstagram />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="copyright">
            © {currentYear} FoundryAI. All rights reserved.
          </p>
          <div className="made-by">
            <span>Made with</span>
            <span className="heart">♥</span>
            <span>by FoundryAI Team</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
