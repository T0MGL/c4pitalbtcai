import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ScrollReveal } from './ScrollReveal';
import { Button } from './Button';

const MONTHLY_RATE = 20;
const PERIOD_OPTIONS = [12, 24, 36] as const;

export const WealthSimulator: React.FC = () => {
  const [initialCapital, setInitialCapital] = useState(2500);
  const [monthlyContribution, setMonthlyContribution] = useState(200);
  const [months, setMonths] = useState<12 | 24 | 36>(12);

  const data = useMemo(() => {
    let currentBalance = initialCapital;
    let totalInvested = initialCapital;
    const chartData = [];

    for (let m = 0; m <= months; m++) {
      if (m > 0) {
        currentBalance = currentBalance * (1 + MONTHLY_RATE / 100);
        currentBalance += monthlyContribution;
        totalInvested += monthlyContribution;
      }

      if (m % 3 === 0 || m === months) {
        chartData.push({
            month: m,
            balance: Math.round(currentBalance),
            invested: totalInvested,
            label: `Mes ${m}`
        });
      }
    }
    return chartData;
  }, [initialCapital, monthlyContribution, months]);

  const finalBalance = data[data.length - 1].balance;
  const totalInvested = data[data.length - 1].invested;
  const totalProfit = finalBalance - totalInvested;

  const openForm = () => {
    window.dispatchEvent(new CustomEvent('open-qualification-form'));
  };

  return (
    <section className="py-24 bg-brand-dark relative overflow-hidden border-t border-white/5">
       {/* Background Effects */}
       <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-gold/5 via-brand-dark to-brand-dark pointer-events-none"></div>

       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal direction="up">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-block px-3 py-1 bg-brand-gold/10 border border-brand-gold/20 rounded-full mb-4">
                    <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">El Poder del Interés Compuesto</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
                    Calcula tu <span className="text-gradient-gold">Libertad Financiera</span>
                </h2>
                <p className="text-slate-300 text-lg">
                    No necesitas grandes capitales, necesitas constancia y un sistema validado. Juega con los números y visualiza tu futuro.
                </p>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 bg-[#0B101B] rounded-2xl border border-white/10 p-6 md:p-10 shadow-2xl">
              
              {/* Controles (Inputs) */}
              <div className="lg:col-span-4 space-y-8">
                  <ScrollReveal direction="right" delay={0.2}>
                    <div>
                        <label className="block text-slate-400 text-sm font-bold uppercase tracking-wider mb-3">Capital Inicial ($USD)</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range" min="500" max="20000" step="100"
                                value={initialCapital} onChange={(e) => setInitialCapital(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-gold touch-none"
                            />
                            <div className="w-24 bg-black/40 border border-white/10 rounded px-3 py-2 text-white font-mono text-right">
                                ${initialCapital.toLocaleString()}
                            </div>
                        </div>
                    </div>
                  </ScrollReveal>

                  <ScrollReveal direction="right" delay={0.3}>
                    <div>
                        <label className="block text-slate-400 text-sm font-bold uppercase tracking-wider mb-3">Aporte Mensual ($USD)</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range" min="0" max="2000" step="50"
                                value={monthlyContribution} onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-gold touch-none"
                            />
                            <div className="w-24 bg-black/40 border border-white/10 rounded px-3 py-2 text-white font-mono text-right">
                                ${monthlyContribution.toLocaleString()}
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-2">Reinyectar ganancias acelera el proceso exponencialmente.</p>
                    </div>
                  </ScrollReveal>

                  <ScrollReveal direction="right" delay={0.4}>
                    <div>
                        <label className="block text-slate-400 text-sm font-bold uppercase tracking-wider mb-3">Periodo</label>
                        <div className="flex gap-2">
                            {PERIOD_OPTIONS.map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setMonths(p)}
                                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${
                                        months === p
                                            ? 'bg-brand-gold/20 border border-brand-gold text-brand-gold'
                                            : 'bg-black/40 border border-white/10 text-slate-400 hover:border-white/20'
                                    }`}
                                >
                                    {p} Meses
                                </button>
                            ))}
                        </div>
                    </div>
                  </ScrollReveal>

                  <ScrollReveal direction="right" delay={0.5}>
                    <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-lg px-4 py-3">
                        <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Rentabilidad Mensual</span>
                        <span className="text-brand-gold font-mono font-bold text-lg">{MONTHLY_RATE}%</span>
                    </div>
                    <p className="text-[10px] text-brand-gold/70 mt-2">Promedio del sistema.</p>
                  </ScrollReveal>

                  <div className="pt-4 border-t border-white/10">
                      <div className="flex justify-between items-end mb-2">
                          <span className="text-slate-400 text-sm">Patrimonio Final:</span>
                          <span className="text-3xl font-serif font-bold text-white">${finalBalance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-end">
                           <span className="text-brand-green text-sm font-bold uppercase tracking-wider">Ganancia Neta (Profit):</span>
                           <span className="text-xl font-mono text-brand-green font-bold">+${totalProfit.toLocaleString()}</span>
                      </div>
                  </div>
              </div>

              {/* Gráfica */}
              <div className="lg:col-span-8 relative min-h-[400px] flex flex-col">
                 <ScrollReveal direction="left" delay={0.4} className="h-full w-full flex flex-col">
                    {/* Updated Legend: No confusing radio buttons */}
                    <div className="flex flex-wrap justify-end gap-4 md:gap-8 mb-4 px-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-0.5 bg-slate-600 border-t-2 border-slate-600 border-dashed"></div>
                            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Capital Aportado</span>
                        </div>
                         <div className="flex items-center gap-2">
                            <div className="w-8 h-3 bg-brand-gold/20 border-t-2 border-brand-gold rounded-sm"></div>
                            <span className="text-xs text-brand-gold font-bold uppercase tracking-wider shadow-black drop-shadow-sm">Patrimonio Final (IA)</span>
                        </div>
                    </div>

                    <div className="flex-grow min-h-0">
                        <ResponsiveContainer width="100%" height="100%" minHeight={350}>
                            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorBalanceSim" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#E8C170" stopOpacity={0.6}/>
                                        <stop offset="95%" stopColor="#E8C170" stopOpacity={0}/>
                                    </linearGradient>
                                    <pattern id="patternInvested" patternUnits="userSpaceOnUse" width="4" height="4">
                                        <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke="#475569" strokeWidth="1" />
                                    </pattern>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                                <XAxis 
                                    dataKey="label" 
                                    stroke="#64748B" 
                                    tick={{fontSize: 10}} 
                                    tickLine={false}
                                    axisLine={false}
                                    minTickGap={30}
                                />
                                <YAxis 
                                    stroke="#64748B" 
                                    tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} 
                                    tick={{fontSize: 10, fontFamily: 'monospace'}}
                                    tickLine={false}
                                    axisLine={false}
                                    orientation="right"
                                    width={40}
                                />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0B101B', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ fontFamily: 'monospace' }}
                                    labelStyle={{ color: '#94A3B8', marginBottom: '5px' }}
                                    formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name === 'invested' ? 'Capital Aportado' : 'Patrimonio Final']}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="invested" 
                                    stroke="#64748B" 
                                    strokeWidth={2}
                                    strokeDasharray="4 4"
                                    fill="transparent" 
                                    name="Capital Aportado"
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="balance" 
                                    stroke="#E8C170" 
                                    strokeWidth={3} 
                                    fill="url(#colorBalanceSim)" 
                                    name="Patrimonio Final"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                 </ScrollReveal>
              </div>
          </div>

          <ScrollReveal direction="up" delay={0.6}>
              <div className="mt-12 text-center">
                  <Button onClick={openForm} pulse className="shadow-[0_0_40px_rgba(232,193,112,0.4)]">
                      VERIFICAR PRECIO Y DISPONIBILIDAD
                  </Button>
                  <div className="mt-4">
                    <a href="https://www.myfxbook.com/members/GoldenForexx/capitalbtc-ai-trader/11726357" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-widest hover:text-white transition-colors group">
                      <span className="border-b border-brand-gold/30 group-hover:border-white pb-0.5 transition-colors">Ver Cuenta Auditada en MyFXBook</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  </div>
              </div>
          </ScrollReveal>
       </div>
    </section>
  );
};