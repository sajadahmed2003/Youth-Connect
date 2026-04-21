import React, { useState } from 'react';
import { Activity, Users, Megaphone, Target, ShieldCheck, Database, ClipboardList, UserCheck, ShieldAlert, Check, X, Server, Zap, Globe, Eye, UserPlus, LogIn } from 'lucide-react';

const AdminDashboard = ({ user, stats, refreshData }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!stats) return (
    <div style={{ padding: '100px', textAlign: 'center', background: 'var(--bg-dark)', minHeight: '80vh' }}>
        <Zap className="animate-float" size={60} color="#4ade80" />
        <h2 style={{ marginTop: '20px', letterSpacing: '2px', color: 'white' }}>SYNCHRONIZING GLOBAL NODE...</h2>
    </div>
  );

  const handleApproveCampaign = async (id) => {
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5003/api/campaigns/${id}/approve`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if(res.ok) if (refreshData) refreshData();
    } catch(err) { console.error(err); }
  };

  const handleDeleteCampaign = async (id) => {
    if(!window.confirm("Verify: Permanently purge this campaign?")) return;
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5003/api/campaigns/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if(res.ok) if (refreshData) refreshData();
    } catch(err) { console.error(err); }
  };

  return (
    <div className="admin-portal-cyber" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* 🌌 GLOBAL OVERRIDE HEADER */}
      <div style={{ 
          background: 'linear-gradient(90deg, #1e293b 0%, #0f172a 100%)', 
          borderRadius: '30px', 
          padding: '40px 50px', 
          marginBottom: '40px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          border: '1px solid rgba(12, 166, 166, 0.3)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
      }}>
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0ca6a6', marginBottom: '10px' }}>
                <ShieldAlert size={20} />
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '3px' }}>SYSTEM OVERRIDE ACTIVE</span>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white', margin: 0 }}>SUPER ADMIN <span style={{ color: '#4ade80' }}>PORTAL</span></h1>
            <p style={{color: 'var(--text-muted)', fontSize: '1rem', marginTop: '5px'}}>Total Control: Campaigns, Users, and Network Logistics.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
            {['overview', 'users', 'campaigns', 'apps'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)} 
                  style={{ 
                    padding: '12px 20px', borderRadius: '15px', border: 'none', 
                    background: activeTab === tab ? '#0ca6a6' : 'transparent', 
                    color: 'white', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.75rem', letterSpacing: '1px', transition: '0.3s' 
                  }}
                >
                    {tab.toUpperCase()}
                </button>
            ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
            {/* 📊 CORE TELEMETRY */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px', marginBottom: '40px'}}>
                {[
                    { label: 'TOTAL ENTITIES', val: stats.totalUsers, icon: <Users/>, col: '#0ca6a6' },
                    { label: 'TOTAL CAMPAIGNS', val: stats.totalCampaigns, icon: <Megaphone/>, col: '#4ade80' },
                    { label: 'JOINS REQUESTED', val: stats.totalApplications, icon: <Globe/>, col: '#3b82f6' },
                    { label: 'SYSTEM HEALTH', val: 'OPTIMAL', icon: <Activity/>, col: '#f59e0b' }
                ].map((m, i) => (
                    <div key={i} className="cyber-card" style={{ padding: '25px', textAlign: 'center' }}>
                        <div style={{ color: m.col, marginBottom: '15px', display: 'flex', justifyContent: 'center' }}>{m.icon}</div>
                        <div style={{fontSize: '2rem', fontWeight: '900', color: 'white', marginBottom: '5px'}}>{m.val}</div>
                        <div style={{fontSize: '0.7rem', color: '#94a3b8', letterSpacing: '2px', fontWeight: 'bold'}}>{m.label}</div>
                    </div>
                ))}
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '30px'}}>
                <div className="cyber-card" style={{ padding: '35px' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px', color: 'white', letterSpacing: '2px' }}>
                        <Zap size={22} color="#4ade80" /> ACTIVITY STREAM (Signups/Logins)
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {stats.logs.map((log, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {log.type === 'SIGNUP' ? <UserPlus size={16} color="#4ade80"/> : <LogIn size={16} color="#0ca6a6"/>}
                                    <div>
                                        <span style={{fontWeight: 'bold', fontSize: '0.85rem', color: log.type === 'SIGNUP' ? '#4ade80' : '#0ca6a6'}}>{(log.type || 'SYSTEM').toUpperCase()}</span>
                                        <span style={{marginLeft: '15px', color: '#cbd5e1', fontSize: '0.9rem'}}>{log.message}</span>
                                    </div>
                                </div>
                                <span style={{fontSize: '0.75rem', color: '#64748b'}}>{new Date(log.createdAt).toLocaleTimeString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="cyber-card" style={{ padding: '35px' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px', color: 'white', letterSpacing: '2px' }}>
                        <Database size={22} color="#0ca6a6" /> ROLE DISTRIBUTION
                    </h2>
                    <div style={{padding: '5px'}}>
                        <div style={{marginBottom: '30px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '15px'}}>
                             <div style={{fontSize: '0.8rem', color: '#94a3b8', marginBottom: '10px'}}>Managers (NGOs)</div>
                             <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'white'}}>{stats.managerCount} Authorized Accounts</div>
                        </div>
                        <div style={{padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '15px'}}>
                             <div style={{fontSize: '0.8rem', color: '#94a3b8', marginBottom: '10px'}}>Volunteers</div>
                             <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'white'}}>{stats.volunteerCount} Authorized Accounts</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
      )}

      {activeTab === 'users' && (
          <div className="cyber-card" style={{ padding: '40px' }}>
              <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '15px', color: 'white', marginBottom: '40px' }}><UserCheck size={28} color="#0ca6a6"/> EVERY SIGNED-UP USER</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                  {stats.allUsers?.map(u => (
                      <div key={u._id} style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                           <img src={u.avatar} style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid #0ca6a6' }} />
                           <div style={{ flex: 1 }}>
                               <div style={{ color: 'white', fontWeight: 'bold' }}>{u.name}</div>
                               <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{u.email}</div>
                           </div>
                           <span style={{ fontSize: '0.6rem', padding: '4px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: u.role === 'ngo' ? '#4ade80' : '#0ca6a6', fontWeight: '900', border: '1px solid rgba(255,255,255,0.1)' }}>{(u.role || 'user').toUpperCase()}</span>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {activeTab === 'campaigns' && (
          <div className="cyber-card" style={{ padding: '40px' }}>
              <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '15px', color: 'white', marginBottom: '40px' }}><Megaphone size={28} color="#0ca6a6"/> EVERY CAMPAIGN POSTED</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {stats.allCampaigns?.map(camp => (
                      <div key={camp._id} style={{ background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <div>
                            <div style={{ color: 'white', fontWeight: '800', fontSize: '1.1rem' }}>{camp.title}</div>
                            <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Posted by: <span style={{ color: '#0ca6a6' }}>{camp.creatorName || "Manager"}</span></div>
                            <div style={{ marginTop: '10px' }}><span style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: '900', background: camp.status === 'Approved' ? '#dcfce71a' : '#fef9c31a', color: camp.status === 'Approved' ? '#4ade80' : '#f59e0b', border: `1px solid ${camp.status === 'Approved' ? '#4ade8033' : '#f59e0b33'}` }}>{(camp.status || 'Pending').toUpperCase()}</span></div>
                         </div>
                         <div style={{ display: 'flex', gap: '15px' }}>
                             {camp.status === 'Pending' && <button onClick={() => handleApproveCampaign(camp._id)} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#4ade80', color: 'black', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem' }}>ACCEPT POST</button>}
                             <button onClick={() => handleDeleteCampaign(camp._id)} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#ef4444', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem' }}>PURGE CAMPAIGN</button>
                         </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {activeTab === 'apps' && (
          <div className="cyber-card" style={{ padding: '40px' }}>
              <h2 style={{ marginBottom: '40px', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '15px', color: 'white' }}><ClipboardList size={28} color="#0ca6a6"/> EVERY JOIN REQUEST</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                  {stats.allApplications?.map(app => (
                      <div key={app._id} style={{ background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <div>
                            <div style={{ color: 'white', fontWeight: '800', fontSize: '1.1rem' }}>{app.userName}</div>
                            <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Applying for: <span style={{ color: '#0ca6a6' }}>{app.campaignTitle}</span></div>
                            <div style={{ marginTop: '10px' }}><span style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: '900', background: app.status === 'Accepted' ? '#dcfce71a' : '#fef9c31a', color: app.status === 'Accepted' ? '#4ade80' : '#f59e0b', border: `1px solid ${app.status === 'Accepted' ? '#4ade8033' : '#f59e0b33'}` }}>{(app.status || 'Pending').toUpperCase()}</span></div>
                         </div>
                      </div>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminDashboard;
