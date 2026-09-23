'use client';

import { TypeAnimation } from 'react-type-animation';

export default function TypewriterEffect() {
  return (
    <TypeAnimation
      sequence={[
        'saúde mental.',
        3000, // wait 3s
        'paz interior.',
        3000,
        'qualidade de vida.',
        3000,
      ]}
      wrapper="span"
      speed={50}
      className="text-brand-700 italic relative inline-block min-w-[280px]"
      repeat={Infinity}
    />
  );
}
