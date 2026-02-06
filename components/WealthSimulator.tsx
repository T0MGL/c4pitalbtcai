import React, { useState, useMemo } from 'react';
import { ScrollReveal } from './ScrollReveal';
import { Button } from './Button';

const MONTHLY_RATE = 20;
const PERIOD_OPTIONS = [12, 24, 36] as const;

export const WealthSimulator: React.FC = () => {
  const [initialCapital, setInitialCapital] = useState(2500);
  const [months, setMonths] = useState<12 | 24 | 36>(12);

  const tableData = useMemo(() => {
    const rows = [];
    let currentBalance = initialCapital;

    for (let m = 1; m <= months; m++) {
      const balanceInicial = currentBalance;
      const balanceFinal = currentBalance * (1 + MONTHLY_RATE / 100);
      const beneficioTotal = balanceFinal - initialCapital;
      const gananciasTotales = ((balanceFinal - initialCapital) / initialCapital) * 100;

      rows.push({
        periodo: m,
        balanceInicial: Math.round(balanceInicial * 100) / 100,
        balanceFinal: Math.round(balanceFinal * 100) / 100,
        beneficioTotal: Math.round(beneficioTotal * 100) / 100,
        gananciasTotales: Math.round(gananciasTotales * 100) / 100,
      });

      currentBalance = balanceFinal;
    }
    return rows;
  }, [initialCapital, months]);

  const finalBalance = tableData[tableData.length - 1]?.balanceFinal || initialCapital;
  const totalProfit = tableData[tableData.length - 1]?.beneficioTotal || 0;

  const openForm = () => {
    window.dispatchEvent(new CustomEvent('open-qualification-form'));
  };

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-brand-dark relative overflow-hidden border-t border-white/5">
       {/* Background Effects */}
       <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-gold/5 via-brand-dark to-brand-dark pointer-events-none"></div>

       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal direction="up">
            <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
                <div className="inline-block px-3 py-1 bg-brand-gold/10 border border-brand-gold/20 rounded-full mb-3 sm:mb-4">
                    <span className="text-[9px] sm:text-[10px] font-bold text-brand-gold uppercase tracking-widest">El Poder del Interés Compuesto</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4 sm:mb-6 px-4">
                    Calcula tu <span className="text-gradient-gold">Libertad Financiera</span>
                </h2>
                <p className="text-slate-300 text-sm sm:text-base md:text-lg px-4 leading-relaxed">
                    No necesitas grandes capitales, necesitas constancia y un sistema validado. Juega con los números y visualiza tu futuro.
                </p>
            </div>
          </ScrollReveal>

          <div className="bg-[#0B101B] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="grid lg:grid-cols-12 gap-0 lg:gap-12 p-4 sm:p-6 md:p-10">

                  {/* Controles (Inputs) */}
                  <div className="lg:col-span-4 space-y-6 md:space-y-8 pb-6 lg:pb-0 border-b lg:border-b-0 lg:border-r border-white/10 lg:pr-8">
                      <ScrollReveal direction="right" delay={0.2}>
                        <div className="space-y-4">
                            <label className="block text-slate-400 text-xs sm:text-sm font-bold uppercase tracking-wider">Capital Inicial ($USD)</label>
                            <div className="space-y-3">
                                {/* Slider con padding adecuado para mobile */}
                                <div className="px-1">
                                    <input
                                        type="range" min="500" max="20000" step="100"
                                        value={initialCapital} onChange={(e) => setInitialCapital(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-gold touch-none"
                                    />
                                </div>
                                {/* Display value - Responsive */}
                                <div className="flex justify-center">
                                    <div className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 min-w-[140px] text-center">
                                        <span className="text-white font-mono text-xl sm:text-2xl font-bold">
                                            ${initialCapital.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                      </ScrollReveal>

                      <ScrollReveal direction="right" delay={0.3}>
                        <div className="space-y-4">
                            <label className="block text-slate-400 text-xs sm:text-sm font-bold uppercase tracking-wider">Periodo</label>
                            <div className="grid grid-cols-3 gap-2">
                                {PERIOD_OPTIONS.map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setMonths(p)}
                                        className={`py-3 sm:py-3.5 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider transition-all ${
                                            months === p
                                                ? 'bg-brand-gold/20 border border-brand-gold text-brand-gold'
                                                : 'bg-black/40 border border-white/10 text-slate-400 hover:border-white/20'
                                        }`}
                                    >
                                        {p}<span className="hidden xs:inline"> Meses</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                      </ScrollReveal>

                      <div className="pt-4 md:pt-6 border-t border-white/10 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-1 sm:gap-2">
                              <span className="text-slate-400 text-xs sm:text-sm">Patrimonio Final:</span>
                              <span className="text-2xl sm:text-3xl font-serif font-bold text-white">${finalBalance.toLocaleString()}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-1 sm:gap-2">
                               <span className="text-brand-green text-xs sm:text-sm font-bold uppercase tracking-wider">Ganancia Neta (Profit):</span>
                               <span className="text-lg sm:text-xl font-mono text-brand-green font-bold">+${totalProfit.toLocaleString()}</span>
                          </div>
                      </div>
                  </div>

                  {/* Tabla de Períodos */}
                  <div className="lg:col-span-8 relative pt-6 lg:pt-0">
                     <ScrollReveal direction="left" delay={0.4}>
                        {/* Mobile: Cards View */}
                        <div className="block sm:hidden space-y-2 max-h-[400px] overflow-y-auto rounded-lg">
                            {tableData.map((row) => (
                                <div key={row.periodo} className="bg-black/40 border border-white/10 rounded-lg p-4 space-y-2">
                                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                        <span className="text-brand-gold text-xs font-bold uppercase">Mes {row.periodo}</span>
                                        <span className="text-brand-gold text-sm font-mono font-bold">{row.gananciasTotales.toFixed(2)}%</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <span className="text-slate-500 block">Balance Inicial</span>
                                            <span className="text-slate-300 font-mono">${row.balanceInicial.toLocaleString()}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 block">Balance Final</span>
                                            <span className="text-white font-mono">${row.balanceFinal.toLocaleString()}</span>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-slate-500 block">Beneficio Total</span>
                                            <span className="text-brand-green font-mono font-bold">${row.beneficioTotal.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Tablet & Desktop: Table View */}
                        <div className="hidden sm:block overflow-x-auto max-h-[400px] overflow-y-auto rounded-lg border border-white/10">
                            <table className="w-full text-sm">
                                <thead className="sticky top-0 bg-[#0B101B] border-b border-white/10 z-10">
                                    <tr>
                                        <th className="px-3 md:px-4 py-3 text-left text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Mes</th>
                                        <th className="px-3 md:px-4 py-3 text-right text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Balance Inicial</th>
                                        <th className="px-3 md:px-4 py-3 text-right text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Balance Final</th>
                                        <th className="px-3 md:px-4 py-3 text-right text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Beneficio Total</th>
                                        <th className="px-3 md:px-4 py-3 text-right text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Ganancia %</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {tableData.map((row) => (
                                        <tr key={row.periodo} className="hover:bg-white/5 transition-colors">
                                            <td className="px-3 md:px-4 py-3 text-white font-medium text-xs md:text-sm">{row.periodo}</td>
                                            <td className="px-3 md:px-4 py-3 text-right text-slate-300 font-mono text-xs md:text-sm whitespace-nowrap">${row.balanceInicial.toLocaleString()}</td>
                                            <td className="px-3 md:px-4 py-3 text-right text-white font-mono text-xs md:text-sm whitespace-nowrap">${row.balanceFinal.toLocaleString()}</td>
                                            <td className="px-3 md:px-4 py-3 text-right text-brand-green font-mono text-xs md:text-sm whitespace-nowrap">${row.beneficioTotal.toLocaleString()}</td>
                                            <td className="px-3 md:px-4 py-3 text-right text-brand-gold font-mono font-bold text-xs md:text-sm">{row.gananciasTotales.toFixed(2)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                     </ScrollReveal>
                  </div>
              </div>
          </div>

          <ScrollReveal direction="up" delay={0.6}>
              <div className="mt-8 sm:mt-12 text-center px-4">
                  <Button onClick={openForm} pulse className="shadow-[0_0_40px_rgba(232,193,112,0.4)] w-full sm:w-auto">
                      <span className="text-xs sm:text-sm">VERIFICAR PRECIO Y DISPONIBILIDAD</span>
                  </Button>
                  <div className="mt-4 sm:mt-6">
                    <a href="https://www.myfxbook.com/members/GoldenForexx/capitalbtc-ai-trader/11726357" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 text-brand-gold text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest hover:text-white transition-colors group">
                      <span className="border-b border-brand-gold/30 group-hover:border-white pb-0.5 transition-colors">Ver Cuenta Auditada en MyFXBook</span>
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  </div>
              </div>
          </ScrollReveal>
       </div>
    </section>
  );
};