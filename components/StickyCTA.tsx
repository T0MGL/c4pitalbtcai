import React, { useState, useEffect } from 'react';
import { Button } from './Button';

export const StickyCTA: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [spots, setSpots] = useState(0);
  const [timeLeft, setTimeLeft] = useState('');

  // Smart Urgency System
  useEffect(() => {
    // 1. Calculate Spots (Deterministic based on date)
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const calculatedSpots = 3 + (seed % 8); // 3-10 spots
    setSpots(calculatedSpots);

    // 2. Countdown Timer
    const updateTimer = () => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      
      const diff = endOfDay.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft("00:00:00");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(
        `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll Observer
  useEffect(() => {
    const handleScroll = () => {
        const hero = document.getElementById('hero-section');
        const pricing = document.getElementById('pricing');
        
        if (!hero || !pricing) return;

        const heroRect = hero.getBoundingClientRect();
        const pricingRect = pricing.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Show when hero is scrolled past
        const pastHero = heroRect.bottom < 0;
        // Hide when pricing starts entering the viewport
        const beforePricing = pricingRect.top > windowHeight;

        setIsVisible(pastHero && beforePricing);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openForm = () => {
    window.dispatchEvent(new CustomEvent('open-qualification-form'));
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
      {/* Glassmorphic Container */}
      <div className="absolute inset-0 bg-[#05080f]/95 backdrop-blur-xl border-t border-brand-gold/30 shadow-[0_-10px_50px_rgba(0,0,0,0.8)]"></div>
      
      {/* Glow Effect Top Border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4 flex items-center justify-between gap-4">
        
        {/* Left Side: Info */}
        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-8">
           
           {/* Price Group */}
           <div className="flex items-center gap-4">
               {/* Mobile/Desktop Price */}
               <div>
                   <div className="flex items-baseline gap-2">
                        <span className="text-white text-xl md:text-3xl font-serif font-bold tracking-tight">$997</span>
                        <span className="text-slate-500 text-xs md:text-sm font-medium">USD</span>
                        {/* UPDATED: Larger, clearer anchor price for sticky CTA */}
                        <span className="text-slate-400 text-sm md:text-xl font-bold line-through decoration-brand-red decoration-2 hidden sm:inline ml-2">$2,997</span>
                   </div>
                   {/* Mobile Urgency: Cleanly stacked under Price */}
                   <div className="md:hidden flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse"></span>
                        <span className="text-[10px] text-brand-gold font-bold uppercase tracking-wide">Quedan {spots} lugares</span>
                   </div>
               </div>
           </div>

           {/* Desktop Urgency Section (Hidden on Mobile) */}
           <div className="hidden md:flex items-center gap-6 border-l border-white/10 pl-8 h-10">
              {/* Spots Pill */}
              <div className="flex items-center gap-2 bg-brand-gold/5 px-3 py-1.5 rounded-full border border-brand-gold/20 shadow-[0_0_10px_rgba(232,193,112,0.1)]">
                 <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold"></span>
                 </span>
                 <span className="text-brand-gold text-xs font-bold uppercase tracking-widest">{spots} licencias hoy</span>
              </div>
              
              {/* Timer */}
              <div className="flex flex-col justify-center">
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-0.5">La oferta termina en</span>
                  <span className="text-white font-mono font-bold text-sm tracking-wider leading-none">{timeLeft}</span>
              </div>
           </div>
        </div>

        {/* Right Side: CTA */}
        <div className="flex-shrink-0">
             <Button 
                onClick={openForm} 
                className="!py-3 !px-6 md:!px-10 text-sm md:text-base w-full md:w-auto shadow-[0_0_20px_rgba(232,193,112,0.25)] hover:shadow-[0_0_30px_rgba(232,193,112,0.4)]"
                pulse
             >
                Asegurar Licencia
                <svg className="w-4 h-4 ml-2 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
             </Button>
        </div>
      </div>
    </div>
  );
};