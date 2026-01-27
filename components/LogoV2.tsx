import React from 'react';

interface LogoV2Props {
  className?: string;
  withText?: boolean;
}

/**
 * LogoV2 - "The Capital Coin"
 *
 * Design differences from V1:
 * - Rounded square frame (vs. open hexagonal C)
 * - Smooth curved C monogram (vs. angular miter joins)
 * - Ascending trend line + peak node (vs. filled diamond center)
 * - Subtle filled background tint (vs. stroke-only)
 *
 * Same branding: Gold metallic gradient, Montserrat + IBM Plex Sans text
 */
export const LogoV2: React.FC<LogoV2Props> = ({ className = "w-10 h-10", withText = true }) => {
  return (
    <div className="flex items-center gap-3">
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Capital BTC AI Logo"
      >
        <defs>
          <linearGradient id="logo-v2-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5E6C8" />
            <stop offset="40%" stopColor="#E8C170" />
            <stop offset="100%" stopColor="#B38B3A" />
          </linearGradient>
          <filter id="logo-v2-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Rounded Square Frame - Modern shield / coin edge */}
        <rect
          x="6" y="6" width="88" height="88" rx="20"
          stroke="url(#logo-v2-gradient)"
          strokeWidth="4"
          fill="#E8C170"
          fillOpacity="0.03"
        />

        {/* Bold C Monogram - Smooth curves */}
        <path
          d="M 66 28 L 44 28 Q 24 28 24 50 Q 24 72 44 72 L 66 72"
          stroke="url(#logo-v2-gradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#logo-v2-glow)"
        />

      </svg>

      {withText && (
        <div className="flex flex-col justify-center leading-none">
          <span className="text-xl font-serif font-bold tracking-tight text-white">
            CAPITAL
          </span>
          <span className="text-xs font-mono font-medium tracking-[0.3em] text-brand-gold">
            BTC AI
          </span>
        </div>
      )}
    </div>
  );
};
