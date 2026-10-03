'use client';
import { useState, useEffect } from 'react';

const words = ['saúde mental.', 'paz interior.', 'qualidade de vida.'];

export default function TypewriterEffect() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // start fade out
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setFade(true); // fade in new word
      }, 500); // Wait half a second for fade out
    }, 3500); // Change every 3.5s
    
    return () => clearInterval(interval);
  }, []);

  return (
    <span 
      className={`text-brand-700 italic inline-block min-h-[1.2em] transition-opacity duration-500 ease-in-out ${fade ? 'opacity-100' : 'opacity-0'}`}
    >
      {words[index]}
    </span>
  );
}
