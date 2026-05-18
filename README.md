# 🚗 Smart Virtual Dashcam & Automated Emergency System

> Transform your phone into an intelligent road-safety device — AI-powered accident detection with automated emergency alerts.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![MediaPipe](https://img.shields.io/badge/MediaPipe-0097A7?style=for-the-badge&logo=google&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

---

## 📖 About The Project

**Smart Virtual Dashcam** turns any smartphone into an intelligent safety device. It silently monitors your drive using the phone's sensors and on-device AI — and when a real accident is detected, it **automatically sends an emergency email with your GPS location** to your family or emergency contacts. Zero human action required.

---

## 🔄 How It Works

### 1. 📡 Continuous Monitoring
While driving, the app silently tracks **3 data streams** in the background:

| Sensor | Role |
|--------|------|
| 📳 **Accelerometer** | Detects sudden motion, impact force, speed changes |
| 🎙️ **Microphone** | Listens for crash/glass-breaking sounds via TensorFlow.js |
| 📷 **Camera** | Analyzes visual frame for sudden jolts via MediaPipe |

---

### 2. 💥 Event Detection
If the vehicle brakes hard or collides, the accelerometer shows a sharp **spike** — the system immediately enters **Alert Mode**.

---

### 3. 🧠 AI Cross-Verification (False Alarm Prevention)
Before sending any alert, the AI cross-checks both sensors:

- 🎙️ *"Did the last 2–3 seconds contain a crash or breaking sound?"*
- 📷 *"Did the camera frame show a sudden impact jolt?"*

✅ Both confirm → **Accident verified** → Proceed to emergency response  
❌ Not confirmed → **False alarm** (speed bump / phone drop) → No alert sent

---

### 4. 📍 GPS Location Capture
Accident confirmed → system instantly captures the phone's **exact Latitude & Longitude** and generates a Google Maps link.

---

### 5. 📧 Automated Emergency Alert
React frontend signals the Node.js backend, which sends an emergency email **automatically**:

```
🚨 EMERGENCY ALERT

An accident may have occurred.

📍 Location: https://maps.google.com/?q=LAT,LONG

Please contact the driver or dispatch help immediately.
```

Delivered instantly to pre-configured emergency contacts (family, ambulance, hospital).

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js (React) |
| AI — Audio | TensorFlow.js |
| AI — Vision | MediaPipe |
| Backend | Node.js |
| Email | Nodemailer / SendGrid |
| Sensors | Web Device Motion API, getUserMedia |
| Location | Browser Geolocation API |

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18+`
- HTTPS connection (required for camera/sensor access)
- Smartphone or webcam-enabled browser

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/smart-dashcam.git
cd smart-dashcam

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
```

### Environment Variables

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMERGENCY_EMAIL=emergency_contact@gmail.com
```

### Run

```bash
npm run dev    # Development
npm run build  # Production build
npm start      # Start production server
```

---

## 📁 Project Structure

```
smart-dashcam/
├── app/
│   ├── page.jsx                  # Main dashboard UI
│   └── api/
│       └── emergency/
│           └── route.js          # Emergency email API
├── components/
│   ├── AccelerometerMonitor.jsx
│   ├── AudioDetector.jsx
│   └── CameraMonitor.jsx
├── lib/
│   ├── tensorflowModel.js        # TensorFlow.js audio model
│   ├── mediapipe.js              # MediaPipe vision setup
│   └── mailer.js                 # Email utility
├── .env.local                    # Secret credentials (not committed)
├── .gitignore
└── README.md
```

---

## 🔐 Privacy & Security

- ✅ All AI processing happens **on-device** — no audio/video is uploaded to any server
- ✅ GPS is captured **only** at the moment of a confirmed accident
- ✅ Camera & microphone require explicit **user permission**
- ✅ Credentials stored securely via environment variables

---
## 📄 License

© 2026 Rampratap Singh Rajpoot. All Rights Reserved.

This project is NOT open-source. The source code is provided here for evaluation and portfolio demonstration purposes only. You are not granted permission to copy, modify, distribute, or use this code for any personal or commercial purposes without explicit permission.

---

<p align="center">Made with ❤️ to make roads safer for everyone.</p>
