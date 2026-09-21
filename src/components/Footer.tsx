import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Lock } from 'lucide-react';

const InstagramIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

interface FooterProps {
  settings?: Record<string, string>;
}

export default function Footer({ settings = {} }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const whatsappNumber = settings.whatsapp_number || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5516997712697';
  const whatsappMessage = encodeURIComponent(settings.whatsapp_message || 'Oi Marina! 🖐 Gostaria de agendar uma consulta de terapia!');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Institutional */}
          <div className="md:col-span-1 space-y-4">
            <div>
              <span className="font-serif text-xl text-white block">Marina Falcão</span>
              <span className="text-xs text-brand-300 tracking-[0.14em] uppercase block mt-1">
                Psicóloga · CRP 06/162899
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Escuta clínica guiada pela ciência, sensibilidade e acolhimento. Especialista em Saúde Mental do Trabalhador, Ansiedade, Burnout e Luto.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-white mb-4">Navegação</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/#sobre" className="hover:text-brand-300 transition-colors">
                  Sobre Mim
                </Link>
              </li>
              <li>
                <Link href="/#especialidades" className="hover:text-brand-300 transition-colors">
                  Especialidades
                </Link>
              </li>
              <li>
                <Link href="/#abordagens" className="hover:text-brand-300 transition-colors">
                  Abordagens Teóricas
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-brand-300 transition-colors">
                  Blog & Artigos
                </Link>
              </li>
              <li>
                <Link href="/links" className="hover:text-brand-300 transition-colors">
                  Página de Links Bio
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Specialties */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-white mb-4">Áreas de Atuação</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>Ansiedade & Síndrome do Pânico</li>
              <li>Burnout & Estresse Ocupacional</li>
              <li>Elaboração do Luto & Perdas</li>
              <li>Terapia de Casal</li>
              <li>Psicossomática & Psicogerontologia</li>
            </ul>
          </div>

          {/* Col 4: Contact & Locations */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-semibold text-white mb-4">Atendimentos</h4>
            <div className="flex items-start gap-3 text-sm text-slate-400">
              <MapPin className="w-5 h-5 text-brand-600 mt-0.5 shrink-0" />
              <span>{settings.address || 'Presencial em Ribeirão Preto - SP e On-line para todo o Brasil'} e Exterior.</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Phone className="w-5 h-5 text-brand-400 shrink-0" />
              <span>{settings.phone || '(16) 99771-2697'}</span>
            </div>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-500">
              <Lock className="w-4 h-4" />
              <Link href="/admin/login" className="hover:text-slate-400 transition-colors">
                Área restrita
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {currentYear} Psicóloga Marina Falcão • Todos os direitos reservados.</p>
          <div className="flex items-center gap-4 flex-wrap">
            <a
              href={settings.google_url || "https://www.google.com/search?q=Marina+Falc%C3%A3o+Psic%C3%B3loga+Ribeir%C3%A3o+Preto"}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300"
            >
              Avaliações no Google
            </a>
            <span>·</span>
            <a
              href={settings.doctoralia_url || "https://www.doctoralia.com.br"}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300"
            >
              Perfil na Doctoralia
            </a>
            <span>·</span>
            <a
              href={settings.instagram_url || "https://instagram.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 flex items-center gap-1"
            >
              <InstagramIcon /> Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
