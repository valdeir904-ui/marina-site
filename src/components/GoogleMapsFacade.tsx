'use client';

import React, { useState } from 'react';
import { MapPin, ExternalLink, Navigation } from 'lucide-react';

interface GoogleMapsFacadeProps {
  title?: string;
  queryUrl?: string;
  embedSrc?: string;
  addressText?: string;
}

export default function GoogleMapsFacade({
  title = 'Localização do consultório - Edifício Fortes Guimarães, Ribeirão Preto',
  queryUrl = 'https://www.google.com/maps/search/?api=1&query=Rua+Bernardino+de+Campos+1001+Ribeirao+Preto',
  embedSrc = 'https://maps.google.com/maps?q=Rua%20Bernardino%20de%20Campos,%201001,%20Centro,%20Ribeir%C3%A3o%20Preto%20-%20SP&t=&z=16&ie=UTF8&iwloc=&output=embed',
  addressText = 'Rua Bernardino de Campos, 1001, sala 310 · Centro, Ribeirão Preto/SP',
}: GoogleMapsFacadeProps) {
  const [showIframe, setShowIframe] = useState(false);

  if (showIframe) {
    return (
      <iframe
        title={title}
        src={embedSrc}
        loading="lazy"
        className="w-full h-64 sm:h-80 lg:h-full lg:min-h-[360px] rounded-xl border-0 animate-in fade-in duration-300"
        allowFullScreen={false}
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }

  return (
    <div className="relative w-full h-64 sm:h-80 lg:h-full lg:min-h-[360px] rounded-xl overflow-hidden bg-slate-100 border border-warm-200 flex flex-col items-center justify-center p-6 text-center select-none group">
      {/* Padrão de fundo imitando mapa leve em tons neutros */}
      <div 
        className="absolute inset-0 opacity-40 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-50/40 via-white/70 to-warm-100/60 pointer-events-none" />

      {/* Conteúdo do cartão estático */}
      <div className="relative z-10 max-w-sm space-y-3 flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
          <MapPin className="w-6 h-6 animate-bounce" />
        </div>

        <div className="space-y-1">
          <h4 className="font-serif font-bold text-slate-900 text-base sm:text-lg">
            Edifício Fortes Guimarães
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            {addressText}
          </p>
        </div>

        {/* Botões de Ação */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-2 w-full justify-center">
          <button
            type="button"
            onClick={() => setShowIframe(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold rounded-full shadow-sm transition-colors"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Ver mapa interativo</span>
          </button>

          <a
            href={queryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-warm-50 text-slate-700 border border-warm-300 text-xs font-semibold rounded-full shadow-sm transition-colors"
          >
            <span>Abrir no Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

