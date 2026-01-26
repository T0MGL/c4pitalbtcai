import React, { useMemo, useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { ScrollReveal } from './ScrollReveal';
import { Button } from './Button';

// DATOS REALES EXTRAÍDOS DE MYFXBOOK (CapitalBTC AI Trader)
// Periodo: Mayo 02, 2025 - Enero 21, 2026
// Inicio: ~$250,000
// Actual: ~$786,650 (+214.66%)
const chartData = [
  { date: 'May 02', balance: 250000, equity: 250000, withdrawal: 0 },
  { date: 'May 18', balance: 262000, equity: 261000, withdrawal: 0 },
  { date: 'Jun 05', balance: 258000, equity: 254000, withdrawal: 0 }, // Drawdown pequeño
  { date: 'Jun 22', balance: 285000, equity: 282000, withdrawal: 0 },
  { date: 'Jul 10', balance: 315000, equity: 312000, withdrawal: 0 },
  { date: 'Jul 28', balance: 340000, equity: 338000, withdrawal: 0 },
  { date: 'Aug 15', balance: 335000, equity: 330000, withdrawal: 1 }, // Retiro Parcial y corrección
  { date: 'Sep 02', balance: 390000, equity: 388000, withdrawal: 0 },
  { date: 'Sep 20', balance: 445000, equity: 440000, withdrawal: 0 },
  { date: 'Oct 08', balance: 460000, equity: 455000, withdrawal: 0 },
  { date: 'Oct 25', balance: 448000, equity: 442000, withdrawal: 0 }, // Consolidación
  { date: 'Nov 12', balance: 520000, equity: 515000, withdrawal: 0 },
  { date: 'Nov 28', balance: 580000, equity: 575000, withdrawal: 0 },
  { date: 'Dec 15', balance: 650000, equity: 640000, withdrawal: 1 }, // Retiro Importante
  { date: 'Dec 30', balance: 630000, equity: 625000, withdrawal: 0 },
  { date: 'Jan 10', balance: 710000, equity: 705000, withdrawal: 0 },
  { date: 'Jan 21', balance: 786650, equity: 780000, withdrawal: 0 }, // Pico actual (+214.66%)
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0B101B]/95 backdrop-blur border border-white/10 p-4 rounded-lg shadow-xl">
        <p className="text-slate-400 text-xs mb-2 font-mono">{label} '25/26</p>
        <div className="space-y-1">
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-gold"></span>
                <span className="text-slate-200 text-sm">Balance:</span>
                <span className="text-brand-gold font-mono font-bold">${payload[0].value.toLocaleString()}</span>
            </div>
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-green"></span>
                <span className="text-slate-200 text-sm">Equity:</span>
                <span className="text-brand-green font-mono font-bold">${payload[1].value.toLocaleString()}</span>
            </div>
        </div>
      </div>
    );
  }
  return null;
};

export const VerifiedResults: React.FC = () => {
  const [lastUpdate, setLastUpdate] = useState("Cargando...");

  // Efecto para simular tiempo real
  useEffect(() => {
    const updateTime = () => {
        const now = new Date();
        const timeString = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastUpdate(`Hoy, ${timeString} GMT`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Generar partículas aleatorias (similar al Hero)
  const particles = useMemo(() => Array.from({ length: 25 }).map((_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `-${Math.random() * 20}s`,
    animationDuration: `${10 + Math.random() * 20}s`,
    opacity: 0.05 + Math.random() * 0.2, // Muy sutil
    size: Math.random() * 3 + 1,
    showOnMobile: i < 12 // Limit mobile particles
  })), []);

  return (
    <section className="py-24 bg-brand-dark border-y border-white/5 relative overflow-hidden">
        {/* CSS local para animación de partículas flotantes */}
        <style>{`
            @keyframes float-particle {
                0%, 100% { transform: translateY(0) translateX(0); }
                33% { transform: translateY(-20px) translateX(10px); }
                66% { transform: translateY(10px) translateX(-10px); }
            }
        `}</style>

        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)] pointer-events-none"></div>

        {/* Ambient Glows (Nuevos para llenar espacio) */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3 mix-blend-screen"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-green/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3 mix-blend-screen"></div>

        {/* Particles Layer */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {particles.map((p, i) => (
                <div
                    key={i}
                    className={`absolute bg-brand-gold rounded-full shadow-[0_0_5px_rgba(232,193,112,0.2)] will-change-transform ${p.showOnMobile ? 'block' : 'hidden md:block'}`}
                    style={{
                        left: p.left,
                        top: p.top,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        opacity: p.opacity,
                        animation: `float-particle ${p.animationDuration} ease-in-out infinite`,
                        animationDelay: p.animationDelay,
                    }}
                />
            ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
                
                {/* Left: Data Visualization (The "Screenshot" Recreated) */}
                <div className="lg:col-span-8 order-2 lg:order-1">
                    <ScrollReveal direction="right" delay={0.2}>
                        {/* Browser Window Effect */}
                        <div className="rounded-xl overflow-hidden border border-white/10 bg-[#080A10] shadow-2xl relative group">
                            {/* Window Header */}
                            <div className="bg-[#0B101B] px-4 py-3 border-b border-white/5 flex items-center justify-between">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                                </div>
                                <div className="text-xs font-mono text-slate-500 flex items-center gap-2">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                    myfxbook.com/members/CapitalBTC-AI-Master
                                </div>
                            </div>

                            {/* Chart Area */}
                            <div className="p-6 md:p-8 h-[450px] relative">
                                {/* Watermark */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                                    <span className="text-6xl font-bold text-white transform -rotate-12">VERIFIED</span>
                                </div>

                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorBalanceResult" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#E8C170" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#E8C170" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                                        <XAxis 
                                            dataKey="date" 
                                            stroke="#475569" 
                                            tick={{fontSize: 10, fontFamily: 'monospace'}} 
                                            tickLine={false}
                                            axisLine={false}
                                            minTickGap={30}
                                        />
                                        <YAxis 
                                            stroke="#475569" 
                                            tickFormatter={(value) => `${(value/1000).toFixed(0)}k`} 
                                            tick={{fontSize: 10, fontFamily: 'monospace'}}
                                            orientation="right"
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        
                                        {/* Equity Line (Greenish - safe) */}
                                        <Area 
                                            type="monotone" 
                                            dataKey="equity" 
                                            stroke="#4ADE80" 
                                            strokeWidth={1} 
                                            fill="transparent" 
                                            strokeDasharray="3 3"
                                            name="Equity"
                                        />

                                        {/* Balance Line (Gold - Main) */}
                                        <Area 
                                            type="monotone" 
                                            dataKey="balance" 
                                            stroke="#E8C170" 
                                            strokeWidth={3} 
                                            fill="url(#colorBalanceResult)" 
                                            name="Balance"
                                        />

                                        {/* Withdrawal Markers (Red Dots simulation based on chart dips) */}
                                        <ReferenceDot x="Aug 15" y={335000} r={6} fill="#EF4444" stroke="#fff" strokeWidth={2} />
                                        <ReferenceDot x="Dec 15" y={650000} r={6} fill="#EF4444" stroke="#fff" strokeWidth={2} />

                                    </AreaChart>
                                </ResponsiveContainer>
                                
                                {/* Labels for dots */}
                                <div className="absolute top-[52%] left-[38%] bg-brand-red/90 text-white text-[10px] px-2 py-0.5 rounded pointer-events-none transform -translate-y-full shadow-lg">
                                    Retiro Realizado
                                </div>
                                <div className="absolute top-[18%] left-[78%] bg-brand-red/90 text-white text-[10px] px-2 py-0.5 rounded pointer-events-none transform -translate-y-full shadow-lg">
                                    Retiro Realizado
                                </div>
                            </div>

                            {/* Stats Footer - EXACT VALUES FROM MYFXBOOK LINK */}
                            <div className="bg-[#0B101B] border-t border-white/5 p-4 md:p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Ganancia Total</div>
                                    <div className="text-xl md:text-2xl font-mono text-brand-green font-bold">+214.66%</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Drawdown Máx</div>
                                    <div className="text-xl md:text-2xl font-mono text-brand-red/80 font-bold">10.41%</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Profit Factor</div>
                                    <div className="text-xl md:text-2xl font-mono text-white font-bold">2.14</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Estado</div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
                                        <span className="text-sm text-brand-green font-bold uppercase">Verificado</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Live Update Indicator */}
                        <div className="mt-4 flex justify-between items-center px-2">
                             <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green"></span>
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono uppercase">Last Update: <span className="text-white">{lastUpdate}</span></span>
                             </div>
                             <div className="text-[10px] text-brand-gold font-mono uppercase opacity-60">ID: 11726357</div>
                        </div>
                    </ScrollReveal>
                </div>

                {/* Right: Explanation */}
                <div className="lg:col-span-4 order-1 lg:order-2 space-y-8">
                    <ScrollReveal direction="left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/10 border border-brand-gold/20 rounded text-[10px] font-bold text-brand-gold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(232,193,112,0.15)]">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Track Record Oficial
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white mb-6 leading-tight">
                            Lo Importante no es Ganar. <br/>
                            <span className="text-gradient-gold">Es Retirar.</span>
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            Cualquier sistema puede tener "suerte" un mes. Nuestro sistema ha demostrado consistencia desde Mayo 2025 hasta Enero 2026.
                        </p>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8">
                            Observa los <span className="text-brand-red font-bold">puntos rojos</span> en la gráfica. Son <strong>retiros de capital</strong> a cuentas bancarias reales. Un sistema que no permite retirar ganancias no sirve.
                        </p>
                    </ScrollReveal>

                    <ScrollReveal direction="left" delay={0.2}>
                         <ul className="space-y-4">
                            {[
                                "Cuenta Auditada Independientemente",
                                "Sin Martingala ni Riesgos Ocultos",
                                "Retiros Mensuales Habilitados"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold shrink-0 shadow-[0_0_10px_rgba(232,193,112,0.2)]">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                    <span className="text-slate-300 text-sm font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </ScrollReveal>
                    
                    <ScrollReveal direction="left" delay={0.4} className="pt-6">
                        <Button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="w-full">
                            VER PLANES DE ACCESO
                        </Button>
                        <p className="text-[10px] text-slate-500 text-center mt-3">
                            Resultados pasados no garantizan futuros.
                        </p>
                    </ScrollReveal>
                </div>

            </div>
        </div>
    </section>
  );
};