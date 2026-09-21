import React from 'react';
import { getSiteSettings } from '@/lib/settings';

export const metadata = {
  title: 'Em Construção | Dra. Marina Falcão Psicóloga',
  description: 'Site em construção. Agende sua sessão no WhatsApp.',
};

export default async function ConstructionPage() {
  const settings = await getSiteSettings();

  const whatsappNumber = settings.whatsapp_number || '5516997712697';
  const whatsappMessage = encodeURIComponent(settings.whatsapp_message || 'Oi Marina! 🖐 Gostaria de agendar uma consulta de terapia!');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-100 via-warm-50 to-sage-50 text-slate-800 flex flex-col items-center justify-center font-sans p-6">
      
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-warm-xl border border-warm-200 p-8 sm:p-12 text-center relative overflow-hidden">
        {/* Decorative element */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-400 via-brand-600 to-brand-400"></div>

        <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full bg-brand-700 text-white flex items-center justify-center text-3xl font-serif font-bold shadow-warm-md border-4 border-white mb-6">
          {settings.bio_image_url ? (
            <img src={settings.bio_image_url} alt="Dra. Marina Falcão" className="w-full h-full object-cover rounded-full" />
          ) : (
            <img src="/images/marina-avatar.jpg" alt="Dra. Marina Falcão" className="w-full h-full object-cover rounded-full" />
          )}
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
          Dra. Marina Falcão
        </h1>
        <p className="text-sm font-bold text-brand-700 uppercase tracking-wider mb-8">
          Psicóloga Clínica • CRP 06/162899
        </p>

        <div className="bg-warm-50 border border-warm-200 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Site em construção 🚧</h2>
          <p className="text-slate-600 font-medium">
            Estamos preparando um espaço incrível para você. <br/>
            Para iniciar o seu tratamento, clique abaixo e agende sua 1ª consulta!
          </p>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative overflow-hidden w-full inline-flex items-center justify-center p-4 sm:p-5 rounded-2xl bg-[#25D366] text-white font-bold text-lg shadow-warm-md hover:bg-[#20bd5a] transition-all transform hover:-translate-y-0.5 active:scale-98 group"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer skew-x-[-20deg]" />
          <div className="flex items-center gap-3 relative z-10">
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            <span>Agendar 1ª Consulta</span>
          </div>
        </a>

      </div>
    </div>
  );
}
