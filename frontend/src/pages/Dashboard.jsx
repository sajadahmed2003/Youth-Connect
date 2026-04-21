import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, MessageSquare, BellRing, MapPin, Search, CheckSquare, Clock, LayoutGrid, Heart } from 'lucide-react';

const Dashboard = ({ user, applications, campaigns }) => {
  const navigate = useNavigate();

  // Dynamic Matching Logic
  const validMatches = campaigns ? campaigns.filter(camp => camp.matchScore > 75).length : 0;
  const pendingApps = applications.filter(a => a.status === 'Pending').length;
  const confirmedApps = applications.filter(a => a.status === 'Accepted').length;

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
    <div>
      <h1 className="page-title">Welcome Back, {user ? user.name.split(' ')[0] : 'Campaigner'}!</h1>

      <div className="dashboard-layout">
        
        {/* LEFT COLUMN - Insights */}
        <div className="dashboard-col">
          <div className="glass-widget" style={{background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.6)'}}>
            <h2 className="widget-title">Profile Strength</h2>
            
            <div style={{textAlign: 'center', marginBottom: '25px'}}>
              <div className="progress-circle-container">
                <div className="progress-circle">
                  <div className="progress-inner">85%</div>
                </div>
              </div>
              <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '10px'}}>Semantic Scan Complete</p>
            </div>

            <h3 style={{fontSize: '0.9rem', marginBottom: '10px', color:'var(--text-main)'}}>Skills AI Score</h3>
            <div className="pills-container">
                {user?.skills?.slice(0, 5).map(s => <span key={s} className="pill">{s}</span>)}
            </div>

          </div>

          <div className="glass-widget" style={{background: 'rgba(255,255,255,0.4)'}}>
            <h2 className="widget-title" style={{fontSize: '1rem', marginBottom: '15px'}}>Community Impact</h2>
            <div className="impact-stats">
              <div className="impact-row">
                <span style={{color: 'var(--text-muted)'}}>Campaigns Joined:</span>
                <span className="val">{applications.length}</span>
              </div>
              <div className="impact-row">
                <span style={{color: 'var(--text-muted)'}}>Active Roles:</span>
                <span className="val">{confirmedApps}</span>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN - Stats & Campaigns */}
        <div className="dashboard-col">
          <h2 className="widget-title">Live Campaign Analytics</h2>
          <div className="two-col-grid" style={{marginBottom: '30px', gap: '20px'}}>
            <div className="glass-widget match-box" onClick={() => navigate('/campaigns')} style={{ padding: '25px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <h3 style={{fontSize: '1rem', color: 'var(--text-main)', marginBottom: '15px'}}>AI Matched Campaigns</h3>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)', lineHeight: '1', marginBottom: '5px' }}>{validMatches}</div>
              <div style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px'}}>High Probability Impact</div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.8rem', background: '#fef3c7', color: '#d97706', padding: '4px 12px', borderRadius: '20px', fontWeight: '600' }}>{pendingApps} Pending</span>
                <span style={{ fontSize: '0.8rem', background: '#d1fae5', color: '#10b981', padding: '4px 12px', borderRadius: '20px', fontWeight: '600' }}>{confirmedApps} Active</span>
              </div>
            </div>

            <div className="glass-widget match-box" style={{ padding: '25px' }}>
              <h3 style={{fontSize: '1rem', color: 'var(--text-main)', textAlign: 'center'}}>Engagement Trends</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', paddingTop: '20px' }}>
                {activityData.map((d, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '10px' }}>
                    <div style={{ width: '26px', height: d.h, background: d.highlight ? 'var(--primary)' : 'rgba(12, 166, 166, 0.15)', borderRadius: '6px' }}></div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>{d.day}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <h2 className="widget-title">Featured Campaigns</h2>
          <div className="opp-list">
            {campaigns.slice(0, 3).map(camp => (
                <div key={camp._id} className="opp-card" onClick={() => navigate(`/campaigns/${camp._id}`)} style={{ cursor: 'pointer' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem' }}>🔥</div>
                  <div className="opp-details" style={{ flex: 1 }}>
                    <div className="opp-title">{camp.title}</div>
                    <div className="opp-meta"><MapPin size={12}/> {camp.location} • {camp.creatorName}</div>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: '10px'}}>
                      <span className="category-tag">{camp.categories?.[0]}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold' }}>{camp.matchScore}% Match</span>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN - Application Tracker */}
        <div className="dashboard-col">
          <div className="glass-widget">
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px', alignItems:'center'}}>
              <h2 className="widget-title" style={{margin:0}}>My Journey</h2>
              <CheckSquare size={18} color="var(--primary)"/>
            </div>
            
            {applications.length === 0 ? (
                <div style={{textAlign: 'center', color: 'var(--text-muted)', padding: '20px 0'}}>
                    No campaigns joined yet. Visit the Discovery portal!
                </div>
            ) : (
                <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                    {applications.map(app => (
                        <div key={app._id} style={{padding: '15px', background: 'rgba(255,255,255,0.6)', borderRadius: '12px', borderLeft: '4px solid ' + (app.status === 'Accepted' ? 'var(--success)' : '#f59e0b')}}>
                            <h4 style={{fontSize: '1rem', color: 'var(--text-main)', marginBottom: '5px'}}>{app.campaignId?.title}</h4>
                            <div style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px'}}>{app.campaignId?.creatorName}</div>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <span style={{fontSize: '0.75rem', background: app.status === 'Accepted' ? '#d1fae5' : '#fef3c7', color: app.status === 'Accepted' ? '#10b981' : '#d97706', padding: '4px 10px', borderRadius: '10px', fontWeight: 'bold'}}>
                                    {app.status}
                                </span>
                                <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{new Date(app.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </div>

          <div className="glass-widget">
            <h2 className="widget-title">Social Interaction</h2>
            
            <div className="notification-item">
              <div className="noti-icon" style={{background: 'rgba(239, 68, 68, 0.1)'}}><Heart size={16} color="#ef4444" /></div>
              <div className="noti-content">
                <h4>Trending Post</h4>
                <p>Oceans Initiative reached 1k likes!</p>
              </div>
            </div>
            <div className="notification-item">
              <div className="noti-icon" style={{background: 'rgba(12, 166, 166, 0.1)'}}><Search size={16} color="var(--primary)" /></div>
              <div className="noti-content">
                <h4>Search Suggestion</h4>
                <p>New climate campaigns matching your skills.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
