'use client';
import LanguageSelector from '../components/LanguageSelector';

export default function Home() {
  return (
    <div className="container">
      <main className="main-content">
        <h1 className="title">Project Kisan</h1>
        <p className="subtitle">Please select your preferred language</p>
        <LanguageSelector />
      </main>

      <footer className="footer">
        <p className="footer-text">Your trusted farming companion</p>
        <div>
          <p className="footer-small">© 2023 Project Kisan. All rights reserved.</p>
          <p className="footer-small">In partnership with Ministry of Agriculture & Farmers' Welfare</p>
          <p className="footer-small footer-accent">Powered by System of Space-in-the-Test Leadership for Indian Farmers</p>
        </div>
      </footer>
    </div>
  );
}