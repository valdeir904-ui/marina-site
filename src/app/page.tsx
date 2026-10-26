import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsapp from '@/components/FloatingWhatsapp';
import { getSiteSettings } from '@/lib/settings';
import { getWhatsappUrl } from '@/lib/whatsapp';
import { getReviewsData } from '@/lib/reviews';
import FaqAccordion from '@/components/FaqAccordion';
import StepTimeline from '@/components/StepTimeline';
import GoogleReviewsWidget from '@/components/GoogleReviewsWidget';
import Reveal from '@/components/Reveal';
import AboutSection from '@/components/AboutSection';
import HeroWave from '@/components/HeroWave';
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
} from 'lucide-react';

export const revalidate = 60; // Cache ISR com revalidação

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

export default async function HomePage() {
  const [settings, reviewsData] = await Promise.all([
    getSiteSettings(),
    getReviewsData(),
  ]);

  const whatsappNumber = settings.whatsapp_number;
  // Mensagem padrão centralizada (se o visitante vier do Google Ads, ela é substituída automaticamente)
  const defaultWaMessage = 'Olá, Marina! Gostaria de agendar uma consulta de terapia.';
  const waUrl = getWhatsappUrl(whatsappNumber, defaultWaMessage);

  const ratingFormatted = reviewsData.rating ? reviewsData.rating.toFixed(1).replace('.', ',') : '5,0';

  return (
    <div className="min-h-screen bg-warm-50 text-slate-800 flex flex-col font-sans overflow-x-hidden">
      <Header settings={settings} />

      <main className="flex-grow">
        {/* 1. HERO - Otimizado para celular (cabe na 1ª tela sem rolar) */}
        <section className="relative overflow-hidden pt-20 lg:pt-24 pb-12 lg:pb-20">
          <HeroWave />
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-4 sm:pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              
              {/* Coluna de Texto e Ação */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-brand-100/70 text-brand-800 text-[11px] sm:text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mx-auto lg:mx-0">
                  <span>PSICOTERAPIA ON-LINE · TODO O BRASIL</span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-[1.18] tracking-tight">
                  Psicóloga on-line para adultos, por videochamada.
                </h1>

                <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Sou Marina Falcão, psicóloga (CRP 06/162899). Atendo adultos em todo o Brasil e no exterior, com escuta acolhedora, ética e sigilo, a partir da Análise do Comportamento.
                </p>

                {/* Bloco de Botão Principal + Link Secundário */}
                <div className="pt-1 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track="cta-hero"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-brand-700 hover:bg-brand-800 text-white font-semibold px-6 py-3.5 rounded-full text-base transition-colors shadow-warm-md hover:shadow-warm-lg"
                  >
                    <MessageCircle className="w-5 h-5 shrink-0" />
                    <span>Quero agendar minha primeira sessão</span>
                  </a>

                  <Link
                    href="#especialidades"
                    className="inline-flex items-center gap-1 text-slate-600 hover:text-brand-700 font-medium text-xs sm:text-sm transition-colors underline decoration-warm-400 underline-offset-4 hover:decoration-brand-400 py-1"
                  >
                    Conhecer especialidades
                  </Link>
                </div>

                {/* Selos Curtos Abaixo do Botão */}
                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-x-2.5 gap-y-1.5 text-xs text-slate-600 font-medium">
                  <span className="bg-white/80 border border-warm-200 px-2.5 py-1 rounded-full">
                    CRP 06/162899
                  </span>
                  <span className="text-slate-300 hidden sm:inline">·</span>
                  <span className="bg-white/80 border border-warm-200 px-2.5 py-1 rounded-full">
                    Desde 2022
                  </span>
                  <span className="text-slate-300 hidden sm:inline">·</span>
                  <span className="bg-white/80 border border-warm-200 px-2.5 py-1 rounded-full">
                    Sessões de 50 min
                  </span>
                  <span className="text-slate-300 hidden sm:inline">·</span>
                  <span className="bg-white/80 border border-warm-200 px-2.5 py-1 rounded-full text-amber-700 font-semibold inline-flex items-center gap-1">
                    ★ {ratingFormatted} no Google
                  </span>
                </div>
              </div>

              {/* Coluna de Imagem da Marina */}
              <div className="lg:col-span-5 relative mt-4 lg:mt-0">
                <div className="mx-auto w-full max-w-[280px] sm:max-w-[340px]">
                  <div className="absolute -inset-2 bg-gradient-to-tr from-brand-200/50 to-sage-200/50 rounded-[2.5rem] blur-xl -z-10"></div>
                  
                  <div className="bg-white/85 backdrop-blur-md rounded-[2rem] border border-white shadow-xl overflow-hidden p-4 sm:p-5 space-y-3 sm:space-y-4">
                    <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-tr from-brand-200 via-warm-100 to-sage-200">
                      <Image 
                        src="/images/marina-hero-v2.jpg" 
                        alt="Marina Falcão - Psicóloga On-line" 
                        fill
                        priority
                        fetchPriority="high"
                        sizes="(max-width: 768px) 280px, 340px"
                        className="object-cover object-[center_20%]"
                      />
                    </div>
                    
                    <div className="text-center pt-1">
                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">Marina Falcão</h2>
                      <p className="text-[11px] font-bold text-brand-600 uppercase tracking-wider mt-1">
                        Psicóloga Clínica • CRP 06/162899
                      </p>
                    </div>
                  </div>
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

            <GoogleReviewsWidget initialData={reviewsData} />
          </div>
        </section>

        {/* 3. SOBRE MIM - Com conteúdo integrado de A Ciência da Mente */}
        <AboutSection />

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
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-brand-700 hover:bg-brand-800 text-white font-semibold px-8 py-3.5 rounded-full text-base transition-colors shadow-warm-md hover:shadow-warm-lg"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                <span>Quero agendar minha primeira sessão</span>
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

            <StepTimeline />

            {/* Botão de WhatsApp #3 (depois de Como funciona) */}
            <div className="text-center pt-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-track="cta-como-funciona"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-brand-700 hover:bg-brand-800 text-white font-semibold px-8 py-3.5 rounded-full text-base transition-colors shadow-warm-md hover:shadow-warm-lg"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                <span>Quero agendar minha primeira sessão</span>
              </a>
            </div>
          </div>
        </section>

        {/* 6. NOVA SEÇÃO: ATENDIMENTO ON-LINE */}
        <section id="atendimento" className="py-16 lg:py-20 bg-warm-100/60 border-b border-warm-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <Reveal animation="fade-up">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-brand-700 text-xs font-bold tracking-widest uppercase bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
                  <Video className="w-3.5 h-3.5" />
                  <span>Atendimento On-line</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                  De qualquer cidade, no conforto do seu espaço.
                </h2>
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                  As sessões acontecem por videochamada, com a mesma qualidade e o mesmo sigilo do atendimento presencial. Atendo pessoas em todo o Brasil e brasileiros no exterior, em português.
                </p>
              </div>
            </Reveal>

            {/* Três itens curtos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-white p-5 rounded-2xl border border-warm-200 shadow-sm flex items-center justify-center gap-3">
                <Clock className="w-5 h-5 text-brand-600 shrink-0" />
                <span className="font-medium text-slate-800 text-sm">Sessões de 50 minutos</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-warm-200 shadow-sm flex items-center justify-center gap-3">
                <Lock className="w-5 h-5 text-brand-600 shrink-0" />
                <span className="font-medium text-slate-800 text-sm">Videochamada segura</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-warm-200 shadow-sm flex items-center justify-center gap-3">
                <Globe className="w-5 h-5 text-brand-600 shrink-0" />
                <span className="font-medium text-slate-800 text-sm">Brasil e exterior</span>
              </div>
            </div>
          </div>
        </section>

        {/* 7. PERGUNTAS FREQUENTES */}
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

            <FaqAccordion />
          </div>
        </section>

        {/* 8. CHAMADA FINAL */}
        <section className="py-16 lg:py-24 bg-brand-700 text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight font-bold">
              Entre o caos e o cuidado, existe um lugar seguro.
            </h2>
            <p className="text-brand-100 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Dê o primeiro passo para resgatar seu equilíbrio emocional. Atendimento 100% on-line para todo o Brasil e exterior.
            </p>
            <div className="pt-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-track="cta-final"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white hover:bg-warm-100 text-brand-700 font-bold px-8 py-4 rounded-full text-base shadow-warm-lg transition-colors"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                <span>Quero agendar minha primeira sessão</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
      <FloatingWhatsapp 
        whatsappNumber={settings.whatsapp_number} 
        whatsappMessage={defaultWaMessage} 
        avatarUrl={settings.bio_image_url || undefined}
      />
    </div>
  );
}
