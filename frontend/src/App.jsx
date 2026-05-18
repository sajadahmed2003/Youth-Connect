import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
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
    if (location.pathname !== '/home') {
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
            await fetch(`https://youth-connect-backend-6dn5.onrender.com/api/applications/${app._id}`, {
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
    } catch(err) { console.error(err); }
  };

  return (
    <nav className="top-navbar" style={{ background: 'rgba(9, 15, 29, 0.9)', backdropFilter: 'blur(15px)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0 40px', height: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 1000 }}>
      {/* ... Left part remains same ... */}
      <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div className="logo-icon" style={{ fontSize: '2rem', textShadow: '0 0 10px #0ca6a6' }}>⚡</div>
        <div className="logo-text" style={{ color: 'white', fontWeight: '900', fontSize: '1rem', lineHeight: '1', letterSpacing: '1px' }}>YOUTH<br/><span style={{ color: '#4ade80' }}>CONNECT</span></div>
      </div>
      
      {/* ... Links remain same ... */}
      <ul className="nav-links" style={{ listStyle: 'none', display: 'flex', gap: '30px' }}>
        {user?.role === 'admin' && (
            <li><Link to="/admin-dashboard" style={{ textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', color: isActive('/admin-dashboard') ? '#4ade80' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}><LayoutDashboard size={18}/> Admin Hub</Link></li>
        )}
        {(user?.role === 'ngo' || user?.role === 'admin') && (
            <li><Link to="/campaign-portal" style={{ textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', color: isActive('/campaign-portal') ? '#4ade80' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}><Megaphone size={18}/> Dashboard</Link></li>
        )}
        {(user?.role === 'volunteer' || user?.role === 'admin' || user?.role === 'ngo') && (
          <>
            <li><button onClick={() => handleNavClick('home')} style={{ background: 'none', border: 'none', padding: 0, fontWeight: 'bold', fontSize: '0.9rem', color: isActive('/home', 'home') ? '#4ade80' : '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'inherit' }}>Home</button></li>
            <li><Link to="/feed" onClick={() => setActiveSection('')} style={{ textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', color: isActive('/feed') ? '#4ade80' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>Activity Feed</Link></li>
            <li><button onClick={() => handleNavClick('about')} style={{ background: 'none', border: 'none', padding: 0, fontWeight: 'bold', fontSize: '0.9rem', color: isActive(null, 'about') ? '#4ade80' : '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'inherit' }}>About Us</button></li>
            <li><button onClick={() => handleNavClick('contact')} style={{ background: 'none', border: 'none', padding: 0, fontWeight: 'bold', fontSize: '0.9rem', color: isActive(null, 'contact') ? '#4ade80' : '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'inherit' }}>Contact Us</button></li>
          </>
        )}
      </ul>

      <div className="user-profile-nav" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        
        {/* 🔔 NOTIFICATION BELL */}
        <div style={{ position: 'relative' }}>
            <button onClick={() => setShowNotifications(!showNotifications)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: unreadNotifications.length > 0 ? '#4ade80' : '#94a3b8' }}>
                <Bell size={22} className={unreadNotifications.length > 0 ? 'animate-pulse' : ''} />
                {unreadNotifications.length > 0 && <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: 'white', borderRadius: '50%', width: '15px', height: '15px', fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #090f1d' }}>{unreadNotifications.length}</span>}
            </button>

            {showNotifications && (
                <div style={{ position: 'absolute', top: '50px', right: '0', width: '320px', background: '#0f172a', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', padding: '20px', zIndex: 2000 }}>
                    <div className="responsive-flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'white' }}>Campaign Updates</h4>
                        <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: '#0ca6a6', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 'bold' }}>Mark all read</button>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
                        {unreadNotifications.length === 0 ? (
                            <p style={{ color: '#475569', fontSize: '0.8rem', textAlign: 'center', padding: '20px 0' }}>No new campaign updates.</p>
                        ) : (
                            unreadNotifications.map(app => (
                                <div key={app._id} style={{ display: 'flex', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: app.status === 'Accepted' ? '#dcfce71a' : '#fee2e21a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {app.status === 'Accepted' ? <CheckCircle size={18} color="#4ade80"/> : app.status === 'Rejected' ? <XCircle size={18} color="#ef4444"/> : <Trash2 size={18} color="#f87171"/>}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.8rem', color: 'white', fontWeight: 'bold' }}>{app.campaignId?.title}</div>
                                        <div style={{ fontSize: '0.7rem', color: app.status === 'Accepted' ? '#4ade80' : '#ef4444', fontWeight: '900' }}>{app.status.toUpperCase()}</div>
                                        <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '4px' }}>Manager has updated your status.</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>

        <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'white' }}>
            <img src={user?.avatar} alt={user?.name} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #0ca6a6', objectFit: 'cover' }} />
            <div style={{display:'flex', flexDirection:'column'}}>
                <span className="name" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{user?.name}</span>
                <span style={{fontSize:'0.65rem', color:'#4ade80', fontWeight:'900', textTransform:'uppercase'}}>{user?.role === 'ngo' ? 'MANAGER' : user?.role?.toUpperCase()}</span>
            </div>
        </Link>
        <button onClick={handleLogout} style={{background: 'none', border: 'none', cursor: 'pointer', marginLeft: '10px'}} title="Logout">
          <LogOut size={20} color="#94a3b8" />
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
      
      fetch('https://youth-connect-backend-6dn5.onrender.com/api/campaigns', { headers })
        .then(res => res.json())
        .then(data => { if (Array.isArray(data)) setActiveCamps(data); })
        .catch(err => console.error(err));

      fetch('https://youth-connect-backend-6dn5.onrender.com/api/applications/manage', { headers })
        .then(res => res.json())
        .then(data => { if (Array.isArray(data)) setUserApplications(data); })
        .catch(err => console.error(err));

      if (user?.role === 'admin') {
          fetch('https://youth-connect-backend-6dn5.onrender.com/api/admin/stats', { headers })
            .then(res => res.json())
            .then(data => setDashboardData(data))
            .catch(err => console.error(err));
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
    <div className="app-container" style={{ minHeight: '100vh', background: '#090f1d' }}>
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
                        <Route path="/campaign-portal" element={<ManagerDashboard user={user} refreshCamps={fetchCampaigns} />} />
                        <Route path="/feed" element={<CommunityFeed campaigns={activeCamps} user={user} />} />
                        <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
                        <Route path="*" element={<Navigate to="/admin-dashboard" />} />
                      </>
                  )}

                  {user?.role === 'ngo' && (
                      <>
                        <Route path="/home" element={<VolunteerHome user={user} />} />
                        <Route path="/campaign-portal" element={<ManagerDashboard user={user} campaigns={activeCamps} refreshCamps={fetchCampaigns} />} />
                        <Route path="/feed" element={<CommunityFeed user={user} />} />
                        <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
                        <Route path="*" element={<Navigate to="/campaign-portal" />} />
                      </>
                  )}

                  {user?.role === 'volunteer' && (
                      <>
                        <Route path="/home" element={<VolunteerHome user={user} />} />
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
