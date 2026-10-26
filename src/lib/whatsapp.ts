export const GOOGLE_ADS_STORAGE_KEY = 'marina_traffic_source_google_ads';
export const GOOGLE_ADS_MESSAGE = 'Olá, Marina! Vi seu anúncio no Google e gostaria de agendar uma sessão.';
export const DEFAULT_WHATSAPP_MESSAGE = 'Olá, Marina! Gostaria de saber mais sobre as sessões de terapia e agendar uma consulta.';

export function checkAndStoreTrafficSource(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    const hasGclid = params.has('gclid');
    const isGoogleCpc = params.get('utm_source') === 'google' && params.get('utm_medium') === 'cpc';

    if (hasGclid || isGoogleCpc) {
      sessionStorage.setItem(GOOGLE_ADS_STORAGE_KEY, '1');
      return true;
    }

    return sessionStorage.getItem(GOOGLE_ADS_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function isGoogleAdsVisitor(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (sessionStorage.getItem(GOOGLE_ADS_STORAGE_KEY) === '1') {
      return true;
    }
    return checkAndStoreTrafficSource();
  } catch {
    return false;
  }
}

export function formatWhatsappNumber(phone?: string): string {
  const digits = (phone || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5516994244626').replace(/\D/g, '');
  if (!digits) return '5516994244626';
  // Se o número tiver 10 ou 11 dígitos (DDD + número) sem o DDI 55
  if (digits.length <= 11 && !digits.startsWith('55')) {
    return `55${digits}`;
  }
  return digits;
}

export function getWhatsappUrl(phone?: string, message?: string): string {
  const cleanNumber = formatWhatsappNumber(phone);
  
  // Limpa caracteres inválidos ou corrompidos que possam quebrar a URL do WhatsApp
  let cleanMsg = (message || '').replace(/\uFFFD/g, '').trim();
  
  if (isGoogleAdsVisitor()) {
    cleanMsg = GOOGLE_ADS_MESSAGE;
  } else if (!cleanMsg) {
    cleanMsg = DEFAULT_WHATSAPP_MESSAGE;
  }

  const text = encodeURIComponent(cleanMsg);
  return `https://wa.me/${cleanNumber}?text=${text}`;
}
