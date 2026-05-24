import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Users, Heart, Target } from 'lucide-react';

const stats = [
  { id: 1, name: 'Active Campaigns', value: '150+', icon: Target },
  { id: 2, name: 'Dedicated Volunteers', value: '10k+', icon: Users },
  { id: 3, name: 'Communities Served', value: '500+', icon: Globe },
  { id: 4, name: 'Donations Raised', value: '$2M+', icon: Heart },
];

const features = [
  {
    title: 'Find Your Cause',
    description: 'Browse through hundreds of verified campaigns matching your skills and interests.',
    icon: SearchIcon,
    color: '#7c3aed',
    glow: 'rgba(124,58,237,0.2)',
  },
  {
    title: 'Make an Impact',
    description: 'Join hands with NGOs and community leaders to create real change.',
    icon: Globe,
    color: '#06b6d4',
    glow: 'rgba(6,182,212,0.2)',
  },
  {
    title: 'Track Your Journey',
    description: 'Build your volunteer portfolio and earn certificates for your contributions.',
    icon: Target,
    color: '#10b981',
    glow: 'rgba(16,185,129,0.2)',
  },
];

function SearchIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
  );
}

const Home = () => {
  return (
    <div className="home-container" style={{ minHeight: '100vh', overflow: 'hidden', fontFamily: 'var(--font-body)' }}>

      {/* Ambient Blobs */}
      <div style={{ position: 'fixed', top: '-15%', left: '-10%', width: '55vw', height: '55vw', background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-15%', right: '-10%', width: '45vw', height: '45vw', background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, padding: '80px 24px 60px', maxWidth: '1100px', margin: '0 auto' }}>

        {/* HERO SECTION */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '28px', marginBottom: '80px' }}>

          <motion.div
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="section-label"
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#a78bfa', display: 'inline-block', boxShadow: '0 0 8px #a78bfa' }} />
            Join the Movement
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: '900', color: 'var(--text-primary)', lineHeight: '1.1', margin: 0, letterSpacing: '-1.5px' }}
          >
            Empower Change.<br />
            <span style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Connect Your Passion.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.3 }}
            style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '560px', lineHeight: '1.7', margin: 0 }}
          >
            Join a global community of changemakers. Find volunteer opportunities, track your impact, and build a better world together.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }}
            style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <Link to="/campaigns" style={{ textDecoration: 'none' }}>
              <button className="btn btn-primary" style={{ fontSize: '0.95rem', padding: '13px 28px' }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Explore Campaigns <ArrowRight size={18} />
              </button>
            </Link>
          </motion.div>
        </div>

        {/* STATS SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
          className="responsive-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '100px' }}
        >
          {stats.map((stat) => (
            <div key={stat.id} className="stat-card" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '32px 20px' }}>
              <div className="stat-icon" style={{ margin: '0 auto 16px auto', width: '56px', height: '56px' }}>
                <stat.icon size={26} />
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: '900', color: 'var(--text-primary)', lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                {stat.name}
              </div>
            </div>
          ))}
        </motion.div>

        {/* FEATURES SECTION */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <div className="section-label" style={{ display: 'inline-flex', marginBottom: '16px' }}>How It Works</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--text-primary)', margin: '0 0 14px 0', fontWeight: '800', letterSpacing: '-0.5px' }}>
              Three Simple Steps
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto', lineHeight: '1.6' }}>
              Start your volunteering journey in minutes.
            </p>
          </div>

          <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="cyber-card"
                style={{ padding: '36px', cursor: 'default' }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${feature.color}, transparent)`, borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }} />
                <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', background: `rgba(${feature.color === '#7c3aed' ? '124,58,237' : feature.color === '#06b6d4' ? '6,182,212' : '16,185,129'},0.12)`, color: feature.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '22px' }}>
                  <feature.icon size={26} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: '800', marginBottom: '12px' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.65', fontSize: '0.95rem', margin: 0 }}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
