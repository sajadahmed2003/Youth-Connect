import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Megaphone, Zap, Award, Star, Trophy, PlusCircle, 
  Camera, User, Phone, MapPin, Globe, Mail, CheckCircle2, AlertCircle, Eye
} from 'lucide-react';
import { API_BASE } from '../config';

const Profile = ({ user, setUser, hideHeader = false }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Form Fields State
  const [name, setName] = useState(user.name || '');
  const [skillsText, setSkillsText] = useState((user.skills || []).join(', '));
  const [bio, setBio] = useState(user.bio || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [locationStr, setLocationStr] = useState(user.location || '');
  const [website, setWebsite] = useState(user.website || '');
  
  // Photo Upload State
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [avatarPreview, setAvatarPreview] = useState('');
  
  const [myCampaigns, setMyCampaigns] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Connection Networks Modals
  const [showConnectionsModal, setShowConnectionsModal] = useState(null); // 'followers' | 'following' | null
  
  // Media Grid State
  const [myPosts, setMyPosts] = useState([]);
  const [activeMediaTab, setActiveMediaTab] = useState('all'); // 'all', 'post', 'reel', 'video'

  useEffect(() => {
    fetchActiveProfile();
    fetchMyPosts();
  }, []);

  useEffect(() => {
    setName(user.name || '');
    setSkillsText((user.skills || []).join(', '));
    setBio(user.bio || '');
    setPhone(user.phone || '');
    setLocationStr(user.location || '');
    setWebsite(user.website || '');
    setAvatar(user.avatar || '');
    setAvatarPreview('');
    if (user.role === 'ngo') {
      fetchMyCampaigns();
    }
  }, [user]);

  const fetchActiveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (err) { console.error("Failed to sync profile:", err); }
  };

  const fetchMyPosts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/users/${user._id}/profile`);
      if (res.ok) {
        const data = await res.json();
        setMyPosts(data.posts || []);
      }
    } catch (err) { console.error("Failed to load user broadcasts:", err); }
  };

  const fetchMyCampaigns = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/my-campaigns`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMyCampaigns(data);
      }
    } catch (err) { console.error(err); }
  };

  // Profile strength calculation
  const strengthFields = [
    { name: 'Name', isCompleted: !!name.trim() },
    { name: 'Avatar', isCompleted: !!avatar && !avatar.includes('pravatar.cc') },
    { name: 'Biography', isCompleted: !!bio.trim() },
    { name: 'Skills', isCompleted: !!skillsText.trim() },
    { name: 'Phone Number', isCompleted: !!phone.trim() },
    { name: 'Location', isCompleted: !!locationStr.trim() },
    { name: 'Website', isCompleted: !!website.trim() }
  ];
  const completedCount = strengthFields.filter(f => f.isCompleted).length;
  const strengthPercentage = Math.round((completedCount / strengthFields.length) * 100);

  const getStrengthBranding = (pct) => {
    if (pct < 35) return { label: 'Basic Profile', col: '#ef4444', desc: 'Add contact details and a bio to unlock trust badge.' };
    if (pct < 75) return { label: 'Intermediate Profile', col: '#f59e0b', desc: 'Add a custom avatar and skills to stand out.' };
    return { label: 'Elite Pro Profile', col: '#10b981', desc: 'Verified profile credibility active!' };
  };
  const strengthInfo = getStrengthBranding(strengthPercentage);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 300;
          const MAX_HEIGHT = 300;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
          setAvatarPreview(dataUrl);
          setAvatar(dataUrl);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const skillsArray = skillsText.split(',').map(s => s.trim()).filter(Boolean);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          name, 
          skills: skillsArray, 
          bio, 
          phone, 
          location: locationStr, 
          website, 
          avatar: (avatar && typeof avatar === 'string' && avatar.startsWith('data:')) ? avatar : undefined
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setAvatarPreview('');
        alert("Profile credentials updated successfully!");
      } else {
        alert("Server rejected profile update request.");
      }
    } catch {
      alert("Network exception: Update transaction rejected.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleBranding = () => {
    switch(user.role) {
      case 'admin': return { label: 'ADMIN HUB', icon: <ShieldCheck size={18} color="#ef4444"/>, col: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', badgeClass: 'badge-danger' };
      case 'ngo': return { label: 'CAMPAIGN MANAGER', icon: <Megaphone size={18} color="#10b981"/>, col: '#10b981', gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', badgeClass: 'badge-success' };
      default: return { label: 'VOLUNTEER', icon: <Zap size={18} color="#7c3aed"/>, col: '#7c3aed', gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', badgeClass: 'badge-primary' };
    }
  };

  const branding = getRoleBranding();
  const dbBadges = user.badges || [];

  return (
    <div className="profile-cyber animate-fadeIn" style={{ fontFamily: 'var(--font-body)', padding: hideHeader ? '0' : '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* HEADER SECTION */}
      {!hideHeader && (
        <div className="page-header dashboard-header" style={{ 
          background: 'var(--bg-surface)', 
          borderRadius: 'var(--radius-lg)', 
          padding: '30px 40px', 
          marginBottom: '40px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: branding.col, marginBottom: '8px' }}>
              {branding.icon}
              <span style={{ fontSize: '0.72rem', fontWeight: '800', letterSpacing: '1px' }}>{branding.label} SECURE NODE</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: '900', color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.5px' }}>
              Account <span style={{ color: branding.col }}>Settings</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '4px' }}>Build your credibility score and manage connection keys.</p>
          </div>
          
          {(user.role === 'ngo' || user.role === 'admin') && (
            <button 
              onClick={() => navigate(user.role === 'ngo' ? '/campaign-portal' : '/admin-dashboard', { state: { activeTab: 'campaigns' } })}
              className="btn btn-primary"
              style={{ 
                background: branding.gradient,
                boxShadow: `0 4px 20px ${branding.col}33`,
                borderRadius: 'var(--radius-md)'
              }}
            >
              <PlusCircle size={18} />
              Post & Manage Campaigns
            </button>
          )}
        </div>
      )}
      
      <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '30px' }}>
          
        {/* LEFT COLUMN: IDENTITY & CREDIBILITY DIRECTORY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* VISUAL PROFILE CARD */}
          <div className="cyber-card" style={{ padding: '36px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            
            {/* Interactive Photo Upload container */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              style={{ 
                position: 'relative', 
                width: '120px', 
                height: '120px', 
                marginBottom: '20px',
                borderRadius: '50%',
                cursor: 'pointer',
                overflow: 'hidden',
                border: `3px solid ${branding.col}`,
                boxShadow: 'var(--shadow-md)',
                group: 'true'
              }}
            >
              <img 
                src={avatarPreview || avatar || 'https://i.pravatar.cc/150?img=47'} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'filter 0.3s' }} 
                alt={name} 
              />
              <div 
                style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  background: 'rgba(15, 23, 42, 0.65)', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.25s',
                  color: 'white'
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '0'}
              >
                <Camera size={24} style={{ marginBottom: '4px' }} />
                <span style={{ fontSize: '0.62rem', fontWeight: '800', letterSpacing: '0.5px' }}>UPLOAD PHOTO</span>
              </div>
            </div>
            
            {/* Hidden native input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*" 
              onChange={handleFileChange} 
            />

            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', color: 'var(--text-primary)', marginBottom: '8px', fontWeight: '900', letterSpacing: '-0.3px' }}>{name}</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
              <span className={`badge ${branding.badgeClass}`} style={{ padding: '4px 14px', fontSize: '0.65rem', fontWeight: '800' }}>
                {branding.label}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--success)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(16,185,129,0.06)', padding: '4px 10px', borderRadius: '99px', border: '1px solid rgba(16,185,129,0.15)' }}>
                <CheckCircle2 size={12} /> Verified
              </span>
            </div>

            {/* 👥 CONNECTION STATISTICS ROW */}
            <div style={{ display: 'flex', gap: '20px', width: '100%', justifyContent: 'space-around', margin: '16px 0 24px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '16px 0' }}>
              <div 
                onClick={() => setShowConnectionsModal('followers')}
                style={{ cursor: 'pointer', textAlign: 'center', flex: 1 }}
              >
                <div style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-primary)' }}>{user.followers?.length || 0}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', marginTop: '2px', letterSpacing: '0.5px' }}>Followers</div>
              </div>
              <div 
                onClick={() => setShowConnectionsModal('following')}
                style={{ cursor: 'pointer', textAlign: 'center', flex: 1, borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}
              >
                <div style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-primary)' }}>{user.following?.length || 0}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', marginTop: '2px', letterSpacing: '0.5px' }}>Following</div>
              </div>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-primary)' }}>{user.points || 0}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', marginTop: '2px', letterSpacing: '0.5px' }}>Points</div>
              </div>
            </div>

            {/* PROFILE STRENGTH METER */}
            <div style={{ width: '100%', background: 'var(--bg-card)', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginBottom: '24px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Profile Strength</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '900', color: strengthInfo.col }}>{strengthPercentage}%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(15,23,42,0.04)', borderRadius: '99px', overflow: 'hidden', marginBottom: '8px' }}>
                <div style={{ height: '100%', width: `${strengthPercentage}%`, background: strengthInfo.col, borderRadius: '99px', transition: 'width 0.5s' }} />
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', lineHeight: '1.4', fontWeight: '500' }}>
                <strong style={{ color: strengthInfo.col }}>{strengthInfo.label}:</strong> {strengthInfo.desc}
              </div>
            </div>

            {/* DIRECTORY DETAILS */}
            <div style={{ width: '100%', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '14px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(124,58,237,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed', flexShrink: 0 }}>
                  <Mail size={16} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Email Address</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(6,182,212,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0891b2', flexShrink: 0 }}>
                  <Phone size={16} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Contact Phone</div>
                  <div style={{ fontSize: '0.82rem', color: phone ? 'var(--text-secondary)' : 'var(--text-muted)', fontWeight: '700' }}>
                    {phone || 'Not registered'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16,185,129,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', flexShrink: 0 }}>
                  <MapPin size={16} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Location Directory</div>
                  <div style={{ fontSize: '0.82rem', color: locationStr ? 'var(--text-secondary)' : 'var(--text-muted)', fontWeight: '700' }}>
                    {locationStr || 'Not registered'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245,158,11,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', flexShrink: 0 }}>
                  <Globe size={16} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Website Portfolio</div>
                  <div style={{ fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {website ? (
                      <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer" style={{ color: branding.col, fontWeight: '700', textDecoration: 'underline' }}>{website}</a>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontWeight: '700' }}>None</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* REPUTATION & BADGES */}
          <div className="cyber-card" style={{ padding: '36px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: '800', marginBottom: '16px', letterSpacing: '1px', textTransform: 'uppercase' }}>Reputation Unlocked</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', justifyItems: 'center' }}>
              
              {(user.campaignsJoined >= 1) && (
                <div title="Novice Volunteer: Joined 1st Campaign" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #cd7f32, #8b4513)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                    <Award size={20} color="white" />
                  </div>
                  <span style={{ fontSize: '0.55rem', color: 'var(--text-primary)', fontWeight: '800' }}>BRONZE</span>
                </div>
              )}

              {(user.campaignsJoined >= 5) && (
                <div title="Silver Hero: Joined 5 Campaigns" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #c0c0c0, #708090)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                    <Star size={20} color="white" />
                  </div>
                  <span style={{ fontSize: '0.55rem', color: 'var(--text-primary)', fontWeight: '800' }}>SILVER</span>
                </div>
              )}

              {(user.campaignsCompleted >= 1) && (
                <div title="Impact Maker: Completed 1st Campaign" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #ffd700, #b8860b)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                    <Trophy size={20} color="white" />
                  </div>
                  <span style={{ fontSize: '0.55rem', color: 'var(--text-primary)', fontWeight: '800' }}>IMPACT</span>
                </div>
              )}

              {/* Dynamic DB Badges */}
              {dbBadges.map((b, i) => (
                <div key={i} title={`${b.title} Badge`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{ 
                    width: '42px', 
                    height: '42px', 
                    background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)', 
                    borderRadius: '10px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    boxShadow: 'var(--shadow-sm)',
                    fontSize: '1.2rem'
                  }}>
                    {b.icon || '🏅'}
                  </div>
                  <span style={{ fontSize: '0.52rem', color: 'var(--text-primary)', fontWeight: '900', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '42px' }}>
                    {b.title.toUpperCase()}
                  </span>
                </div>
              ))}

              {(!user.campaignsJoined && !user.campaignsCompleted && dbBadges.length === 0) && (
                <div style={{ gridColumn: 'span 4', textAlign: 'center', padding: '16px', background: 'rgba(124, 58, 237, 0.02)', borderRadius: '10px', border: '1px dashed var(--border)', width: '100%' }}>
                  <Award size={20} color="var(--text-muted)" style={{ marginBottom: '6px', margin: '0 auto' }} />
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem', fontWeight: '700' }}>JOIN CAMPAIGNS TO UNLOCK REPUTATION</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CORE CREDENTIALS PROFILE SETTINGS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div className="cyber-card" style={{ padding: '36px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '24px', color: 'var(--text-primary)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <User size={18} color={branding.col} /> Profile Information Settings
            </h3>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Form Grid layout */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    className="cyber-input" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="E.g. Jane Doe" 
                    required 
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="text" 
                    className="cyber-input" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="E.g. +91 98765 43210" 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Location / City</label>
                  <input 
                    type="text" 
                    className="cyber-input" 
                    value={locationStr} 
                    onChange={(e) => setLocationStr(e.target.value)} 
                    placeholder="E.g. New Delhi, India" 
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Website / Portfolio URL</label>
                  <input 
                    type="text" 
                    className="cyber-input" 
                    value={website} 
                    onChange={(e) => setWebsite(e.target.value)} 
                    placeholder="E.g. github.com/username" 
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Personal Biography</label>
                <textarea 
                  className="cyber-input" 
                  style={{ resize: 'none', lineHeight: '1.5' }} 
                  rows="4" 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)} 
                  placeholder="Tell the community about yourself, your goals, or your NGO mission..."
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Skills & Specializations (Comma Separated)</label>
                <textarea 
                  className="cyber-input" 
                  style={{ resize: 'none', lineHeight: '1.5' }} 
                  rows="3" 
                  value={skillsText} 
                  onChange={(e) => setSkillsText(e.target.value)} 
                  placeholder="E.g. Teaching, Event Coordination, Public Relations, Graphic Design..."
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={isSubmitting}
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  justifyContent: 'center', 
                  background: branding.gradient,
                  boxShadow: `0 4px 20px ${branding.col}22`,
                  fontSize: '0.92rem',
                  fontWeight: '800'
                }}
              >
                {isSubmitting ? 'Syncing Profile...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>

          {/* MY ACTIVITY MEDIA GRID */}
          <div className="cyber-card" style={{ padding: '36px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', marginBottom: '20px', color: 'var(--text-primary)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={18} color={branding.col} /> My Broadcast Activity Grid
            </h3>
            
            {/* Sub-tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              {['all', 'post', 'reel'].map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveMediaTab(tab)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '16px',
                    border: 'none',
                    background: activeMediaTab === tab ? branding.gradient : 'transparent',
                    color: activeMediaTab === tab ? 'white' : 'var(--text-muted)',
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab}s
                </button>
              ))}
            </div>

            {/* Posts stream */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '350px', overflowY: 'auto' }}>
              {myPosts.filter(p => activeMediaTab === 'all' || p.mediaType === activeMediaTab).length > 0 ? (
                myPosts.filter(p => activeMediaTab === 'all' || p.mediaType === activeMediaTab).map(post => (
                  <div key={post._id} style={{ background: 'rgba(255, 255, 255, 0.015)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span className="badge" style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#a78bfa', fontSize: '0.62rem', padding: '2px 8px', fontWeight: '800', textTransform: 'uppercase', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
                        {post.mediaType || 'post'}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', margin: '0 0 10px 0', lineHeight: '1.4' }}>{post.content}</p>
                    {post.image && (
                      <img src={post.image} alt="Attachment" style={{ maxHeight: '140px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--border)' }} />
                    )}
                    {post.videoUrl && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        🔗 Video Link: <span style={{ textDecoration: 'underline', color: 'var(--primary-light)' }}>{post.videoUrl}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  No social grid posts registered under this quadrant.
                </div>
              )}
            </div>
          </div>

          {/* POSTED CAMPAIGNS FOR NGO / VOLUNTEER ACTIVITY FOR OTHERS */}
          {user.role === 'ngo' && (
            <div className="cyber-card" style={{ padding: '36px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', marginBottom: '24px', color: 'var(--text-primary)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Megaphone size={18} color="var(--success)" /> Posted Campaigns History
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {myCampaigns.length > 0 ? myCampaigns.map(camp => (
                  <div key={camp._id} style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <img src={camp.image || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800'} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} alt={camp.title} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: 'var(--text-primary)', fontWeight: '800', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{camp.title}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', marginTop: '2px', fontWeight: '500' }}>{camp.location} • {new Date(camp.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className={`badge ${camp.status === 'Approved' ? 'badge-success' : 'badge-warning'}`} style={{ padding: '4px 10px', fontSize: '0.62rem', fontWeight: '800' }}>
                      {(camp.status || 'PENDING').toUpperCase()}
                    </div>
                  </div>
                )) : (
                  <div style={{ textAlign: 'center', padding: '32px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border)' }}>
                    <AlertCircle size={30} color="var(--text-muted)" style={{ marginBottom: '10px', margin: '0 auto' }} />
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '800' }}>NO CAMPAIGNS POSTED YET</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* 👥 NETWORK CONNECTIONS OVERLAY MODAL */}
      {showConnectionsModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 5, 8, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '24px'
        }}>
          <div className="cyber-card" style={{
            maxWidth: '400px',
            width: '100%',
            padding: '28px',
            position: 'relative',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <button 
              onClick={() => setShowConnectionsModal(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '1.2rem',
                cursor: 'pointer',
                fontWeight: 'bold',
                outline: 'none'
              }}
            >
              ✕
            </button>
            
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.25rem', marginBottom: '16px', fontWeight: '900', textTransform: 'capitalize' }}>
              My {showConnectionsModal} Network
            </h3>

            <div style={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              paddingRight: '4px'
            }}>
              {((showConnectionsModal === 'followers' ? user.followers : user.following) || []).length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textAlign: 'center', padding: '32px 0' }}>No nodes registered in this quadrant.</p>
              ) : (
                ((showConnectionsModal === 'followers' ? user.followers : user.following) || []).map(node => (
                  <div key={node._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                    <img src={node.avatar || 'https://i.pravatar.cc/150?img=47'} alt={node.name} style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(124,58,237,0.3)', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{node.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#a78bfa', fontWeight: '800', marginTop: '1px' }}>⚡ {node.points || 0} Reputation Pts</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
