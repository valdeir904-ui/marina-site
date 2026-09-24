import React from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  Globe,
  Star,
  Stethoscope,
  BookOpen,
  HeartHandshake,
  MapPin,
  CheckCircle,
} from 'lucide-react';
import { query } from '@/lib/db';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsapp from '@/components/FloatingWhatsapp';
import GoogleReviewsWidget from '@/components/GoogleReviewsWidget';
import { getSiteSettings } from '@/lib/settings';

export const metadata = {
  title: 'Links da Bio | Marina Falcão Psicóloga',
  description: 'Agende sua sessão no WhatsApp, leia os artigos do blog e confira as avaliações da Marina Falcão.',
};

async function getLatestPost() {
  try {
    const posts = await query('SELECT slug, title FROM posts WHERE published = 1 ORDER BY created_at DESC LIMIT 1');
    return posts && posts.length > 0 ? posts[0] : null;
  } catch (error) {
    return null;
  }
}

export default async function BioLinksPage() {
  const [latestPost, settings] = await Promise.all([
    getLatestPost(),
    getSiteSettings(),
  ]);

  const whatsappNumber = settings.whatsapp_number || '5516994244626';
  const whatsappMessage = encodeURIComponent(settings.whatsapp_message || 'Oi Marina! 🖐 Gostaria de agendar uma consulta de terapia!');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-100 via-warm-50 to-sage-50 text-slate-800 flex flex-col font-sans">
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md space-y-6 my-8">
          {/* Profile Card Header */}
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full bg-brand-700 text-white flex items-center justify-center text-3xl font-serif font-bold shadow-warm-md border-4 border-white overflow-hidden">
                {settings.bio_image_url ? (
                  <img src={settings.bio_image_url} alt="Marina Falcão" className="w-full h-full object-cover" />
                ) : (
                  <img src="/images/marina-avatar.jpg" alt="Marina Falcão" className="w-full h-full object-cover" />
                )}
              </div>
              <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center" title="Atendimento Ativo">
                <CheckCircle className="w-3 h-3 text-white" />
              </span>
            </div>

            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                {settings.site_title || 'Marina Falcão'}
              </h1>
              <p className="text-xs font-bold text-brand-700 uppercase tracking-wider mt-0.5">
                {settings.crp ? `Psicóloga Clínica • ${settings.crp}` : 'Psicóloga Clínica'}
              </p>
              <p className="text-sm text-slate-600 font-medium mt-2 max-w-xs mx-auto">
                Especialista em Luto, Neuropsicologia, Saúde Mental, Suicidologia, Burnout e Relacionamentos e vínculos afetivos.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white/80 px-3.5 py-1.5 rounded-full border border-warm-200">
              <Globe className="w-3.5 h-3.5 text-brand-600" />
              <span>Atendimento On-line</span>
            </div>
          </div>

          {/* Buttons List */}
          <div className="space-y-3.5 pt-2">
            {/* Main Action: WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden w-full flex items-center justify-center p-4 rounded-2xl bg-[#25D366] text-white font-bold text-base shadow-warm-md hover:bg-[#20bd5a] transition-all transform hover:-translate-y-0.5 active:scale-98 group"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer skew-x-[-20deg]" />
              <div className="flex items-center gap-3 relative z-10">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                <span>Agendar Consulta</span>
              </div>
            </a>

            {/* Website Home */}
            <Link
              href="/"
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-white text-slate-800 border border-warm-300 font-semibold text-sm shadow-warm-sm hover:border-brand-400 hover:text-brand-800 transition-all"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-brand-700" />
                <span>Visitar Site Oficial</span>
              </div>
              <span className="text-xs text-slate-400">marinafalcao.com.br</span>
            </Link>

            {/* Latest Article button if available */}
            {latestPost && (
              <Link
                href={`/blog/${latestPost.slug}`}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200 font-semibold text-sm shadow-warm-sm hover:bg-amber-100 transition-all"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-amber-700" />
                  <span className="line-clamp-1">Ler: {latestPost.title}</span>
                </div>
                <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded font-bold uppercase shrink-0">
                  Novo
                </span>
              </Link>
            )}

            {/* Blog Index */}
            <Link
              href="/blog"
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-white text-slate-800 border border-warm-300 font-semibold text-sm shadow-warm-sm hover:border-brand-400 hover:text-brand-800 transition-all"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-sage-700" />
                <span>Blog & Artigos de Saúde Mental</span>
              </div>
              <span className="text-xs text-slate-400">Ler</span>
            </Link>

            {/* Doctoralia */}
            <a
              href={settings.doctoralia_url || "https://www.doctoralia.com.br"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-white text-slate-800 border border-warm-300 font-semibold text-sm shadow-warm-sm hover:border-brand-400 hover:text-brand-800 transition-all"
            >
              <div className="flex items-center gap-3">
                <Stethoscope className="w-5 h-5 text-teal-600" />
                <span>Perfil no Doctoralia</span>
              </div>
              <span className="text-xs text-slate-400">Ver</span>
            </a>

            {/* Google Reviews */}
            <div className="pt-2">
              <div className="w-full flex flex-col items-center justify-center pt-2 pb-4 relative overflow-hidden group">
                <h3 className="font-serif text-lg font-bold text-slate-800 mb-2 z-10 px-4">O que dizem os pacientes</h3>
                
                <div className="z-10 w-full relative -mx-4 px-4">
                  <GoogleReviewsWidget compact={true} />
                </div>
                
                <Link 
                  href="/" 
                  className="text-xs text-brand-700 font-bold tracking-wide mt-3 hover:text-brand-800 transition-colors"
                >
                  Ver todas as avaliações &rarr;
                </Link>
              </div>
            </div>

            {/* Instagram */}
            <a
              href={settings.instagram_url || "https://www.instagram.com/psimarinafalcao/"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-semibold text-sm shadow-warm-sm hover:opacity-95 transition-all"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Siga no Instagram</span>
              </div>
              <span className="text-xs text-white/80">@psimarinafalcao</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
