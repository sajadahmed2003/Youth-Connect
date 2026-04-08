import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, CheckCircle2, PlusCircle, AlertCircle, Send } from 'lucide-react';

const OpportunityDetail = ({ user, setUser, opportunities, applications, setApplications }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const opp = opportunities.find(o => o.id === id) || opportunities[0];
  const userSkills = user?.skills || [];
  
  const missingSkills = opp.skills.filter(s => !userSkills.includes(s));
  const matchedSkills = opp.skills.filter(s => userSkills.includes(s));

  const hasApplied = applications.some(app => app.opportunityId === opp.id);

  const handleAddSkill = (skill) => {
    setUser({ ...user, skills: [...userSkills, skill] });
  };

  const handleApply = () => {
    const newApp = {
      id: `app-${Date.now()}`,
      opportunityId: opp.id,
      title: opp.title,
      orgName: opp.orgName,
      status: 'Applied', // Applied, Accepted, Rejected
      matchScore: opp.matchScore,
      dateApplied: new Date().toLocaleDateString()
    };
    setApplications([...applications, newApp]);
    alert("Application Submitted Successfully!");
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => navigate(-1)} 
          className="btn" 
          style={{ background: 'transparent', padding: '10px 0', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px', outline: 'none', boxShadow: 'none' }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </div>

      <div className="glass-widget" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ height: '300px', width: '100%', overflow: 'hidden' }}>
          <img src={opp.image} alt={opp.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        
        <div style={{ padding: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <span className="category-tag" style={{ marginBottom: '15px' }}>{opp.category}</span>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: 'var(--text-main)', lineHeight: '1.2' }}>{opp.title}</h1>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '25px', fontWeight: '500' }}>{opp.orgName}</h3>
            </div>
            
            <div style={{textAlign: 'right'}}>
              <div style={{fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '5px'}}>AI Match Score</div>
              <div style={{fontSize: '2rem', color: 'var(--success)', fontWeight: 'bold', marginBottom: '15px'}}>{opp.matchScore}%</div>
              
              {hasApplied ? (
                  <button className="btn" style={{ fontSize: '1.1rem', padding: '15px 40px', borderRadius: '50px', whiteSpace: 'nowrap', background: '#e2e8f0', color: '#64748b', cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: '8px' }} disabled>
                      <CheckCircle2 size={20} /> Application Pending
                  </button>
              ) : (
                  <button onClick={handleApply} className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '15px 40px', borderRadius: '50px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Send size={20} /> Apply Now
                  </button>
              )}
            </div>
          </div>

          <div className="two-col-grid" style={{ marginBottom: '40px' }}>
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', color: 'var(--text-main)', fontWeight: '600' }}>
                <Calendar size={20} color="var(--primary)" /> Date & Time
              </div>
              <div style={{ color: 'var(--text-muted)', marginBottom: '5px' }}>{opp.date}</div>
              <div style={{ color: 'var(--text-muted)' }}>{opp.time}</div>
            </div>
            
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', color: 'var(--text-main)', fontWeight: '600' }}>
                <MapPin size={20} color="var(--primary)" /> Location
              </div>
              <div style={{ color: 'var(--text-muted)' }}>{opp.location}</div>
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: 'var(--text-main)' }}>About This Opportunity</h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
              {opp.longDescription}
            </p>
          </div>

          <div style={{background: 'rgba(12, 166, 166, 0.05)', borderRadius: '16px', padding: '30px', border: '1px solid rgba(12, 166, 166, 0.2)'}}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: 'var(--text-main)' }}>AI Match Analysis</h2>
            
            <div className="two-col-grid">
              <div>
                <h4 style={{marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--success)'}}><CheckCircle2 size={18}/> Matched Skills</h4>
                {matchedSkills.length === 0 ? <p style={{color: 'var(--text-muted)'}}>No exact matches.</p> : (
                  <div className="pills-container" style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {matchedSkills.map(skill => (
                      <span key={skill} className="pill" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
                         {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 style={{marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px', color: '#f59e0b'}}><AlertCircle size={18}/> Missing Skills</h4>
                {missingSkills.length === 0 ? <p style={{color: 'var(--text-muted)'}}>You have all required skills!</p> : (
                  <div className="pills-container" style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {missingSkills.map(skill => (
                      <button 
                        key={skill} 
                        onClick={() => handleAddSkill(skill)}
                        style={{ border: 'none', background: '#f1f5f9', color: '#64748b', fontSize: '0.85rem', margin: '0', padding: '6px 15px', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.2s' }}
                        onMouseOver={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b'; }}
                      >
                         <PlusCircle size={14}/> {skill} (Add)
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {missingSkills.length > 0 && (
                <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '20px'}}>Click on any missing skill to instantly add it to your volunteer profile to increase your chances of being accepted!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetail;
