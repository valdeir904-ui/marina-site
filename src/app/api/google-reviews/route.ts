import { NextResponse } from 'next/server';

export const revalidate = 604800; // Cache por 7 dias na Vercel (604800 segundos)

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;

    if (apiKey && placeId) {
      const googleUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,user_ratings_total,url&key=${apiKey}&language=pt-BR`;
      
      const response = await fetch(googleUrl);
      const data = await response.json();

      if (data.status === 'OK' && data.result) {
        const result = {
          source: 'google_api',
          rating: data.result.rating || 5.0,
          user_ratings_total: data.result.user_ratings_total || 24,
          google_url: data.result.url || 'https://www.google.com/search?q=Marina+Falc%C3%A3o+Psic%C3%B3loga+Ribeir%C3%A3o+Preto',
          reviews: (data.result.reviews || []).map((rev: any) => ({
            author_name: rev.author_name,
            profile_photo_url: rev.profile_photo_url,
            rating: rev.rating,
            relative_time_description: rev.relative_time_description,
            text: rev.text,
          })),
        };

        return NextResponse.json(result);
      }
    }

    return NextResponse.json({ error: 'Configuração da API ausente ou falha na requisição.' }, { status: 400 });
  } catch (error: any) {
    console.error('Erro ao buscar avaliações do Google:', error);
    return NextResponse.json({ error: 'Erro ao carregar avaliações.' }, { status: 500 });
  }
}
