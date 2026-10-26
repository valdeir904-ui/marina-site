import { query } from './db';

export interface Review {
  author_name: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  source?: string;
}

export interface GoogleReviewsData {
  rating: number;
  user_ratings_total: number;
  google_url: string;
  reviews: Review[];
  source?: string;
  updated_at?: string;
}

export const FALLBACK_REVIEWS: GoogleReviewsData = {
  source: 'database_cache',
  rating: 5.0,
  user_ratings_total: 8,
  google_url: 'https://www.google.com/search?q=Marina+Falc%C3%A3o+Psic%C3%B3loga',
  reviews: [
    {
      author_name: 'Julia Mendonça',
      rating: 5,
      relative_time_description: 'Doctoralia',
      text: 'Encontrar uma profissional como a Marina foi um verdadeiro presente na minha vida. Faço terapia com ela há alguns anos e posso dizer, com toda sinceridade, que ela esteve ao meu lado em alguns dos momentos mais desafiadores que já vivi. É uma psicóloga extremamente ética, responsável, acolhedora e competente. Sou imensamente grata por tê-la como minha psicóloga e recomendo seu trabalho de olhos fechados!',
      source: 'doctoralia'
    },
    {
      author_name: 'Julia L.',
      rating: 5,
      relative_time_description: 'Doctoralia',
      text: 'Faço acompanhamento com a Marina há 4 anos e me sinto muito acolhida. Seu apoio foi fundamental durante o luto pela perda dos meus pais. É uma profissional atenciosa, empática e muito competente. Sou muito grata pelo cuidado e recomendo seu trabalho com confiança.',
      source: 'doctoralia'
    },
    {
      author_name: 'CS',
      rating: 5,
      relative_time_description: 'Doctoralia',
      text: 'Marina é uma profissional excelente! É impossível encontrar palavras para mensurar o quanto sou grato pelos atendimentos dela.',
      source: 'doctoralia'
    },
    {
      author_name: 'Isabela',
      rating: 5,
      relative_time_description: 'Doctoralia',
      text: 'A Marina é uma profissional incrível e atua com muito humanismo. Faço acompanhamento com ela há quase 02 anos e ela foi essencial em todas as fases que passei nesse tempo.',
      source: 'doctoralia'
    },
    {
      author_name: 'Lucilia',
      rating: 5,
      relative_time_description: 'Doctoralia',
      text: 'Fazer terapia com a dra foi uma das melhores decisões que tomei. Desde a primeira consulta, me senti acolhido, ouvido e tratado com muito respeito e profissionalismo.',
      source: 'doctoralia'
    },
    {
      author_name: 'Heloisa',
      rating: 5,
      relative_time_description: 'Doctoralia',
      text: 'Uma psicóloga excelente, ajuda os pacientes de forma humana e acolhedora, gosto muito das minhas sessões. Super recomendo!',
      source: 'doctoralia'
    },
    {
      author_name: 'R.M',
      rating: 5,
      relative_time_description: 'Doctoralia',
      text: 'Ela é incrível!! Me sinto extremamente confortável nas sessões',
      source: 'doctoralia'
    },
    {
      author_name: 'Paciente Verificado',
      rating: 5,
      relative_time_description: 'Google',
      text: 'Profissional excelente, acolhedora, pontual e muito dedicada ao atendimento on-line.',
      source: 'google'
    }
  ]
};

export async function getReviewsData(): Promise<GoogleReviewsData> {
  try {
    const rows = await query("SELECT * FROM reviews_cache WHERE id = 'google'");
    if (rows && rows.length > 0) {
      const cache = rows[0];
      const parsedReviews = typeof cache.reviews === 'string' ? JSON.parse(cache.reviews) : cache.reviews;
      return {
        source: 'database_cache',
        rating: typeof cache.rating === 'string' ? parseFloat(cache.rating) : (cache.rating || 5.0),
        user_ratings_total: cache.user_ratings_total || 8,
        google_url: cache.google_url || FALLBACK_REVIEWS.google_url,
        reviews: Array.isArray(parsedReviews) && parsedReviews.length > 0 ? parsedReviews : FALLBACK_REVIEWS.reviews,
        updated_at: cache.updated_at
      };
    }
  } catch (error) {
    console.error('Erro ao ler reviews do banco:', error);
  }

  return FALLBACK_REVIEWS;
}
