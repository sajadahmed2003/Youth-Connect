import React, { useState } from 'react';
import { Activity, Users, Megaphone, Target, ShieldCheck, Database, ClipboardList, UserCheck, ShieldAlert, Check, X, Server, Zap, Globe, Eye, UserPlus, LogIn } from 'lucide-react';

const AdminDashboard = ({ user, stats, refreshData }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUser, setSelectedUser] = useState(null);

  if (!stats) return (
    <div style={{ padding: '100px', textAlign: 'center', background: 'var(--bg-dark)', minHeight: '80vh' }}>
        <Zap className="animate-float" size={60} color="#4ade80" />
        <h2 style={{ marginTop: '20px', letterSpacing: '2px', color: 'white' }}>LOADING DASHBOARD...</h2>
    </div>
  );

  const handleApproveCampaign = async (id) => {
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`https://youth-connect-backend-6dn5.onrender.com/api/admin/campaigns/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ status: 'Approved' })
        });
        if(res.ok) if (refreshData) refreshData();
    } catch(err) { console.error(err); }
  };

  const handleRemoveCampaign = async (id) => {
    if(!window.confirm("Verify: Permanently purge this campaign?")) return;
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`https://youth-connect-backend-6dn5.onrender.com/api/admin/campaigns/${id}`, {
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
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '3px' }}>ADMIN ACCESS</span>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white', margin: 0 }}>ADMIN <span style={{ color: '#4ade80' }}>DASHBOARD</span></h1>
            <p style={{color: 'var(--text-muted)', fontSize: '1rem', marginTop: '5px'}}>Manage Campaigns, Users, and Requests.</p>
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
                    { label: 'TOTAL USERS', val: stats.totalUsers, icon: <Users/>, col: '#0ca6a6' },
                    { label: 'TOTAL CAMPAIGNS', val: stats.totalCampaigns, icon: <Megaphone/>, col: '#4ade80' },
                    { label: 'APPLICATIONS', val: stats.totalApplications, icon: <Globe/>, col: '#3b82f6' },
                    { label: 'SYSTEM STATUS', val: 'ONLINE', icon: <Activity/>, col: '#f59e0b' }
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
                        <Zap size={22} color="#4ade80" /> RECENT ACTIVITY (Signups/Logins)
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
                        <Database size={22} color="#0ca6a6" /> USER STATISTICS
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
              <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '15px', color: 'white', marginBottom: '40px' }}><UserCheck size={28} color="#0ca6a6"/> REGISTERED USERS</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                  {stats.allUsers?.map(u => (
                      <div key={u._id} onClick={() => setSelectedUser(u)} style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}>
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
                             <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                                Posted by: 
                                <span 
                                    onClick={() => {
                                        const userObj = camp.creatorId || stats.allUsers?.find(u => u.name === camp.creatorName || u.email === camp.creatorName);
                                        if (userObj) setSelectedUser(userObj);
                                        else alert("User profile not found for this older campaign.");
                                    }}
                                    style={{ color: '#0ca6a6', cursor: 'pointer', marginLeft: '5px', textDecoration: 'underline' }}
                                >
                                    {camp.creatorName || (camp.creatorId?.name) || "Manager"}
                                </span>
                             </div>
                            <div style={{ marginTop: '10px' }}><span style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: '900', background: camp.status === 'Approved' ? '#dcfce71a' : '#fef9c31a', color: camp.status === 'Approved' ? '#4ade80' : '#f59e0b', border: `1px solid ${camp.status === 'Approved' ? '#4ade8033' : '#f59e0b33'}` }}>{(camp.status || 'Pending').toUpperCase()}</span></div>
                         </div>
                         <div style={{ display: 'flex', gap: '15px' }}>
                             {camp.status === 'Pending' && <button onClick={() => handleApproveCampaign(camp._id)} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#4ade80', color: 'black', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem' }}>APPROVE</button>}
                             <button onClick={() => handleRemoveCampaign(camp._id)} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#ef4444', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem' }}>DELETE</button>
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
                             <div 
                                onClick={() => {
                                    const userObj = stats.allUsers?.find(u => u.name === app.userName || u.email === app.userName);
                                    if (userObj) setSelectedUser(userObj);
                                    else alert("User profile not found.");
                                }}
                                style={{ color: 'white', fontWeight: '800', fontSize: '1.1rem', cursor: 'pointer', textDecoration: 'underline' }}
                             >
                                {app.userName}
                             </div>
                            <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Applying for: <span style={{ color: '#0ca6a6' }}>{app.campaignTitle}</span></div>
                            <div style={{ marginTop: '10px' }}><span style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: '900', background: app.status === 'Accepted' ? '#dcfce71a' : '#fef9c31a', color: app.status === 'Accepted' ? '#4ade80' : '#f59e0b', border: `1px solid ${app.status === 'Accepted' ? '#4ade8033' : '#f59e0b33'}` }}>{(app.status || 'Pending').toUpperCase()}</span></div>
                         </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* 👤 USER DETAIL MODAL */}
      {selectedUser && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
              <div className="cyber-card" style={{ width: '100%', maxWidth: '500px', padding: '40px', position: 'relative', animation: 'modalIn 0.3s ease-out', border: '1px solid #0ca6a6' }}>
                  <button onClick={() => setSelectedUser(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={24}/></button>
                  
                  <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                      <img src={selectedUser.avatar} style={{ width: '100px', height: '100px', borderRadius: '50%', border: '3px solid #0ca6a6', padding: '5px', marginBottom: '20px' }} />
                      <h2 style={{ fontSize: '1.8rem', color: 'white', margin: 0 }}>{selectedUser.name}</h2>
                      <div style={{ color: '#0ca6a6', fontWeight: 'bold', fontSize: '0.8rem', marginTop: '5px', letterSpacing: '2px' }}>{(selectedUser.role || 'user').toUpperCase()}</div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                          <div style={{ color: '#0ca6a6', fontWeight: 'bold', fontSize: '1.2rem' }}>{selectedUser.campaignsJoined || 0}</div>
                          <div style={{ color: '#64748b', fontSize: '0.6rem', letterSpacing: '1px' }}>JOINED</div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                          <div style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '1.2rem' }}>{selectedUser.campaignsCompleted || 0}</div>
                          <div style={{ color: '#64748b', fontSize: '0.6rem', letterSpacing: '1px' }}>COMPLETED</div>
                      </div>
                  </div>

                  <div style={{ marginBottom: '30px' }}>
                      <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '10px', letterSpacing: '1px' }}>EMAIL ADDRESS</div>
                      <div style={{ color: 'white', background: 'rgba(255,255,255,0.02)', padding: '12px 15px', borderRadius: '10px', fontSize: '0.9rem' }}>{selectedUser.email}</div>
                  </div>

                  <div>
                      <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '10px', letterSpacing: '1px' }}>SKILLS & EXPERTISE</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {selectedUser.skills && selectedUser.skills.length > 0 ? selectedUser.skills.map((s, i) => (
                              <span key={i} style={{ padding: '4px 12px', background: 'rgba(12, 166, 166, 0.1)', color: '#0ca6a6', border: '1px solid rgba(12, 166, 166, 0.2)', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 'bold' }}>{s}</span>
                          )) : <div style={{ color: '#475569', fontSize: '0.8rem', fontStyle: 'italic' }}>No skills specified.</div>}
                      </div>
                  </div>
              </div>
          </div>
      )}

      <style>{`
          @keyframes modalIn {
              from { opacity: 0; transform: scale(0.9); }
              to { opacity: 1; transform: scale(1); }
          }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
