import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { type, path } = await req.json();

    if (!path) {
      return NextResponse.json({ error: 'Missing path' }, { status: 400 });
    }

    // Insert path if it doesn't exist
    const existing = await query('SELECT * FROM page_stats WHERE path = ?', [path]);
    
    if (!existing || existing.length === 0) {
      await query('INSERT INTO page_stats (path) VALUES (?)', [path]);
    }

    if (type === 'view') {
      await query('UPDATE page_stats SET views = views + 1 WHERE path = ?', [path]);
    } else if (type === 'time') {
      // time_spent in seconds. Client pings every 15s.
      await query('UPDATE page_stats SET time_spent = time_spent + 15 WHERE path = ?', [path]);
    } else if (type === 'conversion') {
      await query('UPDATE page_stats SET conversions = conversions + 1 WHERE path = ?', [path]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Retorna as métricas para o dashboard
    const stats = await query('SELECT * FROM page_stats ORDER BY views DESC');
    return NextResponse.json({ stats });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching stats' }, { status: 500 });
  }
}
