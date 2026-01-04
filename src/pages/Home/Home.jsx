import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import anime from 'animejs/lib/anime.es.js';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    anime({
      targets: '.hero-content > *',
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 1200,
      easing: 'easeOutExpo',
      delay: anime.stagger(150, { start: 300 })
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          anime({
            targets: entry.target,
            opacity: [0, 1],
            translateY: [50, 0],
            duration: 1000,
            easing: 'easeOutExpo'
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="badge">
            <span className="badge-dot"></span>
            <span>Real-time Air Quality Intelligence</span>
          </div>
          
          <h1 className="hero-h1">
            Ward-Wise Pollution
            <br />
            <span className="gradient-text">Action Dashboard</span>
          </h1>
          
          <p className="hero-p">
            Hyperlocal air quality monitoring for Delhi's 272 administrative wards.
            <br />
            Transform raw environmental data into actionable policy insights.
          </p>

          <div className="btn-group">
            <button className="btn-main" onClick={() => navigate('/dashboard')}>
              Launch Dashboard
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats">
        <div className="stat-grid">
          <div className="stat fade-in">
            <div className="stat-val">272</div>
            <div className="stat-lbl">Wards Monitored</div>
          </div>
          <div className="stat fade-in">
            <div className="stat-val">38</div>
            <div className="stat-lbl">Live Stations</div>
          </div>
          <div className="stat fade-in">
            <div className="stat-val">24/7</div>
            <div className="stat-lbl">Real-Time Data</div>
          </div>
          <div className="stat fade-in">
            <div className="stat-val">34</div>
            <div className="stat-lbl">Critical Alerts</div>
          </div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="content">
        <div className="grid-2">
          <div className="card fade-in">
            <div className="card-num">01</div>
            <h3>The Challenge</h3>
            <p>Delhi faces severe air pollution but city-wide averages hide critical ward-level hotspots. Without granular data, interventions remain reactive.</p>
            <ul>
              <li>Pollution varies drastically across neighborhoods</li>
              <li>Sources differ by administrative zone</li>
              <li>Delayed responses worsen health outcomes</li>
            </ul>
          </div>
          <div className="card fade-in">
            <div className="card-num">02</div>
            <h3>Our Solution</h3>
            <p>AI-powered ward-level analysis identifies pollution sources, predicts trends, and generates targeted action plans for each zone.</p>
            <ul>
              <li>Real-time hyperlocal pollution mapping</li>
              <li>ML-driven source attribution</li>
              <li>Predictive early warning system</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <h2 className="section-h2 fade-in">Platform Capabilities</h2>
        <div className="grid-3">
          {[
            { title: 'Interactive Map', desc: 'Color-coded ward-level visualization' },
            { title: 'Trend Analysis', desc: '7-day predictive forecasting' },
            { title: 'Source Attribution', desc: 'Identify pollution contributors' },
            { title: 'Early Warnings', desc: 'Automated threshold alerts' },
            { title: 'Action Plans', desc: 'Evidence-based interventions' },
            { title: 'Public Access', desc: 'Transparent citizen dashboard' }
          ].map((f, i) => (
            <div key={i} className="feature fade-in">
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2 className="cta-h2">Ready to Transform Air Quality Management?</h2>
        <p className="cta-p">Access hyperlocal pollution intelligence for evidence-based policy decisions</p>
        <button className="btn-cta" onClick={() => navigate('/dashboard')}>
          Access Dashboard
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </section>
    </div>
  );
};

export default Home;
