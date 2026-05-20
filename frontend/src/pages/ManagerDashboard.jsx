import React, { useState, useEffect } from 'react';
import { Megaphone, PlusCircle, CheckCircle, Users, Check, X, Trash2, TrendingUp, BarChart3, Calendar, ShieldCheck, Zap, Globe, MessageSquare, MapPin, Target, UserMinus, UserCheck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const ManagerDashboard = ({ user, refreshCamps }) => {
  const navigate = useNavigate();
  const location = useLocation();
  if(!user) return <div style={{padding: '100px', textAlign: 'center', color: 'white'}}>LOADING DASHBOARD...</div>;

  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeApps, setActiveApps] = useState([]);
  const [pendingApps, setPendingApps] = useState([]);
  const [processedApps, setProcessedApps] = useState([]);
  const [myCampaigns, setMyCampaigns] = useState([]);
  const [profileData, setProfileData] = useState({ name: user?.name, email: user?.email, skills: '' });
  const [success, setSuccess] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    category: 'Environment',
    location: '',
    description: '',
    skills: '',
    neededPositions: 10
  });

  useEffect(() => {
    fetchData();
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [user, location.state]);

  const fetchData = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://youth-connect-backend-6dn5.onrender.com/api/applications/manage', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if(res.ok){
        const data = await res.json();
        setPendingApps(data.filter(a => a.status === 'Pending'));
        setActiveApps(data.filter(a => a.status === 'Accepted'));
        setProcessedApps(data.filter(a => ['Accepted', 'Rejected', 'Removed'].includes(a.status)));
      }

      const resCamps = await fetch('https://youth-connect-backend-6dn5.onrender.com/api/my-campaigns', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if(resCamps.ok){
        const data = await resCamps.json();
        setMyCampaigns(data);
      }
    } catch(err) { console.error(err); }
  };

  const handleAction = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://youth-connect-backend-6dn5.onrender.com/api/applications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if(res.ok){
         fetchData();
         if(refreshCamps) refreshCamps();
      }
    } catch(err) { console.error(err); }
  };

  const handleRemoveUser = async (id) => {
    if(!window.confirm("Remove user from campaign?")) return;
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`https://youth-connect-backend-6dn5.onrender.com/api/applications/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if(res.ok){
            fetchData();
            if(refreshCamps) refreshCamps();
        }
    } catch(err) { console.error(err); }
  };

  const handleDeleteCampaign = async (id) => {
    if(!window.confirm("Are you sure you want to delete this campaign permanently?")) return;
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`https://youth-connect-backend-6dn5.onrender.com/api/campaigns/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if(res.ok) {
            setMyCampaigns(myCampaigns.filter(c => c._id !== id));
            if (refreshCamps) refreshCamps();
        }
    } catch(err) { console.error(err); }
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024 && type === 'videoUrl') {
         alert("Warning: Video is large. It might take a while to upload.");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [type]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const newCamp = {
      ...formData,
      creatorName: user.name,
      requiredSkills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
      categories: [formData.category === 'Others' ? customCategory : formData.category]
    };
    
    try {
      const res = await fetch('https://youth-connect-backend-6dn5.onrender.com/api/campaigns', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}`
         },
         body: JSON.stringify(newCamp)
      });
      
      if(res.ok) {
        setSuccess(true);
        setFormData({title: '', category: 'Environment', location: '', description: '', skills: '', neededPositions: 10, image: '', videoUrl: ''});
        setCustomCategory('');
        fetchData();
        setTimeout(() => { setSuccess(false); }, 3000);
      }
    } catch(err) { console.error(err); }
  };

  return (
    <div className="manager-dashboard-premium" style={{ background: '#090f1d', minHeight: '100vh', padding: '40px', color: 'white', fontFamily: 'Inter, sans-serif' }}>
      
      {/* 🧭 PREMIUM NAVIGATION BAR */}
      <div className="dashboard-header" style={{ background: '#0f172a', borderRadius: '24px', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #0ca6a6 0%, #4ade80 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={24} fill="white" color="white" />
              </div>
              <span style={{ fontWeight: '900', letterSpacing: '1px' }}>YOUTH <span style={{ color: '#0ca6a6' }}>CONNECT</span></span>
          </div>
          
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['dashboard', 'campaigns', 'profile'].map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  style={{ background: 'none', border: 'none', color: activeTab === tab ? '#0ca6a6' : '#94a3b8', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', transition: '0.3s' }}
                >
                    {tab === 'dashboard' && <BarChart3 size={18}/>}
                    {tab === 'campaigns' && <Megaphone size={18}/>}
                    {tab === 'profile' && <ShieldCheck size={18}/>}
                    {tab.toUpperCase()}
                </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{user.name}</div>
                  <div style={{ fontSize: '0.7rem', color: '#0ca6a6', fontWeight: '900' }}>MANAGER</div>
              </div>
              <img src={user.avatar} style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid #0ca6a6' }} />
          </div>
      </div>

      {activeTab === 'dashboard' && (
          <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
              <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>
                  <div style={{ background: '#0f172a', borderRadius: '30px', padding: '40px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <h2 style={{ fontSize: '1.5rem', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}><Users color="#0ca6a6"/> VOLUNTEER MANAGEMENT</h2>
                      
                      <div style={{ marginBottom: '40px' }}>
                          <h4 style={{ color: '#64748b', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '20px' }}>PENDING APPLICATIONS</h4>
                          {pendingApps.length === 0 && <p style={{ color: '#475569', fontStyle: 'italic' }}>No pending requests.</p>}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                              {pendingApps.map(app => (
                                  <div key={app._id} style={{ background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                      <div className="responsive-flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                              <img src={app.userId?.avatar} style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid #0ca6a6', padding: '3px' }} />
                                              <div>
                                                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>{app.userId?.name}</div>
                                                  <div style={{ fontSize: '0.85rem', color: '#0ca6a6', fontWeight: 'bold' }}>Applying for: {app.campaignId?.title}</div>
                                                  <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                                                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#94a3b8', background: 'rgba(255,255,255,0.03)', padding: '4px 12px', borderRadius: '20px' }}>
                                                          <Zap size={14} color="#0ca6a6" /> {app.userId?.campaignsJoined || 0} Joined
                                                      </div>
                                                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#94a3b8', background: 'rgba(255,255,255,0.03)', padding: '4px 12px', borderRadius: '20px' }}>
                                                          <CheckCircle size={14} color="#4ade80" /> {app.userId?.campaignsCompleted || 0} Completed
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                          <div style={{ display: 'flex', gap: '10px' }}>
                                              <button onClick={() => handleAction(app._id, 'Accepted')} style={{ background: '#0ca6a6', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 20px rgba(12, 166, 166, 0.2)' }}>APPROVE</button>
                                              <button onClick={() => handleAction(app._id, 'Rejected')} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '10px 25px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>REJECT</button>
                                          </div>
                                      </div>

                                      <div style={{ padding: '15px 20px', background: 'rgba(12, 166, 166, 0.05)', borderRadius: '15px', border: '1px solid rgba(12, 166, 166, 0.1)' }}>
                                          <div style={{ fontSize: '0.7rem', fontWeight: '900', color: '#0ca6a6', letterSpacing: '1px', marginBottom: '10px' }}>VOLUNTEER SKILLS</div>
                                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                              {app.userId?.skills && app.userId.skills.length > 0 ? app.userId.skills.map((skill, i) => (
                                                  <span key={i} style={{ fontSize: '0.7rem', padding: '4px 12px', borderRadius: '8px', background: 'rgba(12, 166, 166, 0.1)', color: '#4ade80', border: '1px solid rgba(12, 166, 166, 0.2)', fontWeight: 'bold' }}>{skill}</span>
                                              )) : <span style={{ fontSize: '0.75rem', color: '#475569', fontStyle: 'italic' }}>No skills listed by volunteer.</span>}
                                          </div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>

                      <div>
                          <h4 style={{ color: '#64748b', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '20px' }}>PERSONNEL & DECISIONS</h4>
                          <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                              {processedApps.length === 0 && <p style={{ color: '#475569', fontStyle: 'italic' }}>No decisions made yet.</p>}
                               {processedApps.map(app => (
                                   <div key={app._id} style={{ background: 'rgba(255,255,255,0.01)', padding: '20px 25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                           <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                               <img src={app.userId?.avatar} style={{ width: '45px', height: '45px', borderRadius: '50%', border: `2px solid ${app.status === 'Accepted' ? '#4ade80' : '#ef4444'}` }} />
                                               <div>
                                                   <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>{app.userId?.name}</div>
                                                   <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Campaign: {app.campaignId?.title}</div>
                                                   <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px', display: 'flex', gap: '12px' }}>
                                                       <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Zap size={12} color="#0ca6a6"/> {app.userId?.campaignsJoined || 0} Joined</span>
                                                       <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><CheckCircle size={12} color="#4ade80"/> {app.userId?.campaignsCompleted || 0} Completed</span>
                                                   </div>
                                               </div>
                                           </div>
                                           <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <span style={{ fontSize: '0.65rem', fontWeight: '900', padding: '6px 15px', borderRadius: '30px', background: app.status === 'Accepted' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: app.status === 'Accepted' ? '#4ade80' : '#ef4444', border: `1px solid ${app.status === 'Accepted' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)'}` }}>
                                                   {app.status.toUpperCase()}
                                               </span>
                                               {app.status === 'Accepted' && (
                                                   <div style={{ display: 'flex', gap: '10px' }}>
                                                       <button onClick={() => handleAction(app._id, 'Completed')} style={{ background: 'rgba(74, 222, 128, 0.1)', border: 'none', color: '#4ade80', padding: '8px', borderRadius: '10px', cursor: 'pointer' }} title="Mark Completed"><Check size={18}/></button>
                                                       <button onClick={() => handleRemoveUser(app._id)} style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', padding: '8px', borderRadius: '10px', cursor: 'pointer' }} title="Remove Recruit"><UserMinus size={18}/></button>
                                                   </div>
                                               )}
                                           </div>
                                       </div>
                                       {app.userId?.skills && app.userId.skills.length > 0 && (
                                           <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                               {app.userId.skills.slice(0, 5).map((skill, i) => (
                                                   <span key={i} style={{ fontSize: '0.6rem', padding: '2px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.05)' }}>{skill}</span>
                                               ))}
                                           </div>
                                       )}
                                   </div>
                               ))}
                          </div>
                      </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                      <div style={{ background: 'linear-gradient(135deg, #0ca6a6 0%, #115e5e 100%)', borderRadius: '30px', padding: '40px', textAlign: 'center', boxShadow: '0 20px 40px rgba(12, 166, 166, 0.2)' }}>
                          <BarChart3 size={40} style={{ marginBottom: '20px' }} />
                          <h3 style={{ fontSize: '2rem', fontWeight: '900', margin: '0 0 10px 0' }}>{activeApps.length}</h3>
                          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', letterSpacing: '1px', margin: 0 }}>ACTIVE VOLUNTEERS</p>
                      </div>
                      <div style={{ background: '#0f172a', borderRadius: '30px', padding: '40px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <h4 style={{ color: '#0ca6a6', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '20px' }}>QUICK STATS</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ color: '#94a3b8' }}>Total Campaigns</span>
                                  <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{myCampaigns.length}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ color: '#94a3b8' }}>Pending Approval</span>
                                  <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#f59e0b' }}>{myCampaigns.filter(c => c.status === 'Pending').length}</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {activeTab === 'profile' && (
          <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px', animation: 'fadeIn 0.5s ease-out' }}>
              <div style={{ background: '#0f172a', borderRadius: '30px', padding: '60px 40px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto 30px auto' }}>
                      <img src={user.avatar} style={{ width: '100%', height: '100%', borderRadius: '50%', border: '4px solid #0ca6a6', padding: '10px' }} />
                      <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: '#0f172a', padding: '10px', borderRadius: '50%', border: '2px solid #0ca6a6' }}>
                          <Megaphone size={24} color="#0ca6a6" />
                      </div>
                  </div>
                  <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '10px' }}>{user.email}</h2>
                  <div style={{ display: 'inline-block', padding: '6px 20px', background: '#0ca6a61a', borderRadius: '30px', color: '#0ca6a6', fontWeight: '900', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '30px' }}>CAMPAIGN MANAGER</div>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '30px', color: '#64748b', fontSize: '0.9rem' }}>
                      Account Status: <span style={{ color: '#4ade80' }}>Verified</span><br/>
                      Member Since: 2026
                  </div>
              </div>

              <div style={{ background: '#0f172a', borderRadius: '30px', padding: '50px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '40px' }}>PROFILE SETTINGS</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                      <div>
                          <label style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '12px', display: 'block' }}>FULL NAME</label>
                          <input type="text" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '15px 25px', borderRadius: '15px', color: 'white', outline: 'none', fontSize: '1rem' }} />
                      </div>
                      <div>
                          <label style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '12px', display: 'block' }}>YOUR SKILLS (Comma separated)</label>
                          <textarea value={profileData.skills} onChange={e => setProfileData({...profileData, skills: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid #0ca6a633', padding: '25px', borderRadius: '20px', color: 'white', outline: 'none', fontSize: '1.1rem', height: '150px', resize: 'none' }} placeholder="Ex: Leadership, Communication, Project Management..."></textarea>
                      </div>
                      <button style={{ width: '100%', padding: '20px', background: 'linear-gradient(90deg, #0ca6a6 0%, #4ade80 100%)', border: 'none', borderRadius: '20px', color: 'white', fontWeight: '800', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 20px 40px rgba(12, 166, 166, 0.3)' }}>SAVE CHANGES</button>
                  </div>
              </div>
          </div>
      )}

      {activeTab === 'campaigns' && (
          <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
              <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px', marginBottom: '60px' }}>
                  <div style={{ background: '#0f172a', borderRadius: '30px', padding: '40px', border: '1px solid rgba(12, 166, 166, 0.2)', height: 'fit-content' }}>
                      <h2 style={{ fontSize: '1.4rem', fontWeight: '900', marginBottom: '30px', color: '#0ca6a6' }}>LAUNCH NEW CAMPAIGN</h2>
                      {success && <div style={{ background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', padding: '15px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #4ade80', fontSize: '0.8rem' }}>CAMPAIGN POSTED: AWAITING ADMIN APPROVAL</div>}
                      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          <input type="text" placeholder="Campaign Title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ width: '100%', background: '#090f1d', border: '1px solid #1e293b', padding: '15px', borderRadius: '12px', color: 'white', outline: 'none' }} />
                          <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ background: '#090f1d', border: '1px solid #1e293b', padding: '15px', borderRadius: '12px', color: 'white' }}>
                              <option value="Environment">Environment</option>
                              <option value="Education">Education</option>
                              <option value="Health">Health</option>
                              <option value="Social">Social</option>
                              <option value="Others">Others</option>
                          </select>
                          {formData.category === 'Others' && (
                              <input type="text" placeholder="Enter Custom Category" required value={customCategory} onChange={e => setCustomCategory(e.target.value)} style={{ width: '100%', background: '#090f1d', border: '1px solid #1e293b', padding: '15px', borderRadius: '12px', color: 'white', outline: 'none' }} />
                          )}
                          <textarea placeholder="Description..." rows="4" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ background: '#090f1d', border: '1px solid #1e293b', padding: '15px', borderRadius: '12px', color: 'white', resize: 'none' }}></textarea>
                          <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                              <input type="number" placeholder="Spots" required value={formData.neededPositions} onChange={e => setFormData({...formData, neededPositions: e.target.value})} style={{ background: '#090f1d', border: '1px solid #1e293b', padding: '15px', borderRadius: '12px', color: 'white' }} />
                              <input type="text" placeholder="Location" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} style={{ background: '#090f1d', border: '1px solid #1e293b', padding: '15px', borderRadius: '12px', color: 'white' }} />
                          </div>
                          
                          <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                              <div>
                                  <label style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '8px', display: 'block', fontWeight: 'bold' }}>Upload Campaign Image (Required)</label>
                                  <input type="file" required accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} style={{ width: '100%', background: '#090f1d', border: '1px solid #1e293b', padding: '12px', borderRadius: '12px', color: 'white' }} />
                              </div>
                              <div>
                                  <label style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '8px', display: 'block', fontWeight: 'bold' }}>Upload Campaign Video (Optional)</label>
                                  <input type="file" accept="video/*" onChange={(e) => handleFileUpload(e, 'videoUrl')} style={{ width: '100%', background: '#090f1d', border: '1px solid #1e293b', padding: '12px', borderRadius: '12px', color: 'white' }} />
                              </div>
                          </div>

                          {formData.image && <img src={formData.image} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #0ca6a6' }} />}
                          
                          <button type="submit" style={{ width: '100%', padding: '18px', background: 'linear-gradient(90deg, #0ca6a6 0%, #4ade80 100%)', border: 'none', borderRadius: '15px', color: 'white', fontWeight: '900', cursor: 'pointer' }}>POST CAMPAIGN</button>
                      </form>
                  </div>

                  <div>
                      <h2 style={{ fontSize: '1.5rem', marginBottom: '30px', color: '#94a3b8' }}>MY CAMPAIGNS</h2>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                          {myCampaigns.map(camp => (
                              <div key={camp._id} className="responsive-flex-between" style={{ background: '#0f172a', borderRadius: '24px', padding: '30px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '20px' }}>
                                  {camp.image ? (
                                      <img src={camp.image} style={{ width: '120px', height: '120px', borderRadius: '15px', objectFit: 'cover' }} alt={camp.title} />
                                  ) : (
                                      <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800" style={{ width: '120px', height: '120px', borderRadius: '15px', objectFit: 'cover' }} alt={camp.title} />
                                  )}
                                  <div style={{ flex: 1 }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                          <h3 style={{ margin: 0, fontSize: '1.3rem' }}>{camp.title}</h3>
                                          <button onClick={() => handleDeleteCampaign(camp._id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}><Trash2 size={18}/></button>
                                      </div>
                                      <div style={{ marginBottom: '15px' }}>
                                          <span style={{ padding: '5px 12px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 'bold', background: camp.status === 'Approved' ? '#0ca6a61a' : '#f59e0b1a', color: camp.status === 'Approved' ? '#0ca6a6' : '#f59e0b', border: `1px solid ${camp.status === 'Approved' ? '#0ca6a633' : '#f59e0b33'}` }}>{(camp.status || 'Pending').toUpperCase()}</span>
                                      </div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                          <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', overflow: 'hidden' }}>
                                              <div style={{ height: '100%', width: `${(camp.filledPositions/camp.neededPositions)*100}%`, background: '#0ca6a6', boxShadow: '0 0 10px #0ca6a6' }}></div>
                                          </div>
                                          <span style={{ fontWeight: 'bold', color: '#0ca6a6' }}>{Math.round((camp.filledPositions/camp.neededPositions)*100)}%</span>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      )}

      <style>{`
          @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
          }
      `}</style>
    </div>
  );
};

export default ManagerDashboard;
