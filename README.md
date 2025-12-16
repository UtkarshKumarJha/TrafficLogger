# 🚦 Traffic Intelligence Hub

![Render Status](https://img.shields.io/badge/Render-Deployed-46E3B7?logo=render&logoColor=white)
![Vercel Status](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

A production-ready **IoT & Analytics Platform** that automates vehicle detection using Edge AI and provides real-time traffic intelligence. Designed to replace manual traffic logging with a scalable, automated pipeline combining Computer Vision and Big Data Analytics.

## 🧩 The Problem
Manual traffic monitoring is inefficient, costly, and lacks actionable insights. City planners and authorities need granular data—not just "total cars," but **"When is the peak hour?"** and **"What is the vehicle composition at 5 PM?"** to optimize traffic flow and infrastructure.

---

## ✨ Key Features

### 🧠 Edge AI & Detection
- **YOLOv8 Object Detection:** Real-time identification of Light Vehicles, Heavy Vehicles, and Two-Wheelers.
- **Object Tracking:** Sort capabilities to track unique vehicles across frames to prevent double-counting.
- **Edge-Cloud Sync:** Python script processes video locally and pushes lightweight JSON telemetry to the cloud API.

### 📊 Advanced Analytics Dashboard
- **Time-Series Analysis:** Interactive Line charts visualizing traffic volume trends over 24 hours.
- **Composition Analysis:** Stacked Bar charts showing vehicle distribution (e.g., Heavy vs. Light) per hour.
- **Smart KPIs:** Automatic calculation of **Peak Traffic Hour**, Total Volume, and Heavy Load %.
- **Granular Filtering:** Filter data by specific Date Ranges, Locations, or Vehicle Types.

### ⚡ Engineering Optimizations
- **Database Indexing:** Implemented Compound Indexes (`vehicle_type` + `timestamp`) in MongoDB, reducing query latency by **~65% (140ms → 50ms)** for large datasets.
- **Responsive UI:** Fully responsive Flexbox/Grid layout optimized for mobile and desktop monitoring.
- **Loading States:** Enhanced UX with skeleton loaders and graceful error handling.

---

## 🛠 Tech Stack

| Component | Technology |
| :--- | :--- |
| **Edge AI** | Python, OpenCV, CVZone, YOLOv8, NumPy |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Atlas) + Mongoose (Optimized Schema) |
| **Frontend** | React.js (Vite), Chart.js, React-Data-Table, Axios |
| **Styling** | Modern CSS (Glassmorphism), Flexbox/Grid |
| **DevOps** | Render (Backend), Vercel (Frontend), Git |

---

## 🏗 System Architecture

```mermaid
graph LR
    Camera["CCTV Source / Video"] -->|Frame| AI["Python Edge AI"]
    AI -->|"Detect & Track"| YOLO["YOLO Model"]
    YOLO -->|"HTTP POST"| API["Node.js Server"]
    API -->|Store| DB[("MongoDB Atlas")]
    User["React Dashboard"] -->|"HTTP GET (Filtered)"| API
    API -->|"Aggregated Data"| User
```

## 🚀 Deployment Links
- Live Dashboard: https://traffic-logger-one.vercel.app
- API Server: https://trafficlogger-1.onrender.com

## 💻 Local Setup Guide
1. Clone the Repository
```bash
git clone [https://github.com/UtkarshKumarJha/TrafficLogger.git](https://github.com/UtkarshKumarJha/TrafficLogger.git)
cd TrafficLogger
```
2. Backend Setup
```bash
cd backend
npm install
# Create a .env file with: PORT=5000 and MONGO_URL=your_connection_string
node server.js
```
3. Frontend Setup (Vite)
```bash
cd ../frontend
npm install
npm run dev
```
4. Edge AI (Python)
```bash
cd ../Traffic_AI
pip install -r requirements.txt
python main.py
```
## 🧪 API Reference
- POST /api/log: Used by the Python AI to push detection data.

```json

{
  "vehicle_type": "Heavy Vehicle",
  "timestamp": "2025-12-15T14:30:00Z",
  "location": "Main Highway"
}
```
- GET /api/filter: Powering the dashboard analytics.

## 🛡 Performance Benchmarks
Query Optimization: Reduced fetch time for 100k records from 141ms to <50ms using Compound Indexing strategies.

Tracking Accuracy: Achieved high-fidelity detection on standard CCTV footage using YOLOv8 weights.

## 👤 Author
- Utkarsh Kumar Jha, Full Stack Developer & AI Enthusiast
- LinkedIn - https://www.linkedin.com/in/utkarsh-kumar-jha-993773284/
