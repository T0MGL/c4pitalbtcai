import React from 'react';
import { ScrollReveal } from './ScrollReveal';
import { Button } from './Button';

export const LiveResults: React.FC = () => {
  const myfxbookLink = "https://www.myfxbook.com/members/GoldenForexx/capitalbtc-ai-trader/11726357";
  const widgetImage = "https://widgets.myfxbook.com/widgets/11726357/large.jpg";

  return (
    <section className="py-32 bg-brand-dark border-y border-white/5 relative overflow-hidden">
        {/* Ambient Background Lights */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-green/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
                
                {/* Left: Persuasive Copy */}
                <div className="lg:col-span-5 space-y-8">
                    <ScrollReveal direction="up">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6 backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-brand-green shadow-[0_0_10px_#4ade80]"></span>
                            <span className="text-[10px] font-bold text-white tracking-widest uppercase">Sistema Auditado 24/7</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
                            Resultados Públicos. <br />
                            <span className="text-gradient-gold">Sin Secretos.</span>
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Cualquiera puede hacer una captura de pantalla ganadora. Pocos pueden mostrar un historial verificado por terceros.
                        </p>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Utilizamos <strong>MyFXBook</strong> para auditar cada operación. Tú ves lo mismo que nosotros: rendimiento real, drawdown real y ganancias reales.
                        </p>
                    </ScrollReveal>

                    <ScrollReveal direction="up" delay={0.2}>
                        <div className="flex flex-col gap-4">
                             <div className="flex items-center gap-4 p-4 bg-[#0B101B] border border-white/5 rounded-lg hover:border-brand-gold/30 transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold group-hover:scale-110 transition-transform">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm">Verificado por MyFXBook</h4>
                                    <p className="text-slate-500 text-xs">Autoridad global en auditoría de trading.</p>
                                </div>
                             </div>
                             
                             <div className="flex items-center gap-4 p-4 bg-[#0B101B] border border-white/5 rounded-lg hover:border-brand-gold/30 transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold group-hover:scale-110 transition-transform">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm">Track Record Inmutable</h4>
                                    <p className="text-slate-500 text-xs">No podemos borrar ni editar operaciones pasadas.</p>
                                </div>
                             </div>
                        </div>
                    </ScrollReveal>

                     <ScrollReveal direction="up" delay={0.4}>
                        <Button onClick={() => window.open(myfxbookLink, '_blank')} className="w-full md:w-auto shadow-glow-gold">
                            Ver Auditoría Oficial
                        </Button>
                     </ScrollReveal>
                </div>

                {/* Right: The High-End "Card" Wrapper */}
                <div className="lg:col-span-7 relative">
                    <ScrollReveal direction="left" delay={0.3}>
                        {/* Decorative glow behind */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-brand-gold/30 to-brand-green/30 rounded-2xl blur-xl opacity-20"></div>
                        
                        <div className="relative bg-[#080a10] border border-white/10 rounded-xl overflow-hidden shadow-2xl group">
                            
                            {/* 1. Native Header (Replaces the ugly widget header) */}
                            <div className="bg-[#0B101B] border-b border-white/5 p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Ganancia Total</div>
                                    <div className="text-2xl md:text-3xl font-mono text-brand-gold font-bold">+214.66%</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Mensual (Avg)</div>
                                    <div className="text-2xl md:text-3xl font-mono text-white font-bold">13.82%</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Drawdown</div>
                                    <div className="text-2xl md:text-3xl font-mono text-slate-300 font-bold">10.41%</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Estado</div>
                                    <div className="flex items-center gap-2 h-full">
                                         <div className="px-2 py-1 bg-brand-green/10 border border-brand-green/20 rounded text-[10px] font-bold text-brand-green uppercase tracking-wider animate-pulse">
                                            ● Activo
                                         </div>
                                    </div>
                                </div>
                            </div>

                            {/* 2. The Widget Container with "Dark Mode" Filter */}
                            <div className="relative bg-[#080a10] p-1 overflow-hidden h-[350px] md:h-[400px]">
                                {/* 
                                    TRUCO CSS: 
                                    invert(1) -> Vuelve el fondo blanco en negro.
                                    hue-rotate(180deg) -> Corrige los colores (el rojo invertido es cyan, al rotar 180 vuelve a ser rojo).
                                    contrast/brightness -> Ajuste fino para que se vea premium.
                                */}
                                <div 
                                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.02]"
                                    style={{
                                        backgroundImage: `url(${widgetImage})`,
                                        filter: 'invert(0.92) hue-rotate(180deg) brightness(1.1) contrast(0.95) saturate(1.2)',
                                        mixBlendMode: 'normal'
                                    }}
                                ></div>
                                
                                {/* Overlay Gradient to fade bottom edge smoothly */}
                                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#080a10] to-transparent pointer-events-none"></div>
                                
                                {/* "Live Data" overlay element */}
                                <div className="absolute bottom-6 right-6 z-10">
                                     <a href={myfxbookLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 hover:border-brand-gold/50">
                                        <span>Fuente: MyFXBook.com</span>
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                     </a>
                                </div>
                            </div>
                        </div>
                        
                        {/* Status Bar under card */}
                        <div className="mt-4 flex justify-between items-center px-2">
                             <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                                <span className="text-[10px] text-slate-500 font-mono uppercase">Last Update: Real-time API</span>
                             </div>
                             <div className="text-[10px] text-brand-gold font-mono uppercase opacity-60">ID: 11726357</div>
                        </div>

                    </ScrollReveal>
                </div>
            </div>
        </div>
    </section>
  );
};