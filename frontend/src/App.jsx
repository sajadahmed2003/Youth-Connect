import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import OpportunitiesBrowser from './pages/OpportunitiesBrowser';
import OpportunityDetail from './pages/OpportunityDetail';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import NGOPortal from './pages/NGOPortal';
import { mockOpportunities as initialOpps } from './data/mockOpportunities';
import './index.css';

const TopNavbar = ({ user, handleLogout }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="top-navbar">
      <div className="logo-container">
        <div className="logo-icon">✈</div>
        <div className="logo-text">YOUTH<br/>CONNECT</div>
      </div>
      
      <ul className="nav-links">
        <li><Link to="/" className={isActive('/')}>Dashboard</Link></li>
        <li><Link to="/opportunities" className={location.pathname.includes('/opportunities') ? 'active' : ''}>Opportunities</Link></li>
        <li><Link to="/ngo-portal" className={isActive('/ngo-portal')} style={{ color: 'var(--primary)', fontWeight: 'bold' }}>NGO Portal</Link></li>
        <li><Link to="/profile" className={isActive('/profile')}>Profile</Link></li>
      </ul>

      <div className="user-profile-nav">
        <img src={user.avatar} alt={user.name} />
        <span className="name">{user.name}</span>
        <button onClick={handleLogout} style={{background: 'none', border: 'none', cursor: 'pointer', marginLeft: '15px'}} title="Logout">
          <LogOut size={20} color="var(--text-muted)" />
        </button>
      </div>
    </nav>
  );
};

// Wrapper allowing hooks down the active tree layer natively
const MainNavigation = ({ user, handleLogout }) => {
    return <TopNavbar user={user} handleLogout={handleLogout} />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('token') ? true : false;
  });
  const [activeOpps, setActiveOpps] = useState(initialOpps);
  const [applications, setApplications] = useState([]);
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

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

  return (
    <Router>
      {!isAuthenticated ? (
        <Routes>
          <Route path="*" element={<Auth onLogin={handleLogin} />} />
        </Routes>
      ) : (
        <div className="app-container">
          <MainNavigation user={user} handleLogout={handleLogout} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard user={user} applications={applications} opportunities={activeOpps} />} />
              <Route path="/opportunities" element={<OpportunitiesBrowser opportunities={activeOpps} />} />
              <Route path="/opportunities/:id" element={<OpportunityDetail user={user} setUser={setUser} opportunities={activeOpps} applications={applications} setApplications={setApplications} />} />
              <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
              <Route path="/ngo-portal" element={<NGOPortal opportunities={activeOpps} setOpportunities={setActiveOpps} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      )}
    </Router>
  );
}

export default App;
