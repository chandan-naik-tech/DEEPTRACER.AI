import React, { useState } from 'react';
import { Download, FileText, CheckCircle, Wrench, Trash2, ShieldAlert, Loader2, DatabaseBackup } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';
import { useSession } from '../context/SessionContext';
import RestorationEngineModal from '../components/RestorationEngineModal';

export default function ReportPage() {
  const { config } = useConfig();
  const { sessions } = useSession();
  const recentSession = sessions[0]; // Get the most recent session
  const [remediationState, setRemediationState] = useState({
    recover: { status: 'idle' },
    repair: { status: 'idle' }, // idle | running | done
    duplicate: { status: 'idle' },
    quarantine: { status: 'idle' }
  });
  
  const [activeModal, setActiveModal] = useState(null); // 'recover' | 'repair' | null

  const handleAction = async (type) => {
    if (type === 'recover' || type === 'repair') {
      setActiveModal(type);
      return;
    }
    
    setRemediationState(prev => ({ ...prev, [type]: { status: 'running' } }));
    
    if (type === 'duplicate') {
      try {
        await fetch('http://localhost:3001/api/remediate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetPath: recentSession?.target || 'C:\\Users\\ASUS\\Desktop\\deep_tracer_demo_dataset', action: 'delete_duplicates' })
        });
      } catch (e) { console.error(e); }
    }
    
    setRemediationState(prev => ({ ...prev, [type]: { status: 'done' } }));
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Reports & Exports</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Generate professional forensic reports from analysis sessions.</p>
        </div>
        <button className="btn btn-primary">
          <Download size={18} style={{ marginRight: '0.5rem' }} /> Export PDF
        </button>
      </div>

      <div className="card" style={{ padding: '3rem', borderTop: '4px solid var(--primary-color)' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem' }}>
          <h2 className="brand-font" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-color)' }}>{config.brandName}</h2>
          <div style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '0.5rem' }}>OFFICIAL FORENSIC SUMMARY</div>
          <div style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.875rem' }}>
            Generated on: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              SYSTEM SUMMARY
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem', lineHeight: '2' }}>
              <li><strong>Session ID:</strong> demo-1234</li>
              <li><strong>Data Path:</strong> C:\Users\Demo\Dataset</li>
              <li><strong>Total Files:</strong> 12,842</li>
              <li><strong>Total Size:</strong> 186.4 GB</li>
            </ul>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              FINDINGS SUMMARY
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem', lineHeight: '2' }}>
              <li><strong>Duplicates:</strong> 1,294 (14.7 GB)</li>
              <li><strong>Damaged Files:</strong> 237</li>
              <li><strong>Suspicious Files:</strong> 43</li>
              <li><strong style={{ color: 'var(--danger)' }}>Threat Indicators:</strong> 12</li>
            </ul>
          </div>
        </div>

        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            AI CLASSIFICATION SUMMARY
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            The AI engine prioritized evidence based on structural matching, integrity checks, and known threat heuristics.
          </p>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div style={{ flex: 1, backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: '0.5rem' }}>
              <div style={{ fontWeight: 600, color: 'var(--success)' }}>HIGH CONFIDENCE RECOVERIES</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>891</div>
            </div>
            <div style={{ flex: 1, backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: '0.5rem' }}>
              <div style={{ fontWeight: 600, color: 'var(--warning)' }}>PARTIAL RECOVERIES</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>163</div>
            </div>
          </div>
        </div>

        {/* --- REMEDIATION ACTION CENTER --- */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
            <Wrench size={20} style={{ marginRight: '0.5rem', color: 'var(--primary-color)' }} /> 
            Action Center
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Take immediate corrective action based on the forensic findings. Operations are logged for audit compliance.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Recover Deleted Action */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem', borderRadius: '0.25rem', color: '#10b981', marginRight: '1rem' }}>
                  <DatabaseBackup size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>Recover Deleted Data</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Use neural reconstruction to recover 8,492 deleted files.</div>
                </div>
              </div>
              <button 
                className={`btn ${remediationState.recover.status === 'done' ? 'btn-secondary' : 'btn-primary'}`}
                onClick={() => handleAction('recover')}
                disabled={remediationState.recover.status !== 'idle'}
                style={{ width: '150px', display: 'flex', justifyContent: 'center', backgroundColor: remediationState.recover.status === 'idle' ? '#10b981' : undefined }}
              >
                {remediationState.recover.status === 'idle' && 'Deep Recover'}
                {remediationState.recover.status === 'done' && <CheckCircle size={18} style={{ color: 'var(--success)' }} />}
              </button>
            </div>
            
            {/* Repair Action */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ backgroundColor: 'var(--primary-light)', padding: '0.5rem', borderRadius: '0.25rem', color: 'var(--primary-color)', marginRight: '1rem' }}>
                  <Wrench size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>Auto-Repair Damaged Files</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Attempt AI reconstruction of 237 fragmented files.</div>
                </div>
              </div>
              <button 
                className={`btn ${remediationState.repair.status === 'done' ? 'btn-secondary' : 'btn-primary'}`}
                onClick={() => handleAction('repair')}
                disabled={remediationState.repair.status !== 'idle'}
                style={{ width: '150px', display: 'flex', justifyContent: 'center' }}
              >
                {remediationState.repair.status === 'idle' && 'Auto-Repair'}
                {remediationState.repair.status === 'done' && <CheckCircle size={18} style={{ color: 'var(--success)' }} />}
              </button>
            </div>

            {/* Delete Duplicates Action */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: '0.5rem', borderRadius: '0.25rem', color: '#38bdf8', marginRight: '1rem' }}>
                  <Trash2 size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>Delete Duplicates</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Safely remove 1,294 duplicate files (Reclaim 14.7 GB).</div>
                </div>
              </div>
              <button 
                className={`btn ${remediationState.duplicate.status === 'done' ? 'btn-secondary' : 'btn-primary'}`}
                onClick={() => handleAction('duplicate')}
                disabled={remediationState.duplicate.status !== 'idle'}
                style={{ width: '150px', display: 'flex', justifyContent: 'center', backgroundColor: remediationState.duplicate.status === 'idle' ? '#38bdf8' : undefined }}
              >
                {remediationState.duplicate.status === 'idle' && 'Delete'}
                {remediationState.duplicate.status === 'running' && <Loader2 size={18} className="animate-spin" />}
                {remediationState.duplicate.status === 'done' && <CheckCircle size={18} style={{ color: 'var(--success)' }} />}
              </button>
            </div>

            {/* Quarantine Threats Action */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '0.25rem', color: 'var(--danger)', marginRight: '1rem' }}>
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>Quarantine Threats</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Isolate 12 malicious indicators to safe zone.</div>
                </div>
              </div>
              <button 
                className={`btn ${remediationState.quarantine.status === 'done' ? 'btn-secondary' : 'btn-primary'}`}
                onClick={() => handleAction('quarantine')}
                disabled={remediationState.quarantine.status !== 'idle'}
                style={{ width: '150px', display: 'flex', justifyContent: 'center', backgroundColor: remediationState.quarantine.status === 'idle' ? 'var(--danger)' : undefined }}
              >
                {remediationState.quarantine.status === 'idle' && 'Isolate'}
                {remediationState.quarantine.status === 'running' && <Loader2 size={18} className="animate-spin" />}
                {remediationState.quarantine.status === 'done' && <CheckCircle size={18} style={{ color: 'var(--success)' }} />}
              </button>
            </div>

          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
          <CheckCircle size={24} style={{ margin: '0 auto 0.5rem auto', color: 'var(--success)' }} />
          <div>END OF REPORT</div>
          <div className="brand-font">{config.brandName} Prototype Engine</div>
        </div>
      </div>

      {activeModal && (
        <RestorationEngineModal 
          actionType={activeModal === 'recover' ? 'Deleted File Recovery' : 'Corrupted File Repair'}
          onClose={() => {
            if (activeModal === 'repair') {
              fetch('http://localhost:3001/api/remediate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetPath: recentSession?.target || 'C:\\Users\\ASUS\\Desktop\\deep_tracer_demo_dataset', action: 'repair_damaged' })
              }).catch(console.error);
            }
            setRemediationState(prev => ({ ...prev, [activeModal]: { status: 'done' } }));
            setActiveModal(null);
          }}
        />
      )}
    </div>
  );
}
