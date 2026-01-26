import React from 'react';
import { ScrollReveal } from './ScrollReveal';

const testimonials = [
  {
    name: "Carlos M.",
    role: "Empresario, México",
    text: "Al principio era escéptico porque he perdido dinero con 'bots' antes. Lo que me convenció fue la transparencia de la cuenta auditada. Llevo 5 meses y la consistencia es impresionante.",
    stars: 5,
    gain: "+42% en 5 meses"
  },
  {
    name: "Ana Sofía R.",
    role: "Arquitecta, España",
    text: "No tengo tiempo para aprender trading. Capital BTC AI fue la solución perfecta. La instalación fue en una llamada de Zoom y desde entonces no he tenido que tocar nada.",
    stars: 5,
    gain: "Ingreso Pasivo Real"
  },
  {
    name: "Diego V.",
    role: "Inversionista, Colombia",
    text: "La gestión de riesgo es lo mejor. He visto como el sistema corta las pérdidas rápido y deja correr las ganancias. Es la primera vez que duermo tranquilo teniendo capital en cripto.",
    stars: 5,
    gain: "Gestión de Riesgo Top"
  }
];

const recentWins = [
    "BTC/USD Buy Closed: +$420.50",
    "XAU/USD Sell Closed: +$1,250.00",
    "ETH/USD Buy Closed: +$180.20",
    "Nuevo Miembro: Javier R. (Chile)",
    "Retiro Procesado: $5,000 USD",
    "Nuevo Miembro: Maria L. (España)",
    "BTC/USD Buy Closed: +$890.00",
    "XAU/USD Buy Closed: +$340.00",
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-brand-dark relative overflow-hidden">
      
      {/* Moving Ticker - To fill the "empty" feeling */}
      <div className="w-full bg-[#0B101B] border-y border-white/5 py-3 mb-20 overflow-hidden relative">
         <div className="flex gap-12 whitespace-nowrap animate-[marquee_30s_linear_infinite]">
             {[...recentWins, ...recentWins, ...recentWins].map((text, i) => (
                 <div key={i} className="flex items-center gap-2 text-xs font-mono text-slate-400">
                     <span className="w-1.5 h-1.5 rounded-full bg-brand-gold/50"></span>
                     {text.includes('+') ? <span className="text-brand-green font-bold">{text}</span> : <span>{text}</span>}
                 </div>
             ))}
         </div>
         {/* Fade edges */}
         <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-brand-dark to-transparent z-10"></div>
         <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-brand-dark to-transparent z-10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
             <div className="text-center mb-16">
                 <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                    La Comunidad <span className="text-brand-gold">Privada</span>
                 </h2>
                 <p className="text-slate-400 max-w-2xl mx-auto">
                     No vendemos cursos. Ofrecemos acceso a una herramienta institucional. Aquí están las experiencias de quienes ya están dentro.
                 </p>
             </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 0.2}>
              <div className="bg-[#0B101B] border border-white/5 p-8 rounded-xl relative h-full flex flex-col hover:border-brand-gold/30 transition-all hover:-translate-y-1 group">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 text-brand-gold/10 font-serif text-6xl leading-none group-hover:text-brand-gold/20 transition-colors">"</div>
                
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(t.stars)].map((_, idx) => (
                    <svg key={idx} className="w-4 h-4 text-brand-gold drop-shadow-[0_0_5px_rgba(232,193,112,0.5)]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>

                <p className="text-slate-300 leading-relaxed mb-8 flex-grow italic relative z-10 font-light">"{t.text}"</p>

                <div className="border-t border-white/5 pt-6 flex items-center justify-between">
                    <div>
                        <p className="text-white font-bold text-lg">{t.name}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">{t.role}</p>
                    </div>
                    <div className="bg-brand-green/10 border border-brand-green/20 px-3 py-1.5 rounded text-[10px] font-bold text-brand-green uppercase tracking-wider shadow-[0_0_10px_rgba(74,222,128,0.1)]">
                        {t.gain}
                    </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};