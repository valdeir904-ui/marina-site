'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface FloatingWhatsappProps {
  whatsappNumber?: string;
  whatsappMessage?: string;
  avatarUrl?: string;
}

export default function FloatingWhatsapp({
  whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5516997712697',
  whatsappMessage = process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || 'Olá, Marina! Gostaria de saber mais sobre as sessões de terapia e agendar uma consulta.',
  avatarUrl = '/images/marina-avatar.jpg',
}: FloatingWhatsappProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const message = encodeURIComponent(whatsappMessage);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${message}`;

  useEffect(() => {
    // Show pop-up after 20 seconds
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setIsOpen(true);
      }
    }, 20000);

    return () => clearTimeout(timer);
  }, [isDismissed]);

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
    setIsDismissed(true);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[320px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Header */}
          <div className="bg-[#0a5f54] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <img 
                  src={avatarUrl} 
                  alt="Dra. Marina Falcão" 
                  className="w-11 h-11 rounded-full object-cover object-center shadow-sm bg-white"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#25D366] border-2 border-[#075e54] rounded-full"></span>
              </div>
              <div className="flex flex-col">
                <h4 className="text-white font-bold text-[15px] leading-tight">Dra. Marina Falcão</h4>
                <p className="text-white/80 text-[12px] mt-0.5">Online agora</p>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="text-white/80 hover:text-white transition-colors p-1"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body & Footer combined */}
          <div 
            className="bg-[#e5ddd5] px-4 pt-4 pb-6 relative flex flex-col items-center"
            style={{ 
              backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
              backgroundSize: 'cover',
              backgroundBlendMode: 'overlay',
              backgroundColor: 'rgba(229, 221, 213, 0.95)'
            }}
          >
            {/* "Hoje" label */}
            <div className="bg-[#e1f3fb] text-[#556973] text-[11px] font-medium px-3 py-1 rounded-lg mb-4 shadow-sm">
              Hoje
            </div>

            {/* Chat bubble */}
            <div className="bg-white p-3.5 pb-2 rounded-xl rounded-tl-none shadow-sm text-[14px] leading-snug text-slate-800 w-full relative mb-5">
              <span className="absolute -left-2 top-0 text-white w-2 overflow-hidden">
                <svg viewBox="0 0 8 13" width="8" height="13" className="fill-current">
                  <path d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z"></path>
                </svg>
              </span>
              <span className="pr-2">Olá! 😊 Se você está enfrentando ansiedade, esgotamento ou apenas sentindo que as coisas estão pesadas demais, saiba que você não precisa passar por isso sozinha. Como posso te ajudar hoje?</span>
              <span className="float-right text-[10px] text-slate-400 mt-2 ml-2">Agora</span>
              <div className="clear-both"></div>
            </div>

            {/* Action Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-[90%] bg-[#25D366] text-white text-center py-3 rounded-full text-[15px] font-bold shadow-md hover:bg-[#20bd5a] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Iniciar Conversa
            </a>
          </div>
        </div>
      )}

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Agendar via WhatsApp"
        onClick={() => setIsOpen(false)}
        className="flex items-center justify-center w-[60px] h-[60px] bg-[#25D366] text-white rounded-full shadow-[0_4px_14px_rgba(37,211,102,0.4)] hover:bg-[#20bd5a] hover:scale-110 transition-all duration-300 relative group"
      >
        {/* WhatsApp Logo SVG */}
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
        
        {/* Red notification dot with number 1 */}
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-white text-[10px] font-bold">1</span>
        
        {/* Tooltip that shows on hover before the 20s pop-up */}
        {!isOpen && (
          <span className="absolute right-full mr-4 bg-slate-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">
            Fale comigo no WhatsApp
          </span>
        )}
      </a>
    </div>
  );
}
