'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Star, ExternalLink } from 'lucide-react';

interface Review {
  author_name: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  source?: string;
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

function DoctoraliaLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#00b380"/>
      <text x="12" y="16" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="sans-serif">D</text>
    </svg>
  );
}

function useDraggableScroll(dataLoaded: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const slider = ref.current;
    if (!slider) return;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      slider.style.scrollBehavior = 'auto'; // Disable smooth scroll while dragging
      slider.style.scrollSnapType = 'none'; // Disable snap while dragging
      slider.classList.add('cursor-grabbing');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };
    const onMouseLeave = () => {
      isDown = false;
      slider.classList.remove('cursor-grabbing');
      slider.style.scrollBehavior = 'smooth';
      slider.style.scrollSnapType = 'x mandatory';
    };
    const onMouseUp = () => {
      isDown = false;
      slider.classList.remove('cursor-grabbing');
      slider.style.scrollBehavior = 'smooth';
      slider.style.scrollSnapType = 'x mandatory';
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2; // Scroll-fast
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener('mousedown', onMouseDown);
    slider.addEventListener('mouseleave', onMouseLeave);
    slider.addEventListener('mouseup', onMouseUp);
    slider.addEventListener('mousemove', onMouseMove);

    // Auto-scroll logic
    const interval = setInterval(() => {
      if (!slider.matches(':hover') && !isDown) {
        slider.style.scrollBehavior = 'smooth';
        if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) {
          slider.scrollTo({ left: 0 });
        } else {
          // Calculate the width of one card + gap. Roughly 280px.
          slider.scrollBy({ left: 280 });
        }
      }
    }, 4000);

    return () => {
      slider.removeEventListener('mousedown', onMouseDown);
      slider.removeEventListener('mouseleave', onMouseLeave);
      slider.removeEventListener('mouseup', onMouseUp);
      slider.removeEventListener('mousemove', onMouseMove);
      clearInterval(interval);
    };
  }, [dataLoaded]);
  
  return ref;
}

export default function GoogleReviewsWidget({ compact = false }: { compact?: boolean }) {
  const [data, setData] = useState<GoogleReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedIndices, setExpandedIndices] = useState<Set<number>>(new Set());
  const scrollRefCompact = useDraggableScroll(!!data);
  const scrollRefFull = useDraggableScroll(!!data);

  const toggleExpand = (idx: number) => {
    setExpandedIndices(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

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
        // Embaralha as avaliações e duplica para efeito infinito
        if (json.reviews) {
          let shuffled = json.reviews.sort(() => Math.random() - 0.5);
          json.reviews = [...shuffled, ...shuffled, ...shuffled];
        }
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
      <div className="py-8 text-center text-slate-400 text-sm animate-pulse">
        Carregando avaliações...
      </div>
    );
  }

  if (!data || !data.reviews || data.reviews.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <div className="w-full relative">
        <style dangerouslySetInnerHTML={{ __html: `
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          .cursor-grab { cursor: grab; }
          .cursor-grabbing { cursor: grabbing; }
        `}} />
        <div 
          ref={scrollRefCompact}
          className="flex overflow-x-auto hide-scrollbar gap-4 pb-2 cursor-grab items-stretch snap-x snap-mandatory px-[12.5vw] sm:px-[calc(50%-130px)]"
          style={{ scrollBehavior: 'smooth' }}
        >
          {data.reviews.map((rev, idx) => {
            const isExpanded = expandedIndices.has(idx);
            const isLong = rev.text.length > 130;
            return (
          <figure 
            key={idx} 
            className={`flex flex-col justify-between space-y-6 select-none h-auto transition-all duration-300 snap-center
              w-[75vw] sm:w-[260px] shrink-0 bg-white p-5 rounded-2xl border border-warm-200 shadow-sm hover:shadow-md
            `}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-1 text-amber-400 pointer-events-none">
                {[...Array(rev.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <div className="flex flex-col items-start relative z-10">
                <blockquote className={`text-slate-700 text-sm sm:text-base leading-relaxed transition-all duration-300 pointer-events-none ${isExpanded ? '' : 'line-clamp-4'}`}>
                  &ldquo;{rev.text}&rdquo;
                </blockquote>
                {isLong && (
                  <button 
                    onClick={() => toggleExpand(idx)}
                    className="text-brand-600 text-xs font-bold mt-2 hover:text-brand-800 transition-colors pointer-events-auto"
                  >
                    {isExpanded ? 'Ler menos' : 'Ler mais...'}
                  </button>
                )}
              </div>
            </div>

            <figcaption className="flex items-center gap-3 pointer-events-none">
              {rev.profile_photo_url ? (
                <img
                  src={rev.profile_photo_url}
                  alt={rev.author_name}
                  className="w-9 h-9 rounded-full object-cover border border-warm-200 shrink-0"
                />
              ) : (
                <div className={`w-9 h-9 shrink-0 rounded-full font-semibold flex items-center justify-center text-xs ${
                  rev.source === 'doctoralia' ? 'bg-[#00e3a4]/20 text-[#00b380]' : 'bg-brand-100 text-brand-700'
                }`}>
                  {rev.author_name.charAt(0)}
                </div>
              )}
              <div className="overflow-hidden">
                <span className="font-semibold text-slate-900 text-sm block truncate">{rev.author_name}</span>
                <span className="text-xs text-slate-500 block truncate">{rev.relative_time_description}</span>
              </div>
              <div className="ml-auto flex-shrink-0 opacity-80 pl-2">
                {rev.source === 'doctoralia' ? <DoctoraliaLogo className="w-6 h-6" /> : <GoogleLogo className="w-6 h-6" />}
              </div>
            </figcaption>
          </figure>
          )})}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Resumo das avaliações */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-warm-200">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <GoogleLogo className="w-8 h-8 shrink-0" />
          <DoctoraliaLogo className="w-8 h-8 shrink-0 -ml-2" />
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
              Baseado em {data.user_ratings_total} avaliações (Google e Doctoralia)
            </p>
          </div>
        </div>

        <a
          href={data.google_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-brand-700 transition-colors underline decoration-warm-400 underline-offset-4 hover:decoration-brand-400 shrink-0 relative z-10"
        >
          <span>Ver perfil no Google</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Depoimentos */}
      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .cursor-grab { cursor: grab; }
        .cursor-grabbing { cursor: grabbing; }
      `}} />
      
      <div 
        ref={scrollRefFull}
        className={`
        ${data.reviews.length > 3 
          ? 'flex overflow-x-auto hide-scrollbar pb-8 gap-4 md:gap-6 cursor-grab items-stretch snap-x snap-mandatory px-[12.5vw] sm:px-[calc(50%-140px)]' 
          : 'grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-12'}
      `}
        style={{ scrollBehavior: 'smooth' }}
      >
        {data.reviews.map((rev, idx) => {
          const isExpanded = expandedIndices.has(idx);
          const isLong = rev.text.length > 150;
          return (
          <figure 
            key={idx} 
            className={`flex flex-col justify-between space-y-6 select-none h-auto transition-all duration-300 snap-center
              ${data.reviews.length > 3 ? 'w-[75vw] sm:w-[280px] shrink-0 bg-white p-6 rounded-2xl border border-warm-200 shadow-sm hover:shadow-md transition-shadow' : ''}
            `}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-1 text-amber-400 pointer-events-none">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <div className="flex flex-col items-start relative z-10">
                <blockquote className={`text-slate-700 text-sm sm:text-base leading-relaxed transition-all duration-300 pointer-events-none ${isExpanded ? '' : 'line-clamp-4'}`}>
                  &ldquo;{rev.text}&rdquo;
                </blockquote>
                {isLong && (
                  <button 
                    onClick={() => toggleExpand(idx)}
                    className="text-brand-600 text-xs font-bold mt-2 hover:text-brand-800 transition-colors pointer-events-auto"
                  >
                    {isExpanded ? 'Ler menos' : 'Ler mais...'}
                  </button>
                )}
              </div>
            </div>

            <figcaption className="flex items-center gap-3 pointer-events-none">
              {rev.profile_photo_url ? (
                <img
                  src={rev.profile_photo_url}
                  alt={rev.author_name}
                  className="w-9 h-9 rounded-full object-cover border border-warm-200 shrink-0"
                />
              ) : (
                <div className={`w-9 h-9 shrink-0 rounded-full font-semibold flex items-center justify-center text-xs ${
                  rev.source === 'doctoralia' ? 'bg-[#00e3a4]/20 text-[#00b380]' : 'bg-brand-100 text-brand-700'
                }`}>
                  {rev.author_name.charAt(0)}
                </div>
              )}
              <div className="overflow-hidden">
                <span className="font-semibold text-slate-900 text-sm block truncate">{rev.author_name}</span>
                <span className="text-xs text-slate-500 block truncate">{rev.relative_time_description}</span>
              </div>
              <div className="ml-auto flex-shrink-0 opacity-80 pl-2">
                {rev.source === 'doctoralia' ? <DoctoraliaLogo className="w-6 h-6" /> : <GoogleLogo className="w-6 h-6" />}
              </div>
            </figcaption>
          </figure>
        )})}
      </div>
    </div>
  );
}
