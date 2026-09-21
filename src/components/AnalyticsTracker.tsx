'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Ignorar painel admin
    if (pathname.startsWith('/admin')) return;

    const trackEvent = async (type: 'view' | 'time' | 'conversion') => {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, path: pathname }),
        });
      } catch (e) {
        // Silent fail for analytics
      }
    };

    // 1. Registrar view ao mudar de rota
    trackEvent('view');

    // 2. Registrar tempo (ping a cada 15 segundos)
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        trackEvent('time');
      }
    }, 15000);

    // 3. Registrar conversões (cliques em links do WhatsApp)
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href.includes('api.whatsapp.com')) {
        trackEvent('conversion');
      }
    };

    document.addEventListener('click', handleGlobalClick);

    return () => {
      clearInterval(interval);
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [pathname]);

  return null;
}
