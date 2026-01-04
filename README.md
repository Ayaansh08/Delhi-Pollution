# Delhi Pollution Dashboard: Ward-Level Air Quality Monitoring

> Real-time AQI analysis and geospatial visualization across 272 Delhi administrative wards

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Built%20with-Vite-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Language-Python-3776AB?style=flat-square&logo=python)](https://www.python.org/)
[![GeoPandas](https://img.shields.io/badge/Geospatial-GeoPandas-FF6B6B?style=flat-square&logo=pandas)](https://geopandas.org/)
[![Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?style=flat-square&logo=render)](https://render.com/)

## ▸ Overview

Delhi Pollution Dashboard transforms scattered air quality data into actionable intelligence. Combining 52,560+ hourly AQI readings with 272 ward geospatial boundaries, it provides residents, policymakers, and researchers with real-time pollution insights broken down by source attribution (vehicular, industrial, background).

### ▸ Problem
- Air quality data across Delhi is fragmented across multiple sources
- Residents can't easily find ward-level pollution information
- Policymakers lack clear data on pollution source attribution
- No unified platform exists for real-time air quality monitoring

## ▸ Key Features

- **Real-Time Dashboard** – Live KPIs, 7-day trends, critical alerts, and PM2.5/PM10 levels
- **Ward-Level Analytics** – 272 interactive ward cards with searchable AQI data
- **Pollution Source Breakdown** – 60% vehicular, 25% industrial, 15% background attribution
- **Geospatial Analysis** – Ward boundary mapping with hotspot identification
- **Beautiful UI** – Dark theme with smooth animations and responsive design
- **Fast Performance** – Optimized rendering for 135+ wards grid
- **Global Accessibility** – Deployed on Render for worldwide access

## ▸ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite 7, TypeScript, React Router, Anime.js |
| Styling | CSS3, CSS Variables, Responsive Design |
| Backend | FastAPI 0.128, Python 3.13, Uvicorn |
| Data Processing | Pandas 2.3, GeoPandas 1.1, NumPy, Shapely 2.1 |
| Data Sources | CSV (52,560 AQI readings), GeoJSON (272 ward boundaries) |
| Deployment | Render (Free tier with auto-rebuild) |
| Storage | Backend CSV files, in-memory processing |
| Icons & UI | SVG, Custom CSS Grid, Radix primitives |

## ▸ Prerequisites
- Node.js 16+ (for frontend)
- Python 3.10+ (for backend)
- npm (frontend package manager)
- pip (Python package manager)
- Render account (for deployment)

## ▸ Environment Setup

### Frontend (.env or vite.config.js)
```javascript
// No secrets needed - uses relative API calls
// In development: http://localhost:8000
// In production: Uses same domain (Render handles this)
```

### Backend (Backend/requirements.txt)
```
fastapi==0.128.0
uvicorn==0.30.0
pandas==2.3.3
geopandas==1.1.2
shapely==2.1.2
numpy==2.0.0
python-multipart==0.0.6
```

## ▸ Installation & Run

### Local Development
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd Backend
pip install -r requirements.txt
cd ..

# Start backend (from root)
python -m uvicorn Backend.main:app --reload

# In another terminal, start frontend
npm run dev
```

**Frontend:** http://localhost:5173
**Backend:** http://localhost:8000

### Production Build
```bash
# Build React frontend
npm run build

# Backend auto-serves dist/ folder on production
python -m uvicorn Backend.main:app --host 0.0.0.0 --port 8000
```

## ▸ Deployment

**Live Deployment:** https://delhi-pollution.onrender.com

## ▸ Project Demo Video

**Watch the Full Walkthrough:** https://youtu.be/QS2J_HTg_Lc

## ▸ Usage

### For Users
1. Visit https://delhi-pollution.onrender.com
2. **Home Page** → View key air quality statistics
3. **Dashboard** → See live KPIs, trends, pollution source breakdown
4. **All Wards** → Search 272 wards, find your neighborhood's AQI
5. Check PM2.5, PM10, and pollution sources in real-time

### For Developers
```javascript
// API Endpoints

GET /api/dashboard
// Returns: {
//   "current_aqi": 289,
//   "critical_alerts": 5,
//   "avg_pm2_5": 156.3,
//   "trend": [...],
//   "alerts": [...]
// }

GET /api/wards
// Returns: {
//   "wards": [
//     {
//       "name": "Ward Name",
//       "avg_AQI": 250,
//       "pm2_5": 120.5,
//       "pm10": 280.3,
//       "vehicular_pct": 60,
//       "industrial_pct": 25,
//       ...
//     }
//   ],
//   "count": 135
// }
```

## ▸ Data Pipeline

```
Raw CSV Data (52,560 readings)
    ↓
Pandas Processing (hourly → ward-level)
    ↓
GeoPandas Geospatial Analysis (boundary matching)
    ↓
Pollution Source Attribution (traffic, industry, background)
    ↓
FastAPI Endpoints (/api/dashboard, /api/wards)
    ↓
React Frontend (real-time visualization)
```

## ▸ Project Structure
```
Delhi-Pollution/
├─ src/
│  ├─ pages/
│  │  ├─ Dashboard/
│  │  ├─ Home/
│  │  └─ WardDetails/
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ assets/
├─ Backend/
│  ├─ main.py (FastAPI app)
│  ├─ data_pipeline.py
│  ├─ data/
│  │  ├─ aqi.csv (52,560 readings)
│  │  ├─ delhi_wards.geojson (272 boundaries)
│  │  └─ ward_level_aqi_complete.csv
│  └─ requirements.txt
├─ public/
│  └─ favicon.svg
├─ package.json
├─ vite.config.js
├─ index.html
└─ README.md
```

## ▸ Key Achievements
- ✅ Real-time AQI monitoring across 272 Delhi wards
- ✅ Complex geospatial analysis with 52,560+ data points
- ✅ Pollution source attribution (vehicular, industrial, background)
- ✅ Fully responsive dashboard with smooth animations
- ✅ Global deployment on Render (working on all devices)
- ✅ End-to-end data pipeline (collection → processing → visualization)
- ✅ API-driven architecture for scalability

## ▸ Contributing
We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ▸ Acknowledgments
- **Data Sources:** Delhi pollution monitoring stations, GeoJSON ward boundaries
- **Technologies:** React, FastAPI, GeoPandas, Render
- **Inspiration:** Global air quality initiatives and public health advocates
- **Community:** All contributors and users supporting better air quality data

<div align="center">
  <strong>Delhi Pollution Dashboard</strong><br>
  Making air quality data transparent and actionable<br>
  Made with ❤️ by Sudo cure
</div>
