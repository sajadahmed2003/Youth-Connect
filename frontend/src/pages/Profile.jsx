import React, { useState, useRef, useEffect } from 'react';
import { Upload } from 'lucide-react';

const Profile = ({ user, setUser }) => {
  const [name, setName] = useState(user.name);
  const [skillsText, setSkillsText] = useState((user.skills || []).join(', '));
  const fileInputRef = useRef(null);

  // Sync state if it updates externally (like when adding a skill from Opportunity details page)
  useEffect(() => {
    setSkillsText((user.skills || []).join(', '));
  }, [user.skills]);

  const handleSave = (e) => {
    e.preventDefault();
    const skillsArray = skillsText.split(',').map(s => s.trim()).filter(Boolean);
    setUser({ ...user, name, skills: skillsArray });
    alert("Profile details updated successfully!");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
          alert('File is too large! Please select an image under 2MB.');
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Your Volunteer Profile</h1>
        <p style={{color: 'var(--text-muted)'}}>Keep your skills updated for the best AI-powered recommendations.</p>
      </div>
      
      <div className="glass-widget" style={{ maxWidth: '600px', marginTop: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #edf2f7' }}>
          <img src={user.avatar} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'var(--text-main)' }}>Profile Picture</h3>
            <button type="button" className="btn btn-primary" style={{ padding: '8px 15px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => fileInputRef.current.click()}>
              <Upload size={16} /> Upload New Photo
            </button>
            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageUpload} />
          </div>
        </div>

        <form>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontWeight: '500' }}>Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#fff', border: '1px solid #cbd5e1', color: '#1a202c' }} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontWeight: '500' }}>Location</label>
            <input type="text" defaultValue="San Francisco, CA" style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#fff', border: '1px solid #cbd5e1', color: '#1a202c' }} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontWeight: '500' }}>Skills (comma separated for AI Graph Model)</label>
            <textarea 
              rows="3" 
              value={skillsText} 
              onChange={(e) => setSkillsText(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#fff', border: '1px solid #cbd5e1', color: '#1a202c', resize: 'vertical' }}
            ></textarea>
          </div>
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            Save Profile Details
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
