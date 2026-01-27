import React, { useMemo, useState, useRef } from 'react';
import { Button } from './Button';

export const HeroVSL: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling play when clicking mute
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

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
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium text-white leading-[1.1] mb-12 tracking-tight drop-shadow-xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          El robot que <span className="text-transparent bg-clip-text bg-metallic-gold drop-shadow-[0_0_25px_rgba(232,193,112,0.4)]">no todos</span> pueden tener.
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed font-light animate-fade-in-up drop-shadow-lg" style={{ animationDelay: '0.6s' }}>
          La verdadera libertad financiera es <strong className="text-white">automática</strong>. <br className="hidden md:block" />
          Nuestro sistema opera los mercados 24/7 con precisión institucional, permitiéndote generar riqueza sin estar pegado a una pantalla.
        </p>

        {/* Video Container */}
        <div className="relative w-full aspect-video max-w-5xl mx-auto mb-24 animate-fade-in-up group perspective-1000" style={{ animationDelay: '1s' }}>
          <div className="absolute -inset-2 bg-gradient-to-r from-brand-gold/30 via-white/10 to-brand-gold/30 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition duration-1000 animate-pulse-slow"></div>

          <div className="relative rounded-xl overflow-hidden bg-[#000] border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] group-hover:scale-[1.01] transition-transform duration-700">
            {/* 1. CLICK LAYER - Explicit separate layer for handling clicks */}
            <div 
              className="absolute inset-0 z-10 cursor-pointer" 
              onClick={togglePlay}
              aria-label={isPlaying ? "Pausar video" : "Reproducir video"}
            ></div>

            <div className="relative w-full h-full bg-black">
              
              {/* Fallback/Poster while loading */}
              <div
                className={`absolute inset-0 bg-brand-dark flex items-center justify-center transition-opacity duration-1000 z-0 ${videoLoaded ? 'opacity-0' : 'opacity-100'}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-[#1a1f2e] to-brand-dark animate-pulse"></div>
                <svg className="w-12 h-12 text-brand-gold/20 animate-spin relative z-10" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>

              {/* Play Overlay (When Paused) - Sits below click layer visually but visible */}
              {!isPlaying && (
                <div className="absolute inset-0 z-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all duration-300 animate-fade-in pointer-events-none">
                   <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full bg-brand-gold/90 text-brand-dark pl-2 shadow-[0_0_30px_rgba(232,193,112,0.6)] hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
              )}

              <video
                ref={videoRef}
                src="https://pub-a60da4810fdd4dd3afcaf935f382175e.r2.dev/vsl_final_1080p_v2.mp4"
                className={`w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
                autoPlay
                muted={isMuted}
                playsInline
                loop
                onCanPlay={() => setVideoLoaded(true)}
                onLoadedData={() => setVideoLoaded(true)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* CONTROLS BAR (Visible on Hover/Pause) */}
              <div 
                className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-300 flex items-center justify-between gap-4 z-20 pointer-events-none ${isPlaying ? 'opacity-0 hover:opacity-100 group-hover:opacity-100' : 'opacity-100'}`}
              >
                 {/* Left: Play/Pause */}
                 <button 
                  onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                  className="pointer-events-auto text-white hover:text-brand-gold transition-colors"
                  aria-label={isPlaying ? "Pausar" : "Reproducir"}
                 >
                   {isPlaying ? (
                     <svg className="w-6 h-6 md:w-8 md:h-8 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                   ) : (
                     <svg className="w-6 h-6 md:w-8 md:h-8 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                   )}
                 </button>

                 {/* Right: Mute/Unmute */}
                 <button 
                  onClick={toggleMute}
                  className="pointer-events-auto text-white hover:text-brand-gold transition-colors flex items-center gap-2"
                 >
                    <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">{isMuted ? 'Activar Sonido' : 'Silenciar'}</span>
                    {isMuted ? (
                      <svg className="w-6 h-6 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                    ) : (
                      <svg className="w-6 h-6 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                    )}
                 </button>
              </div>
            </div>

            {/* Sound Badge - Only shows when muted - Z-30 to be above Click Layer */}
            {isMuted && (
              <div
                onClick={toggleMute}
                className="absolute top-4 right-4 z-30 cursor-pointer animate-fade-in"
              >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md hover:bg-black/80 hover:border-brand-gold/50 transition-all duration-300 group-badge">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold"></span>
                  </div>
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                  <span className="text-[10px] font-medium text-slate-200 uppercase tracking-widest group-hover-badge:text-brand-gold transition-colors">Activar Sonido</span>
                </div>
              </div>
            )}

            <div className="absolute top-6 left-6 flex items-center gap-2 z-20 pointer-events-none">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]"></div>
              <span className="text-[10px] uppercase tracking-widest text-white font-bold drop-shadow-md">En Vivo</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
          <Button onClick={openForm} pulse className="min-w-[300px] text-lg py-5 shadow-[0_0_30px_rgba(232,193,112,0.3)]">
            Quiero mi licencia MT5
          </Button>
          <div className="flex flex-wrap justify-center items-center gap-6 mt-6 opacity-70">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <svg className="w-3 h-3 text-brand-green" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              Sin tener que vender
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <svg className="w-3 h-3 text-brand-green" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              Ni redes de mercadeo
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <svg className="w-3 h-3 text-brand-green" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              100% de profits para ti
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
    </section >
  );
};