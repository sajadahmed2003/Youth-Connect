import React, { useState, useEffect } from 'react';
import { Search, MapPin, Tag, Filter, Globe, Zap, ArrowRight, Target, CheckCircle, X, Mail, Phone, ShieldCheck, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VolunteerHome = ({ user }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [campaigns, setCampaigns] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactStatus, setContactStatus] = useState('');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('https://youth-connect-backend-6dn5.onrender.com/api/campaigns');
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data);
      }
    } catch (err) { console.error(err); }
  };

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const categories = ['All', 'Environment', 'Education', 'Health', 'Social'];

  const seedCampaigns = async () => {
    const demos = [
      { title: 'Ocean Cleanup Drive', category: 'Environment', location: 'Coastal Zone A', image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80fbe5e?auto=format&fit=crop&q=80&w=800', description: 'Join us for a massive beach and ocean cleanup initiative.', neededPositions: 50 },
      { title: 'Youth Literacy Program', category: 'Education', location: 'District Library', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800', description: 'Empower the next generation by helping children improve their skills.', neededPositions: 15 }
    ];
    const token = localStorage.getItem('token');
    for (const d of demos) {
      await fetch('https://youth-connect-backend-6dn5.onrender.com/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...d, categories: [d.category] })
      });
    }
    fetchCampaigns();
  };

  const filtered = campaigns.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All' || c.categories?.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  const handleJoin = async (camp) => {
    const token = localStorage.getItem('token');
    if(!token) { alert('Please login first.'); navigate('/auth'); return; }
    try {
        const res = await fetch('https://youth-connect-backend-6dn5.onrender.com/api/applications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ campaignId: camp._id })
        });
        if(res.ok) {
            setSelectedCamp(camp);
            setShowModal(true);
        } else {
            const err = await res.json();
            alert(err.error || 'Request failed.');
        }
    } catch(e) { alert('Connection Error'); }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactStatus('Sending...');
    try {
        const res = await fetch('https://youth-connect-backend-6dn5.onrender.com/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactForm)
        });
        if(res.ok) {
            setContactStatus('Message Sent Successfully!');
            setContactForm({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setContactStatus(''), 5000);
        }
    } catch(e) { setContactStatus('Error sending message.'); }
  };

  return (
    <div className="volunteer-home-premium" style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      


      {/* 🚀 HERO SECTION */}
      <div id="home" style={{ 
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
          padding: '120px 60px', 
          textAlign: 'center', 
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at center, rgba(12, 166, 166, 0.15) 0%, transparent 70%)', zIndex: 1 }}></div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: '4.5rem', fontWeight: '900', marginBottom: '24px', letterSpacing: '-2px', textShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>Join Ongoing <span style={{ color: '#4ade80' }}>Campaigns</span></h1>
          <p style={{ fontSize: '1.4rem', color: '#94a3b8', maxWidth: '800px', margin: '0 auto 60px auto', lineHeight: '1.6' }}>Discover opportunities to volunteer, connect with global NGOs, and make a real tangible impact in society today.</p>
          
          <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', background: 'white', padding: '10px', borderRadius: '80px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '0 30px', flex: 1 }}>
              <Search size={22} color="#0ca6a6" style={{ marginRight: '15px' }} />
              <input 
                type="text" 
                placeholder="Search by campaign title..." 
                style={{ border: 'none', width: '100%', outline: 'none', fontSize: '1.1rem', color: '#1e293b' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button style={{ background: '#0ca6a6', color: 'white', border: 'none', padding: '18px 45px', borderRadius: '60px', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', transition: '0.3s' }}>Search Now</button>
          </div>
        </div>
      </div>

      {/* 🧬 FILTERS */}
      <div style={{ padding: '60px 60px 0 60px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveFilter(cat)}
            style={{
              padding: '12px 30px',
              borderRadius: '30px',
              border: activeFilter === cat ? 'none' : '1px solid #e2e8f0',
              background: activeFilter === cat ? '#0ca6a6' : 'white',
              color: activeFilter === cat ? 'white' : '#64748b',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: activeFilter === cat ? '0 10px 15px -3px rgba(12, 166, 166, 0.3)' : 'none'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 📦 CAMPAIGN GRID */}
      <div id="campaigns" style={{ padding: '60px' }}>
        {campaigns.length === 0 && (
            <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '100px' }}>
                <p style={{ color: '#1e293b', fontSize: '1.2rem', marginBottom: '20px' }}>No live campaigns found.</p>
                {(user?.role === 'ngo' || user?.role === 'admin') && (
                    <button 
                        onClick={() => navigate(user.role === 'ngo' ? '/campaign-portal' : '/admin-dashboard', { state: { activeTab: 'campaigns' } })}
                        style={{ 
                            padding: '15px 40px', 
                            background: '#0ca6a6', 
                            border: 'none', 
                            borderRadius: '15px', 
                            color: 'white', 
                            fontWeight: '900', 
                            cursor: 'pointer',
                            boxShadow: '0 10px 30px rgba(12, 166, 166, 0.3)'
                        }}
                    >
                        POST NEW CAMPAIGN
                    </button>
                )}
            </div>
        )}
        {filtered.map(camp => (
          <div key={camp._id} className="premium-campaign-card" style={{ 
            background: 'white', 
            borderRadius: '30px', 
            overflow: 'hidden', 
            boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
            transition: 'all 0.4s ease',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid rgba(0,0,0,0.02)'
          }}>
            <div style={{ position: 'relative', height: '260px', overflow: 'hidden' }}>
              <img src={camp.image} alt={camp.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.6s' }} className="card-image-hover" />
              <div style={{ position: 'absolute', top: '25px', left: '25px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', padding: '8px 18px', borderRadius: '15px', fontWeight: '800', fontSize: '0.75rem', color: '#0ca6a6', letterSpacing: '1px' }}>
                {(camp.categories?.[0] || 'GENERAL').toUpperCase()}
              </div>
            </div>
            
            <div style={{ padding: '40px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#1e293b', marginBottom: '15px' }}>{camp.title}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>
                <MapPin size={16} color="#0ca6a6" /> {camp.location}
              </div>
              <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: '1.8', marginBottom: '40px', flex: 1 }}>{camp.description || camp.desc}</p>
              
              <button 
                onClick={() => handleJoin(camp)}
                style={{ 
                  width: '100%', 
                  padding: '20px', 
                  background: '#f1f5f9', 
                  border: 'none', 
                  borderRadius: '20px', 
                  color: '#1e293b', 
                  fontWeight: '900', 
                  fontSize: '1rem', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '12px',
                  transition: '0.3s'
                }}
                className="join-btn-hover"
              >
                JOIN NOW <ArrowRight size={20} color="#0ca6a6" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 📖 ABOUT SECTION */}
      <div id="about" style={{ padding: '120px 10%', background: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '3rem', fontWeight: '800', color: 'white', marginBottom: '30px' }}>Empowering the <span style={{ color: '#0ca6a6' }}>Next Generation</span></h2>
            <p style={{ color: '#94a3b8', fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '40px' }}>
              Youth Connect is a global platform dedicated to bridging the gap between passionate young individuals and meaningful social impact opportunities. Since 2024, we've helped over 10,000 volunteers find their purpose.
            </p>
            <div style={{ display: 'flex', gap: '30px' }}>
              <div>
                <h4 style={{ color: '#0ca6a6', fontSize: '2.5rem', fontWeight: '800', margin: '0 0 10px 0' }}>500+</h4>
                <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>NGO Partners</p>
              </div>
              <div>
                <h4 style={{ color: '#4ade80', fontSize: '2.5rem', fontWeight: '800', margin: '0 0 10px 0' }}>12k</h4>
                <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>Active Missions</p>
              </div>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800" style={{ width: '100%', borderRadius: '30px', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }} />
            <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', background: '#0ca6a6', padding: '40px', borderRadius: '30px', color: 'white', maxWidth: '280px' }}>
              <p style={{ margin: 0, fontWeight: '700', fontSize: '1.1rem', fontStyle: 'italic' }}>"Joining Youth Connect changed my perspective on community service forever."</p>
              <p style={{ margin: '15px 0 0 0', opacity: 0.8, fontSize: '0.9rem' }}>— Sarah J., Volunteer</p>
            </div>
          </div>
        </div>
      </div>

      {/* 📧 CONTACT SECTION */}
      <div id="contact" style={{ padding: '120px 10%', background: '#090f1d' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: '800', color: 'white', marginBottom: '20px' }}>Get In <span style={{ color: '#0ca6a6' }}>Touch</span></h2>
          <p style={{ color: '#64748b', fontSize: '1.2rem' }}>Have questions? Our team is here to help you start your journey.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '60px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <Mail color="#0ca6a6" size={30} style={{ marginBottom: '15px' }} />
              <h4 style={{ color: 'white', margin: '0 0 5px 0' }}>Email Us</h4>
              <p style={{ color: '#64748b', margin: 0 }}>support@youthconnect.org</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <Phone color="#4ade80" size={30} style={{ marginBottom: '15px' }} />
              <h4 style={{ color: 'white', margin: '0 0 5px 0' }}>Call Us</h4>
              <p style={{ color: '#64748b', margin: 0 }}>+1 (555) 000-1234</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <MapPin color="#0ca6a6" size={30} style={{ marginBottom: '15px' }} />
              <h4 style={{ color: 'white', margin: '0 0 5px 0' }}>Our Location</h4>
              <p style={{ color: '#64748b', margin: 0 }}>123 Impact Plaza, Global City</p>
            </div>
          </div>
          <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <input type="text" placeholder="Your Name" required value={contactForm.name} onChange={e => setContactForm({...contactForm, name: e.target.value})} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', color: 'white', outline: 'none' }} />
              <input type="email" placeholder="Your Email" required value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', color: 'white', outline: 'none' }} />
            </div>
            <input type="text" placeholder="Subject" required value={contactForm.subject} onChange={e => setContactForm({...contactForm, subject: e.target.value})} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', color: 'white', outline: 'none' }} />
            <textarea placeholder="Your Message" required rows="6" value={contactForm.message} onChange={e => setContactForm({...contactForm, message: e.target.value})} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', color: 'white', outline: 'none', resize: 'none' }}></textarea>
            <button type="submit" style={{ background: 'linear-gradient(90deg, #0ca6a6 0%, #4ade80 100%)', border: 'none', padding: '20px', borderRadius: '15px', color: 'white', fontWeight: '800', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 20px 40px rgba(12, 166, 166, 0.3)' }}>SEND MESSAGE</button>
            {contactStatus && <p style={{ color: '#0ca6a6', fontWeight: 'bold', marginTop: '10px' }}>{contactStatus}</p>}
          </form>
        </div>
      </div>

      <div id="volunteer" style={{ display: 'none' }}></div>

      {/* 📍 FOOTER */}
      <footer style={{ background: 'white', borderTop: '1px solid #e2e8f0', padding: '100px 60px 60px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '60px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#0ca6a6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <Zap size={18} fill="white" />
              </div>
              <span style={{ fontWeight: '900', fontSize: '1.4rem', color: '#1e293b' }}>YOUTH CONNECT</span>
            </div>
            <p style={{ color: '#64748b', lineHeight: '1.8', marginBottom: '40px', fontSize: '1.05rem' }}>Global platform connecting young volunteers with transformative social initiatives and NGOs worldwide.</p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div className="social-icon"><Globe size={22} color="#64748b" /></div>
              <div className="social-icon"><ShieldCheck size={22} color="#64748b" /></div>
              <div className="social-icon"><Users size={22} color="#64748b" /></div>
            </div>
          </div>
          
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', marginBottom: '30px' }}>Platform</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {[
                { name: 'Campaigns', path: '/home' },
                { name: 'Activity Feed', path: '/feed' },
                { name: 'How it works', path: '/info/how-it-works' },
                { name: 'Success Stories', path: '/info/success-stories' }
              ].map(it => (
                <li key={it.name} onClick={() => navigate(it.path)} style={{ color: '#64748b', cursor: 'pointer', transition: '0.2s' }} onMouseOver={(e) => e.target.style.color = '#0ca6a6'} onMouseOut={(e) => e.target.style.color = '#64748b'}>
                  {it.name}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', marginBottom: '30px' }}>Support</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {[
                { name: 'Help Center', action: () => navigate('/info/help-center') },
                { name: 'Safety Rules', action: () => navigate('/info/safety-rules') },
                { name: 'Contact Us', action: () => { const el = document.getElementById('contact'); if(el) el.scrollIntoView({behavior: 'smooth'}); } },
                { name: 'Bug Report', action: () => navigate('/info/bug-report') }
              ].map(it => (
                <li key={it.name} onClick={it.action} style={{ color: '#64748b', cursor: 'pointer', transition: '0.2s' }} onMouseOver={(e) => e.target.style.color = '#0ca6a6'} onMouseOut={(e) => e.target.style.color = '#64748b'}>
                  {it.name}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', marginBottom: '30px' }}>Contact</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#64748b', marginBottom: '20px' }}>
              <Mail size={18} color="#0ca6a6" /> support@youthconnect.org
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#64748b' }}>
              <Phone size={18} color="#0ca6a6" /> +1 (555) 000-1234
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '100px', borderTop: '1px solid #f1f5f9', paddingTop: '40px', color: '#94a3b8', fontSize: '0.9rem' }}>
          © 2026 Youth Connect. All Rights Reserved. Designed for Social Impact.
        </div>
      </footer>

      {/* 🎭 MODAL POPUP */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, animation: 'fadeIn 0.3s ease' }}>
          <div style={{ background: 'white', padding: '60px', borderRadius: '40px', textAlign: 'center', maxWidth: '500px', position: 'relative', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '30px', right: '30px', background: 'none', border: 'none', cursor: 'pointer' }}><X size={28} color="#cbd5e1" /></button>
            <div style={{ width: '90px', height: '90px', background: '#dcfce7', color: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px auto' }}>
              <CheckCircle size={50} />
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#1e293b', marginBottom: '15px' }}>Successfully Joined!</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '40px' }}>You have successfully applied for the <b style={{ color: '#1e293b' }}>{selectedCamp?.title}</b>. The NGO team will review your profile and contact you soon.</p>
            <button onClick={() => setShowModal(false)} style={{ width: '100%', padding: '20px', background: '#0ca6a6', color: 'white', border: 'none', borderRadius: '20px', fontWeight: '800', cursor: 'pointer' }}>Return to Campaigns</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .premium-campaign-card:hover {
          transform: translateY(-15px);
          box-shadow: 0 40px 60px -15px rgba(0,0,0,0.1);
          border-color: rgba(12, 166, 166, 0.1);
        }
        .premium-campaign-card:hover .card-image-hover {
          transform: scale(1.1);
        }
        .join-btn-hover:hover {
          background: #0ca6a6 !important;
          color: white !important;
          box-shadow: 0 15px 25px -5px rgba(12, 166, 166, 0.4);
        }
        .join-btn-hover:hover svg {
          stroke: white !important;
        }
        .social-icon {
          width: 45px; height: 45px; border-radius: 12px; background: #f8fafc; display: flex; alignItems: center; justifyContent: center; cursor: pointer; transition: 0.3s;
        }
        .social-icon:hover { background: #0ca6a6; }
        .social-icon:hover svg { stroke: white; }
      `}</style>
    </div>
  );
};

export default VolunteerHome;
