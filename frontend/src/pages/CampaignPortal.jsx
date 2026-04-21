import React, { useState, useEffect } from 'react';
import { Megaphone, PlusCircle, CheckCircle, Users, Check, X, Trash2, TrendingUp, BarChart3, Calendar, ShieldCheck, Zap, Globe, MessageSquare, MapPin, Target, UserMinus, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CampaignPortal = ({ user, refreshCamps }) => {
  const navigate = useNavigate();
  if(!user) return <div style={{padding: '100px', textAlign: 'center', color: 'white'}}>INITIALIZING TACTICAL INTERFACE...</div>;

  const [success, setSuccess] = useState(false);
  const [activeApps, setActiveApps] = useState([]); // Those already accepted
  const [pendingApps, setPendingApps] = useState([]);
  const [myCampaigns, setMyCampaigns] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    creatorName: '',
    category: 'Environment',
    location: '',
    description: '',
    skills: '',
    neededPositions: 10,
    videoUrl: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5003/api/applications/manage', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if(res.ok){
        const data = await res.json();
        // Separate pending from accepted
        setPendingApps(data.filter(a => a.status === 'Pending'));
        setActiveApps(data.filter(a => a.status === 'Accepted'));
      }

      const resCamps = await fetch('http://localhost:5003/api/campaigns', {
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
      const res = await fetch(`http://localhost:5003/api/applications/${id}`, {
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
    if(!window.confirm("Terminate user mission involvement?")) return;
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5003/api/applications/${id}`, {
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
    if(!window.confirm("Verify: Purge this mission permanently?")) return;
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5003/api/campaigns/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if(res.ok) {
            setMyCampaigns(myCampaigns.filter(c => c._id !== id));
            if (refreshCamps) refreshCamps();
        }
    } catch(err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const newCamp = {
      ...formData,
      creatorName: user.name,
      requiredSkills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      categories: [formData.category]
    };
    
    try {
      const res = await fetch('http://localhost:5003/api/campaigns', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}`
         },
         body: JSON.stringify(newCamp)
      });
      
      if(res.ok) {
        setSuccess(true);
        setFormData({title: '', creatorName: '', category: 'Environment', location: '', description: '', skills: '', neededPositions: 10, videoUrl: ''});
        fetchData();
        if (refreshCamps) refreshCamps();
        setTimeout(() => { setSuccess(false); }, 3000);
      }
    } catch(err) { console.error(err); }
  };

  return (
    <div className="campaign-portal-cyber" style={{ animation: 'fadeIn 0.6s ease-out' }}>
      
      {/* 🚀 CYBER HEADER (Matches Mockup exactly) */}
      <div style={{ 
          background: 'linear-gradient(90deg, #0ca6a6 0%, #115e5e 100%)', 
          borderRadius: '40px 40px 24px 24px', 
          padding: '40px 60px', 
          marginBottom: '40px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          boxShadow: '0 20px 50px rgba(12, 166, 166, 0.3)'
      }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>C</span>
              </div>
              <div>
                  <h1 style={{ fontSize: '2.8rem', fontWeight: '800', letterSpacing: '2px', color: 'white', margin: 0 }}>MISSION CONTROL</h1>
                  <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)', margin: 0 }}>Deployment Hub for <span style={{ color: '#4ade80' }}>Campaign Managers</span></p>
              </div>
          </div>
          
          <div className="cyber-card" style={{ padding: '15px 25px', display: 'flex', alignItems: 'center', gap: '15px', border: 'none', background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>{user.name}</div>
                  <div style={{ fontSize: '0.7rem', color: '#4ade80', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase' }}>{(user.role || 'user').toUpperCase()}</div>
              </div>
              <img src={user.avatar} style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid #0ca6a6' }} />
          </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>
          
          {/* ⚔️ MISSION FLEET */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', letterSpacing: '2px', color: '#94a3b8', marginBottom: '25px', fontWeight: 'bold' }}>ACTIVE MISSION FLEET</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {myCampaigns.map(camp => (
                        <div key={camp._id} className="cyber-card" style={{ padding: '25px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <h3 style={{ fontSize: '1.2rem', color: 'white', margin: 0 }}>{camp.title}</h3>
                                <button onClick={() => handleDeleteCampaign(camp._id)} style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer' }}><Trash2 size={16}/></button>
                            </div>
                            <div style={{ marginTop: '10px' }}><span style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: '900', background: camp.status === 'Approved' ? '#dcfce71a' : '#fef9c31a', color: camp.status === 'Approved' ? '#4ade80' : '#f59e0b', border: `1px solid ${camp.status === 'Approved' ? '#4ade8033' : '#f59e0b33'}` }}>{(camp.status || 'Pending').toUpperCase()}</span></div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px', marginTop: '15px' }}>
                                <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${(camp.filledPositions/camp.neededPositions)*100}%`, background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }}></div>
                                </div>
                                <span style={{ color: '#4ade80', fontWeight: '900', fontSize: '1rem' }}>{Math.round((camp.filledPositions/camp.neededPositions)*100)}%</span>
                            </div>
                        </div>
                    ))}
                </div>
              </div>

              {/* 👥 MANAGE PERSONNEL (Accept/Remove users) */}
              <div className="cyber-card" style={{ padding: '35px' }}>
                 <h2 style={{ fontSize: '1.3rem', letterSpacing: '2px', color: 'white', marginBottom: '30px', fontWeight: 'bold' }}>PERSONNEL LOGISTICS</h2>
                 
                 {/* PENDING */}
                 <div style={{ marginBottom: '30px' }}>
                    <div style={{ color: '#0ca6a6', fontSize: '0.75rem', fontWeight: 'bold', borderBottom: '1px solid #0ca6a633', paddingBottom: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Zap size={15}/> PENDING CLEARANCE
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {pendingApps.map(app => (
                            <div key={app._id} style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <img src={app.userId?.avatar} style={{ width: '35px', borderRadius: '50%' }} />
                                    <div>
                                        <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>{app.userId?.name}</div>
                                        <div style={{ color: '#64748b', fontSize: '0.7rem' }}>For: {app.campaignId?.title}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => handleAction(app._id, 'Accepted')} style={{ background: '#4ade80', color: 'black', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.7rem' }}>AUTHORIZE</button>
                                    <button onClick={() => handleAction(app._id, 'Rejected')} style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.7rem' }}>REJECT</button>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>

                 {/* ACTIVE RECRUITS */}
                 <div>
                    <div style={{ color: '#4ade80', fontSize: '0.75rem', fontWeight: 'bold', borderBottom: '1px solid #4ade8033', paddingBottom: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <UserCheck size={18}/> ACTIVE MISSION ASSETS
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        {activeApps.map(app => (
                            <div key={app._id} style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(74, 222, 128, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <img src={app.userId?.avatar} style={{ width: '30px', borderRadius: '50%' }} />
                                    <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.85rem' }}>{app.userId?.name}</div>
                                </div>
                                <button onClick={() => handleRemoveUser(app._id)} style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer' }} title="Terminate from mission"><UserMinus size={16}/></button>
                            </div>
                        ))}
                    </div>
                 </div>
              </div>
          </div>

          {/* 🛠️ MISSION LAUNCHER */}
          <div className="cyber-card" style={{ padding: '35px', background: 'rgba(255,255,255,0.02)', height: 'fit-content' }}>
              <h2 style={{ fontSize: '1.2rem', letterSpacing: '2px', color: 'white', marginBottom: '35px', fontWeight: 'bold' }}>MISSION LAUNCHER</h2>
              {success && <div style={{ background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', padding: '15px', borderRadius: '12px', marginBottom: '20px', textAlign: 'center', border: '1px solid #4ade80' }}><b>NODE DEPLOYED: PENDING ADMIN APPROVAL</b></div>}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <input type="text" className="cyber-input" style={{ width: '100%' }} required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Mission Designation"/>
                  <select className="cyber-input" style={{ width: '100%' }} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option value="Environment">Eco-System Restoration</option>
                      <option value="Health">Medical Deployment</option>
                      <option value="Education">Educational Uplift</option>
                  </select>
                  <textarea className="cyber-input" style={{ width: '100%', resize: 'none' }} rows="4" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Strategic Objective Brief..."></textarea>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <input type="number" className="cyber-input" style={{ width: '100%' }} required value={formData.neededPositions} onChange={e => setFormData({...formData, neededPositions: parseInt(e.target.value)})} placeholder="Assets Needed"/>
                      <input type="text" className="cyber-input" style={{ width: '100%' }} required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Target Zone"/>
                  </div>
                  <button type="submit" className="cyber-card" style={{ width: '100%', padding: '20px', background: 'linear-gradient(90deg, #0ca6a6 0%, #4ade80 100%)', border: 'none', color: 'white', fontWeight: '900', letterSpacing: '2px', cursor: 'pointer', boxShadow: '0 0 20px rgba(74, 222, 128, 0.3)' }}>DEPLOY MISSION NODE</button>
              </form>
          </div>

      </div>
    </div>
  );
};

export default CampaignPortal;
