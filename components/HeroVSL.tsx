import React, { useMemo } from 'react';
import { Button } from './Button';

export const HeroVSL: React.FC = () => {
  const openForm = () => {
    window.dispatchEvent(new CustomEvent('open-qualification-form'));
  };

  const particles = useMemo(() => Array.from({ length: 30 }).map((_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `-${Math.random() * 40}s`,
    animationDuration: `${30 + Math.random() * 30}s`, // Much slower for "underwater/space" feel
    opacity: 0.1 + Math.random() * 0.3,
    size: Math.random() * 2 + 1,
    moveType: Math.floor(Math.random() * 4) + 1,
    showOnMobile: i < 12 // Increased slightly for better mobile visuals while keeping perf
  })), []);

  return (
    <section id="hero-section" className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden bg-brand-dark">
      
      {/* Light Source - Enhanced */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-gold/10 blur-[120px] rounded-full pointer-events-none z-0 mix-blend-screen animate-pulse-slow"></div>
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none z-0 mix-blend-screen"></div>

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {particles.map((p, i) => (
          <div 
            key={i}
            className={`absolute bg-brand-gold rounded-full shadow-[0_0_10px_rgba(232,193,112,0.3)] will-change-transform ${p.showOnMobile ? 'block' : 'hidden md:block'}`}
            style={{
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              animation: `float-${p.moveType} ${p.animationDuration} ease-in-out infinite`,
              animationDelay: p.animationDelay,
            }}
          />
        ))}
      </div>
      
      {/* Main Content */}
      <div 
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center w-full"
      >
        
        {/* Badge - UPDATED: Focus on Exclusivity and Private Strategy */}
        <div className="flex items-center gap-3 mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-brand-gold"></div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-gold/30 bg-brand-gold/10 backdrop-blur-md shadow-glow-gold">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-100"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold"></span>
                </span>
                <span className="text-[11px] md:text-xs font-bold text-brand-gold tracking-[0.2em] uppercase shadow-black drop-shadow-md">Acceso Exclusivo • Estrategia Privada</span>
            </div>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-brand-gold"></div>
        </div>
        
        {/* Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium text-white leading-[1.1] mb-8 tracking-tight drop-shadow-xl">
          <span className="block animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Deja de Operar con Emociones.</span>
          <span className="block animate-fade-in-up relative mt-2" style={{ animationDelay: '0.4s' }}>
             <span className="text-transparent bg-clip-text bg-metallic-gold drop-shadow-[0_0_25px_rgba(232,193,112,0.4)]">Empieza a Operar con Ventaja.</span>
          </span>
        </h1>
        
        {/* Subheadline - UPDATED: Focus on Freedom/Automation */}
        <p className="text-lg md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed font-light animate-fade-in-up drop-shadow-lg" style={{ animationDelay: '0.6s' }}>
          La verdadera libertad financiera es <strong>automática</strong>. <br className="hidden md:block"/>
          Nuestro sistema opera los mercados 24/7 con precisión institucional, permitiéndote generar riqueza sin estar pegado a una pantalla.
        </p>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-16 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
           {['Tu Dinero, Tu Control', 'Resultados Verificados', '100% Manos Libres'].map((text, i) => (
             <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10 hover:border-brand-gold/50 transition-colors duration-300">
                <svg className="w-4 h-4 text-brand-gold" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                <span className="text-xs uppercase tracking-widest font-bold text-slate-200">{text}</span>
             </div>
           ))}
        </div>

        {/* Video Container */}
        <div className="relative w-full aspect-video max-w-5xl mx-auto mb-16 animate-fade-in-up group perspective-1000" style={{ animationDelay: '1s' }}>
            <div className="absolute -inset-2 bg-gradient-to-r from-brand-gold/30 via-white/10 to-brand-gold/30 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition duration-1000 animate-pulse-slow"></div>
            
            <div className="relative rounded-xl overflow-hidden bg-[#000] border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] group-hover:scale-[1.01] transition-transform duration-700">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=2664&auto=format&fit=crop')] bg-cover bg-center opacity-60 mix-blend-overlay hover:mix-blend-normal transition-all duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-transparent"></div>
                
                <div className="absolute inset-0 flex items-center justify-center cursor-pointer z-20">
                    <div className="relative group/btn">
                        <div className="absolute inset-0 bg-brand-gold/40 rounded-full blur-2xl group-hover/btn:blur-3xl transition-all duration-500"></div>
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-brand-gold/30 bg-black/40 backdrop-blur-md flex items-center justify-center pl-2 transition-transform duration-300 group-hover/btn:scale-95 group-active/btn:scale-90 shadow-[0_0_30px_rgba(232,193,112,0.2)]">
                            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-brand-gold border-b-[10px] border-b-transparent filter drop-shadow-[0_0_10px_rgba(232,193,112,0.8)]"></div>
                        </div>
                    </div>
                </div>

                <div className="absolute top-6 left-6 flex items-center gap-2 z-20">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]"></div>
                    <span className="text-[10px] uppercase tracking-widest text-white font-bold drop-shadow-md">Video Análisis</span>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-end bg-gradient-to-t from-black via-black/80 to-transparent z-20">
                   <div>
                       <p className="text-white font-bold text-xl mb-1 text-shadow">Ver el Sistema Operando en Vivo</p>
                       <p className="text-brand-gold text-sm font-mono">Demostración de Resultados Reales</p>
                   </div>
                </div>
            </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
          <Button onClick={openForm} pulse className="min-w-[300px] text-lg py-5 shadow-[0_0_30px_rgba(232,193,112,0.3)]">
            QUIERO MI LIBERTAD FINANCIERA
          </Button>
          <div className="flex items-center gap-6 mt-6 opacity-70">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <svg className="w-3 h-3 text-brand-green" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                  Tus llaves, tus monedas
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <svg className="w-3 h-3 text-brand-green" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                  Sin Bloqueos de Fondos
              </span>
          </div>
        </div>
      </div>

      <style>{`
        /* Smoother Float 1 */
        @keyframes float-1 { 
          0%, 100% { transform: translate(0, 0); } 
          50% { transform: translate(15px, -25px); } 
        }
        
        /* Smoother Float 2 */
        @keyframes float-2 { 
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(10px, -15px) rotate(2deg); }
        }

        /* Smoother Float 3 */
        @keyframes float-3 { 
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(-15px, -20px); }
          66% { transform: translate(10px, -30px); }
        }

        /* Smoother Float 4 */
        @keyframes float-4 {
           0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
           50% { transform: translateY(-40px) scale(0.9); opacity: 0.6; }
        }

        /* Improved Entrance Animation with Blur and Scale */
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(40px) scale(0.96); 
            filter: blur(10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
            filter: blur(0); 
          }
        }
        .animate-fade-in-up {
          opacity: 0;
          animation: fade-in-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity, filter;
        }
      `}</style>
    </section>
  );
};