import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Key } from 'lucide-react';

const AdminSetup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSetup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5002/api/auth/admin-seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, adminSecret })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      alert(data.message + " Please log in.");
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
      <div className="glass-widget" style={{ maxWidth: '450px', background: '#1e293b', border: '1px solid #334155', color: 'white' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <ShieldAlert size={48} color="#ef4444" style={{ marginBottom: '15px' }} />
          <h1 style={{ color: 'white' }}>Master Override</h1>
          <p style={{ color: '#94a3b8' }}>Initialize the root administrator object.</p>
        </div>

        {error && <div style={{ color: '#ef4444', marginBottom: '15px' }}>{error}</div>}

        <form onSubmit={handleSetup}>
          <input type="text" placeholder="Admin Name" required value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', marginBottom: '15px', padding: '12px', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '8px' }} />
          <input type="email" placeholder="Admin Email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', marginBottom: '15px', padding: '12px', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '8px' }} />
          <input type="password" placeholder="Admin Password" required value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', marginBottom: '15px', padding: '12px', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '8px' }} />
          
          <div style={{ position: 'relative', marginBottom: '25px' }}>
             <Key size={18} style={{ position: 'absolute', top: '14px', left: '15px', color: '#ef4444' }} />
             <input type="password" placeholder="Override Sequence Key" required value={adminSecret} onChange={e => setAdminSecret(e.target.value)} style={{ width: '100%', padding: '12px 15px 12px 45px', background: '#451a1a', border: '1px solid #7f1d1d', color: '#fca5a5', borderRadius: '8px' }} />
          </div>

          <button type="submit" className="btn" style={{ width: '100%', background: '#ef4444', color: 'white', padding: '14px', borderRadius: '8px' }}>
            Initialize Root Access
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSetup;
