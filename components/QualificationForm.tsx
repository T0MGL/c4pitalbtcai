import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import {
    trackFormOpen,
    trackFormStep,
    trackFormSubmission,
    trackDownsellActivated,
} from '../lib/metaPixel';

const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL || '';

type ViewMode = 'default' | 'exit-warning' | 'downsell';

const COUNTRY_FLAGS: Record<string, string> = {
    '1': '🇺🇸',   // USA / Canada
    '52': '🇲🇽',  // Mexico
    '34': '🇪🇸',  // Spain
    '54': '🇦🇷',  // Argentina
    '57': '🇨🇴',  // Colombia
    '56': '🇨🇱',  // Chile
    '51': '🇵🇪',  // Peru
    '593': '🇪🇨', // Ecuador
    '58': '🇻🇪',  // Venezuela
    '506': '🇨🇷', // Costa Rica
    '507': '🇵🇦', // Panama
    '598': '🇺🇾', // Uruguay
    '503': '🇸🇻', // El Salvador
    '502': '🇬🇹', // Guatemala
    '504': '🇭🇳', // Honduras
    '591': '🇧🇴', // Bolivia
    '595': '🇵🇾', // Paraguay
    '809': '🇩🇴', // Dom Rep
    '829': '🇩🇴',
    '849': '🇩🇴',
};

export const QualificationForm: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const [step, setStep] = useState(1);
    const totalSteps = 6;

    const [viewMode, setViewMode] = useState<ViewMode>('default');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isDownsellActive, setIsDownsellActive] = useState(false);

    const [dynamicHeader, setDynamicHeader] = useState("");
    const [flag, setFlag] = useState("🌐");

    const [formData, setFormData] = useState({
        name: '',
        phone: '+',
        capital: '',
        experience: '',
        mainObstacle: '',
        incomeGoal: '',
        notes: ''
    });

    const hasTrackedOpen = useRef(false);

    useEffect(() => {
        const handleOpen = () => {
            setIsOpen(true);
            if (!hasTrackedOpen.current) {
                trackFormOpen();
                hasTrackedOpen.current = true;
            }
        };
        window.addEventListener('open-qualification-form', handleOpen);
        return () => window.removeEventListener('open-qualification-form', handleOpen);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        } else {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        };
    }, [isOpen]);

    useEffect(() => {
        const rawNumber = formData.phone.replace(/\D/g, '');
        let foundFlag = "🌐";

        if (rawNumber.length > 0) {
            if (rawNumber.length >= 3 && COUNTRY_FLAGS[rawNumber.substring(0, 3)]) {
                foundFlag = COUNTRY_FLAGS[rawNumber.substring(0, 3)];
            } else if (rawNumber.length >= 2 && COUNTRY_FLAGS[rawNumber.substring(0, 2)]) {
                foundFlag = COUNTRY_FLAGS[rawNumber.substring(0, 2)];
            } else if (rawNumber.length >= 1 && COUNTRY_FLAGS[rawNumber.substring(0, 1)]) {
                foundFlag = COUNTRY_FLAGS[rawNumber.substring(0, 1)];
            }
        }
        setFlag(foundFlag);
    }, [formData.phone]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        let value = e.target.value;

        // Special handling for phone input
        if (e.target.name === 'phone') {
            // Extract the country prefix from current formData.phone (e.g., "+57 ")
            const currentPhone = formData.phone;
            const prefixMatch = currentPhone.match(/^\+\d{1,3}\s/);
            const countryPrefix = prefixMatch ? prefixMatch[0] : '+';

            // Prevent deletion of the country prefix
            if (!value.startsWith(countryPrefix)) {
                value = countryPrefix;
            }

            // Extract only the part after the prefix
            const numberPart = value.substring(countryPrefix.length);

            // Remove all non-digit characters from the number part
            const cleanedNumber = numberPart.replace(/\D/g, '');

            // Reconstruct the phone with prefix + cleaned number
            value = countryPrefix + cleanedNumber;
        }

        setFormData({ ...formData, [e.target.name]: value });
    };

    // Step names for tracking
    const stepNames = ['Obstacle', 'Experience', 'Capital', 'Goal', 'Country', 'Contact'];

    const handleAutoAdvance = (field: string, value: string, nextStepHeader: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Track the completed step
        trackFormStep(step, stepNames[step - 1], totalSteps);

        setTimeout(() => {
            setDynamicHeader(nextStepHeader);
            setStep(prev => prev + 1);
        }, 250);
    };

    const activateDownsell = () => {
        setIsDownsellActive(true);
        setViewMode('default');
        setDynamicHeader("Oferta Especial Desbloqueada");
        setStep(1);

        // Track downsell activation
        trackDownsellActivated();
    };

    const WHATSAPP_NUMBER = '573185287540';

    const openWhatsAppWithLeadData = (name: string) => {
        const message = `Mi nombre es ${name}, tengo capital para invertir, quiero mi licencia ya.`;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.phone) {
            return alert('Por favor completa tus datos de contacto.');
        }

        setIsSubmitting(true);

        const finalGoalDescription = `[OBSTÁCULO]: ${formData.mainObstacle} | [META]: ${formData.incomeGoal}${isDownsellActive ? ' | [OFERTA DOWNSELL ACTIVADA]' : ''}`;

        const payload = {
            action: 'create',
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            name: formData.name,
            email: "no-email@provided.com",
            phone: "'" + formData.phone,
            capital: formData.capital,
            experience: formData.experience,
            goal: finalGoalDescription,
            status: 'new'
        };

        if (!GOOGLE_SCRIPT_URL) {
            try {
                const existingLeads = JSON.parse(localStorage.getItem('capital_btc_crm_leads') || '[]');
                localStorage.setItem('capital_btc_crm_leads', JSON.stringify([payload, ...existingLeads]));
            } catch (e) { console.error(e); }

            await new Promise(r => setTimeout(r, 1500));
            setIsSuccess(true);
            setIsSubmitting(false);
            openWhatsAppWithLeadData(formData.name);

            // Track successful form submission (dev mode)
            trackFormSubmission({
                name: formData.name,
                capital: formData.capital,
                experience: formData.experience,
                isDownsell: isDownsellActive,
            });
            return;
        }

        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            await new Promise(r => setTimeout(r, 1500));
            setIsSuccess(true);
            openWhatsAppWithLeadData(formData.name);

            // Track successful form submission (production mode)
            trackFormSubmission({
                name: formData.name,
                capital: formData.capital,
                experience: formData.experience,
                isDownsell: isDownsellActive,
            });
        } catch (error) {
            alert('Error al enviar. Intenta de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseAttempt = () => {
        if (isSuccess) { closeFormFinal(); return; }
        if (isDownsellActive) {
            if (window.confirm("¿Seguro que quieres perder el descuento de $447?")) { closeFormFinal(); }
            return;
        }
        if (viewMode === 'default') { setViewMode('exit-warning'); }
        else if (viewMode === 'downsell') { closeFormFinal(); }
    };

    const closeFormFinal = () => {
        setIsOpen(false);
        setTimeout(() => {
            setStep(1);
            setViewMode('default');
            setIsSuccess(false);
            setIsDownsellActive(false);
            setDynamicHeader("");
            setFlag("🌐");
            setFormData({ name: '', phone: '', capital: '', experience: '', mainObstacle: '', incomeGoal: '', notes: '' });
        }, 500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop with Blur */}
            <div
                className="absolute inset-0 bg-[#050A15]/80 backdrop-blur-lg transition-all duration-500"
                onClick={handleCloseAttempt}
            ></div>

            <div className={`relative w-full max-w-lg transition-all duration-300 transform`}>

                {/* Main Card Container */}
                <div className={`relative bg-gradient-to-b from-[#111827] to-[#05080F] rounded-2xl shadow-[0_0_50px_-10px_rgba(0,0,0,0.7)] border overflow-hidden flex flex-col max-h-[90vh] ${isDownsellActive ? 'border-brand-green/50 shadow-[0_0_40px_rgba(74,222,128,0.15)]' : 'border-white/10'}`}>

                    {/* Top Glow Accent */}
                    <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent ${isDownsellActive ? 'via-brand-green' : 'via-brand-gold'} to-transparent opacity-70`}></div>

                    {/* Header / Nav */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0B101B]/50 backdrop-blur-md sticky top-0 z-20">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isDownsellActive ? 'bg-brand-green animate-pulse' : 'bg-brand-gold'}`}></div>
                            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                                {isDownsellActive ? 'OFERTA ACTIVA' : 'SISTEMA DE ADMISIÓN'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Secure Badge */}
                            <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                <svg className="w-2.5 h-2.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                                <span className="text-[9px] text-slate-400 font-mono">256-BIT SSL</span>
                            </div>
                            <button onClick={handleCloseAttempt} className="text-slate-500 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                    </div>

                    {/* Progress Bar (Glowy) */}
                    {!isSuccess && viewMode === 'default' && (
                        <div className="relative h-1 bg-slate-800/50 w-full">
                            <div
                                className={`absolute top-0 left-0 h-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(232,193,112,0.5)] ${isDownsellActive ? 'bg-brand-green shadow-brand-green/50' : 'bg-brand-gold'}`}
                                style={{ width: `${(step / totalSteps) * 100}%` }}
                            ></div>
                        </div>
                    )}

                    {/* Content Area */}
                    <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar min-h-[420px] flex flex-col justify-center relative">

                        {/* --- VIEW: EXIT WARNING --- */}
                        {viewMode === 'exit-warning' && (
                            <div className="text-center animate-fade-in-up">
                                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-white mb-2">¿Estás seguro?</h3>
                                <p className="text-slate-400 text-sm mb-8 leading-relaxed px-4 max-w-xs mx-auto">
                                    Estás a un paso de acceder a la estrategia privada. <br /> <span className="text-brand-gold">Tu cupo se liberará en 60 segundos.</span>
                                </p>
                                <div className="flex flex-col gap-3">
                                    <Button onClick={() => setViewMode('default')} fullWidth className="py-4 text-sm shadow-[0_0_20px_rgba(232,193,112,0.2)]">
                                        Continuar Aplicación
                                    </Button>
                                    <button onClick={() => setViewMode('downsell')} className="text-slate-500 text-xs font-medium hover:text-white transition-colors py-3 underline decoration-slate-700 underline-offset-4">
                                        No me interesa ganar dinero
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* --- VIEW: DOWNSELL OFFER (THE TICKET) --- */}
                        {viewMode === 'downsell' && (
                            <div className="animate-fade-in-up">
                                <div className="text-center mb-6">
                                    <h3 className="text-3xl font-serif font-bold text-white mb-2">¡ESPERA!</h3>
                                    <p className="text-brand-gold/80 text-sm font-medium">Hemos reservado una licencia "Lite" para ti.</p>
                                </div>

                                {/* The Ticket Visual */}
                                <div className="relative bg-[#0F1522] border-2 border-dashed border-brand-green/30 p-6 rounded-2xl mb-8 mx-2 overflow-hidden group">
                                    {/* Ticket Holes (Visual trick) */}
                                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#111827] rounded-full"></div>
                                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#111827] rounded-full"></div>

                                    {/* Background Glow */}
                                    <div className="absolute inset-0 bg-brand-green/5 group-hover:bg-brand-green/10 transition-colors"></div>

                                    <div className="relative text-center z-10">
                                        <p className="text-brand-green text-[10px] font-bold uppercase tracking-widest mb-2 border border-brand-green/20 inline-block px-2 py-0.5 rounded bg-brand-green/10">Beca Parcial Autorizada</p>
                                        <div className="flex justify-center items-end gap-3 mb-2">
                                            <span className="text-slate-500 line-through text-lg font-mono decoration-red-500 decoration-2">$997</span>
                                            <span className="text-5xl font-bold text-white tracking-tighter drop-shadow-lg">$447</span>
                                        </div>
                                        <p className="text-slate-400 text-xs">Acceso completo. Mismo algoritmo. Precio reducido.</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <Button onClick={activateDownsell} fullWidth pulse className="!bg-gradient-to-r !from-emerald-500 !to-emerald-700 !text-white !border-emerald-400/30 !py-4 text-sm shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                                        ACTIVAR DESCUENTO Y CONTINUAR
                                    </Button>
                                    <button onClick={closeFormFinal} className="text-slate-600 text-xs hover:text-slate-400 transition-colors text-center">
                                        Rechazar oferta y salir definitivamente
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* --- VIEW: SUCCESS --- */}
                        {isSuccess && (
                            <div className="text-center animate-fade-in-up">
                                <div className="relative w-20 h-20 mx-auto mb-6">
                                    <div className="absolute inset-0 bg-brand-green/20 rounded-full animate-ping"></div>
                                    <div className="relative bg-[#0B101B] rounded-full w-full h-full flex items-center justify-center border-2 border-brand-green shadow-[0_0_20px_rgba(74,222,128,0.3)]">
                                        <svg className="w-10 h-10 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-white mb-2">¡Solicitud Recibida!</h3>
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-8">
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        Tu perfil ha sido registrado correctamente. <br />
                                        <span className="text-brand-gold font-bold">Revisa tu WhatsApp</span> en los próximos minutos para la confirmación.
                                    </p>
                                </div>
                                <a
                                    href="https://wa.me/573185287540?text=Tengo%20capital%20para%20iniciar%2C%20necesito%20prioridad%20con%20mi%20licencia."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/15 hover:border-emerald-500/50 transition-all duration-300 mb-3"
                                >
                                    <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                    <span className="text-xs font-medium text-emerald-400 group-hover:text-emerald-300 transition-colors">
                                        Tengo capital para iniciar, necesito prioridad con mi licencia.
                                    </span>
                                </a>
                                <Button onClick={closeFormFinal} fullWidth className="shadow-glow-gold">
                                    Entendido, Cerrar
                                </Button>
                            </div>
                        )}

                        {/* --- VIEW: STEP BY STEP FUNNEL --- */}
                        {viewMode === 'default' && !isSuccess && (
                            <div className="animate-fade-in-up max-w-md mx-auto w-full">

                                {/* Header Contextual */}
                                <div className="mb-6 flex justify-between items-end border-b border-white/5 pb-4">
                                    <div>
                                        <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest block mb-1">Paso {step} de {totalSteps}</span>
                                        <h2 className="text-xl md:text-2xl font-serif font-bold text-white leading-tight">
                                            {step === 5 ? "¿De qué país es tu WhatsApp?" : (dynamicHeader || "¿Qué te impide lograr rentabilidad hoy?")}
                                        </h2>
                                    </div>
                                </div>

                                {/* Step 1: Obstáculo */}
                                {step === 1 && (
                                    <div className="space-y-3">
                                        {[
                                            { txt: 'Falta de Tiempo', feedback: 'Entendido. La automatización es clave.', icon: '⏰' },
                                            { txt: 'Miedo a Perder Dinero', feedback: 'Prioridad #1: Gestión de Riesgo.', icon: '🛡️' },
                                            { txt: 'Falta de Conocimiento', feedback: 'No requieres experiencia previa.', icon: '🧠' },
                                            { txt: 'Quiero Diversificar', feedback: 'Decisión inteligente.', icon: '📈' }
                                        ].map((opt) => (
                                            <button
                                                key={opt.txt}
                                                onClick={() => handleAutoAdvance('mainObstacle', opt.txt, opt.feedback)}
                                                className="group w-full text-left p-4 rounded-xl border border-white/10 bg-[#0F1522] hover:bg-gradient-to-r hover:from-brand-gold/10 hover:to-transparent hover:border-brand-gold/40 transition-all duration-300 relative overflow-hidden"
                                            >
                                                <div className="flex justify-between items-center relative z-10">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xl grayscale group-hover:grayscale-0 transition-all">{opt.icon}</span>
                                                        <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{opt.txt}</span>
                                                    </div>
                                                    <div className="w-5 h-5 rounded-full border border-slate-600 group-hover:border-brand-gold flex items-center justify-center">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-brand-gold opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Step 2: Experiencia */}
                                {step === 2 && (
                                    <>
                                        <p className="text-slate-500 text-xs mb-4 uppercase tracking-wide font-bold">Nivel de Experiencia</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            {[
                                                { txt: 'Principiante', feedback: 'Sistema 100% manos libres.' },
                                                { txt: 'Intermedio', feedback: 'Entenderás la lógica rápido.' },
                                                { txt: 'Avanzado', feedback: 'Apreciarás el Risk Management.' },
                                                { txt: 'Experto', feedback: 'Hablamos el mismo idioma.' }
                                            ].map((opt) => (
                                                <button
                                                    key={opt.txt}
                                                    onClick={() => handleAutoAdvance('experience', opt.txt, opt.feedback)}
                                                    className="group p-5 rounded-xl border border-white/10 bg-[#0F1522] hover:border-brand-gold/50 hover:shadow-[0_0_15px_rgba(232,193,112,0.1)] transition-all duration-300 flex flex-col items-center justify-center gap-2"
                                                >
                                                    <span className="text-sm font-bold text-slate-300 group-hover:text-white">{opt.txt}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {/* Step 3: Capital */}
                                {step === 3 && (
                                    <>
                                        <p className="text-slate-500 text-xs mb-4 uppercase tracking-wide font-bold">Capital Disponible</p>
                                        <div className="space-y-3">
                                            {[
                                                { txt: 'Menos de $1,000 USD', feedback: 'Capital inicial ajustado.' },
                                                { txt: '$1,000 - $5,000 USD', feedback: 'Rango ideal de inicio.' },
                                                { txt: '$5,000 - $10,000 USD', feedback: 'Óptimo para diversificar.' },
                                                { txt: 'Más de $10,000 USD', feedback: 'Acceso Institucional.' }
                                            ].map((opt) => (
                                                <button
                                                    key={opt.txt}
                                                    onClick={() => handleAutoAdvance('capital', opt.txt, opt.feedback)}
                                                    className="group w-full text-left p-4 rounded-xl border border-white/10 bg-[#0F1522] hover:border-brand-gold/40 hover:bg-white/5 transition-all duration-300"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-slate-300 group-hover:text-white font-mono">{opt.txt}</span>
                                                        <div className="w-4 h-4 rounded-full border border-slate-600 group-hover:border-brand-gold group-hover:bg-brand-gold transition-colors"></div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {/* Step 4: Meta */}
                                {step === 4 && (
                                    <>
                                        <p className="text-slate-500 text-xs mb-4 uppercase tracking-wide font-bold">Objetivo Principal</p>
                                        <div className="space-y-3">
                                            {[
                                                { txt: 'Generar $500 - $1,000 USD extra', feedback: 'Objetivo alcanzable.', icon: '💵' },
                                                { txt: 'Vivir del Trading ($2k - $5k)', feedback: 'Ambicioso pero posible.', icon: '🚀' },
                                                { txt: 'Construir Patrimonio a Largo Plazo', feedback: 'Mentalidad correcta.', icon: '🏛️' }
                                            ].map((opt) => (
                                                <button
                                                    key={opt.txt}
                                                    onClick={() => handleAutoAdvance('incomeGoal', opt.txt, opt.feedback)}
                                                    className="group w-full text-left p-4 rounded-xl border border-white/10 bg-[#0F1522] hover:bg-brand-gold/5 hover:border-brand-gold/40 transition-all duration-300"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-lg">{opt.icon}</span>
                                                        <span className="text-sm text-slate-300 group-hover:text-white">{opt.txt}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {step === 5 && (
                                    <div className="grid grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                        {[
                                            { code: '57', name: 'Colombia', flag: '🇨🇴' },
                                            { code: '52', name: 'México', flag: '🇲🇽' },
                                            { code: '34', name: 'España', flag: '🇪🇸' },
                                            { code: '54', name: 'Argentina', flag: '🇦🇷' },
                                            { code: '56', name: 'Chile', flag: '🇨🇱' },
                                            { code: '51', name: 'Perú', flag: '🇵🇪' },
                                            { code: '593', name: 'Ecuador', flag: '🇪🇨' },
                                            { code: '58', name: 'Venezuela', flag: '🇻🇪' },
                                            { code: '506', name: 'Costa Rica', flag: '🇨🇷' },
                                            { code: '507', name: 'Panamá', flag: '🇵🇦' },
                                            { code: '598', name: 'Uruguay', flag: '🇺🇾' },
                                            { code: '503', name: 'El Salvador', flag: '🇸🇻' },
                                            { code: '502', name: 'Guatemala', flag: '🇬🇹' },
                                            { code: '504', name: 'Honduras', flag: '🇭🇳' },
                                            { code: '591', name: 'Bolivia', flag: '🇧🇴' },
                                            { code: '595', name: 'Paraguay', flag: '🇵🇾' },
                                            { code: '1', name: 'USA', flag: '🇺🇸' },
                                            { code: '1', name: 'P. Rico', flag: '🇵🇷' },
                                            { code: '1', name: 'R. Dom', flag: '🇩🇴' },
                                        ].map((c) => (
                                            <button
                                                key={`${c.name}-${c.code}`}
                                                onClick={() => handleAutoAdvance('phone', `+${c.code} `, "Finaliza tu solicitud")}
                                                className="group flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-[#0F1522] hover:border-brand-gold/50 transition-all duration-300"
                                            >
                                                <span className="text-xl">{c.flag}</span>
                                                <div className="text-left">
                                                    <p className="text-xs font-bold text-white group-hover:text-brand-gold transition-colors">{c.name}</p>
                                                    <p className="text-[10px] text-slate-500 font-mono">+{c.code}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Step 6: Contacto (Cierre) */}
                                {step === 6 && (
                                    <div className="space-y-6 animate-fade-in-up">
                                        <div className="bg-brand-gold/5 border border-brand-gold/10 p-4 rounded-xl text-center">
                                            <p className="text-brand-gold font-bold text-sm mb-1">¡Perfil Compatible!</p>
                                            <p className="text-xs text-slate-400">Las últimas plazas se están asignando ahora.</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-1">
                                                <label className="text-xs text-slate-500 font-bold ml-1 uppercase">Tu Nombre</label>
                                                <input
                                                    type="text" name="name"
                                                    value={formData.name} onChange={handleChange}
                                                    className="w-full bg-[#080A10] border border-white/10 rounded-xl px-4 py-4 text-white text-sm focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/50 outline-none transition-all placeholder:text-slate-600"
                                                    placeholder="Ej. Carlos Rodríguez"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs text-slate-500 font-bold ml-1 uppercase">Tu número de WhatsApp</label>
                                                <p className="text-[10px] text-slate-400 ml-1 mb-2">Colocar tu número sin prefijo de país (el prefijo ya está incluido)</p>
                                                <div className="relative group">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                                                        <span className="text-xl">{flag}</span>
                                                        <div className="w-px h-5 bg-white/10"></div>
                                                    </div>
                                                    <input
                                                        type="tel" name="phone"
                                                        value={formData.phone} onChange={handleChange}
                                                        className="w-full bg-[#080A10] border border-white/10 rounded-xl pl-16 pr-4 py-4 text-white text-sm focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/50 outline-none transition-all font-mono placeholder:text-slate-600"
                                                        placeholder="3001234567"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <Button
                                                onClick={handleSubmit}
                                                disabled={isSubmitting}
                                                fullWidth
                                                pulse={!isSubmitting}
                                                className={`shadow-lg py-4 ${isDownsellActive ? "!bg-gradient-to-r !from-emerald-500 !to-emerald-700 !border-none shadow-brand-green/20" : "shadow-brand-gold/20"}`}
                                            >
                                                {isSubmitting ? "Procesando..." : (isDownsellActive ? "RECLAMAR ACCESO ($447)" : "FINALIZAR SOLICITUD")}
                                            </Button>

                                            <p className="text-[10px] text-center text-slate-600 mt-4">
                                                Al enviar aceptas ser contactado vía WhatsApp para la entrega de accesos.
                                            </p>
                                        </div>
                                    </div>
                                )}

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};