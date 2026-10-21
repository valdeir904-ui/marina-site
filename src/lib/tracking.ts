export const GOOGLE_ADS_ID = 'AW-18011596440';
export const GOOGLE_ADS_WHATSAPP_LABEL = 'ftQgCPa48KQdEJjNzIxD';

export type GtagCommand = 'config' | 'event' | 'js' | 'set' | 'consent';

export interface GtagEventParams {
  send_to?: string;
  [key: string]: unknown;
}

export type GtagArgs =
  | [command: 'config', targetId: string, config?: Record<string, unknown>]
  | [command: 'event', action: string, params?: GtagEventParams]
  | [command: 'js', date: Date]
  | [command: 'set', params: Record<string, unknown>]
  | [command: 'consent', action: string, params?: Record<string, unknown>];

declare global {
  interface Window {
    gtag?: (...args: GtagArgs) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Dispara evento de conversão do Google Ads ao clicar no link do WhatsApp
 */
export function trackWhatsappConversion(): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'conversion', {
      send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_WHATSAPP_LABEL}`,
    });
  }
}
