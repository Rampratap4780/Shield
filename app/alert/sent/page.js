'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lat = searchParams.get('lat') || '';
  const lng = searchParams.get('lng') || '';
  const contactsCount = searchParams.get('contacts') || '0';
  const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#111318;color:#f1f5f9;font-family:'Inter',sans-serif;min-height:100vh;}
        .page{max-width:480px;margin:0 auto;min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:24px;}
        .hero{text-align:center;margin-bottom:32px;}
        .hero-icon{font-size:56px;margin-bottom:16px;}
        .hero h2{font-size:24px;font-weight:700;color:#22c55e;margin-bottom:8px;}
        .hero p{font-size:14px;color:#9ca3af;line-height:1.6;}
        .info-card{background:#191c24;border:1px solid #2a2d3a;border-radius:16px;padding:16px;margin-bottom:12px;}
        .info-title{font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;}
        .info-row{display:flex;justify-content:space-between;font-size:13px;padding:5px 0;}
        .info-row+.info-row{border-top:1px solid #2a2d3a;}
        .info-label{color:#6b7280;}
        .info-val{color:#f1f5f9;font-weight:500;}
        .sent-badge{background:#14532d33;border:1px solid #22c55e44;color:#4ade80;font-size:11px;font-weight:600;padding:2px 10px;border-radius:10px;}
        .maps-btn{width:100%;background:#1e3a5f;border:1px solid #2563eb44;color:#60a5fa;padding:13px;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;margin-bottom:10px;transition:.15s;}
        .maps-btn:hover{background:#1e3a8a;}
        .home-btn{width:100%;background:transparent;border:1px solid #2a2d3a;color:#9ca3af;padding:13px;border-radius:12px;font-size:14px;font-weight:500;cursor:pointer;font-family:'Inter',sans-serif;transition:.15s;}
        .home-btn:hover{border-color:#374151;color:#f1f5f9;}
      `}</style>

      <div className="page">
        <div className="hero">
          <div className="hero-icon">✅</div>
          <h2>Alert Sent Successfully</h2>
          <p>Your emergency contacts have been notified with your GPS location.</p>
        </div>

        <div className="info-card">
          <div className="info-title">Alert Details</div>
          <div className="info-row">
            <span className="info-label">Time</span>
            <span className="info-val">{new Date().toLocaleTimeString()}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Location</span>
            <span className="info-val">{parseFloat(lat).toFixed(4)}°N</span>
          </div>
          <div className="info-row">
            <span className="info-label">Contacts alerted</span>
            <span className="info-val">{contactsCount} contacts</span>
          </div>
          <div className="info-row">
            <span className="info-label">Status</span>
            <span className="sent-badge">Sent ✓</span>
          </div>
        </div>

        <button
          className="maps-btn"
          onClick={() => window.open(mapsLink, '_blank')}
        >
          📍 View Location on Google Maps
        </button>

        <button
          className="home-btn"
          onClick={() => router.push('/dashboard')}
        >
          ← Back to Dashboard
        </button>
      </div>
    </>
  );
}

export default function SentPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh', background: '#111318',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#9ca3af', fontFamily: 'Inter, sans-serif'
      }}>Loading...</div>
    }>
      <SentContent />
    </Suspense>
  );
}