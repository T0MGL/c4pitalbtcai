import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar';
import { HeroVSL } from './components/HeroVSL';

// --- COMPONENTES CRÍTICOS (Carga inmediata) ---
// Navbar y HeroVSL se importan arriba de forma estándar para asegurar 
// que el "Above the Fold" sea instantáneo (LCP optimizado).

// --- COMPONENTES SECUNDARIOS (Code Splitting) ---
// Usamos lazy para dividir el bundle, PERO los pre-cargaremos automáticamente
// para que el usuario no vea "cargando" al bajar.
const Performance = lazy(() => import('./components/Performance').then(module => ({ default: module.Performance })));
const SystemSpecs = lazy(() => import('./components/SystemSpecs').then(module => ({ default: module.SystemSpecs })));
const WealthSimulator = lazy(() => import('./components/WealthSimulator').then(module => ({ default: module.WealthSimulator })));
const Features = lazy(() => import('./components/Features').then(module => ({ default: module.Features })));
const VerifiedResults = lazy(() => import('./components/VerifiedResults').then(module => ({ default: module.VerifiedResults })));
const Comparison = lazy(() => import('./components/Comparison').then(module => ({ default: module.Comparison })));
const Testimonials = lazy(() => import('./components/Testimonials').then(module => ({ default: module.Testimonials })));
const Pricing = lazy(() => import('./components/Pricing').then(module => ({ default: module.Pricing })));
const Faq = lazy(() => import('./components/Faq').then(module => ({ default: module.Faq })));
const Footer = lazy(() => import('./components/Footer').then(module => ({ default: module.Footer })));
const StickyCTA = lazy(() => import('./components/StickyCTA').then(module => ({ default: module.StickyCTA })));
const QualificationForm = lazy(() => import('./components/QualificationForm').then(module => ({ default: module.QualificationForm })));
const CRM = lazy(() => import('./components/CRM').then(module => ({ default: module.CRM })));

function App() {
  const [view, setView] = useState('home');

  useEffect(() => {
    // 1. ROUTING SIMPE
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#crm') setView('crm');
      else setView('home');
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    // 2. PRECARGA INTELIGENTE (Eager Preloading)
    // Esto descarga los siguientes bloques en segundo plano INMEDIATAMENTE después
    // de que el sitio carga, sin esperar al scroll del usuario.
    const preloadApp = async () => {
        // Prioridad 1: Lo que está justo debajo del Hero (Bloque Lógico)
        // Pequeño delay para dejar que el navegador pinte el Hero primero
        await new Promise(r => setTimeout(r, 100)); 
        import('./components/Performance');
        import('./components/SystemSpecs');

        // Prioridad 2: Gráficas pesadas y Calculadora (Bloque Interactivo)
        await new Promise(r => setTimeout(r, 300));
        import('./components/WealthSimulator'); 
        import('./components/VerifiedResults'); // Recharts es pesado, lo cargamos aquí

        // Prioridad 3: Resto de la página (Bloque Social/Venta)
        await new Promise(r => setTimeout(r, 500));
        import('./components/Features');
        import('./components/Comparison');
        import('./components/Testimonials');
        import('./components/Pricing');
        
        // Prioridad 4: Footer y Modales
        await new Promise(r => setTimeout(r, 1000));
        import('./components/Faq');
        import('./components/Footer');
        import('./components/StickyCTA');
        import('./components/QualificationForm');
    };

    // Ejecutar precarga solo si no estamos en la vista de CRM
    if (window.location.hash !== '#crm') {
        preloadApp();
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (view === 'crm') {
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

      <Suspense fallback={<div className="w-full min-h-[400px] bg-brand-dark" />}>
        <SystemSpecs />
      </Suspense>

      {/* BLOQUE 3: INTERACTIVO (GRAFICAS) */}
      <Suspense fallback={<div className="w-full min-h-[600px] bg-brand-dark" />}>
        <WealthSimulator />
      </Suspense>

      <Suspense fallback={<div className="w-full min-h-[500px] bg-brand-dark" />}>
        <Features />
      </Suspense>

      <Suspense fallback={<div className="w-full min-h-[600px] bg-brand-dark" />}>
        <VerifiedResults />
      </Suspense>

      {/* BLOQUE 4: CIERRE Y PRUEBA SOCIAL */}
      <Suspense fallback={<div className="w-full min-h-[500px] bg-brand-dark" />}>
        <Comparison />
      </Suspense>

      <Suspense fallback={<div className="w-full min-h-[400px] bg-brand-dark" />}>
        <Testimonials />
      </Suspense>

      <Suspense fallback={<div className="w-full min-h-[600px] bg-brand-dark" />}>
        <Pricing />
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