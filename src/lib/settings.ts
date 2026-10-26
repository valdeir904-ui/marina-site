import { query } from './db';

export async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const rows = await query('SELECT * FROM settings');
    const settingsObj: Record<string, string> = {};
    
    if (Array.isArray(rows)) {
      rows.forEach((row: any) => {
        settingsObj[row.key] = row.value;
      });
    }
    
    // Sanitize any physical address or legacy city references
    let address = settingsObj.address || 'Atendimento 100% on-line · Todo o Brasil e exterior';
    if (address.toLowerCase().includes('ribeir') || address.toLowerCase().includes('presencial')) {
      address = 'Atendimento 100% on-line · Todo o Brasil e exterior';
    }

    return {
      whatsapp_number: settingsObj.whatsapp_number || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5516994244626',
      whatsapp_message: settingsObj.whatsapp_message || 'Olá, Marina! Gostaria de saber mais sobre as sessões de terapia e agendar uma consulta.',
      crp: settingsObj.crp || 'CRP 06/162899',
      instagram_url: settingsObj.instagram_url || 'https://www.instagram.com/psimarinafalcao/',
      doctoralia_url: settingsObj.doctoralia_url || 'https://www.doctoralia.com.br',
      google_reviews_url: settingsObj.google_reviews_url || 'https://www.google.com/search?q=Marina+Falc%C3%A3o+Psic%C3%B3loga',
      phone: settingsObj.phone || '(16) 99424-4626',
      ...settingsObj,
      address,
    };
  } catch (error) {
    console.error('Error fetching settings:', error);
    return {
      whatsapp_number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5516994244626',
      whatsapp_message: 'Olá, Marina! Gostaria de saber mais sobre as sessões de terapia e agendar uma consulta.',
      crp: 'CRP 06/162899',
      address: 'Atendimento 100% on-line · Todo o Brasil e exterior',
      instagram_url: 'https://www.instagram.com/psimarinafalcao/',
      doctoralia_url: 'https://www.doctoralia.com.br',
      google_reviews_url: 'https://www.google.com/search?q=Marina+Falc%C3%A3o+Psic%C3%B3loga',
      phone: '(16) 99424-4626'
    };
  }
}
