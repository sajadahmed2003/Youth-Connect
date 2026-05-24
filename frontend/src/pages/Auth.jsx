import React, { useState } from 'react';
import { Mail, Lock, User, Zap, ArrowRight, CheckCircle, X } from 'lucide-react';
import { API_BASE } from '../config';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('volunteer');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isLogin ? { email: formData.email, password: formData.password } : { ...formData, role })
      });

      const data = await res.json();

      if (res.ok) {
        if (isLogin) {
          onLogin(data.user, data.token);
        } else {
          setIsLogin(true);
          setShowSuccessModal(true);
        }
      } else {
        setError(data.error || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Server unreachable. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminBypass = () => {
    setFormData({ email: 'admin@connect.com', password: 'admin' });
    setTimeout(() => {
      const btn = document.getElementById('main-submit-btn');
      if (btn) btn.click();
    }, 100);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--bg-base)',
      fontFamily: 'var(--font-body)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background blobs */}
      <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 0 }} />

      {/* Left Panel — Branding */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
        position: 'relative',
        zIndex: 1,
        display: 'none',
      }} className="auth-left-panel">
      </div>

      {/* Right Panel — Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative',
        zIndex: 1,
        width: '100%',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '440px',
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              width: '56px', height: '56px',
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              borderRadius: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px auto',
              boxShadow: '0 8px 30px rgba(124,58,237,0.4)',
            }}>
              <Zap size={28} color="white" fill="white" />
            </div>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.8rem', fontWeight: '800',
              color: 'var(--text-primary)',
              margin: '0 0 8px 0',
              letterSpacing: '-0.5px',
            }}>Youth Connect</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {isLogin ? 'Welcome back! Sign in to continue.' : 'Create your account to get started.'}
            </p>
          </div>

          {/* Tab Switch */}
          <div style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '4px',
            marginBottom: '28px',
          }}>
            {['Login', 'Sign Up'].map((tab, i) => {
              const active = (i === 0) === isLogin;
              return (
                <button key={tab} onClick={() => setIsLogin(i === 0)} style={{
                  flex: 1, padding: '10px', border: 'none', cursor: 'pointer',
                  borderRadius: '11px', fontWeight: '700', fontSize: '0.88rem',
                  fontFamily: 'var(--font-body)',
                  background: active ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : 'transparent',
                  color: active ? 'white' : 'var(--text-muted)',
                  transition: 'all 0.2s',
                  boxShadow: active ? '0 4px 15px rgba(124,58,237,0.35)' : 'none',
                }}>{tab}</button>
              );
            })}
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.08)', color: '#f87171',
              padding: '12px 16px', borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem', marginBottom: '20px',
              border: '1px solid rgba(239,68,68,0.2)',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>⚠️ {error}</div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {!isLogin && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
                  <input type="text" className="cyber-input" style={{ paddingLeft: '42px' }}
                    placeholder="Your full name" value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })} required={!isLogin} />
                </div>
              </div>
            )}

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
                <input type="email" className="cyber-input" style={{ paddingLeft: '42px' }}
                  placeholder="you@example.com" value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })} required />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
                <input type="password" className="cyber-input" style={{ paddingLeft: '42px' }}
                  placeholder="••••••••" value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })} required />
              </div>
            </div>

            {!isLogin && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">I am a</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[['volunteer', '🙋 Volunteer'], ['ngo', '🏢 Manager']].map(([val, label]) => (
                    <div key={val} onClick={() => setRole(val)} style={{
                      padding: '14px', textAlign: 'center', borderRadius: 'var(--radius-md)',
                      background: role === val ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${role === val ? 'rgba(124,58,237,0.5)' : 'var(--border)'}`,
                      color: role === val ? '#a78bfa' : 'var(--text-muted)',
                      fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}>{label}</div>
                  ))}
                </div>
              </div>
            )}

            <button id="main-submit-btn" type="submit" disabled={loading} style={{
              width: '100%', padding: '14px',
              background: loading ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              border: 'none', borderRadius: 'var(--radius-md)',
              color: 'white', fontWeight: '800', fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-body)',
              boxShadow: '0 4px 20px rgba(124,58,237,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.2s',
              marginTop: '4px',
            }}>
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              {!loading && <ArrowRight size={18} />}
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <span onClick={() => setIsLogin(!isLogin)} style={{
                color: '#a78bfa', cursor: 'pointer', fontWeight: '700',
              }}>
                {isLogin ? 'Sign Up' : 'Login'}
              </span>
            </p>
          </form>
        </div>
      </div>

      {/* Registration Success Modal */}
      {showSuccessModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="cyber-card" style={{ background: 'var(--bg-surface)', padding: '50px', maxWidth: '450px', textAlign: 'center', position: 'relative', border: '2px solid #4ade80' }}>
            <button onClick={() => setShowSuccessModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24}/></button>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(74, 222, 128, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '2px solid #4ade80' }}>
              <CheckCircle size={40} color="#4ade80" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '16px' }}>Registration Successful!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '30px' }}>
              Your account has been created. Please log in with your new credentials to access the platform.
            </p>
            <button onClick={() => setShowSuccessModal(false)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #4ade80, #10b981)', color: '#000', fontWeight: '800' }}>Continue to Login</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Auth;
