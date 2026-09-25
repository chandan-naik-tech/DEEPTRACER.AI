import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Database, Shield, Activity, HardDrive, FileText, Clock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSession } from '../context/SessionContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { sessions, addSession } = useSession();
  const [targetPath, setTargetPath] = useState('C:\\Users\\Demo\\Dataset');

  const startDemo = () => {
    const sessionId = Math.random().toString(36).substring(2, 8).toUpperCase();
    addSession({
      id: sessionId,
      target: targetPath,
      status: 'Analyzing',
      date: new Date().toLocaleDateString(),
      owner: user.name
    });
    navigate(`/app/analysis/${sessionId}?mode=demo`);
  };

  const displaySessions = user?.role === 'admin' 
    ? sessions 
    : sessions.filter(s => s.owner === user?.name);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Command Center</h1>
          <p style={{ color: 'var(--text-secondary)' }}>System overview and forensic intelligence operations.</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', padding: '1.5rem' }}>
          <div style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', padding: '1rem', borderRadius: '0.75rem', marginRight: '1rem' }}>
            <Activity size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>System Health</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)' }}>92%</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', padding: '1.5rem' }}>
          <div style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', padding: '1rem', borderRadius: '0.75rem', marginRight: '1rem' }}>
            <Database size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Deleted Files Recovered</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>8,492</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', padding: '1.5rem' }}>
          <div style={{ backgroundColor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '1rem', borderRadius: '0.75rem', marginRight: '1rem' }}>
            <HardDrive size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Storage Reclaimed</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>14.2 GB</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', padding: '1.5rem' }}>
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '0.75rem', marginRight: '1rem' }}>
            <Shield size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Threats Isolated</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--danger)' }}>12</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Left Column: Recent Scans */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
            <Clock size={20} style={{ marginRight: '0.5rem', color: 'var(--text-secondary)' }} /> Recent Sessions
          </h2>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <th style={{ paddingBottom: '0.75rem', fontWeight: 500 }}>Session ID</th>
                <th style={{ paddingBottom: '0.75rem', fontWeight: 500 }}>Target</th>
                <th style={{ paddingBottom: '0.75rem', fontWeight: 500 }}>Status</th>
                <th style={{ paddingBottom: '0.75rem', fontWeight: 500 }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {displaySessions.length > 0 ? (
                displaySessions.map((session, i) => (
                  <tr key={session.id} style={{ borderTop: i !== 0 ? '1px solid var(--border-color)' : 'none' }}>
                    <td style={{ padding: '1rem 0', fontWeight: 500 }}>{session.id}</td>
                    <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>
                      {session.target}
                      {user?.role === 'admin' && <div style={{ fontSize: '0.7rem', color: 'var(--primary-color)' }}>User: {session.owner}</div>}
                    </td>
                    <td style={{ padding: '1rem 0' }}>
                      <span style={{ 
                        color: session.status === 'Completed' ? 'var(--success)' : session.status.includes('Threats') ? 'var(--danger)' : 'var(--primary-color)', 
                        backgroundColor: session.status === 'Completed' ? 'rgba(34, 197, 94, 0.1)' : session.status.includes('Threats') ? 'rgba(239, 68, 68, 0.1)' : 'var(--primary-light)', 
                        padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 
                      }}>
                        {session.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{session.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No sessions found. Start a new analysis to see results here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: 500, cursor: 'pointer' }}>View All Sessions</button>
          </div>
        </div>

        {/* Right Column: Quick Actions & Demo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="card" style={{ padding: '1.5rem', border: '1px solid var(--primary-color)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
              <Play size={18} style={{ marginRight: '0.5rem', color: 'var(--primary-color)' }} /> 
              Quick Analysis
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Start a new AI-assisted digital forensics session.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>TARGET PATH</label>
                <input 
                  type="text" 
                  value={targetPath} 
                  onChange={(e) => setTargetPath(e.target.value)} 
                  className="input-field" 
                  placeholder="C:\..."
                />
              </div>
              <button className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center' }} onClick={startDemo}>
                START HACKATHON DEMO <Play size={16} style={{ marginLeft: '0.5rem' }} />
              </button>
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
              <AlertTriangle size={18} style={{ marginRight: '0.5rem', color: 'var(--warning)' }} /> 
              System Alerts
            </h2>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', borderLeft: '2px solid var(--warning)', paddingLeft: '1rem', marginBottom: '1rem' }}>
              <strong>Storage Warning:</strong> Volume D:\ is at 89% capacity. Consider running a duplicate file removal scan.
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', borderLeft: '2px solid var(--danger)', paddingLeft: '1rem' }}>
              <strong>Quarantine:</strong> 12 isolated files require admin review for deletion.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
