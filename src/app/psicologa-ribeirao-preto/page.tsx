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
import {
  MessageCircle,
  Brain,
  Heart,
  Users,
  Sun,
  ShieldCheck,
  Activity,
  Clock,
  MapPin,
  ExternalLink,
  FileText,
  Shield,
  Video,
  CheckCircle2,
  CalendarCheck,
  Building2,
} from 'lucide-react';

const GoogleReviewsWidget = dynamic(() => import('@/components/GoogleReviewsWidget'), {
  loading: () => (
    <div className="py-8 text-center text-slate-400 text-sm">Carregando avaliações...</div>
  ),
});

const FaqAccordion = dynamic(() => import('@/components/FaqAccordion'));
const GoogleMapsFacade = dynamic(() => import('@/components/GoogleMapsFacade'));

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Psicóloga em Ribeirão Preto – Atendimento Presencial no Centro | Marina Falcão',
  description:
    'Procura psicólogo ou psicóloga em Ribeirão Preto? Atendimento presencial no Centro com a psicóloga Marina Falcão (CRP 06/162899). Particular, com nota fiscal para reembolso.',
  keywords: [
    'Psicóloga em Ribeirão Preto',
    'Psicóloga Ribeirão Preto',
    'Psicólogo em Ribeirão Preto',
    'Consultório de Psicologia Ribeirão Preto',
    'Psicoterapia Ribeirão Preto',
    'Marina Falcão',
    'Psicóloga Centro Ribeirão Preto',
    'Atendimento Presencial Ribeirão Preto',
    'Análise do Comportamento',
  ],
  authors: [{ name: 'Marina Falcão', url: 'https://www.marinafalcao.com.br' }],
  alternates: {
    canonical: 'https://www.marinafalcao.com.br/psicologa-ribeirao-preto',
  },
  openGraph: {
    title: 'Psicóloga em Ribeirão Preto – Atendimento Presencial no Centro | Marina Falcão',
    description:
      'Procura psicólogo ou psicóloga em Ribeirão Preto? Atendimento presencial no Centro com a psicóloga Marina Falcão (CRP 06/162899). Particular, com nota fiscal para reembolso.',
    url: 'https://www.marinafalcao.com.br/psicologa-ribeirao-preto',
    siteName: 'Psicóloga Marina Falcão',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    title: 'Psicóloga em Ribeirão Preto – Atendimento Presencial no Centro | Marina Falcão',
    description:
      'Procura psicólogo ou psicóloga em Ribeirão Preto? Atendimento presencial no Centro com a psicóloga Marina Falcão (CRP 06/162899). Particular, com nota fiscal para reembolso.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Psychologist',
  '@id': 'https://www.marinafalcao.com.br/psicologa-ribeirao-preto#psychologist',
  name: 'Marina Falcão - Psicóloga em Ribeirão Preto (Presencial no Centro)',
  image: 'https://www.marinafalcao.com.br/images/marina-hero-v2.jpg',
  url: 'https://www.marinafalcao.com.br/psicologa-ribeirao-preto',
  telephone: '+5516994244626',
  priceRange: '$$',
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
  openingHours: ['Mo-Fr 08:00-20:00', 'Sa 08:00-12:00'],
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
  areaServed: {
    '@type': 'City',
    name: 'Ribeirão Preto',
  },
  availableService: {
    '@type': 'MedicalTherapy',
    name: 'Psicoterapia Presencial para Adultos',
    description:
      'Atendimento psicológico presencial no Centro de Ribeirão Preto em sala reservada no Edifício Fortes Guimarães.',
  },
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
    text: 'Superação da exaustão profissional, perda de motivação e estresse ocupacional, com reconstrução de limites saudáveis.',
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

export default async function PsicologaRibeiraoPretoPage() {
  const [settings, reviewsData] = await Promise.all([
    getSiteSettings(),
    getReviewsData(),
  ]);

  const whatsappNumber = settings.whatsapp_number;
  const defaultWaMessage = 'Olá, Marina! Gostaria de agendar uma consulta de terapia.';
  const waUrl = getWhatsappUrl(
    whatsappNumber,
    'Olá, Marina! Gostaria de tirar dúvidas sobre o atendimento presencial em Ribeirão Preto.'
  );
  const waPresencialUrl = getWhatsappUrl(whatsappNumber, undefined, { presencial: true });
  const consultorioPhotoUrl = settings.consultorio_image_url || null;

  const ratingFormatted = reviewsData.rating
    ? reviewsData.rating.toFixed(1).replace('.', ',')
    : '5,0';

  return (
    <div className="min-h-screen bg-warm-50 text-slate-800 flex flex-col font-sans overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header settings={settings} isPresencialLanding={true} />

      <main className="flex-grow">
        {/* 1. HERO (Primeira dobra, foco presencial) — Sem animações de entrada para LCP ultra rápido */}
        <section className="relative overflow-hidden pt-24 lg:pt-28 pb-12 lg:pb-16 bg-warm-50">
          <div className="max-w-xl lg:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
            <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16 lg:items-center">
              
              {/* Imagem da Marina: Foto reduzida em WebP, LCP prioritário com width/height definidos */}
              <div className="order-1 lg:order-2 lg:col-span-5 w-full flex flex-col items-center justify-center">
                <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/5] max-h-[290px] sm:max-h-[320px] lg:max-h-[520px] max-w-sm sm:max-w-md lg:max-w-[420px] rounded-[2rem] overflow-hidden shadow-sm lg:shadow-xl bg-warm-200 border-2 lg:border-4 border-white">
                  <Image
                    src="/images/marina-hero-presencial.webp"
                    alt="Marina Falcão - Psicóloga em Ribeirão Preto (Presencial no Centro)"
                    fill
                    priority
                    fetchPriority="high"
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 420px"
                    className="object-cover object-[center_28%] lg:object-[center_25%]"
                  />
                </div>

                {/* Pílula de apresentação */}
                <div className="flex justify-center -mt-6 sm:-mt-7 lg:-mt-6 relative z-20">
                  <div className="inline-flex items-center gap-2 bg-white border border-warm-200/90 shadow-sm px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-slate-800">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <span>Olá, eu sou a Marina Falcão</span>
                  </div>
                </div>
              </div>

              {/* Conteúdo de Texto — H1 único e visível, subtítulo e botões */}
              <div className="order-2 lg:order-1 lg:col-span-7 space-y-4 text-center lg:text-left pt-3 lg:pt-0">
                <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#74532F] bg-warm-100 border border-warm-200/80 px-3.5 py-1 rounded-full">
                  <MapPin className="w-3.5 h-3.5 text-[#1F7A4C]" />
                  <span>Centro de Ribeirão Preto · Sala 310</span>
                </div>

                {/* H1 obrigatório e visível */}
                <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 leading-tight lg:leading-[1.15] tracking-tight">
                  Psicóloga em Ribeirão Preto – atendimento presencial no Centro
                </h1>

                {/* Subtítulo oficial */}
                <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Consultório no Centro de Ribeirão Preto. Psicoterapia para adultos com escuta acolhedora, ética e sigilo.
                </p>

                {/* Selos/infos curtas abaixo do texto */}
                <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-slate-700">
                  <span className="bg-white border border-warm-200 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 font-medium shadow-xs">
                    <span className="text-[#1F7A4C] font-bold">✓</span> CRP 06/162899
                  </span>
                  <span className="bg-white border border-warm-200 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 font-medium shadow-xs">
                    <span className="text-[#1F7A4C] font-bold">✓</span> Atendimento particular
                  </span>
                  <span className="bg-white border border-warm-200 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 font-medium shadow-xs">
                    <span className="text-[#1F7A4C] font-bold">✓</span> Sessões de 50 minutos
                  </span>
                </div>

                {/* Bloco de Botões: Principal (Agendar sessão presencial) + Secundário (Tirar dúvidas no WhatsApp) */}
                <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3">
                  <a
                    href={waPresencialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-wa-type="presencial"
                    data-track="cta-hero-presencial"
                    className="inline-flex items-center justify-center gap-2.5 bg-[#1F7A4C] hover:bg-[#185C3B] text-white font-semibold px-7 py-3.5 rounded-full text-base transition-colors shadow-warm-md hover:shadow-warm-lg pulse-ring-cta"
                  >
                    <MessageCircle className="w-5 h-5 shrink-0" />
                    <span>Agendar sessão presencial</span>
                  </a>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track="cta-hero-duvidas"
                    className="inline-flex items-center justify-center gap-2.5 bg-white hover:bg-warm-100 text-[#1F7A4C] border border-[#1F7A4C]/30 font-semibold px-6 py-3.5 rounded-full text-base transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-5 h-5 shrink-0 text-[#1F7A4C]" />
                    <span>Tirar dúvidas no WhatsApp</span>
                  </a>
                </div>

                <p className="text-[12px] text-slate-500 font-medium pt-1">
                  Resposta pela própria Marina · Sem compromisso
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* 2. ONDE FICA O CONSULTÓRIO */}
        <section id="consultorio" className="py-16 lg:py-24 bg-white border-y border-warm-200">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <Reveal animation="fade-up">
              <div className="max-w-2xl mx-auto text-center space-y-3">
                <div className="inline-flex items-center gap-2 text-brand-700 text-xs font-bold tracking-widest uppercase bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Localização e Consultório</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                  Onde fica o consultório
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  Ambiente reservado, confortável e silencioso no Centro de Ribeirão Preto, pensado para garantir sigilo e bem-estar durante suas sessões.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Card de Informações e Como Chegar */}
              <div className="lg:col-span-6 flex flex-col justify-between bg-warm-50/70 rounded-2xl p-6 sm:p-8 shadow-sm border border-warm-200/80 space-y-6">
                <div className="space-y-6">
                  {/* Endereço */}
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-brand-100 flex items-center justify-center text-brand-700 shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <h3 className="font-serif text-lg font-bold text-slate-900">Endereço</h3>
                      <p className="text-slate-700 text-sm leading-relaxed">
                        <strong>Edifício Fortes Guimarães</strong> – Rua Bernardino de Campos, 1001, sala 310, Centro, Ribeirão Preto/SP – CEP 14015-130.
                      </p>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Ponto de referência: região central de fácil acesso, próximo a vias principais, com portaria e estacionamentos nas proximidades.
                      </p>
                    </div>
                  </div>

                  {/* Horários */}
                  <div className="flex items-start gap-4 pt-4 border-t border-warm-200">
                    <div className="w-11 h-11 rounded-xl bg-brand-100 flex items-center justify-center text-brand-700 shrink-0 mt-0.5">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <h3 className="font-serif text-lg font-bold text-slate-900">Horários de atendimento</h3>
                      <p className="text-slate-700 text-sm leading-relaxed">
                        Segunda a sexta: das 8h às 20h <br />
                        Sábado: das 8h às 12h
                      </p>
                      <p className="text-xs text-slate-500">Atendimento com hora marcada.</p>
                    </div>
                  </div>

                  {/* Foto do consultório (se configurada) */}
                  {consultorioPhotoUrl && (
                    <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-warm-200 mt-4">
                      <Image
                        src={consultorioPhotoUrl}
                        alt="Consultório de psicologia da Marina Falcão no Edifício Fortes Guimarães"
                        fill
                        loading="lazy"
                        decoding="async"
                        sizes="(max-width: 1024px) 100vw, 600px"
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Botões de Ação: Como Chegar (Google Maps em nova aba) e Agendar */}
                <div className="pt-4 border-t border-warm-200 flex flex-col sm:flex-row items-stretch gap-3">
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Rua+Bernardino+de+Campos+1001+Ribeirao+Preto"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-white hover:bg-warm-100 text-slate-800 border border-warm-300 font-semibold px-5 py-3 rounded-full text-sm transition-colors shadow-xs"
                  >
                    <span>Como chegar (Google Maps)</span>
                    <ExternalLink className="w-4 h-4 text-slate-600" />
                  </a>

                  <a
                    href={waPresencialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-wa-type="presencial"
                    data-track="cta-consultorio-agendar"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-[#1F7A4C] hover:bg-[#185C3B] text-white font-semibold px-5 py-3 rounded-full text-sm transition-colors shadow-warm-md"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>Agendar presencial</span>
                  </a>
                </div>
              </div>

              {/* Fachada de Mapa Estático sob demanda (sem iframe na 1ª dobra) */}
              <div className="lg:col-span-6 bg-white rounded-2xl p-2 sm:p-3 shadow-sm border border-warm-200/80 flex flex-col min-h-[300px] sm:min-h-[380px]">
                <GoogleMapsFacade
                  title="Localização do consultório da psicóloga Marina Falcão - Edifício Fortes Guimarães, Ribeirão Preto"
                  addressText="Rua Bernardino de Campos, 1001, sala 310 · Edifício Fortes Guimarães · Centro, Ribeirão Preto/SP"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 3. AVALIAÇÕES DE PACIENTES */}
        <section id="avaliacoes" className="py-14 lg:py-20 bg-warm-50 border-b border-warm-200">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="max-w-2xl space-y-2 text-center sm:text-left">
              <p className="kicker justify-center sm:justify-start">Depoimentos</p>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-slate-900 font-bold">
                Avaliações de pacientes no Google e na Doctoralia
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Avaliação média <strong>★ {ratingFormatted}</strong> baseada em depoimentos reais de pessoas acompanhadas na clínica.
              </p>
            </div>

            <GoogleReviewsWidget initialData={reviewsData} />
          </div>
        </section>

        {/* 4. PARA QUEM É / ÁREAS DE ATUAÇÃO */}
        <section id="areas-de-atuacao" className="py-16 lg:py-24 bg-white border-b border-warm-200">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <Reveal animation="fade-up">
              <div className="max-w-3xl mx-auto text-center space-y-3">
                <p className="kicker justify-center">Para quem é</p>
                <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 font-bold">
                  Áreas de atuação na psicoterapia presencial
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  Se você procura um psicólogo ou uma psicóloga em Ribeirão Preto, o acompanhamento clínico oferece intervenções direcionadas para promover alívio do sofrimento emocional, autoconhecimento e construção de novos caminhos:
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {especialidades.map(({ icon: Icon, title, text }, idx) => (
                <Reveal key={title} animation="fade-up" delay={idx * 70}>
                  <div className="bg-warm-50/60 rounded-2xl p-6 sm:p-8 shadow-xs border border-warm-200/80 hover:shadow-md transition-shadow h-full flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center text-brand-700 mb-5 shrink-0">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">
                        {title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Botão de WhatsApp intermediário */}
            <div className="text-center pt-2">
              <a
                href={waPresencialUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-wa-type="presencial"
                data-track="cta-areas-atuacao"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#1F7A4C] hover:bg-[#185C3B] text-white font-semibold px-8 py-3.5 rounded-full text-base transition-colors shadow-warm-md hover:shadow-warm-lg"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                <span>Ver horários disponíveis</span>
              </a>
            </div>
          </div>
        </section>

        {/* 5. COMO FUNCIONA */}
        <section id="como-funciona" className="py-16 lg:py-24 bg-warm-50/70 border-b border-warm-200">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <Reveal animation="fade-up">
              <div className="max-w-2xl mx-auto text-center space-y-3">
                <p className="kicker justify-center">Como funciona</p>
                <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 font-bold">
                  Do primeiro contato ao acompanhamento
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  Um processo simples, ético e humano para você dar o primeiro passo em direção ao seu cuidado.
                </p>
              </div>
            </Reveal>

            <StepTimeline presencialOnly={true} />

            <div className="text-center pt-2">
              <a
                href={waPresencialUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-wa-type="presencial"
                data-track="cta-como-funciona-presencial"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#1F7A4C] hover:bg-[#185C3B] text-white font-semibold px-8 py-3.5 rounded-full text-base transition-colors shadow-warm-md hover:shadow-warm-lg"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                <span>Ver horários disponíveis</span>
              </a>
            </div>
          </div>
        </section>

        {/* 6. ATENDIMENTO PARTICULAR E REEMBOLSO (Seção nova e curta) */}
        <section id="reembolso" className="py-16 lg:py-20 bg-white border-b border-warm-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal animation="fade-up">
              <div className="bg-warm-50/90 border border-warm-200/90 rounded-3xl p-8 sm:p-10 shadow-xs space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-700 shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-brand-700 uppercase tracking-wider block">
                      Informações Financeiras
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                      Atendimento particular e reembolso
                    </h2>
                  </div>
                </div>

                <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
                  O atendimento é particular. Após cada sessão você recebe nota fiscal e, se precisar, relatório para solicitar reembolso ao seu plano de saúde. Os valores e as condições são informados diretamente pelo WhatsApp.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-warm-200">
                    <CheckCircle2 className="w-5 h-5 text-[#1F7A4C] shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">Nota fiscal em todas as sessões</h3>
                      <p className="text-xs text-slate-600">Documento fiscal completo com CRP para fins de reembolso e declaração de IRPF.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-warm-200">
                    <CheckCircle2 className="w-5 h-5 text-[#1F7A4C] shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">Relatório psicológico para o convênio</h3>
                      <p className="text-xs text-slate-600">Emissão de relatório com justificativa técnica caso a sua operadora solicite.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-warm-200/80">
                  <span className="text-xs text-slate-500 text-center sm:text-left">
                    Consulte as regras de reembolso do seu plano de saúde para verificar a cobertura.
                  </span>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track="cta-reembolso-duvidas"
                    className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#1F7A4C] hover:text-[#185C3B] underline underline-offset-4 decoration-[#1F7A4C]/40 hover:decoration-[#185C3B] transition-colors"
                  >
                    <span>Consultar condições pelo WhatsApp →</span>
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 7. PREFERE ON-LINE? (Bloco pequeno e secundário) */}
        <section id="online" className="py-12 lg:py-16 bg-warm-100/50 border-b border-warm-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider bg-white border border-warm-200 px-3 py-1 rounded-full">
              <Video className="w-3.5 h-3.5 text-brand-600" />
              <span>Modalidade Remota</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-slate-900">
              Prefere atendimento on-line?
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              Se você viaja com frequência ou prefere a comodidade de ser atendido(a) de casa, também realizo sessões por videochamada com a mesma dedicação e sigilo ético.
            </p>
            <div className="pt-1">
              <Link
                href="/psicologaonline"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800 underline decoration-brand-300 underline-offset-4 hover:decoration-brand-600 transition-colors"
              >
                <span>Conhecer a página de atendimento on-line</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* 8. PERGUNTAS FREQUENTES */}
        <section id="faq" className="py-16 lg:py-24 bg-white border-b border-warm-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="space-y-3 text-center sm:text-left">
              <p className="kicker justify-center sm:justify-start">Dúvidas</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 font-bold">
                Perguntas frequentes sobre o atendimento presencial
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Respostas claras sobre o consultório em Ribeirão Preto, reembolso, horários e processo terapêutico.
              </p>
            </div>

            <FaqAccordion presencialOnly={true} />
          </div>
        </section>

        {/* 9. CTA FINAL */}
        <section className="py-16 lg:py-24 bg-brand-700 text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight font-bold">
              Um espaço de escuta e acolhimento no Centro de Ribeirão Preto.
            </h2>
            <p className="text-brand-100 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Dê o primeiro passo para cuidar da sua saúde mental com suporte profissional ético e fundamentado na ciência. Agende sua sessão presencial com a psicóloga Marina Falcão.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={waPresencialUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-wa-type="presencial"
                data-track="cta-final-presencial"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white hover:bg-warm-100 text-[#1F7A4C] border-2 border-[#1F7A4C] font-bold px-8 py-4 rounded-full text-base shadow-warm-lg transition-colors"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                <span>Agendar sessão presencial</span>
              </a>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-track="cta-final-duvidas"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-brand-800/80 hover:bg-brand-800 text-white font-medium px-6 py-4 rounded-full text-base transition-colors"
              >
                <span>Tirar dúvidas primeiro</span>
              </a>
            </div>
            <p className="text-xs text-brand-200 pt-1">
              Atendimento particular com emissão de nota fiscal para reembolso.
            </p>
          </div>
        </section>
      </main>

      <Footer settings={settings} presencialOnly={true} />

      <FloatingWhatsapp
        whatsappNumber={settings.whatsapp_number}
        whatsappMessage={defaultWaMessage}
        avatarUrl={settings.bio_image_url || undefined}
      />
    </div>
  );
}

