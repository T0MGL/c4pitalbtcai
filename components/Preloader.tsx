
import React, { useEffect, useState } from 'react';

interface PreloaderProps {
    onFinish?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onFinish }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                const remaining = 100 - prev;
                const jump = Math.random() * (remaining / 5) + 1;
                return Math.min(prev + jump, 100);
            });
        }, 50);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (progress === 100) {
            setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => {
                    if (onFinish) onFinish();
                }, 800);
            }, 500);
        }
    }, [progress, onFinish]);

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand-dark transition-opacity duration-700 ease-out ${progress === 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-gold/5 blur-[100px] rounded-full animate-pulse-slow"></div>
            </div>

            <div className="relative mb-8 transform scale-150">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" className="w-24 h-24 drop-shadow-[0_0_20px_rgba(232,193,112,0.4)]">
                    <defs>
                        <linearGradient id="loader-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#F5E6C8" />
                            <stop offset="40%" stopColor="#E8C170" />
                            <stop offset="100%" stopColor="#B38B3A" />
                        </linearGradient>
                    </defs>

                    <rect
                        x="6" y="6" width="88" height="88" rx="20"
                        stroke="url(#loader-gradient)"
                        strokeWidth="4"
                        fill="#E8C170"
                        fillOpacity="0.03"
                        className="animate-pulse"
                    />

                    <path
                        d="M 66 28 L 44 28 Q 24 28 24 50 Q 24 72 44 72 L 66 72"
                        stroke="url(#loader-gradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        className="animate-[dash_2s_ease-in-out_infinite]"
                        strokeDasharray="200"
                        strokeDashoffset="0"
                    />
                </svg>
            </div>

            <div className="relative flex flex-col items-center gap-2">
                <span className="text-brand-gold font-serif font-medium tracking-[0.2em] text-sm animate-pulse">CAPITAL BTC AI</span>

                <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden mt-4">
                    <div
                        className="h-full bg-gradient-to-r from-brand-goldLight to-brand-gold transition-all duration-300 ease-out box-shadow-[0_0_10px_#E8C170]"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                <span className="text-xs text-slate-500 font-mono mt-2">{Math.round(progress)}%</span>
            </div>

            <style>{`
        @keyframes dash {
          0% { stroke-dashoffset: 200; }
          50% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -200; }
        }
      `}</style>
        </div>
    );
};
