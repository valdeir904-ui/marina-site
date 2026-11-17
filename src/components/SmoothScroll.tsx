"use client";

import React, { useEffect, useState } from 'react';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [LenisComp, setLenisComp] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    // No mobile, o scroll nativo do iOS e Android é muito mais performático
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      import('@studio-freight/react-lenis').then((mod) => {
        setLenisComp(() => mod.ReactLenis);
      });
    }
  }, []);

  if (!LenisComp) {
    return <>{children}</>;
  }

  const Comp = LenisComp;
  return (
    <Comp root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      {/* @ts-ignore - mismatch version of types/react */}
      {children}
    </Comp>
  );
}
