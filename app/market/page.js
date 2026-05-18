'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function MarketPage() {
  const router = useRouter();
  const [listening, setListening] = useState(false);
  const [lastHeard, setLastHeard] = useState('');
  const [duration, setDuration] = useState(0);
  const [pulseSize, setPulseSize] = useState(1);
  const [error, setError] = useState('');

  const recognitionRef = useRef(null);
  const durationRef = useRef(null);
  const pulseRef = useRef(null);
  const triggeredRef = useRef(false);

  const KEYWORDS = [
    'help', 'help me', 'save me', 'leave me', 'let me go',
    'somebody help', 'please help', 'bachao', 'chhodo',
    'chodo', 'madad', 'हेल्प', 'बचाओ', 'छोड़ो', 'मदद',
  ];

  useEffect(() => {
    startDuration();
    startPulse();
    // HTTPS pe hi kaam karega — deploy ke baad
    if (window.location.protocol === 'https:') {
      startListening();
    } else {
      setError('Voice detection needs HTTPS. Deploy to Vercel for full functionality.');
      setListening(false);
    }
    return () => cleanup();
  }, []);

  const startDuration = () => {
    durationRef.current = setInterval(() => setDuration(p => p + 1), 1000);
  };

  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const startPulse = () => {
    let growing = true;
    pulseRef.current = setInterval(() => {
      setPulseSize(prev => {
        if (prev >= 1.15) growing = false;
        if (prev <= 1.0) growing = true;
        return growing ? prev + 0.005 : prev - 0.005;
      });
    }, 30);
  };

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setError('Use Chrome or Edge browser');
      return;
    }

    const r = new SR();
    r.continuous = true;
    r.interimResults = true;
    r.lang = 'en-US';

    r.onstart = () => {
      setListening(true);
      setLastHeard('Listening...');
      console.log('✅ Listening started');
    };

    r.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const text = e.results[i][0].transcript.toLowerCase().trim();
        console.log('Heard:', text);
        setLastHeard(text);
        const found = KEYWORDS.find(k => text.includes(k));
        if (found && !triggeredRef.current) {
          console.log('🚨 Keyword:', found);
          handleTrigger(found);
        }
      }
    };

    r.onerror = (e) => {
      if (e.error === 'not-allowed') { setError('Mic blocked'); return; }
      if (e.error === 'no-speech') return;
      setTimeout(() => { if (!triggeredRef.current) try { r.start(); } catch (err) {} }, 1000);
    };

    r.onend = () => {
      if (!triggeredRef.current) setTimeout(() => { try { r.start(); } catch (e) {} }, 300);
    };

    r.start();
    recognitionRef.current = r;
  };

  const handleTrigger = (word) => {
    if (triggeredRef.current) return;
    triggeredRef.current = true;
    if (navigator.vibrate) navigator.vibrate([300, 100, 300]);

    const params = new URLSearchParams({
      trigger: 'keyword', keyword: word,
      gforce: '0', audioDb: '0', lat: '', lng: '', roadType: '',
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          params.set('lat', pos.coords.latitude);
          params.set('lng', pos.coords.longitude);
          router.push(`/alert?${params.toString()}`);
        },
        () => router.push(`/alert?${params.toString()}`),
        { timeout: 5000 }
      );
    } else {
      router.push(`/alert?${params.toString()}`);
    }
  };

  const cleanup = () => {
    clearInterval(durationRef.current);
    clearInterval(pulseRef.current);
    if (recognitionRef.current) try { recognitionRef.current.stop(); } catch (e) {}
  };

  const handleStop = () => { cleanup(); router.push('/dashboard'); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#111318;color:#f1f5f9;font-family:'Inter',sans-serif;min-height:100vh;}
        .page{max-width:480px;margin:0 auto;min-height:100vh;display:flex;flex-direction:column;padding:0 24px 32px;}
        .topbar{display:flex;justify-content:space-between;align-items:center;padding:20px 0;}
        .topbar-left h2{font-size:20px;font-weight:700;color:#f1f5f9;}
        .topbar-left p{font-size:13px;color:#6b7280;margin-top:2px;}
        .badge{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;padding:5px 12px;border-radius:20px;}
        .blink{animation:blink 1.5s infinite;}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
        .mic-section{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px 0;}
        .mic-rings{position:relative;width:160px;height:160px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;}
        .ring{position:absolute;border-radius:50%;border:1.5px solid #22c55e;animation:ripple 2.5s ease-out infinite;}
        .ring1{width:160px;height:160px;opacity:.1;}
        .ring2{width:120px;height:120px;opacity:.2;animation-delay:.5s;}
        .ring3{width:88px;height:88px;opacity:.35;animation-delay:1s;}
        @keyframes ripple{0%{transform:scale(.85);opacity:.5}100%{transform:scale(1.1);opacity:0}}
        .mic-center{width:68px;height:68px;background:#16a34a;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;position:relative;z-index:1;box-shadow:0 0 24px #22c55e44;}
        .mic-status{font-size:14px;font-weight:600;color:#4ade80;margin-bottom:6px;}
        .mic-sub{font-size:12px;color:#6b7280;text-align:center;line-height:1.6;}
        .error-card{background:#2d151522;border:1px solid #ef444444;border-radius:12px;padding:12px 16px;margin-bottom:12px;font-size:13px;color:#fca5a5;text-align:center;}
        .deploy-btn{width:100%;background:#2563eb;color:#fff;padding:12px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;border:none;font-family:'Inter',sans-serif;margin-top:8px;}
        .last-heard{background:#191c24;border:1px solid #2a2d3a;border-radius:12px;padding:10px 14px;margin-bottom:12px;min-height:44px;display:flex;align-items:center;gap:8px;}
        .lh-label{font-size:11px;color:#6b7280;white-space:nowrap;}
        .lh-text{font-size:13px;color:#9ca3af;font-style:italic;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
        .kw-card{background:#191c24;border:1px solid #2a2d3a;border-radius:14px;padding:14px;margin-bottom:12px;}
        .kw-title{font-size:10px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;}
        .kw-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px;}
        .kw-chip{background:#0f2a1a;border:1px solid #16653433;border-radius:10px;padding:8px;font-size:12px;font-weight:500;color:#86efac;text-align:center;}
        .silent-card{background:#1c203322;border:1px solid #2d355533;border-radius:12px;padding:10px 14px;display:flex;gap:10px;margin-bottom:12px;}
        .silent-text{font-size:12px;color:#6b7280;line-height:1.6;}
        .silent-text strong{color:#9ca3af;}
        .timer-row{display:flex;justify-content:space-between;align-items:center;background:#191c24;border:1px solid #2a2d3a;border-radius:12px;padding:12px 16px;margin-bottom:12px;}
        .timer-label{font-size:13px;color:#6b7280;}
        .timer-val{font-size:18px;font-weight:700;color:#f1f5f9;}
        .stop-btn{width:100%;background:transparent;border:1px solid #374151;color:#9ca3af;padding:14px;border-radius:14px;font-size:15px;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;}
        .stop-btn:hover{border-color:#22c55e55;color:#4ade80;}
      `}</style>

      <div className="page">
        <div className="topbar">
          <div className="topbar-left">
            <h2>Safety Mode</h2>
            <p>On-foot protection</p>
          </div>
          <div className="badge" style={{
            background: listening ? '#0f2a1a' : '#2d151522',
            border: `1px solid ${listening ? '#22c55e33' : '#ef444433'}`,
            color: listening ? '#4ade80' : '#fca5a5'
          }}>
            <div className="blink" style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: listening ? '#22c55e' : '#ef4444'
            }}></div>
            {listening ? 'LISTENING' : 'INACTIVE'}
          </div>
        </div>

        <div className="mic-section">
          <div className="mic-rings">
            <div className="ring ring1"></div>
            <div className="ring ring2"></div>
            <div className="ring ring3"></div>
            <div className="mic-center" style={{ transform: `scale(${pulseSize})` }}>
              {listening ? '🎤' : '⚠️'}
            </div>
          </div>
          <div className="mic-status">
            {listening ? 'Listening in background' : 'Needs HTTPS to work'}
          </div>
          <div className="mic-sub">
            {listening
              ? 'Screen can be locked safely.'
              : 'Deploy to Vercel for voice detection.'}
          </div>
        </div>

        {error && (
          <div className="error-card">
            ⚠️ {error}
            <button className="deploy-btn" onClick={() => router.push('/dashboard')}>
              Go to Dashboard
            </button>
          </div>
        )}

        <div className="last-heard">
          <span className="lh-label">Heard:</span>
          <span className="lh-text">{lastHeard || 'Waiting for voice...'}</span>
        </div>

        <div className="kw-card">
          <div className="kw-title">Trigger keywords</div>
          <div className="kw-grid">
            {KEYWORDS.slice(0, 6).map((kw, i) => (
              <div key={i} className="kw-chip">{kw}</div>
            ))}
          </div>
        </div>

        <div className="silent-card">
          <span style={{fontSize:'18px'}}>🔕</span>
          <div className="silent-text">
            <strong>Discreet mode.</strong> No visible indicator when screen is locked.
          </div>
        </div>

        <div className="timer-row">
          <span className="timer-label">Active for</span>
          <span className="timer-val">{formatDuration(duration)}</span>
        </div>

        <button className="stop-btn" onClick={handleStop}>⬛ Stop Protection</button>
      </div>
    </>
  );
}