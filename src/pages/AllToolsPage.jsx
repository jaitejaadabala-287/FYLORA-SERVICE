import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, FileType, Table, Presentation, Image, Minimize2,
  ArrowRight, Search, Sparkles
} from 'lucide-react';
import { CATEGORIES, TOOLS, getToolsByCategory, getAllCategories } from '../engine/registry';

const ICON_MAP = { FileText, FileType, Table, Presentation, Image, Minimize2 };

export default function AllToolsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const categories = getAllCategories();

  const filteredTools = TOOLS.filter((tool) => {
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    const matchesSearch = !search || 
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ paddingTop: 'var(--navbar-height)' }}>
      {/* Hero */}
      <section style={{
        background: 'var(--gradient-hero)', padding: '48px 0 32px',
        textAlign: 'center', color: 'white',
      }}>
        <div className="container">
          <h1 style={{ fontSize: 'var(--text-4xl)', color: 'white', marginBottom: '8px' }}>
            All Tools
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '17px', maxWidth: '500px', margin: '0 auto' }}>
            Browse our complete collection of file conversion and processing tools
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Search */}
          <div style={{
            position: 'relative', maxWidth: '480px', margin: '0 auto 32px',
          }}>
            <Search size={18} style={{
              position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
              color: 'var(--color-gray-400)',
            }} />
            <input
              type="text"
              placeholder="Search tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '14px 16px 14px 44px', borderRadius: '14px',
                border: '2px solid var(--color-gray-200)', fontSize: '15px',
                outline: 'none', transition: 'border-color 0.2s',
                background: 'var(--color-white)',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-gray-200)'}
            />
          </div>

          {/* Category Tabs */}
          <div className="tabs" style={{ justifyContent: 'center', borderBottom: 'none', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
            <button
              className={`tab ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
              style={{ borderRadius: '100px', border: '1px solid var(--color-gray-200)', borderBottom: '1px solid var(--color-gray-200)' }}
            >
              All ({TOOLS.length})
            </button>
            {categories.map((cat) => {
              const count = getToolsByCategory(cat.id).length;
              return (
                <button
                  key={cat.id}
                  className={`tab ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{ borderRadius: '100px', border: '1px solid var(--color-gray-200)', borderBottom: '1px solid var(--color-gray-200)' }}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Universal Converter CTA */}
          <Link
            to="/convert"
            style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              padding: '20px 24px', background: 'rgba(124,58,237,0.05)',
              border: '1px solid rgba(124,58,237,0.15)', borderRadius: '16px',
              marginBottom: '32px', textDecoration: 'none', color: 'inherit',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(124,58,237,0.08)';
              e.currentTarget.style.borderColor = 'rgba(124,58,237,0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(124,58,237,0.05)';
              e.currentTarget.style.borderColor = 'rgba(124,58,237,0.15)';
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'var(--gradient-brand)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Sparkles size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '2px' }}>
                Universal Converter
              </div>
              <div style={{ fontSize: '13px', color: 'var(--color-gray-500)' }}>
                Upload any file and Fylora will detect it and show available operations
              </div>
            </div>
            <ArrowRight size={18} color="var(--color-primary)" />
          </Link>

          {/* Tools Grid */}
          <div className="tools-grid">
            {filteredTools.map((tool) => {
              const cat = CATEGORIES[tool.category];
              const Icon = ICON_MAP[tool.icon] || ICON_MAP[cat?.icon] || FileText;

              return (
                <Link
                  key={tool.id}
                  to={`/tools/${tool.category}/${tool.id}`}
                  className="tool-card"
                >
                  <div
                    className="tool-card-icon"
                    style={{
                      background: cat?.colorBg || 'var(--color-gray-100)',
                      color: cat?.color || 'var(--color-gray-600)',
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="tool-card-content">
                    <h4>{tool.name}</h4>
                    <p>{tool.description}</p>
                  </div>
                  <ArrowRight size={16} className="tool-card-arrow" />
                </Link>
              );
            })}
          </div>

          {filteredTools.length === 0 && (
            <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--color-gray-400)' }}>
              <p>No tools found matching "{search}"</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
