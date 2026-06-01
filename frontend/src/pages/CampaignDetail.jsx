import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Target, MapPin, Users, Zap, ShieldCheck, ArrowLeft, MessageSquare, Briefcase, Star, Clapperboard, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { API_BASE } from '../config';

const CampaignDetail = ({ user, campaigns, applications, setApplications }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [requestSent, setRequestSent] = useState(false);
  const [predictions, setPredictions] = useState(null);
  const [loadingPredictions, setLoadingPredictions] = useState(false);

  React.useEffect(() => {
    const fetchPredictions = async () => {
      setLoadingPredictions(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/api/ai/predict-campaign/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setPredictions(data);
        }
      } catch (err) {
        console.error("Failed to load predictions:", err);
      } finally {
        setLoadingPredictions(false);
      }
    };
    fetchPredictions();
  }, [id]);

  const campaign = campaigns.find(c => c._id === id);
  if (!campaign) return (
    <div style={{ padding: '100px', textAlign: 'center', color: 'white' }}>
        <Zap size={60} color="#ef4444" className="animate-float" />
        <h2 style={{ marginTop: '20px' }}>CAMPAIGN NOT FOUND</h2>
        <p style={{ color: '#94a3b8' }}>The campaign node you are looking for does not exist.</p>
        <button onClick={() => navigate('/campaigns')} className="btn btn-primary" style={{ marginTop: '30px' }}>Return to Search</button>
    </div>
  );

  const myApp = applications?.find(app => (app.campaignId?._id === id || app.campaignId === id));
  const hasApplied = !!myApp;

  const handleApply = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ campaignId: id })
      });
      if (res.ok) {
        setRequestSent(true);
        const newApp = await res.json();
        if (setApplications) setApplications([...applications, newApp]);
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="campaign-detail-cyber" style={{ animation: 'fadeIn 0.6s ease-out' }}>
        
        {/* 🛰️ TACTICAL BREADCRUMB */}
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#0ca6a6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', fontWeight: 'bold' }}>
            <ArrowLeft size={18}/> BACK TO BROWSE
        </button>

        <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '50px' }}>
            
            {/* 📜 MISSION BRIEFING */}
            <div>
                <div style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#4ade80', fontWeight: '900', letterSpacing: '2px', fontSize: '0.8rem', marginBottom: '15px' }}>
                        <ShieldCheck size={18}/> ACTIVE CAMPAIGN
                    </div>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: 'white', lineHeight: '1.1', marginBottom: '20px' }}>{campaign.title}</h1>
                    <div style={{ display: 'flex', gap: '30px', color: '#94a3b8', fontSize: '1.1rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={18} color="#0ca6a6"/> {campaign.location}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Target size={18} color="#0ca6a6"/> {campaign.categories?.[0]}</span>
                    </div>
                </div>

                <div className="cyber-card" style={{ padding: '40px', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.3rem', color: 'white', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Zap size={20} color="#4ade80" /> ABOUT THE CAMPAIGN
                    </h2>
                    <p style={{ fontSize: '1.15rem', color: '#cbd5e1', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                        {campaign.description}
                    </p>
                </div>

                {campaign.videoUrl && (
                    <div className="cyber-card" style={{ padding: '40px' }}>
                         <h2 style={{ fontSize: '1.3rem', color: 'white', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                             <Clapperboard size={20} color="#0ca6a6" /> CAMPAIGN VIDEO
                        </h2>
                        <video controls style={{ width: '100%', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <source src={campaign.videoUrl} type="video/mp4" />
                        </video>
                    </div>
                )}
            </div>

            {/* ⚔️ DEPLOYMENT CONTROLS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                
                <div className="cyber-card" style={{ padding: '35px', background: 'rgba(12, 166, 166, 0.05)' }}>
                     <h3 style={{ fontSize: '1.1rem', color: 'white', letterSpacing: '2px', marginBottom: '30px', fontWeight: 'bold' }}>CAMPAIGN INFO</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginBottom: '40px' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                             <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Volunteers Needed</span>
                             <span style={{ color: 'white', fontWeight: 'bold' }}>{campaign.neededPositions}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                             <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Joined</span>
                             <span style={{ color: '#4ade80', fontWeight: 'bold' }}>{campaign.filledPositions}</span>
                         </div>
                         <div style={{ height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${(campaign.filledPositions/campaign.neededPositions)*100}%`, background: '#0ca6a6', boxShadow: '0 0 10px #0ca6a6' }}></div>
                         </div>
                    </div>

                    {hasApplied || requestSent ? (
                        <div style={{ 
                            padding: '25px', 
                            background: (myApp?.status === 'Accepted' || requestSent) ? 'rgba(74, 222, 128, 0.1)' : myApp?.status === 'Rejected' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)', 
                            border: `1px solid ${(myApp?.status === 'Accepted' || requestSent) ? '#4ade80' : myApp?.status === 'Rejected' ? '#ef4444' : '#f59e0b'}`, 
                            borderRadius: '15px', textAlign: 'center' 
                        }}>
                            {(myApp?.status === 'Accepted' || requestSent) ? <CheckCircle size={30} color="#4ade80" style={{ marginBottom: '10px' }} /> : 
                             myApp?.status === 'Rejected' ? <XCircle size={30} color="#ef4444" style={{ marginBottom: '10px' }} /> : 
                             <Zap size={30} color="#f59e0b" style={{ marginBottom: '10px' }} />}
                            
                            <div style={{ color: 'white', fontWeight: 'bold' }}>
                                {requestSent ? 'APPLICATION SENT' : myApp?.status === 'Accepted' ? 'DEPLOYMENT AUTHORIZED' : myApp?.status === 'Rejected' ? 'APPLICATION REJECTED' : myApp?.status === 'Removed' ? 'SERVICE TERMINATED' : 'APPLICATION UNDER REVIEW'}
                            </div>
                            
                            <div style={{ color: (myApp?.status === 'Accepted' || requestSent) ? '#4ade80' : '#ef4444', fontSize: '0.8rem', marginTop: '5px' }}>
                                {myApp?.status === 'Accepted' ? 'You are an active volunteer for this campaign.' : 
                                 myApp?.status === 'Rejected' ? 'The organizer has declined your request.' : 
                                 myApp?.status === 'Removed' ? 'You have been removed from this campaign.' :
                                 'Your request is currently in the approval queue.'}
                            </div>
                        </div>
                    ) : (
                        <button onClick={handleApply} className="cyber-card" style={{ width: '100%', padding: '25px', background: 'linear-gradient(90deg, #0ca6a6 0%, #4ade80 100%)', border: 'none', color: 'white', fontWeight: '900', letterSpacing: '3px', cursor: 'pointer', boxShadow: '0 0 30px rgba(74, 222, 128, 0.3)' }}>
                            JOIN CAMPAIGN
                        </button>
                    )}
                </div>

                {predictions && (
                  <div className="cyber-card" style={{ padding: '35px', background: 'rgba(12, 166, 166, 0.03)', border: '1px dashed rgba(12, 166, 166, 0.25)' }}>
                    <h3 style={{ fontSize: '1rem', color: 'white', letterSpacing: '2px', marginBottom: '25px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>🔮</span> PREDICTIVE LOGISTICS
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                        <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Est. Recruitment Time</span>
                        <span style={{ color: '#0ca6a6', fontWeight: 'bold', fontSize: '0.9rem' }}>{predictions.daysToRecruitFull}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                        <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Est. Funding Completion</span>
                        <span style={{ color: '#0ca6a6', fontWeight: 'bold', fontSize: '0.9rem' }}>{predictions.daysToFundFull}</span>
                      </div>
                    </div>
                    
                    <div style={{ color: '#cbd5e1', fontSize: '0.8rem', lineHeight: '1.5', background: 'rgba(12, 166, 166, 0.05)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(12, 166, 166, 0.15)' }}>
                      <div style={{ fontWeight: '800', color: '#4ade80', marginBottom: '6px' }}>AI Advisor Insights:</div>
                      <ul style={{ margin: 0, paddingLeft: '16px' }}>
                        {predictions.recommendations?.map((rec, i) => (
                          <li key={i} style={{ marginBottom: '8px' }}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="cyber-card" style={{ padding: '35px' }}>
                    <h3 style={{ fontSize: '1rem', color: 'white', letterSpacing: '2px', marginBottom: '25px', fontWeight: 'bold' }}>ORGANIZER</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #0ca6a6, #4ade80)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>{campaign.creatorName?.[0]}</div>
                        <div>
                            <div style={{ color: 'white', fontWeight: 'bold' }}>{campaign.creatorName || "Anonymous NGO"}</div>
                            <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Campaign Lead</div>
                        </div>
                    </div>
                </div>

                <div style={{ padding: '0 20px', color: '#4b5563', fontSize: '0.8rem', textAlign: 'center', lineHeight: '1.6' }}>
                    Join this campaign and make an impact. Application is subject to NGO approval.
                </div>
            </div>

        </div>
    </div>
  );
};


export default CampaignDetail;
