import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import anime from 'animejs/lib/anime.es.js';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7days');
  const [selectedAlert, setSelectedAlert] = useState(null); // For modal
  const [showAlertModal, setShowAlertModal] = useState(false);

  // Fetch real data from FastAPI
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/dashboard');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setDashboardData(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!dashboardData) return;

    // Entrance animations
    anime({
      targets: '.alert-item',
      opacity: [0, 1],
      translateX: [-50, 0],
      duration: 800,
      easing: 'easeOutExpo',
      delay: anime.stagger(100, { start: 300 })
    });

    anime({
      targets: '.kpi-card',
      opacity: [0, 1],
      scale: [0.9, 1],
      duration: 1000,
      easing: 'easeOutBack',
      delay: anime.stagger(100, { start: 600 })
    });

    anime({
      targets: '.kpi-value',
      innerHTML: (el) => [0, el.getAttribute('data-value')],
      duration: 2000,
      easing: 'easeOutExpo',
      round: 1,
      delay: 800
    });

    anime({
      targets: '.trend-chart',
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 1000,
      easing: 'easeOutExpo',
      delay: 1200
    });

    anime({
      targets: '.ward-table-row',
      opacity: [0, 1],
      translateX: [-30, 0],
      duration: 800,
      easing: 'easeOutQuad',
      delay: anime.stagger(50, { start: 1400 })
    });

    anime({
      targets: '.summary-card',
      opacity: [0, 1],
      scale: [0.95, 1],
      duration: 800,
      easing: 'easeOutQuad',
      delay: 1600
    });

    anime({
      targets: '.pulse-dot',
      scale: [1, 1.3, 1],
      opacity: [1, 0.6, 1],
      duration: 2000,
      easing: 'easeInOutQuad',
      loop: true
    });
  }, [dashboardData]);

  const getSeverityColor = (severity) => {
    const colors = {
      critical: '#EF4444',
      warning: '#F59E0B',
      emerging: '#3B82F6'
    };
    return colors[severity] || '#6B7280';
  };

  const getStatusColor = (status) => {
    const colors = {
      critical: '#EF4444',
      hazardous: '#EF4444',
      very_unhealthy: '#F59E0B',
      unhealthy: '#F59E0B',
      moderate: '#3B82F6',
      good: '#10B981'
    };
    return colors[status] || '#6B7280';
  };

  const getKpiStatus = (aqi) => {
    if (aqi >= 300) return { text: 'Hazardous', class: 'critical' };
    if (aqi >= 200) return { text: 'Very Unhealthy', class: 'warning' };
    if (aqi >= 100) return { text: 'Unhealthy', class: 'moderate' };
    if (aqi >= 50) return { text: 'Moderate', class: 'moderate' };
    return { text: 'Good', class: 'good' };
  };

  const getSourceIcon = (source) => {
    const icons = {
      Traffic: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" stroke="currentColor" strokeWidth="2"/>
          <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 001 1h2m-1 0h2a1 1 0 001-1v-3.5l-1.4-3A1 1 0 0015.7 9H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      Industrial: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      Construction: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      Mixed: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    };
    return icons[source] || icons.Mixed;
  };

  const handleViewAlertDetails = (alert) => {
    setSelectedAlert(alert);
    setShowAlertModal(true);
  };

  const handleViewAllWards = () => {
    navigate('/wards');
  };

  // Loading state
  if (loading && !dashboardData) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading Delhi pollution data...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Unable to load dashboard</h2>
        <p>{error}</p>
        <button onClick={fetchDashboardData} className="btn-retry">Retry</button>
      </div>
    );
  }

  if (!dashboardData) return null;

  const cityStatus = getKpiStatus(dashboardData.kpis.cityAqi);
  const worstStatus = getKpiStatus(dashboardData.kpis.worstWard);

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Delhi Pollution Command Center</h1>
          <div className="header-subtitle">Source-Based Pollution Monitoring & Action System</div>
          <div className="header-meta">
            <div className="live-indicator">
              <span className="pulse-dot"></span>
              <span>Live Data</span>
            </div>
            <div className="last-update">
              Updated {new Date(dashboardData.lastUpdated).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </header>

      {/* 1. ALERTS PANEL */}
      <section className="alerts-section">
        <div className="section-header-inline">
          <h2 className="section-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Priority Pollution Alerts
          </h2>
          <span className="alert-count">{dashboardData.alerts.length} Active</span>
        </div>
        
        <div className="alerts-grid">
          {dashboardData.alerts.map((alert) => (
            <div key={alert.id} className="alert-item" style={{ borderLeftColor: getSeverityColor(alert.severity) }}>
              <div className="alert-top">
                <span className={`alert-badge ${alert.severity}`}>{alert.type}</span>
                <span className="alert-time">{alert.time}</span>
              </div>
              <div className="alert-main">
                <h3 className="alert-ward">{alert.ward}</h3>
                <div className="alert-aqi">AQI: <span className="aqi-value">{alert.aqi}</span></div>
              </div>
              <div className="alert-action">
                <button 
                  className="btn-alert"
                  onClick={() => handleViewAlertDetails(alert)}
                >
                  View Source Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. KEY PERFORMANCE INDICATORS */}
      <section className="kpi-section">
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-icon city">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="kpi-content">
              <div className="kpi-label">City Average AQI</div>
              <div className="kpi-value" data-value={dashboardData.kpis.cityAqi}>0</div>
              <div className={`kpi-status ${cityStatus.class}`}>{cityStatus.text}</div>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon worst">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="kpi-content">
              <div className="kpi-label">Worst Ward AQI</div>
              <div className="kpi-value" data-value={dashboardData.kpis.worstWard}>0</div>
              <div className={`kpi-status ${worstStatus.class}`}>{worstStatus.text}</div>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon count">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="kpi-content">
              <div className="kpi-label">Critical Wards</div>
              <div className="kpi-value" data-value={dashboardData.kpis.criticalCount}>0</div>
              <div className="kpi-status warning">Immediate Action Needed</div>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon trend">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="kpi-content">
              <div className="kpi-label">7-Day Trend</div>
              <div className="kpi-value" data-value={dashboardData.kpis.trend.replace(/[^0-9-]/g, '')}>{dashboardData.kpis.trend}</div>
              <div className={`kpi-status ${dashboardData.kpis.trend.includes('+') ? 'warning' : 'good'}`}>
                {dashboardData.kpis.trend.includes('+') ? 'Worsening' : 'Improving'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TREND ANALYSIS */}
      <section className="trend-section">
        <div className="section-header-inline">
          <h2 className="section-title">AQI Trend Analysis</h2>
          <div className="timeframe-toggle">
            <button 
              className={`toggle-btn ${selectedTimeframe === '7days' ? 'active' : ''}`}
              onClick={() => setSelectedTimeframe('7days')}
            >
              7 Days
            </button>
            <button 
              className={`toggle-btn ${selectedTimeframe === '30days' ? 'active' : ''}`}
              onClick={() => setSelectedTimeframe('30days')}
            >
              30 Days
            </button>
            <button 
              className={`toggle-btn ${selectedTimeframe === '90days' ? 'active' : ''}`}
              onClick={() => setSelectedTimeframe('90days')}
            >
              90 Days
            </button>
          </div>
        </div>

        <div className="trend-chart">
          <div className="chart-placeholder">
            <svg width="100%" height="300" viewBox="0 0 800 300" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <polyline
                fill="url(#chartGradient)"
                stroke="none"
                points={dashboardData.trendData[selectedTimeframe].map((val, i, arr) => 
                  `${(i / (arr.length - 1)) * 800},${300 - (val / 500) * 250}`
                ).join(' ')}
              />
              <polyline
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={dashboardData.trendData[selectedTimeframe].map((val, i, arr) => 
                  `${(i / (arr.length - 1)) * 800},${300 - (val / 500) * 250}`
                ).join(' ')}
              />
            </svg>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-dot good"></span>
                <span>Good (0-50)</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot moderate"></span>
                <span>Moderate (51-100)</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot unhealthy"></span>
                <span>Unhealthy (101-200)</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot hazardous"></span>
                <span>Hazardous (300+)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OPERATIONAL SECTION */}
      <section className="operational-section">
        <div className="operational-grid">
          {/* Ward Risk Table */}
          <div className="ward-table-container">
            <div className="section-header-inline">
              <h2 className="section-title">Pollution Source Rankings</h2>
              <button className="btn-view-all" onClick={handleViewAllWards}>
                View All Wards →
              </button>
            </div>
            <div className="ward-table">
              <div className="table-header">
                <div className="th rank">Rank</div>
                <div className="th ward">Ward</div>
                <div className="th aqi">AQI</div>
                <div className="th pollutant">Pollutant</div>
                <div className="th source">Primary Source</div>
                <div className="th status">Status</div>
              </div>
              <div className="table-body">
                {dashboardData.wardRisks.map((ward) => (
                  <div key={ward.rank} className="ward-table-row">
                    <div className="td rank">#{ward.rank}</div>
                    <div className="td ward">{ward.ward}</div>
                    <div className="td aqi">
                      <span className="aqi-badge" style={{ background: getStatusColor(ward.status) }}>
                        {ward.aqi}
                      </span>
                    </div>
                    <div className="td pollutant">{ward.pollutant}</div>
                    <div className="td source">
                      <div className="source-badge">
                        {getSourceIcon(ward.source)}
                        <span>{ward.source}</span>
                      </div>
                    </div>
                    <div className="td status">
                      <span className={`status-badge ${ward.status}`}>{ward.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* City Summary */}
          <div className="summary-container">
            <h2 className="section-title">Ward Distribution by Air Quality</h2>
            <div className="summary-cards">
              <div className="summary-card good">
                <div className="summary-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="summary-content">
                  <div className="summary-value">{dashboardData.citySummary.good}</div>
                  <div className="summary-label">Good</div>
                  <div className="summary-range">AQI 0-50</div>
                </div>
              </div>

              <div className="summary-card moderate">
                <div className="summary-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="summary-content">
                  <div className="summary-value">{dashboardData.citySummary.moderate}</div>
                  <div className="summary-label">Moderate</div>
                  <div className="summary-range">AQI 51-100</div>
                </div>
              </div>

              <div className="summary-card unhealthy">
                <div className="summary-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="summary-content">
                  <div className="summary-value">{dashboardData.citySummary.unhealthy}</div>
                  <div className="summary-label">Unhealthy</div>
                  <div className="summary-range">AQI 101-200</div>
                </div>
              </div>

              <div className="summary-card very-unhealthy">
                <div className="summary-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="summary-content">
                  <div className="summary-value">{dashboardData.citySummary.veryUnhealthy}</div>
                  <div className="summary-label">Very Unhealthy</div>
                  <div className="summary-range">AQI 201-300</div>
                </div>
              </div>

              <div className="summary-card hazardous">
                <div className="summary-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="summary-content">
                  <div className="summary-value">{dashboardData.citySummary.hazardous}</div>
                  <div className="summary-label">Hazardous</div>
                  <div className="summary-range">AQI 300+</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ALERT MODAL */}
      {showAlertModal && selectedAlert && (
        <div className="modal-overlay" onClick={() => setShowAlertModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Pollution Source Analysis: {selectedAlert.ward}</h2>
              <button className="modal-close" onClick={() => setShowAlertModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="alert-details-grid">
                <div className="detail-card">
                  <h3>Current AQI</h3>
                  <div className="detail-value critical">{selectedAlert.aqi}</div>
                  <div className="detail-label">{selectedAlert.severity.toUpperCase()}</div>
                </div>
                <div className="detail-card">
                  <h3>Alert Type</h3>
                  <div className="detail-value">{selectedAlert.type}</div>
                  <div className="detail-label">{selectedAlert.time}</div>
                </div>
              </div>

              <div className="source-analysis">
                <h3>Primary Pollution Sources</h3>
                <div className="source-breakdown">
                  <div className="source-item">
                    <div className="source-header">
                      {getSourceIcon('Traffic')}
                      <span>Vehicular Emissions</span>
                    </div>
                    <div className="source-bar">
                      <div className="source-fill" style={{width: '75%', background: '#F59E0B'}}></div>
                    </div>
                    <span className="source-percent">75%</span>
                  </div>
                  <div className="source-item">
                    <div className="source-header">
                      {getSourceIcon('Industrial')}
                      <span>Industrial Activity</span>
                    </div>
                    <div className="source-bar">
                      <div className="source-fill" style={{width: '45%', background: '#EF4444'}}></div>
                    </div>
                    <span className="source-percent">45%</span>
                  </div>
                  <div className="source-item">
                    <div className="source-header">
                      {getSourceIcon('Construction')}
                      <span>Construction & Dust</span>
                    </div>
                    <div className="source-bar">
                      <div className="source-fill" style={{width: '30%', background: '#3B82F6'}}></div>
                    </div>
                    <span className="source-percent">30%</span>
                  </div>
                </div>
              </div>

              <div className="recommended-actions">
                <h3>Recommended Actions</h3>
                <ul>
                  <li>🚦 Implement odd-even vehicle restrictions in high-traffic zones</li>
                  <li>🏭 Mandate emission control systems for nearby industrial units</li>
                  <li>🚧 Halt non-essential construction activities during peak hours</li>
                  <li>💧 Deploy water sprinklers on major roads to reduce dust</li>
                </ul>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowAlertModal(false)}>
                Close
              </button>
              <button className="btn-primary" onClick={() => navigate(`/wards?ward=${selectedAlert.ward}`)}>
                View Full Ward Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
