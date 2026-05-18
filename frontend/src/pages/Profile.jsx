import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ShieldCheck, User as UserIcon, Megaphone, Zap, Award, Star, Trophy, Target, Crown, PlusCircle } from 'lucide-react';

const Profile = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [name, setName] = useState(user.name);
  const [skillsText, setSkillsText] = useState((user.skills || []).join(', '));
  const fileInputRef = useRef(null);

  const [myCampaigns, setMyCampaigns] = useState([]);

  useEffect(() => {
    setSkillsText((user.skills || []).join(', '));
    if (user.role === 'ngo') {
        fetchMyCampaigns();
    }
  }, [user.skills, user.role]);

  const fetchMyCampaigns = async () => {
    try {
        const token = localStorage.getItem('token');
        const res = await fetch('https://youth-connect-backend-6dn5.onrender.com/api/my-campaigns', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            setMyCampaigns(data);
        }
    } catch (err) { console.error(err); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const skillsArray = skillsText.split(',').map(s => s.trim()).filter(Boolean);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5002/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, skills: skillsArray })
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert("Identity updated successfully!");
      }
    } catch {
      alert("Network rejection: Link unstable.");
    }
  };

  const getRoleBranding = () => {
    switch(user.role) {
        case 'admin': return { label: 'ADMIN', icon: <ShieldCheck size={40} color="#ef4444"/>, col: '#ef4444' };
        case 'ngo': return { label: 'CAMPAIGN MANAGER', icon: <Megaphone size={40} color="#4ade80"/>, col: '#4ade80' };
        default: return { label: 'VOLUNTEER', icon: <Zap size={40} color="#0ca6a6"/>, col: '#0ca6a6' };
    }
  };

  const branding = getRoleBranding();

  return (
    <div className="profile-cyber" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div className="page-header" style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white', margin: 0 }}>ACCOUNT <span style={{ color: branding.col }}>SETTINGS</span></h1>
        
        {/* 🔥 PROMINENT ACTION BUTTON */}
        {(user.role === 'ngo' || user.role === 'admin') && (
            <button 
              onClick={() => navigate(user.role === 'ngo' ? '/campaign-portal' : '/admin-dashboard', { state: { activeTab: 'campaigns' } })}
              style={{ 
                  padding: '12px 25px', 
                  background: branding.col, 
                  border: 'none', 
                  borderRadius: '12px', 
                  color: 'white', 
                  fontWeight: '900', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  cursor: 'pointer',
                  boxShadow: `0 10px 20px ${branding.col}33`,
                  transition: '0.3s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
                <PlusCircle size={20} />
                ADD & MANAGE CAMPAIGN
            </button>
        )}
      </div>
      
      <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px' }}>
          
          {/* identity Status Card */}
          <div className="cyber-card" style={{ padding: '40px', textAlign: 'center', height: 'fit-content' }}>
              <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 30px auto' }}>
                  <img src={user.avatar} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${branding.col}`, boxShadow: `0 0 20px ${branding.col}33` }} />
                  <div style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--bg-dark)', padding: '8px', borderRadius: '50%', border: `1px solid ${branding.col}` }}>{branding.icon}</div>
              </div>
              <h2 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '5px' }}>{user.name}</h2>
              <div style={{ fontSize: '0.8rem', fontWeight: '900', letterSpacing: '2px', color: branding.col, background: `${branding.col}1a`, padding: '8px 20px', borderRadius: '20px', display: 'inline-block', border: `1px solid ${branding.col}33` }}>
                  {branding.label}
              </div>
              <hr style={{ margin: '30px 0', borderColor: 'rgba(255,255,255,0.05)' }} />
              
              <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px', textAlign: 'left' }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: '2rem', fontWeight: '900', color: 'white' }}>{user.role === 'ngo' ? (user.campaignsPosted || 0) : (user.campaignsJoined || 0)}</div>
                      <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 'bold' }}>{user.role === 'ngo' ? 'CAMPAIGNS POSTED' : 'CAMPAIGNS JOINED'}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: '2rem', fontWeight: '900', color: branding.col }}>{user.campaignsCompleted || 0}</div>
                      <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 'bold' }}>{user.role === 'ngo' ? 'CAMPAIGNS COMPLETED' : 'COMPLETED'}</div>
                  </div>
              </div>

              <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                  <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '10px' }}>SKILLS & EXPERTISE</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {user.skills && user.skills.length > 0 ? user.skills.map((skill, index) => (
                          <span key={index} style={{ background: `${branding.col}1a`, color: branding.col, border: `1px solid ${branding.col}33`, padding: '5px 12px', borderRadius: '15px', fontSize: '0.75rem', fontWeight: 'bold' }}>{skill}</span>
                      )) : <span style={{ color: '#64748b', fontSize: '0.8rem' }}>No skills added yet</span>}
                  </div>
              </div>

              <hr style={{ margin: '15px 0 25px 0', borderColor: 'rgba(255,255,255,0.05)' }} />
              
              <div style={{ textAlign: 'left' }}>
                  <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '15px' }}>ACHIEVEMENT BADGES</div>
                  <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                      {/* Badge Logic */}
                      {(user.campaignsJoined >= 1) ? (
                          <div title="Novice Volunteer: Joined 1st Campaign" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                              <div style={{ width: '45px', height: '45px', background: 'linear-gradient(135deg, #cd7f32, #8b4513)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 5px 15px rgba(205, 127, 50, 0.3)' }}>
                                  <Award size={24} color="white" />
                              </div>
                              <span style={{ fontSize: '0.6rem', color: 'white', fontWeight: '900' }}>BRONZE</span>
                          </div>
                      ) : null}

                      {(user.campaignsJoined >= 5) ? (
                          <div title="Silver Hero: Joined 5 Campaigns" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                              <div style={{ width: '45px', height: '45px', background: 'linear-gradient(135deg, #c0c0c0, #708090)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 5px 15px rgba(192, 192, 192, 0.3)' }}>
                                  <Star size={24} color="white" />
                              </div>
                              <span style={{ fontSize: '0.6rem', color: 'white', fontWeight: '900' }}>SILVER</span>
                          </div>
                      ) : null}

                      {(user.campaignsCompleted >= 1) ? (
                          <div title="Impact Maker: Completed 1st Campaign" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                              <div style={{ width: '45px', height: '45px', background: 'linear-gradient(135deg, #ffd700, #b8860b)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 5px 15px rgba(255, 215, 0, 0.3)' }}>
                                  <Trophy size={24} color="white" />
                              </div>
                              <span style={{ fontSize: '0.6rem', color: 'white', fontWeight: '900' }}>IMPACT</span>
                          </div>
                      ) : null}

                      {(user.campaignsCompleted >= 5) ? (
                          <div title="Master Solver: Completed 5 Campaigns" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                              <div style={{ width: '45px', height: '45px', background: 'linear-gradient(135deg, #4ade80, #0ca6a6)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 5px 15px rgba(74, 222, 128, 0.3)' }}>
                                  <Crown size={24} color="white" />
                              </div>
                              <span style={{ fontSize: '0.6rem', color: 'white', fontWeight: '900' }}>MASTER</span>
                          </div>
                      ) : null}

                      {/* Placeholder for no badges */}
                      {(!user.campaignsJoined && !user.campaignsCompleted) && (
                          <div style={{ gridColumn: 'span 4', textAlign: 'center', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                              <Award size={30} color="#1e293b" style={{ marginBottom: '10px' }} />
                              <div style={{ color: '#475569', fontSize: '0.7rem', fontWeight: 'bold' }}>JOIN A CAMPAIGN TO UNLOCK BADGES</div>
                          </div>
                      )}
                  </div>
              </div>

              <hr style={{ margin: '25px 0', borderColor: 'rgba(255,255,255,0.05)' }} />
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>Account Status: Verified.<br/>Member Since: 2026</p>
          </div>

          {/* Configuration Form & Campaign History */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div className="cyber-card" style={{ padding: '40px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '30px', color: 'white', letterSpacing: '1px' }}>PROFILE SETTINGS</h3>
                  <form onSubmit={handleSave}>
                      <div style={{ marginBottom: '25px' }}>
                          <label style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>FULL NAME</label>
                          <input type="text" className="cyber-input" style={{ width: '100%' }} value={name} onChange={(e) => setName(e.target.value)} />
                      </div>
                      <div style={{ marginBottom: '25px' }}>
                          <label style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>YOUR SKILLS</label>
                          <textarea className="cyber-input" style={{ width: '100%', resize: 'none' }} rows="4" value={skillsText} onChange={(e) => setSkillsText(e.target.value)}></textarea>
                      </div>
                      <button type="submit" className="cyber-card" style={{ width: '100%', padding: '20px', background: branding.col, border: 'none', color: 'white', fontWeight: '900', letterSpacing: '2px', cursor: 'pointer', boxShadow: `0 0 20px ${branding.col}33` }}>SAVE CHANGES</button>
                  </form>
              </div>

              {user.role === 'ngo' && (
                  <div className="cyber-card" style={{ padding: '40px' }}>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '30px', color: 'white', letterSpacing: '1px' }}>POSTED CAMPAIGNS HISTORY</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                          {myCampaigns.length > 0 ? myCampaigns.map(camp => (
                              <div key={camp._id} style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div>
                                      <div style={{ color: 'white', fontWeight: 'bold' }}>{camp.title}</div>
                                      <div style={{ color: '#64748b', fontSize: '0.7rem' }}>{camp.location} • {new Date(camp.createdAt).toLocaleDateString()}</div>
                                  </div>
                                  <div style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '0.6rem', fontWeight: '900', background: camp.status === 'Approved' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: camp.status === 'Approved' ? '#4ade80' : '#f59e0b', border: `1px solid ${camp.status === 'Approved' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(245, 158, 11, 0.2)'}` }}>
                                      {(camp.status || 'PENDING').toUpperCase()}
                                  </div>
                              </div>
                          )) : (
                              <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.01)', borderRadius: '15px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                  <Megaphone size={40} color="#1e293b" style={{ marginBottom: '15px' }} />
                                  <div style={{ color: '#475569', fontSize: '0.8rem', fontWeight: 'bold' }}>NO CAMPAIGNS POSTED YET</div>
                              </div>
                          )}
                      </div>
                  </div>
              )}
          </div>

      </div>
    </div>
  );
};

export default Profile;
