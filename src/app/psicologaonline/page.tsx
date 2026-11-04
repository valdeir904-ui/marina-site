import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsapp from '@/components/FloatingWhatsapp';
import { getSiteSettings } from '@/lib/settings';
import { getWhatsappUrl } from '@/lib/whatsapp';
import { getReviewsData } from '@/lib/reviews';
import StepTimeline from '@/components/StepTimeline';
import Reveal from '@/components/Reveal';
import AboutSection from '@/components/AboutSection';

const GoogleReviewsWidget = dynamic(() => import('@/components/GoogleReviewsWidget'), {
  loading: () => (
    <div className="py-8 text-center text-slate-400 text-sm">Carregando avaliações...</div>
  ),
});

const FaqAccordion = dynamic(() => import('@/components/FaqAccordion'));

const GoogleMapsFacade = dynamic(() => import('@/components/GoogleMapsFacade'));
import {
  MessageCircle,
  Brain,
  Heart,
  Users,
  Sun,
  ShieldCheck,
  Activity,
  Video,
  Clock,
  Globe,
  Lock,
  MapPin,
  ExternalLink,
} from 'lucide-react';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Psicóloga em Ribeirão Preto e On-line | Marina Falcão | CRP 06/162899',
  description:
    'Psicoterapia presencial no Centro de Ribeirão Preto e on-line para todo o Brasil, com a psicóloga Marina Falcão (CRP 06/162899). Sessões de 50 minutos. Agende pelo WhatsApp.',
  keywords: [
    'Psicóloga em Ribeirão Preto',
    'Psicóloga Ribeirão Preto',
    'Psicólogo em Ribeirão Preto',
    'Psicóloga Online',
    'Psicólogo Online',
    'Terapia Online',
    'Psicoterapia Online',
    'Marina Falcão',
    'Psicoterapia Ansiedade',
    'Burnout',
    'Luto',
    'Relacionamentos e Vínculos Afetivos',
    'Análise do Comportamento',
  ],
  authors: [{ name: 'Marina Falcão', url: 'https://www.marinafalcao.com.br' }],
  openGraph: {
    title: 'Psicóloga em Ribeirão Preto e On-line | Marina Falcão | CRP 06/162899',
    description:
      'Psicoterapia presencial no Centro de Ribeirão Preto e on-line para todo o Brasil, com a psicóloga Marina Falcão (CRP 06/162899). Sessões de 50 minutos. Agende pelo WhatsApp.',
    url: 'https://www.marinafalcao.com.br/psicologaonline',
    siteName: 'Psicóloga Marina Falcão',
    locale: 'pt_BR',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Psychologist',
  '@id': 'https://www.marinafalcao.com.br/psicologaonline#psychologist',
  name: 'Marina Falcão - Psicóloga em Ribeirão Preto e On-line',
  image: 'https://www.marinafalcao.com.br/images/marina-hero-v2.jpg',
  url: 'https://www.marinafalcao.com.br/psicologaonline',
  telephone: '+5516994244626',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Rua Bernardino de Campos, 1001, sala 310, Edifício Fortes Guimarães',
    addressLocality: 'Ribeirão Preto',
    addressRegion: 'SP',
    postalCode: '14015-130',
    addressCountry: 'BR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -21.1767,
    longitude: -47.8103,
  },
  openingHours: [
    'Mo-Fr 08:00-20:00',
    'Sa 08:00-12:00',
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '20:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday'],
      opens: '08:00',
      closes: '12:00',
    },
  ],
  areaServed: [
    {
      '@type': 'City',
      name: 'Ribeirão Preto',
    },
    {
      '@type': 'Country',
      name: 'BR',
    },
  ],
  availableService: [
    {
      '@type': 'MedicalTherapy',
      name: 'Psicoterapia Presencial',
      description: 'Atendimento presencial em sala reservada no Edifício Fortes Guimarães, Centro de Ribeirão Preto/SP.',
    },
    {
      '@type': 'MedicalTherapy',
      name: 'Psicoterapia On-line',
      description: 'Atendimento psicológico por videochamada para adultos em todo o Brasil e no exterior.',
    },
  ],
  provider: {
    '@type': 'Person',
    name: 'Marina Falcão',
    jobTitle: 'Psicóloga Clínica',
    identifier: 'CRP 06/162899',
  },
};

const especialidades = [
  {
    icon: Brain,
    title: 'Ansiedade & Pânico',
    text: 'Manejo de pensamentos acelerados, crises de pânico, apreensão constante e sintomas físicos causados pelo estresse.',
  },
  {
    icon: Activity,
    title: 'Burnout & Esgotamento',
    text: 'Superação da exaustão profissional, perda de motivação e estresse de trabalho, com reconstrução de limites saudáveis.',
  },
  {
    icon: Heart,
    title: 'Luto & Perdas',
    text: 'Acolhimento para a dor de perdas afetivas, falecimentos e transições de vida. Um espaço seguro para ressignificar sem pressa.',
  },
  {
    icon: Users,
    title: 'Relacionamentos & Vínculos',
    text: 'Melhoria da comunicação, resolução construtiva de conflitos, fortalecimento de vínculos e inteligência afetiva.',
  },
  {
    icon: Sun,
    title: 'Depressão & Desânimo',
    text: 'Intervenções para resgatar a vitalidade, acolher o desânimo persistente e reorganizar a rotina com novos propósitos.',
  },
  {
    icon: ShieldCheck,
    title: 'Regulação Emocional',
    text: 'Manejo de pensamentos repetitivos, sobrecarga e oscilações emocionais através de técnicas comportamentais validadas.',
  },
];

export default async function PsicologaOnlinePage() {
  const [settings, reviewsData] = await Promise.all([
    getSiteSettings(),
    getReviewsData(),
  ]);

  const whatsappNumber = settings.whatsapp_number;
  const defaultWaMessage = 'Olá, Marina! Gostaria de agendar uma consulta de terapia.';
  const waUrl = getWhatsappUrl(whatsappNumber, defaultWaMessage);
  const waPresencialUrl = getWhatsappUrl(whatsappNumber, undefined, { presencial: true });
  const consultorioPhotoUrl = settings.consultorio_image_url || null;

  const ratingFormatted = reviewsData.rating ? reviewsData.rating.toFixed(1).replace('.', ',') : '5,0';

  return (
    <div className="min-h-screen bg-warm-50 text-slate-800 flex flex-col font-sans overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Header settings={settings} isOnlineLanding={true} />

      <main className="flex-grow">
        {/* 1. HERO - Modelo Foto em faixa no topo */}
        <section className="relative overflow-hidden pt-24 lg:pt-28 pb-12 lg:pb-16 bg-warm-50">
          <div className="max-w-xl lg:max-w-2xl mx-auto px-4 sm:px-6 relative z-10 w-full space-y-4 sm:space-y-5">
            
            {/* Foto em faixa no topo com enquadramento perfeito do rosto */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[320px] rounded-[2rem] overflow-hidden shadow-sm bg-warm-200 border-2 border-white">
              <Image 
                src="/images/marina-hero-v2.webp" 
                alt="Marina Falcão - Psicóloga em Ribeirão Preto e On-line" 
                fill
                priority
                fetchPriority="high"
                unoptimized
                sizes="(max-width: 640px) 100vw, 680px"
                className="object-cover object-[center_18%]"
              />
            </div>

            {/* Pílula flutuante centralizada: Olá, eu sou a Marina */}
            <div className="flex justify-center -mt-7 sm:-mt-8 relative z-20">
              <div className="inline-flex items-center gap-2 bg-white border border-warm-200/90 shadow-sm px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                <span>Olá, eu sou a Marina</span>
              </div>
            </div>

            {/* Conteúdo de Texto Centralizado */}
            <div className="space-y-3 text-center pt-1">
              <h1 className="text-[12px] font-bold tracking-widest uppercase text-[#74532F]">
                Psicóloga em Ribeirão Preto · presencial e on-line
              </h1>

              <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight tracking-tight">
                Um espaço seguro para você ser ouvido(a), sem julgamentos.
              </p>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg mx-auto">
                Atendo adultos no Centro de Ribeirão Preto e on-line, com escuta acolhedora, ética e sigilo.
              </p>

              {/* Bloco de Botão Principal */}
              <div className="pt-2 flex flex-col items-center justify-center">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="cta-hero"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#1F7A4C] hover:bg-[#185C3B] text-white font-semibold px-8 py-3.5 rounded-full text-base transition-colors shadow-warm-md hover:shadow-warm-lg pulse-ring-cta"
                >
                  <MessageCircle className="w-5 h-5 shrink-0" />
                  <span>Tirar dúvidas no WhatsApp</span>
                </a>
                <p className="text-[12px] text-slate-500 font-medium pt-1.5">
                  Resposta pela própria Marina · Sem compromisso
                </p>
              </div>

              {/* Selos do Modelo */}
              <div className="pt-3 flex flex-col items-center gap-2 text-xs text-slate-700">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="bg-white border border-warm-200 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 font-medium shadow-xs">
                    <span className="text-[#1F7A4C] font-bold">✓</span> Centro de RP
                  </span>
                  <span className="bg-white border border-warm-200 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 font-medium shadow-xs">
                    <span className="text-[#1F7A4C] font-bold">✓</span> Sessões de 50 min
                  </span>
                </div>
                <div className="inline-flex items-center gap-1 bg-white border border-warm-200 px-3.5 py-1 rounded-full text-amber-700 font-semibold shadow-xs">
                  ★ {ratingFormatted} no Google
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 2. AVALIAÇÕES - Imediatamente após o Hero (Renderizadas no servidor / SSR) */}
        <section id="avaliacoes" className="py-14 lg:py-20 bg-white border-y border-warm-200">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="max-w-2xl space-y-2 text-center sm:text-left">
              <p className="kicker justify-center sm:justify-start">Depoimentos</p>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-slate-900 font-bold">
                Avaliações de pacientes no Google e na Doctoralia
              </h2>
            </div>

            <GoogleReviewsWidget />
          </div>
        </section>

        {/* 3. SOBRE MIM - Com conteúdo integrado de A Ciência da Mente */}
        <AboutSection onlineOnly={true} />

        {/* 4. ESPECIALIDADES - Em cartões objetivos (sem botão por bloco) */}
        <section id="especialidades" className="py-16 lg:py-24 bg-warm-50/50 border-b border-warm-200">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <Reveal animation="fade-up">
              <div className="max-w-2xl mx-auto text-center space-y-3">
                <p className="kicker justify-center">Especialidades</p>
                <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 font-bold">
                  Áreas de atuação
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  Cada demanda emocional pede um olhar atento e singular, sob a perspectiva ética da Análise do Comportamento.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {especialidades.map(({ icon: Icon, title, text }, idx) => (
                <Reveal key={title} animation="fade-up" delay={idx * 80}>
                  <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-warm-200/80 hover:shadow-md transition-shadow h-full flex flex-col">
                    <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-700 mb-5 shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">
                      {title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Botão de WhatsApp #2 (depois de Especialidades) */}
            <div className="text-center pt-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-track="cta-especialidades"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#1F7A4C] hover:bg-[#185C3B] text-white font-semibold px-8 py-3.5 rounded-full text-base transition-colors shadow-warm-md hover:shadow-warm-lg"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                <span>Ver horários disponíveis</span>
              </a>
            </div>
          </div>
        </section>

        {/* 5. COMO FUNCIONA O ATENDIMENTO */}
        <section id="como-funciona" className="py-16 lg:py-24 bg-white border-b border-warm-200">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <Reveal animation="fade-up">
              <div className="max-w-2xl mx-auto text-center space-y-3">
                <p className="kicker justify-center">Como funciona</p>
                <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 font-bold">
                  Do primeiro contato ao acompanhamento
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  Processo simples, humano e acolhedor para você iniciar sua psicoterapia com comodidade.
                </p>
              </div>
            </Reveal>

            <StepTimeline onlineOnly={true} />

            {/* Botão de WhatsApp #3 (depois de Como funciona) */}
            <div className="text-center pt-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-track="cta-como-funciona"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#1F7A4C] hover:bg-[#185C3B] text-white font-semibold px-8 py-3.5 rounded-full text-base transition-colors shadow-warm-md hover:shadow-warm-lg"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                <span>Ver horários disponíveis</span>
              </a>
            </div>
          </div>
        </section>

        {/* 6. NOVA SEÇÃO: ATENDIMENTO PRESENCIAL */}
        <section id="presencial" className="py-16 lg:py-24 bg-warm-100/60 border-b border-warm-200">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <Reveal animation="fade-up">
              <div className="max-w-2xl mx-auto text-center space-y-3">
                <div className="inline-flex items-center gap-2 text-brand-700 text-xs font-bold tracking-widest uppercase bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Atendimento Presencial</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                  Atendimento presencial no Centro de Ribeirão Preto
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  As sessões presenciais acontecem em sala reservada, com conforto e sigilo, no Edifício Fortes Guimarães.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Card de Informações e Agendamento */}
              <div className="lg:col-span-6 flex flex-col justify-between bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-warm-200/80 space-y-6">
                <div className="space-y-6">
                  {/* Endereço */}
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center text-brand-700 shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <h3 className="font-serif text-lg font-bold text-slate-900">Endereço</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        Rua Bernardino de Campos, 1001, sala 310 – Edifício Fortes Guimarães – Centro – Ribeirão Preto/SP – CEP 14015-130.
                      </p>
                      <div className="pt-1">
                        <a
                          href="https://www.google.com/maps/search/?api=1&query=Rua+Bernardino+de+Campos+1001+Ribeirao+Preto"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-brand-700 hover:text-brand-800 text-sm font-semibold underline decoration-brand-300 underline-offset-4 hover:decoration-brand-500 transition-colors"
                        >
                          <span>Abrir no Google Maps</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Horário */}
                  <div className="flex items-start gap-4 pt-4 border-t border-warm-100">
                    <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center text-brand-700 shrink-0 mt-0.5">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <h3 className="font-serif text-lg font-bold text-slate-900">Horário de atendimento</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        Segunda a sexta, 8h às 20h · Sábado, 8h às 12h
                      </p>
                    </div>
                  </div>

                  {/* Espaço preparado para foto (só exibe se houver imagem configurada) */}
                  {consultorioPhotoUrl && (
                    <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-warm-200 mt-4">
                      <Image
                        src={consultorioPhotoUrl}
                        alt="Consultório de psicologia em Ribeirão Preto - Edifício Fortes Guimarães"
                        fill
                        loading="lazy"
                        sizes="(max-width: 1024px) 100vw, 600px"
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Botão de Agendamento Presencial */}
                <div className="pt-4 border-t border-warm-100">
                  <a
                    href={waPresencialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-wa-type="presencial"
                    data-track="cta-presencial"
                    className="w-full inline-flex items-center justify-center gap-2.5 bg-[#1F7A4C] hover:bg-[#185C3B] text-white font-semibold px-6 py-3.5 rounded-full text-base transition-colors shadow-warm-md hover:shadow-warm-lg"
                  >
                    <MessageCircle className="w-5 h-5 shrink-0" />
                    <span>Agendar sessão presencial</span>
                  </a>
                </div>
              </div>

              {/* Mapa do Google Incorporado / Fachada otimizada */}
              <div className="lg:col-span-6 bg-white rounded-2xl p-2 sm:p-3 shadow-sm border border-warm-200/80 flex flex-col min-h-[280px] sm:min-h-[350px]">
                <GoogleMapsFacade />
              </div>
            </div>
          </div>
        </section>

        {/* 7. SEÇÃO: ATENDIMENTO ON-LINE */}
        <section id="atendimento" className="py-16 lg:py-20 bg-white border-b border-warm-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <Reveal animation="fade-up">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-brand-700 text-xs font-bold tracking-widest uppercase bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
                  <Video className="w-3.5 h-3.5" />
                  <span>Atendimento On-line</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                  Prefere on-line? Atendo de qualquer cidade.
                </h2>
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                  As sessões acontecem por videochamada, com a mesma qualidade e o mesmo sigilo do atendimento presencial. Atendo pessoas em todo o Brasil e brasileiros no exterior, em português.
                </p>
              </div>
            </Reveal>

            {/* Três itens curtos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-warm-50/80 p-5 rounded-2xl border border-warm-200 shadow-sm flex items-center justify-center gap-3">
                <Clock className="w-5 h-5 text-brand-600 shrink-0" />
                <span className="font-medium text-slate-800 text-sm">Sessões de 50 minutos</span>
              </div>
              <div className="bg-warm-50/80 p-5 rounded-2xl border border-warm-200 shadow-sm flex items-center justify-center gap-3">
                <Lock className="w-5 h-5 text-brand-600 shrink-0" />
                <span className="font-medium text-slate-800 text-sm">Videochamada segura</span>
              </div>
              <div className="bg-warm-50/80 p-5 rounded-2xl border border-warm-200 shadow-sm flex items-center justify-center gap-3">
                <Globe className="w-5 h-5 text-brand-600 shrink-0" />
                <span className="font-medium text-slate-800 text-sm">Brasil e exterior</span>
              </div>
            </div>
          </div>
        </section>

        {/* 8. PERGUNTAS FREQUENTES */}
        <section id="faq" className="py-16 lg:py-24 bg-warm-50 border-b border-warm-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="space-y-3 text-center sm:text-left">
              <p className="kicker justify-center sm:justify-start">Dúvidas</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 font-bold">
                Perguntas frequentes
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Respostas para as principais dúvidas sobre consultas, reembolso e processo terapêutico.
              </p>
            </div>

            <FaqAccordion onlineOnly={true} />
          </div>
        </section>

        {/* 9. CHAMADA FINAL */}
        <section className="py-16 lg:py-24 bg-brand-700 text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight font-bold">
              Entre o caos e o cuidado, existe um lugar seguro.
            </h2>
            <p className="text-brand-100 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Dê o primeiro passo para resgatar seu equilíbrio emocional. Atendimento presencial no Centro de Ribeirão Preto e on-line para todo o Brasil e exterior.
            </p>
            <div className="pt-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-track="cta-final"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white hover:bg-warm-100 text-[#1F7A4C] border-2 border-[#1F7A4C] font-bold px-8 py-4 rounded-full text-base shadow-warm-lg transition-colors"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                <span>Ver horários disponíveis</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} onlineOnly={true} />
      <FloatingWhatsapp 
        whatsappNumber={settings.whatsapp_number} 
        whatsappMessage={defaultWaMessage} 
        avatarUrl={settings.bio_image_url || undefined}
      />
    </div>
  );
}
