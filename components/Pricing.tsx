import React, { useState, useEffect, useMemo } from 'react';
import { Button } from './Button';
import { ScrollReveal } from './ScrollReveal';

export const Pricing: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: '00', minutes: '00', seconds: '00' });

  const particles = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `-${Math.random() * 20}s`,
    animationDuration: `${20 + Math.random() * 20}s`,
    opacity: 0.2 + Math.random() * 0.4,
    size: Math.random() * 3 + 1,
    showOnMobile: i < 15
  })), []);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      
      const diff = endOfDay.getTime() - now.getTime();
      
      if (diff <= 0) return;

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft({
        hours: h.toString().padStart(2, '0'),
        minutes: m.toString().padStart(2, '0'),
        seconds: s.toString().padStart(2, '0')
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const openForm = () => {
    window.dispatchEvent(new CustomEvent('open-qualification-form'));
  };

  return (
    <section id="pricing" className="py-24 bg-brand-dark relative overflow-hidden scroll-mt-32">
       {/* Styles for particles - Slower drift */}
       <style>{`
            @keyframes float-particle-pricing {
                0%, 100% { transform: translate(0, 0); }
                33% { transform: translate(10px, -20px); }
                66% { transform: translate(-10px, -10px); }
            }
        `}</style>

      {/* 1. Background Grid Texture - Explicit z-index 0 */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(232,193,112,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(232,193,112,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)] pointer-events-none z-0"></div>

      {/* 2. Spotlight Effect - Subtle to not wash out particles */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[500px] bg-brand-gold/5 blur-[100px] rounded-full pointer-events-none z-0"></div>

      {/* 3. Floating Particles - Increased Visibility */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {particles.map((p, i) => (
                <div
                    key={i}
                    className={`absolute bg-brand-gold rounded-full shadow-[0_0_8px_rgba(232,193,112,0.8)] will-change-transform ${p.showOnMobile ? 'block' : 'hidden md:block'}`}
                    style={{
                        left: p.left,
                        top: p.top,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        opacity: p.opacity,
                        animation: `float-particle-pricing ${p.animationDuration} ease-in-out infinite`,
                        animationDelay: p.animationDelay,
                    }}
                />
            ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal direction="up" distance="40px" duration={1.2}>
            <div className="max-w-xl mx-auto">
                
                {/* The "Black Card" Container */}
                <div className="relative bg-[#080A10] rounded-2xl overflow-hidden group shadow-[0_0_80px_-20px_rgba(232,193,112,0.15)] hover:shadow-[0_0_100px_-20px_rgba(232,193,112,0.25)] transition-shadow duration-500">
                    
                    {/* Animated Border Gradient */}
                    <div className="absolute inset-0 p-[1px] rounded-2xl bg-gradient-to-b from-brand-gold/60 via-brand-gold/10 to-transparent pointer-events-none"></div>
                    
                    {/* Shine Effect over card */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
                    
                    {/* Content - Adjusted padding for mobile */}
                    <div className="relative p-6 md:p-10 bg-[#080A10] h-full rounded-2xl">
                        
                        {/* Header */}
                        <div className="text-center mb-8 md:mb-10">
                            <div className="inline-block px-4 py-1.5 bg-brand-gold/10 border border-brand-gold/30 rounded-full mb-6 shadow-[0_0_15px_rgba(232,193,112,0.2)]">
                                <span className="text-[10px] md:text-xs font-bold text-brand-gold uppercase tracking-[0.2em] flex items-center gap-2 justify-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse"></span>
                                    Licencia Anual
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse"></span>
                                </span>
                            </div>
                            <h3 className="text-2xl md:text-4xl font-serif text-white mb-3">Licencia de Acceso Privado</h3>
                            <p className="text-slate-400 text-sm md:text-base">Tu capital operado por IA. Sin gráficas, sin estrés, 100% automático.</p>
                        </div>

                        {/* Price */}
                        <div className="flex items-end justify-center gap-3 mb-8 md:mb-10">
                            <div className="text-center">
                                {/* UPDATED: Larger, brighter anchor price */}
                                <span className="block text-slate-400 text-2xl md:text-3xl font-bold line-through mb-2 decoration-brand-red decoration-2">$2,997</span>
                                <span className="block text-5xl md:text-7xl font-serif text-white tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">$997</span>
                            </div>
                            <span className="text-lg md:text-xl text-slate-500 mb-2 md:mb-3 font-medium">/ año</span>
                        </div>

                        {/* Timer Strip */}
                        <div className="bg-white/[0.03] border border-white/10 rounded-lg p-4 mb-8 md:mb-10 flex flex-col sm:flex-row items-center justify-between gap-2 backdrop-blur-sm text-center sm:text-left">
                            <div className="flex items-center gap-3">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-red"></span>
                                </span>
                                <span className="text-xs text-slate-300 font-bold uppercase tracking-wider">Cierre de Inscripciones:</span>
                            </div>
                            <div className="font-mono text-brand-gold font-bold tracking-widest text-lg">
                                {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
                            </div>
                        </div>

                        {/* Features List */}
                        <div className="space-y-4 md:space-y-5 mb-10 md:mb-12 pl-2 md:pl-4">
                            {[
                                { text: "100% de la ganancia es tuya", bold: true },
                                { text: "Instalación Técnica Incluida", bold: true },
                                { text: "Soporte Prioritario en Español", bold: true },
                                { text: "Actualizaciones de Algoritmo", bold: false },
                                { text: "Guía de Gestión de Riesgo", bold: false },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 group/item">
                                    <div className="w-6 h-6 rounded-full bg-brand-gold/10 flex items-center justify-center border border-brand-gold/20 group-hover/item:bg-brand-gold group-hover/item:text-brand-dark transition-all duration-300 shadow-[0_0_10px_rgba(232,193,112,0.1)] shrink-0">
                                        <svg className="w-3.5 h-3.5 text-brand-gold group-hover/item:text-brand-dark transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                    <span className={`text-sm md:text-base ${item.bold ? 'text-white font-medium' : 'text-slate-400'}`}>{item.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Button */}
                        <Button fullWidth variant="primary" pulse onClick={openForm} className="mb-4 md:mb-6 text-base md:text-lg py-4 md:py-5 shadow-[0_0_30px_rgba(232,193,112,0.3)] hover:shadow-[0_0_50px_rgba(232,193,112,0.5)]">
                            Comenzar Ahora
                        </Button>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 opacity-60 hover:opacity-100 transition-opacity text-center">
                            <div className="hidden sm:block">
                                <svg className="w-3 h-3 text-slate-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                            </div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                                Pago Único Anual · Sin comisiones ocultas
                            </p>
                        </div>
                        <div className="mt-4 text-center">
                          <a href="https://www.myfxbook.com/members/GoldenForexx/capitalbtc-ai-trader/11726357" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-widest hover:text-white transition-colors group">
                            <span className="border-b border-brand-gold/30 group-hover:border-white pb-0.5 transition-colors">Ver Cuenta Auditada</span>
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                          </a>
                        </div>
                    </div>
                </div>
            </div>
        </ScrollReveal>
      </div>
    </section>
  );
};