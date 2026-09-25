import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';

export default function SplashBootScreen({ onComplete }) {
  const { config } = useConfig();
  const [logs, setLogs] = useState([]);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const bootSequence = [
      "INITIALIZING NEURAL KERNEL...",
      "ESTABLISHING SECURE HANDSHAKE...",
      "LOADING FORENSIC ALGORITHMS...",
      "BYPASSING ENCRYPTION PROTOCOLS...",
      "SYSTEM ONLINE."
    ];

    let currentLog = 0;
    
    const interval = setInterval(() => {
      if (currentLog < bootSequence.length) {
        setLogs(prev => [...prev, bootSequence[currentLog]]);
        currentLog++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(onComplete, 500); // 500ms fade out
        }, 800); // Hold for 800ms before fading out
      }
    }, 400); // Add a log every 400ms

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: '#000000',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      opacity: isFadingOut ? 0 : 1,
      transition: 'opacity 0.5s ease',
      color: 'var(--primary-color)',
      fontFamily: 'monospace'
    }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Activity size={48} className="animate-spin" style={{ animation: 'spin 2s linear infinite' }} />
        <h1 className="brand-font" style={{ fontSize: '3rem', margin: 0 }}>{config.brandName}</h1>
      </div>
      
      <div style={{ 
        width: '600px', 
        height: '200px', 
        backgroundColor: 'rgba(0,255,136,0.05)', 
        border: '1px solid var(--primary-color)',
        padding: '1rem',
        borderRadius: '0.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        fontSize: '1.2rem',
        textAlign: 'left'
      }}>
        {logs.map((log, index) => (
          <div key={index} className="animate-fade-in" style={{ color: index === logs.length -1 && log.includes('ONLINE') ? '#10b981' : 'var(--primary-color)' }}>
            &gt; {log}
          </div>
        ))}
        {logs.length < 5 && (
          <div className="animate-pulse" style={{ color: 'var(--primary-color)' }}>_</div>
        )}
      </div>
    </div>
  );
}
