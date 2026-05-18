'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setupDone = localStorage.getItem('setupDone');
    if (!setupDone) {
      router.push('/setup');
      return;
    }

    const name = localStorage.getItem('userName') || 'User';
    setUserName(name);

    // Contacts fetch karo
    const deviceId = localStorage.getItem('deviceId');
    if (deviceId) {
      fetch(`/api/user?deviceId=${deviceId}`)
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setContacts(data.user.contacts || []);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const getInitial = (name) => name?.charAt(0)?.toUpperCase() || '?';

  const avatarColors = [
    { bg: '#1e3a5f', color: '#93c5fd' },
    { bg: '#14532d', color: '#86efac' },
    { bg: '#3b1f6e', color: '#c4b5fd' },
  ];

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#111318',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px', height: '40px', border: '3px solid #2a2d3a',
            borderTop: '3px solid #2563eb', borderRadius: '50%',
            animation: 'spin 1s linear infinite', margin: '0 auto 12px'
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>Loading...</p>
          <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#111318;color:#f1f5f9;font-family:'Inter',sans-serif;min-height:100vh;}

        .page{max-width:480px;margin:0 auto;min-height:100vh;padding:0 0 100px;}

        /* Top bar */
        .topbar{display:flex;justify-content:space-between;align-items:center;padding:20px 24px 0;}
        .topbar-left h1{font-size:24px;font-weight:700;color:#f1f5f9;}
        .topbar-left p{font-size:14px;color:#6b7280;margin-top:2px;}
        .settings-btn{width:40px;height:40px;background:#191c24;border:1px solid #2a2d3a;border-radius:12px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:18px;transition:.15s;}
        .settings-btn:hover{border-color:#374151;}

        /* Status card */
        .status-card{margin:20px 24px 0;background:#191c24;border:1px solid #2a2d3a;border-radius:16px;padding:16px;}
        .status-row{display:flex;align-items:center;justify-content:space-between;}
        .status-left{display:flex;align-items:center;gap:10px;}
        .status-dot{width:8px;height:8px;border-radius:50%;background:#22c55e;box-shadow:0 0 8px #22c55e;}
        .status-text{font-size:13px;font-weight:500;color:#f1f5f9;}
        .status-sub{font-size:11px;color:#6b7280;margin-top:2px;}
        .avatars{display:flex;}
        .av{width:28px;height:28px;border-radius:50%;border:2px solid #191c24;font-size:11px;font-weight:600;display:flex;align-items:center;justify-content:center;margin-left:-8px;}
        .av:first-child{margin-left:0;}

        /* Section */
        .section{padding:28px 24px 0;}
        .section-title{font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;}

        /* Mode cards */
        .mode-card{border-radius:20px;padding:24px;cursor:pointer;transition:.2s;margin-bottom:14px;position:relative;overflow:hidden;}
        .mode-card:active{transform:scale(0.98);}
        .mode-card.drive{background:#1e1212;border:1px solid #7f1d1d44;}
        .mode-card.drive:hover{border-color:#ef444466;}
        .mode-card.walk{background:#0d1f14;border:1px solid #16653444;}
        .mode-card.walk:hover{border-color:#22c55e66;}
        .mode-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;}
        .mode-icon{font-size:32px;}
        .mode-badge{font-size:10px;font-weight:600;padding:3px 10px;border-radius:20px;}
        .drive .mode-badge{background:#2d151555;border:1px solid #7f1d1d55;color:#fca5a5;}
        .walk .mode-badge{background:#0f2a1a55;border:1px solid #16653455;color:#86efac;}
        .mode-card h3{font-size:18px;font-weight:700;color:#f1f5f9;margin-bottom:6px;}
        .mode-card p{font-size:13px;color:#9ca3af;line-height:1.55;margin-bottom:16px;}
        .mode-chips{display:flex;flex-wrap:wrap;gap:6px;}
        .chip{font-size:11px;padding:3px 9px;border-radius:7px;font-weight:500;}
        .chip-red{background:#2d1515;color:#fca5a5;border:1px solid #7f1d1d44;}
        .chip-green{background:#0f2a1a;color:#86efac;border:1px solid #16653444;}
        .mode-arrow{position:absolute;right:24px;bottom:24px;font-size:18px;color:#374151;}

        /* History */
        .history-card{background:#191c24;border:1px solid #2a2d3a;border-radius:16px;overflow:hidden;}
        .history-row{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid #2a2d3a;font-size:13px;}
        .history-row:last-child{border-bottom:none;}
        .history-left{display:flex;align-items:center;gap:10px;}
        .history-type{font-size:10px;font-weight:600;padding:2px 8px;border-radius:8px;}
        .ht-drive{background:#2d1515;color:#fca5a5;}
        .ht-walk{background:#0f2a1a;color:#86efac;}
        .history-desc{color:#9ca3af;}
        .history-time{color:#4b5563;font-size:12px;}
        .empty-history{padding:24px;text-align:center;color:#4b5563;font-size:13px;}

        /* Bottom nav */
        .bottom-nav{position:fixed;bottom:0;left:0;right:0;background:#191c24;border-top:1px solid #2a2d3a;padding:12px 24px;display:flex;justify-content:space-around;max-width:480px;margin:0 auto;}
        .nav-item{display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;padding:4px 12px;}
        .nav-item span:first-child{font-size:20px;}
        .nav-item span:last-child{font-size:10px;color:#6b7280;font-weight:500;}
        .nav-item.active span:last-child{color:#3b82f6;}

        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      `}</style>

      <div className="page">

        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-left">
            <h1>Hi, {userName} 👋</h1>
            <p>Stay safe today</p>
          </div>
          <div className="settings-btn" onClick={() => router.push('/settings')}>
            ⚙️
          </div>
        </div>

        {/* Status card */}
        <div className="status-card">
          <div className="status-row">
            <div className="status-left">
              <div className="status-dot"></div>
              <div>
                <div className="status-text">Protection ready</div>
                <div className="status-sub">{contacts.length} contact{contacts.length !== 1 ? 's' : ''} will be alerted</div>
              </div>
            </div>
            <div className="avatars">
              {contacts.slice(0, 3).map((c, i) => (
                <div
                  key={i}
                  className="av"
                  style={{ background: avatarColors[i].bg, color: avatarColors[i].color }}
                >
                  {getInitial(c.name)}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mode cards */}
        <div className="section">
          <div className="section-title">Choose your mode</div>

          <div className="mode-card drive" onClick={() => router.push('/drive')}>
            <div className="mode-top">
              <div className="mode-icon">🚗</div>
              <div className="mode-badge">Drive mode</div>
            </div>
            <h3>Start Driving</h3>
            <p>Monitors for accidents using accelerometer + AI sound detection. Filters road noise automatically.</p>
            <div className="mode-chips">
              <span className="chip chip-red">G-Force sensor</span>
              <span className="chip chip-red">AI audio</span>
              <span className="chip chip-red">Highway check</span>
              <span className="chip chip-red">GPS</span>
            </div>
            <div className="mode-arrow">→</div>
          </div>

          <div className="mode-card walk" onClick={() => router.push('/market')}>
            <div className="mode-top">
              <div className="mode-icon">🚶</div>
              <div className="mode-badge">Safety mode</div>
            </div>
            <h3>Going Out on Foot</h3>
            <p>Listens silently for distress keywords. Discreet background mode — no screen needed.</p>
            <div className="mode-chips">
              <span className="chip chip-green">Help</span>
              <span className="chip chip-green">Bachao</span>
              <span className="chip chip-green">Save me</span>
              <span className="chip chip-green">Chhodo</span>
            </div>
            <div className="mode-arrow">→</div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="section">
          <div className="section-title">Recent activity</div>
          <div className="history-card">
            <div className="empty-history">
              No activity yet — stay safe out there 🛡️
            </div>
          </div>
        </div>

      </div>

      {/* Bottom nav */}
      <div className="bottom-nav">
        <div className="nav-item active">
          <span>🏠</span>
          <span>Home</span>
        </div>
        <div className="nav-item" onClick={() => router.push('/settings')}>
          <span>⚙️</span>
          <span>Settings</span>
        </div>
      </div>
    </>
  );
}