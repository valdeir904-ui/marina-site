'use client';
import { useState, useEffect } from 'react';

const words = ['saúde mental.', 'paz interior.', 'qualidade de vida.'];

export default function TypewriterEffect() {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    const typingSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && text === currentWord) {
      // Pause at the end of the word
      setTimeout(() => setIsDeleting(true), 2500);
      return;
    }

    if (isDeleting && text === '') {
      // Move to the next word
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setText(currentWord.substring(0, text.length + (isDeleting ? -1 : 1)));
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex]);

  // Renderiza a primeira palavra cheia inicialmente (SSR) para não bugar o LCP
  const displayText = text === '' && wordIndex === 0 && !isDeleting ? words[0] : text;

  return (
    <span className="text-brand-700 italic inline-block min-h-[1.2em] relative">
      {displayText}
      <span className="animate-pulse border-r-2 border-brand-700 ml-[2px]">&nbsp;</span>
    </span>
  );
}
