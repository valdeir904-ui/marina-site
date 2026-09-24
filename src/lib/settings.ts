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
    
    // Fallbacks if not set
    return {
      whatsapp_number: settingsObj.whatsapp_number || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5516994244626',
      whatsapp_message: settingsObj.whatsapp_message || 'Oi Marina! 🖐 Gostaria de agendar uma consulta de terapia!',
      crp: settingsObj.crp || 'CRP 06/162899',
      address: settingsObj.address || 'Atendimento on-line para todo o Brasil',
      instagram_url: settingsObj.instagram_url || 'https://www.instagram.com/psimarinafalcao/',
      doctoralia_url: settingsObj.doctoralia_url || 'https://www.doctoralia.com.br',
      google_reviews_url: settingsObj.google_reviews_url || '',
      ...settingsObj
    };
  } catch (error) {
    console.error('Error fetching settings:', error);
    return {
      whatsapp_number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5516994244626',
      whatsapp_message: 'Oi Marina! 🖐 Gostaria de agendar uma consulta de terapia!',
      crp: 'CRP 06/162899',
      address: 'Atendimento on-line para todo o Brasil',
      instagram_url: 'https://www.instagram.com/psimarinafalcao/',
      doctoralia_url: 'https://www.doctoralia.com.br',
      google_reviews_url: ''
    };
  }
}
