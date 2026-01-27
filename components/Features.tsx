import React from 'react';
import { ScrollReveal } from './ScrollReveal';

const FeatureCard: React.FC<{ title: string; desc: string; icon: React.ReactNode }> = ({ title, desc, icon }) => (
  <div className="p-8 bg-[#0B101B] rounded-xl border border-white/5 hover:border-brand-gold/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(232,193,112,0.15)] group relative overflow-hidden flex flex-col h-full">
    {/* Shine effect on hover */}
    <div className="absolute inset-0 bg-gradient-to-tr from-brand-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    
    <div className="w-14 h-14 bg-brand-dark rounded-lg flex items-center justify-center mb-6 text-brand-gold border border-brand-gold/10 group-hover:bg-brand-gold group-hover:text-brand-dark group-hover:border-brand-gold transition-all duration-300 shadow-lg shrink-0 animate-float">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-gold transition-colors">{title}</h3>
    <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{desc}</p>
  </div>
);

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-brand-dark relative overflow-hidden scroll-mt-32">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal direction="up">
            <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">Por qué este sistema es <span className="text-gradient-gold">Exclusivo</span></h2>
            <p className="text-slate-300 text-lg">No es un producto masivo disponible públicamente. Es la misma lógica utilizada en cuentas de alto capital.</p>
            </div>
        </ScrollReveal>
        
        <div className="grid md:grid-cols-3 gap-8">
          <ScrollReveal direction="up" delay={0.2} className="h-full">
            <FeatureCard 
                title="Gestión de Riesgo & Seguridad"
                desc="Gestión de riesgo institucional desde el diseño. No quema cuentas con técnicas agresivas ni apuestas. Todo está calculado matemáticamente."
                icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>}
            />
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={0.4} className="h-full">
            <FeatureCard 
                title="Tecnología de Alto Nivel"
                desc="Utiliza la misma lógica y algoritmos que las cuentas de alto capital. No es un bot comercial barato, es una estrategia privada adaptada a tu cuenta."
                icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>}
            />
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.6} className="h-full">
            <FeatureCard 
                title="100% Automatizado"
                desc="No depende de la habilidad del trader. Elimina el error humano y la emoción. El sistema opera por ti, permitiéndote recuperar tiempo y calidad de vida."
                icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
            />
          </ScrollReveal>
        </div>

        <ScrollReveal direction="up" delay={0.8}>
          <div className="mt-16 text-center">
            <a href="https://www.myfxbook.com/members/GoldenForexx/capitalbtc-ai-trader/11726357" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-brand-gold text-sm font-bold uppercase tracking-widest hover:text-white transition-colors group">
              <span className="border-b border-brand-gold/30 group-hover:border-white pb-0.5 transition-colors">Ver Cuenta Auditada en MyFXBook</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};