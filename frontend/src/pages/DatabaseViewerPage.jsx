import React, { useState, useEffect } from 'react';
import { Database, Terminal, ShieldAlert, Activity, RefreshCw } from 'lucide-react';

export default function DatabaseViewerPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = () => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/logs`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLogs(data.logs);
          setError(null);
        } else {
          setError(data.error || 'Failed to fetch logs');
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="animate-fade-in" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)' }}>
          <Database className="icon" style={{ color: 'var(--primary-color)' }} />
          SQL Audit Logs [forensic_logs]
        </h1>
        <button className="btn btn-secondary" onClick={fetchLogs} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh Data
        </button>
      </div>

      {error && (
        <div className="card" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', marginBottom: '2rem' }}>
          <ShieldAlert size={24} style={{ marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Connection Error</h3>
          <p>{error}</p>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Terminal size={16} style={{ color: 'var(--text-secondary)' }} />
          <span style={{ fontFamily: 'monospace', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>SELECT * FROM forensic_logs ORDER BY timestamp DESC;</span>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>ID</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>TIMESTAMP</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>USER</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>TARGET_PATH</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>STATUS</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>FILES</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>DUPLICATES</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>DAMAGED</th>
              </tr>
            </thead>
            <tbody>
              {loading && logs.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <Activity className="spin" size={24} style={{ margin: '0 auto 1rem auto' }} />
                    Querying Database...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No records found in forensic_logs.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>#{log.id}</td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{new Date(log.timestamp).toLocaleString()}</td>
                    <td style={{ padding: '1rem', fontWeight: 500 }}>{log.user}</td>
                    <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{log.target_path}</td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: log.status.includes('Failed') ? 'var(--danger)' : '#10b981' }}>{log.status}</td>
                    <td style={{ padding: '1rem', color: 'var(--primary-color)', fontWeight: 600 }}>{log.files_analyzed}</td>
                    <td style={{ padding: '1rem', color: '#f59e0b', fontWeight: 600 }}>{log.duplicates_found}</td>
                    <td style={{ padding: '1rem', color: 'var(--danger)', fontWeight: 600 }}>{log.damaged_found}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
