import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Users, Heart, Target, ChevronRight } from 'lucide-react';

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
  },
  {
    title: 'Make an Impact',
    description: 'Join hands with NGOs and community leaders to create real change.',
    icon: Globe,
  },
  {
    title: 'Track Your Journey',
    description: 'Build your volunteer portfolio and earn certificates for your contributions.',
    icon: Target,
  }
];

function SearchIcon(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
    )
}

const Home = () => {
  return (
    <div className="home-container" style={{ minHeight: '100vh', overflow: 'hidden' }}>
      
      {/* BACKGROUND GRADIENTS */}
      <div style={{ position: 'fixed', top: '-10%', left: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(12,166,166,0.15) 0%, rgba(9,15,29,0) 70%)', filter: 'blur(60px)', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(74,222,128,0.1) 0%, rgba(9,15,29,0) 70%)', filter: 'blur(60px)', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* HERO SECTION */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '30px', marginTop: '40px', marginBottom: '80px' }}>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(12,166,166,0.1)', padding: '8px 16px', borderRadius: '30px', border: '1px solid rgba(12,166,166,0.3)' }}
          >
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#0ca6a6', boxShadow: '0 0 10px #0ca6a6' }} />
            <span style={{ color: '#0ca6a6', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px' }}>JOIN THE MOVEMENT</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ fontSize: '4.5rem', fontWeight: '900', color: 'white', lineHeight: '1.1', margin: 0, letterSpacing: '-1px' }}
          >
            Empower Change.<br />
            <span style={{ background: 'linear-gradient(90deg, #0ca6a6, #4ade80)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Connect Your Passion.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '600px', lineHeight: '1.6' }}
          >
            Join a global community of changemakers. Find volunteer opportunities, track your impact, and build a better world together.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            style={{ display: 'flex', gap: '20px', marginTop: '10px' }}
          >
            <Link to="/campaigns" style={{ textDecoration: 'none' }}>
              <button style={{ background: 'linear-gradient(135deg, #0ca6a6, #098787)', color: 'white', border: 'none', padding: '16px 32px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(12,166,166,0.3)', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                Explore Campaigns <ArrowRight size={20} />
              </button>
            </Link>
          </motion.div>
        </div>

        {/* STATS SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', padding: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)' }}
        >
          {stats.map((stat, idx) => (
            <div key={stat.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <div style={{ padding: '15px', background: 'rgba(12,166,166,0.1)', borderRadius: '16px', color: '#0ca6a6' }}>
                <stat.icon size={32} />
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white', textShadow: '0 0 20px rgba(255,255,255,0.1)' }}>{stat.value}</div>
              <div style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.name}</div>
            </div>
          ))}
        </motion.div>

        {/* FEATURES SECTION */}
        <div style={{ marginTop: '120px', marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', color: 'white', margin: '0 0 15px 0' }}>How It Works</h2>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>Simple steps to start your volunteering journey.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '40px', position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.3s' }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, #0ca6a6, transparent)' }} />
                <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(12,166,166,0.1)', color: '#0ca6a6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '25px' }}>
                  <feature.icon size={30} />
                </div>
                <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '15px' }}>{feature.title}</h3>
                <p style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '1.05rem', margin: 0 }}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
