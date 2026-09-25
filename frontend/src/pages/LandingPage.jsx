import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Search, Database, Fingerprint, Activity, ActivitySquare } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';
import SplashBootScreen from '../components/SplashBootScreen';

export default function LandingPage() {
  const navigate = useNavigate();
  const { config } = useConfig();
  
  const [bootComplete, setBootComplete] = useState(false);
  
  useEffect(() => {
    // If the user has already seen the boot screen in this session, skip it
    if (sessionStorage.getItem('bootComplete')) {
      setBootComplete(true);
    }
  }, []);

  const handleBootComplete = () => {
    sessionStorage.setItem('bootComplete', 'true');
    setBootComplete(true);
  };

  if (!bootComplete) {
    return <SplashBootScreen onComplete={handleBootComplete} />;
  }

  return (
    <div className="animate-fade-in" style={{ minHeight: '100vh', backgroundColor: 'transparent', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="brand-font" style={{ color: 'var(--primary-color)', fontSize: '1.5rem', fontWeight: 800 }}>
          {config.brandName}
        </h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/login')}>User Login</button>
          <button className="btn btn-primary" onClick={() => navigate('/admin/login')}>Admin Login</button>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4rem 2rem' }}>
        <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary-hover)', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600, marginBottom: '2rem' }}>
            <Activity size={16} /> Intelligent Data Recovery & Threat Analysis
          </div>
          
          <h2 style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
            {config.tagline.split('.').map((part, index, arr) => {
              if (index === arr.length - 1 || !part.trim()) return null;
              if (index === 2) return <React.Fragment key={index}><span style={{ color: 'var(--primary-color)' }}>{part.trim()}.</span> </React.Fragment>;
              return <React.Fragment key={index}>{part.trim()}. </React.Fragment>;
            })}
          </h2>
          
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
            {config.heroDescription}
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '5rem' }}>
            <button className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }} onClick={() => navigate('/app/dashboard')}>
              Start Analysis
            </button>
            <button className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }} onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore Platform
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div id="features" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', maxWidth: '1200px', width: '100%', marginTop: '2rem' }}>
          
          <div className="glass-card" style={{ textAlign: 'left' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--primary-light)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', marginBottom: '1rem' }}>
              <Database size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Intelligent Recovery</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Analyzes fragmented and damaged information for structural reconstruction.</p>
          </div>

          <div className="glass-card" style={{ textAlign: 'left' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--primary-light)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', marginBottom: '1rem' }}>
              <ActivitySquare size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>AI-Assisted Classification</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Files are classified intelligently according to observable characteristics.</p>
          </div>

          <div className="glass-card" style={{ textAlign: 'left' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--primary-light)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', marginBottom: '1rem' }}>
              <Shield size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Threat Analysis</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Identifies suspicious indicators and potentially malicious files safely.</p>
          </div>

          <div className="glass-card" style={{ textAlign: 'left' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--primary-light)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', marginBottom: '1rem' }}>
              <Fingerprint size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Explainable AI</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Transparent reasoning for every classification and confidence score.</p>
          </div>

        </div>
      </main>
    </div>
  );
}
