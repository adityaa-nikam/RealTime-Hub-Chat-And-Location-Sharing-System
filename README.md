# 🛰️ RealTime Hub-Chat-And-Location-Sharing-System

**Real-time Chat & Live Location Sharing System**

A simple full-stack web app that allows users to:
- Chat in real time using Socket.IO
- Share their live location on an interactive map using Leaflet.js

---

## 🚀 Tech Stack
- **Frontend:** HTML, CSS, EJS
- **Backend:** Node.js, Express.js
- **Real-time Engine:** Socket.IO
- **Map Library:** Leaflet.js

---

## ⚙️ Features
- Instant chat messaging (no page refresh)
- Live GPS-based location sharing
- Join/Leave notifications
- Event-driven architecture
- Clean and modern UI (white/black theme)

---

## 🧩 How It Works
1. User joins chat → server assigns socket connection  
2. Messages are sent using Socket.IO events  
3. For location, browser geolocation sends coordinates to server  
4. Server broadcasts updates to all connected clients  

---

## 📸 Screenshots
*(Add screenshots of your chat and map pages here)*

---

## 🧠 Learning Outcome
- Understood real-time data flow with WebSockets
- Learned basics of Express routing and backend communication
- Built full-stack integration between frontend and server

---

## 🔧 Run Locally
```bash
npm install
node app.js
