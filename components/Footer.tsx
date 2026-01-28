import React from 'react';
import { LogoV2 } from './LogoV2';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
             {/* Brand Logo */}
             <div className="opacity-80 hover:opacity-100 transition-opacity">
                <LogoV2 className="w-8 h-8" />
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                <span className="text-slate-500 text-sm font-mono">
                    &copy; {new Date().getFullYear()} Capital BTC AI. Todos los derechos reservados.
                </span>
                <a href="/crm" className="text-[10px] text-slate-700 hover:text-brand-gold transition-colors uppercase tracking-widest font-bold">
                    Acceso Socios
                </a>
            </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 text-[10px] text-slate-600 space-y-4 text-justify font-mono leading-relaxed opacity-70">
            <p>
                <strong>Advertencia de Riesgo:</strong> El trading de divisas, criptomonedas y CFDs conlleva un alto nivel de riesgo y puede no ser adecuado para todos los inversores. El alto grado de apalancamiento puede trabajar tanto en tu contra como a tu favor. Antes de decidir operar, debes considerar cuidadosamente tus objetivos de inversión, nivel de experiencia y apetito de riesgo.
            </p>
            <p>
                <strong>Divulgación de Rendimiento Hipotético:</strong> LOS RESULTADOS DE RENDIMIENTO HIPOTÉTICO TIENEN MUCHAS LIMITACIONES INHERENTES. NO SE HACE NINGUNA REPRESENTACIÓN DE QUE NINGUNA CUENTA ALCANZARÁ O ES PROBABLE QUE ALCANCE GANANCIAS O PÉRDIDAS SIMILARES A LAS MOSTRADAS. DE HECHO, CON FRECUENCIA HAY DIFERENCIAS AGUDAS ENTRE LOS RESULTADOS DE RENDIMIENTO HIPOTÉTICO Y LOS RESULTADOS REALES LOGRADOS POSTERIORMENTE POR CUALQUIER PROGRAMA DE TRADING EN PARTICULAR.
            </p>
            <p>
                 Este sitio no es parte del sitio web de Facebook o Facebook Inc. Además, este sitio NO está respaldado por Facebook de ninguna manera. FACEBOOK es una marca comercial de FACEBOOK, Inc.
            </p>
        </div>
      </div>
    </footer>
  );
};