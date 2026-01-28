import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar';
import { HeroVSL } from './components/HeroVSL';
import { initMetaPixel, trackPageView, trackViewContent } from './lib/metaPixel';

// --- COMPONENTES CRÍTICOS (Carga inmediata) ---
// Navbar y HeroVSL se importan arriba de forma estándar para asegurar 
// que el "Above the Fold" sea instantáneo (LCP optimizado).

// --- COMPONENTES SECUNDARIOS (Code Splitting) ---
// Usamos lazy para dividir el bundle, PERO los pre-cargaremos automáticamente
// para que el usuario no vea "cargando" al bajar.
const Performance = lazy(() => import('./components/Performance').then(module => ({ default: module.Performance })));
const WealthSimulator = lazy(() => import('./components/WealthSimulator').then(module => ({ default: module.WealthSimulator })));
const Features = lazy(() => import('./components/Features').then(module => ({ default: module.Features })));
const Comparison = lazy(() => import('./components/Comparison').then(module => ({ default: module.Comparison })));
const Testimonials = lazy(() => import('./components/Testimonials').then(module => ({ default: module.Testimonials })));
const Pricing = lazy(() => import('./components/Pricing').then(module => ({ default: module.Pricing })));
const Faq = lazy(() => import('./components/Faq').then(module => ({ default: module.Faq })));
const Footer = lazy(() => import('./components/Footer').then(module => ({ default: module.Footer })));
const StickyCTA = lazy(() => import('./components/StickyCTA').then(module => ({ default: module.StickyCTA })));
const QualificationForm = lazy(() => import('./components/QualificationForm').then(module => ({ default: module.QualificationForm })));
const CRM = lazy(() => import('./components/CRM').then(module => ({ default: module.CRM })));

import { Preloader } from './components/Preloader';

function App() {
  const [view, setView] = useState('home');
  const [showPreloader, setShowPreloader] = useState(true);
  const [crmAuthenticated, setCrmAuthenticated] = useState(() => {
    return sessionStorage.getItem('crm_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const handleCrmLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === process.env.CRM_PASSWORD) {
      sessionStorage.setItem('crm_auth', 'true');
      setCrmAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  useEffect(() => {
    // 1. ROUTING SIMPLE (path-based)
    const handleRouteChange = () => {
      const path = window.location.pathname;
      if (path === '/crm') setView('crm');
      else setView('home');
    };
    handleRouteChange();
    window.addEventListener('popstate', handleRouteChange);

    // 2. PRECARGA INTELIGENTE (Eager Preloading)
    // Esto descarga los siguientes bloques en segundo plano INMEDIATAMENTE después
    // de que el sitio carga, sin esperar al scroll del usuario.
    const preloadApp = async () => {
      // Prioridad 1: Lo que está justo debajo del Hero (Bloque Lógico)
      // Pequeño delay para dejar que el navegador pinte el Hero primero
      await new Promise(r => setTimeout(r, 100));
      import('./components/Performance');

      // Prioridad 2: Gráficas pesadas, Pricing y Calculadora (Bloque Interactivo)
      await new Promise(r => setTimeout(r, 300));
      import('./components/WealthSimulator');
      import('./components/Pricing');

      // Prioridad 3: Resto de la página (Bloque Social/Venta)
      await new Promise(r => setTimeout(r, 500));
      import('./components/Features');
      import('./components/Comparison');
      import('./components/Testimonials');

      // Prioridad 4: Footer y Modales
      await new Promise(r => setTimeout(r, 1000));
      import('./components/Faq');
      import('./components/Footer');
      import('./components/StickyCTA');
      import('./components/QualificationForm');
    };

    // Ejecutar precarga solo si no estamos en la vista de CRM
    if (window.location.pathname !== '/crm') {
      preloadApp();
    }

    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  // META PIXEL INITIALIZATION
  // Initialize once on mount and track PageView + ViewContent
  useEffect(() => {
    // Initialize the pixel (safe to call multiple times - it checks internally)
    initMetaPixel();

    // Track PageView (only fires once per session due to internal deduplication)
    trackPageView();

    // Track ViewContent for the main landing page
    if (window.location.pathname !== '/crm') {
      trackViewContent({
        content_name: 'Capital BTC AI - Landing Page',
        content_category: 'Trading Bot License',
        value: 997,
        currency: 'USD',
      });
    }
  }, []);

  if (view === 'crm') {
    if (!crmAuthenticated) {
      return (
        <div className="min-h-screen bg-brand-dark flex items-center justify-center">
          <form onSubmit={handleCrmLogin} className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 w-full max-w-sm">
            <h2 className="text-xl font-bold text-white mb-6 text-center">Acceso CRM</h2>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Contraseña"
              className={`w-full px-4 py-3 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold transition-colors ${passwordError ? 'border-red-500' : 'border-slate-700'}`}
              autoFocus
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-2">Contraseña incorrecta</p>
            )}
            <button
              type="submit"
              className="w-full mt-4 py-3 bg-brand-gold text-brand-dark font-bold rounded-lg hover:bg-brand-gold/90 transition-colors"
            >
              Entrar
            </button>
          </form>
        </div>
      );
    }
    return (
      <Suspense fallback={<div className="min-h-screen bg-brand-dark flex items-center justify-center text-brand-gold animate-pulse">Cargando Sistema...</div>}>
        <CRM />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark overflow-x-hidden">
      {/* 
         ESTRATEGIA ANTI-LAYOUT SHIFT:
         Cada Suspense tiene un contenedor con una altura mínima aproximada (min-h).
         Esto reserva el espacio en la barra de scroll antes de que llegue el contenido,
         evitando saltos bruscos.
      */}

      {/* PRELOADER */}
      {showPreloader && (
        <Preloader onFinish={() => setShowPreloader(false)} />
      )}

      {/* BLOQUE 1: INMEDIATO */}
      <Navbar />
      <HeroVSL />

      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent"></div>

        {/* BLOQUE 2: RESULTADOS Y TESIS */}
        <Suspense fallback={<div className="w-full min-h-[600px] bg-brand-dark" />}>
          <Performance />
        </Suspense>
      </div>

      {/* BLOQUE 3: INTERACTIVO (GRAFICAS) */}
      <Suspense fallback={<div className="w-full min-h-[600px] bg-brand-dark" />}>
        <WealthSimulator />
      </Suspense>

      <Suspense fallback={<div className="w-full min-h-[600px] bg-brand-dark" />}>
        <Pricing />
      </Suspense>

      <Suspense fallback={<div className="w-full min-h-[500px] bg-brand-dark" />}>
        <Features />
      </Suspense>

      {/* BLOQUE 4: CIERRE Y PRUEBA SOCIAL */}
      <Suspense fallback={<div className="w-full min-h-[500px] bg-brand-dark" />}>
        <Comparison />
      </Suspense>

      <Suspense fallback={<div className="w-full min-h-[400px] bg-brand-dark" />}>
        <Testimonials />
      </Suspense>

      <Suspense fallback={<div className="w-full min-h-[400px] bg-brand-dark" />}>
        <Faq />
      </Suspense>

      <Suspense fallback={<div className="w-full min-h-[200px] bg-slate-950" />}>
        <Footer />
      </Suspense>

      {/* ELEMENTOS FLOTANTES */}
      <Suspense fallback={null}>
        <StickyCTA />
      </Suspense>

      <Suspense fallback={null}>
        <QualificationForm />
      </Suspense>
    </div>
  );
}

export default App;