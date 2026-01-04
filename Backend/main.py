from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

app = FastAPI()

# CORS setup for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your ward data
WARD_DATA = pd.read_csv('data/ward_level_aqi_complete.csv')
AQI_TIMESERIES = pd.read_csv('data/aqi.csv')

def get_aqi_status(aqi):
    """Convert AQI to status category"""
    if aqi <= 50: return 'good'
    elif aqi <= 100: return 'moderate'
    elif aqi <= 200: return 'unhealthy'
    elif aqi <= 300: return 'very_unhealthy'
    else: return 'hazardous'

def get_alert_severity(aqi):
    """Determine alert severity"""
    if aqi >= 300: return 'critical'
    elif aqi >= 200: return 'warning'
    else: return 'emerging'

@app.get("/api/dashboard")
async def get_dashboard_data():
    """Main dashboard data endpoint"""
    
    try:
        # Clean data - remove rows with Ward_ prefix and sort by AQI
        ward_data_clean = WARD_DATA[~WARD_DATA['name'].str.startswith('Ward_', na=False)].copy()
        ward_data_sorted = ward_data_clean.sort_values('avg_AQI', ascending=False)
        
        # 1. GENERATE ALERTS (top 3 worst wards)
        alerts = []
        for idx, row in ward_data_sorted.head(3).iterrows():
            alert_type = 'Emergency' if row['avg_AQI'] >= 300 else 'Forecast Alert' if row['avg_AQI'] >= 200 else 'Hotspot Detected'
            alerts.append({
                'id': int(idx),
                'severity': get_alert_severity(row['avg_AQI']),
                'ward': row['name'],
                'aqi': int(row['avg_AQI']),
                'type': alert_type,
                'time': f"{np.random.randint(1, 60)} min ago"
            })
        
        # 2. KPIs
        city_aqi = ward_data_clean['avg_AQI'].mean()
        worst_aqi = ward_data_clean['avg_AQI'].max()
        critical_count = len(ward_data_clean[ward_data_clean['avg_AQI'] >= 200])
        
        # Calculate 7-day trend (using timeseries data)
        aqi_ts = AQI_TIMESERIES.copy()
        aqi_ts['date_ist'] = pd.to_datetime(aqi_ts['date_ist'], format='%d/%m/%Y')
        recent_7days = aqi_ts[aqi_ts['date_ist'] >= (aqi_ts['date_ist'].max() - timedelta(days=7))]
        trend_pct = ((recent_7days['aqi_index'].mean() - aqi_ts['aqi_index'].mean()) / aqi_ts['aqi_index'].mean() * 100)
        
        kpis = {
            'cityAqi': int(city_aqi),
            'worstWard': int(worst_aqi),
            'criticalCount': int(critical_count),
            'trend': f"{'+' if trend_pct > 0 else ''}{int(trend_pct)}%"
        }
        
        # 3. TREND DATA (from timeseries)
        def get_daily_avg(days):
            last_n_days = aqi_ts[aqi_ts['date_ist'] >= (aqi_ts['date_ist'].max() - timedelta(days=days))]
            daily = last_n_days.groupby('date_ist')['aqi_index'].mean().values
            return [int(x) for x in daily]
        
        trend_data = {
            '7days': get_daily_avg(7),
            '30days': get_daily_avg(30),
            '90days': get_daily_avg(90)
        }
        
        # 4. WARD RISK RANKINGS (top 10)
        ward_risks = []
        for idx, (i, row) in enumerate(ward_data_sorted.head(10).iterrows(), 1):
            # Determine primary pollutant
            pollutant = 'PM2.5' if row['pm2_5'] > row['pm10'] else 'PM10'
            
            # Determine source
            if row['vehicular_pct'] > row['industrial_pct']:
                source = 'Traffic'
            elif row['industrial_pct'] > 0:
                source = 'Industrial'
            else:
                source = 'Mixed'
            
            ward_risks.append({
                'rank': idx,
                'ward': row['name'],
                'aqi': int(row['avg_AQI']),
                'pollutant': pollutant,
                'source': source,
                'status': get_aqi_status(row['avg_AQI'])
            })
        
        # 5. CITY SUMMARY (count wards by category)
        city_summary = {
            'good': int(len(ward_data_clean[ward_data_clean['avg_AQI'] <= 50])),
            'moderate': int(len(ward_data_clean[(ward_data_clean['avg_AQI'] > 50) & (ward_data_clean['avg_AQI'] <= 100)])),
            'unhealthy': int(len(ward_data_clean[(ward_data_clean['avg_AQI'] > 100) & (ward_data_clean['avg_AQI'] <= 200)])),
            'veryUnhealthy': int(len(ward_data_clean[(ward_data_clean['avg_AQI'] > 200) & (ward_data_clean['avg_AQI'] <= 300)])),
            'hazardous': int(len(ward_data_clean[ward_data_clean['avg_AQI'] > 300]))
        }
        
        return {
            'alerts': alerts,
            'kpis': kpis,
            'trendData': trend_data,
            'wardRisks': ward_risks,
            'citySummary': city_summary,
            'lastUpdated': datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/wards")
async def get_all_wards():
    """Get complete ward data for map visualization"""
    ward_data_clean = WARD_DATA[~WARD_DATA['name'].str.startswith('Ward_', na=False)].copy()
    
    return {
        'wards': ward_data_clean.to_dict('records'),
        'count': len(ward_data_clean)
    }
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)  # Changed from 0.0.0.0

