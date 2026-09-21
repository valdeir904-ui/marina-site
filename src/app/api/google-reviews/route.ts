import { NextResponse } from 'next/server';

export const revalidate = 0; // Temp: Desativando o cache para debugar

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;

    if (apiKey && placeId) {
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

      if (!data.error) {
        const result = {
          source: 'google_api_new',
          rating: data.rating || 5.0,
          user_ratings_total: data.userRatingCount || 0,
          google_url: data.googleMapsUri || 'https://www.google.com/search?q=Marina+Falc%C3%A3o+Psic%C3%B3loga',
          reviews: (data.reviews || []).map((rev: any) => ({
            author_name: rev.authorAttribution?.displayName,
            profile_photo_url: rev.authorAttribution?.photoUri,
            rating: rev.rating,
            relative_time_description: rev.relativePublishTimeDescription,
            text: rev.text?.text || '',
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
