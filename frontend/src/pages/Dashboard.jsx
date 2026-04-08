import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, MessageSquare, BellRing, MapPin, Calendar, CheckSquare, Clock } from 'lucide-react';

const Dashboard = ({ user, applications, opportunities }) => {
  const navigate = useNavigate();

  // Dynamic Matching Logic
  const validMatches = opportunities ? opportunities.filter(opp => {
      const matchCount = opp.skills.filter(s => (user?.skills || []).includes(s)).length;
      return (matchCount / (opp.skills.length || 1)) >= 0.3; // matches if at least 30% skills overlap
  }).length : 0;

  const pendingApps = applications.filter(a => a.status === 'Applied').length;
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
      <h1 className="page-title">Welcome Back, {user ? user.name.split(' ')[0] : 'Volunteer'}!</h1>

      <div className="dashboard-layout">
        
        {/* LEFT COLUMN - Insights */}
        <div className="dashboard-col">
          <div className="glass-widget" style={{background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.6)'}}>
            <h2 className="widget-title">My Personalized Insights</h2>
            
            <div style={{textAlign: 'center', marginBottom: '25px'}}>
              <h3 style={{fontSize: '0.9rem', marginBottom: '15px', color:'var(--text-main)'}}>Volunteering Progress</h3>
              <div className="progress-circle-container">
                <div className="progress-circle">
                  <div className="progress-inner">70%</div>
                </div>
              </div>
              <p style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>35 hrs / 50 hrs goal</p>
            </div>

            <h3 style={{fontSize: '0.9rem', marginBottom: '10px', color:'var(--text-main)'}}>Recommended Skills to Build</h3>
            <div className="pills-container">
              <span className="pill">Event Planning</span>
              <span className="pill">Public Speaking</span>
              <span className="pill">Data Entry</span>
            </div>

          </div>

          <div className="glass-widget" style={{background: 'rgba(255,255,255,0.4)'}}>
            <h2 className="widget-title" style={{fontSize: '1rem', marginBottom: '15px'}}>Your Impact</h2>
            <div className="impact-stats">
              <div className="impact-row">
                <span style={{color: 'var(--text-muted)'}}>Community Hours:</span>
                <span className="val">35h</span>
              </div>
              <div className="impact-row">
                <span style={{color: 'var(--text-muted)'}}>Projects Completed:</span>
                <span className="val">{4 + applications.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN - Stats & Opps */}
        <div className="dashboard-col">
          <h2 className="widget-title">Match Statistics</h2>
          <div className="two-col-grid" style={{marginBottom: '30px', gap: '20px'}}>
            <div className="glass-widget match-box" onClick={() => navigate('/opportunities')} style={{ padding: '25px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 15px rgba(12, 166, 166, 0.15)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'; }}>
              <h3 style={{fontSize: '1rem', color: 'var(--text-main)', marginBottom: '15px'}}>AI Opportunities found</h3>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)', lineHeight: '1', marginBottom: '5px' }}>{validMatches + applications.length}</div>
              <div style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px'}}>High Compatibility Matches</div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.8rem', background: '#fef3c7', color: '#d97706', padding: '4px 12px', borderRadius: '20px', fontWeight: '600' }}>{pendingApps} Pending</span>
                <span style={{ fontSize: '0.8rem', background: '#d1fae5', color: '#10b981', padding: '4px 12px', borderRadius: '20px', fontWeight: '600' }}>{confirmedApps} Confirmed</span>
              </div>
            </div>

            <div className="glass-widget match-box" onClick={() => navigate('/profile')} style={{ padding: '25px', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 15px rgba(12, 166, 166, 0.15)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'; }}>
              <h3 style={{fontSize: '1rem', color: 'var(--text-main)', textAlign: 'center'}}>Activity Weekly Overview</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', paddingTop: '20px' }}>
                {activityData.map((d, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '10px' }}>
                    <div style={{ 
                        width: '26px', 
                        height: d.h, 
                        background: d.highlight ? 'var(--primary)' : 'rgba(12, 166, 166, 0.15)', 
                        borderRadius: '6px',
                        transition: 'height 0.4s ease'
                    }}></div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>{d.day}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <h2 className="widget-title">Recommended Opportunities</h2>
          <div className="opp-list">
            
            <div className="opp-card">
              <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=150&q=80" alt="Garden" className="opp-img" />
              <div className="opp-details">
                <div className="opp-title">Local Community Garden Volunteer</div>
                <div className="opp-meta"><MapPin size={12}/> Urban Greens</div>
                <div className="opp-meta"><Calendar size={12}/> Sat Oct 26, 9am</div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
                  <span className="category-tag">Environment</span>
                  <button className="btn-view" onClick={() => navigate('/opportunities/opp-1')}>View Details</button>
                </div>
              </div>
            </div>
            
            <div className="opp-card">
              <img src="https://images.unsplash.com/photo-1529390079861-591de354faf5?w=150&q=80" alt="Mentor" className="opp-img" />
              <div className="opp-details">
                <div className="opp-title">Youth Mentor Program</div>
                <div className="opp-meta"><MapPin size={12}/> City Youth Center</div>
                <div className="opp-meta"><Calendar size={12}/> Mon/Wed 4pm</div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
                  <span className="category-tag" style={{background: '#0ca6a6'}}>Mentorship</span>
                  <button className="btn-view" onClick={() => navigate('/opportunities/opp-2')}>View Details</button>
                </div>
              </div>
            </div>

            <div className="opp-card">
              <img src="https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=150&q=80" alt="Food Bank" className="opp-img" />
              <div className="opp-details">
                <div className="opp-title">Food Bank Assistant</div>
                <div className="opp-meta"><MapPin size={12}/> Care Collective</div>
                <div className="opp-meta"><Calendar size={12}/> Fri Oct 25, 2pm</div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
                  <span className="category-tag">Support</span>
                  <button className="btn-view" onClick={() => navigate('/opportunities/opp-3')}>View Details</button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN - Application Tracker */}
        <div className="dashboard-col">
          <div className="glass-widget">
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px', alignItems:'center'}}>
              <h2 className="widget-title" style={{margin:0}}>My Applications</h2>
              <CheckSquare size={18} color="var(--primary)"/>
            </div>
            
            {applications.length === 0 ? (
                <div style={{textAlign: 'center', color: 'var(--text-muted)', padding: '20px 0'}}>
                    No applications submitted yet. Browse opportunities to get started!
                </div>
            ) : (
                <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                    {applications.map(app => (
                        <div key={app.id} style={{padding: '15px', background: 'rgba(255,255,255,0.6)', borderRadius: '12px', borderLeft: '4px solid #f59e0b'}}>
                            <h4 style={{fontSize: '1rem', color: 'var(--text-main)', marginBottom: '5px'}}>{app.title}</h4>
                            <div style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px'}}>{app.orgName}</div>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <span style={{fontSize: '0.8rem', background: '#fef3c7', color: '#d97706', padding: '2px 8px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '4px'}}>
                                    <Clock size={12} /> {app.status}
                                </span>
                                <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{app.dateApplied}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </div>

          <div className="glass-widget">
            <h2 className="widget-title">General Notifications</h2>
            
            <div className="notification-item">
              <div className="noti-icon" style={{background: 'rgba(12, 166, 166, 0.2)'}}><MessageSquare size={16} color="var(--primary)" /></div>
              <div className="noti-content">
                <h4>Message from Mentor</h4>
                <p>New onboarding instructions</p>
              </div>
            </div>
            <div className="notification-item">
              <div className="noti-icon" style={{background: 'rgba(16, 185, 129, 0.2)'}}><BellRing size={16} color="var(--success)" /></div>
              <div className="noti-content">
                <h4>Opportunity Reminder</h4>
                <p>Event starts tomorrow</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
