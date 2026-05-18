'use client';

import { useEffect } from 'react';
import './globals.css';

export default function RootLayout({ children }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('SW registered'))
        .catch(console.error);
    }
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      window.deferredPrompt = e;
    });
  }, []);

  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Shield" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>{children}</body>
    </html>
  );
}