import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './AllWards.css';

const AllWards = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const highlightWard = searchParams.get('ward');
  
  const [wardsData, setWardsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState('all');
  const [sortBy, setSortBy] = useState('aqi_desc');

  useEffect(() => {
    fetchWardsData();
  }, []);

  const fetchWardsData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/wards');
      const data = await response.json();
      setWardsData(data);
    } catch (error) {
      console.error('Error fetching wards:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSourceIcon = (source) => {
    // Same as Dashboard
    const icons = {
      Traffic: '🚗',
      Industrial: '🏭',
      Construction: '🚧',
      Mixed: '🔀'
    };
    return icons[source] || '🔀';
  };

  const getStatusColor = (aqi) => {
    if (aqi >= 300) return '#EF4444';
    if (aqi >= 200) return '#F59E0B';
    if (aqi >= 100) return '#FB923C';
    if (aqi >= 50) return '#3B82F6';
    return '#10B981';
  };

  if (loading) {
    return <div className="loading-container"><div className="loading-spinner"></div></div>;
  }

  // Filter and sort wards
  let filteredWards = wardsData?.wards || [];
  
  if (searchTerm) {
    filteredWards = filteredWards.filter(w => 
      w.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (filterSource !== 'all') {
    filteredWards = filteredWards.filter(w => {
      if (filterSource === 'traffic') return w.vehicular_pct > w.industrial_pct;
      if (filterSource === 'industrial') return w.industrial_pct > w.vehicular_pct;
      return true;
    });
  }

  // Sort
  filteredWards = [...filteredWards].sort((a, b) => {
    switch(sortBy) {
      case 'aqi_desc': return b.avg_AQI - a.avg_AQI;
      case 'aqi_asc': return a.avg_AQI - b.avg_AQI;
      case 'traffic': return b.vehicular_pct - a.vehicular_pct;
      case 'industrial': return b.industrial_pct - a.industrial_pct;
      case 'name': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  return (
    <div className="all-wards-page">
      <header className="page-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          ← Back to Dashboard
        </button>
        <h1>Complete Ward-Level Pollution Source Analysis</h1>
        <p className="page-subtitle">
          Detailed breakdown of {wardsData?.count || 0} Delhi wards by pollution sources
        </p>
      </header>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input 
            type="text"
            placeholder="Search wards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select value={filterSource} onChange={(e) => setFilterSource(e.target.value)} className="filter-select">
          <option value="all">All Sources</option>
          <option value="traffic">Traffic-Dominated</option>
          <option value="industrial">Industrial-Dominated</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
          <option value="aqi_desc">Highest AQI First</option>
          <option value="aqi_asc">Lowest AQI First</option>
          <option value="traffic">Traffic Contribution</option>
          <option value="industrial">Industrial Contribution</option>
          <option value="name">Ward Name (A-Z)</option>
        </select>
      </div>

      {/* Ward Cards Grid */}
      <div className="wards-grid">
        {filteredWards.map((ward, idx) => {
          const isHighlighted = ward.name === highlightWard;
          const primarySource = ward.vehicular_pct > ward.industrial_pct ? 'Traffic' : 'Industrial';
          
          return (
            <div 
              key={idx} 
              className={`ward-card ${isHighlighted ? 'highlighted' : ''}`}
              style={{borderTopColor: getStatusColor(ward.avg_AQI)}}
            >
              <div className="ward-card-header">
                <h3>{ward.name}</h3>
                <div className="aqi-badge-large" style={{background: getStatusColor(ward.avg_AQI)}}>
                  {Math.round(ward.avg_AQI)}
                </div>
              </div>

              <div className="ward-card-body">
                <div className="pollutants-row">
                  <div className="pollutant-item">
                    <span className="pollutant-label">PM2.5</span>
                    <span className="pollutant-value">{Math.round(ward.pm2_5)}</span>
                  </div>
                  <div className="pollutant-item">
                    <span className="pollutant-label">PM10</span>
                    <span className="pollutant-value">{Math.round(ward.pm10)}</span>
                  </div>
                  <div className="pollutant-item">
                    <span className="pollutant-label">Station</span>
                    <span className="pollutant-value">{ward.distance_km.toFixed(1)}km</span>
                  </div>
                </div>

                <div className="sources-breakdown">
                  <h4>Pollution Sources</h4>
                  
                  <div className="source-row">
                    <div className="source-label">
                      <span>🚗</span>
                      <span>Vehicular</span>
                    </div>
                    <div className="source-bar-container">
                      <div 
                        className="source-bar-fill traffic" 
                        style={{width: `${ward.vehicular_pct}%`}}
                      ></div>
                    </div>
                    <span className="source-percentage">{Math.round(ward.vehicular_pct)}%</span>
                  </div>

                  <div className="source-row">
                    <div className="source-label">
                      <span>🏭</span>
                      <span>Industrial</span>
                    </div>
                    <div className="source-bar-container">
                      <div 
                        className="source-bar-fill industrial" 
                        style={{width: `${ward.industrial_pct}%`}}
                      ></div>
                    </div>
                    <span className="source-percentage">{Math.round(ward.industrial_pct)}%</span>
                  </div>
                </div>

                <div className="ward-metrics">
                  <div className="metric">
                    <span className="metric-label">Primary Source</span>
                    <span className="metric-value">{getSourceIcon(primarySource)} {primarySource}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Traffic Score</span>
                    <span className="metric-value">{Math.round(ward.traffic_raw)}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Industrial Sites</span>
                    <span className="metric-value">{ward.industrial_count}</span>
                  </div>
                </div>
              </div>

              <div className="ward-card-footer">
                <button className="btn-action-primary">View Interventions</button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredWards.length === 0 && (
        <div className="no-results">
          <p>No wards found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default AllWards;
