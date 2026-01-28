
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Info, Terminal, Link2 } from 'lucide-react';

interface SettingsPageProps {
  url: string;
  onUpdate: (url: string) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ url, onUpdate }) => {
  const [inputValue, setInputValue] = useState(url);
  const navigate = useNavigate();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(inputValue.trim());
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto w-full px-6 py-12 animate-fade-in flex flex-col gap-12">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-zinc-600 hover:text-[#ffc107] transition-colors group self-start"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        <span className="uppercase text-[9px] tracking-[0.2em] font-bold">Cancel</span>
      </button>

      <div className="space-y-10">
        <div className="space-y-2">
          <h2 className="text-3xl font-display text-white uppercase tracking-tight">GATEWAY</h2>
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em]">Configure Realm Connection</p>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          <div className="space-y-4">
            <label className="block text-[9px] uppercase tracking-[0.25em] text-zinc-500 font-black">
              Foundry Tunnel Address
            </label>
            <div className="relative">
              <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="foundry.example.com"
                required
                className="w-full bg-[#111113] border border-zinc-800/50 rounded-md py-5 pl-12 pr-4 text-zinc-300 focus:outline-none focus:border-[#ffc107]/50 focus:ring-1 focus:ring-[#ffc107]/10 transition-all font-mono text-xs"
              />
            </div>
          </div>

          <div className="bg-[#ffc107]/5 border-l-2 border-[#ffc107]/20 p-5 space-y-3 rounded-r-sm">
            <div className="flex items-center gap-2">
              <Terminal className="text-[#ffc107]/60" size={14} />
              <span className="text-[9px] font-black text-[#ffc107]/80 uppercase tracking-widest">Network Verification</span>
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed font-medium italic">
              The gateway verifies status by probing for Foundry-specific assets. If validation fails but your URL is correct, ensure your host is active and tunnel traffic is allowed.
            </p>
          </div>

          <button
            type="submit"
            className="w-full vtt-button py-5 rounded-md text-[11px] tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl shadow-black/20"
          >
            <Save size={18} />
            APPLY CHANGES
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
