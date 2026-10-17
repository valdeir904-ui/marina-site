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
  
  // Limpa caracteres inválidos ou corrompidos (como \uFFFD) que possam quebrar a URL do WhatsApp
  let cleanMsg = (message || '').replace(/\uFFFD/g, '').trim();
  
  if (!cleanMsg) {
    cleanMsg = 'Olá, Marina! Gostaria de saber mais sobre as sessões de terapia e agendar uma consulta.';
  }

  const text = encodeURIComponent(cleanMsg);
  return `https://wa.me/${cleanNumber}?text=${text}`;
}
