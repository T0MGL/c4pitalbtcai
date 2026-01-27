import React from 'react';
import { ScrollReveal } from './ScrollReveal';
import { Button } from './Button';

export const Comparison: React.FC = () => {
  const features = [
    {
      name: "Tiempo Requerido",
      us: "10 Minutos / Semana",
      them: "20-40 Horas / Semana"
    },
    {
      name: "Factor Emocional",
      us: "0% (Lógica Pura)",
      them: "Alto (Miedo y Codicia)"
    },
    {
      name: "Gestión de Riesgo",
      us: "Institucional (SL 1.5%)",
      them: "Arriesgado / Sin SL"
    },
    {
      name: "Validación",
      us: "Auditoría MyFXBook",
      them: "Capturas (Falsificables)"
    },
    {
      name: "Control de Fondos",
      us: "Tú (En tu Broker)",
      them: "Ellos (Plataformas Dudosas)"
    },
    {
      name: "Instalación",
      us: "Técnico Especializado (Zoom)",
      them: "Hazlo tú mismo (PDFs)"
    }
  ];

  return (
    <section id="comparison" className="py-24 bg-brand-dark relative overflow-hidden scroll-mt-32">
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <ScrollReveal direction="up">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
                        No Compitas. <span className="text-gradient-gold">Domina.</span>
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        La mayoría de los traders minoristas pierden dinero intentando ganar al mercado. Nosotros no jugamos ese juego; ejecutamos un sistema matemático probado.
                    </p>
                </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
                
                {/* Them Card */}
                <ScrollReveal direction="right" delay={0.2} className="md:order-1 order-2">
                    <div className="bg-[#0B101B]/50 border border-white/5 rounded-2xl p-8 opacity-80 hover:opacity-100 transition-opacity">
                        <div className="text-center mb-8">
                            <h3 className="text-xl font-bold text-slate-400">Trading Manual / Bots Genéricos</h3>
                            <div className="w-12 h-1 bg-slate-700 mx-auto mt-4 rounded-full"></div>
                        </div>
                        <div className="space-y-6">
                            {features.map((feat, i) => (
                                <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                    <span className="text-slate-500 font-medium text-sm text-left">{feat.name}</span>
                                    <div className="flex items-center gap-2 text-right">
                                        <span className="text-slate-300 font-mono text-sm">{feat.them}</span>
                                        <svg className="w-5 h-5 text-red-500/50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </ScrollReveal>

                {/* Us Card */}
                <ScrollReveal direction="left" delay={0.4} className="md:order-2 order-1 relative">
                     <div className="absolute -inset-1 bg-gradient-to-b from-brand-gold/30 to-transparent rounded-2xl blur-lg opacity-50"></div>
                     <div className="bg-[#080A10] border border-brand-gold/30 rounded-2xl p-8 relative shadow-2xl transform md:scale-105 z-10">
                        <div className="absolute top-0 right-0 bg-brand-gold text-brand-dark text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg uppercase tracking-wider">
                            Recomendado
                        </div>
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                                <span className="text-brand-gold">Capital BTC AI</span>
                                <span className="flex h-2 w-2 rounded-full bg-brand-gold"></span>
                            </h3>
                            <div className="w-12 h-1 bg-brand-gold mx-auto mt-4 rounded-full"></div>
                        </div>
                        <div className="space-y-6">
                            {features.map((feat, i) => (
                                <div key={i} className="flex items-center justify-between border-b border-white/10 pb-4 last:border-0 last:pb-0">
                                    <span className="text-slate-400 font-medium text-sm text-left">{feat.name}</span>
                                    <div className="flex items-center gap-2 text-right">
                                        <span className="text-white font-mono font-bold text-sm">{feat.us}</span>
                                        <svg className="w-5 h-5 text-brand-green shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-4 space-y-4">
                            <Button fullWidth onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} pulse className="shadow-glow-gold">
                                Obtener Ventaja Profesional
                            </Button>
                            <div className="text-center">
                              <a href="https://www.myfxbook.com/members/GoldenForexx/capitalbtc-ai-trader/11726357" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-widest hover:text-white transition-colors group">
                                <span className="border-b border-brand-gold/30 group-hover:border-white pb-0.5 transition-colors">Ver Cuenta Auditada</span>
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                              </a>
                            </div>
                        </div>
                     </div>
                </ScrollReveal>

            </div>
        </div>
    </section>
  );
};