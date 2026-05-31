import React, { useState, useEffect } from 'react';
import { Megaphone, PlusCircle, CheckCircle, Users, Check, X, Trash2, BarChart3, ShieldCheck, Download, Award, TrendingUp, DollarSign, UserMinus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_BASE } from '../config';
import Profile from './Profile';

const ManagerDashboard = ({ user, setUser, refreshCamps }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  if(!user) return <div style={{padding: '100px', textAlign: 'center', color: 'var(--text-primary)'}}>LOADING DASHBOARD...</div>;

  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeApps, setActiveApps] = useState([]);
  const [pendingApps, setPendingApps] = useState([]);
  const [processedApps, setProcessedApps] = useState([]);
  const [myCampaigns, setMyCampaigns] = useState([]);
  const [success, setSuccess] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    category: 'Environment',
    location: '',
    description: '',
    skills: '',
    neededPositions: 10,
    targetAmount: 300000, // default funding target
    fundingReason: ''
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
      const res = await fetch(`${API_BASE}/api/applications/manage`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if(res.ok){
        const data = await res.json();
        setPendingApps(data.filter(a => a.status === 'Pending'));
        setActiveApps(data.filter(a => a.status === 'Accepted'));
        setProcessedApps(data.filter(a => ['Accepted', 'Rejected', 'Removed'].includes(a.status)));
      }

      const resCamps = await fetch(`${API_BASE}/api/my-campaigns`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if(resCamps.ok){
        const data = await resCamps.json();
        setMyCampaigns(data);
      }
    } catch(err) { console.error(err); }
  };

  // 💎 PILLAR 4: CSV EXPORTER ENGINE
  const handleExportCSV = () => {
     if (activeApps.length === 0 && processedApps.length === 0) {
        alert("No volunteer records found to export.");
        return;
     }

     const headers = ["Volunteer Name", "Email", "Campaign Applied", "Status", "Skills", "Campaigns Joined Count", "Campaigns Completed Count"];
     const rows = [...activeApps, ...processedApps].map(app => [
        `"${app.userId?.name || 'N/A'}"`,
        `"${app.userId?.email || 'N/A'}"`,
        `"${app.campaignId?.title || 'N/A'}"`,
        `"${app.status}"`,
        `"${app.userId?.skills ? app.userId.skills.join(', ') : 'None'}"`,
        app.userId?.campaignsJoined || 0,
        app.userId?.campaignsCompleted || 0
     ]);

     const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
     
     const encodedUri = encodeURI(csvContent);
     const link = document.createElement("a");
     link.setAttribute("href", encodedUri);
     link.setAttribute("download", `YouthConnect_Volunteer_Report_${Date.now()}.csv`);
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
  };

  const handleAction = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/applications/${id}`, {
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
        const res = await fetch(`${API_BASE}/api/applications/${id}`, {
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
        const res = await fetch(`${API_BASE}/api/campaigns/${id}`, {
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
      categories: [formData.category === 'Others' ? customCategory : formData.category],
      targetAmount: Number(formData.targetAmount) || 300000
    };
    
    try {
      const res = await fetch(`${API_BASE}/api/campaigns`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}`
         },
         body: JSON.stringify(newCamp)
       });
      
      if(res.ok) {
        setSuccess(true);
        setFormData({title: '', category: 'Environment', location: '', description: '', skills: '', neededPositions: 10, targetAmount: 300000, fundingReason: '', image: '', videoUrl: ''});
        setCustomCategory('');
        fetchData();
        setTimeout(() => { setSuccess(false); }, 3000);
      }
    } catch(err) { console.error(err); }
  };

  // Calculate Crowdfunding Stats dynamically
  const totalFundsRaised = myCampaigns.reduce((sum, c) => sum + (c.raisedAmount || 0), 0);
  const platformFeesSaaS = Math.round(totalFundsRaised * 0.035);

  return (
    <div className="manager-dashboard-premium" style={{ background: 'var(--bg-base)', minHeight: '100vh', padding: '40px 24px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
      
      {/* HEADER */}
      <div className="dashboard-header" style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', padding: '16px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', border: '1px solid var(--border)' }}>
          <div className="header-logo-section" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="logo-icon" style={{ width: '36px', height: '36px', fontSize: '1rem', background: '#7c3aed', color: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚡</div>
              <span style={{ fontWeight: '900', letterSpacing: '0.5px', fontSize: '1rem' }}>YOUTH <span style={{ color: 'var(--accent)' }}>CONNECT</span></span>
          </div>
          
          <div className="header-tabs-section" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['dashboard', 'campaigns', 'profile'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className="btn btn-ghost"
                style={{ 
                  background: activeTab === tab ? 'rgba(124, 58, 237, 0.12)' : 'transparent', 
                  borderColor: activeTab === tab ? 'rgba(124, 58, 237, 0.25)' : 'transparent',
                  color: activeTab === tab ? 'var(--text-accent)' : 'var(--text-secondary)',
                  fontWeight: '700',
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-full)'
                }}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="header-profile-section" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="profile-text" style={{ display: 'flex', alignItems: 'center', gap: '8px', lineHeight: 1.2 }}>
                  <span style={{ fontWeight: 'bold', fontSize: '0.88rem', whiteSpace: 'nowrap' }}>{user.name}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--primary-light)', fontWeight: '900', letterSpacing: '0.5px', background: 'rgba(124, 58, 237, 0.08)', padding: '2px 8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>MANAGER</span>
              </div>
              <img src={user.avatar} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid rgba(124, 58, 237, 0.5)', objectFit: 'cover' }} />
          </div>
      </div>

      {activeTab === 'dashboard' && (
        <div className="animate-fadeIn">
          <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
            
            {/* VOLUNTEER LIST & INCOMING ACTIONS */}
            <div className="cyber-card" style={{ padding: '36px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
                 <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '800', margin: 0 }}><Users color="var(--primary-light)"/> Volunteer Recruits</h2>
                 
                 {/* B2B EXPORTER EXPORT BUTTON */}
                 <button 
                   onClick={handleExportCSV}
                   className="btn btn-ghost"
                   style={{
                      background: 'rgba(6, 182, 212, 0.08)',
                      border: '1px solid rgba(6, 182, 212, 0.25)',
                      color: '#0891b2',
                      fontWeight: '700',
                      padding: '8px 16px',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                   }}
                 >
                    <Download size={14} /> Export Report (CSV)
                 </button>
              </div>
              
              <div style={{ marginBottom: '36px' }}>
                <div className="section-label" style={{ display: 'inline-flex', marginBottom: '16px' }}>Pending Clearance</div>
                {pendingApps.length === 0 && <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.9rem' }}>No pending volunteer requests.</p>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {pendingApps.map(app => (
                    <div key={app._id} style={{ background: 'rgba(255,255,255,0.01)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div className="responsive-flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <img src={app.userId?.avatar} style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid var(--accent)', objectFit: 'cover' }} />
                          <div>
                            <div style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)' }}>{app.userId?.name}</div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: '600', marginTop: '2px' }}>Applying for: <span style={{ color: 'var(--primary-light)' }}>{app.campaignId?.title}</span></div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                              <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.03)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>{app.userId?.campaignsJoined || 0} Joined</span>
                              <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.03)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>{app.userId?.campaignsCompleted || 0} Done</span>
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleAction(app._id, 'Accepted')} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', borderRadius: '10px' }}>Approve</button>
                          <button onClick={() => handleAction(app._id, 'Rejected')} className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '0.8rem', borderRadius: '10px', color: '#f87171', borderColor: 'rgba(239,68,68,0.2)' }}>Reject</button>
                        </div>
                      </div>

                      <div style={{ padding: '12px 16px', background: 'rgba(124, 58, 237, 0.04)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(124,58,237,0.1)' }}>
                        <div style={{ fontSize: '0.68rem', fontWeight: '800', color: 'var(--primary-light)', letterSpacing: '0.5px', marginBottom: '8px', textTransform: 'uppercase' }}>Volunteer Skills</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {app.userId?.skills && app.userId.skills.length > 0 ? app.userId.skills.map((skill, i) => (
                            <span key={i} className="badge badge-primary" style={{ fontSize: '0.62rem', padding: '3px 8px' }}>{skill}</span>
                          )) : <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No skills listed.</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="section-label" style={{ display: 'inline-flex', marginBottom: '16px' }}>Decisions & Personnel</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {processedApps.length === 0 && <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.9rem' }}>No processed requests yet.</p>}
                  {processedApps.map(app => (
                    <div key={app._id} style={{ background: 'rgba(255,255,255,0.01)', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={app.userId?.avatar} style={{ width: '40px', height: '40px', borderRadius: '50%', border: `2px solid ${app.status === 'Accepted' ? 'var(--success)' : 'var(--danger)'}`, objectFit: 'cover' }} />
                          <div>
                            <div style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '0.95rem' }}>{app.userId?.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Campaign: <span style={{ color: 'var(--primary-light)' }}>{app.campaignId?.title}</span></div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span className={`badge ${app.status === 'Accepted' ? 'badge-success' : 'badge-danger'}`} style={{ padding: '4px 12px', fontSize: '0.62rem' }}>
                            {app.status.toUpperCase()}
                          </span>
                          {app.status === 'Accepted' && (
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button onClick={() => handleAction(app._id, 'Completed')} className="btn btn-ghost" style={{ padding: '6px', borderRadius: '8px', color: 'var(--success)', borderColor: 'rgba(16,185,129,0.2)' }} title="Mark Completed"><Check size={14}/></button>
                              <button onClick={() => handleRemoveUser(app._id)} className="btn btn-ghost" style={{ padding: '6px', borderRadius: '8px', color: '#f87171', borderColor: 'rgba(239,68,68,0.2)' }} title="Remove Recruit"><UserMinus size={14}/></button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SIDEBAR KPI WIDGETS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="cyber-card" style={{ padding: '36px', textAlign: 'center', background: 'var(--gradient-primary)', boxShadow: 'var(--shadow-glow)' }}>
                <BarChart3 size={36} style={{ margin: '0 auto 16px auto', color: 'white' }} />
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: '900', margin: '0 0 4px 0', color: 'white' }}>{activeApps.length}</h3>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0 }}>Active Volunteers</p>
              </div>

              {/* 💎 PILLAR 1: Crowdfunding Analytics widget */}
              <div className="cyber-card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'center', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(8, 145, 178, 0.04) 100%)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                   <DollarSign size={24} />
                </div>
                <div>
                   <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '800', textTransform: 'uppercase' }}>Campaign Funds Raised</div>
                   <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--text-primary)', marginTop: '2px' }}>₹{totalFundsRaised.toLocaleString()}</div>
                   <div style={{ fontSize: '0.68rem', color: '#0891b2', fontWeight: '700', marginTop: '2px' }}>Incl. 3.5% Platform Comm. (₹{platformFeesSaaS.toLocaleString()})</div>
                </div>
              </div>
              
              <div className="cyber-card" style={{ padding: '28px' }}>
                <h4 style={{ color: 'var(--primary-light)', fontSize: '0.75rem', letterSpacing: '0.5px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '20px' }}>Quick Stats</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Campaigns</span>
                    <span style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{myCampaigns.length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Pending Approval</span>
                    <span style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--warning)' }}>{myCampaigns.filter(c => c.status === 'Pending').length}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <Profile user={user} setUser={setUser} hideHeader={true} />
      )}

      {activeTab === 'campaigns' && (
        <div className="animate-fadeIn">
          <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px' }}>
            
            {/* CAMPAIGN LAUNCH FORM */}
            <div className="cyber-card" style={{ padding: '32px', height: 'fit-content' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: '800', marginBottom: '24px', color: 'var(--primary-light)' }}>Launch New Campaign</h2>
              {success && <div style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)', padding: '12px', borderRadius: '8px', marginBottom: '20px', border: '1px solid rgba(16,185,129,0.25)', fontSize: '0.8rem', fontWeight: '700' }}>CAMPAIGN POSTED: AWAITING ADMIN APPROVAL</div>}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input type="text" placeholder="Campaign Title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="cyber-input" />
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="cyber-input" style={{ background: 'var(--bg-input)' }}>
                  <option value="Environment">Environment</option>
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Social">Social</option>
                  <option value="Others">Others</option>
                </select>
                {formData.category === 'Others' && (
                  <input type="text" placeholder="Enter Custom Category" required value={customCategory} onChange={e => setCustomCategory(e.target.value)} className="cyber-input" />
                )}
                <textarea placeholder="Campaign description details..." rows="3" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="cyber-input" style={{ resize: 'none' }}></textarea>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="responsive-grid">
                  <input type="number" placeholder="Spots Needed" required value={formData.neededPositions} onChange={e => setFormData({...formData, neededPositions: e.target.value})} className="cyber-input" />
                  <input type="text" placeholder="Location" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="cyber-input" />
                </div>

                <div style={{ marginBottom: 0 }}>
                  <label style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '6px', display: 'block', fontWeight: '800' }}>Target Crowdfunding Amount (₹)</label>
                  <input type="number" placeholder="300000" value={formData.targetAmount} onChange={e => setFormData({...formData, targetAmount: e.target.value})} className="cyber-input" />
                </div>

                <div style={{ marginBottom: 0 }}>
                  <label style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '6px', display: 'block', fontWeight: '800' }}>Reason for Crowdfunding (e.g. why do you need these funds?)</label>
                  <input type="text" placeholder="Ex: To purchase tree saplings, organic soil, and tools." value={formData.fundingReason} onChange={e => setFormData({...formData, fundingReason: e.target.value})} className="cyber-input" />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="responsive-grid">
                  <div>
                    <label style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '6px', display: 'block', fontWeight: '800' }}>Campaign Image (Required)</label>
                    <input type="file" required accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} style={{ width: '100%', color: 'var(--text-secondary)' }} />
                  </div>
                  <div>
                    <label style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '6px', display: 'block', fontWeight: '800' }}>Campaign Video (Optional)</label>
                    <input type="file" accept="video/*" onChange={(e) => handleFileUpload(e, 'videoUrl')} style={{ width: '100%', color: 'var(--text-secondary)' }} />
                  </div>
                </div>

                {formData.image && <img src={formData.image} alt="Preview" style={{ width: '100%', maxHeight: '140px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)', marginTop: '8px' }} />}
                
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', justifyContent: 'center' }}>Post Campaign</button>
              </form>
            </div>

            {/* MY CAMPAIGNS CONTAINER */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '24px', color: 'var(--text-secondary)', fontWeight: '800' }}>My Campaigns</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {myCampaigns.length === 0 && <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.9rem' }}>You haven't posted any campaigns yet.</p>}
                {myCampaigns.map(camp => (
                  <div key={camp._id} className="cyber-card responsive-flex-between animate-fadeIn" style={{ padding: '24px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <img src={camp.image || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800'} style={{ width: '90px', height: '90px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }} alt={camp.title} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{camp.title}</h3>
                        <button onClick={() => handleDeleteCampaign(camp._id)} style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}><Trash2 size={16}/></button>
                      </div>
                      <div style={{ margin: '8px 0 12px 0' }}>
                        <span className={`badge ${camp.status === 'Approved' ? 'badge-success' : 'badge-warning'}`} style={{ padding: '4px 10px', fontSize: '0.62rem' }}>{(camp.status || 'Pending').toUpperCase()}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="progress-bar" style={{ flex: 1 }}>
                          <div className="progress-fill" style={{ width: `${(camp.filledPositions / camp.neededPositions) * 100}%` }}></div>
                        </div>
                        <span style={{ fontWeight: '800', color: 'var(--primary-light)', fontSize: '0.85rem' }}>{Math.round((camp.filledPositions/camp.neededPositions)*100)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
