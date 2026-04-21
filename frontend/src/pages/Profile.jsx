import React, { useState, useRef, useEffect } from 'react';
import { Upload, ShieldCheck, User as UserIcon, Megaphone, Zap } from 'lucide-react';

const Profile = ({ user, setUser }) => {
  const [name, setName] = useState(user.name);
  const [skillsText, setSkillsText] = useState((user.skills || []).join(', '));
  const fileInputRef = useRef(null);

  useEffect(() => {
    setSkillsText((user.skills || []).join(', '));
  }, [user.skills]);

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
        case 'admin': return { label: 'SUPER ADMIN', icon: <ShieldCheck size={40} color="#ef4444"/>, col: '#ef4444' };
        case 'ngo': return { label: 'MISSION LEAD (MANAGER)', icon: <Megaphone size={40} color="#4ade80"/>, col: '#4ade80' };
        default: return { label: 'VOLUNTEER ASSET', icon: <Zap size={40} color="#0ca6a6"/>, col: '#0ca6a6' };
    }
  };

  const branding = getRoleBranding();

  return (
    <div className="profile-cyber" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div className="page-header" style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white' }}>PERSONAL <span style={{ color: branding.col }}>ID</span></h1>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px' }}>
          
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
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>Current Node Activation: Verified.<br/>Clearance Level: Level 5.</p>
          </div>

          {/* Configuration Form */}
          <div className="cyber-card" style={{ padding: '40px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '30px', color: 'white', letterSpacing: '1px' }}>CORE CONFIGURATION</h3>
              <form onSubmit={handleSave}>
                  <div style={{ marginBottom: '25px' }}>
                      <label style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>IDENTITY DESIGNATION</label>
                      <input type="text" className="cyber-input" style={{ width: '100%' }} value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div style={{ marginBottom: '25px' }}>
                      <label style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>SKILLSET MATRIX (CSV)</label>
                      <textarea className="cyber-input" style={{ width: '100%', resize: 'none' }} rows="4" value={skillsText} onChange={(e) => setSkillsText(e.target.value)}></textarea>
                  </div>
                  <button type="submit" className="cyber-card" style={{ width: '100%', padding: '20px', background: branding.col, border: 'none', color: 'white', fontWeight: '900', letterSpacing: '2px', cursor: 'pointer', boxShadow: `0 0 20px ${branding.col}33` }}>UPDATE TRANSMISSION</button>
              </form>
          </div>

      </div>
    </div>
  );
};

export default Profile;
