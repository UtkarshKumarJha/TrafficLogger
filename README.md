# 🚦 Vehicle Detection Logging System

A full-stack web application to automatically log and analyze traffic near railway-road intersections using CCTV surveillance and AI-based vehicle detection. Designed to assist railway authorities in monitoring vehicle patterns, improving gate control decisions, and enhancing safety.

## 🧩 Problem It Solves

Manual tracking of vehicle activity near railway crossings is time-consuming and error-prone. This system automates vehicle detection and logs data (vehicle type, timestamp, location) in real-time, enabling authorities to filter and visualize traffic insights quickly.

---

## ✨ Features

- 🚗 Real-time vehicle logging (type, timestamp, location)
- 📊 View and filter logs by type, date, and location
- 🗺️ Location-wise traffic data for better insights
- ☁️ RESTful API integration with AI-based detection
- 🌐 Fully deployed frontend and backend

---

## 🛠 Tech Stack

### Frontend
- React.js
- Axios
- Tailwind CSS
- Vercel (Deployment)

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Render (Deployment)

---

## 🚀 Deployment

- **Frontend:** [https://traffic-logger-one.vercel.app](https://traffic-logger-one.vercel.app)
- **Backend:** [https://trafficlogger-1.onrender.com](https://trafficlogger-1.onrender.com)

---

## 🧪 API Endpoints

### `POST /api/log`

Logs a new vehicle detection entry.

**Request Body:**
```json
{
  "vehicle_type": "car",
  "timestamp": "2025-06-25T15:30:00Z",
  "location": "Jaipur Crossing 3"
}


