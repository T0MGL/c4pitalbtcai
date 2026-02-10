import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: string; // e.g. "30px"
  delay?: number; // seconds
  duration?: number; // seconds
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({ 
  children, 
  className = "", 
  direction = "up",
  distance = "40px",
  delay = 0,
  duration = 1.0
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  const getTransformStyles = () => {
    if (isVisible) return {
        opacity: 1,
        transform: 'translate3d(0, 0, 0) scale(1)',
        filter: 'blur(0px)'
    };

    switch (direction) {
      case 'up': return { opacity: 0, transform: `translate3d(0, ${distance}, 0) scale(0.96)`, filter: 'blur(8px)' };
      case 'down': return { opacity: 0, transform: `translate3d(0, -${distance}, 0) scale(0.96)`, filter: 'blur(8px)' };
      case 'left': return { opacity: 0, transform: `translate3d(${distance}, 0, 0) scale(0.96)`, filter: 'blur(8px)' };
      case 'right': return { opacity: 0, transform: `translate3d(-${distance}, 0, 0) scale(0.96)`, filter: 'blur(8px)' };
      case 'none': return { opacity: 0, transform: 'scale(0.96)', filter: 'blur(8px)' };
      default: return { opacity: 0, transform: `translate3d(0, ${distance}, 0) scale(0.96)`, filter: 'blur(8px)' };
    }
  };

  return (
    <div
      ref={ref}
      className={`${className} will-change-transform`}
      style={{
        ...getTransformStyles(),
        transitionProperty: 'opacity, transform, filter',
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay}s`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {children}
    </div>
  );
};