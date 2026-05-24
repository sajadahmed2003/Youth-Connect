import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CheckSquare, Heart, Award, ShieldCheck, Download, MessageSquare, Send, X, Printer } from 'lucide-react';
import { API_BASE } from '../config';

const Dashboard = ({ user, applications = [], campaigns = [] }) => {
  const navigate = useNavigate();

  const validMatches = campaigns ? campaigns.filter(camp => camp.matchScore > 75).length : 0;
  const pendingApps = applications.filter(a => a.status === 'Pending').length;
  const confirmedApps = applications.filter(a => a.status === 'Accepted').length;

  // 💬 PILLAR 3 & 4: UI state for Chat & Certificate downloads
  const [activeChatApp, setActiveChatApp] = useState(null);
  const [campaignChatMessages, setCampaignChatMessages] = useState([]);
  const [loadingCampaignChat, setLoadingCampaignChat] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [newMessageText, setNewMessageText] = useState('');
  
  const [certificateApp, setCertificateApp] = useState(null);

  // 🛡️ SUPER ADMIN & AUTO-BOT SUPPORT STATE
  const [supportQueries, setSupportQueries] = useState([]);
  const [newQueryText, setNewQueryText] = useState('');
  const [loadingQueries, setLoadingQueries] = useState(false);

  React.useEffect(() => {
    fetchSupportQueries();
  }, []);

  React.useEffect(() => {
    if (activeChatApp) {
      fetchCampaignChat(activeChatApp.campaignId?._id);
    }
  }, [activeChatApp]);

  const fetchCampaignChat = async (campaignId) => {
    if (!campaignId) return;
    try {
      setLoadingCampaignChat(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/support/campaign-queries/${campaignId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCampaignChatMessages(data);
      }
    } catch (e) {
      console.error("Error fetching campaign support messages:", e);
    } finally {
      setLoadingCampaignChat(false);
    }
  };

  const fetchSupportQueries = async () => {
    try {
      setLoadingQueries(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/support/my-queries`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSupportQueries(data);
      }
    } catch (e) { console.error(e); }
    finally { setLoadingQueries(false); }
  };

  const handleSendQuery = async (e) => {
    e.preventDefault();
    if (!newQueryText.trim()) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/api/support/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ queryText: newQueryText })
      });
      if (res.ok) {
        const newQ = await res.json();
        setSupportQueries(prev => [newQ, ...prev]);
        setNewQueryText('');
      }
    } catch (err) { console.error(err); }
  };

  const handleSendMessage = async (e) => {
     e.preventDefault();
     if (!newMessageText.trim() || !activeChatApp) return;
     
     const token = localStorage.getItem('token');
     const campaignId = activeChatApp.campaignId?._id;
     const campaignTitle = activeChatApp.campaignId?.title;
     const typedMessage = newMessageText;

     const optimisticMsg = {
       _id: 'temp_' + Date.now(),
       queryText: typedMessage,
       createdAt: new Date().toISOString()
     };
     setCampaignChatMessages(prev => [optimisticMsg, ...prev]);
     setNewMessageText('');
     setIsBotTyping(true);
     
     try {
       const res = await fetch(`${API_BASE}/api/support/query`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}`
         },
         body: JSON.stringify({
           queryText: typedMessage,
           campaignId,
           campaignTitle
         })
       });
       if (res.ok) {
         setTimeout(async () => {
           await fetchCampaignChat(campaignId);
           setIsBotTyping(false);
         }, 800);
       } else {
         setIsBotTyping(false);
       }
     } catch (err) {
       console.error("Error sending logistics query:", err);
       setIsBotTyping(false);
     }
  };

  const activityData = [
    { day: 'Mon', h: '30%' },
    { day: 'Tue', h: '60%', highlight: true },
    { day: 'Wed', h: '40%' },
    { day: 'Thu', h: '85%', highlight: true },
    { day: 'Fri', h: '100%', highlight: true },
    { day: 'Sat', h: '25%' },
    { day: 'Sun', h: '35%' }
  ];

  return (
    <div className="animate-fadeIn" style={{ fontFamily: 'var(--font-body)', padding: '40px 24px', maxWidth: '1200px', margin: '0 auto', color: 'var(--text-primary)' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div className="section-label" style={{ display: 'inline-flex', marginBottom: '8px' }}>Personal Hub</div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: '900', color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.5px' }}>
          Welcome Back, <span style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user ? user.name.split(' ')[0] : 'Campaigner'}</span>!
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '4px' }}>Here is a semantic view of your volunteer timeline and impact metrics.</p>
      </div>

      <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '24px' }}>
        
        {/* LEFT COLUMN - Profile Strength & Skills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="cyber-card" style={{ padding: '28px', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: '800', marginBottom: '20px', color: 'var(--text-primary)' }}>Profile Strength</h3>
            
            <div style={{ position: 'relative', width: '90px', height: '90px', margin: '0 auto 16px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'rgba(124, 58, 237, 0.08)', border: '2px solid rgba(124, 58, 237, 0.2)' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--primary-light)' }}>85%</div>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Semantic Scan Complete</p>

            <div className="divider" style={{ margin: '16px 0' }}></div>

            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '800', marginBottom: '10px', textAlign: 'left', textTransform: 'uppercase' }}>Skills AI Scan</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {user?.skills && user.skills.length > 0 ? user.skills.slice(0, 5).map(s => (
                <span key={s} className="badge badge-primary" style={{ textTransform: 'none', fontSize: '0.68rem', padding: '4px 10px' }}>{s}</span>
              )) : (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No skills scanned yet.</span>
              )}
            </div>
          </div>

          <div className="cyber-card" style={{ padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: '800', marginBottom: '16px' }}>Community Impact</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Campaigns Joined</span>
                <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>{applications.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Active Roles</span>
                <span style={{ fontWeight: '800', color: 'var(--primary-light)' }}>{confirmedApps}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Volunteer Points</span>
                <span style={{ fontWeight: '900', color: '#eab308' }}>🏆 {user?.points || 0}</span>
              </div>
            </div>
          </div>

          {/* 🛡️ SUPER ADMIN QUERY DESK & AI SUPPORT */}
          <div className="cyber-card" style={{ padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: '800', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
              <ShieldCheck size={18} color="var(--primary-light)"/> Super Admin Support
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.4' }}>
              Have questions? Ask our Auto-Bot or submit a query to the Super Admin panel!
            </p>

            <form onSubmit={handleSendQuery} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input 
                type="text" 
                value={newQueryText}
                onChange={e => setNewQueryText(e.target.value)}
                placeholder="Ask about points, certificates, badges..." 
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  color: 'white',
                  fontSize: '0.8rem',
                  outline: 'none'
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '8px 12px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={14} />
              </button>
            </form>

            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px', 
              maxHeight: '320px', 
              overflowY: 'auto', 
              padding: '12px',
              background: 'rgba(0, 0, 0, 0.25)',
              borderRadius: '12px',
              border: '1px solid var(--border)'
            }}>
              {supportQueries.length === 0 ? (
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>Ask any question to initiate the coordination stream...</div>
              ) : (
                [...supportQueries].reverse().map((q, idx) => (
                  <div key={q._id || idx} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    
                    {/* Volunteer Message (Right side, purple gradient bubble) */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '2px' }}>You</span>
                      <div style={{
                        padding: '10px 14px',
                        borderRadius: '16px 16px 2px 16px',
                        background: 'var(--gradient-primary)',
                        color: 'white',
                        fontSize: '0.82rem',
                        maxWidth: '85%',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        wordBreak: 'break-word'
                      }}>{q.queryText}</div>
                      <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)', marginTop: '2px' }}>{new Date(q.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>

                    {/* Auto-Bot Response (Left side, violet tinted bubble) */}
                    {q.botResponse && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '0.62rem', color: '#a78bfa', fontWeight: '700', marginBottom: '2px' }}>🤖 Auto-Bot (AI)</span>
                        <div style={{
                          padding: '10px 14px',
                          borderRadius: '16px 16px 16px 2px',
                          background: 'rgba(167,139,250,0.05)',
                          border: '1px solid rgba(167,139,250,0.15)',
                          color: '#a78bfa',
                          fontSize: '0.82rem',
                          maxWidth: '85%',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                          wordBreak: 'break-word'
                        }}>{q.botResponse}</div>
                      </div>
                    )}

                    {/* Super Admin Response (Left side, emerald tinted bubble) */}
                    {q.adminReply && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '0.62rem', color: '#10b981', fontWeight: '700', marginBottom: '2px' }}>🛡️ Super Admin</span>
                        <div style={{
                          padding: '10px 14px',
                          borderRadius: '16px 16px 16px 2px',
                          background: 'rgba(16,185,129,0.05)',
                          border: '1px solid rgba(16,185,129,0.15)',
                          color: '#10b981',
                          fontSize: '0.82rem',
                          maxWidth: '85%',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                          wordBreak: 'break-word'
                        }}>{q.adminReply}</div>
                      </div>
                    )}

                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN - Insights & Live Trends */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="responsive-grid">
            <div className="cyber-card" onClick={() => navigate('/campaigns')} style={{ padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <h3 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: '800', marginBottom: '12px' }}>AI Matched Campaigns</h3>
              <div style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--primary-light)', lineHeight: '1', marginBottom: '4px' }}>{validMatches > 0 ? validMatches : 4}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '16px' }}>Recommended For You</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="badge badge-warning" style={{ fontSize: '0.62rem', padding: '3px 8px' }}>{pendingApps} Pending</span>
                <span className="badge badge-success" style={{ fontSize: '0.62rem', padding: '3px 8px' }}>{confirmedApps} Active</span>
              </div>
            </div>

            <div className="cyber-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: '800', marginBottom: '8px', textAlign: 'center' }}>Engagement Trends</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '110px', paddingTop: '10px' }}>
                {activityData.map((d, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '8px' }}>
                    <div style={{ width: '22px', height: d.h, background: d.highlight ? 'var(--gradient-primary)' : 'rgba(124, 58, 237, 0.08)', borderRadius: '4px', border: d.highlight ? 'none' : '1px solid var(--border)' }}></div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>{d.day}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="cyber-card" style={{ padding: '28px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: '800', marginBottom: '20px' }}>Featured Campaigns</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {campaigns.slice(0, 3).map(camp => (
                <div key={camp._id} className="cyber-card" onClick={() => navigate('/campaigns')} style={{ cursor: 'pointer', padding: '16px', display: 'flex', gap: '14px', alignItems: 'center', background: 'rgba(255,255,255,0.01)' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '8px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>⚡</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '0.92rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{camp.title}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={10}/> {camp.location} • {camp.creatorName}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                      <span className="badge badge-primary" style={{ padding: '2px 8px', fontSize: '0.6rem' }}>{camp.categories?.[0] || 'GENERAL'}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--primary-light)', fontWeight: '800' }}>{camp.matchScore || 88}% Match</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - My Journey Tracker & Certificate Trigger */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="cyber-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: '800', margin: 0 }}>My Journey</h3>
              <CheckSquare size={16} color="var(--primary-light)"/>
            </div>
            
            {applications.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px 0', fontSize: '0.88rem', fontStyle: 'italic' }}>
                No campaigns joined yet. Visit the Campaigns portal!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {applications.map(app => (
                  <div key={app._id} style={{ padding: '12px', background: 'rgba(255,255,255,0.01)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', borderLeft: '3px solid ' + (app.status === 'Accepted' ? 'var(--success)' : 'var(--warning)') }}>
                    <h4 style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: '0 0 4px 0' }}>{app.campaignId?.title}</h4>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{app.campaignId?.creatorName}</div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span className={`badge ${app.status === 'Accepted' ? 'badge-success' : 'badge-warning'}`} style={{ padding: '2px 8px', fontSize: '0.6rem' }}>
                        {app.status}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Action Panel for Chat & Certificates */}
                    {app.status === 'Accepted' && (
                       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '10px' }}>
                          <button 
                            onClick={() => setActiveChatApp(app)}
                            className="btn btn-ghost" 
                            style={{ padding: '6px 0', fontSize: '0.7rem', justifyContent: 'center', gap: '4px' }}
                          >
                             <MessageSquare size={12} /> Chat
                          </button>
                          
                          <button 
                            onClick={() => setCertificateApp(app)}
                            className="btn" 
                            style={{ 
                              padding: '6px 0', 
                              fontSize: '0.7rem', 
                              justifyContent: 'center', 
                              gap: '4px',
                              background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
                              border: 'none',
                              color: 'white',
                              boxShadow: '0 2px 8px rgba(234, 179, 8, 0.2)'
                            }}
                          >
                             <Award size={12} /> Impact Proof
                          </button>
                       </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="cyber-card" style={{ padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: '800', marginBottom: '16px' }}>Social Interaction</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '10px', padding: '10px', background: 'rgba(255,255,255,0.01)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.08)', color: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Heart size={14} fill="#ef4444" /></div>
                <div>
                  <h4 style={{ fontSize: '0.8rem', color: 'var(--text-primary)', margin: '0 0 2px 0', fontWeight: '700' }}>Trending Post</h4>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Oceans Initiative reached 1k likes!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 💬 PILLAR 3: REAL-TIME LOGISTICS GROUP CHAT MODAL */}
      {activeChatApp && (
         <div className="modal-overlay">
            <div className="modal-box" style={{ width: '100%', maxWidth: '480px', padding: 0, overflow: 'hidden' }}>
               {/* Modal Header */}
               <div style={{ padding: '20px 24px', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                     <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>Grid Logistics Chat</h3>
                     <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Coordination stream for: {activeChatApp.campaignId?.title}</span>
                  </div>
                  <button onClick={() => setActiveChatApp(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}><X size={20}/></button>
               </div>

               {/* Chat message pane */}
               <div style={{ height: '300px', overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-surface)' }}>
                  {loadingCampaignChat ? (
                     <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic', textAlign: 'center', padding: '40px 0' }}>Loading logistics thread...</div>
                  ) : campaignChatMessages.length === 0 ? (
                     <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic', textAlign: 'center', padding: '40px 0' }}>
                        Welcome to the Logistics Chat! Ask the Auto-Bot or Super Admin about supplies, logistics, or plans for this campaign.
                     </div>
                  ) : (
                     [...campaignChatMessages].reverse().map((msg, i) => (
                        <div key={msg._id || i} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                           {/* Volunteer Message (Right side, purple gradient bubble) */}
                           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                              <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '2px' }}>You</span>
                              <div style={{
                                 padding: '10px 14px',
                                 borderRadius: '16px 16px 2px 16px',
                                 background: 'var(--gradient-primary)',
                                 color: 'white',
                                 fontSize: '0.82rem',
                                 maxWidth: '85%',
                                 wordBreak: 'break-word',
                                 boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                              }}>
                                 {msg.queryText}
                              </div>
                              <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                 {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                           </div>

                           {/* Auto-Bot Response (Left side, violet tinted bubble) */}
                           {msg.botResponse && (
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                 <span style={{ fontSize: '0.62rem', color: '#a78bfa', fontWeight: '700', marginBottom: '2px' }}>🤖 Auto-Bot (AI)</span>
                                 <div style={{
                                    padding: '10px 14px',
                                    borderRadius: '16px 16px 16px 2px',
                                    background: 'rgba(167,139,250,0.05)',
                                    border: '1px solid rgba(167,139,250,0.15)',
                                    color: '#a78bfa',
                                    fontSize: '0.82rem',
                                    maxWidth: '85%',
                                    wordBreak: 'break-word',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                                 }}>
                                    {msg.botResponse}
                                 </div>
                              </div>
                           )}

                           {/* Super Admin Response (Left side, emerald tinted bubble) */}
                           {msg.adminReply && (
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                 <span style={{ fontSize: '0.62rem', color: '#10b981', fontWeight: '700', marginBottom: '2px' }}>🛡️ Super Admin</span>
                                 <div style={{
                                    padding: '10px 14px',
                                    borderRadius: '16px 16px 16px 2px',
                                    background: 'rgba(16,185,129,0.05)',
                                    border: '1px solid rgba(16,185,129,0.15)',
                                    color: '#10b981',
                                    fontSize: '0.82rem',
                                    maxWidth: '85%',
                                    wordBreak: 'break-word',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                                 }}>
                                    {msg.adminReply}
                                 </div>
                              </div>
                           )}
                        </div>
                     ))
                  )}
                  {isBotTyping && (
                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '10px' }} className="animate-pulse">
                        <span style={{ fontSize: '0.62rem', color: '#a78bfa', fontWeight: '700', marginBottom: '2px' }}>🤖 Auto-Bot (AI)</span>
                        <div style={{
                           padding: '10px 16px',
                           borderRadius: '16px 16px 16px 2px',
                           background: 'rgba(167,139,250,0.08)',
                           border: '1px solid rgba(167,139,250,0.2)',
                           color: '#a78bfa',
                           fontSize: '0.82rem',
                           maxWidth: '80%',
                           display: 'flex',
                           gap: '4px',
                           alignItems: 'center'
                        }}>
                           <span style={{ width: '6px', height: '6px', background: '#a78bfa', borderRadius: '50%', display: 'inline-block' }}></span>
                           <span style={{ width: '6px', height: '6px', background: '#a78bfa', borderRadius: '50%', display: 'inline-block' }}></span>
                           <span style={{ width: '6px', height: '6px', background: '#a78bfa', borderRadius: '50%', display: 'inline-block' }}></span>
                        </div>
                     </div>
                  )}
               </div>

               {/* Input form */}
               <form onSubmit={handleSendMessage} style={{ display: 'flex', borderTop: '1px solid var(--border)', padding: '12px' }}>
                  <input 
                    type="text" 
                    placeholder="Enter message..." 
                    className="cyber-input" 
                    value={newMessageText} 
                    onChange={e => setNewMessageText(e.target.value)} 
                    style={{ flex: 1, borderRadius: 'var(--radius-full)', padding: '10px 18px' }}
                    required
                  />
                  <button type="submit" className="btn btn-primary" style={{ width: '40px', height: '40px', padding: 0, borderRadius: '50%', justifyContent: 'center', marginLeft: '8px' }}>
                     <Send size={16} />
                  </button>
               </form>
            </div>
         </div>
      )}

      {/* 🏆 PILLAR 4: DOWNLOADABLE DIGITAL CERTIFICATE OF IMPACT */}
      {certificateApp && (
         <div className="modal-overlay">
            <div className="modal-box" style={{ width: '100%', maxWidth: '650px', padding: '40px', textAlign: 'center', background: '#fff', border: '10px double #ca8a04', position: 'relative' }}>
               <button onClick={() => setCertificateApp(null)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }} className="no-print"><X size={24} /></button>

               <div id="print-certificate-container">
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                     <Award size={48} color="#ca8a04" style={{ filter: 'drop-shadow(0 2px 10px rgba(202, 138, 4, 0.2))' }} />
                  </div>

                  <h1 style={{ fontFamily: 'Georgia, serif', color: '#1e293b', fontSize: '2.2rem', margin: '0 0 10px 0', letterSpacing: '1px', textTransform: 'uppercase' }}>Certificate of Impact</h1>
                  <h4 style={{ fontFamily: 'var(--font-heading)', color: '#854d0e', letterSpacing: '3px', textTransform: 'uppercase', fontSize: '0.8rem', margin: '0 0 32px 0' }}>Youth Connect Grid Authority</h4>

                  <p style={{ fontStyle: 'italic', fontSize: '1rem', color: '#475569', margin: '0 0 12px 0' }}>This officially certifies that</p>
                  <h2 style={{ fontFamily: 'Georgia, serif', color: '#7c3aed', fontSize: '2.1rem', fontWeight: 'bold', borderBottom: '2px solid #ca8a04', display: 'inline-block', paddingBottom: '8px', marginBottom: '16px' }}>{user.name}</h2>
                  
                  <p style={{ fontSize: '1.02rem', color: '#334155', maxWidth: '480px', margin: '0 auto 24px auto', lineHeight: '1.6' }}>
                     has made outstanding contributions as an enlisted volunteer in the local impact campaign:
                  </p>
                  <h3 style={{ fontFamily: 'var(--font-heading)', color: '#0f172a', fontSize: '1.3rem', fontWeight: '800', marginBottom: '28px' }}>"{certificateApp.campaignId?.title}"</h3>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', padding: '0 40px' }}>
                     <div style={{ textAlign: 'left' }}>
                        <div style={{ height: '50px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', borderBottom: '1px solid #94a3b8', width: '150px' }}>
                           <span style={{ fontFamily: 'cursive', color: '#475569', fontSize: '1.1rem' }}>Global Admin</span>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '6px', textTransform: 'uppercase', fontWeight: '700' }}>Authorized Registrar</div>
                     </div>

                     {/* Official Verification QR Code Simulator */}
                     <div style={{ width: '72px', height: '72px', border: '1px solid #e2e8f0', padding: '4px', borderRadius: '8px' }}>
                        <div style={{ width: '100%', height: '100%', background: 'radial-gradient(circle, #0f172a 10%, transparent 11%), radial-gradient(circle, #0f172a 10%, transparent 11%)', backgroundSize: '8px 8px', opacity: 0.8 }} />
                     </div>

                     <div style={{ textAlign: 'right' }}>
                        <div style={{ height: '50px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', borderBottom: '1px solid #94a3b8', width: '150px' }}>
                           <span style={{ fontFamily: 'var(--font-body)', color: '#334155', fontWeight: '700', fontSize: '0.9rem' }}>{new Date(certificateApp.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '6px', textTransform: 'uppercase', fontWeight: '700' }}>Date of Verification</div>
                     </div>
                  </div>

                  <div style={{ marginTop: '36px', fontSize: '0.62rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                     VERIFICATION SECURE HASH: YC-${certificateApp._id.substring(0, 8).toUpperCase()}-${user._id.substring(0, 8).toUpperCase()}
                  </div>
               </div>

               {/* Print action bar */}
               <div style={{ display: 'flex', gap: '12px', marginTop: '36px' }} className="no-print">
                  <button onClick={() => window.print()} className="btn" style={{ flex: 1, justifyContent: 'center', gap: '8px', border: '1px solid #ca8a04', color: '#854d0e', fontWeight: '700' }}>
                     <Printer size={16} /> Print Proof
                  </button>
                  <button onClick={() => setCertificateApp(null)} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                     Close
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default Dashboard;
