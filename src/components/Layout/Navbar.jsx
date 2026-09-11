import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogoFull } from '../UI/Logo';
import { CATEGORIES, getAllCategories } from '../../engine/registry';
import {
  ChevronDown, Menu, X, FileText, FileType, Table,
  Presentation, Image, Minimize2, ArrowRight
} from 'lucide-react';

const ICON_MAP = {
  FileText, FileType, Table, Presentation, Image, Minimize2,
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const location = useLocation();
  const isHeroPage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setToolsOpen(false);
  }, [location]);

  const isDark = isHeroPage && !scrolled;
  const categories = getAllCategories();

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${isDark ? 'dark' : ''}`} role="navigation">
        <div className="navbar-inner">
          <Link to="/" aria-label="Fylora Home">
            <LogoFull />
          </Link>

          <ul className="navbar-nav">
            <li className="mega-menu-wrapper">
              <button className="navbar-link" onClick={() => setToolsOpen(!toolsOpen)}>
                Tools <ChevronDown size={14} />
              </button>
              <div className="mega-menu">
                {categories.map((cat) => {
                  const Icon = ICON_MAP[cat.icon] || FileText;
                  return (
                    <Link
                      key={cat.id}
                      to={`/tools/${cat.id}`}
                      className="mega-menu-item"
                    >
                      <div
                        className="mega-menu-item-icon"
                        style={{ background: cat.colorBg, color: cat.color }}
                      >
                        <Icon size={20} />
                      </div>
                      <div className="mega-menu-item-content">
                        <h4>{cat.name}</h4>
                        <p>{cat.description}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </li>
            <li>
              <Link to="/convert" className="navbar-link">Universal Converter</Link>
            </li>
            <li>
              <Link to="/tools" className="navbar-link">All Tools</Link>
            </li>
          </ul>

          <div className="navbar-actions">
            <Link to="/convert" className="btn btn-primary btn-sm">
              Get Started <ArrowRight size={14} />
            </Link>
            <button
              className="navbar-mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <Link to="/convert" className="mobile-menu-link">Universal Converter</Link>
        <Link to="/tools" className="mobile-menu-link">All Tools</Link>
        {categories.map((cat) => (
          <Link key={cat.id} to={`/tools/${cat.id}`} className="mobile-menu-link">
            {cat.name}
          </Link>
        ))}
        <div style={{ padding: 'var(--space-6) var(--space-3)' }}>
          <Link to="/convert" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
            Get Started
          </Link>
        </div>
      </div>
    </>
  );
}
