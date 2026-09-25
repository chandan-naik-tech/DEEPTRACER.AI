import React, { createContext, useState, useContext } from 'react';

const ConfigContext = createContext();

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState({
    brandName: 'DEEP TRACER AI',
    tagline: 'Recover. Stitch. Restore. Protect.',
    heroDescription: 'An AI-powered neural reconstruction engine designed to deep-scan missing sectors, match fragmented hexadecimal data, and fully restore deleted or corrupted files.',
    healthScoreLabel: 'Data Health Score'
  });

  const updateConfig = (newConfig) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  return useContext(ConfigContext);
}
