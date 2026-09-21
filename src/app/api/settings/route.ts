import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

// GET /api/settings - Público ou Privado, retorna todas as configs em formato de objeto
export async function GET() {
  try {
    const rows = await query('SELECT * FROM settings');
    
    // Converte [{key: 'whatsapp', value: '123'}] para {whatsapp: '123'}
    const settingsObj: Record<string, string> = {};
    if (Array.isArray(rows)) {
      rows.forEach((row: any) => {
        settingsObj[row.key] = row.value;
      });
    }

    return NextResponse.json({ settings: settingsObj });
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return NextResponse.json({ error: 'Erro ao buscar configurações' }, { status: 500 });
  }
}

// PUT /api/settings - Protegido, atualiza configurações
export async function PUT(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();

    // body deve ser um objeto { key1: value1, key2: value2 }
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === 'string') {
        // Usa INSERT ... ON DUPLICATE KEY UPDATE para MySQL, mas como estamos lidando
        // com SQLite tbm, vamos tentar UPDATE, se falhar INSERT. Ou REPLACE.
        // O sqlite suporta REPLACE INTO
        // O mysql suporta REPLACE INTO tbm ou INSERT ON DUPLICATE KEY
        // Para simplificar, vamos verificar se existe e dar update, se não insert
        const exists = await query('SELECT `key` FROM settings WHERE `key` = ?', [key]);
        if (exists && exists.length > 0) {
          await query('UPDATE settings SET `value` = ? WHERE `key` = ?', [value, key]);
        } else {
          await query('INSERT INTO settings (`key`, `value`) VALUES (?, ?)', [key, value]);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    return NextResponse.json({ error: 'Erro ao atualizar configurações' }, { status: 500 });
  }
}
