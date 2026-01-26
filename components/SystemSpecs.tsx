import React from 'react';
import { ScrollReveal } from './ScrollReveal';

export const SystemSpecs: React.FC = () => {
  return (
    <section className="py-24 bg-brand-card/30 border-y border-white/5 relative overflow-hidden scroll-mt-32">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)] pointer-events-none"></div>
        
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-brand-gold/5 blur-[100px] rounded-full pointer-events-none -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal direction="up">
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/10 border border-brand-gold/20 rounded-full mb-4">
                    <svg className="w-3 h-3 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">Tecnología Simplificada</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
                    Tu Dinero Trabaja. <br/>
                    <span className="text-gradient-gold">Tú Disfrutas.</span>
                </h2>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    No necesitas ser un experto en finanzas. Hemos empaquetado una estrategia institucional compleja en un sistema simple: tú lo enciendes, nosotros lo operamos.
                </p>
            </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: The "Surfer" Analogy (Strategy) */}
            <ScrollReveal direction="up" delay={0.1} className="h-full">
                <div className="bg-[#0B101B] border border-white/5 p-6 rounded-xl hover:border-brand-gold/30 transition-all group h-full relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg className="w-16 h-16 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    </div>
                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Lógica Inteligente</h3>
                    <div className="text-xl text-white font-bold mb-3">Detecta, No Adivina</div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        El sistema actúa como un surfista profesional: espera pacientemente a la ola perfecta (el movimiento del dinero) y se sube a ella. Si no hay ola clara, no se mueve.
                    </p>
                </div>
            </ScrollReveal>

            {/* Card 2: The "Airbag" Analogy (Risk) */}
            <ScrollReveal direction="up" delay={0.2} className="h-full">
                <div className="bg-[#0B101B] border border-white/5 p-6 rounded-xl hover:border-brand-green/30 transition-all group h-full relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg className="w-16 h-16 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    </div>
                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Protección de Capital</h3>
                    <div className="text-xl text-brand-green font-bold mb-3">Escudo de Seguridad</div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Imagina un "airbag" financiero. Cada operación tiene un límite de pérdida predefinido y pequeño. Nunca arriesgamos tu capital completo en una sola jugada.
                    </p>
                </div>
            </ScrollReveal>

            {/* Card 3: The "Employee" Analogy (24/7) */}
            <ScrollReveal direction="up" delay={0.3} className="h-full">
                <div className="bg-[#0B101B] border border-white/5 p-6 rounded-xl hover:border-blue-500/30 transition-all group h-full relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                         <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Automatización</h3>
                    <div className="text-xl text-white font-bold mb-3">El Empleado Perfecto</div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        No duerme, no se cansa, no tiene miedo y no pide vacaciones. El sistema monitorea el mercado las 24 horas del día buscando ganancias para ti.
                    </p>
                </div>
            </ScrollReveal>

            {/* Card 4: The "Keys" Analogy (Custody) */}
            <ScrollReveal direction="up" delay={0.4} className="h-full">
                <div className="bg-[#0B101B] border border-white/5 p-6 rounded-xl hover:border-brand-gold/30 transition-all group h-full relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg className="w-16 h-16 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    </div>
                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Control Total</h3>
                    <div className="text-xl text-white font-bold mb-3">Tus Llaves, Tu Dinero</div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        El dinero nunca sale de tu cuenta personal. Nosotros solo conectamos el "cerebro" para operar, pero solo TÚ tienes permiso para retirar fondos al banco.
                    </p>
                </div>
            </ScrollReveal>
        </div>

        {/* Simplified Footer */}
        <ScrollReveal direction="up" delay={0.5}>
            <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap justify-center gap-6 md:gap-12 opacity-60">
                 <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
                    <span className="text-xs font-mono text-slate-400">Sin Comisiones Ocultas</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
                    <span className="text-xs font-mono text-slate-400">Instalación Asistida</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
                    <span className="text-xs font-mono text-slate-400">Transparencia Total</span>
                 </div>
            </div>
        </ScrollReveal>
      </div>
    </section>
  );
};