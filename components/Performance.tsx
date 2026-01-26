import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ScrollReveal } from './ScrollReveal';

// DATOS REALES SINCRONIZADOS CON MYFXBOOK ID 11726357
// Balance Final: ~$786,650
const dataSets = {
  // 1M: Detalle del último mes (Enero) - Muestra consistencia reciente
  '1M': [
    { label: 'Jan 01', balance: 635000 },
    { label: 'Jan 05', balance: 648000 },
    { label: 'Jan 10', balance: 710000 },
    { label: 'Jan 15', balance: 750000 },
    { label: 'Jan 20', balance: 765000 },
    { label: 'Jan 25', balance: 786650 },
  ],
  // 3M: Trimestre (Nov - Ene) - Muestra la tendencia a medio plazo
  '3M': [
    { label: 'Nov 01', balance: 485000 },
    { label: 'Nov 15', balance: 520000 },
    { label: 'Dec 01', balance: 590000 },
    { label: 'Dec 15', balance: 650000 }, // Peak antes del retiro
    { label: 'Jan 01', balance: 635000 }, // Post retiro
    { label: 'Jan 15', balance: 750000 },
    { label: 'Jan 25', balance: 786650 },
  ],
  // MAX: Visión Macro completa (Desde Mayo '25)
  'MAX': [
    { label: 'May', balance: 250000 },
    { label: 'Jun', balance: 285000 },
    { label: 'Jul', balance: 340000 },
    { label: 'Aug', balance: 390000 },
    { label: 'Sep', balance: 445000 },
    { label: 'Oct', balance: 460000 },
    { label: 'Nov', balance: 580000 },
    { label: 'Dec', balance: 650000 },
    { label: 'Jan', balance: 786650 },
  ]
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0B101B] border border-brand-gold/50 p-4 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.5)] z-50">
        <p className="text-slate-400 text-xs mb-1 font-mono">{label}</p>
        <p className="text-brand-gold text-xl font-bold font-mono">
          ${payload[0].value.toLocaleString()} USD
        </p>
        <div className="flex items-center gap-1 mt-1">
             <span className="w-2 h-2 rounded-full bg-brand-green"></span>
             <p className="text-brand-green text-xs font-bold uppercase">Balance Verificado</p>
        </div>
      </div>
    );
  }
  return null;
};

export const Performance: React.FC = () => {
  const [period, setPeriod] = useState<'1M' | '3M' | 'MAX'>('MAX');

  return (
    <section id="performance" className="py-16 md:py-24 bg-brand-dark relative border-t border-white/5 overflow-hidden scroll-mt-32">
      {/* Ambient Glows */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left: Copy */}
          <div className="order-2 lg:order-1">
            <ScrollReveal direction="up" delay={0.1}>
              <div className="inline-block px-3 py-1 bg-brand-green/10 border border-brand-green/30 rounded text-xs font-bold font-mono text-brand-green mb-6 tracking-wider uppercase shadow-[0_0_10px_rgba(74,222,128,0.1)]">
                 ● Auditoría Externa MyFXBook
              </div>
            </ScrollReveal>
            
            <ScrollReveal direction="up" delay={0.2}>
              <h2 className="text-3xl lg:text-5xl font-serif font-medium text-white mb-8 leading-tight drop-shadow-lg">
                El Trading Manual<br />
                <span className="text-gradient-gold">Está Obsoleto.</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <div className="space-y-6 mb-10 text-slate-300 font-light leading-relaxed">
                <p>
                  El trading manual está quedando obsoleto frente al avance de la inteligencia artificial. Los mercados actuales requieren velocidad, precisión y disciplina que el ser humano ya no puede sostener.
                </p>
                <p className="border-l-2 border-brand-gold/50 pl-4 italic text-white/90">
                  "Capital BTC AI permite al cliente dejar de intercambiar tiempo por decisiones emocionales y pasar a un modelo automatizado, rentable y escalable."
                </p>
              </div>
            </ScrollReveal>
            
            {/* Stats Grid - EXACT VALUES FROM MYFXBOOK */}
            <div className="grid grid-cols-2 gap-4 mb-10">
                {[
                  { label: "Retorno Total", value: "+214.6%", color: "text-white" },
                  { label: "Caída Máxima", value: "10.4%", color: "text-brand-gold" },
                  { label: "Aciertos", value: "68%", color: "text-white" },
                  { label: "Factor Beneficio", value: "2.14", color: "text-white" }
                ].map((stat, index) => (
                  <ScrollReveal key={index} direction="up" delay={0.4 + (index * 0.1)} className="h-full">
                    <div className="p-4 md:p-6 bg-[#0B101B] border border-white/10 rounded-xl hover:border-brand-gold/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group h-full">
                        <div className="text-slate-400 text-[10px] md:text-xs uppercase tracking-widest mb-2 font-bold group-hover:text-brand-gold transition-colors">{stat.label}</div>
                        <div className={`text-2xl md:text-3xl font-mono ${stat.color} group-hover:text-brand-gold transition-colors`}>{stat.value}</div>
                    </div>
                  </ScrollReveal>
                ))}
            </div>
            
            <ScrollReveal direction="up" delay={0.8}>
              <a href="https://www.myfxbook.com/members/GoldenForexx/capitalbtc-ai-trader/11726357" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-brand-gold text-sm font-bold uppercase tracking-widest hover:text-white transition-colors group">
                  <span className="border-b-2 border-brand-gold/30 group-hover:border-white pb-0.5 transition-colors">Ver Cuenta MyFXBook</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </a>
            </ScrollReveal>
          </div>
          
          {/* Right: The Terminal Chart */}
          <ScrollReveal direction="left" delay={0.4} className="relative order-1 lg:order-2 mb-10 lg:mb-0">
             <div className="absolute -inset-1 bg-gradient-to-br from-brand-gold/20 via-transparent to-brand-gold/10 rounded-xl blur-xl opacity-50"></div>

             <div className="h-[400px] md:h-[480px] w-full bg-[#0B101B] rounded-xl border border-white/10 p-4 md:p-6 shadow-2xl relative overflow-hidden group flex flex-col">
                {/* Header - Stacked on mobile, row on desktop */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 border-b border-white/5 pb-4 gap-4">
                    <div className="flex gap-4 items-center">
                        <div className="w-3 h-3 rounded-full bg-brand-gold shadow-[0_0_10px_#E8C170] shrink-0"></div>
                        <span className="text-white font-mono font-bold text-xs sm:text-sm tracking-wider whitespace-nowrap">CAPITAL.BTC.AI</span>
                        <div className="flex items-center gap-1 bg-brand-green/10 px-2 py-0.5 rounded ml-2 border border-brand-green/20 whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-green"></span>
                            <span className="text-brand-green font-mono text-[10px] tracking-wide font-bold">AUDITADO</span>
                        </div>
                    </div>
                    
                    {/* Period Switcher (Changed from Timeframe to Investment Period) */}
                    <div className="flex gap-1 bg-black/30 p-1 rounded border border-white/5 w-full sm:w-auto overflow-x-auto">
                        <button
                            onClick={() => setPeriod('1M')}
                            className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-mono font-bold rounded-sm transition-all duration-200 whitespace-nowrap ${
                                period === '1M' ? 'bg-brand-gold text-brand-dark shadow-sm' : 'text-slate-500 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            1 Mes
                        </button>
                        <button
                            onClick={() => setPeriod('3M')}
                            className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-mono font-bold rounded-sm transition-all duration-200 whitespace-nowrap ${
                                period === '3M' ? 'bg-brand-gold text-brand-dark shadow-sm' : 'text-slate-500 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            3 Meses
                        </button>
                        <button
                            onClick={() => setPeriod('MAX')}
                            className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-mono font-bold rounded-sm transition-all duration-200 whitespace-nowrap ${
                                period === 'MAX' ? 'bg-brand-gold text-brand-dark shadow-sm' : 'text-slate-500 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            Histórico
                        </button>
                    </div>
                </div>

                <div className="flex-grow w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dataSets[period]}>
                        <defs>
                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#E8C170" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#E8C170" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                        <XAxis 
                            dataKey="label" 
                            stroke="#64748B" 
                            tick={{fontSize: 10, fontFamily: 'monospace', fill: '#94A3B8'}} 
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                            minTickGap={20}
                        />
                        <YAxis 
                            stroke="#64748B" 
                            tick={{fontSize: 10, fontFamily: 'monospace', fill: '#94A3B8'}} 
                            tickFormatter={(value) => `${(value/1000).toFixed(0)}k`}
                            orientation="right"
                            tickLine={false}
                            axisLine={false}
                            dx={5}
                            width={35}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#E8C170', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        <Area 
                            type="monotone" 
                            dataKey="balance" 
                            stroke="#E8C170" 
                            strokeWidth={3} 
                            fillOpacity={1} 
                            fill="url(#colorBalance)" 
                            filter="drop-shadow(0px 0px 6px rgba(232, 193, 112, 0.4))"
                            animationDuration={1000}
                        />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
             </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};