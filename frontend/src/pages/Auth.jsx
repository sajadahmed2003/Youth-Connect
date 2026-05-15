import React, { useState } from 'react';
import { Mail, Lock, User, ShieldCheck, Zap, ArrowRight, ArrowLeft, ShieldAlert } from 'lucide-react';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('volunteer');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const res = await fetch(`https://youth-connect-backend-6dn5.onrender.com${endpoint}`, {
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
          alert('Registration successful! Please log in with your new credentials.');
        }
      } else {
        setError(data.error || 'System rejection: Check credentials.');
      }
    } catch (err) {
      setError('Neural connection timeout: Server unreachable.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminBypass = () => {
    setFormData({ email: 'admin@connect.com', password: 'admin' });
    // Trigger login with a small delay
    setTimeout(() => {
      const btn = document.getElementById('main-submit-btn');
      if (btn) btn.click();
    }, 100);
  };

  return (
    <div className="auth-portal-cyber" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: '#090f1d'
    }}>
      <div className="cyber-card" style={{ width: '100%', maxWidth: '450px', padding: '50px', border: '1px solid rgba(12, 166, 166, 0.2)', boxShadow: '0 0 50px rgba(0,0,0,0.8)' }}>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(12, 166, 166, 0.1)', border: '1px solid #0ca6a6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', boxShadow: '0 0 20px rgba(12, 166, 166, 0.4)' }}>
            <Zap size={35} color="#0ca6a6" fill="#0ca6a6" className="animate-float" />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '2px', color: 'white', margin: 0 }}>YOUTH CONNECT</h1>
        </div>



        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '25px', border: '1px solid rgba(239, 68, 68, 0.2)', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '8px', letterSpacing: '1px' }}>NAME IDENTITY</div>
              <div style={{ position: 'relative' }}>
                <User style={{ position: 'absolute', left: '15px', top: '15px', color: '#0ca6a6' }} size={18} />
                <input type="text" className="cyber-input" style={{ width: '100%', paddingLeft: '45px' }} placeholder="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required={!isLogin} />
              </div>
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '8px', letterSpacing: '1px' }}>ENTER USERNAME OR EMAIL</div>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '15px', top: '15px', color: '#0ca6a6' }} size={18} />
              <input type="email" className="cyber-input" style={{ width: '100%', paddingLeft: '45px' }} placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '8px', letterSpacing: '1px' }}>PASSWORD</div>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '15px', top: '15px', color: '#0ca6a6' }} size={18} />
              <input type="password" className="cyber-input" style={{ width: '100%', paddingLeft: '45px' }} placeholder="Password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
            </div>
          </div>

          {!isLogin && (
            <div style={{ marginBottom: '35px' }}>
              <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '15px', letterSpacing: '1px' }}>SECTOR CLEARANCE</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div onClick={() => setRole('volunteer')} style={{ padding: '12px', textAlign: 'center', borderRadius: '10px', background: role === 'volunteer' ? 'rgba(12, 166, 166, 0.1)' : 'rgba(255,255,255,0.02)', border: `1px solid ${role === 'volunteer' ? '#0ca6a6' : 'rgba(255,255,255,0.05)'}`, color: role === 'volunteer' ? '#4ade80' : '#4b5563', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}>VOLUNTEER</div>
                <div onClick={() => setRole('ngo')} style={{ padding: '12px', textAlign: 'center', borderRadius: '10px', background: role === 'ngo' ? 'rgba(12, 166, 166, 0.1)' : 'rgba(255,255,255,0.02)', border: `1px solid ${role === 'ngo' ? '#0ca6a6' : 'rgba(255,255,255,0.05)'}`, color: role === 'ngo' ? '#4ade80' : '#4b5563', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}>MANAGER</div>
              </div>
            </div>
          )}

          <button id="main-submit-btn" type="submit" className="cyber-card" style={{ width: '100%', padding: '18px', background: 'linear-gradient(90deg, #0ca6a6 0%, #115e5e 100%)', border: 'none', color: 'white', fontWeight: '900', letterSpacing: '2px', cursor: 'pointer', boxShadow: '0 0 20px rgba(12, 166, 166, 0.3)', marginBottom: '25px', opacity: loading ? 0.6 : 1 }} disabled={loading}>
            {loading ? 'Processing...' : isLogin ? 'LOGIN' : 'SIGN UP'}
          </button>

          <div style={{ textAlign: 'center', fontSize: '0.85rem' }}>
            <span style={{ color: '#64748b' }}>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
            <span onClick={() => setIsLogin(!isLogin)} style={{ color: '#0ca6a6', cursor: 'pointer', fontWeight: 'bold', marginLeft: '10px', textDecoration: 'underline' }}>
              {isLogin ? 'Sign Up' : 'Login'}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
