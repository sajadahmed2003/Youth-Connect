import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Shield, AlertTriangle, Lightbulb, Heart, Search } from 'lucide-react';

const contentData = {
  'how-it-works': {
    title: 'How It Works',
    icon: Lightbulb,
    color: '#f59e0b',
    content: (
      <div>
        <h3 style={{fontSize: '1.5rem', marginBottom: '20px', color: '#1e293b'}}>Your Journey to Impact</h3>
        <p style={{lineHeight: '1.8', color: '#64748b', marginBottom: '20px'}}>
          Youth Connect makes volunteering seamless and rewarding. Here is how you can start making a difference:
        </p>
        <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          <div style={{padding: '20px', background: '#f8fafc', borderRadius: '15px'}}>
            <h4 style={{color: '#0ca6a6', marginBottom: '10px'}}>1. Create Your Profile</h4>
            <p style={{color: '#64748b', margin: 0}}>Sign up and add your skills. Our AI engine will learn your preferences.</p>
          </div>
          <div style={{padding: '20px', background: '#f8fafc', borderRadius: '15px'}}>
            <h4 style={{color: '#0ca6a6', marginBottom: '10px'}}>2. Browse & Apply</h4>
            <p style={{color: '#64748b', margin: 0}}>Explore hundreds of live campaigns. One click is all it takes to apply.</p>
          </div>
          <div style={{padding: '20px', background: '#f8fafc', borderRadius: '15px'}}>
            <h4 style={{color: '#0ca6a6', marginBottom: '10px'}}>3. Track Your Impact</h4>
            <p style={{color: '#64748b', margin: 0}}>Once approved by the NGO, join the team, complete tasks, and build your digital portfolio!</p>
          </div>
        </div>
      </div>
    )
  },
  'success-stories': {
    title: 'Success Stories',
    icon: Heart,
    color: '#ec4899',
    content: (
      <div>
        <h3 style={{fontSize: '1.5rem', marginBottom: '20px', color: '#1e293b'}}>Real Impact, Real People</h3>
        <p style={{lineHeight: '1.8', color: '#64748b', marginBottom: '30px'}}>
          See how the Youth Connect community is changing the world, one campaign at a time.
        </p>
        <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px'}}>
          <div style={{padding: '30px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)'}}>
            <p style={{fontStyle: 'italic', color: '#475569', marginBottom: '20px'}}>"Thanks to Youth Connect, our Ocean Cleanup drive got 50+ volunteers in just two days. The energy was incredible!"</p>
            <div style={{fontWeight: 'bold', color: '#0ca6a6'}}>- Sarah Jenkins, Environmental NGO</div>
          </div>
          <div style={{padding: '30px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)'}}>
            <p style={{fontStyle: 'italic', color: '#475569', marginBottom: '20px'}}>"I found a local literacy program matching my teaching skills perfectly. It has been the most fulfilling 3 months of my life."</p>
            <div style={{fontWeight: 'bold', color: '#ec4899'}}>- David M., Volunteer</div>
          </div>
        </div>
      </div>
    )
  },
  'help-center': {
    title: 'Help Center',
    icon: Search,
    color: '#3b82f6',
    content: (
      <div>
        <h3 style={{fontSize: '1.5rem', marginBottom: '20px', color: '#1e293b'}}>Frequently Asked Questions</h3>
        <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          <details style={{padding: '20px', background: '#f8fafc', borderRadius: '15px', cursor: 'pointer'}}>
            <summary style={{fontWeight: 'bold', color: '#1e293b', outline: 'none'}}>How do I join a campaign?</summary>
            <p style={{color: '#64748b', marginTop: '10px', lineHeight: '1.6'}}>Simply navigate to the Home page, browse the active campaigns, and click "Join Now". The NGO manager will review your profile.</p>
          </details>
          <details style={{padding: '20px', background: '#f8fafc', borderRadius: '15px', cursor: 'pointer'}}>
            <summary style={{fontWeight: 'bold', color: '#1e293b', outline: 'none'}}>Is Youth Connect free?</summary>
            <p style={{color: '#64748b', marginTop: '10px', lineHeight: '1.6'}}>Yes! Youth Connect is completely free for volunteers. NGOs can also post campaigns for free.</p>
          </details>
          <details style={{padding: '20px', background: '#f8fafc', borderRadius: '15px', cursor: 'pointer'}}>
            <summary style={{fontWeight: 'bold', color: '#1e293b', outline: 'none'}}>How can I edit my skills?</summary>
            <p style={{color: '#64748b', marginTop: '10px', lineHeight: '1.6'}}>Go to "My Profile" from the top right menu, type your new skills separated by commas, and click Save Profile.</p>
          </details>
        </div>
      </div>
    )
  },
  'safety-rules': {
    title: 'Safety Rules',
    icon: Shield,
    color: '#10b981',
    content: (
      <div>
        <h3 style={{fontSize: '1.5rem', marginBottom: '20px', color: '#1e293b'}}>Community Guidelines & Safety</h3>
        <p style={{lineHeight: '1.8', color: '#64748b', marginBottom: '20px'}}>
          We prioritize the safety and well-being of all our users. Please adhere to these critical guidelines:
        </p>
        <ul style={{color: '#64748b', lineHeight: '2', paddingLeft: '20px'}}>
          <li>Always meet in public places for offline campaigns.</li>
          <li>Never share sensitive personal information (like passwords or banking details) with NGOs or other volunteers.</li>
          <li>Treat everyone with respect. Harassment, discrimination, or hate speech will result in immediate ban.</li>
          <li>Report any suspicious activity or fraudulent campaigns immediately using the Bug Report tool.</li>
        </ul>
      </div>
    )
  },
  'bug-report': {
    title: 'Report a Bug',
    icon: AlertTriangle,
    color: '#ef4444',
    content: (
      <div>
        <h3 style={{fontSize: '1.5rem', marginBottom: '20px', color: '#1e293b'}}>Found an issue? Let us know!</h3>
        <p style={{lineHeight: '1.8', color: '#64748b', marginBottom: '20px'}}>
          Our engineering team is constantly working to improve Youth Connect. If you found a glitch or a bug, please describe it below.
        </p>
        <form onSubmit={(e) => { e.preventDefault(); alert('Bug report submitted successfully! Thank you.'); e.target.reset(); }} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          <input type="text" placeholder="Issue Title (e.g., Profile picture not loading)" required style={{padding: '15px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', width: '100%'}} />
          <textarea placeholder="Please describe the steps to reproduce the bug..." required rows="5" style={{padding: '15px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', resize: 'none', width: '100%'}}></textarea>
          <button type="submit" style={{padding: '15px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', width: '200px'}}>Submit Report</button>
        </form>
      </div>
    )
  }
};

const InfoPage = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();
  
  const page = contentData[pageId] || {
    title: 'Page Not Found',
    icon: AlertTriangle,
    color: '#64748b',
    content: <p>The page you are looking for does not exist.</p>
  };

  const Icon = page.icon;

  return (
    <div style={{minHeight: '80vh', padding: '60px 20px', background: '#f8fafc', fontFamily: 'Inter, sans-serif'}}>
      <div style={{maxWidth: '800px', margin: '0 auto'}}>
        
        <button 
          onClick={() => navigate(-1)} 
          style={{background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', cursor: 'pointer', fontWeight: 'bold', marginBottom: '40px', transition: '0.3s'}}
          onMouseOver={(e) => e.target.style.color = '#0ca6a6'}
          onMouseOut={(e) => e.target.style.color = '#64748b'}
        >
          <ArrowLeft size={20} /> Back
        </button>

        <div style={{background: 'white', borderRadius: '30px', padding: '60px', boxShadow: '0 20px 40px rgba(0,0,0,0.04)'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', paddingBottom: '30px', borderBottom: '1px solid #f1f5f9'}}>
            <div style={{width: '60px', height: '60px', borderRadius: '20px', background: `${page.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: page.color}}>
              <Icon size={30} />
            </div>
            <h1 style={{fontSize: '2.5rem', fontWeight: '900', color: '#1e293b', margin: 0}}>{page.title}</h1>
          </div>
          
          <div>
            {page.content}
          </div>
        </div>

      </div>
    </div>
  );
};

export default InfoPage;
