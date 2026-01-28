
import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, Loader2, Swords, AlertCircle, RefreshCw, Radio, ExternalLink } from 'lucide-react';

interface LandingPageProps {
  url: string;
}

const LandingPage: React.FC<LandingPageProps> = ({ url }) => {
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(false);
  const [attempt, setAttempt] = useState<number>(0);
  const [nextCheckIn, setNextCheckIn] = useState<number>(0);

  // Helper to ensure the URL is absolute for window.open
  const getAbsoluteUrl = (input: string) => {
    if (!input) return '';
    if (input.startsWith('http://') || input.startsWith('https://')) return input;
    return `https://${input}`;
  };

  const checkStatus = useCallback(async () => {
    if (!url) return;
    
    setChecking(true);
    const target = getAbsoluteUrl(url);

    /**
     * PROBE STRATEGY: 
     * fetch(url, {mode: 'no-cors'}) resolves even on Cloudflare 1033 errors.
     * To be sure, we try to load a known image asset from Foundry.
     * If the tunnel is down, the proxy (Cloudflare/Ngrok) returns an HTML error page,
     * which triggers the Image's 'onerror'.
     */
    const probe = new Image();
    const probeUrl = `${target}/icons/vtt.png?t=${Date.now()}`;

    const timer = setTimeout(() => {
      probe.src = ''; 
      onProbeFailed();
    }, 8000);

    const onProbeSuccess = () => {
      clearTimeout(timer);
      setIsOnline(true);
      setChecking(false);
      setAttempt(0);
    };

    const onProbeFailed = () => {
      clearTimeout(timer);
      setIsOnline(false);
      setChecking(false);
      
      const baseDelay = 5;
      const nextDelay = baseDelay * Math.pow(2, attempt);
      setNextCheckIn(nextDelay);
      setAttempt(prev => prev + 1);
    };

    probe.onload = onProbeSuccess;
    probe.onerror = onProbeFailed;
    probe.src = probeUrl;

  }, [url, attempt]);

  useEffect(() => {
    checkStatus();
  }, []);

  useEffect(() => {
    let timer: number;
    if (!isOnline && !checking && nextCheckIn > 0) {
      timer = window.setInterval(() => {
        setNextCheckIn(prev => {
          if (prev <= 1) {
            checkStatus();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOnline, checking, nextCheckIn, checkStatus]);

  const handleJoin = () => {
    const finalUrl = getAbsoluteUrl(url);
    if (finalUrl) {
      window.open(finalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center px-6 py-20">
      <div className="w-full space-y-12 animate-fade-in">
        
        {/* Minimal Hero */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-display text-white uppercase tracking-tight">
            CAMPAIGN <span className="text-[#ffc107]">PORTAL</span>
          </h1>
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em]">Join the adventure</p>
        </div>

        {/* Center Interaction */}
        <div className="flex flex-col items-center gap-8">
          <div className="relative w-full group">
            {isOnline && (
              <div className="absolute -inset-4 bg-[#ffc107]/5 blur-3xl rounded-full animate-pulse"></div>
            )}
            
            <button
              onClick={handleJoin}
              disabled={!isOnline}
              className={`
                w-full py-7 rounded-md text-sm font-bold tracking-[0.25em] transition-all duration-300 flex items-center justify-center gap-4 relative overflow-hidden
                ${isOnline 
                  ? 'vtt-button shadow-2xl shadow-[#ffc107]/10 hover:scale-[1.01]' 
                  : 'bg-zinc-900/40 text-zinc-700 border border-zinc-800/50 cursor-not-allowed opacity-50'
                }
              `}
            >
              {isOnline ? (
                <>
                  <Swords size={22} />
                  <span>JOIN SESSION</span>
                  <ExternalLink size={14} className="opacity-40" />
                </>
              ) : (
                <>
                  {checking ? (
                    <Loader2 size={20} className="animate-spin text-[#ffc107]" />
                  ) : (
                    <Radio size={20} className="opacity-20" />
                  )}
                  <span className="uppercase tracking-[0.2em]">Awaiting Link</span>
                </>
              )}
            </button>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.25em]">
            {isOnline ? (
              <span className="flex items-center gap-2 text-green-500/80">
                <ShieldCheck size={14} /> Link Active
              </span>
            ) : checking ? (
              <span className="flex items-center gap-2 text-zinc-500">
                <Loader2 size={14} className="animate-spin" /> Verifying Server
              </span>
            ) : (
              <span className="flex items-center gap-2 text-red-500/60">
                <AlertCircle size={14} /> Offline — {nextCheckIn}s
              </span>
            )}
            
            <button 
              onClick={checkStatus}
              className="p-2 hover:bg-zinc-900 rounded-full text-zinc-700 hover:text-[#ffc107] transition-all"
              title="Force Refresh"
            >
              <RefreshCw size={14} className={checking ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* URL Card - Transparent & Minimal */}
        <div className="p-4 rounded border border-zinc-800/30 bg-zinc-900/10 backdrop-blur-sm group hover:border-zinc-800/60 transition-colors">
          <div className="flex flex-col gap-2">
            <span className="text-[8px] text-zinc-700 font-bold uppercase tracking-[0.2em]">Current Destination:</span>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[10px] text-zinc-500 font-mono truncate">{url}</span>
              {!isOnline && !checking && (
                <span className="text-[8px] text-red-900 font-black uppercase tracking-tighter shrink-0">No Response</span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;
