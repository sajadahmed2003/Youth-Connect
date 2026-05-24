import React, { useState, useEffect } from 'react';

const IntroSplash = ({ onComplete }) => {
    const [phase, setPhase] = useState(0);
    const [visibleQuote, setVisibleQuote] = useState(0);

    const systemMessages = [
        "Synchronizing Youth Connect Grid...",
        "Establishing Secure Real Database Stream...",
        "Fetching Active Campaigns...",
        "System Ready. Welcome."
    ];

    const introQuotes = [
        "Change starts with a single person.",
        "Small acts, when multiplied by millions, transform the world.",
        "Building a better tomorrow, together.",
        "Empowering youth to drive global change.",
        "Connecting passion with purpose."
    ];

    useEffect(() => {
        const sysInterval = setInterval(() => {
            setPhase(prev => (prev < systemMessages.length - 1 ? prev + 1 : prev));
        }, 1200);

        const quoteInterval = setInterval(() => {
            setVisibleQuote(prev => (prev + 1) % introQuotes.length);
        }, 2200);

        const timer = setTimeout(() => {
            onComplete();
        }, 5500); // Optimized for faster cinematic load

        return () => {
            clearInterval(sysInterval);
            clearInterval(quoteInterval);
            clearTimeout(timer);
        };
    }, [systemMessages.length, introQuotes.length, onComplete]);

    return (
        <div style={{
            height: '100vh', width: '100%', background: '#ffffff', // Clean white background for light mode
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', position: 'fixed', top: 0, left: 0, zIndex: 10000,
            fontFamily: 'var(--font-body)'
        }}>

            {/* 🌌 DYNAMIC LIGHT METEOR SHARDS IN THE BACKGROUND */}
            <div className="bg-decor" style={{
                position: 'absolute', width: '100%', height: '100%',
                top: 0, left: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1
            }}>
                <div style={{
                    position: 'absolute', width: '350px', height: '350px',
                    borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)',
                    top: '15%', left: '10%', animation: 'floatDecor 8s infinite alternate'
                }} />
                <div style={{
                    position: 'absolute', width: '300px', height: '300px',
                    borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 70%)',
                    bottom: '15%', right: '10%', animation: 'floatDecor 10s infinite alternate-reverse'
                }} />
            </div>

            {/* 🛸 MASTER BRANDING PORTAL */}
            <div className="splash-card" style={{
                background: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '32px',
                padding: '60px 80px',
                border: '1px solid rgba(124, 58, 237, 0.12)',
                boxShadow: '0 20px 60px rgba(124, 58, 237, 0.06), 0 0 0 1px rgba(124, 58, 237, 0.02)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                position: 'relative',
                animation: 'scaleInSplash 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>

                {/* LOGO GRID GROUP (MATCHING EXACTLY THE USER REQUESTED BRAND LOGO SCREENSHOT) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '28px', marginBottom: '36px' }}>
                    {/* Rounded Purple lightning bolt icon */}
                    <div style={{
                        width: '90px',
                        height: '90px',
                        background: '#7c3aed', // Beautiful purple background from screenshot
                        borderRadius: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 30px rgba(124, 58, 237, 0.35)',
                        animation: 'logoPopAndPulse 2.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite alternate',
                        position: 'relative'
                    }}>
                        {/* Glowing ring */}
                        <div style={{
                            position: 'absolute', inset: '-4px', borderRadius: '28px',
                            border: '2px solid rgba(124, 58, 237, 0.3)',
                            animation: 'expandRing 2.5s infinite ease-out'
                        }} />
                        
                        {/* ⚡ lightning bolt */}
                        <span style={{ 
                            fontSize: '3rem', 
                            transform: 'skewX(-10deg)', 
                            color: '#facc15', 
                            filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.18))',
                            display: 'inline-block',
                            animation: 'boltFlicker 3s infinite alternate'
                        }}>⚡</span>
                    </div>

                    {/* Logo text side with animated mask slide-in */}
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.05', textAlign: 'left' }}>
                        <span style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '2.4rem',
                            fontWeight: '900',
                            color: '#0f172a', // Clean slate-900 for modern light mode
                            letterSpacing: '1.5px',
                            textTransform: 'uppercase',
                            animation: 'slideRight 0.6s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both'
                        }}>
                            YOUTH
                        </span>
                        <span style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '2.4rem',
                            fontWeight: '900',
                            color: '#06b6d4', // Premium cyan
                            letterSpacing: '1.5px',
                            textTransform: 'uppercase',
                            animation: 'slideRight 0.6s 0.35s cubic-bezier(0.16, 1, 0.3, 1) both'
                        }}>
                            CONNECT
                        </span>
                    </div>
                </div>

                {/* FLOATING TEXT BLOCK */}
                <div key={visibleQuote} style={{
                    minHeight: '44px',
                    textAlign: 'center',
                    color: '#64748b',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    maxWidth: '400px',
                    lineHeight: '1.5',
                    animation: 'quoteInSplash 2.2s forwards'
                }}>
                    "{introQuotes[visibleQuote]}"
                </div>

                {/* 📑 PROGRESS LOADER */}
                <div style={{ marginTop: '36px', width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ color: '#94a3b8', fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                        {systemMessages[phase]}
                    </div>
                    <div style={{ width: '100%', height: '5px', background: 'rgba(0,0,0,0.04)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                        <div style={{
                            height: '100%',
                            width: `${((phase + 1) / systemMessages.length) * 100}%`,
                            background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                            transition: 'width 0.6s ease-in-out',
                            boxShadow: '0 0 10px rgba(6,182,212,0.4)'
                        }}></div>
                    </div>
                </div>

            </div>

            <style>{`
                @keyframes scaleInSplash {
                    from { transform: scale(0.95); opacity: 0; filter: blur(4px); }
                    to { transform: scale(1); opacity: 1; filter: blur(0); }
                }
                @keyframes logoPopAndPulse {
                    0% { transform: scale(0.9) rotate(-3deg); }
                    100% { transform: scale(1.05) rotate(3deg); }
                }
                @keyframes expandRing {
                    0% { transform: scale(0.9); opacity: 0.8; }
                    100% { transform: scale(1.2); opacity: 0; }
                }
                @keyframes boltFlicker {
                    0%, 100% { filter: drop-shadow(0 2px 5px rgba(250, 204, 21, 0.4)); }
                    50% { filter: drop-shadow(0 4px 15px rgba(250, 204, 21, 0.7)); }
                }
                @keyframes slideRight {
                    from { transform: translateX(-20px); opacity: 0; filter: blur(4px); }
                    to { transform: translateX(0); opacity: 1; filter: blur(0); }
                }
                @keyframes quoteInSplash {
                    0% { opacity: 0; transform: translateY(8px); filter: blur(4px); }
                    15% { opacity: 1; transform: translateY(0); filter: blur(0); }
                    85% { opacity: 1; transform: translateY(0); filter: blur(0); }
                    100% { opacity: 0; transform: translateY(-8px); filter: blur(4px); }
                }
                @keyframes floatDecor {
                    0% { transform: translateY(0) scale(1); }
                    100% { transform: translateY(-30px) scale(1.15); }
                }
            `}</style>
        </div>
    );
};

export default IntroSplash;
