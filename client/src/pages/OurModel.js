import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  HiLightBulb, 
  HiCodeBracket, 
  HiRocketLaunch, 
  HiArrowTrendingUp, 
  HiCurrencyDollar, 
  HiCpuChip, 
  HiUserGroup, 
  HiCheckCircle,
  HiLifebuoy,
  HiChartBar,
  HiArrowRight
} from 'react-icons/hi2';
import './OurModel.css';

const OurModel = () => {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [processRef, processInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [benefitsRef, benefitsInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const processSteps = [
    {
      number: '01',
      icon: <HiLightBulb />,
      title: 'Ideation & Validation',
      description: 'You bring us your disruptive concept. We use our AI-powered analytical tools to stress-test the business model, analyze the market landscape, and build a data-driven financial forecast.',
    },
    {
      number: '02',
      icon: <HiCodeBracket />,
      title: 'Co-Creation & Build',
      description: 'Our AI and development divisions become your dedicated tech team. We work in agile sprints to build your Minimum Viable Product (MVP), from the core AI engine to the user-facing interface.',
    },
    {
      number: '03',
      icon: <HiRocketLaunch />,
      title: 'Launch & Go-to-Market',
      description: 'We deploy the product and provide the marketing automation tools and strategies needed for a powerful launch. We help you acquire your first users and achieve product-market fit.',
    },
    {
      number: '04',
      icon: <HiArrowTrendingUp />,
      title: 'Scale & Grow',
      description: 'As your technical co-founder, our partnership continues. We provide ongoing tech support, help you scale your infrastructure, and offer strategic guidance to prepare you for future funding rounds.',
    },
  ];

  const benefits = [
    {
      icon: <HiCurrencyDollar />,
      title: 'Zero Upfront Costs',
      description: 'We invest our resources and expertise in exchange for equity. No cash required from you.',
    },
    {
      icon: <HiCpuChip />,
      title: 'AI-First Approach',
      description: 'Every solution we build leverages cutting-edge AI to give you a competitive advantage.',
    },
    {
      icon: <HiUserGroup />,
      title: 'Full-Stack Team',
      description: 'From AI engineers to UI/UX designers, we provide the complete development team.',
    },
    {
      icon: <HiCheckCircle />,
      title: 'Proven Process',
      description: 'Our systematic approach has been refined through multiple successful ventures.',
    },
    {
      icon: <HiLifebuoy />,
      title: 'Ongoing Support',
      description: "We don't just build and leave. We continue as your technical partner through growth.",
    },
    {
      icon: <HiChartBar />,
      title: 'Market Validation',
      description: 'Our AI-driven analysis helps validate and refine your business model before launch.',
    },
  ];

  return (
    <main className="ourmodel-page">
      {/* Hero Section */}
      <section className="ourmodel-hero" ref={heroRef}>
        <div className="ourmodel-hero-bg">
          <div className="hero-grid"></div>
          <div className="hero-glow"></div>
        </div>
        <div className="container">
          <motion.div
            className="ourmodel-hero-content"
            initial="hidden"
            animate={heroInView ? 'visible' : 'hidden'}
            variants={fadeUp}
          >
            <span className="section-label">Our Model</span>
            <h1 className="ourmodel-hero-title">
              The FoundryAI Partnership:
              <br />
              <span className="gradient-text">Shared Risk, Shared Success</span>
            </h1>
            <p className="ourmodel-hero-subtitle">
              Our model is designed for true partnership. We succeed only when you succeed. We
              invest our world-class technology and expertise directly into your venture in
              exchange for equity, aligning our goals from day one.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section section" ref={processRef}>
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            animate={processInView ? 'visible' : 'hidden'}
            variants={fadeUp}
          >
            <span className="section-label">The Process</span>
            <h2 className="section-title">How We Work Together</h2>
            <p className="section-subtitle">
              From concept to scale, we're with you every step of the way.
            </p>
          </motion.div>

          <div className="process-timeline">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                className="process-step"
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                animate={processInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <div className="step-number gradient-text">{step.number}</div>
                <div className="step-content">
                  <div className="step-icon">{step.icon}</div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
                {index < processSteps.length - 1 && <div className="step-connector"></div>}
              </motion.div>
            ))}
          </div>
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
            <span className="section-label">Why Partner With Us</span>
            <h2 className="section-title">Why Partner With FoundryAI?</h2>
            <p className="section-subtitle">
              We bring more than just capital. We bring the complete technology stack and
              expertise needed to transform your vision into a market-leading product.
            </p>
          </motion.div>

          <div className="benefits-grid grid grid-3">
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

          <motion.div
            className="benefits-cta"
            initial={{ opacity: 0, y: 30 }}
            animate={benefitsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link to="/contact" className="btn btn-primary">
              Start Your Journey
              <HiArrowRight className="btn-icon" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default OurModel;
