'use client';

import React, { useEffect, useState } from 'react';
import { Star, ExternalLink } from 'lucide-react';

interface Review {
  author_name: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
}

interface GoogleReviewsData {
  rating: number;
  user_ratings_total: number;
  google_url: string;
  reviews: Review[];
  source?: string;
}

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function GoogleReviewsWidget() {
  const [data, setData] = useState<GoogleReviewsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch('/api/google-reviews');
        if (!res.ok) {
          const errJson = await res.json().catch(() => null);
          setData(errJson || { error: 'Status ' + res.status });
          return;
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Erro ao buscar avaliações:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="py-12 text-center text-slate-400 text-sm animate-pulse">
        Carregando avaliações do Google...
      </div>
    );
  }

  if (!data || !data.reviews || data.reviews.length === 0) {
    return (
      <div className="p-4 bg-red-50 text-red-800 text-xs font-mono break-all rounded">
        DEBUG INFO: {JSON.stringify(data)}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Resumo das avaliações */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-warm-200">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <GoogleLogo className="w-8 h-8 shrink-0" />
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="font-serif text-2xl text-slate-900">{data.rating.toFixed(1)}</span>
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              Baseado em {data.user_ratings_total} avaliações no Google
            </p>
          </div>
        </div>

        <a
          href={data.google_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-brand-700 transition-colors underline decoration-warm-400 underline-offset-4 hover:decoration-brand-400 shrink-0"
        >
          <span>Ver perfil no Google</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Depoimentos */}
      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
      
      <div className={`
        ${data.reviews.length > 3 
          ? 'flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6 md:gap-8' 
          : 'grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-12'}
      `}>
        {data.reviews.map((rev, idx) => (
          <figure 
            key={idx} 
            className={`flex flex-col justify-between space-y-6 
              ${data.reviews.length > 3 ? 'min-w-[85vw] sm:min-w-[380px] snap-center shrink-0 bg-white p-6 rounded-2xl border border-warm-200 shadow-sm' : ''}
            `}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <blockquote className="text-slate-700 text-sm sm:text-base leading-relaxed">
                &ldquo;{rev.text}&rdquo;
              </blockquote>
            </div>

            <figcaption className="flex items-center gap-3">
              {rev.profile_photo_url ? (
                <img
                  src={rev.profile_photo_url}
                  alt={rev.author_name}
                  className="w-9 h-9 rounded-full object-cover border border-warm-200"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 font-semibold flex items-center justify-center text-xs">
                  {rev.author_name.charAt(0)}
                </div>
              )}
              <div>
                <span className="font-semibold text-slate-900 text-sm block">{rev.author_name}</span>
                <span className="text-xs text-slate-500">{rev.relative_time_description}</span>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
