/**
 * FYLORA — Logo Component
 * Minimalist "F" with flow/transformation motif
 */

export default function Logo({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Fylora logo"
    >
      <defs>
        <linearGradient id="fylora-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill="url(#fylora-grad)" />
      <path
        d="M12 10h16v4H16v5h10v4H16v9h-4V10z"
        fill="white"
        opacity="0.95"
      />
      <path
        d="M26 22l4 4-4 4"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
    </svg>
  );
}

export function LogoFull({ className = '' }) {
  return (
    <div className={`navbar-logo ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <Logo size={32} />
      <span>Fylora</span>
    </div>
  );
}
