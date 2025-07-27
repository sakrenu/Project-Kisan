'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../styles/welcome.css'; // Import the external CSS file

export default function WelcomePage() {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleGetStarted = () => {
    setIsAnimating(true);
    setTimeout(() => {
      router.push('/language-selector'); // Adjust this path to match your route
    }, 300);
  };

  return (
    <div className="welcome-page">
      {/* Animated background elements */}
      <div className="welcome-bg-blob welcome-bg-blob-1"></div>
      <div className="welcome-bg-blob welcome-bg-blob-2"></div>
      <div className="welcome-bg-blob welcome-bg-blob-3"></div>


      <div className="welcome-container">
        {/* Main Content */}
        <div className={`welcome-content ${isAnimating ? 'animating' : ''}`}>
          {/* Logo/Icon */}
          <div className="welcome-logo">
            <div className="welcome-logo-glow"></div>
            <div className="welcome-logo-circle">
              <span>🌾</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="welcome-title">
            KrishiDost
          </h1>

          {/* Subtitle */}
          <p className="welcome-subtitle">
            Empowering farmers with cutting-edge technology, real-time insights, and sustainable solutions for modern agriculture
          </p>

          {/* Features */}
          <div className="welcome-features">
            <div className="welcome-feature-card">
              <div className="welcome-feature-icon">📊</div>
              <h3 className="welcome-feature-title">Smart Analytics</h3>
              <p className="welcome-feature-text">Real-time crop monitoring and data-driven farming decisions</p>
            </div>
            <div className="welcome-feature-card">
              <div className="welcome-feature-icon">🌤️</div>
              <h3 className="welcome-feature-title">Weather Insights</h3>
              <p className="welcome-feature-text">Accurate weather forecasts and climate-smart recommendations</p>
            </div>
            <div className="welcome-feature-card">
              <div className="welcome-feature-icon">💰</div>
              <h3 className="welcome-feature-title">Market Connect</h3>
              <p className="welcome-feature-text">Direct market access and fair pricing for your produce</p>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleGetStarted}
            className="welcome-cta-button"
          >
            <span className="welcome-cta-text">Get Started</span>
            <span className="welcome-cta-arrow">→</span>
          </button>

          {/* Trust Indicators */}
          <div className="welcome-trust">
            <p className="welcome-trust-title">Trusted by farmers across India</p>
            <div className="welcome-trust-items">
              <div className="welcome-trust-item">
                <span className="welcome-trust-check">✓</span>
                Ministry Approved
              </div>
              <div className="welcome-trust-item">
                <span className="welcome-trust-check">✓</span>
                100% Free
              </div>
              <div className="welcome-trust-item">
                <span className="welcome-trust-check">✓</span>
                Multi-language Support
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="welcome-footer">
          <p className="welcome-footer-main">Your trusted farming companion</p>
          <div className="welcome-footer-details">
            <p>© 2023 Project Kisan. All rights reserved.</p>
            <p>In partnership with Ministry of Agriculture &amp; Farmers' Welfare</p>
            <p className="welcome-footer-accent">Powered by System of Space-in-the-Test Leadership for Indian Farmers</p>
          </div>
        </footer>
      </div>
    </div>
  );
}