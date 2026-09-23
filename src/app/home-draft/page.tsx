import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsapp from '@/components/FloatingWhatsapp';
import { getSiteSettings } from '@/lib/settings';
import FaqAccordion from '@/components/FaqAccordion';
import StepTimeline from '@/components/StepTimeline';
import GoogleReviewsWidget from '@/components/GoogleReviewsWidget';
import Reveal from '@/components/Reveal';
import TypewriterEffect from '@/components/TypewriterEffect';
import AboutSection from '@/components/AboutSection';
import Link from 'next/link';
import {
  MessageCircle,
  Brain,
  Heart,
  Users,
  Sun,
  ShieldCheck,
  CheckCircle2,
  Star,
  ArrowRight,
  Activity,
  MapPin,
  Video,
  FileText,
} from 'lucide-react';
import { query } from '@/lib/db';

async function getFeaturedPosts() {
  try {
    let posts = await query('SELECT * FROM posts WHERE published = 1 AND featured = 1 ORDER BY created_at DESC');
    if (!posts || posts.length === 0) {
      posts = await query('SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC LIMIT 3');
    }
    return posts || [];
  } catch (error) {
    return [];
  }
}

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
    title: 'Luto',
    text: 'Acolhimento para a dor de perdas afetivas, falecimentos e transições de vida. Um espaço para ressignificar sem pressa.',
  },
  {
    icon: Users,
    title: 'Relacionamentos, separações e conflitos afetivos',
    text: 'Melhoria da comunicação, resolução construtiva de conflitos e fortalecimento do vínculo e da parceria afetiva.',
  },
  {
    icon: Sun,
    title: 'Depressão & Apatia',
    text: 'Intervenções para resgatar a vitalidade, tratar o desânimo persistente e reorganizar a rotina com novos propósitos.',
  },
  {
    icon: ShieldCheck,
    title: 'TOC & Oscilações Emocionais',
    text: 'Manejo de pensamentos obsessivos, rituais compulsivos e sobrecarga emocional com técnicas comportamentais validadas.',
  },
];

export default async function HomePage() {
  const settings = await getSiteSettings();
  const latestPosts = await getFeaturedPosts();

  const whatsappNumber = settings.whatsapp_number || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5516997712697';
  const whatsappMessage = settings.whatsapp_message || 'Olá, Marina! Gostaria de saber mais sobre as sessões de terapia e agendar uma consulta.';
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-warm-50 text-slate-800 flex flex-col font-sans">
      <Header settings={settings} />

      <main className="flex-grow">
        {/* HERO */}
        <section className="relative overflow-hidden pt-8 pb-20 lg:pt-12 lg:pb-28 bg-warm-50">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-7 space-y-7 text-center lg:text-left lg:pt-2">
                <Reveal animation="fade-up" delay={100}>
                  <p className="kicker justify-center lg:justify-start">
                    Um espaço seguro de acolhimento
                  </p>
                </Reveal>
                <Reveal animation="fade-up" delay={200}>
                  <h1 className="font-serif text-5xl sm:text-6xl lg:text-[4rem] font-medium text-slate-900 leading-[1.12] tracking-tight">
                    Tudo começa na sua <TypewriterEffect />
                  </h1>
                </Reveal>

                <Reveal animation="fade-up" delay={300}>
                  <p className="text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                    Quando a mente desacelera, a vida volta a acontecer. Psicoterapia para ansiedade,
                    burnout, luto e relacionamentos, com escuta acolhedora e fundamento na Análise do
                    Comportamento.
                  </p>
                </Reveal>

                <Reveal animation="fade-up" delay={400}>
                  <div className="pt-1 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-brand-700 hover:bg-brand-800 text-white font-semibold px-7 py-3.5 rounded-full text-base transition-colors shadow-warm-md"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Agendar pelo WhatsApp</span>
                    </a>

                    <Link
                      href="#especialidades"
                      className="inline-flex items-center gap-1.5 text-slate-700 hover:text-brand-700 font-medium text-base transition-colors underline decoration-warm-400 underline-offset-4 hover:decoration-brand-400"
                    >
                      Conhecer especialidades
                    </Link>
                  </div>
                </Reveal>

                <Reveal animation="fade-in" delay={600}>
                  <div className="pt-6 border-t border-warm-200 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-2">
                      <Video className="w-4 h-4 text-brand-600" />
                      Atendimento on-line para todo o Brasil e exterior
                    </span>
                  </div>
                </Reveal>
              </div>

              {/* Cartão de apresentação */}
              <div className="lg:col-span-5 relative">
                <Reveal animation="slide-left" delay={400} className="mx-auto w-full max-w-[320px] sm:max-w-[360px]">
                  {/* Glow decorativo de fundo */}
                  <div className="absolute -inset-2 bg-gradient-to-tr from-brand-200/50 to-sage-200/50 rounded-[3rem] blur-2xl -z-10"></div>
                  
                  <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white shadow-2xl overflow-hidden p-5 sm:p-6 space-y-5">
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-tr from-brand-200 via-warm-100 to-sage-200 shadow-inner group">
                      <img 
                        src="/images/marina-profile.jpg" 
                        alt="Marina Falcão" 
                        className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                    
                    <div className="text-center pt-2">
                      <h3 className="font-serif text-2xl font-bold text-slate-900">Marina Falcão</h3>
                      <p className="text-xs font-bold text-brand-600 uppercase tracking-wider mt-1.5">
                        Psicóloga Clínica • CRP 06/162899
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* SOBRE MIM */}
        <AboutSection whatsappUrl={whatsappUrl} />

        {/* ESPECIALIDADES */}
        <section id="especialidades" className="py-20 lg:py-28 bg-warm-50/50 border-b border-warm-200">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal animation="fade-up">
              <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
                <p className="kicker justify-center">Especialidades</p>
                <h2 className="font-serif text-4xl sm:text-5xl text-slate-900 leading-tight">
                  Áreas de atuação
                </h2>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Cada demanda emocional pede um olhar atento e um plano terapêutico singular, sob a
                  perspectiva da Análise do Comportamento.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {especialidades.map(({ icon: Icon, title, text }, idx) => (
                <Reveal key={title} animation="fade-up" delay={idx * 100}>
                  <div className="group bg-white p-8 sm:p-10 rounded-[2rem] border border-warm-200 shadow-sm hover:shadow-warm-xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden h-full flex flex-col">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50/50 rounded-bl-full -z-10 group-hover:scale-125 transition-transform duration-700"></div>
                    <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-6 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-500 shadow-sm">
                      <Icon className="w-7 h-7" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-serif text-2xl text-slate-900 mb-3 group-hover:text-brand-800 transition-colors">{title}</h3>
                    <p className="text-slate-600 text-base leading-relaxed flex-1">{text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA O ATENDIMENTO */}
        <section className="py-20 lg:py-24 bg-warm-50">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            <Reveal animation="fade-up">
              <div className="max-w-2xl space-y-4">
                <p className="kicker">Como funciona</p>
                <h2 className="font-serif text-3xl sm:text-4xl text-slate-900">
                  Do primeiro contato ao acompanhamento
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  Cada etapa é pensada para o seu conforto do primeiro contato pelo WhatsApp até as
                  sessões semanais.
                </p>
              </div>
            </Reveal>

            <StepTimeline />
          </div>
        </section>

        {/* ABORDAGENS TEÓRICAS */}
        <section id="abordagens" className="py-20 lg:py-24 bg-white border-y border-warm-200">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              <Reveal animation="fade-up" className="lg:col-span-6 space-y-6">
                <p className="kicker">Fundamentação</p>
                <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 leading-tight">
                  Análise do Comportamento
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  A atuação clínica da Marina Falcão se fundamenta na{' '}
                  <strong className="font-semibold text-slate-800">Análise do Comportamento</strong>,
                  abordagem que compreende a mente e os hábitos a partir da relação entre emoção,
                  ambiente e história de vida.
                </p>

                <div className="pt-2">
                  <p className="text-sm font-semibold text-slate-900 mb-3">Formações Complementares:</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      'Luto e Tanatologia',
                      'Neuropsicologia',
                      'Saúde Mental',
                      'Burnout',
                      'Neurobiologia e psicofarmacologia dos transtornos mentais',
                      'Suicidologia',
                    ].map((item, idx) => (
                      <Reveal key={item} animation="fade-up" delay={idx * 100} as="li" className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-brand-600" />
                        <span className="text-slate-700 text-sm">{item}</span>
                      </Reveal>
                    ))}
                  </ul>
                </div>
              </Reveal>

              {/* Citação */}
              <Reveal animation="slide-left" className="lg:col-span-6">
                <figure className="bg-warm-100 rounded-2xl p-8 sm:p-12 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-100 rounded-bl-full opacity-50 transition-transform duration-700 group-hover:scale-110" />
                  <span
                    aria-hidden="true"
                    className="font-serif text-7xl text-brand-300 leading-none block mb-4 select-none relative z-10"
                  >
                    &ldquo;
                  </span>
                  <blockquote className="font-serif text-xl sm:text-2xl text-slate-800 leading-relaxed relative z-10">
                    O processo terapêutico é feito de pequenos movimentos: perceber, nomear,
                    compreender e transformar. Não se trata apenas de eliminar sintomas, mas de
                    resgatar o sentido de viver com presença.
                  </blockquote>
                  <figcaption className="pt-8 mt-8 border-t border-warm-300/60 flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
                    <div>
                      <p className="font-serif text-lg text-slate-900">Marina Falcão</p>
                      <p className="text-sm text-slate-500 mt-0.5">
                        CRP 06/162899 · Atendimento On-line
                      </p>
                    </div>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-brand-700 hover:bg-brand-800 px-5 py-2.5 rounded-full transition-all hover:scale-105 shadow-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Agendar consulta</span>
                    </a>
                  </figcaption>
                </figure>
              </Reveal>
            </div>
          </div>
        </section>

        {/* VÍDEOS */}
        {/* BLOG / ARTIGOS RECENTES */}
        {latestPosts && latestPosts.length > 0 && (
          <section id="blog" className="py-20 lg:py-24 bg-warm-50 overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10 lg:space-y-14">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="max-w-2xl space-y-4">
                  <p className="kicker">Conteúdo e Reflexões</p>
                  <h2 className="font-serif text-3xl sm:text-4xl text-slate-900">
                    Artigos em Destaque
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    Textos e reflexões sobre saúde mental, ansiedade, burnout e relacionamentos.
                  </p>
                </div>
                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center gap-2 font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 px-6 py-3 rounded-xl transition-colors shrink-0"
                >
                  <FileText className="w-4 h-4" />
                  Ver todos os artigos
                </Link>
              </div>

              <style dangerouslySetInnerHTML={{ __html: `
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
              `}} />

              <div className={`
                ${latestPosts.length > 3 
                  ? 'flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6' 
                  : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'}
              `}>
                {latestPosts.map((post: any) => (
                  <Link 
                    key={post.id} 
                    href={`/blog/${post.slug}`} 
                    className={`
                      group bg-white rounded-2xl border border-warm-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full
                      ${latestPosts.length > 3 ? 'min-w-[85vw] sm:min-w-[400px] snap-center shrink-0' : ''}
                    `}
                  >
                    {post.image_url ? (
                      <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/10] bg-gradient-to-tr from-warm-100 to-sage-50 flex items-center justify-center border-b border-warm-100">
                        <FileText className="w-12 h-12 text-warm-300" />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full">
                          {post.category || 'Artigo'}
                        </span>
                        <span className="text-xs font-medium text-slate-400">
                          {new Date(post.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-700 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-6 flex-1">
                        {post.summary}
                      </p>
                      <div className="mt-auto flex items-center gap-2 text-sm font-bold text-brand-600 group-hover:text-brand-700">
                        Ler artigo <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {latestPosts.length > 3 && (
                <div className="text-center text-sm text-slate-500 font-medium flex items-center justify-center gap-2">
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  Deslize para ver mais artigos
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </div>
          </section>
        )}

        {/* DEPOIMENTOS */}
        <section className="py-20 lg:py-24 bg-white border-y border-warm-200">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            <div className="max-w-2xl space-y-4">
              <p className="kicker">Depoimentos</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-slate-900">
                O que dizem os pacientes
              </h2>
            </div>

            <GoogleReviewsWidget />
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 lg:py-24 bg-warm-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="space-y-4">
              <p className="kicker">Dúvidas</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-slate-900">
                Perguntas frequentes
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Respostas para as principais dúvidas sobre consultas, reembolso e abordagem de
                atendimento.
              </p>
            </div>

            <FaqAccordion />
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-20 lg:py-28 bg-brand-900 text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-7">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight">
              Entre o caos e o cuidado, existe um lugar seguro.
            </h2>
            <p className="text-brand-100 text-lg max-w-xl mx-auto leading-relaxed">
              Dê o primeiro passo para resgatar seu equilíbrio emocional. Sessões on-line para todo o Brasil e exterior.
            </p>
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-white hover:bg-warm-100 text-brand-900 font-semibold px-8 py-4 rounded-full text-base shadow-warm-lg transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Agendar sessão pelo WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
      <FloatingWhatsapp 
        whatsappNumber={settings.whatsapp_number} 
        whatsappMessage={settings.whatsapp_message} 
        avatarUrl={settings.bio_image_url || undefined}
      />
    </div>
  );
}
