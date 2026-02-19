import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import anime from 'animejs/lib/anime.es.js';
import './ConsumerDashboard.css';

const API_BASE = import.meta.env.DEV ? 'https://delhi-pollution-2.onrender.com' : '';
const PROFILE_STORAGE_KEY = 'dwlp_consumer_profile';

const getRiskClass = (level) => {
  const value = String(level || '').toLowerCase();
  if (value === 'high') return 'high';
  if (value === 'medium') return 'medium';
  return 'low';
};

const formatTimestamp = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString([], {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const ConsumerDashboard = () => {
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [insight, setInsight] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [error, setError] = useState('');

  const fetchOverview = useCallback(async () => {
    try {
      setLoadingOverview(true);
      const response = await fetch(`${API_BASE}/api/consumer/overview`);
      if (!response.ok) throw new Error(`Overview request failed (${response.status})`);
      const payload = await response.json();
      setOverview(payload);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load consumer overview.');
    } finally {
      setLoadingOverview(false);
    }
  }, []);

  const fetchInsight = useCallback(async (profilePayload) => {
    try {
      setLoadingInsight(true);
      const response = await fetch(`${API_BASE}/api/consumer/insights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profilePayload),
      });
      if (!response.ok) throw new Error(`Personalization request failed (${response.status})`);
      const payload = await response.json();
      setInsight(payload);
    } catch (err) {
      setError(err.message || 'Failed to load personalized insight.');
      setInsight(null);
    } finally {
      setLoadingInsight(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
    try {
      const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (raw) {
        setProfile(JSON.parse(raw));
      }
    } catch {
      setProfile(null);
    }
  }, [fetchOverview]);

  useEffect(() => {
    if (!profile) {
      setInsight(null);
      return;
    }
    fetchInsight(profile);
  }, [profile, fetchInsight]);

  // **INSTANT REVEAL - NO BLANK SPACE**
  useEffect(() => {
    anime({
      targets: '.consumer-reveal',
      opacity: 1,
      translateY: 0,
      duration: 100,
      delay: 0,
    });
    return () => {
      anime.remove('.consumer-reveal');
    };
  }, [overview, insight, loadingOverview, loadingInsight]);

  const saveProfile = (nextProfile) => {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));
    setProfile(nextProfile);
  };

  const clearProfile = () => {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    setProfile(null);
    setInsight(null);
  };

  const togglePremium = () => {
    if (!profile) return;
    saveProfile({ ...profile, premium: !profile.premium });
  };

  const city = overview?.city || {};
  const alerts = overview?.alerts || [];
  const advisories = overview?.generalAdvisories || [];
  const wardRows = overview?.wardTable || [];
  const pricingPlans = overview?.pricing?.plans || [];
  const weatherFactors = overview?.weatherCorrelation?.factors || [];
  const weatherDriver = weatherFactors[0];

  const hotspotRows = wardRows.slice(0, 14);
  const profileSummary = insight?.profile || {};
  const currentWardAqi = Number(insight?.wardSnapshot?.aqi || 0);
  const forecastCards = [
    { label: '24h', point: insight?.forecast?.point24h },
    { label: '48h', point: insight?.forecast?.point48h },
    { label: '72h', point: insight?.forecast?.point72h },
  ];

  if (loadingOverview && !overview) {
    return (
      <div className="consumer-loading">
        <div className="consumer-loading-ring"></div>
        <p>Loading consumer dashboard...</p>
      </div>
    );
  }

  if (error && !overview) {
    return (
      <div className="consumer-loading">
        <h2>Unable to load consumer dashboard</h2>
        <p>{error}</p>
        <button className="consumer-btn-primary" onClick={fetchOverview}>Retry</button>
      </div>
    );
  }

  return (
    <div className="consumer-dashboard-page">
      <div className="consumer-glow a"></div>
      <div className="consumer-glow b"></div>
      <div className="consumer-grid-overlay"></div>

      <main className="consumer-dashboard-main">
        <header className="consumer-header consumer-reveal">
          <div className="header-content">
            <p className="consumer-kicker">Consumer Air Protection Portal</p>
            <h1>Personal AQI Intelligence</h1>
            <p>Ward-level pollution visibility with family-aware recommendations.</p>
          </div>
          <div className="consumer-nav">
            <button className="consumer-btn-ghost" onClick={() => navigate('/')}>Portal</button>
            <button className="consumer-btn-ghost" onClick={() => navigate('/government')}>Government</button>
            <button className="consumer-btn-ghost" onClick={() => navigate('/consumer/onboarding')}>Edit Profile</button>
            <button className="consumer-btn-ghost" onClick={() => navigate('/map')}>Map</button>
          </div>
        </header>

        <section className="consumer-hero consumer-reveal">
          <article className="consumer-panel city-focus">
            <p className="panel-kicker">City Snapshot</p>
            <h2>{city.aqi || 0}</h2>
            <span className={`city-band ${city.status || 'moderate'}`}>{city.band || 'Moderate'}</span>
            <div className="city-meta">
              <div>
                <strong>{city.criticalWards || 0}</strong>
                <p>Critical wards</p>
              </div>
              <div>
                <strong>{city.activeAlerts || 0}</strong>
                <p>Active alerts</p>
              </div>
            </div>
          </article>

          <article className="consumer-panel profile-focus">
            <p className="panel-kicker">Your Profile</p>
            {profile ? (
              <>
                <h3>{profileSummary.wardMatched || profile.ward || '-'}</h3>
                <p>
                  Family {profileSummary.familyMembers || profile.family_members || 1} • Travel {profileSummary.dailyTravelMinutes || profile.daily_travel_minutes || 0} min/day
                </p>
                <div className="profile-tags">
                  {profileSummary.children || profile.children ? <span>Children</span> : null}
                  {profileSummary.elderly || profile.elderly ? <span>Elderly</span> : null}
                  {profileSummary.respiratoryIssues || profile.respiratory_issues ? <span>Respiratory</span> : null}
                  <span className={profile.premium ? 'premium-on' : ''}>{profile.premium ? 'Premium On' : 'Free Mode'}</span>
                </div>
                <div className="profile-actions">
                  <button className="consumer-btn-ghost" onClick={togglePremium}>
                    {profile.premium ? 'Switch to Free' : 'Enable Premium'}
                  </button>
                  <button className="consumer-btn-ghost danger" onClick={clearProfile}>Reset Profile</button>
                </div>
              </>
            ) : (
              <>
                <h3>No profile configured</h3>
                <p>Complete onboarding to unlock personalized health risk scoring and route advice.</p>
                <button className="consumer-btn-primary" onClick={() => navigate('/consumer/onboarding')}>
                  Create Consumer Profile
                </button>
              </>
            )}
          </article>
        </section>

        <section className="consumer-two-col consumer-reveal">
          <article className="consumer-panel">
            <div className="panel-head">
              <h2>City and Ward Alerts</h2>
              <span>{alerts.length} active</span>
            </div>
            <ul className="alert-list">
              {alerts.slice(0, 8).map((alert) => (
                <li key={alert.id}>
                  <div>
                    <strong>{alert.ward}</strong>
                    <p>{alert.message}</p>
                  </div>
                  <div className="alert-meta">
                    <span className={`sev ${alert.severity}`}>{alert.severity}</span>
                    <strong>AQI {alert.aqi}</strong>
                  </div>
                </li>
              ))}
            </ul>
          </article>

          <article className="consumer-panel">
            <div className="panel-head">
              <h2>General Health Advisories</h2>
              <span>Public guidance</span>
            </div>
            <ul className="advisory-list">
              {advisories.map((item, idx) => (
                <li key={`${item}-${idx}`}>{item}</li>
              ))}
            </ul>
            <div className="weather-chip">
              <p>Strongest weather driver</p>
              <strong>{weatherDriver?.label || 'Unavailable'}</strong>
              <span>Correlation {weatherDriver?.correlation ?? '-'}</span>
            </div>
          </article>
        </section>

        {profile ? (
          <section className="consumer-panel consumer-reveal">
            <div className="panel-head">
              <h2>Personalized Risk and Actions</h2>
              <span>{loadingInsight ? 'Refreshing...' : 'Profile-based output'}</span>
            </div>
            {loadingInsight ? (
              <div className="insight-loading">Generating personalized recommendation set...</div>
            ) : insight ? (
              <div className="insight-stack">
                <div className="risk-row">
                  <div className={`risk-block ${getRiskClass(insight?.risk?.level)}`}>
                    <p>Risk Level</p>
                    <h3>{insight?.risk?.level || 'Low'}</h3>
                    <strong>{insight?.risk?.score || 0}/100</strong>
                    <span>{insight?.wardSnapshot?.band || '-'}</span>
                  </div>
                  <div className="risk-drivers">
                    <p>Top drivers</p>
                    <div>
                      {(insight?.risk?.drivers || []).map((driver) => (
                        <span key={driver}>{driver}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="forecast-row">
                  {forecastCards.map((item) => {
                    const predicted = Number(item.point?.predictedAqi ?? currentWardAqi);
                    const delta = predicted - currentWardAqi;
                    return (
                      <article key={item.label} className="forecast-card">
                        <p>{item.label} Forecast</p>
                        <h4>{Math.round(predicted)}</h4>
                        <span className={delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat'}>
                          {delta > 0 ? '+' : ''}{Math.round(delta)} vs now
                        </span>
                        <small>{formatTimestamp(item.point?.timestamp)}</small>
                      </article>
                    );
                  })}
                </div>

                <div className="insight-columns">
                  <article>
                    <h3>Personal Health Actions</h3>
                    <ul>
                      {(insight?.healthAdvisories || []).map((advice, idx) => (
                        <li key={`${advice}-${idx}`}>{advice}</li>
                      ))}
                    </ul>
                  </article>
                  <article>
                    <h3>Low-Pollution Route Suggestions</h3>
                    <ul className="route-list">
                      {(insight?.routeSuggestions || []).map((route) => (
                        <li key={route.routeName}>
                          <div>
                            <strong>{route.routeName}</strong>
                            <p>{route.reason}</p>
                          </div>
                          <div className="route-meta">
                            <span>{route.estimatedMinutes} min</span>
                            <span>Exposure {route.aqiExposureScore}</span>
                            <span>{route.travelWindow}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </article>
                </div>
              </div>
            ) : (
              <p className="insight-loading">Insight is unavailable right now. Try refreshing the page.</p>
            )}
          </section>
        ) : null}

        <section className="consumer-panel consumer-reveal">
          <div className="panel-head">
            <h2>Ward Hotspot List</h2>
            <span>{wardRows.length} wards</span>
          </div>
          <div className="hotspot-table-wrap">
            <table className="hotspot-table">
              <thead>
                <tr>
                  <th>Ward</th>
                  <th>AQI</th>
                  <th>PM2.5</th>
                  <th>PM10</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {hotspotRows.map((row) => (
                  <tr key={row.ward}>
                    <td>{row.ward}</td>
                    <td>{row.aqi}</td>
                    <td>{row.pm2_5}</td>
                    <td>{row.pm10}</td>
                    <td>{row.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="consumer-pricing consumer-reveal">
          <h2>Plans</h2>
          <div className="plan-grid">
            {pricingPlans.map((plan) => (
              <article className={`plan-card ${plan.id === 'premium' ? 'premium' : ''}`} key={plan.id}>
                <p>{plan.name}</p>
                <h3>{plan.priceMonthly === 0 ? 'Free' : `Rs ${plan.priceMonthly}/month`}</h3>
                <ul>
                  {(plan.features || []).map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ConsumerDashboard;
