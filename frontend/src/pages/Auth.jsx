import React, { useState } from 'react';
import { Mail, Lock, User, Zap, ArrowRight, CheckCircle, X, Shield, Key } from 'lucide-react';
import { API_BASE } from '../config';

const Auth = ({ onLogin, onClose }) => {
  const [mode, setMode] = useState('login'); // 'login', 'signup', 'otp-verify', 'forgot-password', 'reset-password'
  const [isLogin, setIsLogin] = useState(true); // For backward sync with tabs
  const [role, setRole] = useState('volunteer');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpEmail, setOtpEmail] = useState(''); // Email undergoing OTP validation
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Synchronize the sliding tabs clicks with the mode state
  const handleTabChange = (loginSelected) => {
    setIsLogin(loginSelected);
    setError('');
    setSuccessMsg('');
    if (loginSelected) {
      setMode('login');
    } else {
      setMode('signup');
    }
  };

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setError('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (mode === 'login') {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });

        const data = await res.json();

        if (res.ok) {
          onLogin(data.user, data.token);
        } else {
          if (data.unverified) {
            setOtpEmail(formData.email);
            setMode('otp-verify');
          } else {
            setError(data.error || 'Invalid credentials. Please try again.');
          }
        }
      } 
      
      else if (mode === 'signup') {
        const res = await fetch(`${API_BASE}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password, role })
        });

        const data = await res.json();

        if (res.ok) {
          if (data.otpSent) {
            setOtpEmail(formData.email);
            setMode('otp-verify');
          } else {
            setMode('login');
            setIsLogin(true);
            setShowSuccessModal(true);
          }
        } else {
          setError(data.error || 'Registration failed. Please try again.');
        }
      }

      else if (mode === 'otp-verify') {
        const res = await fetch(`${API_BASE}/api/auth/verify-signup-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: otpEmail, otp: otpCode })
        });

        const data = await res.json();

        if (res.ok) {
          onLogin(data.user, data.token);
        } else {
          setError(data.error || 'Invalid or expired OTP code.');
        }
      }

      else if (mode === 'forgot-password') {
        const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: otpEmail })
        });

        const data = await res.json();

        if (res.ok) {
          setSuccessMsg('A password reset OTP has been sent.');
          setMode('reset-password');
        } else {
          setError(data.error || 'Failed to send reset code.');
        }
      }

      else if (mode === 'reset-password') {
        const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: otpEmail, otp: otpCode, newPassword })
        });

        const data = await res.json();

        if (res.ok) {
          setMode('login');
          setIsLogin(true);
          setShowSuccessModal(true);
        } else {
          setError(data.error || 'Failed to reset password.');
        }
      }
    } catch (err) {
      setError('Server unreachable. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: formData.name || 'User', 
          email: otpEmail, 
          password: formData.password || 'tempPass123', 
          role 
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('A new verification code has been generated and sent.');
      } else {
        setError(data.error || 'Failed to resend verification code.');
      }
    } catch (err) {
      setError('Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  // Setup input focus effects dynamically
  const inputStyle = {
    width: '100%',
    background: '#eef4ff',
    border: '1px solid rgba(15, 23, 42, 0.05)',
    color: '#0f172a',
    padding: '14px 18px 14px 44px',
    borderRadius: '14px',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.92rem',
    transition: 'all 0.25s',
  };

  const labelStyle = {
    textTransform: 'uppercase',
    fontSize: '0.72rem',
    fontWeight: '800',
    color: '#475569',
    letterSpacing: '0.8px',
    marginBottom: '8px',
    display: 'block'
  };

  const inputFocus = (e) => {
    e.target.style.background = '#ffffff';
    e.target.style.borderColor = '#7c3aed';
    e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
  };

  const inputBlur = (e) => {
    e.target.style.background = '#eef4ff';
    e.target.style.borderColor = 'rgba(15, 23, 42, 0.05)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#121318', // Sophisticated dark background
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden',
      padding: '20px',
    }}>
      {/* Background blobs */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0 }} />

      {/* Main card wrapper */}
      <div style={{
        width: '100%',
        maxWidth: '460px',
        background: '#ffffff', // Crisp premium white background
        borderRadius: '24px',
        padding: '44px 40px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}>
        
        {/* Close Button overlapping corner */}
        <button 
          onClick={onClose || (() => window.location.reload())}
          style={{
            position: 'absolute',
            top: '-16px',
            right: '-16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#1e293b', // Slate-800 background
            border: '2px solid #ffffff',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.2s',
            zIndex: 10,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1.0)'; }}
        >
          <X size={18} />
        </button>

        {/* Logo and Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
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
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '1.85rem', fontWeight: '800',
            color: '#0f172a',
            margin: '0 0 8px 0',
            letterSpacing: '-0.5px',
          }}>Youth Connect</h1>

          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            {mode === 'login' && 'Welcome back! Sign in to continue.'}
            {mode === 'signup' && 'Create your account to get started.'}
            {mode === 'otp-verify' && 'Enter the verification code sent to your email.'}
            {mode === 'forgot-password' && 'Enter your email to reset your credentials.'}
            {mode === 'reset-password' && 'Enter the OTP and define your new password.'}
          </p>
        </div>

        {/* Sliding Tab Switch (Only visible for Login and Signup modes) */}
        {(mode === 'login' || mode === 'signup') && (
          <div style={{
            display: 'flex',
            background: '#f8fafc',
            border: '1px solid rgba(15, 23, 42, 0.06)',
            borderRadius: '30px',
            padding: '4px',
            marginBottom: '28px',
          }}>
            {['Login', 'Sign Up'].map((tab, i) => {
              const active = (i === 0) === isLogin;
              return (
                <button 
                  key={tab} 
                  type="button"
                  onClick={() => handleTabChange(i === 0)} 
                  style={{
                    flex: 1, padding: '11px', border: 'none', cursor: 'pointer',
                    borderRadius: '26px', fontWeight: '700', fontSize: '0.88rem',
                    fontFamily: "'Inter', sans-serif",
                    background: active ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : 'transparent',
                    color: active ? 'white' : '#64748b',
                    transition: 'all 0.2s',
                    boxShadow: active ? '0 4px 15px rgba(124,58,237,0.35)' : 'none',
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        )}

        {/* Dynamic Alerts */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.08)', color: '#f87171',
            padding: '12px 16px', borderRadius: '12px',
            fontSize: '0.85rem', marginBottom: '20px',
            border: '1px solid rgba(239,68,68,0.2)',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            ⚠️ {error}
          </div>
        )}

        {successMsg && (
          <div style={{
            background: 'rgba(16,185,129,0.08)', color: '#10b981',
            padding: '12px 16px', borderRadius: '12px',
            fontSize: '0.85rem', marginBottom: '20px',
            border: '1px solid rgba(16,185,129,0.2)',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            ✅ {successMsg}
          </div>
        )}

        {/* Dynamic Forms based on Mode state */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Sign Up: Name field */}
          {mode === 'signup' && (
            <div className="form-group">
              <label style={labelStyle}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={18} />
                <input 
                  type="text" 
                  style={inputStyle}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                  placeholder="Your full name" 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })} 
                  required={mode === 'signup'} 
                />
              </div>
            </div>
          )}

          {/* Login or Signup: Email field */}
          {(mode === 'login' || mode === 'signup') && (
            <div className="form-group">
              <label style={labelStyle}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={18} />
                <input 
                  type="email" 
                  style={inputStyle}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                  placeholder="you@example.com" 
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })} 
                  required 
                />
              </div>
            </div>
          )}

          {/* Forgot Password: Email field */}
          {mode === 'forgot-password' && (
            <div className="form-group">
              <label style={labelStyle}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={18} />
                <input 
                  type="email" 
                  style={inputStyle}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                  placeholder="you@example.com" 
                  value={otpEmail}
                  onChange={e => setOtpEmail(e.target.value)} 
                  required 
                />
              </div>
            </div>
          )}

          {/* Login or Signup: Password field */}
          {(mode === 'login' || mode === 'signup') && (
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                {mode === 'login' && (
                  <span 
                    onClick={() => {
                      setOtpEmail(formData.email);
                      handleModeSwitch('forgot-password');
                    }} 
                    style={{ fontSize: '0.78rem', color: '#7c3aed', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Forgot Password?
                  </span>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={18} />
                <input 
                  type="password" 
                  style={inputStyle}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })} 
                  required 
                />
              </div>
            </div>
          )}

          {/* OTP Verify or Reset Password: Code field */}
          {(mode === 'otp-verify' || mode === 'reset-password') && (
            <div className="form-group">
              <label style={labelStyle}>Verification Code (OTP)</label>
              <div style={{ position: 'relative' }}>
                <Shield style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={18} />
                <input 
                  type="text" 
                  style={{ ...inputStyle, textAlign: 'center', letterSpacing: '6px', fontSize: '1.25rem', paddingLeft: '18px' }}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                  maxLength={6}
                  placeholder="000000" 
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value)} 
                  required 
                />
              </div>
              <p style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '10px', textAlign: 'center', lineHeight: '1.4' }}>
                For local development, the code has been logged to your backend console server terminal.
              </p>
            </div>
          )}

          {/* Reset Password: New Password field */}
          {mode === 'reset-password' && (
            <div className="form-group">
              <label style={labelStyle}>New Password</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={18} />
                <input 
                  type="password" 
                  style={inputStyle}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                  placeholder="••••••••" 
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)} 
                  required 
                />
              </div>
            </div>
          )}

          {/* Sign Up: Sector Role clearance selector */}
          {mode === 'signup' && (
            <div className="form-group">
              <label style={labelStyle}>Clearance Sector</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[['volunteer', '🙋 Volunteer'], ['ngo', '🏢 Manager']].map(([val, label]) => {
                  const active = role === val;
                  return (
                    <div 
                      key={val} 
                      onClick={() => setRole(val)} 
                      style={{
                        padding: '14px', textAlign: 'center', borderRadius: '12px',
                        background: active ? 'rgba(124,58,237,0.06)' : 'rgba(15,23,42,0.02)',
                        border: `2px solid ${active ? '#7c3aed' : 'rgba(15, 23, 42, 0.06)'}`,
                        color: active ? '#7c3aed' : '#64748b',
                        fontSize: '0.85rem', fontWeight: '800', cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {label}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading} 
            style={{
              width: '100%', padding: '14px',
              background: loading ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              border: 'none', borderRadius: '30px',
              color: 'white', fontWeight: '800', fontSize: '0.96rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'Inter', sans-serif",
              boxShadow: '0 8px 24px rgba(124, 58, 237, 0.4)',
              display: 'flex', alignItems: 'center', justifyCenter: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.2s',
              marginTop: '8px',
            }}
          >
            {loading ? 'Please wait...' : (
              mode === 'login' ? 'Sign In' :
              mode === 'signup' ? 'Create Account' :
              mode === 'otp-verify' ? 'Verify OTP Code' :
              mode === 'forgot-password' ? 'Send OTP Code' : 'Update Password'
            )}
            {!loading && <ArrowRight size={18} />}
          </button>

          {/* Bottom helper actions */}
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            
            {/* Login bottom action */}
            {mode === 'login' && (
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Don't have an account?{' '}
                <span onClick={() => handleTabChange(false)} style={{ color: '#7c3aed', cursor: 'pointer', fontWeight: '700' }}>
                  Sign Up
                </span>
              </p>
            )}

            {/* Signup bottom action */}
            {mode === 'signup' && (
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Already have an account?{' '}
                <span onClick={() => handleTabChange(true)} style={{ color: '#7c3aed', cursor: 'pointer', fontWeight: '700' }}>
                  Login
                </span>
              </p>
            )}

            {/* OTP Verification bottom action */}
            {mode === 'otp-verify' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span onClick={handleResendOtp} style={{ fontSize: '0.82rem', color: '#7c3aed', fontWeight: '700', cursor: 'pointer' }}>
                  Resend Verification Code
                </span>
                <span onClick={() => handleModeSwitch('login')} style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '700', cursor: 'pointer' }}>
                  Back to Sign In
                </span>
              </div>
            )}

            {/* Forgot or Reset password bottom action */}
            {(mode === 'forgot-password' || mode === 'reset-password') && (
              <span onClick={() => handleModeSwitch('login')} style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '700', cursor: 'pointer' }}>
                Back to Sign In
              </span>
            )}

          </div>

        </form>
      </div>

      {/* Registration / Action Success Modal */}
      {showSuccessModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '44px 40px', maxWidth: '440px', width: '100%', textAlign: 'center', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: '1px solid rgba(15,23,42,0.06)' }}>
            <button onClick={() => setShowSuccessModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={24}/></button>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '2px solid #10b981' }}>
              <CheckCircle size={40} color="#10b981" />
            </div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.8rem', color: '#0f172a', fontWeight: '800', marginBottom: '16px' }}>Operation Successful!</h2>
            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.6', marginBottom: '30px' }}>
              Your account or action has been verified successfully. Please log in with your credentials to continue.
            </p>
            <button onClick={() => setShowSuccessModal(false)} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: '30px', color: 'white', fontWeight: '800', cursor: 'pointer', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)' }}>Continue to Login</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Auth;
