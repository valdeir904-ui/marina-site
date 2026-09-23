"use client";

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function HeroWave() {
  const { scrollY } = useScroll();
  
  // A onda desliza para a direita e perde opacidade conforme o scroll desce
  const x = useTransform(scrollY, [0, 800], ['0%', '30%']);
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);

  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ x, opacity }}
    >
      <svg 
        className="absolute top-0 right-0 w-[200%] sm:w-[150%] lg:w-[120%] h-full text-brand-200/20 transform origin-top-right" 
        preserveAspectRatio="none"
        viewBox="0 0 1440 900" 
        fill="currentColor" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M1440 0V900C1100 800 900 600 500 700C300 750 100 650 0 500V0H1440Z" />
      </svg>
      
      {/* Segunda onda mais sutil atrás para dar profundidade */}
      <svg 
        className="absolute top-0 right-0 w-[200%] sm:w-[150%] lg:w-[120%] h-full text-brand-200/10 transform origin-top-right -translate-y-10" 
        preserveAspectRatio="none"
        viewBox="0 0 1440 900" 
        fill="currentColor" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M1440 0V900C1200 850 800 550 400 650C200 700 50 600 0 450V0H1440Z" />
      </svg>
    </motion.div>
  );
}
