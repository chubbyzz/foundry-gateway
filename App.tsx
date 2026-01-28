
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SettingsPage from './pages/SettingsPage';
import { Settings } from 'lucide-react';

const App: React.FC = () => {
  const [vttUrl, setVttUrl] = useState<string>(() => {
    return localStorage.getItem('vtt-tunnel-url') || 'https://demo.foundryvtt.com';
  });

  useEffect(() => {
    localStorage.setItem('vtt-tunnel-url', vttUrl);
  }, [vttUrl]);

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-[#0d0d0e] relative">
        {/* Minimalist Top Navigation - Just the Settings Icon */}
        <div className="absolute top-0 right-0 p-6 z-50">
          <Link 
            to="/settings" 
            className="text-zinc-700 hover:text-[#ffc107] transition-all p-2 rounded-full hover:bg-zinc-900/50 block"
            title="Configure Connection"
          >
            <Settings size={20} />
          </Link>
        </div>

        <main className="flex-grow flex flex-col justify-center">
          <Routes>
            <Route path="/" element={<LandingPage url={vttUrl} />} />
            <Route path="/settings" element={<SettingsPage url={vttUrl} onUpdate={setVttUrl} />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
