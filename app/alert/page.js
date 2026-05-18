'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function AlertContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(30);
  const [contacts, setContacts] = useState([]);
  const [userName, setUserName] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const timerRef = useRef(null);
  const alertIdRef = useRef(null);

  // URL se data lo
  const gforce = searchParams.get('gforce') || '0';
  const audioDb = searchParams.get('audioDb') || '0';
  const lat = searchParams.get('lat') || '';
  const lng = searchParams.get('lng') || '';
  const roadType = searchParams.get('roadType') || '';
  const trigger = searchParams.get('trigger') || 'crash';

  useEffect(() => {
    // User data lo
    const name = localStorage.getItem('userName') || 'User';
    setUserName(name);
    const deviceId = localStorage.getItem('deviceId');

    if (deviceId) {
      fetch(`/api/user?deviceId=${deviceId}`)
        .then(res => res.json())
        .then(data => {
          if (data.user) setContacts(data.user.contacts || []);
        })
        .catch(console.error);
    }

    // Vibrate phone
    if (navigator.vibrate) {
      navigator.vibrate([500, 200, 500, 200, 500]);
    }

    // Alert DB mein save karo
    saveAlert(deviceId);

    // Countdown start
    startCountdown();

    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  const saveAlert = async (deviceId) => {
    try {
      const res = await fetch('/api/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId,
          mode: 'drive',
          trigger,
          location: { lat: parseFloat(lat) || null, lng: parseFloat(lng) || null },
          roadType,
        }),
      });
      const data = await res.json();
      alertIdRef.current = data.alert?._id;
    } catch (err) {
      console.error('Alert save error:', err);
    }
  };

  const startCountdown = () => {
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          sendEmergency();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sendEmergency = async () => {
    if (sending || sent) return;
    setSending(true);
    clearInterval(timerRef.current);

    const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
    const message = `🚨 EMERGENCY: ${userName} may have had an accident!\n\nLocation: ${mapsLink}\n\nG-Force: ${gforce}g\nTime: ${new Date().toLocaleTimeString()}\n\nPlease check immediately!`;

    // WhatsApp links open karo saare contacts ke liye
    contacts.forEach((contact, index) => {
      const phone = contact.phone.replace(/[^0-9]/g, '');
      const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, index * 1500); // har contact ke beech 1.5s gap
    });

    setSent(true);
    setSending(false);

    // Alert sent screen pe jao
    setTimeout(() => {
      router.push(`/alert/sent?lat=${lat}&lng=${lng}&contacts=${contacts.length}`);
    }, 2000);
  };

  const handleCancel = async () => {
    clearInterval(timerRef.current);
    setCancelled(true);

    // DB mein cancel mark karo
    if (alertIdRef.current) {
      try {
        await fetch(`/api/alert/${alertIdRef.current}`, {
          method: 'PUT',
        });
      } catch (err) {
        console.error('Cancel error:', err);
      }
    }

    // Dashboard pe wapas jao
    setTimeout(() => router.push('/dashboard'), 1000);
  };

  // Cancelled screen
  if (cancelled) {
    return (
      <div style={{
        minHeight: '100vh', background: '#111318',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: '16px', fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{ fontSize: '52px' }}>✅</div>
        <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#22c55e' }}>You are safe!</h2>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Alert cancelled. Returning to dashboard...</p>
      </div>
    );
  }

  // Sent screen
  if (sent) {
    return (
      <div style={{
        minHeight: '100vh', background: '#111318',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: '16px', fontFamily: 'Inter, sans-serif', padding: '24px'
      }}>
        <div style={{ fontSize: '52px' }}>📱</div>
        <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#3b82f6', textAlign: 'center' }}>Opening WhatsApp...</h2>
        <p style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center' }}>Sending alerts to {contacts.length} contact(s)</p>
      </div>
    );
  }

  // Timer color
  const timerColor = countdown <= 10 ? '#ef4444' : countdown <= 20 ? '#f59e0b' : '#f1f5f9';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#1a0505;color:#f1f5f9;font-family:'Inter',sans-serif;min-height:100vh;}

        .page{max-width:480px;margin:0 auto;min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:24px;}

        .alert-icon{text-align:center;margin-bottom:16px;}
        .alert-icon div{font-size:60px;animation:shake .4s ease-in-out infinite alternate;}
        @keyframes shake{from{transform:rotate(-4deg)}to{transform:rotate(4deg)}}

        .alert-title{text-align:center;margin-bottom:28px;}
        .alert-title h1{font-size:28px;font-weight:800;color:#ef4444;margin-bottom:8px;}
        .alert-title p{font-size:14px;color:#fca5a5;line-height:1.6;}

        .timer-wrap{display:flex;flex-direction:column;align-items:center;margin-bottom:28px;}
        .timer-circle{width:120px;height:120px;border-radius:50%;border:5px solid #7f1d1d;display:flex;flex-direction:column;align-items:center;justify-content:center;margin-bottom:10px;position:relative;}
        .timer-num{font-size:44px;font-weight:800;line-height:1;}
        .timer-label{font-size:11px;color:#fca5a5;font-weight:500;}
        .timer-sub{font-size:13px;color:#fca5a5;}

        .contacts-box{background:#2d151533;border:1px solid #7f1d1d55;border-radius:16px;padding:14px 16px;margin-bottom:24px;}
        .contacts-title{font-size:11px;font-weight:600;color:#fca5a5;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;}
        .contact-row{display:flex;justify-content:space-between;align-items:center;padding:5px 0;font-size:13px;}
        .contact-row+.contact-row{border-top:1px solid #7f1d1d33;}
        .contact-name{color:#fecaca;font-weight:500;}
        .contact-phone{color:#fca5a5;}

        .location-box{background:#1c203322;border:1px solid #2d355522;border-radius:12px;padding:10px 14px;margin-bottom:24px;display:flex;align-items:center;gap:10px;}
        .loc-icon{font-size:18px;}
        .loc-text{font-size:12px;color:#9ca3af;}
        .loc-val{font-size:13px;color:#f1f5f9;font-weight:500;margin-top:2px;}

        .safe-btn{width:100%;background:#16a34a;color:#fff;padding:18px;border-radius:14px;font-size:16px;font-weight:700;cursor:pointer;border:none;font-family:'Inter',sans-serif;transition:.15s;margin-bottom:12px;}
        .safe-btn:hover{background:#15803d;}
        .safe-btn:active{transform:scale(0.98);}

        .send-now-btn{width:100%;background:#7f1d1d;color:#fca5a5;padding:13px;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;border:1px solid #ef444455;font-family:'Inter',sans-serif;transition:.15s;}
        .send-now-btn:hover{background:#991b1b;}
        .sending{opacity:.6;cursor:not-allowed;}
      `}</style>

      <div className="page">

        {/* Icon */}
        <div className="alert-icon">
          <div>🚨</div>
        </div>

        {/* Title */}
        <div className="alert-title">
          <h1>Are You OK?</h1>
          <p>Possible accident detected.<br />Your contacts will be alerted automatically.</p>
        </div>

        {/* Countdown */}
        <div className="timer-wrap">
          <div className="timer-circle">
            <div className="timer-num" style={{ color: timerColor }}>{countdown}</div>
            <div className="timer-label">seconds</div>
          </div>
          <div className="timer-sub">Alert sends automatically when timer ends</div>
        </div>

        {/* Contacts */}
        <div className="contacts-box">
          <div className="contacts-title">Will be alerted</div>
          {contacts.map((c, i) => (
            <div key={i} className="contact-row">
              <span className="contact-name">{c.name}</span>
              <span className="contact-phone">{c.phone}</span>
            </div>
          ))}
        </div>

        {/* Location */}
        {lat && lng && (
          <div className="location-box">
            <div className="loc-icon">📍</div>
            <div>
              <div className="loc-text">Your location</div>
              <div className="loc-val">{parseFloat(lat).toFixed(4)}°N, {parseFloat(lng).toFixed(4)}°E</div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <button className="safe-btn" onClick={handleCancel}>
          ✓ I AM SAFE — Cancel Alert
        </button>

        <button
          className={`send-now-btn ${sending ? 'sending' : ''}`}
          onClick={sendEmergency}
          disabled={sending}
        >
          {sending ? 'Sending...' : '🚨 Send Alert Now'}
        </button>

      </div>
    </>
  );
}

export default function AlertPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh', background: '#1a0505',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fca5a5', fontFamily: 'Inter, sans-serif'
      }}>
        Loading...
      </div>
    }>
      <AlertContent />
    </Suspense>
  );
}