import React, { useState } from 'react';
import { FaqItem } from '../types';
import { ScrollReveal } from './ScrollReveal';

const faqData: FaqItem[] = [
  {
    question: "¿Necesito experiencia en trading para usar esto?",
    answer: "No. Capital BTC AI es un sistema totalmente automatizado. Nuestro equipo se encarga de la instalación y el algoritmo maneja la ejecución. Tú mantienes el control sobre la configuración de riesgo y los retiros."
  },
  {
    question: "¿Está seguro mi capital?",
    answer: "Tus fondos siempre permanecen en tu propia cuenta de corretaje. Nosotros nunca tenemos acceso para retirar tus fondos. El sistema utiliza un stop loss estricto del 1.5% por operación para proteger contra la volatilidad."
  },
  {
    question: "¿Qué broker necesito?",
    answer: "El sistema es compatible con cualquier broker que soporte MT4/MT5 y ofrezca pares de criptomonedas. Recomendamos brokers ECN regulados para los mejores spreads y velocidad de ejecución."
  },
  {
    question: "¿Puedo usar esto en una cuenta pequeña?",
    answer: "Recomendamos un mínimo de $1,000 USD para asegurar un dimensionamiento adecuado de la gestión de riesgo. El sistema escala automáticamente para cuentas más grandes."
  }
];

export const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-brand-dark">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
            <h2 className="text-3xl font-serif font-bold text-white text-center mb-12">Preguntas Frecuentes</h2>
        </ScrollReveal>
        
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <div className="border border-white/10 rounded-lg bg-brand-card overflow-hidden">
                <button 
                    className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                    <span className="font-medium text-slate-200 pr-4">{item.question}</span>
                    <svg className={`w-5 h-5 text-brand-gold transform transition-transform ${openIndex === index ? 'rotate-180' : ''} flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
                
                <div className={`px-6 text-slate-400 text-sm leading-relaxed overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-40 py-4 border-t border-white/5' : 'max-h-0'}`}>
                    {item.answer}
                </div>
                </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};