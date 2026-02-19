import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import anime from 'animejs/lib/anime.es.js';
import './PortalSelect.css';

const PortalSelect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    anime({
      targets: '.portal-reveal',
      opacity: [0, 1],
      translateY: [28, 0],
      duration: 820,
      easing: 'easeOutExpo',
      delay: anime.stagger(110, { start: 140 }),
    });

    anime({
      targets: '.portal-glow.a',
      translateY: [0, -16],
      translateX: [0, 10],
      direction: 'alternate',
      duration: 4600,
      loop: true,
      easing: 'easeInOutSine',
    });

    anime({
      targets: '.portal-glow.b',
      translateY: [0, 18],
      translateX: [0, -12],
      direction: 'alternate',
      duration: 5200,
      loop: true,
      easing: 'easeInOutSine',
    });

    return () => {
      anime.remove('.portal-reveal, .portal-glow');
    };
  }, []);

  return (
    <div className="portal-page">
      <div className="portal-glow a"></div>
      <div className="portal-glow b"></div>
      <div className="portal-grid"></div>

      <main className="portal-main">
        <header className="portal-head portal-reveal">
          <span className="portal-badge">Delhi Ward Pollution Monitor</span>
          <h1>Choose Your Product Portal</h1>
          <p>
            One intelligence engine, two focused products. Citizens get daily protection and travel guidance. Government teams get command-grade monitoring and intervention planning.
          </p>
        </header>

        <section className="portal-products">
          <article className="portal-card portal-reveal gov">
            <p className="card-kicker">Government Dashboard</p>
            <h2>Decision Support and Compliance</h2>
            <ul>
              <li>Ward risk prioritization and source attribution</li>
              <li>Emergency alerting with action recommendations</li>
              <li>Historical trend reports and policy exports</li>
            </ul>
            <div className="card-price">Annual SaaS / MoU model</div>
            <button className="portal-btn-primary" onClick={() => navigate('/government')}>
              Enter Government Portal
            </button>
            <button className="portal-btn-ghost" onClick={() => navigate('/dashboard')}>
              Skip to Command Dashboard
            </button>
          </article>

          <article className="portal-card portal-reveal consumer">
            <p className="card-kicker">Consumer Freemium App</p>
            <h2>Daily Protection for Delhi Citizens</h2>
            <ul>
              <li>Ward AQI, hotspot map, and general advisories</li>
              <li>Premium SMS and family-profile personalization</li>
              <li>Low-pollution routes with 24-72 hour forecast</li>
            </ul>
            <div className="card-price">Premium: Rs 99-199 / month</div>
            <button className="portal-btn-primary" onClick={() => navigate('/consumer')}>
              Open Consumer Dashboard
            </button>
            <button className="portal-btn-ghost" onClick={() => navigate('/consumer/onboarding')}>
              Set Up Consumer Profile
            </button>
          </article>
        </section>

        <section className="portal-summary portal-reveal">
          <p>
            We are building a freemium air-quality platform where citizens receive ward-level pollution insights and personalized health recommendations based on their family profile, while governments use our advanced dashboard for monitoring, prioritization, and response planning.
          </p>
        </section>
      </main>
    </div>
  );
};

export default PortalSelect;
