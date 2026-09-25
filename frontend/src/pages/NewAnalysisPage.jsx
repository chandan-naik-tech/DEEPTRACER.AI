import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, FolderSearch, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSession } from '../context/SessionContext';

export default function NewAnalysisPage() {
  const [targetPath, setTargetPath] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addSession } = useSession();

  const handleStart = (e) => {
    e.preventDefault();
    if (!targetPath.trim()) {
      setError('Please enter a target file or directory path.');
      return;
    }

    const sessionId = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Add to global session tracker
    addSession({
      id: sessionId,
      target: targetPath,
      status: 'Analyzing',
      date: new Date().toLocaleDateString(),
      owner: user.name
    });

    // Navigate to visual pipeline
    navigate(`/app/analysis/${sessionId}`);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="brand-font" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Start New Analysis</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Configure the parameters for your next forensic deep scan.</p>
      </div>

      <div className="glass-card" style={{ padding: '2rem', borderRadius: '1rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', color: 'var(--primary-color)' }}>
          <div style={{ backgroundColor: 'var(--primary-light)', padding: '1rem', borderRadius: '0.75rem' }}>
            <FolderSearch size={32} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Target Configuration</h2>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Specify the drive, directory, or file you want to investigate.</div>
          </div>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleStart}>
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.75rem' }}>
              Target Path
            </label>
            <input 
              type="text" 
              placeholder="e.g., C:\Users\Admin\Suspicious_Files or /mnt/data/logs"
              value={targetPath}
              onChange={(e) => { setTargetPath(e.target.value); setError(''); }}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontFamily: 'monospace'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/app/dashboard')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Shield size={18} /> Begin Forensic Scan
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
