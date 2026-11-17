import { query } from './db';
import { Review, GoogleReviewsData, FALLBACK_REVIEWS } from './reviews-data';

export type { Review, GoogleReviewsData };
export { FALLBACK_REVIEWS };

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
