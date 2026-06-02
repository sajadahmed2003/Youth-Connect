import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { API_BASE } from './config';
import {
  Users, Megaphone, Search, Clapperboard,
  LayoutDashboard, LogOut, User as UserIcon, Zap, Bell, CheckCircle, XCircle, Trash2, Heart, MessageSquare, UserCheck, Menu, X,
  Home as HomeIcon, Info, Mail
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
import toast, { Toaster } from 'react-hot-toast';

const TopNavbar = ({ 
  user, 
  handleLogout, 
  applications, 
  setApplications,
  socialNotifications,
  setSocialNotifications,
  unreadSocialCount,
  setUnreadSocialCount,
  fetchSocialNotifications
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState('home');
  const [notifTab, setNotifTab] = React.useState('campaign'); // 'campaign', 'social'

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

  const unreadCampaigns = applications.filter(a => {
    if (!a || a.isRead) return false;
    
    // If user is volunteer, show only their accepted/rejected/completed/removed ones
    if (user && (user.role === 'volunteer' || user.role === 'user')) {
      const isMyApplication = (typeof a.userId === 'object' ? a.userId?._id === user._id : a.userId === user._id);
      return isMyApplication && ['Accepted', 'Rejected', 'Removed', 'Completed'].includes(a.status);
    }
    
    // If user is NGO/Manager, show pending applications to their campaigns
    if (user && user.role === 'ngo') {
      const isMyCampaign = a.campaignId && (a.campaignId.creatorId === user._id || a.campaignId.creatorName === user.name);
      return isMyCampaign && a.status === 'Pending';
    }
    
    // If user is Super Admin, show all pending applications
    if (user && user.role === 'admin') {
      return a.status === 'Pending';
    }
    
    return false;
  });
  const totalUnreadCount = unreadCampaigns.length + unreadSocialCount;

  const markAllCampaignRead = async () => {
    try {
      const token = localStorage.getItem('token');
      for (const app of unreadCampaigns) {
        await fetch(`${API_BASE}/api/applications/${app._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ isRead: true })
        });
      }
      setApplications(applications.map(a => unreadCampaigns.find(oa => oa._id === a._id) ? { ...a, isRead: true } : a));
    } catch (err) { console.error(err); }
  };

  const handleMarkSocialRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSocialNotifications(socialNotifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        setUnreadSocialCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) { console.error(err); }
  };

  const handleClearAllSocial = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/notifications/read-all`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSocialNotifications(socialNotifications.map(n => ({ ...n, isRead: true })));
        setUnreadSocialCount(0);
        toast.success("Marked all social notifications as read");
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteSocial = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/notifications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSocialNotifications(socialNotifications.filter(n => n._id !== id));
        toast.success("Notification dismissed");
        if (fetchSocialNotifications) fetchSocialNotifications();
      }
    } catch (err) { console.error(err); }
  };

  return (
    <nav className="top-navbar">
      {/* LOGO */}
      <div className="logo-container">
        <div className="logo-icon"><span style={{ transform: 'skewX(-10deg)', color: '#facc15', display: 'inline-block' }}>⚡</span></div>
        <div className="logo-text">YOUTH<br /><span>CONNECT</span></div>
      </div>

      {/* Mobile Hamburger Button */}
      <button 
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        className="mobile-menu-btn"
      >
        {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* NAV LINKS (DESKTOP) */}
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

      {/* MOBILE NAV DROPDOWN */}
      {showMobileMenu && (
        <div className="mobile-nav-dropdown" style={{
          position: 'absolute',
          top: '72px',
          left: '0',
          right: '0',
          background: 'rgba(10, 10, 15, 0.96)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          zIndex: 999
        }}>
          {user?.role === 'admin' && (
            <Link to="/admin-dashboard" onClick={() => setShowMobileMenu(false)} style={{ color: isActive('/admin-dashboard') ? '#a78bfa' : 'white', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '10px', background: isActive('/admin-dashboard') ? 'rgba(167,139,250,0.1)' : 'transparent', fontWeight: 'bold' }}><LayoutDashboard size={18} /> Admin Hub</Link>
          )}
          {(user?.role === 'ngo' || user?.role === 'admin') && (
            <Link to="/campaign-portal" onClick={() => setShowMobileMenu(false)} style={{ color: isActive('/campaign-portal') ? '#a78bfa' : 'white', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '10px', background: isActive('/campaign-portal') ? 'rgba(167,139,250,0.1)' : 'transparent', fontWeight: 'bold' }}><Megaphone size={18} /> Dashboard</Link>
          )}
          {(user?.role === 'volunteer' || user?.role === 'admin' || user?.role === 'ngo') && (
            <>
              {user?.role === 'volunteer' && (
                <Link to="/dashboard" onClick={() => setShowMobileMenu(false)} style={{ color: isActive('/dashboard') ? '#a78bfa' : 'white', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '10px', background: isActive('/dashboard') ? 'rgba(167,139,250,0.1)' : 'transparent', fontWeight: 'bold' }}><LayoutDashboard size={18} /> Personal Hub</Link>
              )}
              <button onClick={() => { handleNavClick('home'); setShowMobileMenu(false); }} style={{ color: isActive('/home', 'home') ? '#a78bfa' : 'white', background: 'none', border: 'none', textAlign: 'left', fontSize: '0.9rem', padding: '10px 14px', cursor: 'pointer', borderRadius: '10px', background: isActive('/home', 'home') ? 'rgba(167,139,250,0.1)' : 'transparent', display: 'flex', alignItems: 'center', gap: '8px', width: '100%', fontFamily: 'inherit', fontWeight: 'bold' }}><HomeIcon size={18} /> Home</button>
              <Link to="/feed" onClick={() => { setActiveSection(''); setShowMobileMenu(false); }} style={{ color: isActive('/feed') ? '#a78bfa' : 'white', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '10px', background: isActive('/feed') ? 'rgba(167,139,250,0.1)' : 'transparent', fontWeight: 'bold' }}><Megaphone size={18} /> Activity Feed</Link>
              <button onClick={() => { handleNavClick('about'); setShowMobileMenu(false); }} style={{ color: isActive(null, 'about') ? '#a78bfa' : 'white', background: 'none', border: 'none', textAlign: 'left', fontSize: '0.9rem', padding: '10px 14px', cursor: 'pointer', borderRadius: '10px', background: isActive(null, 'about') ? 'rgba(167,139,250,0.1)' : 'transparent', display: 'flex', alignItems: 'center', gap: '8px', width: '100%', fontFamily: 'inherit', fontWeight: 'bold' }}><Info size={18} /> About Us</button>
              <button onClick={() => { handleNavClick('contact'); setShowMobileMenu(false); }} style={{ color: isActive(null, 'contact') ? '#a78bfa' : 'white', background: 'none', border: 'none', textAlign: 'left', fontSize: '0.9rem', padding: '10px 14px', cursor: 'pointer', borderRadius: '10px', background: isActive(null, 'contact') ? 'rgba(167,139,250,0.1)' : 'transparent', display: 'flex', alignItems: 'center', gap: '8px', width: '100%', fontFamily: 'inherit', fontWeight: 'bold' }}><Mail size={18} /> Contact Us</button>
            </>
          )}
        </div>
      )}

      {/* RIGHT SECTION */}
      <div className="user-profile-nav">

        {/* 🔔 NOTIFICATION BELL */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowNotifications(!showNotifications)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', position: 'relative',
            color: totalUnreadCount > 0 ? '#a78bfa' : 'var(--text-muted)',
            padding: '8px', borderRadius: '10px',
            transition: 'background 0.2s',
          }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(124,58,237,0.1)'}
            onMouseOut={e => e.currentTarget.style.background = 'none'}
          >
            <Bell size={20} />
            {totalUnreadCount > 0 && (
              <span style={{
                position: 'absolute', 
                top: '2px', 
                right: '2px',
                background: '#ef4444', 
                color: 'white', 
                borderRadius: '99px',
                minWidth: '18px', 
                height: '18px', 
                padding: '0 4px',
                fontSize: '0.72rem',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1.5px solid var(--bg-surface)', 
                fontWeight: '900',
                lineHeight: 1,
                boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)',
                transform: 'translate(25%, -25%)',
                fontFamily: 'var(--font-heading)'
              }}>{totalUnreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-popup" style={{ width: '340px', padding: '16px' }}>
              
              {/* Dual Tab Headers */}
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '12px' }}>
                <button 
                  onClick={() => setNotifTab('campaign')}
                  style={{ flex: 1, padding: '8px', border: 'none', background: 'none', borderBottom: notifTab === 'campaign' ? '2px solid var(--primary-light)' : 'none', color: notifTab === 'campaign' ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: '800', fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  Campaigns ({unreadCampaigns.length})
                </button>
                <button 
                  onClick={() => setNotifTab('social')}
                  style={{ flex: 1, padding: '8px', border: 'none', background: 'none', borderBottom: notifTab === 'social' ? '2px solid var(--primary-light)' : 'none', color: notifTab === 'social' ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: '800', fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  Social Requests ({unreadSocialCount})
                </button>
              </div>

              {/* Campaign Notifications Stream */}
              {notifTab === 'campaign' && (
                <>
                  <div className="responsive-flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: '700' }}>Campaign updates</h4>
                    <button onClick={markAllCampaignRead} style={{ background: 'none', border: 'none', color: '#a78bfa', fontSize: '0.7rem', cursor: 'pointer', fontWeight: '700', fontFamily: 'var(--font-body)' }}>Mark all read</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto' }}>
                    {unreadCampaigns.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '24px 0' }}>No campaign updates.</p>
                    ) : (
                      unreadCampaigns.map(app => (
                        <div key={app._id} style={{ display: 'flex', gap: '10px', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                          <div style={{ 
                            width: '30px', 
                            height: '30px', 
                            borderRadius: '8px', 
                            background: app.status === 'Accepted' ? 'rgba(16,185,129,0.1)' : app.status === 'Pending' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.08)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            flexShrink: 0 
                          }}>
                            {app.status === 'Accepted' ? (
                              <CheckCircle size={15} color="#10b981" />
                            ) : app.status === 'Pending' ? (
                              <Bell size={15} color="#f59e0b" />
                            ) : (
                              <XCircle size={15} color="#ef4444" />
                            )}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.campaignId?.title}</div>
                            <div style={{ 
                              fontSize: '0.7rem', 
                              fontWeight: '800', 
                              marginTop: '2px', 
                              color: app.status === 'Accepted' ? '#10b981' : app.status === 'Pending' ? '#f59e0b' : '#ef4444' 
                            }}>
                              {app.status === 'Pending' ? `NEW REQUEST FROM: ${app.userId?.name || 'VOLUNTEER'}` : app.status.toUpperCase()}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}

              {/* Social Grid Notifications Stream */}
              {notifTab === 'social' && (
                <>
                  <div className="responsive-flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: '700' }}>Social Interactions</h4>
                    <button onClick={handleClearAllSocial} style={{ background: 'none', border: 'none', color: '#a78bfa', fontSize: '0.7rem', cursor: 'pointer', fontWeight: '700', fontFamily: 'var(--font-body)' }}>Mark all read</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto' }}>
                    {socialNotifications.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '24px 0' }}>No social updates.</p>
                    ) : (
                      socialNotifications.map(notif => (
                        <div 
                          key={notif._id} 
                          onClick={() => handleMarkSocialRead(notif._id)}
                          style={{ display: 'flex', gap: '10px', padding: '10px', background: notif.isRead ? 'rgba(255,255,255,0.015)' : 'rgba(124,58,237,0.06)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer', transition: '0.2s', position: 'relative' }}
                        >
                          <img 
                            src={notif.senderAvatar || 'https://i.pravatar.cc/150?img=47'} 
                            alt="avatar" 
                            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} 
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {notif.senderName}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: '1.2' }}>
                              {notif.message}
                            </div>
                            <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                              {new Date(notif.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteSocial(notif._id); }}
                            style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', alignSelf: 'center', opacity: 0.6 }}
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}

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

  // Social Grid Notification States
  const [socialNotifications, setSocialNotifications] = useState([]);
  const [unreadSocialCount, setUnreadSocialCount] = useState(0);
  const lastNotifIdRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) fetchCampaigns();
  }, [isAuthenticated, user?.role]);

  // Real-Time Social Notifications Polling Engine (6-second intervals)
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkSocialNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch(`${API_BASE}/api/notifications/unread-count`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUnreadSocialCount(data.count);

          if (data.latest && data.latest._id !== lastNotifIdRef.current) {
            lastNotifIdRef.current = data.latest._id;

            // Trigger beautiful real-time cyber-toast popup notification
            toast.custom((t) => (
              <div 
                className="social-toast"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: '#0d0d15',
                  border: '1px solid var(--primary)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  boxShadow: '0 8px 32px rgba(124, 58, 237, 0.4)',
                  color: 'white',
                  fontFamily: 'var(--font-body)',
                  maxWidth: '350px',
                  backdropFilter: 'blur(10px)',
                  transition: '0.3s'
                }}
              >
                <img 
                  src={data.latest.senderAvatar || 'https://i.pravatar.cc/150?img=47'} 
                  alt="Sender"
                  style={{ width: '38px', height: '38px', borderRadius: '50%', border: '2px solid var(--primary)', objectFit: 'cover', flexShrink: 0 }} 
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '800', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{data.latest.senderName}</div>
                  <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '2px', lineHeight: '1.3' }}>{data.latest.message}</div>
                </div>
                <button onClick={() => toast.dismiss(t.id)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', marginLeft: '6px' }}>✕</button>
              </div>
            ), { duration: 5000 });

            // Refresh full notifications list
            fetchSocialNotifications();
          }
        }
      } catch (err) {
        console.error("Failed to check social notifications:", err);
      }
    };

    checkSocialNotifications();
    fetchSocialNotifications();

    const interval = setInterval(checkSocialNotifications, 6000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const fetchSocialNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch(`${API_BASE}/api/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSocialNotifications(data);
      }
    } catch (err) { console.error("Failed to load notifications list:", err); }
  };

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
          <TopNavbar 
            user={user} 
            handleLogout={handleLogout} 
            applications={userApplications} 
            setApplications={setUserApplications}
            socialNotifications={socialNotifications}
            setSocialNotifications={setSocialNotifications}
            unreadSocialCount={unreadSocialCount}
            setUnreadSocialCount={setUnreadSocialCount}
            fetchSocialNotifications={fetchSocialNotifications}
          />
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
        <Auth onLogin={handleLogin} onClose={() => setShowSplash(true)} />
      )}
    </div>
  );
}

export default App;
