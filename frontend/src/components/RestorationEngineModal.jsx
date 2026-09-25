import React, { useEffect, useState } from 'react';
import { X, Cpu, CheckCircle } from 'lucide-react';

export default function RestorationEngineModal({ actionType, onClose }) {
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const sequence = [
      { text: `[SYSTEM] Initializing AI Restoration Engine for ${actionType}...`, delay: 500 },
      { text: "[NEURAL_NET] Loading fragment matching heuristic models...", delay: 1000 },
      { text: "[SCANNER] Deep-scanning physical sectors for residual data fragments...", delay: 1500 },
      { text: "0x8F2A: Found orphaned header block.", delay: 2000 },
      { text: "0x9B1C: Found fragmented payload block.", delay: 2300 },
      { text: "[AI_STITCHING] Aligning hexadecimal fragments via predictive model...", delay: 3000 },
      { text: ">>> MATCH FOUND: Probability 99.8%", delay: 3500 },
      { text: "[RECONSTRUCTION] Rebuilding file signatures...", delay: 4000 },
      { text: "[SYSTEM] Integrity check passed. File successfully restored.", delay: 4500 },
    ];

    let timeouts = [];

    sequence.forEach((item, index) => {
      const timeout = setTimeout(() => {
        setLogs(prev => [...prev, item.text]);
        setProgress(Math.floor(((index + 1) / sequence.length) * 100));
        
        if (index === sequence.length - 1) {
          setIsComplete(true);
        }
      }, item.delay);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [actionType]);

  const hexLines = Array.from({ length: 8 }).map((_, i) => {
    return Array.from({ length: 8 }).map(() => Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()).join(' ');
  });

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        backgroundColor: '#0f172a',
        width: '100%', maxWidth: '700px',
        borderRadius: '0.5rem',
        border: '1px solid var(--primary-color)',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Header */}
        <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
            <Cpu size={20} />
            <span className="brand-font" style={{ fontWeight: 600 }}>AI NEURAL RECONSTRUCTION ENGINE</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem', fontFamily: 'monospace', color: '#10b981', display: 'flex', gap: '2rem' }}>
          
          {/* Visual Hex Simulation */}
          <div style={{ flex: 1, backgroundColor: '#020617', padding: '1rem', borderRadius: '0.25rem', fontSize: '0.75rem', opacity: isComplete ? 0.5 : 1 }}>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>MEMORY_SECTOR_DUMP</div>
            {hexLines.map((line, i) => (
              <div key={i} style={{ marginBottom: '0.25rem', color: Math.random() > 0.7 ? 'var(--primary-color)' : '#10b981' }}>
                0x{(1000 + i * 16).toString(16).toUpperCase()}: {line}
              </div>
            ))}
            {!isComplete && <div className="animate-pulse" style={{ marginTop: '1rem', color: 'var(--primary-color)' }}>PROCESSING FRAGMENTS...</div>}
          </div>

          {/* Terminal Logs */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, overflowY: 'auto', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {logs.map((log, index) => (
                <div key={index} style={{ color: log.includes('SYSTEM') ? 'var(--primary-color)' : log.includes('MATCH') ? '#3b82f6' : '#10b981' }}>
                  {log}
                </div>
              ))}
            </div>
            
            {/* Progress Bar */}
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                <span>{progress}% COMPLETED</span>
              </div>
              <div style={{ height: '4px', backgroundColor: '#1e293b', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progress}%`, backgroundColor: 'var(--primary-color)', transition: 'width 0.3s ease' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        {isComplete && (
          <div className="animate-fade-in" style={{ padding: '1rem', backgroundColor: '#1e293b', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--success)', fontWeight: 600, marginBottom: '1rem' }}>
              <CheckCircle size={20} /> RESTORATION SUCCESSFUL
            </div>
            <button className="btn btn-primary" onClick={onClose}>Acknowledge</button>
          </div>
        )}
      </div>
    </div>
  );
}
