import React, { useState } from 'react';
import { Building, PlusCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NGOPortal = ({ opportunities, setOpportunities }) => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    orgName: 'My NGO',
    category: 'Environment',
    location: '',
    date: '',
    time: '',
    description: '',
    skills: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newOpp = {
      id: `opp-${opportunities.length + 1}`,
      title: formData.title,
      orgName: formData.orgName,
      category: formData.category,
      location: formData.location || 'Remote',
      date: formData.date || 'Flexible',
      time: formData.time || 'Flexible',
      description: formData.description,
      longDescription: formData.description,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      image: "https://images.unsplash.com/photo-1555529902-5261145633bf?w=800&q=80",
      matchScore: Math.floor(Math.random() * (99 - 50 + 1) + 50),
      matchReasoning: "New opportunity recently added matching global parameters."
    };
    
    // Add to top of mock database
    setOpportunities([newOpp, ...opportunities]);
    setSuccess(true);
    
    // Reset form
    setFormData({...formData, title: '', location: '', description: '', skills: ''});
    
    setTimeout(() => {
      navigate('/opportunities');
    }, 2000);
  };

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '30px' }}>
        <h1 className="page-title">NGO Management Portal</h1>
        <p style={{color: 'var(--text-muted)'}}>Publish new volunteer opportunities and let our AI engine find the perfect match.</p>
      </div>

      <div className="glass-widget" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', paddingBottom: '20px', borderBottom: '1px solid #edf2f7', marginBottom: '30px' }}>
             <div style={{ background: 'var(--primary-light)', padding: '15px', borderRadius: '12px', color: 'white' }}>
                 <Building size={24} />
             </div>
             <div>
                 <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)' }}>Create New Opportunity</h2>
                 <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Fill out the required metadata so the algorithm can compute semantic similarity.</p>
             </div>
        </div>

        {success && (
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', color: 'var(--success)', padding: '15px', borderRadius: '12px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={20} />
                <strong>Success!</strong> Opportunity published to the global ledger. Redirecting...
            </div>
        )}

        <form onSubmit={handleSubmit}>
            <div className="two-col-grid">
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontWeight: '500' }}>Opportunity Title *</label>
                    <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Tree Planting Director" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff' }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontWeight: '500' }}>Category *</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff' }}>
                        <option value="Environment">Environment</option>
                        <option value="Technology">Technology</option>
                        <option value="Mentorship">Mentorship</option>
                        <option value="Creative">Creative Arts</option>
                        <option value="Support">General Support</option>
                    </select>
                </div>
            </div>

            <div className="two-col-grid">
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontWeight: '500' }}>Location</label>
                    <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Remote, City Park" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff' }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontWeight: '500' }}>Date & Duration</label>
                    <input type="text" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} placeholder="e.g. Nov 15th - Nov 20th" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff' }} />
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontWeight: '500' }}>Required Skills (Comma Separated) *</label>
                <input type="text" required value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} placeholder="e.g. Leadership, Web Dev, Patience" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff' }} />
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '5px' }}>These tags dictate the semantic similarity compute against volunteer profiles.</p>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontWeight: '500' }}>Project Description *</label>
                <textarea required rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe what the volunteers will be doing..." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', resize: 'vertical' }}></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '15px 30px', fontSize: '1.1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center' }}>
                <PlusCircle size={20} /> Deploy Opportunity
            </button>
        </form>

      </div>
    </div>
  );
};

export default NGOPortal;
