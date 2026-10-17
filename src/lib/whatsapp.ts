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
  const text = message ? encodeURIComponent(message) : '';
  return `https://wa.me/${cleanNumber}${text ? `?text=${text}` : ''}`;
}
