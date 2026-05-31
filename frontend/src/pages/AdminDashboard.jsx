import React, { useState } from 'react';
import { Activity, Users, Megaphone, ShieldAlert, Check, X, Zap, Globe, ClipboardList, UserCheck, Database, UserPlus, LogIn, Mail, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { API_BASE } from '../config';

const AdminDashboard = ({ user, stats, refreshData }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUser, setSelectedUser] = useState(null);

  // 🛡️ SUPER ADMIN & AUTO-BOT SUPPORT STATE
  const [supportQueries, setSupportQueries] = useState([]);
  const [supportFilter, setSupportFilter] = useState('all'); // 'all', 'general', 'logistics'
  const [activeQueryReplyId, setActiveQueryReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');

  // 📬 GET IN TOUCH / PUBLIC CONTACT STATE
  const [contacts, setContacts] = useState([]);
  const [activeContactReplyId, setActiveContactReplyId] = useState(null);
  const [contactReplyText, setContactReplyText] = useState('');

  React.useEffect(() => {
    fetchQueries();
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/admin/contacts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
    } catch (e) { console.error(e); }
  };

  const handleContactReplySubmit = async (id) => {
    if (!contactReplyText.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/admin/contacts/${id}/reply`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ replyText: contactReplyText })
      });
      if (res.ok) {
        const data = await res.json();
        setContacts(prev => prev.map(c => c._id === id ? data.inquiry : c));
        setContactReplyText('');
        setActiveContactReplyId(null);
        alert("Reply registered successfully!");
      }
    } catch(err) { console.error(err); }
  };

  const fetchQueries = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/support/queries`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSupportQueries(data);
      }
    } catch (e) { console.error(e); }
  };

  const handleAdminReply = async (id) => {
    if (!replyText.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/support/queries/${id}/reply`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ adminReply: replyText })
      });
      if (res.ok) {
        const updatedQ = await res.json();
        setSupportQueries(prev => prev.map(q => q._id === id ? updatedQ : q));
        setReplyText('');
        setActiveQueryReplyId(null);
        alert("Reply submitted successfully!");
      }
    } catch(err) { console.error(err); }
  };

  if (!stats) return (
    <div style={{ padding: '100px', textAlign: 'center', background: 'var(--bg-base)', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Zap className="animate-float" size={60} color="var(--primary-light)" />
      <h2 style={{ marginTop: '20px', letterSpacing: '1px', color: 'var(--text-primary)' }}>LOADING DASHBOARD...</h2>
    </div>
  );

  const handleApproveCampaign = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/admin/campaigns/${id}`, {
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
    if(!window.confirm("Verify: Permanently remove this campaign?")) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/admin/campaigns/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if(res.ok) if (refreshData) refreshData();
    } catch(err) { console.error(err); }
  };
  // Chart Aggregation Logic
  const chartData = React.useMemo(() => {
    if (!stats?.crowdfunding?.donations) return [];
    
    const aggregated = {};
    stats.crowdfunding.donations.forEach(d => {
      const date = new Date(d.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!aggregated[date]) {
        aggregated[date] = { date, volume: 0, commission: 0 };
      }
      aggregated[date].volume += (d.amount || 0);
      aggregated[date].commission += (d.commissionDeducted || 0);
    });
    
    return Object.values(aggregated);
  }, [stats]);

  const exportLedgerCSV = () => {
    if (!stats.crowdfunding?.donations || stats.crowdfunding.donations.length === 0) return;
    const headers = ['Transaction ID', 'Donor', 'Campaign ID', 'Date', 'Amount (INR)', 'Platform Fee (INR)', 'NGO Received (INR)'];
    const rows = stats.crowdfunding.donations.map(d => [
      d._id,
      d.userId?.name || 'Anonymous',
      d.campaignId?._id || d.campaignId,
      new Date(d.createdAt).toLocaleString(),
      d.amount || 0,
      d.commissionDeducted || 0,
      (d.amount || 0) - (d.commissionDeducted || 0)
    ]);
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `minoor_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-portal-cyber animate-fadeIn" style={{ fontFamily: 'var(--font-body)', padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* 🌌 GLOBAL OVERRIDE HEADER */}
      <div className="dashboard-header" style={{ 
        background: 'var(--bg-surface)', 
        borderRadius: 'var(--radius-lg)', 
        padding: '30px 40px', 
        marginBottom: '40px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        border: '1px solid var(--border)',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', marginBottom: '8px' }}>
            <ShieldAlert size={18} />
            <span style={{ fontSize: '0.72rem', fontWeight: '800', letterSpacing: '1px' }}>ADMIN ACCESS</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: '900', color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.5px' }}>
            Admin <span style={{ color: 'var(--primary-light)' }}>Dashboard</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '4px' }}>Control center for campaigns, users, and audit records.</p>
        </div>
        
        <div className="admin-tabs-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)' }}>
          {['overview', 'users', 'campaigns', 'apps', 'support', 'donations', 'contacts'].map(tab => (
            <button 
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (tab === 'contacts') fetchContacts();
              }} 
              className="btn btn-ghost"
              style={{ 
                padding: '8px 16px', 
                borderRadius: 'var(--radius-full)', 
                background: activeTab === tab ? 'var(--gradient-primary)' : 'transparent',
                borderColor: activeTab === tab ? 'transparent' : 'transparent',
                color: activeTab === tab ? 'white' : 'var(--text-secondary)',
                fontWeight: '700',
                fontSize: '0.78rem'
              }}
            >
              {tab === 'apps' ? 'JOIN REQUESTS' : tab === 'support' ? 'SUPPORT DESK' : tab === 'donations' ? 'LEDGER' : tab === 'contacts' ? 'CONTACT BOX' : tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* 📊 CORE TELEMETRY */}
          <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            {[
              { label: 'Total Users', val: stats.totalUsers, icon: <Users size={20}/>, col: 'var(--primary-light)' },
              { label: 'Total Campaigns', val: stats.totalCampaigns, icon: <Megaphone size={20}/>, col: 'var(--accent)' },
              { label: 'Applications', val: stats.totalApplications, icon: <Globe size={20}/>, col: '#3b82f6' },
              { label: 'System Status', val: 'ONLINE', icon: <Activity size={20}/>, col: 'var(--success)' },
              { label: 'Total Funds Raised', val: `₹${(stats.crowdfunding?.totalDonated || 0).toLocaleString()}`, icon: <Database size={20}/>, col: '#10b981' },
              { label: 'Fees Accrued (3.5%)', val: `₹${(stats.crowdfunding?.totalCommissionAccrued || 0).toLocaleString()}`, icon: <Activity size={20}/>, col: '#f59e0b' }
            ].map((m, i) => (
              <div key={i} className="cyber-card" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ color: m.col, marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>{m.icon}</div>
                <div style={{ fontSize: '2.0rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '4px' }}>{m.val}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.5px', fontWeight: '800', textTransform: 'uppercase' }}>{m.label}</div>
              </div>
            ))}
          </div>

          <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '30px' }}>
            <div className="cyber-card" style={{ padding: '32px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', fontWeight: '800' }}>
                <Zap size={18} color="var(--accent)" /> Recent Activity Logs
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(stats.logs || []).map((log, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px', background: 'rgba(255,255,255,0.01)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      {log.type === 'SIGNUP' ? <UserPlus size={16} color="var(--success)"/> : <LogIn size={16} color="var(--primary-light)"/>}
                      <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        <span style={{ fontWeight: '800', color: log.type === 'SIGNUP' ? 'var(--success)' : 'var(--primary-light)' }}>{(log.type || 'SYSTEM').toUpperCase()}</span>
                        <span style={{ marginLeft: '12px', color: 'var(--text-secondary)' }}>{log.message}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', flexShrink: 0 }}>{new Date(log.createdAt).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="cyber-card" style={{ padding: '32px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', fontWeight: '800' }}>
                <Database size={18} color="var(--primary-light)" /> User Breakdown
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.01)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '800', textTransform: 'uppercase' }}>Campaign Managers (NGOs)</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>{stats.managerCount} Accounts</div>
                </div>
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.01)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '800', textTransform: 'uppercase' }}>Volunteers</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>{stats.volunteerCount} Accounts</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <div className="cyber-card" style={{ padding: '36px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-primary)', marginBottom: '32px', fontWeight: '800' }}><UserCheck size={22} color="var(--primary-light)"/> Registered Users</h2>
          <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {stats.allUsers?.map(u => (
              <div key={u._id} onClick={() => setSelectedUser(u)} style={{ background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <img src={u.avatar} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--primary-light)', objectFit: 'cover' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: 'var(--text-primary)', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.email}</div>
                </div>
                <span className="badge badge-primary" style={{ fontSize: '0.6rem', padding: '2px 8px' }}>{(u.role || 'user').toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div className="cyber-card" style={{ padding: '36px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-primary)', marginBottom: '32px', fontWeight: '800' }}><Megaphone size={22} color="var(--accent)"/> Campaigns List</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {stats.allCampaigns?.map(camp => (
              <div key={camp._id} className="responsive-flex-between animate-fadeIn" style={{ background: 'rgba(255,255,255,0.01)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <img src={camp.image || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800'} style={{ width: '70px', height: '70px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} alt={camp.title} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: 'var(--text-primary)', fontWeight: '800', fontSize: '1.05rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{camp.title}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '2px' }}>
                    Posted by: 
                    <span 
                      onClick={(e) => {
                        e.stopPropagation();
                        const userObj = camp.creatorId || stats.allUsers?.find(u => u.name === camp.creatorName || u.email === camp.creatorName);
                        if (userObj) setSelectedUser(userObj);
                        else alert("User profile not found.");
                      }}
                      style={{ color: 'var(--primary-light)', cursor: 'pointer', marginLeft: '5px', textDecoration: 'underline', fontWeight: '700' }}
                    >
                      {camp.creatorName || (camp.creatorId?.name) || "Manager"}
                    </span>
                  </div>
                  <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                    <span className={`badge ${camp.status === 'Approved' ? 'badge-success' : 'badge-warning'}`} style={{ padding: '3px 10px', fontSize: '0.6rem' }}>{(camp.status || 'Pending').toUpperCase()}</span>
                    {camp.targetAmount > 0 ? (
                      <span className="badge badge-primary" style={{ padding: '3px 10px', fontSize: '0.6rem' }}>
                        Goal: ₹{(camp.targetAmount || 0).toLocaleString()} (Raised: ₹{(camp.raisedAmount || 0).toLocaleString()})
                      </span>
                    ) : (
                      <span className="badge badge-accent" style={{ padding: '3px 10px', fontSize: '0.6rem' }}>
                        Volunteer Only
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {camp.status === 'Pending' && <button onClick={() => handleApproveCampaign(camp._id)} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', borderRadius: '10px' }}>Approve</button>}
                  <button onClick={() => handleRemoveCampaign(camp._id)} className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '0.8rem', borderRadius: '10px', color: '#f87171', borderColor: 'rgba(239,68,68,0.2)' }}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'apps' && (
        <div className="cyber-card" style={{ padding: '36px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-primary)', fontWeight: '800' }}><ClipboardList size={22} color="var(--primary-light)"/> Global Join Requests</h2>
          <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {stats.allApplications?.map(app => (
              <div key={app._id} style={{ background: 'rgba(255,255,255,0.01)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ minWidth: 0 }}>
                  <div 
                    onClick={() => {
                      const userObj = stats.allUsers?.find(u => u.name === app.userName || u.email === app.userName);
                      if (userObj) setSelectedUser(userObj);
                      else alert("User profile not found.");
                    }}
                    style={{ color: 'var(--text-primary)', fontWeight: '800', fontSize: '1.05rem', cursor: 'pointer', textDecoration: 'underline', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {app.userName}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Applying for: <span style={{ color: 'var(--primary-light)', fontWeight: '700' }}>{app.campaignTitle}</span></div>
                  <div style={{ marginTop: '8px' }}><span className={`badge ${app.status === 'Accepted' ? 'badge-success' : 'badge-warning'}`} style={{ padding: '3px 10px', fontSize: '0.6rem' }}>{(app.status || 'Pending').toUpperCase()}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'support' && (() => {
        const filteredQueries = supportQueries.filter(q => {
          if (supportFilter === 'general') return !q.campaignId;
          if (supportFilter === 'logistics') return !!q.campaignId;
          return true;
        });

        return (
          <div className="cyber-card" style={{ padding: '36px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-primary)', fontWeight: '800' }}>
              <ShieldAlert size={22} color="var(--accent)"/> Support Queries & Chat Streams
            </h2>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setSupportFilter('all')} 
                className="btn" 
                style={{
                  padding: '6px 14px', 
                  fontSize: '0.75rem',
                  borderRadius: '8px', 
                  background: supportFilter === 'all' ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.03)',
                  color: supportFilter === 'all' ? 'white' : 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                  cursor: 'pointer'
                }}
              >
                All Threads ({supportQueries.length})
              </button>
              <button 
                onClick={() => setSupportFilter('general')} 
                className="btn" 
                style={{
                  padding: '6px 14px', 
                  fontSize: '0.75rem',
                  borderRadius: '8px', 
                  background: supportFilter === 'general' ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.03)',
                  color: supportFilter === 'general' ? 'white' : 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                  cursor: 'pointer'
                }}
              >
                General Platform ({supportQueries.filter(q => !q.campaignId).length})
              </button>
              <button 
                onClick={() => setSupportFilter('logistics')} 
                className="btn" 
                style={{
                  padding: '6px 14px', 
                  fontSize: '0.75rem',
                  borderRadius: '8px', 
                  background: supportFilter === 'logistics' ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.03)',
                  color: supportFilter === 'logistics' ? 'white' : 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                  cursor: 'pointer'
                }}
              >
                Campaign Logistics ({supportQueries.filter(q => !!q.campaignId).length})
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {filteredQueries.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.92rem' }}>No support inquiries matching this filter logged in the grid.</p>
              ) : (
                filteredQueries.map(q => (
                  <div key={q._id} style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    
                    {/* Chat Box Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: '800', color: 'var(--text-primary)', fontSize: '0.95rem' }}>Support Stream: {q.userName || q.userId?.name || 'Volunteer'}</span>
                        {q.campaignTitle ? (
                          <span className="badge badge-warning" style={{ fontSize: '0.62rem', padding: '2px 8px', textTransform: 'uppercase', background: 'rgba(234,179,8,0.15)', color: '#facc15', border: '1px solid rgba(234,179,8,0.3)' }}>
                            📦 Logistics: {q.campaignTitle}
                          </span>
                        ) : (
                          <span className="badge badge-primary" style={{ fontSize: '0.62rem', padding: '2px 8px' }}>GENERAL</span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(q.createdAt).toLocaleString()}</span>
                    </div>

                    {/* Chat Stream Body */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: 'var(--bg-base)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      
                      {/* Volunteer Message (Left side bubble for Admin) */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '2px' }}>{q.userName || q.userId?.name || 'Volunteer'}</span>
                        <div style={{
                          padding: '10px 14px',
                          borderRadius: '16px 16px 16px 2px',
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-primary)',
                          fontSize: '0.86rem',
                          maxWidth: '85%',
                          wordBreak: 'break-word'
                        }}>{q.queryText}</div>
                      </div>

                      {/* Auto-Bot Response (Right side bubble for Admin) */}
                      {q.botResponse && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <span style={{ fontSize: '0.62rem', color: '#a78bfa', fontWeight: '700', marginBottom: '2px' }}>🤖 Auto-Bot (AI)</span>
                          <div style={{
                            padding: '10px 14px',
                            borderRadius: '16px 16px 2px 16px',
                            background: 'rgba(167,139,250,0.05)',
                            border: '1px solid rgba(167,139,250,0.15)',
                            color: '#7c3aed',
                            fontSize: '0.86rem',
                            maxWidth: '85%',
                            wordBreak: 'break-word'
                          }}>{q.botResponse}</div>
                        </div>
                      )}

                      {/* Super Admin Response (Right side bubble for Admin) */}
                      {q.adminReply && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <span style={{ fontSize: '0.62rem', color: '#10b981', fontWeight: '700', marginBottom: '2px' }}>🛡️ You (Super Admin Override)</span>
                          <div style={{
                            padding: '10px 14px',
                            borderRadius: '16px 16px 2px 16px',
                            background: 'rgba(16,185,129,0.05)',
                            border: '1px solid rgba(16,185,129,0.15)',
                            color: '#059669',
                            fontSize: '0.86rem',
                            maxWidth: '85%',
                            wordBreak: 'break-word'
                          }}>{q.adminReply}</div>
                        </div>
                      )}

                    </div>

                    {/* Input field for manual reply */}
                    {!q.adminReply && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                        {activeQueryReplyId === q._id ? (
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <input 
                              type="text" 
                              value={replyText}
                              onChange={e => setReplyText(e.target.value)}
                              placeholder="Type manual override answer..."
                              style={{ flex: 1, background: 'var(--bg-surface)', border: '1px solid var(--border)', padding: '10px 16px', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }}
                            />
                            <button onClick={() => handleAdminReply(q._id)} className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '800' }}>Submit Reply</button>
                            <button onClick={() => { setActiveQueryReplyId(null); setReplyText(''); }} className="btn btn-ghost" style={{ padding: '10px', borderRadius: '10px', color: 'red' }}><X size={16} /></button>
                          </div>
                        ) : (
                          <button onClick={() => { setActiveQueryReplyId(q._id); setReplyText(''); }} className="btn btn-ghost" style={{ alignSelf: 'flex-start', padding: '6px 14px', fontSize: '0.75rem', borderRadius: '8px', color: 'var(--primary-light)', borderColor: 'rgba(124,58,237,0.2)' }}>
                            ✍️ Override Auto-Bot Response
                          </button>
                        )}
                      </div>
                    )}

                  </div>
                ))
              )}
            </div>
          </div>
        );
      })()}

      {activeTab === 'donations' && (
        <div className="cyber-card" style={{ padding: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-primary)', fontWeight: '800', margin: 0 }}>
                <Database size={22} color="var(--success)"/> Financial Ledger & Crowdfunding
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '4px', marginBottom: 0 }}>Real-time audit record of all crowdfunding donations processed on the network.</p>
            </div>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <button onClick={exportLedgerCSV} className="btn" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '12px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800' }}>
                <Download size={18} /> Export CSV
              </button>
              <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', padding: '12px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '800', textTransform: 'uppercase' }}>Total Crowdfunding Volume</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--success)' }}>₹{(stats.crowdfunding?.totalDonated || 0).toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Analytics Chart */}
          {chartData.length > 0 && (
            <div style={{ width: '100%', height: '300px', marginBottom: '40px', background: 'rgba(255,255,255,0.01)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px', fontWeight: '800', textTransform: 'uppercase' }}>Donation Volume Trends</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}`} />
                  <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                  <Bar dataKey="volume" name="Donation Vol (₹)" fill="var(--success)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.5px' }}>Transaction ID</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.5px' }}>Donor</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.5px' }}>Campaign Destination</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.5px' }}>Timestamp</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.5px' }}>Platform Fee (3.5%)</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.5px' }}>Net Raised</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.5px', textAlign: 'right' }}>Total Donated</th>
                </tr>
              </thead>
              <tbody>
                {(!stats.crowdfunding?.donations || stats.crowdfunding.donations.length === 0) ? (
                  <tr>
                    <td colSpan="7" style={{ padding: '40px', fontStyle: 'italic', textAlign: 'center', color: 'var(--text-secondary)' }}>No crowdfunding donation logs found.</td>
                  </tr>
                ) : (
                  stats.crowdfunding.donations.map((d, idx) => (
                    <tr key={d._id || idx} style={{ borderBottom: '1px solid var(--border)', background: idx % 2 === 0 ? 'var(--bg-card)' : 'transparent', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'var(--bg-card-hover)'} onMouseOut={e => e.currentTarget.style.background = idx % 2 === 0 ? 'var(--bg-card)' : 'transparent'}>
                      <td style={{ padding: '16px 20px', fontFamily: 'monospace', color: 'var(--primary-light)', fontWeight: '700', fontSize: '0.78rem' }}>{d.transactionId || `TXN_${idx + 1000}`}</td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-primary)', fontWeight: '700' }}>{d.donorName}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ color: 'var(--text-primary)', fontWeight: '800', display: 'block' }}>{d.campaignTitle}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block', marginTop: '4px', fontWeight: '600' }}>
                          Goal: ₹{(d.targetAmount || 0).toLocaleString()} | Raised: ₹{(d.raisedAmount || 0).toLocaleString()} ({d.targetAmount > 0 ? `${Math.min(100, Math.round(((d.raisedAmount || 0) / (d.targetAmount || 1)) * 100))}%` : 'Goal Met!'})
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{new Date(d.createdAt).toLocaleString()}</td>
                      <td style={{ padding: '16px 20px', color: '#ef4444', fontWeight: '700' }}>₹{(d.commissionDeducted || 0).toLocaleString()}</td>
                      <td style={{ padding: '16px 20px', color: 'var(--accent)', fontWeight: '700' }}>₹{((d.amount || 0) - (d.commissionDeducted || 0)).toLocaleString()}</td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ color: 'var(--success)', fontWeight: '900', fontSize: '0.92rem' }}>₹{(d.amount || 0).toLocaleString()}</div>
                        <div style={{ marginTop: '6px', fontSize: '0.68rem', color: 'var(--text-secondary)', lineHeight: '1.4', fontWeight: '600' }}>
                          <div>Target: <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>₹{(d.targetAmount || 0).toLocaleString()}</span></div>
                          <div style={{ color: 'var(--success)' }}>Raised: <span style={{ fontWeight: '800' }}>₹{(d.raisedAmount || 0).toLocaleString()}</span></div>
                          <div style={{ color: ((d.targetAmount || 0) - (d.raisedAmount || 0)) > 0 ? '#f59e0b' : 'var(--success)' }}>
                            {((d.targetAmount || 0) - (d.raisedAmount || 0)) > 0 
                              ? `Left: ₹${((d.targetAmount || 0) - (d.raisedAmount || 0)).toLocaleString()}` 
                              : 'Goal Achieved!'}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'contacts' && (
        <div className="cyber-card" style={{ padding: '36px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-primary)', fontWeight: '800' }}>
            <Mail size={22} color="var(--primary-light)"/> Public Inquiries & Contact Desk
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {contacts.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.92rem' }}>No public contact inquiries have been received yet.</p>
            ) : (
              contacts.map(c => (
                <div key={c._id} style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  
                  {/* Inquiry Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                    <div>
                      <span style={{ fontWeight: '800', color: 'var(--text-primary)', fontSize: '0.98rem' }}>{c.name}</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginLeft: '8px' }}>({c.email})</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span className={`badge ${c.status === 'Resolved' ? 'badge-success' : 'badge-warning'}`} style={{ padding: '3px 10px', fontSize: '0.6rem', fontWeight: '800' }}>
                        {c.status.toUpperCase()}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(c.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Subject & Message Content */}
                  <div>
                    <h4 style={{ color: 'var(--primary-light)', fontSize: '0.95rem', fontWeight: '800', margin: '0 0 6px 0' }}>Subject: {c.subject}</h4>
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      background: 'var(--bg-base)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontSize: '0.88rem',
                      lineHeight: '1.5',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {c.message}
                    </div>
                  </div>

                  {/* Reply Log */}
                  {c.replyText && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', padding: '14px', borderRadius: '8px', marginTop: '4px' }}>
                      <span style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: '700' }}>🛡️ Super Admin Response:</span>
                      <p style={{ color: 'var(--text-primary)', fontSize: '0.86rem', margin: 0, fontWeight: '500' }}>{c.replyText}</p>
                    </div>
                  )}

                  {/* Reply Input Form */}
                  {c.status === 'Pending' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                      {activeContactReplyId === c._id ? (
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <input 
                            type="text" 
                            value={contactReplyText}
                            onChange={e => setContactReplyText(e.target.value)}
                            placeholder="Type response to inquiry..."
                            style={{ flex: 1, background: 'var(--bg-surface)', border: '1px solid var(--border)', padding: '10px 16px', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }}
                          />
                          <button onClick={() => handleContactReplySubmit(c._id)} className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '800' }}>Send Reply</button>
                          <button onClick={() => { setActiveContactReplyId(null); setContactReplyText(''); }} className="btn btn-ghost" style={{ padding: '10px', borderRadius: '10px', color: 'red' }}><X size={16} /></button>
                        </div>
                      ) : (
                        <button onClick={() => { setActiveContactReplyId(c._id); setContactReplyText(''); }} className="btn btn-ghost" style={{ alignSelf: 'flex-start', padding: '6px 14px', fontSize: '0.75rem', borderRadius: '8px', color: 'var(--primary-light)', borderColor: 'rgba(124,58,237,0.2)' }}>
                          ✍️ Respond / Resolve Inquiry
                        </button>
                      )}
                    </div>
                  )}

                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 👤 USER DETAIL MODAL */}
      {selectedUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(10, 10, 18, 0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="modal-box" style={{ width: '100%', maxWidth: '460px', padding: '36px', textAlign: 'center', position: 'relative' }}>
            <button onClick={() => setSelectedUser(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20}/></button>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
              <img src={selectedUser.avatar} style={{ width: '90px', height: '90px', borderRadius: '50%', border: '3px solid var(--primary-light)', objectFit: 'cover', marginBottom: '16px' }} />
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-primary)', margin: 0, fontWeight: '800' }}>{selectedUser.name}</h2>
              <div className="badge badge-primary" style={{ marginTop: '6px', fontSize: '0.65rem' }}>{(selectedUser.role || 'user').toUpperCase()}</div>
            </div>

            {/* IMPACT STATISTICS GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(255,255,255,0.01)', padding: '12px 6px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ color: 'var(--primary-light)', fontWeight: '800', fontSize: '1.15rem' }}>{selectedUser.campaignsJoined || 0}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.55rem', fontWeight: '800', letterSpacing: '0.5px' }}>JOINED</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.01)', padding: '12px 6px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ color: 'var(--success)', fontWeight: '800', fontSize: '1.15rem' }}>{selectedUser.campaignsCompleted || 0}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.55rem', fontWeight: '800', letterSpacing: '0.5px' }}>COMPLETED</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.01)', padding: '12px 6px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ color: '#eab308', fontWeight: '800', fontSize: '1.15rem' }}>🏆 {selectedUser.points || 0}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.55rem', fontWeight: '800', letterSpacing: '0.5px' }}>SCORE</div>
              </div>
            </div>

            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem', fontWeight: '800', marginBottom: '6px', letterSpacing: '0.5px' }}>EMAIL ADDRESS</div>
              <div style={{ color: 'var(--text-primary)', background: 'rgba(255,255,255,0.01)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.88rem' }}>{selectedUser.email}</div>
            </div>

            {/* UNLOCKED BADGES */}
            {selectedUser.role === 'volunteer' && (
              <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '0.5px' }}>UNLOCKED ACHIEVEMENTS</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedUser.badges && selectedUser.badges.length > 0 ? selectedUser.badges.map((b, i) => (
                    <span key={i} className="badge badge-warning" style={{ fontSize: '0.68rem', padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px', textTransform: 'none' }}>
                      <span>{b.icon}</span> {b.title}
                    </span>
                  )) : <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>No badges unlocked yet.</div>}
                </div>
              </div>
            )}

            <div style={{ textAlign: 'left' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '0.5px' }}>SKILLS & EXPERTISE</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {selectedUser.skills && selectedUser.skills.length > 0 ? selectedUser.skills.map((s, i) => (
                  <span key={i} className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '3px 8px' }}>{s}</span>
                )) : <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>No skills specified.</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
