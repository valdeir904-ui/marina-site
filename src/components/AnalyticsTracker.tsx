'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackWhatsappConversion } from '@/lib/tracking';
import {
  checkAndStoreTrafficSource,
  isGoogleAdsVisitor,
  GOOGLE_ADS_MESSAGE,
  GOOGLE_ADS_PRESENCIAL_MESSAGE,
} from '@/lib/whatsapp';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Identificar e salvar origem de tráfego do Google Ads imediatamente
    const isFromAds = checkAndStoreTrafficSource();

    // Ignorar painel admin para analytics
    if (pathname.startsWith('/admin')) return;

    const getMessageForLink = (link: HTMLAnchorElement) => {
      const isPresencial =
        link.dataset.waType === 'presencial' ||
        link.getAttribute('data-wa-type') === 'presencial' ||
        link.getAttribute('data-track') === 'cta-presencial';
      return isPresencial ? GOOGLE_ADS_PRESENCIAL_MESSAGE : GOOGLE_ADS_MESSAGE;
    };

    const updateLinkUrl = (link: HTMLAnchorElement) => {
      try {
        const msg = getMessageForLink(link);
        const match = link.href.match(/wa\.me\/(\d+)/) || link.href.match(/phone=(\d+)/);
        const phone = match ? match[1] : '5516994244626';
        link.href = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
      } catch {
        // Silencioso
      }
    };

    // Se veio do Google Ads, atualiza os links de WhatsApp já presentes no DOM para refletir a mensagem de anúncio
    if (isFromAds || isGoogleAdsVisitor()) {
      try {
        const waLinks = document.querySelectorAll<HTMLAnchorElement>('a[href*="wa.me"], a[href*="whatsapp.com"]');
        waLinks.forEach((link) => {
          updateLinkUrl(link);
        });
      } catch {
        // Silencioso
      }
    }

    const trackEvent = async (type: 'view' | 'time' | 'conversion') => {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, path: pathname }),
        });
      } catch {
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
      
      if (link && (link.href.includes('wa.me') || link.href.includes('whatsapp.com'))) {
        // Garante a mensagem correta do Google Ads no momento do clique, caso o visitante seja proveniente de anúncio
        if (isGoogleAdsVisitor()) {
          updateLinkUrl(link);
        }

        trackEvent('conversion');
        trackWhatsappConversion();
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
