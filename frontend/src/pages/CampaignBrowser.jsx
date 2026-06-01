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
    <div className="campaign-browser-cyber animate-fadeIn" style={{ fontFamily: 'var(--font-body)', padding: '40px 24px', maxWidth: '1200px', margin: '0 auto', color: 'var(--text-primary)' }}>
      
      {/* 🔮 TACTICAL SEARCH HEADER */}
      <div className="cyber-card" style={{ padding: '40px', marginBottom: '40px', background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '-1px', fontFamily: 'var(--font-heading)' }}>
          Browse <span style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Campaigns</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '32px' }}>Find local opportunities and make a tangible impact in your community.</p>
        
        <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '16px', top: '18px', color: 'var(--primary-light)' }} size={20} />
            <input 
              type="text" 
              className="cyber-input" 
              style={{ width: '100%', paddingLeft: '52px', height: '56px', fontSize: '1rem', background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '12px' }} 
              placeholder="Search by title or location..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Filter style={{ position: 'absolute', left: '16px', top: '18px', color: 'var(--primary-light)' }} size={20} />
            <select 
              className="cyber-input" 
              style={{ width: '100%', paddingLeft: '52px', height: '56px', fontSize: '1rem', background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '12px', appearance: 'none' }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* 🛰️ CAMPAIGN GRID */}
      <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
        {filteredCamps.map(camp => (
          <div key={camp._id} className="cyber-card" style={{ padding: '0', cursor: 'default', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                <img 
                  src={camp.image || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800'} 
                  alt={camp.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <div style={{ position: 'absolute', bottom: '16px', left: '20px', zIndex: 2 }}>
                    <span 
                      style={{ 
                        background: 'rgba(10, 10, 15, 0.85)',
                        backdropFilter: 'blur(8px)',
                        color: '#c084fc',
                        border: '1px solid rgba(168, 85, 247, 0.4)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
                        fontSize: '0.62rem', 
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontWeight: '700',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        display: 'inline-block'
                      }}
                    >
                        {(camp.categories?.[0] || 'GENERAL').toUpperCase()}
                    </span>
                </div>
            </div>

            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: '800', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>{camp.title}</h3>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                        <MapPin size={14} color="var(--primary-light)" /> {camp.location}
                    </div>
                    
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '24px', height: '4.5em', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                        {camp.description}
                    </p>
                </div>

                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <div style={{ flex: 1, height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${Math.min(100, (camp.filledPositions/camp.neededPositions)*100)}%`, background: 'var(--gradient-primary)', borderRadius: '10px' }}></div>
                        </div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--primary-light)', fontWeight: 'bold' }}>{camp.filledPositions}/{camp.neededPositions}</span>
                    </div>

                    <Link to={`/campaigns/${camp._id}`} style={{ textDecoration: 'none' }}>
                        <button className="btn btn-primary" style={{ width: '100%', padding: '12px', justifyContent: 'center', gap: '8px', fontSize: '0.85rem' }}>
                            View Details <ArrowRight size={16} />
                        </button>
                    </Link>
                </div>
            </div>
          </div>
        ))}

        {filteredCamps.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '80px 40px', textAlign: 'center' }}>
            <Zap size={44} color="var(--primary-light)" style={{ marginBottom: '16px' }} />
            <h2 style={{ color: 'var(--text-primary)', letterSpacing: '1px', marginBottom: '8px' }}>No Campaigns Found</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your filters and search again.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignBrowser;
