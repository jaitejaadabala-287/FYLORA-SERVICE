import { useParams, Link } from 'react-router-dom';
import {
  FileText, FileType, Table, Presentation, Image, Minimize2,
  ArrowRight, ArrowLeft
} from 'lucide-react';
import { CATEGORIES, getToolsByCategory } from '../engine/registry';

const ICON_MAP = { FileText, FileType, Table, Presentation, Image, Minimize2 };

export default function CategoryPage() {
  const { categoryId } = useParams();
  const category = CATEGORIES[categoryId];
  const tools = getToolsByCategory(categoryId);

  if (!category) {
    return (
      <div style={{ paddingTop: 'var(--navbar-height)', textAlign: 'center', padding: '120px 24px' }}>
        <h2>Category not found</h2>
        <Link to="/tools" className="btn btn-primary" style={{ marginTop: '16px' }}>
          View All Tools
        </Link>
      </div>
    );
  }

  const CatIcon = ICON_MAP[category.icon] || FileText;

  return (
    <div style={{ paddingTop: 'var(--navbar-height)' }}>
      {/* Hero */}
      <section style={{
        background: 'var(--gradient-hero)', padding: '48px 0 32px',
        textAlign: 'center', color: 'white', position: 'relative', overflow: 'hidden',
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18, margin: '0 auto 16px',
            background: 'rgba(255,255,255,0.1)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <CatIcon size={30} />
          </div>
          <h1 style={{ fontSize: 'var(--text-4xl)', color: 'white', marginBottom: '8px' }}>
            {category.name}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '17px', maxWidth: '500px', margin: '0 auto' }}>
            {category.description}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Link
            to="/tools"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '14px', color: 'var(--color-gray-500)', marginBottom: '32px',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={14} /> All Tools
          </Link>

          <div style={{ marginBottom: '12px' }}>
            <span style={{
              fontSize: '13px', fontWeight: 600, color: 'var(--color-gray-400)',
              textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              {tools.length} tools available
            </span>
          </div>

          <div className="tools-grid">
            {tools.map((tool) => {
              const Icon = ICON_MAP[tool.icon] || ICON_MAP[category.icon] || FileText;
              return (
                <Link
                  key={tool.id}
                  to={`/tools/${categoryId}/${tool.id}`}
                  className="tool-card"
                >
                  <div
                    className="tool-card-icon"
                    style={{ background: category.colorBg, color: category.color }}
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
        </div>
      </section>
    </div>
  );
}
