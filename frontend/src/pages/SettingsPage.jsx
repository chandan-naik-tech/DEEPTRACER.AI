import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Save } from 'lucide-react';

export default function SettingsPage() {
  const { config, updateConfig } = useConfig();
  const [formData, setFormData] = useState({
    brandName: config.brandName,
    tagline: config.tagline,
    heroDescription: config.heroDescription,
    healthScoreLabel: config.healthScoreLabel
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateConfig(formData);
    // Optionally add a toast notification here
    alert("Settings updated successfully!");
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>CMS / Settings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage the website content and text configuration (Admin Only).</p>
      </div>

      <div className="card">
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
              Brand Name
            </label>
            <input 
              type="text" 
              name="brandName"
              className="input-field" 
              value={formData.brandName} 
              onChange={handleChange}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
              Tagline
            </label>
            <input 
              type="text" 
              name="tagline"
              className="input-field" 
              value={formData.tagline} 
              onChange={handleChange}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
              Hero Description
            </label>
            <textarea 
              name="heroDescription"
              className="input-field" 
              style={{ minHeight: '100px', resize: 'vertical' }}
              value={formData.heroDescription} 
              onChange={handleChange}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
              Data Health Score Label
            </label>
            <input 
              type="text" 
              name="healthScoreLabel"
              className="input-field" 
              value={formData.healthScoreLabel} 
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary">
              <Save size={18} style={{ marginRight: '0.5rem' }} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
