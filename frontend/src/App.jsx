import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  Users, Megaphone, Search, Clapperboard, 
  LayoutDashboard, LogOut, User as UserIcon, Zap
} from 'lucide-react';

import Auth from './pages/Auth';
import CampaignBrowser from './pages/CampaignBrowser';
import CampaignDetail from './pages/CampaignDetail';
import CampaignDiscover from './pages/CampaignDiscover';
import CampaignPortal from './pages/CampaignPortal';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import IntroSplash from './components/IntroSplash';

const TopNavbar = ({ user, handleLogout }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="top-navbar" style={{ background: 'rgba(9, 15, 29, 0.9)', backdropFilter: 'blur(15px)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0 40px', height: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 1000 }}>
      <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div className="logo-icon" style={{ fontSize: '2rem', textShadow: '0 0 10px #0ca6a6' }}>⚡</div>
        <div className="logo-text" style={{ color: 'white', fontWeight: '900', fontSize: '1rem', lineHeight: '1', letterSpacing: '1px' }}>CAMPAIGN<br/><span style={{ color: '#4ade80' }}>CONNECT</span></div>
      </div>
      
      <ul className="nav-links" style={{ listStyle: 'none', display: 'flex', gap: '30px' }}>
        {user?.role === 'admin' && (
            <li><Link to="/admin-dashboard" style={{ textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', color: isActive('/admin-dashboard') ? '#4ade80' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}><LayoutDashboard size={18}/> Admin Hub</Link></li>
        )}

        {(user?.role === 'ngo' || user?.role === 'admin') && (
            <li><Link to="/campaign-portal" style={{ textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', color: isActive('/campaign-portal') ? '#4ade80' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}><Megaphone size={18}/> Command Center</Link></li>
        )}

        {(user?.role === 'volunteer' || user?.role === 'admin') && (
          <>
            <li><Link to="/campaigns" style={{ textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', color: location.pathname.includes('/campaigns') ? '#4ade80' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}><Search size={18}/> Browse</Link></li>
            <li><Link to="/feed" style={{ textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', color: isActive('/feed') ? '#4ade80' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}><Clapperboard size={18}/> Global Feed</Link></li>
          </>
        )}
      </ul>

      <div className="user-profile-nav" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
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
      
      fetch('http://localhost:5003/api/campaigns', { headers })
        .then(res => res.json())
        .then(data => { if (Array.isArray(data)) setActiveCamps(data); })
        .catch(err => console.error(err));

      fetch('http://localhost:5003/api/applications/manage', { headers })
        .then(res => res.json())
        .then(data => { if (Array.isArray(data)) setUserApplications(data); })
        .catch(err => console.error(err));

      if (user?.role === 'admin') {
          fetch('http://localhost:5003/api/admin/stats', { headers })
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
          <TopNavbar user={user} handleLogout={handleLogout} />
          <main className="main-content" style={{ padding: '40px' }}>
            <div className="content-container" style={{ maxWidth: '1300px', margin: '0 auto' }}>
              <Routes>
                  {user?.role === 'admin' && (
                      <>
                        <Route path="/admin-dashboard" element={<AdminDashboard user={user} stats={dashboardData} refreshData={fetchCampaigns} />} />
                        <Route path="/campaign-portal" element={<CampaignPortal user={user} refreshCamps={fetchCampaigns} />} />
                        <Route path="/campaigns" element={<CampaignBrowser campaigns={activeCamps} />} />
                        <Route path="/feed" element={<CampaignDiscover campaigns={activeCamps} user={user} />} />
                        <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
                        <Route path="*" element={<Navigate to="/admin-dashboard" />} />
                      </>
                  )}

                  {user?.role === 'ngo' && (
                      <>
                        <Route path="/campaign-portal" element={<CampaignPortal user={user} campaigns={activeCamps} refreshCamps={fetchCampaigns} />} />
                        <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
                        <Route path="*" element={<Navigate to="/campaign-portal" />} />
                      </>
                  )}

                  {user?.role === 'volunteer' && (
                      <>
                        <Route path="/campaigns" element={<CampaignBrowser campaigns={activeCamps} />} />
                        <Route path="/feed" element={<CampaignDiscover campaigns={activeCamps} user={user} />} />
                        <Route path="/campaigns/:id" element={<CampaignDetail user={user} setUser={setUser} campaigns={activeCamps} applications={userApplications} setApplications={setUserApplications} />} />
                        <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
                        <Route path="*" element={<Navigate to="/feed" />} />
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
