import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import {
  Upload, ArrowRight, FileText, Image, Table, Presentation,
  Minimize2, FileType, Shield, Zap, Lock, Eye, Sparkles,
  CheckCircle, Star, Globe, Clock
} from 'lucide-react';
import { CATEGORIES, getToolsByCategory, getAllCategories } from '../engine/registry';
import { detectFile } from '../engine/fileDetector';

const ICON_MAP = { FileText, FileType, Table, Presentation, Image, Minimize2 };

const FORMATS = ['PDF', 'DOCX', 'XLSX', 'PPTX', 'JPG', 'PNG', 'WEBP', 'TXT', 'CSV', 'GIF', 'BMP', 'RTF'];

const FEATURES = [
  { icon: Shield, title: '100% Private & Local', desc: 'All conversions run right in your browser. Files are never uploaded anywhere.' },
  { icon: Zap, title: 'Lightning Fast', desc: 'Zero queue times, instant processing powered by WebAssembly & Canvas.' },
  { icon: Eye, title: 'Format Detection', desc: 'Upload any file — Fylora identifies it and presents every tool available for it.' },
  { icon: Clock, title: 'No Limits', desc: 'No file size caps, no daily quotas, no registration required. Completely free.' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const categories = getAllCategories();

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store file in sessionStorage reference and navigate to converter
      window.__fylora_upload = file;
      navigate('/convert');
    }
  };

  return (
    <div className="home-page">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} />
            Convert. Compress. Transform.
          </div>

          <h1>
            Everything You Need to<br />
            Work With Your <span className="text-gradient">Files</span>
          </h1>

          <p className="hero-subtitle">
            Convert, compress, transform and manage PDFs, documents, images,
            spreadsheets and presentations — all in one place.
          </p>

          <div className="hero-actions">
            <button
              className="btn btn-primary btn-xl"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={20} /> Upload Your File
            </button>
            <Link to="/tools" className="btn btn-outline btn-xl">
              Explore All Tools <ArrowRight size={18} />
            </Link>
          </div>

          <div className="hero-formats">
            {FORMATS.map((fmt, i) => (
              <span key={fmt}>
                {fmt}
                {i < FORMATS.length - 1 && <span style={{ margin: '0 4px', opacity: 0.3 }}> • </span>}
              </span>
            ))}
            <span style={{ opacity: 0.5 }}>and more</span>
          </div>
        </div>

        {/* Decorative orbs */}
        <div style={{
          position: 'absolute', top: '10%', left: '5%', width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '10%', width: 250, height: 250,
          background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none',
        }} />

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
      </section>

      {/* ── How It Works ── */}
      <section className="section" style={{ background: 'var(--color-gray-50)' }}>
        <div className="container text-center">
          <h2 style={{ marginBottom: '8px' }}>How It Works</h2>
          <p style={{ color: 'var(--color-gray-500)', marginBottom: '48px', maxWidth: '500px', margin: '0 auto 48px' }}>
            Three simple steps to convert, compress, or transform any file
          </p>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Upload</h3>
              <p>Drag and drop your file or click to browse. We support all major formats.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Choose</h3>
              <p>Fylora detects your file type and presents available operations instantly.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Download</h3>
              <p>Your processed file is ready in seconds. Download immediately.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Universal Converter CTA ── */}
      <section className="section">
        <div className="container">
          <div style={{
            background: 'var(--gradient-hero)', borderRadius: '24px',
            padding: '64px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                display: 'inline-flex', padding: '8px 16px', background: 'rgba(255,255,255,0.1)',
                borderRadius: '100px', fontSize: '13px', color: 'rgba(255,255,255,0.8)',
                fontWeight: 500, marginBottom: '24px', border: '1px solid rgba(255,255,255,0.1)',
              }}>
                <Star size={14} style={{ marginRight: 6 }} /> Flagship Feature
              </div>
              <h2 style={{ color: 'white', fontSize: 'var(--text-4xl)', marginBottom: '16px' }}>
                Universal Converter
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.65)', maxWidth: '520px', margin: '0 auto 32px', fontSize: '17px' }}>
                Upload any file — Fylora intelligently detects its format and presents
                every available operation. No searching through menus.
              </p>
              <Link to="/convert" className="btn btn-primary btn-xl" style={{ background: 'white', color: 'var(--color-violet)' }}>
                Try Universal Converter <ArrowRight size={18} />
              </Link>
            </div>
            <div style={{
              position: 'absolute', top: '-50%', right: '-10%', width: 400, height: 400,
              background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 60%)',
              borderRadius: '50%', pointerEvents: 'none',
            }} />
          </div>
        </div>
      </section>

      {/* ── Tool Categories ── */}
      <section className="section" style={{ background: 'var(--color-gray-50)' }}>
        <div className="container text-center">
          <h2 style={{ marginBottom: '8px' }}>All Your File Tools</h2>
          <p style={{ color: 'var(--color-gray-500)', marginBottom: '48px', maxWidth: '500px', margin: '0 auto 48px' }}>
            One platform for every file operation you need
          </p>

          <div className="category-grid">
            {categories.map((cat) => {
              const Icon = ICON_MAP[cat.icon] || FileText;
              const toolCount = getToolsByCategory(cat.id).length;
              return (
                <Link to={`/tools/${cat.id}`} key={cat.id} className="category-card">
                  <div
                    className="category-card-icon"
                    style={{ background: cat.colorBg, color: cat.color }}
                  >
                    <Icon size={28} />
                  </div>
                  <h3>{cat.name}</h3>
                  <p>{cat.description}</p>
                  <span className="category-card-count">{toolCount} tools available →</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section">
        <div className="container text-center">
          <h2 style={{ marginBottom: '8px' }}>Why Fylora?</h2>
          <p style={{ color: 'var(--color-gray-500)', marginBottom: '48px', maxWidth: '520px', margin: '0 auto 48px' }}>
            Stop jumping between websites. One platform for everything.
          </p>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px', textAlign: 'left',
          }}>
            {FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} className="card" style={{ padding: '32px' }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: 'rgba(124,58,237,0.08)', color: 'var(--color-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '16px',
                  }}>
                    <Icon size={24} />
                  </div>
                  <h4 style={{ marginBottom: '8px' }}>{feat.title}</h4>
                  <p style={{ color: 'var(--color-gray-500)', fontSize: '14px' }}>{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Trust & Security ── */}
      <section className="section" style={{ background: 'var(--color-gray-50)' }}>
        <div className="container text-center">
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <Lock size={32} style={{ color: 'var(--color-primary)', marginBottom: '16px' }} />
            <h2 style={{ marginBottom: '12px' }}>Your Files Stay Private</h2>
            <p style={{ color: 'var(--color-gray-500)', fontSize: '17px', lineHeight: 1.7, marginBottom: '32px' }}>
              Fylora processes your files directly in your browser. Your documents
              never leave your device — no uploads, no servers, no third-party access.
              Complete privacy by design.
            </p>
            <div style={{
              display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap',
            }}>
              {[
                { icon: Shield, label: 'Browser-Only Processing' },
                { icon: Lock, label: 'Zero Data Collection' },
                { icon: Clock, label: 'No File Retention' },
              ].map(({ icon: I, label }) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  fontSize: '14px', fontWeight: 500, color: 'var(--color-gray-600)',
                }}>
                  <CheckCircle size={18} color="var(--color-success)" /> {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="section">
        <div className="container text-center">
          <h2 style={{ marginBottom: '12px' }}>Ready to Get Started?</h2>
          <p style={{ color: 'var(--color-gray-500)', marginBottom: '32px', maxWidth: '440px', margin: '0 auto 32px' }}>
            Upload your first file and experience the difference.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/convert" className="btn btn-primary btn-xl">
              <Upload size={20} /> Upload Your File
            </Link>
            <Link to="/tools" className="btn btn-secondary btn-xl">
              Explore All Tools
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
