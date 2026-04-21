import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Play, Users, Send, Target, MapPin, Grid, List, Zap, Eye, Clapperboard, FileText } from 'lucide-react';

const CampaignDiscover = ({ campaigns, user }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [commentText, setCommentText] = useState({});

  const handleLike = async (id) => {
    try {
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:5003/api/campaigns/${id}/like`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
    } catch (err) { console.error(err); }
  };

  const handleComment = async (id) => {
    if(!commentText[id]) return;
    try {
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:5003/api/campaigns/${id}/comment`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ text: commentText[id] })
        });
        setCommentText({ ...commentText, [id]: '' });
    } catch (err) { console.error(err); }
  };

  const filteredCamps = activeTab === 'REELS' ? campaigns.filter(c => c.videoUrl) : activeTab === 'POSTS' ? campaigns.filter(c => !c.videoUrl) : campaigns;

  return (
    <div className="discovery-hub-cyber" style={{ animation: 'fadeIn 0.5s ease-out' }}>
        
        {/* 🌠 CYBER FEED HEADER */}
        <div style={{ marginBottom: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '30px' }}>
            <div>
                <h1 style={{ fontSize: '3rem', fontWeight: '900', color: 'white', letterSpacing: '-1px' }}>GLOBAL <span style={{ color: '#0ca6a6' }}>FEED</span></h1>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Streaming <b style={{ color: '#4ade80' }}>{campaigns.filter(c => c.videoUrl).length} REELS</b> and <b style={{ color: '#0ca6a6' }}>{campaigns.filter(c => !c.videoUrl).length} POSTS</b> from the grid.</p>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', background: 'rgba(255,255,255,0.02)', padding: '5px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
                {['All', 'REELS', 'POSTS'].map(tab => (
                    <button 
                        key={tab} 
                        onClick={() => setActiveTab(tab)}
                        style={{ 
                            background: activeTab === tab ? '#0ca6a6' : 'transparent', 
                            color: activeTab === tab ? 'white' : '#64748b', 
                            border: 'none', 
                            padding: '12px 25px', borderRadius: '30px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.3s', fontSize: '0.8rem', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px'
                        }}
                    >
                        {tab === 'REELS' ? <Clapperboard size={16}/> : tab === 'POSTS' ? <FileText size={16}/> : null}
                        {tab.toUpperCase()}
                    </button>
                ))}
            </div>
        </div>

        <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '50px' }}>
            {filteredCamps.map(camp => (
                <div key={camp._id} className="cyber-card" style={{ padding: 0, overflow: 'visible' }}>
                    
                    {/* identity Line */}
                    <div style={{ padding: '20px 30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #0ca6a6, #4ade80)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: 'white', border: '2px solid rgba(255,255,255,0.1)' }}>
                            {camp.creatorName?.[0]}
                        </div>
                        <div style={{flex: 1}}>
                            <div style={{ fontWeight: '800', fontSize: '1.1rem', color: 'white' }}>{camp.creatorName}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={12}/> {camp.location}</div>
                        </div>
                        <span style={{ fontSize: '0.65rem', background: 'rgba(12, 166, 166, 0.1)', color: '#0ca6a6', padding: '5px 12px', borderRadius: '6px', fontWeight: '900', letterSpacing: '1px', border: '1px solid rgba(12, 166, 166, 0.2)' }}>
                            {camp.categories?.[0].toUpperCase()}
                        </span>
                    </div>

                    {/* Multimedia Matrix */}
                    {camp.videoUrl ? (
                        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <video loop muted controls style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                                <source src={camp.videoUrl} type="video/mp4" />
                            </video>
                            <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(239, 68, 68, 0.8)', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Zap size={12} fill="white"/> IMPACT REEL
                            </div>
                        </div>
                    ) : (
                        <div style={{ padding: '70px 50px', background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)', textAlign: 'center', position: 'relative' }}>
                             <Target size={50} color="#0ca6a6" style={{marginBottom: '25px', opacity: 0.3}}/>
                             <h2 style={{fontSize: '2rem', marginBottom: '20px', color: 'white', fontWeight: '900', lineHeight: '1.1'}}>{camp.title}</h2>
                             <p style={{fontSize: '1.1rem', color: '#94a3b8', lineHeight: '1.8', maxWidth: '500px', margin: '0 auto'}}>{camp.description}</p>
                        </div>
                    )}

                    {/* High-Impact Engagement Bar */}
                    <div style={{ padding: '30px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', gap: '35px' }}>
                                <div onClick={() => handleLike(camp._id)} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: camp.likes?.includes(user?._id) ? '#ef4444' : '#64748b' }}>
                                    <Heart size={28} fill={camp.likes?.includes(user?._id) ? '#ef4444' : 'none'} style={{ transition: '0.3s' }} /> 
                                    <span style={{fontWeight: '900', fontSize: '1.1rem'}}>{camp.likes?.length || 0}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b' }}>
                                    <MessageCircle size={28} /> 
                                    <span style={{fontWeight: '900', fontSize: '1.1rem'}}>{camp.comments?.length || 0}</span>
                                </div>
                            </div>
                            <a href={`/campaigns/${camp._id}`} style={{ textDecoration: 'none', color: '#4ade80', fontWeight: '900', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(74, 222, 128, 0.1)', padding: '8px 20px', borderRadius: '30px', border: '1px solid rgba(74, 222, 128, 0.2)' }}>
                                <Play size={16} fill="#4ade80" /> JOIN MISSION
                            </a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default CampaignDiscover;
