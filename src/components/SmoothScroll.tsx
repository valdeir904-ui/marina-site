"use client";

import React, { useEffect, useState } from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // No mobile, o scroll nativo do iOS e Android é muito mais performático
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setIsDesktop(true);
    }
  }, []);

  if (!isDesktop) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      {/* @ts-ignore - mismatch version of types/react */}
      {children}
    </ReactLenis>
  );
}
