import React, { useState, useEffect } from 'react';
import { LogoV2 } from './LogoV2';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openForm = () => {
      window.dispatchEvent(new CustomEvent('open-qualification-form'));
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${scrolled ? 'bg-brand-dark/95 backdrop-blur-md border-b border-white/5 py-3' : 'bg-transparent py-4 md:py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <div className="hover:opacity-90 transition-opacity cursor-pointer z-50" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <LogoV2 className="w-10 h-10 md:w-12 md:h-12" />
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollToSection('#performance')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Resultados</button>
          <button onClick={() => scrollToSection('#features')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Sistema</button>
          <button onClick={() => scrollToSection('#comparison')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Ventajas</button>
          <button onClick={openForm} className="text-sm font-bold text-brand-gold hover:text-white transition-colors border border-brand-gold/30 px-5 py-2 rounded-full hover:bg-brand-gold hover:text-brand-dark hover:border-brand-gold shadow-[0_0_10px_rgba(232,193,112,0.1)] hover:shadow-[0_0_20px_rgba(232,193,112,0.4)]">Solicitar Acceso</button>
        </div>

        {/* Mobile CTA (Replaces Hamburger) */}
        <div className="md:hidden z-50">
          <button onClick={openForm} className="text-xs font-bold text-brand-dark bg-brand-gold px-4 py-2 rounded-full shadow-[0_0_15px_rgba(232,193,112,0.3)] active:scale-95 transition-transform">
            SOLICITAR ACCESO
          </button>
        </div>

      </div>
    </nav>
  );
};