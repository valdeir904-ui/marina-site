import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const revalidate = 0; // Temp: Desativando o cache para debugar

export async function GET() {
  try {
    const rows = await query("SELECT * FROM reviews_cache WHERE id = 'google'");
    
    if (rows && rows.length > 0) {
      const cache = rows[0];
      const result = {
        source: 'database_cache',
        rating: typeof cache.rating === 'string' ? parseFloat(cache.rating) : cache.rating,
        user_ratings_total: cache.user_ratings_total,
        google_url: cache.google_url,
        reviews: typeof cache.reviews === 'string' ? JSON.parse(cache.reviews) : cache.reviews,
        updated_at: cache.updated_at
      };
      return NextResponse.json(result);
    }
    
    // Se não tiver cache, tenta fazer a sincronização inicial
    const syncRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/google-reviews/sync`);
    if (syncRes.ok) {
      const syncData = await syncRes.json();
      return NextResponse.json(syncData);
    }

    return NextResponse.json({ error: 'Nenhuma avaliação encontrada e falha ao sincronizar.' }, { status: 404 });
  } catch (error: any) {
    console.error('Erro ao buscar avaliações no cache:', error);
    return NextResponse.json({ error: 'Erro ao carregar avaliações do cache.' }, { status: 500 });
  }
}
