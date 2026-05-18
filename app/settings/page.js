'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(false);

  // Edit form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [contacts, setContacts] = useState([]);
  const [gforceThreshold, setGforceThreshold] = useState(3.5);
  const [alertCountdown, setAlertCountdown] = useState(30);
  const [emailBackup, setEmailBackup] = useState(false);

  // Alert history
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadUser();
    loadHistory();
  }, []);

  const loadUser = async () => {
    const deviceId = localStorage.getItem('deviceId');
    if (!deviceId) { router.push('/setup'); return; }

    try {
      const res = await fetch(`/api/user?deviceId=${deviceId}`);
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setName(data.user.name);
        setPhone(data.user.phone);
        setContacts(data.user.contacts);
        setGforceThreshold(data.user.settings?.gforceThreshold || 3.5);
        setAlertCountdown(data.user.settings?.alertCountdown || 30);
        setEmailBackup(data.user.settings?.emailBackup || false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    const deviceId = localStorage.getItem('deviceId');
    if (!deviceId) return;
    try {
      const res = await fetch(`/api/alert?deviceId=${deviceId}`);
      const data = await res.json();
      setHistory(data.alerts || []);
    } catch (err) {
      console.error(err);
    }
  };

  const updateContact = (i, field, val) => {
    const updated = [...contacts];
    updated[i][field] = val;
    setContacts(updated);
  };

  const addContact = () => {
    if (contacts.length < 3) setContacts([...contacts, { name: '', phone: '' }]);
  };

  const removeContact = (i) => {
    if (contacts.length > 1) setContacts(contacts.filter((_, idx) => idx !== i));
  };

  const saveProfile = async () => {
    setSaving(true);
    const deviceId = localStorage.getItem('deviceId');
    try {
      await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, name, phone, contacts }),
      });
      localStorage.setItem('userName', name);
      setSaved(true);
      setEditing(false);
      loadUser();
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    const deviceId = localStorage.getItem('deviceId');
    try {
      await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId,
          settings: { gforceThreshold, alertCountdown, emailBackup }
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const clearData = () => {
    if (confirm('Clear all data? This cannot be undone.')) {
      localStorage.clear();
      router.push('/');
    }
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString() + ' · ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return (
    <div style={{
      minHeight: '100vh', background: '#111318',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, sans-serif', color: '#6b7280'
    }}>
      Loading...
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#111318;color:#f1f5f9;font-family:'Inter',sans-serif;min-height:100vh;}

        .page{max-width:480px;margin:0 auto;padding:0 24px 100px;}

        .topbar{display:flex;align-items:center;gap:12px;padding:20px 0;}
        .back-btn{width:38px;height:38px;background:#191c24;border:1px solid #2a2d3a;
          border-radius:10px;display:flex;align-items:center;justify-content:center;
          cursor:pointer;font-size:16px;flex-shrink:0;}
        .topbar h2{font-size:20px;font-weight:700;color:#f1f5f9;}

        .saved-toast{background:#14532d;border:1px solid #22c55e44;
          color:#4ade80;padding:10px 16px;border-radius:10px;
          font-size:13px;font-weight:500;margin-bottom:16px;text-align:center;}

        .sec{margin-bottom:24px;}
        .sec-label{font-size:11px;font-weight:600;color:#6b7280;
          text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;}

        .card{background:#191c24;border:1px solid #2a2d3a;border-radius:16px;overflow:hidden;}
        .card-row{display:flex;justify-content:space-between;align-items:center;
          padding:13px 16px;font-size:13px;}
        .card-row+.card-row{border-top:1px solid #2a2d3a;}
        .row-label{color:#9ca3af;}
        .row-val{color:#f1f5f9;font-weight:500;}

        .edit-btn{background:transparent;border:1px solid #2a2d3a;color:#9ca3af;
          padding:5px 14px;border-radius:8px;font-size:12px;cursor:pointer;
          font-family:'Inter',sans-serif;transition:.15s;}
        .edit-btn:hover{border-color:#374151;color:#f1f5f9;}

        .form-inside{padding:14px 16px;border-top:1px solid #2a2d3a;}
        .label{font-size:12px;font-weight:500;color:#6b7280;margin-bottom:5px;display:block;}
        .input{width:100%;background:#222530;border:1px solid #2a2d3a;color:#f1f5f9;
          padding:10px 12px;border-radius:10px;font-size:13px;
          font-family:'Inter',sans-serif;outline:none;margin-bottom:10px;}
        .input:focus{border-color:#2563eb;}

        .contact-item{background:#222530;border:1px solid #2a2d3a;
          border-radius:12px;padding:12px;margin-bottom:8px;}
        .contact-top{display:flex;justify-content:space-between;
          align-items:center;margin-bottom:8px;}
        .contact-badge{width:22px;height:22px;background:#2563eb;border-radius:50%;
          font-size:10px;font-weight:700;display:flex;align-items:center;
          justify-content:center;color:#fff;}
        .remove-btn{background:transparent;border:none;color:#6b7280;
          cursor:pointer;font-size:14px;padding:2px 6px;border-radius:6px;}
        .remove-btn:hover{color:#ef4444;}
        .add-contact-btn{width:100%;background:transparent;
          border:1px dashed #374151;color:#6b7280;padding:10px;
          border-radius:10px;cursor:pointer;font-size:13px;
          font-family:'Inter',sans-serif;margin-bottom:12px;transition:.15s;}
        .add-contact-btn:hover{border-color:#2563eb;color:#3b82f6;}

        .save-btn{width:100%;background:#2563eb;color:#fff;padding:12px;
          border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;
          border:none;font-family:'Inter',sans-serif;transition:.15s;}
        .save-btn:hover{background:#1d4ed8;}
        .save-btn:disabled{opacity:.6;cursor:not-allowed;}

        /* Slider */
        .slider-row{padding:13px 16px;}
        .slider-row+.slider-row{border-top:1px solid #2a2d3a;}
        .slider-top{display:flex;justify-content:space-between;
          align-items:center;margin-bottom:8px;}
        .slider-label{font-size:13px;color:#9ca3af;}
        .slider-val{font-size:13px;font-weight:600;color:#3b82f6;}
        input[type=range]{width:100%;accent-color:#2563eb;cursor:pointer;}

        /* Toggle */
        .toggle-row{display:flex;justify-content:space-between;
          align-items:center;padding:13px 16px;}
        .toggle-row+.toggle-row{border-top:1px solid #2a2d3a;}
        .toggle{width:42px;height:24px;border-radius:12px;
          position:relative;cursor:pointer;transition:.2s;flex-shrink:0;}
        .toggle.on{background:#2563eb;}
        .toggle.off{background:#374151;}
        .toggle-knob{width:18px;height:18px;background:#fff;
          border-radius:50%;position:absolute;top:3px;transition:.2s;}
        .toggle.on .toggle-knob{right:3px;}
        .toggle.off .toggle-knob{left:3px;}

        /* History */
        .history-row{display:flex;justify-content:space-between;
          align-items:center;padding:10px 16px;font-size:12px;}
        .history-row+.history-row{border-top:1px solid #2a2d3a;}
        .h-left{display:flex;align-items:center;gap:8px;}
        .h-type{font-size:10px;font-weight:600;padding:2px 8px;border-radius:8px;}
        .ht-drive{background:#2d1515;color:#fca5a5;}
        .ht-market{background:#0f2a1a;color:#86efac;}
        .h-status{font-size:10px;padding:2px 8px;border-radius:8px;}
        .hs-cancelled{background:#1c2033;color:#818cf8;}
        .hs-sent{background:#14532d33;color:#4ade80;}
        .h-time{color:#4b5563;}
        .empty-history{padding:20px;text-align:center;color:#4b5563;font-size:13px;}

        /* Danger */
        .danger-btn{width:100%;background:transparent;
          border:1px solid #7f1d1d;color:#fca5a5;padding:12px;
          border-radius:12px;font-size:14px;cursor:pointer;
          font-family:'Inter',sans-serif;transition:.15s;}
        .danger-btn:hover{background:#2d1515;}

        /* Bottom nav */
        .bottom-nav{position:fixed;bottom:0;left:0;right:0;
          background:#191c24;border-top:1px solid #2a2d3a;
          padding:12px 24px;display:flex;justify-content:space-around;
          max-width:480px;margin:0 auto;}
        .nav-item{display:flex;flex-direction:column;align-items:center;
          gap:4px;cursor:pointer;padding:4px 12px;}
        .nav-item span:first-child{font-size:20px;}
        .nav-item span:last-child{font-size:10px;color:#6b7280;font-weight:500;}
        .nav-item.active span:last-child{color:#3b82f6;}
      `}</style>

      <div className="page">

        {/* Topbar */}
        <div className="topbar">
          <div className="back-btn" onClick={() => router.push('/dashboard')}>←</div>
          <h2>Settings</h2>
        </div>

        {/* Saved toast */}
        {saved && <div className="saved-toast">✓ Changes saved successfully</div>}

        {/* Profile section */}
        <div className="sec">
          <div className="sec-label">Profile</div>
          <div className="card">
            {!editing ? (
              <>
                <div className="card-row">
                  <span className="row-label">Name</span>
                  <span className="row-val">{user?.name}</span>
                </div>
                <div className="card-row">
                  <span className="row-label">Phone</span>
                  <span className="row-val">{user?.phone}</span>
                </div>
                <div className="card-row">
                  <span className="row-label">Contacts</span>
                  <span className="row-val">{user?.contacts?.length} saved</span>
                </div>
                <div className="card-row">
                  <span className="row-label">Edit profile & contacts</span>
                  <button className="edit-btn" onClick={() => setEditing(true)}>Edit</button>
                </div>
              </>
            ) : (
              <div className="form-inside">
                <label className="label">Your name</label>
                <input className="input" value={name} onChange={e => setName(e.target.value)} />
                <label className="label">Your phone</label>
                <input className="input" value={phone} onChange={e => setPhone(e.target.value)} />
                <label className="label" style={{ marginBottom: '10px' }}>Emergency contacts</label>
                {contacts.map((c, i) => (
                  <div className="contact-item" key={i}>
                    <div className="contact-top">
                      <div className="contact-badge">{i + 1}</div>
                      {contacts.length > 1 && (
                        <button className="remove-btn" onClick={() => removeContact(i)}>✕</button>
                      )}
                    </div>
                    <input className="input" placeholder="Name" value={c.name}
                      onChange={e => updateContact(i, 'name', e.target.value)} />
                    <input className="input" placeholder="WhatsApp number" value={c.phone}
                      onChange={e => updateContact(i, 'phone', e.target.value)}
                      style={{ marginBottom: 0 }} />
                  </div>
                ))}
                {contacts.length < 3 && (
                  <button className="add-contact-btn" onClick={addContact}>
                    + Add contact ({contacts.length}/3)
                  </button>
                )}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="save-btn" onClick={saveProfile} disabled={saving}>
                    {saving ? 'Saving...' : 'Save changes'}
                  </button>
                  <button className="edit-btn" style={{ padding: '12px 16px' }}
                    onClick={() => setEditing(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detection settings */}
        <div className="sec">
          <div className="sec-label">Detection Settings</div>
          <div className="card">
            <div className="slider-row">
              <div className="slider-top">
                <span className="slider-label">G-Force threshold</span>
                <span className="slider-val">{gforceThreshold}g</span>
              </div>
              <input type="range" min="2" max="6" step="0.5"
                value={gforceThreshold}
                onChange={e => setGforceThreshold(parseFloat(e.target.value))} />
            </div>
            <div className="slider-row">
              <div className="slider-top">
                <span className="slider-label">Alert countdown</span>
                <span className="slider-val">{alertCountdown}s</span>
              </div>
              <input type="range" min="10" max="60" step="5"
                value={alertCountdown}
                onChange={e => setAlertCountdown(parseInt(e.target.value))} />
            </div>
            <div className="toggle-row">
              <span className="slider-label">Email backup alerts</span>
              <div className={`toggle ${emailBackup ? 'on' : 'off'}`}
                onClick={() => setEmailBackup(!emailBackup)}>
                <div className="toggle-knob"></div>
              </div>
            </div>
            <div style={{ padding: '12px 16px', borderTop: '1px solid #2a2d3a' }}>
              <button className="save-btn" onClick={saveSettings} disabled={saving}>
                {saving ? 'Saving...' : 'Save settings'}
              </button>
            </div>
          </div>
        </div>

        {/* Alert history */}
        <div className="sec">
          <div className="sec-label">Alert History</div>
          <div className="card">
            {history.length === 0 ? (
              <div className="empty-history">No alerts yet — stay safe 🛡️</div>
            ) : (
              history.slice(0, 10).map((a, i) => (
                <div key={i} className="history-row">
                  <div className="h-left">
                    <span className={`h-type ${a.mode === 'drive' ? 'ht-drive' : 'ht-market'}`}>
                      {a.mode}
                    </span>
                    <span style={{ color: '#9ca3af' }}>{a.trigger}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`h-status ${a.cancelled ? 'hs-cancelled' : 'hs-sent'}`}>
                      {a.cancelled ? 'Cancelled' : 'Sent'}
                    </span>
                    <span className="h-time">{formatTime(a.createdAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Danger zone */}
        <div className="sec">
          <div className="sec-label">Data</div>
          <button className="danger-btn" onClick={clearData}>
            🗑 Clear all data & reset app
          </button>
        </div>

      </div>

      {/* Bottom nav */}
      <div className="bottom-nav">
        <div className="nav-item" onClick={() => router.push('/dashboard')}>
          <span>🏠</span>
          <span>Home</span>
        </div>
        <div className="nav-item active">
          <span>⚙️</span>
          <span>Settings</span>
        </div>
      </div>
    </>
  );
}