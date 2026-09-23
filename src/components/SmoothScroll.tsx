"use client";

import React from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.04, duration: 1.5, smoothWheel: true, wheelMultiplier: 0.8 }}>
      {/* @ts-ignore - mismatch version of types/react */}
      {children}
    </ReactLenis>
  );
}
