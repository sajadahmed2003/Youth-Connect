import React, { useState, useEffect } from 'react';
import { Zap, ShieldCheck, Globe, Target, Cpu } from 'lucide-react';

const IntroSplash = ({ onComplete }) => {
    const [phase, setPhase] = useState(0);
    const [visibleQuote, setVisibleQuote] = useState(0);

    // Path to the image in the public folder
    const logoPlate = "/mission_logos.png";

    const systemMessages = [
        "INITIALIZING NEURAL HANDSHAKE...",
        "SYNCING GLOBAL OPTIC NODES...",
        "BYPASSING LEGACY PROTOCOLS...",
        "CONNECTING COMMAND CENTER..."
    ];

    const missionQuotes = [
        "The power of the grid lies in the strength of its nodes.",
        "Small acts, when multiplied by millions, transform the world.",
        "Global Empathy Protocols: INITIATED",
        "Humanity: Optimized for Maximum Impact.",
        "Connection is the ultimate weapon for change."
    ];

    useEffect(() => {
        const sysInterval = setInterval(() => {
            setPhase(prev => (prev < systemMessages.length - 1 ? prev + 1 : prev));
        }, 1800);

        const quoteInterval = setInterval(() => {
            setVisibleQuote(prev => (prev + 1) % missionQuotes.length);
        }, 2500);

        const timer = setTimeout(() => {
            onComplete();
        }, 9500);

        return () => {
            clearInterval(sysInterval);
            clearInterval(quoteInterval);
            clearTimeout(timer);
        };
    }, [systemMessages.length, missionQuotes.length, onComplete]);

    return (
        <div style={{
            height: '100vh', width: '100%', background: '#060a13',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', position: 'fixed', top: 0, left: 0, zIndex: 10000
        }}>

            {/* 🌌 DEEP SPACE BACKGROUND */}
            <div className="neural-bg" style={{ position: 'absolute', inset: 0, opacity: 0.2, zIndex: 1 }}></div>

            {/* 🛸 MASTER BRANDING CENTER */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '1000px', height: '600px', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                {/* FLOATING HOLOGRAPHIC LOGO PLATES */}
                <div className="animate-float" style={{ position: 'absolute', top: '5%', left: '10%', animationDelay: '0s' }}>
                    <div style={{ width: '120px', height: '120px', overflow: 'hidden', borderRadius: '20px', border: '1px solid rgba(12,166,166,0.3)', boxShadow: '0 0 30px rgba(12,166,166,0.2)', background: 'rgba(0,0,0,0.5)' }}>
                        <img src={logoPlate} style={{ width: '250%', transform: 'translate(-5%, -5%)' }} />
                    </div>
                    <div style={{ color: '#0ca6a6', fontSize: '0.6rem', textAlign: 'center', marginTop: '10px', fontWeight: 'bold', letterSpacing: '2px' }}>NODE_CORE</div>
                </div>

                <div className="animate-float" style={{ position: 'absolute', top: '60%', right: '10%', animationDelay: '1.5s' }}>
                    <div style={{ width: '140px', height: '140px', overflow: 'hidden', borderRadius: '20px', border: '1px solid rgba(74,222,128,0.3)', boxShadow: '0 0 30px rgba(74,222,128,0.2)', background: 'rgba(0,0,0,0.5)' }}>
                        <img src={logoPlate} style={{ width: '250%', transform: 'translate(-55%, -5%)' }} />
                    </div>
                    <div style={{ color: '#4ade80', fontSize: '0.6rem', textAlign: 'center', marginTop: '10px', fontWeight: 'bold', letterSpacing: '2px' }}>ECO_LINK</div>
                </div>

                <div className="animate-float" style={{ position: 'absolute', top: '15%', right: '15%', animationDelay: '0.8s' }}>
                    <div style={{ width: '110px', height: '110px', overflow: 'hidden', borderRadius: '20px', border: '1px solid rgba(59,130,246,0.3)', boxShadow: '0 0 30px rgba(59,130,246,0.2)', background: 'rgba(0,0,0,0.5)' }}>
                        <img src={logoPlate} style={{ width: '250%', transform: 'translate(-5%, -55%)' }} />
                    </div>
                    <div style={{ color: '#3b82f6', fontSize: '0.6rem', textAlign: 'center', marginTop: '10px', fontWeight: 'bold', letterSpacing: '2px' }}>MED_PULSE</div>
                </div>

                {/* Pulsating Hexagon Backframe */}
                <div style={{
                    position: 'absolute', width: '380px', height: '380px',
                    border: '1px solid rgba(12, 166, 166, 0.1)',
                    borderRadius: '30px', transform: 'rotate(45deg)',
                    animation: 'pulseScale 4s infinite ease-in-out'
                }} />

                {/* MAIN LOGO NODE */}
                <div className="animate-float" style={{ textAlign: 'center', zIndex: 10 }}>
                    <Zap size={140} color="#0ca6a6" fill="#0ca6a6" style={{ filter: 'drop-shadow(0 0 50px #0ca6a6)', marginBottom: '15px' }} className="neon-flicker" />

                    <div style={{ marginTop: '10px' }}>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', fontWeight: '900', letterSpacing: '14px', textTransform: 'uppercase', marginBottom: '-5px' }}>CAMPAIGN</div>
                        <div className="neon-text-main" style={{
                            color: 'white', fontSize: '5rem', fontWeight: '900', letterSpacing: '5px',
                            textShadow: '0 0 10px #0ca6a6, 0 0 20px #0ca6a6, 0 0 50px #4ade80',
                            animation: 'flicker 3s infinite alternate'
                        }}>CONNECT</div>
                    </div>
                </div>

                {/* QUOTE OVERLAY */}
                <div key={visibleQuote} style={{
                    position: 'absolute', bottom: '-40px', width: '100%', textAlign: 'center',
                    color: '#4ade80', fontSize: '0.85rem', fontWeight: '600', letterSpacing: '3px',
                    fontFamily: 'monospace', animation: 'quoteIn 2.5s forwards', opacity: 0.8
                }}>
                    &lt; {missionQuotes[visibleQuote]} &gt;
                </div>

                {/* EXTRA ORBITING DEBRIS */}
                <div className="orbit-node" style={{ position: 'absolute', top: '75%', left: '5%', animation: 'float 3.5s infinite ease-in-out' }}><Cpu size={35} color="#f59e0b" /></div>
                <div className="orbit-node" style={{ position: 'absolute', top: '5%', right: '40%', animation: 'float 6s infinite ease-in-out' }}><target size={25} color="#ef4444" /></div>
            </div>

            {/* 📑 SYSTEM STATUS BAR */}
            <div style={{ zIndex: 3, marginTop: '120px', textAlign: 'center' }}>
                <div style={{ color: '#0ca6a6', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '8px', textTransform: 'uppercase' }}>
                    {systemMessages[phase]}
                </div>
                <div style={{ width: '400px', height: '3px', background: 'rgba(255,255,255,0.03)', marginTop: '20px', borderRadius: '10px', overflow: 'hidden', padding: '1px' }}>
                    <div style={{ height: '100%', width: `${((phase + 1) / systemMessages.length) * 100}%`, background: 'linear-gradient(90deg, #0ca6a6, #4ade80)', transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 0 20px #4ade80' }}></div>
                </div>
            </div>

            <style>{`
            @keyframes pulseScale {
                0%, 100% { transform: rotate(45deg) scale(0.95); opacity: 0.1; }
                50% { transform: rotate(45deg) scale(1.15); opacity: 0.25; }
            }
            @keyframes flicker {
                0%, 18%, 22%, 25%, 53%, 57%, 100% { text-shadow: 0 0 10px #0ca6a6, 0 0 20px #0ca6a6, 0 0 40px #4ade80, 0 0 60px #0ca6a6; }
                20%, 24%, 55% { text-shadow: none; opacity: 0.8; }
            }
            @keyframes quoteIn {
                0% { opacity: 0; transform: translateY(15px); filter: blur(8px); }
                20% { opacity: 1; transform: translateY(0); filter: blur(0); }
                80% { opacity: 1; transform: translateY(0); filter: blur(0); }
                100% { opacity: 0; transform: translateY(-15px); filter: blur(8px); }
            }
            .animate-float { animation: float 6s infinite ease-in-out; }
            .neon-flicker { animation: flicker 4s infinite alternate; }
            .orbit-node { opacity: 0.4; filter: blur(1px); }
        `}</style>
        </div>
    );
};

export default IntroSplash;
