import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { API_BASE } from './config';
import {
  Users, Megaphone, Search, Clapperboard,
  LayoutDashboard, LogOut, User as UserIcon, Zap, Bell, CheckCircle, XCircle, Trash2
} from 'lucide-react';

import Auth from './pages/Auth';
import VolunteerHome from './pages/VolunteerHome';
import CampaignDetail from './pages/CampaignDetail';
import CommunityFeed from './pages/CommunityFeed';
import ManagerDashboard from './pages/ManagerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import IntroSplash from './components/IntroSplash';
import Home from './pages/Home';
import InfoPage from './pages/InfoPage';
import { Toaster } from 'react-hot-toast';

const TopNavbar = ({ user, handleLogout, applications, setApplications }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState('home');
  const isActive = (path, sectionId = null) => {
    if (sectionId) return activeSection === sectionId;
    if (path === '/home') return (location.pathname === '/home' || location.pathname === '/') && activeSection === 'home';
    return location.pathname === path;
  };

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    if (location.pathname !== '/home' && location.pathname !== '/') {
      navigate('/home');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 150);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const top = element.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  };

  const unreadNotifications = applications.filter(a => !a.isRead && ['Accepted', 'Rejected', 'Removed'].includes(a.status));

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem('token');
      for (const app of unreadNotifications) {
        await fetch(`${API_BASE}/api/applications/${app._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ isRead: true })
        });
      }
      // Update local state
      setApplications(applications.map(a => unreadNotifications.find(oa => oa._id === a._id) ? { ...a, isRead: true } : a));
      setShowNotifications(false);
    } catch (err) { console.error(err); }
  };

  return (
    <nav className="top-navbar">
      {/* LOGO */}
      <div className="logo-container">
        <div className="logo-icon"><span style={{ transform: 'skewX(-10deg)', color: '#facc15', display: 'inline-block' }}>⚡</span></div>
        <div className="logo-text">YOUTH<br /><span>CONNECT</span></div>
      </div>

      {/* NAV LINKS */}
      <ul className="nav-links">
        {user?.role === 'admin' && (
          <li><Link to="/admin-dashboard" style={{ color: isActive('/admin-dashboard') ? '#a78bfa' : undefined }}><LayoutDashboard size={16} /> Admin Hub</Link></li>
        )}
        {(user?.role === 'ngo' || user?.role === 'admin') && (
          <li><Link to="/campaign-portal" style={{ color: isActive('/campaign-portal') ? '#a78bfa' : undefined }}><Megaphone size={16} /> Dashboard</Link></li>
        )}
        {(user?.role === 'volunteer' || user?.role === 'admin' || user?.role === 'ngo') && (
          <>
            {user?.role === 'volunteer' && (
              <li><Link to="/dashboard" style={{ color: isActive('/dashboard') ? '#a78bfa' : undefined }}><LayoutDashboard size={16} /> Personal Hub</Link></li>
            )}
            <li><button onClick={() => handleNavClick('home')} style={{ color: isActive('/home', 'home') ? '#a78bfa' : undefined }}>Home</button></li>
            <li><Link to="/feed" onClick={() => setActiveSection('')} style={{ color: isActive('/feed') ? '#a78bfa' : undefined }}>Activity Feed</Link></li>
            <li><button onClick={() => handleNavClick('about')} style={{ color: isActive(null, 'about') ? '#a78bfa' : undefined }}>About Us</button></li>
            <li><button onClick={() => handleNavClick('contact')} style={{ color: isActive(null, 'contact') ? '#a78bfa' : undefined }}>Contact Us</button></li>
          </>
        )}
      </ul>

      {/* RIGHT SECTION */}
      <div className="user-profile-nav">

        {/* 🔔 NOTIFICATION BELL */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowNotifications(!showNotifications)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', position: 'relative',
            color: unreadNotifications.length > 0 ? '#a78bfa' : 'var(--text-muted)',
            padding: '8px', borderRadius: '10px',
            transition: 'background 0.2s',
          }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(124,58,237,0.1)'}
            onMouseOut={e => e.currentTarget.style.background = 'none'}
          >
            <Bell size={20} />
            {unreadNotifications.length > 0 && (
              <span style={{
                position: 'absolute', top: '4px', right: '4px',
                background: '#ef4444', color: 'white', borderRadius: '50%',
                width: '16px', height: '16px', fontSize: '0.6rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid var(--bg-base)', fontWeight: '800',
              }}>{unreadNotifications.length}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-popup">
              <div className="responsive-flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '700' }}>Campaign Updates</h4>
                <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: '#a78bfa', fontSize: '0.72rem', cursor: 'pointer', fontWeight: '700', fontFamily: 'var(--font-body)' }}>Mark all read</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '380px', overflowY: 'auto' }}>
                {unreadNotifications.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textAlign: 'center', padding: '24px 0' }}>No new updates.</p>
                ) : (
                  unreadNotifications.map(app => (
                    <div key={app._id} style={{ display: 'flex', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: app.status === 'Accepted' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {app.status === 'Accepted' ? <CheckCircle size={17} color="#10b981" /> : app.status === 'Rejected' ? <XCircle size={17} color="#ef4444" /> : <Trash2 size={17} color="#f87171" />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.campaignId?.title}</div>
                        <div style={{ fontSize: '0.72rem', fontWeight: '800', marginTop: '2px', color: app.status === 'Accepted' ? '#10b981' : '#ef4444' }}>{app.status.toUpperCase()}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '3px' }}>Manager updated your status.</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* USER */}
        <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img src={user?.avatar} alt={user?.name} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid rgba(124,58,237,0.5)', objectFit: 'cover' }} />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <span className="name">{user?.name}</span>
            <span style={{ fontSize: '0.65rem', color: '#a78bfa', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{user?.role === 'ngo' ? 'Manager' : user?.role}</span>
          </div>
        </Link>

        <button onClick={handleLogout} title="Logout" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: '10px', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', color: 'var(--text-muted)', transition: 'all 0.2s' }}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; }}
          onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
};

function App() {
  const location = useLocation();
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [showSplash, setShowSplash] = useState(true);
  const [activeCamps, setActiveCamps] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [userApplications, setUserApplications] = useState([]);

  useEffect(() => {
    if (isAuthenticated) fetchCampaigns();
  }, [isAuthenticated, user?.role]);

  const fetchCampaigns = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = { 'Authorization': `Bearer ${token}` };

      fetch(`${API_BASE}/api/campaigns`, { headers })
        .then(res => res.json())
        .then(data => { if (Array.isArray(data)) setActiveCamps(data); })
        .catch(err => console.error(err));

      fetch(`${API_BASE}/api/applications/manage`, { headers })
        .then(res => res.json())
        .then(data => { if (Array.isArray(data)) setUserApplications(data); })
        .catch(err => console.error(err));

      if (user?.role === 'admin') {
        fetch(`${API_BASE}/api/admin/stats`, { headers })
          .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
          })
          .then(data => {
            if (data && !data.error) {
              setDashboardData(data);
            } else {
              console.error("API error in admin stats:", data?.error);
            }
          })
          .catch(err => console.error("Fetch admin stats error:", err));
      }
    }
  };

  const handleLogin = (loggedUser, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(loggedUser));
    setUser(loggedUser);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated && showSplash) {
    return <IntroSplash onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="app-container" style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {isAuthenticated ? (
        <>
          <Toaster position="top-right" reverseOrder={false} />
          <TopNavbar user={user} handleLogout={handleLogout} applications={userApplications} setApplications={setUserApplications} />
          <main className="main-content" style={{ padding: '0' }}>
            <div className="content-container" style={{ maxWidth: '1300px', margin: '0 auto' }}>
              <Routes>
                {user?.role === 'admin' && (
                  <>
                    <Route path="/home" element={<VolunteerHome user={user} />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard user={user} stats={dashboardData} refreshData={fetchCampaigns} />} />
                    <Route path="/campaign-portal" element={<ManagerDashboard user={user} setUser={setUser} refreshCamps={fetchCampaigns} />} />
                    <Route path="/feed" element={<CommunityFeed campaigns={activeCamps} user={user} />} />
                    <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
                    <Route path="*" element={<Navigate to="/admin-dashboard" />} />
                  </>
                )}

                {user?.role === 'ngo' && (
                  <>
                    <Route path="/home" element={<VolunteerHome user={user} applications={userApplications} setApplications={setUserApplications} />} />
                    <Route path="/campaign-portal" element={<ManagerDashboard user={user} setUser={setUser} campaigns={activeCamps} refreshCamps={fetchCampaigns} />} />
                    <Route path="/feed" element={<CommunityFeed user={user} />} />
                    <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
                    <Route path="*" element={<Navigate to="/campaign-portal" />} />
                  </>
                )}

                {user?.role === 'volunteer' && (
                  <>
                    <Route path="/home" element={<VolunteerHome user={user} applications={userApplications} setApplications={setUserApplications} />} />
                    <Route path="/dashboard" element={<Dashboard user={user} applications={userApplications} campaigns={activeCamps} />} />
                    <Route path="/feed" element={<CommunityFeed campaigns={activeCamps} user={user} />} />
                    <Route path="/campaigns/:id" element={<CampaignDetail user={user} setUser={setUser} campaigns={activeCamps} applications={userApplications} setApplications={setUserApplications} />} />
                    <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
                    <Route path="/info/:pageId" element={<InfoPage />} />
                    <Route path="*" element={<Navigate to="/home" />} />
                  </>
                )}
                {!user?.role && <Route path="*" element={<button onClick={handleLogout}>Reset Session</button>} />}
              </Routes>
            </div>
          </main>
        </>
      ) : (
        <Auth onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
