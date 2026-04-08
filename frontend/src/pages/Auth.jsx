import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin ? { email, password } : { name, email, password };

      const response = await fetch(`http://localhost:5001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (isLogin) {
        onLogin(data.user, data.token);
        navigate('/');
      } else {
        setIsLogin(true);
        setError('Registration successful! Please log in.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-light)' }}>
      
      <div className="glass-widget" style={{ maxWidth: '450px', width: '100%', padding: '50px 40px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary-light)', color: 'white', marginBottom: '20px', fontSize: '1.8rem', boxShadow: '0 4px 15px rgba(12, 166, 166, 0.3)'}}>
             ✈
          </div>
          <h1 style={{ color: 'var(--text-main)', fontSize: '2rem', marginBottom: '10px' }}>Youth Connect</h1>
          <p style={{ color: 'var(--text-muted)' }}>{isLogin ? 'Log in to securely access your portfolio.' : 'Join the community and make a social impact.'}</p>
        </div>

        {error && (
          <div style={{ padding: '12px 15px', borderRadius: '8px', background: error.includes('successful') ? '#d1fae5' : '#fee2e2', color: error.includes('successful') ? '#065f46' : '#991b1b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ marginBottom: '20px', position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', top: '14px', left: '15px', color: 'var(--text-muted)' }} />
              <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '12px 15px 12px 45px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#fff' }} />
            </div>
          )}

          <div style={{ marginBottom: '20px', position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', top: '14px', left: '15px', color: 'var(--text-muted)' }} />
            <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px 15px 12px 45px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#fff' }} />
          </div>

          <div style={{ marginBottom: '30px', position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', top: '14px', left: '15px', color: 'var(--text-muted)' }} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px 15px 12px 45px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#fff' }} />
          </div>

          <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontWeight: 'bold', opacity: isLoading ? 0.7 : 1 }}>
            {isLoading ? 'Processing...' : (isLogin ? 'Secure Sign In' : 'Create Account')} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #edf2f7' }}>
          <button 
            type="button" 
            onClick={() => { setIsLogin(!isLogin); setError(''); }} 
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', cursor: 'pointer' }}
          >
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span style={{color: 'var(--primary)', fontWeight: 'bold'}}>{isLogin ? "Sign up" : "Log in"}</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default Auth;
