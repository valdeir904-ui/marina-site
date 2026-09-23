import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const revalidate = 0; // Temp: Desativando o cache para debugar

export async function GET(request: Request) {
  try {
    const isCron = request.headers.get('user-agent')?.includes('vercel-cron') || request.headers.get('x-vercel-cron') === '1';
    
    if (isCron) {
      const settingsRows = await query("SELECT value FROM settings WHERE `key` = 'google_reviews_sync_enabled'");
      if (settingsRows && settingsRows.length > 0 && settingsRows[0].value === 'false') {
        return NextResponse.json({ message: 'Sincronização automática desabilitada.' });
      }
    }
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;

    if (!apiKey || !placeId) {
      return NextResponse.json({ error: 'Configuração da API ausente ou falha na requisição.' }, { status: 400 });
    }

    const googleUrl = `https://places.googleapis.com/v1/places/${placeId}`;
    
    const response = await fetch(googleUrl, {
      method: 'GET',
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'rating,reviews,userRatingCount,googleMapsUri',
        'Accept-Language': 'pt-BR'
      }
    });
    
    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ error: 'Erro da API do Google: ' + data.error.message }, { status: 400 });
    }

    let googleReviews: any[] = [];
    let googleTotal = 0;
    let googleRating = 5.0;

    if (data) {
      googleReviews = (data.reviews || []).map((rev: any) => ({
        author_name: rev.authorAttribution?.displayName,
        profile_photo_url: rev.authorAttribution?.photoUri,
        rating: rev.rating,
        relative_time_description: rev.relativePublishTimeDescription,
        text: rev.text?.text || '',
        source: 'google'
      }));
      googleTotal = data.userRatingCount || 0;
      googleRating = data.rating || 5.0;
    }

    const doctoraliaReviews = [
      {
        author_name: 'Julia Mendonça',
        rating: 5,
        relative_time_description: '17 de julho de 2026',
        text: 'Encontrar uma profissional como a Marina foi um verdadeiro presente na minha vida. Faço terapia com ela há alguns anos e posso dizer, com toda sinceridade, que ela esteve ao meu lado em alguns dos momentos mais desafiadores que já vivi. É uma psicóloga extremamente ética, responsável, acolhedora e competente. Sou imensamente grata por tê-la como minha psicóloga e recomendo seu trabalho de olhos fechados!',
        source: 'doctoralia'
      },
      {
        author_name: 'Julia L.',
        rating: 5,
        relative_time_description: '13 de junho de 2026',
        text: 'Faço acompanhamento com a Marina há 4 anos e me sinto muito acolhida. Seu apoio foi fundamental durante o luto pela perda dos meus pais. É uma profissional atenciosa, empática e muito competente. Sou muito grata pelo cuidado e recomendo seu trabalho com confiança.',
        source: 'doctoralia'
      },
      {
        author_name: 'CS',
        rating: 5,
        relative_time_description: '20 de julho de 2026',
        text: 'Marina é uma profissional excelente! É impossível encontrar palavras para mensurar o quanto sou grato pelos atendimentos dela.',
        source: 'doctoralia'
      },
      {
        author_name: 'Isabela',
        rating: 5,
        relative_time_description: '17 de julho de 2026',
        text: 'A Marina é uma profissional incrível e atua com muito humanismo. Faço acompanhamento com ela há quase 02 anos e ela foi essencial em todas as fases que passei nesse tempo.',
        source: 'doctoralia'
      },
      {
        author_name: 'Lucilia',
        rating: 5,
        relative_time_description: '14 de julho de 2026',
        text: 'Fazer terapia com a dra foi uma das melhores decisões que tomei. Desde a primeira consulta, me senti acolhido, ouvido e tratado com muito respeito e profissionalismo.',
        source: 'doctoralia'
      },
      {
        author_name: 'Heloisa',
        rating: 5,
        relative_time_description: '14 de julho de 2026',
        text: 'Uma psicóloga excelente, ajuda os pacientes de forma humana e acolhedora, gosto muito das minhas sessões. Super recomendo!',
        source: 'doctoralia'
      },
      {
        author_name: 'R.M',
        rating: 5,
        relative_time_description: '16 de julho de 2026',
        text: 'Ela é incrível!! Me sinto extremamente confortável nas sessões',
        source: 'doctoralia'
      }
    ];

    const result = {
      source: 'database_cache', // To keep frontend happy
      rating: googleRating,
      user_ratings_total: googleTotal + doctoraliaReviews.length, // Google + Doctoralia total
      google_url: data.googleMapsUri || 'https://www.google.com/search?q=Marina+Falc%C3%A3o+Psic%C3%B3loga',
      reviews: [...googleReviews, ...doctoraliaReviews]
    };

    // Save to DB
    const driver = process.env.POSTGRES_URL || process.env.DATABASE_URL ? 'postgres' : (process.env.DB_DRIVER || 'sqlite');
    const existing = await query("SELECT id FROM reviews_cache WHERE id = 'google'");
    
    if (existing && existing.length > 0) {
      await query(
        "UPDATE reviews_cache SET rating = ?, user_ratings_total = ?, google_url = ?, reviews = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 'google'",
        [result.rating, result.user_ratings_total, result.google_url, JSON.stringify(result.reviews)]
      );
    } else {
      await query(
        "INSERT INTO reviews_cache (id, rating, user_ratings_total, google_url, reviews) VALUES ('google', ?, ?, ?, ?)",
        [result.rating, result.user_ratings_total, result.google_url, JSON.stringify(result.reviews)]
      );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Erro ao buscar e sincronizar avaliações do Google:', error);
    return NextResponse.json({ error: 'Erro ao sincronizar avaliações.' }, { status: 500 });
  }
}
