import { useEffect, useState } from 'react';
import { CheckCircle, Loader, Upload, Wand2, Download, ArrowRight } from 'lucide-react';

const STEPS = [
  { id: 'uploading', label: 'Uploading', icon: Upload },
  { id: 'converting', label: 'Processing', icon: Wand2 },
  { id: 'optimizing', label: 'Optimizing', icon: Loader },
  { id: 'complete', label: 'Download', icon: Download },
];

export default function ProcessingView({ currentStep, progress = 0, fileName }) {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDisplayProgress(progress), 100);
    return () => clearTimeout(timer);
  }, [progress]);

  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="processing-view animate-fade-in">
      <div style={{
        width: 80, height: 80, margin: '0 auto 24px',
        background: 'rgba(124,58,237,0.08)', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Loader size={32} color="var(--color-primary)" className="animate-spin" />
      </div>

      <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: '8px' }}>
        Processing your file...
      </h2>
      <p style={{ color: 'var(--color-gray-500)', marginBottom: '32px', fontSize: '15px' }}>
        {fileName && <span style={{ fontWeight: 500 }}>{fileName}</span>}
      </p>

      <div className="processing-steps">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isCompleted = i < currentIndex;
          const isActive = i === currentIndex;
          const cls = isCompleted ? 'completed' : isActive ? 'active' : '';

          return (
            <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {i > 0 && (
                <ArrowRight size={14} className="processing-step-arrow" />
              )}
              <div className={`processing-step ${cls}`}>
                <div className="processing-step-icon">
                  {isCompleted ? <CheckCircle size={16} /> : <Icon size={16} />}
                </div>
                <span>{step.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="processing-progress">
        <div
          className="processing-progress-bar"
          style={{ width: `${displayProgress}%` }}
        />
      </div>
      <p style={{ fontSize: '13px', color: 'var(--color-gray-400)' }}>
        {displayProgress}% complete
      </p>
    </div>
  );
}
