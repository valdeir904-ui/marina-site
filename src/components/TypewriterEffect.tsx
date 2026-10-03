'use client';
import { useState, useEffect } from 'react';

import { TypeAnimation } from 'react-type-animation';

export default function TypewriterEffect() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Renderiza o primeiro texto no servidor para evitar bloqueio de LCP e salto de layout
    return <span className="text-brand-700 italic inline-block min-h-[1.2em]">saúde mental.</span>;
  }

  return (
    <TypeAnimation
      sequence={[
        'saúde mental.',
        3000,
        'paz interior.',
        3000,
        'qualidade de vida.',
        3000,
      ]}
      wrapper="span"
      speed={50}
      className="text-brand-700 italic inline-block min-h-[1.2em]"
      repeat={Infinity}
    />
  );
}
