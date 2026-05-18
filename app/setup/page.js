'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Setup() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [contacts, setContacts] = useState([
    { name: '', phone: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Device ID generate karo — ek baar
  const getDeviceId = () => {
    let id = localStorage.getItem('deviceId');
    if (!id) {
      id = 'device-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('deviceId', id);
    }
    return id;
  };

  const addContact = () => {
    if (contacts.length < 3) {
      setContacts([...contacts, { name: '', phone: '' }]);
    }
  };

  const removeContact = (index) => {
    if (contacts.length > 1) {
      setContacts(contacts.filter((_, i) => i !== index));
    }
  };

  const updateContact = (index, field, value) => {
    const updated = [...contacts];
    updated[index][field] = value;
    setContacts(updated);
  };

  const handleSubmit = async () => {
    setError('');

    // Validation
    if (!name.trim()) return setError('Please enter your name');
    if (!phone.trim()) return setError('Please enter your phone number');
    if (contacts.some(c => !c.name.trim() || !c.phone.trim())) {
      return setError('Please fill all contact details');
    }

    setLoading(true);

    try {
      const deviceId = getDeviceId();

      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, name, phone, contacts }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      // Save name locally for dashboard
      localStorage.setItem('userName', name);
      localStorage.setItem('setupDone', 'true');

      // Dashboard pe jao
      router.push('/dashboard');

    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#111318;color:#f1f5f9;font-family:'Inter',sans-serif;min-height:100vh;}

        .page{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;}
        .card{background:#191c24;border:1px solid #2a2d3a;border-radius:24px;padding:40px;width:100%;max-width:480px;}

        .card-header{text-align:center;margin-bottom:32px;}
        .logo{display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:20px;}
        .logo-icon{width:40px;height:40px;background:#2563eb;border-radius:12px;display:flex;align-items:center;justify-content:center;}
        .logo-text{font-size:22px;font-weight:700;color:#f1f5f9;}
        .logo-text span{color:#3b82f6;}
        .card-title{font-size:22px;font-weight:700;color:#f1f5f9;margin-bottom:8px;}
        .card-sub{font-size:14px;color:#9ca3af;line-height:1.6;}

        .section-title{font-size:11px;font-weight:600;color:#3b82f6;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;}

        .form-group{margin-bottom:14px;}
        .label{font-size:13px;font-weight:500;color:#9ca3af;margin-bottom:6px;display:block;}
        .input{width:100%;background:#222530;border:1px solid #2a2d3a;color:#f1f5f9;padding:12px 14px;border-radius:12px;font-size:14px;font-family:'Inter',sans-serif;outline:none;transition:.15s;}
        .input:focus{border-color:#2563eb;}
        .input::placeholder{color:#4b5563;}

        .divider{height:1px;background:#2a2d3a;margin:24px 0;}

        .contact-card{background:#222530;border:1px solid #2a2d3a;border-radius:14px;padding:16px;margin-bottom:12px;}
        .contact-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;}
        .contact-num{display:flex;align-items:center;gap:8px;}
        .contact-badge{width:24px;height:24px;background:#2563eb;border-radius:50%;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;color:#fff;}
        .contact-label{font-size:13px;font-weight:500;color:#f1f5f9;}
        .remove-btn{background:transparent;border:none;color:#6b7280;cursor:pointer;font-size:16px;padding:2px 6px;border-radius:6px;transition:.15s;}
        .remove-btn:hover{color:#ef4444;background:#2d1515;}

        .add-btn{width:100%;background:transparent;border:1px dashed #374151;color:#9ca3af;padding:12px;border-radius:12px;cursor:pointer;font-size:13px;font-family:'Inter',sans-serif;transition:.15s;margin-bottom:24px;}
        .add-btn:hover{border-color:#2563eb;color:#3b82f6;}
        .add-btn:disabled{opacity:.4;cursor:not-allowed;}

        .error-box{background:#2d1515;border:1px solid #7f1d1d;border-radius:10px;padding:10px 14px;font-size:13px;color:#fca5a5;margin-bottom:16px;}

        .submit-btn{width:100%;background:#2563eb;color:#fff;padding:14px;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;border:none;font-family:'Inter',sans-serif;transition:.15s;display:flex;align-items:center;justify-content:center;gap:8px;}
        .submit-btn:hover{background:#1d4ed8;}
        .submit-btn:disabled{opacity:.6;cursor:not-allowed;}

        .back-link{text-align:center;margin-top:16px;font-size:13px;color:#6b7280;cursor:pointer;}
        .back-link:hover{color:#9ca3af;}

        .steps{display:flex;justify-content:center;gap:8px;margin-bottom:28px;}
        .step-dot{width:8px;height:8px;border-radius:50%;background:#2a2d3a;}
        .step-dot.active{background:#2563eb;width:24px;border-radius:4px;}

        @media(max-width:520px){
          .card{padding:24px 20px;}
        }
      `}</style>

      <div className="page">
        <div className="card">

          {/* Logo */}
          <div className="logo">
            <div className="logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.5C16.5 22.15 20 17.25 20 12V6l-8-4z" fill="#fff" opacity=".95"/>
                <path d="M9 12l2 2 4-4" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="logo-text">Sh<span>ie</span>ld</span>
          </div>

          {/* Progress dots */}
          <div className="steps">
            <div className="step-dot active"></div>
            <div className="step-dot"></div>
            <div className="step-dot"></div>
          </div>

          {/* Header */}
          <div className="card-header">
            <div className="card-title">Setup your profile</div>
            <div className="card-sub">This is a one-time setup. Your family will be alerted in case of emergency.</div>
          </div>

          {/* Your info */}
          <div className="section-title">Your information</div>
          <div className="form-group">
            <label className="label">Full name</label>
            <input
              className="input"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="label">Your phone number</label>
            <input
              className="input"
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>

          <div className="divider"></div>

          {/* Emergency contacts */}
          <div className="section-title">Emergency contacts</div>

          {contacts.map((contact, index) => (
            <div className="contact-card" key={index}>
              <div className="contact-header">
                <div className="contact-num">
                  <div className="contact-badge">{index + 1}</div>
                  <span className="contact-label">Contact {index + 1}</span>
                </div>
                {contacts.length > 1 && (
                  <button className="remove-btn" onClick={() => removeContact(index)}>✕</button>
                )}
              </div>
              <div className="form-group">
                <label className="label">Name</label>
                <input
                  className="input"
                  type="text"
                  placeholder="e.g. Mom, Papa, Sister"
                  value={contact.name}
                  onChange={e => updateContact(index, 'name', e.target.value)}
                />
              </div>
              <div className="form-group" style={{marginBottom:0}}>
                <label className="label">WhatsApp number</label>
                <input
                  className="input"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={contact.phone}
                  onChange={e => updateContact(index, 'phone', e.target.value)}
                />
              </div>
            </div>
          ))}

          <button
            className="add-btn"
            onClick={addContact}
            disabled={contacts.length >= 3}
          >
            + Add another contact {contacts.length}/3
          </button>

          {/* Error */}
          {error && <div className="error-box">⚠ {error}</div>}

          {/* Submit */}
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{animation:'spin 1s linear infinite'}}>
                  <circle cx="12" cy="12" r="10" stroke="#ffffff44" strokeWidth="3"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                Saving...
              </>
            ) : (
              <>
                Save & Continue →
              </>
            )}
          </button>
          <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

          <div className="back-link" onClick={() => router.push('/')}>
            ← Back to home
          </div>

        </div>
      </div>
    </>
  );
}