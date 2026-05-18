'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      window.deferredPrompt = e;
    });
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#111318;color:#f1f5f9;font-family:'Inter',sans-serif;min-height:100vh;}
        nav{display:flex;justify-content:space-between;align-items:center;padding:20px 48px;border-bottom:1px solid #ffffff0f;position:sticky;top:0;background:#111318ee;backdrop-filter:blur(12px);z-index:100;}
        .nav-logo{display:flex;align-items:center;gap:10px;}
        .nav-logo-icon{width:36px;height:36px;background:#2563eb;border-radius:10px;display:flex;align-items:center;justify-content:center;}
        .nav-logo-text{font-size:20px;font-weight:700;letter-spacing:-0.5px;color:#f1f5f9;}
        .nav-logo-text span{color:#3b82f6;}
        .nav-links{display:flex;align-items:center;gap:32px;}
        .nav-link{font-size:14px;color:#9ca3af;cursor:pointer;transition:.15s;}
        .nav-link:hover{color:#f1f5f9;}
        .nav-cta{background:#2563eb;color:#fff;padding:9px 20px;border-radius:10px;font-size:14px;font-weight:500;cursor:pointer;border:none;font-family:'Inter',sans-serif;transition:.15s;}
        .nav-cta:hover{background:#1d4ed8;}
        .hero{max-width:1100px;margin:0 auto;padding:100px 48px 80px;text-align:center;}
        .hero-badge{display:inline-flex;align-items:center;gap:6px;background:#1c2033;border:1px solid #2d3555;color:#818cf8;font-size:12px;font-weight:500;padding:6px 14px;border-radius:20px;margin-bottom:28px;}
        .badge-dot{width:6px;height:6px;border-radius:50%;background:#22c55e;animation:blink 1.5s infinite;}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.4}}
        .hero h1{font-size:clamp(36px,6vw,68px);font-weight:800;line-height:1.1;letter-spacing:-2px;margin-bottom:24px;color:#f9fafb;}
        .hero h1 .blue{color:#3b82f6;}
        .hero h1 .dim{color:#6b7280;}
        .hero-sub{font-size:clamp(15px,2vw,17px);color:#9ca3af;line-height:1.75;max-width:580px;margin:0 auto 40px;}
        .hero-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:60px;}
        .btn-primary{background:#2563eb;color:#fff;padding:14px 28px;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;border:none;font-family:'Inter',sans-serif;transition:.15s;display:flex;align-items:center;gap:8px;}
        .btn-primary:hover{background:#1d4ed8;transform:translateY(-1px);}
        .btn-secondary{background:transparent;color:#9ca3af;padding:14px 28px;border-radius:12px;font-size:15px;font-weight:500;cursor:pointer;border:1px solid #2a2d3a;font-family:'Inter',sans-serif;transition:.15s;display:flex;align-items:center;gap:8px;}
        .btn-secondary:hover{border-color:#3d4152;color:#f1f5f9;}
        .install-banner{background:#1c2033;border:1px solid #2d3555;border-radius:16px;padding:16px 24px;max-width:500px;margin:0 auto 32px;display:flex;align-items:center;justify-content:space-between;gap:16px;}
        .install-left{display:flex;align-items:center;gap:12px;}
        .install-icon{font-size:24px;}
        .install-text h4{font-size:14px;font-weight:600;color:#f1f5f9;margin-bottom:2px;}
        .install-text p{font-size:12px;color:#9ca3af;}
        .install-btn{background:#2563eb;color:#fff;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;border:none;font-family:'Inter',sans-serif;white-space:nowrap;}
        .hero-preview{background:#191c24;border:1px solid #2a2d3a;border-radius:20px;padding:20px;max-width:780px;margin:0 auto;position:relative;}
        .preview-bar{display:flex;align-items:center;gap:8px;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid #2a2d3a;}
        .preview-dots{display:flex;gap:6px;}
        .pd{width:10px;height:10px;border-radius:50%;}
        .pd1{background:#ef4444;}.pd2{background:#f59e0b;}.pd3{background:#22c55e;}
        .preview-url{flex:1;background:#222530;border-radius:6px;padding:5px 12px;font-size:11px;color:#6b7280;text-align:center;}
        .preview-content{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;}
        .prev-card{background:#222530;border:1px solid #2a2d3a;border-radius:12px;padding:14px;}
        .prev-label{font-size:10px;color:#6b7280;margin-bottom:4px;text-transform:uppercase;letter-spacing:.5px;}
        .prev-val{font-size:20px;font-weight:700;}
        .prev-val.g{color:#22c55e;}.prev-val.b{color:#3b82f6;}
        .prev-bar{height:3px;background:#2a2d3a;border-radius:2px;margin-top:8px;}
        .prev-fill{height:100%;border-radius:2px;}
        .live-chip{position:absolute;top:18px;right:18px;background:#14532d33;border:1px solid #22c55e33;color:#4ade80;font-size:10px;font-weight:600;padding:4px 10px;border-radius:20px;display:flex;align-items:center;gap:5px;}
        .live-dot{width:5px;height:5px;border-radius:50%;background:#22c55e;animation:blink 1.5s infinite;}
        .problem{max-width:1100px;margin:0 auto;padding:80px 48px;}
        .section-label{font-size:12px;font-weight:600;color:#3b82f6;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:12px;}
        .section-title{font-size:clamp(24px,4vw,38px);font-weight:700;letter-spacing:-1px;margin-bottom:16px;line-height:1.2;color:#f9fafb;}
        .section-sub{font-size:15px;color:#9ca3af;line-height:1.7;max-width:560px;}
        .problem-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin-top:48px;}
        .prob-card{background:#191c24;border:1px solid #2a2d3a;border-radius:16px;padding:24px;transition:.2s;}
        .prob-card:hover{border-color:#3d4152;}
        .prob-icon{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:14px;font-size:18px;}
        .ic-red{background:#2d1515;border:1px solid #7f1d1d44;}
        .ic-amber{background:#2d2010;border:1px solid #92400e44;}
        .ic-blue{background:#111c33;border:1px solid #1e3a5f44;}
        .ic-purple{background:#1a1533;border:1px solid #4c1d9544;}
        .prob-card h3{font-size:14px;font-weight:600;margin-bottom:8px;color:#f1f5f9;}
        .prob-card p{font-size:13px;color:#9ca3af;line-height:1.6;}
        .solution{background:#161920;border-top:1px solid #2a2d3a;border-bottom:1px solid #2a2d3a;}
        .solution-inner{max-width:1100px;margin:0 auto;padding:80px 48px;}
        .sol-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;margin-top:48px;}
        .sol-features{display:flex;flex-direction:column;gap:20px;}
        .sol-feat{display:flex;gap:16px;align-items:flex-start;}
        .sol-feat-icon{width:38px;height:38px;background:#1c2033;border:1px solid #2d3555;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:16px;}
        .sol-feat-text h4{font-size:14px;font-weight:600;margin-bottom:4px;color:#f1f5f9;}
        .sol-feat-text p{font-size:13px;color:#9ca3af;line-height:1.5;}
        .sol-phone{background:#191c24;border:1px solid #2a2d3a;border-radius:24px;padding:20px;max-width:260px;margin:0 auto;}
        .phone-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;}
        .phone-title{font-size:15px;font-weight:700;color:#f1f5f9;}
        .phone-status{display:flex;align-items:center;gap:5px;font-size:11px;color:#4ade80;}
        .mode-buttons{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;}
        .mode-btn{border-radius:12px;padding:16px 12px;text-align:center;cursor:pointer;}
        .mode-btn.drive{background:#2d1515;border:1px solid #7f1d1d55;}
        .mode-btn.walk{background:#0f2a1a;border:1px solid #16653455;}
        .mode-btn-icon{font-size:22px;margin-bottom:6px;}
        .mode-btn-label{font-size:12px;font-weight:600;}
        .mode-btn.drive .mode-btn-label{color:#fca5a5;}
        .mode-btn.walk .mode-btn-label{color:#86efac;}
        .mode-btn-sub{font-size:10px;color:#6b7280;margin-top:2px;}
        .contacts-row{background:#222530;border:1px solid #2a2d3a;border-radius:10px;padding:10px 12px;display:flex;align-items:center;gap:10px;}
        .avatars{display:flex;}
        .av{width:24px;height:24px;border-radius:50%;border:2px solid #191c24;font-size:9px;font-weight:600;display:flex;align-items:center;justify-content:center;margin-left:-6px;}
        .av:first-child{margin-left:0;}
        .av1{background:#1e3a5f;color:#93c5fd;}
        .av2{background:#14532d;color:#86efac;}
        .av3{background:#3b1f6e;color:#c4b5fd;}
        .contacts-text{font-size:11px;color:#9ca3af;}
        .modes{max-width:1100px;margin:0 auto;padding:80px 48px;}
        .modes-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:48px;}
        .mode-card{border-radius:20px;padding:32px;}
        .mode-card.drive{background:#1e1212;border:1px solid #7f1d1d33;}
        .mode-card.walk{background:#0d1f14;border:1px solid #16653433;}
        .mode-card-badge{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:600;padding:4px 12px;border-radius:20px;margin-bottom:20px;}
        .mode-card.drive .mode-card-badge{background:#2d151522;border:1px solid #7f1d1d55;color:#fca5a5;}
        .mode-card.walk .mode-card-badge{background:#0f2a1a22;border:1px solid #16653455;color:#86efac;}
        .mode-card h3{font-size:20px;font-weight:700;margin-bottom:10px;color:#f1f5f9;}
        .mode-card p{font-size:13px;color:#9ca3af;line-height:1.6;margin-bottom:20px;}
        .mode-chips{display:flex;flex-wrap:wrap;gap:7px;}
        .chip{font-size:11px;padding:4px 10px;border-radius:8px;font-weight:500;}
        .chip-red{background:#2d1515;color:#fca5a5;border:1px solid #7f1d1d44;}
        .chip-green{background:#0f2a1a;color:#86efac;border:1px solid #16653444;}
        .how{background:#161920;border-top:1px solid #2a2d3a;}
        .how-inner{max-width:1100px;margin:0 auto;padding:80px 48px;}
        .how-steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:0;margin-top:48px;}
        .how-step{padding:24px 16px;text-align:center;position:relative;}
        .step-num{width:38px;height:38px;border-radius:50%;background:#1c2033;border:1px solid #2d3555;color:#818cf8;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;}
        .how-step h4{font-size:13px;font-weight:600;margin-bottom:6px;color:#f1f5f9;}
        .how-step p{font-size:12px;color:#9ca3af;line-height:1.5;}
        .step-arrow{position:absolute;right:-8px;top:32px;color:#374151;font-size:16px;}
        .trust{max-width:1100px;margin:0 auto;padding:80px 48px;}
        .trust-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:14px;margin-top:48px;}
        .trust-card{background:#191c24;border:1px solid #2a2d3a;border-radius:16px;padding:24px;text-align:center;}
        .trust-num{font-size:36px;font-weight:800;color:#3b82f6;margin-bottom:6px;}
        .trust-label{font-size:12px;color:#9ca3af;line-height:1.5;}
        .cta-section{background:#161920;border-top:1px solid #2a2d3a;padding:80px 48px;text-align:center;}
        .cta-section h2{font-size:clamp(26px,4vw,44px);font-weight:800;letter-spacing:-1px;margin-bottom:16px;color:#f9fafb;}
        .cta-section p{font-size:15px;color:#9ca3af;margin-bottom:36px;}
        .cta-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
        footer{border-top:1px solid #2a2d3a;padding:28px 48px;max-width:1100px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;}
        .footer-logo{font-size:15px;font-weight:700;color:#f1f5f9;}
        .footer-logo span{color:#3b82f6;}
        .footer-text{font-size:12px;color:#6b7280;}
        @media(max-width:768px){
          nav{padding:16px 20px;}
          .nav-links{display:none;}
          .hero{padding:60px 20px 48px;}
          .problem,.modes,.trust,.how-inner,.solution-inner{padding:60px 20px;}
          .sol-grid{grid-template-columns:1fr;}
          .modes-grid{grid-template-columns:1fr;}
          .preview-content{grid-template-columns:1fr 1fr;}
          .cta-section{padding:60px 20px;}
          footer{padding:20px;flex-direction:column;text-align:center;}
          .step-arrow{display:none;}
          .install-banner{flex-direction:column;text-align:center;}
        }
      `}</style>

      <nav>
        <div className="nav-logo">
          <div className="nav-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.5C16.5 22.15 20 17.25 20 12V6l-8-4z" fill="#fff" opacity=".95"/>
              <path d="M9 12l2 2 4-4" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="nav-logo-text">Sh<span>ie</span>ld</span>
        </div>
        <div className="nav-links">
          <span className="nav-link">How it works</span>
          <span className="nav-link">Features</span>
          <span className="nav-link">Safety modes</span>
        </div>
        <button className="nav-cta" onClick={() => router.push('/setup')}>
          Get protected
        </button>
      </nav>

      <section className="hero">
        <div className="hero-badge">
          <div className="badge-dot"></div>
          Always watching. Always ready.
        </div>
        <h1>Your family stays <span className="blue">connected</span><br/>when it matters <span className="dim">most</span></h1>
        <p className="hero-sub">Shield turns your phone into a 24/7 personal safety guardian. Save your family and relatives — we alert them instantly if you're ever in danger.</p>

        <div className="install-banner">
          <div className="install-left">
            <div className="install-icon">📱</div>
            <div className="install-text">
              <h4>Install Shield as an app</h4>
              <p>Works like a native app — no Play Store needed</p>
            </div>
          </div>
          <button className="install-btn" onClick={() => {
            if (window.deferredPrompt) {
              window.deferredPrompt.prompt();
            } else {
              alert('To install: tap browser menu → "Add to Home Screen"');
            }
          }}>
            📲 Install App
          </button>
        </div>

        <div className="hero-btns">
          <button className="btn-primary" onClick={() => router.push('/setup')}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.5C16.5 22.15 20 17.25 20 12V6l-8-4z" fill="#fff"/></svg>
            Start protection — it's free
          </button>
          <button className="btn-secondary" onClick={() => document.getElementById('how').scrollIntoView({behavior:'smooth'})}>
            ↓ See how it works
          </button>
        </div>

        <div className="hero-preview">
          <div className="live-chip"><div className="live-dot"></div>Live</div>
          <div className="preview-bar">
            <div className="preview-dots"><div className="pd pd1"></div><div className="pd pd2"></div><div className="pd pd3"></div></div>
            <div className="preview-url">shield-app.vercel.app · Drive mode active</div>
          </div>
          <div className="preview-content">
            <div className="prev-card">
              <div className="prev-label">G-Force</div>
              <div className="prev-val g">0.3g</div>
              <div className="prev-bar"><div className="prev-fill" style={{width:'8%',background:'#22c55e'}}></div></div>
            </div>
            <div className="prev-card">
              <div className="prev-label">Road type</div>
              <div className="prev-val b" style={{fontSize:'13px',marginTop:'6px'}}>Highway ✓</div>
              <div className="prev-bar"><div className="prev-fill" style={{width:'100%',background:'#3b82f6'}}></div></div>
            </div>
            <div className="prev-card">
              <div className="prev-label">Status</div>
              <div className="prev-val g" style={{fontSize:'13px',marginTop:'6px'}}>All safe</div>
              <div className="prev-bar"><div className="prev-fill" style={{width:'100%',background:'#22c55e'}}></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="problem">
        <div className="section-label">The problem we solve</div>
        <div className="section-title">What happens when<br/>you can't call for help?</div>
        <p className="section-sub">Every year thousands of accidents go unnoticed for hours. Your family deserves to know immediately.</p>
        <div className="problem-grid">
          <div className="prob-card"><div className="prob-icon ic-red">🚗</div><h3>Road accidents</h3><p>Sudden crashes leave drivers unconscious. No one can call for help. Every minute matters.</p></div>
          <div className="prob-card"><div className="prob-icon ic-amber">⚠️</div><h3>Unsafe situations</h3><p>Walking alone at night. You may not always be able to speak or reach your phone.</p></div>
          <div className="prob-card"><div className="prob-icon ic-blue">📵</div><h3>Delayed response</h3><p>Family finds out hours after an incident. Precious response time is lost.</p></div>
          <div className="prob-card"><div className="prob-icon ic-purple">🔇</div><h3>Silent emergencies</h3><p>Kidnapping, harassment — situations where you cannot speak or signal for help.</p></div>
        </div>
      </section>

      <section className="solution">
        <div className="solution-inner">
          <div className="section-label">Our solution</div>
          <div className="section-title">Shield detects danger<br/>before you can react</div>
          <div className="sol-grid">
            <div className="sol-features">
              <div className="sol-feat"><div className="sol-feat-icon">🛡️</div><div className="sol-feat-text"><h4>Save your family & relatives</h4><p>Add up to 3 contacts — Mom, Papa, siblings. They get instant WhatsApp alerts with your exact GPS location.</p></div></div>
              <div className="sol-feat"><div className="sol-feat-icon">🤖</div><div className="sol-feat-text"><h4>AI that runs fully offline</h4><p>On-device ML model detects crash sounds — glass breaking, metal impact — without needing internet.</p></div></div>
              <div className="sol-feat"><div className="sol-feat-icon">🛣️</div><div className="sol-feat-text"><h4>Highway & road detection</h4><p>Alerts only fire when you're on a road or highway. Zero false alarms from speed bumps.</p></div></div>
              <div className="sol-feat"><div className="sol-feat-icon">🔒</div><div className="sol-feat-text"><h4>Works behind locked screen</h4><p>Once started, Shield monitors in background. Lock your screen — it keeps watching.</p></div></div>
            </div>
            <div>
              <div className="sol-phone">
                <div className="phone-header">
                  <span className="phone-title">Shield</span>
                  <span className="phone-status"><div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#22c55e',marginRight:'4px'}}></div>Protected</span>
                </div>
                <div className="mode-buttons">
                  <div className="mode-btn drive"><div className="mode-btn-icon">🚗</div><div className="mode-btn-label">Drive mode</div><div className="mode-btn-sub">Accident detection</div></div>
                  <div className="mode-btn walk"><div className="mode-btn-icon">🚶</div><div className="mode-btn-label">Safety mode</div><div className="mode-btn-sub">Keyword listen</div></div>
                </div>
                <div className="contacts-row">
                  <div className="avatars"><div className="av av1">M</div><div className="av av2">P</div><div className="av av3">S</div></div>
                  <div className="contacts-text">3 contacts will be alerted</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="modes">
        <div className="section-label">Two safety modes</div>
        <div className="section-title">Protection for every situation</div>
        <div className="modes-grid">
          <div className="mode-card drive">
            <div className="mode-card-badge"><div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#ef4444',marginRight:'2px'}}></div>Drive mode</div>
            <h3>On the road</h3>
            <p>Three-layer verification — G-force spike + AI crash audio + highway check. Only real accidents trigger alerts.</p>
            <div className="mode-chips">
              <span className="chip chip-red">G-force sensor</span>
              <span className="chip chip-red">AI crash audio</span>
              <span className="chip chip-red">Highway check</span>
              <span className="chip chip-red">GPS location</span>
            </div>
          </div>
          <div className="mode-card walk">
            <div className="mode-card-badge"><div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#22c55e',marginRight:'2px'}}></div>Safety mode</div>
            <h3>Out on foot</h3>
            <p>Silently listens for distress keywords. Completely discreet — no visible indicator when screen is locked.</p>
            <div className="mode-chips">
              <span className="chip chip-green">Help</span>
              <span className="chip chip-green">Bachao</span>
              <span className="chip chip-green">Save me</span>
              <span className="chip chip-green">Chhodo</span>
              <span className="chip chip-green">Leave me</span>
            </div>
          </div>
        </div>
      </section>

      <section className="how" id="how">
        <div className="how-inner">
          <div className="section-label">How it works</div>
          <div className="section-title">Simple. Automatic. Life-saving.</div>
          <div className="how-steps">
            <div className="how-step"><div className="step-num">1</div><h4>Save contacts</h4><p>Add family & relatives with WhatsApp numbers. One time only.</p><div className="step-arrow">→</div></div>
            <div className="how-step"><div className="step-num">2</div><h4>Choose mode</h4><p>Drive mode for roads. Safety mode when on foot.</p><div className="step-arrow">→</div></div>
            <div className="how-step"><div className="step-num">3</div><h4>Shield monitors</h4><p>AI watches silently. Even behind a locked screen.</p><div className="step-arrow">→</div></div>
            <div className="how-step"><div className="step-num">4</div><h4>Danger detected</h4><p>30 second window. Press "I am safe" to cancel.</p><div className="step-arrow">→</div></div>
            <div className="how-step"><div className="step-num">5</div><h4>Family alerted</h4><p>WhatsApp + GPS location sent to all contacts instantly.</p></div>
          </div>
        </div>
      </section>

      <section className="trust">
        <div className="section-label">Why Shield</div>
        <div className="section-title">Built to protect, not to profit</div>
        <div className="trust-grid">
          <div className="trust-card"><div className="trust-num">100%</div><div className="trust-label">Free — no subscriptions, no ads, no hidden costs</div></div>
          <div className="trust-card"><div className="trust-num">0ms</div><div className="trust-label">AI delay — runs offline on your device</div></div>
          <div className="trust-card"><div className="trust-num">3×</div><div className="trust-label">Verification layers before any alert is sent</div></div>
          <div className="trust-card"><div className="trust-num">30s</div><div className="trust-label">Cancel window — you are always in control</div></div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Start protecting yourself today</h2>
        <p>No account needed. No credit card. Just you and your family, connected.</p>
        <div className="cta-btns">
          <button className="btn-primary" onClick={() => router.push('/setup')}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.5C16.5 22.15 20 17.25 20 12V6l-8-4z" fill="#fff"/></svg>
            Get Shield — free forever
          </button>
          <button className="btn-secondary" onClick={() => {
            if (window.deferredPrompt) {
              window.deferredPrompt.prompt();
            } else {
              alert('To install: tap browser menu → "Add to Home Screen"');
            }
          }}>
            📲 Install as app
          </button>
        </div>
      </section>

      <footer>
        <div className="footer-logo">Sh<span>ie</span>ld</div>
        <div className="footer-text">Built with care for road safety in India · 100% free</div>
        <div className="footer-text">© 2026 Shield Safety</div>
      </footer>
    </>
  );
}