'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function DrivePage() {
  const router = useRouter();
  const [gforce, setGforce] = useState(0.1);
  const [audioDb, setAudioDb] = useState(0);
  const [location, setLocation] = useState(null);
  const [roadType, setRoadType] = useState(null);
  const [onRoad, setOnRoad] = useState(false);
  const [duration, setDuration] = useState(0);
  const [status, setStatus] = useState('starting'); // starting | monitoring | crash | alert
  const [aiStatus, setAiStatus] = useState({
    sound: 'listening',
    gforce: 'watching',
    road: 'checking',
    alert: 'standby',
  });

  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const micStreamRef = useRef(null);
  const animFrameRef = useRef(null);
  const durationRef = useRef(null);
  const locationRef = useRef(null);
  const crashCooldown = useRef(false);
  const gforceRef = useRef(0.1);
  const audioDbRef = useRef(0);

  // ── Duration timer ─────────────────────────────
  useEffect(() => {
    durationRef.current = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(durationRef.current);
  }, []);

  // ── Format duration ────────────────────────────
  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // ── Start microphone ───────────────────────────
  useEffect(() => {
    startMic();
    startAccelerometer();
    startGPS();
    setStatus('monitoring');
    return () => cleanup();
  }, []);

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const tick = () => {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        const rms = Math.sqrt(data.reduce((s, v) => s + v * v, 0) / data.length);
        const db = Math.round((rms / 255) * 100);
        audioDbRef.current = db;
        setAudioDb(db);
        animFrameRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch (err) {
      console.error('Mic error:', err);
    }
  };

  // ── Accelerometer ──────────────────────────────
  const startAccelerometer = () => {
    if (!window.DeviceMotionEvent) return;

    // iOS permission
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission().catch(console.error);
    }

    window.addEventListener('devicemotion', handleMotion, true);
  };

  const handleMotion = (e) => {
    const acc = e.accelerationIncludingGravity;
    if (!acc) return;
    const g = Math.sqrt(
      (acc.x || 0) ** 2 + (acc.y || 0) ** 2 + (acc.z || 0) ** 2
    ) / 9.81;
    gforceRef.current = g;
    setGforce(parseFloat(g.toFixed(2)));

    // Crash detection
    if (g >= 3.5 && !crashCooldown.current) {
      handleCrashDetected(g);
    }
  };

  // ── GPS ────────────────────────────────────────
 const startGPS = () => {
  if (!navigator.geolocation) return;
  locationRef.current = navigator.geolocation.watchPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setLocation({ lat, lng });
      try {
        const res = await fetch(`/api/road-check?lat=${lat}&lng=${lng}`);
        const data = await res.json();
        setOnRoad(data.onRoad);
        setRoadType(data.roadType);
        setAiStatus(prev => ({ ...prev, road: data.onRoad ? 'on-road' : 'off-road' }));
      } catch (err) {
        setOnRoad(true);
      }
    },
    (err) => {
      // Localhost pe GPS nahi milta — HTTPS pe theek ho jayega
      console.log('GPS not available on localhost:', err.code);
      setLocation({ lat: 23.2599, lng: 77.4126 }); // fallback
      setOnRoad(true);
      setRoadType('unknown');
    },
    { enableHighAccuracy: true, maximumAge: 30000, timeout: 10000 }
  );
};

  // ── Crash detected ─────────────────────────────
  const handleCrashDetected = async (g) => {
    crashCooldown.current = true;
    setStatus('crash');
    setAiStatus(prev => ({ ...prev, gforce: 'SPIKE!' }));

    // Wait 2s for audio to confirm
    await new Promise(r => setTimeout(r, 2000));

    const audioConfirm = audioDbRef.current >= 60;
    const roadConfirm = onRoad;

    // Need at least 2/3 signals
    const score = [g >= 3.5, audioConfirm, roadConfirm].filter(Boolean).length;

    if (score >= 2) {
      setStatus('alert');
      setAiStatus({
        sound: audioConfirm ? 'CRASH!' : 'normal',
        gforce: 'SPIKE!',
        road: roadConfirm ? 'on-road' : 'off-road',
        alert: 'SENDING',
      });

      // Go to alert page with data
      const params = new URLSearchParams({
        gforce: g.toFixed(2),
        audioDb: audioDbRef.current,
        lat: location?.lat || '',
        lng: location?.lng || '',
        roadType: roadType || '',
        trigger: 'crash',
      });
      router.push(`/alert?${params.toString()}`);
    } else {
      // False alarm
      setStatus('monitoring');
      setAiStatus(prev => ({ ...prev, gforce: 'watching', alert: 'standby' }));
      setTimeout(() => { crashCooldown.current = false; }, 10000);
    }
  };

  // ── Cleanup ────────────────────────────────────
 const cleanup = () => {
  if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
  if (micStreamRef.current) {
    micStreamRef.current.getTracks().forEach(t => t.stop());
    micStreamRef.current = null;
  }
  if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
    audioCtxRef.current.close();
    audioCtxRef.current = null;
  }
  if (locationRef.current) {
    navigator.geolocation.clearWatch(locationRef.current);
    locationRef.current = null;
  }
  window.removeEventListener('devicemotion', handleMotion, true);
};

  const handleStop = () => {
    cleanup();
    router.push('/dashboard');
  };

  const gColor = gforce > 3.5 ? '#ef4444' : gforce > 2 ? '#f59e0b' : '#22c55e';
  const aColor = audioDb > 80 ? '#ef4444' : audioDb > 50 ? '#f59e0b' : '#3b82f6';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#111318;color:#f1f5f9;font-family:'Inter',sans-serif;min-height:100vh;}

        .page{max-width:480px;margin:0 auto;padding:0 0 24px;min-height:100vh;}

        .topbar{display:flex;justify-content:space-between;align-items:center;padding:20px 24px;}
        .topbar h2{font-size:20px;font-weight:700;color:#f1f5f9;}
        .live-badge{display:flex;align-items:center;gap:6px;background:#2d151533;border:1px solid #ef444433;color:#fca5a5;font-size:11px;font-weight:600;padding:5px 12px;border-radius:20px;}
        .live-dot{width:6px;height:6px;border-radius:50%;background:#ef4444;animation:blink 1s infinite;}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}

        .sensor-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 24px;margin-bottom:14px;}
        .sensor-card{background:#191c24;border:1px solid #2a2d3a;border-radius:16px;padding:16px;}
        .s-label{font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px;}
        .s-val{font-size:28px;font-weight:800;line-height:1;margin-bottom:2px;}
        .s-unit{font-size:11px;color:#6b7280;}
        .s-bar{height:4px;background:#2a2d3a;border-radius:2px;margin-top:10px;}
        .s-fill{height:100%;border-radius:2px;transition:width .3s,background .3s;}

        .gps-card{margin:0 24px 14px;background:#191c24;border:1px solid #2a2d3a;border-radius:16px;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;}
        .gps-left{font-size:12px;}
        .gps-label{color:#6b7280;margin-bottom:3px;}
        .gps-val{color:#f1f5f9;font-weight:500;font-size:13px;}
        .road-chip{font-size:11px;font-weight:600;padding:4px 12px;border-radius:20px;}
        .road-yes{background:#14532d33;border:1px solid #22c55e44;color:#4ade80;}
        .road-no{background:#2d151533;border:1px solid #ef444444;color:#fca5a5;}
        .road-check{background:#1c2033;border:1px solid #2d3555;color:#818cf8;}

        .ai-card{margin:0 24px 14px;background:#191c24;border:1px solid #2a2d3a;border-radius:16px;padding:16px;}
        .ai-title{font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px;}
        .ai-row{display:flex;justify-content:space-between;align-items:center;padding:6px 0;font-size:13px;}
        .ai-row+.ai-row{border-top:1px solid #2a2d3a;}
        .ai-name{color:#9ca3af;}
        .ai-ok{background:#14532d33;border:1px solid #22c55e44;color:#4ade80;font-size:10px;font-weight:600;padding:2px 10px;border-radius:10px;}
        .ai-warn{background:#451a0333;border:1px solid #f59e0b44;color:#fcd34d;font-size:10px;font-weight:600;padding:2px 10px;border-radius:10px;animation:blink 1s infinite;}
        .ai-alert{background:#2d151533;border:1px solid #ef444444;color:#fca5a5;font-size:10px;font-weight:600;padding:2px 10px;border-radius:10px;animation:blink .5s infinite;}

        .timer-card{margin:0 24px 14px;background:#191c24;border:1px solid #2a2d3a;border-radius:16px;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;}
        .timer-label{font-size:12px;color:#6b7280;}
        .timer-val{font-size:22px;font-weight:700;color:#f1f5f9;font-variant-numeric:tabular-nums;}

        .stop-btn{display:block;margin:0 24px;width:calc(100% - 48px);background:transparent;border:1px solid #374151;color:#9ca3af;padding:14px;border-radius:14px;font-size:15px;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;transition:.15s;text-align:center;}
        .stop-btn:hover{border-color:#ef444466;color:#fca5a5;background:#2d151522;}
      `}</style>

      <div className="page">

        {/* Topbar */}
        <div className="topbar">
          <h2>Drive Mode</h2>
          <div className="live-badge">
            <div className="live-dot"></div>
            {status === 'monitoring' ? 'LIVE' : status === 'crash' ? 'ANALYZING' : 'STARTING'}
          </div>
        </div>

        {/* Sensor cards */}
        <div className="sensor-grid">
          <div className="sensor-card">
            <div className="s-label">G-Force</div>
            <div className="s-val" style={{ color: gColor }}>{gforce.toFixed(2)}</div>
            <div className="s-unit">g · limit 3.5g</div>
            <div className="s-bar">
              <div className="s-fill" style={{ width: `${Math.min((gforce / 8) * 100, 100)}%`, background: gColor }}></div>
            </div>
          </div>
          <div className="sensor-card">
            <div className="s-label">Audio Level</div>
            <div className="s-val" style={{ color: aColor }}>{audioDb}</div>
            <div className="s-unit">dB · crash 80+</div>
            <div className="s-bar">
              <div className="s-fill" style={{ width: `${audioDb}%`, background: aColor }}></div>
            </div>
          </div>
        </div>

        {/* GPS + Road */}
        <div className="gps-card">
          <div className="gps-left">
            <div className="gps-label">Current location</div>
            <div className="gps-val">
              {location
                ? `${location.lat.toFixed(4)}°N, ${location.lng.toFixed(4)}°E`
                : 'Getting GPS...'}
            </div>
          </div>
          <div className={`road-chip ${onRoad ? 'road-yes' : roadType === null ? 'road-check' : 'road-no'}`}>
            {roadType === null ? '⏳ Checking' : onRoad ? '🛣 On road' : '🏠 Off road'}
          </div>
        </div>

        {/* AI Status */}
        <div className="ai-card">
          <div className="ai-title">AI Verification</div>
          <div className="ai-row">
            <span className="ai-name">Sound classifier</span>
            <span className={aiStatus.sound === 'CRASH!' ? 'ai-alert' : 'ai-ok'}>
              {aiStatus.sound === 'CRASH!' ? '🔊 CRASH!' : '🎤 Listening'}
            </span>
          </div>
          <div className="ai-row">
            <span className="ai-name">G-force monitor</span>
            <span className={aiStatus.gforce === 'SPIKE!' ? 'ai-alert' : 'ai-ok'}>
              {aiStatus.gforce === 'SPIKE!' ? '⚡ SPIKE!' : '✓ Watching'}
            </span>
          </div>
          <div className="ai-row">
            <span className="ai-name">Road detection</span>
            <span className={aiStatus.road === 'on-road' ? 'ai-ok' : aiStatus.road === 'off-road' ? 'ai-warn' : 'ai-ok'}>
              {aiStatus.road === 'on-road' ? '✓ On road' : aiStatus.road === 'off-road' ? '⚠ Off road' : '⏳ Checking'}
            </span>
          </div>
          <div className="ai-row">
            <span className="ai-name">Alert system</span>
            <span className={aiStatus.alert === 'SENDING' ? 'ai-alert' : 'ai-ok'}>
              {aiStatus.alert === 'SENDING' ? '🚨 SENDING' : '✓ Standby'}
            </span>
          </div>
        </div>

        {/* Duration */}
        <div className="timer-card">
          <div className="timer-label">Monitoring duration</div>
          <div className="timer-val">{formatDuration(duration)}</div>
        </div>

        {/* Stop */}
        <button className="stop-btn" onClick={handleStop}>
          ⬛ Stop Monitoring
        </button>

      </div>
    </>
  );
}