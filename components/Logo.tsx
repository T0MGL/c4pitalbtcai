import React from 'react';

interface LogoProps {
  className?: string;
  withText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10", withText = true }) => {
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
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5E6C8" />
            <stop offset="40%" stopColor="#E8C170" />
            <stop offset="100%" stopColor="#B38B3A" />
          </linearGradient>
          <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Hexagonal 'C' - Represents Structure & Capital */}
        <path 
          d="M 88 32 L 72 10 L 28 10 L 12 50 L 28 90 L 72 90 L 88 68" 
          stroke="url(#logo-gradient)" 
          strokeWidth="8" 
          strokeLinecap="square"
          strokeLinejoin="miter"
        />

        {/* Inner Diamond Core - Represents the Asset (BTC) & AI Logic */}
        <path 
          d="M 50 32 L 68 50 L 50 68 L 32 50 Z" 
          fill="url(#logo-gradient)" 
          filter="drop-shadow(0 0 5px rgba(232, 193, 112, 0.5))"
        />
        
        {/* Tech Accents - Small connection nodes */}
        <circle cx="88" cy="32" r="3" fill="#F5E6C8" />
        <circle cx="88" cy="68" r="3" fill="#F5E6C8" />
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