import React, { useState } from 'react';
import { Search, MapPin, Building, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OpportunitiesBrowser = ({ opportunities }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredOpps = opportunities.filter(opp => 
    opp.title.toLowerCase().includes(search.toLowerCase()) || 
    opp.category.toLowerCase().includes(search.toLowerCase()) ||
    opp.orgName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 className="page-title">Opportunities Browser</h1>
          <p style={{color: 'var(--text-muted)'}}>AI-powered matches tailored to your profile.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '40px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '15px', top: '15px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by keyword, skill, or organization..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '14px 14px 14px 45px', borderRadius: '12px', background: '#fff', border: '1px solid #cbd5e1', color: 'var(--text-main)', fontSize: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}
          />
        </div>
        <button className="btn btn-primary" style={{padding: '0 30px', borderRadius: '12px'}}>Filter Matches</button>
      </div>

      <div className="opportunities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
        {filteredOpps.map(opp => (
          <div key={opp.id} className="glass-widget" style={{position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer', transition: 'transform 0.2s', ':hover': {transform: 'translateY(-4px)'}}} onClick={() => navigate(`/opportunities/${opp.id}`)}>
            <div style={{position: 'absolute', top: '20px', right: '20px', background: 'var(--success-bg, rgba(16, 185, 129, 0.15))', color: 'var(--success)', padding: '5px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px'}}>
               <CheckCircle2 size={14}/> {opp.matchScore}% Match
            </div>
            
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px', paddingRight: '90px', color: 'var(--text-main)' }}>{opp.title}</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontSize: '0.9rem', marginBottom: '8px', fontWeight: '500' }}>
              <Building size={16} /> {opp.orgName}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '15px' }}>
              <MapPin size={16} /> {opp.location}
            </div>
            
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.5', flex: 1 }}>
              {opp.description}
            </p>

            <div className="pills-container" style={{ margin: '20px 0', flexDirection: 'row', flexWrap: 'wrap' }}>
              {opp.skills.slice(0, 3).map(skill => (
                <span key={skill} className="pill" style={{background: '#f1f5f9', color: '#64748b', fontSize: '0.75rem', padding: '4px 10px'}}>{skill}</span>
              ))}
              {opp.skills.length > 3 && <span className="pill" style={{background: '#f1f5f9', color: '#64748b', fontSize: '0.75rem', padding: '4px 10px'}}>+{opp.skills.length - 3}</span>}
            </div>

            <button className="btn" style={{ width: '100%', background: 'rgba(12, 166, 166, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', color: 'var(--primary)', fontWeight: '600' }} onClick={(e) => { e.stopPropagation(); navigate(`/opportunities/${opp.id}`);}}>
              View Details <ChevronRight size={16} />
            </button>
          </div>
        ))}
      </div>
      
      {filteredOpps.length === 0 && (
          <div style={{textAlign: 'center', padding: '60px', color: 'var(--text-muted)'}}>
              <h3>No opportunities match your search.</h3>
          </div>
      )}
    </div>
  );
};

export default OpportunitiesBrowser;
