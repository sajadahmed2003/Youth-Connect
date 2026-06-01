import React, { useState, useEffect } from 'react';
import { Search, MapPin, Zap, ArrowRight, CheckCircle, X, Mail, Phone, ShieldCheck, Heart, Landmark, Award, Clock, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../config';

// ============================================
// 🧠 PILLAR 2: DYNAMIC AI MATCH BADGE COMPONENT
// ============================================
const AIMatchBadge = ({ campaignId }) => {
  const [loading, setLoading] = useState(true);
  const [matchData, setMatchData] = useState(null);

  useEffect(() => {
    const fetchAIMatch = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/api/ai/match`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ campaignId })
        });
        if (res.ok) {
          const data = await res.json();
          setMatchData(data);
        }
      } catch (err) {
        console.error("AI matching failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAIMatch();
  }, [campaignId]);

  if (loading) {
    return (
      <div style={{
        background: 'rgba(124, 58, 237, 0.03)',
        borderRadius: '12px',
        padding: '12px 16px',
        border: '1px dashed rgba(124, 58, 237, 0.15)',
        marginBottom: '16px',
        animation: 'pulse 1.5s infinite'
      }}>
        <div style={{ height: '14px', background: 'rgba(0,0,0,0.04)', borderRadius: '4px', width: '40%', marginBottom: '6px' }} />
        <div style={{ height: '12px', background: 'rgba(0,0,0,0.03)', borderRadius: '4px', width: '85%' }} />
      </div>
    );
  }

  if (!matchData) return null;

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, rgba(6, 182, 212, 0.03) 100%)',
      borderRadius: '14px',
      padding: '14px 18px',
      border: '1px solid rgba(124, 58, 237, 0.12)',
      marginBottom: '18px',
      boxShadow: '0 4px 20px rgba(124, 58, 237, 0.02)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '0.68rem',
          fontWeight: '900'
        }}>AI</div>
        <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-primary)' }}>
          {matchData.matchScore}% Compatibility Score
        </span>
      </div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0 }}>
        {matchData.reason}
      </p>
    </div>
  );
};

const VolunteerHome = ({ user, applications = [], setApplications }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [campaigns, setCampaigns] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactStatus, setContactStatus] = useState('');

  // 💎 PILLAR 1: Donation checkout modal state
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donateCamp, setDonateCamp] = useState(null);
  const [donateAmount, setDonateAmount] = useState('1000');
  const [donateStep, setDonateStep] = useState(1); // 1 = select, 2 = checkout card, 3 = success
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [pointsEarned, setPointsEarned] = useState(0);
  const [showGoalAchievedModal, setShowGoalAchievedModal] = useState(false);
  const [useAIMatches, setUseAIMatches] = useState(false);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);

  const toggleReadMore = (id) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async (useAI = false) => {
    setLoadingCampaigns(true);
    try {
      const token = localStorage.getItem('token');
      const url = (useAI && token) 
        ? `${API_BASE}/api/ai/recommended-campaigns` 
        : `${API_BASE}/api/campaigns`;
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const res = await fetch(url, { headers });
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data);
      }
    } catch (err) { console.error(err); }
    finally {
      setLoadingCampaigns(false);
    }
  };

  const handleToggleAI = (val) => {
    setUseAIMatches(val);
    if (val) setActiveFilter('All');
    fetchCampaigns(val);
  };

  const categories = ['All', 'Environment', 'Education', 'Health', 'Social'];

  const filtered = campaigns.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All' || c.categories?.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  const handleJoin = async (camp) => {
    const token = localStorage.getItem('token');
    if (!token) { alert('Please login first.'); navigate('/auth'); return; }
    try {
      const res = await fetch(`${API_BASE}/api/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ campaignId: camp._id })
      });
      if (res.ok) {
        const newApp = await res.json();
        if (setApplications) setApplications([...applications, newApp]);
        setSelectedCamp(camp);
        setShowModal(true);
      } else {
        const err = await res.json();
        alert(err.error || 'Request failed.');
      }
    } catch (e) { alert('Connection Error'); }
  };

  const openDonationFlow = (camp) => {
    const token = localStorage.getItem('token');
    if (!token) { alert('Please login first to contribute.'); navigate('/auth'); return; }

    if (camp.targetAmount && camp.raisedAmount >= camp.targetAmount) {
      setShowGoalAchievedModal(true);
      return;
    }

    setDonateCamp(camp);
    setDonateAmount('1000');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setDonateStep(1);
    setShowDonateModal(true);
  };

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    if (donateStep === 1) {
      setDonateStep(2);
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/api/campaigns/${donateCamp._id}/donate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: Number(donateAmount) })
      });

      if (res.ok) {
        const data = await res.json();
        setPointsEarned(Math.round(Number(donateAmount) * 0.1));
        setDonateStep(3);
        fetchCampaigns(); // Update raised funds visually
      } else {
        const err = await res.json();
        alert(err.error || 'Donation rejected.');
      }
    } catch (e) {
      alert('Payment processing error. Please try again.');
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactStatus('Sending...');
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      if (res.ok) {
        setContactStatus('Message Sent Successfully!');
        setContactForm({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setContactStatus(''), 5000);
      }
    } catch (e) { setContactStatus('Error sending message.'); }
  };

  return (
    <div className="volunteer-home-premium" style={{ background: 'var(--bg-base)', minHeight: '100vh', fontFamily: 'var(--font-body)', position: 'relative' }}>
      
      {/* 🚀 HERO SECTION */}
      <div id="home" style={{ 
        background: 'var(--gradient-hero)', 
        padding: '100px 24px', 
        textAlign: 'center', 
        color: 'var(--text-primary)',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at center, rgba(124, 58, 237, 0.05) 0%, transparent 70%)', zIndex: 1 }}></div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}>
          <div className="section-label" style={{ display: 'inline-flex' }}>Empower Change</div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', fontWeight: '900', marginBottom: '20px', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
            Join Active <span style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Campaigns</span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
            Discover opportunities to volunteer, donate funds securely, and connect with global NGOs to make a real tangible impact.
          </p>
          
          <div className="search-container" style={{ display: 'flex', background: 'var(--bg-input)', border: '1px solid var(--border)', padding: '8px', borderRadius: 'var(--radius-full)', backdropFilter: 'blur(10px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '0 20px', flex: 1 }}>
              <Search size={20} color="var(--primary-light)" style={{ marginRight: '12px' }} />
              <input 
                type="text" 
                placeholder="Search by campaign title..." 
                className="cyber-input"
                style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', fontSize: '1rem', color: 'var(--text-primary)', padding: 0 }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" style={{ padding: '12px 32px', borderRadius: 'var(--radius-full)' }}>Search</button>
          </div>
        </div>
      </div>

      {/* 🧬 FILTERS */}
      <div className="filters-container" style={{ padding: '50px 24px 0 24px', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {localStorage.getItem('token') && (
          <button 
            onClick={() => handleToggleAI(!useAIMatches)}
            className="btn"
            style={{
              padding: '10px 24px',
              borderRadius: 'var(--radius-full)',
              background: useAIMatches ? 'linear-gradient(135deg, #7c3aed, #06b6d4)' : 'rgba(124, 58, 237, 0.05)',
              color: useAIMatches ? 'white' : '#7c3aed',
              border: useAIMatches ? 'none' : '1px solid rgba(124, 58, 237, 0.25)',
              boxShadow: useAIMatches ? 'var(--shadow-glow)' : 'none',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            🧠 AI RECOMMENDED
          </button>
        )}
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => {
              setActiveFilter(cat);
              setUseAIMatches(false);
              fetchCampaigns(false);
            }}
            className="btn"
            style={{
              padding: '10px 24px',
              borderRadius: 'var(--radius-full)',
              background: (!useAIMatches && activeFilter === cat) ? 'var(--gradient-primary)' : 'rgba(0, 0, 0, 0.03)',
              color: (!useAIMatches && activeFilter === cat) ? 'white' : 'var(--text-secondary)',
              border: (!useAIMatches && activeFilter === cat) ? 'none' : '1px solid var(--border)',
              boxShadow: (!useAIMatches && activeFilter === cat) ? 'var(--shadow-glow)' : 'none',
              fontWeight: '700'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 📦 CAMPAIGN GRID */}
      <div id="campaigns" style={{ padding: '60px 24px', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
        {loadingCampaigns ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px 40px' }} className="cyber-card">
            <div className="loader-glow" style={{ margin: '0 auto 24px auto' }}></div>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.25rem', margin: '0 0 8px 0', letterSpacing: '0.5px' }}>WAKING UP SECURE CLOUD SERVERS...</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>
              Note: The secure API tier uses Render free hosting, which can take up to 50 seconds to spin up from sleep. Thank you for your patience!
            </p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="cyber-card" style={{ textAlign: 'center', gridColumn: '1/-1', padding: '80px 40px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '20px' }}>No live campaigns found.</p>
            {(user?.role === 'ngo' || user?.role === 'admin') && (
              <button 
                onClick={() => navigate(user.role === 'ngo' ? '/campaign-portal' : '/admin-dashboard', { state: { activeTab: 'campaigns' } })}
                className="btn btn-primary"
              >
                POST NEW CAMPAIGN
              </button>
            )}
          </div>
        ) : null}
        {!loadingCampaigns && filtered.map(camp => {
          const myApp = applications?.find(app => (app.campaignId?._id === camp._id || app.campaignId === camp._id));
          
          // Crowdfunding targets definition
          const target = camp.targetAmount || 0;
          const hasFunding = target > 0;
          const raised = camp.raisedAmount || 0;
          const percent = target > 0 ? Math.min(Math.round((raised / target) * 100), 100) : 100;

          return (
            <div key={camp._id} className="cyber-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                <img src={camp.image || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800'} alt={camp.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div 
                  style={{ 
                    position: 'absolute', 
                    top: '16px', 
                    left: '16px',
                    background: 'rgba(10, 10, 15, 0.85)',
                    backdropFilter: 'blur(8px)',
                    color: '#c084fc',
                    border: '1px solid rgba(168, 85, 247, 0.4)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {(camp.categories?.[0] || 'GENERAL').toUpperCase()}
                </div>
                {camp.matchScore && (
                  <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(5, 5, 8, 0.75)', backdropFilter: 'blur(4px)' }} className="badge badge-accent">
                    🧠 {camp.matchScore}% Match
                  </div>
                )}
              </div>
              
              <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
                <div>
                  {camp.aiReason && (
                    <div style={{ 
                      background: 'rgba(124, 58, 237, 0.04)', 
                      border: '1px dashed rgba(124, 58, 237, 0.15)', 
                      padding: '10px 14px', 
                      borderRadius: '10px', 
                      fontSize: '0.78rem', 
                      color: 'var(--text-primary)', 
                      lineHeight: '1.4', 
                      marginBottom: '14px' 
                    }}>
                      <span style={{ fontWeight: '800', color: '#7c3aed' }}>AI Insight:</span> {camp.aiReason}
                    </div>
                  )}
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>{camp.title}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '14px' }}>
                    <MapPin size={14} className="text-accent" style={{ color: 'var(--accent)' }} /> {camp.location}
                  </div>
                  
                  {/* Description */}
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '18px' }}>
                    {(camp.description || camp.desc || '').length > 130 ? (
                      <>
                        {expandedCards[camp._id] ? (camp.description || camp.desc) : `${(camp.description || camp.desc).substring(0, 130)}...`}
                        <span 
                          onClick={() => toggleReadMore(camp._id)} 
                          style={{ color: 'var(--primary-light)', cursor: 'pointer', fontWeight: '700', marginLeft: '6px' }}
                        >
                          {expandedCards[camp._id] ? 'Show less' : 'Read more'}
                        </span>
                      </>
                    ) : (
                      (camp.description || camp.desc)
                    )}
                  </p>

                  {/* 🧠 DYNAMIC AI COMPATIBILITY GRID */}
                  {user && <AIMatchBadge campaignId={camp._id} />}

                  {/* 💎 PILLAR 1: Crowdfunding progress bar */}
                  {hasFunding && (
                    <div style={{
                      background: 'rgba(0, 0, 0, 0.02)',
                      border: '1px solid var(--border)',
                      borderRadius: '16px',
                      padding: '16px',
                      marginBottom: '20px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Landmark size={14} color="#7c3aed" /> Target Funding
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#7c3aed', fontWeight: '800' }}>
                          {percent}% Raised
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
                        <span>₹{raised.toLocaleString()}</span>
                        <span style={{ color: 'var(--text-muted)' }}>₹{target.toLocaleString()}</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${percent}%`, background: 'linear-gradient(90deg, #7c3aed, #06b6d4)', borderRadius: 'var(--radius-full)' }} />
                      </div>
                      
                      {camp.fundingReason && (
                        <div style={{ marginTop: '12px', fontSize: '0.78rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.01)', padding: '8px 12px', borderRadius: '8px', borderLeft: '3px solid #06b6d4' }}>
                          <strong style={{ color: 'var(--accent)', display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: '2px', fontWeight: '800' }}>Purpose of Funds:</strong>
                          {camp.fundingReason}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Primary actions */}
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Donate fund button */}
                  {hasFunding && !user?.role && (
                    <button 
                      onClick={() => openDonationFlow(camp)}
                      className="btn"
                      style={{
                        width: '100%',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                        color: 'white',
                        fontWeight: '700',
                        gap: '8px',
                        border: 'none',
                        boxShadow: '0 4px 15px rgba(6, 182, 212, 0.2)'
                      }}
                    >
                      <Heart size={16} fill="white" /> DONATE FUNDS
                    </button>
                  )}
                  {hasFunding && user?.role === 'volunteer' && (
                    <button 
                      onClick={() => openDonationFlow(camp)}
                      className="btn"
                      style={{
                        width: '100%',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                        color: 'white',
                        fontWeight: '700',
                        gap: '8px',
                        border: 'none',
                        boxShadow: '0 4px 15px rgba(6, 182, 212, 0.2)'
                      }}
                    >
                      <Heart size={16} fill="white" /> DONATE FUNDS
                    </button>
                  )}

                  {user?.role === 'admin' ? (
                    <div className="badge badge-primary" style={{ width: '100%', padding: '12px', justifyContent: 'center' }}>
                      ADMIN ACCESS ONLY
                    </div>
                  ) : user?.role === 'ngo' ? (
                    <div className="badge badge-accent" style={{ width: '100%', padding: '12px', justifyContent: 'center' }}>
                      CAMPAIGN ORGANIZER
                    </div>
                  ) : myApp ? (
                    <div className={`badge ${myApp.status === 'Accepted' ? 'badge-success' : 'badge-warning'}`} style={{ width: '100%', padding: '12px', justifyContent: 'center', gap: '8px' }}>
                      <CheckCircle size={16} /> {myApp.status === 'Pending' ? 'REQUEST SENT' : myApp.status.toUpperCase()}
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleJoin(camp)}
                      className="btn btn-ghost"
                      style={{ 
                        width: '100%', 
                        justifyContent: 'center',
                        background: 'rgba(124, 58, 237, 0.08)',
                        border: '1px solid rgba(124, 58, 237, 0.2)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      JOIN AS VOLUNTEER <ArrowRight size={16} style={{ color: 'var(--primary-light)' }} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ABOUT */}
      <div id="about" style={{ padding: '100px 24px', background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px', alignItems: 'center' }}>
          <div>
            <div className="section-label">Our Story</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '20px', letterSpacing: '-1px' }}>
              Empowering the <span style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Next Generation</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '20px' }}>
              Youth Connect is a global platform dedicated to bridging the gap between passionate young individuals and meaningful social impact opportunities. Since 2024, we've helped over 10,000 volunteers find their purpose.
            </p>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.98rem', lineHeight: '1.7', marginBottom: '30px', fontWeight: '800' }}>
              ⚠️ We collect donations on our platform to help campaigns directly purchase essential supplies, logistics, and ground-level resources. With absolute transparency, 96.5% of all raised funds are transferred directly to campaign managers, while the remaining 3.5% is allocated to cover secure payment processing fees and platform hosting/maintenance costs.
            </p>
            <div style={{ display: 'flex', gap: '40px' }}>
              <div>
                <h4 style={{ color: 'var(--primary-light)', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 5px 0' }}>500+</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>NGO Partners</p>
              </div>
              <div>
                <h4 style={{ color: 'var(--accent)', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 5px 0' }}>12k</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Active Missions</p>
              </div>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800" style={{ width: '100%', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }} alt="About us" />
            <div className="cyber-card" style={{ position: 'absolute', bottom: '-30px', right: '-20px', padding: '24px', maxWidth: '280px', background: 'rgba(30, 41, 59, 0.95)', border: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
              <p style={{ margin: 0, fontWeight: '500', fontSize: '0.95rem', fontStyle: 'italic', color: 'var(--text-primary)' }}>"Joining Youth Connect changed my perspective on community service forever."</p>
              <p style={{ margin: '12px 0 0 0', color: 'var(--primary-light)', fontSize: '0.85rem', fontWeight: '700' }}>— Sarah J., Volunteer</p>
            </div>
          </div>
        </div>
      </div>

      {/* GALLERY */}
      <div id="impact" style={{ padding: '100px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="section-label">Real Impact</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '15px' }}>Our <span style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Real Impact</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>Witness the powerful transformations happening across the globe through the dedicated efforts of our Youth Connect volunteers.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.8rem', fontWeight: '800', marginBottom: '16px' }}>Empowering <span style={{ color: 'var(--primary-light)' }}>Rural Education</span></h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.7' }}>We believe education is a fundamental right, not a privilege. Our volunteers have successfully established over 50 pop-up learning centers in remote villages, providing foundational education, digital literacy, and creative arts workshops to underprivileged children.</p>
            </div>
            <div>
              <img src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=1000" alt="Rural Education" style={{ width: '100%', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
            <div className="order-mobile-2">
              <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000" alt="Ocean Cleanup" style={{ width: '100%', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }} />
            </div>
            <div className="order-mobile-1">
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.8rem', fontWeight: '800', marginBottom: '16px' }}>Massive <span style={{ color: 'var(--accent)' }}>Ocean Cleanup</span></h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.7' }}>Plastic pollution threatens marine life. Through weekend beach cleanup drives, volunteers successfully removed over 10,000 lbs of plastic waste from coastlines, sorting and sending recyclables to processing plants.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTACT */}
      <div id="contact" style={{ padding: '100px 24px', background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div className="section-label">Connect</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>Get In <span style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Touch</span></h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>Have questions? Our team is here to help you start your journey.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="cyber-card" style={{ padding: '20px', display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(124, 58, 237, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail color="var(--primary-light)" size={20} />
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', margin: '0 0 2px 0', fontSize: '0.95rem', fontWeight: '800' }}>Email Us</h4>
                  <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.85rem' }}>support@youthconnect.org</p>
                </div>
              </div>
              
              <div className="cyber-card" style={{ padding: '20px', display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Phone color="var(--accent)" size={20} />
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', margin: '0 0 2px 0', fontSize: '0.95rem', fontWeight: '800' }}>Call Us</h4>
                  <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.85rem' }}>+1 (555) 000-1234</p>
                </div>
              </div>

              <div className="cyber-card" style={{ padding: '20px', display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(34, 197, 94, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MessageCircle color="#22c55e" size={20} />
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', margin: '0 0 2px 0', fontSize: '0.95rem', fontWeight: '800' }}>WhatsApp Support</h4>
                  <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.85rem' }}>+91 98765 43210 (24/7 Chat)</p>
                </div>
              </div>

              <div className="cyber-card" style={{ padding: '20px', display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(234, 179, 8, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin color="#eab308" size={20} />
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', margin: '0 0 2px 0', fontSize: '0.95rem', fontWeight: '800' }}>Office Headquarters</h4>
                  <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.85rem' }}>Sector 7, Cyber Hub, New Delhi, India</p>
                </div>
              </div>

              <div className="cyber-card" style={{ padding: '20px', display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock color="#f43f5e" size={20} />
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', margin: '0 0 2px 0', fontSize: '0.95rem', fontWeight: '800' }}>Open Hours</h4>
                  <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.85rem' }}>Mon - Sat: 9:00 AM - 6:00 PM IST</p>
                </div>
              </div>
            </div>
            <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="responsive-grid">
                <input type="text" placeholder="Your Name" required className="cyber-input" value={contactForm.name} onChange={e => setContactForm({...contactForm, name: e.target.value})} />
                <input type="email" placeholder="Your Email" required className="cyber-input" value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} />
              </div>
              <input type="text" placeholder="Subject" required className="cyber-input" value={contactForm.subject} onChange={e => setContactForm({...contactForm, subject: e.target.value})} />
              <textarea placeholder="Your Message" required rows="5" className="cyber-input" style={{ resize: 'none' }} value={contactForm.message} onChange={e => setContactForm({...contactForm, message: e.target.value})}></textarea>
              <button type="submit" className="btn btn-primary" style={{ padding: '14px', justifyContent: 'center' }}>SEND MESSAGE</button>
              {contactStatus && <p style={{ color: 'var(--primary-light)', fontWeight: 'bold', marginTop: '8px', fontSize: '0.9rem' }}>{contactStatus}</p>}
            </form>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: 'var(--bg-base)', borderTop: '1px solid var(--border)', padding: '80px 24px 40px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '60px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div className="logo-icon" style={{ width: '32px', height: '32px', fontSize: '0.9rem', background: '#7c3aed', color: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚡</div>
              <span style={{ fontWeight: '900', fontSize: '1.2rem', color: 'var(--text-primary)' }}>YOUTH CONNECT</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.9rem' }}>
              Global platform connecting young volunteers with transformative social initiatives and NGOs worldwide.
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '30px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          © 2026 Youth Connect. All Rights Reserved. Designed for Social Impact.
        </div>
      </footer>

      {/* Application Success Modal */}
      {showModal && selectedCamp && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="cyber-card" style={{ background: 'var(--bg-surface)', padding: '50px', maxWidth: '450px', textAlign: 'center', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24}/></button>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(74, 222, 128, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '2px solid #4ade80' }}>
              <CheckCircle size={40} color="#4ade80" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '16px' }}>Request Sent!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '30px' }}>
              Your application to volunteer for <strong style={{ color: 'var(--accent)' }}>{selectedCamp.title}</strong> has been transmitted. The NGO will review your credentials.
            </p>
            <button onClick={() => setShowModal(false)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>CONTINUE</button>
          </div>
        </div>
      )}

      {/* Goal Achieved Modal */}
      {showGoalAchievedModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="cyber-card" style={{ background: 'var(--bg-surface)', padding: '50px', maxWidth: '450px', textAlign: 'center', position: 'relative', border: '2px solid var(--accent)' }}>
            <button onClick={() => setShowGoalAchievedModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24}/></button>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>😊</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '16px' }}>Goal Achieved!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '30px' }}>
              The fund amount is successfully complete! You can donate to some other campaign.
            </p>
            <button onClick={() => setShowGoalAchievedModal(false)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', background: 'var(--gradient-primary)' }}>Discover Other Campaigns</button>
          </div>
        </div>
      )}

      {/* 💎 PILLAR 1: CROWDFUNDING DONATION MODAL */}
      {showDonateModal && donateCamp && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ width: '100%', maxWidth: '480px', padding: '36px', position: 'relative' }}>
            <button onClick={() => setShowDonateModal(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={24} /></button>
            
            {donateStep === 1 && (
              <form onSubmit={handleDonationSubmit}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <Landmark size={24} color="#06b6d4" />
                  <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>Contribute Funds</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '24px' }}>
                  Your donation goes directly to <b style={{ color: 'var(--text-primary)' }}>{donateCamp.title}</b>. A 3.5% SaaS platform fee applies to support server pipelines.
                </p>

                {/* Predefined Amounts */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '20px' }}>
                  {['500', '1000', '2500', '5000'].map(val => (
                    <button 
                      key={val}
                      type="button"
                      onClick={() => setDonateAmount(val)}
                      style={{
                        padding: '12px 0',
                        borderRadius: '12px',
                        border: donateAmount === val ? '2px solid #7c3aed' : '1px solid var(--border)',
                        background: donateAmount === val ? 'rgba(124, 58, 237, 0.08)' : 'transparent',
                        color: donateAmount === val ? '#7c3aed' : 'var(--text-secondary)',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      ₹{val}
                    </button>
                  ))}
                </div>

                {/* Custom Amount input */}
                <div style={{ marginBottom: '28px' }}>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Or enter Custom Amount (₹)</label>
                  <input 
                    type="number" 
                    placeholder="Enter amount..." 
                    className="cyber-input" 
                    value={donateAmount} 
                    onChange={e => setDonateAmount(e.target.value)} 
                    required 
                    min="100"
                    style={{ fontSize: '1.1rem', fontWeight: '800' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Proceed to Checkout
                </button>
              </form>
            )}

            {donateStep === 2 && (
              <form onSubmit={handleDonationSubmit}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <ShieldCheck size={24} color="#10b981" />
                  <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>Secure Payment Checkout</h3>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Donation Principal:</span>
                    <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>₹{Number(donateAmount).toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Platform Commission (3.5%):</span>
                    <span style={{ fontWeight: '800', color: 'var(--accent)' }}>₹{(Number(donateAmount) * 0.035).toFixed(2)}</span>
                  </div>
                </div>

                {/* Dummy Credit Card Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Dummy Card Number</label>
                    <input 
                      type="text" 
                      placeholder="4111 2222 3333 4444" 
                      className="cyber-input" 
                      value={cardNumber} 
                      onChange={e => setCardNumber(e.target.value)} 
                      required 
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Expiry</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        className="cyber-input" 
                        value={cardExpiry} 
                        onChange={e => setCardExpiry(e.target.value)} 
                        required 
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>CVV</label>
                      <input 
                        type="password" 
                        placeholder="123" 
                        maxLength="3" 
                        className="cyber-input" 
                        value={cardCvv} 
                        onChange={e => setCardCvv(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" onClick={() => setDonateStep(1)} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Back</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none' }}>
                    Pay ₹{Number(donateAmount).toLocaleString()}
                  </button>
                </div>
              </form>
            )}

            {donateStep === 3 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '72px', height: '72px', background: 'rgba(16,185,129,0.12)', color: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', border: '1px solid rgba(16,185,129,0.25)', animation: 'expandRing 1.5s infinite' }}>
                  <CheckCircle size={40} />
                </div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>Transaction Success!</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
                  Thank you for contributing <b style={{ color: 'var(--text-primary)' }}>₹{Number(donateAmount).toLocaleString()}</b>. Your payment transaction has been logged securely under grid logs.
                </p>

                {/* Points Card */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(250, 204, 21, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
                  border: '1px solid rgba(250, 204, 21, 0.25)',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  marginBottom: '32px'
                }}>
                  <Award size={28} color="#f59e0b" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.78rem', color: '#b45309', fontWeight: '800', textTransform: 'uppercase' }}>Gamified Award Unlock</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#78350f' }}>+{pointsEarned} Volunteer Points!</div>
                  </div>
                </div>

                <button onClick={() => setShowDonateModal(false)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Finish & Return</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerHome;
