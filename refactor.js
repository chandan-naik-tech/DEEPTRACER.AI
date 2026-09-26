const fs = require('fs');
const files = [
  'frontend/src/pages/AnalysisPipeline.jsx',
  'frontend/src/pages/DatabaseViewerPage.jsx',
  'frontend/src/pages/LoginPage.jsx',
  'frontend/src/pages/ReportPage.jsx'
];
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/http:\/\/localhost:3001/g, '${import.meta.env.VITE_API_BASE_URL}');
  
  // Fix single quotes to backticks
  content = content.replace(/'\$\{import.meta.env.VITE_API_BASE_URL\}(.*?)'/g, '`\$\{import.meta.env.VITE_API_BASE_URL\}$1`');
  
  fs.writeFileSync(f, content);
});
console.log('Replaced hardcoded URLs');
