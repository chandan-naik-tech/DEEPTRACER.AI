import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { 
  CheckCircle2, Circle, Loader2, FileSearch, Database, Shield, Fingerprint, Activity 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useConfig } from '../context/ConfigContext';
import { useSession } from '../context/SessionContext';

const PIPELINE_STAGES = [
  "RAW DATA",
  "SCAN DATA",
  "FRAGMENT DETECTION",
  "FILE TYPE / METADATA",
  "FRAGMENT MATCHING",
  "FILE RECONSTRUCTION",
  "INTEGRITY CHECK",
  "THREAT ANALYSIS",
  "AI CLASSIFIER",
  "EVIDENCE PRIORITY",
  "RESULT"
];

const mockChartData = [
  { name: 'Normal', value: 8900 },
  { name: 'Duplicates', value: 1294 },
  { name: 'Damaged', value: 237 },
  { name: 'Suspicious', value: 43 },
  { name: 'Threats', value: 12 }
];

export default function AnalysisPipeline() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isDemo = searchParams.get('mode') === 'demo';
  const { config } = useConfig();
  const { sessions, updateSession, updateSessionStatus } = useSession();
  
  const currentSession = sessions.find(s => s.id === id);

  const [currentStage, setCurrentStage] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Trigger backend scan
  useEffect(() => {
    if (!currentSession) return;
    
    fetch('http://localhost:3001/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetPath: currentSession.target })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        updateSession(id, { scanResults: data });
      }
    })
    .catch(console.error);
  }, [id]);

  // Simulate pipeline progress visually
  useEffect(() => {
    if (currentStage < PIPELINE_STAGES.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStage(prev => prev + 1);
      }, 1500); // 1.5s per stage
      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
      updateSessionStatus(id, 'Completed');
    }
  }, [currentStage]);

  const healthScore = isComplete ? 78 : Math.floor(Math.random() * 20 + 20);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', gap: '2rem', minHeight: 'calc(100vh - 128px)' }}>
      {/* Pipeline Sidebar */}
      <div className="card" style={{ width: '300px', flexShrink: 0 }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={20} color="var(--primary-color)" /> Analysis Pipeline
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {PIPELINE_STAGES.map((stage, idx) => {
            const isDone = idx < currentStage;
            const isCurrent = idx === currentStage;
            const isPending = idx > currentStage;

            return (
              <div key={stage} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem',
                opacity: isPending ? 0.5 : 1,
                transition: 'all 0.3s ease'
              }}>
                <div style={{ color: isDone ? 'var(--success)' : isCurrent ? 'var(--info)' : 'var(--text-secondary)' }}>
                  {isDone ? <CheckCircle2 size={24} /> : isCurrent ? <Loader2 size={24} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> : <Circle size={24} />}
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>STEP {(idx + 1).toString().padStart(2, '0')}</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: isCurrent ? 700 : 500, color: isCurrent ? 'var(--primary-color)' : 'inherit' }}>
                    {stage}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Results Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              {isComplete ? 'Analysis Complete' : `Running: ${PIPELINE_STAGES[currentStage]}`}
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Session ID: {id} {isDemo && <span style={{ color: 'var(--warning)', fontWeight: 600, marginLeft: '1rem' }}>(DEMO DATASET)</span>}
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{config.healthScoreLabel}</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: healthScore > 70 ? 'var(--success)' : 'var(--warning)' }}>
              {healthScore}/100
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          
          <div className="card">
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Files Found</h3>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>
              {isComplete ? (currentSession?.scanResults?.filesAnalyzed || 0).toLocaleString() : Math.floor(Math.random() * 5000 + 5000).toLocaleString()}
            </div>
          </div>
          
          <div className="card">
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Duplicates</h3>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b' }}>
              {isComplete ? (currentSession?.scanResults?.duplicatesFound || 0) : currentStage > 6 ? Math.floor(Math.random() * 100) : '...'}
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Damaged Data</h3>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--danger)' }}>
              {isComplete ? (currentSession?.scanResults?.damagedFound || 0) : currentStage > 4 ? Math.floor(Math.random() * 50) : '...'}
            </div>
          </div>

        </div>

        {/* Chart Area */}
        <div className="card" style={{ flex: 1, minHeight: '300px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Classification Summary</h3>
          {isComplete ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{ fill: 'var(--bg-primary)' }} />
                <Bar dataKey="value" fill="var(--primary-color)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              Awaiting data from pipeline...
            </div>
          )}
        </div>

      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
