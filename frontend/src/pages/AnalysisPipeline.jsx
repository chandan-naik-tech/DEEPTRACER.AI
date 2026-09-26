import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { 
  CheckCircle2, Circle, Loader2, FileSearch, Database, Shield, Fingerprint, Activity, Trash2, DatabaseBackup
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

const mockTableData = [
  { file: 'evidence_photo.jpg', type: 'Image', status: 'Fully Reconstructed', integrity: '100%', threat: 'Safe (0/100)', priority: 'Medium', duplicate: 'NO' },
  { file: 'invoice.pdf', type: 'PDF', status: 'Fully Reconstructed', integrity: '94%', threat: 'No strong indicator (3/100)', priority: 'High', duplicate: 'NO' },
  { file: 'update.exe', type: 'Executable', status: 'Partially Reconstructed', integrity: '62%', threat: 'Potentially Malicious (87/100)', priority: 'Critical', duplicate: 'NO' },
  { file: 'notes_copy.txt', type: 'Text', status: 'Duplicate', integrity: '100%', threat: 'Safe (0/100)', priority: 'Low', duplicate: 'YES' },
  { file: 'damaged_archive.zip', type: 'Archive', status: 'Corrupted', integrity: '41%', threat: 'Suspicious (18/100)', priority: 'High', duplicate: 'NO' }
];

export default function AnalysisPipeline() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isDemo = searchParams.get('mode') === 'demo';
  const { config } = useConfig();
  const { sessions, updateSession, updateSessionStatus } = useSession();
  
  const currentSession = sessions.find(s => s.id === id);

  const tableDataToRender = currentSession?.scanResults?.filesList || mockTableData;

  const [currentStage, setCurrentStage] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState('idle'); // 'idle' | 'running' | 'done'
  const [recoverStatus, setRecoverStatus] = useState('idle'); // 'idle' | 'running' | 'done'

  // Trigger backend scan
  useEffect(() => {
    if (!currentSession) return;
    
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetPath: currentSession.target, user: currentSession.owner })
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

  const handleDeleteDuplicates = async () => {
    if (!currentSession) return;
    setDeleteStatus('running');
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/remediate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetPath: currentSession.target, action: 'delete_duplicates' })
      });
      // Optionally update the local session state to reflect 0 duplicates remaining
      updateSession(id, { scanResults: { ...currentSession.scanResults, duplicatesFound: 0 } });
      setDeleteStatus('done');
    } catch (e) {
      console.error(e);
      setDeleteStatus('idle');
    }
  };

  const handleRecoverDeleted = async () => {
    if (!currentSession) return;
    setRecoverStatus('running');
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/remediate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetPath: currentSession.target, action: 'recover_deleted' })
      });
      setRecoverStatus('done');
    } catch (e) {
      console.error(e);
      setRecoverStatus('idle');
    }
  };

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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          
          <div className="card">
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Files Found</h3>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>
              {isComplete ? (currentSession?.scanResults?.filesAnalyzed || 0).toLocaleString() : Math.floor(Math.random() * 5000 + 5000).toLocaleString()}
            </div>
          </div>
          
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Duplicates</h3>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b' }}>
                {isComplete ? (currentSession?.scanResults?.duplicatesFound || 0) : currentStage > 6 ? Math.floor(Math.random() * 100) : '...'}
              </div>
            </div>
            {isComplete && (currentSession?.scanResults?.duplicatesFound > 0 || deleteStatus === 'done') && (
              <button 
                onClick={handleDeleteDuplicates}
                disabled={deleteStatus !== 'idle'}
                className="btn btn-secondary" 
                style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.5rem', fontSize: '0.875rem', backgroundColor: deleteStatus === 'done' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: deleteStatus === 'done' ? 'var(--success)' : '#f59e0b', border: 'none' }}
              >
                {deleteStatus === 'idle' && <><Trash2 size={16} /> Delete Duplicates</>}
                {deleteStatus === 'running' && <Loader2 size={16} className="animate-spin" />}
                {deleteStatus === 'done' && <><CheckCircle2 size={16} /> Duplicates Deleted!</>}
              </button>
            )}
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Damaged Data</h3>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--danger)' }}>
              {isComplete ? (currentSession?.scanResults?.damagedFound || 0) : currentStage > 4 ? Math.floor(Math.random() * 50) : '...'}
            </div>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Deleted Files</h3>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--info)' }}>
                {isComplete ? 3 : currentStage > 2 ? Math.floor(Math.random() * 20) : '...'}
              </div>
            </div>
            {isComplete && (
              <button 
                onClick={handleRecoverDeleted}
                disabled={recoverStatus !== 'idle'}
                className="btn btn-secondary" 
                style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.5rem', fontSize: '0.875rem', backgroundColor: recoverStatus === 'done' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)', color: recoverStatus === 'done' ? 'var(--success)' : 'var(--info)', border: 'none' }}
              >
                {recoverStatus === 'idle' && <><DatabaseBackup size={16} /> Restore Files</>}
                {recoverStatus === 'running' && <Loader2 size={16} className="animate-spin" />}
                {recoverStatus === 'done' && <><CheckCircle2 size={16} /> Fully Restored!</>}
              </button>
            )}
          </div>

        </div>

        {/* Table Area */}
        <div className="card" style={{ flex: 1, minHeight: '300px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Scan Results</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Source: {currentSession?.target || 'synthetic_demo.raw'} | Scan ID: {id}</p>
            </div>
            {isComplete && (
              <button className="btn btn-secondary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                EXPORT JSON
              </button>
            )}
          </div>
          
          {isComplete ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '1rem 0.5rem' }}>File</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Type</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Status</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Integrity</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Threat</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Priority</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Duplicate</th>
                  </tr>
                </thead>
                <tbody>
                  {tableDataToRender.map((row, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', backgroundColor: row.priority === 'Critical' ? 'rgba(239, 68, 68, 0.1)' : 'transparent' }}>
                      <td style={{ padding: '1rem 0.5rem' }}>{row.file}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>{row.type}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>{row.status}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>{row.integrity}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>{row.threat}</td>
                      <td style={{ padding: '1rem 0.5rem', color: row.priority === 'Critical' ? 'var(--danger)' : row.priority === 'High' ? 'var(--warning)' : row.priority === 'Medium' ? 'var(--info)' : 'var(--text-secondary)' }}>{row.priority}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>{row.duplicate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
