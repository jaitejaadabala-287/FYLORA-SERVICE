import { Link } from 'react-router-dom';
import Logo from '../UI/Logo';
import { CATEGORIES, getToolsByCategory, getAllCategories } from '../../engine/registry';
import { Shield, Zap, Lock } from 'lucide-react';

export default function Footer() {
  const categories = getAllCategories();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Logo size={28} />
              <h3>Fylora</h3>
            </div>
            <p>
              The universal file utility platform. Convert, compress, transform, and manage
              your files — all in one place.
            </p>
            <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                <Shield size={14} /> Secure
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                <Zap size={14} /> Fast
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                <Lock size={14} /> Private
              </div>
            </div>
          </div>

          <div className="footer-column">
            <h4>PDF Tools</h4>
            {getToolsByCategory('pdf').slice(0, 6).map((tool) => (
              <Link key={tool.id} to={`/tools/pdf/${tool.id}`}>{tool.name}</Link>
            ))}
          </div>

          <div className="footer-column">
            <h4>Image Tools</h4>
            {getToolsByCategory('images').slice(0, 6).map((tool) => (
              <Link key={tool.id} to={`/tools/images/${tool.id}`}>{tool.name}</Link>
            ))}
          </div>

          <div className="footer-column">
            <h4>Platform</h4>
            <Link to="/convert">Universal Converter</Link>
            <Link to="/tools">All Tools</Link>
            {categories.slice(0, 4).map((cat) => (
              <Link key={cat.id} to={`/tools/${cat.id}`}>{cat.name}</Link>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Fylora. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
