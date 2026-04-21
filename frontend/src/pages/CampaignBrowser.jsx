import React, { useState } from 'react';
import { Search, MapPin, Tag, Filter, Globe, Zap, ArrowRight, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const CampaignBrowser = ({ campaigns }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredCamps = campaigns.filter(camp => {
    const matchesSearch = camp.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          camp.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || camp.categories.includes(categoryFilter);
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = ['All', ...new Set(campaigns.flatMap(c => c.categories))];

  return (
    <div className="campaign-browser-cyber" style={{ animation: 'fadeIn 0.6s ease-out' }}>
      
      {/* 🔮 TACTICAL SEARCH HEADER */}
      <div className="cyber-card" style={{ padding: '50px', marginBottom: '50px', background: 'linear-gradient(135deg, rgba(12, 166, 166, 0.05) 0%, rgba(9, 15, 29, 0.2) 100%)', border: '1px solid rgba(12, 166, 166, 0.2)' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', color: 'white', marginBottom: '20px', letterSpacing: '-1px' }}>GLOBAL <span style={{ color: '#0ca6a6' }}>SEARCH</span></h1>
        <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginBottom: '40px' }}>Filter through the impact grid to find your next mission node.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '20px', top: '18px', color: '#0ca6a6' }} />
            <input 
              type="text" 
              className="cyber-input" 
              style={{ width: '100%', paddingLeft: '60px', height: '60px', fontSize: '1.1rem' }} 
              placeholder="Query by title or location..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Filter style={{ position: 'absolute', left: '20px', top: '18px', color: '#0ca6a6' }} />
            <select 
              className="cyber-input" 
              style={{ width: '100%', paddingLeft: '60px', height: '60px', fontSize: '1.1rem', appearance: 'none' }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* 🛰️ MISSION NODE GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
        {filteredCamps.map(camp => (
          <div key={camp._id} className="cyber-card" style={{ padding: '0', cursor: 'default' }}>
            <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 0%, #090f1d 90%)', zIndex: 1 }}></div>
                <div style={{ height: '100%', background: 'rgba(12, 166, 166, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Target size={60} color="#0ca6a6" style={{ opacity: 0.3 }} />
                </div>
                <div style={{ position: 'absolute', bottom: '20px', left: '25px', zIndex: 2 }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: '900', background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', padding: '5px 12px', borderRadius: '4px', letterSpacing: '1px', border: '1px solid rgba(74, 222, 128, 0.2)' }}>
                        {camp.categories[0].toUpperCase()}
                    </span>
                </div>
            </div>

            <div style={{ padding: '30px', marginTop: '-10px' }}>
                <h3 style={{ fontSize: '1.4rem', color: 'white', fontWeight: '800', marginBottom: '10px' }}>{camp.title}</h3>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '25px' }}>
                    <MapPin size={14} color="#0ca6a6" /> {camp.location}
                </div>
                
                <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: '1.6', marginBottom: '30px', height: '4.8em', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    {camp.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                    <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(camp.filledPositions/camp.neededPositions)*100}%`, background: '#0ca6a6', boxShadow: '0 0 10px #0ca6a6' }}></div>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#4ade80', fontWeight: 'bold' }}>{camp.filledPositions}/{camp.neededPositions}</span>
                </div>

                <Link to={`/campaigns/${camp._id}`} style={{ textDecoration: 'none' }}>
                    <button className="cyber-card" style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(12, 166, 166, 0.3)', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: '0.3s', cursor: 'pointer' }}>
                        ACTIVATE NODE <ArrowRight size={18} color="#4ade80" />
                    </button>
                </Link>
            </div>
          </div>
        ))}

        {filteredCamps.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '100px', textAlign: 'center' }}>
            <Zap size={50} color="#ef4444" style={{ marginBottom: '20px' }} />
            <h2 style={{ color: 'white', letterSpacing: '2px' }}>NO NODES DETECTED</h2>
            <p style={{ color: '#94a3b8' }}>Adjust your tactical filters and scan again.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignBrowser;
