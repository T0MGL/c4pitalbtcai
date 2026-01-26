import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  pulse?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  pulse = false,
  className = '',
  ...props 
}) => {
  // Base
  const baseStyles = "relative overflow-hidden inline-flex items-center justify-center px-8 py-4 text-sm uppercase tracking-widest font-bold transition-all duration-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-offset-brand-dark disabled:opacity-50 disabled:cursor-not-allowed group";
  
  const variants = {
    // Brighter, more electric gold gradient
    primary: "bg-gradient-to-br from-[#F5E6C8] via-[#E8C170] to-[#B38B3A] text-brand-dark shadow-[0_0_20px_rgba(232,193,112,0.3)] hover:shadow-[0_0_35px_rgba(232,193,112,0.5)] hover:brightness-110 border border-white/20",
    
    // Deeper contrast for secondary
    secondary: "bg-[#0B101B] text-white hover:bg-[#151b29] border border-white/10 hover:border-brand-gold/40 hover:text-brand-gold",
    
    // Brighter outline
    outline: "bg-transparent border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark"
  };

  const widthClass = fullWidth ? "w-full" : "";
  const pulseClass = pulse ? "animate-pulse" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${pulseClass} ${className}`}
      {...props}
    >
      {/* Intense Shine effect */}
      {variant === 'primary' && (
        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 ease-in-out skew-x-12"></div>
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
};